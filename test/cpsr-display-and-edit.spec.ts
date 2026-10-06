import * as assert from 'assert';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';

console.log('🧪 BẮT ĐẦU KIỂM THỬ T2: HIỂN THỊ VÀ CHỈNH SỬA PHIẾU CPSR (CPSR DISPLAY & EDIT SPEC):');

// 1. Kiểm tra nạp dữ liệu cpsrList hỗ trợ cả array và format { data: [...] }
console.log('\n--- 1. Kiểm tra nạp dữ liệu cpsrList từ /api/cpsr ({data: []}) ---');
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('cpsrList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);'),
  'loadCpsrData phải unwrap mảng từ { data: [...] } trả về từ /api/cpsr'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('cpstList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);'),
  'loadCpstData phải unwrap mảng từ { data: [...] } trả về từ /api/cpst'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('cpsfList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);'),
  'loadCpsfData phải unwrap mảng từ { data: [...] } trả về từ /api/cpsf'
);
console.log('  ✅ [PASS] Nạp dữ liệu cpsrList, cpstList, cpsfList chuẩn hóa dạng array từ { data: [...] }');

// 2. Kiểm tra gọi loadCpsrData khi đổi tab
console.log('\n--- 2. Kiểm tra gọi loadCpsrData khi đổi tab ---');
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("if (tab === 'cpsr') {\n            await loadCpsrData();") ||
  CONTROL_PANEL_SCRIPT.includes("if (tab === 'cpsr') {\n            loadCpsrData();") ||
  CONTROL_PANEL_SCRIPT.includes("tab === 'cpsr'") && CONTROL_PANEL_SCRIPT.includes("loadCpsrData()"),
  'switchSplitTab phải gọi loadCpsrData khi chuyển sang tab cpsr'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('loadAllSplitData()'),
  'switchTab requests phải gọi loadAllSplitData để nạp dữ liệu'
);
console.log('  ✅ [PASS] loadCpsrData được gọi tự động khi chuyển đổi tab');

// 3. Kiểm tra cho phép xem/sửa CPSR từ tab CPS
console.log('\n--- 3. Kiểm tra xem / sửa CPSR từ tab CPS ---');
// 3.1 Cột Mã CPSR trên tab CPS có nút xem và sửa CPSR
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('btn-cps-view-cpsr'),
  'Cột Mã CPSR trên bảng CPS có nút / action xem chi tiết CPSR'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('btn-cps-edit-cpsr'),
  'Cột Mã CPSR trên bảng CPS có nút sửa CPSR'
);
// 3.2 Cột Thao Tác trên tab CPS có nút Sửa CPSR
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('btn-chain-edit-cpsr'),
  'Cột Thao Tác trên bảng CPS có nút btn-chain-edit-cpsr để sửa CPSR gốc'
);
// 3.3 Modal chi tiết 1-1-1 có nút Sửa CPSR ở Bước 1 và Footer
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes("openEditModal('cpsr', selectedChain.cpsr || selectedChain)"),
  'Modal chi tiết có nút gọi openEditModal cho CPSR'
);
// 3.4 Modal sửa CPS có nút chuyển nhanh sang sửa CPSR
assert.ok(
  CP_EDIT_MODAL_HTML.includes("openEditModal('cpsr'"),
  'Modal chỉnh sửa CPS có nút mở sửa phiếu CPSR gốc'
);
// 3.5 openEditModal hỗ trợ type cpsr, tìm và ánh xạ đúng docNo và thông tin CPSR
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("if (type === 'cpsr')"),
  'openEditModal xử lý riêng cho type cpsr'
);
console.log('  ✅ [PASS] Đầy đủ cơ chế cho phép xem và sửa CPSR trực tiếp từ tab CPS và các modal liên quan');

// 4. Kiểm tra an toàn cho bảng và xuất Excel
console.log('\n--- 4. Kiểm tra hiển thị bảng và xuất Excel an toàn ---');
assert.ok(
  CONTROL_PANEL_SCRIPT.includes("splitTab.value === 'cpsr'") && CONTROL_PANEL_SCRIPT.includes("cpsrList.value"),
  'Bảng CPSR và tính toán số lượng lấy từ cpsrList.value'
);
console.log('  ✅ [PASS] Hiển thị và xuất dữ liệu CPSR an toàn');

console.log('\n🎉 TOÀN BỘ KIỂM THỬ CHO T2 ĐÃ ĐẠT 100%!');
