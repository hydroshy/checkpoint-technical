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
              </div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">Report Technical</h1>
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

          <!-- 2 BIỂU ĐỒ CLUSTERS GRID (CỤM 1: 5 CARDS + PIE STATUS & CỤM 2: 2 CARDS + 4M CHART) -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            <!-- CỤM 1: 5 CARD TRẠNG THÁI FIT VỪA VỚI PIE CHART PHÂN BỔ TỶ LỆ TRẠNG THÁI PHIẾU BÊN PHẢI -->
            <div class="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <i class="fa-solid fa-chart-pie text-emerald-500"></i> Phân Bổ Tỷ Lệ Trạng Thái Phiếu
                </h3>
                <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {{ reportStats.totalStatusCps }} phiếu
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center flex-1">
                <!-- 5 Card trạng thái bên trái -->
                <div class="sm:col-span-5 flex flex-col justify-between gap-2 h-full">
                  <!-- Card OPEN_TASK -->
                  <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-slate-500"></span>
                      <div>
                        <div class="font-bold text-xs text-slate-700 dark:text-slate-300">OPEN_TASK</div>
                        <div class="text-[9px] text-slate-400">Phiếu mới tiếp nhận</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-extrabold font-mono text-slate-800 dark:text-slate-200">{{ reportStats.openTask }}</div>
                      <div class="text-[9px] text-slate-400 font-mono">{{ getPercent(reportStats.openTask, reportStats.totalStatusCps) }}%</div>
                    </div>
                  </div>

                  <!-- Card TO_ASSIGN -->
                  <div class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                      <div>
                        <div class="font-bold text-xs text-amber-700 dark:text-amber-400">TO_ASSIGN</div>
                        <div class="text-[9px] text-slate-400">Chờ giao kỹ thuật</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-extrabold font-mono text-amber-600 dark:text-amber-400">{{ reportStats.toAssign }}</div>
                      <div class="text-[9px] text-slate-400 font-mono">{{ getPercent(reportStats.toAssign, reportStats.totalStatusCps) }}%</div>
                    </div>
                  </div>

                  <!-- Card IN_PROGRESS -->
                  <div class="p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-sky-500"></span>
                      <div>
                        <div class="font-bold text-xs text-sky-700 dark:text-sky-400">IN_PROGRESS</div>
                        <div class="text-[9px] text-slate-400">Đang xử lý sửa chữa</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ reportStats.inProgress }}</div>
                      <div class="text-[9px] text-slate-400 font-mono">{{ getPercent(reportStats.inProgress, reportStats.totalStatusCps) }}%</div>
                    </div>
                  </div>

                  <!-- Card CLOSED -->
                  <div class="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <div>
                        <div class="font-bold text-xs text-emerald-700 dark:text-emerald-400">CLOSED</div>
                        <div class="text-[9px] text-slate-400">Đã nghiệm thu đóng</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ reportStats.closed }}</div>
                      <div class="text-[9px] text-slate-400 font-mono">{{ getPercent(reportStats.closed, reportStats.totalStatusCps) }}%</div>
                    </div>
                  </div>

                  <!-- Card OVER_DUE -->
                  <div class="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                      <div>
                        <div class="font-bold text-xs text-rose-700 dark:text-rose-400">OVER_DUE</div>
                        <div class="text-[9px] text-slate-400">Quá hạn xử lý</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-extrabold font-mono text-rose-600 dark:text-rose-400">{{ reportStats.overDue }}</div>
                      <div class="text-[9px] text-slate-400 font-mono">{{ getPercent(reportStats.overDue, reportStats.totalStatusCps) }}%</div>
                    </div>
                  </div>
                </div>

                <!-- Pie / Donut Chart Phân Bổ Tỷ Lệ Trạng Thái Phiếu (Bên phải) -->
                <div class="sm:col-span-7 flex flex-col items-center justify-center relative">
                  <div class="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
                    <canvas id="chart-report-technical-donut" class="w-full h-full"></canvas>
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <div class="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
                        {{ reportStats.totalStatusCps }}
                      </div>
                      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                        Tổng Trạng Thái CPS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CỤM 2: 2 CARD (PHIẾU YÊU CẦU, TỔNG DOWNTIME) FIT VỪA VỚI ĐỒ THỊ TỶ LỆ 4M BÊN PHẢI -->
            <div class="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <i class="fa-solid fa-layer-group text-sky-500"></i> Tỷ lệ 4M
                </h3>
                <span class="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {{ report4MStats.total }} sự cố
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center flex-1">
                <!-- 2 Card (Phiếu Yêu Cầu, Tổng Downtime) bên trái fit vừa đồ thị 4M -->
                <div class="sm:col-span-5 flex flex-col justify-between gap-3 h-full">
                  <!-- Card Phiếu Yêu Cầu -->
                  <div class="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/20 flex flex-col justify-between flex-1">
                    <div class="flex items-center justify-between text-slate-400">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Phiếu Yêu Cầu</span>
                      <i class="fa-solid fa-file-invoice text-sky-500 text-lg"></i>
                    </div>
                    <div class="text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400 my-1">
                      {{ reportStats.totalRequests }}
                    </div>
                    <div class="text-[10px] text-slate-500">Tổng phiếu kỹ thuật trong kỳ</div>
                  </div>

                  <!-- Card Tổng Downtime -->
                  <div class="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex flex-col justify-between flex-1">
                    <div class="flex items-center justify-between text-slate-400">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Tổng Downtime</span>
                      <i class="fa-solid fa-clock-rotate-left text-amber-500 text-lg"></i>
                    </div>
                    <div class="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 my-1">
                      {{ reportStats.totalDowntimeMinutes }}<span class="text-xs font-normal ml-0.5">m</span>
                    </div>
                    <div class="text-[10px] text-slate-500 truncate">~ {{ reportStats.totalDowntimeHours }} giờ dừng máy</div>
                  </div>
                </div>

                <!-- Đồ thị tỷ lệ 4M (Man, Machine, Material, Method) bên phải -->
                <div class="sm:col-span-7 flex flex-col items-center justify-center relative">
                  <div class="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
                    <canvas id="chart-report-technical-4m" class="w-full h-full"></canvas>
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <div class="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-none">
                        {{ report4MStats.total }}
                      </div>
                      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                        Số sự cố
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Man: <b class="font-mono text-slate-800 dark:text-slate-200">{{ report4MStats.man }}</b></span>
                    <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Machine: <b class="font-mono text-slate-800 dark:text-slate-200">{{ report4MStats.machine }}</b></span>
                    <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Material: <b class="font-mono text-slate-800 dark:text-slate-200">{{ report4MStats.material }}</b></span>
                    <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Method: <b class="font-mono text-slate-800 dark:text-slate-200">{{ report4MStats.method }}</b></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- GANTT CHART DOWNTIME THEO TỪNG MÁY (NẰM TRỌN CHIỀU NGANG BÊN DƯỚI 2 CỤM BIỂU ĐỒ) -->
          <div class="glass-card rounded-2xl p-5 space-y-4 w-full">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <i class="fa-solid fa-timeline text-amber-500"></i> Tiến Độ Dừng Máy
                </h3>
              </div>
              <div class="flex items-center gap-3 text-xs">
                <div class="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                  <span class="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 shadow-xs"></span>
                  <span>Downtime máy</span>
                </div>
                <span class="text-slate-400">|</span>
                <span class="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {{ ganttMachineRows.length }} máy ghi nhận
                </span>
              </div>
            </div>

            <!-- Gantt Viewport -->
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3">
              <div v-if="ganttMachineRows.length === 0" class="py-12 text-center text-slate-400 text-xs">
                <i class="fa-solid fa-circle-check text-emerald-500 text-2xl mb-2 block"></i>
                Không có sự cố dừng máy (downtime) nào trong khoảng thời gian đã chọn
              </div>

              <div v-else class="min-w-[760px] space-y-2">
                <!-- Header / Trục X Time Ticks -->
                <div class="flex items-center border-b border-slate-200 dark:border-slate-700/60 pb-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <div class="w-48 flex-shrink-0 px-2"></div>
                  <div class="flex-1 relative h-5">
                    <div
                      v-for="(tick, idx) in ganttTimeTicks"
                      :key="idx"
                      class="absolute top-0 transform -translate-x-1/2 text-center whitespace-nowrap pointer-events-none"
                      :style="{ left: tick.percent + '%' }"
                    >
                      <span v-if="tick.label">{{ tick.label }}</span>
                    </div>
                  </div>
                </div>

                <!-- Machine Lanes -->
                <div class="space-y-2 pt-1">
                  <div
                    v-for="mRow in ganttMachineRows"
                    :key="mRow.machineName"
                    class="flex items-center group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-lg p-1 transition"
                  >
                    <!-- Y Axis Label: Tên máy -->
                    <div class="w-48 flex-shrink-0 px-2 flex items-center justify-between pr-3">
                      <span class="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate" :title="mRow.machineName">
                        <i class="fa-solid fa-print text-slate-400 mr-1 text-[10px]"></i>
                        {{ mRow.machineName }}
                      </span>
                      <span class="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                        {{ mRow.totalDowntime }}m
                      </span>
                    </div>

                    <!-- Timeline Track with Yellow Bars -->
                    <div class="flex-1 relative h-7 bg-slate-100 dark:bg-slate-800/60 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700/50">
                      <!-- Grid lines: chia mỗi 1 tiếng là đường kẻ dọc xuống -->
                      <div
                        v-for="(tick, idx) in ganttTimeTicks"
                        :key="'line-' + idx"
                        class="absolute top-0 bottom-0 border-l pointer-events-none"
                        :class="tick.isMajor ? 'border-slate-300 dark:border-slate-600' : 'border-slate-200/80 dark:border-slate-700/40'"
                        :style="{ left: tick.percent + '%' }"
                        :title="tick.hour !== undefined ? (tick.hour + ':00') : ''"
                      ></div>

                      <!-- Yellow Downtime Bars -->
                      <div
                        v-for="(bar, bIdx) in mRow.bars"
                        :key="bIdx"
                        class="absolute top-1 bottom-1 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded cursor-pointer transition shadow-xs flex items-center px-1 group/bar border border-amber-600/30"
                        :style="{ left: bar.left + '%', width: bar.width + '%' }"
                        @click="openChainDetailModal(bar.item)"
                        :title="bar.tooltip"
                      >
                        <span class="text-[9px] font-mono font-bold text-amber-950 truncate pointer-events-none" v-if="bar.width > 5">
                          {{ bar.downtime }}m
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TABULATOR TABLE CONTAINER: DỮ LIỆU PHIẾU YÊU CẦU -->
          <div class="glass-card rounded-2xl p-5 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <i class="fa-solid fa-table text-sky-500"></i> Dữ Liệu Phiếu Yêu Cầu
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Danh sách các phiếu lọc theo mốc thời gian từ {{ reportDateFrom || '...' }} đến {{ reportDateTo || '...' }}</p>
              </div>

              <!-- Quick Search & Status Filter inside Tabulator -->
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  v-model="reportSearch"
                  @input="onReportFilterChange"
                  placeholder="🔍 Tìm mã phiếu, người YC, Technician, thiết bị..."
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
