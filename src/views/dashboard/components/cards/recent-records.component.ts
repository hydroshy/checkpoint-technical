export const DASHBOARD_RECENT_RECORDS_HTML = `        <!-- Recent Records Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Requests -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-clock-rotate-left text-sky-500"></i> Phiếu Kỹ Thuật Gần Đây
              </h4>
              <button @click="switchTab('weekly-requests')" class="text-xs text-sky-500 hover:underline font-semibold">Xem tất cả ({{ weeklyRequests.length }}) &rarr;</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left font-semibold">
                    <th class="py-2 px-3">Người Yêu Cầu</th>
                    <th class="py-2 px-3">Thiết Bị</th>
                    <th class="py-2 px-3">Mức Độ</th>
                    <th class="py-2 px-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in weeklyRequests.slice(0, 5)" :key="r.id" class="cursor-pointer" @click="openWeeklyRequestModal(r)">
                    <td class="py-2.5 px-3 font-medium">{{ r.requestId }}</td>
                    <td class="py-2.5 px-3 font-mono font-bold text-sky-600 dark:text-sky-400">{{ r.itemEquipment }}</td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="getSeverityClass(r.severity)">{{ r.severity }}</span>
                    </td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="getStatusClass(r.status)">{{ r.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Defects -->
          <div class="glass-card rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-red-500"></i> Danh Sách Sự Cố Defect
              </h4>
              <button @click="switchTab('defect-logs')" class="text-xs text-sky-500 hover:underline font-semibold">Xem tất cả ({{ defectLogs.length }}) &rarr;</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs data-table">
                <thead>
                  <tr class="text-left font-semibold">
                    <th class="py-2 px-3">Mã Defect</th>
                    <th class="py-2 px-3">Xưởng</th>
                    <th class="py-2 px-3">Nguyên Nhân</th>
                    <th class="py-2 px-3">Cần 8D?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in defectLogs" :key="d.id" class="cursor-pointer" @click="openDefectModal(d)">
                    <td class="py-2.5 px-3 font-mono font-bold text-red-500">#{{ d.defectId }}</td>
                    <td class="py-2.5 px-3">{{ d.facility }}</td>
                    <td class="py-2.5 px-3">{{ d.rootCauseCategory }}</td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="d.eightDRequired === 'Yes' ? 'bg-red-500/20 text-red-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
                        {{ d.eightDRequired }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TAB 2: SHEET 1_TECHNICAL_REQUESTS (28 RECORDS)`;
