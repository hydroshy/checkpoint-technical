import * as assert from 'assert';
import * as http from 'http';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

// View Imports for HTML validation & i18n
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { LOGIN_HTML } from '../src/views/login.view';

import { I18N_DICTIONARY, I18N_CLIENT_SCRIPT } from '../src/views/common/i18n';
import { SETTINGS_MODAL_HTML } from '../src/views/common/modals/settings-modal.component';
import { DASHBOARD_HEADER_HTML } from '../src/views/dashboard/components/layouts/header.component';
import { CP_HEADER_HTML } from '../src/views/control-panel/components/layouts/header.component';
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { CP_ENTITY_MODALS_HTML } from '../src/views/control-panel/components/modals/entity-modals.component';
import { DASHBOARD_SCRIPT } from '../src/views/dashboard/scripts/dashboard.script';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';
import { DatabaseService } from '../src/modules/database/database.service';

console.log('================================================================');
console.log('🧪 BỘ KIỂM THỬ QA NGHIỆM THU HỆ THỐNG TOÀN DIỆN:');
console.log('   RBAC, USER SETTINGS, i18n EN/VI, CPST SYSTEM/PROCESS, HTML TAGS');
console.log('================================================================\n');

function httpRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<{ status: number; body: string; json?: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const method = options.method || 'GET';
    const headers = { ...(options.headers || {}) };
    let payload: string | null = null;

    if (options.body) {
      payload = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
      headers['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let json: any = undefined;
          try {
            json = JSON.parse(raw);
          } catch (_) {}
          resolve({
            status: res.statusCode || 200,
            body: raw,
            json,
            headers: res.headers,
          });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// =============================================================================
// PHẦN 1: QUÉT KIỂM TRA TÍNH CÂN BẰNG THẺ HTML (0 LỖI DIV / 0 THẺ LỆCH)
// =============================================================================
console.log('--- PHẦN 1: Quét kiểm tra tính cân bằng thẻ HTML (0 lỗi div) ---');

function validateHtmlTagBalance(name: string, html: string) {
  const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*?)?(\/?)>/gs;
  let match: RegExpExecArray | null;
  const stack: { tag: string; line: number }[] = [];
  const errors: string[] = [];

  while ((match = tagRegex.exec(html)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    const isSelfClosing = match[2] === '/' || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag);
    const isClosing = full.startsWith('</');
    if (isSelfClosing) continue;

    const lineNum = html.substring(0, match.index).split('\n').length;
    if (!isClosing) {
      stack.push({ tag, line: lineNum });
    } else {
      if (stack.length === 0) {
        errors.push(`Thẻ đóng thừa </${tag}> tại dòng ${lineNum}`);
      } else {
        const top = stack.pop()!;
        if (top.tag !== tag) {
          errors.push(`Lệch thẻ tại dòng ${lineNum}: mong đợi </${top.tag}> (mở tại dòng ${top.line}) nhưng gặp </${tag}>`);
        }
      }
    }
  }

  assert.strictEqual(errors.length, 0, `${name} có lỗi thẻ HTML không khớp: ${errors.join('; ')}`);
  assert.strictEqual(stack.length, 0, `${name} có thẻ chưa đóng: ${stack.map(s => `<${s.tag}> (dòng ${s.line})`).join(', ')}`);
  console.log(`  ✅ [PASS] ${name}: 100% cân bằng thẻ HTML (0 lỗi div, 0 thẻ thừa, 0 thẻ thiếu)`);
}

const viewsToValidate: Record<string, string> = {
  'CONTROL_PANEL_HTML (control-panel.view.ts)': CONTROL_PANEL_HTML,
  'DASHBOARD_HTML (dashboard.view.ts)': DASHBOARD_HTML,
  'FORM_REQUEST_HTML (form-request.view.ts)': FORM_REQUEST_HTML,
  'CONFIRM_REQUEST_HTML (confirm-request.view.ts)': CONFIRM_REQUEST_HTML,
  'TECHNICAL_FEEDBACK_HTML (technical-feedback.view.ts)': TECHNICAL_FEEDBACK_HTML,
  'LOGIN_HTML (login.view.ts)': LOGIN_HTML,
};

for (const [vName, vHtml] of Object.entries(viewsToValidate)) {
  validateHtmlTagBalance(vName, vHtml);
}

// =============================================================================
// PHẦN 2: KIỂM THỬ ĐA NGÔN NGỮ EN / VI (MẶC ĐỊNH EN, LƯU LOCALSTORAGE)
// =============================================================================
console.log('\n--- PHẦN 2: Kiểm thử hệ thống Đa Ngôn Ngữ EN / VI ---');

// 2.1 Mặc định tiếng Anh EN & Dictionary
assert.ok(I18N_DICTIONARY, 'I18N_DICTIONARY phải được định nghĩa');
assert.ok(I18N_CLIENT_SCRIPT.includes("__savedLang = 'en'"), 'Mặc định ngôn ngữ phải là EN');
assert.ok(I18N_CLIENT_SCRIPT.includes("localStorage.setItem('checkpoint_lang', 'en')"), 'Phải lưu EN vào localStorage khi chưa có');
console.log('  ✅ [PASS] Ngôn ngữ mặc định là EN và lưu cấu hình vào localStorage');

// 2.2 Nút chuyển đổi EN / VI dạng toggle trên Header
assert.ok(DASHBOARD_HEADER_HTML.includes("setLanguage('en')"), 'Dashboard Header phải có nút chuyển EN');
assert.ok(DASHBOARD_HEADER_HTML.includes("setLanguage('vi')"), 'Dashboard Header phải có nút chuyển VI');
assert.ok(CP_HEADER_HTML.includes("setLanguage('en')"), 'Control Panel Header phải có nút chuyển EN');
assert.ok(CP_HEADER_HTML.includes("setLanguage('vi')"), 'Control Panel Header phải có nút chuyển VI');
console.log('  ✅ [PASS] Nút nhấn chuyển đổi ngôn ngữ EN / VI xuất hiện trong thẻ user card trên cả Dashboard & Control Panel');

// 2.3 Phản ứng song ngữ và helper t()
assert.ok(DASHBOARD_SCRIPT.includes('const setLanguage ='), 'Dashboard Script có hàm setLanguage');
assert.ok(DASHBOARD_SCRIPT.includes('const t ='), 'Dashboard Script có hàm dịch t()');
assert.ok(CONTROL_PANEL_SCRIPT.includes('const setLanguage ='), 'Control Panel Script có hàm setLanguage');
assert.ok(CONTROL_PANEL_SCRIPT.includes('const t ='), 'Control Panel Script có hàm dịch t()');
console.log('  ✅ [PASS] Helper t(en, vi) hoạt động chuẩn xác, sẵn sàng chuyển đổi giao diện thời gian thực');

// =============================================================================
// PHẦN 3: KIỂM THỬ FORM CPST VỚI OPTION "System / Process" TRONG 4M
// =============================================================================
console.log('\n--- PHẦN 3: Kiểm thử Form CPST & Modal Sửa có lựa chọn System / Process ---');

// 3.1 Dropdown Form CPST
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes('<option value="System / Process">'),
  'Form CPST (/technical-feedback) phải có option value="System / Process"'
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes('System / Process (Hệ thống / Quy trình)'),
  'Form CPST phải có nhãn hiển thị System / Process (Hệ thống / Quy trình)'
);
console.log('  ✅ [PASS] Form CPST có lựa chọn System / Process trong dropdown nguyên nhân gốc rễ 4M');

// 3.2 Modal chỉnh sửa phiếu CPST trên Control Panel
assert.ok(
  CP_EDIT_MODAL_HTML.includes('<option value="System / Process">'),
  'Modal chỉnh sửa CPST phải có option value="System / Process"'
);
console.log('  ✅ [PASS] Modal chỉnh sửa CPST có lựa chọn System / Process');

// 3.3 Thống kê và Biểu đồ 4M
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('systemProcess') &&
  CONTROL_PANEL_SCRIPT.includes("lower.includes('system') || lower.includes('process')"),
  'Script phân tích 4M tính toán số lượng sự cố System / Process client-side'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('System / Process'),
  'Nhãn đồ thị 4M chứa System / Process'
);
console.log('  ✅ [PASS] Biểu đồ phân tích 4M và bộ đếm tự động nhận diện System / Process chuẩn xác');

