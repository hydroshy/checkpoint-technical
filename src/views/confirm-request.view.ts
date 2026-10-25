export const CONFIRM_REQUEST_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>CPSF - Xác Nhận Bàn Giao | Checkpoint Systems</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
  <link rel="shortcut icon" href="/images/favicon.ico" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@500;600;700&family=Host+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>

  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .font-brand {
      font-family: 'Host Grotesk', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace;
    }
    .card-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }
    .readonly-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .input-field {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      color: #0f172a;
      transition: all 0.2s ease;
    }
    .input-field:focus {
      background: #ffffff;
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
      outline: none;
    }
    .btn-toggle {
      width: 100%;
      padding: 1rem;
      border-radius: 0.875rem;
      border: 2px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-toggle:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
    }
    .btn-toggle.active-primary {
      border-color: #0284c7;
      background: #f0f9ff;
      color: #0369a1;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15);
    }
    .btn-toggle.active-success {
      border-color: #10b981;
      background: #ecfdf5;
      color: #047857;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    }
    .btn-toggle.active-warning {
      border-color: #f59e0b;
      background: #fffbeb;
      color: #b45309;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
    }
    .btn-toggle.active-danger {
      border-color: #ef4444;
      background: #fef2f2;
      color: #b91c1c;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    }
    .btn-submit {
      background: #0284c7;
      color: #ffffff;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 1.125rem 2rem;
      border-radius: 0.875rem;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 16px rgba(2, 132, 199, 0.35);
    }
    .btn-submit:hover:not(:disabled) {
      background: #0369a1;
      transform: translateY(-1px);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  </style>
</head>
<body class="p-3 sm:p-6 lg:p-8">
  <div id="app" v-cloak class="max-w-4xl mx-auto space-y-6">

    <!-- Top Navigation Header -->
    <header class="card-panel rounded-2xl p-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center">
        <img src="/images/logo-full.png" alt="Checkpoint Systems" class="h-8 sm:h-9 object-contain" />
      </div>

      <!-- Language Toggle EN / VI -->
      <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          @click="setLanguage('en')"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
          :class="currentLang === 'en' ? 'bg-white text-sky-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'"
        >
          <span>EN</span>
        </button>
        <button
          type="button"
          @click="setLanguage('vi')"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
          :class="currentLang === 'vi' ? 'bg-white text-sky-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'"
        >
          <span>VI</span>
        </button>
      </div>
    </header>

    <!-- Confirm Submit Modal Notification (Preview Modal) -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="card-panel rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 border border-slate-200 shadow-2xl">
        <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl font-bold">?</div>
        <div>
          <h2 class="font-brand font-bold text-xl text-slate-900">{{ t('Confirm Handover Submission', 'Xác Nhận Gửi Bàn Giao') }}</h2>
          <p class="text-sm text-slate-600 mt-1 font-medium">{{ t('Please review the information before submitting:', 'Vui lòng kiểm tra lại thông tin trước khi gửi:') }}</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500">{{ t('Tech Feedback Doc No:', 'Mã phản hồi KT:') }}</span>
            <span class="font-mono font-bold text-sky-600">{{ form.cpstDocNo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">{{ t('Print Quality:', 'Chất lượng in:') }}</span>
            <span class="font-bold text-xs" :class="form.chkQuality === 'Đạt' ? 'text-emerald-600' : (form.chkQuality === 'Chạy tạm, tiếp tục theo dõi' ? 'text-amber-600' : 'text-rose-600')">
              {{ form.chkQuality === 'Đạt' ? ('🟢 ' + t('Pass', 'Đạt')) : (form.chkQuality === 'Chạy tạm, tiếp tục theo dõi' ? ('🟡 ' + t('Conditional Run / Monitor', 'Chạy tạm, tiếp tục theo dõi')) : ('🔴 ' + t('Fail', 'Chưa đạt'))) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Work Order:</span>
            <span class="text-slate-800 font-mono font-medium">{{ form.workOrder || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">{{ t('Total / Scrap Qty:', 'Tổng SL / Phế:') }}</span>
            <span class="text-slate-800 font-mono font-medium">{{ form.woTotalQty || 0 }} / {{ form.wasteQty || 0 }} {{ form.wasteUnit }} ({{ calculatedWastePercent }})</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">{{ t('Production Representative:', 'Đại diện sản xuất:') }}</span>
            <span class="text-slate-800 font-medium">{{ form.prodMgr }}</span>
          </div>
          <div v-if="form.notes" class="pt-2 border-t border-slate-200">
            <span class="text-slate-500 block mb-0.5 font-semibold">{{ t('Notes / Remarks:', 'Ghi chú / Ghi nhận:') }}</span>
            <p class="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap">{{ form.notes }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            @click="showConfirmModal = false"
            class="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
          >
            {{ t('Cancel', 'Hủy / Cancel') }}
          </button>
          <button
            type="button"
            @click="confirmSubmit"
            :disabled="isSubmitting"
            class="w-full py-3 px-4 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white transition shadow-md"
          >
            {{ t('Confirm & Submit', 'Xác Nhận & Gửi') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal Notification -->
    <div v-if="successModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="card-panel rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 border-2 border-emerald-500 shadow-2xl">
        <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold">✓</div>
        <div>
          <h2 class="font-brand font-bold text-2xl text-slate-900">{{ t('Handover Acceptance Completed!', 'Bàn Giao Hoàn Tất!') }}</h2>
          <p class="text-sm text-slate-600 mt-1">{{ t('All 3 steps in process completed (CPSR → CPST → CPSF).', 'Đã hoàn thành toàn bộ quy trình 3 bước (CPSR → CPST → CPSF).') }}</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">{{ t('Confirmation Doc No:', 'Số phiếu xác nhận:') }}</span>
            <span class="font-mono text-base font-bold text-sky-600">{{ submittedDocNo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">{{ t('Tech Feedback Doc No:', 'Mã phản hồi KT:') }}</span>
            <span class="font-mono text-xs font-semibold text-emerald-600">{{ form.cpstDocNo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">{{ t('Print Quality:', 'Chất lượng in:') }}</span>
            <span class="text-xs font-bold" :class="form.chkQuality === 'Đạt' ? 'text-emerald-600' : (form.chkQuality === 'Chạy tạm, tiếp tục theo dõi' ? 'text-amber-600' : 'text-rose-600')">
              {{ form.chkQuality === 'Đạt' ? ('🟢 ' + t('Pass', 'Đạt')) : (form.chkQuality === 'Chạy tạm, tiếp tục theo dõi' ? ('🟡 ' + t('Conditional Run / Monitor', 'Chạy tạm, tiếp tục theo dõi')) : ('🔴 ' + t('Fail', 'Chưa đạt'))) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">Work Order:</span>
            <span class="text-xs text-slate-700 font-mono">{{ form.workOrder || 'N/A' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">{{ t('Scrap Rate:', 'Tỷ lệ phế:') }}</span>
            <span class="text-xs font-mono font-bold text-amber-600">{{ calculatedWastePercent }}</span>
          </div>
          <div v-if="form.notes" class="pt-2 border-t border-slate-200 text-left">
            <span class="text-[11px] text-slate-500 block font-semibold">{{ t('Notes / Remarks:', 'Ghi chú / Ghi nhận:') }}</span>
            <p class="text-xs text-slate-700 whitespace-pre-wrap mt-0.5">{{ form.notes }}</p>
          </div>
        </div>
        <div class="pt-2">
          <button
            type="button"
            @click="resetForm"
            class="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition text-center shadow-md"
          >
            {{ t('Done', 'Hoàn thành') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between shadow-sm">
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="text-rose-500 hover:text-rose-800 font-bold ml-2">✕</button>
    </div>

    <!-- Main Form Card -->
    <main class="card-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">

      <!-- Header & Next Code Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 class="font-brand font-bold text-2xl text-slate-900">{{ t('HANDOVER ACCEPTANCE FORM (CPSF)', 'PHIẾU XÁC NHẬN BÀN GIAO (CPSF)') }}</h1>
          <p class="text-xs text-slate-500 mt-1">{{ t('For production representative confirming quality acceptance and handover', 'Dành cho đại diện sản xuất nghiệm thu chất lượng sau xử lý') }}</p>
        </div>
        <div class="flex items-center gap-2 bg-sky-50 px-4 py-2.5 rounded-xl border border-sky-200">
          <span class="text-xs text-slate-600 uppercase tracking-wider font-semibold">{{ t('Ticket No:', 'Số phiếu:') }}</span>
          <span class="font-mono text-base font-bold text-sky-700">{{ docNo || t('Loading...', 'Đang tải...') }}</span>
        </div>
      </div>

      <!-- Field Group 1: Select Linked CPST Feedback -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div>
          <label class="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
            {{ t('Select CPST technical feedback code for handover acceptance', 'Chọn mã phản hồi kỹ thuật CPST cần nghiệm thu') }} <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.cpstDocNo"
            @change="onCpstSelected"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-mono font-semibold cursor-pointer text-slate-800"
            required
          >
            <option value="" disabled>-- {{ t('Select resolved CPST ticket', 'Chọn mã phiếu CPST đã xử lý') }} --</option>
            <option v-for="c in availableCpsts" :key="c.docNo" :value="c.docNo">
              {{ c.docNo }} — ({{ c.recvBy }}) [{{ c.chkStatus }}]
            </option>
            <option v-if="customCpstMode" :value="form.cpstDocNo">{{ form.cpstDocNo }} ({{ t('From URL link', 'Từ liên kết URL') }})</option>
          </select>
        </div>

        <!-- Readonly Auto-filled Info from CPST -->
        <div v-if="selectedCpst" class="readonly-box p-4 rounded-xl space-y-3 text-xs">
          <div class="font-semibold text-slate-600 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
            {{ t('Auto-loaded details from feedback', 'Thông tin tự động nạp từ phản hồi') }} {{ selectedCpst.docNo }} (Read-only)
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span class="text-slate-500 block">{{ t('Technician In-charge:', 'Technician tiếp nhận:') }}</span>
              <span class="font-medium text-slate-900">{{ selectedCpst.recvBy }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">{{ t('Original CPSR Request Code:', 'Mã yêu cầu CPSR gốc:') }}</span>
              <span class="font-mono font-medium text-sky-600">{{ selectedCpst.cpsrDocNo }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">{{ t('Technical Status:', 'Trạng thái kỹ thuật:') }}</span>
              <span class="font-bold text-emerald-600">{{ selectedCpst.chkStatus }}</span>
            </div>
          </div>
          <div v-if="selectedCpst.actionTaken">
            <span class="text-slate-500 block">{{ t('Action Taken:', 'Hành động khắc phục:') }}</span>
            <p class="text-slate-800 mt-0.5 bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">{{ selectedCpst.actionTaken }}</p>
          </div>
        </div>
      </div>

      <!-- Field Group 2: Print Quality (3 BIG BUTTONS) -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          {{ t('Print Quality Evaluation', 'Đánh giá chất lượng in') }} <span class="text-rose-500">*</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            @click="form.chkQuality = 'Đạt'"
            class="btn-toggle flex items-center justify-center gap-2"
            :class="{ 'active-success': form.chkQuality === 'Đạt' }"
          >
            <span class="text-base">🟢</span>
            <span>{{ t('PASS / ĐẠT', 'ĐẠT') }}</span>
          </button>
          <button
            type="button"
            @click="form.chkQuality = 'Chạy tạm, tiếp tục theo dõi'"
            class="btn-toggle flex items-center justify-center gap-2 text-center"
            :class="{ 'active-warning': form.chkQuality === 'Chạy tạm, tiếp tục theo dõi' }"
          >
            <span class="text-base">🟡</span>
            <span>{{ t('CONDITIONAL RUN / MONITOR', 'CHẠY TẠM, THEO DÕI') }}</span>
          </button>
          <button
            type="button"
            @click="form.chkQuality = 'Chưa đạt'"
            class="btn-toggle flex items-center justify-center gap-2"
            :class="{ 'active-danger': form.chkQuality === 'Chưa đạt' }"
          >
            <span class="text-base">🔴</span>
            <span>{{ t('FAIL / CHƯA ĐẠT', 'CHƯA ĐẠT') }}</span>
          </button>
        </div>
      </div>

      <!-- Field Group 3: Work Order, Quantities & Unit -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {{ t('Work Order (WO)', 'Work Order (Lệnh SX)') }}
          </label>
          <input
            type="text"
            v-model="form.workOrder"
            :placeholder="t('e.g. WO-102934...', 'Ví dụ: WO-102934...')"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium font-mono"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {{ t('Total Quantity', 'Tổng số lượng') }}
          </label>
          <input
            type="number"
            v-model.number="form.woTotalQty"
            placeholder="0"
            min="0"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium font-mono"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex justify-between">
            <span>{{ t('Scrap / Waste Qty', 'Phế phát sinh') }}</span>
            <span class="text-amber-600 font-mono font-bold">{{ calculatedWastePercent }}</span>
          </label>
          <input
            type="number"
            v-model.number="form.wasteQty"
            placeholder="0"
            min="0"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium font-mono"
          />
        </div>
      </div>

      <!-- Field Group 4: Unit (3 BIG BUTTONS) -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          {{ t('Unit of Measure', 'Đơn vị tính') }} <span class="text-rose-500">*</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            @click="form.wasteUnit = 'PCS'"
            class="btn-toggle"
            :class="{ 'active-primary': form.wasteUnit === 'PCS' }"
          >
            PCS
          </button>
          <button
            type="button"
            @click="form.wasteUnit = 'Mét'"
            class="btn-toggle"
            :class="{ 'active-primary': form.wasteUnit === 'Mét' }"
          >
            {{ t('Meters', 'Mét') }}
          </button>
          <button
            type="button"
            @click="form.wasteUnit = 'Tờ in'"
            class="btn-toggle"
            :class="{ 'active-primary': form.wasteUnit === 'Tờ in' }"
          >
            {{ t('Sheets', 'Tờ in') }}
          </button>
        </div>
      </div>

      <!-- Field Group: Notes / Remarks -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {{ t('Notes / Remarks', 'Ghi chú / Ghi nhận') }}
        </label>
        <textarea
          v-model="form.notes"
          rows="3"
          :placeholder="t('Enter notes, conditional monitoring conditions, or remarks...', 'Nhập ghi chú, điều kiện theo dõi chạy tạm hoặc lưu ý...')"
          class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
        ></textarea>
      </div>

      <!-- Field Group 5: Production Manager Signature / Droplist (3-line search) -->
      <div class="relative">
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {{ t('Production Representative Signature', 'Đại diện sản xuất ký nhận') }} <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <input
            type="text"
            v-model="mgrSearch"
            @focus="showMgrDropdown = true"
            :placeholder="t('Enter name or employee code of production representative...', 'Nhập tên hoặc mã đại diện sản xuất...')"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium pr-10"
          />
          <button
            v-if="mgrSearch"
            type="button"
            @click="clearMgrSelection"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>

        <!-- 3-line Manager Dropdown -->
        <div
          v-if="showMgrDropdown && filteredManagers.length > 0"
          class="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100"
        >
          <div
            v-for="emp in filteredManagers"
            :key="emp.id || emp.mnv"
            @click="selectManager(emp)"
            class="p-3 hover:bg-slate-50 cursor-pointer transition flex flex-col gap-0.5"
          >
            <div class="text-sm font-bold text-slate-900">{{ emp.name }}</div>
            <div class="text-xs font-mono font-semibold text-sky-600">{{ t('Emp Code:', 'Mã NV:') }} {{ emp.mnv }}</div>
            <div class="text-xs text-slate-500">{{ emp.dept || 'Sản xuất' }} • {{ emp.role || 'Quản lý SX' }}</div>
          </div>
        </div>

        <div v-if="form.prodMgr" class="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
          <span>✓ {{ t('Production Rep:', 'Đại diện SX ký nhận:') }}</span>
          <span class="text-slate-800 font-semibold">{{ form.prodMgr }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="button"
          @click="submitForm"
          :disabled="isSubmitting"
          class="btn-submit w-full"
        >
          <span v-if="!isSubmitting">{{ t('SUBMIT HANDOVER ACCEPTANCE (CPSF)', 'SUBMIT XÁC NHẬN BÀN GIAO (CPSF)') }}</span>
          <span v-else>{{ t('Saving handover acceptance...', 'Đang lưu xác nhận bàn giao...') }}</span>
        </button>
      </div>

    </main>

  </div>

  <script>
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
      setup() {
        const currentLang = ref(localStorage.getItem('checkpoint_lang') || 'en');
        const setLanguage = (lang) => {
          currentLang.value = lang;
          localStorage.setItem('checkpoint_lang', lang);
          document.documentElement.setAttribute('lang', lang);
        };
        const t = (en, vi) => currentLang.value === 'vi' ? vi : en;

        const docNo = ref('');
        const isSubmitting = ref(false);
        const showConfirmModal = ref(false);
        const successModal = ref(false);
        const submittedDocNo = ref('');
        const errorMessage = ref('');

        const availableCpsts = ref([]);
        const selectedCpst = ref(null);
        const customCpstMode = ref(false);

        const employees = ref([]);
        const mgrSearch = ref('');
        const showMgrDropdown = ref(false);

        const form = ref({
          cpstDocNo: '',
          chkQuality: 'Đạt',
          workOrder: '',
          woTotalQty: null,
          wasteQty: null,
          wasteUnit: 'PCS',
          notes: '',
          prodMgr: ''
        });

        // Next Code for CPSF
        async function fetchNextCode() {
          try {
            const res = await fetch('/api/cpsf/next-code');
            if (res.ok) {
              const data = await res.json();
              if (data && data.docNo) docNo.value = data.docNo;
            }
          } catch (e) {
            const d = new Date();
            const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
            docNo.value = 'CPSF-' + ymd + '-001';
          }
        }

        // Available CPSTs
        async function loadAvailableCpsts() {
          try {
            const res = await fetch('/api/cpst/available-for-cpsf');
            if (res.ok) {
              availableCpsts.value = await res.json();
            }
          } catch (e) {
            console.warn('Could not load available CPST list:', e);
          }

          // Check URL query param ?cpst=...
          const urlParams = new URLSearchParams(window.location.search);
          const cpstParam = urlParams.get('cpst');
          if (cpstParam) {
            form.value.cpstDocNo = cpstParam;
            customCpstMode.value = true;
            await loadCpstDetail(cpstParam);
          }
        }

        async function onCpstSelected() {
          if (!form.value.cpstDocNo) {
            selectedCpst.value = null;
            return;
          }
          await loadCpstDetail(form.value.cpstDocNo);
        }

        async function loadCpstDetail(code) {
          const found = availableCpsts.value.find(c => c.docNo === code);
          if (found) {
            selectedCpst.value = found;
            return;
          }
          try {
            const res = await fetch('/api/cpst/' + encodeURIComponent(code));
            if (res.ok) {
              selectedCpst.value = await res.json();
            }
          } catch (e) {
            console.warn('Could not load CPST detail:', e);
          }
        }

        // Waste percentage calculation
        const calculatedWastePercent = computed(() => {
          const total = Number(form.value.woTotalQty);
          const waste = Number(form.value.wasteQty);
          if (!total || total <= 0 || isNaN(waste) || waste < 0) return '0.00%';
          const pct = (waste / total) * 100;
          return pct.toFixed(2) + '%';
        });

        // Load Employees
        async function loadEmployees() {
          try {
            const res = await fetch('/api/public/employees');
            if (res.ok) {
              employees.value = await res.json();
            }
          } catch (e) {
            console.warn('Could not load employees:', e);
          }
        }

        const filteredManagers = computed(() => {
          const q = (mgrSearch.value || '').trim().toLowerCase();
          if (!q) return employees.value.slice(0, 20);
          return employees.value.filter(emp => {
            const name = (emp.name || '').toLowerCase();
            const mnv = (emp.mnv || '').toLowerCase();
            const dept = (emp.dept || '').toLowerCase();
            return name.includes(q) || mnv.includes(q) || dept.includes(q);
          }).slice(0, 25);
        });

        function selectManager(emp) {
          form.value.prodMgr = emp.name + ' - ' + emp.mnv;
          mgrSearch.value = emp.name + ' (' + emp.mnv + ')';
          showMgrDropdown.value = false;
        }

        function clearMgrSelection() {
          mgrSearch.value = '';
          form.value.prodMgr = '';
          showMgrDropdown.value = true;
        }

        // Validate and open confirm modal
        function submitForm() {
          errorMessage.value = '';
          if (!form.value.cpstDocNo) {
            errorMessage.value = t('Please select CPST feedback code for acceptance.', 'Vui lòng chọn mã phản hồi CPST cần nghiệm thu.');
            return;
          }
          if (!form.value.chkQuality) {
            errorMessage.value = t('Please evaluate print quality.', 'Vui lòng đánh giá chất lượng in.');
            return;
          }
          if (!form.value.prodMgr) {
            errorMessage.value = t('Please select production representative signature.', 'Vui lòng chọn đại diện sản xuất ký nhận.');
            return;
          }

          showConfirmModal.value = true;
        }

        // Confirmed -> Call API to save CPSF
        async function confirmSubmit() {
          showConfirmModal.value = false;
          isSubmitting.value = true;
          const payload = {
            docNo: docNo.value || undefined,
            cpstDocNo: form.value.cpstDocNo,
            cpsrDocNo: selectedCpst.value?.cpsrDocNo || undefined,
            chkQuality: form.value.chkQuality,
            workOrder: form.value.workOrder ? form.value.workOrder.trim() : '',
            woTotalQty: form.value.woTotalQty != null && form.value.woTotalQty !== '' ? Number(form.value.woTotalQty) : undefined,
            wasteQty: form.value.wasteQty != null && form.value.wasteQty !== '' ? Number(form.value.wasteQty) : 0,
            wasteUnit: form.value.wasteUnit,
            wastePercent: calculatedWastePercent.value,
            notes: form.value.notes ? form.value.notes.trim() : '',
            prodMgr: form.value.prodMgr,
            submittedAt: new Date().toISOString()
          };

          try {
            const res = await fetch('/api/cpsf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || ('Lỗi máy chủ (' + res.status + ')'));
            }

            const result = await res.json();
            submittedDocNo.value = result.docNo || docNo.value;
            successModal.value = true;
          } catch (err) {
            errorMessage.value = (currentLang.value === 'vi' ? 'Gửi xác nhận thất bại: ' : 'Failed to submit handover: ') + err.message;
          } finally {
            isSubmitting.value = false;
          }
        }

        function resetForm() {
          form.value.workOrder = '';
          form.value.woTotalQty = null;
          form.value.wasteQty = null;
          form.value.notes = '';
          selectedCpst.value = null;
          form.value.cpstDocNo = '';
          successModal.value = false;
          fetchNextCode();
          loadAvailableCpsts();
        }

        window.addEventListener('click', (e) => {
          if (!e.target.closest('.relative')) {
            showMgrDropdown.value = false;
          }
        });

        onMounted(() => {
          fetchNextCode();
          loadAvailableCpsts();
          loadEmployees();
        });

        return {
          currentLang,
          setLanguage,
          t,
          docNo,
          form,
          isSubmitting,
          showConfirmModal,
          successModal,
          submittedDocNo,
          errorMessage,
          availableCpsts,
          selectedCpst,
          customCpstMode,
          calculatedWastePercent,
          employees,
          mgrSearch,
          showMgrDropdown,
          filteredManagers,
          selectManager,
          clearMgrSelection,
          onCpstSelected,
          submitForm,
          confirmSubmit,
          resetForm
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;