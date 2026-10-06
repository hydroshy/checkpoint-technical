export const DASHBOARD_PICKER_MODALS_HTML = `    <!-- TIME PICKER MODAL -->
    <div id="modal-time" v-if="showTimeModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-end sm:items-center justify-center backdrop-blur-sm pb-10 sm:pb-0" @click="closeTimeModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xs overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">{{ activeTimeLabel }}</h3>
          <button @click="closeTimeModal" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-6 relative select-none">
          <div class="flex justify-center items-center gap-3">
            <div class="flex flex-col items-center">
              <label class="text-[10px] font-bold text-slate-400 mb-1">GIỜ (00-23)</label>
              <select v-model="pickerHour" class="input-box text-center font-mono text-xl font-bold p-2.5 rounded-xl w-24">
                <option v-for="h in hourOptions" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
            <span class="text-2xl font-bold text-sky-500 mt-4">:</span>
            <div class="flex flex-col items-center">
              <label class="text-[10px] font-bold text-slate-400 mb-1">PHÚT (00-59)</label>
              <select v-model="pickerMinute" class="input-box text-center font-mono text-xl font-bold p-2.5 rounded-xl w-24">
                <option v-for="m in minuteOptions" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>
          <div class="mt-4 flex justify-center">
            <button type="button" @click="setTimeToNow" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5 cursor-pointer">
              <i class="fa-solid fa-clock"></i> Lấy giờ hiện tại
            </button>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button @click="closeTimeModal" class="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Hủy</button>
          <button @click="confirmTime" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/30">Chọn</button>
        </div>
      </div>
    </div>

    <!-- PERSON PICKER MODAL -->
    <div id="modal-person" v-if="showPersonModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closePersonModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Chọn Nhân Sự</h3>
          <button @click="closePersonModal" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500">1. Bộ phận (Department)</label>
            <select v-model="pickerDept" @change="onPickerDeptChange" class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none">
              <option value="">— Chọn Bộ Phận —</option>
              <option v-for="d in pickerDepartments" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500">2. Khu vực / Chuyền (Area)</label>
            <select v-model="pickerArea" @change="onPickerAreaChange" class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none">
              <option value="">— Chọn Khu Vực —</option>
              <option v-for="a in pickerAreas" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-500">3. Nhân viên (Name)</label>
            <select v-model="pickerSelectedName" class="input-box w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none">
              <option value="">— Chọn Tên Nhân Viên —</option>
              <option v-for="emp in pickerFilteredEmployees" :key="emp.id" :value="emp.name + (emp.mnv ? ' - ' + emp.mnv : '')">
                {{ emp.name }} {{ emp.mnv ? '(' + emp.mnv + ')' : '' }} - {{ emp.role }}
              </option>
              <option value="OTHER">📌 Khác (Tự nhập tay)</option>
            </select>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button @click="closePersonModal" class="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Đóng</button>
          <button @click="confirmPerson" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/30">Xác Nhận</button>
        </div>
      </div>
    </div>

    <!-- EXCEL UPLOADER MODAL -->
    <div id="modal-excel" v-if="showExcelModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeExcelModal">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Nạp Danh Sách Nhân Sự Excel</h3>
          <button @click="closeExcelModal" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <p class="text-xs text-slate-500 leading-relaxed">
            Hệ thống tự động nhận diện các cột: <strong>Họ và tên</strong>, <strong>Mã NV</strong>, <strong>Bộ phận</strong>, <strong>Khu vực</strong>, <strong>Chức vụ</strong>. Dữ liệu sẽ được lưu vào hệ thống để dùng cho gợi ý người yêu cầu và tiếp nhận.
          </p>
          <input type="file" id="file_excel_upload" accept=".xlsx, .xls" class="hidden" @change="processExcelFile" />
          <div
            @click="triggerUpload('file_excel_upload')"
            class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/50"
          >
            <i class="fa-solid fa-file-excel text-3xl text-emerald-500 mb-2"></i>
            <div class="text-xs font-bold">Bấm vào đây để chọn file Excel (.xlsx, .xls)</div>
            <div class="text-[11px] text-slate-400 mt-1">Dung lượng tối đa 10MB</div>
          </div>
          <div v-if="excelStatus.show" :class="excelStatus.isError ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'" class="p-3 rounded-xl border text-xs font-semibold text-center">
            {{ excelStatus.msg }}
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button @click="closeExcelModal" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">Đóng</button>
        </div>
    <!-- DATALIST FOR EMPLOYEE AUTOCOMPLETE -->
    <datalist id="employee_list">
      <option v-for="emp in employeeDatalist" :key="emp.id" :value="emp.mnv ? emp.name + ' - ' + emp.mnv : emp.name"></option>
    </datalist>`;
