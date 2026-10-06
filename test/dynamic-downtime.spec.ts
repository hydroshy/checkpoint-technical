import * as assert from 'assert';
import {
  parseCpsStartTime,
  computeCpsDowntime,
  computeCpsStatus,
  DatabaseService,
} from '../src/modules/database/database.service';
import { CpsService } from '../src/modules/cps/services/cps.service';

async function runDynamicDowntimeTests() {
  console.log('⏱️ [DYNAMIC DOWNTIME] Bắt đầu kiểm thử tính toán downtime động theo thời gian thực...\n');

  // =========================================================================
  // 1. Kiểm thử parseCpsStartTime
  // =========================================================================
  console.log('--- 1. Kiểm tra parseCpsStartTime ---');
  const tReq = parseCpsStartTime({ reqDate: '2026-10-06', reqTime: '08:30' });
  assert.ok(tReq !== null, 'Phải parse được reqDate + reqTime');
  assert.strictEqual(new Date(tReq!).toISOString(), '2026-10-06T08:30:00.000Z');

  const tCpsr = parseCpsStartTime({ cpsr: { reqDate: '2026-10-06', reqTime: '09:00', createdAt: '2026-10-06T09:00:00.000Z' } });
  assert.ok(tCpsr !== null, 'Phải fallback sang cpsr.reqDate + reqTime');
  assert.strictEqual(new Date(tCpsr!).toISOString(), '2026-10-06T09:00:00.000Z');

  const tCreated = parseCpsStartTime({ createdAt: '2026-10-06T10:15:00.000Z' });
  assert.ok(tCreated !== null, 'Phải fallback sang createdAt khi không có reqTime');
  assert.strictEqual(new Date(tCreated!).toISOString(), '2026-10-06T10:15:00.000Z');

  console.log('  ✅ [PASS] parseCpsStartTime hoạt động chính xác với mọi định dạng');

  // =========================================================================
  // 2. Kiểm thử tính downtime động theo thời gian thực (đang chạy: TO_ASSIGN / IN_PROGRESS)
  // =========================================================================
  console.log('\n--- 2. Kiểm tra tính downtime động theo thời gian thực khi đang chạy ---');
  const now = Date.now();
  const start35m = new Date(now - 35 * 60000).toISOString();

  const runningDowntime = computeCpsDowntime({
    status: 'IN_PROGRESS',
    createdAt: start35m,
    downtime: 0,
  });
  assert.strictEqual(runningDowntime, 35, 'Downtime phải tính động từ thời điểm bắt đầu đến hiện tại (35 phút)');

  const toAssignDowntime = computeCpsDowntime({
    status: 'TO_ASSIGN',
    createdAt: new Date(now - 20 * 60000).toISOString(),
    downtime: 0,
  });
  assert.strictEqual(toAssignDowntime, 20, 'Downtime TO_ASSIGN phải tính động (20 phút)');

  // Khi có downtime cố định (ví dụ nhập tay trên CPST), giữ nguyên
  const fixedRunning = computeCpsDowntime({
    status: 'IN_PROGRESS',
    createdAt: start35m,
    downtime: 50,
  });
  assert.strictEqual(fixedRunning, 50, 'Phiếu có downtime cố định phải giữ nguyên giá trị cố định');

  console.log('  ✅ [PASS] Downtime động tăng theo thời gian thực (Date.now()) khi phiếu đang mở');

  // =========================================================================
  // 3. Kiểm thử dừng tính downtime khi OVER_DUE (tính đến deadline)
  // =========================================================================
  console.log('\n--- 3. Kiểm tra dừng tính downtime khi OVER_DUE (tính đến deadline) ---');
  const start60mAgo = new Date(now - 60 * 60000).toISOString();
  const deadline15mAgo = new Date(now - 15 * 60000).toISOString(); // Quá hạn 15 phút, hạn chót là sau khi tạo 45 phút

  const overdueStatus = computeCpsStatus({
    deadline: deadline15mAgo,
    assignedTo: 'Tech A',
  });
  assert.strictEqual(overdueStatus, 'OVER_DUE', 'Trạng thái phải là OVER_DUE khi vượt quá deadline');

  const overdueDowntime = computeCpsDowntime({
    status: 'OVER_DUE',
    createdAt: start60mAgo,
    deadline: deadline15mAgo,
    downtime: 0,
  });
  assert.strictEqual(overdueDowntime, 45, 'OVER_DUE phải dừng tính tại deadline (60 - 15 = 45 phút thay vì 60 phút)');

  console.log('  ✅ [PASS] Phiếu OVER_DUE dừng tính downtime tại deadline chuẩn xác');

  // =========================================================================
  // 4. Kiểm thử dừng tính downtime khi CLOSED (tính đến closedAt / downtime cố định)
  // =========================================================================
  console.log('\n--- 4. Kiểm tra dừng tính downtime khi CLOSED (tính đến closedAt / downtime cố định) ---');
  const start90mAgo = new Date(now - 90 * 60000).toISOString();
  const closed40mAgo = new Date(now - 40 * 60000).toISOString();

  // Đóng bằng closedAt
  const closedByTime = computeCpsDowntime({
    status: 'CLOSED',
    createdAt: start90mAgo,
    closedAt: closed40mAgo,
    downtime: 0,
  });
  assert.strictEqual(closedByTime, 50, 'CLOSED phải tính dừng tại closedAt (90 - 40 = 50 phút)');

  // Đóng có downtime cố định
  const closedFixed = computeCpsDowntime({
    status: 'CLOSED',
    createdAt: start90mAgo,
    closedAt: closed40mAgo,
    downtime: 30,
  });
  assert.strictEqual(closedFixed, 30, 'CLOSED có downtime cố định phải giữ 30 phút');

  console.log('  ✅ [PASS] Phiếu CLOSED dừng tính downtime tại closedAt / giữ downtime cố định');

  // =========================================================================
  // 5. Kiểm thử tích hợp DatabaseService & CpsService
  // =========================================================================
  console.log('\n--- 5. Kiểm thử tích hợp qua CpsService & DatabaseService ---');
  const dbService = new DatabaseService();
  const cpsService = new CpsService(dbService);

  // Tạo CPS mới từ CPSR
  const cpsrDoc = 'CPSR-DOWNTIME-TEST-001';
  const cpsrRecord = {
    id: 'test-cpsr-dt-1',
    docNo: cpsrDoc,
    reqDate: '2026-10-06',
    reqTime: '08:00',
    reqBy: 'Test Tester',
    printTech: 'Offset',
    machineName: 'Máy 1',
    problem: 'Sự cố thử nghiệm downtime',
    submittedAt: new Date(now - 25 * 60000).toISOString(),
    createdAt: new Date(now - 25 * 60000).toISOString(),
    updatedAt: new Date(now - 25 * 60000).toISOString(),
  };
  await dbService.addCpsr(cpsrRecord);

  const cps = await cpsService.createCps({
    cpsrDocNo: cpsrDoc,
    cpsrId: cpsrRecord.id,
  });

  assert.ok(cps, 'Tạo CPS thành công');
  assert.strictEqual(cps.status, 'TO_ASSIGN');

  // Đọc danh sách qua DatabaseService.getCpsList()
  const list = dbService.getCpsList();
  const found = list.find(c => c.docNo === cps.docNo);
  assert.ok(found, 'Tìm thấy CPS trong danh sách');
  assert.ok(found!.downtime !== undefined && found!.downtime >= 0, 'Downtime phải được tính toán tự động');

  // Dọn dẹp
  await dbService.deleteCps(cps.id);
  await dbService.deleteCpsr(cpsrRecord.id);

  console.log('  ✅ [PASS] Tích hợp DatabaseService và CpsService hoạt động đồng bộ hoàn hảo');
  console.log('\n🎉 TOÀN BỘ KIỂM THỬ DYNAMIC DOWNTIME ĐẠT 100%!');
}

runDynamicDowntimeTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Kiểm thử thất bại:', err);
    process.exit(1);
  });
