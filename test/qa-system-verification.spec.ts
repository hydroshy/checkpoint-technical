import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';
import { CP_MANAGEMENT_TASKS_TAB_HTML } from '../src/views/control-panel/modules/management-task-module/management-tasks-tab.component';
import { CP_LINK_MODAL_HTML } from '../src/views/control-panel/components/modals/link-modal.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';
import { CP_CREATE_CPS_MODAL_HTML } from '../src/views/control-panel/components/modals/create-cps-modal.component';
import { CP_EDIT_MODAL_HTML } from '../src/views/control-panel/components/modals/edit-modal.component';
import { CP_TICKET_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/ticket-detail-modal.component';
import { computeCpsDowntime, parseCpsStartTime } from '../src/modules/database/database.service';

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

// 3. Kiểm tra Sidebar đầy đủ các mục menu quản lý & tiêu đề
console.log('\n--- 3. Kiểm tra Sidebar Đầy Đủ Các Mục Menu Quản Lý & Chuẩn Hóa Tiêu Đề ---');
assert.ok(CONTROL_PANEL_HTML.includes('<title>Quản Lý Phiếu Kỹ Thuật</title>'), 'HTML title tag phải là Quản Lý Phiếu Kỹ Thuật');
assert.ok(CONTROL_PANEL_HTML.includes('<h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Quản Lý Phiếu Kỹ Thuật</h1>'), 'Tiêu đề h1 chính chuẩn');
assert.ok(!CONTROL_PANEL_HTML.includes('<h1 class="text-xl font-bold tracking-tight">Quản Lý Phiếu Kỹ Thuật (CPSR • CPST • CPSF)</h1>'), 'Không còn ngoặc thừa');
assert.ok(CONTROL_PANEL_HTML.includes('Quản Lý Phiếu Kỹ Thuật</span>'), 'Header bar hiển thị Quản Lý Phiếu Kỹ Thuật');

const asideMatch = CONTROL_PANEL_HTML.match(/<aside[\s\S]*?<\/aside>/);
assert.ok(asideMatch, 'Phải có thẻ aside');
const sidebarHtml = asideMatch[0];
assert.ok(sidebarHtml.includes('Quản lý phiếu kỹ thuật'), 'Sidebar phải hiển thị Quản lý phiếu kỹ thuật');
assert.ok(sidebarHtml.includes("@click=\"switchTab('requests')\""), 'Sidebar có Requests');
assert.ok(sidebarHtml.includes("@click=\"switchTab('overview')\""), 'Sidebar có mục Overview làm Home chính');
assert.ok(sidebarHtml.includes("@click=\"switchTab('report-technical')\""), 'Sidebar có Report technical');
const overviewIdx = sidebarHtml.indexOf("@click=\"switchTab('overview')\"");
const reportTechIdx = sidebarHtml.indexOf("@click=\"switchTab('report-technical')\"");
const requestsIdx = sidebarHtml.indexOf("@click=\"switchTab('requests')\"");
assert.ok(overviewIdx < reportTechIdx, 'Overview phải nằm ở vị trí đầu tiên làm Home chính');
assert.ok(reportTechIdx < requestsIdx, 'Report Technical phải nằm ở vị trí trước Quản lý phiếu kỹ thuật');
assert.ok(sidebarHtml.includes("@click=\"switchTab('assign-tasks')\""), 'Sidebar có Assign-tasks');
assert.ok(sidebarHtml.includes("@click=\"switchTab('machines')\""), 'Sidebar có Machines');
assert.ok(sidebarHtml.includes("@click=\"switchTab('employees')\""), 'Sidebar có Employees');
assert.ok(sidebarHtml.includes("@click=\"switchTab('users')\""), 'Sidebar có Users');
assert.ok(sidebarHtml.includes("@click=\"switchTab('existing-data')\""), 'Sidebar có Existing data');
console.log('  ✅ [PASS] Nav Bar sidebar đã khôi phục đầy đủ các mục menu quản lý, tiêu đề chuẩn hóa');

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

// 7. Kiểm tra Hiển thị & Sửa CPSR trong tab riêng
console.log('\n--- 7. Kiểm tra Hiển Thị & Sửa CPSR Trong Tab Riêng ---');
assert.ok(CP_MANAGEMENT_TASKS_TAB_HTML.includes("@click=\"switchSplitTab('cpsr')\""), 'Có subtab riêng cho CPSR');
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('cpsrList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);'),
  'loadCpsrData unwrap chuẩn từ format { data: [...] }'
);
assert.ok(CONTROL_PANEL_SCRIPT.includes("loadCpsrData"), 'Tự động gọi loadCpsrData khi đổi tab');
assert.ok(CONTROL_PANEL_SCRIPT.includes("splitTab.value === 'cpsr'"), 'Có cấu hình bảng Tabulator riêng cho CPSR');
assert.ok(CP_EDIT_MODAL_HTML.includes("v-else-if=\"editForm.type === 'cpsr'\""), 'Có modal form chỉnh sửa phiếu CPSR');
assert.ok(CP_EDIT_MODAL_HTML.includes('v-model="editForm.reqDate"'), 'Modal CPSR có trường Ngày yêu cầu');
assert.ok(CP_EDIT_MODAL_HTML.includes('v-model="editForm.reqTime"'), 'Modal CPSR có trường Giờ yêu cầu');
assert.ok(CP_SPLIT_DETAIL_MODAL_HTML.includes("openEditModal('cpsr'"), 'Có nút mở sửa CPSR trực tiếp từ chi tiết chuỗi');
console.log('  ✅ [PASS] Hiển thị và chỉnh sửa CPSR trong tab riêng hoàn chỉnh');

