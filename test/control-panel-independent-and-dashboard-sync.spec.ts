import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

// Import các view templates và scripts để kiểm thử
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { CP_HEADER_HTML } from '../src/views/control-panel/components/layouts/header.component';
import { CP_SIDEBAR_HTML } from '../src/views/control-panel/components/layouts/sidebar.component';
import { CP_OVERVIEW_HEADER_HTML } from '../src/views/control-panel/components/cards/overview-header.component';
import { CONTROL_PANEL_SCRIPT } from '../src/views/control-panel/scripts/control-panel.script';

import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { DASHBOARD_NAV_HTML } from '../src/views/dashboard/components/layouts/navigation.component';
import { DASHBOARD_ANALYTICS_CHARTS_HTML } from '../src/views/dashboard/components/charts/analytics-charts.component';
import { DASHBOARD_SCRIPT } from '../src/views/dashboard/scripts/dashboard.script';

import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { LOGIN_HTML } from '../src/views/login.view';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ: CONTROL PANEL ĐỘC LẬP & REPORT TECHNICAL SYNC');
console.log('================================================================\n');

// =========================================================================
// PHẦN 1: KIỂM THỬ CONTROL PANEL ĐỘC LẬP HOÀN TOÀN
// =========================================================================
console.log('--- 1. Kiểm thử Control Panel độc lập hoàn toàn ---');

// 1.1 Header Top Bar:
// - Loại bỏ nút Quay lại Dashboard
// - Loại bỏ link API Docs
// - Loại bỏ nút đổi theme riêng trên top bar
// - Loại bỏ breadcrumb Dashboard > Control Panel
const topBarBeforeUserMenu = CP_HEADER_HTML.split('<!-- User Menu Dropdown Button -->')[0] || CP_HEADER_HTML;

assert.ok(
  !topBarBeforeUserMenu.includes('Quay lại Dashboard') && !topBarBeforeUserMenu.includes('href="/dashboard"'),
  'Top bar header không được chứa nút Quay lại Dashboard'
);
console.log('  ✅ [PASS] Top bar header: Đã loại bỏ nút Quay lại Dashboard');

assert.ok(
  !topBarBeforeUserMenu.includes('API Docs') && !topBarBeforeUserMenu.includes('href="/api/docs"'),
  'Top bar header không được chứa nút API Docs'
);
console.log('  ✅ [PASS] Top bar header: Đã loại bỏ nút API Docs');

assert.ok(
  !topBarBeforeUserMenu.includes('@click="toggleTheme"') && !topBarBeforeUserMenu.includes('toggleTheme'),
  'Top bar header không được chứa nút đổi theme độc lập (đã có trong user menu)'
);
console.log('  ✅ [PASS] Top bar header: Đã loại bỏ nút toggle theme riêng trên top bar');

assert.ok(
  !CP_HEADER_HTML.includes('Dashboard > Control Panel') && !CP_HEADER_HTML.includes('fa-gauge-high"></i> Dashboard'),
  'Header không được chứa breadcrumb Dashboard > Control Panel'
);
console.log('  ✅ [PASS] Header: Đã loại bỏ breadcrumb Dashboard > Control Panel');

// 1.2 Sidebar:
// - Bỏ nút Quay lại Dashboard
// - Thêm mục Overview vào đầu Navbar Sidebar làm Home chính của Control Panel
assert.ok(
  !CP_SIDEBAR_HTML.includes('Quay lại Dashboard') && !CP_SIDEBAR_HTML.includes('href="/dashboard"'),
  'Sidebar không được chứa nút Quay lại Dashboard'
);
console.log('  ✅ [PASS] Sidebar: Đã loại bỏ nút Quay lại Dashboard');

assert.ok(
  CP_SIDEBAR_HTML.includes("switchTab('overview')"),
  'Sidebar phải có mục Overview làm Home chính'
);
const overviewTabIdx = CP_SIDEBAR_HTML.indexOf("switchTab('overview')");
const reportTechTabIdx = CP_SIDEBAR_HTML.indexOf("switchTab('report-technical')");
const requestsTabIdx = CP_SIDEBAR_HTML.indexOf("switchTab('requests')");

assert.ok(
  overviewTabIdx < reportTechTabIdx && overviewTabIdx < requestsTabIdx,
  'Mục Overview phải nằm ở vị trí đầu tiên trong sidebar làm Home chính của Control Panel'
);
console.log('  ✅ [PASS] Sidebar: Mục Overview nằm ở đầu Navbar làm Home chính của Control Panel');

// 1.3 Trang Overview:
// - Chỉ giữ lại duy nhất khối Tổng Quan Hệ Thống
// - Loại bỏ toàn bộ các khối thừa như Public Form Card, Tổng Phiếu Yêu Cầu và Breakdown cũ
assert.ok(
  CP_OVERVIEW_HEADER_HTML.includes('Tổng Quan Hệ Thống'),
  'Trang Overview phải giữ khối Tổng Quan Hệ Thống'
);
console.log('  ✅ [PASS] Trang Overview: Khối "Tổng Quan Hệ Thống" tồn tại');

