import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

console.log('================================================================');
console.log('🧪 KIỂM THỬ T2: FRONTEND CPSF QUALITY & NOTES SPEC');
console.log('================================================================\n');

// 1. Kiểm tra Form CPSF (/confirm-request)
console.log('--- 1. Kiểm tra Form CPSF (confirm-request.view.ts) ---');
const confirmRequestPath = path.resolve(__dirname, '../src/views/confirm-request.view.ts');
const confirmRequestContent = fs.readFileSync(confirmRequestPath, 'utf-8');

// 1.1 CSS class active-warning
assert.ok(
  confirmRequestContent.includes('.btn-toggle.active-warning'),
  'confirm-request.view.ts phải có style .btn-toggle.active-warning'
);
assert.ok(
  confirmRequestContent.includes('#f59e0b') || confirmRequestContent.includes('#fffbeb'),
  'confirm-request.view.ts style active-warning phải mang tông màu amber/warning'
);
console.log('  ✅ [PASS] CSS .btn-toggle.active-warning màu amber/warning tồn tại');

// 1.2 Nút thứ 3: Chạy tạm, tiếp tục theo dõi kèm icon
assert.ok(
  confirmRequestContent.includes("form.chkQuality = 'Chạy tạm, tiếp tục theo dõi'"),
  "Nút thứ 3 gán giá trị form.chkQuality = 'Chạy tạm, tiếp tục theo dõi'"
);
assert.ok(
  confirmRequestContent.includes("active-warning': form.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"),
  'Nút thứ 3 sử dụng style active-warning khi được chọn'
);
assert.ok(
  confirmRequestContent.includes('🟡'),
  'Nút thứ 3 có icon 🟡'
);
console.log('  ✅ [PASS] Nút thứ 3 "Chạy tạm, tiếp tục theo dõi" kèm icon 🟡 và style active-warning tồn tại');

// 1.3 Textarea Ghi chú / Note
assert.ok(
  confirmRequestContent.includes('v-model="form.notes"'),
  'Form CPSF có textarea liên kết v-model="form.notes"'
);
assert.ok(
  confirmRequestContent.includes("t('Notes / Remarks', 'Ghi chú / Ghi nhận')"),
  'Label textarea là Ghi chú / Ghi nhận (Notes / Remarks)'
);
console.log('  ✅ [PASS] Textarea Ghi chú / Note (v-model="form.notes") tồn tại trong form');

// 1.4 Preview Modal (showConfirmModal) hiển thị chất lượng in và Note
const confirmModalIdx = confirmRequestContent.indexOf('v-if="showConfirmModal"');
const confirmModalEnd = confirmRequestContent.indexOf('v-if="successModal"');
const confirmModalSection = confirmRequestContent.substring(confirmModalIdx, confirmModalEnd);

assert.ok(
  confirmModalSection.includes("form.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"),
  'Preview Modal kiểm tra và hiển thị chất lượng in Chạy tạm, tiếp tục theo dõi'
);
assert.ok(
  confirmModalSection.includes('form.notes'),
  'Preview Modal hiển thị trường form.notes'
);
console.log('  ✅ [PASS] Preview modal hiển thị đầy đủ chất lượng in và trường Note');

// 1.5 Success Modal hiển thị chất lượng in và Note
const successModalEnd = confirmRequestContent.indexOf('<!-- Error Alert -->');
const successModalSection = confirmRequestContent.substring(confirmModalEnd, successModalEnd);
assert.ok(
  successModalSection.includes("form.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"),
  'Success Modal kiểm tra và hiển thị chất lượng in Chạy tạm, tiếp tục theo dõi'
);
assert.ok(
  successModalSection.includes('form.notes'),
  'Success Modal hiển thị trường form.notes'
);
console.log('  ✅ [PASS] Success modal hiển thị đầy đủ chất lượng in và trường Note');

// 1.6 Script: form.value.notes và payload gửi đi
assert.ok(
  confirmRequestContent.includes('notes:') && confirmRequestContent.includes('form.value.notes'),
  'Payload gửi POST /api/cpsf bao gồm trường notes từ form.value.notes'
);
console.log('  ✅ [PASS] Form state và payload API gửi notes chính xác');

// 2. Control Panel - Edit Modal (edit-modal.component.ts)
console.log('\n--- 2. Kiểm tra Edit Modal (edit-modal.component.ts) ---');
const editModalPath = path.resolve(__dirname, '../src/views/control-panel/components/modals/edit-modal.component.ts');
const editModalContent = fs.readFileSync(editModalPath, 'utf-8');

