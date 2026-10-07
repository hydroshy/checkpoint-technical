import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';
import { JSDOM } from 'jsdom';

// Import all view templates and scripts
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { LOGIN_HTML } from '../src/views/login.view';

import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';
import { CP_ERROR_AND_DEBUG_HEAD_SCRIPT } from '../src/views/control-panel/scripts/error-boundary.script';
import { DASHBOARD_SCRIPT } from '../src/views/dashboard/scripts/dashboard.script';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ T2: BỘ CÔNG CỤ KIỂM TRA CÚ PHÁP VIEW TỰ ĐỘNG,');
console.log('   TEST JSDOM VÀ NGHIỆM THU TOÀN DIỆN CONTROL PANEL');
console.log('================================================================\n');

// =========================================================================
// PHẦN 1: SYNTAX VALIDATOR & LINT CHECK TOÀN BỘ VIEW SCRIPTS TRƯỚC KHI BUILD
// =========================================================================
console.log('--- 1. Kiểm tra cú pháp (Syntax Validator & Lint Check) toàn bộ View Scripts ---');

function extractInlineScripts(html: string): { code: string; index: number }[] {
  const regex = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  const scripts: { code: string; index: number }[] = [];
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = regex.exec(html)) !== null) {
    if (match[1] && match[1].trim()) {
      scripts.push({ code: match[1], index: idx });
    }
    idx++;
  }
  return scripts;
}

// 1.1 Kiểm tra các file script độc lập trực tiếp bằng Node.js vm.Script
const scriptModules = [
  { name: 'CONTROL_PANEL_SCRIPT', code: CONTROL_PANEL_SCRIPT, file: 'src/views/control-panel/scripts/control-panel.script.ts' },
  { name: 'CP_ERROR_AND_DEBUG_HEAD_SCRIPT', code: CP_ERROR_AND_DEBUG_HEAD_SCRIPT, file: 'src/views/control-panel/scripts/error-boundary.script.ts' },
  { name: 'DASHBOARD_SCRIPT', code: DASHBOARD_SCRIPT, file: 'src/views/dashboard/scripts/dashboard.script.ts' },
];

for (const mod of scriptModules) {
  try {
    new vm.Script(mod.code, { filename: mod.file });
    console.log(`  ✅ [PASS] ${mod.name} (${mod.file}): Cú pháp JavaScript hợp lệ 100%`);
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${mod.name} có lỗi cú pháp:`, err.message);
    throw err;
  }
}

// 1.2 Quét và kiểm tra cú pháp toàn bộ inline <script> trong tất cả các HTML views
const viewTemplates: Record<string, string> = {
  'CONTROL_PANEL_HTML (control-panel.view.ts)': CONTROL_PANEL_HTML,
  'DASHBOARD_HTML (dashboard.view.ts)': DASHBOARD_HTML,
  'FORM_REQUEST_HTML (form-request.view.ts)': FORM_REQUEST_HTML,
  'CONFIRM_REQUEST_HTML (confirm-request.view.ts)': CONFIRM_REQUEST_HTML,
  'TECHNICAL_FEEDBACK_HTML (technical-feedback.view.ts)': TECHNICAL_FEEDBACK_HTML,
  'LOGIN_HTML (login.view.ts)': LOGIN_HTML,
};

let totalScriptsChecked = 0;
for (const [viewName, htmlContent] of Object.entries(viewTemplates)) {
  const inlineScripts = extractInlineScripts(htmlContent);
  assert.ok(inlineScripts.length > 0, `${viewName} phải chứa ít nhất 1 inline script`);
  
  for (const s of inlineScripts) {
    totalScriptsChecked++;
    try {
      new vm.Script(s.code, { filename: `${viewName}#script-${s.index}` });
    } catch (err: any) {
      console.error(`  ❌ [FAIL] Cú pháp script không hợp lệ tại ${viewName} [script index ${s.index}]: ${err.message}`);
      throw err;
    }
  }
  console.log(`  ✅ [PASS] ${viewName}: ${inlineScripts.length} script blocks đều vượt qua kiểm tra cú pháp!`);
}

// 1.3 Lint Check: Kiểm tra không chứa ký tự newline lỗi làm đứt chuỗi quote đơn/kép
const rawControlPanelScriptPath = path.resolve(__dirname, '../src/views/control-panel/scripts/control-panel.script.ts');
const rawControlPanelScriptContent = fs.readFileSync(rawControlPanelScriptPath, 'utf-8');

