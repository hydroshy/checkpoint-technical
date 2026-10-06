import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { CP_SIDEBAR_HTML } from '../src/views/control-panel/components/layouts/sidebar.component';
import {
  CP_MANAGEMENT_TASKS_TAB_HTML,
  MANAGEMENT_TASK_CSS,
  formatTechnicianName,
  getCpsChainProgress,
  getCpsLinkedDocNos,
  debounce,
} from '../src/views/control-panel/modules/management-task-module';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';

console.log('🧪 BẮT ĐẦU KIỂM THỬ MODULE QUẢN LÝ PHIẾU KỸ THUẬT (MANAGEMENT-TASK-MODULE SPEC):');

// =========================================================================
// 1. KIỂM THỬ ĐÓNG GÓI MODULE MANAGEMENT-TASK-MODULE
// =========================================================================
console.log('\n--- 1. Kiểm thử Đóng Gói Module management-task-module ---');

const moduleDir = path.resolve(__dirname, '../src/views/control-panel/modules/management-task-module');
assert.ok(fs.existsSync(moduleDir), 'Thư mục module management-task-module phải tồn tại');
assert.ok(fs.existsSync(path.join(moduleDir, 'index.ts')), 'index.ts phải tồn tại');
assert.ok(fs.existsSync(path.join(moduleDir, 'management-tasks-tab.component.ts')), 'management-tasks-tab.component.ts phải tồn tại');
assert.ok(fs.existsSync(path.join(moduleDir, 'management-task.helpers.ts')), 'management-task.helpers.ts phải tồn tại');
assert.ok(fs.existsSync(path.join(moduleDir, 'management-task.style.ts')), 'management-task.style.ts phải tồn tại');

assert.ok(typeof CP_MANAGEMENT_TASKS_TAB_HTML === 'string' && CP_MANAGEMENT_TASKS_TAB_HTML.length > 0, 'CP_MANAGEMENT_TASKS_TAB_HTML phải là string không rỗng');
assert.ok(CONTROL_PANEL_HTML.includes('management-task-container'), 'CONTROL_PANEL_HTML phải chứa management-task-container');
assert.ok(CONTROL_PANEL_HTML.includes('VIEW 2: MODULE QUẢN LÝ PHIẾU KỸ THUẬT (MANAGEMENT-TASK-MODULE)'), 'Template của management-task-module được mount vào Control Panel');
console.log('  ✅ [PASS] Module management-task-module đóng gói độc lập và tích hợp chuẩn xác vào Control Panel');

// =========================================================================
// 2. KIỂM THỬ CHỈ CÓ 1 MỤC DUY NHẤT TRÊN SIDEBAR NAV BAR
// =========================================================================
console.log('\n--- 2. Kiểm thử 1 Mục Duy Nhất Trên Sidebar Nav Bar ---');

// Kiểm tra Sidebar chỉ có 1 nút switchTab('requests') duy nhất
const requestsButtonMatches = CP_SIDEBAR_HTML.match(/@click="switchTab\('requests'\)"/g);
assert.strictEqual(requestsButtonMatches?.length, 1, 'Sidebar chỉ có đúng 1 nút điều hướng tới requests');
assert.ok(CP_SIDEBAR_HTML.includes('Quản lý phiếu kỹ thuật'), 'Sidebar hiển thị tiêu đề Quản lý phiếu kỹ thuật');

// Kiểm tra sidebar không hiển thị các sub-item dạng list làm rối menu
assert.ok(
  !CP_SIDEBAR_HTML.includes('<div class="pl-6 space-y-0.5">'),
  'Sidebar đã loại bỏ các sub-item phân nhánh thừa'
);
console.log('  ✅ [PASS] Sidebar Nav Bar chỉ duy nhất 1 mục dẫn vào Quản lý phiếu kỹ thuật');

// =========================================================================
// 3. KIỂM THỬ CHIA RÕ 4 MỤC CPS, CPSR, CPST, CPSF (CPS LINK CẢ 3 PHIẾU)
// =========================================================================
console.log('\n--- 3. Kiểm thử Chia Rõ 4 Mục CPS, CPSR, CPST, CPSF & CPS Link Cả 3 Phiếu ---');

// 3.1 Kiểm tra 4 tab riêng biệt
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes("switchSplitTab('chain')"), 'Có tab Phiếu CPS (Chuỗi 1-1-1)');
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes("switchSplitTab('cpsr')"), 'Có tab Phiếu Yêu Cầu (CPSR)');
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes("switchSplitTab('cpst')"), 'Có tab Phản Hồi KT (CPST)');
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes("switchSplitTab('cpsf')"), 'Có tab Bàn Giao (CPSF)');

// 3.2 Kiểm tra banner hướng dẫn liên kết CPS
assert.ok(
  CP_MANAGEMENT_TASKS_TAB_HTML.includes('Điều phối trung tâm liên kết cả 3 phiếu'),
  'Có banner giải thích rõ ràng CPS liên kết cả 3 phiếu CPSR, CPST, CPSF'
);

