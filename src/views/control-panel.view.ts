export const CONTROL_PANEL_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Checkpoint Systems - Control Panel</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png?v=3" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=3" />
  <link rel="apple-touch-icon" href="/images/favicon.png?v=3" />
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
      background: rgba(255, 255, 255, 0.97);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-sidebar {
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #ffffff;
      border-color: #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
    }
    .theme-light .nav-item {
      color: #475569;
    }
    .theme-light .nav-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .theme-light .nav-item.active {
      background-color: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
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
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.8125rem;
      background-color: #ffffff;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .tabulator .tabulator-header {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      font-size: 0.6875rem;
      letter-spacing: 0.05em;
    }
    .tabulator .tabulator-header .tabulator-col {
      background-color: #f8fafc;
      border-right: 1px solid #e2e8f0;
    }
    .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
      background-color: #f1f5f9;
    }
    .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
      padding: 10px 14px;
    }
    .tabulator .tabulator-row {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
      color: #0f172a;
      transition: background-color 0.15s ease;
    }
    .tabulator .tabulator-row:hover {
      background-color: #f8fafc !important;
    }
    .tabulator .tabulator-row.tabulator-row-even {
      background-color: #ffffff;
    }
    .tabulator .tabulator-cell {
      padding: 11px 14px;
      border-right: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .tabulator .tabulator-footer {
      background-color: #ffffff;
      border-top: 1px solid #e2e8f0;
      padding: 10px 16px;
      color: #64748b;
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
      color: #334155;
      outline: none;
    }
    .tabulator button.tabulator-page {
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
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
      color: #94a3b8;
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
              <span class="text-sm font-extrabold"><span class="text-sky-500">Checkpoint</span> Systems</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">Admin</span>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Control Panel</span>
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
          <span class="text-sky-600 dark:text-sky-400 font-bold capitalize">{{ currentTabLabel }}</span>
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
          v-if="currentUser.role === 'ADMIN' || currentUser.username === 'admin'"
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
                v-if="currentUser.role === 'ADMIN' || currentUser.username === 'admin'"
                href="/api/docs"
                target="_blank"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-book text-sky-500"></i> Swagger API Docs</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
              </a>
              <div class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span class="flex items-center gap-2"><i class="fa-solid fa-sliders"></i> Control Panel</span>
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

          <!-- GROUP 1: QUẢN TRỊ CHI TIẾT -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quản Trị Chi Tiết
            </div>
            <button
              @click="switchTab('overview')"
              :class="{ active: activeTab === 'overview' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-chart-pie w-4 text-center text-xs text-sky-500"></i>
              <span class="truncate">Tổng Quan & Phân Tích</span>
            </button>
            <button
              @click="switchTab('requests')"
              :class="{ active: activeTab === 'requests' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-table-list w-4 text-center text-xs text-emerald-500"></i>
              <span class="truncate">Phiếu Yêu Cầu Kỹ Thuật</span>
            </button>
          </div>

          <!-- GROUP 2: DANH MỤC THIẾT BỊ & NHÂN SỰ -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Danh Mục Thiết Bị & Nhân Sự
            </div>
            <button
              @click="switchTab('machines')"
              :class="{ active: activeTab === 'machines' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-print w-4 text-center text-xs text-indigo-500"></i>
              <span class="truncate">Máy Móc & Thiết Bị</span>
            </button>
            <button
              @click="switchTab('employees')"
              :class="{ active: activeTab === 'employees' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-users w-4 text-center text-xs text-cyan-500"></i>
              <span class="truncate">Nhân Sự & Bộ Phận</span>
            </button>
          </div>

          <!-- GROUP 3: QUẢN LÝ USER & PHÂN QUYỀN (Hidden when no permission, no locked cards) -->
          <div v-if="currentUser.role === 'ADMIN' || (currentUser.permissions && currentUser.permissions.canAccessControlPanel)" class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quản Lý User & Phân Quyền
            </div>
            <button
              @click="switchTab('users')"
              :class="{ active: activeTab === 'users' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-user-shield w-4 text-center text-xs text-amber-500"></i>
              <span class="truncate">Danh Sách User & Phân Quyền</span>
            </button>
          </div>

          <!-- GROUP 4: QUẢN LÝ DỮ LIỆU HIỆN CÓ -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quản Lý Dữ Liệu Hiện Có
            </div>
            <button
              @click="switchTab('existing-data')"
              :class="{ active: activeTab === 'existing-data' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-database w-4 text-center text-xs text-violet-500"></i>
              <span class="truncate">Dữ Liệu Vận Hành & Báo Cáo</span>
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
            <span class="font-semibold text-sky-500">Control Panel</span>
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
             VIEW 2: REQUESTS MASTER MANAGEMENT (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'requests'" class="space-y-5">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Sách Toàn Bộ Phiếu Yêu Cầu Kỹ Thuật</h1>
              <p class="text-xs text-slate-500">Bảng dữ liệu Tabulator hỗ trợ lọc nhiều tiêu chí, sắp xếp động, phân trang và xuất Excel</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a
                href="/dashboard"
                class="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25"
              >
                <i class="fa-solid fa-plus"></i> Tạo Phiếu Mới
              </a>
              <button
                @click="exportRequestsExcel"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- Filter Toolbar for Tabulator -->
          <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              v-model="reqFilter.search"
              @input="applyReqFilters"
              placeholder="🔍 Tìm mã phiếu, tên máy, người yêu cầu, lỗi..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none"
            />
            <select v-model="reqFilter.chkStatus" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="DONE">🟢 Đã khắc phục (DONE)</option>
              <option value="MONITOR">🟡 Đang theo dõi (MONITOR)</option>
              <option value="SUPPORT">🔴 Cần hỗ trợ (SUPPORT)</option>
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

          <!-- Tabulator Container for Requests -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-requests"></div>
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
              <span class="font-bold text-emerald-500">{{ selectedTicket.chkStatus || 'DONE' }}</span>
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
            <select :value="selectedTicket.chkStatus" @change="e => updateTicketStatus(selectedTicket, e.target.value)" class="input-box px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
              <option value="DONE">🟢 Đã khắc phục (DONE)</option>
              <option value="MONITOR">🟡 Đang theo dõi (MONITOR)</option>
              <option value="SUPPORT">🔴 Cần hỗ trợ (SUPPORT)</option>
            </select>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
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
    const { createApp, ref, computed, onMounted, nextTick } = Vue;

    createApp({
      setup() {
        const activeTab = ref('overview');
        const showTicketDetailModal = ref(false);
        const showAddMachineModal = ref(false);
        const showAddEmployeeModal = ref(false);
        const showAddUserModal = ref(false);
        const showExcelModal = ref(false);
        const sidebarOpen = ref(false);
        const sidebarCollapsed = ref(false);
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

        // Tabulator instances
        let reqTable = null;
        let machinesTable = null;
        let empTable = null;
        let usersTable = null;
        let existingDataTable = null;

        // Overview stats
        const stats = ref({});

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
            requests: 'Phiếu yêu cầu kỹ thuật',
            machines: 'Máy móc & Thiết bị',
            employees: 'Nhân sự & Phân xưởng',
            users: 'Danh sách User & Phân quyền',
            'existing-data': 'Quản lý dữ liệu hiện có'
          };
          return map[activeTab.value] || 'Quản trị';
        });

        const userInitials = computed(() => {
          const name = currentUser.value.fullName || currentUser.value.username || 'A';
          const parts = name.trim().split(' ');
          if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          }
          return name.substring(0, 2).toUpperCase();
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
          else document.getElementById(id)?.classList.add('show');
        };

        const closeModal = (id) => {
          if (id === 'modal-ticket-detail') showTicketDetailModal.value = false;
          else if (id === 'modal-add-machine') showAddMachineModal.value = false;
          else if (id === 'modal-add-employee') showAddEmployeeModal.value = false;
          else if (id === 'modal-add-user') showAddUserModal.value = false;
          else if (id === 'modal-excel') showExcelModal.value = false;
          else document.getElementById(id)?.classList.remove('show');
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
          document.documentElement.classList.remove('theme-light', 'theme-dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
          nextTick(() => {
            reqTable?.redraw(true);
            machinesTable?.redraw(true);
            empTable?.redraw(true);
            usersTable?.redraw(true);
            existingDataTable?.redraw(true);
          });
        };

        const toggleTheme = () => {
          setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        const switchTab = (tab) => {
          activeTab.value = tab;
          sidebarOpen.value = false;
          showTicketDetailModal.value = false;
          showAddMachineModal.value = false;
          showAddEmployeeModal.value = false;
          showAddUserModal.value = false;
          showExcelModal.value = false;

          nextTick(() => {
            if (tab === 'overview') loadStats();
            if (tab === 'requests') {
              if (requestsList.value.length === 0) loadRequests();
              else { initOrUpdateRequestsTable(); reqTable?.redraw(true); }
            }
            if (tab === 'machines') {
              if (machinesFlatList.value.length === 0) loadMachines();
              else { initOrUpdateMachinesTable(); machinesTable?.redraw(true); }
            }
            if (tab === 'employees') {
              if (employeesList.value.length === 0) loadEmployees();
              else { initOrUpdateEmployeesTable(); empTable?.redraw(true); }
            }
            if (tab === 'users') {
              if (usersList.value.length === 0) loadUsers();
              else { initOrUpdateUsersTable(); usersTable?.redraw(true); }
            }
            if (tab === 'existing-data') {
              loadCurrentDataset();
            }
          });
        };

        // =====================================================================
        // TABULATOR: 1. REQUESTS TABLE
        // =====================================================================
        const initOrUpdateRequestsTable = () => {
          const el = document.getElementById('tabulator-requests');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          if (!reqTable) {
            reqTable = new Tabulator('#tabulator-requests', {
              data: requestsList.value,
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
                  minWidth: 110,
                  formatter: cell => {
                    const s = cell.getValue() || 'DONE';
                    if (s === 'DONE') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">DONE</span>';
                    if (s === 'MONITOR') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">MONITOR</span>';
                    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">SUPPORT</span>';
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
              viewTicketDetail(row.getData());
            });
          } else {
            reqTable.setData(requestsList.value);
            reqTable.redraw(true);
          }
          applyReqFilters();
        };

        const applyReqFilters = () => {
          if (!reqTable) return;
          reqTable.clearFilter();
          const filters = [];
          if (reqFilter.value.chkStatus && reqFilter.value.chkStatus !== 'ALL') {
            filters.push({ field: 'chkStatus', type: '=', value: reqFilter.value.chkStatus });
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
        };

        // =====================================================================
        // TABULATOR: 2. MACHINES TABLE
        // =====================================================================
        const initOrUpdateMachinesTable = () => {
          const el = document.getElementById('tabulator-machines');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          if (!machinesTable) {
            machinesTable = new Tabulator('#tabulator-machines', {
              data: machinesFlatList.value,
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
            machinesTable.setData(machinesFlatList.value);
            machinesTable.redraw(true);
          }
          applyMachineFilters();
        };

        const applyMachineFilters = () => {
          if (!machinesTable) return;
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
        };

        // =====================================================================
        // TABULATOR: 3. EMPLOYEES TABLE
        // =====================================================================
        const initOrUpdateEmployeesTable = () => {
          const el = document.getElementById('tabulator-employees');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          if (!empTable) {
            empTable = new Tabulator('#tabulator-employees', {
              data: employeesList.value,
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
            empTable.setData(employeesList.value);
            empTable.redraw(true);
          }
          applyEmpFilters();
        };

        const applyEmpFilters = () => {
          if (!empTable) return;
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
        };

        // =====================================================================
        // TABULATOR: 4. USERS & PERMISSIONS TABLE
        // =====================================================================
        const initOrUpdateUsersTable = () => {
          const el = document.getElementById('tabulator-users');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          if (!usersTable) {
            usersTable = new Tabulator('#tabulator-users', {
              data: usersList.value,
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
            usersTable.setData(usersList.value);
            usersTable.redraw(true);
          }
          applyUserFilters();
        };

        const applyUserFilters = () => {
          if (!usersTable) return;
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
                minWidth: 100,
                hozAlign: 'center',
                formatter: cell => {
                  const s = cell.getValue();
                  if (s === 'Done' || s === 'Closed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">' + s + '</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">' + (s || 'Open') + '</span>';
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
            existingDataTable.destroy();
            existingDataTable = null;
          }

          existingDataTable = new Tabulator('#tabulator-existing-data', {
            data: data,
            layout: 'fitColumns',
            pagination: 'local',
            paginationSize: 10,
            paginationSizeSelector: [10, 25, 50, 100],
            placeholder: '<span>Không có dữ liệu trong tập này</span>',
            columns: columns
          });
          applyDatasetFilter();
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
          existingDataTable.clearFilter();
          if (datasetSearch.value) {
            const q = datasetSearch.value.trim().toLowerCase();
            const cols = getDatasetColumns(activeDataset.value).filter(c => c.field);
            const orFilters = cols.map(c => ({ field: c.field, type: 'like', value: q }));
            if (orFilters.length > 0) existingDataTable.setFilter([orFilters]);
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
              body: JSON.stringify({ chkStatus: newStatus })
            });
            if (res.ok) {
              ticket.chkStatus = newStatus;
              showToast('Đã cập nhật trạng thái phiếu thành ' + newStatus);
              loadStats();
              loadRequests();
            }
          } catch (err) {
            showToast('Lỗi cập nhật', true);
          }
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
              currentUser.value = await res.json();
            } else {
              window.location.replace('/login');
              return;
            }
          } catch (e) {
            window.location.replace('/login');
            return;
          }

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;

          window.addEventListener('resize', () => {
            reqTable?.redraw(true);
            machinesTable?.redraw(true);
            empTable?.redraw(true);
            usersTable?.redraw(true);
            existingDataTable?.redraw(true);
          });

          loadStats();
          loadMachines();
          loadRequests();
          loadEmployees();
          if (currentUser.value.role === 'ADMIN' || (currentUser.value.permissions && currentUser.value.permissions.canAccessControlPanel)) {
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
          showExcelModal
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
