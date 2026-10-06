export const CP_ENTITY_MODALS_HTML = `    <!-- ADD MACHINE MODAL -->
    <div id="modal-add-machine" v-if="showAddMachineModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-machine')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Máy In Mới</h3>
          <button type="button" @click="closeModal('modal-add-machine')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAddMachine" class="p-5 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Công nghệ in</label>
            <input type="text" v-model="newMachine.tech" required placeholder="RFID, OFFSET, Digital..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Tên máy</label>
            <input type="text" v-model="newMachine.name" required placeholder="Tên máy in mới..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Mã máy (tùy chọn)</label>
            <input type="text" v-model="newMachine.code" placeholder="M-01..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-machine')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 cursor-pointer">Thêm</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD EMPLOYEE MODAL -->
    <div id="modal-add-employee" v-if="showAddEmployeeModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-employee')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Nhân Sự</h3>
          <button type="button" @click="closeModal('modal-add-employee')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAddEmployee" class="p-5 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Mã Nhân Viên</label>
            <input type="text" v-model="newEmployee.mnv" placeholder="NV..." class="input-box w-full px-3 py-2 rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Họ và Tên</label>
            <input type="text" v-model="newEmployee.name" required placeholder="Nguyễn Văn A..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Bộ Phận (Phòng ban)</label>
            <input type="text" v-model="newEmployee.dept" placeholder="Sản Xuất, Kỹ Thuật, QA..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Khu vực / Chuyền</label>
            <input type="text" v-model="newEmployee.area" placeholder="OFFSET, Digital, Prepress..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Chức vụ</label>
            <input type="text" v-model="newEmployee.role" placeholder="Operator, Technician, Manager..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-employee')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 cursor-pointer">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div id="modal-add-user" v-if="showAddUserModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-add-user')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Thêm Tài Khoản Đăng Nhập</h3>
          <button type="button" @click="closeModal('modal-add-user')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAddUser" class="p-5 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Tên đăng nhập (Username)</label>
            <input type="text" v-model="newUser.username" required placeholder="username..." class="input-box w-full px-3 py-2 rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Mật khẩu</label>
            <input type="password" v-model="newUser.password" required placeholder="Mật khẩu..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Họ và Tên</label>
            <input type="text" v-model="newUser.fullName" required placeholder="Họ và tên..." class="input-box w-full px-3 py-2 rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Email</label>
            <input type="email" v-model="newUser.email" placeholder="email@checkpointsystems.com..." class="input-box w-full px-3 py-2 rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-500">Vai trò (Role)</label>
            <select v-model="newUser.role" @change="onNewUserRoleChange" class="input-box w-full px-3 py-2 rounded-xl font-bold cursor-pointer">
              <option value="EMPLOYEE">EMPLOYEE (Nhân viên nhập liệu)</option>
              <option value="TECHNICIAN">TECHNICIAN (Kỹ thuật viên)</option>
              <option value="ADMIN">ADMIN (Quản trị viên toàn quyền)</option>
            </select>
          </div>
          <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label class="font-bold text-slate-500 block">Cấp quyền truy cập (Permissions)</label>
            <div class="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <input type="checkbox" v-model="newUser.permissions.canCreateRequest" class="rounded text-sky-600 focus:ring-sky-500 h-4 w-4">
                <span>Tạo phiếu yêu cầu</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <input type="checkbox" v-model="newUser.permissions.canViewKpi" class="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4">
                <span>Xem Dashboard KPI</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                <input type="checkbox" v-model="newUser.permissions.canAccessControlPanel" @change="e => { if (e.target.checked) newUser.role = 'ADMIN'; }" class="rounded text-amber-600 focus:ring-amber-500 h-4 w-4">
                <span class="text-amber-600 dark:text-amber-400 font-bold">Quản trị viên</span>
              </label>
            </div>
          </div>
          <div class="pt-2 flex gap-3">
            <button type="button" @click="closeModal('modal-add-user')" class="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer">Hủy</button>
            <button type="submit" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 cursor-pointer">Tạo</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EXCEL UPLOADER MODAL -->
    <div id="modal-excel" v-if="showExcelModal" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-excel')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Nạp Danh Sách Nhân Sự Excel</h3>
          <button type="button" @click="closeModal('modal-excel')" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <div class="p-5 space-y-4">
          <p class="text-xs text-slate-500 leading-relaxed">
            Hệ thống tự động nhận diện các cột: <strong>Họ và tên</strong>, <strong>Mã NV</strong>, <strong>Bộ phận</strong>, <strong>Khu vực</strong>, <strong>Chức vụ</strong>.
          </p>
          <input type="file" id="file_excel_admin" accept=".xlsx, .xls" class="hidden" @change="processExcelFile" />
          <div
            @click="triggerUpload('file_excel_admin')"
            class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/50"
          >
            <i class="fa-solid fa-file-excel text-3xl text-emerald-500 mb-2"></i>
            <div class="text-xs font-bold">Bấm vào đây để chọn file Excel (.xlsx, .xls)</div>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button type="button" @click="closeModal('modal-excel')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>`;
