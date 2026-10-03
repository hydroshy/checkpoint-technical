export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Dashboard - Nhập Liệu Phiếu Yêu Cầu Kỹ Thuật</title>
  <link rel="icon" type="image/png" href="/images/favicon.png?v=2" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=2" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600;700&family=Host+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- PDF & Excel Utilities -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

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
      margin: 0;
      padding: 0;
      min-height: 100vh;
      -webkit-tap-highlight-color: transparent;
    }
    [v-cloak] { display: none !important; }
    
    /* Typography */
    h1, h2, h3, h4, .brand-title {
      font-family: 'Host Grotesk', 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace !important;
    }

    /* Light Mode (Default) */
    html.theme-light body {
      background-color: #f8fafc;
      color: #0f172a;
    }
    .theme-light .glass-header {
      background: rgba(255, 255, 255, 0.97);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #f8fafc;
      border-color: #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
      background-color: #ffffff;
    }

    /* Dark Mode */
    html.theme-dark body {
      background-color: #030712;
      color: #f1f5f9;
    }
    .theme-dark .glass-header {
      background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid #1e293b;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    .theme-dark .glass-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #1e293b;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    .theme-dark .input-box {
      background-color: #020617;
      border-color: #334155;
      color: #f8fafc;
    }
    .theme-dark .input-box:focus {
      border-color: #38bdf8;
      background-color: #0b1329;
    }
    .theme-dark input::placeholder, .theme-dark textarea::placeholder {
      color: #64748b;
    }

    /* Toggles */
    .toggle-label {
      transition: all 0.2s ease;
      user-select: none;
      min-height: 42px;
    }
    .toggle-radio:checked + label {
      background-color: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
      box-shadow: 0 0 0 1px #3b82f6;
    }
    .toggle-radio-success:checked + label {
      background-color: #f0fdf4;
      border-color: #22c55e;
      color: #166534;
      box-shadow: 0 0 0 1px #22c55e;
    }
    .toggle-radio-danger:checked + label {
      background-color: #fef2f2;
      border-color: #ef4444;
      color: #b91c1c;
      box-shadow: 0 0 0 1px #ef4444;
    }
    .toggle-radio-warning:checked + label {
      background-color: #fffbeb;
      border-color: #f59e0b;
      color: #b45309;
      box-shadow: 0 0 0 1px #f59e0b;
    }
    .toggle-radio-purple:checked + label {
      background-color: #f5f3ff;
      border-color: #8b5cf6;
      color: #5b21b6;
      box-shadow: 0 0 0 1px #8b5cf6;
    }

    /* Photo thumbnails */
    .photo-thumbnail {
      position: relative;
      width: 84px;
      height: 84px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .photo-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .photo-remove-btn {
      position: absolute;
      top: 3px;
      right: 3px;
      background: rgba(220, 38, 38, 0.95);
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* Modals */
    .modal-overlay {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .modal-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      transform: translateY(16px) scale(0.97);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-overlay.show .modal-content {
      transform: translateY(0) scale(1);
    }

    .wheel-container { scroll-snap-type: y mandatory; }
    .wheel-item {
      scroll-snap-align: center;
      height: 44px;
      line-height: 44px;
      transition: all 0.15s ease;
    }

    /* PDF Rendering Styles */
    #pdf-template {
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      background: white;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      color: black;
      z-index: -1000;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    .pdf-page {
      width: 794px;
      height: 1123px;
      padding: 25px 30px;
      box-sizing: border-box;
      background: white;
      position: relative;
      overflow: hidden;
    }
    .pdf-border {
      border: 1.5px solid black;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .pdf-header {
      display: flex;
      border-bottom: 1.5px solid black;
      flex-shrink: 0;
    }
    .pdf-meta {
      width: 140px;
      padding: 8px;
      border-right: 1.5px solid black;
      font-size: 9px;
      line-height: 1.6;
    }
    .pdf-title-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .pdf-title {
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pdf-subtitle {
      font-size: 12px;
      margin-top: 4px;
    }
    .pdf-section-title {
      padding: 6px 10px;
      font-weight: bold;
      border-top: 1.5px solid black;
      border-bottom: 1.5px solid black;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .pdf-row {
      display: flex;
      flex-wrap: wrap;
      padding: 6px 10px;
      border-bottom: 1px solid #e5e7eb;
      gap: 8px 12px;
      align-items: flex-end;
      flex-shrink: 0;
    }
    .pdf-field {
      display: inline-flex;
      align-items: flex-end;
      gap: 6px;
    }
    .pdf-label {
      white-space: nowrap;
      color: #111827;
      margin-bottom: 1px;
    }
    .pdf-value {
      font-weight: bold;
      border-bottom: 1.5px dotted #374151;
      min-width: 40px;
      min-height: 18px;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.3;
      display: block;
      color: #000;
      padding-bottom: 1px;
    }
    .pdf-checkbox {
      width: 12px;
      height: 12px;
      border: 1px solid black;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      box-sizing: border-box;
      flex-shrink: 0;
      margin-bottom: 2px;
    }
    .pdf-checkbox.checked::after {
      content: '';
      width: 4px;
      height: 8px;
      border: solid black;
      border-width: 0 1.5px 1.5px 0;
      transform: rotate(45deg);
      margin-bottom: 2px;
    }
    .pdf-radio {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid black;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      box-sizing: border-box;
      flex-shrink: 0;
      margin-bottom: 2px;
    }
    .pdf-radio.checked::after {
      content: '';
      width: 6px;
      height: 6px;
      background: black;
      border-radius: 50%;
    }
    .pdf-footer {
      position: absolute;
      bottom: 15px;
      left: 30px;
      right: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #6b7280;
      border-top: 1px solid #d1d5db;
      padding-top: 5px;
    }
    .pdf-signature-box {
      display: flex;
      justify-content: space-between;
      padding: 15px 40px 25px 40px;
      margin-top: auto;
    }
    .pdf-signature-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 30%;
    }
    .pdf-signature-line {
      border-bottom: 1px solid black;
      width: 100%;
      height: 40px;
      margin-bottom: 5px;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">
  <div id="app" v-cloak class="flex-1 flex flex-col" @click="handleGlobalClick">
    
    <!-- TOP APP BAR -->
    <header class="glass-header sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between">
      <!-- Left Logo & Title -->
      <div class="flex items-center gap-3">
        <a href="/dashboard" class="flex items-center gap-2.5 text-inherit font-extrabold text-sm tracking-tight text-decoration-none">
          <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-0.5 shadow-inner overflow-hidden">
            <img src="/images/logo-navbar.png?v=2" onerror="this.onerror=null; this.src='/images/logo-full.png'; this.onerror=function(){this.src='/images/favicon.png?v=2';};" class="w-full h-full object-contain rounded-md" alt="Checkpoint Systems Logo" />
          </div>
          <div class="leading-none text-left">
            <div class="flex items-center gap-1.5">
              <span><span class="text-sky-500">CHECKPOINT</span> Systems</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/15 text-sky-600 border border-sky-500/30">v4.1</span>
            </div>
            <span class="text-[10px] text-slate-500 font-normal">Phiếu Yêu Cầu Kỹ Thuật</span>
          </div>
        </a>

        <!-- Portal Tabs -->
        <div class="hidden sm:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            @click="activeTab = 'form'"
            :class="activeTab === 'form' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-file-pen text-xs"></i> Nhập Phiếu Mới
          </button>
          <button
            @click="activeTab = 'history'; loadHistory();"
            :class="activeTab === 'history' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <i class="fa-solid fa-list-check text-xs"></i> Lịch Sử Phiếu
            <span v-if="historyTotal > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500 text-white font-mono">{{ historyTotal }}</span>
          </button>
        </div>
      </div>

      <!-- Right User Menu & Controls -->
      <div class="flex items-center gap-2.5">
        <!-- Switch View: Control Panel link for Admin / Technician -->
        <a
          v-if="isAdminOrTech"
          href="/control-panel"
          class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          title="Chuyển sang Giao diện Quản trị Control Panel"
        >
          <i class="fa-solid fa-sliders text-sky-500"></i>
          <span>Control Panel</span>
        </a>

        <!-- User Menu Dropdown Button -->
        <div class="relative">
          <button
            @click.stop="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer select-none"
          >
            <div class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs">
              {{ userInitials }}
            </div>
            <span class="text-xs font-bold hidden sm:inline">{{ currentUser.fullName || currentUser.username || 'Nhân viên' }}</span>
            <i :class="userMenuOpen ? 'rotate-180' : ''" class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform"></i>
          </button>

          <!-- Dropdown Card -->
          <div
            v-if="userMenuOpen"
            @click.stop
            class="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in"
          >
            <!-- User info -->
            <div class="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="text-xs font-bold">{{ currentUser.fullName || currentUser.username }}</div>
              <div class="text-[11px] font-mono text-slate-400">@{{ currentUser.username }}</div>
              <div class="pt-1">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {{ currentUser.role || currentUser.userType || 'EMPLOYEE' }}
                </span>
              </div>
            </div>

            <!-- Theme Mode Selection -->
            <div class="space-y-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giao diện (Theme)</div>
              <div class="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  @click="setTheme('light')"
                  class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer select-none"
                  :class="currentTheme === 'light' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'"
                >
                  <i class="fa-solid fa-sun text-amber-500 text-[11px]"></i>
                  <span>Sáng</span>
                </button>
                <button
                  type="button"
                  @click="setTheme('dark')"
                  class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer select-none"
                  :class="currentTheme === 'dark' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'"
                >
                  <i class="fa-solid fa-moon text-sky-400 text-[11px]"></i>
                  <span>Tối</span>
                </button>
              </div>
            </div>

            <!-- Portal Links -->
            <div class="space-y-1 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
                <span class="flex items-center gap-2"><i class="fa-solid fa-file-signature"></i> Nhập liệu Kỹ Thuật</span>
                <span class="text-[9px] font-mono font-bold uppercase bg-sky-500/20 px-1.5 py-0.5 rounded">Hiện tại</span>
              </div>
              <a
                v-if="isAdminOrTech"
                href="/control-panel"
                class="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between cursor-pointer"
              >
                <span class="flex items-center gap-2"><i class="fa-solid fa-sliders text-sky-500"></i> Admin Control Panel</span>
                <i class="fa-solid fa-arrow-right text-[10px] text-slate-400"></i>
              </a>
            </div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="w-full py-2 px-3 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- MOBILE TABS -->
    <div class="sm:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 gap-2 text-xs font-bold">
      <button
        @click="activeTab = 'form'"
        :class="activeTab === 'form' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5"
      >
        <i class="fa-solid fa-file-pen"></i> Nhập Phiếu
      </button>
      <button
        @click="activeTab = 'history'; loadHistory();"
        :class="activeTab === 'history' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5"
      >
        <i class="fa-solid fa-list-check"></i> Lịch Sử
        <span v-if="historyTotal > 0" class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white text-sky-600 font-mono">{{ historyTotal }}</span>
      </button>
    </div>

    <!-- MAIN BODY -->
    <main class="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-28">

      <!-- =========================================================================
           TAB 1: BIỂU MẪU NHẬP LIỆU (TECHNICAL REQUEST FORM)
           ========================================================================= -->
      <div v-show="activeTab === 'form'" class="space-y-6">
        
        <!-- Header Info Card -->
        <header class="glass-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl text-sky-500 shadow-inner">
              🖨️
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Phiếu Yêu Cầu Kỹ Thuật</h1>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Printing Dept. Repair Request & Downtime Form</p>
            </div>
          </div>
          <div class="flex flex-col items-end w-full sm:w-auto">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số tài liệu (Doc No.)</div>
            <div class="font-mono text-xl sm:text-2xl font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20 w-full sm:w-auto text-center sm:text-right mb-3">
              {{ form.docNo || '—' }}
            </div>
            
            <!-- Backup / Restore / Excel buttons -->
            <div class="flex flex-wrap justify-end gap-2 w-full">
              <button
                @click="triggerRestore"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Phục hồi form từ file JSON"
              >
                <span>📂</span> Phục hồi
              </button>
              <button
                @click="triggerBackup"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Sao lưu form ra file JSON"
              >
                <span>💾</span> Sao lưu
              </button>
              <button
                @click="openExcelUploader"
                class="text-xs bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 hover:bg-sky-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Nạp dữ liệu nhân sự từ Excel"
              >
                <span>📊</span> Nạp NV Excel
              </button>
            </div>
            <input type="file" id="file_restore" accept=".json" class="hidden" @change="processRestoreFile" />
          </div>
        </header>

        <!-- FORM SECTIONS -->
        <div class="space-y-6">

          <!-- SECTION 1: THÔNG TIN YÊU CẦU -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-sky-500/5 px-6 py-4 border-b border-sky-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-500/30">1</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Thông Tin Yêu Cầu</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận sản xuất (Requester)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Time & Person -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày yêu cầu</label>
                  <input type="date" v-model="form.reqDate" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ yêu cầu</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('reqTime')"
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono text-sm font-medium outline-none transition cursor-pointer"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người yêu cầu</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqBy"
                      list="employee_list"
                      placeholder="Nhập Mã NV hoặc tên..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('reqBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Machine -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Công nghệ in (Tech)</label>
                  <select v-model="form.printTech" @change="handleTechChange" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition cursor-pointer">
                    <option value="">— Chọn Công Nghệ —</option>
                    <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
                    <option value="OTHER">Khác...</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên máy (Machine)</label>
                  <div class="flex gap-2">
                    <select
                      v-if="!customMachineMode"
                      v-model="form.machineName"
                      @change="handleMachineSelectChange"
                      class="input-box flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition cursor-pointer"
                    >
                      <option value="">— {{ form.printTech ? 'Chọn Máy' : 'Chọn Công Nghệ Trước' }} —</option>
                      <option v-for="m in currentTechMachines" :key="m" :value="m">{{ m }}</option>
                      <option value="OTHER">📌 Nhập máy khác...</option>
                    </select>
                    <input
                      v-else
                      type="text"
                      v-model="form.machineName"
                      placeholder="Nhập tên máy..."
                      class="input-box flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="customMachineMode = !customMachineMode"
                      class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition"
                      :title="customMachineMode ? 'Chọn từ danh sách' : 'Nhập tên máy thủ công'"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 3: Problem Description -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mô tả sự cố (Problem Description)</label>
                <textarea
                  v-model="form.problem"
                  rows="3"
                  placeholder="Mô tả chi tiết tình trạng lỗi, hiện tượng hư hỏng..."
                  class="input-box px-4 py-3 rounded-xl text-sm outline-none transition resize-y"
                ></textarea>
              </div>

              <!-- Row 4: Status & Priority Toggles -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="machineStatus" id="st_first" value="First Bulk Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label for="st_first" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🆕 Hàng SX lần đầu
                      </label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="machineStatus" id="st_repeat" value="Repeat Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label for="st_repeat" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🔁 Hàng SX nhiều lần
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mức độ ưu tiên</label>
                  <div class="flex flex-wrap gap-2.5 items-center">
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="priority" id="pr_imm" value="Immediate" v-model="form.priority" class="toggle-radio-danger hidden" />
                      <label for="pr_imm" class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🔴 Hỗ trợ ngay
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="priority" id="pr_hold" value="Hold" v-model="form.priority" class="toggle-radio-warning hidden" />
                      <label for="pr_hold" class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                        🟡 Chạy tạm
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px] flex flex-col gap-1.5">
                      <div>
                        <input type="radio" name="priority" id="pr_other" value="Other" v-model="form.priority" class="toggle-radio-purple hidden" />
                        <label for="pr_other" class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
                          📌 Khác
                        </label>
                      </div>
                      <input
                        v-if="form.priority === 'Other'"
                        type="text"
                        v-model="form.priorityOther"
                        placeholder="Nhập mức ưu tiên..."
                        class="input-box w-full px-3 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 2: PHÂN TÍCH & XỬ LÝ -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-emerald-500/5 px-6 py-4 border-b border-emerald-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/30">2</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Phân Tích & Xử Lý</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận kỹ thuật (Technical Dept)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Technical Receiver -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người tiếp nhận (Kỹ thuật)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvBy"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên kỹ thuật viên..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('recvBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Date & Time Calculation -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày nhận</label>
                  <input type="date" v-model="form.recvDate" @change="calculateDowntime" class="input-box px-3.5 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ nhận</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('recvTime')"
                      class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono text-sm text-center outline-none cursor-pointer"
                    />
                    <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày hoàn thành</label>
                  <input type="date" v-model="form.finishDate" @change="calculateDowntime" class="input-box px-3.5 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ hoàn thành</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.finishTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('finishTime')"
                      class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono text-sm text-center outline-none cursor-pointer"
                    />
                    <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Downtime (Phút)</label>
                  <input
                    type="number"
                    v-model="form.downtime"
                    readonly
                    class="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono font-bold rounded-xl text-center outline-none"
                  />
                </div>
              </div>

              <!-- Row 3: Text areas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nguyên nhân gốc (Root Cause)</label>
                  <textarea
                    v-model="form.rootCause"
                    rows="3"
                    placeholder="Phân tích nguyên nhân cốt lõi gây ra sự cố..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Hành động khắc phục (Action Taken)</label>
                  <textarea
                    v-model="form.actionTaken"
                    rows="3"
                    placeholder="Các bước và phương pháp kỹ thuật đã xử lý..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
              </div>

              <!-- Row 4: 4M & Process Stage -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Phân loại lỗi (4M)</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_man" value="MAN" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_man" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Con người</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_mac" value="MACHINE" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_mac" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Máy móc</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_mat" value="MATERIAL" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_mat" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Vật tư</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_met" value="METHOD" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label for="cat_met" class="toggle-label flex justify-center items-center px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">P.Pháp</label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nhóm công đoạn</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_prepress" value="Prepress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label for="typ_prepress" class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">💻 Trước in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_press" value="Press" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label for="typ_press" class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">🖨️ Trong in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_postpress" value="PostPress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label for="typ_postpress" class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">✂️ Sau in</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 3: HÌNH ẢNH CẢI THIỆN -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-amber-500/5 px-6 py-4 border-b border-amber-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/30">3</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Hình Ảnh Cải Thiện</h2>
                <p class="text-xs text-slate-500 font-medium">Before & After Repair Photos (Tối đa 3 ảnh/mục)</p>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Photos Before -->
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full hover:border-sky-400 transition">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái lỗi (Trước)</span>
                    <span class="text-[11px] font-mono text-slate-400">{{ form.photosBefore.length }}/3 ảnh</span>
                  </div>
                  <div class="flex flex-wrap gap-3 mb-4 min-h-[90px] items-center">
                    <div v-if="form.photosBefore.length === 0" class="text-xs text-slate-400 italic text-center w-full py-4">Chưa có ảnh</div>
                    <div v-for="(photo, i) in form.photosBefore" :key="'before-'+i" class="photo-thumbnail">
                      <img :src="photo" alt="Photo Before" />
                      <div class="photo-remove-btn" @click="removePhoto('before', i)">✕</div>
                    </div>
                  </div>
                  <div class="mt-auto grid grid-cols-2 gap-3">
                    <input type="file" id="file_before" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <input type="file" id="cam_before" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <button type="button" @click="triggerUpload('file_before')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('cam_before')" class="py-2 px-3 bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold hover:bg-sky-100 flex items-center justify-center gap-1.5 cursor-pointer">
                      📷 <span>Chụp ảnh</span>
                    </button>
                  </div>
                </div>

                <!-- Photos After -->
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full hover:border-emerald-400 transition">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Đã khắc phục (Sau)</span>
                    <span class="text-[11px] font-mono text-slate-400">{{ form.photosAfter.length }}/3 ảnh</span>
                  </div>
                  <div class="flex flex-wrap gap-3 mb-4 min-h-[90px] items-center">
                    <div v-if="form.photosAfter.length === 0" class="text-xs text-slate-400 italic text-center w-full py-4">Chưa có ảnh</div>
                    <div v-for="(photo, i) in form.photosAfter" :key="'after-'+i" class="photo-thumbnail">
                      <img :src="photo" alt="Photo After" />
                      <div class="photo-remove-btn" @click="removePhoto('after', i)">✕</div>
                    </div>
                  </div>
                  <div class="mt-auto grid grid-cols-2 gap-3">
                    <input type="file" id="file_after" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <input type="file" id="cam_after" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <button type="button" @click="triggerUpload('file_after')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('cam_after')" class="py-2 px-3 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer">
                      📷 <span>Chụp ảnh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: XÁC NHẬN & BÀN GIAO -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-indigo-500/5 px-6 py-4 border-b border-indigo-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/30">4</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Xác Nhận & Bàn Giao</h2>
                <p class="text-xs text-slate-500 font-medium">Production & Technical Handover Confirmation</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Quality & Ticket Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Chất lượng in sau xử lý</label>
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="chkQuality" id="qa_ok" value="OK" v-model="form.chkQuality" class="toggle-radio-success hidden" />
                      <label for="qa_ok" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">✅ Đạt chuẩn</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkQuality" id="qa_ng" value="NG" v-model="form.chkQuality" class="toggle-radio-danger hidden" />
                      <label for="qa_ng" class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">❌ Chưa đạt</label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tình trạng sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_done" value="DONE" v-model="form.chkStatus" class="toggle-radio-success hidden" />
                      <label for="st_done" class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">🟢 Đã khắc phục</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_monitor" value="MONITOR" v-model="form.chkStatus" class="toggle-radio-warning hidden" />
                      <label for="st_monitor" class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">🟡 Đang theo dõi</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_support" value="SUPPORT" v-model="form.chkStatus" class="toggle-radio-danger hidden" />
                      <label for="st_support" class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">🔴 Cần hỗ trợ</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Work Order & Waste metrics -->
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Work order</label>
                  <input type="text" v-model="form.workOrder" placeholder="Số WO..." class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Qty</label>
                  <input type="number" v-model.number="form.woTotalQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Waste</label>
                  <input type="number" v-model.number="form.wasteQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đơn vị</label>
                  <select v-model="form.wasteUnit" class="input-box px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer">
                    <option value="Pcs">Pcs (Cái/Nhãn)</option>
                    <option value="Mét">Mét</option>
                    <option value="Tờ in">Tờ in</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">% Waste</label>
                  <input type="text" v-model="form.wastePercent" readonly placeholder="0%" class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-mono font-bold rounded-xl outline-none text-center" />
                </div>
              </div>

              <!-- Prod Handover Sign -->
              <div class="pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 w-full md:w-1/2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đại diện Sản Xuất ký nhận (Prod. Received By)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.prodMgr"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên người nhận..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('prodMgr')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <!-- =========================================================================
           TAB 2: LỊCH SỬ PHIẾU YÊU CẦU (HISTORY & TRACKING)
           ========================================================================= -->
      <div v-show="activeTab === 'history'" class="space-y-6">
        
        <!-- Filter Bar -->
        <div class="glass-card rounded-2xl p-5 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 class="text-lg font-bold">Lịch Sử Phiếu Yêu Cầu Kỹ Thuật</h2>
              <p class="text-xs text-slate-500">Xem lại các phiếu đã lưu trên hệ thống, nạp lại vào form hoặc tải PDF</p>
            </div>
            <button
              @click="loadHistory"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-arrows-rotate"></i> Làm mới danh sách
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              v-model="historyFilter.search"
              @input="debouncedSearchHistory"
              placeholder="🔍 Tìm theo Số phiếu, Tên máy, Người yêu cầu..."
              class="input-box px-4 py-2 rounded-xl text-xs"
            />
            <select v-model="historyFilter.chkStatus" @change="loadHistory" class="input-box px-4 py-2 rounded-xl text-xs">
              <option value="ALL">— Tất cả trạng thái —</option>
              <option value="DONE">🟢 Đã khắc phục (DONE)</option>
              <option value="MONITOR">🟡 Đang theo dõi (MONITOR)</option>
              <option value="SUPPORT">🔴 Cần hỗ trợ (SUPPORT)</option>
            </select>
            <select v-model="historyFilter.printTech" @change="loadHistory" class="input-box px-4 py-2 rounded-xl text-xs">
              <option value="ALL">— Tất cả công nghệ in —</option>
              <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
            </select>
          </div>
        </div>

        <!-- History Items Grid / List -->
        <div v-if="historyLoading" class="glass-card rounded-2xl p-12 text-center text-slate-400">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl text-sky-500 mb-2"></i>
          <p class="text-sm">Đang tải danh sách phiếu...</p>
        </div>

        <div v-else-if="historyItems.length === 0" class="glass-card rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <i class="fa-solid fa-folder-open text-3xl text-slate-300 dark:text-slate-600 mb-2"></i>
          <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">Không tìm thấy phiếu yêu cầu nào</h3>
          <p class="text-xs">Hãy tạo và lưu phiếu yêu cầu mới ở tab "Nhập Phiếu Mới".</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in historyItems"
            :key="item.id"
            class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-sky-500/40 transition"
          >
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">{{ item.docNo }}</span>
                <span
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': item.chkStatus === 'DONE',
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': item.chkStatus === 'MONITOR',
                    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20': item.chkStatus === 'SUPPORT'
                  }"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                >
                  {{ item.chkStatus === 'DONE' ? 'Đã khắc phục' : (item.chkStatus === 'MONITOR' ? 'Đang theo dõi' : 'Cần hỗ trợ') }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ item.printTech }}
                </span>
                <span v-if="item.downtime" class="text-[11px] font-mono font-bold text-red-500">
                  ⏳ {{ item.downtime }} phút
                </span>
              </div>
              <div class="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Máy: <span class="text-sky-600 dark:text-sky-400">{{ item.machineName }}</span> | Yêu cầu bởi: {{ item.reqBy }} ({{ item.reqDate }} {{ item.reqTime }})
              </div>
              <p class="text-xs text-slate-500 line-clamp-1">
                Sự cố: {{ item.problem }}
              </p>
            </div>

            <!-- Item Action Buttons -->
            <div class="flex flex-wrap items-center gap-2 self-end md:self-auto">
              <button
                @click="loadItemIntoForm(item)"
                class="px-3 py-1.5 bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Tải thông tin phiếu này vào biểu mẫu để tiếp tục sửa hoặc in"
              >
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Nạp vào Form
              </button>
              <button
                @click="quickDownloadPDF(item)"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Xuất file PDF"
              >
                <i class="fa-solid fa-file-pdf text-red-500"></i> Xuất PDF
              </button>
            </div>
          </div>
        </div>

      </div>

    </main>

    <!-- FIXED BOTTOM ACTION BAR (FOR FORM TAB) -->
    <div v-show="activeTab === 'form'" class="fixed bottom-0 left-0 right-0 glass-header border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 z-40 backdrop-blur-md">
      <div class="max-w-5xl mx-auto flex flex-wrap gap-3 justify-between items-center">
        <button
          @click="clearForm"
          class="px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
        >
          🗑️ <span class="hidden sm:inline">Làm mới form</span>
        </button>

        <div class="flex items-center gap-3">
          <!-- Save to Backend Server API -->
          <button
            @click="saveToServer"
            :disabled="savingServer"
            class="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="savingServer"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...</span>
            <span v-else class="flex items-center gap-1.5">💾 <span>Lưu Hệ Thống</span></span>
          </button>

          <!-- Export PDF -->
          <button
            @click="generatePDF"
            :disabled="exportingPDF"
            class="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span v-if="exportingPDF"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang xuất PDF...</span>
            <span v-else class="flex items-center gap-1.5">📄 <span>Xuất PDF</span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- TIME PICKER MODAL -->
    <div id="modal-time" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-end sm:items-center justify-center backdrop-blur-sm pb-10 sm:pb-0" @click="closeModal('modal-time')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xs overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">{{ activeTimeLabel }}</h3>
          <button @click="closeModal('modal-time')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>
        <div class="p-6 relative select-none">
          <div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-11 bg-sky-500/10 border-y border-sky-500/30 pointer-events-none rounded-lg"></div>
          <div class="flex justify-center items-center gap-4 h-48 overflow-hidden">
            <div id="wheel-hour" class="wheel-container w-20 h-full overflow-y-scroll no-scrollbar text-center text-lg text-slate-500 font-mono"></div>
            <div class="text-xl font-bold text-sky-500 pb-1">:</div>
            <div id="wheel-min" class="wheel-container w-20 h-full overflow-y-scroll no-scrollbar text-center text-lg text-slate-500 font-mono"></div>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button @click="closeModal('modal-time')" class="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Hủy</button>
          <button @click="confirmTime" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/30">Chọn</button>
        </div>
      </div>
    </div>

    <!-- PERSON PICKER MODAL -->
    <div id="modal-person" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-person')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Chọn Nhân Sự</h3>
          <button @click="closeModal('modal-person')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
          <button @click="closeModal('modal-person')" class="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Đóng</button>
          <button @click="confirmPerson" class="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/30">Xác Nhận</button>
        </div>
      </div>
    </div>

    <!-- EXCEL UPLOADER MODAL -->
    <div id="modal-excel" class="modal-overlay fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeModal('modal-excel')">
      <div class="modal-content bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold">Nạp Danh Sách Nhân Sự Excel</h3>
          <button @click="closeModal('modal-excel')" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
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
          <button @click="closeModal('modal-excel')" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">Đóng</button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION CONTAINER -->
    <div id="toast-container" class="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"></div>

    <!-- DATALIST FOR EMPLOYEE AUTOCOMPLETE -->
    <datalist id="employee_list">
      <option v-for="emp in employeeDatalist" :key="emp.id" :value="emp.mnv ? emp.name + ' - ' + emp.mnv : emp.name"></option>
    </datalist>

    <!-- HIDDEN A4 PDF TEMPLATE -->
    <div id="pdf-template">
      <div id="pdf-render-area" class="pdf-page">
        <div class="pdf-border">
          <!-- Header -->
          <div class="pdf-header">
            <div class="pdf-meta">
              <div>Mã hiệu: BM-KT-04</div>
              <div>Lần ban hành: 01</div>
              <div>Ngày ban hành: 01/01/2026</div>
              <div>Trang: 1/1</div>
            </div>
            <div class="pdf-title-box">
              <div class="pdf-title">PHIẾU YÊU CẦU HỖ TRỢ KỸ THUẬT</div>
              <div class="pdf-subtitle">TECHNICAL SUPPORT / REPAIR REQUEST</div>
            </div>
          </div>

          <!-- Section 1 -->
          <div class="pdf-section-title" style="background-color: #dbeafe;">
            <span>1. Thông Tin Yêu Cầu Sửa Chữa (Requester)</span>
            <span style="font-weight: normal; font-size: 10px;">Số tài liệu / Doc No: <strong id="pdf_doc_no">{{ form.docNo }}</strong></span>
          </div>
          <div class="pdf-row">
            <div class="pdf-field"><span class="pdf-label">Ngày (Date):</span><div class="pdf-value" id="pdf_req_date">{{ formatDisplayDate(form.reqDate) }}</div></div>
            <div class="pdf-field ml-4"><span class="pdf-label">Giờ (Time):</span><div class="pdf-value w-16 text-center" id="pdf_req_time">{{ form.reqTime }}</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Người yêu cầu (Requested By):</span><div class="pdf-value flex-1" id="pdf_req_by">{{ form.reqBy }}</div></div>
            <div class="pdf-field ml-auto gap-4 items-center mb-1">
              <div class="flex items-center gap-1.5"><div class="pdf-checkbox" :class="{ checked: form.machineStatus === 'First Bulk Print' }"></div> <span class="text-[10px]">Hàng SX lần đầu</span></div>
              <div class="flex items-center gap-1.5"><div class="pdf-checkbox" :class="{ checked: form.machineStatus === 'Repeat Print' }"></div> <span class="text-[10px]">Hàng SX nhiều lần</span></div>
            </div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Công Nghệ / Tên máy (Tech/Machine):</span><div class="pdf-value flex-1" id="pdf_machine">[{{ form.printTech || '—' }}] {{ form.machineName || '—' }}</div></div>
            <div class="pdf-field ml-auto gap-3 items-center mb-1">
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Immediate' }"></div> <span class="text-[10px] text-red-600 font-bold">Hỗ trợ ngay</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Hold' }"></div> <span class="text-[10px] text-amber-600 font-bold">Chạy tạm</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Other' }"></div> <span class="text-[10px] text-blue-600 font-bold">Khác: </span><div class="pdf-value min-w-[50px] inline-block">{{ form.priority === 'Other' ? form.priorityOther : '' }}</div></div>
            </div>
          </div>
          <div class="pdf-row border-b-0 pb-1">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Mô tả sự cố (Problem):</span><div class="pdf-value flex-1" id="pdf_prob">{{ form.problem }}</div></div>
          </div>

          <!-- Section 2 -->
          <div class="pdf-section-title" style="background-color: #dcfce7;">
            <span>2. Thông Tin Xử Lý Của Kỹ Thuật (Technical Section)</span>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Người nhận (Receive By):</span><div class="pdf-value flex-1" id="pdf_recv_by">{{ form.recvBy }}</div></div>
            <div class="pdf-field ml-4"><span class="pdf-label">Downtime:</span><div class="pdf-value w-16 text-center font-bold text-red-600" id="pdf_downtime">{{ form.downtime || 0 }}</div><span class="text-[9px]">phút</span></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Nhận:</span><div class="pdf-value flex-1 text-center" id="pdf_recv_time_full">{{ form.recvTime }} ({{ formatShortDate(form.recvDate) }})</div></div>
            <div class="pdf-field flex-1 ml-4"><span class="pdf-label">Hoàn Thành:</span><div class="pdf-value flex-1 text-center" id="pdf_fin_time_full">{{ form.finishTime }} ({{ formatShortDate(form.finishDate) }})</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Nguyên nhân (Root Cause):</span><div class="pdf-value flex-1" id="pdf_rc">{{ form.rootCause }}</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Nội dung xử lý (Action Taken):</span><div class="pdf-value flex-1" id="pdf_act">{{ form.actionTaken }}</div></div>
          </div>
          <div class="pdf-row border-b-0 pb-1 flex justify-between bg-slate-50">
            <div class="flex gap-4 items-center">
              <div class="font-bold text-[10px] mr-2">PHÂN LOẠI LỖI:</div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MAN' }"></div> <span class="text-[10px]">MAN</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MACHINE' }"></div> <span class="text-[10px]">MACHINE</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MATERIAL' }"></div> <span class="text-[10px]">MATERIAL</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'METHOD' }"></div> <span class="text-[10px]">METHOD</span></div>
            </div>
            <div class="flex gap-4 items-center border-l-2 pl-4 border-slate-300">
              <div class="font-bold text-[10px] mr-2">NHÓM:</div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'Prepress' }"></div> <span class="text-[10px]">Trước in</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'Press' }"></div> <span class="text-[10px]">In</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'PostPress' }"></div> <span class="text-[10px]">GC sau in</span></div>
            </div>
          </div>

          <!-- Section 3 & 4 -->
          <div class="pdf-section-title" style="background-color: #f3f4f6;">
            <span>3. Xác Nhận Bàn Giao</span>
          </div>
          <div class="pdf-row justify-between bg-slate-50 min-h-[40px]">
            <div class="flex items-center gap-3">
              <span class="pdf-label font-bold">Chất lượng in sau xử lý:</span>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkQuality === 'OK' }"></div> <span class="text-[10px]">Đạt chuẩn</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkQuality === 'NG' }"></div> <span class="text-[10px]">Chưa đạt</span></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="pdf-label font-bold">Tình trạng sự cố:</span>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'DONE' }"></div> <span class="text-[10px]">Đã khắc phục</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'MONITOR' }"></div> <span class="text-[10px]">Đang theo dõi</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'SUPPORT' }"></div> <span class="text-[10px]">Cần hỗ trợ</span></div>
            </div>
          </div>

          <div class="pdf-row bg-slate-50 min-h-[30px] border-t-0 text-[10px] gap-2 flex-nowrap overflow-hidden">
            <div class="pdf-field flex-[1.5]"><span class="pdf-label font-bold">Work Order:</span><div class="pdf-value flex-1">{{ form.workOrder }}</div></div>
            <div class="pdf-field flex-1"><span class="pdf-label font-bold">Total Qty:</span><div class="pdf-value flex-1 text-center">{{ form.woTotalQty }}</div></div>
            <div class="pdf-field flex-1"><span class="pdf-label font-bold">Waste:</span><div class="pdf-value flex-1 text-center">{{ form.wasteQty }}</div></div>
            <div class="pdf-field flex-[0.8] min-w-[50px]"><span class="pdf-label font-bold">Đơn vị:</span><div class="pdf-value flex-1 text-center">{{ form.wasteUnit }}</div></div>
            <div class="pdf-field flex-[0.8] min-w-[50px]"><span class="pdf-label font-bold">% Waste:</span><div class="pdf-value flex-1 text-center">{{ form.wastePercent }}</div></div>
          </div>

          <!-- Signatures -->
          <div class="pdf-signature-box flex-1">
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">SẢN XUẤT YÊU CẦU</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.reqBy || '').split('-')[0] }}</div>
            </div>
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">KỸ THUẬT THỰC HIỆN</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.recvBy || '').split('-')[0] }}</div>
            </div>
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">SẢN XUẤT NHẬN BÀN GIAO</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.prodMgr || '').split('-')[0] }}</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="pdf-footer">
            <span>Doc No: {{ form.docNo }}</span>
            <span>Hệ thống Quản lý Yêu cầu Kỹ thuật Checkpoint Systems</span>
            <span>Page 1/1</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
      setup() {
        const activeTab = ref('form');
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({});
        const savingServer = ref(false);
        const exportingPDF = ref(false);
        const customMachineMode = ref(false);

        // Form state
        const form = ref({
          id: '',
          docNo: '',
          reqDate: '',
          reqTime: '',
          reqBy: '',
          printTech: '',
          machineName: '',
          problem: '',
          machineStatus: 'First Bulk Print',
          priority: 'Immediate',
          priorityOther: '',
          recvBy: '',
          recvDate: '',
          recvTime: '',
          finishDate: '',
          finishTime: '',
          downtime: 0,
          rootCause: '',
          actionTaken: '',
          errCat: 'MACHINE',
          errType: 'Press',
          photosBefore: [],
          photosAfter: [],
          chkQuality: 'OK',
          chkStatus: 'DONE',
          workOrder: '',
          woTotalQty: '',
          wasteQty: '',
          wasteUnit: 'Pcs',
          wastePercent: '0%',
          prodMgr: ''
        });

        // Catalogs
        const machineCatalog = ref({});
        const employeeDatalist = ref([]);

        // History state
        const historyItems = ref([]);
        const historyTotal = ref(0);
        const historyLoading = ref(false);
        const historyFilter = ref({ search: '', chkStatus: 'ALL', printTech: 'ALL' });
        let searchTimeout = null;

        // Modals state
        const activeTimeTarget = ref(null);
        const activeTimeLabel = ref('Chọn Giờ');
        const activePersonTarget = ref(null);
        const pickerDept = ref('');
        const pickerArea = ref('');
        const pickerSelectedName = ref('');
        const excelStatus = ref({ show: false, isError: false, msg: '' });

        // Computed
        const userInitials = computed(() => {
          const name = currentUser.value.fullName || currentUser.value.username || 'U';
          const parts = name.trim().split(' ');
          if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          }
          return name.substring(0, 2).toUpperCase();
        });

        const isAdminOrTech = computed(() => {
          const r = currentUser.value.role || currentUser.value.userType;
          return r === 'ADMIN' || r === 'SUPER_ADMIN' || r === 'TECHNICIAN';
        });

        const currentTechMachines = computed(() => {
          if (!form.value.printTech || !machineCatalog.value[form.value.printTech]) return [];
          return machineCatalog.value[form.value.printTech];
        });

        const pickerDepartments = computed(() => {
          const depts = [...new Set(employeeDatalist.value.map(e => e.dept).filter(Boolean))];
          return depts.length ? depts : ['Sản Xuất', 'Kỹ Thuật In', 'QA / QC', 'Kho'];
        });

        const pickerAreas = computed(() => {
          if (!pickerDept.value) return [];
          const areas = [...new Set(employeeDatalist.value.filter(e => e.dept === pickerDept.value).map(e => e.area).filter(Boolean))];
          return areas.length ? areas : ['General'];
        });

        const pickerFilteredEmployees = computed(() => {
          if (!pickerDept.value) return employeeDatalist.value;
          return employeeDatalist.value.filter(e => e.dept === pickerDept.value && (!pickerArea.value || e.area === pickerArea.value));
        });

        // Notifications
        const showToast = (msg, isError = false) => {
          const container = document.getElementById('toast-container');
          if (!container) return;
          const toast = document.createElement('div');
          toast.className = 'px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white w-full transition-all duration-300 ' + (isError ? 'bg-red-600' : 'bg-slate-900 border border-slate-700');
          toast.innerHTML = isError ? ('❌ ' + msg) : ('✨ ' + msg);
          container.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
          }, 3200);
        };

        const generateDocNo = () => {
          const d = new Date(), p = v => String(v).padStart(2, '0');
          return 'REQ-' + d.getFullYear() + p(d.getMonth()+1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes());
        };

        const initForm = () => {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const time = now.toTimeString().slice(0, 5);

          form.value.docNo = generateDocNo();
          form.value.reqDate = today;
          form.value.reqTime = time;
          form.value.recvDate = today;
          form.value.recvTime = time;
          form.value.finishDate = today;
          form.value.finishTime = time;
          form.value.downtime = 0;
          calculateWastePercent();
        };

        // Theme
        const setTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
        };

        // Modals
        const openModal = (id) => document.getElementById(id)?.classList.add('show');
        const closeModal = (id) => document.getElementById(id)?.classList.remove('show');

        const openTimePicker = (target) => {
          activeTimeTarget.value = target;
          const labels = { reqTime: 'Giờ Yêu Cầu', recvTime: 'Giờ Tiếp Nhận', finishTime: 'Giờ Hoàn Thành' };
          activeTimeLabel.value = labels[target] || 'Chọn Giờ';

          const hContainer = document.getElementById('wheel-hour'), mContainer = document.getElementById('wheel-min');
          if (hContainer && !hContainer.innerHTML) {
            let hHtml = '<div class="wheel-item"></div><div class="wheel-item"></div>';
            for (let i = 0; i < 24; i++) hHtml += '<div class="wheel-item" data-val="' + i + '">' + String(i).padStart(2, '0') + '</div>';
            hHtml += '<div class="wheel-item"></div><div class="wheel-item"></div>';
            hContainer.innerHTML = hHtml;

            let mHtml = '<div class="wheel-item"></div><div class="wheel-item"></div>';
            for (let i = 0; i < 60; i++) mHtml += '<div class="wheel-item" data-val="' + i + '">' + String(i).padStart(2, '0') + '</div>';
            mHtml += '<div class="wheel-item"></div><div class="wheel-item"></div>';
            mContainer.innerHTML = mHtml;
          }

          openModal('modal-time');

          let h = new Date().getHours(), m = new Date().getMinutes();
          const curr = form.value[target];
          if (curr && curr.includes(':')) {
            const parts = curr.split(':');
            h = parseInt(parts[0], 10);
            m = parseInt(parts[1], 10);
          }
          setTimeout(() => {
            if (hContainer) hContainer.scrollTop = h * 44;
            if (mContainer) mContainer.scrollTop = m * 44;
          }, 20);
        };

        const confirmTime = () => {
          if (!activeTimeTarget.value) return;
          const h = Math.round(document.getElementById('wheel-hour').scrollTop / 44);
          const m = Math.round(document.getElementById('wheel-min').scrollTop / 44);
          const validH = String(Math.min(Math.max(h, 0), 23)).padStart(2, '0');
          const validM = String(Math.min(Math.max(m, 0), 59)).padStart(2, '0');
          form.value[activeTimeTarget.value] = validH + ':' + validM;
          closeModal('modal-time');
          calculateDowntime();
        };

        const openPersonPicker = (target) => {
          activePersonTarget.value = target;
          pickerDept.value = '';
          pickerArea.value = '';
          pickerSelectedName.value = '';
          openModal('modal-person');
        };

        const confirmPerson = () => {
          if (!pickerSelectedName.value) {
            showToast('Vui lòng chọn một nhân sự', true);
            return;
          }
          if (activePersonTarget.value) {
            form.value[activePersonTarget.value] = pickerSelectedName.value === 'OTHER' ? 'NV tự nhập...' : pickerSelectedName.value;
          }
          closeModal('modal-person');
        };

        // Calculations
        const calculateDowntime = () => {
          const rDate = form.value.recvDate, rTime = form.value.recvTime;
          const fDate = form.value.finishDate, fTime = form.value.finishTime;
          if (rDate && rTime && fDate && fTime) {
            const start = new Date(rDate + 'T' + rTime);
            const end = new Date(fDate + 'T' + fTime);
            const diffMs = end - start;
            if (diffMs >= 0) {
              form.value.downtime = Math.floor(diffMs / 60000);
            } else {
              form.value.downtime = 0;
            }
          }
        };

        const calculateWastePercent = () => {
          const total = parseFloat(form.value.woTotalQty) || 0;
          const waste = parseFloat(form.value.wasteQty) || 0;
          if (total > 0) {
            form.value.wastePercent = ((waste / total) * 100).toFixed(2) + '%';
          } else {
            form.value.wastePercent = '0%';
          }
        };

        const handleTechChange = () => {
          if (form.value.printTech === 'OTHER') {
            customMachineMode.value = true;
          } else {
            customMachineMode.value = false;
            form.value.machineName = '';
          }
        };

        const handleMachineSelectChange = () => {
          if (form.value.machineName === 'OTHER') {
            customMachineMode.value = true;
            form.value.machineName = '';
          }
        };

        // Photo Upload & Delete
        const triggerUpload = (id) => document.getElementById(id)?.click();

        const handleImageUpload = (e, type) => {
          const files = Array.from(e.target.files);
          if (!files.length) return;
          const targetArr = type === 'before' ? form.value.photosBefore : form.value.photosAfter;
          files.forEach(file => {
            if (targetArr.length >= 3) {
              showToast('Mỗi mục tối đa 3 ảnh', true);
              return;
            }
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 800;
                const scale = MAX / img.width;
                canvas.width = MAX;
                canvas.height = img.height * scale;
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                targetArr.push(canvas.toDataURL('image/jpeg', 0.75));
              };
              img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          });
          e.target.value = '';
        };

        const removePhoto = (type, index) => {
          const targetArr = type === 'before' ? form.value.photosBefore : form.value.photosAfter;
          targetArr.splice(index, 1);
        };

        // Date Format Helpers
        const formatDisplayDate = (d) => {
          if (!d) return '—';
          const p = d.split('-');
          return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
        };
        const formatShortDate = (d) => {
          if (!d) return '';
          const p = d.split('-');
          return p.length === 3 ? p[2] + '/' + p[1] : d;
        };

        // Backup & Restore
        const triggerBackup = () => {
          const data = {
            form: form.value,
            exportedAt: new Date().toISOString()
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = (form.value.docNo || 'Checkpoint') + '_Backup.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('Đã tải file sao lưu JSON');
        };

        const triggerRestore = () => document.getElementById('file_restore')?.click();

        const processRestoreFile = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const data = JSON.parse(evt.target.result);
              if (data.form) {
                form.value = { ...form.value, ...data.form };
                showToast('Phục hồi dữ liệu biểu mẫu thành công!');
              } else if (data.formState) {
                // Compatible with Technical request V4 1.html format
                form.value.docNo = data.docNo || form.value.docNo;
                if (data.formState.inputs) {
                  const ins = data.formState.inputs;
                  if (ins.req_date) form.value.reqDate = ins.req_date;
                  if (ins.req_time) form.value.reqTime = ins.req_time;
                  if (ins.req_by) form.value.reqBy = ins.req_by;
                  if (ins.print_tech) form.value.printTech = ins.print_tech;
                  if (ins.machine_name) form.value.machineName = ins.machine_name;
                  if (ins.problem) form.value.problem = ins.problem;
                  if (ins.recv_by) form.value.recvBy = ins.recv_by;
                  if (ins.recv_date) form.value.recvDate = ins.recv_date;
                  if (ins.recv_time) form.value.recvTime = ins.recv_time;
                  if (ins.finish_date) form.value.finishDate = ins.finish_date;
                  if (ins.finish_time) form.value.finishTime = ins.finish_time;
                  if (ins.root_cause) form.value.rootCause = ins.root_cause;
                  if (ins.action_taken) form.value.actionTaken = ins.action_taken;
                  if (ins.work_order) form.value.workOrder = ins.work_order;
                  if (ins.prod_mgr) form.value.prodMgr = ins.prod_mgr;
                }
                showToast('Phục hồi dữ liệu biểu mẫu thành công!');
              }
            } catch (err) {
              showToast('Tệp không đúng định dạng', true);
            }
          };
          reader.readAsText(file);
          e.target.value = '';
        };

        // Excel Employee Uploader
        const openExcelUploader = () => {
          excelStatus.value = { show: false, isError: false, msg: '' };
          openModal('modal-excel');
        };

        const processExcelFile = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          excelStatus.value = { show: true, isError: false, msg: 'Đang đọc và phân tích file Excel...' };
          const reader = new FileReader();
          reader.onload = async (evt) => {
            try {
              const data = new Uint8Array(evt.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });

              let hr = -1, ci = null;
              for (let r = 0; r < Math.min(json.length, 6); r++) {
                const H = json[r] || [];
                const _diac = s => (s == null ? '' : String(s)).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().trim();
                const _fc = keys => H.findIndex(h => { const ch = _diac(h); return ch && keys.some(k => ch === k || ch.includes(k)); });
                const name = _fc(['ho va ten', 'ho ten', 'ten nhan vien', 'full name', 'name', 'ten']);
                const mnv  = _fc(['mnv', 'ma nv', 'ma nhan vien', 'ma so nv', 'employee']);
                const dept = _fc(['bo phan', 'department', 'dept', 'phong ban']);
                const area = _fc(['khu vuc', 'area', 'line']);
                const role = _fc(['chuc vu', 'role', 'vi tri']);
                if (name >= 0) { hr = r; ci = { name, mnv, dept, area, role }; break; }
              }

              if (hr >= 0) {
                const employees = [];
                for (let i = hr + 1; i < json.length; i++) {
                  const row = json[i] || [];
                  const nm = (row[ci.name] != null ? String(row[ci.name]) : '').trim();
                  if (!nm) continue;
                  const dept = ci.dept >= 0 ? String(row[ci.dept] || '').trim() : 'Khác';
                  const area = ci.area >= 0 ? String(row[ci.area] || '').trim() : dept;
                  const mnv  = ci.mnv >= 0 ? String(row[ci.mnv] || '').trim() : '';
                  const role = ci.role >= 0 ? String(row[ci.role] || '').trim() : 'Staff';
                  employees.push({ name: nm, mnv, dept, area, role });
                }

                // Send to backend API
                const res = await fetch('/api/employees/bulk-import', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ employees })
                });

                if (res.ok) {
                  excelStatus.value = { show: true, isError: false, msg: '✅ Đã nạp thành công ' + employees.length + ' nhân sự vào hệ thống!' };
                  await loadEmployees();
                  showToast('Đã nạp ' + employees.length + ' nhân sự');
                } else {
                  throw new Error('Lỗi lưu trữ nhân sự lên máy chủ');
                }
              } else {
                throw new Error('Không nhận diện được tiêu đề cột (Họ và tên, Mã NV, Bộ phận...)');
              }
            } catch (err) {
              excelStatus.value = { show: true, isError: true, msg: '❌ ' + (err.message || 'Lỗi đọc file Excel') };
            }
          };
          reader.readAsArrayBuffer(file);
        };

        // Clear Form
        const clearForm = () => {
          initForm();
          form.value.problem = '';
          form.value.printTech = '';
          form.value.machineName = '';
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          form.value.workOrder = '';
          form.value.woTotalQty = '';
          form.value.wasteQty = '';
          form.value.wastePercent = '0%';
          form.value.id = '';
          showToast('Đã làm mới biểu mẫu');
        };

        // SAVE TO SERVER DATABASE API
        const saveToServer = async () => {
          if (!form.value.reqBy || !form.value.reqBy.trim()) {
            showToast('Vui lòng nhập Người yêu cầu', true);
            return;
          }
          if (!form.value.machineName || !form.value.machineName.trim()) {
            showToast('Vui lòng chọn hoặc nhập Tên máy', true);
            return;
          }
          if (!form.value.problem || !form.value.problem.trim()) {
            showToast('Vui lòng nhập Mô tả sự cố', true);
            return;
          }

          savingServer.value = true;
          try {
            const isUpdate = !!form.value.id;
            const url = isUpdate ? ('/api/technical-requests/' + form.value.id) : '/api/technical-requests';
            const method = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(form.value)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi khi lưu phiếu lên hệ thống');

            form.value.id = data.id;
            form.value.docNo = data.docNo;
            showToast(isUpdate ? 'Cập nhật phiếu thành công!' : ('Lưu phiếu ' + data.docNo + ' thành công!'));
            loadHistory();
          } catch (err) {
            showToast(err.message, true);
          } finally {
            savingServer.value = false;
          }
        };

        // GENERATE PDF
        const generatePDF = async () => {
          exportingPDF.value = true;
          try {
            const tpl = document.getElementById('pdf-template');
            tpl.style.left = '0';
            tpl.style.zIndex = '-1';
            await new Promise(r => setTimeout(r, 120));

            const canvas = await html2canvas(document.getElementById('pdf-render-area'), {
              scale: 3,
              useCORS: true,
              backgroundColor: '#ffffff',
              logging: false,
              width: 794,
              height: 1123,
              windowWidth: 794,
              windowHeight: 1123
            });
            tpl.style.left = '-9999px';

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, pdfWidth, pdfHeight);

            // Page 2: Photos if available
            if (form.value.photosBefore.length > 0 || form.value.photosAfter.length > 0) {
              pdf.addPage();
              pdf.setFontSize(14);
              pdf.text('HINH ANH SUA CHUA / REPAIR PHOTOS', 105, 15, { align: 'center' });
              pdf.setFontSize(9);
              pdf.text('Doc No: ' + (form.value.docNo || '—'), 105, 21, { align: 'center' });

              const colW = 90;
              pdf.setFontSize(11);
              pdf.text('TRUOC KHI SUA CHUA (BEFORE)', 15 + colW / 2, 30, { align: 'center' });
              pdf.text('SAU KHI SUA CHUA (AFTER)', 105 + colW / 2, 30, { align: 'center' });
              pdf.setDrawColor(200);
              pdf.line(105, 30, 105, 280);

              let yB = 35;
              form.value.photosBefore.forEach(img => {
                pdf.addImage(img, 'JPEG', 10, yB, colW, 75);
                yB += 80;
              });

              let yA = 35;
              form.value.photosAfter.forEach(img => {
                pdf.addImage(img, 'JPEG', 110, yA, colW, 75);
                yA += 80;
              });
            }

            const cleanDoc = (form.value.docNo || 'Checkpoint').replace(/[/\\\\?%*:|"<>]/g, '-');
            pdf.save(cleanDoc + '.pdf');
            showToast('Xuất PDF thành công!');
          } catch (err) {
            console.error(err);
            showToast('Lỗi khi xuất PDF', true);
          } finally {
            exportingPDF.value = false;
          }
        };

        // Quick download PDF for item in history
        const quickDownloadPDF = (item) => {
          form.value = { ...form.value, ...item };
          setTimeout(() => {
            generatePDF();
          }, 100);
        };

        const loadItemIntoForm = (item) => {
          form.value = { ...form.value, ...item };
          activeTab.value = 'form';
          showToast('Đã nạp phiếu ' + item.docNo + ' vào biểu mẫu');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Load History
        const loadHistory = async () => {
          historyLoading.value = true;
          try {
            let url = '/api/technical-requests?limit=50';
            if (historyFilter.value.search) url += '&search=' + encodeURIComponent(historyFilter.value.search);
            if (historyFilter.value.chkStatus && historyFilter.value.chkStatus !== 'ALL') url += '&chkStatus=' + historyFilter.value.chkStatus;
            if (historyFilter.value.printTech && historyFilter.value.printTech !== 'ALL') url += '&printTech=' + historyFilter.value.printTech;

            const res = await fetch(url, { credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              historyItems.value = data.items || [];
              historyTotal.value = data.total || 0;
            }
          } catch (e) {
            console.error(e);
          } finally {
            historyLoading.value = false;
          }
        };

        const debouncedSearchHistory = () => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(loadHistory, 350);
        };

        // Load Initial Catalogs
        const loadMachines = async () => {
          try {
            const res = await fetch('/api/machines/grouped', { credentials: 'include' });
            if (res.ok) {
              machineCatalog.value = await res.json();
            }
          } catch (e) {}
        };

        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { credentials: 'include' });
            if (res.ok) {
              employeeDatalist.value = await res.json();
            }
          } catch (e) {}
        };

        const loadSession = async () => {
          try {
            const res = await fetch('/auth/session', { credentials: 'include' });
            if (res.ok) {
              currentUser.value = await res.json();
            } else {
              window.location.replace('/login');
            }
          } catch (e) {}
        };

        const handleLogout = async () => {
          await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
          localStorage.removeItem('checkpoint_token');
          localStorage.removeItem('checkpoint_user');
          window.location.replace('/login?logout=1');
        };

        const handleGlobalClick = () => {
          userMenuOpen.value = false;
        };

        onMounted(() => {
          initForm();
          loadSession();
          loadMachines();
          loadEmployees();
          loadHistory();

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;
        });

        return {
          activeTab,
          userMenuOpen,
          currentTheme,
          currentUser,
          userInitials,
          isAdminOrTech,
          form,
          machineCatalog,
          currentTechMachines,
          customMachineMode,
          employeeDatalist,
          historyItems,
          historyTotal,
          historyLoading,
          historyFilter,
          savingServer,
          exportingPDF,
          activeTimeTarget,
          activeTimeLabel,
          pickerDept,
          pickerArea,
          pickerSelectedName,
          pickerDepartments,
          pickerAreas,
          pickerFilteredEmployees,
          excelStatus,
          setTheme,
          openTimePicker,
          confirmTime,
          openPersonPicker,
          confirmPerson,
          calculateDowntime,
          calculateWastePercent,
          handleTechChange,
          handleMachineSelectChange,
          triggerUpload,
          handleImageUpload,
          removePhoto,
          triggerBackup,
          triggerRestore,
          processRestoreFile,
          openExcelUploader,
          processExcelFile,
          clearForm,
          saveToServer,
          generatePDF,
          quickDownloadPDF,
          loadItemIntoForm,
          loadHistory,
          debouncedSearchHistory,
          handleLogout,
          handleGlobalClick,
          closeModal,
          formatDisplayDate,
          formatShortDate
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
