import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

console.log('🧪 BẮT ĐẦU KIỂM THỬ T3: BỎ CỘT TIẾN ĐỘ CHUỖI, MÔ TẢ THỪA VÀ NHÃN CHUỖI TIẾN TRÌNH 1-1-1 TRÊN POPUP:');

const BASE_DIR = path.resolve(__dirname, '..');
const SCRIPT_PATH = path.join(BASE_DIR, 'src/views/control-panel/scripts/control-panel.script.ts');
const TAB_PATH = path.join(BASE_DIR, 'src/views/control-panel/modules/management-task-module/management-tasks-tab.component.ts');
const LINK_MODAL_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/modals/link-modal.component.ts');
const SPLIT_MODAL_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/modals/split-detail-modal.component.ts');
const CREATE_CPS_MODAL_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/modals/create-cps-modal.component.ts');
const EDIT_MODAL_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/modals/edit-modal.component.ts');
const TICKET_MODAL_PATH = path.join(BASE_DIR, 'src/views/control-panel/components/modals/ticket-detail-modal.component.ts');

const scriptContent = fs.readFileSync(SCRIPT_PATH, 'utf-8');
const tabContent = fs.readFileSync(TAB_PATH, 'utf-8');
const linkModalContent = fs.readFileSync(LINK_MODAL_PATH, 'utf-8');
const splitModalContent = fs.readFileSync(SPLIT_MODAL_PATH, 'utf-8');
const createCpsModalContent = fs.readFileSync(CREATE_CPS_MODAL_PATH, 'utf-8');
const editModalContent = fs.readFileSync(EDIT_MODAL_PATH, 'utf-8');
const ticketModalContent = fs.readFileSync(TICKET_MODAL_PATH, 'utf-8');

// =========================================================================
// 1. KIỂM TRA LOẠI BỎ CỘT TIẾN ĐỘ CHUỖI TRÊN BẢNG TABULATOR CPS
// =========================================================================
console.log('\n--- 1. Kiểm tra loại bỏ cột Tiến Độ Chuỗi trên bảng Tabulator CPS ---');

// Trích xuất columns của bảng chain / cps
const chainTableMatch = scriptContent.match(/if\s*\(\s*splitTab\.value\s*===\s*'chain'\s*\)\s*\{[\s\S]*?columns\s*=\s*\[([\s\S]*?)\];/);
assert.ok(chainTableMatch, 'Phải tìm thấy khối cấu hình columns của bảng chain trong control-panel.script.ts');

const chainColumnsText = chainTableMatch[1];
assert.ok(
  !chainColumnsText.includes('Tiến Độ Chuỗi'),
  'Bảng Tabulator CPS không được chứa cột "Tiến Độ Chuỗi"'
);
assert.ok(
  !chainColumnsText.includes('🟢 3/3'),
  'Bảng Tabulator CPS không được chứa formatter tiến độ "🟢 3/3"'
);

console.log('  ✅ [PASS] Cột "Tiến Độ Chuỗi" đã được loại bỏ hoàn toàn khỏi bảng Tabulator CPS!');

// =========================================================================
// 2. KIỂM TRA XÓA BỎ DÒNG MÔ TẢ THỪA TRÊN TAB QUẢN LÝ PHIẾU KỸ THUẬT
// =========================================================================
console.log('\n--- 2. Kiểm tra xóa bỏ dòng mô tả "Điều phối toàn diện: Phiếu CPS... qua Tabulator v6" ---');

assert.ok(
  !tabContent.includes('Điều phối toàn diện'),
  'Header Quản lý phiếu kỹ thuật không được chứa dòng mô tả thừa "Điều phối toàn diện"'
);
assert.ok(
  !tabContent.includes('qua Tabulator v6'),
  'Header Quản lý phiếu kỹ thuật không được chứa "qua Tabulator v6"'
);
assert.ok(
  tabContent.includes('Quản Lý Phiếu Kỹ Thuật'),
  'Vẫn giữ nguyên tiêu đề chính "Quản Lý Phiếu Kỹ Thuật"'
);

console.log('  ✅ [PASS] Dòng mô tả thừa "Điều phối toàn diện: Phiếu CPS... qua Tabulator v6" đã được xóa bỏ hoàn toàn!');

// =========================================================================
// 3. KIỂM TRA LOẠI BỎ NHÃN "CHUỖI TIẾN TRÌNH 1-1-1" TRÊN TOÀN BỘ CÁC POPUP MODAL
// =========================================================================
console.log('\n--- 3. Kiểm tra loại bỏ nhãn "Chuỗi Tiến Trình 1-1-1" trên toàn bộ các popup modal ---');

const allModals = [
  { name: 'link-modal', content: linkModalContent },
  { name: 'split-detail-modal', content: splitModalContent },
  { name: 'create-cps-modal', content: createCpsModalContent },
  { name: 'edit-modal', content: editModalContent },
  { name: 'ticket-detail-modal', content: ticketModalContent }
];

for (const modal of allModals) {
  assert.ok(
    !modal.content.includes('Chuỗi Tiến Trình 1-1-1'),
    `Modal [${modal.name}] không được chứa nhãn "Chuỗi Tiến Trình 1-1-1"`
  );
  assert.ok(
    !modal.content.includes('(Chuỗi 1-1-1)'),
    `Modal [${modal.name}] không được chứa nhãn "(Chuỗi 1-1-1)"`
  );
}

console.log('  ✅ [PASS] Tất cả các popup modal đã được loại bỏ sạch nhãn "Chuỗi Tiến Trình 1-1-1" và "(Chuỗi 1-1-1)"!');

console.log('\n🎉 TOÀN BỘ KIỂM THỬ CHO T3 ĐÃ ĐẠT 100%!\n');
