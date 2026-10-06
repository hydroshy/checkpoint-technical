import * as assert from 'assert';
import {
  CP_ASSIGN_TASKS_TAB_HTML,
  CP_ASSIGN_MODAL_HTML,
  ASSIGN_TASK_CSS,
  formatTechnicianName,
  getTechnicianDisplayName,
  getCardBorderClass,
} from '../src/views/control-panel/modules/assign-task-module';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { CONTROL_PANEL_CSS } from '../src/views/control-panel/styles/control-panel.style';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';

console.log('🧪 BẮT ĐẦU KIỂM THỬ MODULE PHÂN CÔNG KỸ THUẬT (ASSIGN-TASK-MODULE SPEC):');

// =========================================================================
// PHẦN 1: KIỂM THỬ ĐÓNG GÓI MODULE ASSIGN-TASK-MODULE TRONG CONTROL PANEL
// =========================================================================
console.log('\n--- 1. Kiểm thử Đóng Gói Module assign-task-module ---');

assert.ok(CP_ASSIGN_TASKS_TAB_HTML, 'CP_ASSIGN_TASKS_TAB_HTML phải được export từ assign-task-module');
assert.ok(CP_ASSIGN_MODAL_HTML, 'CP_ASSIGN_MODAL_HTML phải được export từ assign-task-module');
assert.ok(ASSIGN_TASK_CSS, 'ASSIGN_TASK_CSS phải được export từ assign-task-module');
assert.strictEqual(typeof formatTechnicianName, 'function', 'formatTechnicianName phải là hàm');
assert.strictEqual(typeof getTechnicianDisplayName, 'function', 'getTechnicianDisplayName phải là hàm');
assert.strictEqual(typeof getCardBorderClass, 'function', 'getCardBorderClass phải là hàm');

// Kiểm tra tích hợp vào CONTROL_PANEL_HTML
assert.ok(
  CONTROL_PANEL_HTML.includes('id="modal-assign-task"'),
  'CONTROL_PANEL_HTML phải chứa modal phân công nhiệm vụ từ assign-task-module'
);
assert.ok(
  CONTROL_PANEL_HTML.includes("v-show=\"activeTab === 'assign-tasks'\""),
  'CONTROL_PANEL_HTML phải chứa tab phân công kỹ thuật từ assign-task-module'
);
console.log('  ✅ [PASS] Module assign-task-module đóng gói đầy đủ và tích hợp chuẩn xác vào Control Panel');

// =========================================================================
// PHẦN 2: KIỂM THỬ TINH GỌN GIAO DIỆN (BỎ NÚT VÀ MÔ TẢ THỪA)
// =========================================================================
console.log('\n--- 2. Kiểm thử Tinh Gọn Giao Diện (Bỏ nút Làm mới, Xem Tabulator, (Assign Task), mô tả) ---');

// Bỏ chữ (Assign Task)
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes('Phân Công Kỹ Thuật (Assign Task)'),
  false,
  'Giao diện KHÔNG được chứa chữ "(Assign Task)"'
);
assert.ok(
  CP_ASSIGN_TASKS_TAB_HTML.includes('<span>Phân Công Kỹ Thuật</span>'),
  'Giao diện hiển thị tiêu đề gọn gàng: "Phân Công Kỹ Thuật"'
);

// Bỏ đoạn mô tả nhỏ
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes('Giao diện thẻ (Cards) phân công nhân viên xử lý sự cố CPS'),
  false,
  'Đoạn mô tả phụ nhỏ đã được loại bỏ hoàn toàn'
);

// Bỏ nút "Làm mới"
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes('Làm mới'),
  false,
  'Nút "Làm mới" đã được loại bỏ khỏi top bar'
);

// Bỏ nút "Xem Dạng Bảng (Tabulator)"
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes('Xem Dạng Bảng (Tabulator)'),
  false,
  'Nút "Xem Dạng Bảng (Tabulator)" đã được loại bỏ khỏi top bar'
);

console.log('  ✅ [PASS] Giao diện đã được tinh gọn triệt để: loại bỏ nút và mô tả thừa');

// =========================================================================
// PHẦN 3: KIỂM THỬ CHUẨN HÓA TECHNICIAN & HIỂN THỊ TÊN NHÂN VIÊN
// =========================================================================
console.log('\n--- 3. Kiểm thử Chuẩn Hóa Technician và Hiển Thị Tên Nhân Viên ---');

