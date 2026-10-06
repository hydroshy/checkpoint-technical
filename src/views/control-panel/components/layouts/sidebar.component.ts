export const CP_SIDEBAR_HTML = `      <!-- MOBILE BACKDROP -->
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
      </aside>`;
