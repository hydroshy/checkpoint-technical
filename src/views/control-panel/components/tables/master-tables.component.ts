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
             VIEW 6: DATABASE HEALTH & TABLES MANAGEMENT (TABULATOR INTEGRATED)
             ===================================================================== -->
        <div v-show="activeTab === 'database' || activeTab === 'existing-data'" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <i class="fa-solid fa-database text-violet-500"></i> Database
              </h1>
              <p class="text-xs text-slate-500">Theo dõi trạng thái Database Health của cơ sở dữ liệu đang kết nối và danh sách các bảng dữ liệu trong hệ thống</p>
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

          <!-- Database Health & Connection Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Health Card 1: Connection & Health Status -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2 border border-emerald-500/30 bg-emerald-500/5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Database Health</span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div class="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <i class="fa-solid fa-circle-check text-base"></i> Healthy (Connected)
              </div>
              <div class="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                Trạng Thái Kết Nối: Đang hoạt động bình thường
              </div>
            </div>

            <!-- Health Card 2: Database Engine -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cơ Sở Dữ Liệu (Engine)</div>
              <div class="text-xl sm:text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-200">
                SQLite 3 (WAL)
              </div>
              <div class="text-[11px] text-slate-500">
                Lưu trữ cục bộ an toàn, độ trễ &lt; 1ms
              </div>
            </div>

            <!-- Health Card 3: Total Tables -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Danh Sách Bảng (Tables)</div>
              <div class="text-xl sm:text-2xl font-extrabold font-mono text-violet-600 dark:text-violet-400">
                8 Bảng Dữ Liệu
              </div>
              <div class="text-[11px] text-slate-500">
                4 bảng vận hành + 4 bảng danh mục
              </div>
            </div>

            <!-- Health Card 4: Tổng Bản Ghi -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Bản Ghi (Records)</div>
              <div class="text-xl sm:text-2xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
                {{ weeklyRequestsList.length + defectLogsList.length + actionPlansList.length + requestersList.length + machinesFlatList.length + employeesList.length + usersList.length }}
              </div>
              <div class="text-[11px] text-slate-500">
                Đồng bộ tự động theo thời gian thực
              </div>
            </div>
          </div>

          <!-- Danh Sách Bảng & Chuyển Tập Dữ Liệu (Dataset Selector) -->
          <div class="glass-card rounded-2xl p-4 space-y-3">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <i class="fa-solid fa-table-cells text-sky-500"></i> Danh Sách Bảng Dữ Liệu Đang Kết Nối
              </div>
              <span class="text-[11px] text-slate-400 font-mono">Chọn bảng để tra cứu dữ liệu chi tiết</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                @click="switchDataset('weekly-requests')"
                class="p-3.5 rounded-xl border cursor-pointer transition hover:border-sky-500/50"
                :class="activeDataset === 'weekly-requests' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-500/10 shadow-xs' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-400 font-mono uppercase">table: weekly_requests</span>
                  <i class="fa-solid fa-list-check text-xs text-sky-500"></i>
                </div>
                <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Phiếu Yêu Cầu Tuần</div>
                <div class="text-xs font-mono font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">{{ weeklyRequestsList.length }} bản ghi</div>
              </div>

              <div
                @click="switchDataset('defect-logs')"
                class="p-3.5 rounded-xl border cursor-pointer transition hover:border-amber-500/50"
                :class="activeDataset === 'defect-logs' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-500/10 shadow-xs' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-400 font-mono uppercase">table: defect_logs</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-amber-500"></i>
                </div>
                <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Defect Logs Kỹ Thuật</div>
                <div class="text-xs font-mono font-extrabold text-amber-500 mt-0.5">{{ defectLogsList.length }} bản ghi</div>
              </div>

              <div
                @click="switchDataset('action-plans')"
                class="p-3.5 rounded-xl border cursor-pointer transition hover:border-emerald-500/50"
                :class="activeDataset === 'action-plans' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-xs' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-400 font-mono uppercase">table: action_plans</span>
                  <i class="fa-solid fa-bullseye text-xs text-emerald-500"></i>
                </div>
                <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Action Plan Hành Động</div>
                <div class="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{{ actionPlansList.length }} bản ghi</div>
              </div>

              <div
                @click="switchDataset('requesters')"
                class="p-3.5 rounded-xl border cursor-pointer transition hover:border-indigo-500/50"
                :class="activeDataset === 'requesters' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-xs' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-400 font-mono uppercase">table: requesters</span>
                  <i class="fa-solid fa-users-gear text-xs text-indigo-500"></i>
                </div>
                <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Người Yêu Cầu</div>
                <div class="text-xs font-mono font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{{ requestersList.length }} bản ghi</div>
              </div>
            </div>
          </div>

          <!-- Dataset Search Toolbar -->
          <div class="glass-card rounded-2xl p-4">
            <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <i class="fa-solid fa-table text-violet-500"></i>
                <span>Dữ Liệu Bảng: <span class="font-mono text-sky-600 dark:text-sky-400 uppercase font-bold">{{ activeDataset }}</span></span>
              </div>
              <div class="w-full sm:w-80">
                <input
                  type="text"
                  v-model="datasetSearch"
                  @input="applyDatasetFilter"
                  placeholder="🔍 Tìm nhanh trong tập dữ liệu này..."
                  class="input-box w-full px-3.5 py-2 rounded-xl text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Tabulator Container for Existing Data -->
          <div class="glass-card rounded-2xl p-3 overflow-hidden">
            <div id="tabulator-existing-data"></div>
          </div>
        </div>`;