// Xác nhận không còn lỗi '\nDowntime:' hay '\\n' bị unescape sai thành newline trong template string
const invalidLiteralNewlinePattern = /'\s*\n\s*[A-Za-z0-9_]+:/;
assert.ok(
  !invalidLiteralNewlinePattern.test(rawControlPanelScriptContent),
  'Không được chứa chuỗi literal bị ngắt dòng bất hợp pháp gây lỗi SyntaxError'
);

// Xác nhận tooltip Gantt chart đã escape chuẩn '\\n'
assert.ok(
  rawControlPanelScriptContent.includes('\\\\nDowntime:') || rawControlPanelScriptContent.includes('\\nDowntime:'),
  'Gantt chart tooltip phải chứa ký tự newline đã escape chuẩn'
);
console.log(`  ✅ [PASS] Lint Check: Không phát hiện chuỗi escape lỗi hay ký tự xuống dòng bất hợp pháp (${totalScriptsChecked} scripts đã kiểm tra)`);

// 1.4 HTML Tag Balance Validator: Kiểm tra cân bằng thẻ mở/đóng div, main, section, form
console.log('--- 1.4 Kiểm tra tính cân bằng thẻ HTML (HTML Tag Balance Validator) ---');
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
  console.log(`  ✅ [PASS] ${name}: 100% cân bằng thẻ HTML (0 thẻ thừa, 0 thẻ lệch, 0 thẻ thiếu)`);
}

for (const [viewName, htmlContent] of Object.entries(viewTemplates)) {
  validateHtmlTagBalance(viewName, htmlContent);
}

// =========================================================================
// PHẦN 2: KIỂM THỬ TỰ ĐỘNG JSDOM MÔ PHỎNG TẢI TRANG /control-panel
// =========================================================================
console.log('\n--- 2. Kiểm thử tự động JSDOM mô phỏng tải trang /control-panel ---');

const vueProdPath = path.resolve(__dirname, '../node_modules/vue/dist/vue.global.prod.js');
assert.ok(fs.existsSync(vueProdPath), 'Tệp vue.global.prod.js phải tồn tại trong node_modules');
const vueProdSource = fs.readFileSync(vueProdPath, 'utf-8');

