export const CP_ASSIGN_MODAL_HTML = `    <!-- =====================================================================
         MODAL PHÂN CÔNG KỸ THUẬT (ASSIGN TASK MODAL) - MODULE ASSIGN TASK
         ===================================================================== -->
    <div
      id="modal-assign-task"
      v-if="showAssignModal"
      class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      @click="closeAssignModal"
    >
      <div
        v-if="selectedCpsForAssign"
        class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <div class="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1.5">
              <i class="fa-solid fa-clipboard-user"></i> Module Phân Công Kỹ Thuật
            </div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-0.5">
              <span>{{ selectedCpsForAssign.docNo || ('CPS-' + (selectedCpsForAssign.cpsrDocNo ? selectedCpsForAssign.cpsrDocNo.replace('CPSR-', '') : (selectedCpsForAssign.cpsr?.docNo ? selectedCpsForAssign.cpsr.docNo.replace('CPSR-', '') : ''))) }}</span>
              <span :class="getStatusBadgeClass(selectedCpsForAssign.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-full border">
                {{ formatCpsStatus(selectedCpsForAssign.status) }}
              </span>
            </h2>
          </div>
          <button @click="closeAssignModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4 text-xs">
          <!-- Summary card -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div class="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <div><span class="text-slate-400 block text-[10px] font-bold">THIẾT BỊ / MÁY:</span> <span class="font-bold text-slate-800 dark:text-slate-100">{{ selectedCpsForAssign.machineName || selectedCpsForAssign.cpsr?.machineName || '-' }}</span></div>
              <div><span class="text-slate-400 block text-[10px] font-bold">CÔNG NGHỆ:</span> <span class="font-mono">{{ selectedCpsForAssign.printTech || selectedCpsForAssign.cpsr?.printTech || '-' }}</span></div>
              <div class="col-span-2">
                <span class="text-slate-400 block text-[10px] font-bold">MÔ TẢ SỰ CỐ:</span>
                <p class="mt-0.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-rose-500 dark:text-rose-400">
                  {{ selectedCpsForAssign.problem || selectedCpsForAssign.cpsr?.problem || '-' }}
                </p>
              </div>
              <div><span class="text-slate-400 block text-[10px] font-bold">NGƯỜI YÊU CẦU:</span> {{ selectedCpsForAssign.reqBy || selectedCpsForAssign.cpsr?.reqBy || '-' }}</div>
              <div>
                <span class="text-slate-400 block text-[10px] font-bold">ƯU TIÊN:</span>
                <span :class="(selectedCpsForAssign.priority || selectedCpsForAssign.cpsr?.priority) === 'Hỗ trợ ngay' ? 'text-rose-500 font-bold' : 'text-amber-500 font-bold'">
                  {{ selectedCpsForAssign.priority || selectedCpsForAssign.cpsr?.priority || 'Bình thường' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <form @submit.prevent="submitAssignTask" class="space-y-4">
            <!-- 1. Dropdown Technician -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Technician tiếp nhận <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="assignForm.employee"
                required
                class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs outline-none cursor-pointer"
              >
                <option value="" disabled>-- Chọn Technician từ danh sách --</option>
                <option
                  v-for="emp in employeesList"
                  :key="emp.id || emp.mnv"
                  :value="emp"
                >
                  {{ emp.name }} {{ emp.mnv ? '(' + emp.mnv + ')' : '' }} - {{ emp.role || emp.dept || 'Technician' }}
                </option>
              </select>
            </div>

            <!-- 2. Chọn Deadline (mặc định để trống) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Thời hạn hoàn thành (Deadline)
                </label>
                <span class="text-[10px] text-slate-400 italic">Mặc định để trống</span>
              </div>
              <input
                type="datetime-local"
                v-model="assignForm.deadline"
                class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-mono"
              />
            </div>

            <!-- 3. Ghi chú phân công (Optional) -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Ghi chú phân công (Tùy chọn)
              </label>
              <textarea
                v-model="assignForm.notes"
                rows="2"
                placeholder="Nhập ghi chú yêu cầu xử lý, lưu ý kỹ thuật..."
                class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"
              ></textarea>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                @click="closeAssignModal"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                :disabled="isAssigning"
                class="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                <i v-if="isAssigning" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-check"></i>
                <span>Lưu Phân Công (IN_PROGRESS)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
