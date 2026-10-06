import { TOAST_CONTAINER_HTML } from './common/layouts/toast.component';
import { CONTROL_PANEL_CSS } from './control-panel/styles/control-panel.style';
import { CP_HEADER_HTML } from './control-panel/components/layouts/header.component';
import { CP_SIDEBAR_HTML } from './control-panel/components/layouts/sidebar.component';
import { CP_OVERVIEW_HEADER_HTML } from './control-panel/components/cards/overview-header.component';
import { CP_PUBLIC_SHARE_CARD_HTML } from './control-panel/components/cards/public-share-card.component';
import { CP_KPI_CARDS_HTML } from './control-panel/components/cards/kpi-cards.component';
import { CP_ANALYTICAL_BREAKDOWN_CARDS_HTML } from './control-panel/components/cards/analytical-breakdown-cards.component';
import { CP_ASSIGN_TASKS_TAB_HTML, CP_ASSIGN_MODAL_HTML } from './control-panel/modules/assign-task-module';
import { CP_MANAGEMENT_TASKS_TAB_HTML } from './control-panel/modules/management-task-module';
import { CP_SPLIT_TABLES_HTML } from './control-panel/components/tables/split-tables.component';
import { CP_MASTER_TABLES_HTML } from './control-panel/components/tables/master-tables.component';
import { CP_REPORT_TECHNICAL_TAB_HTML } from './control-panel/components/charts/analytics-charts.component';
import { CP_TICKET_DETAIL_MODAL_HTML } from './control-panel/components/modals/ticket-detail-modal.component';
import { CP_SPLIT_DETAIL_MODAL_HTML } from './control-panel/components/modals/split-detail-modal.component';
import { CP_EDIT_MODAL_HTML } from './control-panel/components/modals/edit-modal.component';
import { CP_LINK_MODAL_HTML } from './control-panel/components/modals/link-modal.component';
import { CP_CREATE_CPS_MODAL_HTML } from './control-panel/components/modals/create-cps-modal.component';
import { CP_ENTITY_MODALS_HTML } from './control-panel/components/modals/entity-modals.component';
import { CONTROL_PANEL_SCRIPT } from './control-panel/scripts/control-panel.script';

export const CONTROL_PANEL_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Quản Lý Phiếu Kỹ Thuật</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png?v=3" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=3" />
  <link rel="apple-touch-icon" href="/images/favicon.png?v=3" />
  <script>
    tailwind = {
      darkMode: 'class'
    };
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600;700&family=Host+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tabulator CSS (Local & CDN Fallback) -->
  <link rel="stylesheet" href="/vendor/tabulator/tabulator.min.css" />
  <!-- SheetJS for XLSX Export -->
  <script src="/vendor/xlsx/xlsx.full.min.js"></script>
  <!-- Tabulator JS -->
  <script src="/vendor/tabulator/tabulator.min.js"></script>
  <!-- Chart.js for Donut / Piechart KPI Analytics -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

  <script>
    (function() {
      try {
        var saved = localStorage.getItem('checkpoint_theme');
        var theme = (saved === 'dark') ? 'dark' : 'light';
        document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch(e) {
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove('dark');
      }
    })();
  </script>

  <style>
${CONTROL_PANEL_CSS}
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">
  <div id="app" v-cloak class="flex-1 flex flex-col min-h-screen" @click="handleGlobalClick">
    
${CP_HEADER_HTML}

    <!-- WORKSPACE: SIDEBAR + MAIN -->
    <div class="flex-1 flex overflow-hidden">

${CP_SIDEBAR_HTML}

      <!-- MAIN CONTENT AREA -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <!-- VIEW 1: OVERVIEW HUB & ANALYTICS -->
        <div v-show="activeTab === 'overview'" class="space-y-6">
${CP_OVERVIEW_HEADER_HTML}
${CP_PUBLIC_SHARE_CARD_HTML}
${CP_KPI_CARDS_HTML}
${CP_ANALYTICAL_BREAKDOWN_CARDS_HTML}
        </div>

${CP_ASSIGN_TASKS_TAB_HTML}

${CP_MANAGEMENT_TASKS_TAB_HTML}

${CP_MASTER_TABLES_HTML}

${CP_REPORT_TECHNICAL_TAB_HTML}

      </main>
    </div>

${CP_TICKET_DETAIL_MODAL_HTML}

${CP_ASSIGN_MODAL_HTML}

${CP_SPLIT_DETAIL_MODAL_HTML}

${CP_EDIT_MODAL_HTML}

${CP_LINK_MODAL_HTML}

${CP_CREATE_CPS_MODAL_HTML}

${CP_ENTITY_MODALS_HTML}

${TOAST_CONTAINER_HTML}

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
${CONTROL_PANEL_SCRIPT}
  </script>
</body>
</html>
`;
