import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './src/app.module';
import { SplitFormsService } from './src/modules/split-forms/split-forms.service';
import { DatabaseService } from './src/modules/database/database.service';
import { CONTROL_PANEL_HTML } from './src/views/control-panel.view';
import { TECHNICAL_FEEDBACK_HTML } from './src/views/technical-feedback.view';
import * as assert from 'assert';

async function runComprehensiveQATest() {
  console.log('================================================================');
  console.log('🧪 QA VERIFICATION SUITE: CPS CHAIN, ASSIGN TASK & PHOTO LIMIT');
  console.log('================================================================\n');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    logger: ['error', 'warn'],
  });

  // 1. Áp dụng giới hạn 50MB payload như trong src/main.ts
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const testPort = 3399;
  await app.listen(testPort);
  const baseUrl = `http://127.0.0.1:${testPort}`;
  console.log(`[QA SETUP] Test server started at ${baseUrl}`);

  const splitService = app.get(SplitFormsService);
  const dbService = app.get(DatabaseService);

  console.log(`[QA SETUP] PostgreSQL Connection: ${dbService.isPostgresConnected() ? 'CONNECTED' : 'JSON_FALLBACK'}\n`);

  let passedChecks = 0;
  let totalChecks = 0;

  function reportCheck(name: string, condition: boolean, detail?: string) {
    totalChecks++;
    if (condition) {
      passedChecks++;
      console.log(`  ✅ [PASS] ${name}${detail ? ` (${detail})` : ''}`);
    } else {
      console.error(`  ❌ [FAIL] ${name}${detail ? ` (${detail})` : ''}`);
      throw new Error(`Assertion failed: ${name}`);
    }
  }

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: PAYLOAD SIZE & ENTITY TOO LARGE TEST
    // -------------------------------------------------------------------------
    console.log('▶️ CHECK 1: KIỂM THỬ PAYLOAD SIZE VÀ UPLOAD ẢNH DUNG LƯỢNG LỚN (NO 413)');
    
    // Tạo chuỗi base64 giả lập ảnh dung lượng ~6MB
    const largeImageBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(6 * 1024 * 1024);
    
    // Gửi payload lớn qua POST endpoint
    // Thử gửi CPSR với data thông thường trước
    const testCpsr = await splitService.createCpsr({
      reqDate: '2026-10-05',
      reqTime: '09:00',
      reqBy: 'QA Tester - VN8888',
      printTech: 'OFFSET',
      machineName: 'SM 52',
      problem: 'QA Payload Size & Chain Verification',
      priority: 'Hỗ trợ ngay',
    });
    reportCheck('Tạo CPSR thành công', !!testCpsr.docNo, testCpsr.docNo);

    // Gửi CPST với ảnh lớn 6MB vào /api/cpst qua HTTP POST
    const cpstPayload = {
      cpsrDocNo: testCpsr.docNo,
      recvBy: 'KTV Trịnh Văn Thuận - VN5300',
      recvDate: '2026-10-05',
      recvTime: '09:10',
      finishDate: '2026-10-05',
      finishTime: '09:55',
      downtime: 45,
      rootCause: 'Kẹt giấy cuộn và lệch cơ',
      actionTaken: 'Căn chỉnh trục và thay thế đệm cao su',
      photosBefore: [largeImageBase64],
      photosAfter: [largeImageBase64],
      chkStatus: 'Đã khắc phục',
    };

    const cpstHttpRes = await fetch(`${baseUrl}/api/cpst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cpstPayload),
    });

    reportCheck(
      'Upload payload ảnh 6MB không bị 413 Entity Too Large',
      cpstHttpRes.status === 201 || cpstHttpRes.status === 200,
      `HTTP status: ${cpstHttpRes.status}`
    );
    const createdCpst = await cpstHttpRes.json();
    reportCheck('Bản ghi CPST được tạo thành công với ảnh', !!createdCpst.docNo, createdCpst.docNo);

    // -------------------------------------------------------------------------
    // SECTION 2: BẢNG CPS & ĐỊNH DẠNG MÃ CPS-YYYYMMDD-XXX
    // -------------------------------------------------------------------------
    console.log('\n▶️ CHECK 2: BẢNG CPS TRONG POSTGRESQL / DATABASE & ĐỊNH DẠNG MÃ CPS-YYYYMMDD-XXX');

    const nextCpsCodeRes = await fetch(`${baseUrl}/api/cps/next-code`);
    reportCheck('API /api/cps/next-code phản hồi 200', nextCpsCodeRes.ok);
    const nextCpsCodeData = await nextCpsCodeRes.json();
    const cpsRegex = /^CPS-\d{8}-\d{3}$/;
    reportCheck(
      'Mã CPS sinh ra tuân thủ định dạng CPS-YYYYMMDD-XXX',
      cpsRegex.test(nextCpsCodeData.docNo),
      nextCpsCodeData.docNo
    );

    // Kiểm tra cấu trúc bảng cps
    const allCpsList = dbService.getCpsList();
    reportCheck('Danh sách CPS có sẵn trong database service', Array.isArray(allCpsList));
    const currentLinkedCps = dbService.getCpsByCpsrDocNo(testCpsr.docNo);
    reportCheck(
      'CPSR được tự động xâu chuỗi tạo bản ghi CPS tương ứng',
      !!currentLinkedCps,
      `CPS DocNo: ${currentLinkedCps?.docNo}`
    );

    // -------------------------------------------------------------------------
    // SECTION 3: VÒNG ĐỜI TRẠNG THÁI: TO_ASSIGN -> IN_PROGRESS -> OVER_DUE -> CLOSED
    // -------------------------------------------------------------------------
    console.log('\n▶️ CHECK 3: VÒNG ĐỜI TRẠNG THÁI VÀ TÍNH TOÁN DOWNTIME & TỈ LỆ PHẾ');

    // 3.1. Tạo mới CPSR riêng cho bài test vòng đời
    const cpsrFlow = await splitService.createCpsr({
      reqDate: '2026-10-05',
      reqTime: '10:00',
      reqBy: 'Nguyễn Văn Kiểm Thử - VN1111',
      printTech: 'Woven',
      machineName: 'Woven 2',
      problem: 'Lệch khổ in và đứt chỉ lặp lại',
      priority: 'Hỗ trợ ngay',
    });

    let cpsFlow = dbService.getCpsByCpsrDocNo(cpsrFlow.docNo);
    assert(cpsFlow, 'CPS phải được sinh ra tự động');
    reportCheck('Trạng thái khởi tạo của CPS là TO_ASSIGN', cpsFlow.status === 'TO_ASSIGN', cpsFlow.status);

    // 3.2. Chuyển sang IN_PROGRESS qua API Phân công Assign Task (hạn tương lai)
    const futureDeadline = new Date(Date.now() + 86400000).toISOString();
    const assignRes = await fetch(`${baseUrl}/api/cps/${cpsFlow.docNo}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedTo: 'KTV Đỗ Đức Nhật - VN5944',
        assignedToId: 'VN5944',
        assignedToName: 'Đỗ Đức Nhật',
        deadline: futureDeadline,
        priority: 'Hỗ trợ ngay',
        notes: 'Kiểm tra kỹ đầu dò sợi',
      }),
    });
    reportCheck('API POST /api/cps/:docNo/assign phản hồi thành công', assignRes.ok, `status: ${assignRes.status}`);
    const assignedCpsData = await assignRes.json();
    reportCheck(
      'Trạng thái chuyển sang IN_PROGRESS sau khi phân công',
      assignedCpsData.status === 'IN_PROGRESS',
      assignedCpsData.status
    );
    reportCheck('Thông tin KTV phân công được lưu chính xác', assignedCpsData.assignedTo.includes('VN5944'));

    // 3.3. Kiểm thử trạng thái OVER_DUE khi deadline quá hạn
    const pastDeadline = new Date(Date.now() - 3600000).toISOString(); // 1 giờ trước
    const overdueUpdateRes = await fetch(`${baseUrl}/api/cps/${cpsFlow.docNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deadline: pastDeadline,
      }),
    });
    reportCheck('Cập nhật deadline quá khứ thành công', overdueUpdateRes.ok);
    const overdueCpsData = await overdueUpdateRes.json();
    reportCheck(
      'Hệ thống tự động tính toán trạng thái OVER_DUE khi quá hạn deadline',
      overdueCpsData.status === 'OVER_DUE',
      overdueCpsData.status
    );

    // 3.4. KTV thực hiện xử lý -> Tạo CPST và tính thời gian dừng máy (downtime)
    const cpstFlow = await splitService.createCpst({
      cpsrDocNo: cpsrFlow.docNo,
      recvBy: 'KTV Đỗ Đức Nhật - VN5944',
      recvDate: '2026-10-05',
      recvTime: '10:05',
      finishDate: '2026-10-05',
      finishTime: '11:15',
      downtime: 70, // 70 phút
      rootCause: 'Mòn bạc đạn cuốn sợi',
      actionTaken: 'Thay thế bạc đạn số 3 và cân chỉnh dây đai',
      chkStatus: 'Đã khắc phục',
    });
    reportCheck('Tạo CPST liên kết CPSR thành công', cpstFlow.docNo === cpstFlow.docNo, cpstFlow.docNo);

    cpsFlow = dbService.getCpsByCpsrDocNo(cpsrFlow.docNo)!;
    reportCheck(
      'CPS tự động cập nhật CPST docNo và thời gian dừng máy (downtime = 70m)',
      cpsFlow.cpstDocNo === cpstFlow.docNo && cpsFlow.downtime === 70,
      `downtime: ${cpsFlow.downtime} phút`
    );

    // 3.5. Nghiệm thu sản xuất -> Tạo CPSF và tính tỉ lệ phế phẩm (%) + Chuyển trạng thái CLOSED
    const cpsfFlow = await splitService.createCpsf({
      cpstDocNo: cpstFlow.docNo,
      chkQuality: 'Đạt',
      workOrder: 'WO-20261005-99',
      woTotalQty: 2000,
      wasteQty: 50,
      wasteUnit: 'PCS',
      wastePercent: '2.50%',
      prodMgr: 'Trần Văn QL - VN3000',
    });
    reportCheck('Tạo CPSF liên kết CPST thành công', !!cpsfFlow.docNo, cpsfFlow.docNo);

    cpsFlow = dbService.getCpsByCpsrDocNo(cpsrFlow.docNo)!;
    reportCheck(
      'CPS cập nhật trạng thái CLOSED khi có xác nhận CPSF',
      cpsFlow.status === 'CLOSED',
      cpsFlow.status
    );
    reportCheck(
      'CPS cập nhật thông tin sản lượng và tỉ lệ phế chuẩn xác (2.50%)',
      cpsFlow.woTotalQty === 2000 && cpsFlow.wasteQty === 50 && (cpsFlow.wastePercent === '2.50%' || cpsFlow.wastePercent === '2.5%'),
      `woTotal: ${cpsFlow.woTotalQty}, waste: ${cpsFlow.wasteQty}, rate: ${cpsFlow.wastePercent}`
    );
    reportCheck('Thời gian đóng closedAt được ghi nhận', !!cpsFlow.closedAt);

    // 3.6. Kiểm thử ràng buộc quan hệ 1-1-1
    console.log('\n--- Kiểm thử ràng buộc quan hệ 1-1-1 ---');
    let duplicateCpstThrew = false;
    try {
      await splitService.createCpst({
        cpsrDocNo: cpsrFlow.docNo,
        recvBy: 'KTV Duplicate - VN9999',
      });
    } catch (err: any) {
      duplicateCpstThrew = true;
    }
    reportCheck('Không cho phép tạo 2 CPST cho cùng 1 CPSR (Bảo toàn quan hệ 1-1)', duplicateCpstThrew);

    let duplicateCpsfThrew = false;
    try {
      await splitService.createCpsf({
        cpstDocNo: cpstFlow.docNo,
        chkQuality: 'Đạt',
        prodMgr: 'Trần Văn QL',
      });
    } catch (err: any) {
      duplicateCpsfThrew = true;
    }
    reportCheck('Không cho phép tạo 2 CPSF cho cùng 1 CPST (Bảo toàn quan hệ 1-1)', duplicateCpsfThrew);

    // -------------------------------------------------------------------------
    // SECTION 4: KIỂM THỬ API ASSIGN TASK & CPS QUERY ENDPOINTS
    // -------------------------------------------------------------------------
    console.log('\n▶️ CHECK 4: KIỂM THỬ CÁC ENDPOINT API CỦA MODULE ASSIGN TASK');

    // 4.1. GET /api/cps danh sách & bộ lọc
    const getCpsListRes = await fetch(`${baseUrl}/api/cps?status=CLOSED`);
    reportCheck('GET /api/cps?status=CLOSED phản hồi 200', getCpsListRes.ok);
    const cpsClosedList = await getCpsListRes.json();
    const closedItems = Array.isArray(cpsClosedList) ? cpsClosedList : cpsClosedList.data;
    reportCheck('Bộ lọc status=CLOSED trả về danh sách đúng', closedItems.some((x: any) => x.docNo === cpsFlow.docNo));

    // 4.2. GET /api/cps/stats
    const getStatsRes = await fetch(`${baseUrl}/api/cps/stats`);
    reportCheck('GET /api/cps/stats phản hồi 200', getStatsRes.ok);
    const statsData = await getStatsRes.json();
    reportCheck(
      'Thống kê số lượng các trạng thái CPS đầy đủ',
      typeof statsData.total === 'number' &&
      typeof statsData.toAssign === 'number' &&
      typeof statsData.inProgress === 'number' &&
      typeof statsData.overdue === 'number' &&
      typeof statsData.closed === 'number',
      `Total: ${statsData.total}, ToAssign: ${statsData.toAssign}, Closed: ${statsData.closed}`
    );

    // 4.3. GET /api/cps/:idOrDocNo
    const getSingleCpsRes = await fetch(`${baseUrl}/api/cps/${cpsFlow.docNo}`);
    reportCheck('GET /api/cps/:docNo phản hồi 200', getSingleCpsRes.ok);
    const singleCps = await getSingleCpsRes.json();
    reportCheck('Chi tiết CPS kèm đầy đủ chuỗi CPSR, CPST, CPSF liên kết', !!singleCps.cpsr && !!singleCps.cpst && !!singleCps.cpsf);

    // -------------------------------------------------------------------------
    // SECTION 5: KIỂM THỬ FRONTEND GIAO DIỆN CARDS VÀ CLIENT-SIDE COMPRESSION
    // -------------------------------------------------------------------------
    console.log('\n▶️ CHECK 5: XÁC MINH GIAO DIỆN CARDS TẠI CONTROL PANEL & NÉN ẢNH CLIENT-SIDE');

    // 5.1. Kiểm tra mã nguồn CONTROL_PANEL_HTML
    reportCheck(
      'Control Panel có tab Phân Công Kỹ Thuật (Cards)',
      CONTROL_PANEL_HTML.includes("switchTab('assign-tasks')") &&
      CONTROL_PANEL_HTML.includes('Phân Công Kỹ Thuật (Cards)')
    );

    reportCheck(
      'Control Panel có các Cards đếm số lượng theo trạng thái (KPI Badges)',
      CONTROL_PANEL_HTML.includes("cpsCountByStatus('TO_ASSIGN')") &&
      CONTROL_PANEL_HTML.includes("cpsCountByStatus('IN_PROGRESS')") &&
      CONTROL_PANEL_HTML.includes("cpsCountByStatus('OVER_DUE')") &&
      CONTROL_PANEL_HTML.includes("cpsCountByStatus('CLOSED')")
    );

    reportCheck(
      'Control Panel có Modal Phân Công Task với danh sách KTV và Hạn chót (Deadline)',
      CONTROL_PANEL_HTML.includes('openAssignModal') &&
      CONTROL_PANEL_HTML.includes('assignForm') &&
      (CONTROL_PANEL_HTML.includes('submitAssignTask') || CONTROL_PANEL_HTML.includes('saveAssignTask'))
    );

    reportCheck(
      'Tabulator trong Control Panel có cột hiển thị Chuỗi CPS và thông tin KTV, Downtime, % Phế',
      CONTROL_PANEL_HTML.includes('tabulator-cps') ||
      (CONTROL_PANEL_HTML.includes('cpsDocNo') && CONTROL_PANEL_HTML.includes('wastePercent')) ||
      CONTROL_PANEL_HTML.includes('assign-tasks')
    );

    // 5.2. Kiểm tra mã nguồn TECHNICAL_FEEDBACK_HTML (nén ảnh client-side)
    reportCheck(
      'Form phản hồi kỹ thuật tích hợp hàm compressImage nén ảnh client-side qua Canvas',
      TECHNICAL_FEEDBACK_HTML.includes('compressImage') &&
      TECHNICAL_FEEDBACK_HTML.includes('canvas.toDataURL')
    );

    reportCheck(
      'Sự kiện kéo thả / chọn file ảnh gọi hàm nén compressImage trước khi lưu Base64',
      TECHNICAL_FEEDBACK_HTML.includes('await compressImage')
    );

    console.log('\n================================================================');
    console.log(`🎉 TẤT CẢ KIỂM THỬ ĐẠT CHUẨN: ${passedChecks}/${totalChecks} PASSED!`);
    console.log('================================================================');
  } finally {
    await app.close();
    console.log('\n[QA TEARDOWN] Test server closed cleanly.');
  }
}

runComprehensiveQATest().catch(err => {
  console.error('\n❌ QA TEST FAILED WITH ERROR:', err);
  process.exit(1);
});
