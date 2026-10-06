export const DASHBOARD_BOTTOM_BAR_HTML = `    <!-- FIXED BOTTOM ACTION BAR (FOR FORM TAB) -->
    <div v-show="canCreateRequest && activeTab === 'v4-form'" class="fixed bottom-0 left-0 right-0 glass-header border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 z-40 backdrop-blur-md">
      <div class="max-w-5xl mx-auto flex flex-wrap gap-3 justify-between items-center">
        <button
          @click="clearForm"
          class="px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
        >
          🗑️ <span class="hidden sm:inline">Làm mới form</span>
        </button>

        <div class="flex items-center gap-3">
          <!-- Save to Backend Server API -->
          <button
            @click="saveToServer"
            :disabled="savingServer"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="savingServer"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...</span>
            <span v-else class="flex items-center gap-1.5">💾 <span>Lưu Hệ Thống</span></span>
          </button>

          <!-- Export PDF -->
          <button
            @click="generatePDF"
            :disabled="exportingPDF"
            class="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="exportingPDF"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang xuất PDF...</span>
            <span v-else class="flex items-center gap-1.5">📄 <span>Xuất PDF</span></span>
          </button>
        </div>
      </div>
    </div>`;
