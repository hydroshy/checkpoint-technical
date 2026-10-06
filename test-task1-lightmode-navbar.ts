import * as assert from 'assert';
import { CONTROL_PANEL_HTML } from './src/views/control-panel.view';

console.log('🧪 BẮT ĐẦU KIỂM THỬ XÁC MINH TASK 1 (LIGHT MODE, NAV BAR & TIÊU ĐỀ):');

// 1. Kiểm tra Tiêu đề
console.log('\n1. Xác minh tiêu đề chuẩn hóa "Quản Lý Phiếu Kỹ Thuật":');
assert.ok(CONTROL_PANEL_HTML.includes('<title>Quản Lý Phiếu Kỹ Thuật</title>'), 'HTML title tag phải là Quản Lý Phiếu Kỹ Thuật');
assert.ok(CONTROL_PANEL_HTML.includes('<h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Quản Lý Phiếu Kỹ Thuật</h1>'), 'Tiêu đề h1 chính phải chỉ ghi Quản Lý Phiếu Kỹ Thuật');
assert.ok(!CONTROL_PANEL_HTML.includes('<h1 class="text-xl font-bold tracking-tight">Quản Lý Phiếu Kỹ Thuật (CPSR • CPST • CPSF)</h1>'), 'Tiêu đề h1 không còn kèm ngoặc (CPSR • CPST • CPSF)');
assert.ok(CONTROL_PANEL_HTML.includes('Quản Lý Phiếu Kỹ Thuật</span>'), 'Header bar hiển thị Quản Lý Phiếu Kỹ Thuật');
console.log('   ✓ Tiêu đề trang, h1 và header bar đã chuẩn hóa chỉ ghi Quản Lý Phiếu Kỹ Thuật.');

// 2. Kiểm tra Nav Bar Sidebar tinh giản
console.log('\n2. Xác minh tinh giản Nav Bar Sidebar:');
// Trích xuất nội dung sidebar <aside>...</aside>
const asideMatch = CONTROL_PANEL_HTML.match(/<aside[\s\S]*?<\/aside>/);
assert.ok(asideMatch, 'Phải có thẻ <aside> cho sidebar');
const sidebarHtml = asideMatch[0];

assert.ok(sidebarHtml.includes('Quản lý phiếu kỹ thuật'), 'Sidebar phải hiển thị Quản lý phiếu kỹ thuật');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('overview')\""), 'Sidebar không được có nút Tổng Quan & Phân Tích');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('assign-tasks')\""), 'Sidebar không được có nút Phân Công Kỹ Thuật (Cards)');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('machines')\""), 'Sidebar không được có nút Máy Móc & Thiết Bị');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('employees')\""), 'Sidebar không được có nút Nhân Sự & Bộ Phận');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('users')\""), 'Sidebar không được có nút Danh Sách User & Phân Quyền');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('existing-data')\""), 'Sidebar không được có nút Dữ Liệu Vận Hành & Báo Cáo');
console.log('   ✓ Nav Bar sidebar đã tinh giản thành công, chỉ còn hiển thị duy nhất Quản lý phiếu kỹ thuật.');

// 3. Kiểm tra Chế độ sáng (Light Mode) và độ tương phản
console.log('\n3. Xác minh chế độ sáng (Light Mode) và độ tương phản màu sắc:');
assert.ok(CONTROL_PANEL_HTML.includes("darkMode: 'class'"), 'Tailwind phải được cấu hình darkMode: class để không bị ảnh hưởng bởi OS theme');
assert.ok(CONTROL_PANEL_HTML.includes('html.theme-light body'), 'Phải có CSS cho html.theme-light body');
assert.ok(CONTROL_PANEL_HTML.includes('background-color: #f8fafc;'), 'Nền Light mode chuẩn #f8fafc');
assert.ok(CONTROL_PANEL_HTML.includes('color: #0f172a;'), 'Màu chữ Light mode tối rõ nét #0f172a');
assert.ok(CONTROL_PANEL_HTML.includes('html.theme-light .tabulator .btn-chain-view'), 'Có CSS tương phản cao cho nút Xem trên Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes('html.theme-light .tabulator .btn-chain-assign'), 'Có CSS tương phản cao cho nút Phân công trên Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes('const activeTab = ref(\'requests\');'), 'Default activeTab là requests để vào thẳng Quản lý phiếu kỹ thuật');
console.log('   ✓ Chế độ sáng rõ ràng, độ tương phản Tabulator và form đạt chuẩn.');

console.log('\n🎉 TẤT CẢ CÁC MỤC KIỂM THỬ TASK 1 HOÀN TẤT VÀ ĐẠT 100%!');
