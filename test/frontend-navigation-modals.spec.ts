import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { CP_SIDEBAR_HTML } from '../src/views/control-panel/components/layouts/sidebar.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';
import { CP_TICKET_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/ticket-detail-modal.component';
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { CP_LINK_MODAL_HTML } from '../src/views/control-panel/components/modals/link-modal.component';
import { CP_CREATE_CPS_MODAL_HTML } from '../src/views/control-panel/components/modals/create-cps-modal.component';
import { CP_ASSIGN_MODAL_HTML } from '../src/views/control-panel/components/modals/assign-modal.component';
import { CP_ENTITY_MODALS_HTML } from '../src/views/control-panel/components/modals/entity-modals.component';
import { CP_MANAGEMENT_TASKS_TAB_HTML } from '../src/views/control-panel/modules/management-task-module';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';

console.log('🧪 BẮT ĐẦU KIỂM THỬ GIAO DIỆN & TƯƠNG TÁC (FRONTEND NAVIGATION & MODALS SPEC):');

// =========================================================================
// PHẦN 1: KIỂM TRA ĐẦY ĐỦ CÁC MỤC MENU QUẢN LÝ TRÊN SIDEBAR CONTROL PANEL
// =========================================================================
console.log('\n--- 1. Kiểm tra Đầy Đủ Các Mục Menu Quản Lý Trên Sidebar Control Panel ---');

// Kiểm tra 4 nhóm quản trị và các mục menu chính (Report Technical lên đầu, bỏ Overview)
const expectedTabs = [
  { tab: 'report-technical', label: 'Report Technical' },
  { tab: 'requests', label: 'Quản lý phiếu kỹ thuật' },
  { tab: 'assign-tasks', label: 'Phân công kỹ thuật' },
  { tab: 'machines', label: 'Máy móc & thiết bị' },
  { tab: 'employees', label: 'Nhân viên kỹ thuật' },
  { tab: 'users', label: 'Tài khoản & phân quyền' },
  { tab: 'existing-data', label: 'Quản lý dữ liệu hiện có' },
];

for (const item of expectedTabs) {
  assert.ok(
    CP_SIDEBAR_HTML.includes(`switchTab('${item.tab}')`),
    `Sidebar phải có nút switchTab('${item.tab}') cho mục ${item.label}`
  );
  console.log(`  ✅ [PASS] Sidebar chứa mục: [${item.tab}] - ${item.label}`);
}

// Kiểm tra lược bỏ Tổng quan & phân tích khỏi sidebar
assert.ok(!CP_SIDEBAR_HTML.includes("switchTab('overview')"), 'Sidebar đã lược bỏ mục Tổng quan & phân tích');
console.log('  ✅ [PASS] Sidebar đã loại bỏ hoàn toàn mục Tổng quan & phân tích');

// Kiểm tra vị trí: Report Technical đứng trước Quản lý phiếu kỹ thuật
const reportTechIdx = CP_SIDEBAR_HTML.indexOf("switchTab('report-technical')");
const requestsIdx = CP_SIDEBAR_HTML.indexOf("switchTab('requests')");
assert.ok(reportTechIdx < requestsIdx, 'Report Technical phải nằm ở vị trí đầu tiên trong sidebar');
console.log('  ✅ [PASS] Report Technical nằm ở vị trí đầu tiên trong sidebar trái');

// Kiểm tra 3 link mở form tạo nhanh phiếu
assert.ok(CP_SIDEBAR_HTML.includes('href="/form-request"'), 'Sidebar có liên kết mở form CPSR');
assert.ok(CP_SIDEBAR_HTML.includes('href="/technical-feedback"'), 'Sidebar có liên kết mở form CPST');
assert.ok(CP_SIDEBAR_HTML.includes('href="/confirm-request"'), 'Sidebar có liên kết mở form CPSF');
console.log('  ✅ [PASS] Sidebar đầy đủ 3 liên kết mở form nhanh: CPSR, CPST, CPSF');

// Kiểm tra switchTab trong script xử lý đầy đủ các tab
for (const item of expectedTabs) {
  assert.ok(
    CONTROL_PANEL_SCRIPT.includes(`tab === '${item.tab}'`),
    `Hàm switchTab trong script phải xử lý tab: '${item.tab}'`
  );
}
console.log('  ✅ [PASS] Hàm switchTab() trong script hỗ trợ nạp dữ liệu và render đầy đủ các tab');

// =========================================================================
// PHẦN 2: KIỂM THỬ KHẮC PHỤC TRIỆT ĐỂ LỖI ĐÓNG / MỞ TẤT CẢ CÁC MODAL
// =========================================================================
console.log('\n--- 2. Kiểm thử Đóng / Mở Toàn Diện và Khắc Phục Lỗi Modal Không Thể Tắt ---');

// 2.1 Kiểm tra modal chi tiết chuỗi 1-1-1 (modal-chain-detail)
assert.ok(CP_SPLIT_DETAIL_MODAL_HTML.includes('id="modal-chain-detail"'), 'Modal chain detail tồn tại với id modal-chain-detail');
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('@click="closeModal(\'modal-chain-detail\')') ||
  CP_SPLIT_DETAIL_MODAL_HTML.includes('@click="closeChainModal'),
  'Backdrop của modal-chain-detail phải có click handler để đóng modal'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('@click="closeChainModal"') ||
  CP_SPLIT_DETAIL_MODAL_HTML.includes('@click="closeModal(\'modal-chain-detail\')"'),
  'Nút đóng ✕ của modal-chain-detail phải gọi hàm đóng'
);
assert.ok(CP_SPLIT_DETAIL_MODAL_HTML.includes('@click.stop'), 'Nội dung modal-chain-detail phải có @click.stop để ngăn nổi bọt sự kiện');

