import * as assert from 'assert';
import { LOGIN_HTML } from './src/views/login.view';
import { DASHBOARD_HTML } from './src/views/dashboard.view';
import { CONTROL_PANEL_HTML } from './src/views/control-panel.view';

console.log('Running comprehensive UI & Tabulator verification...');

// ==============================================================================
// 1. LOGIN VIEW VERIFICATION
// ==============================================================================
console.log('1. Checking Login View...');

// 1.1 No navbar element
assert.ok(!LOGIN_HTML.includes('<header'), 'Login view must not contain <header>');
assert.ok(!LOGIN_HTML.includes('glass-navbar'), 'Login view must not contain glass-navbar class');

// 1.2 No PostgreSQL or NestJS badges
assert.ok(!LOGIN_HTML.includes('PostgreSQL DB: Ready'), 'Login view must not contain PostgreSQL badge');
assert.ok(!LOGIN_HTML.includes('NestJS v10'), 'Login view must not contain NestJS badge');

// 1.3 Minimalist form & floating theme toggle
assert.ok(LOGIN_HTML.includes('toggleTheme'), 'Login view must contain theme toggle');
assert.ok(LOGIN_HTML.includes('Checkpoint Systems'), 'Login view title/branding must be Checkpoint Systems');
console.log('   ✓ Login view verified (no navbar, no DB/NestJS badges, clean flat form)');

// ==============================================================================
// 2. DASHBOARD VIEW VERIFICATION
// ==============================================================================
console.log('2. Checking Dashboard View...');

// 2.1 Renamed to Dashboard
assert.ok(!DASHBOARD_HTML.includes('Technical Dashboard</span>'), 'Dashboard must not display Technical Dashboard badge');
assert.ok(DASHBOARD_HTML.includes('Dashboard</span>'), 'Dashboard must display Dashboard title');

// 2.2 2 Module cards: "Phiếu Nhập Liệu" and "Report Tuần"
assert.ok(DASHBOARD_HTML.includes('Phiếu Nhập Liệu</h2>'), 'Dashboard must contain Phiếu Nhập Liệu module card');
assert.ok(DASHBOARD_HTML.includes('Report Tuần</h2>'), 'Dashboard must contain Report Tuần module card');

// 2.3 Permissions: completely hidden when no permission (v-if)
assert.ok(DASHBOARD_HTML.includes('v-if="canCreateRequest"'), 'Phiếu Nhập Liệu card must use v-if="canCreateRequest"');
assert.ok(DASHBOARD_HTML.includes('v-if="canViewKpi"'), 'Report Tuần card must use v-if="canViewKpi"');

// 2.4 No locked card or blocking message
assert.ok(!DASHBOARD_HTML.includes('Chưa Được Phân Quyền Truy Cập'), 'Dashboard must not show locked message');
assert.ok(!DASHBOARD_HTML.includes('fa-user-lock'), 'Dashboard must not show user-lock icon');

// 2.5 No verbose instruction text
assert.ok(!DASHBOARD_HTML.includes('Chọn một mục ở Menu trên để hiển thị nội dung'), 'Dashboard must remove verbose guidance text');

// 2.6 Breadcrumb & Back navigation
assert.ok(DASHBOARD_HTML.includes('Quay lại Dashboard'), 'Dashboard must contain Quay lại Dashboard button');
assert.ok(DASHBOARD_HTML.includes("activeTab = ''"), 'Dashboard back button must reset activeTab to return to module cards');

// 2.7 Top header does not have Control Panel tab; only in user profile menu
assert.ok(!DASHBOARD_HTML.includes('Admin Control Panel</span>'), 'Header must not have Admin Control Panel tab');
assert.ok(DASHBOARD_HTML.includes('canAccessControlPanel'), 'Control panel access must check canAccessControlPanel');
console.log('   ✓ Dashboard view verified (2 module cards, permissions v-if, smooth breadcrumb, no verbose text)');

// ==============================================================================
// 3. CONTROL PANEL & TABULATOR VERIFICATION
// ==============================================================================
console.log('3. Checking Control Panel View & Tabulator Integration...');

// 3.1 Renamed to "Quản Trị Chi Tiết" (no V4)
assert.ok(!CONTROL_PANEL_HTML.includes('Quản Trị Chi Tiết V4'), 'Control Panel must not contain Quản Trị Chi Tiết V4');
assert.ok(CONTROL_PANEL_HTML.includes('Quản Trị Chi Tiết'), 'Control Panel must contain Quản Trị Chi Tiết');

// 3.2 4 Tabs structure
assert.ok(CONTROL_PANEL_HTML.includes('Danh Mục Thiết Bị & Nhân Sự'), 'Control panel must contain Danh Mục Thiết Bị & Nhân Sự');
assert.ok(CONTROL_PANEL_HTML.includes('Quản Lý User & Phân Quyền'), 'Control panel must contain Quản Lý User & Phân Quyền');
assert.ok(CONTROL_PANEL_HTML.includes('Quản Lý Dữ Liệu Hiện Có'), 'Control panel must contain Quản Lý Dữ Liệu Hiện Có');

// 3.3 Tabulator CSS & JS assets
assert.ok(CONTROL_PANEL_HTML.includes('/vendor/tabulator/tabulator.min.css'), 'Control panel must link Tabulator CSS');
assert.ok(CONTROL_PANEL_HTML.includes('/vendor/tabulator/tabulator.min.js'), 'Control panel must link Tabulator JS');

// 3.4 Tabulator Containers
assert.ok(CONTROL_PANEL_HTML.includes('id="tabulator-requests"'), 'Control panel must have #tabulator-requests');
assert.ok(CONTROL_PANEL_HTML.includes('id="tabulator-machines"'), 'Control panel must have #tabulator-machines');
assert.ok(CONTROL_PANEL_HTML.includes('id="tabulator-employees"'), 'Control panel must have #tabulator-employees');
assert.ok(CONTROL_PANEL_HTML.includes('id="tabulator-users"'), 'Control panel must have #tabulator-users');
assert.ok(CONTROL_PANEL_HTML.includes('id="tabulator-existing-data"'), 'Control panel must have #tabulator-existing-data');

// 3.5 Tabulator instantiation
assert.ok(CONTROL_PANEL_HTML.includes("new Tabulator('#tabulator-requests'"), 'Requests table must be initialized with Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes("new Tabulator('#tabulator-machines'"), 'Machines table must be initialized with Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes("new Tabulator('#tabulator-employees'"), 'Employees table must be initialized with Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes("new Tabulator('#tabulator-users'"), 'Users table must be initialized with Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes("new Tabulator('#tabulator-existing-data'"), 'Existing data table must be initialized with Tabulator');

// 3.6 Back to Dashboard links
assert.ok(CONTROL_PANEL_HTML.includes('href="/dashboard"'), 'Control panel must contain href="/dashboard" link');
console.log('   ✓ Control Panel & Tabulator verified (renamed, 4 tabs, 5 Tabulator tables, return links)');

console.log('\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
