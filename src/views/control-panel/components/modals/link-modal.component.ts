export const CP_LINK_MODAL_HTML = `    <!-- =========================================================================
         MODAL: GHÉP NỐI PHIẾU CPS VỚI CPST & CPSF
         ========================================================================= -->
    <div id="modal-link-ticket" v-if="showLinkModal" class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeLinkModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-purple-500">Chuỗi Tiến Trình 1-1-1</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-link text-purple-500"></i>
              <span>Ghép Nối Phiếu: {{ linkForm.cpsDocNo }}</span>
            </h2>
          </div>
          <button @click="closeLinkModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <!-- CPS Selector Dropdown (Allows changing or selecting CPS) -->
          <div class="space-y-1">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Chọn Phiếu CPS Cần Ghép Nối</label>
            <select v-model="linkForm.cpsDocNo" @change="onSelectLinkCps(linkForm.cpsDocNo)" class="input-box w-full px-3 py-2 rounded-xl text-xs font-mono font-bold outline-none cursor-pointer">
              <option v-for="c in chainList" :key="c.docNo || c.id" :value="c.docNo">
                {{ c.docNo }} • {{ c.cpsrDocNo || c.cpsr?.docNo || '-' }} ({{ c.machineName || c.cpsr?.machineName || '-' }})
              </option>
            </select>
          </div>

          <!-- Information Summary Card -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Mã CPSR Gốc:</span>
              <span class="font-mono font-bold text-sky-600 dark:text-sky-400">{{ linkForm.cpsrDocNo || '-' }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Thiết bị:</span>
              <span class="font-medium text-slate-700 dark:text-slate-200">{{ linkForm.machineName || '-' }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Sự cố:</span>
              <span class="truncate max-w-[220px] text-slate-600 dark:text-slate-300 font-mono">{{ linkForm.problem || '-' }}</span>
            </div>
          </div>

          <!-- Section 1: CPST Linkage -->
          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <i class="fa-solid fa-screwdriver-wrench"></i> 2. Phản Hồi Kỹ Thuật (CPST)
              </span>
              <span v-if="linkForm.currentCpst" class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Đã nối: {{ linkForm.currentCpst }}
              </span>
              <span v-else class="text-[10px] text-amber-500 italic">Chưa ghép nối</span>
            </div>

            <div v-if="linkForm.currentCpst" class="flex items-center justify-between pt-1">
              <span class="text-slate-500">Gỡ ghép nối CPST hiện tại:</span>
              <button
                type="button"
                @click="unlinkItem('cpst')"
                class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 font-bold transition cursor-pointer"
              >
                <i class="fa-solid fa-unlink"></i> Hủy ghép CPST
              </button>
            </div>

            <div v-else class="space-y-1">
              <label class="block text-slate-600 dark:text-slate-400">Chọn phiếu CPST để ghép nối:</label>
              <select v-model="linkForm.selectedCpst" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="">-- Chọn phiếu CPST khả dụng --</option>
                <option v-for="t in cpstList" :key="t.docNo || t.id" :value="t.docNo">
                  {{ t.docNo }} (KTV: {{ t.recvBy || 'N/A' }} • {{ t.chkStatus || 'N/A' }})
                </option>
              </select>
            </div>
          </div>

          <!-- Section 2: CPSF Linkage -->
          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check"></i> 3. Nghiệm Thu & Bàn Giao (CPSF)
              </span>
              <span v-if="linkForm.currentCpsf" class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                Đã nối: {{ linkForm.currentCpsf }}
              </span>
              <span v-else class="text-[10px] text-amber-500 italic">Chưa ghép nối</span>
            </div>

            <div v-if="linkForm.currentCpsf" class="flex items-center justify-between pt-1">
              <span class="text-slate-500">Gỡ ghép nối CPSF hiện tại:</span>
              <button
                type="button"
                @click="unlinkItem('cpsf')"
                class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 font-bold transition cursor-pointer"
              >
                <i class="fa-solid fa-unlink"></i> Hủy ghép CPSF
              </button>
            </div>

            <div v-else class="space-y-1">
              <label class="block text-slate-600 dark:text-slate-400">Chọn phiếu CPSF để ghép nối:</label>
              <select v-model="linkForm.selectedCpsf" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="">-- Chọn phiếu CPSF khả dụng --</option>
                <option v-for="f in cpsfList" :key="f.docNo || f.id" :value="f.docNo">
                  {{ f.docNo }} (WO: {{ f.workOrder || 'N/A' }} • CL: {{ f.chkQuality || 'N/A' }})
                </option>
              </select>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="closeLinkModal" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              Đóng
            </button>
            <button
              type="button"
              @click="submitLinkTickets"
              :disabled="isLinking || (!linkForm.selectedCpst && !linkForm.selectedCpsf)"
              class="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <i v-if="isLinking" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-link"></i>
              <span>Lưu Ghép Nối</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