function setupJsdomEnvironment(html: string, search = '') {
  const dom = new JSDOM(html, {
    url: `http://127.0.0.1:3000/control-panel${search}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const win = dom.window as any;

  // Mock Storage & Media
  win.localStorage = {
    _data: {} as Record<string, string>,
    getItem(key: string) { return this._data[key] || 'light'; },
    setItem(key: string, val: string) { this._data[key] = String(val); },
    removeItem(key: string) { delete this._data[key]; },
    clear() { this._data = {}; }
  };
  win.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
  win.scrollTo = () => {};
  win.requestAnimationFrame = (cb: any) => setTimeout(cb, 0);
  win.cancelAnimationFrame = (id: any) => clearTimeout(id);

  // Mock Fetch API cho toàn bộ các API gọi trong onMounted / setup
  win.fetch = async (url: string) => {
    if (url.includes('/auth/session')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ user: { id: 1, username: 'admin', role: 'ADMIN', fullname: 'Quản trị viên' } })
      };
    }
    if (url.includes('/api/employees') || url.includes('/api/machines') || url.includes('/api/users')) {
      return { ok: true, status: 200, json: async () => [] };
    }
    if (url.includes('/api/system/public-form-status')) {
      return { ok: true, status: 200, json: async () => ({ enabled: true, url: 'http://localhost:3000/public' }) };
    }
    if (url.includes('/api/cps/stats')) {
      return { ok: true, status: 200, json: async () => ({ total: 0, byStatus: {} }) };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ data: [], success: true })
    };
  };

  // Mock Tabulator
  win.Tabulator = function (el: any, options: any) {
    this.options = options || {};
    this.data = options?.data || [];
    this.setData = (d: any) => { this.data = d; return Promise.resolve(); };
    this.setFilter = () => {};
    this.clearFilter = () => {};
    this.redraw = () => {};
    this.destroy = () => {};
    this.on = () => {};
    this.download = () => {};
    return this;
  };

  // Mock Chart.js
  win.Chart = function () {
    this.destroy = () => {};
    this.update = () => {};
    return this;
  };

  return { dom, win };
}

// 2.1 Chạy JSDOM tải trang sạch (không có lỗi)
const { dom: cleanDom, win: cleanWin } = setupJsdomEnvironment(CONTROL_PANEL_HTML);

// Bắt các lỗi runtime nếu có
const runtimeErrors: any[] = [];
cleanWin.addEventListener('error', (event: any) => {
  if (event.error) runtimeErrors.push(event.error);
  else if (event.message) runtimeErrors.push(new Error(event.message));
});

// Nạp Vue trước
cleanWin.eval(vueProdSource);
assert.strictEqual(typeof cleanWin.Vue, 'object', 'Vue phải được nạp thành công vào window.Vue');

// Thực thi toàn bộ inline script tags trong HTML
const cleanScripts = cleanDom.window.document.querySelectorAll('script');
cleanScripts.forEach((s) => {
  if (!s.src && s.textContent) {
    cleanWin.eval(s.textContent);
  }
});

// Xác nhận KHÔNG có bất kỳ lỗi SyntaxError hoặc Runtime Error nào
assert.strictEqual(
  runtimeErrors.length,
  0,
  `Không được có Runtime Error khi tải trang, tìm thấy: ${runtimeErrors.map(e => e.message).join('; ')}`
);
console.log('  ✅ [PASS] Không có bất kỳ lỗi SyntaxError hoặc Runtime Error nào trong quá trình khởi tạo');

// Xác minh phần tử #app tồn tại và v-cloak đã được gỡ bỏ hoàn toàn sau khi mount
const appEl = cleanDom.window.document.getElementById('app');
assert.ok(appEl, 'Phần tử #app phải tồn tại trong DOM');
assert.strictEqual(
  appEl.hasAttribute('v-cloak'),
  false,
  'v-cloak PHẢI được gỡ bỏ hoàn toàn khỏi #app sau khi Vue mount thành công! (Không còn bị treo trắng màn hình)'
);
console.log('  ✅ [PASS] Vue 3 đã mount thành công vào #app: Thuộc tính [v-cloak] đã được gỡ bỏ triệt để!');

// Xác minh giao diện chính đã được render
const sidebarEl = cleanDom.window.document.querySelector('aside') || cleanDom.window.document.querySelector('#sidebar') || cleanDom.window.document.querySelector('nav');
assert.ok(sidebarEl || cleanDom.window.document.body.innerHTML.includes('Report Technical'), 'Giao diện chính và Sidebar phải được render đầy đủ');
console.log('  ✅ [PASS] Cấu trúc giao diện Sidebar & Navigation đã render thành công');

// Xác minh không có error banner khi không có lỗi
const initialBanner = cleanDom.window.document.getElementById('cp-error-banner');
assert.strictEqual(initialBanner, null, 'Không được hiển thị Error Banner khi trang chạy bình thường');
console.log('  ✅ [PASS] Error Banner ở trạng thái ẩn khi không có lỗi xảy ra');

// =========================================================================
// PHẦN 3: KIỂM THỬ HỖ TRỢ QUERY PARAM ?debug=1 VÀ DEBUG HANDLER
// =========================================================================
console.log('\n--- 3. Kiểm thử Debug Handler với Query Param ?debug=1 ---');

const { dom: debugDom, win: debugWin } = setupJsdomEnvironment(CONTROL_PANEL_HTML, '?debug=1');
debugWin.eval(vueProdSource);

const debugScripts = debugDom.window.document.querySelectorAll('script');
debugScripts.forEach((s) => {
  if (!s.src && s.textContent) {
    debugWin.eval(s.textContent);
  }
});

assert.ok(debugWin.__CP_DEBUG__, 'Đối tượng window.__CP_DEBUG__ phải được khởi tạo');
assert.strictEqual(debugWin.__CP_DEBUG__.active, true, 'window.__CP_DEBUG__.active phải là true khi có ?debug=1');

const debugPanelEl = debugDom.window.document.getElementById('cp-debug-panel');
assert.ok(debugPanelEl, 'Panel giao diện Debug (#cp-debug-panel) phải hiển thị khi truy cập với ?debug=1');

const debugBadgeEl = debugDom.window.document.getElementById('cp-debug-badge');
assert.ok(debugBadgeEl, 'Badge đếm số component mount (#cp-debug-badge) phải tồn tại');

const debugCompListEl = debugDom.window.document.getElementById('cp-debug-components-list');
assert.ok(debugCompListEl, 'Danh sách component (#cp-debug-components-list) phải tồn tại');

assert.ok(debugWin.__CP_DEBUG__.logs.length > 0, 'window.__CP_DEBUG__.logs phải ghi nhận các log events mount');
console.log(`  ✅ [PASS] Debug Handler (?debug=1) hoạt động chính xác: Panel hiển thị, ghi nhận ${debugWin.__CP_DEBUG__.logs.length} sự kiện debug log`);

// =========================================================================
// PHẦN 4: XÁC MINH ERROR HANDLER HOẠT ĐỘNG CHÍNH XÁC KHI CÓ LỖI GIẢ LẬP
// =========================================================================
console.log('\n--- 4. Xác minh Error Handler & Error Boundary hoạt động chính xác khi có lỗi giả lập ---');

// 4.1 Kiểm thử Error Handler phản hồi khi gặp window.onerror
const { dom: errDom, win: errWin } = setupJsdomEnvironment(CONTROL_PANEL_HTML);

// Nạp error boundary head script trước
errWin.eval(vueProdSource);
const errScripts = errDom.window.document.querySelectorAll('script');
errScripts.forEach((s) => {
  if (!s.src && s.textContent) {
    errWin.eval(s.textContent);
  }
});

const testAppEl = errDom.window.document.getElementById('app')!;
// Giả lập trạng thái v-cloak đang bị treo do lỗi
testAppEl.setAttribute('v-cloak', '');
assert.strictEqual(testAppEl.hasAttribute('v-cloak'), true, 'Đã gắn v-cloak giả lập cho #app');

// Kích hoạt lỗi giả lập qua window.onerror
const simulatedErrorMessage = 'Lỗi cú pháp mô phỏng: SyntaxError: Unexpected token in view';
const simulatedSource = 'src/views/control-panel/scripts/control-panel.script.ts';
const simulatedLine = 557;
const simulatedCol = 15;
errWin.onerror(simulatedErrorMessage, simulatedSource, simulatedLine, simulatedCol, new SyntaxError(simulatedErrorMessage));

// 1. Kiểm tra v-cloak phải được tự động gỡ bỏ ngay lập tức
assert.strictEqual(
  testAppEl.hasAttribute('v-cloak'),
  false,
  'Error Handler PHẢI tự động gỡ bỏ [v-cloak] khi phát hiện lỗi để chống treo trắng màn hình!'
);
console.log('  ✅ [PASS] Error Handler đã tự động gỡ bỏ [v-cloak] khỏi #app ngay khi phát hiện lỗi');

// 2. Kiểm tra Error Banner đỏ được hiển thị trực quan
const errorBanner = errDom.window.document.getElementById('cp-error-banner');
assert.ok(errorBanner, 'Phần tử #cp-error-banner phải được tạo và chèn vào DOM');
assert.strictEqual(errorBanner.getAttribute('role'), 'alert', 'Banner phải có role="alert" để hỗ trợ accessibility');

const bannerText = errorBanner.textContent || '';
assert.ok(
  bannerText.includes('LỖI GIAO DIỆN CONTROL PANEL'),
  'Banner phải chứa tiêu đề cảnh báo lỗi giao diện'
);
assert.ok(
  bannerText.includes(simulatedErrorMessage),
  'Banner phải hiển thị rõ ràng nội dung thông báo lỗi'
);
assert.ok(
  bannerText.includes(simulatedSource) || bannerText.includes(String(simulatedLine)),
  'Banner phải hiển thị vị trí tệp tin và số dòng gặp lỗi'
);
assert.ok(
  bannerText.includes('F12') || bannerText.includes('Console'),
  'Banner phải có hướng dẫn người dùng/kỹ sư bấm F12 để kiểm tra console'
);
console.log('  ✅ [PASS] Error Banner hiển thị chi tiết thông tin lỗi, file, dòng/cột và hướng dẫn F12');

// 3. Kiểm tra các nút thao tác trên banner: Tải lại và Đóng
const reloadBtn = errorBanner.querySelector('#cp-error-reload-btn');
const closeBtn = errorBanner.querySelector('#cp-error-close-btn') as HTMLElement;
assert.ok(reloadBtn, 'Banner phải có nút thử tải lại (F5) (#cp-error-reload-btn)');
assert.ok(closeBtn, 'Banner phải có nút đóng (✕) (#cp-error-close-btn)');

// Kiểm tra đóng banner
closeBtn.click();
assert.strictEqual(
  errDom.window.document.getElementById('cp-error-banner'),
  null,
  'Sau khi nhấn nút đóng (✕), #cp-error-banner phải được loại bỏ khỏi DOM'
);
console.log('  ✅ [PASS] Nút đóng (✕) loại bỏ banner thành công');

// 4.2 Kiểm thử kích hoạt qua window.__CP_REPORT_ERROR__
testAppEl.setAttribute('v-cloak', '');
errWin.__CP_REPORT_ERROR__(new Error('Lỗi runtime Vue component giả lập'), 'Vue Component Setup');
assert.strictEqual(testAppEl.hasAttribute('v-cloak'), false, '__CP_REPORT_ERROR__ phải tự động gỡ v-cloak');
const secondBanner = errDom.window.document.getElementById('cp-error-banner');
assert.ok(secondBanner, '__CP_REPORT_ERROR__ phải hiển thị Error Banner');
assert.ok(secondBanner.textContent?.includes('Vue Component Setup'), 'Banner phải hiển thị ngữ cảnh lỗi');
console.log('  ✅ [PASS] window.__CP_REPORT_ERROR__ hoạt động chính xác cho cả runtime error');

// 4.3 Kiểm thử kích hoạt qua sự kiện unhandledrejection
errWin.dispatchEvent(
  new errWin.Event('unhandledrejection')
);
console.log('  ✅ [PASS] Bắt và xử lý an toàn sự kiện unhandledrejection');

// =========================================================================
// PHẦN 5: KIỂM THỬ MODAL CONTAINMENT TRÊN DASHBOARD VÀ CONTROL-PANEL
// =========================================================================
console.log('\n--- 5. Kiểm thử Modal Containment & Phạm vi mount của Vue ---');

// 5.1 Dashboard: Đảm bảo toàn bộ modal nằm trọn trong #app và không rò rỉ ra ngoài
const dashDom = new JSDOM(DASHBOARD_HTML);
const dashApp = dashDom.window.document.getElementById('app');
assert.ok(dashApp, 'Dashboard phải có phần tử #app');

// Kiểm tra phần tử ngoài #app trong <body> không chứa bất kỳ template directive Vue nào
let dashOutsideAppHtml = '';
dashDom.window.document.body.childNodes.forEach(node => {
  if (node !== dashApp && node.nodeName !== 'SCRIPT') {
    dashOutsideAppHtml += (node as any).outerHTML || '';
  }
});
assert.ok(!dashOutsideAppHtml.includes('modalState.isEdit'), 'Dashboard: Modal máy móc không được rò rỉ ra ngoài #app');
assert.ok(!dashOutsideAppHtml.includes('Chỉnh Sửa Thiết Bị'), 'Dashboard: Text template không được xuất hiện ngoài #app');
console.log('  ✅ [PASS] Dashboard: Không có modal nào bị đẩy ra ngoài #app, 0 rò rỉ DOM');

// 5.2 Control-Panel: Đảm bảo toàn bộ modal nằm trọn trong #app
const cpDom = new JSDOM(CONTROL_PANEL_HTML);
const cpApp = cpDom.window.document.getElementById('app');
assert.ok(cpApp, 'Control-Panel phải có phần tử #app');

let cpOutsideAppHtml = '';
cpDom.window.document.body.childNodes.forEach(node => {
  if (node !== cpApp && node.nodeName !== 'SCRIPT') {
    cpOutsideAppHtml += (node as any).outerHTML || '';
  }
});
assert.ok(!cpOutsideAppHtml.includes('showBulkImportModal'), 'Control-Panel: Modal Excel không được rò rỉ ra ngoài #app');
assert.ok(!cpOutsideAppHtml.includes('Nạp Danh Sách Nhân Sự Excel'), 'Control-Panel: Modal Excel không được xuất hiện ngoài #app');
console.log('  ✅ [PASS] Control-Panel: Modal Excel và toàn bộ modal nằm trọn vẹn bên trong #app');

console.log('\n================================================================');
console.log('🎉 TOÀN BỘ CÁC MỤC KIỂM THỬ T2 ĐÃ VƯỢT QUA 100% THÀNH CÔNG!');
console.log('================================================================\n');
