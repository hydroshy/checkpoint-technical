export const DASHBOARD_REQUEST_HISTORY_HTML = `      <div v-show="canCreateRequest && activeTab === 'v4-history'" class="space-y-6">
        
        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 class="text-lg font-bold">Lịch Sử Phiếu Yêu Cầu Kỹ Thuật</h2>
              <p class="text-xs text-slate-500">Xem lại các phiếu đã lưu trên hệ thống, nạp lại vào form hoặc tải PDF</p>
            </div>
            <button
              @click="loadHistory"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate"></i> Làm mới danh sách
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              v-model="historyFilter.search"
              @input="debouncedSearchHistory"
              placeholder="🔍 Tìm theo Số phiếu, Tên máy, Người yêu cầu..."
              class="input-box px-4 py-2 rounded-xl text-xs"
            />
            <select v-model="historyFilter.chkStatus" @change="loadHistory" class="input-box px-4 py-2 rounded-xl text-xs">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="Open">🔵 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Overdue">🔴 Overdue</option>
              <option value="Closed">🟢 Closed</option>
            </select>
            <select v-model="historyFilter.printTech" @change="loadHistory" class="input-box px-4 py-2 rounded-xl text-xs">
              <option value="ALL">— Tất cả công nghệ in —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
          </div>
        </div>

        <!-- History Items Grid / List -->
        <div v-if="historyLoading" class="glass-card rounded-2xl p-12 text-center text-slate-400">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl text-sky-500 mb-2"></i>
          <p class="text-sm">Đang tải danh sách phiếu...</p>
        </div>

        <div v-else-if="historyItems.length === 0" class="glass-card rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <i class="fa-solid fa-folder-open text-3xl text-slate-300 dark:text-slate-600 mb-2"></i>
          <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">Không tìm thấy phiếu yêu cầu nào</h3>
          <p class="text-xs">Hãy tạo và lưu phiếu yêu cầu mới ở tab "Nhập Phiếu Mới".</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in historyItems"
            :key="item.id"
            class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-sky-500/40 transition"
          >
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">{{ item.docNo }}</span>
                <span
                  :class="getStatusClass(item.chkStatus || item.status)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                >
                  {{ item.chkStatus || item.status || 'Open' }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ item.printTech }}
                </span>
                <span v-if="item.downtime" class="text-[11px] font-mono font-bold text-red-500">
                  ⏳ {{ item.downtime }} phút
                </span>
              </div>
              <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Máy: <span class="text-sky-600 dark:text-sky-400">{{ item.machineName }}</span> | Yêu cầu bởi: {{ item.reqBy }} ({{ item.reqDate }} {{ item.reqTime }})
              </div>
              <p class="text-xs text-slate-500 line-clamp-1">
                Sự cố: {{ item.problem }}
              </p>
            </div>

            <!-- Item Action Buttons -->
            <div class="flex flex-wrap items-center gap-2 self-end md:self-auto">
              <button
                @click="loadItemIntoForm(item)"
                class="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Tải thông tin phiếu này vào biểu mẫu để tiếp tục sửa hoặc in"
              >
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Nạp vào Form
              </button>
              <button
                @click="quickDownloadPDF(item)"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Xuất file PDF"
              >
                <i class="fa-solid fa-file-pdf text-red-500"></i> Xuất PDF
              </button>
            </div>
          </div>
        </div>

      </div>`;
