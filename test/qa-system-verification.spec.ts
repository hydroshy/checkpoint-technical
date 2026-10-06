import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';

console.log('🧪 BẮT ĐẦU KIỂM THỬ HỆ THỐNG TOÀN DIỆN (QA SYSTEM VERIFICATION):');

// 1. Kiểm tra build artifact
console.log('\n--- 1. Kiểm tra Build Artifacts & Source Integrity ---');
const distViewPath = path.join(__dirname, '..', 'dist', 'views', 'control-panel.view.js');
assert.ok(fs.existsSync(distViewPath), 'dist/views/control-panel.view.js phải tồn tại');
console.log('  ✅ [PASS] Build artifact tồn tại đầy đủ');

// 2. Kiểm tra Light Mode
console.log('\n--- 2. Kiểm tra Giao Diện Light Mode & Sidebar Theme ---');
assert.ok(CONTROL_PANEL_HTML.includes("darkMode: 'class'"), 'Tailwind cấu hình darkMode: class');
assert.ok(CONTROL_PANEL_HTML.includes('html.theme-light body'), 'CSS html.theme-light body tồn tại');
assert.ok(CONTROL_PANEL_HTML.includes('background-color: #f8fafc;'), 'Background light mode chuẩn');
assert.ok(CONTROL_PANEL_HTML.includes('color: #0f172a;'), 'Color light mode chuẩn');
assert.ok(CONTROL_PANEL_HTML.includes('html.theme-light .tabulator .btn-chain-view'), 'CSS nút Xem theme-light');
assert.ok(CONTROL_PANEL_HTML.includes('html.theme-light .tabulator .btn-chain-assign'), 'CSS nút Phân công theme-light');
assert.ok(CONTROL_PANEL_HTML.includes("const activeTab = ref('requests');"), 'Mặc định activeTab là requests');
console.log('  ✅ [PASS] Chế độ sáng (Light Mode) đã được cấu hình mặc định và đầy đủ style CSS tương phản cao');

// 3. Kiểm tra Nav Bar tinh giản & tiêu đề
console.log('\n--- 3. Kiểm tra Tinh Giản Nav Bar & Chuẩn Hóa Tiêu Đề ---');
assert.ok(CONTROL_PANEL_HTML.includes('<title>Quản Lý Phiếu Kỹ Thuật</title>'), 'HTML title tag phải là Quản Lý Phiếu Kỹ Thuật');
assert.ok(CONTROL_PANEL_HTML.includes('<h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Quản Lý Phiếu Kỹ Thuật</h1>'), 'Tiêu đề h1 chính chuẩn');
assert.ok(!CONTROL_PANEL_HTML.includes('<h1 class="text-xl font-bold tracking-tight">Quản Lý Phiếu Kỹ Thuật (CPSR • CPST • CPSF)</h1>'), 'Không còn ngoặc thừa');
assert.ok(CONTROL_PANEL_HTML.includes('Quản Lý Phiếu Kỹ Thuật</span>'), 'Header bar hiển thị Quản Lý Phiếu Kỹ Thuật');

const asideMatch = CONTROL_PANEL_HTML.match(/<aside[\s\S]*?<\/aside>/);
assert.ok(asideMatch, 'Phải có thẻ aside');
const sidebarHtml = asideMatch[0];
assert.ok(sidebarHtml.includes('Quản lý phiếu kỹ thuật'), 'Sidebar phải hiển thị Quản lý phiếu kỹ thuật');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('overview')\""), 'Sidebar không còn Overview');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('assign-tasks')\""), 'Sidebar không còn Assign-tasks');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('machines')\""), 'Sidebar không còn Machines');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('employees')\""), 'Sidebar không còn Employees');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('users')\""), 'Sidebar không còn Users');
assert.ok(!sidebarHtml.includes("@click=\"switchTab('existing-data')\""), 'Sidebar không còn Existing data');
console.log('  ✅ [PASS] Nav Bar sidebar đã tinh giản triệt để chỉ còn Quản lý phiếu kỹ thuật, tiêu đề chuẩn hóa');

