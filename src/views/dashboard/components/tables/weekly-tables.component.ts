export const DASHBOARD_WEEKLY_TABLES_HTML = `      <div v-show="canViewKpi && activeTab === 'weekly-requests'" class="space-y-6">
        <!-- Header & Action Toolbar -->
        <div class="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">1. Phiếu Yêu Cầu Kỹ Thuật</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                {{ filteredWeeklyRequests.length }} / {{ weeklyRequests.length }} phiếu
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Dữ liệu từ Sheet <strong>1_Technical_Requests</strong> trong Weekly Technical Database.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="exportWeeklyRequestsExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
              title="Tải về file Excel .xlsx"
            >
              <i class="fa-solid fa-file-excel"></i> <span>Xuất Excel</span>
            </button>
            <button
              @click="openWeeklyRequestModal()"
              class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> <span>Tạo Phiếu Mới</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-400 mb-1">Tìm kiếm</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="reqFilter.search"
                type="text"
                placeholder="Tìm mã NV, tên, thiết bị..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Mức độ nghiêm trọng</label>
            <select v-model="reqFilter.severity" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả mức độ</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Trạng thái phiếu</label>
            <select v-model="reqFilter.status" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Overdue">Overdue</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Thiết bị / Máy</label>
            <select v-model="reqFilter.equipment" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả thiết bị</option>
              <option v-for="m in uniqueReqEquipments" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-xs data-table">
              <thead>
                <tr class="text-left">
                  <th class="py-3 px-3.5 whitespace-nowrap">Mã Phiếu / Người Yêu Cầu</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Ngày</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Loại Yêu Cầu</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Thiết Bị (Equipment)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Mức Độ</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">SLA Mục Tiêu (h)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Thực Tế (h)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Đạt SLA</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Người Báo</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Người Xử Lý</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredWeeklyRequests.length === 0">
                  <td colspan="12" class="text-center py-8 text-slate-400">Không tìm thấy phiếu yêu cầu kỹ thuật phù hợp.</td>
                </tr>
                <tr v-for="req in filteredWeeklyRequests" :key="req.id">
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {{ req.requestId }}
                  </td>
                  <td class="py-3 px-3.5 text-slate-500 whitespace-nowrap">{{ req.requestDate || '—' }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">{{ req.requestType }}</td>
                  <td class="py-3 px-3.5 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                    {{ req.itemEquipment }}
                  </td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="getSeverityClass(req.severity)">
                      {{ req.severity }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="getStatusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-center font-mono font-semibold">{{ req.slaTargetHours ?? 1 }}</td>
                  <td class="py-3 px-3.5 text-center font-mono font-semibold">{{ req.actualHours ?? '—' }}</td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="(req.metSla || 'Yes').toLowerCase() === 'yes' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-600 border border-red-500/30'">
                      {{ req.metSla || 'Yes' }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ req.reportedBy }}</td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ req.resolvedBy || '—' }}</td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openWeeklyRequestModal(req)"
                        class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                        title="Chỉnh sửa phiếu"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteWeeklyRequest(req.id)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa phiếu"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 3: SHEET 2_DEFECT_LOG (4 RECORDS)
           ========================================================================= -->
      <div v-show="canViewKpi && activeTab === 'defect-logs'" class="space-y-6">
        <!-- Header & Action Toolbar -->
        <div class="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">2. Nhật Ký Sự Cố (Defect Log)</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                {{ filteredDefectLogs.length }} / {{ defectLogs.length }} lỗi
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Dữ liệu từ Sheet <strong>2_Defect_Log</strong>: Ghi nhận nguyên nhân, thời gian dừng máy và báo cáo 8D.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="exportDefectLogsExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> <span>Xuất Excel</span>
            </button>
            <button
              @click="openDefectModal()"
              class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-red-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> <span>Ghi Nhận Lỗi Defect</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-400 mb-1">Tìm kiếm sự cố</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="defectFilter.search"
                type="text"
                placeholder="Tìm nội dung sự cố, sản phẩm..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Xưởng / Facility</label>
            <select v-model="defectFilter.facility" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả xưởng</option>
              <option value="RFID">RFID</option>
              <option value="WOVEN">WOVEN</option>
              <option value="LASER">LASER</option>
              <option value="OFFSET">OFFSET</option>
              <option value="DIGITAL">DIGITAL</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Nguyên nhân gốc</label>
            <select v-model="defectFilter.rootCause" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả nguyên nhân</option>
              <option value="Machine">Machine</option>
              <option value="System">System</option>
              <option value="Method">Method</option>
              <option value="Material">Material</option>
              <option value="Man">Man</option>
            </select>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-xs data-table">
              <thead>
                <tr class="text-left">
                  <th class="py-3 px-3.5 whitespace-nowrap">Mã Defect</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Ngày</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Xưởng (Facility)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Nguồn Gốc (Source)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Nguyên Nhân Gốc</th>
                  <th class="py-3 px-3.5">Chi Tiết Sự Cố (Specific Issue)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Sản Phẩm Ảnh Hưởng</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Dừng Máy (phút)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Tái Diễn?</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-center">Cần Báo Cáo 8D?</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredDefectLogs.length === 0">
                  <td colspan="11" class="text-center py-8 text-slate-400">Không tìm thấy sự cố defect nào phù hợp.</td>
                </tr>
                <tr v-for="d in filteredDefectLogs" :key="d.id">
                  <td class="py-3 px-3.5 font-mono font-bold text-red-500 whitespace-nowrap">#{{ d.defectId }}</td>
                  <td class="py-3 px-3.5 text-slate-500 whitespace-nowrap">{{ d.defectDate }}</td>
                  <td class="py-3 px-3.5 font-semibold whitespace-nowrap">{{ d.facility }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">{{ d.source }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {{ d.rootCauseCategory }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 max-w-xs truncate" :title="d.specificIssue">{{ d.specificIssue }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">{{ d.affectedProduct }}</td>
                  <td class="py-3 px-3.5 text-center font-mono font-semibold">{{ d.downtimeMinutes || '0' }}</td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="d.recurringIssue === 'Yes' ? 'bg-red-500/20 text-red-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
                      {{ d.recurringIssue }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="d.eightDRequired === 'Yes' ? 'bg-red-500/20 text-red-600 font-bold border border-red-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
                      {{ d.eightDRequired }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openDefectModal(d)"
                        class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                        title="Chỉnh sửa sự cố"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteDefectLog(d.id)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa sự cố"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 4: SHEET 3_ACTION_PLAN (5 RECORDS)
           ========================================================================= -->
      <div v-show="canViewKpi && activeTab === 'action-plans'" class="space-y-6">
        <!-- Header & Action Toolbar -->
        <div class="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">3. Kế Hoạch Hành Động (Action Plan)</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {{ filteredActionPlans.length }} / {{ actionPlans.length }} kế hoạch
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Dữ liệu từ Sheet <strong>3_Action_Plan</strong>: Biện pháp khắc phục dài hạn, người phụ trách và tiến độ hoàn thành.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="exportActionPlansExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> <span>Xuất Excel</span>
            </button>
            <button
              @click="openActionPlanModal()"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> <span>Thêm Kế Hoạch Mới</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-400 mb-1">Tìm kiếm kế hoạch</label>
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="actionFilter.search"
                type="text"
                placeholder="Tìm mã, mô tả, PIC..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Trạng thái (Status)</label>
            <select v-model="actionFilter.status" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả trạng thái</option>
              <option value="In Progress">In Progress (Đang thực hiện)</option>
              <option value="Completed">Completed (Hoàn thành)</option>
              <option value="Pending">Pending (Chờ duyệt)</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-400 mb-1">Người phụ trách (PIC)</label>
            <select v-model="actionFilter.pic" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
              <option value="ALL">Tất cả PIC</option>
              <option value="Steve">Steve</option>
              <option value="Wayne">Wayne</option>
            </select>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-xs data-table">
              <thead>
                <tr class="text-left">
                  <th class="py-3 px-3.5 whitespace-nowrap">Mã Kế Hoạch (Action ID)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Ngày Tạo</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Xưởng</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Defect ID</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Loại Khắc Phục (Fix Type)</th>
                  <th class="py-3 px-3.5">Mô Tả Hành Động</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Phụ Trách (PIC)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Hạn Chót (Deadline)</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Trạng Thái</th>
                  <th class="py-3 px-3.5 whitespace-nowrap">Nguồn Lực Cần</th>
                  <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredActionPlans.length === 0">
                  <td colspan="11" class="text-center py-8 text-slate-400">Không tìm thấy kế hoạch hành động nào.</td>
                </tr>
                <tr v-for="act in filteredActionPlans" :key="act.id">
                  <td class="py-3 px-3.5 font-bold font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {{ act.actionId }}
                  </td>
                  <td class="py-3 px-3.5 text-slate-500 whitespace-nowrap">{{ act.dateLogged }}</td>
                  <td class="py-3 px-3.5 font-medium whitespace-nowrap">{{ act.facility }}</td>
                  <td class="py-3 px-3.5 font-mono text-center whitespace-nowrap">#{{ act.relatedDefectId || '7' }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      {{ act.fixType }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 max-w-xs truncate" :title="act.description">{{ act.description }}</td>
                  <td class="py-3 px-3.5 font-semibold whitespace-nowrap">{{ act.pic }}</td>
                  <td class="py-3 px-3.5 font-mono text-slate-500 whitespace-nowrap">{{ act.deadline }}</td>
                  <td class="py-3 px-3.5 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="act.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 font-bold' : (act.status === 'In Progress' ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                      {{ act.status }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ act.resourceNeeded }}</td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openActionPlanModal(act)"
                        class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                        title="Chỉnh sửa kế hoạch"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteActionPlan(act.id)"
                        class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Xóa kế hoạch"
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 5: CATALOG (REQUESTERS: 30 & MACHINES: 121)
           ========================================================================= -->
      <div v-show="canViewKpi && activeTab === 'catalog'" class="space-y-6">
        <!-- Sub-tabs Toggle -->
        <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              @click="catalogSubTab = 'requesters'"
              :class="catalogSubTab === 'requesters' ? 'bg-white dark:bg-slate-800 shadow text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-4 py-2 rounded-lg text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-users"></i>
              <span>Người Yêu Cầu ({{ requestersList.length }})</span>
            </button>
            <button
              @click="catalogSubTab = 'machines'"
              :class="catalogSubTab === 'machines' ? 'bg-white dark:bg-slate-800 shadow text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-4 py-2 rounded-lg text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-gears"></i>
              <span>Danh Mục Máy Móc ({{ rawMachinesList.length }})</span>
            </button>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button
              v-if="catalogSubTab === 'requesters'"
              @click="exportRequestersExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> Xuất Excel
            </button>
            <button
              v-if="catalogSubTab === 'requesters'"
              @click="openRequesterModal()"
              class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Người Yêu Cầu
            </button>

            <button
              v-if="catalogSubTab === 'machines'"
              @click="exportMachinesExcel"
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-file-excel"></i> Xuất Excel
            </button>
            <button
              v-if="catalogSubTab === 'machines'"
              @click="openMachineModal()"
              class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Thêm Máy Mới
            </button>
          </div>
        </div>

        <!-- Sub-view 1: Requesters (30 records from Name of reqester.xlsx) -->
        <div v-show="catalogSubTab === 'requesters'" class="space-y-4">
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 text-xs">
            <div class="flex-1 relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="requesterFilter.search"
                type="text"
                placeholder="Tìm mã NV (MNV), họ tên, chức vụ..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
            <div class="sm:w-64">
              <select v-model="requesterFilter.department" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
                <option value="ALL">Tất cả bộ phận</option>
                <option v-for="d in uniqueDepartments" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>

          <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left">
                    <th class="py-3 px-3.5 w-16 text-center">STT</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Mã Nhân Viên (MNV)</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Họ và Tên</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Bộ Phận</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Khu Vực</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Chức Vụ</th>
                    <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in filteredRequesters" :key="r.id">
                    <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-400">{{ r.stt }}</td>
                    <td class="py-3 px-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">{{ r.mnv }}</td>
                    <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white">{{ r.fullName }}</td>
                    <td class="py-3 px-3.5">{{ r.department }}</td>
                    <td class="py-3 px-3.5">{{ r.area }}</td>
                    <td class="py-3 px-3.5 text-slate-500">{{ r.position }}</td>
                    <td class="py-3 px-3.5 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          @click="openRequesterModal(r)"
                          class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                          title="Sửa"
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          @click="deleteRequester(r.id)"
                          class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                          title="Xóa"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sub-view 2: Machine list (121 records from Name of reqester.xlsx) -->
        <div v-show="catalogSubTab === 'machines'" class="space-y-4">
          <div class="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 text-xs">
            <div class="flex-1 relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
              <input
                v-model="machineFilter.search"
                type="text"
                placeholder="Tìm tên máy, khu vực công nghệ..."
                class="input-box w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
              />
            </div>
            <div class="sm:w-64">
              <select v-model="machineFilter.tech" class="input-box w-full px-3 py-2 rounded-xl text-xs outline-none">
                <option value="ALL">Tất cả khu vực ({{ uniqueMachineTechs.length }})</option>
                <option v-for="t in uniqueMachineTechs" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>

          <div class="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left">
                    <th class="py-3 px-3.5 w-16 text-center">STT</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Khu Vực / Công Nghệ</th>
                    <th class="py-3 px-3.5 whitespace-nowrap">Tên Máy</th>
                    <th class="py-3 px-3.5 whitespace-nowrap text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in filteredMachines" :key="m.id">
                    <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-400">{{ m.stt }}</td>
                    <td class="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {{ m.tech }}
                      </span>
                    </td>
                    <td class="py-3 px-3.5 font-bold font-mono text-slate-900 dark:text-white">{{ m.name }}</td>
                    <td class="py-3 px-3.5 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          @click="openMachineModal(m)"
                          class="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition"
                          title="Sửa"
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          @click="deleteMachine(m.id)"
                          class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                          title="Xóa"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
