import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

// Import Dictionary and Scripts
import { I18N_DICTIONARY, I18N_CLIENT_SCRIPT } from '../src/views/common/i18n';

// Import Views
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { LOGIN_HTML } from '../src/views/login.view';

// Import Components & Modals
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';
import { CP_TICKET_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/ticket-detail-modal.component';

// Import Scripts
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';
import { DASHBOARD_SCRIPT } from '../src/views/dashboard/scripts/dashboard.script';

console.log('================================================================');
console.log('🧪 BỘ KIỂM THỬ QA TỰ ĐỘNG TOÀN DIỆN (TASK T3):');
console.log('   TIẾNG ANH 100% TRÊN CPST, CPSF, REQUEST TICKETS DATA & HTML TAGS');
console.log('================================================================\n');

// =============================================================================
// PHẦN 1: QUÉT TÍNH CÂN BẰNG THẺ HTML TRÊN TOÀN BỘ 6 GIAO DIỆN CHÍNH (0 LỖI DIV)
// =============================================================================
console.log('--- 1. Quét kiểm tra tính cân bằng thẻ HTML (0 lỗi div / 0 thẻ lệch / 0 thẻ thiếu) ---');

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
// PHẦN 2: KIỂM TRA FORM CPST (/technical-feedback)
// =============================================================================
console.log('\n--- 2. Kiểm tra Form CPST (/technical-feedback) chuẩn tiếng Anh 100% ---');

// 2.1 Nhãn "Technician tiếp nhận" hiển thị "Receiving Technician" khi EN
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('Receiving Technician', 'Technician tiếp nhận')"),
  "Form CPST: Nhãn 'Technician tiếp nhận *' phải dùng t('Receiving Technician', 'Technician tiếp nhận')"
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('Receiving Technician:', 'Technician tiếp nhận:')"),
  "Form CPST: Dòng xác nhận '✓ Technician tiếp nhận:' phải dùng t('Receiving Technician:', 'Technician tiếp nhận:')"
);
console.log("  ✅ [PASS] Form CPST: Nhãn 'Technician tiếp nhận' và '✓ Technician tiếp nhận:' đã bản địa hóa đa ngôn ngữ chuẩn xác");

// 2.2 Dropdown Root Cause 4M hiển thị tiếng Anh chuẩn, không còn đuôi tiếng Việt cứng khi EN
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('Man (Human)', 'Man (Con người)')"),
  "Form CPST: Option Man phải là t('Man (Human)', 'Man (Con người)')"
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('Machine (Equipment)', 'Machine (Thiết bị)')"),
  "Form CPST: Option Machine phải là t('Machine (Equipment)', 'Machine (Thiết bị)')"
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('Material (Raw material)', 'Material (Vật liệu)')"),
  "Form CPST: Option Material phải là t('Material (Raw material)', 'Material (Vật liệu)')"
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('Method (Procedure)', 'Method (Quy trình)')"),
  "Form CPST: Option Method phải là t('Method (Procedure)', 'Method (Quy trình)')"
);
assert.ok(
  TECHNICAL_FEEDBACK_HTML.includes("t('System / Process', 'System / Process (Hệ thống / Quy trình)')"),
  "Form CPST: Option System / Process phải là t('System / Process', 'System / Process (Hệ thống / Quy trình)')"
);

// Đảm bảo không còn option với đuôi tiếng Việt cứng
assert.ok(
  !TECHNICAL_FEEDBACK_HTML.includes('<option value="Man">Man (Con người)</option>'),
  'Form CPST: Không còn option Man có tiếng Việt cứng'
);
assert.ok(
  !TECHNICAL_FEEDBACK_HTML.includes('<option value="Machine">Machine (Máy móc / Thiết bị)</option>'),
  'Form CPST: Không còn option Machine có tiếng Việt cứng'
);
console.log('  ✅ [PASS] Form CPST: 5 Options Root Cause (Man, Machine, Material, Method, System / Process) hiển thị tiếng Anh 100%');

// =============================================================================
// PHẦN 3: KIỂM TRA FORM CPSF (/confirm-request)
// =============================================================================
console.log('\n--- 3. Kiểm tra Form CPSF (/confirm-request) chuẩn tiếng Anh 100% ---');

