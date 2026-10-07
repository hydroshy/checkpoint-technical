export const CP_HEADER_HTML = `    <!-- TOP APP BAR -->
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
              <span class="text-sm font-extrabold text-black dark:text-white">Checkpoint Systems</span>
            </div>
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

        <!-- Independent Control Panel Indicator -->
        <div class="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs">
          <span class="text-slate-800 dark:text-slate-200 font-bold capitalize">Control Panel</span>
        </div>
      </div>

      <!-- Right User Menu -->
      <div class="flex items-center gap-2 sm:gap-2.5">
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
    </header>`;
