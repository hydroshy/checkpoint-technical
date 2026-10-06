import { TOAST_CONTAINER_HTML } from './common/layouts/toast.component';
import { DASHBOARD_CSS } from './dashboard/styles/dashboard.style';
import { DASHBOARD_HEADER_HTML } from './dashboard/components/layouts/header.component';
import { DASHBOARD_NAV_HTML } from './dashboard/components/layouts/navigation.component';
import { DASHBOARD_KPI_CARDS_HTML } from './dashboard/components/cards/kpi-cards.component';
import { DASHBOARD_ANALYTICS_CHARTS_HTML } from './dashboard/components/charts/analytics-charts.component';
import { DASHBOARD_RECENT_RECORDS_HTML } from './dashboard/components/cards/recent-records.component';
import { DASHBOARD_WEEKLY_TABLES_HTML } from './dashboard/components/tables/weekly-tables.component';
import { DASHBOARD_REQUEST_FORM_HTML } from './dashboard/components/forms/request-form.component';
import { DASHBOARD_REQUEST_HISTORY_HTML } from './dashboard/components/forms/request-history.component';
import { DASHBOARD_BOTTOM_BAR_HTML } from './dashboard/components/forms/bottom-action-bar.component';
import { DASHBOARD_PICKER_MODALS_HTML } from './dashboard/components/modals/picker-modals.component';
import { DASHBOARD_PDF_TEMPLATE_HTML } from './dashboard/components/modals/pdf-template.component';
import { DASHBOARD_WEEKLY_MODALS_HTML } from './dashboard/components/modals/weekly-modals.component';
import { DASHBOARD_SCRIPT } from './dashboard/scripts/dashboard.script';

export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Checkpoint Systems</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png?v=3" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=3" />
  <link rel="apple-touch-icon" href="/images/favicon.png?v=3" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600;700&family=Host+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Chart.js for KPI Analytics -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <!-- PDF & Excel Utilities -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

  <script>
    (function() {
      try {
        var saved = localStorage.getItem('checkpoint_theme');
        var theme = (saved === 'dark') ? 'dark' : 'light';
        document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
      } catch(e) {
        document.documentElement.classList.add('theme-light');
      }
    })();
  </script>

  <style>
${DASHBOARD_CSS}
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">
  <div id="app" v-cloak class="flex-1 flex flex-col" @click="handleGlobalClick">
    
${DASHBOARD_HEADER_HTML}

    <!-- MAIN BODY -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

${DASHBOARD_NAV_HTML}

      <!-- TAB 1: WEEKLY KPI -->
      <div v-show="canViewKpi && activeTab === 'weekly-kpi'" class="space-y-6">
        <!-- Top Banner -->
        <div class="glass-card rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border-sky-500/20">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 uppercase tracking-wider">
                  Báo cáo tuần
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Cập nhật tự động</span>
              </div>
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Chỉ Số Hiệu Suất Kỹ Thuật (KPI Analytics)
              </h1>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Theo dõi tình trạng xử lý yêu cầu, phân tích lỗi phát sinh và kế hoạch hành động
              </p>
            </div>
            <div class="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                @click="loadAllWeeklyData"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-arrows-rotate" :class="{ 'fa-spin': isRefreshingWeekly }"></i>
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

${DASHBOARD_KPI_CARDS_HTML}

${DASHBOARD_ANALYTICS_CHARTS_HTML}

${DASHBOARD_RECENT_RECORDS_HTML}
      </div>

${DASHBOARD_WEEKLY_TABLES_HTML}

${DASHBOARD_REQUEST_FORM_HTML}

${DASHBOARD_REQUEST_HISTORY_HTML}

    </main>

${DASHBOARD_BOTTOM_BAR_HTML}

${DASHBOARD_PICKER_MODALS_HTML}

${TOAST_CONTAINER_HTML}

${DASHBOARD_PDF_TEMPLATE_HTML}

${DASHBOARD_WEEKLY_MODALS_HTML}

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
${DASHBOARD_SCRIPT}
  </script>
</body>
</html>
`;
