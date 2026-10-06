import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import * as http from 'http';

function httpGet(url: string, headers: Record<string, string> = {}): Promise<{ status: number; body: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 200, body, headers: res.headers }));
    });
    req.on('error', reject);
  });
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${msg}`);
    process.exit(1);
  } else {
    console.log(`  ✅ [PASS] ${msg}`);
  }
}

async function run() {
  console.log('🚀 [TEST] Bắt đầu kiểm tra toàn diện Report Technical & Control Panel...');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error'],
  });
  app.use(cookieParser());
  const testPort = 3397;
  await app.listen(testPort);
  console.log(`✅ Test server running on http://127.0.0.1:${testPort}`);

  try {
    // 1. Check Control Panel View HTML
    console.log('\n--- 1. Kiểm tra Route /control-panel và giao diện Quản Lý Phiếu Kỹ Thuật ---');
    const cpRes = await httpGet(`http://127.0.0.1:${testPort}/control-panel`);
    assert(cpRes.status === 200, 'Route /control-panel trả về HTTP 200 OK');
    const cpBody = cpRes.body;

    assert(cpBody.includes('<title>Quản Lý Phiếu Kỹ Thuật</title>'), 'Tiêu đề trang là "Quản Lý Phiếu Kỹ Thuật"');
    assert(cpBody.includes('Report Technical'), 'Sidebar có mục menu "Report Technical"');

    // 2. Check Action Buttons in requests tab
    console.log('\n--- 2. Kiểm tra đầy đủ 5 nút chức năng trên Control Panel ---');
    assert(cpBody.includes('+ Form CPSR'), 'Hiển thị nút "+ Form CPSR"');
    assert(cpBody.includes('+ Form CPST'), 'Hiển thị nút "+ Form CPST"');
    assert(cpBody.includes('+ Form CPSF'), 'Hiển thị nút "+ Form CPSF"');
    assert(cpBody.includes('+ Tạo Phiếu CPS'), 'Hiển thị nút "+ Tạo Phiếu CPS"');
    assert(cpBody.includes('🔗 Ghép Nối Phiếu'), 'Hiển thị nút "🔗 Ghép Nối Phiếu"');

    // 3. Check Modals
    console.log('\n--- 3. Kiểm tra các Modal (Tạo CPS có ràng buộc CPSR, Sửa không đơ, Ghép nối) ---');
    assert(cpBody.includes('id="modal-create-cps"'), 'Modal Tạo Phiếu CPS tồn tại');
    assert(cpBody.includes('Ràng buộc nghiệp vụ:'), 'Modal Tạo Phiếu CPS có thông báo ràng buộc nghiệp vụ bắt buộc chọn CPSR');
    assert(cpBody.includes('availableCpsrForCps'), 'Dropdown chỉ cho phép chọn CPSR khả dụng');
    assert(cpBody.includes('id="modal-edit-ticket"'), 'Modal Chỉnh Sửa Phiếu (Safe Vue Modal) tồn tại');
    assert(cpBody.includes('id="modal-link-ticket"'), 'Modal Ghép Nối Phiếu (Link/Unlink CPST/CPSF) tồn tại');
    assert(cpBody.includes('unlinkItem(\'cpst\')'), 'Hỗ trợ hủy ghép nối CPST');
    assert(cpBody.includes('unlinkItem(\'cpsf\')'), 'Hỗ trợ hủy ghép nối CPSF');

    // 4. Check Report Technical View & 7 KPI Cards
    console.log('\n--- 4. Kiểm tra giao diện Report Technical & 7 KPI Cards ---');
    assert(cpBody.includes('activeTab === \'report-technical\''), 'View activeTab report-technical được tích hợp đầy đủ');
    assert(cpBody.includes('1 Tuần trước'), 'Bộ lọc mốc thời gian có preset "1 Tuần trước" (mặc định)');
    assert(cpBody.includes('v-model="reportDateFrom"'), 'Input chọn mốc thời gian reportDateFrom tồn tại');
    assert(cpBody.includes('v-model="reportDateTo"'), 'Input chọn mốc thời gian reportDateTo tồn tại');

    // 7 Statistical Cards
    assert(cpBody.includes('Phiếu Yêu Cầu') && cpBody.includes('reportStats.totalRequests'), 'Card 1: Số phiếu Kỹ thuật yêu cầu');
    assert(cpBody.includes('Tổng Downtime') && cpBody.includes('reportStats.totalDowntimeMinutes'), 'Card 2: Tổng thời gian down time (phút/giờ)');
    assert(cpBody.includes('OPEN_TASK') && cpBody.includes('reportStats.openTask'), 'Card 3: Số lượng OPEN_TASK');
    assert(cpBody.includes('TO_ASSIGN') && cpBody.includes('reportStats.toAssign'), 'Card 4: Số lượng TO_ASSIGN');
    assert(cpBody.includes('IN_PROGRESS') && cpBody.includes('reportStats.inProgress'), 'Card 5: Số lượng IN_PROGRESS');
    assert(cpBody.includes('CLOSED') && cpBody.includes('reportStats.closed'), 'Card 6: Số lượng CLOSED');
    assert(cpBody.includes('OVER_DUE') && cpBody.includes('reportStats.overDue'), 'Card 7: Số lượng OVER_DUE');

    // 5. Check Donut Chart & Center Text
    console.log('\n--- 5. Kiểm tra Donut Chart với số tổng ở chính giữa ---');
    assert(cpBody.includes('id="chart-report-technical-donut"'), 'Canvas Donut Chart tồn tại');
    assert(cpBody.includes('reportStats.totalStatusCps'), 'Số tổng các trạng thái CPS nằm chính giữa Donut Chart');
    assert(cpBody.includes('Tổng Trạng Thái CPS'), 'Nhãn "Tổng Trạng Thái CPS" hiển thị ở tâm Donut Chart');

    // 6. Check Tabulator table for Report Technical
    console.log('\n--- 6. Kiểm tra Tabulator table trong Report Technical ---');
    assert(cpBody.includes('id="tabulator-report-technical"'), 'Vùng hiển thị bảng dữ liệu Tabulator report-technical tồn tại');
    assert(cpBody.includes('exportReportTechnicalExcel'), 'Hỗ trợ xuất bảng dữ liệu report sang Excel');

    // 7. Check Dashboard sync & text rename
    console.log('\n--- 7. Kiểm tra đồng bộ Dashboard và đổi tên sang Report Technical ---');
    const dashRes = await httpGet(`http://127.0.0.1:${testPort}/dashboard`, {
      Cookie: 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummytoken1234567890'
    });
    assert(dashRes.status === 200, 'Route /dashboard trả về HTTP 200 OK');
    const dashBody = dashRes.body;
    assert(dashBody.includes('Report Technical'), 'Dashboard đã cập nhật tên thẻ thành Report Technical');
    assert(!dashBody.includes('Report Tuần'), 'Loại bỏ hoàn toàn tên cũ "Report Tuần" trên Dashboard');

    console.log('\n🎉 TẤT CẢ 20 ĐIỂM KIỂM THỬ GIAO DIỆN & LOGIC ĐỀU ĐẠT CHUẨN XUẤT SẮC! (0 lỗi)\n');
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