// Kiểm thử hàm formatTechnicianName
assert.strictEqual(formatTechnicianName('KTV Đỗ Đức Nhật - VN5944'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName('KTV Đỗ Đức Nhật - VN'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName('Đỗ Đức Nhật - VN5944'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName('Đỗ Đức Nhật'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName('Technician Đỗ Đức Nhật - VN5944'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName('ktv Đỗ Đức Nhật'), 'Đỗ Đức Nhật');
assert.strictEqual(formatTechnicianName(''), '');
assert.strictEqual(formatTechnicianName(null), '');
console.log('  ✅ [PASS] formatTechnicianName loại bỏ hoàn toàn "KTV...- VN" và trả về đúng tên nhân viên');

// Kiểm thử getTechnicianDisplayName
assert.strictEqual(
  getTechnicianDisplayName({ assignedTo: 'KTV Đỗ Đức Nhật - VN5944' }),
  'Đỗ Đức Nhật'
);
assert.strictEqual(
  getTechnicianDisplayName({ assignedToName: 'Đỗ Đức Nhật' }),
  'Đỗ Đức Nhật'
);
assert.strictEqual(
  getTechnicianDisplayName({ assignedToName: 'Đỗ Đức Nhật', assignedTo: 'KTV Đỗ Đức Nhật - VN5944' }),
  'Đỗ Đức Nhật'
);
console.log('  ✅ [PASS] getTechnicianDisplayName hiển thị đúng tên nhân viên');

// Kiểm tra hiển thị label Technician thay cho KTV trên card
assert.ok(
  CP_ASSIGN_TASKS_TAB_HTML.includes('>Technician:</span>'),
  'Card phải hiển thị nhãn "Technician:" thay vì "KTV:"'
);
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes('>KTV:</span>'),
  false,
  'Card KHÔNG được hiển thị nhãn cũ "KTV:"'
);

// Nút đổi KTV -> Đổi Technician
assert.ok(
  CP_ASSIGN_TASKS_TAB_HTML.includes('Đổi Technician'),
  'Nút trên card phải hiển thị "Đổi Technician" thay vì "Đổi KTV"'
);
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes('Đổi KTV'),
  false,
  'Nút trên card KHÔNG được còn chữ "Đổi KTV"'
);

// Modal phân công dùng Technician
assert.ok(
  CP_ASSIGN_MODAL_HTML.includes('Technician tiếp nhận'),
  'Modal phân công hiển thị nhãn "Technician tiếp nhận"'
);
assert.ok(
  CP_ASSIGN_MODAL_HTML.includes('-- Chọn Technician từ danh sách --'),
  'Modal phân công placeholder chọn Technician'
);

console.log('  ✅ [PASS] Đã chuẩn hóa toàn diện: nhãn Technician và tên nhân viên chuẩn xác');

// =========================================================================
// PHẦN 4: KIỂM THỬ KHẮC PHỤC TRIỆT ĐỂ LỖI LIGHT MODE
// =========================================================================
console.log('\n--- 4. Kiểm thử Khắc Phục Triệt Để Lỗi Light Mode ---');

// CSS High Contrast Overrides trong Light Mode
assert.ok(
  CONTROL_PANEL_CSS.includes('html.theme-light .text-slate-100'),
  'CSS phải có override text-slate-100 cho Light Mode'
);
assert.ok(
  CONTROL_PANEL_CSS.includes('html.theme-light .text-slate-200'),
  'CSS phải có override text-slate-200 cho Light Mode'
);
assert.ok(
  CONTROL_PANEL_CSS.includes('html.theme-light .text-slate-300'),
  'CSS phải có override text-slate-300 cho Light Mode'
);

// Thẻ card không hardcode nền tối màu trong Light mode
assert.strictEqual(
  CP_ASSIGN_TASKS_TAB_HTML.includes(":class=\"assignCardStatus === 'ALL' ? 'ring-2 ring-sky-500 bg-sky-500/10' : 'bg-slate-900/40 hover:bg-slate-800/60'\""),
  false,
  'Status KPI card không được hardcode nền tối màu bg-slate-900/40 trong Light Mode'
);

// Card border class hỗ trợ Light & Dark
assert.ok(getCardBorderClass('TO_ASSIGN').includes('border-amber-300 dark:border-amber-500/40'));
assert.ok(getCardBorderClass('IN_PROGRESS').includes('border-sky-300 dark:border-sky-500/40'));
assert.ok(getCardBorderClass('OVER_DUE').includes('border-rose-300 dark:border-rose-500/40'));
assert.ok(getCardBorderClass('CLOSED').includes('border-emerald-300 dark:border-emerald-500/40'));
assert.ok(getCardBorderClass(null).includes('border-slate-200 dark:border-slate-700/60'));

console.log('  ✅ [PASS] Toàn bộ style Light Mode đã được khắc phục triệt để, độ tương phản cao và rõ nét');

console.log('\n🎉 TOÀN BỘ KIỂM THỬ CHO ASSIGN-TASK-MODULE ĐÃ ĐẠT 100%!');
