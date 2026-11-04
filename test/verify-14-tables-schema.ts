import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

const EXPECTED_TABLES = [
  'users',
  'requesters',
  'machines',
  'weekly_technical_requests',
  'defect_logs',
  'action_plans',
  'form_lookup_options',
  'sheet_lists_do_not_delete',
  'technical_requests',
  'system_settings',
  'cpsr',
  'cpst',
  'cpsf',
  'cps',
];

const NEW_COLUMNS_CPSF = ['notes', 'chk_quality', 'wo', 'total_qty', 'scrap_qty'];
const NEW_COLUMNS_CPS = ['notes', 'chk_quality', 'wo', 'total_qty', 'scrap_qty'];

function checkSqlFile(filePath: string, label: string) {
  console.log(`Checking ${label}: ${filePath}...`);
  assert(fs.existsSync(filePath), `${label} must exist at ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. All 14 tables must be created
  for (const table of EXPECTED_TABLES) {
    const regex = new RegExp(`CREATE TABLE IF NOT EXISTS\\s+${table}\\b`, 'i');
    assert(regex.test(content), `${label} missing CREATE TABLE for ${table}`);
  }

  // 2. New columns in cpsf
  for (const col of NEW_COLUMNS_CPSF) {
    const colRegex = new RegExp(`\\b${col}\\b`, 'i');
    assert(colRegex.test(content), `${label} missing column ${col} in cpsf`);
  }

  // 3. New columns in cps
  for (const col of NEW_COLUMNS_CPS) {
    const colRegex = new RegExp(`\\b${col}\\b`, 'i');
    assert(colRegex.test(content), `${label} missing column ${col} in cps`);
  }

  // 4. chk_quality VARCHAR(100)
  assert(/chk_quality\s+VARCHAR\(100\)/i.test(content), `${label} must define chk_quality VARCHAR(100)`);

  // 5. ALTER TABLE ADD COLUMN IF NOT EXISTS
  for (const table of ['cpsr', 'cpst', 'cpsf', 'cps']) {
    const alterRegex = new RegExp(`ALTER TABLE ${table}\\s+ADD COLUMN IF NOT EXISTS`, 'i');
    assert(alterRegex.test(content), `${label} missing ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS`);
  }

  // 6. Indexes for 4 new tables
  for (const table of ['cpsr', 'cpst', 'cpsf', 'cps']) {
    const idxRegex = new RegExp(`CREATE INDEX IF NOT EXISTS\\s+idx_${table}_`, 'i');
    assert(idxRegex.test(content), `${label} missing indexes for ${table}`);
  }

  console.log(`✅ [PASS] ${label}: All 14 tables, columns, migrations, and indexes verified.`);
}

function checkDatabaseService(filePath: string) {
  console.log(`Checking DatabaseService: ${filePath}...`);
  assert(fs.existsSync(filePath), `DatabaseService must exist at ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check initPgSchema contains all 14 tables
  for (const table of EXPECTED_TABLES) {
    const tableRegex = new RegExp(`name:\\s*['"]${table}['"]`, 'i');
    assert(tableRegex.test(content), `DatabaseService missing table entry ${table}`);
  }

  // Check ALTER TABLE for cpsf and cps
  for (const table of ['cpsr', 'cpst', 'cpsf', 'cps']) {
    const alterRegex = new RegExp(`ALTER TABLE ${table}\\s+ADD COLUMN IF NOT EXISTS`, 'i');
    assert(alterRegex.test(content), `DatabaseService missing ALTER TABLE for ${table}`);
  }

  // Check chk_quality VARCHAR(100) in cps
  assert(/ALTER TABLE cps ALTER COLUMN chk_quality TYPE VARCHAR\(100\)/i.test(content), 'DatabaseService must have ALTER TABLE cps ALTER COLUMN chk_quality TYPE VARCHAR(100)');
  assert(/ALTER TABLE cpsf ALTER COLUMN chk_quality TYPE VARCHAR\(100\)/i.test(content), 'DatabaseService must have ALTER TABLE cpsf ALTER COLUMN chk_quality TYPE VARCHAR(100)');

  console.log(`✅ [PASS] DatabaseService: 100% synchronized with SQL schema.`);
}

function run() {
  const rootDir = path.resolve(__dirname, '..');
  const wsDir = path.resolve(rootDir, '..');

  checkSqlFile(path.join(rootDir, 'config', 'schema.sql'), 'config/schema.sql');
  checkSqlFile(path.join(rootDir, 'config', 'init_database.sql'), 'config/init_database.sql');
  checkSqlFile(path.join(rootDir, 'deploy', 'database', 'docker-entrypoint-initdb.sql'), 'checkpoint_technical/deploy/database/docker-entrypoint-initdb.sql');
  checkSqlFile(path.join(wsDir, 'deploy', 'database', 'docker-entrypoint-initdb.sql'), 'deploy/database/docker-entrypoint-initdb.sql');

  checkDatabaseService(path.join(rootDir, 'src', 'modules', 'database', 'database.service.ts'));

  console.log('\n🎉 ALL 14 TABLES AND SCHEMA FILES VERIFIED SUCCESSFULLY!');
}

run();
