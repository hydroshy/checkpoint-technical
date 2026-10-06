export const DASHBOARD_ANALYTICS_CHARTS_HTML = `        <!-- 4 Analytics Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Chart 1: Severity Breakdown -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Phân Bố Mức Độ Nghiêm Trọng (Severity)</h4>
                <p class="text-xs text-slate-400">Sheet 1_Technical_Requests (Critical, High, Medium, Low)</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Requests</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-severity"></canvas>
            </div>
          </div>

          <!-- Chart 2: Status Breakdown -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Tình Trạng Xử Lý Phiếu (Status)</h4>
                <p class="text-xs text-slate-400">Tiến độ giải quyết các yêu cầu kỹ thuật</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Status</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-status"></canvas>
            </div>
          </div>

          <!-- Chart 3: Defect Root Cause -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Nguyên Nhân Gốc Sự Cố Defect</h4>
                <p class="text-xs text-slate-400">Sheet 2_Defect_Log (Machine, System, Method...)</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Defects</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-rootcause"></canvas>
            </div>
          </div>

          <!-- Chart 4: Action Plan Fix Types -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Phân Loại Giải Pháp Kế Hoạch (Fix Types)</h4>
                <p class="text-xs text-slate-400">Sheet 3_Action_Plan (Phòng ngừa, Báo cáo 8D, Sửa nhanh)</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Actions</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="chart-fixtype"></canvas>
            </div>
          </div>
        </div>`;