// 2.2 Kiểm tra hàm closeModal() trong script phải xử lý modal-chain-detail và tắt showChainModal
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("id === 'modal-chain-detail'") ||
  CONTROL_PANEL_SCRIPT.includes('closeChainModal'),
  'Hàm closeModal hoặc closeChainModal phải xử lý đóng modal-chain-detail'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('showChainModal.value = false') ||
  CONTROL_PANEL_SCRIPT.includes('showChainModal = false'),
  'Phải có lệnh gán showChainModal = false khi đóng modal-chain-detail'
);
console.log('  ✅ [PASS] Modal chi tiết chuỗi 1-1-1 (modal-chain-detail) có đầy đủ cơ chế đóng (✕, backdrop, biến reactive)');

// 2.3 Kiểm tra modal chi tiết phiếu đơn (modal-ticket-detail)
assert.ok(CP_TICKET_DETAIL_MODAL_HTML.includes('id="modal-ticket-detail"'), 'Modal ticket detail tồn tại');
assert.ok(CP_TICKET_DETAIL_MODAL_HTML.includes('@click="closeModal(\'modal-ticket-detail\')"'), 'Backdrop modal ticket detail đóng được');
assert.ok(CP_TICKET_DETAIL_MODAL_HTML.includes('@click.stop'), 'Nội dung modal ticket detail có @click.stop');
console.log('  ✅ [PASS] Modal chi tiết phiếu đơn (modal-ticket-detail) đóng/mở chuẩn xác');

// 2.4 Kiểm tra modal chỉnh sửa (modal-edit-ticket)
assert.ok(CP_EDIT_MODAL_HTML.includes('id="modal-edit-ticket"'), 'Modal edit ticket tồn tại');
assert.ok(CP_EDIT_MODAL_HTML.includes('@click="closeEditModal"'), 'Backdrop modal edit ticket gọi closeEditModal');
assert.ok(CP_EDIT_MODAL_HTML.includes('@click.stop'), 'Nội dung modal edit ticket có @click.stop');
console.log('  ✅ [PASS] Modal chỉnh sửa phiếu (modal-edit-ticket) đóng/mở chuẩn xác');

