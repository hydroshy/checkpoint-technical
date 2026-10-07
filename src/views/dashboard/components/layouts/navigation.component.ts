export const DASHBOARD_NAV_HTML = `      <!-- =========================================================================
           DASHBOARD D-MODULE (USER PORTAL): 4 CHỨC NĂNG CHÍNH DẠNG CARD
           ========================================================================= -->
      <section v-if="!isKpiActive" class="space-y-6">
        <!-- Portal Banner -->
        <div class="glass-card rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-purple-500/10 border border-slate-200/80 dark:border-slate-800">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 uppercase tracking-wider">
                  D-Module • User Portal
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Checkpoint Technical</span>
              </div>
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Hệ Thống Dịch Vụ Kỹ Thuật
              </h1>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Khởi tạo yêu cầu dịch vụ (CPSR), phản hồi kỹ thuật (CPST), nghiệm thu bàn giao (CPSF) và theo dõi báo cáo hiệu suất kỹ thuật
              </p>
            </div>
            <div class="flex items-center gap-2 self-stretch sm:self-auto">
              <span class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <i class="fa-solid fa-user-check text-sky-500"></i>
                <span>{{ currentUser.fullName || currentUser.username || 'Nhân viên' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 4 Card Chức Năng Chính (CPSR, CPST, CPSF, Report Technical) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- THẺ 1: TẠO FORM CPSR (/form-request) -->
          <a
            href="/form-request"
            class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/60 dark:hover:border-sky-500/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none text-decoration-none"
          >
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all"></div>
            <div>
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                  <i class="fa-solid fa-file-circle-plus"></i>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  CPSR
                </span>
              </div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Tạo Form CPSR
              </h2>
              <div class="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                Phiếu Yêu Cầu Kỹ Thuật
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Khởi tạo yêu cầu sửa chữa, báo hỏng máy in, ghi nhận sự cố ban đầu và thời gian phát sinh sự cố.
              </p>
            </div>
            <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span class="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 group-hover:underline">
                Mở form-request <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
              </span>
              <span class="font-mono text-[10px] text-slate-400">/form-request</span>
            </div>
          </a>

          <!-- THẺ 2: TẠO FORM CPST (/technical-feedback) -->
          <a
            href="/technical-feedback"
            class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none text-decoration-none"
          >
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
            <div>
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                  <i class="fa-solid fa-screwdriver-wrench"></i>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  CPST
                </span>
              </div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Tạo Form CPST
              </h2>
              <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Phản Hồi & Xử Lý Kỹ Thuật
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Tiếp nhận phiếu, phân loại nguyên nhân theo 4M, cập nhật tiến độ xử lý và downtime kỹ thuật.
              </p>
            </div>
            <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 group-hover:underline">
                Mở technical-feedback <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
              </span>
              <span class="font-mono text-[10px] text-slate-400">/technical-feedback</span>
            </div>
          </a>

          <!-- THẺ 3: TẠO FORM CPSF (/confirm-request) -->
          <a
            href="/confirm-request"
            class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none text-decoration-none"
          >
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
            <div>
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                  <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  CPSF
                </span>
              </div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Tạo Form CPSF
              </h2>
              <div class="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                Xác Nhận & Nghiệm Thu Bàn Giao
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Kiểm tra chất lượng hoàn tất, tính tỷ lệ phế liệu, xác nhận nghiệm thu và hoàn tất bàn giao.
              </p>
            </div>
            <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span class="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 group-hover:underline">
                Mở confirm-request <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
              </span>
              <span class="font-mono text-[10px] text-slate-400">/confirm-request</span>
            </div>
          </a>

          <!-- THẺ 4: REPORT TECHNICAL -->
          <div
            @click="selectMenuCard('report-technical')"
            class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
          >
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
            <div>
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                  <i class="fa-solid fa-chart-pie"></i>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  ANALYTICS
                </span>
              </div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Report Technical
              </h2>
              <div class="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                Báo Cáo Kỹ Thuật & Phân Tích KPI
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Thống kê toàn diện chỉ số phiếu kỹ thuật, thời gian downtime và phân bổ trạng thái CPS theo khoảng thời gian.
              </p>
            </div>
            <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 group-hover:underline">
                Xem Report Technical <i class="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
              </span>
              <span class="font-mono text-[10px] text-slate-400">D-Module KPI</span>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           MODULE NAVIGATION & BREADCRUMB (KHI MỞ REPORT TECHNICAL)
           ========================================================================= -->
      <section v-if="isKpiActive" class="mb-6">
        <div class="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <!-- Breadcrumb -->
          <div class="flex items-center flex-wrap gap-2 text-sm">
            <button
              @click="activeTab = ''"
              type="button"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Quay lại Dashboard"
            >
              <i class="fa-solid fa-house text-xs"></i>
              <span>Dashboard</span>
            </button>
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
            <span class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-chart-pie text-emerald-500"></i>
              <span>Report Technical</span>
            </span>
          </div>

          <!-- Quay lại Dashboard button -->
          <button
            type="button"
            @click="activeTab = ''"
            class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <i class="fa-solid fa-arrow-left text-[10px]"></i> Quay lại Dashboard
          </button>
        </div>
      </section>`;