assert.ok(
  editModalContent.includes('value="Chạy tạm, tiếp tục theo dõi"'),
  'Dropdown editForm.chkQuality có option "Chạy tạm, tiếp tục theo dõi"'
);
assert.ok(
  editModalContent.includes('editForm.notes'),
  'Edit Modal CPSF có ô nhập editForm.notes'
);
console.log('  ✅ [PASS] Edit Modal CPSF: Đã có option Chạy tạm, tiếp tục theo dõi và ô nhập Note');

// 3. Control Panel - Split Detail Modal (split-detail-modal.component.ts)
console.log('\n--- 3. Kiểm tra Split Detail Modal (split-detail-modal.component.ts) ---');
const splitDetailModalPath = path.resolve(__dirname, '../src/views/control-panel/components/modals/split-detail-modal.component.ts');
const splitDetailModalContent = fs.readFileSync(splitDetailModalPath, 'utf-8');

assert.ok(
  splitDetailModalContent.includes("selectedChain.cpsf.chkQuality === 'Chạy tạm, tiếp tục theo dõi'"),
  'Split Detail Modal kiểm tra chkQuality === "Chạy tạm, tiếp tục theo dõi"'
);
assert.ok(
  splitDetailModalContent.includes('bg-amber-500/10 text-amber-500 border border-amber-500/20'),
  'Split Detail Modal hiển thị badge màu amber cho Chạy tạm, tiếp tục theo dõi'
);
assert.ok(
  splitDetailModalContent.includes('selectedChain.cpsf.notes'),
  'Split Detail Modal hiển thị trường selectedChain.cpsf.notes'
);
console.log('  ✅ [PASS] Split Detail Modal: Badge amber cho Chạy tạm và hiển thị Note nếu có');

// 4. Control Panel - Tabulator CPSF & Script
console.log('\n--- 4. Kiểm tra Tabulator CPSF và script (control-panel.script.ts) ---');
const cpScriptPath = path.resolve(__dirname, '../src/views/control-panel/scripts/control-panel.script.ts');
const cpScriptContent = fs.readFileSync(cpScriptPath, 'utf-8');

assert.ok(
  cpScriptContent.includes("val === 'Chạy tạm, tiếp tục theo dõi'") && cpScriptContent.includes('CONDITIONAL'),
  'Cột Chất lượng trong Tabulator CPSF hiển thị badge CONDITIONAL / CHẠY TẠM'
);
assert.ok(
  cpScriptContent.includes("field: 'notes'"),
  'Bảng Tabulator CPSF có cột Ghi Chú với field: "notes"'
);
assert.ok(
  cpScriptContent.includes('notes: raw.notes || raw.cpsf?.notes || \'\''),
  'openEditModal map notes cho CPSF'
);
assert.ok(
  cpScriptContent.includes('notes: editForm.value.notes || \'\''),
  'submitEditTicket gửi notes lên API cho CPSF'
);
console.log('  ✅ [PASS] Tabulator CPSF: Badge CHẠY TẠM / CONDITIONAL, cột Note, và đồng bộ Edit Modal');

// 5. Control Panel - Management Tasks Tab Filter
console.log('\n--- 5. Kiểm tra Filter Management Tasks (management-tasks-tab.component.ts) ---');
const mgmtTabPath = path.resolve(__dirname, '../src/views/control-panel/modules/management-task-module/management-tasks-tab.component.ts');
const mgmtTabContent = fs.readFileSync(mgmtTabPath, 'utf-8');

assert.ok(
  mgmtTabContent.includes('value="Chạy tạm, tiếp tục theo dõi"'),
  'Dropdown filter CPSF có option "Chạy tạm, tiếp tục theo dõi"'
);
console.log('  ✅ [PASS] Management Tasks Tab: Filter hỗ trợ "Chạy tạm, tiếp tục theo dõi"');

// 6. i18n Dictionary (i18n.ts)
console.log('\n--- 6. Kiểm tra từ điển i18n (src/views/common/i18n.ts) ---');
const i18nPath = path.resolve(__dirname, '../src/views/common/i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

assert.ok(i18nContent.includes("'table.conditional'"), 'i18n có key table.conditional');
assert.ok(i18nContent.includes("'table.conditionalRun'"), 'i18n có key table.conditionalRun');
assert.ok(i18nContent.includes("'table.notes'"), 'i18n có key table.notes');
console.log('  ✅ [PASS] Từ điển i18n đã bổ sung các cặp EN / VI mới');

console.log('\n================================================================');
console.log('🎉 TẤT CẢ TEST SPEC T2 HOÀN TẤT VÀ VƯỢT QUA 100% THÀNH CÔNG!');
console.log('================================================================\n');
