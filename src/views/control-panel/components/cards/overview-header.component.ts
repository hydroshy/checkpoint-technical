export const CP_OVERVIEW_HEADER_HTML = `        <div v-show="activeTab === 'overview'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Tổng Quan Vận Hành & Phân Tích Sự Cố</h1>
              <p class="text-xs text-slate-500">Thống kê chỉ số Downtime, nguyên nhân 4M, nhóm công đoạn và chất lượng bàn giao</p>
            </div>
            <button
              @click="loadStats"
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate"></i> Cập nhật số liệu
            </button>
          </div>`;