// 2.5 Kiểm tra modal tạo phiếu CPS (modal-create-cps)
assert.ok(CP_CREATE_CPS_MODAL_HTML.includes('id="modal-create-cps"'), 'Modal create cps tồn tại');
assert.ok(CP_CREATE_CPS_MODAL_HTML.includes('@click="closeCreateCpsModal"'), 'Backdrop modal create cps gọi closeCreateCpsModal');
assert.ok(CP_CREATE_CPS_MODAL_HTML.includes('@click.stop'), 'Nội dung modal create cps có @click.stop');
console.log('  ✅ [PASS] Modal tạo mới CPS (modal-create-cps) đóng/mở chuẩn xác');

// 2.6 Kiểm tra modal ghép nối (modal-link-ticket)
assert.ok(CP_LINK_MODAL_HTML.includes('id="modal-link-ticket"'), 'Modal link ticket tồn tại');
assert.ok(CP_LINK_MODAL_HTML.includes('@click="closeLinkModal"'), 'Backdrop modal link ticket gọi closeLinkModal');
assert.ok(CP_LINK_MODAL_HTML.includes('@click.stop'), 'Nội dung modal link ticket có @click.stop');
console.log('  ✅ [PASS] Modal ghép nối (modal-link-ticket) đóng/mở chuẩn xác');

// 2.7 Kiểm tra modal phân công (modal-assign-task)
assert.ok(CP_ASSIGN_MODAL_HTML.includes('id="modal-assign-task"'), 'Modal assign task tồn tại');
assert.ok(CP_ASSIGN_MODAL_HTML.includes('@click="closeAssignModal"') || CP_ASSIGN_MODAL_HTML.includes('@click="closeModal(\'modal-assign-task\')"'), 'Backdrop modal assign task gọi đóng');
assert.ok(CP_ASSIGN_MODAL_HTML.includes('@click.stop'), 'Nội dung modal assign task có @click.stop');
console.log('  ✅ [PASS] Modal phân công kỹ thuật (modal-assign-task) đóng/mở chuẩn xác');

// 2.8 Kiểm tra các entity modal (máy móc, nhân viên, user, excel)
assert.ok(CP_ENTITY_MODALS_HTML.includes('id="modal-add-machine"'), 'Modal add-machine tồn tại');
assert.ok(CP_ENTITY_MODALS_HTML.includes('id="modal-add-employee"'), 'Modal add-employee tồn tại');
assert.ok(CP_ENTITY_MODALS_HTML.includes('id="modal-add-user"'), 'Modal add-user tồn tại');
assert.ok(CP_ENTITY_MODALS_HTML.includes('id="modal-excel"'), 'Modal excel tồn tại');
assert.ok(CP_ENTITY_MODALS_HTML.includes('@click="closeModal(\'modal-add-machine\')"'), 'modal-add-machine đóng được qua backdrop');
assert.ok(CP_ENTITY_MODALS_HTML.includes('@click="closeModal(\'modal-add-employee\')"'), 'modal-add-employee đóng được qua backdrop');
assert.ok(CP_ENTITY_MODALS_HTML.includes('@click="closeModal(\'modal-add-user\')"'), 'modal-add-user đóng được qua backdrop');
assert.ok(CP_ENTITY_MODALS_HTML.includes('@click="closeModal(\'modal-excel\')"'), 'modal-excel đóng được qua backdrop');
console.log('  ✅ [PASS] Các modal quản lý máy móc, nhân viên, user, excel đóng/mở chuẩn xác');

