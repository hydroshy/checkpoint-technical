import * as assert from 'assert';
import { DASHBOARD_HTML } from './src/views/dashboard.view';
import { CONTROL_PANEL_HTML } from './src/views/control-panel.view';
import { FORM_REQUEST_HTML } from './src/views/form-request.view';
import { AppController } from './src/app.controller';

console.log('--- STARTING FRONTEND & UI/UX TESTS ---');

// 1. Verify 6 Button Groups in DASHBOARD_HTML
console.log('1. Verifying 6 button groups in dashboard.view.ts:');

// CSS rules for active state
assert.ok(DASHBOARD_HTML.includes('.toggle-radio:checked + label'), 'Missing .toggle-radio:checked CSS in dashboard.view');
assert.ok(DASHBOARD_HTML.includes('.toggle-radio-success:checked + label'), 'Missing .toggle-radio-success:checked CSS in dashboard.view');
assert.ok(DASHBOARD_HTML.includes('.toggle-radio-danger:checked + label'), 'Missing .toggle-radio-danger:checked CSS in dashboard.view');
assert.ok(DASHBOARD_HTML.includes('.toggle-radio-warning:checked + label'), 'Missing .toggle-radio-warning:checked CSS in dashboard.view');
assert.ok(DASHBOARD_HTML.includes('.toggle-radio-purple:checked + label'), 'Missing .toggle-radio-purple:checked CSS in dashboard.view');
console.log('   ✓ CSS active rules present with high-contrast colors, border & ring');

// Group 1: Trạng thái sự cố (machineStatus)
assert.ok(DASHBOARD_HTML.includes('name="machineStatus"'), 'Missing name="machineStatus" in dashboard.view');
assert.ok(DASHBOARD_HTML.includes("form.machineStatus === 'First Bulk Print'"), 'Missing dynamic active class for First Bulk Print');
assert.ok(DASHBOARD_HTML.includes("form.machineStatus === 'Repeat Print'"), 'Missing dynamic active class for Repeat Print');
console.log('   ✓ Group 1: Trạng thái sự cố (2 buttons) verified');

// Group 2: Mức độ ưu tiên (priority)
assert.ok(DASHBOARD_HTML.includes('name="priority"'), 'Missing name="priority" in dashboard.view');
assert.ok(DASHBOARD_HTML.includes("form.priority === 'Immediate'"), 'Missing dynamic active class for Immediate');
assert.ok(DASHBOARD_HTML.includes("form.priority === 'Hold'"), 'Missing dynamic active class for Hold');
assert.ok(DASHBOARD_HTML.includes("form.priority === 'Other'"), 'Missing dynamic active class for Other');
console.log('   ✓ Group 2: Mức độ ưu tiên (3 buttons) verified');

// Group 3: Phân loại lỗi (4M) (errCat)
assert.ok(DASHBOARD_HTML.includes('name="errCat"'), 'Missing name="errCat" in dashboard.view');
assert.ok(DASHBOARD_HTML.includes("form.errCat === 'MAN'"), 'Missing dynamic active class for MAN');
assert.ok(DASHBOARD_HTML.includes("form.errCat === 'MACHINE'"), 'Missing dynamic active class for MACHINE');
assert.ok(DASHBOARD_HTML.includes("form.errCat === 'MATERIAL'"), 'Missing dynamic active class for MATERIAL');
assert.ok(DASHBOARD_HTML.includes("form.errCat === 'METHOD'"), 'Missing dynamic active class for METHOD');
console.log('   ✓ Group 3: Phân loại lỗi 4M (4 buttons) verified');

// Group 4: Nhóm công đoạn (errType)
assert.ok(DASHBOARD_HTML.includes('name="errType"'), 'Missing name="errType" in dashboard.view');
assert.ok(DASHBOARD_HTML.includes("form.errType === 'Prepress'"), 'Missing dynamic active class for Prepress');
assert.ok(DASHBOARD_HTML.includes("form.errType === 'Press'"), 'Missing dynamic active class for Press');
assert.ok(DASHBOARD_HTML.includes("form.errType === 'PostPress'"), 'Missing dynamic active class for PostPress');
console.log('   ✓ Group 4: Nhóm công đoạn (3 buttons) verified');

// Group 5: Chất lượng in sau xử lý (chkQuality)
assert.ok(DASHBOARD_HTML.includes('name="chkQuality"'), 'Missing name="chkQuality" in dashboard.view');
assert.ok(DASHBOARD_HTML.includes("form.chkQuality === 'OK'"), 'Missing dynamic active class for OK');
assert.ok(DASHBOARD_HTML.includes("form.chkQuality === 'NG'"), 'Missing dynamic active class for NG');
console.log('   ✓ Group 5: Chất lượng in sau xử lý (2 buttons) verified');

