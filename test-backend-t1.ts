import * as dotenv from 'dotenv';
dotenv.config();
import * as assert from 'assert';
import { Pool } from 'pg';
import { DatabaseService, VALID_TICKET_STATUSES, normalizeTicketStatus } from './src/modules/database/database.service';

async function verifyT1() {
  console.log('=== VERIFYING TASK T1 (Backend & PostgreSQL Clean Real Data) ===');

  // 1. Direct PostgreSQL connection & table clean check
  console.log('1. Direct PostgreSQL Verification:');
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || '192.168.1.35',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'Ph@nloi20031403',
    database: process.env.POSTGRES_DB || 'checkpoint_technical',
  });

  // 1.1 defect_logs clean
  const defectRes = await pool.query('SELECT count(*) FROM defect_logs');
  const defectCount = parseInt(defectRes.rows[0].count, 10);
  console.log(`   ✓ defect_logs count: ${defectCount} (fake data eliminated)`);
  assert.strictEqual(defectCount, 0, 'defect_logs must have 0 fake records');

  // 1.2 action_plans clean
  const actionRes = await pool.query('SELECT count(*) FROM action_plans');
  const actionCount = parseInt(actionRes.rows[0].count, 10);
  console.log(`   ✓ action_plans count: ${actionCount} (fake data eliminated)`);
  assert.strictEqual(actionCount, 0, 'action_plans must have 0 fake records');

  // 1.3 technical_requests clean of fake/junk entries
  const fakeTechRes = await pool.query(
    "SELECT count(*) FROM technical_requests WHERE doc_no = 'CPS-20261004-546' OR problem = '123' OR doc_no = 'REQ-20261003-1945'"
  );
  const fakeTechCount = parseInt(fakeTechRes.rows[0].count, 10);
  console.log(`   ✓ technical_requests fake entries: ${fakeTechCount}`);
  assert.strictEqual(fakeTechCount, 0, 'technical_requests must not have fake entries');

  // 1.4 weekly_technical_requests clean of empty/invalid entries
  const invalidWtrRes = await pool.query(
    "SELECT count(*) FROM weekly_technical_requests WHERE id IN ('wreq-27', 'wreq-28') OR request_type = '' OR status = '' OR status IS NULL"
  );
  const invalidWtrCount = parseInt(invalidWtrRes.rows[0].count, 10);
  console.log(`   ✓ weekly_technical_requests empty/invalid entries: ${invalidWtrCount}`);
  assert.strictEqual(invalidWtrCount, 0, 'weekly_technical_requests must have 0 empty/invalid records');

  // 2. Standardized 4 statuses in weekly_technical_requests
  console.log('2. Standardized 4 Statuses Verification:');
  const statusRes = await pool.query('SELECT status, count(*) FROM weekly_technical_requests GROUP BY status ORDER BY status');
  const statusCounts: Record<string, number> = {};
  for (const r of statusRes.rows) {
    statusCounts[r.status] = parseInt(r.count, 10);
  }
  console.log('   ✓ Status distribution in PostgreSQL:', statusCounts);

  const distinctStatuses = Object.keys(statusCounts);
  for (const s of distinctStatuses) {
    assert.ok(
      (VALID_TICKET_STATUSES as readonly string[]).includes(s),
      `Status "${s}" is not one of 4 allowed statuses: ${VALID_TICKET_STATUSES.join(', ')}`
    );
  }

  // All 4 statuses must be present
  assert.ok(statusCounts['Open'] > 0, 'Open status must exist');
  assert.ok(statusCounts['In Progress'] > 0, 'In Progress status must exist');
  assert.ok(statusCounts['Overdue'] > 0, 'Overdue status must exist');
  assert.ok(statusCounts['Closed'] > 0, 'Closed status must exist');
  console.log('   ✓ All 4 statuses (Open, In Progress, Overdue, Closed) are properly represented');

  // 2.2 Verify constraint enforcement
  console.log('2.1 Checking Database Constraint Enforcement:');
  let constraintFailed = false;
  try {
    await pool.query(
      "INSERT INTO weekly_technical_requests (id, request_id, request_type, item_equipment, severity, status, reported_by) VALUES ('test-invalid', 'TEST', 'Test', 'PFL1', 'Low', 'InvalidStatus', 'tester')"
    );
  } catch (err: any) {
    constraintFailed = true;
    console.log('   ✓ Inserting invalid status rejected by PostgreSQL check constraint:', err.message);
  }
  assert.ok(constraintFailed, 'Database must reject invalid ticket statuses via check constraint');

  await pool.end();

  // 3. DatabaseService Integration Verification
  console.log('3. DatabaseService Verification:');
  const db = new DatabaseService();
  await db.onModuleInit();

  assert.strictEqual(db.isPostgresConnected(), true, 'DatabaseService must be connected to PostgreSQL');
  const info = db.getDatabaseInfo();
  assert.strictEqual(info.type, 'postgresql', 'Database type must be postgresql');
  console.log(`   ✓ DatabaseService connected to PostgreSQL (${info.host}:${info.port}/${info.database})`);

  // Verify DatabaseService cache matches PostgreSQL data (no re-seeding of mock data)
  assert.strictEqual(db.getDefectLogs().length, 0, 'DatabaseService defect logs cache must be 0 (no mock seed)');
  assert.strictEqual(db.getActionPlans().length, 0, 'DatabaseService action plans cache must be 0 (no mock seed)');

  const weeklyReqs = db.getWeeklyRequests();
  assert.strictEqual(weeklyReqs.length, 26, 'DatabaseService weekly requests must have 26 real items');
  for (const w of weeklyReqs) {
    assert.ok(
      (VALID_TICKET_STATUSES as readonly string[]).includes(w.status as any),
      `DatabaseService weekly request ${w.id} has invalid status ${w.status}`
    );
  }
  console.log(`   ✓ DatabaseService verified 26 weekly requests with 100% normalized statuses`);

  // Test status normalization function
  assert.strictEqual(normalizeTicketStatus('open'), 'Open');
  assert.strictEqual(normalizeTicketStatus('IN PROGRESS'), 'In Progress');
  assert.strictEqual(normalizeTicketStatus('overdue'), 'Overdue');
  assert.strictEqual(normalizeTicketStatus('closed'), 'Closed');
  assert.strictEqual(normalizeTicketStatus('done'), 'Closed');
  assert.strictEqual(normalizeTicketStatus('completed'), 'Closed');
  assert.strictEqual(normalizeTicketStatus(''), 'Open');
  assert.strictEqual(normalizeTicketStatus(null), 'Open');
  console.log('   ✓ normalizeTicketStatus helper unit tests passed');

  await db.onModuleDestroy();
  console.log('\n🎉 ALL TASK T1 VERIFICATION CHECKS PASSED 100%!');
}

verifyT1().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
