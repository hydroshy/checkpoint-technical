export const CP_MANAGEMENT_TASKS_TAB_HTML = `        <!-- =====================================================================
             VIEW 2: MODULE QUẢN LÝ PHIẾU KỸ THUẬT (MANAGEMENT-TASK-MODULE)
             Chia rõ 4 mục CPS, CPSR, CPST, CPSF (CPS link cả 3 phiếu)
             ===================================================================== -->
        <div v-show="activeTab === 'requests'" class="space-y-5 management-task-container">
          <!-- Top Header & Primary Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Quản Lý Phiếu Kỹ Thuật</h1>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Điều phối toàn diện: Phiếu CPS (liên kết CPSR • CPST • CPSF) và 3 biểu mẫu độc lập qua Tabulator v6
              </p>
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

          <!-- 4 Core Sections Sub-Tab Switcher (CPS Link cả 3 phiếu, CPSR, CPST, CPSF) -->
          <div class="glass-card rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2 border border-slate-200 dark:border-slate-800">
            <div class="flex flex-wrap items-center gap-1.5">
              <!-- Mục 1: CPS - Link cả 3 phiếu CPSR, CPST, CPSF -->
              <button
                @click="switchSplitTab('chain')"
                :class="splitTab === 'chain' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 1: Phiếu CPS - Chuỗi 1-1-1 liên kết toàn diện CPSR, CPST, CPSF"
              >
                <i class="fa-solid fa-link text-sky-300"></i>
                <span>🔗 Phiếu CPS (Chuỗi 1-1-1)</span>
              </button>

              <!-- Mục 2: CPSR - Phiếu Yêu Cầu Kỹ Thuật -->
              <button
                @click="switchSplitTab('cpsr')"
                :class="splitTab === 'cpsr' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 2: Phiếu Yêu Cầu Kỹ Thuật Ban Đầu (CPSR)"
              >
                <i class="fa-solid fa-file-circle-plus text-sky-300"></i>
                <span>1. Phiếu Yêu Cầu (CPSR)</span>
              </button>

              <!-- Mục 3: CPST - Phiếu Phản Hồi Kỹ Thuật -->
              <button
                @click="switchSplitTab('cpst')"
                :class="splitTab === 'cpst' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 3: Phiếu Phản Hồi Xử Lý Kỹ Thuật (CPST)"
              >
                <i class="fa-solid fa-screwdriver-wrench text-emerald-300"></i>
                <span>2. Phản Hồi KT (CPST)</span>
              </button>

              <!-- Mục 4: CPSF - Phiếu Bàn Giao & Nghiệm Thu -->
              <button
                @click="switchSplitTab('cpsf')"
                :class="splitTab === 'cpsf' ? 'bg-sky-600 text-white font-bold shadow-md' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 management-subtab-btn"
                title="Mục 4: Phiếu Nghiệm Thu & Bàn Giao Sản Xuất (CPSF)"
              >
                <i class="fa-solid fa-circle-check text-purple-300"></i>
                <span>3. Bàn Giao (CPSF)</span>
              </button>

              <!-- Mục Phụ: Dữ Liệu Cũ (Legacy) -->
              <button
                @click="switchSplitTab('legacy')"
                :class="splitTab === 'legacy' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-700 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'"
                class="px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Dữ Liệu Cũ
              </button>
            </div>

            <!-- Form Action Buttons Directly on Tabulator Bar -->
            <div class="flex flex-wrap items-center gap-1.5">
              <a
                href="/form-request"
                target="_blank"
                class="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Mở biểu mẫu tạo mới phiếu yêu cầu kỹ thuật CPSR"
              >
                <i class="fa-solid fa-file-circle-plus"></i> + CPSR
              </a>
              <a
                href="/technical-feedback"
                target="_blank"
                class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Mở biểu mẫu phản hồi kỹ thuật CPST"
              >
                <i class="fa-solid fa-screwdriver-wrench"></i> + CPST
              </a>
              <a
                href="/confirm-request"
                target="_blank"
                class="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Mở biểu mẫu nghiệm thu & bàn giao CPSF"
              >
                <i class="fa-solid fa-circle-check"></i> + CPSF
              </a>
              <button
                type="button"
                @click="openCreateCpsModal"
                class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Tạo mới phiếu CPS (Bắt buộc chọn CPSR)"
              >
                <i class="fa-solid fa-plus"></i> + Tạo CPS
              </button>
              <button
                type="button"
                @click="openLinkModal()"
                class="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                title="Ghép nối chuỗi tiến trình CPS"
              >
                <i class="fa-solid fa-link"></i> Ghép Nối
              </button>
            </div>
          </div>

          <!-- Section Guide Banner: Giúp người dùng nắm rõ liên kết của mục hiện tại -->
          <div v-show="splitTab === 'chain'" class="px-4 py-2 bg-sky-50/70 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl flex items-center justify-between text-xs text-sky-800 dark:text-sky-300">
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-circle-info text-sky-500"></i>
              <span><strong>Mục CPS:</strong> Điều phối trung tâm liên kết cả 3 phiếu (CPSR: Yêu cầu • CPST: Phản hồi • CPSF: Bàn giao). Click mã phiếu để xem chi tiết.</span>
            </span>
          </div>

          <!-- Filter Toolbar for Tabulator (Tối ưu phản hồi với debounced input) -->
          <div v-show="splitTab !== 'legacy'" class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-slate-200 dark:border-slate-800">
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

          <div v-show="splitTab === 'legacy'" class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              v-model="reqFilter.search"
              @input="applyReqFilters"
              placeholder="🔍 Tìm mã phiếu, tên máy, người yêu cầu, lỗi..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none"
            />
            <select v-model="reqFilter.chkStatus" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="Open">🔵 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Overdue">🔴 Overdue</option>
              <option value="Closed">🟢 Closed</option>
            </select>
            <select v-model="reqFilter.printTech" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả công nghệ in —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
            <select v-model="reqFilter.priority" @change="applyReqFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
              <option value="ALL">— Tất cả mức ưu tiên —</option>
              <option value="Immediate">🔴 Hỗ trợ ngay (Immediate)</option>
              <option value="Hold">🟡 Chạy tạm (Hold)</option>
              <option value="Other">📌 Khác</option>
            </select>
          </div>

          <!-- Tabulator Containers -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div v-show="splitTab !== 'legacy'" id="tabulator-split-forms"></div>
            <div v-show="splitTab === 'legacy'" id="tabulator-requests"></div>
          </div>
        </div>`;
