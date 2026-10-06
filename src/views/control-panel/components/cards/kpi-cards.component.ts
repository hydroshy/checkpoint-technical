export const CP_KPI_CARDS_HTML = `          <!-- KPI Cards -->
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
          </div>`;