// 4. Kiểm tra khắc phục đơ khi nhấp Chỉnh sửa & các cơ chế reactivity
console.log('\n--- 4. Kiểm tra Chống Đơ Khi Nhấp Chỉnh Sửa & Reactivity Safety ---');
assert.ok(CONTROL_PANEL_HTML.includes('toPlainObject'), 'Phải có helper toPlainObject để tách Vue Proxy');
assert.ok(CONTROL_PANEL_HTML.includes('toRaw'), 'Có import toRaw từ Vue');
assert.ok(CONTROL_PANEL_HTML.includes('e.stopPropagation()'), 'Phải chặn nổi bọt sự kiện khi bấm nút');
assert.ok(CONTROL_PANEL_HTML.includes('safeRedraw'), 'Phải có safeRedraw bảo vệ Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes('safeDestroy'), 'Phải có safeDestroy bảo vệ Tabulator');
assert.ok(!CONTROL_PANEL_HTML.includes('Math.random()'), 'Không còn Math.random() trong danh sách key gây re-render liên tục');
assert.ok(CONTROL_PANEL_HTML.includes('@click.stop="openEditModal'), 'Nút Chỉnh sửa trên Card có @click.stop');
assert.ok(CONTROL_PANEL_HTML.includes('@click.stop="deleteCpsRecord'), 'Nút Xóa trên Card có @click.stop');
console.log('  ✅ [PASS] Khắc phục đơ lag với toPlainObject, chặn nổi bọt sự kiện và bảo vệ lifecycle');

// 5. Kiểm tra 3 nút mở Form CPSR/CPST/CPSF trên Tabulator
console.log('\n--- 5. Kiểm tra 3 Nút Mở Form CPSR/CPST/CPSF trên Toolbar Tabulator ---');
assert.ok(CONTROL_PANEL_HTML.includes('+ Form CPSR'), 'Hiển thị nhãn + Form CPSR');
assert.ok(CONTROL_PANEL_HTML.includes('+ Form CPST'), 'Hiển thị nhãn + Form CPST');
assert.ok(CONTROL_PANEL_HTML.includes('+ Form CPSF'), 'Hiển thị nhãn + Form CPSF');
assert.ok(CONTROL_PANEL_HTML.includes('href="/form-request"'), 'Nút Form CPSR liên kết đúng /form-request');
assert.ok(CONTROL_PANEL_HTML.includes('href="/technical-feedback"'), 'Nút Form CPST liên kết đúng /technical-feedback');
assert.ok(CONTROL_PANEL_HTML.includes('href="/confirm-request"'), 'Nút Form CPSF liên kết đúng /confirm-request');
console.log('  ✅ [PASS] Đầy đủ 3 nút mở Form CPSR, CPST, CPSF trên Tabulator');

// 6. Kiểm tra các modal thao tác (Chỉnh sửa, Ghép nối) & Xóa phiếu
console.log('\n--- 6. Kiểm tra Modal Chỉnh Sửa, Modal Ghép Nối & Chức Năng Xóa ---');
assert.ok(CONTROL_PANEL_HTML.includes('id="modal-edit-ticket"'), 'Có modal modal-edit-ticket');
assert.ok(CONTROL_PANEL_HTML.includes('id="modal-link-ticket"'), 'Có modal modal-link-ticket');
assert.ok(CONTROL_PANEL_HTML.includes('id="modal-create-cps"'), 'Có modal modal-create-cps');
assert.ok(CONTROL_PANEL_HTML.includes('openEditModal'), 'Có hàm openEditModal');
assert.ok(CONTROL_PANEL_HTML.includes('openLinkModal'), 'Có hàm openLinkModal');
assert.ok(CONTROL_PANEL_HTML.includes("unlinkItem('cpst')"), 'Có chức năng unlinkItem cpst');
assert.ok(CONTROL_PANEL_HTML.includes("unlinkItem('cpsf')"), 'Có chức năng unlinkItem cpsf');
assert.ok(CONTROL_PANEL_HTML.includes('deleteSplitRecord'), 'Có hàm deleteSplitRecord');
assert.ok(CONTROL_PANEL_HTML.includes('deleteCpsRecord'), 'Có hàm deleteCpsRecord');
console.log('  ✅ [PASS] Đầy đủ modal chỉnh sửa, ghép nối, xóa phiếu');

console.log('\n🎉 TOÀN BỘ CÁC MỤC KIỂM THỬ QA SYSTEM VERIFICATION ĐÃ VƯỢT QUA 100%!');
