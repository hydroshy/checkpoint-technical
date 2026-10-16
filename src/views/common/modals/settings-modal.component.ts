export const SETTINGS_MODAL_HTML = `    <!-- USER SETTINGS & CHANGE PASSWORD MODAL -->
    <div
      id="modal-user-settings"
      v-if="showSettingsModal"
      class="modal-overlay fixed inset-0 bg-slate-950/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
      @click="closeSettingsModal"
    >
      <div
        class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <i class="fa-solid fa-gear text-sm"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {{ t('Account Settings & Password', 'Cài Đặt Tài Khoản & Mật Khẩu') }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-1">
                {{ t('Manage account details and update your password', 'Quản lý thông tin tài khoản và đổi mật khẩu') }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="closeSettingsModal"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- User Profile Info Summary -->
        <div class="p-5 pb-0">
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-500/30">
                {{ userInitials || 'CP' }}
              </div>
              <div>
                <div class="font-bold text-slate-800 dark:text-slate-200 text-sm">{{ currentUser.fullName || currentUser.username }}</div>
                <div class="font-mono text-slate-400 text-[11px]">@{{ currentUser.username }}</div>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              {{ currentUser.role || currentUser.userType || 'EMPLOYEE' }}
            </span>
          </div>
        </div>

        <!-- Change Password Form -->
        <form @submit.prevent="submitChangePassword" class="p-5 space-y-4 text-xs">
          <div class="border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <i class="fa-solid fa-lock text-sky-500"></i>
              {{ t('Change Password', 'Đổi Mật Khẩu') }}
            </h4>

            <!-- Error message if any -->
            <div v-if="settingsError" class="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>{{ settingsError }}</span>
            </div>

            <!-- Current Password -->
            <div class="space-y-1 mb-3">
              <label class="font-bold text-slate-600 dark:text-slate-400 block">
                {{ t('Current Password', 'Mật Khẩu Hiện Tại') }} <span class="text-rose-500">*</span>
              </label>
              <input
                type="password"
                v-model="settingsForm.oldPassword"
                required
                :placeholder="t('Enter current password', 'Nhập mật khẩu hiện tại...')"
                class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <!-- New Password -->
            <div class="space-y-1 mb-3">
              <label class="font-bold text-slate-600 dark:text-slate-400 block">
                {{ t('New Password', 'Mật Khẩu Mới') }} <span class="text-rose-500">*</span>
              </label>
              <input
                type="password"
                v-model="settingsForm.newPassword"
                required
                minlength="6"
                :placeholder="t('Enter new password (min 6 characters)', 'Nhập mật khẩu mới (tối thiểu 6 ký tự)...')"
                class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-1">
              <label class="font-bold text-slate-600 dark:text-slate-400 block">
                {{ t('Confirm New Password', 'Xác Nhận Mật Khẩu Mới') }} <span class="text-rose-500">*</span>
              </label>
              <input
                type="password"
                v-model="settingsForm.confirmPassword"
                required
                minlength="6"
                :placeholder="t('Re-enter new password', 'Xác nhận lại mật khẩu mới...')"
                class="input-box w-full px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <button
              type="button"
              @click="closeSettingsModal"
              class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {{ t('Cancel', 'Hủy') }}
            </button>
            <button
              type="submit"
              :disabled="settingsLoading"
              class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold shadow-md shadow-sky-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i v-if="settingsLoading" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ t('Update Password', 'Cập Nhật Mật Khẩu') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>`;
