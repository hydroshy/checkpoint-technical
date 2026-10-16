import * as assert from 'assert';
import { JSDOM } from 'jsdom';
import { I18N_DICTIONARY, I18N_CLIENT_SCRIPT } from '../src/views/common/i18n';
import { SETTINGS_MODAL_HTML } from '../src/views/common/modals/settings-modal.component';
import { DASHBOARD_HEADER_HTML } from '../src/views/dashboard/components/layouts/header.component';
import { CP_HEADER_HTML } from '../src/views/control-panel/components/layouts/header.component';
import { DASHBOARD_NAV_HTML } from '../src/views/dashboard/components/layouts/navigation.component';
import { CP_SIDEBAR_HTML } from '../src/views/control-panel/components/layouts/sidebar.component';
import { CP_ENTITY_MODALS_HTML } from '../src/views/control-panel/components/modals/entity-modals.component';
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { DASHBOARD_SCRIPT } from '../src/views/dashboard/scripts/dashboard.script';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';

console.log('================================================================');
console.log('🧪 TEST SUITE: FRONTEND i18n EN/VI, RBAC, SETTINGS & CPST 4M');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. Kiểm tra Hệ thống Đa ngôn ngữ (i18n)
// -------------------------------------------------------------
console.log('--- 1. Kiểm tra Hệ thống Đa ngôn ngữ EN / VI ---');

assert.ok(I18N_DICTIONARY, 'I18N_DICTIONARY phải tồn tại');
assert.ok(I18N_DICTIONARY['common.dashboard'], 'Phải có từ khóa common.dashboard');
assert.strictEqual(I18N_DICTIONARY['common.dashboard'].en, 'Dashboard');
assert.strictEqual(I18N_DICTIONARY['common.dashboard'].vi, 'Bảng Điều Khiển');

// Default Language phải là 'en'
assert.ok(I18N_CLIENT_SCRIPT.includes("__savedLang = 'en'"), "Mặc định ngôn ngữ phải là 'en'");
assert.ok(I18N_CLIENT_SCRIPT.includes("localStorage.setItem('checkpoint_lang', 'en')"), "Phải lưu ngôn ngữ mặc định vào localStorage");

// Nút chọn ngôn ngữ EN/VI trong Header của cả Dashboard và Control Panel
assert.ok(DASHBOARD_HEADER_HTML.includes("setLanguage('en')"), "Dashboard Header phải có nút chọn EN");
assert.ok(DASHBOARD_HEADER_HTML.includes("setLanguage('vi')"), "Dashboard Header phải có nút chọn VI");
assert.ok(CP_HEADER_HTML.includes("setLanguage('en')"), "Control Panel Header phải có nút chọn EN");
assert.ok(CP_HEADER_HTML.includes("setLanguage('vi')"), "Control Panel Header phải có nút chọn VI");

// Tồn tại hàm t() và setLanguage() trong script của cả 2 trang
assert.ok(DASHBOARD_SCRIPT.includes('const setLanguage ='), 'DASHBOARD_SCRIPT phải có hàm setLanguage');
assert.ok(DASHBOARD_SCRIPT.includes('const t ='), 'DASHBOARD_SCRIPT phải có hàm t');
assert.ok(CONTROL_PANEL_SCRIPT.includes('const setLanguage ='), 'CONTROL_PANEL_SCRIPT phải có hàm setLanguage');
assert.ok(CONTROL_PANEL_SCRIPT.includes('const t ='), 'CONTROL_PANEL_SCRIPT phải có hàm t');

console.log('  ✅ [PASS] Mặc định ngôn ngữ EN, lưu localStorage, nút toggle EN/VI và helper t() hợp lệ 100%\n');

// -------------------------------------------------------------
// 2. Kiểm tra Phân quyền giao diện & Điều hướng EMPLOYEE
// -------------------------------------------------------------
console.log('--- 2. Kiểm tra Phân quyền giao diện EMPLOYEE & Chặn Control Panel ---');

// Dashboard Header phải ẩn nút Control Panel bằng v-if="canAccessControlPanel"
assert.ok(
  DASHBOARD_HEADER_HTML.includes('v-if="canAccessControlPanel"') && DASHBOARD_HEADER_HTML.includes('href="/control-panel"'),
  'Nút Control Panel trong Dashboard Header phải được bảo vệ bởi v-if="canAccessControlPanel"'
);

// canAccessControlPanel trong DASHBOARD_SCRIPT phải chặn triệt để vai trò EMPLOYEE
assert.ok(
  DASHBOARD_SCRIPT.includes("if (u.role === 'EMPLOYEE') return false;"),
  "canAccessControlPanel phải return false ngay lập tức nếu role là EMPLOYEE"
);

// Control Panel HTML phải có Early RBAC Guard chặn EMPLOYEE
assert.ok(
  CONTROL_PANEL_HTML.includes("u.role === 'EMPLOYEE'") && CONTROL_PANEL_HTML.includes("window.location.replace('/dashboard')"),
  "Control Panel HTML phải có script điều hướng về /dashboard nếu employee cố truy cập"
);

// Control Panel Script phải kiểm tra sessionUser và chuyển hướng về /dashboard
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("sessionUser.role === 'EMPLOYEE'") && CONTROL_PANEL_SCRIPT.includes("window.location.replace('/dashboard')"),
  "Control Panel Script phải chuyển hướng về /dashboard khi sessionUser có role là EMPLOYEE"
);

console.log('  ✅ [PASS] Ẩn nút Control Panel với EMPLOYEE, tự động chuyển hướng về /dashboard khi truy cập\n');

// -------------------------------------------------------------
// 3. Kiểm tra Modal Settings đổi mật khẩu & Admin Reset Password
// -------------------------------------------------------------
console.log('--- 3. Kiểm tra Modal Settings đổi mật khẩu & Admin Reset Password ---');