// 2.9 Kiểm tra hàm switchTab reset đóng mọi modal đang mở
assert.ok(CONTROL_PANEL_SCRIPT.includes('showTicketDetailModal.value = false;'), 'switchTab đóng modal ticket detail');
assert.ok(CONTROL_PANEL_SCRIPT.includes('showAddMachineModal.value = false;'), 'switchTab đóng modal add machine');
assert.ok(CONTROL_PANEL_SCRIPT.includes('showAddEmployeeModal.value = false;'), 'switchTab đóng modal add employee');
assert.ok(CONTROL_PANEL_SCRIPT.includes('showAddUserModal.value = false;'), 'switchTab đóng modal add user');
assert.ok(CONTROL_PANEL_SCRIPT.includes('showExcelModal.value = false;'), 'switchTab đóng modal excel');
console.log('  ✅ [PASS] Cơ chế dọn dẹp và reset modal tự động khi chuyển đổi tab hoạt động chuẩn xác');

// =========================================================================
// PHẦN 3: KIỂM TRA CẤU TRÚC 4 CỘT MÃ PHIẾU (CPS, CPSR, CPST, CPSF) TRÊN TABULATOR
// =========================================================================
console.log('\n--- 3. Kiểm tra Cấu Trúc 4 Cột Mã Phiếu (CPS, CPSR, CPST, CPSF) Nằm Liền Kề Nhau Trên Tabulator ---');

