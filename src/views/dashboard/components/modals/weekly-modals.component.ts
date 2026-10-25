export const DASHBOARD_WEEKLY_MODALS_HTML = `    <!-- 1. MODAL: WEEKLY TECHNICAL REQUEST -->
    <div v-if="modalState.type === 'weekly-request'" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeCurrentModal">
      <div class="glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-list-check text-sky-500"></i>
            <span>{{ modalState.isEdit ? t('Edit Technical Request', 'Chỉnh Sửa Phiếu Yêu Cầu') : t('Create Technical Request', 'Tạo Phiếu Yêu Cầu Mới') }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" :aria-label="t('Close', 'Đóng')">✕</button>
        </div>

        <form @submit.prevent="saveWeeklyRequestForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <!-- Requester / Request_ID -->
            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">{{ t('Requester (Code - Name) *', 'Người Yêu Cầu (MNV - Tên) *') }}</label>
              <input
                v-model="modalState.item.requestId"
                list="list-requesters-options"
                required
                :placeholder="t('e.g. VN5117 - Le Minh Hoang', 'VD: VN5117 - Lê Minh Hoàng')"
                class="input-box w-full px-3.5 py-2.5 rounded-xl font-medium outline-none"
              />
              <datalist id="list-requesters-options">
                <option v-for="r in requestersList" :key="r.id" :value="r.mnv + ' - ' + r.fullName">{{ r.department }} - {{ r.position }}</option>
              </datalist>
            </div>

            <!-- Date -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Request Date', 'Ngày Yêu Cầu') }}</label>
              <input v-model="modalState.item.requestDate" type="date" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Request Type -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Request Type *', 'Loại Yêu Cầu *') }}</label>
              <select v-model="modalState.item.requestType" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Machine Running ">Machine Running</option>
                <option value="Machine Set up">Machine Set up</option>
                <option value="Preventive Maintenance">Preventive Maintenance</option>
              </select>
            </div>

            <!-- Equipment -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Equipment / Machine *', 'Thiết Bị / Máy (Equipment) *') }}</label>
              <input
                v-model="modalState.item.itemEquipment"
                list="list-machines-options"
                required
                :placeholder="t('e.g. PFL2, SX 52...', 'VD: PFL2, SX 52...')"
                class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none font-mono"
              />
              <datalist id="list-machines-options">
                <option v-for="m in rawMachinesList" :key="m.id" :value="m.name">{{ m.tech }} - {{ m.name }}</option>
              </datalist>
            </div>

            <!-- Severity -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Severity Level *', 'Mức Độ Nghiêm Trọng *') }}</label>
              <select v-model="modalState.item.severity" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Critical">Critical ({{ t('Critical', 'Nghiêm trọng') }})</option>
                <option value="High">High ({{ t('High', 'Cao') }})</option>
                <option value="Medium">Medium ({{ t('Medium', 'Trung bình') }})</option>
                <option value="Low">Low ({{ t('Low', 'Thấp') }})</option>
              </select>
            </div>

            <!-- Status -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Status *', 'Trạng Thái *') }}</label>
              <select v-model="modalState.item.status" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Open">Open ({{ t('Open', 'Mới mở') }})</option>
                <option value="In Progress">In Progress ({{ t('In Progress', 'Đang xử lý') }})</option>
                <option value="Overdue">Overdue ({{ t('Overdue', 'Quá hạn') }})</option>
                <option value="Closed">Closed ({{ t('Closed', 'Đã hoàn thành') }})</option>
              </select>
            </div>

            <!-- SLA Target Hours -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Target SLA (hours)', 'SLA Mục Tiêu (giờ)') }}</label>
              <input v-model.number="modalState.item.slaTargetHours" type="number" step="0.5" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Actual Hours -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Actual Hours', 'Giờ Thực Tế Xử Lý') }}</label>
              <input v-model.number="modalState.item.actualHours" type="number" step="0.1" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Met SLA -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Met SLA?', 'Đạt SLA?') }}</label>
              <select v-model="modalState.item.metSla" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes ({{ t('Met SLA', 'Đạt SLA') }})</option>
                <option value="No">No ({{ t('Not Met', 'Không đạt') }})</option>
              </select>
            </div>

            <!-- Reported By -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Reported By *', 'Người Báo Cáo *') }}</label>
              <input v-model="modalState.item.reportedBy" required placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <!-- Resolved By -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Resolved By', 'Người Xử Lý') }}</label>
              <input v-model="modalState.item.resolvedBy" placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">{{ t('Cancel', 'Hủy') }}</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">
              {{ modalState.isEdit ? t('Save Changes', 'Lưu Thay Đổi') : t('Create Ticket', 'Tạo Phiếu') }}
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
            <span>{{ modalState.isEdit ? t('Edit Defect Incident', 'Chỉnh Sửa Sự Cố Defect') : t('Log New Defect Incident', 'Ghi Nhận Sự Cố Defect Mới') }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" :aria-label="t('Close', 'Đóng')">✕</button>
        </div>

        <form @submit.prevent="saveDefectLogForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Defect ID (Number) *', 'Mã Defect (Số) *') }}</label>
              <input v-model.number="modalState.item.defectId" type="number" required class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Incident Date *', 'Ngày Sự Cố *') }}</label>
              <input v-model="modalState.item.defectDate" type="text" placeholder="DD/MM/YYYY" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Workshop (Facility) *', 'Phân Xưởng (Facility) *') }}</label>
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
              <label class="block font-bold text-slate-500">{{ t('Source *', 'Nguồn Gốc (Source) *') }}</label>
              <select v-model="modalState.item.source" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Internal">Internal ({{ t('Internal', 'Nội bộ') }})</option>
                <option value="External (Customer complaint)">External ({{ t('Customer complaint', 'Khách hàng khiếu nại') }})</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Root Cause *', 'Nguyên Nhân Gốc *') }}</label>
              <select v-model="modalState.item.rootCauseCategory" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Machine">Machine</option>
                <option value="System">System</option>
                <option value="Method">Method</option>
                <option value="Material">Material</option>
                <option value="Man">Man</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Affected Product', 'Sản Phẩm Ảnh Hưởng') }}</label>
              <input v-model="modalState.item.affectedProduct" :placeholder="t('Product / label code...', 'Mã sản phẩm / tem / nhãn...')" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Downtime (minutes)', 'Thời Gian Dừng Máy (phút)') }}</label>
              <input v-model="modalState.item.downtimeMinutes" :placeholder="t('e.g. 30...', 'VD: 30...')" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Recurring Issue?', 'Sự Cố Tái Diễn?') }}</label>
              <select v-model="modalState.item.recurringIssue" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">{{ t('8D Report Required?', 'Yêu Cầu Làm Báo Cáo 8D?') }}</label>
              <select v-model="modalState.item.eightDRequired" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Yes">Yes ({{ t('8D Report Required', 'Yêu cầu làm báo cáo 8D') }})</option>
                <option value="No">No</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">{{ t('Specific Issue Details *', 'Chi Tiết Sự Cố (Specific Issue) *') }}</label>
              <textarea v-model="modalState.item.specificIssue" required rows="3" :placeholder="t('Describe specific failure or defect symptom...', 'Mô tả cụ thể hiện tượng hư hỏng hoặc lỗi...')" class="input-box w-full p-3 rounded-xl outline-none"></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">{{ t('Cancel', 'Hủy') }}</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 cursor-pointer">
              {{ modalState.isEdit ? t('Save Incident', 'Lưu Sự Cố') : t('Log Defect', 'Ghi Nhận') }}
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
            <span>{{ modalState.isEdit ? t('Edit Action Plan', 'Chỉnh Sửa Kế Hoạch') : t('Add Corrective Action Plan', 'Thêm Kế Hoạch Khắc Phục Mới') }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" :aria-label="t('Close', 'Đóng')">✕</button>
        </div>

        <form @submit.prevent="saveActionPlanForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Action ID *', 'Mã Kế Hoạch (Action ID) *') }}</label>
              <input v-model="modalState.item.actionId" required :placeholder="t('e.g. CLS010, SX52...', 'VD: CLS010, SX52...')" class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Date Created', 'Ngày Tạo') }}</label>
              <input v-model="modalState.item.dateLogged" type="text" placeholder="DD/MM/YYYY" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Workshop (Facility)', 'Xưởng (Facility)') }}</label>
              <input v-model="modalState.item.facility" placeholder="RFID, OFFSET, DIGITAL..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Related Defect ID', 'Defect ID Liên Quan') }}</label>
              <input v-model="modalState.item.relatedDefectId" :placeholder="t('e.g. 7, 1...', 'VD: 7, 1...')" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">{{ t('Fix Type *', 'Loại Giải Pháp (Fix Type) *') }}</label>
              <select v-model="modalState.item.fixType" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Long-term preventive">Long-term preventive ({{ t('Long-term preventive', 'Phòng ngừa dài hạn') }})</option>
                <option value="8D Report">8D Report ({{ t('8D Report', 'Báo cáo 8D') }})</option>
                <option value="Short-term fix">Short-term fix ({{ t('Short-term fix', 'Khắc phục tạm thời') }})</option>
                <option value="Process Update">Process Update ({{ t('Process Update', 'Cải tiến quy trình') }})</option>
              </select>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="block font-bold text-slate-500">{{ t('Action Description *', 'Mô Tả Hành Động (Description) *') }}</label>
              <textarea v-model="modalState.item.description" required rows="3" :placeholder="t('Implementation plan details...', 'Chi tiết kế hoạch triển khai...')" class="input-box w-full p-3 rounded-xl outline-none"></textarea>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Person In Charge (PIC) *', 'Người Phụ Trách (PIC) *') }}</label>
              <input v-model="modalState.item.pic" required placeholder="Steve, Wayne..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none font-semibold" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Deadline', 'Hạn Chót (Deadline)') }}</label>
              <input v-model="modalState.item.deadline" type="text" placeholder="DD/MM/YYYY" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Status *', 'Trạng Thái (Status) *') }}</label>
              <select v-model="modalState.item.status" required class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="In Progress">In Progress ({{ t('In Progress', 'Đang thực hiện') }})</option>
                <option value="Completed">Completed ({{ t('Completed', 'Hoàn thành') }})</option>
                <option value="Pending">Pending ({{ t('Pending', 'Chờ duyệt') }})</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Resource Needed', 'Nguồn Lực Cần (Resource Needed)') }}</label>
              <select v-model="modalState.item.resourceNeeded" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none">
                <option value="Training">Training ({{ t('Training', 'Đào tạo') }})</option>
                <option value="Spare Parts">Spare Parts ({{ t('Spare Parts', 'Linh kiện thay thế') }})</option>
                <option value="Software Update">Software Update ({{ t('Software Update', 'Nâng cấp phần mềm') }})</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">{{ t('Cancel', 'Hủy') }}</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer">
              {{ modalState.isEdit ? t('Save Plan', 'Lưu Kế Hoạch') : t('Create Plan', 'Tạo Kế Hoạch') }}
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
            <span>{{ modalState.isEdit ? t('Edit Requester', 'Chỉnh Sửa Người Yêu Cầu') : t('Add Requester', 'Thêm Người Yêu Cầu') }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" :aria-label="t('Close', 'Đóng')">✕</button>
        </div>

        <form @submit.prevent="saveRequesterForm" class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-500">{{ t('Employee Code (MNV) *', 'Mã Nhân Viên (MNV) *') }}</label>
            <input v-model="modalState.item.mnv" required :placeholder="t('e.g. VN5117', 'VD: VN5117')" class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">{{ t('Full Name *', 'Họ và Tên *') }}</label>
            <input v-model="modalState.item.fullName" required :placeholder="t('e.g. Le Minh Hoang', 'VD: Lê Minh Hoàng')" class="input-box w-full px-3.5 py-2.5 rounded-xl font-semibold outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Department', 'Bộ Phận') }}</label>
              <input v-model="modalState.item.department" placeholder="Production..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
            <div class="space-y-1">
              <label class="block font-bold text-slate-500">{{ t('Area', 'Khu Vực') }}</label>
              <input v-model="modalState.item.area" placeholder="Production..." class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">{{ t('Position', 'Chức Vụ') }}</label>
            <input v-model="modalState.item.position" :placeholder="t('e.g. Assistant Production Manager...', 'VD: Assistant Production Manager...')" class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none" />
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">{{ t('Cancel', 'Hủy') }}</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">{{ t('Save', 'Lưu') }}</button>
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
            <span>{{ modalState.isEdit ? t('Edit Equipment', 'Chỉnh Sửa Thiết Bị') : t('Add New Machine', 'Thêm Máy Mới') }}</span>
          </h3>
          <button type="button" @click="closeCurrentModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer transition" :aria-label="t('Close', 'Đóng')">✕</button>
        </div>

        <form @submit.prevent="saveMachineForm" class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-500">{{ t('Area / Technology *', 'Khu Vực / Công Nghệ *') }}</label>
            <input v-model="modalState.item.tech" required placeholder="VD: PFL, OFFSET, DIGITAL..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-bold outline-none" />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-500">{{ t('Machine Name *', 'Tên Máy *') }}</label>
            <input v-model="modalState.item.name" required placeholder="VD: PFL1, SX 52 - 6 colors..." class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none" />
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" @click="closeCurrentModal" class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">{{ t('Cancel', 'Hủy') }}</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer">{{ t('Save', 'Lưu') }}</button>
          </div>
        </form>
      </div>
    </div>`;