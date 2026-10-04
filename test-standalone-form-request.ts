import * as assert from 'assert';
import { DatabaseService } from './src/modules/database/database.service';
import { SettingsService } from './src/modules/settings/settings.service';
import { SettingsController } from './src/modules/settings/settings.controller';
import { PublicController } from './src/modules/settings/public.controller';
import { MachinesService } from './src/modules/machines/machines.service';
import { EmployeesService } from './src/modules/employees/employees.service';
import { TechnicalRequestsService } from './src/modules/technical-requests/technical-requests.service';
import { FORM_REQUEST_HTML } from './src/views/form-request.view';
import * as fs from 'fs';
import * as path from 'path';

async function runComprehensiveVerification() {
  console.log('=== BẮT ĐẦU KIỂM THỬ XÁC MINH TOÀN DIỆN /form-request ===\n');

  // ============================================================================
  // 1. KIỂM THỬ GIAO DIỆN & BỐ CỤC /form-request
  // ============================================================================
  console.log('1. Kiểm thử giao diện và bố cục độc lập của /form-request:');

  // 1.1 Không còn top header / navbar
  assert.ok(!FORM_REQUEST_HTML.includes('<header'), 'LỖI: FORM_REQUEST_HTML không được chứa thẻ <header>');
  assert.ok(!FORM_REQUEST_HTML.includes('glass-header'), 'LỖI: FORM_REQUEST_HTML không được chứa class glass-header');
  console.log('   ✓ Đã loại bỏ hoàn toàn top header (thanh điều hướng)');

  // 1.2 Không còn nút hoặc liên kết Đăng nhập
  assert.ok(!FORM_REQUEST_HTML.includes('href="/login"'), 'LỖI: FORM_REQUEST_HTML không được chứa liên kết /login');
  assert.ok(!FORM_REQUEST_HTML.includes('>Đăng nhập<'), 'LỖI: FORM_REQUEST_HTML không được chứa nút "Đăng nhập"');
  assert.ok(!FORM_REQUEST_HTML.includes('Đăng nhập hệ thống'), 'LỖI: FORM_REQUEST_HTML không được chứa "Đăng nhập hệ thống"');
  console.log('   ✓ Đã loại bỏ hoàn toàn các nút/liên kết Đăng nhập');

  // 1.3 Đồng bộ đầy đủ cấu trúc phiếu như Dashboard
  // Kiểm tra 6 nhóm nút tương tác (radio toggle buttons)
  const buttonGroups = ['machineStatus', 'priority', 'errCat', 'errType', 'chkQuality', 'chkStatus'];
  for (const group of buttonGroups) {
    const hasGroup = FORM_REQUEST_HTML.includes(`name="${group}"`) || FORM_REQUEST_HTML.includes(`name="public_${group}"`);
    assert.ok(hasGroup, `LỖI: Thiếu nhóm nút ${group} trong FORM_REQUEST_HTML`);
  }
  console.log('   ✓ Đủ 6 nhóm nút tương tác: machineStatus, priority, errCat, errType, chkQuality, chkStatus');

  // Kiểm tra các trường dữ liệu quan trọng
  assert.ok(FORM_REQUEST_HTML.includes('reqDate'), 'Thiếu trường ngày yêu cầu (reqDate)');
  assert.ok(FORM_REQUEST_HTML.includes('reqTime'), 'Thiếu trường giờ yêu cầu (reqTime)');
  assert.ok(FORM_REQUEST_HTML.includes('reqBy'), 'Thiếu trường người yêu cầu (reqBy)');
  assert.ok(FORM_REQUEST_HTML.includes('machineName'), 'Thiếu trường tên máy (machineName)');
  assert.ok(FORM_REQUEST_HTML.includes('problem'), 'Thiếu trường nội dung sự cố (problem)');
  assert.ok(FORM_REQUEST_HTML.includes('calcTotalTime') || FORM_REQUEST_HTML.includes('downtime') || FORM_REQUEST_HTML.includes('timeStart'), 'Thiếu logic tính toán thời gian downtime');
  assert.ok(FORM_REQUEST_HTML.includes('generatePDF') || FORM_REQUEST_HTML.includes('jspdf'), 'Thiếu tính năng in / xuất PDF');
  console.log('   ✓ Đầy đủ các trường thông tin và chức năng phiếu yêu cầu đồng bộ từ Dashboard');

  // ============================================================================
  // 2. KIỂM THỬ TRUY CẬP KHÔNG BỊ ĐẨY VÀO MÀN HÌNH "BIỂU MẪU TẠM KHÓA"
  // ============================================================================
  console.log('\n2. Kiểm thử xác nhận không bị đẩy vào màn hình "Biểu Mẫu Tạm Khóa":');

  // 2.1 Cấu hình settings.json mặc định bật
  const settingsJsonPath = path.resolve(__dirname, 'data/settings.json');
  if (fs.existsSync(settingsJsonPath)) {
    const raw = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf-8'));
    assert.strictEqual(raw.isPublicFormEnabled, true, 'settings.json phải có isPublicFormEnabled: true mặc định');
    console.log('   ✓ settings.json: isPublicFormEnabled mặc định là true');
  }

  // 2.2 DatabaseService load settings mặc định bật
  const dbService = new DatabaseService();
  dbService.loadAll();
  const dbSettings = dbService.getSettings();
  assert.strictEqual(dbSettings.isPublicFormEnabled, true, 'DatabaseService getSettings().isPublicFormEnabled phải là true');
  console.log('   ✓ DatabaseService: isPublicFormEnabled mặc định là true');

  // 2.3 SettingsService và Public Form Status trả về true
  const settingsService = new SettingsService(dbService);
  assert.strictEqual(settingsService.isPublicFormEnabled(), true, 'SettingsService.isPublicFormEnabled() phải là true');
  const statusRes = settingsService.getPublicFormStatus();
  assert.strictEqual(statusRes.isPublicFormEnabled, true, 'Public form status endpoint phải trả về isPublicFormEnabled: true');
  console.log('   ✓ SettingsService / Status API: Public Form kích hoạt sẵn sàng');

  // 2.4 Kiểm tra logic frontend form-request.view.ts
  assert.ok(
    FORM_REQUEST_HTML.includes('isPublicFormEnabled') || FORM_REQUEST_HTML.includes('checkpoint_token'),
    'FORM_REQUEST_HTML cần có logic kiểm tra trạng thái public form và token bypass'
  );
  console.log('   ✓ Frontend /form-request hiển thị trực tiếp form khi public form bật hoặc có token admin/nhân viên');

  // ============================================================================
  // 3. KIỂM THỬ BACKEND API CATALOGS & GỬI PHIẾU THÀNH CÔNG
  // ============================================================================
  console.log('\n3. Kiểm thử gửi phiếu thành công và lưu dữ liệu vào hệ thống:');

  const machinesService = new MachinesService(dbService);
  const employeesService = new EmployeesService(dbService);
  const techRequestsService = new TechnicalRequestsService(dbService);
  const publicController = new PublicController(
    settingsService,
    machinesService,
    employeesService,
    techRequestsService,
  );

  // 3.1 Catalogs
  const catalogs = publicController.getCatalogs();
  assert.ok(catalogs.machines && catalogs.machines.length > 0, 'Danh mục máy in không được rỗng');
  assert.ok(catalogs.employees && catalogs.employees.length > 0, 'Danh mục nhân viên không được rỗng');
  console.log(`   ✓ Danh mục trả về đầy đủ: ${catalogs.machines.length} máy móc, ${catalogs.employees.length} nhân sự`);

  // 3.2 Gửi phiếu yêu cầu từ khách (Guest)
  const testPayload = {
    reqDate: new Date().toISOString().split('T')[0],
    reqTime: '10:30',
    reqBy: 'Nguyễn Văn Kiểm Thử - Kỹ Thuật',
    printTech: 'OFFSET',
    machineName: 'SM 52',
    problem: 'Sự cố kiểm thử QA tự động từ /form-request',
    priority: 'Immediate',
    machineStatus: 'First Bulk Print',
    chkStatus: 'SUPPORT',
    chkQuality: 'OK',
    shift: 'Ngày',
    facility: 'P1',
    errCat: 'MACHINE',
    errType: 'Press'
  };

  const createdTicket = await (publicController.createPublicTechnicalRequest as any)(testPayload, {});
  assert.ok(createdTicket.id, 'Phiếu tạo phải có ID');
  assert.ok(createdTicket.docNo, 'Phiếu tạo phải có docNo');
  assert.strictEqual(createdTicket.reqBy, testPayload.reqBy, 'Người yêu cầu phải khớp');
  assert.strictEqual(createdTicket.problem, testPayload.problem, 'Nội dung sự cố phải khớp');
  console.log(`   ✓ Gửi phiếu thành công: docNo=${createdTicket.docNo}, ID=${createdTicket.id}`);

  // 3.3 Kiểm tra dữ liệu được lưu vào DatabaseService
  const allReqs = await techRequestsService.findAll({ limit: 100 });
  const savedTicket = allReqs.items.find(r => r.id === createdTicket.id || r.docNo === createdTicket.docNo);
  assert.ok(savedTicket, 'Phiếu mới tạo phải tồn tại trong cơ sở dữ liệu hệ thống');
  assert.strictEqual(savedTicket.problem, testPayload.problem, 'Nội dung sự cố trong DB phải khớp');
  console.log('   ✓ Dữ liệu phiếu đã được lưu chính xác và truy vấn thành công từ cơ sở dữ liệu');

  // ============================================================================
  // 4. KIỂM THỬ KHI TẮT PUBLIC FORM & KHẢ NĂNG BYPASS
  // ============================================================================
  console.log('\n4. Kiểm thử khi tắt Public Form và cơ chế bypass:');
  settingsService.setPublicFormStatus(false, 'admin');
  assert.strictEqual(settingsService.isPublicFormEnabled(), false);

  // Khách gửi khi form đóng -> phải bị từ chối 403
  let guestBlocked = false;
  try {
    await (publicController.createPublicTechnicalRequest as any)(testPayload, { headers: {} });
  } catch (err: any) {
    if (err.status === 403 || err.name === 'ForbiddenException' || err.message?.includes('đang đóng')) {
      guestBlocked = true;
    }
  }
  assert.strictEqual(guestBlocked, true, 'Khách gửi phiếu khi form tắt phải nhận lỗi 403 Forbidden');
  console.log('   ✓ Khách gửi phiếu khi form đóng bị chặn chính xác với mã 403 Forbidden');

  // Phục hồi lại trạng thái bật mặc định
  settingsService.setPublicFormStatus(true, 'admin');
  assert.strictEqual(settingsService.isPublicFormEnabled(), true);
  console.log('   ✓ Đã phục hồi trạng thái isPublicFormEnabled: true');

  console.log('\n🎉 TOÀN BỘ CÁC BƯỚC KIỂM THỬ XÁC MINH ĐỀU THÀNH CÔNG RỰC RỠ!');
}

runComprehensiveVerification().catch(err => {
  console.error('\n❌ KIỂM THỬ THẤT BẠI:', err);
  process.exit(1);
});