// Settings modal HTML tồn tại và chứa đầy đủ các trường yêu cầu
assert.ok(SETTINGS_MODAL_HTML.includes('id="modal-user-settings"'), 'Modal user settings phải có id modal-user-settings');
assert.ok(SETTINGS_MODAL_HTML.includes('v-model="settingsForm.oldPassword"'), 'Modal settings phải có trường mật khẩu hiện tại oldPassword');
assert.ok(SETTINGS_MODAL_HTML.includes('v-model="settingsForm.newPassword"'), 'Modal settings phải có trường mật khẩu mới newPassword');
assert.ok(SETTINGS_MODAL_HTML.includes('v-model="settingsForm.confirmPassword"'), 'Modal settings phải có trường xác nhận mật khẩu confirmPassword');
assert.ok(SETTINGS_MODAL_HTML.includes('@submit.prevent="submitChangePassword"'), 'Modal settings phải có submit handler submitChangePassword');

// Nút mở Settings trong dropdown user menu
assert.ok(DASHBOARD_HEADER_HTML.includes('openSettingsModal'), 'Dashboard Header phải có nút gọi openSettingsModal');
assert.ok(CP_HEADER_HTML.includes('openSettingsModal'), 'Control Panel Header phải có nút gọi openSettingsModal');

// Modal Settings được đính kèm vào cả Dashboard View và Control Panel View
assert.ok(DASHBOARD_HTML.includes('modal-user-settings'), 'DASHBOARD_HTML phải chứa modal user settings');
assert.ok(CONTROL_PANEL_HTML.includes('modal-user-settings'), 'CONTROL_PANEL_HTML phải chứa modal user settings');

// Logic đổi mật khẩu cá nhân trong scripts
assert.ok(DASHBOARD_SCRIPT.includes('submitChangePassword'), 'DASHBOARD_SCRIPT phải có hàm submitChangePassword');
assert.ok(DASHBOARD_SCRIPT.includes('/auth/change-password'), 'DASHBOARD_SCRIPT phải gọi API /auth/change-password');
assert.ok(CONTROL_PANEL_SCRIPT.includes('submitChangePassword'), 'CONTROL_PANEL_SCRIPT phải có hàm submitChangePassword');
assert.ok(CONTROL_PANEL_SCRIPT.includes('/auth/change-password'), 'CONTROL_PANEL_SCRIPT phải gọi API /auth/change-password');

// Nút và Modal Reset Password cho Admin trong Bảng Quản Lý Users
assert.ok(CP_ENTITY_MODALS_HTML.includes('id="modal-reset-user-password"'), 'CP_ENTITY_MODALS_HTML phải có modal-reset-user-password');
assert.ok(CP_ENTITY_MODALS_HTML.includes('v-model="resetPasswordForm.newPassword"'), 'Reset Password Modal phải có input newPassword');
assert.ok(CP_ENTITY_MODALS_HTML.includes('submitResetUserPassword'), 'Reset Password Modal phải có hàm submitResetUserPassword');

// Nút reset password trong Tabulator Users
assert.ok(CONTROL_PANEL_SCRIPT.includes('btn-user-reset-pwd'), 'Bảng Tabulator Users phải có nút btn-user-reset-pwd');
assert.ok(CONTROL_PANEL_SCRIPT.includes('openResetPasswordModal'), 'Click vào btn-user-reset-pwd phải gọi openResetPasswordModal');
assert.ok(CONTROL_PANEL_SCRIPT.includes('/reset-password'), 'Hàm reset password phải gọi endpoint /reset-password');

console.log('  ✅ [PASS] Modal Settings đổi mật khẩu cho user & Nút Reset Password cho admin hoạt động chuẩn xác\n');

// -------------------------------------------------------------
// 4. Kiểm tra Option "System / Process" cho Phiếu CPST (4M)
// -------------------------------------------------------------
console.log('--- 4. Kiểm tra Option "System / Process" trong Phiếu CPST và Modal Sửa ---');

// Form CPST độc lập (/technical-feedback)
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes('<option value="System / Process">'),
  'Form CPST (/technical-feedback) phải có option value="System / Process"'
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("'System / Process'"),
  'Form CPST phải cập nhật danh sách loại trừ 4M bao gồm System / Process'
);

// Modal Chỉnh Sửa Phiếu (Edit Modal trong Control Panel)
assert.ok(
  CP_EDIT_MODAL_HTML.includes('<option value="System / Process">'),
  'Edit Modal trong Control Panel phải có option value="System / Process"'
);
assert.ok(
  CP_EDIT_MODAL_HTML.includes("'System / Process'"),
  'Edit Modal phải cập nhật danh sách loại trừ 4M bao gồm System / Process'
);

// Thống kê & hiển thị 4M trong Control Panel & Dashboard
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("'SYSTEM / PROCESS': 'Hệ thống / Quy trình (System / Process)'") ||
  CONTROL_PANEL_SCRIPT.includes("lower.includes('system') || lower.includes('process')"),
  'Control Panel Script phải xử lý System / Process trong thống kê 4M'
);
assert.ok(
  DASHBOARD_SCRIPT.includes("lower.includes('system') || lower.includes('process')"),
  'Dashboard Script phải xử lý System / Process trong thống kê 4M'
);

console.log('  ✅ [PASS] Option "System / Process" đã được tích hợp đầy đủ vào form CPST, modal sửa và thống kê 4M\n');

console.log('================================================================');
console.log('🎉 TẤT CẢ CÁC MỤC KIỂM THỬ FRONTEND ĐÃ VƯỢT QUA 100% THÀNH CÔNG!');
console.log('================================================================');
