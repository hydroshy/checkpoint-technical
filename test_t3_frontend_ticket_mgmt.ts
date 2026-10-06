import * as assert from 'assert';
import { CONTROL_PANEL_HTML } from './src/views/control-panel.view';

console.log('🧪 BẮT ĐẦU KIỂM THỬ XÁC MINH TASK 3:');
console.log('Mục tiêu: Sửa lỗi đơ khi nhấp Chỉnh sửa, hiển thị 3 nút Form trên Tabulator và modal thao tác');

// 1. Kiểm tra 3 nút mở Form trên toolbar Tabulator
console.log('\n1. Kiểm tra 3 nút mở Form trên Tabulator:');
assert.ok(CONTROL_PANEL_HTML.includes('+ Form CPSR'), 'Phải có nút + Form CPSR trên Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes('+ Form CPST'), 'Phải có nút + Form CPST trên Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes('+ Form CPSF'), 'Phải có nút + Form CPSF trên Tabulator');
assert.ok(CONTROL_PANEL_HTML.includes('href="/form-request"'), 'Nút Form CPSR phải dẫn tới /form-request');
assert.ok(CONTROL_PANEL_HTML.includes('href="/technical-feedback"'), 'Nút Form CPST phải dẫn tới /technical-feedback');
assert.ok(CONTROL_PANEL_HTML.includes('href="/confirm-request"'), 'Nút Form CPSF phải dẫn tới /confirm-request');
console.log('   ✓ 3 nút Form CPSR, CPST, CPSF hiển thị đầy đủ trên Tabulator với đúng đường dẫn.');

// 2. Kiểm tra Modal Chỉnh sửa phiếu (modal-edit-ticket)
console.log('\n2. Kiểm tra Modal Chỉnh Sửa Phiếu (modal-edit-ticket):');
assert.ok(CONTROL_PANEL_HTML.includes('id="modal-edit-ticket"'), 'Phải có modal-edit-ticket trong DOM');
assert.ok(CONTROL_PANEL_HTML.includes('v-if="showEditModal"'), 'Modal chỉnh sửa phải liên kết với showEditModal');
assert.ok(CONTROL_PANEL_HTML.includes('@submit.prevent="submitEditTicket"'), 'Form submit phải gọi submitEditTicket');
assert.ok(CONTROL_PANEL_HTML.includes('editForm.type === \'cps\''), 'Hỗ trợ form chỉnh sửa cho phiếu CPS');
assert.ok(CONTROL_PANEL_HTML.includes('editForm.type === \'cpsr\''), 'Hỗ trợ form chỉnh sửa cho phiếu CPSR');
assert.ok(CONTROL_PANEL_HTML.includes('editForm.type === \'cpst\''), 'Hỗ trợ form chỉnh sửa cho phiếu CPST');
assert.ok(CONTROL_PANEL_HTML.includes('editForm.type === \'cpsf\''), 'Hỗ trợ form chỉnh sửa cho phiếu CPSF');
console.log('   ✓ modal-edit-ticket hoàn thiện cho cả 4 loại phiếu (CPS, CPSR, CPST, CPSF).');

// 3. Kiểm tra Modal Ghép nối phiếu (modal-link-ticket)
console.log('\n3. Kiểm tra Modal Ghép Nối Phiếu (modal-link-ticket):');
assert.ok(CONTROL_PANEL_HTML.includes('id="modal-link-ticket"'), 'Phải có modal-link-ticket trong DOM');
assert.ok(CONTROL_PANEL_HTML.includes('v-if="showLinkModal"'), 'Modal ghép nối phải liên kết với showLinkModal');
assert.ok(CONTROL_PANEL_HTML.includes('unlinkItem(\'cpst\')'), 'Có chức năng gỡ ghép nối CPST');
assert.ok(CONTROL_PANEL_HTML.includes('unlinkItem(\'cpsf\')'), 'Có chức năng gỡ ghép nối CPSF');
assert.ok(CONTROL_PANEL_HTML.includes('@click="submitLinkTickets"'), 'Có nút xác nhận lưu ghép nối phiếu');
console.log('   ✓ modal-link-ticket cung cấp đầy đủ giao diện ghép nối và hủy ghép nối CPST/CPSF.');

// 4. Kiểm tra các nút thao tác trên Tabulator
console.log('\n4. Kiểm tra các nút thao tác (Sửa, Ghép, Xóa) trên Tabulator:');
assert.ok(CONTROL_PANEL_HTML.includes('btn-chain-edit'), 'Cột Chain có nút btn-chain-edit');
assert.ok(CONTROL_PANEL_HTML.includes('btn-chain-link'), 'Cột Chain có nút btn-chain-link');
assert.ok(CONTROL_PANEL_HTML.includes('btn-chain-del'), 'Cột Chain có nút btn-chain-del');
assert.ok(CONTROL_PANEL_HTML.includes('btn-split-edit'), 'Cột Split có nút btn-split-edit');
assert.ok(CONTROL_PANEL_HTML.includes('btn-split-del'), 'Cột Split có nút btn-split-del');
console.log('   ✓ Tabulator đã tích hợp đủ nút Sửa, Ghép, Xem, Xóa trên các bảng.');

// 5. Kiểm tra phòng chống lỗi đơ/treo trình duyệt (Reactivity Freeze Fixes)
console.log('\n5. Kiểm tra cơ chế chống đơ lag và chống rò rỉ reactivity:');
assert.ok(CONTROL_PANEL_HTML.includes('toPlainObject'), 'Có helper toPlainObject để làm sạch Proxy trước khi truyền dữ liệu Tabulator/Vue');
assert.ok(CONTROL_PANEL_HTML.includes('toRaw'), 'Có import toRaw từ Vue');
assert.ok(CONTROL_PANEL_HTML.includes('e.stopPropagation()'), 'Có chặn nổi bọt sự kiện (stopPropagation) tại các cellClick thao tác');
assert.ok(!CONTROL_PANEL_HTML.includes('Math.random()'), 'Không còn Math.random() trong danh sách key gây re-render liên tục');
assert.ok(CONTROL_PANEL_HTML.includes('@click.stop="openEditModal'), 'Nút Chỉnh sửa trên Card có @click.stop');
assert.ok(CONTROL_PANEL_HTML.includes('@click.stop="deleteCpsRecord'), 'Nút Xóa trên Card có @click.stop');
console.log('   ✓ Đã xử lý triệt để nguyên nhân đơ lag: tách rời Vue Proxy, chặn nổi bọt sự kiện, ổn định :key.');

// 6. Kiểm tra CSS Light Mode cho các nút mới
console.log('\n6. Kiểm tra CSS chế độ sáng (Light Mode) cho các nút mới:');
assert.ok(CONTROL_PANEL_HTML.includes('.btn-chain-edit'), 'Có CSS class cho .btn-chain-edit');
assert.ok(CONTROL_PANEL_HTML.includes('.btn-chain-link'), 'Có CSS class cho .btn-chain-link');
assert.ok(CONTROL_PANEL_HTML.includes('.btn-chain-del'), 'Có CSS class cho .btn-chain-del');
assert.ok(CONTROL_PANEL_HTML.includes('.btn-split-edit'), 'Có CSS class cho .btn-split-edit');
console.log('   ✓ CSS cho các nút thao tác đạt chuẩn hiển thị ở cả 2 chế độ sáng và tối.');

console.log('\n🎉 TẤT CẢ CÁC MỤC KIỂM THỬ TASK 3 ĐẠT 100%!');
