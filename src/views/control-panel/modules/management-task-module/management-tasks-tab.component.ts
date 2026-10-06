export const CP_MANAGEMENT_TASKS_TAB_HTML = `        <!-- =====================================================================
             VIEW 2: MODULE QUẢN LÝ PHIẾU KỸ THUẬT (MANAGEMENT-TASK-MODULE)
             4 mục tinh gọn: CPS, CPSR, CPST, CPSF
             ===================================================================== -->
        <div v-show="activeTab === 'requests'" class="space-y-5 management-task-container">
          <!-- Top Header & Primary Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Quản Lý Phiếu Kỹ Thuật</h1>
              <!-- Công tắc Bật/Tắt Form Public (/form-request) -->
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs" title="Bật/Tắt Form Public (/form-request)">
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-share-nodes text-sky-500"></i>
                  <span>Form Public:</span>
                  <span class="font-bold text-[11px]" :class="isPublicFormEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                    {{ isPublicFormEnabled ? 'MỞ' : 'ĐÓNG' }}
                  </span>
                </span>
                <button
                  type="button"
                  @click="togglePublicForm"
                  :disabled="togglingPublicForm"
                  :title="isPublicFormEnabled ? 'Nhấn để tắt form công khai' : 'Nhấn để bật form công khai'"
                  class="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none select-none"
                  :class="isPublicFormEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                    :class="isPublicFormEnabled ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
                <button
                  type="button"
                  v-if="isPublicFormEnabled"
                  @click="copyPublicFormLink"
                  class="text-slate-400 hover:text-sky-500 text-xs ml-0.5 cursor-pointer"
                  title="Sao chép link Form Public"
                >
                  <i :class="copySuccess ? 'fa-solid fa-check text-emerald-500' : 'fa-regular fa-copy'"></i>
                </button>
                <a
                  v-if="isPublicFormEnabled"
                  :href="publicFormUrl"
                  target="_blank"
                  class="text-slate-400 hover:text-sky-500 text-xs cursor-pointer"
                  title="Mở form công khai"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a
                href="/form-request"
                target="_blank"
                class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Mở form tạo phiếu CPSR"
              >
                <i class="fa-solid fa-file-circle-plus"></i> + Form CPSR
              </a>
              <a
                href="/technical-feedback"
                target="_blank"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Mở form phản hồi kỹ thuật CPST"
              >
                <i class="fa-solid fa-screwdriver-wrench"></i> + Form CPST
              </a>
              <a
                href="/confirm-request"
                target="_blank"
                class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Mở form nghiệm thu bàn giao CPSF"
              >
                <i class="fa-solid fa-circle-check"></i> + Form CPSF
              </a>
              <button
                type="button"
                @click="openCreateCpsModal"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Tạo mới phiếu CPS (Bắt buộc chọn CPSR)"
              >
                <i class="fa-solid fa-plus"></i> + Tạo Phiếu CPS
              </button>
              <button
                type="button"
                @click="openLinkModal()"
                class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Ghép nối chuỗi tiến trình CPS với CPST và CPSF"
              >
                <i class="fa-solid fa-link"></i> 🔗 Ghép Nối Phiếu
              </button>
              <button
                @click="exportCurrentTabExcel"
                class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- 4 Core Sections Sub-Tab Switcher (CPS, CPSR, CPST, CPSF) -->
          <div class="glass-card rounded-2xl p-2 flex flex-wrap items-center gap-2 border border-slate-200 dark:border-slate-800">
            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Mục 1: CPS -->
              <button
                @click="switchSplitTab('chain')"
                :class="splitTab === 'chain' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 1: Phiếu CPS - Chuỗi liên kết điều phối trung tâm"
              >
                <i class="fa-solid fa-link text-sky-300"></i>
                <span>CPS</span>
              </button>

              <!-- Mục 2: CPSR -->
              <button
                @click="switchSplitTab('cpsr')"
                :class="splitTab === 'cpsr' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 2: Phiếu yêu cầu kỹ thuật ban đầu (CPSR)"
              >
                <i class="fa-solid fa-file-circle-plus text-sky-300"></i>
                <span>CPSR</span>
              </button>

              <!-- Mục 3: CPST -->
              <button
                @click="switchSplitTab('cpst')"
                :class="splitTab === 'cpst' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 3: Phiếu phản hồi xử lý kỹ thuật (CPST)"
              >
                <i class="fa-solid fa-screwdriver-wrench text-emerald-300"></i>
                <span>CPST</span>
              </button>

              <!-- Mục 4: CPSF -->
              <button
                @click="switchSplitTab('cpsf')"
                :class="splitTab === 'cpsf' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 4: Phiếu nghiệm thu & bàn giao sản xuất (CPSF)"
              >
                <i class="fa-solid fa-circle-check text-purple-300"></i>
                <span>CPSF</span>
              </button>
            </div>
          </div>

          <!-- Filter Toolbar for Tabulator (Tối ưu phản hồi với debounced input) -->
          <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              v-model="splitFilter.search"
              @input="debouncedApplySplitFilters"
              placeholder="🔍 Tìm kiếm mã phiếu, người yêu cầu, Technician, thiết bị..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none"
            />
            <select v-model="splitFilter.status" @change="applySplitFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả trạng thái / tiến độ —</option>
              <template v-if="splitTab === 'chain'">
                <option value="TO_ASSIGN">⏳ Chờ phân công (TO_ASSIGN)</option>
                <option value="IN_PROGRESS">⚡ Đang xử lý (IN_PROGRESS)</option>
                <option value="OVER_DUE">⚠️ Quá hạn (OVER_DUE)</option>
                <option value="CLOSED">✅ Đã đóng (CLOSED)</option>
                <option value="OPEN_TASK">📋 Mở (OPEN_TASK)</option>
                <option value="3/3">🟢 Hoàn tất chuỗi (3/3)</option>
                <option value="2/3">🟡 Đang xử lý / Phản hồi (2/3)</option>
                <option value="1/3">🔵 Yêu cầu mới (1/3)</option>
              </template>
              <option v-if="splitTab === 'cpsr'" value="Hàng SX lần đầu">Hàng SX lần đầu</option>
              <option v-if="splitTab === 'cpsr'" value="Hàng SX nhiều lần">Hàng SX nhiều lần</option>
              <option v-if="splitTab === 'cpst'" value="Đã khắc phục">🟢 Đã khắc phục</option>
              <option v-if="splitTab === 'cpst'" value="Theo dõi thêm">🟡 Theo dõi thêm</option>
              <option v-if="splitTab === 'cpst'" value="Hư hỏng nặng">🔴 Hư hỏng nặng</option>
              <option v-if="splitTab === 'cpsf'" value="Đạt">🟢 Đạt</option>
              <option v-if="splitTab === 'cpsf'" value="Chưa đạt">🔴 Chưa đạt</option>
            </select>
            <div class="flex items-center justify-end text-xs text-slate-600 dark:text-slate-400 font-mono">
              Tổng cộng: <span class="text-sky-600 dark:text-sky-400 font-bold ml-1.5">{{ currentSplitCount }}</span> bản ghi
            </div>
          </div>

          <!-- Tabulator Container -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div id="tabulator-split-forms"></div>
          </div>
        </div>`;
