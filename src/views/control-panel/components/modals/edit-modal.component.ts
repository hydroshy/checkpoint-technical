export const CP_EDIT_MODAL_HTML = `    <!-- =========================================================================
         MODAL: CHỈNH SỬA PHIẾU (CPSR, CPST, CPSF, CPS)
         ========================================================================= -->
    <div id="modal-edit-ticket" v-if="showEditModal" class="modal-overlay fixed inset-0 bg-slate-950/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeEditModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800" @click.stop>
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div>
            <div class="text-[10px] uppercase font-bold text-sky-500">{{ t('Edit Ticket Data', 'Chỉnh Sửa Dữ Liệu Phiếu') }}</div>
            <h2 class="text-base font-extrabold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i class="fa-solid fa-pen-to-square text-sky-500"></i>
              <span>{{ editForm.docNo }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full uppercase font-sans font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20">
                {{ editForm.type.toUpperCase() }}
              </span>
            </h2>
          </div>
          <button @click="closeEditModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer">✕</button>
        </div>

        <!-- Modal Body Form -->
        <form @submit.prevent="submitEditTicket" class="p-6 space-y-4 text-xs">
          <!-- Type = CPS -->
          <template v-if="editForm.type === 'cps'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{{ t('Original CPSR Code (Linked)', 'Mã CPSR Gốc (Liên kết)') }}</label>
                  <button
                    type="button"
                    v-if="editForm.cpsrDocNo"
                    @click="openEditModal('cpsr', { docNo: editForm.cpsrDocNo })"
                    class="text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                    :title="t('Switch to edit this CPSR ticket info', 'Chuyển sang sửa thông tin phiếu CPSR này')"
                  >
                    <i class="fa-solid fa-pen-to-square"></i> {{ t('Edit this CPSR', 'Sửa CPSR này') }}
                  </button>
                </div>
                <input type="text" :value="editForm.cpsrDocNo" disabled class="input-box w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Ticket Status', 'Trạng thái phiếu') }}</label>
                <select v-model="editForm.status" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="TO_ASSIGN">⏳ {{ t('Pending Assignment (TO_ASSIGN)', 'Chờ phân công (TO_ASSIGN)') }}</option>
                  <option value="IN_PROGRESS">⚡ {{ t('In Progress (IN_PROGRESS)', 'Đang xử lý (IN_PROGRESS)') }}</option>
                  <option value="OVER_DUE">⚠️ {{ t('Overdue (OVER_DUE)', 'Quá hạn (OVER_DUE)') }}</option>
                  <option value="CLOSED">✅ {{ t('Closed (CLOSED)', 'Đã đóng (CLOSED)') }}</option>
                  <option value="OPEN_TASK">📋 {{ t('Open (OPEN_TASK)', 'Mở (OPEN_TASK)') }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Assigned Technician', 'Technician Phụ Trách') }}</label>
                <input type="text" v-model="editForm.assignedTo" list="list-ktv-edit" :placeholder="t('Select or enter Technician name', 'Chọn hoặc nhập tên Technician')" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
                <datalist id="list-ktv-edit">
                  <option v-for="e in employeesList" :key="e.id || e.mnv" :value="e.name + (e.mnv ? ' - ' + e.mnv : '')"></option>
                </datalist>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Priority Level', 'Mức Ưu Tiên') }}</label>
                <select v-model="editForm.priority" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Hỗ trợ ngay">🔴 {{ t('Urgent support', 'Hỗ trợ ngay') }}</option>
                  <option value="Chạy tạm">🟡 {{ t('Temporary run', 'Chạy tạm') }}</option>
                  <option value="Khác">📌 {{ t('Other', 'Khác') }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Deadline', 'Hạn chót hoàn thành (Deadline)') }}</label>
              <input type="datetime-local" v-model="editForm.deadline" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Assignment / Handling Notes', 'Ghi chú phân công / Xử lý') }}</label>
              <textarea v-model="editForm.notes" rows="3" :placeholder="t('Enter technical notes...', 'Nhập ghi chú kỹ thuật...')" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Type = CPSR -->
          <template v-else-if="editForm.type === 'cpsr'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Request Date', 'Ngày Yêu Cầu') }}</label>
                <input type="date" v-model="editForm.reqDate" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Request Time', 'Giờ Yêu Cầu') }}</label>
                <input type="time" v-model="editForm.reqTime" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Requester', 'Người Yêu Cầu') }}</label>
                <input type="text" v-model="editForm.reqBy" list="list-requesters-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
                <datalist id="list-requesters-edit">
                  <option v-for="r in requestersList" :key="r.id" :value="r.mnv + ' - ' + r.fullName"></option>
                </datalist>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Machine / Equipment Name', 'Tên Máy / Thiết Bị') }}</label>
                <input type="text" v-model="editForm.machineName" list="list-machines-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
                <datalist id="list-machines-edit">
                  <option v-for="m in machinesFlatList" :key="m.name" :value="m.name">{{ m.tech }}</option>
                </datalist>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Print Technology', 'Công Nghệ In') }}</label>
                <select v-model="editForm.printTech" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Priority Level', 'Mức Ưu Tiên') }}</label>
                <select v-model="editForm.priority" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Hỗ trợ ngay">🔴 {{ t('Urgent support', 'Hỗ trợ ngay') }}</option>
                  <option value="Chạy tạm">🟡 {{ t('Temporary run', 'Chạy tạm') }}</option>
                  <option value="Khác">📌 {{ t('Other', 'Khác') }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Machine / Incident Status', 'Trạng thái sự cố / máy') }}</label>
              <input type="text" v-model="editForm.machineStatus" :placeholder="t('e.g. First production, Repeated production...', 'VD: Hàng SX lần đầu, Hàng SX nhiều lần...')" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Problem Description', 'Mô Tả Sự Cố') }}</label>
              <textarea v-model="editForm.problem" rows="3" required class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Type = CPST -->
          <template v-else-if="editForm.type === 'cpst'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Receiving Technician', 'Technician Tiếp Nhận') }}</label>
                <input type="text" v-model="editForm.recvBy" list="list-ktv-edit" :placeholder="t('Select or enter receiving Technician name', 'Chọn hoặc nhập tên Technician tiếp nhận')" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Technical Status', 'Trạng Thái Kỹ Thuật') }}</label>
                <select v-model="editForm.chkStatus" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Đã khắc phục">🟢 {{ t('Resolved', 'Đã khắc phục') }}</option>
                  <option value="Theo dõi thêm">🟡 {{ t('Further monitoring', 'Theo dõi thêm') }}</option>
                  <option value="Hư hỏng nặng">🔴 {{ t('Severe damage', 'Hư hỏng nặng') }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Downtime (Minutes)', 'Downtime (Phút)') }}</label>
                <input type="number" v-model.number="editForm.downtime" min="0" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Linked CPSR Code', 'Mã CPSR Liên Kết') }}</label>
                <input type="text" :value="editForm.cpsrDocNo" disabled class="input-box w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Root Cause (4M)', 'Nguyên Nhân Gốc (Root Cause - 4M)') }}</label>
              <select v-model="editForm.rootCause" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                <option value="" disabled>-- {{ t('Select root cause (4M)', 'Chọn nguyên nhân gốc rễ (4M)') }} --</option>
                <option value="Man">{{ t('Man (Human)', 'Man (Con người)') }}</option>
                <option value="Machine">{{ t('Machine (Equipment)', 'Machine (Thiết bị)') }}</option>
                <option value="Material">{{ t('Material (Raw material)', 'Material (Vật liệu)') }}</option>
                <option value="Method">{{ t('Method (Procedure)', 'Method (Quy trình)') }}</option>
                <option value="System / Process">{{ t('System / Process', 'System / Process (Hệ thống / Quy trình)') }}</option>
                <option v-if="editForm.rootCause && !['Man', 'Machine', 'Material', 'Method', 'System / Process'].includes(editForm.rootCause)" :value="editForm.rootCause">{{ editForm.rootCause }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Action Taken', 'Hành Động Khắc Phục (Action Taken)') }}</label>
              <textarea v-model="editForm.actionTaken" rows="2" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Type = CPSF -->
          <template v-else-if="editForm.type === 'cpsf'">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Print Quality', 'Chất Lượng In') }}</label>
                <select v-model="editForm.chkQuality" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="Đạt">🟢 {{ t('PASS', 'ĐẠT') }}</option>
                  <option value="Chạy tạm, tiếp tục theo dõi">🟡 {{ t('CONDITIONAL RUN', 'CHẠY TẠM') }}</option>
                  <option value="Chưa đạt">🔴 {{ t('FAIL', 'CHƯA ĐẠT') }}</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Work Order ({{ t('WO Code', 'Mã WO') }})</label>
                <input type="text" v-model="editForm.workOrder" :placeholder="t('e.g. WO-20261006-01', 'VD: WO-20261006-01')" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Total Qty', 'Tổng SL') }}</label>
                <input type="number" v-model.number="editForm.woTotalQty" min="0" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Scrap Qty', 'SL Phế') }}</label>
                <input type="number" v-model.number="editForm.wasteQty" min="0" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Unit', 'Đơn Vị') }}</label>
                <select v-model="editForm.wasteUnit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none cursor-pointer">
                  <option value="PCS">PCS</option>
                  <option value="Mét">{{ t('Meters', 'Mét') }}</option>
                  <option value="Tờ in">{{ t('Sheets', 'Tờ in') }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Production Acceptance Rep', 'Đại Diện SX Nghiệm Thu') }}</label>
              <input type="text" v-model="editForm.prodMgr" list="list-requesters-edit" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">{{ t('Notes / Remarks', 'Ghi Chú / Ghi Nhận') }}</label>
              <textarea v-model="editForm.notes" rows="2" :placeholder="t('e.g. Monitor print quality after fix...', 'VD: Theo dõi chất lượng in sau xử lý...')" class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"></textarea>
            </div>
          </template>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="closeEditModal" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              {{ t('Cancel', 'Hủy Bỏ') }}
            </button>
            <button type="submit" :disabled="isSavingEdit" class="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer">
              <i v-if="isSavingEdit" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-check"></i>
              <span>{{ t('Save Changes', 'Lưu Thay Đổi') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>`;
