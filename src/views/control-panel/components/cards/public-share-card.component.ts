export const CP_PUBLIC_SHARE_CARD_HTML = `          <!-- Public Form Sharing Card (Admin Control Panel) -->
          <div class="glass-card rounded-2xl p-5 border border-sky-500/20 bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-purple-500/5 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xl text-sky-500 shadow-sm">
                  <i class="fa-solid fa-share-nodes"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2.5 flex-wrap">
                    <h3 class="text-base font-bold tracking-tight">Chia Sẻ Form Yêu Cầu Kỹ Thuật (Public Form)</h3>
                    <span
                      class="text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border transition"
                      :class="isPublicFormEnabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'"
                    >
                      <i class="fa-solid fa-circle text-[7px] mr-1" :class="isPublicFormEnabled ? 'text-emerald-500 animate-pulse' : 'text-slate-400'"></i>
                      {{ isPublicFormEnabled ? 'ĐANG BẬT (CÔNG KHAI)' : 'ĐANG TẮT (NỘI BỘ)' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Khi bật, nhân viên xưởng hoặc các bên liên quan có thể truy cập <b>/form-request</b> và gửi phiếu trực tiếp mà không cần đăng nhập tài khoản.
                  </p>
                </div>
              </div>

              <!-- Switch Toggle Button -->
              <div class="flex items-center gap-3 self-end sm:self-center bg-white/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span class="text-xs font-bold" :class="isPublicFormEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  {{ isPublicFormEnabled ? 'Đang mở' : 'Đang đóng' }}
                </span>
                <button
                  type="button"
                  @click="togglePublicForm"
                  :disabled="togglingPublicForm"
                  :title="isPublicFormEnabled ? 'Nhấn để tắt form công khai' : 'Nhấn để bật form công khai'"
                  class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 select-none"
                  :class="isPublicFormEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"
                    :class="isPublicFormEnabled ? 'translate-x-6' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- Public Link & Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div class="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-hidden shadow-inner">
                <i class="fa-solid fa-link text-sky-500 text-xs flex-shrink-0"></i>
                <span class="truncate select-all font-semibold">{{ publicFormUrl }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="copyPublicFormLink"
                  class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <i :class="copySuccess ? 'fa-solid fa-check text-emerald-300' : 'fa-regular fa-copy'"></i>
                  <span>{{ copySuccess ? 'Đã sao chép!' : 'Sao chép link' }}</span>
                </button>
                <a
                  :href="publicFormUrl"
                  target="_blank"
                  class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  title="Mở biểu mẫu công khai trong tab mới"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs text-sky-500"></i>
                  <span>Mở form</span>
                </a>
              </div>
            </div>
          </div>`;
