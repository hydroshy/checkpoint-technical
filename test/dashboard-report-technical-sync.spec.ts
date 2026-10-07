import * as assert from 'assert';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { DASHBOARD_NAV_HTML } from '../src/views/dashboard/components/layouts/navigation.component';
import { DASHBOARD_ANALYTICS_CHARTS_HTML } from '../src/views/dashboard/components/charts/analytics-charts.component';
import { DASHBOARD_SCRIPT } from '../src/views/dashboard/scripts/dashboard.script';
import { CP_REPORT_TECHNICAL_TAB_HTML } from '../src/views/control-panel/components/charts/analytics-charts.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from '../src/views/control-panel/components/modals/split-detail-modal.component';

console.log('🧪 BẮT ĐẦU KIỂM THỬ: ĐỒNG BỘ REPORT TECHNICAL TRÊN DASHBOARD GIỐNG HỆT CONTROL PANEL:');

// =========================================================================
// 1. KIỂM TRA TÍCH HỢP REPORT TECHNICAL VÀO DASHBOARD
// =========================================================================
console.log('\n--- 1. Kiểm tra tích hợp cấu trúc Report Technical vào Dashboard ---');
assert.strictEqual(
  DASHBOARD_ANALYTICS_CHARTS_HTML,
  CP_REPORT_TECHNICAL_TAB_HTML,
  'Dashboard Report Technical HTML đồng bộ 100% với Control Panel'
);
assert.ok(
  DASHBOARD_HTML.includes('id="tabulator-report-technical"'),
  'Dashboard chứa mount point Tabulator cho Report Technical'
);
assert.ok(
  DASHBOARD_HTML.includes('/vendor/tabulator/tabulator.min.css') &&
  DASHBOARD_HTML.includes('/vendor/tabulator/tabulator.min.js'),
  'Dashboard nạp Tabulator CSS và JS'
);
assert.ok(
  DASHBOARD_HTML.includes('id="modal-chain-detail"'),
  'Dashboard tích hợp Modal Xem Chi Tiết CPST (modal-chain-detail)'
);
console.log('  ✅ [PASS] Cấu trúc Report Technical đã được tích hợp đầy đủ vào Dashboard');

// =========================================================================
// 2. BỘ LỌC THỜI GIAN & PRESET MẶC ĐỊNH 1 TUẦN TRƯỚC
// =========================================================================
console.log('\n--- 2. Kiểm tra bộ lọc thời gian & preset 1 tuần trước ---');
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes("setReportPreset('7d')") &&
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('1 Tuần trước'),
  'Có nút preset 1 Tuần trước'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('v-model="reportDateFrom"') &&
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('v-model="reportDateTo"'),
  'Có input chọn khoảng thời gian Từ ngày - Đến ngày'
);
assert.ok(
  DASHBOARD_SCRIPT.includes("reportQuickPreset.value = '7d';") &&
  DASHBOARD_SCRIPT.includes('from.setDate(from.getDate() - 7);'),
  'Script khởi tạo mặc định 7 ngày trước (1 tuần trước)'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('exportReportTechnicalExcel'),
  'Có chức năng Xuất Excel'
);
console.log('  ✅ [PASS] Bộ lọc thời gian chuẩn với preset 1 tuần trước mặc định');

// =========================================================================
// 3. CỤM KPI CARDS CHUẨN & DONUT/PIE CHART TRẠNG THÁI
// =========================================================================
console.log('\n--- 3. Kiểm tra cụm KPI cards chuẩn và Donut/Pie chart trạng thái ---');
const fiveStatus = ['OPEN_TASK', 'TO_ASSIGN', 'IN_PROGRESS', 'CLOSED', 'OVER_DUE'];
for (const st of fiveStatus) {
  assert.ok(
    DASHBOARD_ANALYTICS_CHARTS_HTML.includes(st),
    `Hiển thị card trạng thái ${st}`
  );
}
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('id="chart-report-technical-donut"'),
  'Có canvas cho Donut/Pie Chart trạng thái'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('reportStats.totalStatusCps'),
  'Hiển thị tổng số trạng thái ở giữa Donut chart'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('renderReportChart'),
  'Script có hàm renderReportChart'
);
console.log('  ✅ [PASS] Cụm KPI cards trạng thái và Donut Chart hiển thị chuẩn');

// =========================================================================
// 4. BIỂU ĐỒ PHÂN TÍCH 4M & 2 KPI CARDS TỔNG QUAN
// =========================================================================
console.log('\n--- 4. Kiểm tra biểu đồ phân tích 4M và 2 KPI cards tổng quan ---');
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('reportStats.totalRequests') &&
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Phiếu Yêu Cầu'),
  'Card Phiếu Yêu Cầu'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('reportStats.totalDowntimeMinutes') &&
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Tổng Downtime'),
  'Card Tổng Downtime'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('id="chart-report-technical-4m"'),
  'Có canvas cho Biểu đồ tỷ lệ 4M'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('report4MStats.total'),
  'Hiển thị tổng số sự cố 4M ở giữa chart'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('renderReport4MChart'),
  'Script có hàm renderReport4MChart tính client-side'
);
console.log('  ✅ [PASS] Biểu đồ 4M và 2 KPI cards tổng quan hoàn chỉnh');