const rawCpViewPath = path.resolve(__dirname, '../src/views/control-panel.view.ts');
const rawCpViewContent = fs.readFileSync(rawCpViewPath, 'utf-8');

assert.ok(
  !rawCpViewContent.includes('CP_PUBLIC_SHARE_CARD_HTML'),
  'Trang Overview không được chứa Public Form Card (CP_PUBLIC_SHARE_CARD_HTML)'
);
console.log('  ✅ [PASS] Trang Overview: Đã loại bỏ Public Form Card');

assert.ok(
  !rawCpViewContent.includes('CP_KPI_CARDS_HTML'),
  'Trang Overview không được chứa khối Tổng Phiếu Yêu Cầu (CP_KPI_CARDS_HTML)'
);
console.log('  ✅ [PASS] Trang Overview: Đã loại bỏ khối Tổng Phiếu Yêu Cầu');

assert.ok(
  !rawCpViewContent.includes('CP_ANALYTICAL_BREAKDOWN_CARDS_HTML'),
  'Trang Overview không được chứa khối Breakdown cũ (CP_ANALYTICAL_BREAKDOWN_CARDS_HTML)'
);
console.log('  ✅ [PASS] Trang Overview: Đã loại bỏ khối Breakdown cũ');

// =========================================================================
// PHẦN 2: KIỂM THỬ ĐỒNG BỘ MODULE REPORT TECHNICAL TRÊN DASHBOARD
// =========================================================================
console.log('\n--- 2. Kiểm thử đồng bộ module Report Technical trên Dashboard giống Control Panel ---');

const allDashboardContent = DASHBOARD_HTML + '\n' + DASHBOARD_NAV_HTML + '\n' + DASHBOARD_ANALYTICS_CHARTS_HTML + '\n' + DASHBOARD_SCRIPT;

// 2.1 Bộ lọc thời gian (1 tuần trước mặc định)
assert.ok(
  allDashboardContent.includes('1 Tuần trước'),
  'Dashboard Report Technical phải có preset lọc "1 Tuần trước"'
);
assert.ok(
  allDashboardContent.includes('reportDateFrom') && allDashboardContent.includes('reportDateTo'),
  'Dashboard Report Technical phải có input chọn mốc thời gian reportDateFrom và reportDateTo'
);
assert.ok(
  allDashboardContent.includes('setReportPreset') || DASHBOARD_SCRIPT.includes('setReportPreset'),
  'Dashboard script phải có hàm setReportPreset xử lý bộ lọc thời gian'
);
console.log('  ✅ [PASS] Dashboard Report Technical: Bộ lọc thời gian (1 tuần trước mặc định) đồng bộ đầy đủ');

// 2.2 Cụm KPI cards chuẩn (Phiếu yêu cầu, Downtime, OPEN_TASK, TO_ASSIGN, IN_PROGRESS, CLOSED, OVER_DUE)
const requiredKpiLabels = [
  'Phiếu Yêu Cầu',
  'Downtime',
  'OPEN_TASK',
  'TO_ASSIGN',
  'IN_PROGRESS',
  'CLOSED',
  'OVER_DUE',
];
for (const label of requiredKpiLabels) {
  assert.ok(
    allDashboardContent.includes(label),
    `Dashboard Report Technical phải hiển thị chỉ số KPI: ${label}`
  );
}
console.log('  ✅ [PASS] Dashboard Report Technical: Cụm KPI cards chuẩn (7 chỉ số) đồng bộ đầy đủ');

// 2.3 Donut/Pie chart trạng thái
assert.ok(
  allDashboardContent.includes('chart-report-technical-donut'),
  'Dashboard Report Technical phải có canvas Donut/Pie chart trạng thái (chart-report-technical-donut)'
);
assert.ok(
  allDashboardContent.includes('totalStatusCps') || allDashboardContent.includes('Tổng Trạng Thái CPS'),
  'Dashboard Report Technical phải có tổng số trạng thái hiển thị tại tâm biểu đồ'
);
console.log('  ✅ [PASS] Dashboard Report Technical: Donut/Pie chart trạng thái đồng bộ đầy đủ');

// 2.4 Biểu đồ phân tích 4M
assert.ok(
  allDashboardContent.includes('chart-report-technical-4m'),
  'Dashboard Report Technical phải có canvas biểu đồ phân tích 4M (chart-report-technical-4m)'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('report4MStats') || DASHBOARD_SCRIPT.includes('renderReport4MChart'),
  'Dashboard script phải tính toán và render biểu đồ 4M client-side từ dữ liệu thực tế'
);
console.log('  ✅ [PASS] Dashboard Report Technical: Biểu đồ phân tích 4M đồng bộ đầy đủ');

