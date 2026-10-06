export const DASHBOARD_KPI_CARDS_HTML = `        <!-- 4 KPI Summary Cards -->
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
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-xs">
              <span class="text-emerald-500 font-bold flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> Đạt SLA: {{ kpiSlaMetRate }}%
              </span>
              <div class="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                <span class="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500" title="Open">{{ kpiOpenRequests }} Open</span>
                <span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500" title="In Progress">{{ kpiInProgressRequests }} Prog</span>
                <span class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500" title="Overdue" v-if="kpiOverdueRequests > 0">{{ kpiOverdueRequests }} Overdue</span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500" title="Closed">{{ kpiClosedRequests }} Closed</span>
              </div>
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
        </div>`;
