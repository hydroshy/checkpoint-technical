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
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
    [v-cloak] { display: none !important; }
    h1, h2, h3, h4, .brand-title {
      font-family: 'Host Grotesk', 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace !important;
    }

    /* Light Mode (Default) */
    html.theme-light body {
      background-color: #f8fafc;
      color: #0f172a;
    }
    .theme-light .glass-header {
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 1px solid #cbd5e1;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-sidebar {
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
    }
    .theme-light .input-box::placeholder {
      color: #64748b;
    }
    .theme-light .nav-item {
      color: #334155;
    }
    .theme-light .nav-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .theme-light .nav-item.active {
      background-color: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      border-left: 3px solid #0284c7;
    }

    /* Light Mode High Contrast Overrides */
    html.theme-light .text-slate-400 {
      color: #475569 !important;
    }
    html.theme-light .text-slate-500 {
      color: #334155 !important;
    }
    html.theme-light .text-sky-400 {
      color: #0284c7 !important;
    }
    html.theme-light .text-emerald-400 {
      color: #047857 !important;
    }
    html.theme-light .text-amber-400 {
      color: #b45309 !important;
    }
    html.theme-light .text-rose-400 {
      color: #be123c !important;
    }
    html.theme-light .text-purple-400 {
      color: #7e22ce !important;
    }
    html.theme-light .tabulator .btn-chain-view,
    html.theme-light .tabulator .btn-split-view {
      background-color: #f1f5f9 !important;
      color: #0284c7 !important;
      border: 1px solid #cbd5e1 !important;
    }
    html.theme-light .tabulator .btn-chain-view:hover,
    html.theme-light .tabulator .btn-split-view:hover {
      background-color: #e2e8f0 !important;
      color: #0369a1 !important;
    }
    html.theme-light .tabulator .btn-chain-assign {
      background-color: #fef3c7 !important;
      color: #b45309 !important;
      border: 1px solid #fcd34d !important;
    }
    html.theme-light .tabulator .btn-chain-assign:hover {
      background-color: #fde68a !important;
    }
    html.theme-light .tabulator .btn-chain-edit,
    html.theme-light .tabulator .btn-split-edit {
      background-color: #e0f2fe !important;
      color: #0369a1 !important;
      border: 1px solid #7dd3fc !important;
    }
    html.theme-light .tabulator .btn-chain-edit:hover,
    html.theme-light .tabulator .btn-split-edit:hover {
      background-color: #bae6fd !important;
      color: #0284c7 !important;
    }
    html.theme-light .tabulator .btn-chain-link {
      background-color: #f3e8ff !important;
      color: #7e22ce !important;
      border: 1px solid #d8b4fe !important;
    }
    html.theme-light .tabulator .btn-chain-link:hover {
      background-color: #e9d5ff !important;
      color: #6b21a8 !important;
    }
    html.theme-light .tabulator .btn-chain-del,
    html.theme-light .tabulator .btn-split-del {
      color: #e11d48 !important;
    }
    html.theme-light .tabulator .btn-chain-del:hover,
    html.theme-light .tabulator .btn-split-del:hover {
      background-color: #ffe4e6 !important;
    }

    /* Dark Mode */
    html.theme-dark body {
      background-color: #030712;
      color: #f1f5f9;
    }
    .theme-dark .glass-header {
      background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid #1e293b;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    .theme-dark .glass-sidebar {
      background: #0f172a;
      border-right: 1px solid #1e293b;
    }
    .theme-dark .glass-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #1e293b;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    .theme-dark .input-box {
      background-color: #020617;
      border-color: #334155;
      color: #f8fafc;
    }
    .theme-dark .input-box:focus {
      border-color: #38bdf8;
    }
    .theme-dark .nav-item {
      color: #94a3b8;
    }
    .theme-dark .nav-item:hover {
      background-color: #1e293b;
      color: #ffffff;
    }
    .theme-dark .nav-item.active {
      background-color: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      font-weight: 700;
    }

    /* Modals */
    .modal-overlay {
      transition: opacity 0.25s ease;
    }
    .modal-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      transform: translateY(0) scale(1);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-overlay.show .modal-content {
      transform: translateY(0) scale(1);
    }

    /* =========================================================================
       TABULATOR MODERN THEME OVERRIDES (LIGHT & DARK)
       ========================================================================= */
    .tabulator {
      border: 1px solid #cbd5e1;
      border-radius: 1rem;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.8125rem;
      background-color: #ffffff;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .tabulator .tabulator-header {
      background-color: #f1f5f9;
      border-bottom: 2px solid #cbd5e1;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      font-size: 0.6875rem;
      letter-spacing: 0.05em;
    }
    .tabulator .tabulator-header .tabulator-col {
      background-color: #f1f5f9;
      border-right: 1px solid #e2e8f0;
    }
    .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
      background-color: #e2e8f0;
      color: #0f172a;
    }
    .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
      padding: 11px 14px;
    }
    .tabulator .tabulator-row {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      color: #0f172a;
      transition: background-color 0.15s ease;
    }
    .tabulator .tabulator-row:hover {
      background-color: #f8fafc !important;
    }
    .tabulator .tabulator-row.tabulator-row-even {
      background-color: #f8fafc;
    }
    .tabulator .tabulator-row.tabulator-row-even:hover {
      background-color: #f1f5f9 !important;
    }
    .tabulator .tabulator-cell {
      padding: 11px 14px;
      border-right: 1px solid #e2e8f0;
      vertical-align: middle;
      color: #0f172a;
    }
    .tabulator .tabulator-footer {
      background-color: #ffffff;
      border-top: 1px solid #cbd5e1;
      padding: 10px 16px;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tabulator .tabulator-page-size {
      padding: 5px 10px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-size: 0.75rem;
      font-weight: 600;
      color: #0f172a;
      outline: none;
    }
    .tabulator button.tabulator-page {
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #1e293b;
      padding: 4px 10px;
      margin: 0 2px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tabulator button.tabulator-page:hover:not(:disabled) {
      background-color: #f1f5f9;
      color: #0f172a;
      border-color: #94a3b8;
    }
    .tabulator button.tabulator-page.active {
      background-color: #0284c7 !important;
      border-color: #0284c7 !important;
      color: #ffffff !important;
    }
    .tabulator button.tabulator-page:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .tabulator .tabulator-placeholder span {
      color: #64748b;
      font-size: 0.8125rem;
      font-style: italic;
    }

    /* Dark Mode Tabulator */
    html.theme-dark .tabulator {
      border-color: #1e293b;
      background-color: #0f172a;
      color: #f1f5f9;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    html.theme-dark .tabulator .tabulator-header {
      background-color: #0f172a;
      border-bottom: 1px solid #1e293b;
      color: #94a3b8;
    }
    html.theme-dark .tabulator .tabulator-header .tabulator-col {
      background-color: #0f172a;
      border-right: 1px solid #1e293b;
    }
    html.theme-dark .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
      background-color: #1e293b;
    }
    html.theme-dark .tabulator .tabulator-row {
      background-color: #0f172a;
      border-bottom: 1px solid #1e293b;
      color: #f1f5f9;
    }
    html.theme-dark .tabulator .tabulator-row:hover {
      background-color: #1e293b !important;
    }
    html.theme-dark .tabulator .tabulator-row.tabulator-row-even {
      background-color: #0f172a;
    }
    html.theme-dark .tabulator .tabulator-cell {
      border-right: 1px solid #1e293b;
    }
    html.theme-dark .tabulator .tabulator-footer {
      background-color: #0f172a;
      border-top: 1px solid #1e293b;
      color: #94a3b8;
    }
    html.theme-dark .tabulator .tabulator-page-size {
      background: #0f172a;
      border-color: #334155;
      color: #f8fafc;
    }
    html.theme-dark .tabulator button.tabulator-page {
      border-color: #334155;
      background: #1e293b;
      color: #e2e8f0;
    }
    html.theme-dark .tabulator button.tabulator-page:hover:not(:disabled) {
      background-color: #334155;
      color: #ffffff;
    }
    html.theme-dark .tabulator button.tabulator-page.active {
      background-color: #38bdf8 !important;
      border-color: #38bdf8 !important;
      color: #0f172a !important;
    }
    html.theme-dark .tabulator .btn-chain-edit,
    html.theme-dark .tabulator .btn-split-edit {
      background-color: rgba(14, 165, 233, 0.15) !important;
      color: #38bdf8 !important;
      border: 1px solid rgba(14, 165, 233, 0.3) !important;
    }
    html.theme-dark .tabulator .btn-chain-edit:hover,
    html.theme-dark .tabulator .btn-split-edit:hover {
      background-color: rgba(14, 165, 233, 0.25) !important;
      color: #7dd3fc !important;
    }
    html.theme-dark .tabulator .btn-chain-link {
      background-color: rgba(168, 85, 247, 0.15) !important;
      color: #c084fc !important;
      border: 1px solid rgba(168, 85, 247, 0.3) !important;
    }
    html.theme-dark .tabulator .btn-chain-link:hover {
      background-color: rgba(168, 85, 247, 0.25) !important;
      color: #e9d5ff !important;
    }
    html.theme-dark .tabulator .btn-chain-del,
    html.theme-dark .tabulator .btn-split-del {
      color: #f43f5e !important;
    }
    html.theme-dark .tabulator .btn-chain-del:hover,
    html.theme-dark .tabulator .btn-split-del:hover {
      background-color: rgba(244, 63, 94, 0.15) !important;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">
  <div id="app" v-cloak class="flex-1 flex flex-col min-h-screen" @click="handleGlobalClick">
    
    <!-- TOP APP BAR -->
    <header class="glass-header sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Left Brand & Navigation -->
      <div class="flex items-center gap-3">
        <!-- Logo Button -->
        <a href="/control-panel" class="flex items-center gap-2.5 text-inherit font-extrabold text-sm tracking-tight text-decoration-none">
          <div class="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-1 shadow-inner overflow-hidden">
            <img src="/images/logo-navbar.png?v=3" onerror="this.onerror=null; this.src='/images/logo-login.png?v=3'; this.onerror=function(){this.src='/images/favicon.png?v=3';};" class="w-full h-full object-contain rounded-lg" alt="Checkpoint Systems Logo" />
          </div>
          <div class="leading-none text-left">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-extrabold text-slate-900 dark:text-white"><span class="text-sky-500">Checkpoint</span> Systems</span>
            </div>
            <span class="text-[11px] text-sky-600 dark:text-sky-400 font-bold">Quản Lý Phiếu Kỹ Thuật</span>
          </div>
        </a>

        <!-- Mobile Sidebar Toggle Button -->
        <button @click="sidebarOpen = !sidebarOpen" class="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer">
          <i class="fa-solid fa-bars text-sm"></i>
        </button>

        <!-- Desktop Sidebar Collapse Toggle Button -->
        <button
          type="button"
          @click="sidebarCollapsed = !sidebarCollapsed"
          class="hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition cursor-pointer"
          :title="sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'"
        >
          <i class="fa-solid text-xs" :class="sidebarCollapsed ? 'fa-bars text-sky-500' : 'fa-bars'"></i>
        </button>

        <!-- Breadcrumb Indicator with convenient Back to Dashboard -->
        <div class="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <a href="/dashboard" class="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition" title="Quay lại Dashboard">
            <i class="fa-solid fa-gauge-high"></i> Dashboard
          </a>
          <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
          <span class="text-sky-600 dark:text-sky-400 font-bold capitalize">Quản Lý Phiếu Kỹ Thuật</span>
        </div>
      </div>

      <!-- Right User Menu & Portal Links -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <!-- Quick 1-Click Theme Toggle Button -->
        <button
          type="button"
          @click="toggleTheme"
          class="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          :title="currentTheme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'"
        >
          <i :class="currentTheme === 'dark' ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-sky-500'" class="text-xs"></i>
        </button>

        <!-- Swagger Docs Link (Admin Only) -->
        <a
          v-if="currentUser?.role === 'ADMIN' || currentUser?.username === 'admin'"
          href="/api/docs"
          target="_blank"
          class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 transition"
          title="Tài liệu API Swagger"
        >
          <i class="fa-solid fa-book text-sky-500"></i>
          <span>API Docs</span>
        </a>

        <!-- Convenient Back to Dashboard Button -->
        <a
          href="/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 transition shadow-sm"
          title="Quay lại giao diện Dashboard"
        >
          <i class="fa-solid fa-gauge-high text-sky-500"></i>
          <span class="hidden sm:inline">Quay lại Dashboard</span>
        </a>

        <!-- User Menu Dropdown Button -->
        <div class="relative">
          <button
            @click.stop="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer select-none"
          >
            <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
              {{ userInitials }}
            </div>
            <span class="text-xs font-bold hidden sm:inline">{{ currentUser.fullName || currentUser.username || 'Quản trị' }}</span>
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
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {{ currentUser.role || currentUser.userType || 'ADMIN' }}
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

            <!-- Switch View & Portal Links -->
            <div class="space-y-1 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <a
                href="/dashboard"
                class="w-full py-2 px-3 rounded-lg text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-sky-200 dark:border-sky-500/20 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-gauge-high text-sky-500"></i> Quay lại Dashboard</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
              <a
                v-if="currentUser?.role === 'ADMIN' || currentUser?.username === 'admin'"
                href="/api/docs"
                target="_blank"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-book text-sky-500"></i> Swagger API Docs</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
              </a>
              <div class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span class="flex items-center gap-2"><i class="fa-solid fa-sliders"></i> Quản Lý Phiếu Kỹ Thuật</span>
                <span class="text-[9px] font-mono font-bold uppercase bg-amber-500/20 px-1.5 py-0.5 rounded">Active</span>
              </div>
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

    <!-- WORKSPACE: SIDEBAR + MAIN -->
    <div class="flex-1 flex overflow-hidden">

      <!-- MOBILE BACKDROP -->
      <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-slate-950/70 z-30 md:hidden backdrop-blur-sm"></div>

      <!-- LEFT SIDEBAR NAVIGATION: RESTRUCTURED 4 CORE GROUPS -->
      <aside
        :class="[
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          sidebarCollapsed ? 'md:w-0 md:p-0 md:border-r-0 md:overflow-hidden md:opacity-0' : 'md:w-60 p-3.5'
        ]"
        class="fixed md:static inset-y-0 left-0 z-30 glass-sidebar flex flex-col justify-between transition-all duration-200 ease-in-out md:flex-shrink-0 mt-14 md:mt-0"
      >
        <div class="space-y-4 overflow-y-auto flex-1">
          <!-- Back to Dashboard Quick Action -->
          <a
            href="/dashboard"
            class="w-full py-2.5 px-3 mb-2 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-sky-200 dark:border-sky-500/20 transition flex items-center justify-between group shadow-xs"
            title="Quay lại giao diện Dashboard"
          >
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-arrow-left text-sky-500 group-hover:-translate-x-0.5 transition-transform"></i>
              <span>Quay lại Dashboard</span>
            </span>
            <i class="fa-solid fa-gauge-high text-[11px] text-sky-400"></i>
          </a>

          <!-- SIDEBAR NAVIGATION MENU (Streamlined: Only Quản lý phiếu kỹ thuật) -->
          <div class="space-y-1.5">
            <button
              @click="switchTab('requests')"
              :class="{ active: activeTab === 'requests' }"
              class="nav-item w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-table-list w-4 text-center text-xs text-sky-500"></i>
              <span class="truncate">Quản lý phiếu kỹ thuật</span>
            </button>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div class="flex justify-between">
            <span>Dự án:</span>
            <span class="font-bold text-slate-700 dark:text-slate-200">Checkpoint Systems</span>
          </div>
          <div class="flex justify-between">
            <span>Hệ thống:</span>
            <span class="font-semibold text-sky-500">Quản Lý Phiếu Kỹ Thuật</span>
          </div>
          <div class="flex justify-between">
            <span>Data Grid:</span>
            <span class="font-mono text-emerald-500">Tabulator v6</span>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <!-- =====================================================================
             VIEW 1: OVERVIEW HUB & ANALYTICS (QUẢN TRỊ CHI TIẾT)
             ===================================================================== -->
        <div v-show="activeTab === 'overview'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Tổng Quan Vận Hành & Phân Tích Sự Cố</h1>
              <p class="text-xs text-slate-500">Thống kê chỉ số Downtime, nguyên nhân 4M, nhóm công đoạn và chất lượng bàn giao</p>
            </div>
            <button
              @click="loadStats"
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate"></i> Cập nhật số liệu
            </button>
          </div>

          <!-- Public Form Sharing Card (Admin Control Panel) -->
          <div class="glass-card rounded-2xl p-5 border border-sky-500/20 bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-purple-500/5 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xl text-sky-500 shadow-sm">
                  <i class="fa-solid fa-share-nodes"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2.5 flex-wrap">
                    <h3 class="text-base font-bold tracking-tight">Chia Sẻ Form Yêu Cầu Kỹ Thuật (Public Form)</h3>
                    <span
                      class="text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border transition"
                      :class="isPublicFormEnabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'"
                    >
                      <i class="fa-solid fa-circle text-[7px] mr-1" :class="isPublicFormEnabled ? 'text-emerald-500 animate-pulse' : 'text-slate-400'"></i>
                      {{ isPublicFormEnabled ? 'ĐANG BẬT (CÔNG KHAI)' : 'ĐANG TẮT (NỘI BỘ)' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Khi bật, nhân viên xưởng hoặc các bên liên quan có thể truy cập <b>/form-request</b> và gửi phiếu trực tiếp mà không cần đăng nhập tài khoản.
                  </p>
                </div>
              </div>

              <!-- Switch Toggle Button -->
              <div class="flex items-center gap-3 self-end sm:self-center bg-white/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span class="text-xs font-bold" :class="isPublicFormEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  {{ isPublicFormEnabled ? 'Đang mở' : 'Đang đóng' }}
                </span>
                <button
                  type="button"
                  @click="togglePublicForm"
                  :disabled="togglingPublicForm"
                  :title="isPublicFormEnabled ? 'Nhấn để tắt form công khai' : 'Nhấn để bật form công khai'"
                  class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 select-none"
                  :class="isPublicFormEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"
                    :class="isPublicFormEnabled ? 'translate-x-6' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- Public Link & Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div class="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-hidden shadow-inner">
                <i class="fa-solid fa-link text-sky-500 text-xs flex-shrink-0"></i>
                <span class="truncate select-all font-semibold">{{ publicFormUrl }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="copyPublicFormLink"
                  class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <i :class="copySuccess ? 'fa-solid fa-check text-emerald-300' : 'fa-regular fa-copy'"></i>
                  <span>{{ copySuccess ? 'Đã sao chép!' : 'Sao chép link' }}</span>
                </button>
                <a
                  :href="publicFormUrl"
                  target="_blank"
                  class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  title="Mở biểu mẫu công khai trong tab mới"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs text-sky-500"></i>
                  <span>Mở form</span>
                </a>
              </div>
            </div>
          </div>

          <!-- KPI Cards -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Phiếu Yêu Cầu</div>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ stats.total || 0 }}</div>
              <div class="text-[11px] text-slate-500">Toàn bộ phiếu trên hệ thống</div>
            </div>

            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đã Khắc Phục (DONE)</div>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ stats.done || 0 }}</div>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {{ stats.total ? Math.round((stats.done / stats.total) * 100) : 0 }}% tỷ lệ giải quyết
              </div>
            </div>

            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Theo Dõi & Cần Hỗ Trợ</div>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500">{{ (stats.monitor || 0) + (stats.support || 0) }}</div>
              <div class="text-[11px] text-slate-500">{{ stats.monitor || 0 }} theo dõi | {{ stats.support || 0 }} cần hỗ trợ</div>
            </div>

            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Thời Gian Dừng</div>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-red-500">{{ stats.totalDowntimeMinutes || 0 }} <span class="text-xs font-normal">phút</span></div>
              <div class="text-[11px] text-slate-500">TB: {{ stats.avgDowntimeMinutes || 0 }} phút / sự cố</div>
            </div>

            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2 col-span-2 sm:col-span-1">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">% Phế Phẩm Bình Quân</div>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">{{ stats.avgWastePercent || 0 }}%</div>
              <div class="text-[11px] text-slate-500">Theo sản lượng Work Order</div>
            </div>
          </div>

          <!-- Analytical Breakdown Cards -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 4M Analysis -->
            <div class="glass-card rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-diagram-project text-purple-500"></i> Phân Loại Nguyên Nhân Sự Cố (4M)
                </h3>
                <span class="text-xs font-mono text-slate-400">Total: {{ stats.total || 0 }}</span>
              </div>
              <div class="space-y-3">
                <div v-for="(val, key) in (stats.errCatDistribution || {})" :key="key" class="space-y-1">
                  <div class="flex justify-between text-xs font-semibold">
                    <span>{{ get4MLabel(key) }}</span>
                    <span class="font-mono">{{ val }} ({{ getPercent(val, stats.total) }}%)</span>
                  </div>
                  <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" :style="{ width: getPercent(val, stats.total) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Printing Technology Breakdown -->
            <div class="glass-card rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-print text-sky-500"></i> Sự Cố Theo Công Nghệ In
                </h3>
              </div>
              <div class="space-y-3">
                <div v-if="!stats.techDistribution || Object.keys(stats.techDistribution).length === 0" class="text-xs text-slate-400 italic py-4 text-center">Chưa có dữ liệu sự cố</div>
                <div v-for="(val, key) in (stats.techDistribution || {})" :key="key" class="space-y-1">
                  <div class="flex justify-between text-xs font-semibold">
                    <span>{{ key }}</span>
                    <span class="font-mono">{{ val }} ({{ getPercent(val, stats.total) }}%)</span>
                  </div>
                  <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full transition-all duration-500" :style="{ width: getPercent(val, stats.total) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Process Stage Breakdown -->
            <div class="glass-card rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-layer-group text-emerald-500"></i> Sự Cố Theo Nhóm Công Đoạn
                </h3>
              </div>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div class="text-[11px] text-slate-500 font-bold">Trước in (Prepress)</div>
                  <div class="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{{ stats.errTypeDistribution?.Prepress || 0 }}</div>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div class="text-[11px] text-slate-500 font-bold">Trong in (Press)</div>
                  <div class="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">{{ stats.errTypeDistribution?.Press || 0 }}</div>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div class="text-[11px] text-slate-500 font-bold">Sau in (PostPress)</div>
                  <div class="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{{ stats.errTypeDistribution?.PostPress || 0 }}</div>
                </div>
              </div>
            </div>

            <!-- Top Problem Machines -->
            <div class="glass-card rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Top Máy Phát Sinh Sự Cố Nhiều Nhất
                </h3>
              </div>
              <div v-if="!stats.topMachines || stats.topMachines.length === 0" class="text-xs text-slate-400 italic py-4 text-center">Chưa có dữ liệu sự cố</div>
              <div v-else class="space-y-2">
                <div v-for="(m, i) in stats.topMachines" :key="m.machine" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div class="flex items-center gap-2.5 font-bold">
                    <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-mono">{{ i + 1 }}</span>
                    <span>{{ m.machine }}</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                    {{ m.count }} lần
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 1.5: MODULE PHÂN CÔNG KỸ THUẬT (ASSIGN TASK - CARDS VIEW)
             ===================================================================== -->
        <div v-show="activeTab === 'assign-tasks'" class="space-y-5">
          <!-- Top bar -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight flex items-center gap-2">
                <i class="fa-solid fa-list-check text-amber-500"></i>
                <span>Phân Công Kỹ Thuật (Assign Task)</span>
              </h1>
              <p class="text-xs text-slate-500">Giao diện thẻ (Cards) phân công nhân viên xử lý sự cố CPS và theo dõi thời hạn xử lý</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="loadCpsData"
                class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-arrows-rotate"></i> Làm mới
              </button>
              <button
                @click="switchTab('requests')"
                class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <i class="fa-solid fa-table"></i> Xem Dạng Bảng (Tabulator)
              </button>
            </div>
          </div>

          <!-- Status KPI Counter Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div
              @click="assignCardStatus = 'ALL'"
              :class="assignCardStatus === 'ALL' ? 'ring-2 ring-sky-500 bg-sky-500/10' : 'bg-slate-900/40 hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-slate-700/60 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tất Cả CPS</span>
              <span class="font-mono text-xl font-extrabold text-slate-100">{{ cpsList.length }}</span>
            </div>
            <div
              @click="assignCardStatus = 'TO_ASSIGN'"
              :class="assignCardStatus === 'TO_ASSIGN' ? 'ring-2 ring-amber-500 bg-amber-500/10' : 'bg-slate-900/40 hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-amber-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Chờ Phân Công</span>
              <span class="font-mono text-xl font-extrabold text-amber-400">{{ cpsCountByStatus('TO_ASSIGN') }}</span>
            </div>
            <div
              @click="assignCardStatus = 'IN_PROGRESS'"
              :class="assignCardStatus === 'IN_PROGRESS' ? 'ring-2 ring-sky-500 bg-sky-500/10' : 'bg-slate-900/40 hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-sky-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">Đang Xử Lý</span>
              <span class="font-mono text-xl font-extrabold text-sky-400">{{ cpsCountByStatus('IN_PROGRESS') }}</span>
            </div>
            <div
              @click="assignCardStatus = 'OVER_DUE'"
              :class="assignCardStatus === 'OVER_DUE' ? 'ring-2 ring-rose-500 bg-rose-500/10' : 'bg-slate-900/40 hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-rose-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Quá Hạn</span>
              <span class="font-mono text-xl font-extrabold text-rose-400">{{ cpsCountByStatus('OVER_DUE') }}</span>
            </div>
            <div
              @click="assignCardStatus = 'CLOSED'"
              :class="assignCardStatus === 'CLOSED' ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : 'bg-slate-900/40 hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-emerald-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Đã Đóng</span>
              <span class="font-mono text-xl font-extrabold text-emerald-400">{{ cpsCountByStatus('CLOSED') }}</span>
            </div>
          </div>

          <!-- Filter Toolbar for Cards -->
          <div class="glass-card rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                v-model="assignCardSearch"
                placeholder="🔍 Tìm kiếm mã CPS, tên máy, sự cố, người yêu cầu, nhân viên phụ trách..."
                class="input-box w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none"
              />
            </div>
            <div class="flex items-center gap-2">
              <select
                v-model="assignCardStatus"
                class="input-box px-3 py-2 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="ALL">— Tất cả trạng thái —</option>
                <option value="TO_ASSIGN">⏳ Chờ phân công (TO_ASSIGN)</option>
                <option value="IN_PROGRESS">⚡ Đang xử lý (IN_PROGRESS)</option>
                <option value="OVER_DUE">⚠️ Quá hạn (OVER_DUE)</option>
                <option value="CLOSED">✅ Đã đóng (CLOSED)</option>
                <option value="OPEN_TASK">📋 Mở (OPEN_TASK)</option>
              </select>
              <span class="text-xs text-slate-400 font-mono whitespace-nowrap pl-1">
                Hiển thị: <b class="text-sky-400">{{ filteredCpsCards.length }}</b> / {{ cpsList.length }}
              </span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredCpsCards.length === 0" class="glass-card rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <i class="fa-solid fa-clipboard-check text-4xl text-slate-500"></i>
            <p class="text-sm font-semibold text-slate-300">Không có phiếu CPS nào phù hợp với bộ lọc</p>
            <p class="text-xs text-slate-500">Thử xóa bộ lọc tìm kiếm hoặc bấm Làm mới dữ liệu</p>
          </div>

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="(item, index) in filteredCpsCards"
              :key="item.docNo || item.id || ('cps-' + index)"
              @click="openAssignModal(item)"
              class="glass-card rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer border flex flex-col justify-between group"
              :class="getCardBorderClass(item?.status)"
            >
              <!-- Card Top -->
              <div>
                <div class="flex items-center justify-between gap-2 mb-2.5">
                  <span class="font-mono text-xs font-extrabold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {{ item.docNo || ('CPS-' + (item.cpsrDocNo ? String(item.cpsrDocNo).replace('CPSR-', '') : (item.cpsr?.docNo ? String(item.cpsr.docNo).replace('CPSR-', '') : String(item.id || '').substring(0,8)))) }}
                  </span>
                  <div class="flex items-center gap-1.5">
                    <span :class="getStatusBadgeClass(item?.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                      {{ formatCpsStatus(item?.status) }}
                    </span>
                    <button
                      type="button"
                      @click.stop="deleteCpsRecord(item)"
                      class="text-slate-400 hover:text-rose-500 transition p-1 cursor-pointer"
                      title="Xóa phiếu CPS này"
                    >
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>

                <!-- Machine & Print Tech -->
                <div class="space-y-1.5 mb-2.5">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <i class="fa-solid fa-print text-indigo-400 text-[11px]"></i>
                    <span class="truncate">{{ item.machineName || item.cpsr?.machineName || 'Chưa xác định máy' }}</span>
                    <span v-if="item.printTech || item.cpsr?.printTech" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {{ item.printTech || item.cpsr?.printTech }}
                    </span>
                  </div>
                  <!-- Problem summary -->
                  <p class="text-xs text-slate-300 line-clamp-2 bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 min-h-[38px]">
                    {{ item.problem || item.cpsr?.problem || 'Không có mô tả sự cố' }}
                  </p>
                </div>

                <!-- Requester & Time -->
                <div class="text-[11px] text-slate-400 space-y-1 mb-2.5">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Người YC:</span>
                    <span class="text-slate-300 font-medium truncate max-w-[150px]">{{ item.reqBy || item.cpsr?.reqBy || '-' }}</span>
                  </div>
                  <div class="flex items-center justify-between font-mono text-[10px]">
                    <span class="text-slate-500">Thời gian:</span>
                    <span class="text-slate-400">{{ (item.reqDate || item.cpsr?.reqDate || '') + ' ' + (item.reqTime || item.cpsr?.reqTime || '') }}</span>
                  </div>
                  <div v-if="item.priority || item.cpsr?.priority" class="flex items-center justify-between">
                    <span class="text-slate-500">Ưu tiên:</span>
                    <span :class="(item.priority || item.cpsr?.priority) === 'Hỗ trợ ngay' ? 'text-rose-400 font-bold' : 'text-amber-400 font-medium'">
                      {{ item.priority || item.cpsr?.priority }}
                    </span>
                  </div>
                </div>

                <!-- Linkage Tags -->
                <div class="flex items-center gap-1 text-[9px] font-mono text-slate-400 mb-2.5 flex-wrap">
                  <span class="px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-300">
                    R: {{ item.cpsrDocNo || item.cpsr?.docNo || '-' }}
                  </span>
                  <span class="px-1.5 py-0.5 rounded border" :class="item.cpstDocNo || item.cpst?.docNo ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'">
                    T: {{ item.cpstDocNo || item.cpst?.docNo || 'None' }}
                  </span>
                  <span class="px-1.5 py-0.5 rounded border" :class="item.cpsfDocNo || item.cpsf?.docNo ? 'bg-purple-950/60 border-purple-800/40 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-600'">
                    F: {{ item.cpsfDocNo || item.cpsf?.docNo || 'None' }}
                  </span>
                </div>

                <!-- Metrics (Downtime & Scrap Rate) -->
                <div v-if="(item.downtime != null && item.downtime > 0) || item.wastePercent" class="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800 mb-2.5">
                  <div>
                    <span class="text-slate-500 block text-[9px]">Downtime</span>
                    <span class="text-amber-400 font-bold">{{ item.downtime }} phút</span>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[9px]">Tỉ lệ phế</span>
                    <span class="text-rose-400 font-bold">{{ item.wastePercent || '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Bottom: Assignee & Action -->
              <div class="pt-2.5 border-t border-slate-700/60">
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <span class="text-slate-400 text-[11px]">KTV:</span>
                  <span v-if="item.assignedTo" class="font-semibold text-emerald-400 truncate max-w-[150px] flex items-center gap-1">
                    <i class="fa-solid fa-user-check text-[10px]"></i> {{ item.assignedTo }}
                  </span>
                  <span v-else class="text-amber-400/80 italic text-[11px] flex items-center gap-1">
                    <i class="fa-regular fa-clock text-[10px]"></i> Chưa giao
                  </span>
                </div>

                <div v-if="item.deadline" class="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                  <span class="text-slate-500 text-[10px]">Deadline:</span>
                  <span class="text-sky-300 text-[10px]">{{ formatDateTimeDisplay(item.deadline) }}</span>
                </div>

                <!-- Action Buttons: Assign, Edit, Link -->
                <div class="grid grid-cols-4 gap-1.5 mt-2" @click.stop>
                  <button
                    type="button"
                    @click.stop="openAssignModal(item)"
                    class="col-span-2 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    :class="item.status === 'TO_ASSIGN' || !item.assignedTo ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'"
                    title="Phân công nhân viên kỹ thuật"
                  >
                    <i class="fa-solid fa-user-gear text-[11px]"></i>
                    <span class="truncate">{{ item.status === 'TO_ASSIGN' || !item.assignedTo ? 'Phân công' : 'Đổi KTV' }}</span>
                  </button>
                  <button
                    type="button"
                    @click.stop="openEditModal('cps', item)"
                    class="py-1.5 px-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    title="Chỉnh sửa phiếu CPS"
                  >
                    <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                    <span>Sửa</span>
                  </button>
                  <button
                    type="button"
                    @click.stop="openLinkModal(item)"
                    class="py-1.5 px-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    title="Ghép nối với CPST/CPSF"
                  >
                    <i class="fa-solid fa-link text-[11px]"></i>
                    <span>Ghép</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 2: REQUESTS MASTER MANAGEMENT (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'requests'" class="space-y-5">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Quản Lý Phiếu Kỹ Thuật</h1>
              <p class="text-xs text-slate-600 dark:text-slate-400">Quản lý 3 form độc lập (CPSR • CPST • CPSF) và chuỗi liên kết 1-1-1 qua bảng dữ liệu Tabulator v6</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a
                href="/form-request"
                target="_blank"
                class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Mở form tạo phiếu CPSR"
              >
                <i class="fa-solid fa-file-circle-plus"></i> + Form CPSR
              </a>
              <a
                href="/technical-feedback"
                target="_blank"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Mở form phản hồi kỹ thuật CPST"
              >
                <i class="fa-solid fa-screwdriver-wrench"></i> + Form CPST
              </a>
              <a
                href="/confirm-request"
                target="_blank"
                class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Mở form nghiệm thu bàn giao CPSF"
              >
                <i class="fa-solid fa-circle-check"></i> + Form CPSF
              </a>
              <button
                type="button"
                @click="openCreateCpsModal"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Tạo mới phiếu CPS (Bắt buộc chọn CPSR)"
              >
                <i class="fa-solid fa-plus"></i> + Tạo Phiếu CPS
              </button>
              <button
                type="button"
                @click="openLinkModal()"
                class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Ghép nối chuỗi tiến trình CPS với CPST và CPSF"
              >
                <i class="fa-solid fa-link"></i> 🔗 Ghép Nối Phiếu
              </button>
              <button
                @click="exportCurrentTabExcel"
                class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- Split Forms Sub-Tab Switcher & Tabulator Form Actions -->
          <div class="glass-card rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                @click="switchSplitTab('chain')"
                :class="splitTab === 'chain' ? 'bg-sky-600 text-white font-bold shadow' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                🔗 Phiếu CPS (Chuỗi 1-1-1)
              </button>
              <button
                @click="switchSplitTab('cpsr')"
                :class="splitTab === 'cpsr' ? 'bg-sky-600 text-white font-bold shadow' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                1. Phiếu Yêu Cầu (CPSR)
              </button>
              <button
                @click="switchSplitTab('cpst')"
                :class="splitTab === 'cpst' ? 'bg-sky-600 text-white font-bold shadow' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                2. Phản Hồi KT (CPST)
              </button>
              <button
                @click="switchSplitTab('cpsf')"
                :class="splitTab === 'cpsf' ? 'bg-sky-600 text-white font-bold shadow' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                3. Bàn Giao (CPSF)
              </button>
              <button
                @click="switchSplitTab('legacy')"
                :class="splitTab === 'legacy' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-700 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'"
                class="px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Dữ Liệu Cũ
              </button>
            </div>

            <!-- Form Action Buttons Directly on Tabulator Bar -->
            <div class="flex flex-wrap items-center gap-1.5">
              <a
                href="/form-request"
                target="_blank"
                class="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Mở biểu mẫu tạo mới phiếu yêu cầu kỹ thuật CPSR"
              >
                <i class="fa-solid fa-file-circle-plus"></i> + CPSR
              </a>
              <a
                href="/technical-feedback"
                target="_blank"
                class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Mở biểu mẫu phản hồi kỹ thuật CPST"
              >
                <i class="fa-solid fa-screwdriver-wrench"></i> + CPST
              </a>
              <a
                href="/confirm-request"
                target="_blank"
                class="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Mở biểu mẫu nghiệm thu & bàn giao CPSF"
              >
                <i class="fa-solid fa-circle-check"></i> + CPSF
              </a>
              <button
                type="button"
                @click="openCreateCpsModal"
                class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Tạo mới phiếu CPS (Bắt buộc chọn CPSR)"
              >
                <i class="fa-solid fa-plus"></i> + Tạo CPS
              </button>
              <button
                type="button"
                @click="openLinkModal()"
                class="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Ghép nối chuỗi tiến trình CPS"
              >
                <i class="fa-solid fa-link"></i> Ghép Nối
              </button>
            </div>
          </div>

          <!-- Filter Toolbar for Tabulator -->
          <div v-show="splitTab !== 'legacy'" class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              v-model="splitFilter.search"
              @input="applySplitFilters"
              placeholder="🔍 Tìm kiếm mã phiếu, người yêu cầu, KTV, thiết bị..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none"
            />
            <select v-model="splitFilter.status" @change="applySplitFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả trạng thái / tiến độ —</option>
              <template v-if="splitTab === 'chain'">
                <option value="TO_ASSIGN">⏳ Chờ phân công (TO_ASSIGN)</option>
                <option value="IN_PROGRESS">⚡ Đang xử lý (IN_PROGRESS)</option>
                <option value="OVER_DUE">⚠️ Quá hạn (OVER_DUE)</option>
                <option value="CLOSED">✅ Đã đóng (CLOSED)</option>
                <option value="OPEN_TASK">📋 Mở (OPEN_TASK)</option>
                <option value="3/3">🟢 Hoàn tất chuỗi (3/3)</option>
                <option value="2/3">🟡 Đang xử lý / Phản hồi (2/3)</option>
                <option value="1/3">🔵 Yêu cầu mới (1/3)</option>
              </template>
              <option v-if="splitTab === 'cpsr'" value="Hàng SX lần đầu">Hàng SX lần đầu</option>
              <option v-if="splitTab === 'cpsr'" value="Hàng SX nhiều lần">Hàng SX nhiều lần</option>
              <option v-if="splitTab === 'cpst'" value="Đã khắc phục">🟢 Đã khắc phục</option>
              <option v-if="splitTab === 'cpst'" value="Theo dõi thêm">🟡 Theo dõi thêm</option>
              <option v-if="splitTab === 'cpst'" value="Hư hỏng nặng">🔴 Hư hỏng nặng</option>
              <option v-if="splitTab === 'cpsf'" value="Đạt">🟢 Đạt</option>
              <option v-if="splitTab === 'cpsf'" value="Chưa đạt">🔴 Chưa đạt</option>
            </select>
            <div class="flex items-center justify-end text-xs text-slate-600 dark:text-slate-400 font-mono">
              Tổng cộng: <span class="text-sky-600 dark:text-sky-400 font-bold ml-1.5">{{ currentSplitCount }}</span> bản ghi
            </div>
          </div>

          <div v-show="splitTab === 'legacy'" class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              v-model="reqFilter.search"
              @input="applyReqFilters"
              placeholder="🔍 Tìm mã phiếu, tên máy, người yêu cầu, lỗi..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none"
            />
            <select v-model="reqFilter.chkStatus" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="Open">🔵 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Overdue">🔴 Overdue</option>
              <option value="Closed">🟢 Closed</option>
            </select>
            <select v-model="reqFilter.printTech" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả công nghệ in —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
            <select v-model="reqFilter.priority" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả mức ưu tiên —</option>
              <option value="Immediate">🔴 Hỗ trợ ngay (Immediate)</option>
              <option value="Hold">🟡 Chạy tạm (Hold)</option>
              <option value="Other">📌 Khác</option>
            </select>
          </div>

          <!-- Tabulator Containers -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div v-show="splitTab !== 'legacy'" id="tabulator-split-forms"></div>
            <div v-show="splitTab === 'legacy'" id="tabulator-requests"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 3: MACHINES & PRINTING TECHNOLOGIES (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'machines'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Mục Công Nghệ In & Máy Móc</h1>
              <p class="text-xs text-slate-500">Quản lý danh mục các loại máy in theo từng công nghệ với Tabulator.js</p>
            </div>
            <button
              @click="openAddMachineModal"
              class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Máy Mới
            </button>
          </div>

          <!-- Filter Toolbar for Machines -->
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              v-model="machineSearch"
              @input="applyMachineFilters"
              placeholder="🔍 Tìm kiếm máy theo tên, mã máy hoặc công nghệ..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
            />
            <select v-model="machineTechFilter" @change="applyMachineFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60 cursor-pointer">
              <option value="ALL">— Tất cả công nghệ —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
          </div>

          <!-- Tabulator Container for Machines -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-machines"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 4: EMPLOYEES & PERSONNEL (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'employees'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Sách Nhân Sự & Phân Xưởng</h1>
              <p class="text-xs text-slate-500">Quản lý nhân sự toàn nhà máy hiển thị qua bảng dữ liệu Tabulator</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="openAddEmployeeModal"
                class="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-user-plus"></i> Thêm Nhân Viên
              </button>
              <button
                @click="openExcelUploader"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Nạp Excel
              </button>
              <button
                @click="exportEmployeesExcel"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-download"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- Filter Toolbar for Employees -->
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              v-model="empSearch"
              @input="applyEmpFilters"
              placeholder="🔍 Tìm kiếm nhân viên theo tên hoặc mã NV..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
            />
            <select v-model="empDeptFilter" @change="applyEmpFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60 cursor-pointer">
              <option value="ALL">— Tất cả bộ phận —</option>
              <option v-for="d in distinctDepts" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <!-- Tabulator Container for Employees -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-employees"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 5: USER ACCOUNTS & SECURITY (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'users'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Quản Lý User & Phân Quyền</h1>
              <p class="text-xs text-slate-500">Phân quyền tài khoản trực tiếp qua bảng Tabulator (ADMIN, TECHNICIAN, EMPLOYEE)</p>
            </div>
            <button
              @click="openAddUserModal"
              class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <i class="fa-solid fa-user-plus"></i> Thêm Tài Khoản
            </button>
          </div>

          <!-- Filter Toolbar for Users -->
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              v-model="userSearch"
              @input="applyUserFilters"
              placeholder="🔍 Tìm kiếm tài khoản theo username, họ tên hoặc email..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
            />
            <select v-model="userRoleFilter" @change="applyUserFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60 cursor-pointer">
              <option value="ALL">— Tất cả vai trò —</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
              <option value="TECHNICIAN">TECHNICIAN (Kỹ thuật viên)</option>
              <option value="EMPLOYEE">EMPLOYEE (Nhân viên)</option>
            </select>
          </div>

          <!-- Tabulator Container for Users -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-users"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 6: EXISTING DATA & DATA MANAGEMENT (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'existing-data'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Quản Lý Dữ Liệu Hiện Có</h1>
              <p class="text-xs text-slate-500">Tra cứu, quản lý các bảng dữ liệu kỹ thuật và báo cáo vận hành với Tabulator.js</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="loadCurrentDataset"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-arrows-rotate"></i> Tải lại
              </button>
              <button
                @click="exportCurrentDatasetExcel"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel Tập Này
              </button>
            </div>
          </div>

          <!-- KPI Summary Cards for Existing Datasets -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              @click="switchDataset('weekly-requests')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-sky-500/50 transition"
              :class="{ 'ring-2 ring-sky-500/40 bg-sky-50/30 dark:bg-sky-500/5': activeDataset === 'weekly-requests' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1. Phiếu Yêu Cầu Tuần</div>
              <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ weeklyRequestsList.length }}</div>
              <div class="text-[11px] text-slate-500">Phiếu vận hành theo tuần</div>
            </div>

            <div
              @click="switchDataset('defect-logs')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-amber-500/50 transition"
              :class="{ 'ring-2 ring-amber-500/40 bg-amber-50/30 dark:bg-amber-500/5': activeDataset === 'defect-logs' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">2. Defect Logs Kỹ Thuật</div>
              <div class="text-2xl font-extrabold font-mono text-amber-500">{{ defectLogsList.length }}</div>
              <div class="text-[11px] text-slate-500">Nhật ký sự cố & lỗi máy</div>
            </div>

            <div
              @click="switchDataset('action-plans')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-emerald-500/50 transition"
              :class="{ 'ring-2 ring-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-500/5': activeDataset === 'action-plans' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">3. Action Plan Hành Động</div>
              <div class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ actionPlansList.length }}</div>
              <div class="text-[11px] text-slate-500">Kế hoạch khắc phục sự cố</div>
            </div>

            <div
              @click="switchDataset('requesters')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-indigo-500/50 transition"
              :class="{ 'ring-2 ring-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-500/5': activeDataset === 'requesters' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4. Người Yêu Cầu</div>
              <div class="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">{{ requestersList.length }}</div>
              <div class="text-[11px] text-slate-500">Danh mục nhân sự yêu cầu</div>
            </div>
          </div>

          <!-- Dataset Switcher Tabs & Search Toolbar -->
          <div class="glass-card rounded-2xl p-4 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  @click="switchDataset('weekly-requests')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'weekly-requests' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-list-check mr-1"></i> Phiếu Yêu Cầu Tuần
                </button>
                <button
                  type="button"
                  @click="switchDataset('defect-logs')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'defect-logs' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-triangle-exclamation mr-1"></i> Defect Logs
                </button>
                <button
                  type="button"
                  @click="switchDataset('action-plans')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'action-plans' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-bullseye mr-1"></i> Action Plans
                </button>
                <button
                  type="button"
                  @click="switchDataset('requesters')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'requesters' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-users-gear mr-1"></i> Danh Mục Người Yêu Cầu
                </button>
              </div>

              <div class="w-full sm:w-72">
                <input
                  type="text"
                  v-model="datasetSearch"
                  @input="applyDatasetFilter"
                  placeholder="🔍 Tìm nhanh trong tập dữ liệu này..."
                  class="input-box w-full px-3.5 py-1.5 rounded-xl text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Tabulator Container for Existing Data -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-existing-data"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW: REPORT TECHNICAL (PHÂN TÍCH & BÁO CÁO KỸ THUẬT ĐỒNG BỘ OVERVIEW)
             ===================================================================== -->
        <div v-show="activeTab === 'report-technical'" class="space-y-6">
          <!-- Header Banner with Title & Quick Preset Controls -->
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <i class="fa-solid fa-chart-pie mr-1"></i> Technical Analytics
                </span>
                <span class="text-xs text-slate-500 font-mono">Synced with Overview Hub</span>
              </div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">Report Technical</h1>
              <p class="text-xs text-slate-600 dark:text-slate-400">Thống kê toàn diện chỉ số phiếu kỹ thuật, thời gian downtime và phân bổ trạng thái CPS theo khoảng thời gian</p>
            </div>

            <!-- Time Range & Presets Filter Bar -->
            <div class="glass-card rounded-2xl p-2.5 flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <!-- Quick Presets -->
              <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  @click="setReportPreset('7d')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === '7d' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  1 Tuần trước
                </button>
                <button
                  type="button"
                  @click="setReportPreset('today')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === 'today' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  Hôm nay
                </button>
                <button
                  type="button"
                  @click="setReportPreset('month')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === 'month' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  Tháng này
                </button>
                <button
                  type="button"
                  @click="setReportPreset('all')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === 'all' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  Tất cả
                </button>
              </div>

              <!-- Date Picker Inputs -->
              <div class="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  v-model="reportDateFrom"
                  @change="onReportFilterChange"
                  class="input-box px-2.5 py-1 rounded-xl font-mono text-xs outline-none"
                  title="Từ ngày"
                />
                <span class="text-slate-400">→</span>
                <input
                  type="date"
                  v-model="reportDateTo"
                  @change="onReportFilterChange"
                  class="input-box px-2.5 py-1 rounded-xl font-mono text-xs outline-none"
                  title="Đến ngày"
                />
              </div>

              <!-- Actions -->
              <button
                type="button"
                @click="exportReportTechnicalExcel"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
                title="Xuất bảng báo cáo này ra Excel"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- 7 KPI STATISTICAL CARDS -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <!-- Card 1: Số phiếu Kỹ thuật yêu cầu -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-sky-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">Phiếu Yêu Cầu</span>
                <i class="fa-solid fa-file-invoice text-sky-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.totalRequests }}</div>
              <div class="text-[10px] text-slate-500 truncate">Tổng phiếu trong kỳ</div>
            </div>

            <!-- Card 2: Tổng thời gian down time (phút/giờ) -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-amber-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">Tổng Downtime</span>
                <i class="fa-solid fa-clock-rotate-left text-amber-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {{ reportStats.totalDowntimeMinutes }}<span class="text-xs font-normal ml-0.5">m</span>
              </div>
              <div class="text-[10px] text-slate-500 truncate">~ {{ reportStats.totalDowntimeHours }} giờ dừng máy</div>
            </div>

            <!-- Card 3: Số lượng OPEN_TASK -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-slate-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">OPEN_TASK</span>
                <i class="fa-solid fa-folder-open text-slate-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-slate-700 dark:text-slate-300">{{ reportStats.openTask }}</div>
              <div class="text-[10px] text-slate-500 truncate">Phiếu mới mở</div>
            </div>

            <!-- Card 4: Số lượng TO_ASSIGN -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-amber-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">TO_ASSIGN</span>
                <i class="fa-solid fa-user-clock text-amber-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{{ reportStats.toAssign }}</div>
              <div class="text-[10px] text-slate-500 truncate">Chờ giao kỹ thuật</div>
            </div>

            <!-- Card 5: Số lượng IN_PROGRESS -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-sky-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">IN_PROGRESS</span>
                <i class="fa-solid fa-bolt text-sky-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.inProgress }}</div>
              <div class="text-[10px] text-slate-500 truncate">Đang xử lý sửa chữa</div>
            </div>

            <!-- Card 6: Số lượng CLOSED -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-emerald-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">CLOSED</span>
                <i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ reportStats.closed }}</div>
              <div class="text-[10px] text-slate-500 truncate">Đã nghiệm thu đóng</div>
            </div>

            <!-- Card 7: Số lượng OVER_DUE -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-rose-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">OVER_DUE</span>
                <i class="fa-solid fa-triangle-exclamation text-rose-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">{{ reportStats.overDue }}</div>
              <div class="text-[10px] text-slate-500 truncate">Quá hạn xử lý</div>
            </div>
          </div>

          <!-- DONUT CHART & STATUS BREAKDOWN SECTION -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Donut Chart with Center Total -->
            <div class="lg:col-span-5 glass-card rounded-2xl p-5 flex flex-col items-center justify-between space-y-4">
              <div class="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-500"></i> Phân Bổ Tỷ Lệ Trạng Thái Phiếu
                </h3>
                <span class="text-[10px] font-mono text-slate-400">Donut Chart</span>
              </div>

              <!-- Relative Chart Container with Absolute Center Label -->
              <div class="relative w-64 h-64 mx-auto flex items-center justify-center my-2">
                <canvas id="chart-report-technical-donut" class="w-full h-full"></canvas>
                <!-- Center Overlay displaying Tổng số lượng các status của CPS -->
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <div class="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
                    {{ reportStats.totalStatusCps }}
                  </div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Tổng Trạng Thái CPS
                  </div>
                </div>
              </div>

              <div class="w-full text-center text-xs text-slate-500 dark:text-slate-400">
                Sơ đồ Donut thể hiện trực quan tỷ trọng các trạng thái xử lý kỹ thuật trong kỳ lọc.
              </div>
            </div>

            <!-- Detailed Status Legend & Percentage Table -->
            <div class="lg:col-span-7 glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-sky-500"></i> Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái
                </h3>
                <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {{ reportStats.totalRequests }} phiếu
                </span>
              </div>

              <div class="space-y-3">
                <!-- Row: OPEN_TASK -->
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-slate-500"></span>
                    <div>
                      <div class="font-bold text-xs">📋 OPEN_TASK (Mở)</div>
                      <div class="text-[10px] text-slate-400">Phiếu mới tiếp nhận, chưa kích hoạt chuỗi</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono">{{ reportStats.openTask }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.openTask, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: TO_ASSIGN -->
                <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                    <div>
                      <div class="font-bold text-xs text-amber-700 dark:text-amber-400">⏳ TO_ASSIGN (Chờ phân công)</div>
                      <div class="text-[10px] text-slate-400">Đang chờ trưởng ca / quản lý chỉ định KTV</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">{{ reportStats.toAssign }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.toAssign, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: IN_PROGRESS -->
                <div class="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-sky-500"></span>
                    <div>
                      <div class="font-bold text-xs text-sky-700 dark:text-sky-400">⚡ IN_PROGRESS (Đang xử lý)</div>
                      <div class="text-[10px] text-slate-400">KTV đang thao tác sửa chữa tại máy in</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.inProgress }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.inProgress, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: CLOSED -->
                <div class="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                    <div>
                      <div class="font-bold text-xs text-emerald-700 dark:text-emerald-400">✅ CLOSED (Đã đóng)</div>
                      <div class="text-[10px] text-slate-400">Hoàn tất kiểm tra và bàn giao sản xuất (CPSF)</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{{ reportStats.closed }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.closed, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: OVER_DUE -->
                <div class="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
                    <div>
                      <div class="font-bold text-xs text-rose-700 dark:text-rose-400">⚠️ OVER_DUE (Quá hạn)</div>
                      <div class="text-[10px] text-slate-400">Vượt quá thời hạn deadline quy định</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-rose-600 dark:text-rose-400">{{ reportStats.overDue }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.overDue, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TABULATOR TABLE CONTAINER: TỔNG PHIẾU YÊU CẦU THEO TIME RANGE ĐÃ FILTER -->
          <div class="glass-card rounded-2xl p-5 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-table text-sky-500"></i> Bảng Dữ Liệu Phiếu Kỹ Thuật Trong Khoảng Thời Gian
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Danh sách các phiếu lọc theo mốc thời gian từ {{ reportDateFrom || '...' }} đến {{ reportDateTo || '...' }}</p>
              </div>

              <!-- Quick Search & Status Filter inside Tabulator -->
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  v-model="reportSearch"
                  @input="onReportFilterChange"
                  placeholder="🔍 Tìm mã phiếu, người YC, KTV, thiết bị..."
                  class="input-box px-3.5 py-1.5 rounded-xl text-xs outline-none w-full sm:w-64"
                />
                <select
                  v-model="reportStatusFilter"
                  @change="onReportFilterChange"
                  class="input-box px-3 py-1.5 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="ALL">-- Tất cả trạng thái --</option>
                  <option value="OPEN_TASK">OPEN_TASK</option>
                  <option value="TO_ASSIGN">TO_ASSIGN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="OVER_DUE">OVER_DUE</option>
                </select>
              </div>
            </div>

            <!-- Tabulator Mount Point -->
            <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div id="tabulator-report-technical"></div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- TICKET DETAIL MODAL -->
    <div id="modal-ticket-detail" v-if="showTicketDetailModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-ticket-detail')">
      <div v-if="selectedTicket" class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">Chi Tiết Phiếu Yêu Cầu</div>
            <h2 class="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ selectedTicket.docNo }}</h2>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 space-y-5 text-xs">
          <!-- Overview summary -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">CÔNG NGHỆ</span>
              <span class="font-bold">{{ selectedTicket.printTech }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">TÊN MÁY</span>
              <span class="font-bold text-sky-600 dark:text-sky-400">{{ selectedTicket.machineName }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">DOWNTIME</span>
              <span class="font-mono font-bold text-red-500">{{ selectedTicket.downtime || 0 }} phút</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">TRẠNG THÁI</span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block" :class="getStatusBadgeClass(selectedTicket.chkStatus || selectedTicket.status)">
                {{ selectedTicket.chkStatus || selectedTicket.status || 'Open' }}
              </span>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-slate-400 font-bold uppercase text-[10px]">Mô Tả Sự Cố</span>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed font-medium">
              {{ selectedTicket.problem }}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <span class="text-slate-400 font-bold uppercase text-[10px]">Nguyên Nhân Gốc (Root Cause)</span>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed">
                {{ selectedTicket.rootCause || 'Chưa ghi nhận' }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 font-bold uppercase text-[10px]">Hành Động Khắc Phục (Action Taken)</span>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed">
                {{ selectedTicket.actionTaken || 'Chưa ghi nhận' }}
              </div>
            </div>
          </div>

          <!-- Photos -->
          <div v-if="(selectedTicket.photosBefore && selectedTicket.photosBefore.length > 0) || (selectedTicket.photosAfter && selectedTicket.photosAfter.length > 0)" class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 font-bold uppercase text-[10px]">Hình Ảnh Hiện Trường</span>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-[11px] font-bold text-slate-500 mb-2">Trước Sửa Chữa ({{ selectedTicket.photosBefore?.length || 0 }})</div>
                <div class="flex flex-wrap gap-2">
                  <img v-for="(p, i) in selectedTicket.photosBefore" :key="i" :src="p" class="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                </div>
              </div>
              <div>
                <div class="text-[11px] font-bold text-slate-500 mb-2">Sau Sửa Chữa ({{ selectedTicket.photosAfter?.length || 0 }})</div>
                <div class="flex flex-wrap gap-2">
                  <img v-for="(p, i) in selectedTicket.photosAfter" :key="i" :src="p" class="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 text-[11px]">Đổi trạng thái:</span>
            <select :value="selectedTicket.chkStatus || selectedTicket.status" @change="e => updateTicketStatus(selectedTicket, e.target.value)" class="input-box px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
              <option value="Open">🔵 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Overdue">🔴 Overdue</option>
              <option value="Closed">🟢 Closed</option>
            </select>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>

    <!-- =====================================================================
         MODAL PHÂN CÔNG KỸ THUẬT (ASSIGN TASK MODAL)
         ===================================================================== -->
    <div
      id="modal-assign-task"
      v-if="showAssignModal"
      class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      @click="closeAssignModal"
    >
      <div
        v-if="selectedCpsForAssign"
        class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <div class="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1.5">
              <i class="fa-solid fa-clipboard-user"></i> Module Phân Công Kỹ Thuật
            </div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-0.5">
              <span>{{ selectedCpsForAssign.docNo || ('CPS-' + (selectedCpsForAssign.cpsrDocNo ? selectedCpsForAssign.cpsrDocNo.replace('CPSR-', '') : (selectedCpsForAssign.cpsr?.docNo ? selectedCpsForAssign.cpsr.docNo.replace('CPSR-', '') : ''))) }}</span>
              <span :class="getStatusBadgeClass(selectedCpsForAssign.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                {{ formatCpsStatus(selectedCpsForAssign.status) }}
              </span>
            </h2>
          </div>
          <button @click="closeAssignModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4 text-xs">
          <!-- Summary card -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <div><span class="text-slate-400 block text-[10px] font-bold">THIẾT BỊ / MÁY:</span> <span class="font-bold text-slate-800 dark:text-slate-100">{{ selectedCpsForAssign.machineName || selectedCpsForAssign.cpsr?.machineName || '-' }}</span></div>
              <div><span class="text-slate-400 block text-[10px] font-bold">CÔNG NGHỆ:</span> <span class="font-mono">{{ selectedCpsForAssign.printTech || selectedCpsForAssign.cpsr?.printTech || '-' }}</span></div>
              <div class="col-span-2">
                <span class="text-slate-400 block text-[10px] font-bold">MÔ TẢ SỰ CỐ:</span>
                <p class="mt-0.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-rose-500 dark:text-rose-400">
                  {{ selectedCpsForAssign.problem || selectedCpsForAssign.cpsr?.problem || '-' }}
                </p>
              </div>
              <div><span class="text-slate-400 block text-[10px] font-bold">NGƯỜI YÊU CẦU:</span> {{ selectedCpsForAssign.reqBy || selectedCpsForAssign.cpsr?.reqBy || '-' }}</div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">ƯU TIÊN:</span>
                <span :class="(selectedCpsForAssign.priority || selectedCpsForAssign.cpsr?.priority) === 'Hỗ trợ ngay' ? 'text-rose-500 font-bold' : 'text-amber-500 font-bold'">
                  {{ selectedCpsForAssign.priority || selectedCpsForAssign.cpsr?.priority || 'Bình thường' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <form @submit.prevent="submitAssignTask" class="space-y-4">
            <!-- 1. Dropdown Nhân Viên -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nhân viên kỹ thuật tiếp nhận <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="assignForm.employee"
                required
                class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="" disabled>-- Chọn nhân viên từ danh sách --</option>
                <option
                  v-for="emp in employeesList"
                  :key="emp.id || emp.mnv"
                  :value="emp"
                >
                  {{ emp.name }} {{ emp.mnv ? '(' + emp.mnv + ')' : '' }} - {{ emp.role || emp.dept || 'Kỹ thuật' }}
                </option>
              </select>
            </div>

            <!-- 2. Chọn Deadline (mặc định để trống) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Thời hạn hoàn thành (Deadline)
                </label>
                <span class="text-[10px] text-slate-400 italic">Mặc định để trống</span>
              </div>
              <input
                type="datetime-local"
                v-model="assignForm.deadline"
                class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-mono"
              />
            </div>

            <!-- 3. Ghi chú phân công (Optional) -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Ghi chú phân công (Tùy chọn)
              </label>
              <textarea
                v-model="assignForm.notes"
                rows="2"
                placeholder="Nhập ghi chú yêu cầu xử lý, lưu ý kỹ thuật..."
                class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"
              ></textarea>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                @click="closeAssignModal"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                :disabled="isAssigning"
                class="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                <i v-if="isAssigning" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-check"></i>
                <span>Lưu Phân Công (IN_PROGRESS)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 1-1-1 CHAIN & SPLIT FORM DETAIL MODAL -->
    <div id="modal-chain-detail" v-if="showChainModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-chain-detail')">
      <div v-if="selectedChain" class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-sky-500">Chuỗi Tiến Trình 1-1-1</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{{ selectedChain.cpsr?.docNo || selectedChain.docNo }}</span>
              <span v-if="selectedChain.cpst" class="text-slate-400">→</span>
              <span v-if="selectedChain.cpst" class="text-emerald-500 font-mono">{{ selectedChain.cpst.docNo }}</span>
              <span v-if="selectedChain.cpsf" class="text-slate-400">→</span>
              <span v-if="selectedChain.cpsf" class="text-purple-500 font-mono">{{ selectedChain.cpsf.docNo }}</span>
            </h2>
          </div>
          <button @click="closeModal('modal-chain-detail')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 space-y-6 text-xs">
          <!-- BƯỚC 1: CPSR -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-bold text-sky-600 dark:text-sky-400 text-sm">1. Phiếu Yêu Cầu Kỹ Thuật (CPSR)</span>
              <span class="font-mono font-bold text-xs bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded">{{ (selectedChain.cpsr || selectedChain).docNo }}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">NGÀY & GIỜ</span>
                <span class="font-medium">{{ (selectedChain.cpsr || selectedChain).reqDate }} {{ (selectedChain.cpsr || selectedChain).reqTime }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">NGƯỜI YÊU CẦU</span>
                <span class="font-medium text-slate-800 dark:text-slate-100">{{ (selectedChain.cpsr || selectedChain).reqBy }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">THIẾT BỊ / MÁY</span>
                <span class="font-medium">{{ (selectedChain.cpsr || selectedChain).printTech }} - {{ (selectedChain.cpsr || selectedChain).machineName }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">ƯU TIÊN</span>
                <span class="font-bold" :class="(selectedChain.cpsr || selectedChain).priority === 'Hỗ trợ ngay' ? 'text-rose-500' : 'text-amber-500'">{{ (selectedChain.cpsr || selectedChain).priority || 'N/A' }}</span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">MÔ TẢ SỰ CỐ:</span>
              <p class="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] leading-relaxed">{{ (selectedChain.cpsr || selectedChain).problem }}</p>
            </div>
          </div>

          <!-- BƯỚC 2: CPST -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">2. Phản Hồi Kỹ Thuật (CPST)</span>
              <span v-if="selectedChain.cpst" class="font-mono font-bold text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">{{ selectedChain.cpst.docNo }}</span>
              <span v-else class="text-xs text-slate-400">Chưa tạo phản hồi</span>
            </div>

            <div v-if="selectedChain.cpst" class="space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">KTV TIẾP NHẬN</span>
                  <span class="font-medium text-slate-800 dark:text-slate-100">{{ selectedChain.cpst.recvBy }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">TRẠNG THÁI KT</span>
                  <span class="font-bold text-emerald-500">{{ selectedChain.cpst.chkStatus }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">THỜI GIAN GỬI</span>
                  <span class="font-medium">{{ selectedChain.cpst.submittedAt ? new Date(selectedChain.cpst.submittedAt).toLocaleString('vi-VN') : '-' }}</span>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">NGUYÊN NHÂN GỐC:</span>
                  <p class="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">{{ selectedChain.cpst.rootCause || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">HÀNH ĐỘNG KHẮC PHỤC:</span>
                  <p class="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">{{ selectedChain.cpst.actionTaken || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 gap-3">
              <span class="text-amber-500 font-medium">Yêu cầu này đang chờ kỹ thuật phản hồi.</span>
              <a :href="'/technical-feedback?cpsr=' + encodeURIComponent((selectedChain.cpsr || selectedChain).docNo)" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition">
                + Tạo Phản Hồi CPST Ngay →
              </a>
            </div>
          </div>

          <!-- BƯỚC 3: CPSF -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-bold text-purple-600 dark:text-purple-400 text-sm">3. Nghiệm Thu & Bàn Giao (CPSF)</span>
              <span v-if="selectedChain.cpsf" class="font-mono font-bold text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">{{ selectedChain.cpsf.docNo }}</span>
              <span v-else class="text-xs text-slate-400">Chưa bàn giao</span>
            </div>

            <div v-if="selectedChain.cpsf" class="space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">CHẤT LƯỢNG IN</span>
                  <span class="font-bold text-xs" :class="selectedChain.cpsf.chkQuality === 'Đạt' ? 'text-emerald-500' : 'text-rose-500'">{{ selectedChain.cpsf.chkQuality }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">WORK ORDER</span>
                  <span class="font-mono font-medium">{{ selectedChain.cpsf.workOrder || '-' }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">TỔNG SL / PHẾ</span>
                  <span class="font-mono font-medium">{{ selectedChain.cpsf.woTotalQty }} / {{ selectedChain.cpsf.wasteQty }} ({{ selectedChain.cpsf.wastePercent || '0%' }})</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">ĐẠI DIỆN SX KÝ NHẬN</span>
                  <span class="font-medium text-slate-800 dark:text-slate-100">{{ selectedChain.cpsf.prodMgr }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="selectedChain.cpst" class="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 gap-3">
              <span class="text-purple-400 font-medium">Kỹ thuật đã phản hồi. Chờ sản xuất nghiệm thu bàn giao.</span>
              <a :href="'/confirm-request?cpst=' + encodeURIComponent(selectedChain.cpst.docNo)" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition">
                + Xác Nhận Bàn Giao CPSF Ngay →
              </a>
            </div>
            <div v-else class="text-slate-400 italic">Cần hoàn thành bước 2 (CPST) trước khi bàn giao.</div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openEditModal('cps', selectedChain)"
              class="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-pen-to-square"></i> Chỉnh Sửa
            </button>
            <button
              type="button"
              @click="openLinkModal(selectedChain)"
              class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-link"></i> Ghép Nối
            </button>
          </div>
          <button @click="closeModal('modal-chain-detail')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         MODAL: CHỈNH SỬA PHIẾU (CPSR, CPST, CPSF, CPS)
         ========================================================================= -->
    <div id="modal-edit-ticket" v-if="showEditModal" class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeEditModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-sky-500">Chỉnh Sửa Dữ Liệu Phiếu</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-pen-to-square text-sky-500"></i>
              <span>{{ editForm.docNo }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full uppercase font-sans font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20">
                {{ editForm.type.toUpperCase() }}
              </span>
            </h2>
          </div>
          <button @click="closeEditModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <!-- Modal Body Form -->
        <form @submit.prevent="submitEditTicket" class="p-6 space-y-4 text-xs">
          <!-- Type = CPS -->
          <template v-if="editForm.type === 'cps'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mã CPSR Gốc (Liên kết)</label>
                <input type="text" :value="editForm.cpsrDocNo" disabled class="input-box w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Trạng thái phiếu</label>
                <select v-model="editForm.status" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="TO_ASSIGN">⏳ Chờ phân công (TO_ASSIGN)</option>
                  <option value="IN_PROGRESS">⚡ Đang xử lý (IN_PROGRESS)</option>
                  <option value="OVER_DUE">⚠️ Quá hạn (OVER_DUE)</option>
                  <option value="CLOSED">✅ Đã đóng (CLOSED)</option>
                  <option value="OPEN_TASK">📋 Mở (OPEN_TASK)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">KTV Phụ Trách</label>
                <input type="text" v-model="editForm.assignedTo" list="list-ktv-edit" placeholder="Chọn hoặc nhập tên KTV" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
                <datalist id="list-ktv-edit">
                  <option v-for="e in employeesList" :key="e.id || e.mnv" :value="e.name + (e.mnv ? ' - ' + e.mnv : '')"></option>
                </datalist>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mức Ưu Tiên</label>
                <select v-model="editForm.priority" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Hỗ trợ ngay">🔴 Hỗ trợ ngay</option>
                  <option value="Chạy tạm">🟡 Chạy tạm</option>
                  <option value="Khác">📌 Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Hạn chót hoàn thành (Deadline)</label>
              <input type="datetime-local" v-model="editForm.deadline" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Ghi chú phân công / Xử lý</label>
              <textarea v-model="editForm.notes" rows="3" placeholder="Nhập ghi chú kỹ thuật..." class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Type = CPSR -->
          <template v-else-if="editForm.type === 'cpsr'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Người Yêu Cầu</label>
                <input type="text" v-model="editForm.reqBy" list="list-requesters-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
                <datalist id="list-requesters-edit">
                  <option v-for="r in requestersList" :key="r.id" :value="r.mnv + ' - ' + r.fullName"></option>
                </datalist>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Tên Máy / Thiết Bị</label>
                <input type="text" v-model="editForm.machineName" list="list-machines-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
                <datalist id="list-machines-edit">
                  <option v-for="m in machinesFlatList" :key="m.name" :value="m.name">{{ m.tech }}</option>
                </datalist>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Công Nghệ In</label>
                <select v-model="editForm.printTech" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mức Ưu Tiên</label>
                <select v-model="editForm.priority" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Hỗ trợ ngay">🔴 Hỗ trợ ngay</option>
                  <option value="Chạy tạm">🟡 Chạy tạm</option>
                  <option value="Khác">📌 Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Trạng thái sự cố / máy</label>
              <input type="text" v-model="editForm.machineStatus" placeholder="VD: Hàng SX lần đầu, Hàng SX nhiều lần..." class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mô Tả Sự Cố</label>
              <textarea v-model="editForm.problem" rows="3" required class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Type = CPST -->
          <template v-else-if="editForm.type === 'cpst'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">KTV Tiếp Nhận</label>
                <input type="text" v-model="editForm.recvBy" list="list-ktv-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Trạng Thái Kỹ Thuật</label>
                <select v-model="editForm.chkStatus" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Đã khắc phục">🟢 Đã khắc phục</option>
                  <option value="Theo dõi thêm">🟡 Theo dõi thêm</option>
                  <option value="Hư hỏng nặng">🔴 Hư hỏng nặng</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Downtime (Phút)</label>
                <input type="number" v-model.number="editForm.downtime" min="0" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mã CPSR Liên Kết</label>
                <input type="text" :value="editForm.cpsrDocNo" disabled class="input-box w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Nguyên Nhân Gốc (Root Cause)</label>
              <textarea v-model="editForm.rootCause" rows="2" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Hành Động Khắc Phục (Action Taken)</label>
              <textarea v-model="editForm.actionTaken" rows="2" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Type = CPSF -->
          <template v-else-if="editForm.type === 'cpsf'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Chất Lượng In</label>
                <select v-model="editForm.chkQuality" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Đạt">🟢 Đạt</option>
                  <option value="Chưa đạt">🔴 Chưa đạt</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Work Order (Mã WO)</label>
                <input type="text" v-model="editForm.workOrder" placeholder="VD: WO-20261006-01" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Tổng SL</label>
                <input type="number" v-model.number="editForm.woTotalQty" min="0" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">SL Phế</label>
                <input type="number" v-model.number="editForm.wasteQty" min="0" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Đơn Vị</label>
                <select v-model="editForm.wasteUnit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="PCS">PCS</option>
                  <option value="Mét">Mét</option>
                  <option value="Tờ in">Tờ in</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Đại Diện SX Nghiệm Thu</label>
              <input type="text" v-model="editForm.prodMgr" list="list-requesters-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
            </div>
          </template>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="closeEditModal" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              Hủy Bỏ
            </button>
            <button type="submit" :disabled="isSavingEdit" class="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer">
              <i v-if="isSavingEdit" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-check"></i>
              <span>Lưu Thay Đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- =========================================================================
         MODAL: GHÉP NỐI PHIẾU CPS VỚI CPST & CPSF
         ========================================================================= -->
    <div id="modal-link-ticket" v-if="showLinkModal" class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeLinkModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-purple-500">Chuỗi Tiến Trình 1-1-1</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-link text-purple-500"></i>
              <span>Ghép Nối Phiếu: {{ linkForm.cpsDocNo }}</span>
            </h2>
          </div>
          <button @click="closeLinkModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <!-- CPS Selector Dropdown (Allows changing or selecting CPS) -->
          <div class="space-y-1">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Chọn Phiếu CPS Cần Ghép Nối</label>
            <select v-model="linkForm.cpsDocNo" @change="onSelectLinkCps(linkForm.cpsDocNo)" class="input-box w-full px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none cursor-pointer">
              <option v-for="c in chainList" :key="c.docNo || c.id" :value="c.docNo">
                {{ c.docNo }} • {{ c.cpsrDocNo || c.cpsr?.docNo || '-' }} ({{ c.machineName || c.cpsr?.machineName || '-' }})
              </option>
            </select>
          </div>

          <!-- Information Summary Card -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Mã CPSR Gốc:</span>
              <span class="font-mono font-bold text-sky-600 dark:text-sky-400">{{ linkForm.cpsrDocNo || '-' }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Thiết bị:</span>
              <span class="font-medium text-slate-700 dark:text-slate-200">{{ linkForm.machineName || '-' }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Sự cố:</span>
              <span class="truncate max-w-[220px] text-slate-600 dark:text-slate-300 font-mono">{{ linkForm.problem || '-' }}</span>
            </div>
          </div>

          <!-- Section 1: CPST Linkage -->
          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <i class="fa-solid fa-screwdriver-wrench"></i> 2. Phản Hồi Kỹ Thuật (CPST)
              </span>
              <span v-if="linkForm.currentCpst" class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Đã nối: {{ linkForm.currentCpst }}
              </span>
              <span v-else class="text-[10px] text-amber-500 italic">Chưa ghép nối</span>
            </div>

            <div v-if="linkForm.currentCpst" class="flex items-center justify-between pt-1">
              <span class="text-slate-500">Gỡ ghép nối CPST hiện tại:</span>
              <button
                type="button"
                @click="unlinkItem('cpst')"
                class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 font-bold transition cursor-pointer"
              >
                <i class="fa-solid fa-unlink"></i> Hủy ghép CPST
              </button>
            </div>

            <div v-else class="space-y-1">
              <label class="block text-slate-600 dark:text-slate-400">Chọn phiếu CPST để ghép nối:</label>
              <select v-model="linkForm.selectedCpst" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="">-- Chọn phiếu CPST khả dụng --</option>
                <option v-for="t in cpstList" :key="t.docNo || t.id" :value="t.docNo">
                  {{ t.docNo }} (KTV: {{ t.recvBy || 'N/A' }} • {{ t.chkStatus || 'N/A' }})
                </option>
              </select>
            </div>
          </div>

          <!-- Section 2: CPSF Linkage -->
          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check"></i> 3. Nghiệm Thu & Bàn Giao (CPSF)
              </span>
              <span v-if="linkForm.currentCpsf" class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                Đã nối: {{ linkForm.currentCpsf }}
              </span>
              <span v-else class="text-[10px] text-amber-500 italic">Chưa ghép nối</span>
            </div>

            <div v-if="linkForm.currentCpsf" class="flex items-center justify-between pt-1">
              <span class="text-slate-500">Gỡ ghép nối CPSF hiện tại:</span>
              <button
                type="button"
                @click="unlinkItem('cpsf')"
                class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 font-bold transition cursor-pointer"
              >
                <i class="fa-solid fa-unlink"></i> Hủy ghép CPSF
              </button>
            </div>

            <div v-else class="space-y-1">
              <label class="block text-slate-600 dark:text-slate-400">Chọn phiếu CPSF để ghép nối:</label>
              <select v-model="linkForm.selectedCpsf" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="">-- Chọn phiếu CPSF khả dụng --</option>
                <option v-for="f in cpsfList" :key="f.docNo || f.id" :value="f.docNo">
                  {{ f.docNo }} (WO: {{ f.workOrder || 'N/A' }} • CL: {{ f.chkQuality || 'N/A' }})
                </option>
              </select>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="closeLinkModal" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              Đóng
            </button>
            <button
              type="button"
              @click="submitLinkTickets"
              :disabled="isLinking || (!linkForm.selectedCpst && !linkForm.selectedCpsf)"
              class="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <i v-if="isLinking" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-link"></i>
              <span>Lưu Ghép Nối</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         MODAL: TẠO PHIẾU CPS (RÀNG BUỘC NGHIỆP VỤ: BẮT BUỘC PHẢI CÓ CPSR)
         ========================================================================= -->
    <div id="modal-create-cps" v-if="showCreateCpsModal" class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCreateCpsModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-sky-500">Tạo Phiếu Kỹ Thuật</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-plus-circle text-sky-500"></i>
              <span>Tạo Mới Phiếu CPS (Chuỗi 1-1-1)</span>
            </h2>
          </div>
          <button @click="closeCreateCpsModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="submitCreateCps" class="p-6 space-y-4 text-xs">
          <!-- Business Rule Notice -->
          <div class="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-300 flex items-start gap-2.5">
            <i class="fa-solid fa-circle-info text-base mt-0.5 text-sky-600 dark:text-sky-400 flex-shrink-0"></i>
            <div>
              <strong class="font-bold block">Ràng buộc nghiệp vụ:</strong>
              <span>Phiếu CPS chỉ được tạo khi có phiếu yêu cầu CPSR gốc tương ứng. Vui lòng chọn một phiếu CPSR chưa gắn CPS từ danh sách dưới đây.</span>
            </div>
          </div>

          <!-- Select CPSR dropdown -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Chọn Phiếu CPSR Gốc <span class="text-rose-500">*</span>
            </label>
            <div v-if="availableCpsrForCps.length === 0" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i> Hiện không có phiếu CPSR nào chưa liên kết với CPS.
              <a href="/form-request" target="_blank" class="font-bold underline ml-1 text-sky-600 dark:text-sky-400">+ Tạo phiếu CPSR mới tại đây</a>
            </div>
            <select v-else v-model="createCpsForm.cpsrDocNo" required class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs outline-none cursor-pointer font-medium">
              <option value="" disabled>-- Vui lòng chọn phiếu CPSR --</option>
              <option v-for="r in availableCpsrForCps" :key="r.docNo" :value="r.docNo">
                {{ r.docNo }} • {{ r.reqBy || 'NV' }} • {{ r.printTech || '' }} - {{ r.machineName || '' }} ({{ r.problem ? r.problem.substring(0, 30) + '...' : '' }})
              </option>
            </select>
          </div>

          <!-- KTV Assigned -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Kỹ Thuật Viên Tiếp Nhận / Phân Công
            </label>
            <input
              type="text"
              v-model="createCpsForm.assignedTo"
              list="list-ktv-create-cps"
              placeholder="Chọn hoặc nhập tên KTV..."
              class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-medium"
            />
            <datalist id="list-ktv-create-cps">
              <option v-for="e in employeesList" :key="e.id || e.mnv" :value="e.name + (e.mnv ? ' - ' + e.mnv : '')"></option>
            </datalist>
          </div>

          <!-- Priority & Deadline -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mức Độ Ưu Tiên</label>
              <select v-model="createCpsForm.priority" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="Hỗ trợ ngay">🔴 Hỗ trợ ngay</option>
                <option value="Chạy tạm">🟡 Chạy tạm</option>
                <option value="Bình thường">🔵 Bình thường</option>
                <option value="Khác">📌 Khác</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Hạn Chót (Deadline)</label>
              <input type="datetime-local" v-model="createCpsForm.deadline" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ghi Chú Tiến Độ</label>
            <textarea v-model="createCpsForm.notes" rows="2" placeholder="Ghi chú ban đầu khi tạo phiếu..." class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="closeCreateCpsModal" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isCreatingCps || !createCpsForm.cpsrDocNo"
              class="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
            >
              <i v-if="isCreatingCps" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-plus"></i>
              <span>Tạo Phiếu CPS</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD MACHINE MODAL -->
    <div id="modal-add-machine" v-if="showAddMachineModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-machine')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Máy In Mới</h3>
          <button @click="closeModal('modal-add-machine')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAddMachine" class="p-5 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Công nghệ in</label>
            <input type="text" v-model="newMachine.tech" required placeholder="RFID, OFFSET, Digital..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Tên máy</label>
            <input type="text" v-model="newMachine.name" required placeholder="Tên máy in mới..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Mã máy (tùy chọn)</label>
            <input type="text" v-model="newMachine.code" placeholder="M-01..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-machine')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 cursor-pointer">Thêm</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD EMPLOYEE MODAL -->
    <div id="modal-add-employee" v-if="showAddEmployeeModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-employee')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Nhân Sự</h3>
          <button @click="closeModal('modal-add-employee')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAddEmployee" class="p-5 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Mã Nhân Viên</label>
            <input type="text" v-model="newEmployee.mnv" placeholder="NV..." class="input-box w-full px-3 py-2 rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Họ và Tên</label>
            <input type="text" v-model="newEmployee.name" required placeholder="Nguyễn Văn A..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Bộ Phận (Phòng ban)</label>
            <input type="text" v-model="newEmployee.dept" placeholder="Sản Xuất, Kỹ Thuật, QA..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Khu vực / Chuyền</label>
            <input type="text" v-model="newEmployee.area" placeholder="OFFSET, Digital, Prepress..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Chức vụ</label>
            <input type="text" v-model="newEmployee.role" placeholder="Operator, Technician, Manager..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-employee')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 cursor-pointer">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div id="modal-add-user" v-if="showAddUserModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-user')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Tài Khoản Đăng Nhập</h3>
          <button @click="closeModal('modal-add-user')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAddUser" class="p-5 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Tên đăng nhập (Username)</label>
            <input type="text" v-model="newUser.username" required placeholder="username..." class="input-box w-full px-3 py-2 rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Mật khẩu</label>
            <input type="password" v-model="newUser.password" required placeholder="Mật khẩu..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Họ và Tên</label>
            <input type="text" v-model="newUser.fullName" required placeholder="Họ và tên..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Email</label>
            <input type="email" v-model="newUser.email" placeholder="email@checkpointsystems.com..." class="input-box w-full px-3 py-2 rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Vai trò (Role)</label>
            <select v-model="newUser.role" @change="onNewUserRoleChange" class="input-box w-full px-3 py-2 rounded-xl font-bold cursor-pointer">
              <option value="EMPLOYEE">EMPLOYEE (Nhân viên nhập liệu)</option>
              <option value="TECHNICIAN">TECHNICIAN (Kỹ thuật viên)</option>
              <option value="ADMIN">ADMIN (Quản trị viên toàn quyền)</option>
            </select>
          </div>
          <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label class="font-bold text-slate-500 block">Cấp quyền truy cập (Permissions)</label>
            <div class="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <input type="checkbox" v-model="newUser.permissions.canCreateRequest" class="rounded text-sky-600 focus:ring-sky-500 h-4 w-4">
                <span>Tạo phiếu yêu cầu</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <input type="checkbox" v-model="newUser.permissions.canViewKpi" class="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4">
                <span>Xem Dashboard KPI</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <input type="checkbox" v-model="newUser.permissions.canAccessControlPanel" @change="e => { if (e.target.checked) newUser.role = 'ADMIN'; }" class="rounded text-amber-600 focus:ring-amber-500 h-4 w-4">
                <span class="text-amber-600 dark:text-amber-400 font-bold">Quản trị viên</span>
              </label>
            </div>
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-user')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 cursor-pointer">Tạo</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EXCEL UPLOADER MODAL -->
    <div id="modal-excel" v-if="showExcelModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-excel')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Nạp Danh Sách Nhân Sự Excel</h3>
          <button @click="closeModal('modal-excel')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <p class="text-xs text-slate-500 leading-relaxed">
            Hệ thống tự động nhận diện các cột: <strong>Họ và tên</strong>, <strong>Mã NV</strong>, <strong>Bộ phận</strong>, <strong>Khu vực</strong>, <strong>Chức vụ</strong>.
          </p>
          <input type="file" id="file_excel_admin" accept=".xlsx, .xls" class="hidden" @change="processExcelFile" />
          <div
            @click="triggerUpload('file_excel_admin')"
            class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/50"
          >
            <i class="fa-solid fa-file-excel text-3xl text-emerald-500 mb-2"></i>
            <div class="text-xs font-bold">Bấm vào đây để chọn file Excel (.xlsx, .xls)</div>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button @click="closeModal('modal-excel')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>

    <!-- TOAST CONTAINER -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"></div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, computed, onMounted, nextTick, toRaw, markRaw } = Vue;

    const toPlainObject = (obj) => {
      if (!obj) return null;
      try {
        return JSON.parse(JSON.stringify(toRaw ? toRaw(obj) : obj));
      } catch (_) {
        return { ...obj };
      }
    };

    createApp({
      setup() {
        const activeTab = ref('requests');
        const showTicketDetailModal = ref(false);
        const showAddMachineModal = ref(false);
        const showAddEmployeeModal = ref(false);
        const showAddUserModal = ref(false);
        const showExcelModal = ref(false);
        const sidebarOpen = ref(false);
        const sidebarCollapsed = ref(false);
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({
          username: 'admin',
          fullName: 'Quản trị viên',
          role: 'ADMIN',
          permissions: {
            canCreateRequest: true,
            canViewKpi: true,
            canAccessControlPanel: true
          }
        });
        try {
          const cachedUser = localStorage.getItem('checkpoint_user');
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            if (parsed && typeof parsed === 'object') {
              currentUser.value = { ...currentUser.value, ...parsed };
            }
          }
        } catch(e) {}

        const getAuthHeaders = (extra = {}) => {
          const headers = { ...extra };
          const token = localStorage.getItem('checkpoint_token');
          if (token) headers['Authorization'] = 'Bearer ' + token;
          return headers;
        };

        // Tabulator instances & Crash-proof helpers
        let reqTable = null;
        let machinesTable = null;
        let empTable = null;
        let usersTable = null;
        let existingDataTable = null;

        const isTabulatorReady = () => typeof Tabulator !== 'undefined';
        const safeRedraw = (tbl) => {
          try {
            if (tbl && typeof tbl.redraw === 'function') {
              tbl.redraw(true);
            }
          } catch (_) {}
        };
        const safeDestroy = (tbl) => {
          try {
            if (tbl && typeof tbl.destroy === 'function') {
              tbl.destroy();
            }
          } catch (_) {}
          return null;
        };

        // Overview stats
        const stats = ref({});

        // Public Form Sharing Configuration
        const isPublicFormEnabled = ref(false);
        const togglingPublicForm = ref(false);
        const copySuccess = ref(false);
        const publicFormUrl = computed(() => {
          if (typeof window !== 'undefined') {
            return window.location.origin + '/form-request';
          }
          return '/form-request';
        });

        const loadPublicFormStatus = async () => {
          try {
            const res = await fetch('/api/public/form-status');
            if (res.ok) {
              const data = await res.json();
              isPublicFormEnabled.value = !!(data.enabled ?? data.isPublicFormEnabled);
            }
          } catch (e) {
            console.error('Failed to load public form status:', e);
          }
        };

        const togglePublicForm = async () => {
          if (togglingPublicForm.value) return;
          togglingPublicForm.value = true;
          const targetState = !isPublicFormEnabled.value;
          try {
            const res = await fetch('/api/settings/public-form', {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({ isPublicFormEnabled: targetState, enabled: targetState }),
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              isPublicFormEnabled.value = !!(data.enabled ?? data.isPublicFormEnabled ?? targetState);
              showToast(isPublicFormEnabled.value ? 'Đã BẬT chia sẻ form công khai' : 'Đã TẮT chia sẻ form công khai');
            } else {
              showToast('Không thể cập nhật cấu hình form công khai', true);
            }
          } catch (e) {
            showToast('Lỗi kết nối máy chủ', true);
          } finally {
            togglingPublicForm.value = false;
          }
        };

        const copyPublicFormLink = async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(publicFormUrl.value);
            } else {
              const textarea = document.createElement('textarea');
              textarea.value = publicFormUrl.value;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
            }
            copySuccess.value = true;
            showToast('Đã sao chép liên kết form công khai vào clipboard!');
            setTimeout(() => { copySuccess.value = false; }, 2500);
          } catch (e) {
            showToast('Không thể tự động sao chép, vui lòng copy thủ công', true);
          }
        };

        // Split Forms (CPSR, CPST, CPSF, Chain)
        const splitTab = ref('chain');
        const chainList = ref([]);
        const cpsrList = ref([]);
        const cpstList = ref([]);
        const cpsfList = ref([]);
        const splitFilter = ref({ search: '', status: 'ALL' });
        const selectedChain = ref(null);
        const showChainModal = ref(false);
        let splitTable = null;

        // CPS & Assign Task State (Module Phân Công Kỹ Thuật)
        const cpsList = ref([]);
        const assignCardStatus = ref('ALL');
        const assignCardSearch = ref('');
        const showAssignModal = ref(false);
        const selectedCpsForAssign = ref(null);
        const assignForm = ref({ employee: '', deadline: '', notes: '' });
        const isAssigning = ref(false);

        // Edit Ticket Modal State (CPSR, CPST, CPSF, CPS)
        const showEditModal = ref(false);
        const isSavingEdit = ref(false);
        const editForm = ref({
          type: 'cps',
          docNo: '',
          cpsrDocNo: '',
          assignedTo: '',
          priority: 'Khác',
          status: 'TO_ASSIGN',
          deadline: '',
          notes: '',
          // CPSR fields
          reqBy: '',
          machineName: '',
          printTech: '',
          machineStatus: '',
          problem: '',
          // CPST fields
          recvBy: '',
          chkStatus: 'Đã khắc phục',
          downtime: 0,
          rootCause: '',
          actionTaken: '',
          // CPSF fields
          chkQuality: 'Đạt',
          workOrder: '',
          woTotalQty: 0,
          wasteQty: 0,
          wasteUnit: 'PCS',
          prodMgr: ''
        });

        // Link Ticket Modal State (Link CPS with CPST & CPSF)
        const showLinkModal = ref(false);
        const isLinking = ref(false);
        const linkForm = ref({
          cpsDocNo: '',
          cpsrDocNo: '',
          machineName: '',
          problem: '',
          currentCpst: '',
          currentCpsf: '',
          selectedCpst: '',
          selectedCpsf: ''
        });

        // Create CPS Modal State (Enforcing CPS requires CPSR)
        const showCreateCpsModal = ref(false);
        const isCreatingCps = ref(false);
        const createCpsForm = ref({
          cpsrDocNo: '',
          assignedTo: '',
          priority: 'Bình thường',
          deadline: '',
          notes: ''
        });

        const availableCpsrForCps = computed(() => {
          try {
            const usedCpsr = new Set();
            (chainList.value || []).forEach(c => {
              const doc = c.cpsrDocNo || c.cpsr?.docNo;
              if (doc) usedCpsr.add(doc);
            });
            return (cpsrList.value || []).filter(r => r && r.docNo && !usedCpsr.has(r.docNo));
          } catch (_) {
            return [];
          }
        });

        // Report Technical State & Computeds
        const reportDateFrom = ref('');
        const reportDateTo = ref('');
        const reportQuickPreset = ref('7d');
        const reportSearch = ref('');
        const reportStatusFilter = ref('ALL');
        let reportChartInstance = null;
        let reportTableInstance = null;

        const initReportDates = () => {
          const today = new Date();
          const pad = n => String(n).padStart(2, '0');
          reportDateTo.value = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

          const from = new Date();
          from.setDate(from.getDate() - 7);
          reportDateFrom.value = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '-' + pad(from.getDate());
          reportQuickPreset.value = '7d';
        };

        const setReportPreset = (preset) => {
          reportQuickPreset.value = preset;
          const today = new Date();
          const pad = n => String(n).padStart(2, '0');
          const todayStr = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
          reportDateTo.value = todayStr;

          if (preset === 'today') {
            reportDateFrom.value = todayStr;
          } else if (preset === '7d') {
            const from = new Date();
            from.setDate(from.getDate() - 7);
            reportDateFrom.value = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '-' + pad(from.getDate());
          } else if (preset === 'month') {
            const from = new Date(today.getFullYear(), today.getMonth(), 1);
            reportDateFrom.value = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '-' + pad(from.getDate());
          } else if (preset === 'all') {
            reportDateFrom.value = '';
            reportDateTo.value = '';
          }
          onReportFilterChange();
        };

        const filteredReportCps = computed(() => {
          try {
            let list = Array.isArray(chainList.value) && chainList.value.length > 0
              ? chainList.value
              : (Array.isArray(cpsList.value) ? cpsList.value : []);

            if (reportDateFrom.value || reportDateTo.value) {
              list = list.filter(item => {
                if (!item) return false;
                const rawDate = item.reqDate || item.cpsr?.reqDate || item.createdAt || item.updatedAt;
                if (!rawDate) return true;
                let dStr = '';
                if (typeof rawDate === 'string') {
                  if (rawDate.includes('T')) {
                    dStr = rawDate.split('T')[0];
                  } else if (rawDate.includes('/')) {
                    const parts = rawDate.split('/');
                    if (parts.length === 3) {
                      if (parts[0].length === 4) dStr = parts[0] + '-' + parts[1].padStart(2, '0') + '-' + parts[2].padStart(2, '0');
                      else dStr = parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
                    }
                  } else {
                    dStr = rawDate.trim();
                  }
                }
                if (!dStr) return true;
                if (reportDateFrom.value && dStr < reportDateFrom.value) return false;
                if (reportDateTo.value && dStr > reportDateTo.value) return false;
                return true;
              });
            }

            if (reportStatusFilter.value && reportStatusFilter.value !== 'ALL') {
              list = list.filter(item => {
                const s = item.status || (item.cpsf ? 'CLOSED' : (item.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                return s === reportStatusFilter.value;
              });
            }

            const q = String(reportSearch.value || '').trim().toLowerCase();
            if (q) {
              list = list.filter(item => {
                const doc = String(item.docNo || '').toLowerCase();
                const cpsr = String(item.cpsrDocNo || item.cpsr?.docNo || '').toLowerCase();
                const mach = String(item.machineName || item.cpsr?.machineName || '').toLowerCase();
                const prob = String(item.problem || item.cpsr?.problem || '').toLowerCase();
                const req = String(item.reqBy || item.cpsr?.reqBy || '').toLowerCase();
                const ass = String(item.assignedTo || item.cpst?.recvBy || '').toLowerCase();
                return doc.includes(q) || cpsr.includes(q) || mach.includes(q) || prob.includes(q) || req.includes(q) || ass.includes(q);
              });
            }

            return list;
          } catch (e) {
            console.warn('Error in filteredReportCps:', e);
            return [];
          }
        });

        const reportStats = computed(() => {
          const list = filteredReportCps.value || [];
          let openTask = 0;
          let toAssign = 0;
          let inProgress = 0;
          let closed = 0;
          let overDue = 0;
          let totalDowntimeMinutes = 0;

          list.forEach(c => {
            const s = c.status || (c.cpsf ? 'CLOSED' : (c.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
            if (s === 'OPEN_TASK') openTask++;
            else if (s === 'TO_ASSIGN') toAssign++;
            else if (s === 'IN_PROGRESS') inProgress++;
            else if (s === 'CLOSED') closed++;
            else if (s === 'OVER_DUE') overDue++;
            else toAssign++;

            const dt = Number(c.downtime != null ? c.downtime : (c.cpst?.downtime != null ? c.cpst.downtime : 0)) || 0;
            totalDowntimeMinutes += dt;
          });

          const totalStatusCps = openTask + toAssign + inProgress + closed + overDue;
          const totalDowntimeHours = Math.round((totalDowntimeMinutes / 60) * 10) / 10;

          return {
            totalRequests: list.length,
            totalDowntimeMinutes,
            totalDowntimeHours,
            openTask,
            toAssign,
            inProgress,
            closed,
            overDue,
            totalStatusCps
          };
        });

        const pendingAssignCount = computed(() => {
          try {
            const list = Array.isArray(cpsList.value) ? cpsList.value : [];
            return list.filter(c => c && (c.status === 'TO_ASSIGN' || (!c.assignedTo && c.status !== 'CLOSED'))).length;
          } catch (_) {
            return 0;
          }
        });

        const cpsCountByStatus = (status) => {
          try {
            if (!Array.isArray(cpsList.value)) return 0;
            return cpsList.value.filter(c => c && c.status === status).length;
          } catch (_) {
            return 0;
          }
        };

        const filteredCpsCards = computed(() => {
          try {
            let list = Array.isArray(cpsList.value) ? cpsList.value : [];
            const st = assignCardStatus.value;
            if (st && st !== 'ALL') {
              list = list.filter(c => c && c.status === st);
            }
            const q = String(assignCardSearch.value || '').trim().toLowerCase();
            if (q) {
              list = list.filter(c => {
                if (!c) return false;
                const doc = String(c.docNo || '').toLowerCase();
                const cpsr = String(c.cpsrDocNo || c.cpsr?.docNo || '').toLowerCase();
                const mach = String(c.machineName || c.cpsr?.machineName || '').toLowerCase();
                const prob = String(c.problem || c.cpsr?.problem || '').toLowerCase();
                const req = String(c.reqBy || c.cpsr?.reqBy || '').toLowerCase();
                const ass = String(c.assignedTo || '').toLowerCase();
                return doc.includes(q) || cpsr.includes(q) || mach.includes(q) || prob.includes(q) || req.includes(q) || ass.includes(q);
              });
            }
            return list;
          } catch (err) {
            console.warn('Error in filteredCpsCards:', err);
            return [];
          }
        });

        const currentSplitCount = computed(() => {
          if (splitTab.value === 'chain') return chainList.value.length;
          if (splitTab.value === 'cpsr') return cpsrList.value.length;
          if (splitTab.value === 'cpst') return cpstList.value.length;
          if (splitTab.value === 'cpsf') return cpsfList.value.length;
          return requestsList.value.length;
        });

        // Requests Master Table
        const requestsList = ref([]);
        const reqFilter = ref({ search: '', chkStatus: 'ALL', printTech: 'ALL', priority: 'ALL' });
        const selectedTicket = ref(null);

        // Machines
        const machineCatalog = ref({});
        const machinesFlatList = ref([]);
        const machineTechFilter = ref('ALL');
        const machineSearch = ref('');
        const newMachine = ref({ tech: '', name: '', code: '' });

        // Employees
        const employeesList = ref([]);
        const empSearch = ref('');
        const empDeptFilter = ref('ALL');
        const newEmployee = ref({ mnv: '', name: '', dept: 'Sản Xuất', area: '', role: 'Operator' });

        // Users
        const usersList = ref([]);
        const userSearch = ref('');
        const userRoleFilter = ref('ALL');
        const newUser = ref({
          username: '',
          password: 'Checkpoint@123',
          fullName: '',
          email: '',
          role: 'EMPLOYEE',
          permissions: {
            canCreateRequest: true,
            canViewKpi: false,
            canAccessControlPanel: false
          }
        });

        // Existing Datasets Management
        const activeDataset = ref('weekly-requests');
        const datasetSearch = ref('');
        const weeklyRequestsList = ref([]);
        const defectLogsList = ref([]);
        const actionPlansList = ref([]);
        const requestersList = ref([]);

        // Computed
        const currentTabLabel = computed(() => {
          const map = {
            overview: 'Tổng quan & Phân tích',
            'assign-tasks': 'Phân Công Kỹ Thuật (Cards)',
            requests: 'Quản Lý Phiếu Kỹ Thuật',
            'report-technical': 'Report Technical',
            machines: 'Máy móc & Thiết bị',
            employees: 'Nhân sự & Phân xưởng',
            users: 'Danh sách User & Phân quyền',
            'existing-data': 'Quản lý dữ liệu hiện có'
          };
          return map[activeTab.value] || 'Quản Lý Phiếu Kỹ Thuật';
        });

        const userInitials = computed(() => {
          try {
            const user = currentUser.value || {};
            const rawName = user.fullName || user.username || 'CP';
            const name = String(rawName).trim();
            if (!name) return 'CP';
            const parts = name.split(/\s+/).filter(Boolean);
            if (parts.length > 1) {
              const first = parts[0]?.[0] || '';
              const last = parts[parts.length - 1]?.[0] || '';
              const combined = (first + last).toUpperCase();
              if (combined) return combined;
            }
            return name.substring(0, 2).toUpperCase() || 'CP';
          } catch (_) {
            return 'CP';
          }
        });

        const distinctDepts = computed(() => {
          return [...new Set(employeesList.value.map(e => e.dept).filter(Boolean))];
        });

        // Helpers
        const showToast = (msg, isError = false) => {
          const container = document.getElementById('toast-container');
          if (!container) return;
          const toast = document.createElement('div');
          toast.className = 'px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white w-full transition-all duration-300 ' + (isError ? 'bg-red-600' : 'bg-slate-900 border border-slate-700');
          toast.innerHTML = isError ? ('❌ ' + msg) : ('✨ ' + msg);
          container.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
          }, 3200);
        };

        const openModal = (id) => {
          if (id === 'modal-ticket-detail') showTicketDetailModal.value = true;
          else if (id === 'modal-add-machine') showAddMachineModal.value = true;
          else if (id === 'modal-add-employee') showAddEmployeeModal.value = true;
          else if (id === 'modal-add-user') showAddUserModal.value = true;
          else if (id === 'modal-excel') showExcelModal.value = true;
          else if (id === 'modal-assign-task') showAssignModal.value = true;
          else document.getElementById(id)?.classList.add('show');
        };

        const closeModal = (id) => {
          if (id === 'modal-ticket-detail') showTicketDetailModal.value = false;
          else if (id === 'modal-add-machine') showAddMachineModal.value = false;
          else if (id === 'modal-add-employee') showAddEmployeeModal.value = false;
          else if (id === 'modal-add-user') showAddUserModal.value = false;
          else if (id === 'modal-excel') showExcelModal.value = false;
          else if (id === 'modal-assign-task') showAssignModal.value = false;
          else document.getElementById(id)?.classList.remove('show');
        };

        const closeAssignModal = () => {
          showAssignModal.value = false;
        };

        const triggerUpload = (id) => document.getElementById(id)?.click();

        const get4MLabel = (k) => {
          const map = { MAN: 'Con người (MAN)', MACHINE: 'Máy móc (MACHINE)', MATERIAL: 'Vật tư (MATERIAL)', METHOD: 'Phương pháp (METHOD)' };
          return map[k] || k;
        };

        const getPercent = (v, total) => {
          if (!total || total === 0) return 0;
          return Math.round((v / total) * 100);
        };

        const setTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark', 'dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          }
        };

        const toggleTheme = () => {
          setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        const formatCpsStatus = (s) => {
          if (!s) return 'Chờ phân công';
          const map = {
            TO_ASSIGN: 'Chờ phân công',
            IN_PROGRESS: 'Đang xử lý',
            OVER_DUE: 'Quá hạn',
            CLOSED: 'Đã đóng',
            OPEN_TASK: 'Mở'
          };
          return map[s] || String(s);
        };

        const getCardBorderClass = (s) => {
          if (!s) return 'border-slate-700/60 hover:border-slate-500';
          if (s === 'TO_ASSIGN') return 'border-amber-500/40 hover:border-amber-500';
          if (s === 'IN_PROGRESS') return 'border-sky-500/40 hover:border-sky-500';
          if (s === 'OVER_DUE') return 'border-rose-500/40 hover:border-rose-500';
          if (s === 'CLOSED') return 'border-emerald-500/40 hover:border-emerald-500';
          return 'border-slate-700/60 hover:border-slate-500';
        };

        const formatDateTimeDisplay = (val) => {
          if (!val) return '-';
          try {
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
          } catch(e) {
            return val;
          }
        };

        const openAssignModal = (cps) => {
          if (!cps) return;
          const raw = toPlainObject(cps);
          selectedCpsForAssign.value = raw;
          let initialDeadline = '';
          if (raw.deadline) {
            try {
              const d = new Date(raw.deadline);
              if (!isNaN(d.getTime())) {
                const pad = (n) => String(n).padStart(2, '0');
                initialDeadline = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
              }
            } catch (_) {}
          }

          let foundEmp = '';
          if (raw.assignedTo && employeesList.value.length > 0) {
            foundEmp = employeesList.value.find(e => {
              const fullStr = e.name + ' - ' + e.mnv;
              return fullStr === raw.assignedTo || e.name === raw.assignedTo || e.mnv === raw.assignedToId;
            }) || '';
          }

          assignForm.value = {
            employee: foundEmp || '',
            deadline: initialDeadline,
            notes: raw.notes || ''
          };
          showAssignModal.value = true;
          if (employeesList.value.length === 0) {
            loadEmployees();
          }
        };

        const closeAssignModal = () => {
          showAssignModal.value = false;
        };

        const submitAssignTask = async () => {
          if (!selectedCpsForAssign.value) return;
          if (!assignForm.value.employee) {
            showToast('Vui lòng chọn nhân viên kỹ thuật tiếp nhận', true);
            return;
          }
          isAssigning.value = true;
          try {
            const emp = assignForm.value.employee;
            const empName = typeof emp === 'object' ? (emp.name + (emp.mnv ? ' - ' + emp.mnv : '')) : emp;
            const empId = typeof emp === 'object' ? (emp.mnv || emp.id) : '';

            const cpsTarget = selectedCpsForAssign.value.docNo || selectedCpsForAssign.value.id || (selectedCpsForAssign.value.cpsrDocNo ? selectedCpsForAssign.value.cpsrDocNo.replace('CPSR-', 'CPS-') : '');
            const payload = {
              assignedTo: empName,
              assignee: empName,
              assignedToId: empId,
              employeeId: empId,
              deadline: assignForm.value.deadline ? new Date(assignForm.value.deadline).toISOString() : null,
              notes: assignForm.value.notes || '',
              status: 'IN_PROGRESS'
            };

            let res = await fetch('/api/cps/' + encodeURIComponent(cpsTarget) + '/assign', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (!res.ok && (res.status === 404 || res.status === 405)) {
              res = await fetch('/api/cps/' + encodeURIComponent(cpsTarget) + '/assign', {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                credentials: 'include',
                body: JSON.stringify(payload)
              });
            }

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || ('Lỗi máy chủ (' + res.status + ')'));
            }

            showToast('Đã phân công ' + empName + ' cho phiếu ' + cpsTarget + ' (IN_PROGRESS)');
            showAssignModal.value = false;
            await loadAllSplitData();
          } catch (err) {
            showToast('Lỗi phân công: ' + err.message, true);
          } finally {
            isAssigning.value = false;
          }
        };

        // =====================================================================
        // CRUD & LINK METHODS FOR CPSR, CPST, CPSF, CPS (MODAL & ACTIONS)
        // =====================================================================
        const openEditModal = (type, data) => {
          if (!data) return;
          const raw = toPlainObject(data);
          let deadlineStr = '';
          if (raw.deadline) {
            try {
              const d = new Date(raw.deadline);
              if (!isNaN(d.getTime())) {
                const pad = (n) => String(n).padStart(2, '0');
            deadlineStr = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
              }
            } catch (_) {}
          }

          editForm.value = {
            type: type,
            docNo: raw.docNo || raw.id || '',
            cpsrDocNo: raw.cpsrDocNo || raw.cpsr?.docNo || '',
            assignedTo: raw.assignedTo || raw.cpst?.recvBy || '',
            priority: raw.priority || raw.cpsr?.priority || 'Khác',
            status: raw.status || (raw.cpsf ? 'CLOSED' : (raw.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN')),
            deadline: deadlineStr,
            notes: raw.notes || '',
            // CPSR
            reqBy: raw.reqBy || raw.cpsr?.reqBy || '',
            machineName: raw.machineName || raw.cpsr?.machineName || '',
            printTech: raw.printTech || raw.cpsr?.printTech || '',
            machineStatus: raw.machineStatus || raw.cpsr?.machineStatus || '',
            problem: raw.problem || raw.cpsr?.problem || '',
            // CPST
            recvBy: raw.recvBy || raw.cpst?.recvBy || raw.assignedTo || '',
            chkStatus: raw.chkStatus || raw.cpst?.chkStatus || 'Đã khắc phục',
            downtime: raw.downtime != null ? raw.downtime : (raw.cpst?.downtime != null ? raw.cpst.downtime : 0),
            rootCause: raw.rootCause || raw.cpst?.rootCause || '',
            actionTaken: raw.actionTaken || raw.cpst?.actionTaken || '',
            // CPSF
            chkQuality: raw.chkQuality || raw.cpsf?.chkQuality || 'Đạt',
            workOrder: raw.workOrder || raw.cpsf?.workOrder || '',
            woTotalQty: raw.woTotalQty != null ? raw.woTotalQty : (raw.cpsf?.woTotalQty != null ? raw.cpsf.woTotalQty : 0),
            wasteQty: raw.wasteQty != null ? raw.wasteQty : (raw.cpsf?.wasteQty != null ? raw.cpsf.wasteQty : 0),
            wasteUnit: raw.wasteUnit || raw.cpsf?.wasteUnit || 'PCS',
            prodMgr: raw.prodMgr || raw.cpsf?.prodMgr || ''
          };
          showEditModal.value = true;
        };

        const closeEditModal = () => {
          showEditModal.value = false;
        };

        const submitEditTicket = async () => {
          if (!editForm.value.docNo) return;
          isSavingEdit.value = true;
          try {
            const type = editForm.value.type;
            const docNo = editForm.value.docNo;
            const url = "/api/" + type + "/" + encodeURIComponent(docNo);
            let body = {};
            if (type === 'cps') {
              body = {
                assignedTo: editForm.value.assignedTo,
                assignee: editForm.value.assignedTo,
                priority: editForm.value.priority,
                status: editForm.value.status,
                deadline: editForm.value.deadline ? new Date(editForm.value.deadline).toISOString() : null,
                notes: editForm.value.notes
              };
            } else if (type === 'cpsr') {
              body = {
                reqBy: editForm.value.reqBy,
                machineName: editForm.value.machineName,
                printTech: editForm.value.printTech,
                machineStatus: editForm.value.machineStatus,
                priority: editForm.value.priority,
                problem: editForm.value.problem
              };
            } else if (type === 'cpst') {
              body = {
                recvBy: editForm.value.recvBy,
                chkStatus: editForm.value.chkStatus,
                downtime: Number(editForm.value.downtime) || 0,
                rootCause: editForm.value.rootCause,
                actionTaken: editForm.value.actionTaken
              };
            } else if (type === 'cpsf') {
              body = {
                chkQuality: editForm.value.chkQuality,
                workOrder: editForm.value.workOrder,
                woTotalQty: Number(editForm.value.woTotalQty) || 0,
                wasteQty: Number(editForm.value.wasteQty) || 0,
                wasteUnit: editForm.value.wasteUnit,
                prodMgr: editForm.value.prodMgr
              };
            }

            const res = await fetch(url, {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(body)
            });

            if (res.ok) {
              showToast("Đã cập nhật phiếu " + docNo + " thành công!");
              showEditModal.value = false;
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Cập nhật phiếu thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi kết nối: ' + e.message, true);
          } finally {
            isSavingEdit.value = false;
          }
        };

        const deleteCpsRecord = async (cps) => {
          if (!cps) return;
          const raw = toPlainObject(cps);
          const docNo = raw.docNo || raw.id;
          if (!confirm("Bạn có chắc chắn muốn xóa phiếu CPS " + docNo + "?")) return;
          try {
            const res = await fetch("/api/cps/" + encodeURIComponent(docNo), {
              method: 'DELETE',
              headers: getAuthHeaders(),
              credentials: 'include'
            });
            if (res.ok) {
              showToast("Đã xóa phiếu CPS " + docNo + " thành công!");
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Xóa phiếu thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi xóa: ' + e.message, true);
          }
        };

        const openCreateCpsModal = () => {
          createCpsForm.value = {
            cpsrDocNo: availableCpsrForCps.value[0]?.docNo || '',
            assignedTo: '',
            priority: 'Bình thường',
            deadline: '',
            notes: ''
          };
          showCreateCpsModal.value = true;
        };

        const closeCreateCpsModal = () => {
          showCreateCpsModal.value = false;
        };

        const submitCreateCps = async () => {
          if (!createCpsForm.value.cpsrDocNo) {
            showToast('Vui lòng chọn phiếu CPSR gốc!', true);
            return;
          }
          isCreatingCps.value = true;
          try {
            const payload = {
              cpsrDocNo: createCpsForm.value.cpsrDocNo,
              assignedTo: createCpsForm.value.assignedTo || undefined,
              assignee: createCpsForm.value.assignedTo || undefined,
              priority: createCpsForm.value.priority || 'Bình thường',
              deadline: createCpsForm.value.deadline ? new Date(createCpsForm.value.deadline).toISOString() : undefined,
              notes: createCpsForm.value.notes || undefined
            };

            const res = await fetch('/api/cps', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              const data = await res.json();
              showToast("Đã tạo thành công phiếu CPS " + (data.docNo || "") + "!");
              showCreateCpsModal.value = false;
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Tạo phiếu CPS thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi tạo CPS: ' + e.message, true);
          } finally {
            isCreatingCps.value = false;
          }
        };

        const openLinkModal = (cps) => {
          let target = cps;
          if (!target && chainList.value && chainList.value.length > 0) {
            target = chainList.value[0];
          }
          if (!target) {
            showToast('Chưa có phiếu CPS nào để ghép nối!', true);
            return;
          }
          const raw = toPlainObject(target);
          linkForm.value = {
            cpsDocNo: raw.docNo || (raw.cpsr?.docNo ? raw.cpsr.docNo.replace('CPSR-', 'CPS-') : raw.id || ''),
            cpsrDocNo: raw.cpsrDocNo || raw.cpsr?.docNo || '',
            machineName: raw.machineName || raw.cpsr?.machineName || '',
            problem: raw.problem || raw.cpsr?.problem || '',
            currentCpst: raw.cpstDocNo || raw.cpst?.docNo || '',
            currentCpsf: raw.cpsfDocNo || raw.cpsf?.docNo || '',
            selectedCpst: '',
            selectedCpsf: ''
          };
          showLinkModal.value = true;
        };

        const onSelectLinkCps = (docNo) => {
          const found = (chainList.value || []).find(c => c && (c.docNo === docNo || c.id === docNo));
          if (found) {
            const raw = toPlainObject(found);
            linkForm.value.cpsDocNo = raw.docNo || raw.id;
            linkForm.value.cpsrDocNo = raw.cpsrDocNo || raw.cpsr?.docNo || '';
            linkForm.value.machineName = raw.machineName || raw.cpsr?.machineName || '';
            linkForm.value.problem = raw.problem || raw.cpsr?.problem || '';
            linkForm.value.currentCpst = raw.cpstDocNo || raw.cpst?.docNo || '';
            linkForm.value.currentCpsf = raw.cpsfDocNo || raw.cpsf?.docNo || '';
            linkForm.value.selectedCpst = '';
            linkForm.value.selectedCpsf = '';
          }
        };

        const closeLinkModal = () => {
          showLinkModal.value = false;
        };

        const submitLinkTickets = async () => {
          if (!linkForm.value.cpsDocNo) return;
          isLinking.value = true;
          try {
            const payload = {};
            if (linkForm.value.selectedCpst) payload.cpstDocNo = linkForm.value.selectedCpst;
            if (linkForm.value.selectedCpsf) payload.cpsfDocNo = linkForm.value.selectedCpsf;

            const res = await fetch("/api/cps/" + encodeURIComponent(linkForm.value.cpsDocNo) + "/link", {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              showToast("Đã ghép nối phiếu CPS " + linkForm.value.cpsDocNo + " thành công!");
              showLinkModal.value = false;
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Ghép nối thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi ghép nối: ' + e.message, true);
          } finally {
            isLinking.value = false;
          }
        };

        const unlinkItem = async (type) => {
          if (!linkForm.value.cpsDocNo) return;
          try {
            const payload = type === 'cpst' ? { unlinkCpst: true } : { unlinkCpsf: true };
            const res = await fetch("/api/cps/" + encodeURIComponent(linkForm.value.cpsDocNo) + "/unlink", {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              showToast("Đã hủy ghép nối " + type.toUpperCase() + " thành công!");
              if (type === 'cpst') linkForm.value.currentCpst = '';
              if (type === 'cpsf') linkForm.value.currentCpsf = '';
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Hủy ghép nối thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi hủy ghép: ' + e.message, true);
          }
        };

        const onReportFilterChange = () => {
          nextTick(() => {
            renderReportChart();
            initOrUpdateReportTable();
          });
        };

        const renderReportChart = () => {
          const canvas = document.getElementById('chart-report-technical-donut');
          if (!canvas || typeof Chart === 'undefined') return;

          if (reportChartInstance) {
            reportChartInstance.destroy();
            reportChartInstance = null;
          }

          const stats = reportStats.value;
          const isDark = currentTheme.value === 'dark';
          const dataVals = [stats.openTask, stats.toAssign, stats.inProgress, stats.closed, stats.overDue];
          const allZeros = dataVals.every(v => v === 0);

          reportChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: ['OPEN_TASK', 'TO_ASSIGN', 'IN_PROGRESS', 'CLOSED', 'OVER_DUE'],
              datasets: [{
                data: allZeros ? [1] : dataVals,
                backgroundColor: allZeros ? ['#94a3b8'] : ['#64748b', '#f59e0b', '#0284c7', '#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: isDark ? '#0f172a' : '#ffffff',
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '72%',
              animation: { duration: 300 },
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: !allZeros,
                  callbacks: {
                    label: function(ctx) {
                      const val = ctx.raw || 0;
                      const total = stats.totalStatusCps || 1;
                      const pct = Math.round((val / total) * 100);
                      return " " + ctx.label + ": " + val + " phiếu (" + pct + "%)";
                    }
                  }
                }
              }
            }
          });
        };

        const initOrUpdateReportTable = () => {
          const el = document.getElementById('tabulator-report-technical');
          if (!el || typeof Tabulator === 'undefined') return;

          const data = filteredReportCps.value || [];
          const columns = [
            {
              title: 'Mã CPS',
              field: 'docNo',
              minWidth: 140,
              formatter: cell => {
                const r = cell.getRow().getData();
                const code = r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '-'));
                return '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + code + '</span>';
              }
            },
            {
              title: 'Trạng Thái',
              field: 'status',
              minWidth: 130,
              hozAlign: 'center',
              formatter: cell => {
                const r = cell.getRow().getData();
                const s = r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                if (s === 'TO_ASSIGN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">⏳ TO_ASSIGN</span>';
                if (s === 'IN_PROGRESS') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30">⚡ IN_PROGRESS</span>';
                if (s === 'OVER_DUE') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">⚠️ OVER_DUE</span>';
                if (s === 'CLOSED') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">✅ CLOSED</span>';
                return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30">📋 ' + s + '</span>';
              }
            },
            {
              title: 'Mã CPSR / Ngày',
              minWidth: 150,
              formatter: cell => {
                const r = cell.getRow().getData();
                const doc = r.cpsr?.docNo || r.cpsrDocNo || '';
                const d = r.cpsr?.reqDate || r.reqDate || '';
                return '<div><span class="font-mono font-bold text-slate-800 dark:text-slate-200">' + doc + '</span><span class="block text-[10px] text-slate-500">' + d + '</span></div>';
              }
            },
            {
              title: 'Người YC / Máy',
              minWidth: 160,
              formatter: cell => {
                const r = cell.getRow().getData();
                const req = r.cpsr?.reqBy || r.reqBy || '-';
                const mach = r.cpsr?.machineName || r.machineName || '';
                const tech = r.cpsr?.printTech || r.printTech || '';
                return '<div><strong class="text-slate-900 dark:text-slate-100">' + req + '</strong><span class="block text-[10px] text-slate-500 font-mono">' + tech + ' ' + mach + '</span></div>';
              }
            },
            {
              title: 'Sự Cố',
              minWidth: 180,
              formatter: cell => {
                const r = cell.getRow().getData();
                const p = r.cpsr?.problem || r.problem || '-';
                return '<span class="truncate block max-w-xs text-xs text-slate-700 dark:text-slate-300">' + p + '</span>';
              }
            },
            {
              title: 'KTV Tiếp Nhận',
              minWidth: 140,
              formatter: cell => {
                const r = cell.getRow().getData();
                const ass = r.assignedTo || r.cpst?.recvBy;
                if (!ass) return '<span class="text-amber-600 dark:text-amber-400 italic text-[11px]">Chưa giao</span>';
                return '<div class="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"><i class="fa-solid fa-user-check text-[10px] text-emerald-600 dark:text-emerald-400"></i> ' + ass + '</div>';
              }
            },
            {
              title: 'Downtime',
              minWidth: 90,
              hozAlign: 'center',
              formatter: cell => {
                const r = cell.getRow().getData();
                const dt = r.downtime != null ? r.downtime : r.cpst?.downtime;
                if (dt == null || dt === '') return '<span class="text-slate-400">-</span>';
                return '<span class="font-mono font-bold text-amber-700 dark:text-amber-400">' + dt + 'p</span>';
              }
            },
            {
              title: 'Mã CPST',
              minWidth: 130,
              formatter: cell => {
                const r = cell.getRow().getData();
                const doc = r.cpst?.docNo || r.cpstDocNo;
                if (!doc) return '<span class="text-slate-400 text-[10px] italic">Chưa có</span>';
                return '<span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">' + doc + '</span>';
              }
            },
            {
              title: 'Mã CPSF',
              minWidth: 130,
              formatter: cell => {
                const r = cell.getRow().getData();
                const doc = r.cpsf?.docNo || r.cpsfDocNo;
                if (!doc) return '<span class="text-slate-400 text-[10px] italic">Chưa có</span>';
                return '<span class="font-mono font-bold text-purple-700 dark:text-purple-400">' + doc + '</span>';
              }
            },
            {
              title: 'Thao Tác',
              hozAlign: 'right',
              minWidth: 100,
              headerSort: false,
              formatter: () => '<button class="btn-report-view px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold cursor-pointer">Xem</button>',
              cellClick: (e, cell) => {
                const r = cell.getRow().getData();
                if (e.target.closest('.btn-report-view')) {
                  openChainDetailModal(r);
                }
              }
            }
          ];

          if (reportTableInstance) {
            safeDestroy(reportTableInstance);
            reportTableInstance = null;
          }

          try {
            reportTableInstance = new Tabulator(el, {
              data: toPlainObject(data),
              columns: columns,
              layout: 'fitColumns',
              responsiveLayout: false,
              pagination: 'local',
              paginationSize: 15,
              paginationSizeSelector: [10, 15, 25, 50],
              height: 'auto',
              placeholder: '<div class="p-8 text-center text-slate-400 text-xs">Không tìm thấy phiếu kỹ thuật nào trong khoảng thời gian đã chọn</div>'
            });
          } catch (err) {
            console.warn('Error init report table:', err);
          }
        };

        const exportReportTechnicalExcel = () => {
          const rows = filteredReportCps.value.map(r => ({
            'Mã CPS': r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '')),
            'Trạng Thái': r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN')),
            'Mã CPSR': r.cpsr?.docNo || r.cpsrDocNo || '',
            'Ngày Yêu Cầu': r.cpsr?.reqDate || r.reqDate || '',
            'Người Yêu Cầu': r.cpsr?.reqBy || r.reqBy || '',
            'Tên Máy': r.cpsr?.machineName || r.machineName || '',
            'Công Nghệ': r.cpsr?.printTech || r.printTech || '',
            'Sự Cố': r.cpsr?.problem || r.problem || '',
            'KTV Phụ Trách': r.assignedTo || r.cpst?.recvBy || '',
            'Hạn Chót (Deadline)': r.deadline || '',
            'Downtime (Phút)': r.downtime != null ? r.downtime : (r.cpst?.downtime != null ? r.cpst.downtime : ''),
            'Mã CPST': r.cpst?.docNo || r.cpstDocNo || '',
            'Trạng Thái KT': r.chkStatus || r.cpst?.chkStatus || '',
            'Mã CPSF': r.cpsf?.docNo || r.cpsfDocNo || '',
            'Chất Lượng In': r.chkQuality || r.cpsf?.chkQuality || '',
            'Work Order': r.workOrder || r.cpsf?.workOrder || ''
          }));

          if (typeof XLSX === 'undefined') {
            showToast('Thư viện XLSX chưa tải xong', true);
            return;
          }

          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Report_Technical');
          const from = reportDateFrom.value || 'All';
          const to = reportDateTo.value || 'All';
          XLSX.writeFile(wb, "Report_Technical_" + from + "_den_" + to + ".xlsx");
          showToast('Đã xuất file Excel báo cáo kỹ thuật!');
        };

        const loadCpsData = async () => {
          try {
            const res = await fetch('/api/cps', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                cpsList.value = data;
              }
            }
          } catch (e) {
            console.warn('Could not load cps data', e);
          }
        };

        const switchTab = (tab) => {
          activeTab.value = tab;
          sidebarOpen.value = false;
          showTicketDetailModal.value = false;
          showAddMachineModal.value = false;
          showAddEmployeeModal.value = false;
          showAddUserModal.value = false;
          showExcelModal.value = false;
          showAssignModal.value = false;

          nextTick(() => {
            if (tab === 'overview') loadStats();
            if (tab === 'assign-tasks') {
              loadCpsData();
              if (employeesList.value.length === 0) loadEmployees();
            }
            if (tab === 'requests') {
              loadAllSplitData();
              if (splitTab.value === 'legacy') {
                if (requestsList.value.length === 0) loadRequests();
                else { initOrUpdateRequestsTable(); safeRedraw(reqTable); }
              } else {
                initOrUpdateSplitTable();
                safeRedraw(splitTable);
              }
            }
            if (tab === 'machines') {
              if (machinesFlatList.value.length === 0) loadMachines();
              else { initOrUpdateMachinesTable(); safeRedraw(machinesTable); }
            }
            if (tab === 'employees') {
              if (employeesList.value.length === 0) loadEmployees();
              else { initOrUpdateEmployeesTable(); safeRedraw(empTable); }
            }
            if (tab === 'users') {
              if (usersList.value.length === 0) loadUsers();
              else { initOrUpdateUsersTable(); safeRedraw(usersTable); }
            }
            if (tab === 'existing-data') {
              loadCurrentDataset();
            }
            if (tab === 'report-technical') {
              if (!reportDateFrom.value && !reportDateTo.value) {
                initReportDates();
              }
              loadAllSplitData().then(() => {
                nextTick(() => {
                  renderReportChart();
                  initOrUpdateReportTable();
                });
              });
            }
          });
        };

        // =====================================================================
        // TABULATOR: SPLIT FORMS (CPSR, CPST, CPSF, CHAIN 1-1-1 & CPS)
        // =====================================================================
        const loadChainData = async () => {
          try {
            // First check /api/cps for enriched chain and assignment records
            let res = await fetch('/api/cps', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                chainList.value = data;
                cpsList.value = data;
                if (splitTab.value === 'chain') initOrUpdateSplitTable();
                return;
              }
            }
            // Fallback to /api/cpsr-chain
            res = await fetch('/api/cpsr-chain', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              chainList.value = await res.json();
              if (splitTab.value === 'chain') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load chain data', e); }
        };

        const loadCpsrData = async () => {
          try {
            const res = await fetch('/api/cpsr', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              cpsrList.value = await res.json();
              if (splitTab.value === 'cpsr') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load cpsr data', e); }
        };

        const loadCpstData = async () => {
          try {
            const res = await fetch('/api/cpst', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              cpstList.value = await res.json();
              if (splitTab.value === 'cpst') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load cpst data', e); }
        };

        const loadCpsfData = async () => {
          try {
            const res = await fetch('/api/cpsf', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              cpsfList.value = await res.json();
              if (splitTab.value === 'cpsf') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load cpsf data', e); }
        };

        const loadAllSplitData = async () => {
          await Promise.all([loadCpsData(), loadChainData(), loadCpsrData(), loadCpstData(), loadCpsfData()]);
          if (activeTab.value === 'report-technical') {
            onReportFilterChange();
          }
        };

        const switchSplitTab = (tab) => {
          splitTab.value = tab;
          splitFilter.value.search = '';
          splitFilter.value.status = 'ALL';
          nextTick(() => {
            if (tab === 'legacy') {
              initOrUpdateRequestsTable();
              reqTable?.redraw(true);
            } else {
              initOrUpdateSplitTable();
            }
          });
        };

        const initOrUpdateSplitTable = () => {
          const el = document.getElementById('tabulator-split-forms');
          if (!el || typeof Tabulator === 'undefined') return;

          let data = [];
          let columns = [];

          if (splitTab.value === 'chain') {
            data = chainList.value;
            columns = [
              {
                title: 'Mã CPS',
                field: 'docNo',
                minWidth: 140,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const code = r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '-'));
                  return '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + code + '</span>';
                }
              },
              {
                title: 'Trạng Thái Chuỗi',
                field: 'status',
                minWidth: 130,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const s = r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                  if (s === 'TO_ASSIGN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">⏳ TO_ASSIGN</span>';
                  if (s === 'IN_PROGRESS') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30">⚡ IN_PROGRESS</span>';
                  if (s === 'OVER_DUE') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">⚠️ OVER_DUE</span>';
                  if (s === 'CLOSED') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">✅ CLOSED</span>';
                  if (s === 'OPEN_TASK') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30">📋 OPEN_TASK</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">' + s + '</span>';
                }
              },
              {
                title: 'Mã CPSR',
                field: 'cpsr.docNo',
                minWidth: 140,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  return '<span class="font-mono font-bold text-slate-800 dark:text-slate-200">' + (r.cpsr?.docNo || r.cpsrDocNo || '') + '</span>';
                }
              },
              {
                title: 'Thời Gian',
                field: 'cpsr.reqDate',
                minWidth: 120,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const d = r.cpsr?.reqDate || r.reqDate || '';
                  const t = r.cpsr?.reqTime || r.reqTime || '';
                  return '<div class="text-[11px] text-slate-800 dark:text-slate-300 font-medium">' + d + ' <span class="font-mono text-slate-500 block text-[10px]">' + t + '</span></div>';
                }
              },
              {
                title: 'Người YC / Máy In',
                field: 'cpsr.reqBy',
                minWidth: 160,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const req = r.cpsr?.reqBy || r.reqBy || '';
                  const tech = r.cpsr?.printTech || r.printTech || '';
                  const mach = r.cpsr?.machineName || r.machineName || '';
                  return '<div><strong class="text-slate-900 dark:text-slate-100">' + req + '</strong><span class="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">' + tech + ' - ' + mach + '</span></div>';
                }
              },
              {
                title: 'Nhân Viên KT',
                field: 'assignedTo',
                minWidth: 140,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const name = r.assignedTo || r.cpst?.recvBy;
                  if (!name) return '<span class="text-amber-600 dark:text-amber-400/80 italic text-[11px] font-semibold">Chưa giao</span>';
                  return '<div class="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"><i class="fa-solid fa-user-check text-[10px] text-emerald-600 dark:text-emerald-400"></i> ' + name + '</div>';
                }
              },
              {
                title: 'Deadline',
                field: 'deadline',
                minWidth: 120,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  if (!r.deadline) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return '<span class="font-mono text-[11px] text-sky-700 dark:text-sky-300 font-semibold">' + formatDateTimeDisplay(r.deadline) + '</span>';
                }
              },
              {
                title: 'Downtime',
                field: 'downtime',
                minWidth: 95,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const dt = r.downtime != null ? r.downtime : r.cpst?.downtime;
                  if (dt == null || dt === '') return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return '<span class="font-mono font-bold text-amber-700 dark:text-amber-400">' + dt + ' phút</span>';
                }
              },
              {
                title: 'Tỉ Lệ Phế',
                field: 'wastePercent',
                minWidth: 90,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const wp = r.wastePercent || r.cpsf?.wastePercent;
                  if (!wp) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return '<span class="font-mono font-bold text-rose-700 dark:text-rose-400">' + wp + '</span>';
                }
              },
              {
                title: 'Mã CPST (Phản Hồi)',
                field: 'cpst.docNo',
                minWidth: 130,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const doc = r.cpst?.docNo || r.cpstDocNo;
                  if (!doc) return '<span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Chưa phản hồi</span>';
                  return '<span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">' + doc + '</span>';
                }
              },
              {
                title: 'Trạng Thái KT',
                field: 'cpst.chkStatus',
                minWidth: 110,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const s = r.chkStatus || r.cpst?.chkStatus || '';
                  if (!s) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  if (s === 'Đã khắc phục') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Đã khắc phục</span>';
                  if (s === 'Hư hỏng nặng') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">Hư hỏng nặng</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">' + s + '</span>';
                }
              },
              {
                title: 'Mã CPSF (Bàn Giao)',
                field: 'cpsf.docNo',
                minWidth: 130,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const doc = r.cpsf?.docNo || r.cpsfDocNo;
                  if (!doc) return '<span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Chưa bàn giao</span>';
                  return '<span class="font-mono font-bold text-purple-700 dark:text-purple-400">' + doc + '</span>';
                }
              },
              {
                title: 'Chất Lượng In',
                field: 'cpsf.chkQuality',
                minWidth: 90,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const q = r.chkQuality || r.cpsf?.chkQuality || '';
                  if (!q) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return q === 'Đạt' ? '<span class="text-emerald-700 dark:text-emerald-400 font-bold">ĐẠT</span>' : '<span class="text-rose-700 dark:text-rose-400 font-bold">CHƯA ĐẠT</span>';
                }
              },
              {
                title: 'Tiến Độ Chuỗi',
                hozAlign: 'center',
                minWidth: 100,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const c = ((r.cpsr || r.cpsrDocNo) ? 1 : 0) + ((r.cpst || r.cpstDocNo) ? 1 : 0) + ((r.cpsf || r.cpsfDocNo) ? 1 : 0);
                  if (c === 3) return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">🟢 3/3</span>';
                  if (c === 2) return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">🟡 2/3</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30">🔵 1/3</span>';
                }
              },
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 260,
                headerSort: false,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  let h = '<div class="flex items-center justify-end gap-1">';
                  h += '<button class="btn-chain-assign px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 text-[11px] font-bold transition cursor-pointer" title="Phân công KTV"><i class="fa-solid fa-user-gear"></i> Giao</button>';
                  h += '<button class="btn-chain-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa phiếu CPS"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>';
                  h += '<button class="btn-chain-link px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 text-[11px] font-bold transition cursor-pointer" title="Ghép nối CPST/CPSF"><i class="fa-solid fa-link"></i> Ghép</button>';
                  h += '<button class="btn-chain-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold transition cursor-pointer" title="Xem chi tiết chuỗi 1-1-1"><i class="fa-solid fa-eye"></i></button>';
                  if (!r.cpst && !r.cpstDocNo) {
                    h += '<a href="/technical-feedback?cpsr=' + encodeURIComponent(r.cpsr?.docNo || r.cpsrDocNo || '') + '" target="_blank" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition cursor-pointer shadow-xs">+ CPST</a>';
                  } else if (!r.cpsf && !r.cpsfDocNo) {
                    h += '<a href="/confirm-request?cpst=' + encodeURIComponent(r.cpst?.docNo || r.cpstDocNo || '') + '" target="_blank" class="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition cursor-pointer shadow-xs">+ CPSF</a>';
                  }
                  h += '<button class="btn-chain-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa phiếu CPS"><i class="fa-solid fa-trash-can"></i></button>';
                  h += '</div>';
                  return h;
                },
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-chain-assign')) {
                    openAssignModal(r);
                  } else if (e.target.closest('.btn-chain-edit')) {
                    openEditModal('cps', r);
                  } else if (e.target.closest('.btn-chain-link')) {
                    openLinkModal(r);
                  } else if (e.target.closest('.btn-chain-view')) {
                    openChainDetailModal(r);
                  } else if (e.target.closest('.btn-chain-del')) {
                    deleteCpsRecord(r);
                  }
                }
              }
            ];
          } else if (splitTab.value === 'cpsr') {
            data = cpsrList.value;
            columns = [
              { title: 'Số Phiếu', field: 'docNo', minWidth: 140, formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Ngày Giờ', field: 'reqDate', minWidth: 120, formatter: cell => { const r = cell.getRow().getData(); return r.reqDate + ' ' + (r.reqTime || ''); } },
              { title: 'Người Yêu Cầu', field: 'reqBy', minWidth: 150 },
              { title: 'Công Nghệ / Máy', field: 'machineName', minWidth: 150, formatter: cell => { const r = cell.getRow().getData(); return (r.printTech || '') + ' - ' + (r.machineName || ''); } },
              { title: 'Mô Tả Sự Cố', field: 'problem', minWidth: 180, formatter: cell => '<span class="truncate block max-w-xs">' + (cell.getValue() || '') + '</span>' },
              { title: 'Trạng Thái', field: 'machineStatus', minWidth: 120, hozAlign: 'center', formatter: cell => '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">' + (cell.getValue() || '-') + '</span>' },
              { title: 'Mức Ưu Tiên', field: 'priority', minWidth: 110, hozAlign: 'center', formatter: cell => {
                const p = cell.getValue() || '';
                return p === 'Hỗ trợ ngay' ? '<span class="text-rose-700 dark:text-rose-400 font-bold">Hỗ trợ ngay</span>' : (p === 'Chạy tạm' ? '<span class="text-amber-700 dark:text-amber-400 font-bold">Chạy tạm</span>' : '<span class="text-slate-600 dark:text-slate-400">' + p + '</span>');
              }},
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 180,
                headerSort: false,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  return '<div class="flex items-center justify-end gap-1.5">' +
                    '<button class="btn-split-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPSR"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>' +
                    '<button class="btn-split-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                    '<a href="/technical-feedback?cpsr=' + encodeURIComponent(r.docNo) + '" target="_blank" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs">+ CPST</a>' +
                    '<button class="btn-split-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa CPSR"><i class="fa-solid fa-trash-can"></i></button>' +
                  '</div>';
                },
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-split-edit')) openEditModal('cpsr', r);
                  else if (e.target.closest('.btn-split-view')) openChainDetailModal({ cpsr: r });
                  else if (e.target.closest('.btn-split-del')) deleteSplitRecord('cpsr', r.docNo || r.id);
                }
              }
            ];
          } else if (splitTab.value === 'cpst') {
            data = cpstList.value;
            columns = [
              { title: 'Số Phiếu', field: 'docNo', minWidth: 140, formatter: cell => '<span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Mã CPSR Gốc', field: 'cpsrDocNo', minWidth: 140, formatter: cell => '<span class="font-mono text-sky-700 dark:text-sky-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'KTV Tiếp Nhận', field: 'recvBy', minWidth: 140 },
              { title: 'Trạng Thái', field: 'chkStatus', minWidth: 120, hozAlign: 'center', formatter: cell => {
                const s = cell.getValue() || '';
                return s === 'Đã khắc phục' ? '<span class="text-emerald-700 dark:text-emerald-400 font-bold">Đã khắc phục</span>' : (s === 'Hư hỏng nặng' ? '<span class="text-rose-700 dark:text-rose-400 font-bold">Hư hỏng nặng</span>' : '<span class="text-amber-700 dark:text-amber-400 font-bold">' + s + '</span>');
              }},
              { title: 'Nguyên Nhân Gốc', field: 'rootCause', minWidth: 160, formatter: cell => '<span class="truncate block max-w-xs">' + (cell.getValue() || '') + '</span>' },
              { title: 'Hành Động Khắc Phục', field: 'actionTaken', minWidth: 160, formatter: cell => '<span class="truncate block max-w-xs">' + (cell.getValue() || '') + '</span>' },
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 180,
                headerSort: false,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  return '<div class="flex items-center justify-end gap-1.5">' +
                    '<button class="btn-split-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPST"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>' +
                    '<button class="btn-split-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                    '<a href="/confirm-request?cpst=' + encodeURIComponent(r.docNo) + '" target="_blank" class="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs">+ CPSF</a>' +
                    '<button class="btn-split-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa CPST"><i class="fa-solid fa-trash-can"></i></button>' +
                  '</div>';
                },
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-split-edit')) openEditModal('cpst', r);
                  else if (e.target.closest('.btn-split-view')) openChainDetailModal({ cpst: r, cpsr: { docNo: r.cpsrDocNo } });
                  else if (e.target.closest('.btn-split-del')) deleteSplitRecord('cpst', r.docNo || r.id);
                }
              }
            ];
          } else if (splitTab.value === 'cpsf') {
            data = cpsfList.value;
            columns = [
              { title: 'Số Phiếu', field: 'docNo', minWidth: 140, formatter: cell => '<span class="font-mono font-bold text-purple-700 dark:text-purple-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Mã CPST', field: 'cpstDocNo', minWidth: 140, formatter: cell => '<span class="font-mono text-emerald-700 dark:text-emerald-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Chất Lượng', field: 'chkQuality', minWidth: 100, hozAlign: 'center', formatter: cell => (cell.getValue() === 'Đạt' ? '<span class="text-emerald-700 dark:text-emerald-400 font-bold">ĐẠT</span>' : '<span class="text-rose-700 dark:text-rose-400 font-bold">CHƯA ĐẠT</span>') },
              { title: 'Work Order', field: 'workOrder', minWidth: 110, formatter: cell => '<span class="font-mono">' + (cell.getValue() || '-') + '</span>' },
              { title: 'Tổng SL', field: 'woTotalQty', minWidth: 90, hozAlign: 'right', formatter: cell => Number(cell.getValue() || 0).toLocaleString() },
              { title: 'Phế & Tỷ Lệ', field: 'wasteQty', minWidth: 110, hozAlign: 'right', formatter: cell => { const r = cell.getRow().getData(); return r.wasteQty + ' (' + (r.wastePercent || '0%') + ')'; } },
              { title: 'Đơn Vị', field: 'wasteUnit', minWidth: 70, hozAlign: 'center' },
              { title: 'Đại Diện SX', field: 'prodMgr', minWidth: 140 },
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 140,
                headerSort: false,
                formatter: () => '<div class="flex items-center justify-end gap-1.5">' +
                  '<button class="btn-split-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPSF"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>' +
                  '<button class="btn-split-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                  '<button class="btn-split-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa CPSF"><i class="fa-solid fa-trash-can"></i></button>' +
                '</div>',
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-split-edit')) openEditModal('cpsf', r);
                  else if (e.target.closest('.btn-split-view')) openChainDetailModal({ cpsf: r, cpst: { docNo: r.cpstDocNo }, cpsr: { docNo: r.cpsrDocNo } });
                  else if (e.target.closest('.btn-split-del')) deleteSplitRecord('cpsf', r.docNo || r.id);
                }
              }
            ];
          }

          const rawData = toPlainObject(data) || [];

          if (splitTable) {
            try {
              splitTable.setData(rawData);
              applySplitFilters();
              safeRedraw(splitTable);
              return;
            } catch (_) {
              safeDestroy(splitTable);
              splitTable = null;
            }
          }

          try {
            splitTable = new Tabulator('#tabulator-split-forms', {
              data: rawData,
              layout: 'fitDataStretch',
              responsiveLayout: false,
              pagination: 'local',
              paginationSize: 10,
              paginationSizeSelector: [10, 20, 50, 100],
              placeholder: '<span>Không có dữ liệu trong bảng này</span>',
              columns: columns
            });

            splitTable.on('rowDblClick', (e, row) => {
              try { openChainDetailModal(toPlainObject(row.getData())); } catch (_) {}
            });

            applySplitFilters();
          } catch (err) {
            console.warn('Tabulator split forms init error:', err);
          }
            console.warn('Tabulator split forms init error:', err);
          }
        };

        const applySplitFilters = () => {
          if (!splitTable) return;
          try {
            splitTable.clearFilter();
            const filters = [];
          const q = (splitFilter.value.search || '').trim().toLowerCase();
          const st = splitFilter.value.status;

          if (q) {
            if (splitTab.value === 'chain') {
              filters.push([
                { field: 'docNo', type: 'like', value: q },
                { field: 'cpsr.docNo', type: 'like', value: q },
                { field: 'cpsrDocNo', type: 'like', value: q },
                { field: 'cpsr.reqBy', type: 'like', value: q },
                { field: 'reqBy', type: 'like', value: q },
                { field: 'cpsr.machineName', type: 'like', value: q },
                { field: 'machineName', type: 'like', value: q },
                { field: 'problem', type: 'like', value: q },
                { field: 'assignedTo', type: 'like', value: q },
                { field: 'cpst.docNo', type: 'like', value: q },
                { field: 'cpsf.docNo', type: 'like', value: q }
              ]);
            } else {
              filters.push([
                { field: 'docNo', type: 'like', value: q },
                { field: 'reqBy', type: 'like', value: q },
                { field: 'recvBy', type: 'like', value: q },
                { field: 'prodMgr', type: 'like', value: q },
                { field: 'machineName', type: 'like', value: q }
              ]);
            }
          }

          if (st && st !== 'ALL') {
            if (splitTab.value === 'chain') {
              filters.push({
                field: 'id',
                type: (h, r, rowData) => {
                  if (st === 'TO_ASSIGN' || st === 'IN_PROGRESS' || st === 'OVER_DUE' || st === 'CLOSED' || st === 'OPEN_TASK') {
                    const rowStatus = rowData.status || (rowData.cpsf ? 'CLOSED' : (rowData.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                    return rowStatus === st;
                  }
                  const count = ((rowData.cpsr || rowData.cpsrDocNo) ? 1 : 0) + ((rowData.cpst || rowData.cpstDocNo) ? 1 : 0) + ((rowData.cpsf || rowData.cpsfDocNo) ? 1 : 0);
                  if (st === '3/3') return count === 3;
                  if (st === '2/3') return count === 2;
                  if (st === '1/3') return count === 1;
                  return true;
                },
                value: st
              });
            } else if (splitTab.value === 'cpsr') {
              filters.push({ field: 'machineStatus', type: '=', value: st });
            } else if (splitTab.value === 'cpst') {
              filters.push({ field: 'chkStatus', type: '=', value: st });
            } else if (splitTab.value === 'cpsf') {
              filters.push({ field: 'chkQuality', type: '=', value: st });
            }
          }

          if (filters.length > 0) splitTable.setFilter(filters);
          } catch (err) {
            console.warn('Tabulator split filter error:', err);
          }
        };

        const openChainDetailModal = async (data) => {
          if (!data) return;
          if (data.cpsr && (data.cpst !== undefined || data.cpsf !== undefined)) {
            selectedChain.value = data;
          } else {
            const doc = data.docNo || data.cpsrDocNo;
            const found = chainList.value.find(c => c.cpsr?.docNo === doc || c.cpst?.docNo === doc || c.cpsf?.docNo === doc);
            if (found) {
              selectedChain.value = found;
            } else {
              selectedChain.value = { cpsr: data.cpsr || data, cpst: data.cpst || null, cpsf: data.cpsf || null };
            }
          }
          showChainModal.value = true;
        };

        const deleteSplitRecord = async (type, id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
          try {
            const res = await fetch('/api/' + type + '/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa thành công!');
              await loadAllSplitData();
            } else {
              showToast('Xóa thất bại', true);
            }
          } catch(e) {
            showToast('Lỗi khi xóa: ' + e.message, true);
          }
        };

        const exportCurrentTabExcel = () => {
          if (splitTab.value === 'legacy') {
            exportRequestsExcel();
            return;
          }
          let rows = [];
          let filename = 'Checkpoint_';
          if (splitTab.value === 'chain') {
            filename += 'Chain_1-1-1';
            rows = chainList.value.map(r => ({
              'Mã CPS': r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '')),
              'Trạng Thái Chuỗi': r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN')),
              'Mã CPSR': r.cpsr?.docNo || r.cpsrDocNo || '',
              'Ngày Yêu Cầu': r.cpsr?.reqDate || r.reqDate || '',
              'Giờ Yêu Cầu': r.cpsr?.reqTime || r.reqTime || '',
              'Người Yêu Cầu': r.cpsr?.reqBy || r.reqBy || '',
              'Công Nghệ': r.cpsr?.printTech || r.printTech || '',
              'Tên Máy': r.cpsr?.machineName || r.machineName || '',
              'Sự Cố': r.cpsr?.problem || r.problem || '',
              'Nhân Viên KT': r.assignedTo || r.cpst?.recvBy || '-',
              'Deadline': r.deadline || '-',
              'Downtime (Phút)': r.downtime != null ? r.downtime : (r.cpst?.downtime != null ? r.cpst.downtime : '-'),
              'Tỉ Lệ Phế': r.wastePercent || r.cpsf?.wastePercent || '-',
              'Mã CPST': r.cpst?.docNo || r.cpstDocNo || 'Chưa phản hồi',
              'KTV Tiếp Nhận': r.cpst?.recvBy || r.assignedTo || '-',
              'Trạng Thái KT': r.cpst?.chkStatus || r.chkStatus || '-',
              'Mã CPSF': r.cpsf?.docNo || r.cpsfDocNo || 'Chưa bàn giao',
              'Chất Lượng In': r.cpsf?.chkQuality || r.chkQuality || '-',
              'Work Order': r.cpsf?.workOrder || r.workOrder || '-'
            }));
          } else if (splitTab.value === 'cpsr') {
            filename += 'CPSR';
            rows = cpsrList.value;
          } else if (splitTab.value === 'cpst') {
            filename += 'CPST';
            rows = cpstList.value;
          } else if (splitTab.value === 'cpsf') {
            filename += 'CPSF';
            rows = cpsfList.value;
          }

          if (rows.length === 0) {
            showToast('Không có dữ liệu để xuất', true);
            return;
          }

          try {
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, splitTab.value.toUpperCase());
            XLSX.writeFile(wb, filename + '_' + new Date().toISOString().slice(0, 10) + '.xlsx');
            showToast('Đã xuất Excel thành công!');
          } catch(e) {
            showToast('Lỗi xuất Excel: ' + e.message, true);
          }
        };

        // =====================================================================
        // TABULATOR: 1. REQUESTS TABLE
        // =====================================================================
        const initOrUpdateRequestsTable = () => {
          const el = document.getElementById('tabulator-requests');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!reqTable) {
              reqTable = new Tabulator('#tabulator-requests', {
                data: Array.isArray(requestsList.value) ? requestsList.value : [],
              layout: 'fitColumns',
              responsiveLayout: 'collapse',
              pagination: 'local',
              paginationSize: 10,
              paginationSizeSelector: [10, 20, 50, 100],
              placeholder: '<span>Không có dữ liệu phiếu yêu cầu kỹ thuật</span>',
              columns: [
                {
                  title: 'Số Phiếu',
                  field: 'docNo',
                  sorter: 'string',
                  minWidth: 120,
                  formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Thời Gian',
                  field: 'reqDate',
                  sorter: 'string',
                  minWidth: 130,
                  formatter: cell => {
                    const r = cell.getRow().getData();
                    return '<div class="text-slate-700 dark:text-slate-300 font-medium">' + (r.reqDate || '') + ' <span class="font-mono text-[10px] text-slate-400 block">' + (r.reqTime || '') + '</span></div>';
                  }
                },
                {
                  title: 'Công Nghệ / Máy',
                  field: 'machineName',
                  sorter: 'string',
                  minWidth: 160,
                  formatter: cell => {
                    const r = cell.getRow().getData();
                    return '<div><span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono mr-1 font-bold text-slate-600 dark:text-slate-300">' + (r.printTech || 'OTHER') + '</span> <strong class="text-slate-900 dark:text-white">' + (r.machineName || '') + '</strong></div>';
                  }
                },
                {
                  title: 'Người Yêu Cầu',
                  field: 'reqBy',
                  sorter: 'string',
                  minWidth: 120
                },
                {
                  title: 'Sự Cố',
                  field: 'problem',
                  minWidth: 180,
                  formatter: cell => '<span class="truncate block max-w-xs" title="' + String(cell.getValue() || '').replace(/"/g, '&quot;') + '">' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Downtime',
                  field: 'downtime',
                  sorter: 'number',
                  hozAlign: 'center',
                  minWidth: 90,
                  formatter: cell => {
                    const v = Number(cell.getValue() || 0);
                    return '<span class="font-mono font-bold ' + (v > 0 ? 'text-red-500' : 'text-slate-400') + '">' + v + 'm</span>';
                  }
                },
                {
                  title: 'Trạng Thái',
                  field: 'chkStatus',
                  sorter: 'string',
                  hozAlign: 'center',
                  minWidth: 120,
                  editor: 'select',
                  editorParams: {
                    values: ['Open', 'In Progress', 'Overdue', 'Closed']
                  },
                  cellEdited: (cell) => {
                    const r = cell.getRow().getData();
                    updateTicketStatus(r, cell.getValue());
                  },
                  formatter: cell => {
                    const s = cell.getValue() || cell.getRow().getData().status || 'Open';
                    const lower = String(s).toLowerCase();
                    if (lower === 'open') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Open</span>';
                    if (lower === 'in progress' || lower === 'monitor') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">In Progress</span>';
                    if (lower === 'overdue' || lower === 'support') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Overdue</span>';
                    if (lower === 'closed' || lower === 'done' || lower === 'completed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Closed</span>';
                    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">' + s + '</span>';
                  }
                },
                {
                  title: 'Thao Tác',
                  hozAlign: 'right',
                  minWidth: 90,
                  headerSort: false,
                  formatter: () => {
                    return '<div class="flex items-center justify-end gap-1">' +
                      '<button class="btn-ticket-view p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                      '<button class="btn-ticket-delete p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa phiếu"><i class="fa-solid fa-trash-can"></i></button>' +
                    '</div>';
                  },
                  cellClick: (e, cell) => {
                    const target = e.target.closest('button');
                    if (!target) return;
                    const r = cell.getRow().getData();
                    if (target.classList.contains('btn-ticket-view') || target.closest('.btn-ticket-view')) {
                      viewTicketDetail(r);
                    } else if (target.classList.contains('btn-ticket-delete') || target.closest('.btn-ticket-delete')) {
                      deleteRequest(r);
                    }
                  }
                }
              ]
            });
            reqTable.on('rowDblClick', (e, row) => {
              try { viewTicketDetail(row.getData()); } catch (_) {}
            });
          } else {
            reqTable.setData(Array.isArray(requestsList.value) ? requestsList.value : []);
            safeRedraw(reqTable);
          }
          applyReqFilters();
        } catch (err) {
          console.warn('Tabulator requests table error:', err);
        }
      };

      const applyReqFilters = () => {
        if (!reqTable) return;
        try {
          reqTable.clearFilter();
          const filters = [];
          if (reqFilter.value.chkStatus && reqFilter.value.chkStatus !== 'ALL') {
            const fVal = reqFilter.value.chkStatus.toLowerCase();
            filters.push({
              field: 'chkStatus',
              type: (headerValue, rowValue, rowData) => {
                const s = String(rowData.chkStatus || rowData.status || '').toLowerCase();
                if (fVal === 'closed') return s === 'closed' || s === 'done';
                if (fVal === 'in progress') return s === 'in progress' || s === 'monitor';
                if (fVal === 'overdue') return s === 'overdue' || s === 'support';
                return s === fVal;
              },
              value: reqFilter.value.chkStatus
            });
          }
          if (reqFilter.value.printTech && reqFilter.value.printTech !== 'ALL') {
            filters.push({ field: 'printTech', type: '=', value: reqFilter.value.printTech });
          }
          if (reqFilter.value.priority && reqFilter.value.priority !== 'ALL') {
            filters.push({ field: 'priority', type: '=', value: reqFilter.value.priority });
          }
          if (reqFilter.value.search) {
            const q = reqFilter.value.search.trim().toLowerCase();
            filters.push([
              { field: 'docNo', type: 'like', value: q },
              { field: 'machineName', type: 'like', value: q },
              { field: 'reqBy', type: 'like', value: q },
              { field: 'problem', type: 'like', value: q }
            ]);
          }
          if (filters.length > 0) reqTable.setFilter(filters);
        } catch (err) {
          console.warn('Tabulator req filter error:', err);
        }
      };

        // =====================================================================
        // TABULATOR: 2. MACHINES TABLE
        // =====================================================================
        const initOrUpdateMachinesTable = () => {
          const el = document.getElementById('tabulator-machines');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!machinesTable) {
              machinesTable = new Tabulator('#tabulator-machines', {
                data: Array.isArray(machinesFlatList.value) ? machinesFlatList.value : [],
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 10,
                paginationSizeSelector: [10, 25, 50],
                placeholder: '<span>Không có dữ liệu máy móc</span>',
                columns: [
                  { title: 'STT', formatter: 'rownum', hozAlign: 'center', width: 60, headerSort: false },
                  {
                    title: 'Công Nghệ In / Phân Xưởng',
                    field: 'tech',
                    sorter: 'string',
                    minWidth: 160,
                    formatter: cell => '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Tên Máy / Thiết Bị',
                    field: 'name',
                    sorter: 'string',
                    minWidth: 180,
                    formatter: cell => '<span class="font-bold text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Mã Thiết Bị',
                    field: 'code',
                    sorter: 'string',
                    minWidth: 120,
                    formatter: cell => '<span class="font-mono text-slate-500">' + (cell.getValue() || '—') + '</span>'
                  },
                  {
                    title: 'Trạng Thái',
                    field: 'isActive',
                    hozAlign: 'center',
                    minWidth: 120,
                    formatter: () => '<span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Hoạt động</span>'
                  },
                  {
                    title: 'Thao Tác',
                    hozAlign: 'right',
                    minWidth: 90,
                    headerSort: false,
                    formatter: () => '<button class="btn-machine-delete p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa máy này"><i class="fa-solid fa-trash-can"></i></button>',
                    cellClick: (e, cell) => {
                      const target = e.target.closest('.btn-machine-delete');
                      if (!target) return;
                      deleteMachineItem(cell.getRow().getData());
                    }
                  }
                ]
              });
            } else {
              machinesTable.setData(Array.isArray(machinesFlatList.value) ? machinesFlatList.value : []);
              safeRedraw(machinesTable);
            }
            applyMachineFilters();
          } catch (err) {
            console.warn('Tabulator machines table error:', err);
          }
        };

        const applyMachineFilters = () => {
          if (!machinesTable) return;
          try {
            machinesTable.clearFilter();
            const filters = [];
            if (machineTechFilter.value && machineTechFilter.value !== 'ALL') {
              filters.push({ field: 'tech', type: '=', value: machineTechFilter.value });
            }
            if (machineSearch.value) {
              const q = machineSearch.value.trim().toLowerCase();
              filters.push([
                { field: 'name', type: 'like', value: q },
                { field: 'code', type: 'like', value: q },
                { field: 'tech', type: 'like', value: q }
              ]);
            }
            if (filters.length > 0) machinesTable.setFilter(filters);
          } catch (err) {
            console.warn('Tabulator machine filter error:', err);
          }
        };

        // =====================================================================
        // TABULATOR: 3. EMPLOYEES TABLE
        // =====================================================================
        const initOrUpdateEmployeesTable = () => {
          const el = document.getElementById('tabulator-employees');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!empTable) {
              empTable = new Tabulator('#tabulator-employees', {
                data: Array.isArray(employeesList.value) ? employeesList.value : [],
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 10,
                paginationSizeSelector: [10, 25, 50, 100],
                placeholder: '<span>Không có dữ liệu nhân sự</span>',
                columns: [
                  {
                    title: 'Mã NV',
                    field: 'mnv',
                    sorter: 'string',
                    minWidth: 100,
                    formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '—') + '</span>'
                  },
                  {
                    title: 'Họ và Tên',
                    field: 'name',
                    sorter: 'string',
                    minWidth: 160,
                    formatter: cell => '<span class="font-semibold text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Bộ Phận / Phòng Ban',
                    field: 'dept',
                    sorter: 'string',
                    minWidth: 140,
                    formatter: cell => '<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Khu Vực / Chuyền',
                    field: 'area',
                    sorter: 'string',
                    minWidth: 140,
                    formatter: cell => '<span class="text-slate-500">' + (cell.getValue() || '—') + '</span>'
                  },
                  {
                    title: 'Chức Vụ',
                    field: 'role',
                    sorter: 'string',
                    minWidth: 120,
                    formatter: cell => '<span class="text-slate-500">' + (cell.getValue() || 'Staff') + '</span>'
                  },
                  {
                    title: 'Thao Tác',
                    hozAlign: 'right',
                    minWidth: 80,
                    headerSort: false,
                    formatter: () => '<button class="btn-emp-delete p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa nhân viên"><i class="fa-solid fa-trash-can"></i></button>',
                    cellClick: (e, cell) => {
                      const target = e.target.closest('.btn-emp-delete');
                      if (!target) return;
                      deleteEmployee(cell.getRow().getData());
                    }
                  }
                ]
              });
            } else {
              empTable.setData(Array.isArray(employeesList.value) ? employeesList.value : []);
              safeRedraw(empTable);
            }
            applyEmpFilters();
          } catch (err) {
            console.warn('Tabulator employees table error:', err);
          }
        };

        const applyEmpFilters = () => {
          if (!empTable) return;
          try {
            empTable.clearFilter();
            const filters = [];
            if (empDeptFilter.value && empDeptFilter.value !== 'ALL') {
              filters.push({ field: 'dept', type: '=', value: empDeptFilter.value });
            }
            if (empSearch.value) {
              const q = empSearch.value.trim().toLowerCase();
              filters.push([
                { field: 'name', type: 'like', value: q },
                { field: 'mnv', type: 'like', value: q },
                { field: 'area', type: 'like', value: q }
              ]);
            }
            if (filters.length > 0) empTable.setFilter(filters);
          } catch (err) {
            console.warn('Tabulator emp filter error:', err);
          }
        };

        // =====================================================================
        // TABULATOR: 4. USERS & PERMISSIONS TABLE
        // =====================================================================
        const initOrUpdateUsersTable = () => {
          const el = document.getElementById('tabulator-users');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!usersTable) {
              usersTable = new Tabulator('#tabulator-users', {
                data: Array.isArray(usersList.value) ? usersList.value : [],
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 10,
                paginationSizeSelector: [10, 25, 50],
                placeholder: '<span>Không có dữ liệu tài khoản</span>',
                columns: [
                {
                  title: 'Tên Đăng Nhập',
                  field: 'username',
                  sorter: 'string',
                  minWidth: 130,
                  formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">@' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Họ và Tên',
                  field: 'fullName',
                  sorter: 'string',
                  minWidth: 150,
                  formatter: cell => '<span class="font-semibold text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Email',
                  field: 'email',
                  sorter: 'string',
                  minWidth: 160,
                  formatter: cell => '<span class="font-mono text-slate-400 text-xs">' + (cell.getValue() || '—') + '</span>'
                },
                {
                  title: 'Vai Trò',
                  field: 'role',
                  sorter: 'string',
                  minWidth: 110,
                  hozAlign: 'center',
                  formatter: cell => {
                    const r = cell.getValue();
                    if (r === 'ADMIN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">ADMIN</span>';
                    if (r === 'TECHNICIAN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">TECHNICIAN</span>';
                    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">EMPLOYEE</span>';
                  }
                },
                {
                  title: 'Phân Quyền Chi Tiết (Tạo phiếu / Xem KPI / Admin)',
                  minWidth: 320,
                  headerSort: false,
                  formatter: cell => {
                    const u = cell.getRow().getData();
                    const canReq = getUserPerm(u, 'canCreateRequest');
                    const canKpi = getUserPerm(u, 'canViewKpi');
                    const canCp = getUserPerm(u, 'canAccessControlPanel');
                    const isAdmin = u.username === 'admin';
                    return '<div class="flex items-center gap-3 text-[11px]">' +
                      '<label class="inline-flex items-center gap-1.5 cursor-pointer select-none">' +
                        '<input type="checkbox" data-perm="canCreateRequest" ' + (canReq ? 'checked' : '') + ' ' + (isAdmin ? 'disabled' : '') + ' class="perm-chk rounded text-sky-600 h-3.5 w-3.5 cursor-pointer" />' +
                        '<span class="text-slate-700 dark:text-slate-300">Tạo phiếu</span>' +
                      '</label>' +
                      '<label class="inline-flex items-center gap-1.5 cursor-pointer select-none">' +
                        '<input type="checkbox" data-perm="canViewKpi" ' + (canKpi ? 'checked' : '') + ' ' + (isAdmin ? 'disabled' : '') + ' class="perm-chk rounded text-emerald-600 h-3.5 w-3.5 cursor-pointer" />' +
                        '<span class="text-slate-700 dark:text-slate-300">Xem KPI</span>' +
                      '</label>' +
                      '<label class="inline-flex items-center gap-1.5 cursor-pointer select-none">' +
                        '<input type="checkbox" data-perm="canAccessControlPanel" ' + (canCp ? 'checked' : '') + ' ' + (isAdmin ? 'disabled' : '') + ' class="perm-chk rounded text-amber-600 h-3.5 w-3.5 cursor-pointer" />' +
                        '<span class="font-bold text-amber-600 dark:text-amber-400">Admin CP</span>' +
                      '</label>' +
                    '</div>';
                  },
                  cellClick: (e, cell) => {
                    if (e.target && e.target.classList.contains('perm-chk')) {
                      const u = cell.getRow().getData();
                      const permKey = e.target.getAttribute('data-perm');
                      toggleUserPerm(u, permKey, e.target.checked);
                    }
                  }
                },
                {
                  title: 'Trạng Thái',
                  field: 'isActive',
                  hozAlign: 'center',
                  minWidth: 100,
                  formatter: cell => {
                    const active = cell.getValue();
                    return '<span class="inline-flex items-center gap-1.5 text-[11px] font-bold ' + (active ? 'text-emerald-500' : 'text-red-500') + '">' +
                      '<span class="w-2 h-2 rounded-full ' + (active ? 'bg-emerald-500' : 'bg-red-500') + '"></span>' +
                      (active ? 'Kích hoạt' : 'Tạm khóa') +
                    '</span>';
                  }
                },
                {
                  title: 'Thao Tác',
                  hozAlign: 'right',
                  minWidth: 80,
                  headerSort: false,
                  formatter: cell => {
                    const u = cell.getRow().getData();
                    if (u.username === 'admin') return '';
                    return '<button class="btn-user-delete p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa tài khoản"><i class="fa-solid fa-trash-can"></i></button>';
                  },
                  cellClick: (e, cell) => {
                    const target = e.target.closest('.btn-user-delete');
                    if (!target) return;
                    deleteUser(cell.getRow().getData());
                  }
                }
              ]
            });
          } else {
            usersTable.setData(Array.isArray(usersList.value) ? usersList.value : []);
            safeRedraw(usersTable);
          }
          applyUserFilters();
        } catch (err) {
          console.warn('Tabulator users table error:', err);
        }
      };

      const applyUserFilters = () => {
        if (!usersTable) return;
        try {
          usersTable.clearFilter();
          const filters = [];
          if (userRoleFilter.value && userRoleFilter.value !== 'ALL') {
            filters.push({ field: 'role', type: '=', value: userRoleFilter.value });
          }
          if (userSearch.value) {
            const q = userSearch.value.trim().toLowerCase();
            filters.push([
              { field: 'username', type: 'like', value: q },
              { field: 'fullName', type: 'like', value: q },
              { field: 'email', type: 'like', value: q }
            ]);
          }
          if (filters.length > 0) usersTable.setFilter(filters);
        } catch (err) {
          console.warn('Tabulator user filter error:', err);
        }
      };

        // =====================================================================
        // TABULATOR: 5. EXISTING DATASETS MANAGEMENT
        // =====================================================================
        const getDatasetColumns = (type) => {
          if (type === 'weekly-requests') {
            return [
              { title: 'STT', formatter: 'rownum', width: 60, hozAlign: 'center', headerSort: false },
              {
                title: 'Mã / Người Yêu Cầu',
                field: 'requestId',
                sorter: 'string',
                minWidth: 160,
                formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>'
              },
              { title: 'Loại Yêu Cầu', field: 'requestType', sorter: 'string', minWidth: 130 },
              {
                title: 'Thiết Bị',
                field: 'itemEquipment',
                sorter: 'string',
                minWidth: 110,
                formatter: cell => '<span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold">' + (cell.getValue() || '') + '</span>'
              },
              {
                title: 'Mức Độ',
                field: 'severity',
                sorter: 'string',
                minWidth: 100,
                hozAlign: 'center',
                formatter: cell => {
                  const v = cell.getValue();
                  if (v === 'Critical') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-500 border border-red-500/30">Critical</span>';
                  if (v === 'High') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">High</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-500 border border-sky-500/30">' + (v || 'Normal') + '</span>';
                }
              },
              {
                title: 'Trạng Thái',
                field: 'status',
                sorter: 'string',
                minWidth: 110,
                hozAlign: 'center',
                editor: 'select',
                editorParams: {
                  values: ['Open', 'In Progress', 'Overdue', 'Closed']
                },
                formatter: cell => {
                  const s = cell.getValue() || 'Open';
                  const lower = String(s).toLowerCase();
                  if (lower === 'open') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Open</span>';
                  if (lower === 'in progress') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">In Progress</span>';
                  if (lower === 'overdue') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Overdue</span>';
                  if (lower === 'closed' || lower === 'done' || lower === 'completed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Closed</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">' + s + '</span>';
                }
              },
              { title: 'SLA (Giờ)', field: 'slaTargetHours', sorter: 'number', hozAlign: 'center', minWidth: 90 },
              {
                title: 'Thực Tế',
                field: 'actualHours',
                sorter: 'number',
                hozAlign: 'center',
                minWidth: 90,
                formatter: cell => '<span class="font-mono font-bold">' + (cell.getValue() || 0) + 'h</span>'
              },
              {
                title: 'Đạt SLA',
                field: 'metSla',
                sorter: 'string',
                hozAlign: 'center',
                minWidth: 90,
                formatter: cell => cell.getValue() === 'Yes' ? '<span class="text-emerald-500 font-bold">✓ Đạt</span>' : '<span class="text-red-500 font-bold">✗ Chưa</span>'
              }
            ];
          }
          if (type === 'defect-logs') {
            return [
              { title: 'Defect ID', field: 'defectId', sorter: 'number', width: 90, hozAlign: 'center', formatter: cell => '<span class="font-mono font-bold text-amber-600 dark:text-amber-400">#' + (cell.getValue() || '') + '</span>' },
              { title: 'Ngày', field: 'defectDate', sorter: 'string', minWidth: 100 },
              { title: 'Phân Xưởng', field: 'facility', sorter: 'string', minWidth: 110, formatter: cell => '<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">' + (cell.getValue() || '') + '</span>' },
              { title: 'Nguyên Nhân Gốc', field: 'rootCauseCategory', sorter: 'string', minWidth: 130 },
              { title: 'Chi Tiết Sự Cố', field: 'specificIssue', minWidth: 200, formatter: cell => '<span class="truncate block max-w-xs" title="' + String(cell.getValue() || '').replace(/"/g, '&quot;') + '">' + (cell.getValue() || '') + '</span>' },
              { title: 'Sản Phẩm Ảnh Hưởng', field: 'affectedProduct', minWidth: 140 },
              { title: 'Lặp Lại', field: 'recurringIssue', hozAlign: 'center', minWidth: 90, formatter: cell => cell.getValue() === 'Yes' ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">Có</span>' : '<span class="text-slate-400">Không</span>' },
              { title: 'Yêu Cầu 8D', field: 'eightDRequired', hozAlign: 'center', minWidth: 100, formatter: cell => cell.getValue() === 'Yes' ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500">8D Required</span>' : '<span class="text-slate-400">Không</span>' }
            ];
          }
          if (type === 'action-plans') {
            return [
              { title: 'Action ID', field: 'actionId', sorter: 'string', minWidth: 100, formatter: cell => '<span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Ngày Tạo', field: 'dateLogged', sorter: 'string', minWidth: 100 },
              { title: 'Phân Xưởng', field: 'facility', sorter: 'string', minWidth: 110 },
              { title: 'Defect ID', field: 'relatedDefectId', minWidth: 90, hozAlign: 'center', formatter: cell => cell.getValue() ? '<span class="font-mono text-amber-500 font-bold">#' + cell.getValue() + '</span>' : '—' },
              { title: 'Loại Hành Động', field: 'fixType', minWidth: 130 },
              { title: 'Nội Dung', field: 'description', minWidth: 200, formatter: cell => '<span class="truncate block max-w-xs" title="' + String(cell.getValue() || '').replace(/"/g, '&quot;') + '">' + (cell.getValue() || '') + '</span>' },
              { title: 'Người Phụ Trách', field: 'pic', sorter: 'string', minWidth: 120, formatter: cell => '<strong class="text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</strong>' },
              { title: 'Hạn Chót', field: 'deadline', sorter: 'string', minWidth: 100, formatter: cell => '<span class="font-mono text-red-500 font-medium">' + (cell.getValue() || '') + '</span>' },
              {
                title: 'Trạng Thái',
                field: 'status',
                sorter: 'string',
                minWidth: 110,
                hozAlign: 'center',
                formatter: cell => {
                  const s = cell.getValue();
                  if (s === 'Done' || s === 'Closed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Done</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">' + (s || 'In Progress') + '</span>';
                }
              }
            ];
          }
          // requesters
          return [
            { title: 'STT', field: 'stt', sorter: 'number', width: 60, hozAlign: 'center' },
            { title: 'Mã NV', field: 'mnv', sorter: 'string', minWidth: 100, formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>' },
            { title: 'Họ và Tên', field: 'fullName', sorter: 'string', minWidth: 160, formatter: cell => '<strong class="text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</strong>' },
            { title: 'Bộ Phận', field: 'department', sorter: 'string', minWidth: 130 },
            { title: 'Khu Vực', field: 'area', sorter: 'string', minWidth: 120 },
            { title: 'Chức Danh', field: 'position', sorter: 'string', minWidth: 160 }
          ];
        };

        const getActiveDatasetList = () => {
          if (activeDataset.value === 'weekly-requests') return weeklyRequestsList.value;
          if (activeDataset.value === 'defect-logs') return defectLogsList.value;
          if (activeDataset.value === 'action-plans') return actionPlansList.value;
          if (activeDataset.value === 'requesters') return requestersList.value;
          return [];
        };

        const initOrUpdateExistingDataTable = () => {
          const el = document.getElementById('tabulator-existing-data');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          const data = getActiveDatasetList();
          const columns = getDatasetColumns(activeDataset.value);

          if (existingDataTable) {
            safeDestroy(existingDataTable);
            existingDataTable = null;
          }

          try {
            existingDataTable = new Tabulator('#tabulator-existing-data', {
              data: Array.isArray(data) ? data : [],
              layout: 'fitColumns',
              pagination: 'local',
              paginationSize: 10,
              paginationSizeSelector: [10, 25, 50, 100],
              placeholder: '<span>Không có dữ liệu trong tập này</span>',
              columns: columns
            });
            applyDatasetFilter();
          } catch (err) {
            console.warn('Tabulator existing data error:', err);
          }
        };

        const switchDataset = (ds) => {
          activeDataset.value = ds;
          datasetSearch.value = '';
          loadCurrentDataset();
        };

        const loadCurrentDataset = async () => {
          try {
            if (activeDataset.value === 'weekly-requests') {
              const res = await fetch('/api/weekly-requests', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) weeklyRequestsList.value = await res.json();
            } else if (activeDataset.value === 'defect-logs') {
              const res = await fetch('/api/defect-logs', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) defectLogsList.value = await res.json();
            } else if (activeDataset.value === 'action-plans') {
              const res = await fetch('/api/action-plans', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) actionPlansList.value = await res.json();
            } else if (activeDataset.value === 'requesters') {
              const res = await fetch('/api/requesters', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) requestersList.value = await res.json();
            }
            initOrUpdateExistingDataTable();
          } catch (e) {
            console.error(e);
          }
        };

        const applyDatasetFilter = () => {
          if (!existingDataTable) return;
          try {
            existingDataTable.clearFilter();
            if (datasetSearch.value) {
              const q = datasetSearch.value.trim().toLowerCase();
              const cols = getDatasetColumns(activeDataset.value).filter(c => c.field);
              const orFilters = cols.map(c => ({ field: c.field, type: 'like', value: q }));
              if (orFilters.length > 0) existingDataTable.setFilter([orFilters]);
            }
          } catch (err) {
            console.warn('Tabulator dataset filter error:', err);
          }
        };

        const exportCurrentDatasetExcel = () => {
          const list = getActiveDatasetList();
          if (!list || list.length === 0) {
            showToast('Không có dữ liệu để xuất', true);
            return;
          }
          const ws = XLSX.utils.json_to_sheet(list);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, activeDataset.value);
          XLSX.writeFile(wb, 'Checkpoint_' + activeDataset.value + '_' + new Date().toISOString().split('T')[0] + '.xlsx');
          showToast('Đã xuất file Excel dữ liệu thành công!');
        };

        // Data Loaders
        const loadStats = async () => {
          try {
            const res = await fetch('/api/technical-requests/stats', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              stats.value = await res.json();
            }
          } catch (e) {
            console.error(e);
          }
        };

        const loadRequests = async () => {
          try {
            let url = '/api/technical-requests?limit=500';
            const res = await fetch(url, { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              requestsList.value = data.items || [];
              initOrUpdateRequestsTable();
            }
          } catch (e) {
            console.error(e);
          }
        };

        const viewTicketDetail = (ticket) => {
          selectedTicket.value = ticket;
          openModal('modal-ticket-detail');
        };

        const updateTicketStatus = async (ticket, newStatus) => {
          try {
            const res = await fetch('/api/technical-requests/' + ticket.id, {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify({ chkStatus: newStatus, status: newStatus })
            });
            if (res.ok) {
              ticket.chkStatus = newStatus;
              ticket.status = newStatus;
              showToast('Đã cập nhật trạng thái phiếu thành ' + newStatus);
              loadStats();
              loadRequests();
            }
          } catch (err) {
            showToast('Lỗi cập nhật', true);
          }
        };

        const getStatusBadgeClass = (status) => {
          const s = (status || '').toLowerCase().trim();
          if (s === 'open' || s === 'open_task') return 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30';
          if (s === 'to_assign') return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
          if (s === 'in progress' || s === 'in_progress' || s === 'monitor') return 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30';
          if (s === 'overdue' || s === 'over_due' || s === 'support') return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30';
          if (s === 'closed' || s === 'done' || s === 'completed') return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
          return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30';
        };

        const deleteRequest = async (ticket) => {
          if (!confirm('Bạn có chắc chắn muốn xóa phiếu ' + ticket.docNo + '?')) return;
          try {
            const res = await fetch('/api/technical-requests/' + ticket.id, {
              method: 'DELETE',
              headers: getAuthHeaders(),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã xóa phiếu thành công');
              loadRequests();
              loadStats();
            }
          } catch (err) {
            showToast('Lỗi xóa phiếu', true);
          }
        };

        // Machines Management
        const loadMachines = async () => {
          try {
            const [grpRes, allRes] = await Promise.all([
              fetch('/api/machines/grouped', { headers: getAuthHeaders(), credentials: 'include' }),
              fetch('/api/machines', { headers: getAuthHeaders(), credentials: 'include' })
            ]);
            if (grpRes.ok) machineCatalog.value = await grpRes.json();
            if (allRes.ok) {
              const data = await allRes.json();
              machinesFlatList.value = Array.isArray(data) ? data : [];
              initOrUpdateMachinesTable();
            }
          } catch (e) {}
        };

        const openAddMachineModal = () => {
          newMachine.value = { tech: '', name: '', code: '' };
          openModal('modal-add-machine');
        };

        const submitAddMachine = async () => {
          try {
            const res = await fetch('/api/machines', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(newMachine.value)
            });
            if (res.ok) {
              showToast('Thêm máy in thành công!');
              closeModal('modal-add-machine');
              loadMachines();
            }
          } catch (err) {
            showToast('Lỗi thêm máy in', true);
          }
        };

        const deleteMachineItem = async (mach) => {
          if (!confirm('Xóa máy ' + mach.name + ' thuộc nhóm ' + mach.tech + '?')) return;
          try {
            const res = await fetch('/api/machines/' + mach.id, {
              method: 'DELETE',
              headers: getAuthHeaders(),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã xóa máy ' + mach.name);
              loadMachines();
            } else {
              showToast('Lỗi xóa máy', true);
            }
          } catch (e) {
            showToast('Lỗi xóa máy', true);
          }
        };

        // Employees Management
        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              employeesList.value = await res.json();
              initOrUpdateEmployeesTable();
            }
          } catch (e) {}
        };

        const openAddEmployeeModal = () => {
          newEmployee.value = { mnv: '', name: '', dept: 'Sản Xuất', area: '', role: 'Operator' };
          openModal('modal-add-employee');
        };

        const submitAddEmployee = async () => {
          try {
            const res = await fetch('/api/employees', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(newEmployee.value)
            });
            if (res.ok) {
              showToast('Thêm nhân viên thành công!');
              closeModal('modal-add-employee');
              loadEmployees();
            }
          } catch (err) {
            showToast('Lỗi thêm nhân viên', true);
          }
        };

        const deleteEmployee = async (emp) => {
          if (!confirm('Xóa nhân viên ' + emp.name + '?')) return;
          try {
            const res = await fetch('/api/employees/' + emp.id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa nhân viên');
              loadEmployees();
            }
          } catch (e) {
            showToast('Lỗi xóa', true);
          }
        };

        const openExcelUploader = () => openModal('modal-excel');

        const processExcelFile = (e) => {
          const file = e.target.files[0];
          if (!file) return;
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
                  showToast('Đã nạp ' + employees.length + ' nhân viên từ Excel');
                  closeModal('modal-excel');
                  loadEmployees();
                }
              }
            } catch (err) {
              showToast('Lỗi đọc Excel', true);
            }
          };
          reader.readAsArrayBuffer(file);
        };

        // Users Management
        const loadUsers = async () => {
          try {
            const res = await fetch('/api/users', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              usersList.value = await res.json();
              initOrUpdateUsersTable();
            }
          } catch (e) {}
        };

        const getUserPerm = (u, permKey) => {
          if (!u) return false;
          if (u.username === 'admin') return true;
          if (u.permissions && u.permissions[permKey] !== undefined) {
            return Boolean(u.permissions[permKey]);
          }
          if (u.role === 'ADMIN') return true;
          if (u.role === 'TECHNICIAN') {
            return permKey === 'canCreateRequest' || permKey === 'canViewKpi';
          }
          if (u.role === 'EMPLOYEE') {
            return permKey === 'canCreateRequest';
          }
          return false;
        };

        const toggleUserPerm = async (u, permKey, checked) => {
          const currentPerms = {
            canCreateRequest: getUserPerm(u, 'canCreateRequest'),
            canViewKpi: getUserPerm(u, 'canViewKpi'),
            canAccessControlPanel: getUserPerm(u, 'canAccessControlPanel')
          };
          currentPerms[permKey] = checked;

          let newRole = u.role;
          if (permKey === 'canAccessControlPanel') {
            if (checked) {
              newRole = 'ADMIN';
            } else if (u.role === 'ADMIN') {
              newRole = 'EMPLOYEE';
            }
          }

          u.permissions = currentPerms;
          u.role = newRole;

          try {
            const payload = {
              fullName: u.fullName,
              email: u.email,
              role: u.role,
              isActive: u.isActive,
              permissions: currentPerms
            };
            const res = await fetch('/api/users/' + u.id, {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              showToast('Đã cập nhật phân quyền cho @' + u.username);
            } else {
              const resPerms = await fetch('/api/users/' + u.id + '/permissions', {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                credentials: 'include',
                body: JSON.stringify(currentPerms)
              });
              if (resPerms.ok) {
                showToast('Đã cập nhật phân quyền cho @' + u.username);
              } else {
                const err = await res.json().catch(() => ({}));
                showToast(err.message || 'Lỗi cập nhật phân quyền', true);
                loadUsers();
              }
            }
          } catch (e) {
            showToast('Lỗi kết nối khi cập nhật phân quyền', true);
            loadUsers();
          }
        };

        const onNewUserRoleChange = () => {
          if (newUser.value.role === 'ADMIN') {
            newUser.value.permissions = { canCreateRequest: true, canViewKpi: true, canAccessControlPanel: true };
          } else if (newUser.value.role === 'TECHNICIAN') {
            newUser.value.permissions = { canCreateRequest: true, canViewKpi: true, canAccessControlPanel: false };
          } else {
            newUser.value.permissions = { canCreateRequest: true, canViewKpi: false, canAccessControlPanel: false };
          }
        };

        const openAddUserModal = () => {
          newUser.value = {
            username: '',
            password: 'Checkpoint@123',
            fullName: '',
            email: '',
            role: 'EMPLOYEE',
            permissions: {
              canCreateRequest: true,
              canViewKpi: false,
              canAccessControlPanel: false
            }
          };
          openModal('modal-add-user');
        };

        const submitAddUser = async () => {
          try {
            const res = await fetch('/api/users', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(newUser.value)
            });
            if (res.ok) {
              showToast('Tạo tài khoản thành công!');
              closeModal('modal-add-user');
              loadUsers();
            } else {
              const err = await res.json();
              showToast(err.message || 'Lỗi tạo tài khoản', true);
            }
          } catch (e) {
            showToast('Lỗi tạo tài khoản', true);
          }
        };

        const deleteUser = async (u) => {
          if (!confirm('Xóa tài khoản @' + u.username + '?')) return;
          try {
            const res = await fetch('/api/users/' + u.id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa tài khoản');
              loadUsers();
            }
          } catch (e) {
            showToast('Lỗi xóa tài khoản', true);
          }
        };

        // Excel Exports
        const exportRequestsExcel = () => {
          if (requestsList.value.length === 0) {
            showToast('Không có dữ liệu để xuất', true);
            return;
          }
          const rows = requestsList.value.map(r => ({
            'Số Phiếu': r.docNo,
            'Ngày Yêu Cầu': r.reqDate,
            'Giờ Yêu Cầu': r.reqTime,
            'Người Yêu Cầu': r.reqBy,
            'Công Nghệ': r.printTech,
            'Tên Máy': r.machineName,
            'Mô Tả Sự Cố': r.problem,
            'Mức Ưu Tiên': r.priority,
            'Người Tiếp Nhận': r.recvBy,
            'Ngày Nhận': r.recvDate,
            'Giờ Nhận': r.recvTime,
            'Ngày Hoàn Thành': r.finishDate,
            'Giờ Hoàn Thành': r.finishTime,
            'Downtime (Phút)': r.downtime,
            'Nguyên Nhân Gốc': r.rootCause,
            'Hành Động Khắc Phục': r.actionTaken,
            'Phân Loại 4M': r.errCat,
            'Nhóm Công Đoạn': r.errType,
            'Chất Lượng In': r.chkQuality,
            'Trạng Thái Phiếu': r.chkStatus,
            'Work Order': r.workOrder,
            'Tổng SL': r.woTotalQty,
            'SL Phế Phẩm': r.wasteQty,
            '% Waste': r.wastePercent,
            'Người Bàn Giao': r.prodMgr
          }));
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'DanhSachPhieu');
          XLSX.writeFile(wb, 'Checkpoint_PhieuYeuCau_' + new Date().toISOString().split('T')[0] + '.xlsx');
          showToast('Đã xuất file Excel danh sách phiếu');
        };

        const exportEmployeesExcel = () => {
          if (employeesList.value.length === 0) return;
          const rows = employeesList.value.map(e => ({
            'Mã NV': e.mnv,
            'Họ và Tên': e.name,
            'Bộ Phận': e.dept,
            'Khu Vực': e.area,
            'Chức Vụ': e.role
          }));
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'NhanSu');
          XLSX.writeFile(wb, 'Checkpoint_DanhSachNhanSu.xlsx');
          showToast('Đã xuất file Excel nhân sự');
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

        onMounted(async () => {
          try {
            const res = await fetch('/auth/session', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const sessionUser = await res.json();
              if (sessionUser && typeof sessionUser === 'object') {
                currentUser.value = { ...currentUser.value, ...sessionUser };
              }
            } else {
              // Fallback an toàn khi chưa có session, không cưỡng chế chuyển hướng /login
              if (!currentUser.value || !currentUser.value.username) {
                currentUser.value = {
                  username: 'admin',
                  fullName: 'Quản trị viên',
                  role: 'ADMIN',
                  permissions: { canAccessControlPanel: true, canCreateRequest: true, canViewKpi: true }
                };
              }
            }
          } catch (e) {
            // Không cưỡng chế chuyển hướng /login khi gặp lỗi hoặc offline
            if (!currentUser.value || !currentUser.value.username) {
              currentUser.value = {
                username: 'admin',
                fullName: 'Quản trị viên (Offline)',
                role: 'ADMIN',
                permissions: { canAccessControlPanel: true, canCreateRequest: true, canViewKpi: true }
              };
            }
          }

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;
          setTheme(savedTheme);

          window.addEventListener('resize', () => {
            safeRedraw(splitTable);
            safeRedraw(reqTable);
            safeRedraw(machinesTable);
            safeRedraw(empTable);
            safeRedraw(usersTable);
            safeRedraw(existingDataTable);
            safeRedraw(reportTableInstance);
          });

          initReportDates();
          loadStats();
          loadMachines();
          loadRequests();
          loadAllSplitData();
          loadCpsData();
          loadEmployees();
          loadPublicFormStatus();
          if (currentUser.value?.role === 'ADMIN' || (currentUser.value?.permissions && currentUser.value.permissions.canAccessControlPanel)) {
            loadUsers();
          }

          // Preload dataset counts
          fetch('/api/weekly-requests', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) weeklyRequestsList.value = d; }).catch(() => {});
          fetch('/api/defect-logs', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) defectLogsList.value = d; }).catch(() => {});
          fetch('/api/action-plans', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) actionPlansList.value = d; }).catch(() => {});
          fetch('/api/requesters', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) requestersList.value = d; }).catch(() => {});
        });

        return {
          activeTab,
          currentTabLabel,
          sidebarOpen,
          sidebarCollapsed,
          userMenuOpen,
          currentTheme,
          currentUser,
          userInitials,
          stats,
          requestsList,
          reqFilter,
          selectedTicket,
          splitTab,
          chainList,
          cpsrList,
          cpstList,
          cpsfList,
          splitFilter,
          currentSplitCount,
          selectedChain,
          showChainModal,
          switchSplitTab,
          applySplitFilters,
          openChainDetailModal,
          deleteSplitRecord,
          exportCurrentTabExcel,
          loadAllSplitData,
          cpsList,
          assignCardStatus,
          assignCardSearch,
          showAssignModal,
          selectedCpsForAssign,
          assignForm,
          isAssigning,
          pendingAssignCount,
          cpsCountByStatus,
          filteredCpsCards,
          formatCpsStatus,
          getCardBorderClass,
          formatDateTimeDisplay,
          openAssignModal,
          closeAssignModal,
          submitAssignTask,
          showEditModal,
          isSavingEdit,
          editForm,
          openEditModal,
          closeEditModal,
          submitEditTicket,
          deleteCpsRecord,
          showLinkModal,
          isLinking,
          linkForm,
          openLinkModal,
          closeLinkModal,
          submitLinkTickets,
          unlinkItem,
          onSelectLinkCps,
          showCreateCpsModal,
          isCreatingCps,
          createCpsForm,
          availableCpsrForCps,
          openCreateCpsModal,
          closeCreateCpsModal,
          submitCreateCps,
          reportDateFrom,
          reportDateTo,
          reportQuickPreset,
          reportSearch,
          reportStatusFilter,
          filteredReportCps,
          reportStats,
          initReportDates,
          setReportPreset,
          onReportFilterChange,
          renderReportChart,
          initOrUpdateReportTable,
          exportReportTechnicalExcel,
          loadCpsData,
          machineCatalog,
          machinesFlatList,
          machineTechFilter,
          machineSearch,
          newMachine,
          employeesList,
          empSearch,
          empDeptFilter,
          distinctDepts,
          newEmployee,
          usersList,
          userSearch,
          userRoleFilter,
          newUser,
          activeDataset,
          datasetSearch,
          weeklyRequestsList,
          defectLogsList,
          actionPlansList,
          requestersList,
          getUserPerm,
          toggleUserPerm,
          onNewUserRoleChange,
          setTheme,
          toggleTheme,
          switchTab,
          loadStats,
          loadRequests,
          applyReqFilters,
          viewTicketDetail,
          updateTicketStatus,
          getStatusBadgeClass,
          deleteRequest,
          loadMachines,
          applyMachineFilters,
          openAddMachineModal,
          submitAddMachine,
          deleteMachineItem,
          loadEmployees,
          applyEmpFilters,
          openAddEmployeeModal,
          submitAddEmployee,
          deleteEmployee,
          openExcelUploader,
          triggerUpload,
          processExcelFile,
          loadUsers,
          applyUserFilters,
          openAddUserModal,
          submitAddUser,
          deleteUser,
          switchDataset,
          loadCurrentDataset,
          applyDatasetFilter,
          exportCurrentDatasetExcel,
          exportRequestsExcel,
          exportEmployeesExcel,
          handleLogout,
          handleGlobalClick,
          closeModal,
          get4MLabel,
          getPercent,
          showTicketDetailModal,
          showAddMachineModal,
          showAddEmployeeModal,
          showAddUserModal,
          showExcelModal,
          isPublicFormEnabled,
          togglingPublicForm,
          copySuccess,
          publicFormUrl,
          loadPublicFormStatus,
          togglePublicForm,
          copyPublicFormLink
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
