export const DASHBOARD_WEEKLY_MODALS_HTML = `    <!-- 1. MODAL: WEEKLY TECHNICAL REQUEST -->
    <div v-if="modalState.type === 'weekly-request'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-list-check text-sky-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Phiếu Yêu Cầu' : 'Tạo Phiếu Yêu Cầu Mới' }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" aria-label="Đóng">✕</button>
        </div>

        <form @submit.prevent="saveWeeklyRequestForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <!-- Requester / Request_ID -->
            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Người Yêu Cầu (MNV - Tên) *</label>
              <input
                v-model="modalState.item.requestId"
                list="list-requesters-options"
                required
                placeholder="VD: VN5117 - Lê Minh Hoàng"
                class="input-box w-full px-3.5 py-2.5 rounded-xl font-medium outline-none"
              />
              <datalist id="list-requesters-options">
                <option v-for="r in requestersList" :key="r.id" :value="r.mnv + ' - ' + r.fullName">{{ r.department }} - {{ r.position }}</option>
              </datalist>
            </div>

            <!-- Date -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Ngày Yêu Cầu</label>
              <input v-model="modalState.item.requestDate" type="date" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Request Type -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Loại Yêu Cầu *</label>
              <select v-model="modalState.item.requestType" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Machine Running ">Machine Running</option>
                <option value="Machine Set up">Machine Set up</option>
                <option value="Preventive Maintenance">Preventive Maintenance</option>
              </select>
            </div>

            <!-- Equipment -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Thiết Bị / Máy (Equipment) *</label>
              <input
                v-model="modalState.item.itemEquipment"
                list="list-machines-options"
                required
                placeholder="VD: PFL2, SX 52..."
                class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none font-mono"
              />
              <datalist id="list-machines-options">
                <option v-for="m in rawMachinesList" :key="m.id" :value="m.name">{{ m.tech }} - {{ m.name }}</option>
              </datalist>
            </div>

            <!-- Severity -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Mức Độ Nghiêm Trọng *</label>
              <select v-model="modalState.item.severity" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Critical">Critical (Nghiêm trọng)</option>
                <option value="High">High (Cao)</option>
                <option value="Medium">Medium (Trung bình)</option>
                <option value="Low">Low (Thấp)</option>
              </select>
            </div>

            <!-- Status -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Trạng Thái *</label>
              <select v-model="modalState.item.status" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Open">Open (Mới mở)</option>
                <option value="In Progress">In Progress (Đang xử lý)</option>
                <option value="Overdue">Overdue (Quá hạn)</option>
                <option value="Closed">Closed (Đã hoàn thành)</option>
              </select>
            </div>

            <!-- SLA Target Hours -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">SLA Mục Tiêu (giờ)</label>
              <input v-model.number="modalState.item.slaTargetHours" type="number" step="0.5" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Actual Hours -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Giờ Thực Tế Xử Lý</label>
              <input v-model.number="modalState.item.actualHours" type="number" step="0.1" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Met SLA -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Đạt SLA?</label>
              <select v-model="modalState.item.metSla" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes (Đạt SLA)</option>
                <option value="No">No (Không đạt)</option>
              </select>
            </div>

            <!-- Reported By -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Người Báo Cáo *</label>
              <input v-model="modalState.item.reportedBy" required placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Resolved By -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Người Xử Lý</label>
              <input v-model="modalState.item.resolvedBy" placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">
              {{ modalState.isEdit ? 'Lưu Thay Đổi' : 'Tạo Phiếu' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2. MODAL: DEFECT LOG -->
    <div v-if="modalState.type === 'defect-log'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-red-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Sự Cố Defect' : 'Ghi Nhận Sự Cố Defect Mới' }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" aria-label="Đóng">✕</button>
        </div>

        <form @submit.prevent="saveDefectLogForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Mã Defect (Số) *</label>
              <input v-model.number="modalState.item.defectId" type="number" required class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Ngày Sự Cố *</label>
              <input v-model="modalState.item.defectDate" type="text" placeholder="DD/MM/YYYY" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Phân Xưởng (Facility) *</label>
              <select v-model="modalState.item.facility" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="RFID ">RFID</option>
                <option value="WOVEN">WOVEN</option>
                <option value="LASER">LASER</option>
                <option value="OFFSET">OFFSET</option>
                <option value="DIGITAL">DIGITAL</option>
                <option value="PFL">PFL</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Nguồn Gốc (Source) *</label>
              <select v-model="modalState.item.source" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Internal">Internal (Nội bộ)</option>
                <option value="External (Customer complaint)">External (Khách hàng khiếu nại)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Nguyên Nhân Gốc *</label>
              <select v-model="modalState.item.rootCauseCategory" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Machine">Machine</option>
                <option value="System">System</option>
                <option value="Method">Method</option>
                <option value="Material">Material</option>
                <option value="Man">Man</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Sản Phẩm Ảnh Hưởng</label>
              <input v-model="modalState.item.affectedProduct" placeholder="Mã sản phẩm / tem / nhãn..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Thời Gian Dừng Máy (phút)</label>
              <input v-model="modalState.item.downtimeMinutes" placeholder="VD: 30..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Sự Cố Tái Diễn?</label>
              <select v-model="modalState.item.recurringIssue" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Yêu Cầu Làm Báo Cáo 8D?</label>
              <select v-model="modalState.item.eightDRequired" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes (Yêu cầu làm báo cáo 8D)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Chi Tiết Sự Cố (Specific Issue) *</label>
              <textarea v-model="modalState.item.specificIssue" required rows="3" placeholder="Mô tả cụ thể hiện tượng hư hỏng hoặc lỗi..." class="input-box w-full p-3 rounded-xl outline-none"></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 cursor-pointer">
              {{ modalState.isEdit ? 'Lưu Sự Cố' : 'Ghi Nhận' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 3. MODAL: ACTION PLAN -->
    <div v-if="modalState.type === 'action-plan'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-bullseye text-emerald-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Kế Hoạch' : 'Thêm Kế Hoạch Khắc Phục Mới' }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" aria-label="Đóng">✕</button>
        </div>

        <form @submit.prevent="saveActionPlanForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Mã Kế Hoạch (Action ID) *</label>
              <input v-model="modalState.item.actionId" required placeholder="VD: CLS010, SX52..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Ngày Tạo</label>
              <input v-model="modalState.item.dateLogged" type="text" placeholder="DD/MM/YYYY" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Xưởng (Facility)</label>
              <input v-model="modalState.item.facility" placeholder="RFID, OFFSET, DIGITAL..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Defect ID Liên Quan</label>
              <input v-model="modalState.item.relatedDefectId" placeholder="VD: 7, 1..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Loại Giải Pháp (Fix Type) *</label>
              <select v-model="modalState.item.fixType" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Long-term preventive">Long-term preventive (Phòng ngừa dài hạn)</option>
                <option value="8D Report">8D Report (Báo cáo 8D)</option>
                <option value="Short-term fix">Short-term fix (Khắc phục tạm thời)</option>
                <option value="Process Update">Process Update (Cải tiến quy trình)</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">Mô Tả Hành Động (Description) *</label>
              <textarea v-model="modalState.item.description" required rows="3" placeholder="Chi tiết kế hoạch triển khai..." class="input-box w-full p-3 rounded-xl outline-none"></textarea>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Người Phụ Trách (PIC) *</label>
              <input v-model="modalState.item.pic" required placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none font-semibold" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Hạn Chót (Deadline)</label>
              <input v-model="modalState.item.deadline" type="text" placeholder="DD/MM/YYYY" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Trạng Thái (Status) *</label>
              <select v-model="modalState.item.status" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="In Progress">In Progress (Đang thực hiện)</option>
                <option value="Completed">Completed (Hoàn thành)</option>
                <option value="Pending">Pending (Chờ duyệt)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Nguồn Lực Cần (Resource Needed)</label>
              <select v-model="modalState.item.resourceNeeded" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Training">Training (Đào tạo)</option>
                <option value="Spare Parts">Spare Parts (Linh kiện thay thế)</option>
                <option value="Software Update">Software Update (Nâng cấp phần mềm)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer">
              {{ modalState.isEdit ? 'Lưu Kế Hoạch' : 'Tạo Kế Hoạch' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 4. MODAL: REQUESTER -->
    <div v-if="modalState.type === 'requester'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-user-plus text-sky-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Người Yêu Cầu' : 'Thêm Người Yêu Cầu' }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" aria-label="Đóng">✕</button>
        </div>

        <form @submit.prevent="saveRequesterForm" class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Mã Nhân Viên (MNV) *</label>
            <input v-model="modalState.item.mnv" required placeholder="VD: VN5117" class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Họ và Tên *</label>
            <input v-model="modalState.item.fullName" required placeholder="VD: Lê Minh Hoàng" class="input-box w-full px-3.5 py-2.5 rounded-xl font-semibold outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Bộ Phận</label>
              <input v-model="modalState.item.department" placeholder="Production..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">Khu Vực</label>
              <input v-model="modalState.item.area" placeholder="Production..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Chức Vụ</label>
            <input v-model="modalState.item.position" placeholder="VD: Assistant Production Manager..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 5. MODAL: MACHINE -->
    <div v-if="modalState.type === 'machine'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-gear text-sky-500"></i>
            <span>{{ modalState.isEdit ? 'Chỉnh Sửa Thiết Bị' : 'Thêm Máy Mới' }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" aria-label="Đóng">✕</button>
        </div>

        <form @submit.prevent="saveMachineForm" class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Khu Vực / Công Nghệ *</label>
            <input v-model="modalState.item.tech" required placeholder="VD: PFL, OFFSET, DIGITAL..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-bold outline-none" />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">Tên Máy *</label>
            <input v-model="modalState.item.name" required placeholder="VD: PFL1, SX 52 - 6 colors..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">Hủy</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">Lưu</button>
          </div>
        </form>
      </div>
    </div>`;
