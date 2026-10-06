export const CP_REPORT_TECHNICAL_TAB_HTML = `        <!-- =====================================================================
             VIEW: REPORT TECHNICAL (PHÂN TÍCH & BÁO CÁO KỸ THUẬT ĐỒNG BỘ OVERVIEW)
             ===================================================================== -->
        <div v-show="activeTab === 'report-technical'" class="space-y-6">
          <!-- Header Banner with Title & Quick Preset Controls -->
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <i class="fa-solid fa-chart-pie mr-1"></i> Technical Analytics
                </span>
                <span class="text-xs text-slate-500 font-mono">Synced with Overview Hub</span>
              </div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">Report Technical</h1>
              <p class="text-xs text-slate-600 dark:text-slate-400">Thống kê toàn diện chỉ số phiếu kỹ thuật, thời gian downtime và phân bổ trạng thái CPS theo khoảng thời gian</p>
            </div>

            <!-- Time Range & Presets Filter Bar -->
            <div class="glass-card rounded-2xl p-2.5 flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <!-- Quick Presets -->
              <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  @click="setReportPreset('7d')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === '7d' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  1 Tuần trước
                </button>
                <button
                  type="button"
                  @click="setReportPreset('today')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === 'today' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  Hôm nay
                </button>
                <button
                  type="button"
                  @click="setReportPreset('month')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === 'month' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  Tháng này
                </button>
                <button
                  type="button"
                  @click="setReportPreset('all')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                  :class="reportQuickPreset === 'all' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
                >
                  Tất cả
                </button>
              </div>

              <!-- Date Picker Inputs -->
              <div class="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  v-model="reportDateFrom"
                  @change="onReportFilterChange"
                  class="input-box px-2.5 py-1 rounded-xl font-mono text-xs outline-none"
                  title="Từ ngày"
                />
                <span class="text-slate-400">→</span>
                <input
                  type="date"
                  v-model="reportDateTo"
                  @change="onReportFilterChange"
                  class="input-box px-2.5 py-1 rounded-xl font-mono text-xs outline-none"
                  title="Đến ngày"
                />
              </div>

              <!-- Actions -->
              <button
                type="button"
                @click="exportReportTechnicalExcel"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
                title="Xuất bảng báo cáo này ra Excel"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- 7 KPI STATISTICAL CARDS -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <!-- Card 1: Số phiếu Kỹ thuật yêu cầu -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-sky-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">Phiếu Yêu Cầu</span>
                <i class="fa-solid fa-file-invoice text-sky-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.totalRequests }}</div>
              <div class="text-[10px] text-slate-500 truncate">Tổng phiếu trong kỳ</div>
            </div>

            <!-- Card 2: Tổng thời gian down time (phút/giờ) -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-amber-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">Tổng Downtime</span>
                <i class="fa-solid fa-clock-rotate-left text-amber-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {{ reportStats.totalDowntimeMinutes }}<span class="text-xs font-normal ml-0.5">m</span>
              </div>
              <div class="text-[10px] text-slate-500 truncate">~ {{ reportStats.totalDowntimeHours }} giờ dừng máy</div>
            </div>

            <!-- Card 3: Số lượng OPEN_TASK -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-slate-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">OPEN_TASK</span>
                <i class="fa-solid fa-folder-open text-slate-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-slate-700 dark:text-slate-300">{{ reportStats.openTask }}</div>
              <div class="text-[10px] text-slate-500 truncate">Phiếu mới mở</div>
            </div>

            <!-- Card 4: Số lượng TO_ASSIGN -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-amber-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">TO_ASSIGN</span>
                <i class="fa-solid fa-user-clock text-amber-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{{ reportStats.toAssign }}</div>
              <div class="text-[10px] text-slate-500 truncate">Chờ giao kỹ thuật</div>
            </div>

            <!-- Card 5: Số lượng IN_PROGRESS -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-sky-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">IN_PROGRESS</span>
                <i class="fa-solid fa-bolt text-sky-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.inProgress }}</div>
              <div class="text-[10px] text-slate-500 truncate">Đang xử lý sửa chữa</div>
            </div>

            <!-- Card 6: Số lượng CLOSED -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-emerald-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">CLOSED</span>
                <i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ reportStats.closed }}</div>
              <div class="text-[10px] text-slate-500 truncate">Đã nghiệm thu đóng</div>
            </div>

            <!-- Card 7: Số lượng OVER_DUE -->
            <div class="glass-card rounded-2xl p-4 space-y-1.5 relative overflow-hidden border-rose-500/20">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">OVER_DUE</span>
                <i class="fa-solid fa-triangle-exclamation text-rose-500 text-sm"></i>
              </div>
              <div class="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">{{ reportStats.overDue }}</div>
              <div class="text-[10px] text-slate-500 truncate">Quá hạn xử lý</div>
            </div>
          </div>

          <!-- DONUT CHART & STATUS BREAKDOWN SECTION -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Donut Chart with Center Total -->
            <div class="lg:col-span-5 glass-card rounded-2xl p-5 flex flex-col items-center justify-between space-y-4">
              <div class="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-500"></i> Phân Bổ Tỷ Lệ Trạng Thái Phiếu
                </h3>
                <span class="text-[10px] font-mono text-slate-400">Donut Chart</span>
              </div>

              <!-- Relative Chart Container with Absolute Center Label -->
              <div class="relative w-64 h-64 mx-auto flex items-center justify-center my-2">
                <canvas id="chart-report-technical-donut" class="w-full h-full"></canvas>
                <!-- Center Overlay displaying Tổng số lượng các status của CPS -->
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <div class="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
                    {{ reportStats.totalStatusCps }}
                  </div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Tổng Trạng Thái CPS
                  </div>
                </div>
              </div>

              <div class="w-full text-center text-xs text-slate-500 dark:text-slate-400">
                Sơ đồ Donut thể hiện trực quan tỷ trọng các trạng thái xử lý kỹ thuật trong kỳ lọc.
              </div>
            </div>

            <!-- Detailed Status Legend & Percentage Table -->
            <div class="lg:col-span-7 glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-sky-500"></i> Chi Tiết Số Lượng & Tỷ Trọng Trạng Thái
                </h3>
                <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {{ reportStats.totalRequests }} phiếu
                </span>
              </div>

              <div class="space-y-3">
                <!-- Row: OPEN_TASK -->
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-slate-500"></span>
                    <div>
                      <div class="font-bold text-xs">📋 OPEN_TASK (Mở)</div>
                      <div class="text-[10px] text-slate-400">Phiếu mới tiếp nhận, chưa kích hoạt chuỗi</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono">{{ reportStats.openTask }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.openTask, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: TO_ASSIGN -->
                <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                    <div>
                      <div class="font-bold text-xs text-amber-700 dark:text-amber-400">⏳ TO_ASSIGN (Chờ phân công)</div>
                      <div class="text-[10px] text-slate-400">Đang chờ trưởng ca / quản lý chỉ định KTV</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">{{ reportStats.toAssign }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.toAssign, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: IN_PROGRESS -->
                <div class="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-sky-500"></span>
                    <div>
                      <div class="font-bold text-xs text-sky-700 dark:text-sky-400">⚡ IN_PROGRESS (Đang xử lý)</div>
                      <div class="text-[10px] text-slate-400">KTV đang thao tác sửa chữa tại máy in</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.inProgress }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.inProgress, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: CLOSED -->
                <div class="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                    <div>
                      <div class="font-bold text-xs text-emerald-700 dark:text-emerald-400">✅ CLOSED (Đã đóng)</div>
                      <div class="text-[10px] text-slate-400">Hoàn tất kiểm tra và bàn giao sản xuất (CPSF)</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{{ reportStats.closed }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.closed, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>

                <!-- Row: OVER_DUE -->
                <div class="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
                    <div>
                      <div class="font-bold text-xs text-rose-700 dark:text-rose-400">⚠️ OVER_DUE (Quá hạn)</div>
                      <div class="text-[10px] text-slate-400">Vượt quá thời hạn deadline quy định</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold font-mono text-rose-600 dark:text-rose-400">{{ reportStats.overDue }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ getPercent(reportStats.overDue, reportStats.totalStatusCps) }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TABULATOR TABLE CONTAINER: TỔNG PHIẾU YÊU CẦU THEO TIME RANGE ĐÃ FILTER -->
          <div class="glass-card rounded-2xl p-5 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-sm font-bold flex items-center gap-2">
                  <i class="fa-solid fa-table text-sky-500"></i> Bảng Dữ Liệu Phiếu Kỹ Thuật Trong Khoảng Thời Gian
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Danh sách các phiếu lọc theo mốc thời gian từ {{ reportDateFrom || '...' }} đến {{ reportDateTo || '...' }}</p>
              </div>

              <!-- Quick Search & Status Filter inside Tabulator -->
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  v-model="reportSearch"
                  @input="onReportFilterChange"
                  placeholder="🔍 Tìm mã phiếu, người YC, KTV, thiết bị..."
                  class="input-box px-3.5 py-1.5 rounded-xl text-xs outline-none w-full sm:w-64"
                />
                <select
                  v-model="reportStatusFilter"
                  @change="onReportFilterChange"
                  class="input-box px-3 py-1.5 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="ALL">-- Tất cả trạng thái --</option>
                  <option value="OPEN_TASK">OPEN_TASK</option>
                  <option value="TO_ASSIGN">TO_ASSIGN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="OVER_DUE">OVER_DUE</option>
                </select>
              </div>
            </div>

            <!-- Tabulator Mount Point -->
            <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div id="tabulator-report-technical"></div>
            </div>
          </div>
        </div>`;
