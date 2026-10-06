export const DASHBOARD_NAV_HTML = `          <!-- THẺ 1: PHIẾU NHẬP LIỆU -->
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
                    <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Report Technical</h2>
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
              <span>{{ isRequestActive ? 'Phiếu Nhập Liệu' : 'Report Technical' }}</span>
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

            <!-- Report Technical Tabs -->
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
              class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5 cursor-pointer ml-auto"`;