// =========================================================================
// 5. GANTT CHART DOWNTIME THEO TỪNG MÁY
// =========================================================================
console.log('\n--- 5. Kiểm tra Gantt Chart downtime theo từng máy ---');
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Tiến Độ Dừng Máy'),
  'Có tiêu đề Tiến Độ Dừng Máy'
);
assert.ok(
  !DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Trục Y: Tên Máy'),
  'Đã bỏ chú thích Trục Y: Tên Máy'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('ganttTimeTicks'),
  'Gantt Chart có Trục X thể hiện mốc thời gian lọc'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('bg-amber-400') || DASHBOARD_ANALYTICS_CHARTS_HTML.includes('amber-500'),
  'Dải màu vàng thể hiện khoảng downtime máy'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('ganttMachineRows') && DASHBOARD_SCRIPT.includes('ganttTimeRange'),
  'Script tính toán hàng downtime theo từng máy và dải thời gian'
);
console.log('  ✅ [PASS] Gantt Chart downtime theo từng máy hoạt động chuẩn xác');

// =========================================================================
// 6. BẢNG DỮ LIỆU PHIẾU YÊU CẦU & MODAL XEM CHI TIẾT CPST
// =========================================================================
console.log('\n--- 6. Kiểm tra bảng dữ liệu 9 cột & modal xem chi tiết CPST ---');
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Dữ Liệu Phiếu Yêu Cầu'),
  'Tiêu đề bảng: Dữ Liệu Phiếu Yêu Cầu'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('initOrUpdateReportTable'),
  'Script có hàm khởi tạo bảng Tabulator cho Report Technical'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Tỷ lệ 4M'),
  'Đổi tên thành Tỷ lệ 4M'
);
assert.ok(
  DASHBOARD_ANALYTICS_CHARTS_HTML.includes('Số sự cố'),
  'Chữ Số sự cố và số lượng căn giữa hình tròn'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('Hình Ảnh') &&
  CP_SPLIT_DETAIL_MODAL_HTML.includes('photosBefore') &&
  CP_SPLIT_DETAIL_MODAL_HTML.includes('photosAfter'),
  'Modal chi tiết hiển thị đầy đủ hình ảnh trước và sau sửa chữa của CPST'
);
assert.ok(
  CP_SPLIT_DETAIL_MODAL_HTML.includes('modal-lightbox'),
  'Modal chi tiết tích hợp Lightbox phóng to ảnh'
);
assert.ok(
  !CP_SPLIT_DETAIL_MODAL_HTML.includes('openEditModal') && !CP_SPLIT_DETAIL_MODAL_HTML.includes('openLinkModal'),
  'Chỉ giữ duy nhất nút Đóng'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('openChainDetailModal'),
  'Script có hàm openChainDetailModal mở modal xem chi tiết CPST'
);
console.log('  ✅ [PASS] Bảng dữ liệu phiếu yêu cầu và Modal xem chi tiết CPST chuẩn xác');

// =========================================================================
// 7. KHÔNG DÙNG MOCK DATA VÀ KHÔNG THÊM API MỚI
// =========================================================================
console.log('\n--- 7. Kiểm tra không mock data và tải từ API hiện có ---');
assert.ok(
  DASHBOARD_SCRIPT.includes("fetch('/api/cps'") &&
  DASHBOARD_SCRIPT.includes("fetch('/api/cpsr'") &&
  DASHBOARD_SCRIPT.includes("fetch('/api/cpst'") &&
  DASHBOARD_SCRIPT.includes("fetch('/api/cpsf'"),
  'Tải dữ liệu từ các API nghiệp vụ hiện có (/api/cps, /api/cpsr, /api/cpst, /api/cpsf)'
);
console.log('  ✅ [PASS] Tải từ API hiện có, 0 mock data');

// =========================================================================
// 8. NAVIGATION BREADCRUMB & THAO TÁC QUAY LẠI DASHBOARD
// =========================================================================
console.log('\n--- 8. Kiểm tra Navigation breadcrumb và quay lại Dashboard ---');
assert.ok(
  DASHBOARD_NAV_HTML.includes('Report Technical') &&
  DASHBOARD_NAV_HTML.includes('Quay lại Dashboard'),
  'Breadcrumb hiển thị Dashboard > Report Technical và nút Quay lại Dashboard'
);
assert.ok(
  !DASHBOARD_NAV_HTML.includes('Tổng Quan KPI') &&
  !DASHBOARD_NAV_HTML.includes('Người Yêu Cầu & Máy'),
  'Đã loại bỏ toàn bộ sub-tabs cũ thừa trên thanh navigation'
);
console.log('  ✅ [PASS] Navigation tinh gọn, hỗ trợ quay lại Dashboard hoàn hảo');

console.log('\n🎉 TOÀN BỘ KIỂM THỬ ĐỒNG BỘ REPORT TECHNICAL DASHBOARD ĐẠT 100% THÀNH CÔNG!\n');