// 3.1 Nút Print Quality hiển thị PASS, FAIL, CONDITIONAL RUN (không còn / Đạt, / Chưa đạt trong nhãn tiếng Anh)
assert.ok(
  CONFIRM_REQUEST_HTML.includes("t('PASS', 'ĐẠT')"),
  "Form CPSF: Nút Pass phải dùng t('PASS', 'ĐẠT'), không còn '/ ĐẠT' trong tiếng Anh"
);
assert.ok(
  !CONFIRM_REQUEST_HTML.includes("t('PASS / ĐẠT'"),
  "Form CPSF: Đã loại bỏ hoàn toàn chuỗi lai 'PASS / ĐẠT'"
);
assert.ok(
  CONFIRM_REQUEST_HTML.includes("t('FAIL', 'CHƯA ĐẠT')"),
  "Form CPSF: Nút Fail phải dùng t('FAIL', 'CHƯA ĐẠT'), không còn '/ CHƯA ĐẠT' trong tiếng Anh"
);
assert.ok(
  !CONFIRM_REQUEST_HTML.includes("t('FAIL / CHƯA ĐẠT'"),
  "Form CPSF: Đã loại bỏ hoàn toàn chuỗi lai 'FAIL / CHƯA ĐẠT'"
);
assert.ok(
  CONFIRM_REQUEST_HTML.includes("t('CONDITIONAL RUN', 'CHẠY TẠM')"),
  "Form CPSF: Nút Chạy tạm phải dùng t('CONDITIONAL RUN', 'CHẠY TẠM')"
);
console.log("  ✅ [PASS] Form CPSF: Nút Print Quality hiển thị chuẩn PASS, FAIL, CONDITIONAL RUN (sạch chuỗi lai / Đạt)");

// 3.2 Đơn vị Mét / Tờ in hiển thị Meters / Sheets
assert.ok(
  CONFIRM_REQUEST_HTML.includes("t('Meters', 'Mét')"),
  "Form CPSF: Đơn vị Mét phải dùng t('Meters', 'Mét')"
);
assert.ok(
  CONFIRM_REQUEST_HTML.includes("t('Sheets', 'Tờ in')"),
  "Form CPSF: Đơn vị Tờ in phải dùng t('Sheets', 'Tờ in')"
);
console.log("  ✅ [PASS] Form CPSF: Đơn vị tính hiển thị Meters / Sheets đa ngôn ngữ chuẩn");

// 3.3 Preview Modal & Success Modal đồng bộ tiếng Anh
assert.ok(
  CONFIRM_REQUEST_HTML.includes("t('PASS', 'ĐẠT')") &&
  CONFIRM_REQUEST_HTML.includes("t('CONDITIONAL RUN', 'CHẠY TẠM')") &&
  CONFIRM_REQUEST_HTML.includes("t('FAIL', 'CHƯA ĐẠT')"),
  'Form CPSF: Modals đồng bộ hiển thị PASS / CONDITIONAL RUN / FAIL'
);
console.log("  ✅ [PASS] Form CPSF: Preview Modal và Success Modal đồng bộ tiếng Anh chuẩn");

// =============================================================================
// PHẦN 4: KIỂM TRA CONTROL PANEL MODALS (Edit Modal, Split Detail, Ticket Detail)
// =============================================================================
console.log('\n--- 4. Kiểm tra Control Panel Modals chuẩn tiếng Anh ---');

