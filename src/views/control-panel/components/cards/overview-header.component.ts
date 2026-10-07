export const CP_OVERVIEW_HEADER_HTML = `          <!-- HEADER TỔNG QUAN HỆ THỐNG -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tổng Quan Hệ Thống & Vận Hành</h1>
              <p class="text-xs text-slate-500">Giám sát tổng thể người dùng, module hoạt động, chỉ số vận hành và thông tin hệ thống Checkpoint</p>
            </div>
            <button
              @click="loadStats(); loadUsers();"
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate"></i> Cập nhật số liệu
            </button>
          </div>

          <!-- KHỐI TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW) -->
          <div class="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <i class="fa-solid fa-server"></i>
                </div>
                <div>
                  <h2 class="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">Tổng Quan Hệ Thống</h2>
                  <p class="text-[11px] text-slate-500">Thông tin hạ tầng, người dùng và các module đang hoạt động trong hệ thống</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  <i class="fa-solid fa-circle text-[7px] animate-pulse"></i> Trực tuyến
                </span>
              </div>
            </div>

            <!-- 3 Khối chỉ số chính: Người Dùng (Users), Module Đang Hoạt Động, Thông Tin Hệ Thống -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Khối 1: Số User (Người Dùng) -->
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div class="space-y-1">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Người Dùng (Users)</div>
                  <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
                    {{ usersList.length || 0 }} <span class="text-xs font-semibold text-slate-500">tài khoản</span>
                  </div>
                  <div class="text-[11px] text-slate-500">
                    {{ usersList.filter(u => u.role === 'ADMIN').length }} Admin · {{ usersList.filter(u => u.role === 'TECHNICIAN').length }} KTV · {{ usersList.filter(u => u.role === 'EMPLOYEE').length }} NV
                  </div>
                </div>
                <div class="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-lg">
                  <i class="fa-solid fa-users"></i>
                </div>
              </div>

              <!-- Khối 2: Số Module Đang Hoạt Động -->
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div class="space-y-1">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Module Hoạt Động</div>
                  <div class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    6 / 6 <span class="text-xs font-semibold text-slate-500">module</span>
                  </div>
                  <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    100% module vận hành ổn định
                  </div>
                </div>
                <div class="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg">
                  <i class="fa-solid fa-cubes"></i>
                </div>
              </div>

              <!-- Khối 3: Thông Tin Hệ Thống -->
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div class="space-y-1">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thông Tin Hệ Thống</div>
                  <div class="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Checkpoint Enterprise
                  </div>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                    <span>Phiên bản: v2.4.0</span>
                    <span>·</span>
                    <span>Platform: Node/Express</span>
                  </div>
                </div>
                <div class="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-lg">
                  <i class="fa-solid fa-microchip"></i>
                </div>
              </div>
            </div>

            <!-- Chi tiết trạng thái các Module hệ thống -->
            <div class="pt-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Chi Tiết Trạng Thái Module Hệ Thống:</div>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-circle text-[7px] text-emerald-500"></i>
                  <div class="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">D-Module Dashboard</div>
                </div>
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-circle text-[7px] text-emerald-500"></i>
                  <div class="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">Phiếu Kỹ Thuật (CPSR)</div>
                </div>
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-circle text-[7px] text-emerald-500"></i>
                  <div class="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">Phân Công Kỹ Thuật</div>
                </div>
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-circle text-[7px] text-emerald-500"></i>
                  <div class="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">Máy Móc & Thiết Bị</div>
                </div>
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-circle text-[7px] text-emerald-500"></i>
                  <div class="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">Nhân Sự & Kỹ Thuật</div>
                </div>
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-circle text-[7px] text-emerald-500"></i>
                  <div class="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">Database & Dữ Liệu</div>
                </div>
              </div>
            </div>
          </div>`;
