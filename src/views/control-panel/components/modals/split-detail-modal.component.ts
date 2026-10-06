export const CP_SPLIT_DETAIL_MODAL_HTML = `    <!-- 1-1-1 CHAIN & SPLIT FORM DETAIL MODAL -->
    <div id="modal-chain-detail" v-if="showChainModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeChainModal">
      <div v-if="selectedChain" class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-sky-500">Chuỗi Tiến Trình 1-1-1</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{{ selectedChain.cpsr?.docNo || selectedChain.docNo }}</span>
              <span v-if="selectedChain.cpst" class="text-slate-400">→</span>
              <span v-if="selectedChain.cpst" class="text-emerald-500 font-mono">{{ selectedChain.cpst.docNo }}</span>
              <span v-if="selectedChain.cpsf" class="text-slate-400">→</span>
              <span v-if="selectedChain.cpsf" class="text-purple-500 font-mono">{{ selectedChain.cpsf.docNo }}</span>
            </h2>
          </div>
          <button type="button" @click="closeChainModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 space-y-6 text-xs">
          <!-- BƯỚC 1: CPSR -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-bold text-sky-600 dark:text-sky-400 text-sm">1. Phiếu Yêu Cầu Kỹ Thuật (CPSR)</span>
              <span class="font-mono font-bold text-xs bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded">{{ (selectedChain.cpsr || selectedChain).docNo }}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">NGÀY & GIỜ</span>
                <span class="font-medium">{{ (selectedChain.cpsr || selectedChain).reqDate }} {{ (selectedChain.cpsr || selectedChain).reqTime }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">NGƯỜI YÊU CẦU</span>
                <span class="font-medium text-slate-800 dark:text-slate-100">{{ (selectedChain.cpsr || selectedChain).reqBy }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">THIẾT BỊ / MÁY</span>
                <span class="font-medium">{{ (selectedChain.cpsr || selectedChain).printTech }} - {{ (selectedChain.cpsr || selectedChain).machineName }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">ƯU TIÊN</span>
                <span class="font-bold" :class="(selectedChain.cpsr || selectedChain).priority === 'Hỗ trợ ngay' ? 'text-rose-500' : 'text-amber-500'">{{ (selectedChain.cpsr || selectedChain).priority || 'N/A' }}</span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">MÔ TẢ SỰ CỐ:</span>
              <p class="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] leading-relaxed">{{ (selectedChain.cpsr || selectedChain).problem }}</p>
            </div>
          </div>

          <!-- BƯỚC 2: CPST -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">2. Phản Hồi Kỹ Thuật (CPST)</span>
              <span v-if="selectedChain.cpst" class="font-mono font-bold text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">{{ selectedChain.cpst.docNo }}</span>
              <span v-else class="text-xs text-slate-400">Chưa tạo phản hồi</span>
            </div>

            <div v-if="selectedChain.cpst" class="space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">TECHNICIAN TIẾP NHẬN</span>
                  <span class="font-medium text-slate-800 dark:text-slate-100">{{ formatTechnicianName(selectedChain.cpst.recvBy) }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">TRẠNG THÁI KT</span>
                  <span class="font-bold text-emerald-500">{{ selectedChain.cpst.chkStatus }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">THỜI GIAN GỬI</span>
                  <span class="font-medium">{{ selectedChain.cpst.submittedAt ? new Date(selectedChain.cpst.submittedAt).toLocaleString('vi-VN') : '-' }}</span>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">NGUYÊN NHÂN GỐC:</span>
                  <p class="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">{{ selectedChain.cpst.rootCause || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">HÀNH ĐỘNG KHẮC PHỤC:</span>
                  <p class="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">{{ selectedChain.cpst.actionTaken || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 gap-3">
              <span class="text-amber-500 font-medium">Yêu cầu này đang chờ kỹ thuật phản hồi.</span>
              <a :href="'/technical-feedback?cpsr=' + encodeURIComponent((selectedChain.cpsr || selectedChain).docNo)" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition">
                + Tạo Phản Hồi CPST Ngay →
              </a>
            </div>
          </div>

          <!-- BƯỚC 3: CPSF -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span class="font-bold text-purple-600 dark:text-purple-400 text-sm">3. Nghiệm Thu & Bàn Giao (CPSF)</span>
              <span v-if="selectedChain.cpsf" class="font-mono font-bold text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">{{ selectedChain.cpsf.docNo }}</span>
              <span v-else class="text-xs text-slate-400">Chưa bàn giao</span>
            </div>

            <div v-if="selectedChain.cpsf" class="space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">CHẤT LƯỢNG IN</span>
                  <span class="font-bold text-xs" :class="selectedChain.cpsf.chkQuality === 'Đạt' ? 'text-emerald-500' : 'text-rose-500'">{{ selectedChain.cpsf.chkQuality }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">WORK ORDER</span>
                  <span class="font-mono font-medium">{{ selectedChain.cpsf.workOrder || '-' }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">TỔNG SL / PHẾ</span>
                  <span class="font-mono font-medium">{{ selectedChain.cpsf.woTotalQty }} / {{ selectedChain.cpsf.wasteQty }} ({{ selectedChain.cpsf.wastePercent || '0%' }})</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] font-bold">ĐẠI DIỆN SX KÝ NHẬN</span>
                  <span class="font-medium text-slate-800 dark:text-slate-100">{{ selectedChain.cpsf.prodMgr }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="selectedChain.cpst" class="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 gap-3">
              <span class="text-purple-400 font-medium">Kỹ thuật đã phản hồi. Chờ sản xuất nghiệm thu bàn giao.</span>
              <a :href="'/confirm-request?cpst=' + encodeURIComponent(selectedChain.cpst.docNo)" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition">
                + Xác Nhận Bàn Giao CPSF Ngay →
              </a>
            </div>
            <div v-else class="text-slate-400 italic">Cần hoàn thành bước 2 (CPST) trước khi bàn giao.</div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openEditModal('cps', selectedChain)"
              class="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-pen-to-square"></i> Chỉnh Sửa
            </button>
            <button
              type="button"
              @click="openLinkModal(selectedChain)"
              class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-link"></i> Ghép Nối
            </button>
          </div>
          <button type="button" @click="closeChainModal" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>`;
