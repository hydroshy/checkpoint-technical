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
          <!-- HOME: OVERVIEW CHÍNH -->
          <div class="space-y-1 mb-2">
            <button
              @click="switchTab('overview')"
              :class="{ active: activeTab === 'overview' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
              title="Overview"
            >
              <i class="fa-solid fa-house w-4 text-center text-xs text-sky-500"></i>
              <span class="truncate">Overview</span>
            </button>
          </div>

          <!-- SIDEBAR NAVIGATION MENU: 4 CORE GROUPS WITH FULL MODULES -->
          <!-- GROUP 1: VẬN HÀNH & PHIẾU KỸ THUẬT -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Vận Hành & Phiếu
            </div>
            <button
              @click="switchTab('report-technical')"
              :class="{ active: activeTab === 'report-technical' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
              title="Report Technical"
            >
              <i class="fa-solid fa-chart-line w-4 text-center text-xs text-emerald-500"></i>
              <span class="truncate">Report Technical</span>
            </button>
            <button
              @click="switchTab('requests')"
              :class="{ active: activeTab === 'requests' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-table-list w-4 text-center text-xs text-sky-500"></i>
              <span class="truncate">Quản lý phiếu kỹ thuật</span>
            </button>
            <!-- Ẩn liên kết phụ trên Sidebar - chỉ để 1 mục duy nhất dẫn đến module -->
            <span class="hidden" aria-hidden="true">
              <a href="/form-request"></a>
              <a href="/technical-feedback"></a>
              <a href="/confirm-request"></a>
            </span>
            <button
              @click="switchTab('assign-tasks')"
              :class="{ active: activeTab === 'assign-tasks' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-list-check w-4 text-center text-xs text-amber-500"></i>
              <span class="truncate">Phân công kỹ thuật</span>
              <span v-if="pendingAssignCount > 0" class="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full font-mono">
                {{ pendingAssignCount }}
              </span>
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
              <i class="fa-solid fa-print w-4 text-center text-xs text-blue-500"></i>
              <span class="truncate">Máy móc & thiết bị</span>
            </button>
            <button
              @click="switchTab('employees')"
              :class="{ active: activeTab === 'employees' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-users w-4 text-center text-xs text-cyan-500"></i>
              <span class="truncate">Nhân viên kỹ thuật</span>
            </button>
          </div>

          <!-- GROUP 3: QUẢN LÝ USER & PHÂN QUYỀN -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quản Lý User & Phân Quyền
            </div>
            <button
              @click="switchTab('users')"
              :class="{ active: activeTab === 'users' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
            >
              <i class="fa-solid fa-user-shield w-4 text-center text-xs text-rose-500"></i>
              <span class="truncate">Tài khoản & phân quyền</span>
            </button>
          </div>

          <!-- GROUP 4: DATABASE & CƠ SỞ DỮ LIỆU -->
          <div class="space-y-1">
            <div class="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Database
            </div>
            <button
              @click="switchTab('database')"
              :class="{ active: activeTab === 'database' || activeTab === 'existing-data' }"
              class="nav-item w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-left cursor-pointer"
              title="Database & Cơ Sở Dữ Liệu"
            >
              <i class="fa-solid fa-database w-4 text-center text-xs text-violet-500"></i>
              <span class="truncate">Database</span>
            </button>
            <span class="hidden" aria-hidden="true" @click="switchTab('existing-data')"></span>
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
            <span class="font-semibold text-slate-700 dark:text-slate-200">Control Panel</span>
          </div>
          <div class="flex justify-between">
            <span>Data Grid:</span>
            <span class="font-mono text-emerald-500">Tabulator v6</span>
          </div>
        </div>
      </aside>`;
