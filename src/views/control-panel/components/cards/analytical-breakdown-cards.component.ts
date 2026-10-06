export const CP_ANALYTICAL_BREAKDOWN_CARDS_HTML = `          <!-- Analytical Breakdown Cards -->
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
        </div>`;
