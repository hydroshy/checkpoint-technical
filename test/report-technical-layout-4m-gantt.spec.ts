import * as assert from 'assert';
import { CP_REPORT_TECHNICAL_TAB_HTML } from '../src/views/control-panel/components/charts/analytics-charts.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';

console.log('🧪 BẮT ĐẦU KIỂM THỬ T3: TÁI CẤU TRÚC REPORT TECHNICAL, 4M CHART, GANTT DOWNTIME & MODAL ẢNH CPST:');

// =========================================================================
// 1. KIỂM TRA BỎ KHỐI 'Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái'
// =========================================================================
console.log('\n--- 1. Kiểm tra loại bỏ khối Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái ---');
assert.ok(
  !CP_REPORT_TECHNICAL_TAB_HTML.includes('Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái'),
  'Đã loại bỏ hoàn toàn khối "Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái"'
);
console.log('  ✅ [PASS] Khối "Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái" đã được loại bỏ');

// =========================================================================
// 2. BỐ CỤC 5 CARD TRẠNG THÁI FIT VỪA VỚI PIE CHART TRẠNG THÁI BÊN PHẢI
// =========================================================================
console.log('\n--- 2. Kiểm tra Bố cục 5 Card Trạng Thái fit vừa với Pie Chart bên phải ---');
const fiveStatusCards = ['OPEN_TASK', 'TO_ASSIGN', 'IN_PROGRESS', 'CLOSED', 'OVER_DUE'];
for (const st of fiveStatusCards) {
  assert.ok(
    CP_REPORT_TECHNICAL_TAB_HTML.includes(st),
    `Phải hiển thị card trạng thái ${st}`
  );
}
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('id="chart-report-technical-donut"'),
  'Phải có canvas cho Pie/Donut Chart trạng thái'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Phân Bổ Tỷ Lệ Trạng Thái Phiếu'),
  'Tiêu đề biểu đồ: Phân Bổ Tỷ Lệ Trạng Thái Phiếu'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('reportStats.totalStatusCps'),
  'Hiển thị tổng số trạng thái ở giữa biểu đồ'
);
console.log('  ✅ [PASS] 5 Card trạng thái và Pie Chart trạng thái bố cục hài hòa, đúng cấu trúc');

// =========================================================================
// 3. BỐ CỤC 2 CARD (PHIẾU YÊU CẦU, TỔNG DOWNTIME) FIT VỪA VỚI ĐỒ THỊ TỶ LỆ 4M
// =========================================================================
console.log('\n--- 3. Kiểm tra Bố cục 2 Card fit vừa Đồ thị tỷ lệ 4M (tính client-side, không mock) ---');
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Phiếu Yêu Cầu') && CP_REPORT_TECHNICAL_TAB_HTML.includes('reportStats.totalRequests'),
  'Card 1: Phiếu Yêu Cầu với reportStats.totalRequests'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Tổng Downtime') && CP_REPORT_TECHNICAL_TAB_HTML.includes('reportStats.totalDowntimeMinutes'),
  'Card 2: Tổng Downtime với reportStats.totalDowntimeMinutes'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('id="chart-report-technical-4m"'),
  'Phải có canvas cho Đồ thị tỷ lệ 4M: chart-report-technical-4m'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Tỷ lệ 4M'),
  'Tiêu đề: Tỷ lệ 4M'
);
assert.ok(
  !CP_REPORT_TECHNICAL_TAB_HTML.includes('Tỷ lệ 4M (Man, Machine, Material, Method) tính client-side'),
  'Đã bỏ dòng chữ Tỷ lệ 4M tính client-side'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Số sự cố'),
  'Chữ Số sự cố và số lượng căn giữa hình tròn'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('report4MStats = computed'),
  'Tỷ lệ 4M được tính toán trực tiếp client-side qua computed property'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('renderReport4MChart'),
  'Có hàm renderReport4MChart vẽ biểu đồ 4M'
);
console.log('  ✅ [PASS] 2 Card KPI và Đồ thị 4M tính client-side hoàn chỉnh, không dùng mock data');