// 3.3 Kiểm tra logic helper getCpsChainProgress
const fullChain = {
  cpsrDocNo: 'CPSR-20261006-001',
  cpstDocNo: 'CPST-20261006-001',
  cpsfDocNo: 'CPSF-20261006-001',
};
const progressFull = getCpsChainProgress(fullChain);
assert.strictEqual(progressFull.count, 3);
assert.strictEqual(progressFull.label, '3/3');
assert.strictEqual(progressFull.percent, 100);

const partialChain = { cpsrDocNo: 'CPSR-20261006-001' };
const progressPartial = getCpsChainProgress(partialChain);
assert.strictEqual(progressPartial.count, 1);
assert.strictEqual(progressPartial.label, '1/3');

// 3.4 Kiểm tra helper getCpsLinkedDocNos
const linkedDocs = getCpsLinkedDocNos(fullChain);
assert.strictEqual(linkedDocs.cpsrDocNo, 'CPSR-20261006-001');
assert.strictEqual(linkedDocs.cpstDocNo, 'CPST-20261006-001');
assert.strictEqual(linkedDocs.cpsfDocNo, 'CPSF-20261006-001');
assert.strictEqual(linkedDocs.cpsDocNo, 'CPS-20261006-001');

console.log('  ✅ [PASS] Giao diện chia rõ 4 mục và liên kết toàn diện 3 phiếu trong CPS');

// =========================================================================
// 4. KIỂM THỬ CHUẨN HÓA TECHNICIAN
// =========================================================================
console.log('\n--- 4. Kiểm thử Chuẩn Hóa Technician ---');

assert.strictEqual(formatTechnicianName('KTV Đỗ Đức Nhật - VN5944'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName('Technician Hoàng Gia Huy'), 'Hoàng Gia Huy');
assert.strictEqual(formatTechnicianName('KTV Nguyễn Văn A'), 'Nguyễn Văn A');
assert.strictEqual(formatTechnicianName('Nguyễn Văn B - VN1234'), 'Nguyễn Văn B');

// Kiểm tra views không còn chuỗi "KTV tiếp nhận"
const confirmRequestView = fs.readFileSync(path.resolve(__dirname, '../src/views/confirm-request.view.ts'), 'utf-8');
const techFeedbackView = fs.readFileSync(path.resolve(__dirname, '../src/views/technical-feedback.view.ts'), 'utf-8');

assert.ok(!confirmRequestView.includes('KTV tiếp nhận:'), 'confirm-request.view.ts không còn KTV tiếp nhận:');
assert.ok(confirmRequestView.includes('Technician tiếp nhận:'), 'confirm-request.view.ts đã đổi thành Technician tiếp nhận:');

assert.ok(!techFeedbackView.includes('KTV tiếp nhận:'), 'technical-feedback.view.ts không còn KTV tiếp nhận:');
assert.ok(techFeedbackView.includes('Technician tiếp nhận:'), 'technical-feedback.view.ts đã đổi thành Technician tiếp nhận:');
assert.ok(techFeedbackView.includes('Technician tiếp nhận <span class="text-rose-500">*</span>'), 'technical-feedback.view.ts có label Technician tiếp nhận');

console.log('  ✅ [PASS] Đã chuẩn hóa toàn diện nhãn "Technician tiếp nhận" và tên Technician');

// =========================================================================
// 5. KIỂM THỬ TỐI ƯU TỐC ĐỘ LOAD VÀ TRUY VẤN
// =========================================================================
console.log('\n--- 5. Kiểm thử Tối Ưu Tốc Độ Load Giao Diện Phiếu ---');

// 5.1 Tabulator sử dụng virtual DOM rendering
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("renderHorizontal: 'virtual'") &&
  CONTROL_PANEL_SCRIPT.includes("renderVertical: 'virtual'"),
  'Tabulator bật virtual rendering để tối ưu render siêu tốc'
);

// 5.2 Không recreate DOM table mỗi lần đổi tab (dùng setColumns & setData)
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('splitTable.setColumns(columns)') &&
  CONTROL_PANEL_SCRIPT.includes('splitTable.setData(rawData)'),
  'Cập nhật bảng dùng setColumns & setData tại chỗ thay vì phá hủy DOM'
);

// 5.3 Debounced search filter chống giật lag
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('debouncedApplySplitFilters') &&
  CP_MANAGEMENT_TASKS_TAB_HTML.includes('debouncedApplySplitFilters'),
  'Ô tìm kiếm sử dụng debounce 150ms để tối ưu tốc độ gõ phím'
);

console.log('  ✅ [PASS] Tối ưu hóa toàn diện hiệu năng load và phản hồi của giao diện phiếu');

console.log('\n🎉 TOÀN BỘ KIỂM THỬ CHO MANAGEMENT-TASK-MODULE ĐÃ ĐẠT 100%!');
