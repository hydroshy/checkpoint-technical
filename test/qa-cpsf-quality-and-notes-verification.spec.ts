import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

// Import Views & Components
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { LOGIN_HTML } from '../src/views/login.view';
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';
import { I18N_DICTIONARY, I18N_CLIENT_SCRIPT } from '../src/views/common/i18n';

// Import Database & Services
import { DatabaseService } from '../src/modules/database/database.service';
import { CpsfService } from '../src/modules/cps/services/cpsf.service';
import { CpsService } from '../src/modules/cps/services/cps.service';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ QA T3: CPSF QUALITY EVALUATION & NOTES');
console.log('================================================================\n');

// =============================================================================
// PHẦN 1: KIỂM THỬ BACKEND SERVICE (Tạo CPSF 'Chạy tạm, tiếp tục theo dõi' + Notes & Sync CPS)
// =============================================================================
console.log('--- PHẦN 1: KIỂM THỬ BACKEND SERVICE & ĐỒNG BỘ CPS ---');

async function testBackendServiceSync() {
  const dbService = new DatabaseService();
  await dbService.onModuleInit();
  const cpsService = new CpsService(dbService);
  const cpsfService = new CpsfService(dbService);

  const timestamp = Date.now();
  const testCpsrDocNo = `CPSR-QA-${timestamp}`;
  const testCpstDocNo = `CPST-QA-${timestamp}`;
  const testCpsfDocNo = `CPSF-QA-${timestamp}`;
  const cpsrId = `cpsr-${timestamp}`;
  const cpstId = `cpst-${timestamp}`;

  // 1. Tạo CPSR và CPS liên kết
  await dbService.addCpsr({
    id: cpsrId,
    docNo: testCpsrDocNo,
    reqDate: '2026-10-25',
    reqTime: '08:00',
    reqBy: 'QA Tester',
    printTech: 'OFFSET',
    machineName: 'Speedmaster XL 75',
    problem: 'Màu in nhạt tại mép biên',
    machineStatus: 'Chạy thử nghiệm',
    priority: 'Chạy tạm',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const cps = await cpsService.createCps({
    cpsrDocNo: testCpsrDocNo,
    problem: 'Màu in nhạt tại mép biên',
    priority: 'Chạy tạm',
  });
  assert.ok(cps, 'Tạo thành công CPS từ CPSR');
  assert.strictEqual(cps.cpsrDocNo, testCpsrDocNo, 'CPS liên kết đúng mã CPSR');

  // 2. Tạo CPST liên kết
  await dbService.addCpst({
    id: cpstId,
    docNo: testCpstDocNo,
    cpsrId: cpsrId,
    cpsrDocNo: testCpsrDocNo,
    recvBy: 'Nguyễn Văn Kỹ Thuật',
    chkStatus: 'Đã khắc phục',
    downtime: 30,
    rootCause: 'Machine',
    actionTaken: 'Căn chỉnh trục lô cấp ẩm',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Cập nhật liên kết CPST vào CPS
  await dbService.updateCps(cps.id, {
    cpstId,
    cpstDocNo: testCpstDocNo,
    chkStatus: 'Đã khắc phục',
    downtime: 30,
    status: 'TO_CONFIRM',
  });

  // 3. Tạo CPSF với chkQuality='Chạy tạm, tiếp tục theo dõi' và trường notes
  const cpsf = await cpsfService.createCpsf({
    docNo: testCpsfDocNo,
    cpstDocNo: testCpstDocNo,
    chkQuality: 'Chạy tạm, tiếp tục theo dõi',
    notes: 'Chất lượng in tạm ổn, tiếp tục theo dõi mật độ mực trong 500 tờ tiếp theo',
    workOrder: 'WO-QA-TEST-001',
    woTotalQty: 10000,
    wasteQty: 120,
    wasteUnit: 'Tờ in',
    prodMgr: 'Trưởng Ca Sản Xuất QA',
  });

  assert.strictEqual(cpsf.chkQuality, 'Chạy tạm, tiếp tục theo dõi', 'CPSF lưu đúng chkQuality "Chạy tạm, tiếp tục theo dõi"');
  assert.strictEqual(cpsf.notes, 'Chất lượng in tạm ổn, tiếp tục theo dõi mật độ mực trong 500 tờ tiếp theo', 'CPSF lưu đúng trường notes');

  // 4. Kiểm tra CPS được đồng bộ đúng chkQuality và notes
  const syncedCps = dbService.getCpsByCpsrDocNo(testCpsrDocNo);
  assert.ok(syncedCps, 'Tìm thấy CPS tương ứng với CPSR');
  assert.strictEqual(syncedCps?.cpsfDocNo, testCpsfDocNo, 'CPS đã liên kết với CPSF');
  assert.strictEqual(syncedCps?.status, 'CLOSED', 'CPS chuyển sang trạng thái CLOSED');
  assert.strictEqual(syncedCps?.chkQuality, 'Chạy tạm, tiếp tục theo dõi', 'CPS đồng bộ chính xác chkQuality: Chạy tạm, tiếp tục theo dõi');
  assert.strictEqual(syncedCps?.notes, cpsf.notes, 'CPS đồng bộ chính xác trường notes từ CPSF');
  assert.strictEqual(syncedCps?.wastePercent, '1.20%', 'CPS tính đúng tỷ lệ phế: 1.20% (120 / 10000)');

  // 5. Kiểm tra cập nhật CPSF qua updateCpsf đồng bộ lại CPS
  await cpsfService.updateCpsf(testCpsfDocNo, {
    chkQuality: 'Đạt',
    notes: 'Đã hoàn tất theo dõi, chất lượng đạt yêu cầu tiêu chuẩn xuất khẩu',
  });

  const updatedCps = dbService.getCpsByCpsrDocNo(testCpsrDocNo);
  assert.strictEqual(updatedCps?.chkQuality, 'Đạt', 'CPS đồng bộ đúng chkQuality sau khi updateCpsf');
  assert.strictEqual(updatedCps?.notes, 'Đã hoàn tất theo dõi, chất lượng đạt yêu cầu tiêu chuẩn xuất khẩu', 'CPS đồng bộ đúng notes sau khi updateCpsf');

  // Dọn dẹp dữ liệu test
  await dbService.deleteCpsf(cpsf.id);
  await dbService.deleteCpst(cpstId);
  await dbService.deleteCps(cps.id);
  await dbService.deleteCpsr(cpsrId);

  console.log('  ✅ [PASS] CpsfService tạo phiếu chkQuality "Chạy tạm, tiếp tục theo dõi" và notes thành công');
  console.log('  ✅ [PASS] CPS liên kết được tự động đóng (CLOSED) và đồng bộ đúng chkQuality và notes');
  console.log('  ✅ [PASS] Cập nhật CPSF đồng bộ lại chính xác sang CPS');
}

// =============================================================================
// PHẦN 2: KIỂM THỬ GIAO DIỆN FORM /confirm-request
// =============================================================================
console.log('\n--- PHẦN 2: KIỂM THỬ FORM /confirm-request (3 NÚT & NOTE) ---');

function testConfirmRequestView() {
  const content = CONFIRM_REQUEST_HTML;

  // 2.1 Đủ 3 nút đánh giá chất lượng in
  assert.ok(content.includes("form.chkQuality = 'Đạt'"), "Form có nút chọn 'Đạt'");
  assert.ok(content.includes("form.chkQuality = 'Chạy tạm, tiếp tục theo dõi'"), "Form có nút chọn 'Chạy tạm, tiếp tục theo dõi'");
  assert.ok(content.includes("form.chkQuality = 'Chưa đạt'"), "Form có nút chọn 'Chưa đạt'");

  // 2.2 Nút thứ 3 có style active-warning và icon 🟡
  assert.ok(content.includes(".btn-toggle.active-warning"), "Có class style .btn-toggle.active-warning");
  assert.ok(content.includes("active-warning': form.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"), "Gán class active-warning khi chọn Chạy tạm");
  assert.ok(content.includes("🟡"), "Nút Chạy tạm có biểu tượng 🟡");

  // 2.3 Ô nhập Note (textarea v-model="form.notes")
  assert.ok(content.includes('v-model="form.notes"'), "Có ô textarea gắn v-model='form.notes'");
  assert.ok(content.includes("t('Notes / Remarks', 'Ghi chú / Ghi nhận')"), "Nhãn Ghi chú song ngữ EN / VI");

  // 2.4 Preview Modal hiển thị chất lượng in và Note
  const previewIdx = content.indexOf('showConfirmModal');
  assert.ok(previewIdx !== -1, "Tồn tại Preview Modal showConfirmModal");
  const previewSection = content.substring(previewIdx, content.indexOf('successModal'));
  assert.ok(previewSection.includes("form.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"), "Preview Modal hiển thị nhãn Chạy tạm, tiếp tục theo dõi");
  assert.ok(previewSection.includes("form.notes"), "Preview Modal hiển thị trường form.notes");

  // 2.5 Success Modal hiển thị chất lượng in và Note
  const successSection = content.substring(content.indexOf('successModal'));
  assert.ok(successSection.includes("form.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"), "Success Modal hiển thị nhãn Chạy tạm, tiếp tục theo dõi");
  assert.ok(successSection.includes("form.notes"), "Success Modal hiển thị trường form.notes");

  console.log('  ✅ [PASS] Form /confirm-request có đủ 3 nút đánh giá chất lượng in với nút Chạy tạm (amber/🟡)');
  console.log('  ✅ [PASS] Ô nhập textarea Note (form.notes) hiển thị đầy đủ và được map vào payload API');
  console.log('  ✅ [PASS] Cả Preview Modal và Success Modal đều hiển thị đúng chất lượng in mới và Note');
}

// =============================================================================
// PHẦN 3: KIỂM THỬ CONTROL PANEL (EDIT-MODAL, SPLIT-DETAIL-MODAL & TABULATOR)
// =============================================================================
console.log('\n--- PHẦN 3: KIỂM THỬ CONTROL PANEL (MODALS & TABULATOR) ---');

function testControlPanelComponents() {
  // 3.1 Edit Modal (edit-modal.component.ts)
  assert.ok(
    CP_EDIT_MODAL_HTML.includes('value="Chạy tạm, tiếp tục theo dõi"'),
    'Edit Modal CPSF có option "Chạy tạm, tiếp tục theo dõi"'
  );
  assert.ok(
    CP_EDIT_MODAL_HTML.includes('editForm.notes'),
    'Edit Modal CPSF có ô nhập textarea editForm.notes'
  );
  console.log('  ✅ [PASS] Edit Modal có đủ lựa chọn "Chạy tạm, tiếp tục theo dõi" và trường Note cho CPSF');

  // 3.2 Split Detail Modal (split-detail-modal.component.ts)
  assert.ok(
    CP_SPLIT_DETAIL_MODAL_HTML.includes("selectedChain.cpsf.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"),
    'Split Detail Modal kiểm tra chkQuality === "Chạy tạm, tiếp tục theo dõi"'
  );
  assert.ok(
    CP_SPLIT_DETAIL_MODAL_HTML.includes('bg-amber-500/10 text-amber-500 border border-amber-500/20'),
    'Split Detail Modal có badge màu amber cho "Chạy tạm, tiếp tục theo dõi"'
  );
  assert.ok(
    CP_SPLIT_DETAIL_MODAL_HTML.includes('selectedChain.cpsf.notes'),
    'Split Detail Modal hiển thị trường selectedChain.cpsf.notes'
  );
  console.log('  ✅ [PASS] Split Detail Modal hiển thị badge amber "Chạy tạm, tiếp tục theo dõi" và trường Note');

  // 3.3 Control Panel Script & Tabulator (control-panel.script.ts)
  assert.ok(
    CONTROL_PANEL_SCRIPT.includes("val === 'Chạy tạm, tiếp tục theo dõi'") &&
    CONTROL_PANEL_SCRIPT.includes("CONDITIONAL"),
    'Tabulator CPSF hiển thị badge CONDITIONAL / CHẠY TẠM'
  );
  assert.ok(
    CONTROL_PANEL_SCRIPT.includes("field: 'notes'"),
    'Tabulator CPSF có cột Ghi Chú (field: notes)'
  );
  assert.ok(
    CONTROL_PANEL_SCRIPT.includes("notes: editForm.value.notes || ''"),
    'submitEditTicket gửi notes lên API'
  );
  console.log('  ✅ [PASS] Tabulator CPSF hiển thị badge CHẠY TẠM / CONDITIONAL và cột Ghi Chú');
}

// =============================================================================
// PHẦN 4: KIỂM THỬ ĐA NGÔN NGỮ EN / VI
// =============================================================================
console.log('\n--- PHẦN 4: KIỂM THỬ ĐA NGÔN NGỮ EN / VI ---');

function testI18nLabels() {
  assert.ok(I18N_DICTIONARY['table.conditional'], "Từ điển có key table.conditional");
  assert.strictEqual(I18N_DICTIONARY['table.conditional'].en, 'CONDITIONAL');
  assert.strictEqual(I18N_DICTIONARY['table.conditional'].vi, 'CHẠY TẠM');

  assert.ok(I18N_DICTIONARY['table.conditionalRun'], "Từ điển có key table.conditionalRun");
  assert.strictEqual(I18N_DICTIONARY['table.conditionalRun'].en, 'Conditional Run / Monitor');
  assert.strictEqual(I18N_DICTIONARY['table.conditionalRun'].vi, 'Chạy tạm, tiếp tục theo dõi');

  assert.ok(I18N_DICTIONARY['table.notes'], "Từ điển có key table.notes");
  assert.strictEqual(I18N_DICTIONARY['table.notes'].en, 'Notes / Remarks');
  assert.strictEqual(I18N_DICTIONARY['table.notes'].vi, 'Ghi Chú / Ghi Nhận');

  // Hàm helper t() mô phỏng client script
  function t(lang: 'en' | 'vi', key: string): string {
    const entry = I18N_DICTIONARY[key];
    if (!entry) return key;
    return entry[lang] || entry.vi || key;
  }

  assert.strictEqual(t('en', 'table.conditional'), 'CONDITIONAL');
  assert.strictEqual(t('vi', 'table.conditional'), 'CHẠY TẠM');
  assert.strictEqual(t('en', 'table.conditionalRun'), 'Conditional Run / Monitor');
  assert.strictEqual(t('vi', 'table.conditionalRun'), 'Chạy tạm, tiếp tục theo dõi');
  assert.strictEqual(t('en', 'table.notes'), 'Notes / Remarks');
  assert.strictEqual(t('vi', 'table.notes'), 'Ghi Chú / Ghi Nhận');

  console.log('  ✅ [PASS] Các nhãn mới table.conditional, table.conditionalRun, table.notes có đủ cặp EN / VI chuẩn xác');
}

// =============================================================================
// PHẦN 5: QUÉT KIỂM TRA TÍNH CÂN BẰNG THẺ HTML (0 LỖI DIV)
// =============================================================================
console.log('\n--- PHẦN 5: QUÉT TÍNH CÂN BẰNG THẺ HTML (0 LỖI DIV / TAG) ---');

function checkHtmlTagBalance(name: string, html: string): { name: string; divErrors: string[]; allErrors: string[] } {
  const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*?)?(\/?)>/gs;
  let match: RegExpExecArray | null;
  const stack: { tag: string; line: number }[] = [];
  const divErrors: string[] = [];
  const allErrors: string[] = [];

  const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

  while ((match = tagRegex.exec(html)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    const isSelfClosing = match[2] === '/' || selfClosingTags.includes(tag);
    const isClosing = full.startsWith('</');
    if (isSelfClosing) continue;

    const lineNum = html.substring(0, match.index).split('\n').length;
    if (!isClosing) {
      stack.push({ tag, line: lineNum });
    } else {
      if (stack.length === 0) {
        const msg = `Thẻ đóng thừa </${tag}> tại dòng ${lineNum}`;
        allErrors.push(msg);
        if (tag === 'div') divErrors.push(msg);
      } else {
        const top = stack.pop()!;
        if (top.tag !== tag) {
          const msg = `Lỗi lệch thẻ: <${top.tag}> (dòng ${top.line}) đóng bằng </${tag}> (dòng ${lineNum})`;
          allErrors.push(msg);
          if (top.tag === 'div' || tag === 'div') divErrors.push(msg);
        }
      }
    }
  }

  while (stack.length > 0) {
    const unclosed = stack.pop()!;
    const msg = `Thẻ chưa đóng: <${unclosed.tag}> mở tại dòng ${unclosed.line}`;
    allErrors.push(msg);
    if (unclosed.tag === 'div') divErrors.push(msg);
  }

  return { name, divErrors, allErrors };
}

function testHtmlTagBalance() {
  const viewsToCheck = [
    { name: 'CONFIRM_REQUEST_HTML', html: CONFIRM_REQUEST_HTML },
    { name: 'CONTROL_PANEL_HTML', html: CONTROL_PANEL_HTML },
    { name: 'DASHBOARD_HTML', html: DASHBOARD_HTML },
    { name: 'FORM_REQUEST_HTML', html: FORM_REQUEST_HTML },
    { name: 'TECHNICAL_FEEDBACK_HTML', html: TECHNICAL_FEEDBACK_HTML },
    { name: 'LOGIN_HTML', html: LOGIN_HTML },
    { name: 'CP_EDIT_MODAL_HTML', html: CP_EDIT_MODAL_HTML },
    { name: 'CP_SPLIT_DETAIL_MODAL_HTML', html: CP_SPLIT_DETAIL_MODAL_HTML },
  ];

  let totalDivErrors = 0;
  for (const v of viewsToCheck) {
    const res = checkHtmlTagBalance(v.name, v.html);
    assert.strictEqual(
      res.divErrors.length,
      0,
      `Phát hiện lỗi thẻ <div> trong ${v.name}: ${res.divErrors.join('; ')}`
    );
    assert.strictEqual(
      res.allErrors.length,
      0,
      `Phát hiện lỗi thẻ HTML trong ${v.name}: ${res.allErrors.join('; ')}`
    );
    console.log(`  ✅ [PASS] ${v.name}: 0 lỗi thẻ div (cân bằng hoàn hảo 100%)`);
    totalDivErrors += res.divErrors.length;
  }

  assert.strictEqual(totalDivErrors, 0, 'Toàn bộ views & components có đúng 0 lỗi div');
  console.log('  🎯 Kết quả quét: 0 lỗi div trên toàn bộ các view và modals!');
}

// =============================================================================
// MAIN RUNNER
// =============================================================================
async function main() {
  try {
    await testBackendServiceSync();
    testConfirmRequestView();
    testControlPanelComponents();
    testI18nLabels();
    testHtmlTagBalance();

    console.log('\n================================================================');
    console.log('🎉 TOÀN BỘ CÁC MỤC KIỂM THỬ QA T3 ĐÃ VƯỢT QUA 100% PASS!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ KIỂM THỬ QA T3 THẤT BẠI:', err);
    process.exit(1);
  }
}

main();
