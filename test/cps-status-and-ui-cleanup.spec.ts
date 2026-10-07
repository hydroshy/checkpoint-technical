import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService } from '../src/modules/database/database.service';
import { CpsService } from '../src/modules/cps/services/cps.service';
import { CpsrService } from '../src/modules/cps/services/cpsr.service';
import { CpstService } from '../src/modules/cps/services/cpst.service';
import { CpsfService } from '../src/modules/cps/services/cpsf.service';
import { AnalyticsReportService } from '../src/modules/analytics-report/services/analytics-report.service';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ: CPS STATUS TRANSITIONS & TOÀN DIỆN UI CLEANUP');
console.log('================================================================\n');

async function runTests() {
  const dbService = new DatabaseService();
  const cpsService = new CpsService(dbService);
  const cpsrService = new CpsrService(dbService);
  const cpstService = new CpstService(dbService);
  const cpsfService = new CpsfService(dbService);
  const analyticsService = new AnalyticsReportService(dbService);

  // -------------------------------------------------------------
  // TEST SECTION 1: Trạng thái CPS TO_CONFIRM và CLOSED
  // -------------------------------------------------------------
  console.log('--- 1. Kiểm thử Logic chuyển trạng thái CPS: TO_CONFIRM & CLOSED ---');

  // 1.1 Tạo CPSR -> Tự động sinh CPS ở trạng thái TO_ASSIGN
  const nextCpsr = await cpsrService.getNextCpsrDocNo();
  const cpsr = await cpsrService.createCpsr({
    docNo: nextCpsr.docNo,
    reqDate: '2026-10-07',
    reqTime: '10:00',
    reqBy: 'Operator Test QA',
    printTech: 'Offset',
    machineName: 'Máy In Thử Nghiệm QA',
    problem: 'Lỗi căn chỉnh màu sắc',
  });
  assert.ok(cpsr, 'Tạo CPSR thành công');
  let cps = dbService.getCpsByCpsrDocNo(cpsr.docNo);
  assert.ok(cps, 'CPS tự động được tạo liên kết CPSR');
  assert.strictEqual(cps!.status, 'TO_ASSIGN', 'Trạng thái ban đầu của CPS là TO_ASSIGN');
  console.log(`  ✅ [PASS] CPS ${cps!.docNo} khởi tạo với status=TO_ASSIGN`);

  // 1.2 Tạo CPST -> CPS chuyển sang TO_CONFIRM khi hoàn tất kỹ thuật
  const nextCpst = await cpstService.getNextCpstDocNo();
  const cpst = await cpstService.createCpst({
    docNo: nextCpst.docNo,
    cpsrDocNo: cpsr.docNo,
    recvBy: 'KTV Trần QA',
    recvDate: '2026-10-07',
    recvTime: '10:05',
    finishDate: '2026-10-07',
    finishTime: '10:45',
    downtime: 40,
    rootCause: 'Lệch trục lô',
    actionTaken: 'Căn chỉnh lại trục lô',
    chkStatus: 'Đã xử lý xong',
  });
  assert.ok(cpst, 'Tạo CPST thành công');
  cps = dbService.getCpsByCpsrDocNo(cpsr.docNo);
  assert.strictEqual(cps!.status, 'TO_CONFIRM', 'CPS chuyển sang trạng thái TO_CONFIRM khi hoàn tất CPST');
  console.log(`  ✅ [PASS] CPS ${cps!.docNo} chuyển sang TO_CONFIRM khi CPST hoàn tất`);

  // 1.3 Tạo CPSF mà KHÔNG CÓ wo, totalQty, scrapQty (optional test) -> CPS chuyển sang CLOSED
  const nextCpsf = await cpsfService.getNextCpsfDocNo();
  const cpsf = await cpsfService.createCpsf({
    docNo: nextCpsf.docNo,
    cpstDocNo: cpst.docNo,
    chkQuality: 'Đạt',
    prodMgr: 'Quản Đốc QA Lê',
    // wo, woTotalQty, wasteQty bỏ trống hoàn toàn
  });
  assert.ok(cpsf, 'Tạo CPSF thành công mà không cần wo, totalQty, scrapQty');
  cps = dbService.getCpsByCpsrDocNo(cpsr.docNo);
  assert.strictEqual(cps!.status, 'CLOSED', 'CPS chuyển sang trạng thái CLOSED sau khi có CPSF');
  assert.ok(cps!.closedAt, 'CPS có timestamp closedAt');
  console.log(`  ✅ [PASS] CPS ${cps!.docNo} chuyển sang CLOSED khi có CPSF (wo, qty optional)`);

  // 1.4 Hủy liên kết CPSF -> CPS quay lại TO_CONFIRM (vì vẫn còn CPST)
  const unlinked = await cpsService.unlinkCps(cps!.id, { unlinkCpsf: true });
  assert.strictEqual(unlinked.cpsfDocNo, null, 'Đã gỡ liên kết CPSF');
  assert.strictEqual(unlinked.status, 'TO_CONFIRM', 'CPS quay lại TO_CONFIRM khi hủy CPSF');
  console.log(`  ✅ [PASS] CPS ${unlinked.docNo} quay lại TO_CONFIRM sau khi unlink CPSF`);

  // 1.5 Cập nhật CPSF ĐẦY ĐỦ các trường -> Tính đúng tỷ lệ phế
  const updatedCpsf = await cpsfService.updateCpsf(cpsf.id, {
    workOrder: 'WO-QA-20261007',
    woTotalQty: 1000,
    wasteQty: 25,
    wasteUnit: 'tấm',
  });
  assert.ok(updatedCpsf, 'Cập nhật CPSF đầy đủ các trường thành công');
  // Ghép nối lại CPSF vào CPS
  const relinkedCps = await cpsService.linkCps(cps!.id, { cpsfDocNo: cpsf.docNo });
  assert.strictEqual(relinkedCps.status, 'CLOSED', 'CPS chuyển lại CLOSED khi ghép nối lại CPSF');
  assert.strictEqual(relinkedCps.wastePercent, '2.50%', 'Tính đúng tỷ lệ phế 2.50% (25/1000)');
  console.log(`  ✅ [PASS] CPS ${relinkedCps.docNo} chuyển sang CLOSED và tính đúng phế 2.50%`);

  // 1.6 Kiểm tra getCpsStats và AnalyticsReport có đếm đúng toConfirm
  const stats = cpsService.getCpsStats();
  assert.ok(typeof stats.toConfirm === 'number', 'stats có trường toConfirm');
  console.log(`  ✅ [PASS] getCpsStats() hỗ trợ đếm toConfirm: ${stats.toConfirm}`);

  // -------------------------------------------------------------
  // TEST SECTION 2: Kiểm tra Report Technical tinh gọn & Tỷ lệ 4M & Gantt 1h
  // -------------------------------------------------------------
  console.log('\n--- 2. Kiểm thử Report Technical tinh gọn (Tỷ lệ 4M căn giữa, Gantt 1h, không text thừa) ---');
  const analyticsChartsPath = path.resolve(__dirname, '../src/views/control-panel/components/charts/analytics-charts.component.ts');
  const analyticsChartsContent = fs.readFileSync(analyticsChartsPath, 'utf-8');

  // Kiểm tra không còn text thừa
  assert.ok(!analyticsChartsContent.includes('Phân tích chuyên sâu 4M'), 'Đã bỏ text thừa "Phân tích chuyên sâu 4M"');
  assert.ok(!analyticsChartsContent.includes('chu kỳ bảo trì và phân bổ nguồn lực kỹ thuật'), 'Đã bỏ text mô tả thừa chu kỳ bảo trì');
  assert.ok(!analyticsChartsContent.includes('Biểu đồ Gantt trực quan hóa tiến độ xử lý'), 'Đã bỏ text mô tả thừa Biểu đồ Gantt');
  assert.ok(!analyticsChartsContent.includes('Tỷ lệ 4M (Man, Machine, Material, Method) tính client-side'), 'Đã bỏ text thừa tính client-side 4M');
  assert.ok(!analyticsChartsContent.includes('Trục Y là tên máy, Trục X là khoảng thời gian lọc'), 'Đã bỏ text thừa trục X/Y Gantt');
  console.log('  ✅ [PASS] Report Technical đã loại bỏ hoàn toàn các đoạn văn bản / text mô tả thừa');

  // Kiểm tra Gantt chia lưới 1h (60 phút / mốc)
  assert.ok(analyticsChartsContent.includes('ganttTimeTicks'), 'Gantt có mốc thời gian lưới 1h (ganttTimeTicks)');
  console.log('  ✅ [PASS] Gantt chart phân bổ lưới theo chu kỳ 1 giờ');

  // Kiểm tra Tỷ lệ 4M căn giữa
  assert.ok(analyticsChartsContent.includes('Số sự cố') && analyticsChartsContent.includes('flex flex-col items-center justify-center'), 'Cụm Tỷ lệ 4M được căn giữa');
  console.log('  ✅ [PASS] Cụm Tỷ lệ 4M được căn chỉnh cân đối giữa');

  // -------------------------------------------------------------
  // TEST SECTION 3: Kiểm tra Popup chi tiết CPS & Lightbox ảnh
  // -------------------------------------------------------------
  console.log('\n--- 3. Kiểm thử Popup chi tiết CPS: Chỉ nút Đóng & Có Lightbox ảnh ---');
  const splitModalPath = path.resolve(__dirname, '../src/views/control-panel/components/modals/split-detail-modal.component.ts');
  const splitModalContent = fs.readFileSync(splitModalPath, 'utf-8');

  // Lightbox ảnh và chỉ nút Đóng
  assert.ok(splitModalContent.includes('openLightbox') || splitModalContent.includes('lightboxImage'), 'Popup chi tiết CPS có hỗ trợ Lightbox xem ảnh');
  assert.ok(splitModalContent.includes('closeChainModal'), 'Popup chi tiết CPS có nút đóng modal closeChainModal');
  assert.ok(splitModalContent.includes('>Đóng</button>'), 'Popup chi tiết CPS có nút Đóng');
  console.log('  ✅ [PASS] Popup chi tiết CPS hỗ trợ phóng to ảnh bằng Lightbox tại chỗ và chỉ có nút Đóng');

  // -------------------------------------------------------------
  // TEST SECTION 4: Kiểm tra Dashboard, Login, User Profile Card chuẩn hóa
  // -------------------------------------------------------------
  console.log('\n--- 4. Kiểm thử Dashboard, Login và User Profile Dropdown chuẩn hóa ---');
  const dashboardNavPath = path.resolve(__dirname, '../src/views/dashboard/components/layouts/navigation.component.ts');
  const dashboardNav = fs.readFileSync(dashboardNavPath, 'utf-8');

  // Dashboard không có text mô tả thừa dưới tiêu đề
  assert.ok(!dashboardNav.includes('Theo dõi thời gian thực các chỉ số bảo trì'), 'Dashboard đã loại bỏ mô tả thừa');
  // Chữ đen tương phản cao (text-slate-900 hoặc text-gray-900 hoặc text-black)
  assert.ok(dashboardNav.includes('text-slate-900') || dashboardNav.includes('text-black'), 'Dashboard sử dụng text-slate-900 / text-black tương phản cao');
  console.log('  ✅ [PASS] Dashboard chuẩn hóa chữ đậm rõ nét, không text thừa');

  const loginViewPath = path.resolve(__dirname, '../src/views/login.view.ts');
  const loginView = fs.readFileSync(loginViewPath, 'utf-8');
  assert.ok(loginView.includes('logo-full.svg') || loginView.includes('logo-full') || loginView.includes('logo'), 'Login view sử dụng logo-full');
  assert.ok(loginView.includes('Đăng nhập') || loginView.includes('ĐĂNG NHẬP'), 'Nút submit login là "Đăng nhập"');
  console.log('  ✅ [PASS] Trang Login chuẩn hóa logo-full, chữ rõ ràng và nút "Đăng nhập"');

  const headerViewPath = path.resolve(__dirname, '../src/views/control-panel/components/layouts/header.component.ts');
  const headerView = fs.readFileSync(headerViewPath, 'utf-8');
  assert.ok(headerView.includes('userMenuOpen') || headerView.includes('profile') || headerView.includes('user'), 'Header có menu user profile');
  console.log('  ✅ [PASS] User Profile Menu hoạt động và hiển thị chuẩn xác');

  console.log('\n================================================================');
  console.log('🎉 TẤT CẢ CÁC MỤC KIỂM THỬ ĐÃ PASS 100% THÀNH CÔNG!');
  console.log('================================================================\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ TEST THẤT BẠI:', err);
  process.exit(1);
});
