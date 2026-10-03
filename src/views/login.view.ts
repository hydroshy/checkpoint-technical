export const LOGIN_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Đăng Nhập - Checkpoint Systems Weekly Technical Dashboard</title>
  <link rel="icon" type="image/png" href="/images/favicon.png?v=2" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=2" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Azeret+Mono:wght@400;600;700&family=Host+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">
  
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('checkpoint_theme');
        var theme = (saved === 'dark') ? 'dark' : 'light';
        document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
      } catch(e) {
        document.documentElement.classList.add('theme-light');
      }
    })();
  </script>

  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    [v-cloak] { display: none !important; }
    h1, h2, h3, h4, .brand-title {
      font-family: 'Host Grotesk', 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace !important;
    }

    /* Light Theme */
    html.theme-light body {
      background: radial-gradient(circle at 50% 10%, #f0f9ff 0%, #e2e8f0 100%);
      color: #0f172a;
    }
    .theme-light .glass-navbar {
      background: rgba(255, 255, 255, 0.92);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #ffffff;
      border-color: #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .theme-light .quick-role-btn {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #334155;
    }
    .theme-light .quick-role-btn:hover {
      background: #f0f9ff;
      border-color: #38bdf8;
      color: #0284c7;
    }
    .theme-light .quick-role-btn.active {
      background: #e0f2fe;
      border-color: #0284c7;
      color: #0369a1;
      font-weight: 700;
    }

    /* Dark Theme */
    html.theme-dark body {
      background: radial-gradient(circle at 50% 10%, #0c2d48 0%, #020617 80%);
      color: #f8fafc;
    }
    .theme-dark .glass-navbar {
      background: rgba(15, 23, 42, 0.9);
      border-bottom: 1px solid rgba(56, 189, 248, 0.15);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
    }
    .theme-dark .glass-card {
      background: rgba(15, 23, 42, 0.82);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(56, 189, 248, 0.22);
      box-shadow: 0 0 50px -10px rgba(14, 165, 233, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8);
    }
    .theme-dark .input-box {
      background-color: rgba(2, 6, 23, 0.85);
      border-color: #334155;
      color: #ffffff;
    }
    .theme-dark .input-box:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }
    .theme-dark .quick-role-btn {
      background: rgba(2, 6, 23, 0.6);
      border-color: #1e293b;
      color: #94a3b8;
    }
    .theme-dark .quick-role-btn:hover {
      background: rgba(14, 165, 233, 0.1);
      border-color: #38bdf8;
      color: #38bdf8;
    }
    .theme-dark .quick-role-btn.active {
      background: rgba(14, 165, 233, 0.2);
      border-color: #38bdf8;
      color: #38bdf8;
      font-weight: 700;
    }
  </style>
</head>
<body class="flex flex-col justify-between">
  <div id="app" v-cloak class="min-h-screen flex flex-col justify-between">
    
    <!-- TOP NAVBAR -->
    <header class="glass-navbar sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between transition-colors">
      <!-- Left Logo & Brand -->
      <a href="/login" class="flex items-center gap-2.5 text-inherit font-extrabold text-sm tracking-tight text-decoration-none">
        <div class="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-1 shadow-inner overflow-hidden">
          <img src="/images/logo-navbar.png?v=2" onerror="this.onerror=null; this.src='/images/logo-full.png'; this.onerror=function(){this.src='/images/favicon.png?v=2';};" class="w-full h-full object-contain rounded-lg" alt="Checkpoint Systems Logo" />
        </div>
        <div class="leading-none text-left">
          <div class="flex items-center gap-1.5">
            <span class="text-sm font-extrabold"><span class="text-sky-500">CHECKPOINT</span> Systems</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">Weekly Ops</span>
          </div>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Technical Dashboard & Maintenance</span>
        </div>
      </a>

      <!-- Right Controls -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- System Status Badge -->
        <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Hệ Thống Trực Tuyến</span>
        </div>

        <!-- Swagger Docs Link -->
        <a
          href="/api/docs"
          target="_blank"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 transition"
          title="Tài liệu API Swagger"
        >
          <i class="fa-solid fa-book text-sky-500"></i>
          <span>API Docs</span>
        </a>

        <!-- 1-Click Theme Toggle Button -->
        <button
          type="button"
          @click="toggleTheme"
          class="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 shadow-sm transition cursor-pointer"
          :title="currentTheme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'"
        >
          <i :class="currentTheme === 'dark' ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-sky-500'" class="text-sm"></i>
        </button>
      </div>
    </header>

    <!-- MAIN LOGIN CARD CONTAINER -->
    <main class="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
      <div class="w-full max-w-md">
        <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          
          <!-- Logo & Brand Header -->
          <div class="text-center space-y-2">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/30 p-2.5 shadow-inner mb-1 overflow-hidden transition-transform hover:scale-105">
              <img src="/images/logo-login.png?v=2" onerror="this.onerror=null; this.src='/images/logo-navbar.png?v=2'; this.onerror=function(){this.src='/images/logo-full.png';};" class="w-full h-full object-contain rounded-xl" alt="Checkpoint Systems Logo" />
            </div>
            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center justify-center gap-1.5">
              <span class="text-sky-500">CHECKPOINT</span> Systems
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Weekly Technical Dashboard & Maintenance Platform
            </p>
          </div>

          <!-- Alert Notification -->
          <div
            v-if="alert.show"
            :class="alert.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'"
            class="p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition animate-in fade-in"
          >
            <i :class="alert.type === 'error' ? 'fa-solid fa-circle-exclamation text-sm' : 'fa-solid fa-circle-check text-sm'"></i>
            <span class="flex-1">{{ alert.msg }}</span>
          </div>

          <!-- Quick Role Selector Cards -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
              <span>Đăng nhập nhanh theo vai trò:</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="fillCreds('admin')"
                :class="{ active: username === 'admin' }"
                class="quick-role-btn p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer select-none"
              >
                <i class="fa-solid fa-user-shield text-amber-500 text-sm"></i>
                <span class="text-[11px] font-bold leading-tight">Admin</span>
                <span class="text-[9px] opacity-70 font-mono">Quản trị</span>
              </button>
              
              <button
                type="button"
                @click="fillCreds('tech01')"
                :class="{ active: username === 'tech01' }"
                class="quick-role-btn p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer select-none"
              >
                <i class="fa-solid fa-wrench text-sky-500 text-sm"></i>
                <span class="text-[11px] font-bold leading-tight">Kỹ Thuật</span>
                <span class="text-[9px] opacity-70 font-mono">tech01</span>
              </button>
              
              <button
                type="button"
                @click="fillCreds('user01')"
                :class="{ active: username === 'user01' }"
                class="quick-role-btn p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer select-none"
              >
                <i class="fa-solid fa-industry text-emerald-500 text-sm"></i>
                <span class="text-[11px] font-bold leading-tight">Sản Xuất</span>
                <span class="text-[9px] opacity-70 font-mono">user01</span>
              </button>
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Username Input -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Tên đăng nhập hoặc Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <i class="fa-solid fa-user text-xs"></i>
                </div>
                <input
                  v-model="username"
                  type="text"
                  required
                  placeholder="admin, tech01, user01..."
                  autocomplete="username"
                  class="input-box w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <i class="fa-solid fa-lock text-xs"></i>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  autocomplete="current-password"
                  class="input-box w-full pl-10 pr-10 py-2.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition font-medium font-mono"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  tabindex="-1"
                >
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Remember me & Password Hint -->
            <div class="flex items-center justify-between text-xs pt-1">
              <label class="flex items-center text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="rememberMe"
                  class="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sky-500 focus:ring-0 mr-2"
                />
                Ghi nhớ đăng nhập
              </label>
              <span class="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                Mật khẩu: Checkpoint@123
              </span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 active:from-sky-600 active:to-cyan-600 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Đang xác thực...
              </span>
              <span v-else class="flex items-center gap-2">
                Đăng Nhập Vào Hệ Thống <i class="fa-solid fa-arrow-right text-xs"></i>
              </span>
            </button>
          </form>

          <!-- System Info Footer -->
          <div class="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-1">
            <div class="flex items-center justify-center gap-2 font-mono text-[10px]">
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">PostgreSQL DB: Ready</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">NestJS v10</span>
            </div>
            <div>© 2026 Checkpoint Systems Inc. All rights reserved.</div>
          </div>

        </div>
      </div>
    </main>

    <!-- FOOTER BAR -->
    <footer class="py-3 px-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800/60">
      Checkpoint Systems Weekly Technical Dashboard & Operations • v2.0
    </footer>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, onMounted } = Vue;

    createApp({
      setup() {
        const username = ref('admin');
        const password = ref('Checkpoint@123');
        const showPassword = ref(false);
        const rememberMe = ref(true);
        const loading = ref(false);
        const alert = ref({ show: false, type: 'info', msg: '' });
        const currentTheme = ref('light');

        const applyTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          if (theme === 'dark') {
            document.documentElement.classList.remove('theme-light');
            document.documentElement.classList.add('theme-dark');
          } else {
            document.documentElement.classList.remove('theme-dark');
            document.documentElement.classList.add('theme-light');
          }
        };

        const toggleTheme = () => {
          applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        const showAlert = (msg, type = 'info') => {
          alert.value = { show: true, type, msg };
        };

        const fillCreds = (u) => {
          username.value = u;
          password.value = 'Checkpoint@123';
        };

        const handleLogin = async () => {
          if (!username.value.trim() || !password.value) {
            showAlert("Vui lòng nhập tên đăng nhập và mật khẩu", "error");
            return;
          }
          loading.value = true;
          try {
            const res = await fetch('/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                usernameOrEmail: username.value.trim(),
                password: password.value
              })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Tên đăng nhập hoặc mật khẩu không chính xác");

            if (data.access_token) {
              const maxAge = rememberMe.value ? (30 * 24 * 3600) : (24 * 3600);
              localStorage.setItem('checkpoint_token', data.access_token);
              document.cookie = "access_token=" + encodeURIComponent(data.access_token) + "; Path=/; Max-Age=" + maxAge + "; SameSite=Lax";
              document.cookie = "checkpoint_token=" + encodeURIComponent(data.access_token) + "; Path=/; Max-Age=" + maxAge + "; SameSite=Lax";
            }
            if (data.user) {
              localStorage.setItem('checkpoint_user', JSON.stringify(data.user));
            }

            showAlert("Đăng nhập thành công! Đang chuyển hướng đến Dashboard...", "success");
            setTimeout(() => {
              window.location.replace('/dashboard');
            }, 300);
          } catch(err) {
            showAlert(err.message, "error");
            loading.value = false;
          }
        };

        onMounted(async () => {
          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          applyTheme(savedTheme);

          // Check if session is already active and user didn't request a clear/logout
          const urlParams = new URLSearchParams(window.location.search);
          const isClearing = urlParams.get('logout') === '1' || urlParams.get('clear') === '1' || urlParams.get('cleared') === '1';
          if (!isClearing) {
            try {
              const res = await fetch('/auth/session', { credentials: 'include' });
              if (res.ok) {
                const sessionUser = await res.json();
                if (sessionUser && sessionUser.id) {
                  window.location.replace('/dashboard');
                }
              }
            } catch(e) {}
          }
        });

        return {
          username,
          password,
          showPassword,
          rememberMe,
          loading,
          alert,
          currentTheme,
          toggleTheme,
          fillCreds,
          handleLogin
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