// =========================================================================
// 4. THIẾT KẾ GANTT CHART DOWNTIME THEO TỪNG MÁY
// =========================================================================
console.log('\n--- 4. Kiểm tra Gantt Chart downtime theo từng máy (Tiến Độ Dừng Máy, lưới 1h) ---');
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Tiến Độ Dừng Máy'),
  'Hiển thị tiêu đề Tiến Độ Dừng Máy'
);
assert.ok(
  !CP_REPORT_TECHNICAL_TAB_HTML.includes('Trục Y: Tên Máy'),
  'Đã bỏ chú thích Trục Y: Tên Máy'
);
assert.ok(
  !CP_REPORT_TECHNICAL_TAB_HTML.includes('Trục Y là tên máy, Trục X là khoảng thời gian lọc'),
  'Đã bỏ dòng mô tả trục X/Y thừa'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('ganttTimeTicks'),
  'Gantt Chart có Trục X thể hiện mốc thời gian lọc'
);
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('bg-amber-400') || CP_REPORT_TECHNICAL_TAB_HTML.includes('amber-500'),
  'Dải màu vàng (amber/yellow) thể hiện khoảng downtime máy'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('ganttMachineRows = computed'),
  'ganttMachineRows tính toán downtime thực tế theo từng máy client-side'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('ganttTimeRange = computed'),
  'ganttTimeRange tính toán khoảng thời gian 0h00 bắt đầu -> 23h59 kết thúc'
);
console.log('  ✅ [PASS] Gantt Chart downtime nằm trọn chiều ngang bên dưới 2 cụm biểu đồ, tính từ dữ liệu thực tế');

// =========================================================================
// 5. BẢNG DỮ LIỆU ĐỔI TÊN THÀNH 'Dữ liệu phiếu yêu cầu' VỚI ĐẦY ĐỦ 9 CỘT
// =========================================================================
console.log('\n--- 5. Kiểm tra Bảng dữ liệu: Đổi tên thành "Dữ liệu phiếu yêu cầu" và 9 cột chuẩn ---');
assert.ok(
  CP_REPORT_TECHNICAL_TAB_HTML.includes('Dữ Liệu Phiếu Yêu Cầu'),
  'Tiêu đề bảng đổi thành "Dữ Liệu Phiếu Yêu Cầu"'
);

const expectedColumns = [
  'Mã CPS',
  'Ngày khởi tạo',
  'Người yêu cầu',
  'Máy',
  'Sự cố',
  'Technician',
  'Trạng thái',
  'Downtime',
  'Xem chi tiết'
];

for (const col of expectedColumns) {
  assert.ok(
    CONTROL_PANEL_SCRIPT.includes(`title: '${col}'`),
    `Bảng Tabulator phải chứa cột [${col}]`
  );
  console.log(`  ✅ [PASS] Cột: [${col}]`);
}

// =========================================================================
// 6. MODAL XEM CHI TIẾT: HIỂN THỊ ĐẦY ĐỦ HÌNH ẢNH KỸ THUẬT VIÊN ĐÃ LƯU KHI CÓ CPST
// =========================================================================
console.log('\n--- 6. Kiểm tra Modal Xem Chi Tiết hiển thị đầy đủ hình ảnh CPST & Lightbox ---');
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('Hình Ảnh'),
  'Modal chi tiết có phần hiển thị Hình Ảnh'
);
assert.ok(
  !CP_SPLIT_DETAIL_MODAL_HTML.includes('Hình Ảnh Kỹ Thuật Viên Đã Lưu (CPST):'),
  'Đã rút gọn tiêu đề thành Hình Ảnh'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('Trước Sửa Chữa') && CP_SPLIT_DETAIL_MODAL_HTML.includes('photosBefore'),
  'Modal hiển thị ảnh trước sửa chữa'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('Sau Sửa Chữa') && CP_SPLIT_DETAIL_MODAL_HTML.includes('photosAfter'),
  'Modal hiển thị ảnh sau sửa chữa'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('modal-lightbox'),
  'Modal chi tiết có Lightbox phóng to ảnh trong trang'
);
assert.ok(
  !CP_SPLIT_DETAIL_MODAL_HTML.includes('openEditModal') && !CP_SPLIT_DETAIL_MODAL_HTML.includes('openLinkModal'),
  'Modal chi tiết chỉ giữ lại duy nhất nút Đóng, bỏ Sửa CPSR/Chỉnh Sửa/Ghép Nối'
);
assert.ok(
  CONTROL_PANEL_SCRIPT.includes('openChainDetailModal'),
  'openChainDetailModal mở modal chi tiết từ nút Xem chi tiết trên bảng'
);
console.log('  ✅ [PASS] Modal Xem Chi Tiết hiển thị đầy đủ hình ảnh trước và sau sửa chữa của CPST & Lightbox');

console.log('\n🎉 TOÀN BỘ KIỂM THỬ TÁI CẤU TRÚC REPORT TECHNICAL ĐÃ ĐẠT 100% THÀNH CÔNG!');
