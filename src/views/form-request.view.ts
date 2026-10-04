export const FORM_REQUEST_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Checkpoint Systems - Phiếu Yêu Cầu Kỹ Thuật (Public Form)</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png?v=3" />
  <link rel="shortcut icon" href="/images/favicon.ico?v=3" />
  <link rel="apple-touch-icon" href="/images/favicon.png?v=3" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600;700&family=Host+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- PDF libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

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
    }
    [v-cloak] { display: none !important; }
    h1, h2, h3, h4, .brand-title {
      font-family: 'Host Grotesk', 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace !important;
    }

    /* Light Mode */
    html.theme-light body {
      background-color: #f8fafc;
      color: #0f172a;
    }
    .theme-light .glass-header {
      background: rgba(255, 255, 255, 0.95);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
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
      border: 1px solid #334155;
      color: #f8fafc;
    }
    .theme-dark .input-box:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }

    /* Toggle Labels & Active Visual Effects */
    .toggle-label {
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    }
    .toggle-label:hover {
      transform: translateY(-1px);
    }
    .toggle-radio:checked + label,
    .toggle-radio:checked + .toggle-label {
      background-color: #0284c7 !important;
      color: #ffffff !important;
      border-color: #0284c7 !important;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.35) !important;
      font-weight: 700 !important;
    }
    .toggle-radio-success:checked + label,
    .toggle-radio-success:checked + .toggle-label {
      background-color: #059669 !important;
      color: #ffffff !important;
      border-color: #059669 !important;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.35) !important;
      font-weight: 700 !important;
    }
    .toggle-radio-danger:checked + label,
    .toggle-radio-danger:checked + .toggle-label {
      background-color: #dc2626 !important;
      color: #ffffff !important;
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.35) !important;
      font-weight: 700 !important;
    }
    .toggle-radio-warning:checked + label,
    .toggle-radio-warning:checked + .toggle-label {
      background-color: #d97706 !important;
      color: #ffffff !important;
      border-color: #d97706 !important;
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.35) !important;
      font-weight: 700 !important;
    }
    .toggle-radio-purple:checked + label,
    .toggle-radio-purple:checked + .toggle-label {
      background-color: #7c3aed !important;
      color: #ffffff !important;
      border-color: #7c3aed !important;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.35) !important;
      font-weight: 700 !important;
    }

    /* Photos */
    .photo-thumbnail {
      position: relative;
      width: 72px;
      height: 72px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }
    .theme-dark .photo-thumbnail {
      border-color: #334155;
    }
    .photo-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .photo-remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(220, 38, 38, 0.85);
      color: white;
      border-radius: 9999px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      cursor: pointer;
    }

    /* PDF Template styles */
    #pdf-template {
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      color: #111827;
      font-family: Arial, sans-serif;
      font-size: 11px;
      box-sizing: border-box;
    }
    .pdf-page {
      padding: 12mm 15mm;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      position: relative;
      background: white;
    }
    .pdf-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 6px;
    }
    .pdf-table th, .pdf-table td {
      border: 1px solid #374151;
      padding: 4px 6px;
      text-align: left;
    }
    .pdf-table th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    .pdf-header-title {
      font-size: 18px;
      font-weight: 800;
      color: #0284c7;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pdf-section-title {
      font-size: 11px;
      font-weight: bold;
      background-color: #e2e8f0;
      padding: 3px 6px;
      margin-top: 8px;
      margin-bottom: 3px;
      border-left: 3px solid #0284c7;
      text-transform: uppercase;
    }
    .pdf-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
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
  <div id="app" v-cloak class="flex-1 flex flex-col">

    <!-- TOP HEADER -->
    <header class="glass-header sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/form-request" class="flex items-center gap-2.5 text-inherit font-extrabold text-sm tracking-tight text-decoration-none">
          <div class="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-1 shadow-inner overflow-hidden">
            <img src="/images/logo-navbar.png?v=3" onerror="this.onerror=null; this.src='/images/logo-login.png?v=3'; this.onerror=function(){this.src='/images/favicon.png?v=3';};" class="w-full h-full object-contain rounded-lg" alt="Checkpoint Systems Logo" />
          </div>
          <div class="leading-none text-left">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-extrabold"><span class="text-sky-500">Checkpoint</span> Systems</span>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Phiếu Yêu Cầu Kỹ Thuật (Public Form)</span>
          </div>
        </a>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Theme Toggle -->
        <button
          type="button"
          @click="toggleTheme"
          class="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          :title="currentTheme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'"
        >
          <i :class="currentTheme === 'dark' ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-sky-500'" class="text-xs"></i>
        </button>

        <!-- Login Link -->
        <a
          href="/login"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 border border-sky-200 dark:border-sky-500/30 transition shadow-sm"
        >
          <i class="fa-solid fa-right-to-bracket text-sky-500"></i>
          <span>Đăng nhập</span>
        </a>
      </div>
    </header>

    <!-- MAIN BODY -->
    <main class="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

      <!-- LOADING STATE -->
      <div v-if="loadingStatus" class="flex flex-col items-center justify-center py-24 space-y-4">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-sky-500"></i>
        <p class="text-sm font-medium text-slate-500">Đang kiểm tra trạng thái biểu mẫu...</p>
      </div>

      <!-- CLOSED STATE BANNER (When Admin has disabled public form) -->
      <div v-else-if="!isPublicFormEnabled" class="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 my-12 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl text-amber-500 shadow-inner">
          <i class="fa-solid fa-lock"></i>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Biểu Mẫu Tạm Khóa</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Chức năng gửi yêu cầu kỹ thuật công khai hiện đang được <b>tạm đóng</b> bởi Quản trị viên hệ thống. Vui lòng liên hệ bộ phận kỹ thuật hoặc đăng nhập tài khoản nhân viên để tiếp tục.
          </p>
        </div>
        <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/login"
            class="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-500/30 transition flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            <span>Đăng nhập hệ thống</span>
          </a>
          <button
            type="button"
            @click="checkPublicFormStatus"
            class="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-arrows-rotate"></i>
            <span>Thử lại</span>
          </button>
        </div>
      </div>

      <!-- ACTIVE PUBLIC FORM -->
      <div v-else class="space-y-6">

        <!-- Form Top Header Info Card -->
        <header class="glass-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl text-sky-500 shadow-inner">
              🖨️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Phiếu Yêu Cầu Kỹ Thuật</h1>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                  Công khai
                </span>
              </div>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Biểu mẫu gửi yêu cầu sửa chữa sự cố & downtime (Printing Dept.)</p>
            </div>
          </div>
          <div class="flex flex-col items-end w-full sm:w-auto">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số tài liệu (Doc No.)</div>
            <div class="font-mono text-xl sm:text-2xl font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20 w-full sm:w-auto text-center sm:text-right mb-2">
              {{ form.docNo || '—' }}
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="clearForm"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Làm mới form"
              >
                <span>🔄</span> Làm mới
              </button>
              <button
                type="button"
                @click="generatePDF"
                :disabled="exportingPDF"
                class="text-xs bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 hover:bg-sky-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Xuất file PDF"
              >
                <span>📄</span> Xuất PDF
              </button>
            </div>
          </div>
        </header>

        <!-- FORM SECTIONS -->
        <form @submit.prevent="submitPublicForm" class="space-y-6">

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
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày yêu cầu <span class="text-red-500">*</span></label>
                  <input type="date" v-model="form.reqDate" required class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ yêu cầu <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('reqTime')"
                      required
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono text-sm font-medium outline-none transition cursor-pointer"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người yêu cầu <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqBy"
                      list="employee_list"
                      placeholder="Nhập Mã NV hoặc tên..."
                      required
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('reqBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự từ danh sách"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Tech, Machine & Work Order -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Công nghệ in <span class="text-red-500">*</span></label>
                  <select v-model="form.printTech" @change="handleTechChange" required class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition">
                    <option value="" disabled>-- Chọn công nghệ --</option>
                    <option v-for="t in availableTechs" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên máy / Thiết bị <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select
                      v-if="!customMachineMode"
                      v-model="form.machineName"
                      @change="handleMachineSelectChange"
                      required
                      class="input-box w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    >
                      <option value="" disabled>-- Chọn máy --</option>
                      <option v-for="m in currentTechMachines" :key="m" :value="m">{{ m }}</option>
                      <option value="__OTHER__">Khác (Nhập tùy chỉnh)...</option>
                    </select>
                    <input
                      v-else
                      type="text"
                      v-model="form.machineName"
                      placeholder="Nhập tên máy..."
                      required
                      class="input-box w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Work Order (WO No.)</label>
                  <input type="text" v-model="form.workOrder" placeholder="Số WO (ví dụ: WO-88291)..." class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
                </div>
              </div>

              <!-- Row 3: Problem Description -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mô tả sự cố (Problem Description) <span class="text-red-500">*</span></label>
                <textarea
                  v-model="form.problem"
                  rows="3"
                  required
                  placeholder="Mô tả chi tiết tình trạng lỗi, hiện tượng hư hỏng..."
                  class="input-box px-4 py-3 rounded-xl text-sm outline-none transition resize-y"
                ></textarea>
              </div>

              <!-- Row 4: Group 1 (Trạng thái sự cố) & Group 2 (Mức độ ưu tiên) -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <!-- Group 1: Trạng thái sự cố (Single choice only) -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="public_machineStatus" id="pst_first" value="First Bulk Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label
                        for="pst_first"
                        :class="form.machineStatus === 'First Bulk Print' ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🆕 Hàng SX lần đầu
                      </label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="public_machineStatus" id="pst_repeat" value="Repeat Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label
                        for="pst_repeat"
                        :class="form.machineStatus === 'Repeat Print' ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🔁 Hàng SX nhiều lần
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Group 2: Mức độ ưu tiên (Single choice only) -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mức độ ưu tiên</label>
                  <div class="flex flex-wrap gap-2.5 items-center">
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="public_priority" id="ppr_imm" value="Immediate" v-model="form.priority" class="toggle-radio-danger hidden" />
                      <label
                        for="ppr_imm"
                        :class="form.priority === 'Immediate' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🔴 Hỗ trợ ngay
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="public_priority" id="ppr_hold" value="Hold" v-model="form.priority" class="toggle-radio-warning hidden" />
                      <label
                        for="ppr_hold"
                        :class="form.priority === 'Hold' ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🟡 Chạy tạm
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px] flex flex-col gap-1.5">
                      <div>
                        <input type="radio" name="public_priority" id="ppr_other" value="Other" v-model="form.priority" class="toggle-radio-purple hidden" />
                        <label
                          for="ppr_other"
                          :class="form.priority === 'Other' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                          class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                        >
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

          <!-- SECTION 2: TIẾP NHẬN & XỬ LÝ (KỸ THUẬT) -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-emerald-500/5 px-6 py-4 border-b border-emerald-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/30">2</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Tiếp Nhận & Xử Lý Sự Cố</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận kỹ thuật (Technical Support)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Person & Time Reception -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người tiếp nhận kỹ thuật</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvBy"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên người tiếp nhận..."
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
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày tiếp nhận</label>
                  <input type="date" v-model="form.recvDate" @change="calculateDowntime" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ tiếp nhận</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('recvTime')"
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono text-sm font-medium outline-none transition cursor-pointer"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
              </div>

              <!-- Row 2: Finish Time & Downtime -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày hoàn thành</label>
                  <input type="date" v-model="form.finishDate" @change="calculateDowntime" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
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
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono text-sm font-medium outline-none transition cursor-pointer"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Downtime (Phút dừng máy)</label>
                  <div class="relative">
                    <input
                      type="number"
                      v-model.number="form.downtime"
                      placeholder="0"
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono font-bold text-sm outline-none transition text-red-600 dark:text-red-400"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">phút</span>
                  </div>
                </div>
              </div>

              <!-- Row 3: Root Cause & Action Taken -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nguyên nhân sự cố (Root Cause)</label>
                  <textarea
                    v-model="form.rootCause"
                    rows="3"
                    placeholder="Phân tích chi tiết nguyên nhân gốc rễ..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Biện pháp xử lý (Action Taken)</label>
                  <textarea
                    v-model="form.actionTaken"
                    rows="3"
                    placeholder="Hành động đã khắc phục, thay thế linh kiện..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
              </div>

              <!-- Row 4: Group 3 (Phân loại lỗi 4M) & Group 4 (Nhóm công đoạn) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <!-- Group 3: Phân loại lỗi (4M) (Single choice only) -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Phân loại lỗi (4M)</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div class="relative">
                      <input type="radio" name="public_errCat" id="pcat_man" value="MAN" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="pcat_man"
                        :class="form.errCat === 'MAN' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >Con người</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="public_errCat" id="pcat_mac" value="MACHINE" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="pcat_mac"
                        :class="form.errCat === 'MACHINE' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >Máy móc</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="public_errCat" id="pcat_mat" value="MATERIAL" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="pcat_mat"
                        :class="form.errCat === 'MATERIAL' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >Vật tư</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="public_errCat" id="pcat_met" value="METHOD" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="pcat_met"
                        :class="form.errCat === 'METHOD' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >P.Pháp</label>
                    </div>
                  </div>
                </div>

                <!-- Group 4: Nhóm công đoạn (Single choice only) -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nhóm công đoạn</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div class="relative">
                      <input type="radio" name="public_errType" id="ptyp_prepress" value="Prepress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label
                        for="ptyp_prepress"
                        :class="form.errType === 'Prepress' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >💻 Trước in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="public_errType" id="ptyp_press" value="Press" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label
                        for="ptyp_press"
                        :class="form.errType === 'Press' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >🖨️ Trong in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="public_errType" id="ptyp_postpress" value="PostPress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label
                        for="ptyp_postpress"
                        :class="form.errType === 'PostPress' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >✂️ Sau in</label>
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
                    <input type="file" id="pfile_before" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <input type="file" id="pcam_before" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <button type="button" @click="triggerUpload('pfile_before')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('pcam_before')" class="py-2 px-3 bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold hover:bg-sky-100 flex items-center justify-center gap-1.5 cursor-pointer">
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
                    <input type="file" id="pfile_after" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <input type="file" id="pcam_after" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <button type="button" @click="triggerUpload('pfile_after')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('pcam_after')" class="py-2 px-3 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer">
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
              <!-- Row 1: Group 5 (Chất lượng in sau xử lý) & Group 6 (Tình trạng sự cố) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Group 5: Chất lượng in sau xử lý (Single choice only) -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Chất lượng in sau xử lý</label>
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="public_chkQuality" id="pqa_ok" value="OK" v-model="form.chkQuality" class="toggle-radio-success hidden" />
                      <label
                        for="pqa_ok"
                        :class="form.chkQuality === 'OK' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >✅ Đạt chuẩn</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="public_chkQuality" id="pqa_ng" value="NG" v-model="form.chkQuality" class="toggle-radio-danger hidden" />
                      <label
                        for="pqa_ng"
                        :class="form.chkQuality === 'NG' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >❌ Chưa đạt</label>
                    </div>
                  </div>
                </div>

                <!-- Group 6: Tình trạng sự cố (Single choice only) -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tình trạng sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="public_chkStatus" id="pst_done" value="DONE" v-model="form.chkStatus" class="toggle-radio-success hidden" />
                      <label
                        for="pst_done"
                        :class="form.chkStatus === 'DONE' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >🟢 Đã khắc phục</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="public_chkStatus" id="pst_monitor" value="MONITOR" v-model="form.chkStatus" class="toggle-radio-warning hidden" />
                      <label
                        for="pst_monitor"
                        :class="form.chkStatus === 'MONITOR' ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >🟡 Đang theo dõi</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="public_chkStatus" id="pst_support" value="SUPPORT" v-model="form.chkStatus" class="toggle-radio-danger hidden" />
                      <label
                        for="pst_support"
                        :class="form.chkStatus === 'SUPPORT' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >🔴 Cần hỗ trợ</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Row 2: Quantities, Waste & Production Manager -->
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Work Order No.</label>
                  <input type="text" v-model="form.workOrder" placeholder="Số WO..." class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Sản lượng tổng</label>
                  <input type="number" v-model.number="form.woTotalQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Phế phẩm phát sinh</label>
                  <input type="number" v-model.number="form.wasteQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đơn vị phế phẩm</label>
                  <select v-model="form.wasteUnit" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none">
                    <option value="Pcs">Pcs (Cái)</option>
                    <option value="Tờ in">Tờ in</option>
                    <option value="Mét">Mét</option>
                    <option value="Kg">Kg</option>
                    <option value="Cuộn">Cuộn</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">% Phế phẩm</label>
                  <input type="text" v-model="form.wastePercent" readonly placeholder="0%" class="input-box px-4 py-2.5 rounded-xl font-mono font-bold text-sm bg-slate-100 dark:bg-slate-900 outline-none text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>

              <!-- Row 3: Production Handover Manager -->
              <div class="flex flex-col gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đại diện bộ phận sản xuất nhận bàn giao (Production Handover)</label>
                <div class="relative max-w-md">
                  <input
                    type="text"
                    v-model="form.prodMgr"
                    list="employee_list"
                    placeholder="Mã NV hoặc tên người nhận bàn giao..."
                    class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
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
          </section>

          <!-- SUBMIT ACTION BAR -->
          <div class="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30 shadow-2xl border border-sky-500/20">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <i class="fa-solid fa-shield-halved text-emerald-500"></i>
              <span>Dữ liệu được lưu trữ tự động vào cơ sở dữ liệu hệ thống Checkpoint</span>
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                @click="clearForm"
                class="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Làm mới
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 sm:flex-initial px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-500/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <i v-if="submitting" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-paper-plane"></i>
                <span>{{ submitting ? 'Đang gửi phiếu...' : 'Gửi Phiếu Yêu Cầu Kỹ Thuật' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

    </main>

    <!-- SUCCESS SUBMISSION MODAL -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-slate-950/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 p-6 text-center space-y-5" @click.stop>
        <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl text-emerald-500 shadow-inner">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Gửi Phiếu Thành Công!</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Yêu cầu kỹ thuật của bạn đã được ghi nhận trên hệ thống Checkpoint Systems.
          </p>
        </div>
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-400">Số phiếu (Doc No.):</span>
            <span class="font-mono font-bold text-sky-600 dark:text-sky-400">{{ submittedTicket?.docNo || form.docNo }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-400">Máy sự cố:</span>
            <span class="font-semibold">{{ submittedTicket?.machineName || form.machineName }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-400">Thời gian tạo:</span>
            <span class="font-mono">{{ submittedTicket?.createdAt ? new Date(submittedTicket.createdAt).toLocaleTimeString('vi-VN') : form.reqTime }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            @click="generatePDF"
            class="w-full py-2.5 bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-sky-200 dark:border-sky-500/30"
          >
            <i class="fa-solid fa-file-pdf"></i>
            <span>Tải phiếu PDF</span>
          </button>
          <button
            type="button"
            @click="startNewTicket"
            class="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Tạo thêm phiếu mới</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TIME PICKER MODAL -->
    <div v-if="showTimeModal" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closeTimeModal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <i class="fa-regular fa-clock text-sky-500"></i> {{ activeTimeLabel }}
          </h3>
          <button @click="closeTimeModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <div class="flex items-center justify-center gap-4 text-3xl font-mono font-bold">
            <div class="flex flex-col items-center gap-1">
              <span class="text-[10px] uppercase font-sans text-slate-400 font-bold">Giờ</span>
              <input type="number" min="0" max="23" v-model="pickerHour" class="input-box w-20 text-center py-2 rounded-xl text-2xl font-mono" />
            </div>
            <span class="text-slate-400 pt-4">:</span>
            <div class="flex flex-col items-center gap-1">
              <span class="text-[10px] uppercase font-sans text-slate-400 font-bold">Phút</span>
              <input type="number" min="0" max="59" v-model="pickerMinute" class="input-box w-20 text-center py-2 rounded-xl text-2xl font-mono" />
            </div>
          </div>
          <div class="flex justify-center gap-2">
            <button type="button" @click="setTimeToNow" class="text-xs px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 font-semibold border border-sky-200 dark:border-sky-500/20 cursor-pointer">
              Hiện tại
            </button>
            <button type="button" @click="pickerHour = '08'; pickerMinute = '00'" class="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
              08:00
            </button>
            <button type="button" @click="pickerHour = '12'; pickerMinute = '00'" class="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
              12:00
            </button>
            <button type="button" @click="pickerHour = '16'; pickerMinute = '30'" class="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
              16:30
            </button>
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button type="button" @click="closeTimeModal" class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer">Hủy</button>
          <button type="button" @click="applyTimePicker" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer">Áp dụng</button>
        </div>
      </div>
    </div>

    <!-- PERSON PICKER MODAL -->
    <div v-if="showPersonModal" class="fixed inset-0 bg-slate-950/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click="closePersonModal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col" @click.stop>
        <div class="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <i class="fa-solid fa-users text-sky-500"></i> Chọn Nhân Sự ({{ activePersonField }})
          </h3>
          <button @click="closePersonModal" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>
        <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <input
            v-model="personFilterText"
            type="text"
            placeholder="Tìm theo tên hoặc mã nhân viên..."
            class="input-box w-full px-4 py-2.5 rounded-xl text-xs outline-none"
          />
        </div>
        <div class="p-4 overflow-y-auto flex-1 space-y-1.5 custom-scrollbar">
          <div
            v-for="p in filteredEmployeeList"
            :key="p.mnv || p.name"
            @click="selectPerson(p)"
            class="p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between cursor-pointer transition"
          >
            <div>
              <div class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ p.name }}</div>
              <div class="text-[11px] font-mono text-slate-400">{{ p.mnv }} • {{ p.dept || 'Sản Xuất' }}</div>
            </div>
            <span class="text-xs text-sky-600 dark:text-sky-400 font-semibold">Chọn →</span>
          </div>
          <div v-if="filteredEmployeeList.length === 0" class="text-center py-8 text-xs text-slate-400">
            Không tìm thấy nhân viên phù hợp
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end flex-shrink-0">
          <button type="button" @click="closePersonModal" class="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer">Đóng</button>
        </div>
      </div>
    </div>

    <!-- DATALIST FOR EMPLOYEE AUTOCOMPLETE -->
    <datalist id="employee_list">
      <option v-for="e in employeeDatalist" :key="e.mnv || e.name" :value="(e.name + (e.mnv ? ' - ' + e.mnv : ''))">
        {{ e.dept }} ({{ e.area }})
      </option>
    </datalist>

    <!-- TOAST CONTAINER -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-[80] flex flex-col gap-2 pointer-events-none max-w-sm w-full"></div>

    <!-- PDF PRINT TEMPLATE -->
    <div id="pdf-template">
      <div id="pdf-render-area" class="pdf-page">
        <div class="pdf-header-title">PHIẾU YÊU CẦU KỸ THUẬT</div>
        <div style="text-align: center; font-size: 10px; color: #64748b; margin-top: 2px; margin-bottom: 8px;">
          PRINTING DEPT. REPAIR REQUEST & DOWNTIME FORM
        </div>

        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-bottom: 8px;">
          <div><strong>Đơn vị:</strong> Checkpoint Systems Printing Dept.</div>
          <div><strong>Số phiếu (Doc No.):</strong> <span style="font-family: monospace; font-weight: bold; color: #0284c7;">{{ form.docNo }}</span></div>
        </div>

        <div class="pdf-section-title">1. Thông Tin Yêu Cầu (Requester)</div>
        <table class="pdf-table">
          <tr>
            <td style="width: 20%; font-weight: bold;">Ngày yêu cầu:</td>
            <td style="width: 30%;">{{ form.reqDate }}</td>
            <td style="width: 20%; font-weight: bold;">Giờ yêu cầu:</td>
            <td style="width: 30%;">{{ form.reqTime }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Người yêu cầu:</td>
            <td>{{ form.reqBy }}</td>
            <td style="font-weight: bold;">Công nghệ in:</td>
            <td>{{ form.printTech }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Tên máy / Thiết bị:</td>
            <td>{{ form.machineName }}</td>
            <td style="font-weight: bold;">Số Work Order:</td>
            <td>{{ form.workOrder || '—' }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Trạng thái sự cố:</td>
            <td>{{ form.machineStatus }}</td>
            <td style="font-weight: bold;">Mức độ ưu tiên:</td>
            <td>{{ form.priority === 'Other' ? ('Khác: ' + form.priorityOther) : form.priority }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Mô tả sự cố:</td>
            <td colspan="3">{{ form.problem }}</td>
          </tr>
        </table>

        <div class="pdf-section-title">2. Tiếp Nhận & Xử Lý Sự Cố (Technical Support)</div>
        <table class="pdf-table">
          <tr>
            <td style="width: 20%; font-weight: bold;">Người tiếp nhận:</td>
            <td style="width: 30%;">{{ form.recvBy || '—' }}</td>
            <td style="width: 20%; font-weight: bold;">Thời gian tiếp nhận:</td>
            <td style="width: 30%;">{{ form.recvDate }} {{ form.recvTime }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Thời gian hoàn thành:</td>
            <td>{{ form.finishDate }} {{ form.finishTime }}</td>
            <td style="font-weight: bold;">Thời gian dừng (Downtime):</td>
            <td style="font-weight: bold; color: #dc2626;">{{ form.downtime }} phút</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Phân loại lỗi (4M):</td>
            <td>{{ form.errCat }}</td>
            <td style="font-weight: bold;">Nhóm công đoạn:</td>
            <td>{{ form.errType }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Nguyên nhân (Root cause):</td>
            <td colspan="3">{{ form.rootCause || '—' }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Biện pháp xử lý:</td>
            <td colspan="3">{{ form.actionTaken || '—' }}</td>
          </tr>
        </table>

        <div class="pdf-section-title">3. Xác Nhận & Bàn Giao (Confirmation & Handover)</div>
        <table class="pdf-table">
          <tr>
            <td style="width: 25%; font-weight: bold;">Chất lượng in sau xử lý:</td>
            <td style="width: 25%;">{{ form.chkQuality === 'OK' ? '✅ Đạt chuẩn (OK)' : '❌ Chưa đạt (NG)' }}</td>
            <td style="width: 25%; font-weight: bold;">Tình trạng sự cố:</td>
            <td style="width: 25%;">{{ form.chkStatus }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Sản lượng tổng (Total):</td>
            <td>{{ form.woTotalQty || '—' }}</td>
            <td style="font-weight: bold;">Phế phẩm phát sinh:</td>
            <td>{{ form.wasteQty || '0' }} {{ form.wasteUnit }} ({{ form.wastePercent || '0%' }})</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Đại diện sản xuất nhận BG:</td>
            <td colspan="3">{{ form.prodMgr || '—' }}</td>
          </tr>
        </table>

        <div class="pdf-signatures">
          <div class="pdf-signature-col">
            <div style="font-weight: bold;">Người Yêu Cầu</div>
            <div style="font-size: 9px; color: #64748b;">(Ký và ghi rõ họ tên)</div>
            <div class="pdf-signature-line"></div>
            <div>{{ form.reqBy }}</div>
          </div>
          <div class="pdf-signature-col">
            <div style="font-weight: bold;">Kỹ Thuật Xử Lý</div>
            <div style="font-size: 9px; color: #64748b;">(Ký và ghi rõ họ tên)</div>
            <div class="pdf-signature-line"></div>
            <div>{{ form.recvBy || '' }}</div>
          </div>
          <div class="pdf-signature-col">
            <div style="font-weight: bold;">Đại Diện Bàn Giao</div>
            <div style="font-size: 9px; color: #64748b;">(Ký và ghi rõ họ tên)</div>
            <div class="pdf-signature-line"></div>
            <div>{{ form.prodMgr || '' }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, computed, onMounted, nextTick } = Vue;

    createApp({
      setup() {
        const loadingStatus = ref(true);
        const isPublicFormEnabled = ref(false);
        const submitting = ref(false);
        const exportingPDF = ref(false);
        const currentTheme = ref('light');
        const showSuccessModal = ref(false);
        const submittedTicket = ref(null);

        // Modals
        const showTimeModal = ref(false);
        const activeTimeTarget = ref(null);
        const activeTimeLabel = ref('Chọn Giờ');
        const pickerHour = ref('08');
        const pickerMinute = ref('00');

        const showPersonModal = ref(false);
        const activePersonField = ref('');
        const personFilterText = ref('');

        // Machine selection mode
        const customMachineMode = ref(false);

        // Catalogs
        const machineCatalog = ref({
          'OFFSET': ['SM 52', 'CD 102', 'XL 75', 'Komori GL40'],
          'FLEXO': ['Mark Andy P5', 'Nilpeter FB3', 'Omet X6', 'Gallus ECS 340'],
          'DIGITAL': ['HP Indigo 6K', 'Xeikon CX300', 'Konica KM-1', 'Ricoh Pro'],
          'SCREEN': ['Sakurai SC102', 'ATMA 6080', 'M&R Sportsman'],
          'PFL': ['Paxar 676', 'Avery Dennison SNAP 500', 'Focus FDP']
        });
        const employeeDatalist = ref([]);

        // Form Model
        const form = ref({
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

        // Initialize Form
        const initForm = () => {
          const now = new Date();
          const dStr = now.toISOString().split('T')[0];
          const tStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          form.value.reqDate = dStr;
          form.value.reqTime = tStr;
          form.value.recvDate = dStr;
          form.value.recvTime = tStr;
          form.value.docNo = 'CPS-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + Math.floor(100 + Math.random() * 900);
        };

        const clearForm = () => {
          if (!confirm('Bạn có muốn làm mới toàn bộ biểu mẫu phiếu yêu cầu?')) return;
          initForm();
          form.value.problem = '';
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          form.value.workOrder = '';
          form.value.woTotalQty = '';
          form.value.wasteQty = '';
          form.value.wastePercent = '0%';
          showToast('Đã làm mới biểu mẫu');
        };

        const startNewTicket = () => {
          showSuccessModal.value = false;
          initForm();
          form.value.problem = '';
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          form.value.workOrder = '';
          form.value.woTotalQty = '';
          form.value.wasteQty = '';
          form.value.wastePercent = '0%';
        };

        // Toast notifications
        const showToast = (msg, isError = false) => {
          const container = document.getElementById('toast-container');
          if (!container) return;
          const toast = document.createElement('div');
          toast.className = 'p-3.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0 ' +
            (isError ? 'bg-red-600 text-white' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900');
          toast.innerHTML = (isError ? '<i class=\"fa-solid fa-triangle-exclamation\"></i>' : '<i class=\"fa-solid fa-circle-check text-emerald-400\"></i>') + ' <span>' + msg + '</span>';
          container.appendChild(toast);
          setTimeout(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
          }, 10);
          setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
          }, 3500);
        };

        // Available print technologies
        const availableTechs = computed(() => {
          const keys = Object.keys(machineCatalog.value || {});
          return keys.length ? keys : ['OFFSET', 'FLEXO', 'DIGITAL', 'SCREEN', 'PFL'];
        });

        // Machines for currently selected technology
        const currentTechMachines = computed(() => {
          if (!form.value.printTech) return [];
          return machineCatalog.value[form.value.printTech] || [];
        });

        const handleTechChange = () => {
          customMachineMode.value = false;
          form.value.machineName = '';
        };

        const handleMachineSelectChange = (e) => {
          if (e.target.value === '__OTHER__') {
            customMachineMode.value = true;
            form.value.machineName = '';
          }
        };

        // Filtered employees for person picker
        const filteredEmployeeList = computed(() => {
          const q = (personFilterText.value || '').trim().toLowerCase();
          if (!q) return employeeDatalist.value;
          return employeeDatalist.value.filter(e =>
            (e.name && e.name.toLowerCase().includes(q)) ||
            (e.mnv && e.mnv.toLowerCase().includes(q)) ||
            (e.dept && e.dept.toLowerCase().includes(q))
          );
        });

        const openPersonPicker = (field) => {
          activePersonField.value = field;
          personFilterText.value = '';
          showPersonModal.value = true;
        };

        const selectPerson = (p) => {
          const val = p.name + (p.mnv ? ' - ' + p.mnv : '');
          form.value[activePersonField.value] = val;
          showPersonModal.value = false;
        };

        const closePersonModal = () => {
          showPersonModal.value = false;
        };

        // Time Picker methods
        const openTimePicker = (target) => {
          activeTimeTarget.value = target;
          if (target === 'reqTime') activeTimeLabel.value = 'Chọn Giờ Yêu Cầu';
          else if (target === 'recvTime') activeTimeLabel.value = 'Chọn Giờ Tiếp Nhận';
          else if (target === 'finishTime') activeTimeLabel.value = 'Chọn Giờ Hoàn Thành';
          else activeTimeLabel.value = 'Chọn Giờ';

          const existing = form.value[target];
          if (existing && typeof existing === 'string' && existing.includes(':')) {
            const parts = existing.split(':');
            pickerHour.value = String(parts[0] || '08').padStart(2, '0');
            pickerMinute.value = String(parts[1] || '00').padStart(2, '0');
          } else {
            setTimeToNow();
          }
          showTimeModal.value = true;
        };

        const setTimeToNow = () => {
          const now = new Date();
          pickerHour.value = String(now.getHours()).padStart(2, '0');
          pickerMinute.value = String(now.getMinutes()).padStart(2, '0');
        };

        const applyTimePicker = () => {
          const h = String(Math.max(0, Math.min(23, parseInt(pickerHour.value, 10) || 0))).padStart(2, '0');
          const m = String(Math.max(0, Math.min(59, parseInt(pickerMinute.value, 10) || 0))).padStart(2, '0');
          form.value[activeTimeTarget.value] = h + ':' + m;
          calculateDowntime();
          showTimeModal.value = false;
        };

        const closeTimeModal = () => {
          showTimeModal.value = false;
        };

        // Image Handling
        const triggerUpload = (id) => {
          const el = document.getElementById(id);
          if (el) el.click();
        };

        const handleImageUpload = (event, type) => {
          const files = event.target.files;
          if (!files || !files.length) return;
          Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (type === 'before') {
                if (form.value.photosBefore.length < 3) form.value.photosBefore.push(e.target.result);
              } else {
                if (form.value.photosAfter.length < 3) form.value.photosAfter.push(e.target.result);
              }
            };
            reader.readAsDataURL(file);
          });
        };

        const removePhoto = (type, index) => {
          if (type === 'before') form.value.photosBefore.splice(index, 1);
          else form.value.photosAfter.splice(index, 1);
        };

        // Calculations
        const calculateDowntime = () => {
          if (!form.value.recvDate || !form.value.recvTime || !form.value.finishDate || !form.value.finishTime) {
            form.value.downtime = 0;
            return;
          }
          const start = new Date(form.value.recvDate + 'T' + form.value.recvTime);
          const end = new Date(form.value.finishDate + 'T' + form.value.finishTime);
          const diffMs = end - start;
          form.value.downtime = diffMs > 0 ? Math.round(diffMs / 60000) : 0;
        };

        const calculateWastePercent = () => {
          const w = parseFloat(form.value.wasteQty) || 0;
          const t = parseFloat(form.value.woTotalQty) || 0;
          form.value.wastePercent = (t > 0 && w >= 0) ? ((w / t) * 100).toFixed(2) + '%' : '0%';
        };

        // Check public form status
        const checkPublicFormStatus = async () => {
          loadingStatus.value = true;
          try {
            const res = await fetch('/api/public/form-status');
            if (res.ok) {
              const data = await res.json();
              isPublicFormEnabled.value = !!(data.enabled ?? data.isPublicFormEnabled);
            } else {
              isPublicFormEnabled.value = false;
            }
          } catch (e) {
            isPublicFormEnabled.value = false;
          } finally {
            loadingStatus.value = false;
          }
        };

        // Load Catalogs for public form
        const loadPublicCatalogs = async () => {
          try {
            const res = await fetch('/api/public/catalogs');
            if (res.ok) {
              const data = await res.json();
              if (data.groupedMachines && Object.keys(data.groupedMachines).length) {
                machineCatalog.value = data.groupedMachines;
              }
              if (data.employees && Array.isArray(data.employees)) {
                employeeDatalist.value = data.employees;
              }
              return;
            }
          } catch (e) {}

          // Fallback to separate endpoints
          try {
            const r1 = await fetch('/api/public/machines/grouped');
            if (r1.ok) machineCatalog.value = await r1.json();
            else {
              const r1b = await fetch('/api/public/machines');
              if (r1b.ok) {
                const list = await r1b.json();
                const grouped = {};
                list.forEach(m => {
                  const t = m.tech || 'OTHER';
                  if (!grouped[t]) grouped[t] = [];
                  grouped[t].push(m.name);
                });
                machineCatalog.value = grouped;
              }
            }
          } catch(e) {}

          try {
            const r2 = await fetch('/api/public/employees');
            if (r2.ok) employeeDatalist.value = await r2.json();
          } catch(e) {}
        };

        // Submit form
        const submitPublicForm = async () => {
          if (!form.value.reqDate || !form.value.reqTime || !form.value.reqBy || !form.value.printTech || !form.value.machineName || !form.value.problem) {
            showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', true);
            return;
          }

          submitting.value = true;
          try {
            const res = await fetch('/api/public/technical-requests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form.value)
            });

            if (res.ok) {
              const record = await res.json();
              submittedTicket.value = record;
              showSuccessModal.value = true;
              showToast('Gửi phiếu yêu cầu kỹ thuật thành công!');
            } else if (res.status === 403) {
              isPublicFormEnabled.value = false;
              showToast('Biểu mẫu công khai đã bị đóng bởi quản trị viên', true);
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Lỗi khi gửi phiếu yêu cầu', true);
            }
          } catch (e) {
            showToast('Lỗi kết nối máy chủ', true);
          } finally {
            submitting.value = false;
          }
        };

        // Generate PDF
        const generatePDF = async () => {
          exportingPDF.value = true;
          try {
            const { jsPDF } = window.jspdf;
            const tpl = document.getElementById('pdf-template');
            tpl.style.display = 'block';
            await nextTick();
            const canvas = await html2canvas(document.getElementById('pdf-render-area'), { scale: 2 });
            tpl.style.display = 'none';

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            const cleanDoc = (form.value.docNo || 'Checkpoint').replace(/[/\\\\?%*:|"<>]/g, '-');
            pdf.save(cleanDoc + '.pdf');
            showToast('Xuất PDF thành công!');
          } catch(e) {
            console.error(e);
            showToast('Lỗi xuất PDF', true);
          } finally {
            exportingPDF.value = false;
          }
        };

        // Theme management
        const setTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
        };

        const toggleTheme = () => {
          setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        onMounted(async () => {
          initForm();
          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;

          await checkPublicFormStatus();
          if (isPublicFormEnabled.value) {
            loadPublicCatalogs();
          }
        });

        return {
          loadingStatus,
          isPublicFormEnabled,
          submitting,
          exportingPDF,
          currentTheme,
          showSuccessModal,
          submittedTicket,
          showTimeModal,
          activeTimeTarget,
          activeTimeLabel,
          pickerHour,
          pickerMinute,
          showPersonModal,
          activePersonField,
          personFilterText,
          customMachineMode,
          machineCatalog,
          employeeDatalist,
          form,
          availableTechs,
          currentTechMachines,
          filteredEmployeeList,
          initForm,
          clearForm,
          startNewTicket,
          showToast,
          handleTechChange,
          handleMachineSelectChange,
          openPersonPicker,
          selectPerson,
          closePersonModal,
          openTimePicker,
          setTimeToNow,
          applyTimePicker,
          closeTimeModal,
          triggerUpload,
          handleImageUpload,
          removePhoto,
          calculateDowntime,
          calculateWastePercent,
          checkPublicFormStatus,
          submitPublicForm,
          generatePDF,
          setTheme,
          toggleTheme
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
