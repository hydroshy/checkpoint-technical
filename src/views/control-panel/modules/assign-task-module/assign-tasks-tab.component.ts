export const CP_ASSIGN_TASKS_TAB_HTML = `        <!-- =====================================================================
             VIEW 1.5: MODULE PHÂN CÔNG KỸ THUẬT (ASSIGN TASK - CARDS VIEW)
             ===================================================================== -->
        <div v-show="activeTab === 'assign-tasks'" class="space-y-5">
          <!-- Top bar: Clean header without extra buttons or redundant descriptions -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <i class="fa-solid fa-list-check text-amber-500"></i>
                <span>Phân Công Kỹ Thuật</span>
              </h1>
            </div>
          </div>

          <!-- Status KPI Counter Cards: Light & Dark Mode Enhanced -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div
              @click="assignCardStatus = 'ALL'"
              :class="assignCardStatus === 'ALL' ? 'ring-2 ring-sky-500 bg-sky-50/80 dark:bg-sky-500/10' : 'bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-slate-200 dark:border-slate-700/60 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Tất Cả CPS</span>
              <span class="font-mono text-xl font-extrabold text-slate-800 dark:text-slate-100">{{ cpsList.length }}</span>
            </div>
            <div
              @click="assignCardStatus = 'TO_ASSIGN'"
              :class="assignCardStatus === 'TO_ASSIGN' ? 'ring-2 ring-amber-500 bg-amber-50/80 dark:bg-amber-500/10' : 'bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-amber-300 dark:border-amber-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Chờ Phân Công</span>
              <span class="font-mono text-xl font-extrabold text-amber-600 dark:text-amber-400">{{ cpsCountByStatus('TO_ASSIGN') }}</span>
            </div>
            <div
              @click="assignCardStatus = 'IN_PROGRESS'"
              :class="assignCardStatus === 'IN_PROGRESS' ? 'ring-2 ring-sky-500 bg-sky-50/80 dark:bg-sky-500/10' : 'bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-sky-300 dark:border-sky-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">Đang Xử Lý</span>
              <span class="font-mono text-xl font-extrabold text-sky-600 dark:text-sky-400">{{ cpsCountByStatus('IN_PROGRESS') }}</span>
            </div>
            <div
              @click="assignCardStatus = 'OVER_DUE'"
              :class="assignCardStatus === 'OVER_DUE' ? 'ring-2 ring-rose-500 bg-rose-50/80 dark:bg-rose-500/10' : 'bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-rose-300 dark:border-rose-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">Quá Hạn</span>
              <span class="font-mono text-xl font-extrabold text-rose-600 dark:text-rose-400">{{ cpsCountByStatus('OVER_DUE') }}</span>
            </div>
            <div
              @click="assignCardStatus = 'CLOSED'"
              :class="assignCardStatus === 'CLOSED' ? 'ring-2 ring-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10' : 'bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/60'"
              class="glass-card rounded-2xl p-3 border border-emerald-300 dark:border-emerald-500/40 cursor-pointer transition text-center"
            >
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Đã Đóng</span>
              <span class="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ cpsCountByStatus('CLOSED') }}</span>
            </div>
          </div>

          <!-- Filter Toolbar for Cards -->
          <div class="glass-card rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border border-slate-200 dark:border-slate-800">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                v-model="assignCardSearch"
                placeholder="🔍 Tìm kiếm mã CPS, tên máy, sự cố, người yêu cầu, technician..."
                class="input-box w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none"
              />
            </div>
            <div class="flex items-center gap-2">
              <select
                v-model="assignCardStatus"
                class="input-box px-3 py-2 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="ALL">— Tất cả trạng thái —</option>
                <option value="TO_ASSIGN">⏳ Chờ phân công (TO_ASSIGN)</option>
                <option value="IN_PROGRESS">⚡ Đang xử lý (IN_PROGRESS)</option>
                <option value="OVER_DUE">⚠️ Quá hạn (OVER_DUE)</option>
                <option value="CLOSED">✅ Đã đóng (CLOSED)</option>
                <option value="OPEN_TASK">📋 Mở (OPEN_TASK)</option>
              </select>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap pl-1">
                Hiển thị: <b class="text-sky-600 dark:text-sky-400">{{ filteredCpsCards.length }}</b> / {{ cpsList.length }}
              </span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredCpsCards.length === 0" class="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 border border-slate-200 dark:border-slate-800">
            <i class="fa-solid fa-clipboard-check text-4xl text-slate-400 dark:text-slate-500"></i>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">Không có phiếu CPS nào phù hợp với bộ lọc</p>
            <p class="text-xs text-slate-400 dark:text-slate-500">Thử xóa bộ lọc tìm kiếm để xem lại toàn bộ phiếu</p>
          </div>

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="(item, index) in filteredCpsCards"
              :key="item.docNo || item.id || ('cps-' + index)"
              @click="openAssignModal(item)"
              class="glass-card rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer border flex flex-col justify-between group"
              :class="getCardBorderClass(item?.status)"
            >
              <!-- Card Top -->
              <div>
                <div class="flex items-center justify-between gap-2 mb-2.5">
                  <span class="font-mono text-xs font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-500/20">
                    {{ item.docNo || ('CPS-' + (item.cpsrDocNo ? String(item.cpsrDocNo).replace('CPSR-', '') : (item.cpsr?.docNo ? String(item.cpsr.docNo).replace('CPSR-', '') : String(item.id || '').substring(0,8)))) }}
                  </span>
                  <div class="flex items-center gap-1.5">
                    <span :class="getStatusBadgeClass(item?.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                      {{ formatCpsStatus(item?.status) }}
                    </span>
                    <button
                      type="button"
                      @click.stop="deleteCpsRecord(item)"
                      class="text-slate-400 hover:text-rose-500 transition p-1 cursor-pointer"
                      title="Xóa phiếu CPS này"
                    >
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>

                <!-- Machine & Print Tech -->
                <div class="space-y-1.5 mb-2.5">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <i class="fa-solid fa-print text-indigo-500 dark:text-indigo-400 text-[11px]"></i>
                    <span class="truncate">{{ item.machineName || item.cpsr?.machineName || 'Chưa xác định máy' }}</span>
                    <span v-if="item.printTech || item.cpsr?.printTech" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent">
                      {{ item.printTech || item.cpsr?.printTech }}
                    </span>
                  </div>
                  <!-- Problem summary -->
                  <p class="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50 min-h-[38px]">
                    {{ item.problem || item.cpsr?.problem || 'Không có mô tả sự cố' }}
                  </p>
                </div>

                <!-- Requester & Time -->
                <div class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mb-2.5">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 dark:text-slate-400">Người YC:</span>
                    <span class="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[150px]">{{ item.reqBy || item.cpsr?.reqBy || '-' }}</span>
                  </div>
                  <div class="flex items-center justify-between font-mono text-[10px]">
                    <span class="text-slate-500 dark:text-slate-400">Thời gian:</span>
                    <span class="text-slate-600 dark:text-slate-400">{{ (item.reqDate || item.cpsr?.reqDate || '') + ' ' + (item.reqTime || item.cpsr?.reqTime || '') }}</span>
                  </div>
                  <div v-if="item.priority || item.cpsr?.priority" class="flex items-center justify-between">
                    <span class="text-slate-500 dark:text-slate-400">Ưu tiên:</span>
                    <span :class="(item.priority || item.cpsr?.priority) === 'Hỗ trợ ngay' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-medium'">
                      {{ item.priority || item.cpsr?.priority }}
                    </span>
                  </div>
                </div>

                <!-- Linkage Tags: Clean Pastel Badges -->
                <div class="flex items-center gap-1 text-[9px] font-mono text-slate-500 dark:text-slate-400 mb-2.5 flex-wrap">
                  <span class="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/40 text-sky-700 dark:text-sky-300 font-semibold">
                    R: {{ item.cpsrDocNo || item.cpsr?.docNo || '-' }}
                  </span>
                  <span class="px-1.5 py-0.5 rounded border font-semibold" :class="item.cpstDocNo || item.cpst?.docNo ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'">
                    T: {{ item.cpstDocNo || item.cpst?.docNo || 'None' }}
                  </span>
                  <span class="px-1.5 py-0.5 rounded border font-semibold" :class="item.cpsfDocNo || item.cpsf?.docNo ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'">
                    F: {{ item.cpsfDocNo || item.cpsf?.docNo || 'None' }}
                  </span>
                </div>

                <!-- Metrics (Downtime & Scrap Rate) -->
                <div v-if="(item.downtime != null && item.downtime > 0) || item.wastePercent" class="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800 mb-2.5">
                  <div>
                    <span class="text-slate-500 dark:text-slate-400 block text-[9px]">Downtime</span>
                    <span class="text-amber-600 dark:text-amber-400 font-bold">{{ item.downtime }} phút</span>
                  </div>
                  <div>
                    <span class="text-slate-500 dark:text-slate-400 block text-[9px]">Tỉ lệ phế</span>
                    <span class="text-rose-600 dark:text-rose-400 font-bold">{{ item.wastePercent || '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Bottom: Technician & Action -->
              <div class="pt-2.5 border-t border-slate-200 dark:border-slate-700/60">
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <span class="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Technician:</span>
                  <span v-if="getTechnicianDisplayName(item)" class="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px] flex items-center gap-1" :title="getTechnicianDisplayName(item)">
                    <i class="fa-solid fa-user-check text-[10px]"></i> {{ getTechnicianDisplayName(item) }}
                  </span>
                  <span v-else class="text-amber-600 dark:text-amber-400/80 italic text-[11px] flex items-center gap-1">
                    <i class="fa-regular fa-clock text-[10px]"></i> Chưa giao
                  </span>
                </div>

                <div v-if="item.deadline" class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-mono">
                  <span class="text-slate-500 dark:text-slate-400 text-[10px]">Deadline:</span>
                  <span class="text-sky-600 dark:text-sky-300 text-[10px]">{{ formatDateTimeDisplay(item.deadline) }}</span>
                </div>

                <!-- Action Buttons: Assign, Edit, Link -->
                <div class="grid grid-cols-4 gap-1.5 mt-2" @click.stop>
                  <button
                    type="button"
                    @click.stop="openAssignModal(item)"
                    class="col-span-2 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    :class="item.status === 'TO_ASSIGN' || !item.assignedTo ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'"
                    title="Phân công Technician"
                  >
                    <i class="fa-solid fa-user-gear text-[11px]"></i>
                    <span class="truncate">{{ item.status === 'TO_ASSIGN' || !item.assignedTo ? 'Phân công' : 'Đổi Technician' }}</span>
                  </button>
                  <button
                    type="button"
                    @click.stop="openEditModal('cps', item)"
                    class="py-1.5 px-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    title="Chỉnh sửa phiếu CPS"
                  >
                    <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                    <span>Sửa</span>
                  </button>
                  <button
                    type="button"
                    @click.stop="openLinkModal(item)"
                    class="py-1.5 px-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    title="Ghép nối với CPST/CPSF"
                  >
                    <i class="fa-solid fa-link text-[11px]"></i>
                    <span>Ghép</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
