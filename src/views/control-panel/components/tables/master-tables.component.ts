export const CP_MASTER_TABLES_HTML = `        <!-- =====================================================================
             VIEW 3: MACHINES & PRINTING TECHNOLOGIES (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'machines'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Mục Công Nghệ In & Máy Móc</h1>
              <p class="text-xs text-slate-500">Quản lý danh mục các loại máy in theo từng công nghệ với Tabulator.js</p>
            </div>
            <button
              @click="openAddMachineModal"
              class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Máy Mới
            </button>
          </div>

          <!-- Filter Toolbar for Machines -->
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              v-model="machineSearch"
              @input="applyMachineFilters"
              placeholder="🔍 Tìm kiếm máy theo tên, mã máy hoặc công nghệ..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
            />
            <select v-model="machineTechFilter" @change="applyMachineFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60 cursor-pointer">
              <option value="ALL">— Tất cả công nghệ —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
          </div>

          <!-- Tabulator Container for Machines -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-machines"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 4: EMPLOYEES & PERSONNEL (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'employees'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Danh Sách Nhân Sự & Phân Xưởng</h1>
              <p class="text-xs text-slate-500">Quản lý nhân sự toàn nhà máy hiển thị qua bảng dữ liệu Tabulator</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="openAddEmployeeModal"
                class="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-user-plus"></i> Thêm Nhân Viên
              </button>
              <button
                @click="openExcelUploader"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Nạp Excel
              </button>
              <button
                @click="exportEmployeesExcel"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-download"></i> Xuất Excel
              </button>
            </div>
          </div>

          <!-- Filter Toolbar for Employees -->
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              v-model="empSearch"
              @input="applyEmpFilters"
              placeholder="🔍 Tìm kiếm nhân viên theo tên hoặc mã NV..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
            />
            <select v-model="empDeptFilter" @change="applyEmpFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60 cursor-pointer">
              <option value="ALL">— Tất cả bộ phận —</option>
              <option v-for="d in distinctDepts" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <!-- Tabulator Container for Employees -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-employees"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 5: USER ACCOUNTS & SECURITY (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'users'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Quản Lý User & Phân Quyền</h1>
              <p class="text-xs text-slate-500">Phân quyền tài khoản trực tiếp qua bảng Tabulator (ADMIN, TECHNICIAN, EMPLOYEE)</p>
            </div>
            <button
              @click="openAddUserModal"
              class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <i class="fa-solid fa-user-plus"></i> Thêm Tài Khoản
            </button>
          </div>

          <!-- Filter Toolbar for Users -->
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              v-model="userSearch"
              @input="applyUserFilters"
              placeholder="🔍 Tìm kiếm tài khoản theo username, họ tên hoặc email..."
              class="input-box px-3.5 py-2 rounded-xl text-xs outline-none flex-1"
            />
            <select v-model="userRoleFilter" @change="applyUserFilters" class="input-box px-3.5 py-2 rounded-xl text-xs outline-none sm:w-60 cursor-pointer">
              <option value="ALL">— Tất cả vai trò —</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
              <option value="TECHNICIAN">TECHNICIAN (Kỹ thuật viên)</option>
              <option value="EMPLOYEE">EMPLOYEE (Nhân viên)</option>
            </select>
          </div>

          <!-- Tabulator Container for Users -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-users"></div>
          </div>
        </div>

        <!-- =====================================================================
             VIEW 6: EXISTING DATA & DATA MANAGEMENT (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'existing-data'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Quản Lý Dữ Liệu Hiện Có</h1>
              <p class="text-xs text-slate-500">Tra cứu, quản lý các bảng dữ liệu kỹ thuật và báo cáo vận hành với Tabulator.js</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="loadCurrentDataset"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-arrows-rotate"></i> Tải lại
              </button>
              <button
                @click="exportCurrentDatasetExcel"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                <i class="fa-solid fa-file-excel"></i> Xuất Excel Tập Này
              </button>
            </div>
          </div>

          <!-- KPI Summary Cards for Existing Datasets -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              @click="switchDataset('weekly-requests')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-sky-500/50 transition"
              :class="{ 'ring-2 ring-sky-500/40 bg-sky-50/30 dark:bg-sky-500/5': activeDataset === 'weekly-requests' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1. Phiếu Yêu Cầu Tuần</div>
              <div class="text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">{{ weeklyRequestsList.length }}</div>
              <div class="text-[11px] text-slate-500">Phiếu vận hành theo tuần</div>
            </div>

            <div
              @click="switchDataset('defect-logs')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-amber-500/50 transition"
              :class="{ 'ring-2 ring-amber-500/40 bg-amber-50/30 dark:bg-amber-500/5': activeDataset === 'defect-logs' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">2. Defect Logs Kỹ Thuật</div>
              <div class="text-2xl font-extrabold font-mono text-amber-500">{{ defectLogsList.length }}</div>
              <div class="text-[11px] text-slate-500">Nhật ký sự cố & lỗi máy</div>
            </div>

            <div
              @click="switchDataset('action-plans')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-emerald-500/50 transition"
              :class="{ 'ring-2 ring-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-500/5': activeDataset === 'action-plans' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">3. Action Plan Hành Động</div>
              <div class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{{ actionPlansList.length }}</div>
              <div class="text-[11px] text-slate-500">Kế hoạch khắc phục sự cố</div>
            </div>

            <div
              @click="switchDataset('requesters')"
              class="glass-card rounded-2xl p-4 space-y-1.5 cursor-pointer hover:border-indigo-500/50 transition"
              :class="{ 'ring-2 ring-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-500/5': activeDataset === 'requesters' }"
            >
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4. Người Yêu Cầu</div>
              <div class="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">{{ requestersList.length }}</div>
              <div class="text-[11px] text-slate-500">Danh mục nhân sự yêu cầu</div>
            </div>
          </div>

          <!-- Dataset Switcher Tabs & Search Toolbar -->
          <div class="glass-card rounded-2xl p-4 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  @click="switchDataset('weekly-requests')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'weekly-requests' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-list-check mr-1"></i> Phiếu Yêu Cầu Tuần
                </button>
                <button
                  type="button"
                  @click="switchDataset('defect-logs')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'defect-logs' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-triangle-exclamation mr-1"></i> Defect Logs
                </button>
                <button
                  type="button"
                  @click="switchDataset('action-plans')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'action-plans' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-bullseye mr-1"></i> Action Plans
                </button>
                <button
                  type="button"
                  @click="switchDataset('requesters')"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  :class="activeDataset === 'requesters' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
                >
                  <i class="fa-solid fa-users-gear mr-1"></i> Danh Mục Người Yêu Cầu
                </button>
              </div>

              <div class="w-full sm:w-72">
                <input
                  type="text"
                  v-model="datasetSearch"
                  @input="applyDatasetFilter"
                  placeholder="🔍 Tìm nhanh trong tập dữ liệu này..."
                  class="input-box w-full px-3.5 py-1.5 rounded-xl text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Tabulator Container for Existing Data -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-existing-data"></div>
          </div>
        </div>`;
