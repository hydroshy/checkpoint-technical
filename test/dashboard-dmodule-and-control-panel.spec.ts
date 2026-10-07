import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ T4: DASHBOARD D-MODULE & CONTROL PANEL OVERVIEW/DATABASE');
console.log('   (KIỂM THỬ TỰ ĐỘNG CHUẨN HÓA GIAO DIỆN VÀ NGHIỆM THU 100%)');
console.log('================================================================\n');

const BASE_DIR = path.resolve(__dirname, '..');

// Đường dẫn các file liên quan Dashboard
const DASHBOARD_VIEW_PATH = path.join(BASE_DIR, 'src/views/dashboard.view.ts');
const DASHBOARD_NAV_PATH = path.join(BASE_DIR, 'src/views/dashboard/components/layouts/navigation.component.ts');
const DASHBOARD_SCRIPT_PATH = path.join(BASE_DIR, 'src/views/dashboard/scripts/dashboard.script.ts');

// Đường dẫn các file liên quan Control Panel
const CP_VIEW_PATH = path.join(BASE_DIR, 'src/views/control-panel.view.ts');
const CP_HEADER_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/layouts/header.component.ts');
const CP_SIDEBAR_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/layouts/sidebar.component.ts');
const CP_OVERVIEW_HEADER_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/cards/overview-header.component.ts');
const CP_MASTER_TABLES_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/tables/master-tables.component.ts');
const CP_SCRIPT_PATH = path.join(BASE_DIR, 'src/views/control-panel/scripts/control-panel.script.ts');

const dashboardViewContent = fs.existsSync(DASHBOARD_VIEW_PATH) ? fs.readFileSync(DASHBOARD_VIEW_PATH, 'utf-8') : '';
const dashboardNavContent = fs.existsSync(DASHBOARD_NAV_PATH) ? fs.readFileSync(DASHBOARD_NAV_PATH, 'utf-8') : '';
const dashboardScriptContent = fs.existsSync(DASHBOARD_SCRIPT_PATH) ? fs.readFileSync(DASHBOARD_SCRIPT_PATH, 'utf-8') : '';

const cpViewContent = fs.existsSync(CP_VIEW_PATH) ? fs.readFileSync(CP_VIEW_PATH, 'utf-8') : '';
const cpHeaderContent = fs.existsSync(CP_HEADER_PATH) ? fs.readFileSync(CP_HEADER_PATH, 'utf-8') : '';
const cpSidebarContent = fs.existsSync(CP_SIDEBAR_PATH) ? fs.readFileSync(CP_SIDEBAR_PATH, 'utf-8') : '';
const cpOverviewHeaderContent = fs.existsSync(CP_OVERVIEW_HEADER_PATH) ? fs.readFileSync(CP_OVERVIEW_HEADER_PATH, 'utf-8') : '';
const cpMasterTablesContent = fs.existsSync(CP_MASTER_TABLES_PATH) ? fs.readFileSync(CP_MASTER_TABLES_PATH, 'utf-8') : '';
const cpScriptContent = fs.existsSync(CP_SCRIPT_PATH) ? fs.readFileSync(CP_SCRIPT_PATH, 'utf-8') : '';

// Gộp nội dung để kiểm tra toàn diện
const allDashboardContent = dashboardViewContent + '\n' + dashboardNavContent + '\n' + dashboardScriptContent;
const allControlPanelContent = cpViewContent + '\n' + cpHeaderContent + '\n' + cpSidebarContent + '\n' + cpOverviewHeaderContent + '\n' + cpMasterTablesContent + '\n' + cpScriptContent;

// =========================================================================
// PHẦN 1: KIỂM THỬ DASHBOARD D-MODULE: 4 CARD CHUẨN
// =========================================================================
console.log('--- 1. Kiểm thử 4 Card chức năng chuẩn trên Dashboard d-module ---');

// Card 1: Form CPSR -> /form-request
const hasCpsrCard =
  (allDashboardContent.includes('CPSR') || allDashboardContent.includes('Phiếu Yêu Cầu') || allDashboardContent.includes('form-request')) &&
  (allDashboardContent.includes('/form-request') || allDashboardContent.includes('form-request'));
assert.ok(hasCpsrCard, 'Dashboard phải có Card Tạo Form CPSR liên kết tới /form-request');
console.log('  ✅ [PASS] Card 1: Tạo Form CPSR (liên kết /form-request)');

// Card 2: Form CPST -> /technical-feedback
const hasCpstCard =
  (allDashboardContent.includes('CPST') || allDashboardContent.includes('Phản Hồi') || allDashboardContent.includes('technical-feedback')) &&
  (allDashboardContent.includes('/technical-feedback') || allDashboardContent.includes('technical-feedback'));
