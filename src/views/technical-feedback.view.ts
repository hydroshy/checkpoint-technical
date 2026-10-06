export const TECHNICAL_FEEDBACK_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>CPST - Phản Hồi Kỹ Thuật | Checkpoint Systems</title>
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
      background-color: #f8fafc;
      color: #0f172a;
    }
    [v-cloak] { display: none !important; }
    .font-brand { font-family: 'Host Grotesk', sans-serif; }
    .font-mono { font-family: 'Azeret Mono', monospace; }

    .card-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
    }
    .input-field {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .input-field:focus {
      border-color: #0284c7;
      outline: none;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .readonly-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #334155;
    }

    /* Big Toggle Buttons */
    .btn-toggle {
      min-height: 52px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      padding: 12px 18px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: 2px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      user-select: none;
    }
    .btn-toggle:hover {
      border-color: #94a3b8;
      color: #0f172a;
      background: #f8fafc;
    }
    .btn-toggle.active-success {
      background-color: #059669 !important;
      border-color: #059669 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
    }
    .btn-toggle.active-warning {
      background-color: #d97706 !important;
      border-color: #d97706 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
    }
    .btn-toggle.active-danger {
      background-color: #dc2626 !important;
      border-color: #dc2626 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
    }

    /* Drag and Drop Box */
    .upload-zone {
      border: 2px dashed #cbd5e1;
      background-color: #f8fafc;
      border-radius: 14px;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .upload-zone:hover, .upload-zone.dragover {
      border-color: #0284c7;
      background-color: #f0f9ff;
    }

    /* Big Submit Button */
    .btn-submit {
      min-height: 56px;
      font-size: 17px;
      font-weight: 700;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      background: #0284c7;
      color: #ffffff;
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
    <header class="card-panel rounded-2xl p-4 flex items-center shadow-sm">
      <div class="flex items-center">
        <img src="/images/logo-full.png" alt="Checkpoint Systems" class="h-8 sm:h-9 object-contain" />
      </div>
    </header>

    <!-- Confirm Submit Modal Notification -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="card-panel rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 border border-slate-200 shadow-2xl">
        <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl font-bold">?</div>
        <div>
          <h2 class="font-brand font-bold text-xl text-slate-900">Xác Nhận Gửi Phản Hồi</h2>
          <p class="text-sm text-slate-600 mt-2 font-medium">Bạn có muốn gửi hay không?</p>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            @click="showConfirmModal = false"
            class="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
          >
            Hủy / Cancel
          </button>
          <button
            type="button"
            @click="confirmSubmit"
            :disabled="isSubmitting"
            class="w-full py-3 px-4 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white transition shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal Notification -->
    <div v-if="successModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="card-panel rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 border-2 border-emerald-500 shadow-2xl">
        <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold">✓</div>
        <div>
          <h2 class="font-brand font-bold text-2xl text-slate-900">Lưu Phản Hồi Thành Công!</h2>
          <p class="text-sm text-slate-600 mt-1">Phiếu CPST đã được ghi nhận vào hệ thống.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">Số phiếu phản hồi:</span>
            <span class="font-mono text-base font-bold text-sky-600">{{ submittedDocNo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">Liên kết yêu cầu:</span>
            <span class="font-mono text-xs font-semibold text-emerald-600">{{ form.cpsrDocNo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">Người tiếp nhận KT:</span>
            <span class="text-xs text-slate-700 font-medium">{{ form.recvBy }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500">Trạng thái:</span>
            <span class="text-xs font-bold" :class="form.chkStatus === 'Đã khắc phục' ? 'text-emerald-600' : (form.chkStatus === 'Hư hỏng nặng' ? 'text-rose-600' : 'text-amber-600')">{{ form.chkStatus }}</span>
          </div>
        </div>
        <div class="pt-2">
          <button
            type="button"
            @click="resetForm"
            class="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition text-center shadow-md"
          >
            Hoàn thành
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
          <h1 class="font-brand font-bold text-2xl text-slate-900">PHIẾU PHẢN HỒI KỸ THUẬT (CPST)</h1>
          <p class="text-xs text-slate-500 mt-1">Dành cho Technician tiếp nhận, xử lý và phản hồi sự cố</p>
        </div>
        <div class="flex items-center gap-2 bg-sky-50 px-4 py-2.5 rounded-xl border border-sky-200">
          <span class="text-xs text-slate-600 uppercase tracking-wider font-semibold">Số phiếu:</span>
          <span class="font-mono text-base font-bold text-sky-700">{{ docNo || 'Đang tải...' }}</span>
        </div>
      </div>

      <!-- Field Group 1: Select Linked CPSR Request -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div>
          <label class="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
            Chọn mã phiếu yêu cầu CPSR cần liên kết <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.cpsrDocNo"
            @change="onCpsrSelected"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-mono font-semibold cursor-pointer text-slate-800"
            required
          >
            <option value="" disabled>-- Chọn mã phiếu CPSR đang chờ phản hồi --</option>
            <option v-for="c in availableCpsrs" :key="c.docNo" :value="c.docNo">
              {{ c.docNo }} — {{ c.machineName }} ({{ c.reqBy }})
            </option>
            <option v-if="customCpsrMode" :value="form.cpsrDocNo">{{ form.cpsrDocNo }} (Từ liên kết URL)</option>
          </select>
        </div>

        <!-- Readonly Auto-filled Info from CPSR -->
        <div v-if="selectedCpsr" class="readonly-box p-4 rounded-xl space-y-3 text-xs">
          <div class="font-semibold text-slate-600 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
            Thông tin tự động nạp từ phiếu yêu cầu {{ selectedCpsr.docNo }} (Read-only)
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span class="text-slate-500 block">Người yêu cầu:</span>
              <span class="font-medium text-slate-900">{{ selectedCpsr.reqBy }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Thiết bị / Máy in:</span>
              <span class="font-medium text-slate-900">{{ selectedCpsr.printTech }} - {{ selectedCpsr.machineName }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Thời gian yêu cầu:</span>
              <span class="font-medium text-slate-900">{{ selectedCpsr.reqDate }} {{ selectedCpsr.reqTime }}</span>
            </div>
          </div>
          <div>
            <span class="text-slate-500 block">Mô tả sự cố:</span>
            <p class="text-slate-800 mt-0.5 bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">{{ selectedCpsr.problem }}</p>
          </div>
        </div>
      </div>

      <!-- Field Group 2: Technician Droplist (3-line search) -->
      <div class="relative">
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Technician tiếp nhận <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <input
            type="text"
            v-model="recvSearch"
            @focus="showRecvDropdown = true"
            placeholder="Nhập tên hoặc mã Technician tiếp nhận..."
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium pr-10"
          />
          <button
            v-if="recvSearch"
            type="button"
            @click="clearRecvSelection"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>

        <!-- 3-line Technician Dropdown -->
        <div
          v-if="showRecvDropdown && filteredTechnicians.length > 0"
          class="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100"
        >
          <div
            v-for="emp in filteredTechnicians"
            :key="emp.id || emp.mnv"
            @click="selectTechnician(emp)"
            class="p-3 hover:bg-slate-50 cursor-pointer transition flex flex-col gap-0.5"
          >
            <div class="text-sm font-bold text-slate-900">{{ emp.name }}</div>
            <div class="text-xs font-mono font-semibold text-sky-600">Mã NV: {{ emp.mnv }}</div>
            <div class="text-xs text-slate-500">{{ emp.dept || 'Kỹ thuật' }} • {{ emp.role || 'Kỹ thuật viên' }}</div>
          </div>
        </div>

        <div v-if="form.recvBy" class="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
          <span>✓ Technician tiếp nhận:</span>
          <span class="text-slate-800 font-semibold">{{ form.recvBy }}</span>
        </div>
      </div>

      <!-- Field Group 3: Root Cause & Action Taken -->
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Nguyên nhân gốc rễ (Root Cause) <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="form.rootCause"
            rows="3"
            placeholder="Phân tích nguyên nhân cốt lõi gây ra sự cố kỹ thuật..."
            class="input-field w-full p-4 rounded-xl text-sm font-medium resize-y"
            required
          ></textarea>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Hành động khắc phục (Action Taken) <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="form.actionTaken"
            rows="3"
            placeholder="Các bước kỹ thuật đã thực hiện để xử lý và phục hồi thiết bị..."
            class="input-field w-full p-4 rounded-xl text-sm font-medium resize-y"
            required
          ></textarea>
        </div>
      </div>

      <!-- Field Group 4: Two Columns for Photos (Trạng thái lỗi & Đã khắc phục) -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Hình ảnh xác minh (2 Cột: Trạng thái lỗi & Đã khắc phục)
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- Column 1: Photos Before (Trạng thái lỗi) -->
          <div class="card-panel rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose-600 uppercase tracking-wide">Cột 1: Trạng thái lỗi</span>
              <span class="text-[11px] text-slate-500 font-mono">{{ form.photosBefore.length }} ảnh</span>
            </div>
            
            <div
              class="upload-zone"
              @dragover.prevent="$event.currentTarget.classList.add('dragover')"
              @dragleave.prevent="$event.currentTarget.classList.remove('dragover')"
              @drop.prevent="handleDrop($event, 'photosBefore')"
              @click="$refs.fileBefore.click()"
            >
              <input type="file" ref="fileBefore" multiple accept="image/*" class="hidden" @change="handleFileSelect($event, 'photosBefore')" />
              <div class="text-2xl mb-1">📷</div>
              <div class="text-xs font-semibold text-slate-700">Kéo thả ảnh hoặc bấm để chọn</div>
              <div class="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP</div>
            </div>

            <!-- Preview thumbnails -->
            <div v-if="form.photosBefore.length > 0" class="grid grid-cols-3 gap-2 mt-2">
              <div v-for="(img, idx) in form.photosBefore" :key="idx" class="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                <img :src="img" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removePhoto('photosBefore', idx)"
                  class="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                >✕</button>
              </div>
            </div>
          </div>

          <!-- Column 2: Photos After (Đã khắc phục) -->
          <div class="card-panel rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-600 uppercase tracking-wide">Cột 2: Đã khắc phục</span>
              <span class="text-[11px] text-slate-500 font-mono">{{ form.photosAfter.length }} ảnh</span>
            </div>

            <div
              class="upload-zone"
              @dragover.prevent="$event.currentTarget.classList.add('dragover')"
              @dragleave.prevent="$event.currentTarget.classList.remove('dragover')"
              @drop.prevent="handleDrop($event, 'photosAfter')"
              @click="$refs.fileAfter.click()"
            >
              <input type="file" ref="fileAfter" multiple accept="image/*" class="hidden" @change="handleFileSelect($event, 'photosAfter')" />
              <div class="text-2xl mb-1">📷</div>
              <div class="text-xs font-semibold text-slate-700">Kéo thả ảnh hoặc bấm để chọn</div>
              <div class="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP</div>
            </div>

            <!-- Preview thumbnails -->
            <div v-if="form.photosAfter.length > 0" class="grid grid-cols-3 gap-2 mt-2">
              <div v-for="(img, idx) in form.photosAfter" :key="idx" class="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                <img :src="img" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removePhoto('photosAfter', idx)"
                  class="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                >✕</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Field Group 5: Status (3 BIG BUTTONS) -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Trạng thái xử lý sự cố <span class="text-rose-500">*</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            @click="form.chkStatus = 'Đã khắc phục'"
            class="btn-toggle"
            :class="{ 'active-success': form.chkStatus === 'Đã khắc phục' }"
          >
            Đã khắc phục
          </button>
          <button
            type="button"
            @click="form.chkStatus = 'Theo dõi thêm'"
            class="btn-toggle"
            :class="{ 'active-warning': form.chkStatus === 'Theo dõi thêm' }"
          >
            Theo dõi thêm
          </button>
          <button
            type="button"
            @click="form.chkStatus = 'Hư hỏng nặng'"
            class="btn-toggle"
            :class="{ 'active-danger': form.chkStatus === 'Hư hỏng nặng' }"
          >
            Hư hỏng nặng
          </button>
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
          <span v-if="!isSubmitting">SUBMIT PHẢN HỒI KỸ THUẬT (CPST)</span>
          <span v-else>Đang lưu phản hồi...</span>
        </button>
      </div>

    </main>

  </div>

  <script>
    const { createApp, ref, computed, onMounted } = Vue;

    createApp({
      setup() {
        const docNo = ref('');
        const isSubmitting = ref(false);
        const showConfirmModal = ref(false);
        const successModal = ref(false);
        const submittedDocNo = ref('');
        const errorMessage = ref('');

        const availableCpsrs = ref([]);
        const selectedCpsr = ref(null);
        const customCpsrMode = ref(false);

        const employees = ref([]);
        const recvSearch = ref('');
        const showRecvDropdown = ref(false);

        const form = ref({
          cpsrDocNo: '',
          recvBy: '',
          rootCause: '',
          actionTaken: '',
          photosBefore: [],
          photosAfter: [],
          chkStatus: 'Đã khắc phục'
        });

        // Fetch Next Code for CPST
        async function fetchNextCode() {
          try {
            const res = await fetch('/api/cpst/next-code');
            if (res.ok) {
              const data = await res.json();
              if (data && data.docNo) docNo.value = data.docNo;
            }
          } catch (e) {
            const d = new Date();
            const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
            docNo.value = 'CPST-' + ymd + '-001';
          }
        }

        // Fetch Available CPSRs
        async function loadAvailableCpsrs() {
          try {
            const res = await fetch('/api/cpsr/available-for-cpst');
            if (res.ok) {
              availableCpsrs.value = await res.json();
            }
          } catch (e) {
            console.warn('Could not load available CPSR list:', e);
          }

          // Check URL query param ?cpsr=...
          const urlParams = new URLSearchParams(window.location.search);
          const cpsrParam = urlParams.get('cpsr');
          if (cpsrParam) {
            form.value.cpsrDocNo = cpsrParam;
            customCpsrMode.value = true;
            await loadCpsrDetail(cpsrParam);
          }
        }

        async function onCpsrSelected() {
          if (!form.value.cpsrDocNo) {
            selectedCpsr.value = null;
            return;
          }
          await loadCpsrDetail(form.value.cpsrDocNo);
        }

        async function loadCpsrDetail(code) {
          // Find in cache first
          const found = availableCpsrs.value.find(c => c.docNo === code);
          if (found) {
            selectedCpsr.value = found;
            return;
          }
          // Fetch from API
          try {
            const res = await fetch('/api/cpsr/' + encodeURIComponent(code));
            if (res.ok) {
              selectedCpsr.value = await res.json();
            }
          } catch (e) {
            console.warn('Could not load CPSR detail:', e);
          }
        }

        // Load Employee Catalog
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

        const filteredTechnicians = computed(() => {
          const q = (recvSearch.value || '').trim().toLowerCase();
          if (!q) return employees.value.slice(0, 20);
          return employees.value.filter(emp => {
            const name = (emp.name || '').toLowerCase();
            const mnv = (emp.mnv || '').toLowerCase();
            const dept = (emp.dept || '').toLowerCase();
            return name.includes(q) || mnv.includes(q) || dept.includes(q);
          }).slice(0, 25);
        });

        function selectTechnician(emp) {
          form.value.recvBy = emp.name + ' - ' + emp.mnv;
          recvSearch.value = emp.name + ' (' + emp.mnv + ')';
          showRecvDropdown.value = false;
        }

        function clearRecvSelection() {
          recvSearch.value = '';
          form.value.recvBy = '';
          showRecvDropdown.value = true;
        }

        // Compress image using canvas before converting to base64
        function compressImage(file, maxWidth = 1280, maxHeight = 1280, quality = 0.75) {
          return new Promise((resolve) => {
            if (!file.type || !file.type.startsWith('image/')) {
              resolve(null);
              return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth || height > maxHeight) {
                  if (width / height > maxWidth / maxHeight) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                  } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                  }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
              };
              img.onerror = () => resolve(e.target.result);
              img.src = e.target.result;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          });
        }

        // Photo handlers (Drag & Drop, File input) with client-side canvas compression
        function handleFileSelect(e, targetField) {
          const files = e.target.files;
          if (files) processFiles(files, targetField);
          if (e.target) e.target.value = '';
        }

        function handleDrop(e, targetField) {
          e.currentTarget.classList.remove('dragover');
          const files = e.dataTransfer.files;
          if (files) processFiles(files, targetField);
        }

        async function processFiles(fileList, targetField) {
          const files = Array.from(fileList).filter(file => file.type && file.type.startsWith('image/'));
          for (const file of files) {
            if (form.value[targetField].length >= 6) break;
            try {
              const compressedBase64 = await compressImage(file, 1280, 1280, 0.75);
              if (compressedBase64 && form.value[targetField].length < 6) {
                form.value[targetField].push(compressedBase64);
              }
            } catch (err) {
              console.error('Image compression error:', err);
            }
          }
        }

        function removePhoto(targetField, index) {
          form.value[targetField].splice(index, 1);
        }

        // Validate and open confirm modal
        function submitForm() {
          errorMessage.value = '';
          if (!form.value.cpsrDocNo) {
            errorMessage.value = 'Vui lòng chọn mã phiếu CPSR cần liên kết.';
            return;
          }
          if (!form.value.recvBy) {
            errorMessage.value = 'Vui lòng chọn Technician tiếp nhận.';
            return;
          }
          if (!form.value.rootCause || !form.value.rootCause.trim()) {
            errorMessage.value = 'Vui lòng nhập nguyên nhân gốc rễ.';
            return;
          }
          if (!form.value.actionTaken || !form.value.actionTaken.trim()) {
            errorMessage.value = 'Vui lòng nhập hành động khắc phục.';
            return;
          }

          showConfirmModal.value = true;
        }

        // Confirmed -> Call API to save CPST
        async function confirmSubmit() {
          showConfirmModal.value = false;
          isSubmitting.value = true;
          const payload = {
            docNo: docNo.value || undefined,
            cpsrDocNo: form.value.cpsrDocNo,
            recvBy: form.value.recvBy,
            rootCause: form.value.rootCause.trim(),
            actionTaken: form.value.actionTaken.trim(),
            photosBefore: form.value.photosBefore,
            photosAfter: form.value.photosAfter,
            chkStatus: form.value.chkStatus,
            submittedAt: new Date().toISOString()
          };

          try {
            const res = await fetch('/api/cpst', {
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
            errorMessage.value = 'Gửi phản hồi thất bại: ' + err.message;
          } finally {
            isSubmitting.value = false;
          }
        }

        function resetForm() {
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          selectedCpsr.value = null;
          form.value.cpsrDocNo = '';
          successModal.value = false;
          fetchNextCode();
          loadAvailableCpsrs();
        }

        window.addEventListener('click', (e) => {
          if (!e.target.closest('.relative')) {
            showRecvDropdown.value = false;
          }
        });

        onMounted(() => {
          fetchNextCode();
          loadAvailableCpsrs();
          loadEmployees();
        });

        return {
          docNo,
          form,
          isSubmitting,
          showConfirmModal,
          successModal,
          submittedDocNo,
          errorMessage,
          availableCpsrs,
          selectedCpsr,
          customCpsrMode,
          employees,
          recvSearch,
          showRecvDropdown,
          filteredTechnicians,
          selectTechnician,
          clearRecvSelection,
          onCpsrSelected,
          handleFileSelect,
          handleDrop,
          removePhoto,
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