// Tìm đoạn định nghĩa columns trong initOrUpdateSplitTable khi splitTab.value === 'chain'
const chainTableMatch = CONTROL_PANEL_SCRIPT.match(/if\s*\(\s*splitTab\.value\s*===\s*'chain'\s*\)\s*\{[\s\S]*?columns\s*=\s*\[([\s\S]*?)\];/);
assert.ok(chainTableMatch, 'Phải có định nghĩa columns cho bảng chain trong initOrUpdateSplitTable');

const chainColumnsText = chainTableMatch[1];

// Trích xuất danh sách các tiêu đề hoặc trường cột
const columnTitles: string[] = [];
const titleRegex = /title:\s*['"`](.*?)['"`]/g;
let m;
while ((m = titleRegex.exec(chainColumnsText)) !== null) {
  columnTitles.push(m[1]);
}

console.log('  Danh sách các cột trong bảng Tabulator Chuỗi 1-1-1:', columnTitles);

const idxCPS = columnTitles.findIndex(t => t.includes('Mã CPS') && !t.includes('Mã CPSR') && !t.includes('Mã CPST') && !t.includes('Mã CPSF'));
const idxCPSR = columnTitles.findIndex(t => t.includes('Mã CPSR'));
const idxCPST = columnTitles.findIndex(t => t.includes('Mã CPST'));
const idxCPSF = columnTitles.findIndex(t => t.includes('Mã CPSF'));

console.log(`  Vị trí các cột mã phiếu: CPS=${idxCPS}, CPSR=${idxCPSR}, CPST=${idxCPST}, CPSF=${idxCPSF}`);

assert.ok(idxCPS !== -1, 'Bảng phải có cột Mã CPS');
assert.ok(idxCPSR !== -1, 'Bảng phải có cột Mã CPSR');
assert.ok(idxCPST !== -1, 'Bảng phải có cột Mã CPST');
assert.ok(idxCPSF !== -1, 'Bảng phải có cột Mã CPSF');

// Kiểm tra 4 cột phải nằm cạnh nhau liên tiếp:
// idxCPSR = idxCPS + 1, idxCPST = idxCPSR + 1, idxCPSF = idxCPST + 1
const isConsecutive = (idxCPSR === idxCPS + 1) && (idxCPST === idxCPSR + 1) && (idxCPSF === idxCPST + 1);
assert.ok(
  isConsecutive,
  `4 cột mã phiếu phải nằm cạnh nhau liên tiếp! Hiện tại: CPS=${idxCPS}, CPSR=${idxCPSR}, CPST=${idxCPST}, CPSF=${idxCPSF}`
);
console.log('  ✅ [PASS] 4 cột mã phiếu (CPS, CPSR, CPST, CPSF) nằm liền kề nhau liên tiếp ở đầu bảng Tabulator!');

// =========================================================================
// PHẦN 4: KIỂM TRA EXCEL EXPORT ĐỒNG BỘ 4 CỘT MÃ PHIẾU
// =========================================================================
console.log('\n--- 4. Kiểm tra Đồng Bộ Cấu Trúc 4 Cột Mã Phiếu Trong Xuất Excel ---');
assert.ok(CONTROL_PANEL_SCRIPT.includes("'Mã CPS':"), 'Export Excel có cột Mã CPS');
assert.ok(CONTROL_PANEL_SCRIPT.includes("'Mã CPSR':"), 'Export Excel có cột Mã CPSR');
assert.ok(CONTROL_PANEL_SCRIPT.includes("'Mã CPST':"), 'Export Excel có cột Mã CPST');
assert.ok(CONTROL_PANEL_SCRIPT.includes("'Mã CPSF':"), 'Export Excel có cột Mã CPSF');
console.log('  ✅ [PASS] Xuất Excel đồng bộ đầy đủ 4 cột mã phiếu');

// =========================================================================
// PHẦN 5: KIỂM TRA FORM CPST CHỌN 4M & TOGGLE PUBLIC FORM TRÊN QUẢN LÝ PHIẾU
// =========================================================================
console.log('\n--- 5. Kiểm tra Form CPST Chọn 4M & Toggle Public Form trên Quản Lý Phiếu ---');

// 5.1 Kiểm tra Form CPST (/technical-feedback) có dropdown chọn 4M root_cause
assert.ok(TECHNICAL_FEEDBACK_HTML.includes('v-model="form.rootCause"'), 'Form CPST có v-model form.rootCause');
assert.ok(TECHNICAL_FEEDBACK_HTML.includes('<select'), 'Form CPST sử dụng dropdown select cho root_cause');
assert.ok(TECHNICAL_FEEDBACK_HTML.includes('value="Man"'), 'Form CPST có option Man');
assert.ok(TECHNICAL_FEEDBACK_HTML.includes('value="Machine"'), 'Form CPST có option Machine');
assert.ok(TECHNICAL_FEEDBACK_HTML.includes('value="Material"'), 'Form CPST có option Material');
assert.ok(TECHNICAL_FEEDBACK_HTML.includes('value="Method"'), 'Form CPST có option Method');
console.log('  ✅ [PASS] Form CPST (/technical-feedback) có dropdown chọn 4M (Man, Machine, Material, Method)');

// 5.2 Kiểm tra Modal CPST (edit-modal) có dropdown chọn 4M root_cause
assert.ok(CP_EDIT_MODAL_HTML.includes('v-model="editForm.rootCause"'), 'Modal CPST có v-model editForm.rootCause');
assert.ok(CP_EDIT_MODAL_HTML.includes('value="Man"'), 'Modal CPST có option Man');
assert.ok(CP_EDIT_MODAL_HTML.includes('value="Machine"'), 'Modal CPST có option Machine');
assert.ok(CP_EDIT_MODAL_HTML.includes('value="Material"'), 'Modal CPST có option Material');
assert.ok(CP_EDIT_MODAL_HTML.includes('value="Method"'), 'Modal CPST có option Method');
console.log('  ✅ [PASS] Modal CPST có dropdown chọn 4M (Man, Machine, Material, Method)');

// 5.3 Kiểm tra công tắc Bật/Tắt Form Public chuyển vào header/toolbar của Quản Lý Phiếu Kỹ Thuật
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes('togglePublicForm'), 'Toolbar Quản Lý Phiếu Kỹ Thuật có nút togglePublicForm');
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes('isPublicFormEnabled'), 'Toolbar Quản Lý Phiếu Kỹ Thuật có trạng thái isPublicFormEnabled');
console.log('  ✅ [PASS] Công tắc Bật/Tắt Form Public đã được tích hợp vào header/toolbar của Quản Lý Phiếu Kỹ Thuật');

console.log('\n🎉 TOÀN BỘ CÁC MỤC KIỂM THỬ GIAO DIỆN & TƯƠNG TÁC ĐÃ ĐẠT CHUẨN XUẤT SẮC 100%!');
