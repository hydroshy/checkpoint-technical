const fs = require('fs');
const path = require('path');

// Read existing dashboard.view.ts to extract V4 printable form and its hidden PDF template
const oldDashboardPath = path.join(__dirname, '../src/views/dashboard.view.ts');
const oldContent = fs.readFileSync(oldDashboardPath, 'utf8');

const v4FormStart = oldContent.indexOf('<!-- =========================================================================\n           TAB 1: BIỂU MẪU NHẬP LIỆU');
const v4FormEnd = oldContent.indexOf('<!-- =========================================================================\n           TAB 2: LỊCH SỬ PHIẾU YÊU CẦU');
const v4HistEnd = oldContent.indexOf('<!-- FIXED BOTTOM ACTION BAR');
const vueScriptStart = oldContent.indexOf('<script src="https://cdn.jsdelivr.net/npm/vue');

const rawV4Form = oldContent.substring(v4FormStart, v4FormEnd);
const rawV4History = oldContent.substring(v4FormEnd, v4HistEnd);
const rawModalsAndPdf = oldContent.substring(v4HistEnd, vueScriptStart);

// Replace activeTab === 'form' with activeTab === 'v4-form' and activeTab === 'history' with activeTab === 'v4-history'
const v4FormSnippet = rawV4Form.replace(/activeTab === 'form'/g, "activeTab === 'v4-form'");
const v4HistorySnippet = rawV4History.replace(/activeTab === 'history'/g, "activeTab === 'v4-history'");
const modalsAndPdfSnippet = rawModalsAndPdf
  .replace(/activeTab === 'form'/g, "activeTab === 'v4-form'")
  .replace(/activeTab === 'history'/g, "activeTab === 'v4-history'");

console.log('Extracted snippets successfully.');