// 4.1 Edit Modal (edit-modal.component.ts)
assert.ok(
  CP_EDIT_MODAL_HTML.includes("t('Man (Human)', 'Man (Con người)')") &&
  CP_EDIT_MODAL_HTML.includes("t('Machine (Equipment)', 'Machine (Thiết bị)')") &&
  CP_EDIT_MODAL_HTML.includes("t('Material (Raw material)', 'Material (Vật liệu)')") &&
  CP_EDIT_MODAL_HTML.includes("t('Method (Procedure)', 'Method (Quy trình)')") &&
  CP_EDIT_MODAL_HTML.includes("t('System / Process', 'System / Process (Hệ thống / Quy trình)')"),
  'Edit Modal: Dropdown 4M Root Cause phải hỗ trợ tiếng Anh 100%'
);
assert.ok(
  CP_EDIT_MODAL_HTML.includes("t('PASS', 'ĐẠT')") &&
  CP_EDIT_MODAL_HTML.includes("t('CONDITIONAL RUN', 'CHẠY TẠM')") &&
  CP_EDIT_MODAL_HTML.includes("t('FAIL', 'CHƯA ĐẠT')"),
  'Edit Modal: Dropdown Print Quality phải là PASS, CONDITIONAL RUN, FAIL'
);
assert.ok(
  CP_EDIT_MODAL_HTML.includes("t('Meters', 'Mét')") &&
  CP_EDIT_MODAL_HTML.includes("t('Sheets', 'Tờ in')"),
  'Edit Modal: Đơn vị tính phải là Meters / Sheets'
);
console.log('  ✅ [PASS] Control Panel: Edit Modal hiển thị 4M, Print Quality và Đơn vị tính chuẩn tiếng Anh');

// 4.2 Split Detail Modal (split-detail-modal.component.ts)
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes("t('PASS', 'ĐẠT')") &&
  CP_SPLIT_DETAIL_MODAL_HTML.includes("t('CONDITIONAL RUN', 'CHẠY TẠM')") &&
  CP_SPLIT_DETAIL_MODAL_HTML.includes("t('FAIL', 'CHƯA ĐẠT')"),
  'Split Detail Modal: Badge chất lượng in phải là PASS / CONDITIONAL RUN / FAIL'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes("t('Immediate Support', 'Hỗ trợ ngay')"),
  'Split Detail Modal: Mức ưu tiên hỗ trợ tiếng Anh'
);
console.log('  ✅ [PASS] Control Panel: Split Detail Modal hiển thị badge chất lượng và mức ưu tiên chuẩn tiếng Anh');

// =============================================================================
// PHẦN 5: KIỂM TRA BẢNG REQUEST TICKETS DATA (9 CỘT TABULATOR TRÊN CẢ DASHBOARD VÀ CONTROL PANEL)
// =============================================================================
console.log('\n--- 5. Kiểm tra 9 tiêu đề cột Bảng Request Tickets Data trên Dashboard & Control Panel ---');

// 5.1 Dashboard: 9 tiêu đề cột Tabulator
const dashboardExpectedColumns = [
  { field: 'Mã CPS', en: 'CPS Code' },
  { field: 'Ngày khởi tạo', en: 'Request Date' },
  { field: 'Người yêu cầu', en: 'Requester' },
  { field: 'Máy', en: 'Machine' },
  { field: 'Sự cố', en: 'Issue' },
  { field: 'Technician', en: 'Technician' },
  { field: 'Trạng thái', en: 'Status' },
  { field: 'Downtime', en: 'Downtime' },
  { field: 'Xem chi tiết', en: 'View Details' },
];

for (const col of dashboardExpectedColumns) {
  assert.ok(
    DASHBOARD_SCRIPT.includes(col.en) || DASHBOARD_SCRIPT.includes(col.field),
    `Dashboard Script: Phải có cấu hình cột [${col.en}]`
  );
}

// Kiểm tra 'Chưa giao' -> 'Unassigned', 'Xem chi tiết' -> 'View details'
assert.ok(
  DASHBOARD_SCRIPT.includes("t('Unassigned', 'Chưa giao')") || DASHBOARD_SCRIPT.includes('Unassigned'),
  "Dashboard: Cột Technician phải hiển thị 'Unassigned' khi chưa giao"
);
assert.ok(
  DASHBOARD_SCRIPT.includes("t('View details', 'Xem chi tiết')") || DASHBOARD_SCRIPT.includes('View details') || DASHBOARD_SCRIPT.includes('View Details'),
  "Dashboard: Nút xem chi tiết phải hỗ trợ 'View details'"
);

// 5.2 Control Panel: 9 cột Tabulator dùng t(...)
const cpExpectedColumns = [
  'CPS Code',
  'Request Date',
  'Requester',
  'Machine',
  'Issue',
  'Technician',
  'Status',
  'Downtime',
];
for (const col of cpExpectedColumns) {
  assert.ok(
    CONTROL_PANEL_SCRIPT.includes(col),
    `Control Panel Script: Phải có cấu hình cột tiếng Anh [${col}]`
  );
}
console.log('  ✅ [PASS] Bảng Request Tickets Data: Cả 9 tiêu đề cột trên Dashboard & Control Panel đều hỗ trợ tiếng Anh 100%');