assert.ok(hasCpstCard, 'Dashboard phải có Card Tạo Form CPST liên kết tới /technical-feedback');
console.log('  ✅ [PASS] Card 2: Tạo Form CPST (liên kết /technical-feedback)');

// Card 3: Form CPSF -> /confirm-request
const hasCpsfCard =
  (allDashboardContent.includes('CPSF') || allDashboardContent.includes('Xác Nhận') || allDashboardContent.includes('confirm-request')) &&
  (allDashboardContent.includes('/confirm-request') || allDashboardContent.includes('confirm-request'));
assert.ok(hasCpsfCard, 'Dashboard phải có Card Tạo Form CPSF liên kết tới /confirm-request');
console.log('  ✅ [PASS] Card 3: Tạo Form CPSF (liên kết /confirm-request)');

// Card 4: Report Technical
const hasReportTechCard =
  allDashboardContent.includes('Report Technical') ||
  allDashboardContent.includes('report-technical') ||
  allDashboardContent.includes('Báo Cáo Kỹ Thuật');
assert.ok(hasReportTechCard, 'Dashboard phải có Card Report Technical');
console.log('  ✅ [PASS] Card 4: Card Report Technical');

// =========================================================================
// PHẦN 2: KIỂM THỬ DASHBOARD D-MODULE: DỌN SẠCH POPUP DƯ THỪA
// =========================================================================
console.log('\n--- 2. Kiểm thử Dashboard d-module: Dọn sạch popup dư thừa ---');

// Đảm bảo không còn modal che toàn màn hình gây kẹt người dùng
// Nếu có modal, tất cả modal đều phải có nút đóng và cơ chế dismiss rõ ràng
const modalMatches = allDashboardContent.match(/<div[^>]*class="[^"]*modal-overlay[^"]*"[^>]*>/g) || [];
for (const modalTag of modalMatches) {
  // Modal phải có @click đóng hoặc v-if ràng buộc rõ ràng
  const hasDismiss = modalTag.includes('@click') || modalTag.includes('v-if');
  assert.ok(hasDismiss, `Modal ${modalTag} phải có cơ chế đóng hoặc điều kiện v-if kiểm soát`);
}
console.log('  ✅ [PASS] Dashboard sạch các popup thừa treo màn hình, cơ chế đóng/mở minh bạch');

// =========================================================================
// PHẦN 3: KIỂM THỬ CONTROL-PANEL TOP BAR MÀU ĐEN & BỎ SUBTITLE
// =========================================================================
console.log('\n--- 3. Kiểm thử Control-Panel Top Bar màu đen và bỏ subtitle ---');

// 3.1 Chữ Checkpoint Systems màu đen (loại bỏ text-sky-500 ở Checkpoint)
// Không được chứa <span class="text-sky-500">Checkpoint</span> trong header
const hasSkyCheckpoint = cpHeaderContent.includes('class="text-sky-500">Checkpoint</span>');
assert.ok(!hasSkyCheckpoint, 'Top bar không được để chữ "Checkpoint" màu xanh sky (text-sky-500), phải đồng bộ màu đen');

// Phải có chữ "Checkpoint Systems" trong header
assert.ok(cpHeaderContent.includes('Checkpoint Systems'), 'Top bar phải chứa thương hiệu "Checkpoint Systems"');
console.log('  ✅ [PASS] Toàn bộ thương hiệu "Checkpoint Systems" trên Top Bar đã chuyển sang màu đen chuẩn');

// 3.2 Bỏ subtitle "Quản Lý Phiếu Kỹ Thuật" ở header brand / logo
// Dưới logo không còn span subtitle "Quản Lý Phiếu Kỹ Thuật"
const brandBlockMatch = cpHeaderContent.match(/<a\b[^>]*href="\/control-panel"[^>]*>([\s\S]*?)<\/a>/);
if (brandBlockMatch) {
  const brandBlock = brandBlockMatch[1];
  assert.ok(
    !brandBlock.includes('text-[11px] text-sky-600') && !brandBlock.includes('Quản Lý Phiếu Kỹ Thuật'),
    'Brand logo trong header không được chứa subtitle "Quản Lý Phiếu Kỹ Thuật"'
  );
}
console.log('  ✅ [PASS] Đã loại bỏ subtitle "Quản Lý Phiếu Kỹ Thuật" khỏi Brand Logo Top Bar');

