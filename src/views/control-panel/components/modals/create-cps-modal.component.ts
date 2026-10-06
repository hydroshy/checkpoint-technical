export const CP_CREATE_CPS_MODAL_HTML = `    <!-- =========================================================================
         MODAL: TẠO PHIẾU CPS (RÀNG BUỘC NGHIỆP VỤ: BẮT BUỘC PHẢI CÓ CPSR)
         ========================================================================= -->
    <div id="modal-create-cps" v-if="showCreateCpsModal" class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCreateCpsModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-sky-500">Tạo Phiếu Kỹ Thuật</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-plus-circle text-sky-500"></i>
              <span>Tạo Mới Phiếu CPS (Chuỗi 1-1-1)</span>
            </h2>
          </div>
          <button @click="closeCreateCpsModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="submitCreateCps" class="p-6 space-y-4 text-xs">
          <!-- Business Rule Notice -->
          <div class="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-300 flex items-start gap-2.5">
            <i class="fa-solid fa-circle-info text-base mt-0.5 text-sky-600 dark:text-sky-400 flex-shrink-0"></i>
            <div>
              <strong class="font-bold block">Ràng buộc nghiệp vụ:</strong>
              <span>Phiếu CPS chỉ được tạo khi có phiếu yêu cầu CPSR gốc tương ứng. Vui lòng chọn một phiếu CPSR chưa gắn CPS từ danh sách dưới đây.</span>
            </div>
          </div>

          <!-- Select CPSR dropdown -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Chọn Phiếu CPSR Gốc <span class="text-rose-500">*</span>
            </label>
            <div v-if="availableCpsrForCps.length === 0" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i> Hiện không có phiếu CPSR nào chưa liên kết với CPS.
              <a href="/form-request" target="_blank" class="font-bold underline ml-1 text-sky-600 dark:text-sky-400">+ Tạo phiếu CPSR mới tại đây</a>
            </div>
            <select v-else v-model="createCpsForm.cpsrDocNo" required class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs outline-none cursor-pointer font-medium">
              <option value="" disabled>-- Vui lòng chọn phiếu CPSR --</option>
              <option v-for="r in availableCpsrForCps" :key="r.docNo" :value="r.docNo">
                {{ r.docNo }} • {{ r.reqBy || 'NV' }} • {{ r.printTech || '' }} - {{ r.machineName || '' }} ({{ r.problem ? r.problem.substring(0, 30) + '...' : '' }})
              </option>
            </select>
          </div>

          <!-- KTV Assigned -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Kỹ Thuật Viên Tiếp Nhận / Phân Công
            </label>
            <input
              type="text"
              v-model="createCpsForm.assignedTo"
              list="list-ktv-create-cps"
              placeholder="Chọn hoặc nhập tên KTV..."
              class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-medium"
            />
            <datalist id="list-ktv-create-cps">
              <option v-for="e in employeesList" :key="e.id || e.mnv" :value="e.name + (e.mnv ? ' - ' + e.mnv : '')"></option>
            </datalist>
          </div>

          <!-- Priority & Deadline -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mức Độ Ưu Tiên</label>
              <select v-model="createCpsForm.priority" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="Hỗ trợ ngay">🔴 Hỗ trợ ngay</option>
                <option value="Chạy tạm">🟡 Chạy tạm</option>
                <option value="Bình thường">🔵 Bình thường</option>
                <option value="Khác">📌 Khác</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Hạn Chót (Deadline)</label>
              <input type="datetime-local" v-model="createCpsForm.deadline" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ghi Chú Tiến Độ</label>
            <textarea v-model="createCpsForm.notes" rows="2" placeholder="Ghi chú ban đầu khi tạo phiếu..." class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="closeCreateCpsModal" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isCreatingCps || !createCpsForm.cpsrDocNo"
              class="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
            >
              <i v-if="isCreatingCps" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-plus"></i>
              <span>Tạo Phiếu CPS</span>
            </button>
          </div>
        </form>
      </div>
    </div>`;