// Write the complete updated dashboard.view.ts
const code = `export const DASHBOARD_HTML = \`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Checkpoint Systems - Weekly Technical Dashboard & Operations</title>
  <link rel="icon" type="image/png" href="/images/favicon.png?v=2" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=2" />
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
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      -webkit-tap-highlight-color: transparent;
    }
    [v-cloak] { display: none !important; }
    
    h1, h2, h3, h4, .brand-title {
      font-family: 'Host Grotesk', 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace !important;
    }

    /* Light Theme */
    html.theme-light body {
      background-color: #f8fafc;
      color: #0f172a;
    }
    .theme-light .glass-header {
      background: rgba(255, 255, 255, 0.96);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .theme-light .data-table thead th {
      background-color: #f1f5f9;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
    }
    .theme-light .data-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
    }
    .theme-light .data-table tbody tr:hover {
      background-color: #f8fafc;
    }

    /* Dark Theme */
    html.theme-dark body {
      background-color: #030712;
      color: #f1f5f9;
    }
    .theme-dark .glass-header {
      background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid #1e293b;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    .theme-dark .glass-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #1e293b;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    .theme-dark .input-box {
      background-color: #020617;
      border: 1px solid #334155;
      color: #f8fafc;
    }
    .theme-dark .input-box:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }
    .theme-dark .data-table thead th {
      background-color: #0b1329;
      color: #94a3b8;
      border-bottom: 1px solid #1e293b;
    }
    .theme-dark .data-table tbody tr {
      border-bottom: 1px solid #1e293b;
    }
    .theme-dark .data-table tbody tr:hover {
      background-color: rgba(30, 41, 59, 0.5);
    }

    /* Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
    }

    /* Badges */
    .badge-critical { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-high { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
    .badge-medium { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .badge-low { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

    .theme-dark .badge-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
    .theme-dark .badge-high { background: rgba(249, 115, 22, 0.2); color: #fb923c; border-color: rgba(249, 115, 22, 0.3); }
    .theme-dark .badge-medium { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border-color: rgba(14, 165, 233, 0.3); }
    .theme-dark .badge-low { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; border-color: rgba(148, 163, 184, 0.3); }

    /* PDF Template styles */
    #pdf-template {
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      color: #111827;
      font-family: Arial, sans-serif;
      font-size: 11px;
      box-sizing: border-box;
    }
    .pdf-page {
      padding: 12mm 15mm;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      position: relative;
      background: white;
    }
    .pdf-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 6px;
    }
    .pdf-table th, .pdf-table td {
      border: 1px solid #374151;
      padding: 4px 6px;
      text-align: left;
    }
    .pdf-table th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    .pdf-header-title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 4px;
      margin-bottom: 2px;
      color: #0369a1;
    }
    .pdf-sub-title {
      font-size: 10px;
      text-align: center;
      color: #4b5563;
      margin-bottom: 12px;
    }
    .pdf-signature-box {
      display: flex;
      justify-content: space-between;
      padding: 15px 30px 10px 30px;
      margin-top: 20px;
    }
    .pdf-signature-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 30%;
    }
    .pdf-signature-line {
      border-bottom: 1px solid black;
      width: 100%;
      height: 40px;
      margin-bottom: 5px;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">
  <div id="app" v-cloak class="flex-1 flex flex-col" @click="handleGlobalClick">
    
    <!-- TOP APP BAR -->
    <header class="glass-header sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Left Logo & Title -->
      <div class="flex items-center gap-3">
        <a href="/dashboard" class="flex items-center gap-2.5 text-inherit font-extrabold text-sm tracking-tight text-decoration-none">
          <div class="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-1 shadow-inner overflow-hidden">
            <img src="/images/logo-navbar.png?v=2" onerror="this.onerror=null; this.src='/images/logo-full.png'; this.onerror=function(){this.src='/images/favicon.png?v=2';};" class="w-full h-full object-contain rounded-lg" alt="Checkpoint Systems Logo" />
          </div>
          <div class="leading-none text-left">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-extrabold"><span class="text-sky-500">CHECKPOINT</span> Systems</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/15 text-sky-600 border border-sky-500/30">Weekly Ops</span>
            </div>
            <span class="text-[10px] text-slate-500 font-medium">Weekly Technical Dashboard & Maintenance</span>
          </div>
        </a>

        <!-- Portal Main Tabs (Desktop) -->
        <nav class="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            @click="switchTab('weekly-kpi')"
            :class="activeTab === 'weekly-kpi' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-chart-pie text-xs"></i> <span>Dashboard KPI</span>
          </button>
          
          <button
            @click="switchTab('weekly-requests')"
            :class="activeTab === 'weekly-requests' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-list-check text-xs"></i> <span>1. Phiếu Yêu Cầu</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500 text-white font-mono">{{ weeklyRequests.length }}</span>
          </button>

          <button
            @click="switchTab('defect-logs')"
            :class="activeTab === 'defect-logs' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-triangle-exclamation text-xs text-amber-500"></i> <span>2. Defect Log</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-mono">{{ defectLogs.length }}</span>
          </button>

          <button
            @click="switchTab('action-plans')"
            :class="activeTab === 'action-plans' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-bullseye text-xs text-emerald-500"></i> <span>3. Action Plan</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-mono">{{ actionPlans.length }}</span>
          </button>

          <button
            @click="switchTab('catalog')"
            :class="activeTab === 'catalog' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-users-gear text-xs"></i> <span>Người Yêu Cầu & Máy</span>
          </button>

          <button
            @click="switchTab('v4-form')"
            :class="activeTab === 'v4-form' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-file-signature text-xs"></i> <span>Phiếu Chi Tiết V4.1</span>
          </button>
        </nav>
      </div>

      <!-- Right User Menu & Controls -->
      <div class="flex items-center gap-2.5">
        <!-- Switch View: Control Panel link for Admin / Technician -->
        <a
          v-if="isAdminOrTech"
          href="/control-panel"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          title="Chuyển sang Giao diện Quản trị Control Panel"
        >
          <i class="fa-solid fa-sliders text-sky-500"></i>
          <span>Control Panel</span>
        </a>

        <!-- User Menu Dropdown Button -->
        <div class="relative">
          <button
            @click.stop="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer select-none"
          >
            <div class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs">
              {{ userInitials }}
            </div>
            <span class="text-xs font-bold hidden sm:inline">{{ currentUser.fullName || currentUser.username || 'Nhân viên' }}</span>
            <i :class="userMenuOpen ? 'rotate-180' : ''" class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform"></i>
          </button>

          <!-- Dropdown Card -->
          <div
            v-if="userMenuOpen"
            @click.stop
            class="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in"
          >
            <!-- User info -->
            <div class="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="text-xs font-bold">{{ currentUser.fullName || currentUser.username }}</div>
              <div class="text-[11px] font-mono text-slate-400">@{{ currentUser.username }}</div>
              <div class="pt-1">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {{ currentUser.role || currentUser.userType || 'EMPLOYEE' }}
                </span>
              </div>
            </div>

            <!-- Theme Mode Selection -->
            <div class="space-y-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giao diện (Theme)</div>
              <div class="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  @click="setTheme('light')"
                  class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer select-none"
                  :class="currentTheme === 'light' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'"
                >
                  <i class="fa-solid fa-sun text-amber-500 text-[11px]"></i>
                  <span>Sáng</span>
                </button>
                <button
                  type="button"
                  @click="setTheme('dark')"
                  class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer select-none"
                  :class="currentTheme === 'dark' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'"
                >
                  <i class="fa-solid fa-moon text-sky-400 text-[11px]"></i>
                  <span>Tối</span>
                </button>
              </div>
            </div>

            <!-- Portal Links -->
            <div class="space-y-1 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <a
                v-if="isAdminOrTech"
                href="/control-panel"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-sliders text-sky-500"></i> Admin Control Panel</span>
                <i class="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
              </a>
            </div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="w-full py-2 px-3 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- MOBILE / TABLET HORIZONTAL SCROLLING TABS -->
    <div class="lg:hidden flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 gap-1.5 text-xs font-bold custom-scrollbar">
      <button
        @click="switchTab('weekly-kpi')"
        :class="activeTab === 'weekly-kpi' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-chart-pie"></i> KPI Dashboard
      </button>
      <button
        @click="switchTab('weekly-requests')"
        :class="activeTab === 'weekly-requests' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-list-check"></i> 1. Yêu Cầu ({{ weeklyRequests.length }})
      </button>
      <button
        @click="switchTab('defect-logs')"
        :class="activeTab === 'defect-logs' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-triangle-exclamation"></i> 2. Defect ({{ defectLogs.length }})
      </button>
      <button
        @click="switchTab('action-plans')"
        :class="activeTab === 'action-plans' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-bullseye"></i> 3. Action Plan ({{ actionPlans.length }})
      </button>
      <button
        @click="switchTab('catalog')"
        :class="activeTab === 'catalog' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-users-gear"></i> Người Yêu Cầu & Máy
      </button>
      <button
        @click="switchTab('v4-form')"
        :class="activeTab === 'v4-form' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-file-signature"></i> Phiếu V4.1
      </button>
      <button
        @click="switchTab('v4-history'); loadHistory();"
        :class="activeTab === 'v4-history' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-shrink-0 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i class="fa-solid fa-clock-rotate-left"></i> Lịch Sử V4
      </button>
    </div>

    <!-- MAIN BODY -->
    <main class="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">

      <!-- =========================================================================
           TAB 1: WEEKLY KPI DASHBOARD & CHARTS
           ========================================================================= -->
      <div v-show="activeTab === 'weekly-kpi'" class="space-y-6">
        <!-- Top Banner -->
        <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-sky-500/10 via-transparent to-cyan-500/10 border-sky-500/20">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500 text-white uppercase tracking-wider">Weekly Dashboard</span>
              <span class="text-xs text-slate-400 font-mono">Database Synced: 2 Excel Files</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">Bảng Điều Khiển Kỹ Thuật Hàng Tuần</h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Giám sát toàn diện 28 phiếu yêu cầu kỹ thuật, 4 sự cố Defect Log, 5 kế hoạch khắc phục Action Plan, 30 người yêu cầu và 121 thiết bị máy móc.
            </p>
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto">
            <button
              @click="loadAllWeeklyData"
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate" :class="{ 'fa-spin': loadingWeekly }"></i>
              <span>Làm Mới Số Liệu</span>
            </button>
            <button
              @click="openWeeklyRequestModal()"
              class="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 w-full md:w-auto cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i>
              <span>Tạo Phiếu Kỹ Thuật</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- KPI 1: Technical Requests -->
          <div class="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Phiếu Kỹ Thuật (Tuần)</p>
                <h3 class="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white font-mono">{{ kpiTotalRequests }}</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center text-xl">
                <i class="fa-solid fa-list-check"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-emerald-500 font-bold flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> Đạt SLA: {{ kpiSlaMetRate }}%
              </span>
              <span class="text-slate-400 font-mono">{{ kpiOpenRequests }} Đang Mở</span>
            </div>
          </div>

          <!-- KPI 2: Defect Log -->
          <div class="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Sự Cố Defect Log</p>
                <h3 class="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white font-mono">{{ kpiTotalDefects }}</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center text-xl">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-amber-500 font-bold flex items-center gap-1">
                <i class="fa-solid fa-file-shield"></i> {{ kpiDefect8DCount }} Cần 8D
              </span>
              <span class="text-slate-400 font-mono">{{ kpiDefectRecurringCount }} Tái diễn</span>
            </div>
          </div>

          <!-- KPI 3: Action Plans -->
          <div class="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Kế Hoạch Khắc Phục</p>
                <h3 class="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white font-mono">{{ kpiTotalActions }}</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-xl">
                <i class="fa-solid fa-bullseye"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-emerald-500 font-bold flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> {{ kpiCompletedActions }} Hoàn thành
              </span>
              <span class="text-slate-400 font-mono">{{ kpiInProgressActions }} Đang xử lý</span>
            </div>
          </div>

          <!-- KPI 4: Machines & Staff -->
          <div class="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Thiết Bị & Nhân Sự</p>
                <h3 class="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white font-mono">{{ kpiTotalMachines }}</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center text-xl">
                <i class="fa-solid fa-gears"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-indigo-500 font-bold flex items-center gap-1">
                <i class="fa-solid fa-users"></i> {{ kpiTotalRequesters }} Người yêu cầu
              </span>
              <span class="text-slate-400 font-mono">10+ Khu vực</span>
            </div>
          </div>
        </div>

        <!-- 4 Analytics Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Chart 1: Severity Breakdown -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Phân Bố Mức Độ Nghiêm Trọng (Severity)</h4>
                <p class="text-xs text-slate-400">Sheet 1_Technical_Requests (Critical, High, Medium, Low)</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Requests</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-severity"></canvas>
            </div>
          </div>

          <!-- Chart 2: Status Breakdown -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Tình Trạng Xử Lý Phiếu (Status)</h4>
                <p class="text-xs text-slate-400">Tiến độ giải quyết các yêu cầu kỹ thuật</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Status</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-status"></canvas>
            </div>
          </div>

          <!-- Chart 3: Defect Root Cause -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Nguyên Nhân Gốc Sự Cố Defect</h4>
                <p class="text-xs text-slate-400">Sheet 2_Defect_Log (Machine, System, Method...)</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Defects</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-rootcause"></canvas>
            </div>
          </div>

          <!-- Chart 4: Action Plan Fix Types -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Phân Loại Giải Pháp Kế Hoạch (Fix Types)</h4>
                <p class="text-xs text-slate-400">Sheet 3_Action_Plan (Phòng ngừa, Báo cáo 8D, Sửa nhanh)</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Actions</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-fixtype"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Records Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Requests -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-clock-rotate-left text-sky-500"></i> Phiếu Kỹ Thuật Gần Đây
              </h4>
              <button @click="switchTab('weekly-requests')" class="text-xs text-sky-500 hover:underline font-semibold">Xem tất cả ({{ weeklyRequests.length }}) &rarr;</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left font-semibold">
                    <th class="py-2 px-3">Người Yêu Cầu</th>
                    <th class="py-2 px-3">Thiết Bị</th>
                    <th class="py-2 px-3">Mức Độ</th>
                    <th class="py-2 px-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in weeklyRequests.slice(0, 5)" :key="r.id" class="cursor-pointer" @click="openWeeklyRequestModal(r)">
                    <td class="py-2.5 px-3 font-medium">{{ r.requestId }}</td>
                    <td class="py-2.5 px-3 font-mono font-bold text-sky-600 dark:text-sky-400">{{ r.itemEquipment }}</td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="getSeverityClass(r.severity)">{{ r.severity }}</span>
                    </td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="getStatusClass(r.status)">{{ r.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Defects -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-red-500"></i> Danh Sách Sự Cố Defect
              </h4>
              <button @click="switchTab('defect-logs')" class="text-xs text-sky-500 hover:underline font-semibold">Xem tất cả ({{ defectLogs.length }}) &rarr;</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left font-semibold">
                    <th class="py-2 px-3">Mã Defect</th>
                    <th class="py-2 px-3">Xưởng</th>
                    <th class="py-2 px-3">Nguyên Nhân</th>
                    <th class="py-2 px-3">Cần 8D?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in defectLogs" :key="d.id" class="cursor-pointer" @click="openDefectModal(d)">
                    <td class="py-2.5 px-3 font-mono font-bold text-red-500">#{{ d.defectId }}</td>
                    <td class="py-2.5 px-3">{{ d.facility }}</td>
                    <td class="py-2.5 px-3">{{ d.rootCauseCategory }}</td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="d.eightDRequired === 'Yes' ? 'bg-red-500/20 text-red-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
                        {{ d.eightDRequired }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 2: SHEET 1_TECHNICAL_REQUESTS (28 RECORDS)
           ========================================================================= -->
      <div v-show="activeTab === 'weekly-requests'" class="space-y-6">
        <!-- Header & Action Toolbar -->
        <div class="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">1. Phiếu Yêu Cầu Kỹ Thuật</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                {{ filteredWeeklyRequests.length }} / {{ weeklyRequests.length }} phiếu
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Dữ liệu từ Sheet <strong>1_Technical_Requests</strong> trong Weekly Technical Database.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="exportWeeklyRequestsExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
              title="Tải về file Excel .xlsx"
            >
              <i class="fa-solid fa-file-excel"></i> <span>Xuất Excel</span>
            </button>
            <button
              @click="openWeeklyRequestModal()"
              class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> <span>Tạo Phiếu Mới</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-400 mb-1">Tìm kiếm</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="reqFilter.search"
                type="text"
                placeholder="Tìm mã NV, tên, thiết bị..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Mức độ nghiêm trọng</label>
            <select v-model="reqFilter.severity" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả mức độ</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Trạng thái phiếu</label>
            <select v-model="reqFilter.status" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Thiết bị / Máy</label>
            <select v-model="reqFilter.equipment" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả thiết bị</option>
              <option v-for="m in uniqueReqEquipments" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-xs data-table">
              <thead>
                <tr class="text-left">
                  <th class="py-3 px-3.5 whitespace-nowrap">Mã Phiếu / Người Yêu Cầu</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Ngày</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Loại Yêu Cầu</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Thiết Bị (Equipment)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Mức Độ</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">SLA Mục Tiêu (h)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Thực Tế (h)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Đạt SLA</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Người Báo</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Người Xử Lý</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredWeeklyRequests.length === 0">
                  <td colspan="12" class="text-center py-8 text-slate-400">Không tìm thấy phiếu yêu cầu kỹ thuật phù hợp.</td>
                </tr>
                <tr v-for="req in filteredWeeklyRequests" :key="req.id">
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {{ req.requestId }}
                  </td>
                  <td class="py-3 px-3.5 text-slate-500 whitespace-nowrap">{{ req.requestDate || '—' }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">{{ req.requestType }}</td>
                  <td class="py-3 px-3.5 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                    {{ req.itemEquipment }}
                  </td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="getSeverityClass(req.severity)">
                      {{ req.severity }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="getStatusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-center font-mono font-semibold">{{ req.slaTargetHours ?? 1 }}</td>
                  <td class="py-3 px-3.5 text-center font-mono font-semibold">{{ req.actualHours ?? '—' }}</td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="(req.metSla || 'Yes').toLowerCase() === 'yes' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-600 border border-red-500/30'">
                      {{ req.metSla || 'Yes' }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ req.reportedBy }}</td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ req.resolvedBy || '—' }}</td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openWeeklyRequestModal(req)"
                        class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                        title="Chỉnh sửa phiếu"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteWeeklyRequest(req.id)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa phiếu"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 3: SHEET 2_DEFECT_LOG (4 RECORDS)
           ========================================================================= -->
      <div v-show="activeTab === 'defect-logs'" class="space-y-6">
        <!-- Header & Action Toolbar -->
        <div class="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">2. Nhật Ký Sự Cố (Defect Log)</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                {{ filteredDefectLogs.length }} / {{ defectLogs.length }} lỗi
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Dữ liệu từ Sheet <strong>2_Defect_Log</strong>: Ghi nhận nguyên nhân, thời gian dừng máy và báo cáo 8D.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="exportDefectLogsExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> <span>Xuất Excel</span>
            </button>
            <button
              @click="openDefectModal()"
              class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-red-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> <span>Ghi Nhận Lỗi Defect</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-400 mb-1">Tìm kiếm sự cố</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="defectFilter.search"
                type="text"
                placeholder="Tìm nội dung sự cố, sản phẩm..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Xưởng / Facility</label>
            <select v-model="defectFilter.facility" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả xưởng</option>
              <option value="RFID">RFID</option>
              <option value="WOVEN">WOVEN</option>
              <option value="LASER">LASER</option>
              <option value="OFFSET">OFFSET</option>
              <option value="DIGITAL">DIGITAL</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Nguyên nhân gốc</label>
            <select v-model="defectFilter.rootCause" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả nguyên nhân</option>
              <option value="Machine">Machine</option>
              <option value="System">System</option>
              <option value="Method">Method</option>
              <option value="Material">Material</option>
              <option value="Man">Man</option>
            </select>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-xs data-table">
              <thead>
                <tr class="text-left">
                  <th class="py-3 px-3.5 whitespace-nowrap">Mã Defect</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Ngày</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Xưởng (Facility)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Nguồn Gốc (Source)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Nguyên Nhân Gốc</th>
                  <th class="py-3 px-3.5">Chi Tiết Sự Cố (Specific Issue)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Sản Phẩm Ảnh Hưởng</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Dừng Máy (phút)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Tái Diễn?</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Cần Báo Cáo 8D?</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredDefectLogs.length === 0">
                  <td colspan="11" class="text-center py-8 text-slate-400">Không tìm thấy sự cố defect nào phù hợp.</td>
                </tr>
                <tr v-for="d in filteredDefectLogs" :key="d.id">
                  <td class="py-3 px-3.5 font-mono font-bold text-red-500 whitespace-nowrap">#{{ d.defectId }}</td>
                  <td class="py-3 px-3.5 text-slate-500 whitespace-nowrap">{{ d.defectDate }}</td>
                  <td class="py-3 px-3.5 font-semibold whitespace-nowrap">{{ d.facility }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">{{ d.source }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {{ d.rootCauseCategory }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 max-w-xs truncate" :title="d.specificIssue">{{ d.specificIssue }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">{{ d.affectedProduct }}</td>
                  <td class="py-3 px-3.5 text-center font-mono font-semibold">{{ d.downtimeMinutes || '0' }}</td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="d.recurringIssue === 'Yes' ? 'bg-red-500/20 text-red-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
                      {{ d.recurringIssue }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="d.eightDRequired === 'Yes' ? 'bg-red-500/20 text-red-600 font-bold border border-red-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
                      {{ d.eightDRequired }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openDefectModal(d)"
                        class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                        title="Chỉnh sửa sự cố"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteDefectLog(d.id)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa sự cố"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 4: SHEET 3_ACTION_PLAN (5 RECORDS)
           ========================================================================= -->
      <div v-show="activeTab === 'action-plans'" class="space-y-6">
        <!-- Header & Action Toolbar -->
        <div class="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">3. Kế Hoạch Hành Động (Action Plan)</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {{ filteredActionPlans.length }} / {{ actionPlans.length }} kế hoạch
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Dữ liệu từ Sheet <strong>3_Action_Plan</strong>: Biện pháp khắc phục dài hạn, người phụ trách và tiến độ hoàn thành.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="exportActionPlansExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> <span>Xuất Excel</span>
            </button>
            <button
              @click="openActionPlanModal()"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> <span>Thêm Kế Hoạch Mới</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-400 mb-1">Tìm kiếm kế hoạch</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="actionFilter.search"
                type="text"
                placeholder="Tìm mã, mô tả, PIC..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Trạng thái (Status)</label>
            <select v-model="actionFilter.status" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả trạng thái</option>
              <option value="In Progress">In Progress (Đang thực hiện)</option>
              <option value="Completed">Completed (Hoàn thành)</option>
              <option value="Pending">Pending (Chờ duyệt)</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Người phụ trách (PIC)</label>
            <select v-model="actionFilter.pic" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả PIC</option>
              <option value="Steve">Steve</option>
              <option value="Wayne">Wayne</option>
            </select>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-xs data-table">
              <thead>
                <tr class="text-left">
                  <th class="py-3 px-3.5 whitespace-nowrap">Mã Kế Hoạch (Action ID)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Ngày Tạo</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Xưởng</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Defect ID</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Loại Khắc Phục (Fix Type)</th>
                  <th class="py-3 px-3.5">Mô Tả Hành Động</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Phụ Trách (PIC)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Hạn Chót (Deadline)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Nguồn Lực Cần</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredActionPlans.length === 0">
                  <td colspan="11" class="text-center py-8 text-slate-400">Không tìm thấy kế hoạch hành động nào.</td>
                </tr>
                <tr v-for="act in filteredActionPlans" :key="act.id">
                  <td class="py-3 px-3.5 font-bold font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {{ act.actionId }}
                  </td>
                  <td class="py-3 px-3.5 text-slate-500 whitespace-nowrap">{{ act.dateLogged }}</td>
                  <td class="py-3 px-3.5 font-medium whitespace-nowrap">{{ act.facility }}</td>
                  <td class="py-3 px-3.5 font-mono text-center whitespace-nowrap">#{{ act.relatedDefectId || '7' }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      {{ act.fixType }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 max-w-xs truncate" :title="act.description">{{ act.description }}</td>
                  <td class="py-3 px-3.5 font-semibold whitespace-nowrap">{{ act.pic }}</td>
                  <td class="py-3 px-3.5 font-mono text-slate-500 whitespace-nowrap">{{ act.deadline }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="act.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 font-bold' : (act.status === 'In Progress' ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                      {{ act.status }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ act.resourceNeeded }}</td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openActionPlanModal(act)"
                        class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                        title="Chỉnh sửa kế hoạch"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteActionPlan(act.id)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa kế hoạch"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 5: CATALOG (REQUESTERS: 30 & MACHINES: 121)
           ========================================================================= -->
      <div v-show="activeTab === 'catalog'" class="space-y-6">
        <!-- Sub-tabs Toggle -->
        <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              @click="catalogSubTab = 'requesters'"
              :class="catalogSubTab === 'requesters' ? 'bg-white dark:bg-slate-800 shadow text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-4 py-2 rounded-lg text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-users"></i>
              <span>Người Yêu Cầu ({{ requestersList.length }})</span>
            </button>
            <button
              @click="catalogSubTab = 'machines'"
              :class="catalogSubTab === 'machines' ? 'bg-white dark:bg-slate-800 shadow text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-4 py-2 rounded-lg text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-gears"></i>
              <span>Danh Mục Máy Móc ({{ rawMachinesList.length }})</span>
            </button>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button
              v-if="catalogSubTab === 'requesters'"
              @click="exportRequestersExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> Xuất Excel
            </button>
            <button
              v-if="catalogSubTab === 'requesters'"
              @click="openRequesterModal()"
              class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Người Yêu Cầu
            </button>

            <button
              v-if="catalogSubTab === 'machines'"
              @click="exportMachinesExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> Xuất Excel
            </button>
            <button
              v-if="catalogSubTab === 'machines'"
              @click="openMachineModal()"
              class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Máy Mới
            </button>
          </div>
        </div>

        <!-- Sub-view 1: Requesters (30 records from Name of reqester.xlsx) -->
        <div v-show="catalogSubTab === 'requesters'" class="space-y-4">
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 text-xs">
            <div class="flex-1 relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="requesterFilter.search"
                type="text"
                placeholder="Tìm mã NV (MNV), họ tên, chức vụ..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
            <div class="sm:w-64">
              <select v-model="requesterFilter.department" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
                <option value="ALL">Tất cả bộ phận</option>
                <option v-for="d in uniqueDepartments" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>

          <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left">
                    <th class="py-3 px-3.5 w-16 text-center">STT</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Mã Nhân Viên (MNV)</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Họ và Tên</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Bộ Phận</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Khu Vực</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Chức Vụ</th>
                    <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in filteredRequesters" :key="r.id">
                    <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-400">{{ r.stt }}</td>
                    <td class="py-3 px-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">{{ r.mnv }}</td>
                    <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white">{{ r.fullName }}</td>
                    <td class="py-3 px-3.5">{{ r.department }}</td>
                    <td class="py-3 px-3.5">{{ r.area }}</td>
                    <td class="py-3 px-3.5 text-slate-500">{{ r.position }}</td>
                    <td class="py-3 px-3.5 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          @click="openRequesterModal(r)"
                          class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                          title="Sửa"
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          @click="deleteRequester(r.id)"
                          class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                          title="Xóa"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sub-view 2: Machine list (121 records from Name of reqester.xlsx) -->
        <div v-show="catalogSubTab === 'machines'" class="space-y-4">
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 text-xs">
            <div class="flex-1 relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="machineFilter.search"
                type="text"
                placeholder="Tìm tên máy, khu vực công nghệ..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
            <div class="sm:w-64">
              <select v-model="machineFilter.tech" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
                <option value="ALL">Tất cả khu vực ({{ uniqueMachineTechs.length }})</option>
                <option v-for="t in uniqueMachineTechs" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>

          <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left">
                    <th class="py-3 px-3.5 w-16 text-center">STT</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Khu Vực / Công Nghệ</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Tên Máy</th>
                    <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in filteredMachines" :key="m.id">
                    <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-400">{{ m.stt }}</td>
                    <td class="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {{ m.tech }}
                      </span>
                    </td>
                    <td class="py-3 px-3.5 font-bold font-mono text-slate-900 dark:text-white">{{ m.name }}</td>
                    <td class="py-3 px-3.5 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          @click="openMachineModal(m)"
                          class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                          title="Sửa"
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          @click="deleteMachine(m.id)"
                          class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                          title="Xóa"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 6: PRINTABLE FORM V4.1 (RETAINED FROM ORIGINAL FORM)
           ========================================================================= -->
      ${v4FormSnippet}

      <!-- =========================================================================
           TAB 7: HISTORY V4.1
           ========================================================================= -->
      ${v4HistorySnippet}

    </main>

    ${modalsAndPdfSnippet}

    <!-- =========================================================================
         NEW MODALS FOR WEEKLY DASHBOARD CRUD
         ========================================================================= -->

    <!-- 1. MODAL: WEEKLY TECHNICAL REQUEST -->
    <div v-if="modalState.type === 'weekly-request'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-list-check text-sky-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Phiếu Yêu Cầu' : 'Tạo Phiếu Yêu Cầu Mới' }}</span>
          </h3>
          <button @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveWeeklyRequestForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <!-- Requester / Request_ID -->
            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Người Yêu Cầu (MNV - Tên) *</label>
              <input
                v-model="modalState.item.requestId"
                list="list-requesters-options"
                required
                placeholder="VD: VN5117 - Lê Minh Hoàng"
                class="input-box w-full px-3.5 py-2.5 rounded-xl font-medium outline-none"
              />
              <datalist id="list-requesters-options">
                <option v-for="r in requestersList" :key="r.id" :value="r.mnv + ' - ' + r.fullName">{{ r.department }} - {{ r.position }}</option>
              </datalist>
            </div>

            <!-- Date -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Ngày Yêu Cầu</label>
              <input v-model="modalState.item.requestDate" type="date" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Request Type -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Loại Yêu Cầu *</label>
              <select v-model="modalState.item.requestType" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Machine Running ">Machine Running</option>
                <option value="Machine Set up">Machine Set up</option>
                <option value="Preventive Maintenance">Preventive Maintenance</option>
              </select>
            </div>

            <!-- Equipment -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Thiết Bị / Máy (Equipment) *</label>
              <input
                v-model="modalState.item.itemEquipment"
                list="list-machines-options"
                required
                placeholder="VD: PFL2, SX 52..."
                class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none font-mono"
              />
              <datalist id="list-machines-options">
                <option v-for="m in rawMachinesList" :key="m.id" :value="m.name">{{ m.tech }} - {{ m.name }}</option>
              </datalist>
            </div>

            <!-- Severity -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Mức Độ Nghiêm Trọng *</label>
              <select v-model="modalState.item.severity" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Critical">Critical (Nghiêm trọng)</option>
                <option value="High">High (Cao)</option>
                <option value="Medium">Medium (Trung bình)</option>
                <option value="Low">Low (Thấp)</option>
              </select>
            </div>

            <!-- Status -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Trạng Thái *</label>
              <select v-model="modalState.item.status" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Open">Open (Mới mở)</option>
                <option value="In Progress">In Progress (Đang xử lý)</option>
                <option value="Closed">Closed (Đã xong)</option>
                <option value="Pending">Pending (Tạm dừng)</option>
              </select>
            </div>

            <!-- SLA Target Hours -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">SLA Mục Tiêu (giờ)</label>
              <input v-model.number="modalState.item.slaTargetHours" type="number" step="0.5" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Actual Hours -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Giờ Thực Tế Xử Lý</label>
              <input v-model.number="modalState.item.actualHours" type="number" step="0.1" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Met SLA -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Đạt SLA?</label>
              <select v-model="modalState.item.metSla" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes (Đạt SLA)</option>
                <option value="No">No (Không đạt)</option>
              </select>
            </div>

            <!-- Reported By -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Người Báo Cáo *</label>
              <input v-model="modalState.item.reportedBy" required placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Resolved By -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Người Xử Lý</label>
              <input v-model="modalState.item.resolvedBy" placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">
              {{ modalState.isEdit ? 'Lưu Thay Đổi' : 'Tạo Phiếu' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. MODAL: DEFECT LOG -->
    <div v-if="modalState.type === 'defect-log'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-red-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Sự Cố Defect' : 'Ghi Nhận Sự Cố Defect Mới' }}</span>
          </h3>
          <button @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveDefectLogForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Mã Defect (Số) *</label>
              <input v-model.number="modalState.item.defectId" type="number" required class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Ngày Sự Cố *</label>
              <input v-model="modalState.item.defectDate" type="text" placeholder="DD/MM/YYYY" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Phân Xưởng (Facility) *</label>
              <select v-model="modalState.item.facility" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="RFID ">RFID</option>
                <option value="WOVEN">WOVEN</option>
                <option value="LASER">LASER</option>
                <option value="OFFSET">OFFSET</option>
                <option value="DIGITAL">DIGITAL</option>
                <option value="PFL">PFL</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Nguồn Gốc (Source) *</label>
              <select v-model="modalState.item.source" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Internal">Internal (Nội bộ)</option>
                <option value="External (Customer complaint)">External (Khách hàng khiếu nại)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Nguyên Nhân Gốc *</label>
              <select v-model="modalState.item.rootCauseCategory" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Machine">Machine</option>
                <option value="System">System</option>
                <option value="Method">Method</option>
                <option value="Material">Material</option>
                <option value="Man">Man</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Sản Phẩm Ảnh Hưởng</label>
              <input v-model="modalState.item.affectedProduct" placeholder="Mã sản phẩm / tem / nhãn..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Thời Gian Dừng Máy (phút)</label>
              <input v-model="modalState.item.downtimeMinutes" placeholder="VD: 30..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Sự Cố Tái Diễn?</label>
              <select v-model="modalState.item.recurringIssue" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Yêu Cầu Làm Báo Cáo 8D?</label>
              <select v-model="modalState.item.eightDRequired" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes (Yêu cầu làm báo cáo 8D)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Chi Tiết Sự Cố (Specific Issue) *</label>
              <textarea v-model="modalState.item.specificIssue" required rows="3" placeholder="Mô tả cụ thể hiện tượng hư hỏng hoặc lỗi..." class="input-box w-full p-3 rounded-xl outline-none"></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 cursor-pointer">
              {{ modalState.isEdit ? 'Lưu Sự Cố' : 'Ghi Nhận' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 3. MODAL: ACTION PLAN -->
    <div v-if="modalState.type === 'action-plan'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-bullseye text-emerald-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Kế Hoạch' : 'Thêm Kế Hoạch Khắc Phục Mới' }}</span>
          </h3>
          <button @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveActionPlanForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Mã Kế Hoạch (Action ID) *</label>
              <input v-model="modalState.item.actionId" required placeholder="VD: CLS010, SX52..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Ngày Tạo</label>
              <input v-model="modalState.item.dateLogged" type="text" placeholder="DD/MM/YYYY" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Xưởng (Facility)</label>
              <input v-model="modalState.item.facility" placeholder="RFID, OFFSET, DIGITAL..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Defect ID Liên Quan</label>
              <input v-model="modalState.item.relatedDefectId" placeholder="VD: 7, 1..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Loại Giải Pháp (Fix Type) *</label>
              <select v-model="modalState.item.fixType" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Long-term preventive">Long-term preventive (Phòng ngừa dài hạn)</option>
                <option value="8D Report">8D Report (Báo cáo 8D)</option>
                <option value="Short-term fix">Short-term fix (Khắc phục tạm thời)</option>
                <option value="Process Update">Process Update (Cải tiến quy trình)</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Mô Tả Hành Động (Description) *</label>
              <textarea v-model="modalState.item.description" required rows="3" placeholder="Chi tiết kế hoạch triển khai..." class="input-box w-full p-3 rounded-xl outline-none"></textarea>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Người Phụ Trách (PIC) *</label>
              <input v-model="modalState.item.pic" required placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none font-semibold" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Hạn Chót (Deadline)</label>
              <input v-model="modalState.item.deadline" type="text" placeholder="DD/MM/YYYY" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Trạng Thái (Status) *</label>
              <select v-model="modalState.item.status" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="In Progress">In Progress (Đang thực hiện)</option>
                <option value="Completed">Completed (Hoàn thành)</option>
                <option value="Pending">Pending (Chờ duyệt)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Nguồn Lực Cần (Resource Needed)</label>
              <select v-model="modalState.item.resourceNeeded" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Training">Training (Đào tạo)</option>
                <option value="Spare Parts">Spare Parts (Linh kiện thay thế)</option>
                <option value="Software Update">Software Update (Nâng cấp phần mềm)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer">
              {{ modalState.isEdit ? 'Lưu Kế Hoạch' : 'Tạo Kế Hoạch' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 4. MODAL: REQUESTER -->
    <div v-if="modalState.type === 'requester'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-user-plus text-sky-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Người Yêu Cầu' : 'Thêm Người Yêu Cầu' }}</span>
          </h3>
          <button @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveRequesterForm" class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Mã Nhân Viên (MNV) *</label>
            <input v-model="modalState.item.mnv" required placeholder="VD: VN5117" class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Họ và Tên *</label>
            <input v-model="modalState.item.fullName" required placeholder="VD: Lê Minh Hoàng" class="input-box w-full px-3.5 py-2.5 rounded-xl font-semibold outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Bộ Phận</label>
              <input v-model="modalState.item.department" placeholder="Production..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Khu Vực</label>
              <input v-model="modalState.item.area" placeholder="Production..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Chức Vụ</label>
            <input v-model="modalState.item.position" placeholder="VD: Assistant Production Manager..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 5. MODAL: MACHINE -->
    <div v-if="modalState.type === 'machine'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-gear text-sky-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Thiết Bị' : 'Thêm Máy Mới' }}</span>
          </h3>
          <button @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveMachineForm" class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Khu Vực / Công Nghệ *</label>
            <input v-model="modalState.item.tech" required placeholder="VD: PFL, OFFSET, DIGITAL..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-bold outline-none" />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Tên Máy *</label>
            <input v-model="modalState.item.name" required placeholder="VD: PFL1, SX 52 - 6 colors..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">Lưu</button>
          </div>
        </form>
      </div>
    </div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, computed, onMounted, nextTick } = Vue;

    createApp({
      setup() {
        const activeTab = ref('weekly-kpi');
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({});
        const savingServer = ref(false);
        const exportingPDF = ref(false);
        const customMachineMode = ref(false);
        const catalogSubTab = ref('requesters');
        const loadingWeekly = ref(false);

        // Weekly Technical Dashboard Entities
        const weeklyRequests = ref([]);
        const defectLogs = ref([]);
        const actionPlans = ref([]);
        const requestersList = ref([]);
        const rawMachinesList = ref([]);
        const lookupOptions = ref([]);

        // Filter states
        const reqFilter = ref({ search: '', severity: 'ALL', status: 'ALL', equipment: 'ALL' });
        const defectFilter = ref({ search: '', facility: 'ALL', rootCause: 'ALL' });
        const actionFilter = ref({ search: '', status: 'ALL', pic: 'ALL' });
        const requesterFilter = ref({ search: '', department: 'ALL' });
        const machineFilter = ref({ search: '', tech: 'ALL' });

        // Modal states
        const modalState = ref({ type: null, isEdit: false, item: {} });

        // Printable V4 Form State
        const form = ref({
          id: '',
          docNo: '',
          reqDate: '',
          reqTime: '',
          reqBy: '',
          printTech: '',
          machineName: '',
          problem: '',
          machineStatus: 'First Bulk Print',
          priority: 'Immediate',
          priorityOther: '',
          recvBy: '',
          recvDate: '',
          recvTime: '',
          finishDate: '',
          finishTime: '',
          downtime: 0,
          rootCause: '',
          actionTaken: '',
          errCat: 'MACHINE',
          errType: 'Press',
          photosBefore: [],
          photosAfter: [],
          chkQuality: 'OK',
          chkStatus: 'DONE',
          workOrder: '',
          woTotalQty: '',
          wasteQty: '',
          wasteUnit: 'Pcs',
          wastePercent: '0%',
          prodMgr: ''
        });

        // Catalogs & History for V4 Form
        const machineCatalog = ref({});
        const employeeDatalist = ref([]);
        const historyItems = ref([]);
        const historyTotal = ref(0);
        const historyLoading = ref(false);
        const historyFilter = ref({ search: '', chkStatus: 'ALL', printTech: 'ALL' });
        let searchTimeout = null;

        // Modals state for V4
        const activeTimeTarget = ref(null);
        const activeTimeLabel = ref('Chọn Giờ');
        const activePersonTarget = ref(null);
        const pickerDept = ref('');
        const pickerArea = ref('');
        const pickerSelectedName = ref('');
        const excelStatus = ref({ show: false, isError: false, msg: '' });

        // Chart instances
        let chartSeverity = null;
        let chartStatus = null;
        let chartRootCause = null;
        let chartFixType = null;

        // Computed Properties
        const userInitials = computed(() => {
          const name = currentUser.value.fullName || currentUser.value.username || 'U';
          const parts = name.trim().split(' ');
          if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          }
          return name.substring(0, 2).toUpperCase();
        });

        const isAdminOrTech = computed(() => {
          const r = currentUser.value.role || currentUser.value.userType;
          return r === 'ADMIN' || r === 'SUPER_ADMIN' || r === 'TECHNICIAN';
        });

        // KPI Computations
        const kpiTotalRequests = computed(() => weeklyRequests.value.length);
        const kpiSlaMetCount = computed(() => weeklyRequests.value.filter(r => (r.metSla || 'Yes').toLowerCase().includes('yes')).length);
        const kpiSlaMetRate = computed(() => kpiTotalRequests.value ? Math.round((kpiSlaMetCount.value / kpiTotalRequests.value) * 100) : 100);
        const kpiOpenRequests = computed(() => weeklyRequests.value.filter(r => (r.status || '').toLowerCase() === 'open').length);
        const kpiInProgressRequests = computed(() => weeklyRequests.value.filter(r => (r.status || '').toLowerCase().includes('progress')).length);
        const kpiTotalDefects = computed(() => defectLogs.value.length);
        const kpiDefect8DCount = computed(() => defectLogs.value.filter(d => (d.eightDRequired || '').toLowerCase().includes('yes')).length);
        const kpiDefectRecurringCount = computed(() => defectLogs.value.filter(d => (d.recurringIssue || '').toLowerCase().includes('yes')).length);
        const kpiTotalActions = computed(() => actionPlans.value.length);
        const kpiCompletedActions = computed(() => actionPlans.value.filter(a => (a.status || '').toLowerCase().includes('completed')).length);
        const kpiInProgressActions = computed(() => actionPlans.value.filter(a => (a.status || '').toLowerCase().includes('progress')).length);
        const kpiTotalMachines = computed(() => rawMachinesList.value.length);
        const kpiTotalRequesters = computed(() => requestersList.value.length);

        // Filtered Lists
        const filteredWeeklyRequests = computed(() => {
          let list = weeklyRequests.value;
          if (reqFilter.value.search) {
            const s = reqFilter.value.search.toLowerCase();
            list = list.filter(r => 
              (r.requestId || '').toLowerCase().includes(s) ||
              (r.itemEquipment || '').toLowerCase().includes(s) ||
              (r.reportedBy || '').toLowerCase().includes(s) ||
              (r.resolvedBy || '').toLowerCase().includes(s)
            );
          }
          if (reqFilter.value.severity !== 'ALL') {
            list = list.filter(r => (r.severity || '').toLowerCase() === reqFilter.value.severity.toLowerCase());
          }
          if (reqFilter.value.status !== 'ALL') {
            list = list.filter(r => (r.status || '').toLowerCase() === reqFilter.value.status.toLowerCase());
          }
          if (reqFilter.value.equipment !== 'ALL') {
            list = list.filter(r => r.itemEquipment === reqFilter.value.equipment);
          }
          return list;
        });

        const uniqueReqEquipments = computed(() => {
          return [...new Set(weeklyRequests.value.map(r => r.itemEquipment).filter(Boolean))].sort();
        });

        const filteredDefectLogs = computed(() => {
          let list = defectLogs.value;
          if (defectFilter.value.search) {
            const s = defectFilter.value.search.toLowerCase();
            list = list.filter(d => 
              (d.specificIssue || '').toLowerCase().includes(s) ||
              (d.affectedProduct || '').toLowerCase().includes(s) ||
              (d.facility || '').toLowerCase().includes(s)
            );
          }
          if (defectFilter.value.facility !== 'ALL') {
            list = list.filter(d => (d.facility || '').trim().toLowerCase() === defectFilter.value.facility.trim().toLowerCase());
          }
          if (defectFilter.value.rootCause !== 'ALL') {
            list = list.filter(d => (d.rootCauseCategory || '').trim().toLowerCase() === defectFilter.value.rootCause.trim().toLowerCase());
          }
          return list;
        });

        const filteredActionPlans = computed(() => {
          let list = actionPlans.value;
          if (actionFilter.value.search) {
            const s = actionFilter.value.search.toLowerCase();
            list = list.filter(a => 
              (a.actionId || '').toLowerCase().includes(s) ||
              (a.description || '').toLowerCase().includes(s) ||
              (a.pic || '').toLowerCase().includes(s)
            );
          }
          if (actionFilter.value.status !== 'ALL') {
            list = list.filter(a => (a.status || '').trim().toLowerCase() === actionFilter.value.status.trim().toLowerCase());
          }
          if (actionFilter.value.pic !== 'ALL') {
            list = list.filter(a => (a.pic || '').trim().toLowerCase() === actionFilter.value.pic.trim().toLowerCase());
          }
          return list;
        });

        const filteredRequesters = computed(() => {
          let list = requestersList.value;
          if (requesterFilter.value.search) {
            const s = requesterFilter.value.search.toLowerCase();
            list = list.filter(r => 
              (r.mnv || '').toLowerCase().includes(s) ||
              (r.fullName || '').toLowerCase().includes(s) ||
              (r.position || '').toLowerCase().includes(s)
            );
          }
          if (requesterFilter.value.department !== 'ALL') {
            list = list.filter(r => r.department === requesterFilter.value.department);
          }
          return list;
        });

        const uniqueDepartments = computed(() => {
          return [...new Set(requestersList.value.map(r => r.department).filter(Boolean))].sort();
        });

        const filteredMachines = computed(() => {
          let list = rawMachinesList.value;
          if (machineFilter.value.search) {
            const s = machineFilter.value.search.toLowerCase();
            list = list.filter(m => 
              (m.name || '').toLowerCase().includes(s) ||
              (m.tech || '').toLowerCase().includes(s)
            );
          }
          if (machineFilter.value.tech !== 'ALL') {
            list = list.filter(m => m.tech === machineFilter.value.tech);
          }
          return list;
        });

        const uniqueMachineTechs = computed(() => {
          return [...new Set(rawMachinesList.value.map(m => m.tech).filter(Boolean))].sort();
        });

        const currentTechMachines = computed(() => {
          if (!form.value.printTech || !machineCatalog.value[form.value.printTech]) return [];
          return machineCatalog.value[form.value.printTech];
        });

        const pickerDepartments = computed(() => {
          const depts = [...new Set(employeeDatalist.value.map(e => e.dept).filter(Boolean))];
          return depts.length ? depts : ['Sản Xuất', 'Kỹ Thuật In', 'QA / QC', 'Kho'];
        });

        const pickerAreas = computed(() => {
          if (!pickerDept.value) return [];
          const areas = [...new Set(employeeDatalist.value.filter(e => e.dept === pickerDept.value).map(e => e.area).filter(Boolean))];
          return areas.length ? areas : ['General'];
        });

        const pickerFilteredEmployees = computed(() => {
          return employeeDatalist.value.filter(e => {
            const matchDept = !pickerDept.value || e.dept === pickerDept.value;
            const matchArea = !pickerArea.value || e.area === pickerArea.value;
            return matchDept && matchArea;
          });
        });

        // Helpers
        const getSeverityClass = (sev) => {
          const s = (sev || '').toLowerCase();
          if (s === 'critical') return 'badge-critical';
          if (s === 'high') return 'badge-high';
          if (s === 'medium') return 'badge-medium';
          return 'badge-low';
        };

        const getStatusClass = (st) => {
          const s = (st || '').toLowerCase();
          if (s === 'closed' || s === 'completed') return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
          if (s === 'in progress') return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
          if (s === 'open') return 'bg-sky-500/20 text-sky-600 dark:text-sky-400';
          return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
        };

        const showToast = (msg, isError = false) => {
          const toast = document.createElement('div');
          toast.className = 'fixed top-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold transition-all transform duration-300 flex items-center gap-2 ' +
            (isError ? 'bg-red-600 text-white shadow-red-500/30' : 'bg-slate-900 text-white dark:bg-sky-500 shadow-sky-500/30');
          toast.innerHTML = (isError ? '<i class=\"fa-solid fa-circle-exclamation\"></i> ' : '<i class=\"fa-solid fa-circle-check\"></i> ') + msg;
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
          }, 3000);
        };

        // Navigation
        const switchTab = (tab) => {
          activeTab.value = tab;
          if (tab === 'weekly-kpi') {
            nextTick(() => renderCharts());
          }
          if (tab === 'v4-history') {
            loadHistory();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Data Loading
        const loadAllWeeklyData = async () => {
          loadingWeekly.value = true;
          try {
            await Promise.all([
              loadWeeklyRequests(),
              loadDefectLogs(),
              loadActionPlans(),
              loadRequesters(),
              loadMachinesList(),
              loadLookupOptions()
            ]);
            nextTick(() => renderCharts());
            showToast('Đã đồng bộ số liệu thành công');
          } catch(e) {
            console.error('Error loading data:', e);
            showToast('Lỗi khi tải số liệu', true);
          } finally {
            loadingWeekly.value = false;
          }
        };

        const loadWeeklyRequests = async () => {
          const res = await fetch('/api/weekly-requests', { credentials: 'include' });
          if (res.ok) weeklyRequests.value = await res.json();
        };

        const loadDefectLogs = async () => {
          const res = await fetch('/api/defect-logs', { credentials: 'include' });
          if (res.ok) defectLogs.value = await res.json();
        };

        const loadActionPlans = async () => {
          const res = await fetch('/api/action-plans', { credentials: 'include' });
          if (res.ok) actionPlans.value = await res.json();
        };

        const loadRequesters = async () => {
          const res = await fetch('/api/requesters', { credentials: 'include' });
          if (res.ok) requestersList.value = await res.json();
        };

        const loadMachinesList = async () => {
          const res = await fetch('/api/machines', { credentials: 'include' });
          if (res.ok) rawMachinesList.value = await res.json();
        };

        const loadLookupOptions = async () => {
          const res = await fetch('/api/lookup-options', { credentials: 'include' });
          if (res.ok) lookupOptions.value = await res.json();
        };

        // Charts
        const renderCharts = () => {
          if (activeTab.value !== 'weekly-kpi') return;

          // 1. Severity Chart
          const sevCanvas = document.getElementById('chart-severity');
          if (sevCanvas) {
            if (chartSeverity) chartSeverity.destroy();
            const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
            weeklyRequests.value.forEach(r => {
              const k = r.severity || 'Medium';
              if (counts[k] !== undefined) counts[k]++;
            });
            chartSeverity = new Chart(sevCanvas, {
              type: 'doughnut',
              data: {
                labels: ['Critical', 'High', 'Medium', 'Low'],
                datasets: [{
                  data: [counts.Critical, counts.High, counts.Medium, counts.Low],
                  backgroundColor: ['#ef4444', '#f97316', '#0ea5e9', '#94a3b8'],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }
            });
          }

          // 2. Status Chart
          const statusCanvas = document.getElementById('chart-status');
          if (statusCanvas) {
            if (chartStatus) chartStatus.destroy();
            const stCounts = { Open: 0, 'In Progress': 0, Closed: 0, Pending: 0 };
            weeklyRequests.value.forEach(r => {
              const k = r.status || 'Open';
              if (stCounts[k] !== undefined) stCounts[k]++;
              else stCounts['Open']++;
            });
            chartStatus = new Chart(statusCanvas, {
              type: 'bar',
              data: {
                labels: ['Open', 'In Progress', 'Closed', 'Pending'],
                datasets: [{
                  label: 'Số phiếu',
                  data: [stCounts.Open, stCounts['In Progress'], stCounts.Closed, stCounts.Pending],
                  backgroundColor: ['#0ea5e9', '#f59e0b', '#10b981', '#a855f7'],
                  borderRadius: 8
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
              }
            });
          }

          // 3. Root Cause Chart
          const rcCanvas = document.getElementById('chart-rootcause');
          if (rcCanvas) {
            if (chartRootCause) chartRootCause.destroy();
            const rcCounts = {};
            defectLogs.value.forEach(d => {
              const k = (d.rootCauseCategory || 'Khác').trim();
              rcCounts[k] = (rcCounts[k] || 0) + 1;
            });
            chartRootCause = new Chart(rcCanvas, {
              type: 'pie',
              data: {
                labels: Object.keys(rcCounts),
                datasets: [{
                  data: Object.values(rcCounts),
                  backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#94a3b8'],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }
            });
          }

          // 4. Fix Type Chart
          const fixCanvas = document.getElementById('chart-fixtype');
          if (fixCanvas) {
            if (chartFixType) chartFixType.destroy();
            const fixCounts = {};
            actionPlans.value.forEach(a => {
              const k = (a.fixType || 'Khác').trim();
              fixCounts[k] = (fixCounts[k] || 0) + 1;
            });
            chartFixType = new Chart(fixCanvas, {
              type: 'bar',
              data: {
                labels: Object.keys(fixCounts),
                datasets: [{
                  label: 'Kế hoạch',
                  data: Object.values(fixCounts),
                  backgroundColor: '#3b82f6',
                  borderRadius: 6
                }]
              },
              options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
              }
            });
          }
        };

        // Modals Management
        const closeCurrentModal = () => {
          modalState.value = { type: null, isEdit: false, item: {} };
        };

        const openWeeklyRequestModal = (item = null) => {
          modalState.value = {
            type: 'weekly-request',
            isEdit: !!item,
            item: item ? { ...item } : {
              requestId: requestersList.value[0] ? (requestersList.value[0].mnv + ' - ' + requestersList.value[0].fullName) : '',
              requestDate: new Date().toISOString().split('T')[0],
              requestType: 'Machine Running ',
              itemEquipment: rawMachinesList.value[0] ? rawMachinesList.value[0].name : 'PFL1',
              severity: 'High',
              status: 'Open',
              slaTargetHours: 1,
              actualHours: 0.5,
              metSla: 'Yes',
              reportedBy: currentUser.value.fullName || 'Steve',
              resolvedBy: ''
            }
          };
        };

        const saveWeeklyRequestForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/weekly-requests/' + item.id) : '/api/weekly-requests';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast(isEdit ? 'Đã cập nhật phiếu thành công' : 'Đã tạo phiếu mới thành công');
              closeCurrentModal();
              await loadWeeklyRequests();
              renderCharts();
            } else {
              showToast('Lỗi lưu phiếu kỹ thuật', true);
            }
          } catch(e) {
            showToast('Lỗi hệ thống', true);
          }
        };

        const deleteWeeklyRequest = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa phiếu yêu cầu này không?')) return;
          try {
            const res = await fetch('/api/weekly-requests/' + id, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa phiếu kỹ thuật');
              await loadWeeklyRequests();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Defect Log CRUD
        const openDefectModal = (item = null) => {
          modalState.value = {
            type: 'defect-log',
            isEdit: !!item,
            item: item ? { ...item } : {
              defectId: defectLogs.value.length ? Math.max(...defectLogs.value.map(d => Number(d.defectId) || 0)) + 1 : 1,
              defectDate: new Date().toLocaleDateString('vi-VN'),
              facility: 'RFID ',
              source: 'Internal',
              rootCauseCategory: 'Machine',
              specificIssue: '',
              affectedProduct: '',
              downtimeMinutes: '0',
              recurringIssue: 'No',
              eightDRequired: 'No'
            }
          };
        };

        const saveDefectLogForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/defect-logs/' + item.id) : '/api/defect-logs';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast(isEdit ? 'Đã cập nhật sự cố' : 'Đã ghi nhận sự cố mới');
              closeCurrentModal();
              await loadDefectLogs();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi lưu sự cố', true);
          }
        };

        const deleteDefectLog = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa sự cố Defect này không?')) return;
          try {
            const res = await fetch('/api/defect-logs/' + id, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa sự cố Defect');
              await loadDefectLogs();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Action Plan CRUD
        const openActionPlanModal = (item = null) => {
          modalState.value = {
            type: 'action-plan',
            isEdit: !!item,
            item: item ? { ...item } : {
              actionId: 'ACT-' + (actionPlans.value.length + 1),
              dateLogged: new Date().toLocaleDateString('vi-VN'),
              facility: 'RFID',
              relatedDefectId: '7',
              fixType: 'Long-term preventive',
              description: '',
              pic: currentUser.value.fullName || 'Steve',
              deadline: new Date().toLocaleDateString('vi-VN'),
              status: 'In Progress',
              resourceNeeded: 'Spare Parts',
              remarks: ''
            }
          };
        };

        const saveActionPlanForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/action-plans/' + item.id) : '/api/action-plans';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast(isEdit ? 'Đã cập nhật kế hoạch' : 'Đã thêm kế hoạch mới');
              closeCurrentModal();
              await loadActionPlans();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi lưu kế hoạch', true);
          }
        };

        const deleteActionPlan = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa kế hoạch này không?')) return;
          try {
            const res = await fetch('/api/action-plans/' + id, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa kế hoạch');
              await loadActionPlans();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Requester CRUD
        const openRequesterModal = (item = null) => {
          modalState.value = {
            type: 'requester',
            isEdit: !!item,
            item: item ? { ...item } : {
              stt: requestersList.value.length + 1,
              mnv: '',
              fullName: '',
              department: 'Production',
              area: 'Production',
              position: 'Operator'
            }
          };
        };

        const saveRequesterForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/requesters/' + item.id) : '/api/requesters';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã lưu thông tin người yêu cầu');
              closeCurrentModal();
              await loadRequesters();
            }
          } catch(e) {
            showToast('Lỗi khi lưu người yêu cầu', true);
          }
        };

        const deleteRequester = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa người yêu cầu này?')) return;
          try {
            const res = await fetch('/api/requesters/' + id, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa người yêu cầu');
              await loadRequesters();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Machine CRUD
        const openMachineModal = (item = null) => {
          modalState.value = {
            type: 'machine',
            isEdit: !!item,
            item: item ? { ...item } : {
              stt: rawMachinesList.value.length + 1,
              tech: 'PFL',
              name: ''
            }
          };
        };

        const saveMachineForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/machines/' + item.id) : '/api/machines';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã lưu thông tin máy');
              closeCurrentModal();
              await loadMachinesList();
              await loadMachinesCatalog();
            }
          } catch(e) {
            showToast('Lỗi khi lưu máy', true);
          }
        };

        const deleteMachine = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa máy này khỏi danh mục?')) return;
          try {
            const res = await fetch('/api/machines/' + id, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa máy');
              await loadMachinesList();
              await loadMachinesCatalog();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Excel Exporting
        const exportWeeklyRequestsExcel = () => {
          try {
            const exportData = weeklyRequests.value.map(r => ({
              'Request_ID': r.requestId,
              'Date': r.requestDate,
              'Request_Type': r.requestType,
              'Item_Equipment': r.itemEquipment,
              'Severity': r.severity,
              'Status': r.status,
              'SLA_Target_Hours': r.slaTargetHours,
              'Actual_Hours': r.actualHours,
              'Met_SLA': r.metSla,
              'Reported_By': r.reportedBy,
              'Resolved_By': r.resolvedBy
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '1_Technical_Requests');
            XLSX.writeFile(wb, '1_Technical_Requests_' + new Date().toISOString().split('T')[0] + '.xlsx');
            showToast('Đã xuất file 1_Technical_Requests.xlsx thành công');
          } catch(e) {
            showToast('Lỗi khi xuất file Excel', true);
          }
        };

        const exportDefectLogsExcel = () => {
          try {
            const exportData = defectLogs.value.map(d => ({
              'Defect_ID': d.defectId,
              'Date': d.defectDate,
              'Facility': d.facility,
              'Source': d.source,
              'Root_Cause_Category': d.rootCauseCategory,
              'Specific_Issue': d.specificIssue,
              'Affected_Product': d.affectedProduct,
              'Downtime_Minutes': d.downtimeMinutes,
              'Recurring_Issue': d.recurringIssue,
              '8D_Required': d.eightDRequired
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '2_Defect_Log');
            XLSX.writeFile(wb, '2_Defect_Log_' + new Date().toISOString().split('T')[0] + '.xlsx');
            showToast('Đã xuất file 2_Defect_Log.xlsx thành công');
          } catch(e) {
            showToast('Lỗi khi xuất file Excel', true);
          }
        };

        const exportActionPlansExcel = () => {
          try {
            const exportData = actionPlans.value.map(a => ({
              'Action_ID': a.actionId,
              'Date_Logged': a.dateLogged,
              'Facility': a.facility,
              'Related_Defect_ID': a.relatedDefectId,
              'Fix_Type': a.fixType,
              'Description': a.description,
              'PIC': a.pic,
              'Deadline': a.deadline,
              'Status': a.status,
              'Resource_Needed': a.resourceNeeded,
              'Remarks': a.remarks
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '3_Action_Plan');
            XLSX.writeFile(wb, '3_Action_Plan_' + new Date().toISOString().split('T')[0] + '.xlsx');
            showToast('Đã xuất file 3_Action_Plan.xlsx thành công');
          } catch(e) {
            showToast('Lỗi khi xuất file Excel', true);
          }
        };

        const exportRequestersExcel = () => {
          try {
            const exportData = requestersList.value.map(r => ({
              'STT': r.stt,
              'Bộ phận': r.department,
              'Khu Vực': r.area,
              'MNV': r.mnv,
              'TÊN': r.fullName,
              'Chức Vụ': r.position
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Requester');
            XLSX.writeFile(wb, 'Requester_List.xlsx');
            showToast('Đã xuất danh sách người yêu cầu');
          } catch(e) {
            showToast('Lỗi khi xuất Excel', true);
          }
        };

        const exportMachinesExcel = () => {
          try {
            const exportData = rawMachinesList.value.map(m => ({
              'STT': m.stt,
              'Khu vực': m.tech,
              'Tên máy': m.name
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Machine list');
            XLSX.writeFile(wb, 'Machine_List.xlsx');
            showToast('Đã xuất danh sách máy móc');
          } catch(e) {
            showToast('Lỗi khi xuất Excel', true);
          }
        };

        // Theme management
        const setTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
          userMenuOpen.value = false;
        };

        // V4.1 Printable Form Methods (Retained verbatim)
        const initForm = () => {
          const now = new Date();
          const dStr = now.toISOString().split('T')[0];
          const tStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          form.value.reqDate = dStr;
          form.value.reqTime = tStr;
          form.value.docNo = 'CPS-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + Math.floor(100 + Math.random() * 900);
        };

        const clearForm = () => {
          if (!confirm('Bạn có muốn làm mới toàn bộ biểu mẫu phiếu V4.1?')) return;
          initForm();
          form.value.problem = '';
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          showToast('Đã làm mới biểu mẫu phiếu V4.1');
        };

        const calculateDowntime = () => {
          if (!form.value.recvDate || !form.value.recvTime || !form.value.finishDate || !form.value.finishTime) {
            form.value.downtime = 0;
            return;
          }
          const start = new Date(form.value.recvDate + 'T' + form.value.recvTime);
          const end = new Date(form.value.finishDate + 'T' + form.value.finishTime);
          const diffMs = end - start;
          form.value.downtime = diffMs > 0 ? Math.round(diffMs / 60000) : 0;
        };

        const calculateWastePercent = () => {
          const w = parseFloat(form.value.wasteQty) || 0;
          const t = parseFloat(form.value.woTotalQty) || 0;
          form.value.wastePercent = (t > 0 && w >= 0) ? ((w / t) * 100).toFixed(2) + '%' : '0%';
        };

        const handleTechChange = () => {
          customMachineMode.value = false;
          form.value.machineName = '';
        };

        const handleMachineSelectChange = (e) => {
          if (e.target.value === '__OTHER__') {
            customMachineMode.value = true;
            form.value.machineName = '';
          }
        };

        const triggerUpload = (id) => {
          const el = document.getElementById(id);
          if (el) el.click();
        };

        const handleImageUpload = (event, type) => {
          const files = event.target.files;
          if (!files || !files.length) return;
          Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (type === 'before') {
                if (form.value.photosBefore.length < 3) form.value.photosBefore.push(e.target.result);
              } else {
                if (form.value.photosAfter.length < 3) form.value.photosAfter.push(e.target.result);
              }
            };
            reader.readAsDataURL(file);
          });
        };

        const removePhoto = (type, index) => {
          if (type === 'before') form.value.photosBefore.splice(index, 1);
          else form.value.photosAfter.splice(index, 1);
        };

        const saveToServer = async () => {
          savingServer.value = true;
          try {
            const res = await fetch('/api/technical-requests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form.value),
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              showToast('Lưu phiếu ' + form.value.docNo + ' thành công!');
              await loadHistory();
            } else {
              showToast('Lỗi khi lưu phiếu V4.1', true);
            }
          } catch(e) {
            showToast('Lỗi kết nối máy chủ', true);
          } finally {
            savingServer.value = false;
          }
        };

        const generatePDF = async () => {
          exportingPDF.value = true;
          try {
            const { jsPDF } = window.jspdf;
            const tpl = document.getElementById('pdf-template');
            tpl.style.display = 'block';
            await nextTick();
            const canvas = await html2canvas(document.getElementById('pdf-render-area'), { scale: 2 });
            tpl.style.display = 'none';

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            const cleanDoc = (form.value.docNo || 'Checkpoint').replace(/[/\\\\?%*:|"<>]/g, '-');
            pdf.save(cleanDoc + '.pdf');
            showToast('Xuất PDF thành công!');
          } catch(e) {
            console.error(e);
            showToast('Lỗi xuất PDF', true);
          } finally {
            exportingPDF.value = false;
          }
        };

        const quickDownloadPDF = (item) => {
          form.value = { ...form.value, ...item };
          setTimeout(() => generatePDF(), 100);
        };

        const loadItemIntoForm = (item) => {
          form.value = { ...form.value, ...item };
          switchTab('v4-form');
          showToast('Đã nạp phiếu ' + item.docNo + ' vào biểu mẫu');
        };

        const loadHistory = async () => {
          historyLoading.value = true;
          try {
            let url = '/api/technical-requests?limit=50';
            if (historyFilter.value.search) url += '&search=' + encodeURIComponent(historyFilter.value.search);
            if (historyFilter.value.chkStatus && historyFilter.value.chkStatus !== 'ALL') url += '&chkStatus=' + historyFilter.value.chkStatus;
            if (historyFilter.value.printTech && historyFilter.value.printTech !== 'ALL') url += '&printTech=' + historyFilter.value.printTech;

            const res = await fetch(url, { credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              historyItems.value = data.items || [];
              historyTotal.value = data.total || 0;
            }
          } catch (e) {
            console.error(e);
          } finally {
            historyLoading.value = false;
          }
        };

        const debouncedSearchHistory = () => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(loadHistory, 350);
        };

        const loadMachinesCatalog = async () => {
          try {
            const res = await fetch('/api/machines/grouped', { credentials: 'include' });
            if (res.ok) machineCatalog.value = await res.json();
          } catch(e) {}
        };

        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { credentials: 'include' });
            if (res.ok) employeeDatalist.value = await res.json();
          } catch(e) {}
        };

        const loadSession = async () => {
          try {
            const res = await fetch('/auth/session', { credentials: 'include' });
            if (res.ok) {
              currentUser.value = await res.json();
            } else {
              window.location.replace('/login');
            }
          } catch (e) {}
        };

        const handleLogout = async () => {
          await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
          localStorage.removeItem('checkpoint_token');
          localStorage.removeItem('checkpoint_user');
          window.location.replace('/login?logout=1');
        };

        const handleGlobalClick = () => {
          userMenuOpen.value = false;
        };

        // Modal pickers for V4
        const openTimePicker = (target, label) => {
          activeTimeTarget.value = target;
          activeTimeLabel.value = label || 'Chọn Giờ';
          const modal = document.getElementById('modal-time');
          if (modal) modal.style.display = 'flex';
        };

        const confirmTime = () => {
          const now = new Date();
          const tStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          if (activeTimeTarget.value) {
            form.value[activeTimeTarget.value] = tStr;
            calculateDowntime();
          }
          closeModal('modal-time');
        };

        const openPersonPicker = (target) => {
          activePersonTarget.value = target;
          pickerDept.value = '';
          pickerArea.value = '';
          pickerSelectedName.value = '';
          const modal = document.getElementById('modal-person');
          if (modal) modal.style.display = 'flex';
        };

        const confirmPerson = () => {
          if (activePersonTarget.value && pickerSelectedName.value && pickerSelectedName.value !== 'OTHER') {
            form.value[activePersonTarget.value] = pickerSelectedName.value;
          }
          closeModal('modal-person');
        };

        const closeModal = (id) => {
          const modal = document.getElementById(id);
          if (modal) modal.style.display = 'none';
        };

        const onPickerDeptChange = () => { pickerArea.value = ''; pickerSelectedName.value = ''; };
        const onPickerAreaChange = () => { pickerSelectedName.value = ''; };
        const openExcelUploader = () => { const m = document.getElementById('modal-excel'); if (m) m.style.display = 'flex'; };
        const processExcelFile = () => {};
        const triggerBackup = () => {};
        const triggerRestore = () => {};
        const processRestoreFile = () => {};
        const formatDisplayDate = (d) => d || '—';
        const formatShortDate = (d) => d || '—';

        onMounted(() => {
          initForm();
          loadSession();
          loadAllWeeklyData();
          loadMachinesCatalog();
          loadEmployees();
          loadHistory();

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;
        });

        return {
          activeTab,
          switchTab,
          userMenuOpen,
          currentTheme,
          currentUser,
          userInitials,
          isAdminOrTech,
          loadingWeekly,
          weeklyRequests,
          defectLogs,
          actionPlans,
          requestersList,
          rawMachinesList,
          lookupOptions,
          reqFilter,
          defectFilter,
          actionFilter,
          requesterFilter,
          machineFilter,
          catalogSubTab,
          modalState,
          form,
          machineCatalog,
          currentTechMachines,
          customMachineMode,
          employeeDatalist,
          historyItems,
          historyTotal,
          historyLoading,
          historyFilter,
          savingServer,
          exportingPDF,
          activeTimeTarget,
          activeTimeLabel,
          pickerDept,
          pickerArea,
          pickerSelectedName,
          pickerDepartments,
          pickerAreas,
          pickerFilteredEmployees,
          excelStatus,
          kpiTotalRequests,
          kpiSlaMetCount,
          kpiSlaMetRate,
          kpiOpenRequests,
          kpiInProgressRequests,
          kpiTotalDefects,
          kpiDefect8DCount,
          kpiDefectRecurringCount,
          kpiTotalActions,
          kpiCompletedActions,
          kpiInProgressActions,
          kpiTotalMachines,
          kpiTotalRequesters,
          filteredWeeklyRequests,
          uniqueReqEquipments,
          filteredDefectLogs,
          filteredActionPlans,
          filteredRequesters,
          uniqueDepartments,
          filteredMachines,
          uniqueMachineTechs,
          getSeverityClass,
          getStatusClass,
          loadAllWeeklyData,
          closeCurrentModal,
          openWeeklyRequestModal,
          saveWeeklyRequestForm,
          deleteWeeklyRequest,
          openDefectModal,
          saveDefectLogForm,
          deleteDefectLog,
          openActionPlanModal,
          saveActionPlanForm,
          deleteActionPlan,
          openRequesterModal,
          saveRequesterForm,
          deleteRequester,
          openMachineModal,
          saveMachineForm,
          deleteMachine,
          exportWeeklyRequestsExcel,
          exportDefectLogsExcel,
          exportActionPlansExcel,
          exportRequestersExcel,
          exportMachinesExcel,
          setTheme,
          clearForm,
          calculateDowntime,
          calculateWastePercent,
          handleTechChange,
          handleMachineSelectChange,
          triggerUpload,
          handleImageUpload,
          removePhoto,
          saveToServer,
          generatePDF,
          quickDownloadPDF,
          loadItemIntoForm,
          loadHistory,
          debouncedSearchHistory,
          handleLogout,
          handleGlobalClick,
          openTimePicker,
          confirmTime,
          openPersonPicker,
          confirmPerson,
          closeModal,
          onPickerDeptChange,
          onPickerAreaChange,
          openExcelUploader,
          processExcelFile,
          triggerBackup,
          triggerRestore,
          processRestoreFile,
          formatDisplayDate,
          formatShortDate
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
\`;
`;

fs.writeFileSync(oldDashboardPath, code);
console.log('Successfully wrote updated src/views/dashboard.view.ts');