// 8. Kiểm tra Tính Downtime Động Theo Thời Gian Thực (Dừng khi CLOSED hoặc OVER_DUE)
console.log('\n--- 8. Kiểm tra Tính Downtime Động Theo Thời Gian Thực ---');
const now = Date.now();
const past60m = new Date(now - 60 * 60000).toISOString();
const past40m = new Date(now - 40 * 60000).toISOString();
const past20m = new Date(now - 20 * 60000).toISOString();

// 8.1 Phiếu đang mở tính động theo thời gian thực tới Date.now()
const dynamicDt = computeCpsDowntime({
  status: 'IN_PROGRESS',
  createdAt: past60m,
});
assert.ok(dynamicDt >= 59 && dynamicDt <= 61, `Downtime động phiếu mở phải xấp xỉ 60 phút (thực tế: ${dynamicDt})`);

// 8.2 Dừng tính khi CLOSED (tính tới closedAt)
const closedDt = computeCpsDowntime({
  status: 'CLOSED',
  createdAt: past60m,
  closedAt: past20m,
});
assert.strictEqual(closedDt, 40, 'Phiếu CLOSED phải dừng tính tại closedAt (60 - 20 = 40 phút)');

// 8.3 Dừng tính khi CLOSED có downtime cố định
const fixedClosedDt = computeCpsDowntime({
  status: 'CLOSED',
  createdAt: past60m,
  downtime: 25,
});
assert.strictEqual(fixedClosedDt, 25, 'Phiếu CLOSED có downtime cố định giữ nguyên 25 phút');

// 8.4 Dừng tính khi OVER_DUE (tính tới deadline)
const overdueDt = computeCpsDowntime({
  status: 'OVER_DUE',
  createdAt: past60m,
  deadline: past40m,
});
assert.strictEqual(overdueDt, 20, 'Phiếu OVER_DUE phải dừng tính tại deadline (60 - 40 = 20 phút)');
console.log('  ✅ [PASS] Tính downtime động thời gian thực dừng chuẩn khi CLOSED hoặc OVER_DUE');

// 9. Kiểm tra Bỏ Cột Tiến Độ Chuỗi & Text Mô Tả Thừa
console.log('\n--- 9. Kiểm tra Bỏ Cột Tiến Độ Chuỗi & Text Mô Tả Thừa ---');
assert.ok(
  !CONTROL_PANEL_SCRIPT.includes("title: 'Tiến Độ Chuỗi'"),
  'Đã bỏ cột "Tiến Độ Chuỗi" trên bảng Tabulator CPS'
);
assert.ok(
  !CP_MANAGEMENT_TASKS_TAB_HTML.includes('Điều phối toàn diện: Phiếu CPS (liên kết CPSR • CPST • CPSF) và 3 biểu mẫu độc lập qua Tabulator v6'),
  'Đã bỏ dòng mô tả thừa trên header Quản lý phiếu kỹ thuật'
);
console.log('  ✅ [PASS] Đã loại bỏ cột Tiến độ chuỗi và text mô tả thừa');

// 10. Kiểm tra Popup Không Còn Nhãn Chuỗi Tiến Trình 1-1-1
console.log('\n--- 10. Kiểm tra Popup Không Còn Nhãn Chuỗi Tiến Trình 1-1-1 ---');
const modals = [
  { name: 'link-modal', html: CP_LINK_MODAL_HTML },
  { name: 'split-detail-modal', html: CP_SPLIT_DETAIL_MODAL_HTML },
  { name: 'create-cps-modal', html: CP_CREATE_CPS_MODAL_HTML },
  { name: 'edit-modal', html: CP_EDIT_MODAL_HTML },
  { name: 'ticket-detail-modal', html: CP_TICKET_DETAIL_MODAL_HTML },
];
for (const m of modals) {
  assert.ok(!m.html.includes('Chuỗi Tiến Trình 1-1-1'), `Modal ${m.name} không còn nhãn "Chuỗi Tiến Trình 1-1-1"`);
  assert.ok(!m.html.includes('(Chuỗi 1-1-1)'), `Modal ${m.name} không còn nhãn "(Chuỗi 1-1-1)"`);
}
console.log('  ✅ [PASS] Toàn bộ các popup modal sạch nhãn "Chuỗi Tiến Trình 1-1-1"');

console.log('\n🎉 TOÀN BỘ CÁC MỤC KIỂM THỬ QA SYSTEM VERIFICATION ĐÃ VƯỢT QUA 100%!');