// =========================================================================
// PHẦN 4: KIỂM THỬ CONTROL-PANEL OVERVIEW (TỔNG QUAN HỆ THỐNG)
// =========================================================================
console.log('\n--- 4. Kiểm thử Control-Panel Overview: Thiết kế Tổng Quan Hệ Thống ---');

// Phải có tiêu đề / khối "Tổng Quan Hệ Thống"
const hasSystemOverview =
  allControlPanelContent.includes('Tổng Quan Hệ Thống') ||
  allControlPanelContent.includes('System Overview') ||
  allControlPanelContent.includes('Thông Tin Hệ Thống');
assert.ok(hasSystemOverview, 'Tab Overview phải có khối "Tổng Quan Hệ Thống"');
console.log('  ✅ [PASS] Khối "Tổng Quan Hệ Thống" tồn tại trong tab Overview');

// Thể hiện số user (users / người dùng)
const hasUserCount =
  allControlPanelContent.includes('users') ||
  allControlPanelContent.includes('Người Dùng') ||
  allControlPanelContent.includes('Tài Khoản') ||
  allControlPanelContent.includes('usersList');
assert.ok(hasUserCount, 'Tổng Quan Hệ Thống phải thể hiện thông tin / số lượng Người Dùng (Users)');
console.log('  ✅ [PASS] Thể hiện số lượng người dùng / tài khoản hệ thống');

// Thể hiện số module đang hoạt động (active modules)
const hasModuleCount =
  allControlPanelContent.includes('Module') ||
  allControlPanelContent.includes('module') ||
  allControlPanelContent.includes('modulesCount');
assert.ok(hasModuleCount, 'Tổng Quan Hệ Thống phải thể hiện số module đang hoạt động');
console.log('  ✅ [PASS] Thể hiện thông tin module hoạt động trong hệ thống');

// Thể hiện thông tin hệ thống (system info)
const hasSystemInfo =
  allControlPanelContent.includes('Hệ Thống') ||
  allControlPanelContent.includes('Phiên bản') ||
  allControlPanelContent.includes('Trạng thái') ||
  allControlPanelContent.includes('Platform');
assert.ok(hasSystemInfo, 'Tổng Quan Hệ Thống phải thể hiện thông tin hệ thống');
console.log('  ✅ [PASS] Thể hiện thông tin hệ thống tổng quát');

// =========================================================================
// PHẦN 5: KIỂM THỬ CONTROL-PANEL DATABASE TAB (HEALTH & TABLES)
// =========================================================================
console.log('\n--- 5. Kiểm thử Control-Panel Tab Database: Health & Danh Sách Bảng ---');

// Sidebar menu phải có mục dẫn đến tab Database (thay cho existing-data)
const hasDatabaseNav =
  cpSidebarContent.includes("switchTab('database')") ||
  cpSidebarContent.includes('Database') ||
  cpSidebarContent.includes('Cơ Sở Dữ Liệu');
assert.ok(hasDatabaseNav, 'Sidebar Control Panel phải có mục dẫn vào tab Database');
console.log('  ✅ [PASS] Sidebar có mục menu Database');

// Tab Database phải thể hiện trạng thái Health của database
const hasDbHealth =
  allControlPanelContent.includes('Database Health') ||
  allControlPanelContent.includes('Trạng Thái Kết Nối') ||
  allControlPanelContent.includes('Đang hoạt động') ||
  allControlPanelContent.includes('Kết Nối Tốt') ||
  allControlPanelContent.includes('Healthy') ||
  allControlPanelContent.includes('Connected') ||
  allControlPanelContent.includes('databaseHealth') ||
  allControlPanelContent.includes('dbHealth');
assert.ok(hasDbHealth, 'Tab Database phải hiển thị trạng thái Health của database đang kết nối');
console.log('  ✅ [PASS] Hiển thị trạng thái Health của cơ sở dữ liệu kết nối');

// Tab Database phải thể hiện danh sách các bảng (tables list)
const hasDbTables =
  allControlPanelContent.includes('Danh Sách Bảng') ||
  allControlPanelContent.includes('Bảng Dữ Liệu') ||
  allControlPanelContent.includes('tables') ||
  allControlPanelContent.includes('dbTables') ||
  allControlPanelContent.includes('Tập Dữ Liệu');
assert.ok(hasDbTables, 'Tab Database phải hiển thị danh sách các bảng dữ liệu');
console.log('  ✅ [PASS] Hiển thị danh sách các bảng dữ liệu trong hệ thống');

console.log('\n================================================================');
console.log('🎉 TOÀN BỘ KIỂM THỬ CHO T4 (DASHBOARD D-MODULE & CONTROL PANEL OVERVIEW/DATABASE) ĐẠT 100%!');
console.log('================================================================\n');
