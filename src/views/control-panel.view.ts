export const CONTROL_PANEL_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Control Panel - Quản Trị Hệ Thống Phiếu Yêu Cầu Kỹ Thuật</title>
  <link rel="icon" type="image/png" href="/images/favicon.png" />
  <link rel="shortcut icon" href="/images/favicon.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600;700&family=Host+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- SheetJS for XLSX Export -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

  <script>
    (function() {
      try {
        var saved = localStorage.getItem('checkpoint_theme') || localStorage.getItem('dvt_theme');
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
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .modal-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      transform: translateY(16px) scale(0.97);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-overlay.show .modal-content {
      transform: translateY(0) scale(1);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">
  <div id="app" v-cloak class="flex-1 flex flex-col min-h-screen" @click="handleGlobalClick">
    
    <!-- TOP APP BAR -->
    <header class="glass-header sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between">
      <!-- Left Brand & Navigation -->
      <div class="flex items-center gap-3">
        <!-- Logo Button -->
        <a href="/control-panel" class="flex items-center gap-2.5 text-inherit font-extrabold text-sm tracking-tight text-decoration-none">
          <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-0.5 shadow-inner overflow-hidden">
            <img src="/images/logo-navbar.png" onerror="this.onerror=null; this.src='/images/logo-full.png'; this.onerror=function(){this.src='/images/favicon.png';};" class="w-full h-full object-contain rounded-md" alt="Checkpoint Systems Logo" />
          </div>
          <div class="leading-none text-left">
            <div class="flex items-center gap-1.5">
              <span><span class="text-sky-500">CHECKPOINT</span> Systems</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">Admin</span>
            </div>
            <span class="text-[10px] text-slate-500 font-normal">Control Panel</span>
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

        <!-- Breadcrumb Indicator -->
        <div class="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <span class="text-sky-600 dark:text-sky-400 font-bold capitalize">{{ currentTabLabel }}</span>
        </div>
      </div>

      <!-- Right User Menu & Portal Links -->
      <div class="flex items-center gap-2.5">
        <!-- Switch back to User Dashboard -->
        <a
          href="/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 transition"
          title="Chuyển sang giao diện Nhập liệu nhân viên"
        >
          <i class="fa-solid fa-file-pen text-sky-500"></i>
          <span class="hidden sm:inline">User Dashboard</span>
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

            <!-- Switch View -->
            <div class="space-y-1 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <a
                href="/dashboard"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-file-signature text-sky-500"></i> User Dashboard</span>
                <i class="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
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

      <!-- LEFT SIDEBAR NAVIGATION -->
      <aside
        :class="[
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          sidebarCollapsed ? 'md:w-0 md:p-0 md:border-r-0 md:overflow-hidden md:opacity-0' : 'md:w-60 p-3.5'
        ]"
        class="fixed md:static inset-y-0 left-0 z-30 glass-sidebar flex flex-col justify-between transition-all duration-200 ease-in-out md:flex-shrink-0 mt-14 md:mt-0"
      >
        <div class="space-y-4 overflow-y-auto flex-1">
          <!-- GROUP 1: GOVERNANCE -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quản Trị & Thống Kê
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

          <!-- GROUP 2: MASTER DATA -->
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
              <span class="truncate">Máy Móc & Công Nghệ In</span>
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

          <!-- GROUP 3: SECURITY & USERS -->
          <div v-if="currentUser.role === 'ADMIN'" class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Bảo Mật & Phân Quyền
            </div>
            <button
              @click="switchTab('users')"
              :class="{ active: activeTab === 'users' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-user-shield w-4 text-center text-xs text-amber-500"></i>
              <span class="truncate">Tài Khoản Người Dùng</span>
            </button>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div class="flex justify-between">
            <span>Dự án:</span>
            <span class="font-bold text-slate-700 dark:text-slate-200">Checkpoint Tech</span>
          </div>
          <div class="flex justify-between">
            <span>Core:</span>
            <span class="font-mono text-emerald-500">NestJS v10</span>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <!-- =====================================================================
             VIEW 1: OVERVIEW HUB & ANALYTICS
             ===================================================================== -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
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
             VIEW 2: REQUESTS MASTER MANAGEMENT
             ===================================================================== -->
        <div v-if="activeTab === 'requests'" class="space-y-5">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Sách Toàn Bộ Phiếu Yêu Cầu Kỹ Thuật</h1>
              <p class="text-xs text-slate-500">Quản lý, tìm kiếm, lọc, cập nhật trạng thái và xuất báo cáo toàn nhà máy</p>
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

          <!-- Filter Toolbar -->
          <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              v-model="reqFilter.search"
              @input="debouncedFilterRequests"
              placeholder="🔍 Tìm mã phiếu, tên máy, người yêu cầu..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none"
            />
            <select v-model="reqFilter.chkStatus" @change="loadRequests" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="DONE">🟢 Đã khắc phục (DONE)</option>
              <option value="MONITOR">🟡 Đang theo dõi (MONITOR)</option>
              <option value="SUPPORT">🔴 Cần hỗ trợ (SUPPORT)</option>
            </select>
            <select v-model="reqFilter.printTech" @change="loadRequests" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả công nghệ in —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
            <select v-model="reqFilter.priority" @change="loadRequests" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả mức ưu tiên —</option>
              <option value="Immediate">🔴 Hỗ trợ ngay (Immediate)</option>
              <option value="Hold">🟡 Chạy tạm (Hold)</option>
              <option value="Other">📌 Khác</option>
            </select>
          </div>

          <!-- Requests Table -->
          <div class="glass-card rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th class="py-3 px-4">Số Phiếu</th>
                    <th class="py-3 px-3">Thời Gian</th>
                    <th class="py-3 px-3">Công Nghệ / Máy</th>
                    <th class="py-3 px-3">Người Yêu Cầu</th>
                    <th class="py-3 px-3">Sự Cố</th>
                    <th class="py-3 px-3 text-center">Downtime</th>
                    <th class="py-3 px-3 text-center">Trạng Thái</th>
                    <th class="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-if="requestsLoading">
                    <td colspan="8" class="py-12 text-center text-slate-400">
                      <i class="fa-solid fa-circle-notch fa-spin text-xl text-sky-500 mb-2"></i>
                      <div>Đang tải dữ liệu...</div>
                    </td>
                  </tr>
                  <tr v-else-if="requestsList.length === 0">
                    <td colspan="8" class="py-12 text-center text-slate-400">
                      Không tìm thấy phiếu nào phù hợp.
                    </td>
                  </tr>
                  <tr
                    v-for="r in requestsList"
                    :key="r.id"
                    class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    @click="viewTicketDetail(r)"
                  >
                    <td class="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">{{ r.docNo }}</td>
                    <td class="py-3 px-3 whitespace-nowrap text-slate-500">{{ r.reqDate }} <span class="font-mono text-[11px]">{{ r.reqTime }}</span></td>
                    <td class="py-3 px-3 whitespace-nowrap font-medium">
                      <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono mr-1">{{ r.printTech }}</span>
                      <strong>{{ r.machineName }}</strong>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap">{{ r.reqBy }}</td>
                    <td class="py-3 px-3 max-w-xs truncate text-slate-600 dark:text-slate-300" :title="r.problem">{{ r.problem }}</td>
                    <td class="py-3 px-3 text-center font-mono font-bold whitespace-nowrap" :class="r.downtime > 0 ? 'text-red-500' : 'text-slate-400'">
                      {{ r.downtime || 0 }}m
                    </td>
                    <td class="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        :class="{
                          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': r.chkStatus === 'DONE',
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': r.chkStatus === 'MONITOR',
                          'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20': r.chkStatus === 'SUPPORT'
                        }"
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      >
                        {{ r.chkStatus || 'DONE' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap" @click.stop>
                      <button
                        @click="viewTicketDetail(r)"
                        class="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition mr-1"
                        title="Xem chi tiết"
                      >
                        <i class="fa-solid fa-eye"></i>
                      </button>
                      <button
                        @click="deleteRequest(r)"
                        class="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa phiếu"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 3: MACHINES & PRINTING TECHNOLOGIES
             ===================================================================== -->
        <div v-if="activeTab === 'machines'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Mục Công Nghệ In & Máy Móc</h1>
              <p class="text-xs text-slate-500">Quản lý danh mục các loại máy in theo từng công nghệ. Thay đổi sẽ cập nhật trực tiếp vào dropdown biểu mẫu nhập liệu</p>
            </div>
            <button
              @click="openAddMachineModal"
              class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Máy Mới
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(machines, tech) in machineCatalog"
              :key="tech"
              class="glass-card rounded-2xl p-5 space-y-3"
            >
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div class="font-bold text-sm text-sky-600 dark:text-sky-400 flex items-center gap-2">
                  <i class="fa-solid fa-print"></i>
                  <span>{{ tech }}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {{ machines.length }} máy
                </span>
              </div>

              <!-- List of Machines -->
              <div class="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                <div
                  v-for="mach in machines"
                  :key="mach"
                  class="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-medium"
                >
                  <span class="truncate">{{ mach }}</span>
                  <button
                    @click="deleteMachineByName(tech, mach)"
                    class="text-slate-400 hover:text-red-500 transition text-[11px] p-1"
                    title="Xóa máy này"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 4: EMPLOYEES & PERSONNEL
             ===================================================================== -->
        <div v-if="activeTab === 'employees'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Sách Nhân Sự & Phân Xưởng</h1>
              <p class="text-xs text-slate-500">Dữ liệu nhân sự được dùng để gợi ý và tự động điền Người yêu cầu và Người nhận</p>
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

          <!-- Employees Table -->
          <div class="glass-card rounded-2xl overflow-hidden">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                v-model="empSearch"
                placeholder="🔍 Tìm kiếm nhân viên theo tên hoặc mã NV..."
                class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
              />
              <select v-model="empDeptFilter" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60">
                <option value="ALL">— Tất cả bộ phận —</option>
                <option v-for="d in distinctDepts" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th class="py-3 px-4">Mã NV</th>
                    <th class="py-3 px-4">Họ và Tên</th>
                    <th class="py-3 px-4">Bộ Phận</th>
                    <th class="py-3 px-4">Khu Vực / Chuyền</th>
                    <th class="py-3 px-4">Chức Vụ</th>
                    <th class="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="emp in filteredEmployeesList" :key="emp.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td class="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">{{ emp.mnv || '—' }}</td>
                    <td class="py-3 px-4 font-semibold">{{ emp.name }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">{{ emp.dept }}</span>
                    </td>
                    <td class="py-3 px-4 text-slate-500">{{ emp.area || '—' }}</td>
                    <td class="py-3 px-4 text-slate-500">{{ emp.role || 'Staff' }}</td>
                    <td class="py-3 px-4 text-right">
                      <button
                        @click="deleteEmployee(emp)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa nhân viên"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 5: USER ACCOUNTS & SECURITY
             ===================================================================== -->
        <div v-if="activeTab === 'users'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Quản Lý Tài Khoản Người Dùng</h1>
              <p class="text-xs text-slate-500">Phân quyền tài khoản đăng nhập hệ thống (ADMIN, TECHNICIAN, EMPLOYEE)</p>
            </div>
            <button
              @click="openAddUserModal"
              class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <i class="fa-solid fa-user-plus"></i> Thêm Tài Khoản
            </button>
          </div>

          <div class="glass-card rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th class="py-3 px-4">Tên Đăng Nhập</th>
                    <th class="py-3 px-4">Họ và Tên</th>
                    <th class="py-3 px-4">Email</th>
                    <th class="py-3 px-4">Vai Trò (Role)</th>
                    <th class="py-3 px-4">Trạng Thái</th>
                    <th class="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="u in usersList" :key="u.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td class="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">@{{ u.username }}</td>
                    <td class="py-3 px-4 font-semibold">{{ u.fullName }}</td>
                    <td class="py-3 px-4 text-slate-400 font-mono">{{ u.email }}</td>
                    <td class="py-3 px-4">
                      <span
                        :class="{
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': u.role === 'ADMIN',
                          'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20': u.role === 'TECHNICIAN',
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700': u.role === 'EMPLOYEE'
                        }"
                        class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                      >
                        {{ u.role }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1.5 text-[11px] font-bold" :class="u.isActive ? 'text-emerald-500' : 'text-red-500'">
                        <span class="w-2 h-2 rounded-full" :class="u.isActive ? 'bg-emerald-500' : 'bg-red-500'"></span>
                        {{ u.isActive ? 'Kích hoạt' : 'Tạm khóa' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button
                        v-if="u.username !== 'admin'"
                        @click="deleteUser(u)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa tài khoản"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- TICKET DETAIL MODAL -->
    <div id="modal-ticket-detail" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-ticket-detail')">
      <div v-if="selectedTicket" class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">Chi Tiết Phiếu Yêu Cầu</div>
            <h2 class="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ selectedTicket.docNo }}</h2>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
            <select :value="selectedTicket.chkStatus" @change="e => updateTicketStatus(selectedTicket, e.target.value)" class="input-box px-3 py-1.5 rounded-lg text-xs font-bold">
              <option value="DONE">🟢 Đã khắc phục (DONE)</option>
              <option value="MONITOR">🟡 Đang theo dõi (MONITOR)</option>
              <option value="SUPPORT">🔴 Cần hỗ trợ (SUPPORT)</option>
            </select>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">Đóng</button>
        </div>
      </div>
    </div>

    <!-- ADD MACHINE MODAL -->
    <div id="modal-add-machine" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-machine')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Máy In Mới</h3>
          <button @click="closeModal('modal-add-machine')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
            <button type="button" @click="closeModal('modal-add-machine')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30">Thêm</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD EMPLOYEE MODAL -->
    <div id="modal-add-employee" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-employee')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Nhân Sự</h3>
          <button @click="closeModal('modal-add-employee')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
            <button type="button" @click="closeModal('modal-add-employee')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div id="modal-add-user" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-user')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Tài Khoản Đăng Nhập</h3>
          <button @click="closeModal('modal-add-user')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
            <select v-model="newUser.role" class="input-box w-full px-3 py-2 rounded-xl font-bold cursor-pointer">
              <option value="EMPLOYEE">EMPLOYEE (Nhân viên nhập liệu)</option>
              <option value="TECHNICIAN">TECHNICIAN (Kỹ thuật viên)</option>
              <option value="ADMIN">ADMIN (Quản trị viên toàn quyền)</option>
            </select>
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-user')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30">Tạo</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EXCEL UPLOADER MODAL -->
    <div id="modal-excel" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-excel')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Nạp Danh Sách Nhân Sự Excel</h3>
          <button @click="closeModal('modal-excel')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
          <button @click="closeModal('modal-excel')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">Đóng</button>
        </div>
      </div>
    </div>

    <!-- TOAST CONTAINER -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"></div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
      setup() {
        const activeTab = ref('overview');
        const sidebarOpen = ref(false);
        const sidebarCollapsed = ref(false);
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({});

        // Overview stats
        const stats = ref({});

        // Requests Master Table
        const requestsList = ref([]);
        const requestsLoading = ref(false);
        const reqFilter = ref({ search: '', chkStatus: 'ALL', printTech: 'ALL', priority: 'ALL' });
        const selectedTicket = ref(null);
        let filterTimeout = null;

        // Machines
        const machineCatalog = ref({});
        const newMachine = ref({ tech: '', name: '', code: '' });

        // Employees
        const employeesList = ref([]);
        const empSearch = ref('');
        const empDeptFilter = ref('ALL');
        const newEmployee = ref({ mnv: '', name: '', dept: '', area: '', role: '' });

        // Users
        const usersList = ref([]);
        const newUser = ref({ username: '', password: '', fullName: '', email: '', role: 'EMPLOYEE' });

        // Computed
        const currentTabLabel = computed(() => {
          const map = {
            overview: 'Tổng quan & Phân tích',
            requests: 'Phiếu yêu cầu kỹ thuật',
            machines: 'Máy móc & Công nghệ in',
            employees: 'Nhân sự & Phân xưởng',
            users: 'Tài khoản người dùng'
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

        const filteredEmployeesList = computed(() => {
          let list = employeesList.value;
          if (empSearch.value) {
            const q = empSearch.value.toLowerCase().trim();
            list = list.filter(e => (e.name && e.name.toLowerCase().includes(q)) || (e.mnv && e.mnv.toLowerCase().includes(q)));
          }
          if (empDeptFilter.value !== 'ALL') {
            list = list.filter(e => e.dept === empDeptFilter.value);
          }
          return list;
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

        const openModal = (id) => document.getElementById(id)?.classList.add('show');
        const closeModal = (id) => document.getElementById(id)?.classList.remove('show');
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
          localStorage.setItem('dvt_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
        };

        const switchTab = (tab) => {
          activeTab.value = tab;
          sidebarOpen.value = false;
          if (tab === 'overview') loadStats();
          if (tab === 'requests') loadRequests();
          if (tab === 'machines') loadMachines();
          if (tab === 'employees') loadEmployees();
          if (tab === 'users') loadUsers();
        };

        // Data Loaders
        const loadStats = async () => {
          try {
            const res = await fetch('/api/technical-requests/stats', { credentials: 'include' });
            if (res.ok) {
              stats.value = await res.json();
            }
          } catch (e) {
            console.error(e);
          }
        };

        const loadRequests = async () => {
          requestsLoading.value = true;
          try {
            let url = '/api/technical-requests?limit=200';
            if (reqFilter.value.search) url += '&search=' + encodeURIComponent(reqFilter.value.search);
            if (reqFilter.value.chkStatus && reqFilter.value.chkStatus !== 'ALL') url += '&chkStatus=' + reqFilter.value.chkStatus;
            if (reqFilter.value.printTech && reqFilter.value.printTech !== 'ALL') url += '&printTech=' + reqFilter.value.printTech;
            if (reqFilter.value.priority && reqFilter.value.priority !== 'ALL') url += '&priority=' + reqFilter.value.priority;

            const res = await fetch(url, { credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              requestsList.value = data.items || [];
            }
          } catch (e) {
            console.error(e);
          } finally {
            requestsLoading.value = false;
          }
        };

        const debouncedFilterRequests = () => {
          clearTimeout(filterTimeout);
          filterTimeout = setTimeout(loadRequests, 350);
        };

        const viewTicketDetail = (ticket) => {
          selectedTicket.value = ticket;
          openModal('modal-ticket-detail');
        };

        const updateTicketStatus = async (ticket, newStatus) => {
          try {
            const res = await fetch('/api/technical-requests/' + ticket.id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ chkStatus: newStatus })
            });
            if (res.ok) {
              ticket.chkStatus = newStatus;
              showToast('Đã cập nhật trạng thái phiếu thành ' + newStatus);
              loadStats();
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
            const res = await fetch('/api/machines/grouped', { credentials: 'include' });
            if (res.ok) {
              machineCatalog.value = await res.json();
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
              headers: { 'Content-Type': 'application/json' },
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

        const deleteMachineByName = async (tech, name) => {
          if (!confirm('Xóa máy ' + name + ' thuộc nhóm ' + tech + '?')) return;
          try {
            const allRes = await fetch('/api/machines', { credentials: 'include' });
            if (allRes.ok) {
              const all = await allRes.json();
              const found = all.find(m => m.tech === tech && m.name === name);
              if (found) {
                await fetch('/api/machines/' + found.id, { method: 'DELETE', credentials: 'include' });
                showToast('Đã xóa máy ' + name);
                loadMachines();
              }
            }
          } catch (e) {
            showToast('Lỗi xóa máy', true);
          }
        };

        // Employees Management
        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { credentials: 'include' });
            if (res.ok) {
              employeesList.value = await res.json();
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
              headers: { 'Content-Type': 'application/json' },
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
            const res = await fetch('/api/employees/' + emp.id, { method: 'DELETE', credentials: 'include' });
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
                const _diac = s => (s == null ? '' : String(s)).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().trim();
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
                  headers: { 'Content-Type': 'application/json' },
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
            const res = await fetch('/api/users', { credentials: 'include' });
            if (res.ok) {
              usersList.value = await res.json();
            }
          } catch (e) {}
        };

        const openAddUserModal = () => {
          newUser.value = { username: '', password: 'Dvt@123', fullName: '', email: '', role: 'EMPLOYEE' };
          openModal('modal-add-user');
        };

        const submitAddUser = async () => {
          try {
            const res = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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
            const res = await fetch('/api/users/' + u.id, { method: 'DELETE', credentials: 'include' });
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
          XLSX.writeFile(wb, 'TechPrint_PhieuYeuCau_' + new Date().toISOString().split('T')[0] + '.xlsx');
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
          XLSX.writeFile(wb, 'TechPrint_DanhSachNhanSu.xlsx');
          showToast('Đã xuất file Excel nhân sự');
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

        onMounted(async () => {
          try {
            const res = await fetch('/auth/session', { credentials: 'include' });
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

          const savedTheme = localStorage.getItem('checkpoint_theme') || localStorage.getItem('dvt_theme') || 'light';
          currentTheme.value = savedTheme;

          loadStats();
          loadMachines();
          loadRequests();
          loadEmployees();
          if (currentUser.value.role === 'ADMIN') {
            loadUsers();
          }
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
          requestsLoading,
          reqFilter,
          selectedTicket,
          machineCatalog,
          newMachine,
          employeesList,
          empSearch,
          empDeptFilter,
          distinctDepts,
          filteredEmployeesList,
          newEmployee,
          usersList,
          newUser,
          setTheme,
          switchTab,
          loadStats,
          loadRequests,
          debouncedFilterRequests,
          viewTicketDetail,
          updateTicketStatus,
          deleteRequest,
          loadMachines,
          openAddMachineModal,
          submitAddMachine,
          deleteMachineByName,
          loadEmployees,
          openAddEmployeeModal,
          submitAddEmployee,
          deleteEmployee,
          openExcelUploader,
          triggerUpload,
          processExcelFile,
          loadUsers,
          openAddUserModal,
          submitAddUser,
          deleteUser,
          exportRequestsExcel,
          exportEmployeesExcel,
          handleLogout,
          handleGlobalClick,
          closeModal,
          get4MLabel,
          getPercent
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
