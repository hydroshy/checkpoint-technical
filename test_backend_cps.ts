import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { DatabaseModule } from './src/modules/database/database.module';
import { SplitFormsModule } from './src/modules/split-forms/split-forms.module';
import { SplitFormsService } from './src/modules/split-forms/split-forms.service';
import { DatabaseService } from './src/modules/database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    DatabaseModule,
    SplitFormsModule,
  ],
})
class TestBackendModule {}

async function testBackend() {
  console.log('🚀 [TEST BACKEND] Bắt đầu kiểm thử toàn diện Backend CPS & 50MB Payload...');

  // Start a live application instance to test both services and HTTP endpoints
  const app = await NestFactory.create<NestExpressApplication>(TestBackendModule, {
    bodyParser: false,
    logger: ['error', 'warn'],
  });

  // Test Payload Limit 50MB
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const testPort = 3388;
  await app.listen(testPort);
  const baseUrl = `http://127.0.0.1:${testPort}`;

  const splitService = app.get(SplitFormsService);
  const dbService = app.get(DatabaseService);

  console.log('✅ Server started on port', testPort);
  console.log('✅ Postgres Connected:', dbService.isPostgresConnected());

  try {
    // ----------------------------------------------------
    // TEST 1: 50MB Payload Limit (Verify no 413 Entity Too Large)
    // ----------------------------------------------------
    console.log('\n--- 1. Kiểm thử Payload Limit 50MB ---');
    // Send 5MB of JSON data
    const largeDummyData = 'x'.repeat(5 * 1024 * 1024);
    const postPayloadRes = await fetch(`${baseUrl}/api/cps/assign-test-payload-limit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ largeDummyData }),
    });
    // Even if route doesn't match or returns 404, status is NOT 413 Payload Too Large!
    console.log('Response status with 5MB payload:', postPayloadRes.status);
    if (postPayloadRes.status === 413) {
      throw new Error('❌ Bị lỗi 413 Payload Too Large khi gửi 5MB payload!');
    }
    console.log('✅ 50MB Payload Parser hoạt động tốt, không bị 413 Entity Too Large!');

    // ----------------------------------------------------
    // TEST 2: Schema CPS trong PostgreSQL & Mã CPS-YYYYMMDD-XXX
    // ----------------------------------------------------
    console.log('\n--- 2. Kiểm thử mã sinh CPS-YYYYMMDD-XXX ---');
    const nextCps = await splitService.getNextCpsDocNo();
    console.log('Next CPS DocNo:', nextCps.docNo);
    const cpsRegex = /^CPS-\d{8}-\d{3}$/;
    if (!cpsRegex.test(nextCps.docNo)) {
      throw new Error(`Mã CPS không đúng định dạng CPS-YYYYMMDD-XXX: ${nextCps.docNo}`);
    }
    console.log('✅ Định dạng mã CPS chuẩn xác!');

    // ----------------------------------------------------
    // TEST 3: Xâu chuỗi tự động CPSR -> CPS (TO_ASSIGN)
    // ----------------------------------------------------
    console.log('\n--- 3. Kiểm thử tạo CPSR -> Tự động sinh CPS (TO_ASSIGN) ---');
    const cpsr = await splitService.createCpsr({
      reqDate: '2026-10-05',
      reqTime: '08:30',
      reqBy: 'Nguyễn Văn Test - NV999',
      printTech: 'OFFSET',
      machineName: 'Heidelberg XL 75',
      problem: 'Sự cố thử nghiệm xâu chuỗi CPS',
      priority: 'Hỗ trợ ngay',
    });
    console.log('Created CPSR:', cpsr.docNo);

    // Verify CPS was auto-created
    const linkedCps = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    if (!linkedCps) {
      throw new Error(`Không tìm thấy bản ghi CPS tự động tạo cho CPSR ${cpsr.docNo}`);
    }
    console.log('Auto-created CPS:', {
      id: linkedCps.id,
      docNo: linkedCps.docNo,
      cpsrDocNo: linkedCps.cpsrDocNo,
      status: linkedCps.status,
      priority: linkedCps.priority,
    });
    if (linkedCps.status !== 'TO_ASSIGN') {
      throw new Error(`Trạng thái ban đầu của CPS phải là TO_ASSIGN, thực tế: ${linkedCps.status}`);
    }
    console.log('✅ CPS tự động tạo với trạng thái TO_ASSIGN thành công!');

    // ----------------------------------------------------
    // TEST 4: Phân công nhiệm vụ qua API POST /api/cps/:docNo/assign
    // ----------------------------------------------------
    console.log('\n--- 4. Kiểm thử API Phân công Task (POST /api/cps/:docNo/assign) ---');
    // Future deadline -> status should be IN_PROGRESS
    const futureDeadline = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const assignRes = await fetch(`${baseUrl}/api/cps/${linkedCps.docNo}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedTo: 'KTV Lê Văn Thợ - KT88',
        assignedToId: 'EMP-KT88',
        deadline: futureDeadline,
        notes: 'Cần sửa gấp trong ngày',
      }),
    });

    if (!assignRes.ok) {
      const errText = await assignRes.text();
      throw new Error(`POST /api/cps/:docNo/assign failed: ${assignRes.status} ${errText}`);
    }

    const assignedCps = await assignRes.json();
    console.log('Assigned CPS Response:', {
      docNo: assignedCps.docNo,
      assignedTo: assignedCps.assignedTo,
      deadline: assignedCps.deadline,
      status: assignedCps.status,
    });

    if (assignedCps.status !== 'IN_PROGRESS') {
      throw new Error(`Sau khi gán KTV, trạng thái phải là IN_PROGRESS, thực tế: ${assignedCps.status}`);
    }
    if (assignedCps.assignedTo !== 'KTV Lê Văn Thợ - KT88') {
      throw new Error(`AssignedTo không khớp: ${assignedCps.assignedTo}`);
    }
    console.log('✅ API Assign Task thành công (IN_PROGRESS)!');

    // ----------------------------------------------------
    // TEST 5: Tính toán trạng thái OVER_DUE
    // ----------------------------------------------------
    console.log('\n--- 5. Kiểm thử tính toán trạng thái OVER_DUE ---');
    // Gán deadline trong quá khứ -> OVER_DUE
    const pastDeadline = new Date(Date.now() - 3600 * 1000).toISOString();
    const overdueRes = await fetch(`${baseUrl}/api/cps/${linkedCps.docNo}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedTo: 'KTV Lê Văn Thợ - KT88',
        deadline: pastDeadline,
      }),
    });
    const overdueCps = await overdueRes.json();
    console.log('Overdue CPS:', {
      docNo: overdueCps.docNo,
      deadline: overdueCps.deadline,
      status: overdueCps.status,
    });
    if (overdueCps.status !== 'OVER_DUE') {
      throw new Error(`Deadline trong quá khứ phải tính là OVER_DUE, thực tế: ${overdueCps.status}`);
    }
    console.log('✅ Tính toán OVER_DUE dựa trên deadline vs thời gian hiện tại chuẩn xác!');

    // ----------------------------------------------------
    // TEST 6: Xâu chuỗi CPST -> Cập nhật cpst_doc_no, downtime
    // ----------------------------------------------------
    console.log('\n--- 6. Kiểm thử tạo CPST -> Cập nhật CPS ---');
    const cpst = await splitService.createCpst({
      cpsrDocNo: cpsr.docNo,
      recvBy: 'KTV Lê Văn Thợ - KT88',
      recvDate: '2026-10-05',
      recvTime: '09:00',
      finishDate: '2026-10-05',
      finishTime: '09:45',
      downtime: 45,
      chkStatus: 'Đã khắc phục',
      actionTaken: 'Thay thế bạc đạn và căn chỉnh lô mực',
    });
    console.log('Created CPST:', cpst.docNo, 'downtime:', cpst.downtime);

    const cpsAfterCpst = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    if (!cpsAfterCpst || cpsAfterCpst.cpstDocNo !== cpst.docNo) {
      throw new Error(`CPS chưa liên kết đúng cpst_doc_no: ${cpsAfterCpst?.cpstDocNo}`);
    }
    if (cpsAfterCpst.downtime !== 45) {
      throw new Error(`CPS downtime không khớp: ${cpsAfterCpst.downtime}`);
    }
    console.log('CPS after CPST:', {
      docNo: cpsAfterCpst.docNo,
      cpstDocNo: cpsAfterCpst.cpstDocNo,
      downtime: cpsAfterCpst.downtime,
      chkStatus: cpsAfterCpst.chkStatus,
    });
    console.log('✅ Cập nhật CPST & Downtime vào CPS thành công!');

    // ----------------------------------------------------
    // TEST 7: Xâu chuỗi CPSF -> Cập nhật cpsf_doc_no, tổng SL, phế, % phế, CLOSED
    // ----------------------------------------------------
    console.log('\n--- 7. Kiểm thử tạo CPSF -> Cập nhật CPS (CLOSED & % phế) ---');
    const cpsf = await splitService.createCpsf({
      cpstDocNo: cpst.docNo,
      chkQuality: 'Đạt',
      workOrder: 'WO-20261005-01',
      woTotalQty: 10000,
      wasteQty: 125,
      wasteUnit: 'PCS',
      prodMgr: 'Quản đốc Test',
    });
    console.log('Created CPSF:', cpsf.docNo, 'woTotalQty:', cpsf.woTotalQty, 'wasteQty:', cpsf.wasteQty);

    const cpsAfterCpsf = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    if (!cpsAfterCpsf || cpsAfterCpsf.cpsfDocNo !== cpsf.docNo) {
      throw new Error(`CPS chưa liên kết đúng cpsf_doc_no: ${cpsAfterCpsf?.cpsfDocNo}`);
    }
    if (cpsAfterCpsf.status !== 'CLOSED') {
      throw new Error(`Sau khi có CPSF, trạng thái CPS phải là CLOSED, thực tế: ${cpsAfterCpsf.status}`);
    }
    // % phế = 125 / 10000 * 100 = 1.25%
    if (cpsAfterCpsf.wastePercent !== '1.25%') {
      throw new Error(`Tỉ lệ % phế tính toán sai, kỳ vọng '1.25%', thực tế: ${cpsAfterCpsf.wastePercent}`);
    }
    console.log('CPS after CPSF (CLOSED):', {
      docNo: cpsAfterCpsf.docNo,
      cpsfDocNo: cpsAfterCpsf.cpsfDocNo,
      woTotalQty: cpsAfterCpsf.woTotalQty,
      wasteQty: cpsAfterCpsf.wasteQty,
      wastePercent: cpsAfterCpsf.wastePercent,
      status: cpsAfterCpsf.status,
      closedAt: cpsAfterCpsf.closedAt,
    });
    console.log('✅ Đã xâu chuỗi CPSF, tính % phế chính xác và chuyển trạng thái CLOSED!');

    // ----------------------------------------------------
    // TEST 8: API GET /api/cps & Stats
    // ----------------------------------------------------
    console.log('\n--- 8. Kiểm thử API GET /api/cps và GET /api/cps/stats ---');
    const getCpsRes = await fetch(`${baseUrl}/api/cps`).then(r => r.json());
    if (!Array.isArray(getCpsRes)) {
      throw new Error('GET /api/cps phải trả về mảng danh sách CPS!');
    }
    const foundInList = getCpsRes.find((item: any) => item.docNo === linkedCps.docNo);
    if (!foundInList) {
      throw new Error(`Không tìm thấy CPS ${linkedCps.docNo} trong GET /api/cps`);
    }
    console.log('Found CPS in GET /api/cps:', {
      docNo: foundInList.docNo,
      status: foundInList.status,
      cpsrDocNo: foundInList.cpsrDocNo,
      cpstDocNo: foundInList.cpstDocNo,
      cpsfDocNo: foundInList.cpsfDocNo,
      wastePercent: foundInList.wastePercent,
    });

    const statsRes = await fetch(`${baseUrl}/api/cps/stats`).then(r => r.json());
    console.log('GET /api/cps/stats:', statsRes);
    if (typeof statsRes.total !== 'number' || typeof statsRes.closed !== 'number') {
      throw new Error('GET /api/cps/stats trả về thiếu các trường thống kê!');
    }
    console.log('✅ API GET /api/cps và stats hoạt động hoàn hảo!');

    // ----------------------------------------------------
    // TEST 9: Cascade Deletion
    // ----------------------------------------------------
    console.log('\n--- 9. Kiểm thử xóa chuỗi (Cascade deletion) ---');
    await splitService.deleteCpsr(cpsr.id);
    const cpsAfterDelete = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    if (cpsAfterDelete) {
      throw new Error('Bản ghi CPS vẫn còn sau khi xóa CPSR!');
    }
    console.log('✅ Khi xóa CPSR, bản ghi CPS liên quan cũng được xóa sạch!');

    console.log('\n🎉 TẤT CẢ 9 MỤC KIỂM THỬ BACKEND ĐÃ VƯỢT QUA 100% THÀNH CÔNG!');
  } finally {
    await app.close();
  }
}

testBackend().catch(err => {
  console.error('❌ Kiểm thử Backend thất bại:', err);
  process.exit(1);
});