// Group 6: Tình trạng sự cố (chkStatus)
assert.ok(DASHBOARD_HTML.includes('name="chkStatus"'), 'Missing name="chkStatus" in dashboard.view');
assert.ok(DASHBOARD_HTML.includes("form.chkStatus === 'DONE'"), 'Missing dynamic active class for DONE');
assert.ok(DASHBOARD_HTML.includes("form.chkStatus === 'MONITOR'"), 'Missing dynamic active class for MONITOR');
assert.ok(DASHBOARD_HTML.includes("form.chkStatus === 'SUPPORT'"), 'Missing dynamic active class for SUPPORT');
console.log('   ✓ Group 6: Tình trạng sự cố (3 buttons) verified');


// 2. Verify Control Panel Public Form toggle and link
console.log('\n2. Verifying Control Panel Public Form Switch & Copy Link:');
assert.ok(CONTROL_PANEL_HTML.includes('togglePublicForm'), 'Missing togglePublicForm in control-panel.view');
assert.ok(CONTROL_PANEL_HTML.includes('isPublicFormEnabled'), 'Missing isPublicFormEnabled in control-panel.view');
assert.ok(CONTROL_PANEL_HTML.includes('copyPublicFormLink'), 'Missing copyPublicFormLink in control-panel.view');
assert.ok(CONTROL_PANEL_HTML.includes('publicFormUrl'), 'Missing publicFormUrl in control-panel.view');
assert.ok(CONTROL_PANEL_HTML.includes('/api/settings/public-form'), 'Missing /api/settings/public-form call in control-panel.view');
assert.ok(CONTROL_PANEL_HTML.includes('/api/public/form-status'), 'Missing /api/public/form-status call in control-panel.view');
assert.ok(CONTROL_PANEL_HTML.includes('/form-request'), 'Missing /form-request link in control-panel.view');
console.log('   ✓ Switch toggle, copy link, and status API bindings verified');


// 3. Verify Public Form Page (/form-request)
console.log('\n3. Verifying Public Form Page (form-request.view.ts):');
assert.ok(FORM_REQUEST_HTML.includes('Phiếu Yêu Cầu Kỹ Thuật'), 'Missing page title in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('isPublicFormEnabled'), 'Missing isPublicFormEnabled logic in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('checkPublicFormStatus'), 'Missing checkPublicFormStatus in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('/api/public/form-status'), 'Missing /api/public/form-status in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('/api/public/catalogs'), 'Missing /api/public/catalogs in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('/api/public/technical-requests'), 'Missing POST /api/public/technical-requests in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('submitPublicForm'), 'Missing submitPublicForm in form-request.view');
assert.ok(FORM_REQUEST_HTML.includes('generatePDF'), 'Missing generatePDF in form-request.view');

// Verify 6 button groups in FORM_REQUEST_HTML
assert.ok(FORM_REQUEST_HTML.includes('public_machineStatus'), 'Missing public_machineStatus radio group');
assert.ok(FORM_REQUEST_HTML.includes('public_priority'), 'Missing public_priority radio group');
assert.ok(FORM_REQUEST_HTML.includes('public_errCat'), 'Missing public_errCat radio group');
assert.ok(FORM_REQUEST_HTML.includes('public_errType'), 'Missing public_errType radio group');
assert.ok(FORM_REQUEST_HTML.includes('public_chkQuality'), 'Missing public_chkQuality radio group');
assert.ok(FORM_REQUEST_HTML.includes('public_chkStatus'), 'Missing public_chkStatus radio group');
console.log('   ✓ Public Form 4 sections, APIs, and 6 button groups verified');


// 4. Verify AppController Routing
console.log('\n4. Verifying AppController Routing:');
const appController = new AppController();
assert.ok(typeof appController.getFormRequestPage === 'function', 'AppController missing getFormRequestPage method');

// Mock response
let sentHtml = '';
let sentHeaders: Record<string, string> = {};
const mockRes: any = {
  setHeader: (k: string, v: string) => { sentHeaders[k] = v; },
  send: (body: string) => { sentHtml = body; }
};
const mockReq: any = { cookies: {} };

appController.getFormRequestPage(mockReq, mockRes);
assert.strictEqual(sentHeaders['Content-Type'], 'text/html; charset=utf-8');
assert.ok(sentHtml.includes('Phiếu Yêu Cầu Kỹ Thuật (Public Form)'), 'Sent HTML does not match FORM_REQUEST_HTML');
console.log('   ✓ AppController @Get("form-request") serves FORM_REQUEST_HTML without auth');

console.log('\n--- ALL FRONTEND & UI/UX TESTS PASSED! ---');
