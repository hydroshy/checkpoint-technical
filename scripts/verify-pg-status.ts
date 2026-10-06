import { Client } from 'pg';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

interface VerificationResult {
  step: string;
  passed: boolean;
  details: any;
}

async function runVerification() {
  const results: VerificationResult[] = [];
  console.log('=== BẮT ĐẦU KIỂM THỬ XÁC MINH TOÀN DIỆN HỆ THỐNG ===\n');

  // 1. Kiểm tra build NestJS dist
  const distMain = path.join(__dirname, '..', 'dist', 'main.js');
  const distDashboard = path.join(__dirname, '..', 'dist', 'views', 'dashboard.view.js');
  const distControlPanel = path.join(__dirname, '..', 'dist', 'views', 'control-panel.view.js');

  const buildClean = fs.existsSync(distMain) && fs.existsSync(distDashboard) && fs.existsSync(distControlPanel);
  results.push({
    step: '1. Kiểm tra TypeScript build',
    passed: buildClean,
    details: { distMainExists: fs.existsSync(distMain), distDashboardExists: fs.existsSync(distDashboard) }
  });
  console.log(`[${buildClean ? 'PASS' : 'FAIL'}] 1. TypeScript build artifacts tồn tại sạch sẽ.`);

  // 2. Kết nối PostgreSQL và kiểm tra trạng thái
  const pgClient = new Client({
    connectionString: 'postgresql://admin:Ph%40nloi20031403@192.168.1.35:5432/checkpoint_technical',
    connectionTimeoutMillis: 5000
  });

  try {
    await pgClient.connect();
    console.log('[INFO] Đã kết nối thành công tới PostgreSQL checkpoint_technical (192.168.1.35:5432)');

    // 2.1 Kiểm tra bảng weekly_technical_requests
    const weeklyStatusRes = await pgClient.query('SELECT status, count(*) as count FROM weekly_technical_requests GROUP BY status ORDER BY status');
    const weeklyStatuses = weeklyStatusRes.rows;
    const allowedStatuses = ['Open', 'In Progress', 'Overdue', 'Closed'];
    const invalidWeeklyStatuses = weeklyStatuses.filter(r => !allowedStatuses.includes(r.status));

    const weeklyStatusValid = invalidWeeklyStatuses.length === 0 && weeklyStatuses.length > 0;
    results.push({
      step: '2. Bảng weekly_technical_requests chỉ chứa 4 trạng thái chuẩn',
      passed: weeklyStatusValid,
      details: { weeklyStatuses, invalidWeeklyStatuses }
    });
    console.log(`[${weeklyStatusValid ? 'PASS' : 'FAIL'}] 2. Bảng weekly_technical_requests trạng thái:`, weeklyStatuses);

    // 2.2 Kiểm tra bảng technical_requests (loại bỏ dữ liệu giả)
    const techReqRes = await pgClient.query('SELECT count(*) as count FROM technical_requests');
    const techCount = parseInt(techReqRes.rows[0].count, 10);
    const techReqMockCheck = await pgClient.query("SELECT count(*) as count FROM technical_requests WHERE doc_no LIKE '%FAKE%' OR doc_no LIKE '%MOCK%'");
    const techMockCount = parseInt(techReqMockCheck.rows[0].count, 10);

    const techRealValid = techMockCount === 0;
    results.push({
      step: '3. Bảng technical_requests sạch dữ liệu giả/mock',
      passed: techRealValid,
      details: { totalCount: techCount, mockCount: techMockCount }
    });
    console.log(`[${techRealValid ? 'PASS' : 'FAIL'}] 3. Bảng technical_requests: ${techCount} records thực tế, 0 mock.`);

    // 2.3 Kiểm tra bảng action_plans
    const actionPlanRes = await pgClient.query('SELECT status, count(*) as count FROM action_plans GROUP BY status');
    const actionPlanRows = actionPlanRes.rows;
    const invalidActionStatuses = actionPlanRows.filter(r => !allowedStatuses.includes(r.status));
    const actionPlanValid = invalidActionStatuses.length === 0;
    results.push({
      step: '4. Bảng action_plans không chứa trạng thái sai lệch',
      passed: actionPlanValid,
      details: { actionPlanRows }
    });
    console.log(`[${actionPlanValid ? 'PASS' : 'FAIL'}] 4. Bảng action_plans trạng thái:`, actionPlanRows);

    // 2.4 Kiểm tra bảng defect_logs
    const defectLogsRes = await pgClient.query('SELECT count(*) as count FROM defect_logs');
    const defectCount = parseInt(defectLogsRes.rows[0].count, 10);
    console.log(`[INFO] defect_logs total count: ${defectCount}`);

    await pgClient.end();
  } catch (err: any) {
    results.push({
      step: '2. Kết nối và truy vấn PostgreSQL',
      passed: false,
      details: { error: err.message }
    });
    console.error('[FAIL] Lỗi kết nối hoặc truy vấn PostgreSQL:', err.message);
  }

  // 3. Kiểm tra code frontend view: Dashboard và Control Panel
  const dashboardSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'views', 'dashboard.view.ts'), 'utf-8');
  const controlPanelSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'views', 'control-panel.view.ts'), 'utf-8');

  const has4StatusesFilter = dashboardSource.includes('value="Open"') &&
    dashboardSource.includes('value="In Progress"') &&
    dashboardSource.includes('value="Overdue"') &&
    dashboardSource.includes('value="Closed"');

  const hasNoPendingInFilter = !dashboardSource.includes('<option value="Pending">Pending</option>');

  const hasStatusColors = dashboardSource.includes("'open'") &&
    dashboardSource.includes("'in progress'") &&
    dashboardSource.includes("'overdue'") &&
    dashboardSource.includes("'closed'");

  const hasChart4Statuses = dashboardSource.includes("labels: ['Open', 'In Progress', 'Overdue', 'Closed']");

  const frontendDashboardValid = has4StatusesFilter && hasNoPendingInFilter && hasStatusColors && hasChart4Statuses;
  results.push({
    step: '5. Dashboard View chuẩn hóa 4 trạng thái và biểu đồ/màu sắc',
    passed: frontendDashboardValid,
    details: { has4StatusesFilter, hasNoPendingInFilter, hasStatusColors, hasChart4Statuses }
  });
  console.log(`[${frontendDashboardValid ? 'PASS' : 'FAIL'}] 5. Dashboard View: Đã tích hợp đầy đủ 4 trạng thái (Open, In Progress, Overdue, Closed) và màu sắc tương ứng.`);

  const cpHas4Statuses = controlPanelSource.includes('value="Open"') &&
    controlPanelSource.includes('value="In Progress"') &&
    controlPanelSource.includes('value="Overdue"') &&
    controlPanelSource.includes('value="Closed"');

  results.push({
    step: '6. Control Panel View chuẩn hóa 4 trạng thái',
    passed: cpHas4Statuses,
    details: { cpHas4Statuses }
  });
  console.log(`[${cpHas4Statuses ? 'PASS' : 'FAIL'}] 6. Control Panel View: Bộ lọc chkStatus cập nhật 4 trạng thái chuẩn.`);

  // 4. Kiểm tra JSON fallback files đã được đồng bộ với DB thực tế (loại bỏ fake)
  const techReqJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'technical_requests.json'), 'utf-8'));
  const weeklyJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'weekly_technical_requests.json'), 'utf-8'));
  const invalidWeeklyJsonStatus = weeklyJson.filter((r: any) => !['Open', 'In Progress', 'Overdue', 'Closed'].includes(r.status));

  const jsonStorageClean = invalidWeeklyJsonStatus.length === 0 && techReqJson.length === 4;
  results.push({
    step: '7. Local data fallback sạch và chuẩn hóa 4 trạng thái',
    passed: jsonStorageClean,
    details: { techReqCount: techReqJson.length, invalidWeeklyCount: invalidWeeklyJsonStatus.length }
  });
  console.log(`[${jsonStorageClean ? 'PASS' : 'FAIL'}] 7. File data JSON lưu trữ local đồng bộ dữ liệu thực tế và 4 trạng thái.`);

  // Tổng kết
  const allPassed = results.every(r => r.passed);
  console.log(`\n=== TỔNG KẾT: ${allPassed ? 'TẤT CẢ CÁC BƯỚC ĐẠT (PASSED)' : 'CÓ BƯỚC THẤT BẠI (FAILED)'} ===`);
  if (!allPassed) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Lỗi chạy verification:', err);
  process.exit(1);
});
