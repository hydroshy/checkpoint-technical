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

    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(2, 6, 23, 0.7);
      backdrop-filter: blur(4px);
      z-index: 60;
    }
    .modal-content {
      transform: translateY(0);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

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
            <img src="/images/logo-navbar.png?v=3" onerror="this.onerror=null; this.src='/images/logo-login.png?v=3'; this.onerror=function(){this.src='/images/favicon.png?v=3';};" class="w-full h-full object-contain rounded-lg" alt="Checkpoint Systems Logo" />
          </div>
          <div class="leading-none text-left">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-extrabold"><span class="text-sky-500">Checkpoint</span> Systems</span>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Dashboard</span>
          </div>
        </a>
      </div>

      <!-- Right User Menu & Controls (Gom tất cả icon/avatar vào 1 dropdown) -->
      <div class="flex items-center">
        <!-- User Menu Dropdown Button -->
        <div class="relative">
          <button
            @click.stop="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer select-none"
            title="Tài khoản & Thiết lập"
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
                v-if="canAccessControlPanel"
                href="/control-panel"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-sliders text-sky-500"></i> Control Panel</span>
                <i class="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
              </a>
              <a
                v-if="isAdmin"
                href="/api/docs"
                target="_blank"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-book text-sky-500"></i> Swagger API Docs</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
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

    <!-- MAIN BODY -->
    <main class="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">

      <!-- =========================================================================
           DASHBOARD HOME: MODULE CARDS (Hiện trực tiếp khi chưa vào module)
           ========================================================================= -->
      <section v-if="!isRequestActive && !isKpiActive" class="mb-8">
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Hệ thống giám sát và quản lý kỹ thuật Checkpoint Systems</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <!-- THẺ 1: PHIẾU NHẬP LIỆU -->
          <div
            v-if="canCreateRequest"
            @click="selectMenuCard('request')"
            class="relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/60 dark:hover:border-sky-500/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer select-none"
          >
            <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all"></div>

            <div>
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
                    <i class="fa-solid fa-file-signature"></i>
                  </div>
                  <div>
                    <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Phiếu Nhập Liệu</h2>
                    <span class="text-xs font-semibold text-sky-600 dark:text-sky-400">Yêu Cầu & Sự Cố Kỹ Thuật</span>
                  </div>
                </div>

                <span class="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 group-hover:bg-sky-500 group-hover:text-white transition">
                  Mở module <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                Khởi tạo và ghi nhận sự cố kỹ thuật, báo hỏng máy in, downtime & yêu cầu hỗ trợ sửa chữa bảo trì.
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-sky-500 text-[10px]"></i> Phiếu Yêu Cầu & Lịch Sử Phiếu</span>
              <span class="font-mono font-medium text-slate-400">Module 01</span>
            </div>
          </div>

          <!-- THẺ 2: REPORT TUẦN (thay vì Technical Dashboard) -->
          <div
            v-if="canViewKpi"
            @click="selectMenuCard('kpi')"
            class="relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer select-none"
          >
            <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>

            <div>
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
                    <i class="fa-solid fa-chart-pie"></i>
                  </div>
                  <div>
                    <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Report Tuần</h2>
                    <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Báo Cáo Kỹ Thuật & Phân Tích KPI</span>
                  </div>
                </div>

                <span class="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 group-hover:bg-emerald-500 group-hover:text-white transition">
                  Mở module <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                Theo dõi và phân tích chỉ số SLA, hiệu suất sửa chữa, tỷ lệ hoàn thành, Defect Logs & Action Plans.
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i> KPI, Phiếu Yêu Cầu, Defect & Action</span>
              <span class="font-mono font-medium text-slate-400">Module 02</span>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           MODULE NAVIGATION & BREADCRUMB (Khi đang mở một Module)
           ========================================================================= -->
      <section v-if="isRequestActive || isKpiActive" class="mb-6">
        <div class="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <!-- Breadcrumb -->
          <div class="flex items-center flex-wrap gap-2 text-sm">
            <button
              @click="activeTab = ''"
              type="button"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Quay lại Dashboard"
            >
              <i class="fa-solid fa-house text-xs"></i>
              <span>Dashboard</span>
            </button>
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
            <span class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i :class="isRequestActive ? 'fa-solid fa-file-signature text-sky-500' : 'fa-solid fa-chart-pie text-emerald-500'"></i>
              <span>{{ isRequestActive ? 'Phiếu Nhập Liệu' : 'Report Tuần' }}</span>
            </span>
          </div>

          <!-- Sub-tabs navigation buttons for active module -->
          <div class="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <!-- Phiếu Nhập Liệu Tabs -->
            <template v-if="isRequestActive">
              <button
                type="button"
                @click="switchTab('v4-form')"
                :class="activeTab === 'v4-form' ? 'bg-sky-500 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-file-signature text-[11px]"></i> Phiếu Nhập Liệu
              </button>
              <button
                type="button"
                @click="switchTab('v4-history'); loadHistory();"
                :class="activeTab === 'v4-history' ? 'bg-sky-500 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-clock-rotate-left text-[11px]"></i> Lịch Sử Phiếu
                <span v-if="historyTotal || historyItems.length" class="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">{{ historyTotal || historyItems.length }}</span>
              </button>
            </template>

            <!-- Report Tuần Tabs -->
            <template v-if="isKpiActive">
              <button
                type="button"
                @click="switchTab('weekly-kpi')"
                :class="activeTab === 'weekly-kpi' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-chart-pie text-[11px]"></i> Tổng Quan KPI
              </button>
              <button
                type="button"
                @click="switchTab('weekly-requests')"
                :class="activeTab === 'weekly-requests' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-list-check text-[11px]"></i> Phiếu Yêu Cầu
                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">{{ weeklyRequests.length }}</span>
              </button>
              <button
                type="button"
                @click="switchTab('defect-logs')"
                :class="activeTab === 'defect-logs' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-triangle-exclamation text-amber-500 text-[11px]"></i> Defect Log
                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">{{ defectLogs.length }}</span>
              </button>
              <button
                type="button"
                @click="switchTab('action-plans')"
                :class="activeTab === 'action-plans' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-bullseye text-emerald-500 text-[11px]"></i> Action Plan
                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">{{ actionPlans.length }}</span>
              </button>
              <button
                type="button"
                @click="switchTab('catalog')"
                :class="activeTab === 'catalog' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                class="px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-users-gear text-[11px]"></i> Người Yêu Cầu & Máy
              </button>
            </template>

            <!-- Quay lại Dashboard button -->
            <button
              type="button"
              @click="activeTab = ''"
              class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5 cursor-pointer ml-auto"
              title="Quay lại Dashboard"
            >
              <i class="fa-solid fa-arrow-left text-[11px]"></i>
              <span>Quay lại Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           TAB 1: WEEKLY KPI DASHBOARD & CHARTS
           ========================================================================= -->
      <div v-show="canViewKpi && activeTab === 'weekly-kpi'" class="space-y-6">
        <!-- Top Banner -->
        <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-sky-500/10 via-transparent to-cyan-500/10 border-sky-500/20">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500 text-white uppercase tracking-wider">Report Tuần</span>
              <span class="text-xs text-slate-400 font-mono">Database Synced: 2 Excel Files</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">Báo Cáo Kỹ Thuật Hàng Tuần</h1>
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
      <div v-show="canViewKpi && activeTab === 'weekly-requests'" class="space-y-6">
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
      <div v-show="canViewKpi && activeTab === 'defect-logs'" class="space-y-6">
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
      <div v-show="canViewKpi && activeTab === 'action-plans'" class="space-y-6">
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
      <div v-show="canViewKpi && activeTab === 'catalog'" class="space-y-6">
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
      <!-- =========================================================================
           TAB 1: BIỂU MẪU NHẬP LIỆU (TECHNICAL REQUEST FORM)
           ========================================================================= -->
      <div v-show="canCreateRequest && activeTab === 'v4-form'" class="space-y-6">
        
        <!-- Header Info Card -->
        <header class="glass-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl text-sky-500 shadow-inner">
              🖨️
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Phiếu Yêu Cầu Kỹ Thuật</h1>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Printing Dept. Repair Request & Downtime Form</p>
            </div>
          </div>
          <div class="flex flex-col items-end w-full sm:w-auto">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số tài liệu (Doc No.)</div>
            <div class="font-mono text-xl sm:text-2xl font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20 w-full sm:w-auto text-center sm:text-right mb-3">
              {{ form.docNo || '—' }}
            </div>
            
            <!-- Backup / Restore / Excel buttons -->
            <div class="flex flex-wrap justify-end gap-2 w-full">
              <button
                @click="triggerRestore"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Phục hồi form từ file JSON"
              >
                <span>📂</span> Phục hồi
              </button>
              <button
                @click="triggerBackup"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Sao lưu form ra file JSON"
              >
                <span>💾</span> Sao lưu
              </button>
              <button
                @click="openExcelUploader"
                class="text-xs bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 hover:bg-sky-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Nạp dữ liệu nhân sự từ Excel"
              >
                <span>📊</span> Nạp NV Excel
              </button>
            </div>
            <input type="file" id="file_restore" accept=".json" class="hidden" @change="processRestoreFile" />
          </div>
        </header>

        <!-- FORM SECTIONS -->
        <div class="space-y-6">

          <!-- SECTION 1: THÔNG TIN YÊU CẦU -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-sky-500/5 px-6 py-4 border-b border-sky-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-500/30">1</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Thông Tin Yêu Cầu</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận sản xuất (Requester)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Time & Person -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày yêu cầu</label>
                  <input type="date" v-model="form.reqDate" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ yêu cầu</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('reqTime')"
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono text-sm font-medium outline-none transition cursor-pointer"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người yêu cầu</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqBy"
                      list="employee_list"
                      placeholder="Nhập Mã NV hoặc tên..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('reqBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Machine -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Công nghệ in (Tech)</label>
                  <select v-model="form.printTech" @change="handleTechChange" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition cursor-pointer">
                    <option value="">— Chọn Công Nghệ —</option>
                    <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
                    <option value="OTHER">Khác...</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên máy (Machine)</label>
                  <div class="flex gap-2">
                    <select
                      v-if="!customMachineMode"
                      v-model="form.machineName"
                      @change="handleMachineSelectChange"
                      class="input-box flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition cursor-pointer"
                    >
                      <option value="">— {{ form.printTech ? 'Chọn Máy' : 'Chọn Công Nghệ Trước' }} —</option>
                      <option v-for="m in currentTechMachines" :key="m" :value="m">{{ m }}</option>
                      <option value="OTHER">📌 Nhập máy khác...</option>
                    </select>
                    <input
                      v-else
                      type="text"
                      v-model="form.machineName"
                      placeholder="Nhập tên máy..."
                      class="input-box flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="customMachineMode = !customMachineMode"
                      class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition"
                      :title="customMachineMode ? 'Chọn từ danh sách' : 'Nhập tên máy thủ công'"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 3: Problem Description -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mô tả sự cố (Problem Description)</label>
                <textarea
                  v-model="form.problem"
                  rows="3"
                  placeholder="Mô tả chi tiết tình trạng lỗi, hiện tượng hư hỏng..."
                  class="input-box px-4 py-3 rounded-xl text-sm outline-none transition resize-y"
                ></textarea>
              </div>

              <!-- Row 4: Status & Priority Toggles -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="machineStatus" id="st_first" value="First Bulk Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label for="st_first" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🆕 Hàng SX lần đầu
                      </label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="machineStatus" id="st_repeat" value="Repeat Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label for="st_repeat" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🔁 Hàng SX nhiều lần
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mức độ ưu tiên</label>
                  <div class="flex flex-wrap gap-2.5 items-center">
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="priority" id="pr_imm" value="Immediate" v-model="form.priority" class="toggle-radio-danger hidden" />
                      <label for="pr_imm" class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🔴 Hỗ trợ ngay
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="priority" id="pr_hold" value="Hold" v-model="form.priority" class="toggle-radio-warning hidden" />
                      <label for="pr_hold" class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🟡 Chạy tạm
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px] flex flex-col gap-1.5">
                      <div>
                        <input type="radio" name="priority" id="pr_other" value="Other" v-model="form.priority" class="toggle-radio-purple hidden" />
                        <label for="pr_other" class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                          📌 Khác
                        </label>
                      </div>
                      <input
                        v-if="form.priority === 'Other'"
                        type="text"
                        v-model="form.priorityOther"
                        placeholder="Nhập mức ưu tiên..."
                        class="input-box w-full px-3 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 2: PHÂN TÍCH & XỬ LÝ -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-emerald-500/5 px-6 py-4 border-b border-emerald-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/30">2</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Phân Tích & Xử Lý</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận kỹ thuật (Technical Dept)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Technical Receiver -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người tiếp nhận (Kỹ thuật)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvBy"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên kỹ thuật viên..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('recvBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Date & Time Calculation -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày nhận</label>
                  <input type="date" v-model="form.recvDate" @change="calculateDowntime" class="input-box px-3.5 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ nhận</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('recvTime')"
                      class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono text-sm text-center outline-none cursor-pointer"
                    />
                    <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày hoàn thành</label>
                  <input type="date" v-model="form.finishDate" @change="calculateDowntime" class="input-box px-3.5 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ hoàn thành</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.finishTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('finishTime')"
                      class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono text-sm text-center outline-none cursor-pointer"
                    />
                    <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Downtime (Phút)</label>
                  <input
                    type="number"
                    v-model="form.downtime"
                    readonly
                    class="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono font-bold rounded-xl text-center outline-none"
                  />
                </div>
              </div>

              <!-- Row 3: Text areas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nguyên nhân gốc (Root Cause)</label>
                  <textarea
                    v-model="form.rootCause"
                    rows="3"
                    placeholder="Phân tích nguyên nhân cốt lõi gây ra sự cố..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Hành động khắc phục (Action Taken)</label>
                  <textarea
                    v-model="form.actionTaken"
                    rows="3"
                    placeholder="Các bước và phương pháp kỹ thuật đã xử lý..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
              </div>

              <!-- Row 4: 4M & Process Stage -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Phân loại lỗi (4M)</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_man" value="MAN" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_man" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Con người</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_mac" value="MACHINE" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_mac" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Máy móc</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_mat" value="MATERIAL" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_mat" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Vật tư</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_met" value="METHOD" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_met" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">P.Pháp</label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nhóm công đoạn</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_prepress" value="Prepress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label for="typ_prepress" class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">💻 Trước in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_press" value="Press" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label for="typ_press" class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">🖨️ Trong in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_postpress" value="PostPress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label for="typ_postpress" class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">✂️ Sau in</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 3: HÌNH ẢNH CẢI THIỆN -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-amber-500/5 px-6 py-4 border-b border-amber-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/30">3</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Hình Ảnh Cải Thiện</h2>
                <p class="text-xs text-slate-500 font-medium">Before & After Repair Photos (Tối đa 3 ảnh/mục)</p>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Photos Before -->
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full hover:border-sky-400 transition">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái lỗi (Trước)</span>
                    <span class="text-[11px] font-mono text-slate-400">{{ form.photosBefore.length }}/3 ảnh</span>
                  </div>
                  <div class="flex flex-wrap gap-3 mb-4 min-h-[90px] items-center">
                    <div v-if="form.photosBefore.length === 0" class="text-xs text-slate-400 italic text-center w-full py-4">Chưa có ảnh</div>
                    <div v-for="(photo, i) in form.photosBefore" :key="'before-'+i" class="photo-thumbnail">
                      <img :src="photo" alt="Photo Before" />
                      <div class="photo-remove-btn" @click="removePhoto('before', i)">✕</div>
                    </div>
                  </div>
                  <div class="mt-auto grid grid-cols-2 gap-3">
                    <input type="file" id="file_before" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <input type="file" id="cam_before" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <button type="button" @click="triggerUpload('file_before')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('cam_before')" class="py-2 px-3 bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold hover:bg-sky-100 flex items-center justify-center gap-1.5 cursor-pointer">
                      📷 <span>Chụp ảnh</span>
                    </button>
                  </div>
                </div>

                <!-- Photos After -->
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full hover:border-emerald-400 transition">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Đã khắc phục (Sau)</span>
                    <span class="text-[11px] font-mono text-slate-400">{{ form.photosAfter.length }}/3 ảnh</span>
                  </div>
                  <div class="flex flex-wrap gap-3 mb-4 min-h-[90px] items-center">
                    <div v-if="form.photosAfter.length === 0" class="text-xs text-slate-400 italic text-center w-full py-4">Chưa có ảnh</div>
                    <div v-for="(photo, i) in form.photosAfter" :key="'after-'+i" class="photo-thumbnail">
                      <img :src="photo" alt="Photo After" />
                      <div class="photo-remove-btn" @click="removePhoto('after', i)">✕</div>
                    </div>
                  </div>
                  <div class="mt-auto grid grid-cols-2 gap-3">
                    <input type="file" id="file_after" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <input type="file" id="cam_after" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <button type="button" @click="triggerUpload('file_after')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('cam_after')" class="py-2 px-3 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer">
                      📷 <span>Chụp ảnh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: XÁC NHẬN & BÀN GIAO -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-indigo-500/5 px-6 py-4 border-b border-indigo-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/30">4</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Xác Nhận & Bàn Giao</h2>
                <p class="text-xs text-slate-500 font-medium">Production & Technical Handover Confirmation</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Quality & Ticket Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Chất lượng in sau xử lý</label>
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="chkQuality" id="qa_ok" value="OK" v-model="form.chkQuality" class="toggle-radio-success hidden" />
                      <label for="qa_ok" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">✅ Đạt chuẩn</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkQuality" id="qa_ng" value="NG" v-model="form.chkQuality" class="toggle-radio-danger hidden" />
                      <label for="qa_ng" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">❌ Chưa đạt</label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tình trạng sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_done" value="DONE" v-model="form.chkStatus" class="toggle-radio-success hidden" />
                      <label for="st_done" class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">🟢 Đã khắc phục</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_monitor" value="MONITOR" v-model="form.chkStatus" class="toggle-radio-warning hidden" />
                      <label for="st_monitor" class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">🟡 Đang theo dõi</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_support" value="SUPPORT" v-model="form.chkStatus" class="toggle-radio-danger hidden" />
                      <label for="st_support" class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">🔴 Cần hỗ trợ</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Work Order & Waste metrics -->
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Work order</label>
                  <input type="text" v-model="form.workOrder" placeholder="Số WO..." class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Qty</label>
                  <input type="number" v-model.number="form.woTotalQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Waste</label>
                  <input type="number" v-model.number="form.wasteQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đơn vị</label>
                  <select v-model="form.wasteUnit" class="input-box px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer">
                    <option value="Pcs">Pcs (Cái/Nhãn)</option>
                    <option value="Mét">Mét</option>
                    <option value="Tờ in">Tờ in</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">% Waste</label>
                  <input type="text" v-model="form.wastePercent" readonly placeholder="0%" class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-mono font-bold rounded-xl outline-none text-center" />
                </div>
              </div>

              <!-- Prod Handover Sign -->
              <div class="pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 w-full md:w-1/2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đại diện Sản Xuất ký nhận (Prod. Received By)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.prodMgr"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên người nhận..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('prodMgr')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      

      <!-- =========================================================================
           TAB 7: HISTORY V4.1
           ========================================================================= -->
      <!-- =========================================================================
           TAB 2: LỊCH SỬ PHIẾU YÊU CẦU (HISTORY & TRACKING)
           ========================================================================= -->
      <div v-show="canCreateRequest && activeTab === 'v4-history'" class="space-y-6">
        
        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 class="text-lg font-bold">Lịch Sử Phiếu Yêu Cầu Kỹ Thuật</h2>
              <p class="text-xs text-slate-500">Xem lại các phiếu đã lưu trên hệ thống, nạp lại vào form hoặc tải PDF</p>
            </div>
            <button
              @click="loadHistory"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate"></i> Làm mới danh sách
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              v-model="historyFilter.search"
              @input="debouncedSearchHistory"
              placeholder="🔍 Tìm theo Số phiếu, Tên máy, Người yêu cầu..."
              class="input-box px-4 py-2 rounded-xl text-xs"
            />
            <select v-model="historyFilter.chkStatus" @change="loadHistory" class="input-box px-4 py-2 rounded-xl text-xs">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="DONE">🟢 Đã khắc phục (DONE)</option>
              <option value="MONITOR">🟡 Đang theo dõi (MONITOR)</option>
              <option value="SUPPORT">🔴 Cần hỗ trợ (SUPPORT)</option>
            </select>
            <select v-model="historyFilter.printTech" @change="loadHistory" class="input-box px-4 py-2 rounded-xl text-xs">
              <option value="ALL">— Tất cả công nghệ in —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
          </div>
        </div>

        <!-- History Items Grid / List -->
        <div v-if="historyLoading" class="glass-card rounded-2xl p-12 text-center text-slate-400">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl text-sky-500 mb-2"></i>
          <p class="text-sm">Đang tải danh sách phiếu...</p>
        </div>

        <div v-else-if="historyItems.length === 0" class="glass-card rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <i class="fa-solid fa-folder-open text-3xl text-slate-300 dark:text-slate-600 mb-2"></i>
          <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">Không tìm thấy phiếu yêu cầu nào</h3>
          <p class="text-xs">Hãy tạo và lưu phiếu yêu cầu mới ở tab "Nhập Phiếu Mới".</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in historyItems"
            :key="item.id"
            class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-sky-500/40 transition"
          >
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">{{ item.docNo }}</span>
                <span
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': item.chkStatus === 'DONE',
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': item.chkStatus === 'MONITOR',
                    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20': item.chkStatus === 'SUPPORT'
                  }"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                >
                  {{ item.chkStatus === 'DONE' ? 'Đã khắc phục' : (item.chkStatus === 'MONITOR' ? 'Đang theo dõi' : 'Cần hỗ trợ') }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ item.printTech }}
                </span>
                <span v-if="item.downtime" class="text-[11px] font-mono font-bold text-red-500">
                  ⏳ {{ item.downtime }} phút
                </span>
              </div>
              <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Máy: <span class="text-sky-600 dark:text-sky-400">{{ item.machineName }}</span> | Yêu cầu bởi: {{ item.reqBy }} ({{ item.reqDate }} {{ item.reqTime }})
              </div>
              <p class="text-xs text-slate-500 line-clamp-1">
                Sự cố: {{ item.problem }}
              </p>
            </div>

            <!-- Item Action Buttons -->
            <div class="flex flex-wrap items-center gap-2 self-end md:self-auto">
              <button
                @click="loadItemIntoForm(item)"
                class="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Tải thông tin phiếu này vào biểu mẫu để tiếp tục sửa hoặc in"
              >
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Nạp vào Form
              </button>
              <button
                @click="quickDownloadPDF(item)"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Xuất file PDF"
              >
                <i class="fa-solid fa-file-pdf text-red-500"></i> Xuất PDF
              </button>
            </div>
          </div>
        </div>

      </div>

    </main>

    <!-- FIXED BOTTOM ACTION BAR (FOR FORM TAB) -->
    <div v-show="canCreateRequest && activeTab === 'v4-form'" class="fixed bottom-0 left-0 right-0 glass-header border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 z-40 backdrop-blur-md">
      <div class="max-w-5xl mx-auto flex flex-wrap gap-3 justify-between items-center">
        <button
          @click="clearForm"
          class="px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
        >
          🗑️ <span class="hidden sm:inline">Làm mới form</span>
        </button>

        <div class="flex items-center gap-3">
          <!-- Save to Backend Server API -->
          <button
            @click="saveToServer"
            :disabled="savingServer"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="savingServer"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...</span>
            <span v-else class="flex items-center gap-1.5">💾 <span>Lưu Hệ Thống</span></span>
          </button>

          <!-- Export PDF -->
          <button
            @click="generatePDF"
            :disabled="exportingPDF"
            class="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="exportingPDF"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang xuất PDF...</span>
            <span v-else class="flex items-center gap-1.5">📄 <span>Xuất PDF</span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- TIME PICKER MODAL -->
    <div id="modal-time" v-if="showTimeModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-end sm:items-center justify-center backdrop-blur-sm pb-10 sm:pb-0" @click="closeTimeModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xs overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">{{ activeTimeLabel }}</h3>
          <button @click="closeTimeModal" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-6 relative select-none">
          <div class="flex justify-center items-center gap-3">
            <div class="flex flex-col items-center">
              <label class="text-[10px] font-bold text-slate-400 mb-1">GIỜ (00-23)</label>
              <select v-model="pickerHour" class="input-box text-center font-mono text-xl font-bold p-2.5 rounded-xl w-24">
                <option v-for="h in hourOptions" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
            <span class="text-2xl font-bold text-sky-500 mt-4">:</span>
            <div class="flex flex-col items-center">
              <label class="text-[10px] font-bold text-slate-400 mb-1">PHÚT (00-59)</label>
              <select v-model="pickerMinute" class="input-box text-center font-mono text-xl font-bold p-2.5 rounded-xl w-24">
                <option v-for="m in minuteOptions" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>
          <div class="mt-4 flex justify-center">
            <button type="button" @click="setTimeToNow" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5 cursor-pointer">
              <i class="fa-solid fa-clock"></i> Lấy giờ hiện tại
            </button>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button @click="closeTimeModal" class="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Hủy</button>
          <button @click="confirmTime" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/30">Chọn</button>
        </div>
      </div>
    </div>

    <!-- PERSON PICKER MODAL -->
    <div id="modal-person" v-if="showPersonModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closePersonModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Chọn Nhân Sự</h3>
          <button @click="closePersonModal" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500">1. Bộ phận (Department)</label>
            <select v-model="pickerDept" @change="onPickerDeptChange" class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none">
              <option value="">— Chọn Bộ Phận —</option>
              <option v-for="d in pickerDepartments" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500">2. Khu vực / Chuyền (Area)</label>
            <select v-model="pickerArea" @change="onPickerAreaChange" class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none">
              <option value="">— Chọn Khu Vực —</option>
              <option v-for="a in pickerAreas" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500">3. Nhân viên (Name)</label>
            <select v-model="pickerSelectedName" class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none">
              <option value="">— Chọn Tên Nhân Viên —</option>
              <option v-for="emp in pickerFilteredEmployees" :key="emp.id" :value="emp.name + (emp.mnv ? ' - ' + emp.mnv : '')">
                {{ emp.name }} {{ emp.mnv ? '(' + emp.mnv + ')' : '' }} - {{ emp.role }}
              </option>
              <option value="OTHER">📌 Khác (Tự nhập tay)</option>
            </select>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button @click="closePersonModal" class="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Đóng</button>
          <button @click="confirmPerson" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/30">Xác Nhận</button>
        </div>
      </div>
    </div>

    <!-- EXCEL UPLOADER MODAL -->
    <div id="modal-excel" v-if="showExcelModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeExcelModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Nạp Danh Sách Nhân Sự Excel</h3>
          <button @click="closeExcelModal" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <p class="text-xs text-slate-500 leading-relaxed">
            Hệ thống tự động nhận diện các cột: <strong>Họ và tên</strong>, <strong>Mã NV</strong>, <strong>Bộ phận</strong>, <strong>Khu vực</strong>, <strong>Chức vụ</strong>. Dữ liệu sẽ được lưu vào hệ thống để dùng cho gợi ý người yêu cầu và tiếp nhận.
          </p>
          <input type="file" id="file_excel_upload" accept=".xlsx, .xls" class="hidden" @change="processExcelFile" />
          <div
            @click="triggerUpload('file_excel_upload')"
            class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/50"
          >
            <i class="fa-solid fa-file-excel text-3xl text-emerald-500 mb-2"></i>
            <div class="text-xs font-bold">Bấm vào đây để chọn file Excel (.xlsx, .xls)</div>
            <div class="text-[11px] text-slate-400 mt-1">Dung lượng tối đa 10MB</div>
          </div>
          <div v-if="excelStatus.show" :class="excelStatus.isError ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'" class="p-3 rounded-xl border text-xs font-semibold text-center">
            {{ excelStatus.msg }}
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button @click="closeExcelModal" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">Đóng</button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION CONTAINER -->
    <div id="toast-container" class="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"></div>

    <!-- DATALIST FOR EMPLOYEE AUTOCOMPLETE -->
    <datalist id="employee_list">
      <option v-for="emp in employeeDatalist" :key="emp.id" :value="emp.mnv ? emp.name + ' - ' + emp.mnv : emp.name"></option>
    </datalist>

    <!-- HIDDEN A4 PDF TEMPLATE -->
    <div id="pdf-template">
      <div id="pdf-render-area" class="pdf-page">
        <div class="pdf-border">
          <!-- Header -->
          <div class="pdf-header">
            <div class="pdf-meta">
              <div>Mã hiệu: BM-KT-04</div>
              <div>Lần ban hành: 01</div>
              <div>Ngày ban hành: 01/01/2026</div>
              <div>Trang: 1/1</div>
            </div>
            <div class="pdf-title-box">
              <div class="pdf-title">PHIẾU YÊU CẦU HỖ TRỢ KỸ THUẬT</div>
              <div class="pdf-subtitle">TECHNICAL SUPPORT / REPAIR REQUEST</div>
            </div>
          </div>

          <!-- Section 1 -->
          <div class="pdf-section-title" style="background-color: #dbeafe;">
            <span>1. Thông Tin Yêu Cầu Sửa Chữa (Requester)</span>
            <span style="font-weight: normal; font-size: 10px;">Số tài liệu / Doc No: <strong id="pdf_doc_no">{{ form.docNo }}</strong></span>
          </div>
          <div class="pdf-row">
            <div class="pdf-field"><span class="pdf-label">Ngày (Date):</span><div class="pdf-value" id="pdf_req_date">{{ formatDisplayDate(form.reqDate) }}</div></div>
            <div class="pdf-field ml-4"><span class="pdf-label">Giờ (Time):</span><div class="pdf-value w-16 text-center" id="pdf_req_time">{{ form.reqTime }}</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Người yêu cầu (Requested By):</span><div class="pdf-value flex-1" id="pdf_req_by">{{ form.reqBy }}</div></div>
            <div class="pdf-field ml-auto gap-4 items-center mb-1">
              <div class="flex items-center gap-1.5"><div class="pdf-checkbox" :class="{ checked: form.machineStatus === 'First Bulk Print' }"></div> <span class="text-[10px]">Hàng SX lần đầu</span></div>
              <div class="flex items-center gap-1.5"><div class="pdf-checkbox" :class="{ checked: form.machineStatus === 'Repeat Print' }"></div> <span class="text-[10px]">Hàng SX nhiều lần</span></div>
            </div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Công Nghệ / Tên máy (Tech/Machine):</span><div class="pdf-value flex-1" id="pdf_machine">[{{ form.printTech || '—' }}] {{ form.machineName || '—' }}</div></div>
            <div class="pdf-field ml-auto gap-3 items-center mb-1">
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Immediate' }"></div> <span class="text-[10px] text-red-600 font-bold">Hỗ trợ ngay</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Hold' }"></div> <span class="text-[10px] text-amber-600 font-bold">Chạy tạm</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Other' }"></div> <span class="text-[10px] text-blue-600 font-bold">Khác: </span><div class="pdf-value min-w-[50px] inline-block">{{ form.priority === 'Other' ? form.priorityOther : '' }}</div></div>
            </div>
          </div>
          <div class="pdf-row border-b-0 pb-1">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Mô tả sự cố (Problem):</span><div class="pdf-value flex-1" id="pdf_prob">{{ form.problem }}</div></div>
          </div>

          <!-- Section 2 -->
          <div class="pdf-section-title" style="background-color: #dcfce7;">
            <span>2. Thông Tin Xử Lý Của Kỹ Thuật (Technical Section)</span>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Người nhận (Receive By):</span><div class="pdf-value flex-1" id="pdf_recv_by">{{ form.recvBy }}</div></div>
            <div class="pdf-field ml-4"><span class="pdf-label">Downtime:</span><div class="pdf-value w-16 text-center font-bold text-red-600" id="pdf_downtime">{{ form.downtime || 0 }}</div><span class="text-[9px]">phút</span></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Nhận:</span><div class="pdf-value flex-1 text-center" id="pdf_recv_time_full">{{ form.recvTime }} ({{ formatShortDate(form.recvDate) }})</div></div>
            <div class="pdf-field flex-1 ml-4"><span class="pdf-label">Hoàn Thành:</span><div class="pdf-value flex-1 text-center" id="pdf_fin_time_full">{{ form.finishTime }} ({{ formatShortDate(form.finishDate) }})</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Nguyên nhân (Root Cause):</span><div class="pdf-value flex-1" id="pdf_rc">{{ form.rootCause }}</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Nội dung xử lý (Action Taken):</span><div class="pdf-value flex-1" id="pdf_act">{{ form.actionTaken }}</div></div>
          </div>
          <div class="pdf-row border-b-0 pb-1 flex justify-between bg-slate-50">
            <div class="flex gap-4 items-center">
              <div class="font-bold text-[10px] mr-2">PHÂN LOẠI LỖI:</div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MAN' }"></div> <span class="text-[10px]">MAN</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MACHINE' }"></div> <span class="text-[10px]">MACHINE</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MATERIAL' }"></div> <span class="text-[10px]">MATERIAL</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'METHOD' }"></div> <span class="text-[10px]">METHOD</span></div>
            </div>
            <div class="flex gap-4 items-center border-l-2 pl-4 border-slate-300">
              <div class="font-bold text-[10px] mr-2">NHÓM:</div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'Prepress' }"></div> <span class="text-[10px]">Trước in</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'Press' }"></div> <span class="text-[10px]">In</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'PostPress' }"></div> <span class="text-[10px]">GC sau in</span></div>
            </div>
          </div>

          <!-- Section 3 & 4 -->
          <div class="pdf-section-title" style="background-color: #f3f4f6;">
            <span>3. Xác Nhận Bàn Giao</span>
          </div>
          <div class="pdf-row justify-between bg-slate-50 min-h-[40px]">
            <div class="flex items-center gap-3">
              <span class="pdf-label font-bold">Chất lượng in sau xử lý:</span>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkQuality === 'OK' }"></div> <span class="text-[10px]">Đạt chuẩn</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkQuality === 'NG' }"></div> <span class="text-[10px]">Chưa đạt</span></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="pdf-label font-bold">Tình trạng sự cố:</span>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'DONE' }"></div> <span class="text-[10px]">Đã khắc phục</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'MONITOR' }"></div> <span class="text-[10px]">Đang theo dõi</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'SUPPORT' }"></div> <span class="text-[10px]">Cần hỗ trợ</span></div>
            </div>
          </div>

          <div class="pdf-row bg-slate-50 min-h-[30px] border-t-0 text-[10px] gap-2 flex-nowrap overflow-hidden">
            <div class="pdf-field flex-[1.5]"><span class="pdf-label font-bold">Work Order:</span><div class="pdf-value flex-1">{{ form.workOrder }}</div></div>
            <div class="pdf-field flex-1"><span class="pdf-label font-bold">Total Qty:</span><div class="pdf-value flex-1 text-center">{{ form.woTotalQty }}</div></div>
            <div class="pdf-field flex-1"><span class="pdf-label font-bold">Waste:</span><div class="pdf-value flex-1 text-center">{{ form.wasteQty }}</div></div>
            <div class="pdf-field flex-[0.8] min-w-[50px]"><span class="pdf-label font-bold">Đơn vị:</span><div class="pdf-value flex-1 text-center">{{ form.wasteUnit }}</div></div>
            <div class="pdf-field flex-[0.8] min-w-[50px]"><span class="pdf-label font-bold">% Waste:</span><div class="pdf-value flex-1 text-center">{{ form.wastePercent }}</div></div>
          </div>

          <!-- Signatures -->
          <div class="pdf-signature-box flex-1">
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">SẢN XUẤT YÊU CẦU</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.reqBy || '').split('-')[0] }}</div>
            </div>
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">KỸ THUẬT THỰC HIỆN</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.recvBy || '').split('-')[0] }}</div>
            </div>
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">SẢN XUẤT NHẬN BÀN GIAO</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.prodMgr || '').split('-')[0] }}</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="pdf-footer">
            <span>Doc No: {{ form.docNo }}</span>
            <span>Hệ thống Quản lý Yêu cầu Kỹ thuật Checkpoint Systems</span>
            <span>Page 1/1</span>
          </div>
        </div>
      </div>
    </div>

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
        const activeTab = ref('');
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({});
        try {
          const cachedUser = localStorage.getItem('checkpoint_user');
          if (cachedUser) currentUser.value = JSON.parse(cachedUser);
        } catch(e) {}

        const getAuthHeaders = (extra = {}) => {
          const headers = { ...extra };
          const token = localStorage.getItem('checkpoint_token');
          if (token) headers['Authorization'] = 'Bearer ' + token;
          return headers;
        };
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
        const showTimeModal = ref(false);
        const showPersonModal = ref(false);
        const showExcelModal = ref(false);
        const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
        const pickerHour = ref('08');
        const pickerMinute = ref('00');

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

        const isAdmin = computed(() => {
          const u = currentUser.value;
          if (!u) return false;
          return u.username === 'admin' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN';
        });

        const canAccessControlPanel = computed(() => {
          const u = currentUser.value;
          if (!u || !u.username) return false;
          if (u.username === 'admin' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') return true;
          let perms = u.permissions;
          if (typeof perms === 'string') {
            try { perms = JSON.parse(perms); } catch(e) {}
          }
          if (perms && (perms.canAccessControlPanel || perms.isAdmin)) return true;
          return false;
        });

        const isAdminOrTech = canAccessControlPanel;

        const canCreateRequest = computed(() => {
          const u = currentUser.value;
          if (!u || !u.username) return true;
          if (u.username === 'admin' || u.role === 'ADMIN') return true;
          if (u.permissions && u.permissions.canCreateRequest !== undefined) {
            return Boolean(u.permissions.canCreateRequest);
          }
          return true;
        });

        const canViewKpi = computed(() => {
          const u = currentUser.value;
          if (!u || !u.username) return true;
          if (u.username === 'admin' || u.role === 'ADMIN') return true;
          if (u.permissions && u.permissions.canViewKpi !== undefined) {
            return Boolean(u.permissions.canViewKpi);
          }
          if (u.role === 'TECHNICIAN') return true;
          if (u.role === 'EMPLOYEE') return false;
          return false;
        });

        const isRequestActive = computed(() => {
          return activeTab.value === 'v4-form' || activeTab.value === 'v4-history';
        });

        const isKpiActive = computed(() => {
          return activeTab.value === 'weekly-kpi' ||
                 activeTab.value === 'weekly-requests' ||
                 activeTab.value === 'defect-logs' ||
                 activeTab.value === 'action-plans' ||
                 activeTab.value === 'catalog';
        });

        const selectMenuCard = (type) => {
          if (type === 'request') {
            if (!canCreateRequest.value) {
              showToast('Tài khoản của bạn không có quyền Tạo phiếu yêu cầu', true);
              return;
            }
            activeTab.value = 'v4-form';
          } else if (type === 'kpi') {
            if (!canViewKpi.value) {
              showToast('Tài khoản của bạn không có quyền Xem Dashboard KPI', true);
              return;
            }
            activeTab.value = 'weekly-kpi';
            if (!weeklyRequests.value.length) {
              loadAllWeeklyData();
            }
          }
        };

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
          toast.className = 'fixed bottom-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold transition-all transform duration-300 flex items-center gap-2 ' +
            (isError ? 'bg-red-600 text-white shadow-red-500/30' : 'bg-slate-900 text-white dark:bg-sky-500 shadow-sky-500/30');
          toast.innerHTML = (isError ? '<i class="fa-solid fa-circle-exclamation"></i> ' : '<i class="fa-solid fa-circle-check"></i> ') + msg;
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
          }, 3000);
        };

        // Navigation
        const switchTab = (tab) => {
          if ((tab === 'v4-form' || tab === 'v4-history') && !canCreateRequest.value) {
            showToast('Tài khoản của bạn không có quyền Tạo phiếu yêu cầu', true);
            return;
          }
          if ((tab === 'weekly-kpi' || tab === 'weekly-requests' || tab === 'defect-logs' || tab === 'action-plans' || tab === 'catalog') && !canViewKpi.value) {
            showToast('Tài khoản của bạn không có quyền Xem Dashboard KPI', true);
            return;
          }
          activeTab.value = tab;
          showTimeModal.value = false;
          showPersonModal.value = false;
          showExcelModal.value = false;
          modalState.value = { type: null, isEdit: false, item: {} };
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
          const res = await fetch('/api/weekly-requests', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) weeklyRequests.value = await res.json();
        };

        const loadDefectLogs = async () => {
          const res = await fetch('/api/defect-logs', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) defectLogs.value = await res.json();
        };

        const loadActionPlans = async () => {
          const res = await fetch('/api/action-plans', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) actionPlans.value = await res.json();
        };

        const loadRequesters = async () => {
          const res = await fetch('/api/requesters', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) requestersList.value = await res.json();
        };

        const loadMachinesList = async () => {
          const res = await fetch('/api/machines', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) rawMachinesList.value = await res.json();
        };

        const loadLookupOptions = async () => {
          const res = await fetch('/api/lookup-options', { headers: getAuthHeaders(), credentials: 'include' });
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
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            const res = await fetch('/api/weekly-requests/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
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
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            const res = await fetch('/api/defect-logs/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
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
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            const res = await fetch('/api/action-plans/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
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
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            const res = await fetch('/api/requesters/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
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
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            const res = await fetch('/api/machines/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
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
          if (!confirm('Bạn có muốn làm mới toàn bộ biểu mẫu Phiếu Nhập Liệu?')) return;
          initForm();
          form.value.problem = '';
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          showToast('Đã làm mới biểu mẫu Phiếu Nhập Liệu');
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
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(form.value),
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              showToast('Lưu phiếu ' + form.value.docNo + ' thành công!');
              await loadHistory();
            } else {
              showToast('Lỗi khi lưu Phiếu Nhập Liệu', true);
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
            const cleanDoc = (form.value.docNo || 'Checkpoint').replace(/[/\\?%*:|"<>]/g, '-');
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

            const res = await fetch(url, { headers: getAuthHeaders(), credentials: 'include' });
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
            const res = await fetch('/api/machines/grouped', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) machineCatalog.value = await res.json();
          } catch(e) {}
        };

        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) employeeDatalist.value = await res.json();
          } catch(e) {}
        };

        const loadSession = async () => {
          try {
            const res = await fetch('/auth/session', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              currentUser.value = await res.json();
              localStorage.setItem('checkpoint_user', JSON.stringify(currentUser.value));
              if (isKpiActive.value && !canViewKpi.value && canCreateRequest.value) {
                activeTab.value = 'v4-form';
              } else if (isRequestActive.value && !canCreateRequest.value && canViewKpi.value) {
                activeTab.value = 'weekly-kpi';
              }
            } else {
              window.location.replace('/login');
            }
          } catch (e) {}
        };

        const handleLogout = async () => {
          await fetch('/auth/logout', { method: 'POST', headers: getAuthHeaders(), credentials: 'include' });
          localStorage.removeItem('checkpoint_token');
          localStorage.removeItem('checkpoint_user');
          window.location.replace('/login?logout=1');
        };

        const handleGlobalClick = () => {
          userMenuOpen.value = false;
        };

        // Modal pickers for V4
        const setTimeToNow = () => {
          const now = new Date();
          pickerHour.value = String(now.getHours()).padStart(2, '0');
          pickerMinute.value = String(now.getMinutes()).padStart(2, '0');
        };

        const openTimePicker = (target, label) => {
          activeTimeTarget.value = target;
          if (!label) {
            if (target === 'reqTime') label = 'Chọn Giờ Yêu Cầu';
            else if (target === 'recvTime') label = 'Chọn Giờ Tiếp Nhận';
            else if (target === 'finishTime') label = 'Chọn Giờ Hoàn Thành';
            else label = 'Chọn Giờ';
          }
          activeTimeLabel.value = label;
          const existing = form.value[target];
          if (existing && typeof existing === 'string' && existing.includes(':')) {
            const parts = existing.split(':');
            pickerHour.value = String(parts[0] || '08').padStart(2, '0');
            pickerMinute.value = String(parts[1] || '00').padStart(2, '0');
          } else {
            setTimeToNow();
          }
          showTimeModal.value = true;
        };

        const closeTimeModal = () => {
          showTimeModal.value = false;
        };

        const confirmTime = () => {
          if (activeTimeTarget.value) {
            form.value[activeTimeTarget.value] = pickerHour.value + ':' + pickerMinute.value;
            calculateDowntime();
          }
          showTimeModal.value = false;
        };

        const openPersonPicker = (target) => {
          activePersonTarget.value = target;
          pickerDept.value = '';
          pickerArea.value = '';
          pickerSelectedName.value = '';
          showPersonModal.value = true;
        };

        const closePersonModal = () => {
          showPersonModal.value = false;
        };

        const confirmPerson = () => {
          if (activePersonTarget.value && pickerSelectedName.value && pickerSelectedName.value !== 'OTHER') {
            form.value[activePersonTarget.value] = pickerSelectedName.value;
          }
          showPersonModal.value = false;
        };

        const closeModal = (id) => {
          if (id === 'modal-time') showTimeModal.value = false;
          else if (id === 'modal-person') showPersonModal.value = false;
          else if (id === 'modal-excel') showExcelModal.value = false;
          else {
            const modal = document.getElementById(id);
            if (modal) modal.style.display = 'none';
          }
        };

        const onPickerDeptChange = () => { pickerArea.value = ''; pickerSelectedName.value = ''; };
        const onPickerAreaChange = () => { pickerSelectedName.value = ''; };
        const openExcelUploader = () => {
          excelStatus.value = { show: false, isError: false, msg: '' };
          showExcelModal.value = true;
        };

        const closeExcelModal = () => {
          showExcelModal.value = false;
        };

        const processExcelFile = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          excelStatus.value = { show: true, isError: false, msg: 'Đang đọc và phân tích file Excel...' };
          const reader = new FileReader();
          reader.onload = async (evt) => {
            try {
              const data = new Uint8Array(evt.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });

              let hr = -1, ci = null;
              for (let r = 0; r < Math.min(json.length, 6); r++) {
                const H = json[r] || [];
                const _diac = s => (s == null ? '' : String(s)).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
                const _fc = keys => H.findIndex(h => { const ch = _diac(h); return ch && keys.some(k => ch === k || ch.includes(k)); });
                const name = _fc(['ho va ten', 'ho ten', 'ten nhan vien', 'full name', 'name', 'ten']);
                const mnv  = _fc(['mnv', 'ma nv', 'ma nhan vien', 'ma so nv', 'employee']);
                const dept = _fc(['bo phan', 'department', 'dept', 'phong ban']);
                const area = _fc(['khu vuc', 'area', 'line']);
                const role = _fc(['chuc vu', 'role', 'vi tri']);
                if (name >= 0) { hr = r; ci = { name, mnv, dept, area, role }; break; }
              }

              if (hr >= 0) {
                const employees = [];
                for (let i = hr + 1; i < json.length; i++) {
                  const row = json[i] || [];
                  const nm = (row[ci.name] != null ? String(row[ci.name]) : '').trim();
                  if (!nm) continue;
                  const dept = ci.dept >= 0 ? String(row[ci.dept] || '').trim() : 'Khác';
                  const area = ci.area >= 0 ? String(row[ci.area] || '').trim() : dept;
                  const mnv  = ci.mnv >= 0 ? String(row[ci.mnv] || '').trim() : '';
                  const role = ci.role >= 0 ? String(row[ci.role] || '').trim() : 'Staff';
                  employees.push({ name: nm, mnv, dept, area, role });
                }

                const res = await fetch('/api/employees/bulk-import', {
                  method: 'POST',
                  headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                  credentials: 'include',
                  body: JSON.stringify({ employees })
                });

                if (res.ok) {
                  excelStatus.value = { show: true, isError: false, msg: '✅ Đã nạp thành công ' + employees.length + ' nhân sự vào hệ thống!' };
                  await loadEmployees();
                  showToast('Đã nạp ' + employees.length + ' nhân sự');
                } else {
                  throw new Error('Lỗi lưu trữ nhân sự lên máy chủ');
                }
              } else {
                throw new Error('Không nhận diện được tiêu đề cột (Họ và tên, Mã NV, Bộ phận...)');
              }
            } catch (err) {
              excelStatus.value = { show: true, isError: true, msg: '❌ ' + (err.message || 'Lỗi đọc file Excel') };
            }
          };
          reader.readAsArrayBuffer(file);
        };

        const triggerBackup = () => {
          const data = {
            form: form.value,
            exportedAt: new Date().toISOString()
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = (form.value.docNo || 'Checkpoint') + '_Backup.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('Đã tải file sao lưu JSON');
        };

        const triggerRestore = () => document.getElementById('file_restore')?.click();

        const processRestoreFile = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const data = JSON.parse(evt.target.result);
              if (data.form) {
                form.value = { ...form.value, ...data.form };
                showToast('Phục hồi dữ liệu biểu mẫu thành công!');
              } else if (data.formState) {
                form.value.docNo = data.docNo || form.value.docNo;
                if (data.formState.inputs) {
                  const ins = data.formState.inputs;
                  if (ins.req_date) form.value.reqDate = ins.req_date;
                  if (ins.req_time) form.value.reqTime = ins.req_time;
                  if (ins.req_by) form.value.reqBy = ins.req_by;
                  if (ins.print_tech) form.value.printTech = ins.print_tech;
                  if (ins.machine_name) form.value.machineName = ins.machine_name;
                  if (ins.problem) form.value.problem = ins.problem;
                  if (ins.recv_by) form.value.recvBy = ins.recv_by;
                  if (ins.recv_date) form.value.recvDate = ins.recv_date;
                  if (ins.recv_time) form.value.recvTime = ins.recv_time;
                  if (ins.finish_date) form.value.finishDate = ins.finish_date;
                  if (ins.finish_time) form.value.finishTime = ins.finish_time;
                  if (ins.root_cause) form.value.rootCause = ins.root_cause;
                  if (ins.action_taken) form.value.actionTaken = ins.action_taken;
                  if (ins.work_order) form.value.workOrder = ins.work_order;
                  if (ins.prod_mgr) form.value.prodMgr = ins.prod_mgr;
                }
                showToast('Phục hồi dữ liệu biểu mẫu thành công!');
              }
            } catch (err) {
              showToast('Tệp không đúng định dạng', true);
            }
          };
          reader.readAsText(file);
          e.target.value = '';
        };

        const formatDisplayDate = (d) => {
          if (!d) return '—';
          const p = String(d).split('-');
          return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
        };

        const formatShortDate = (d) => {
          if (!d) return '';
          const p = String(d).split('-');
          return p.length === 3 ? p[2] + '/' + p[1] : d;
        };

        const toggleTheme = () => {
          setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        onMounted(() => {
          initForm();
          loadSession();
          if (isKpiActive.value && canViewKpi.value) {
            loadAllWeeklyData();
          }
          loadMachinesCatalog();
          loadEmployees();
          loadHistory();

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;

          // Support ?tab= parameter in URL
          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get('tab');
          if (tabParam) {
            switchTab(tabParam);
          }
        });

        return {
          activeTab,
          switchTab,
          selectMenuCard,
          isRequestActive,
          isKpiActive,
          canCreateRequest,
          canViewKpi,
          isAdmin,
          isAdminOrTech,
          canAccessControlPanel,
          userMenuOpen,
          currentTheme,
          currentUser,
          userInitials,
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
          toggleTheme,
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
          closeTimeModal,
          confirmTime,
          openPersonPicker,
          closePersonModal,
          confirmPerson,
          closeModal,
          onPickerDeptChange,
          onPickerAreaChange,
          openExcelUploader,
          closeExcelModal,
          processExcelFile,
          showTimeModal,
          showPersonModal,
          showExcelModal,
          hourOptions,
          minuteOptions,
          pickerHour,
          pickerMinute,
          setTimeToNow,
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
`;