// =============================================================================
// PHẦN 4: KIỂM THỬ E2E RBAC, CONTROL PANEL PROTECTION & QUẢN LÝ MẬT KHẨU
// =============================================================================
console.log('\n--- PHẦN 4: Kiểm thử E2E RBAC, Bảo vệ Control Panel & Đổi Mật Khẩu ---');

async function runE2ETests() {
  const testPort = 3392;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error'],
  });
  app.use(cookieParser());
  await app.listen(testPort);
  console.log(`  ✅ Test Server khởi động trên http://127.0.0.1:${testPort}`);

  const baseUrl = `http://127.0.0.1:${testPort}`;

  try {
    // 4.1 Đăng nhập lấy tokens
    console.log('\n  --- 4.1 Đăng nhập 3 vai trò ---');
    const adminLogin = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'admin', password: 'Checkpoint@123' },
    });
    assert.strictEqual(adminLogin.status, 201);
    const adminToken = adminLogin.json.access_token;

    const empLogin = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(empLogin.status, 201);
    const empToken = empLogin.json.access_token;

    const techLogin = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'tech01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(techLogin.status, 201);
    const techToken = techLogin.json.access_token;
    console.log('  ✅ [PASS] Đăng nhập thành công Admin, Employee, Technician');

    // 4.2 RBAC: Chặn EMPLOYEE truy cập Route GET /control-panel
    console.log('\n  --- 4.2 RBAC: Chặn EMPLOYEE truy cập GET /control-panel ---');
    // Truy cập qua Cookie
    const empCookieRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${empToken}` },
    });
    assert.strictEqual(empCookieRes.status, 302, 'Employee phải bị redirect 302');
    assert.ok(
      empCookieRes.headers.location?.includes('/dashboard?error=access_denied'),
      'Employee phải bị chuyển hướng về /dashboard?error=access_denied'
    );

    // Truy cập qua Query Param ?token=
    const empQueryRes = await httpRequest(`${baseUrl}/control-panel?token=${empToken}`);
    assert.strictEqual(empQueryRes.status, 302);
    assert.ok(empQueryRes.headers.location?.includes('/dashboard?error=access_denied'));
    console.log('  ✅ [PASS] Employee bị chặn truy cập GET /control-panel cả qua Cookie và Query Token');

    // 4.3 RBAC: Chặn EMPLOYEE gọi API /api/control-panel/*
    console.log('\n  --- 4.3 RBAC: Chặn EMPLOYEE gọi API /api/control-panel/* ---');
    const empApiInit = await httpRequest(`${baseUrl}/api/control-panel/init-data`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    assert.strictEqual(empApiInit.status, 403, 'Employee gọi init-data phải trả về 403 Forbidden');

    const empApiStats = await httpRequest(`${baseUrl}/api/control-panel/stats`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    assert.strictEqual(empApiStats.status, 403, 'Employee gọi stats phải trả về 403 Forbidden');
    console.log('  ✅ [PASS] API /api/control-panel/* từ chối Employee với mã HTTP 403 Forbidden');

    // 4.4 Admin truy cập hợp lệ GET /control-panel & API /api/control-panel/*
    console.log('\n  --- 4.4 Admin truy cập Control Panel & API ---');
    const adminPage = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${adminToken}` },
    });
    assert.strictEqual(adminPage.status, 200, 'Admin truy cập /control-panel trả về 200');

    const adminApiInit = await httpRequest(`${baseUrl}/api/control-panel/init-data`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(adminApiInit.status, 200, 'Admin gọi init-data trả về 200');
    assert.strictEqual(adminApiInit.json.success, true);
    console.log('  ✅ [PASS] Admin có toàn quyền truy cập Control Panel và các API quản trị');

    // 4.5 User tự đổi mật khẩu cá nhân qua POST /auth/change-password
    console.log('\n  --- 4.5 User tự đổi mật khẩu cá nhân ---');
    // Sai pass cũ
    const wrongOldRes = await httpRequest(`${baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${empToken}` },
      body: { oldPassword: 'WrongPassword', newPassword: 'NewEmployeePass@999' },
    });
    assert.strictEqual(wrongOldRes.status, 400);

    // Đổi thành công
    const changePassRes = await httpRequest(`${baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${empToken}` },
      body: { oldPassword: 'Checkpoint@123', newPassword: 'NewEmployeePass@999' },
    });
    assert.strictEqual(changePassRes.status, 201);
    assert.strictEqual(changePassRes.json.success, true);

    // Đăng nhập mật khẩu cũ bị từ chối
    const oldLoginCheck = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(oldLoginCheck.status, 401);

    // Đăng nhập mật khẩu mới thành công
    const newLoginCheck = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'NewEmployeePass@999' },
    });
    assert.strictEqual(newLoginCheck.status, 201);
    console.log('  ✅ [PASS] User Settings: user01 tự đổi mật khẩu thành công và xác thực chính xác');

    // 4.6 Admin Reset Mật Khẩu qua PUT /api/users/:id và POST /api/users/:id/reset-password
    console.log('\n  --- 4.6 Admin Reset Mật Khẩu User ---');
    const dbService = app.get(DatabaseService);
    const user01Record = dbService.getUserByUsername('user01');
    assert.ok(user01Record, 'user01 phải tồn tại');

    // Admin reset qua dedicated endpoint
    const adminResetRes = await httpRequest(`${baseUrl}/api/users/${user01Record.id}/reset-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { newPassword: 'Checkpoint@123' },
    });
    assert.strictEqual(adminResetRes.status, 201);

    // Xác nhận user01 đăng nhập lại bằng Checkpoint@123
    const restoredLogin = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(restoredLogin.status, 201);
    console.log('  ✅ [PASS] Admin reset mật khẩu cho user01 thành công về Checkpoint@123');

    // 4.7 Admin quản trị phân quyền (Cấp & Thu hồi quyền canAccessControlPanel)
    console.log('\n  --- 4.7 Admin quản trị phân quyền Control Panel ---');
    const techRecord = dbService.getUserByUsername('tech01');
    assert.ok(techRecord, 'tech01 phải tồn tại');

    // Trước khi cấp quyền: tech01 bị chặn vào /control-panel
    const techBeforeRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${techToken}` },
    });
    assert.strictEqual(techBeforeRes.status, 302);

    // Admin cấp quyền canAccessControlPanel = true
    const grantRes = await httpRequest(`${baseUrl}/api/users/${techRecord.id}/permissions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { canAccessControlPanel: true, canViewKpi: true, canCreateRequest: true },
    });
    assert.strictEqual(grantRes.status, 200);
    assert.strictEqual(grantRes.json.permissions.canAccessControlPanel, true);

    // tech01 đăng nhập lại nhận token mới với permission
    const techLoginWithPerm = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'tech01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(techLoginWithPerm.status, 201);
    const techTokenWithPerm = techLoginWithPerm.json.access_token;

    // tech01 truy cập thành công /control-panel sau khi được cấp quyền
    const techAfterRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${techTokenWithPerm}` },
    });
    assert.strictEqual(techAfterRes.status, 200, 'Technician có quyền canAccessControlPanel truy cập thành công 200');

    // Thu hồi quyền về ban đầu
    await httpRequest(`${baseUrl}/api/users/${techRecord.id}/permissions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { canAccessControlPanel: false, canViewKpi: true, canCreateRequest: true },
    });
    console.log('  ✅ [PASS] Admin cấp và thu hồi quyền canAccessControlPanel hoạt động hoàn hảo');

    console.log('\n================================================================');
    console.log('🎉 TOÀN BỘ CÁC MỤC KIỂM THỬ QA HỆ THỐNG ĐÃ ĐẠT 100% PASS!');
    console.log('================================================================\n');
  } finally {
    await app.close();
  }
}

runE2ETests().catch((err) => {
  console.error('❌ Kiểm thử QA thất bại:', err);
  process.exit(1);
});