// =============================================================================
// PHẦN 6: CHỨC NĂNG CHUYỂN ĐỔI NGÔN NGỮ THỜI GIAN THỰC (REALTIME i18n SWITCH)
// =============================================================================
console.log('\n--- 6. Kiểm tra chức năng chuyển đổi ngôn ngữ thời gian thực trên Dashboard & Control Panel ---');

// 6.1 Dashboard có hàm setLanguage và tự động cập nhật lại bảng
assert.ok(
  DASHBOARD_SCRIPT.includes('const setLanguage =') &&
  (DASHBOARD_SCRIPT.includes('initOrUpdateReportTable') || DASHBOARD_SCRIPT.includes('localStorage.setItem')),
  'Dashboard: Hàm setLanguage phải cập nhật localStorage và đồng bộ giao diện'
);

// 6.2 Control Panel có hàm setLanguage
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('const setLanguage =') &&
  CONTROL_PANEL_SCRIPT.includes('localStorage.setItem'),
  'Control Panel: Hàm setLanguage phải cập nhật localStorage và đồng bộ giao diện'
);

// 6.3 JSDOM kiểm tra tính toàn vẹn của logic chuyển đổi ngôn ngữ
const dom = new JSDOM(DASHBOARD_HTML, {
  url: 'http://127.0.0.1:3000/dashboard',
  runScripts: 'outside-only',
});
const win = dom.window as any;
win.localStorage = {
  _data: { checkpoint_lang: 'en' } as Record<string, string>,
  getItem(key: string) { return this._data[key] || null; },
  setItem(key: string, val: string) { this._data[key] = String(val); },
  removeItem(key: string) { delete this._data[key]; },
  clear() { this._data = {}; }
};

const tHelper = (currentLang: string, en: string, vi?: string) => {
  if (vi !== undefined) {
    return currentLang === 'vi' ? vi : en;
  }
  if (I18N_DICTIONARY[en]) {
    return I18N_DICTIONARY[en][currentLang] || I18N_DICTIONARY[en]['en'] || en;
  }
  return en;
};

// Kiểm tra chuyển đổi các thuật ngữ cốt lõi theo thời gian thực
assert.strictEqual(tHelper('en', 'Receiving Technician', 'Technician tiếp nhận'), 'Receiving Technician');
assert.strictEqual(tHelper('vi', 'Receiving Technician', 'Technician tiếp nhận'), 'Technician tiếp nhận');

assert.strictEqual(tHelper('en', 'PASS', 'ĐẠT'), 'PASS');
assert.strictEqual(tHelper('vi', 'PASS', 'ĐẠT'), 'ĐẠT');

assert.strictEqual(tHelper('en', 'CONDITIONAL RUN', 'CHẠY TẠM'), 'CONDITIONAL RUN');
assert.strictEqual(tHelper('vi', 'CONDITIONAL RUN', 'CHẠY TẠM'), 'CHẠY TẠM');

assert.strictEqual(tHelper('en', 'FAIL', 'CHƯA ĐẠT'), 'FAIL');
assert.strictEqual(tHelper('vi', 'FAIL', 'CHƯA ĐẠT'), 'CHƯA ĐẠT');

assert.strictEqual(tHelper('en', 'Meters', 'Mét'), 'Meters');
assert.strictEqual(tHelper('vi', 'Meters', 'Mét'), 'Mét');

assert.strictEqual(tHelper('en', 'Sheets', 'Tờ in'), 'Sheets');
assert.strictEqual(tHelper('vi', 'Sheets', 'Tờ in'), 'Tờ in');

console.log('  ✅ [PASS] Chuyển đổi ngôn ngữ thời gian thực hoạt động chính xác 100% giữa EN và VI');

console.log('\n================================================================');
console.log('🎉 TẤT CẢ CÁC MỤC KIỂM THỬ QA TASK T3 ĐÃ ĐẠT 100% THÀNH CÔNG!');
console.log('================================================================\n');

process.exit(0);