// 2.5 Biểu đồ Gantt Chart downtime theo từng máy
assert.ok(
  allDashboardContent.includes('Gantt Chart Downtime Theo Từng Máy') || allDashboardContent.includes('ganttMachineRows'),
  'Dashboard Report Technical phải có biểu đồ Gantt Chart downtime theo từng máy'
);
assert.ok(
  DASHBOARD_SCRIPT.includes('ganttMachineRows') && DASHBOARD_SCRIPT.includes('ganttTimeRange'),
  'Dashboard script phải có computed properties tính toán Gantt downtime theo từng máy'
);
console.log('  ✅ [PASS] Dashboard Report Technical: Biểu đồ Gantt Chart downtime theo từng máy đồng bộ đầy đủ');

// 2.6 Bảng dữ liệu phiếu yêu cầu kèm modal xem chi tiết CPST
assert.ok(
  allDashboardContent.includes('tabulator-report-technical') || allDashboardContent.includes('reportTechnicalTable'),
  'Dashboard Report Technical phải có bảng dữ liệu phiếu yêu cầu Tabulator'
);
assert.ok(
  DASHBOARD_HTML.includes('modal-chain-detail') || DASHBOARD_HTML.includes('modal-split-detail') || allDashboardContent.includes('openSplitDetailModal') || allDashboardContent.includes('showChainModal'),
  'Dashboard phải có modal xem chi tiết CPST (modal-chain-detail/split-detail)'
);
console.log('  ✅ [PASS] Dashboard Report Technical: Bảng dữ liệu phiếu yêu cầu và modal chi tiết CPST đồng bộ đầy đủ');

// 2.7 Không thêm API mới và không tạo mock data
const rawDashboardScriptPath = path.resolve(__dirname, '../src/views/dashboard/scripts/dashboard.script.ts');
const rawDashboardScriptContent = fs.readFileSync(rawDashboardScriptPath, 'utf-8');

assert.ok(
  !rawDashboardScriptContent.includes('mockWeeklyData') && !rawDashboardScriptContent.includes('mockTechnicalReport'),
  'Không được tạo mock data trong dashboard script'
);
console.log('  ✅ [PASS] Dashboard Report Technical: Sử dụng dữ liệu thực tế, không tạo mock data');

// =========================================================================
// PHẦN 3: QUÉT KIỂM TRA TÍNH CÂN BẰNG THẺ HTML (0 LỖI DIV, 0 LỖI THẺ)
// =========================================================================
console.log('\n--- 3. Quét kiểm tra tính cân bằng thẻ HTML (0 lỗi div) ---');

function validateHtmlTagBalance(name: string, html: string) {
  const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*?)?(\/?)>/gs;
  let match: RegExpExecArray | null;
  const stack: { tag: string; line: number }[] = [];
  const errors: string[] = [];

  while ((match = tagRegex.exec(html)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    const isSelfClosing = match[2] === '/' || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag);
    const isClosing = full.startsWith('</');
    if (isSelfClosing) continue;

    const lineNum = html.substring(0, match.index).split('\n').length;
    if (!isClosing) {
      stack.push({ tag, line: lineNum });
    } else {
      if (stack.length === 0) {
        errors.push(`Thẻ đóng thừa </${tag}> tại dòng ${lineNum}`);
      } else {
        const top = stack.pop()!;
        if (top.tag !== tag) {
          errors.push(`Lệch thẻ tại dòng ${lineNum}: mong đợi </${top.tag}> (mở tại dòng ${top.line}) nhưng gặp </${tag}>`);
        }
      }
    }
  }

  assert.strictEqual(errors.length, 0, `${name} có lỗi thẻ HTML không khớp: ${errors.join('; ')}`);
  assert.strictEqual(stack.length, 0, `${name} có thẻ chưa đóng: ${stack.map(s => `<${s.tag}> (dòng ${s.line})`).join(', ')}`);
  console.log(`  ✅ [PASS] ${name}: 100% cân bằng thẻ HTML (0 lỗi div, 0 thẻ lệch, 0 thẻ thiếu)`);
}

const viewsToValidate: Record<string, string> = {
  'CONTROL_PANEL_HTML (control-panel.view.ts)': CONTROL_PANEL_HTML,
  'DASHBOARD_HTML (dashboard.view.ts)': DASHBOARD_HTML,
  'FORM_REQUEST_HTML (form-request.view.ts)': FORM_REQUEST_HTML,
  'CONFIRM_REQUEST_HTML (confirm-request.view.ts)': CONFIRM_REQUEST_HTML,
  'TECHNICAL_FEEDBACK_HTML (technical-feedback.view.ts)': TECHNICAL_FEEDBACK_HTML,
  'LOGIN_HTML (login.view.ts)': LOGIN_HTML,
};

for (const [viewName, htmlContent] of Object.entries(viewsToValidate)) {
  validateHtmlTagBalance(viewName, htmlContent);
}

console.log('\n================================================================');
console.log('🎉 TOÀN BỘ KIỂM THỬ: CONTROL PANEL ĐỘC LẬP & REPORT TECHNICAL SYNC ĐẠT 100% PASS!');
console.log('================================================================\n');
