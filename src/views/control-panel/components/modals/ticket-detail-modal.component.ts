export const CP_TICKET_DETAIL_MODAL_HTML = `    <!-- TICKET DETAIL MODAL -->
    <div id="modal-ticket-detail" v-if="showTicketDetailModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-ticket-detail')">
      <div v-if="selectedTicket" class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-400">Chi Tiết Phiếu Yêu Cầu</div>
            <h2 class="text-base font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ selectedTicket.docNo }}</h2>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 space-y-5 text-xs">
          <!-- Overview summary -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">CÔNG NGHỆ</span>
              <span class="font-bold">{{ selectedTicket.printTech }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">TÊN MÁY</span>
              <span class="font-bold text-sky-600 dark:text-sky-400">{{ selectedTicket.machineName }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">DOWNTIME</span>
              <span class="font-mono font-bold text-red-500">{{ selectedTicket.downtime || 0 }} phút</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] font-bold">TRẠNG THÁI</span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block" :class="getStatusBadgeClass(selectedTicket.chkStatus || selectedTicket.status)">
                {{ selectedTicket.chkStatus || selectedTicket.status || 'Open' }}
              </span>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-slate-400 font-bold uppercase text-[10px]">Mô Tả Sự Cố</span>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed font-medium">
              {{ selectedTicket.problem }}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <span class="text-slate-400 font-bold uppercase text-[10px]">Nguyên Nhân Gốc (Root Cause)</span>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed">
                {{ selectedTicket.rootCause || 'Chưa ghi nhận' }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 font-bold uppercase text-[10px]">Hành Động Khắc Phục (Action Taken)</span>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed">
                {{ selectedTicket.actionTaken || 'Chưa ghi nhận' }}
              </div>
            </div>
          </div>

          <!-- Photos -->
          <div v-if="(selectedTicket.photosBefore && selectedTicket.photosBefore.length > 0) || (selectedTicket.photosAfter && selectedTicket.photosAfter.length > 0)" class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 font-bold uppercase text-[10px]">Hình Ảnh Hiện Trường</span>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-[11px] font-bold text-slate-500 mb-2">Trước Sửa Chữa ({{ selectedTicket.photosBefore?.length || 0 }})</div>
                <div class="flex flex-wrap gap-2">
                  <img v-for="(p, i) in selectedTicket.photosBefore" :key="i" :src="p" class="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                </div>
              </div>
              <div>
                <div class="text-[11px] font-bold text-slate-500 mb-2">Sau Sửa Chữa ({{ selectedTicket.photosAfter?.length || 0 }})</div>
                <div class="flex flex-wrap gap-2">
                  <img v-for="(p, i) in selectedTicket.photosAfter" :key="i" :src="p" class="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 text-[11px]">Đổi trạng thái:</span>
            <select :value="selectedTicket.chkStatus || selectedTicket.status" @change="e => updateTicketStatus(selectedTicket, e.target.value)" class="input-box px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
              <option value="Open">🔵 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Overdue">🔴 Overdue</option>
              <option value="Closed">🟢 Closed</option>
            </select>
          </div>
          <button @click="closeModal('modal-ticket-detail')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>`;
