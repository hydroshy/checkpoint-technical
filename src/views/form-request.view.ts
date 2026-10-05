export const FORM_REQUEST_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>CPSR - Phiếu Yêu Cầu Kỹ Thuật | Checkpoint Systems</title>
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
      background-color: #0f172a;
      color: #f8fafc;
    }
    [v-cloak] { display: none !important; }
    .font-brand { font-family: 'Host Grotesk', sans-serif; }
    .font-mono { font-family: 'Azeret Mono', monospace; }

    .card-panel {
      background: #1e293b;
      border: 1px solid #334155;
    }
    .input-field {
      background-color: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
    }
    .input-field:focus {
      border-color: #38bdf8;
      outline: none;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
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
      border: 2px solid #334155;
      background: #0f172a;
      color: #94a3b8;
      user-select: none;
    }
    .btn-toggle:hover {
      border-color: #64748b;
      color: #f1f5f9;
    }
    .btn-toggle.active-primary {
      background-color: #0284c7 !important;
      border-color: #38bdf8 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
    }
    .btn-toggle.active-danger {
      background-color: #dc2626 !important;
      border-color: #f87171 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
    }
    .btn-toggle.active-warning {
      background-color: #d97706 !important;
      border-color: #fbbf24 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4);
    }
    .btn-toggle.active-slate {
      background-color: #475569 !important;
      border-color: #94a3b8 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(71, 85, 105, 0.4);
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
      box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4);
    }
    .btn-submit:hover:not(:disabled) {
      background: #0369a1;
      transform: translateY(-1px);
    }
    .btn-submit:active:not(:disabled) {
      transform: translateY(1px);
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
    <header class="card-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="/images/logo-full.png" alt="Checkpoint" class="h-8 object-contain" onerror="this.style.display='none'">
        <div>
          <div class="font-brand font-bold text-lg tracking-wide text-white">CHECKPOINT SYSTEMS</div>
          <div class="text-xs text-sky-400 font-semibold tracking-wider uppercase">CPSR • Phiếu Yêu Cầu Kỹ Thuật</div>
        </div>
      </div>
      <nav class="flex flex-wrap items-center gap-2">
        <a href="/form-request" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white shadow-sm border border-sky-400">1. Yêu Cầu (CPSR)</a>
        <a href="/technical-feedback" class="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">2. Phản Hồi (CPST)</a>
        <a href="/confirm-request" class="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">3. Bàn Giao (CPSF)</a>
        <a href="/control-panel" class="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-amber-200 transition">Control Panel</a>
      </nav>
    </header>

    <!-- Success Modal Notification -->
    <div v-if="successModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div class="card-panel rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 border-2 border-emerald-500 shadow-2xl">
        <div class="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold">✓</div>
        <div>
          <h2 class="font-brand font-bold text-2xl text-white">Gửi Yêu Cầu Thành Công!</h2>
          <p class="text-sm text-slate-300 mt-1">Phiếu CPSR đã được lưu vào hệ thống.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 text-left space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-400">Số phiếu:</span>
            <span class="font-mono text-base font-bold text-sky-400">{{ submittedDocNo }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-400">Thời gian ghi nhận:</span>
            <span class="text-xs text-slate-200">{{ submittedTime }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-400">Người yêu cầu:</span>
            <span class="text-xs text-slate-200 font-medium">{{ form.reqBy }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-400">Thiết bị:</span>
            <span class="text-xs text-slate-200 font-medium">{{ form.printTech }} - {{ form.machineName }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-3 pt-2">
          <a :href="'/technical-feedback?cpsr=' + submittedDocNo" class="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition text-center shadow-lg">
            Tiếp Tục: Chuyển Sang Phản Hồi KT (CPST) →
          </a>
          <button @click="resetForm" class="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white transition">
            + Tạo Phiếu Yêu Cầu Mới
          </button>
          <a href="/control-panel" class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition text-center">
            Xem trên Control Panel
          </a>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center justify-between">
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="text-rose-400 hover:text-white font-bold ml-2">✕</button>
    </div>

    <!-- Main Form Card -->
    <main class="card-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">

      <!-- Form Title & Document Code Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700">
        <div>
          <h1 class="font-brand font-bold text-2xl text-white">PHIẾU YÊU CẦU KỸ THUẬT (CPSR)</h1>
          <p class="text-xs text-slate-400 mt-1">Dành cho bộ phận sản xuất yêu cầu hỗ trợ kỹ thuật</p>
        </div>
        <div class="flex items-center gap-2 bg-slate-900 px-4 py-2.5 rounded-xl border border-sky-500/30">
          <span class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Số phiếu:</span>
          <span class="font-mono text-base font-bold text-sky-400">{{ docNo || 'Đang tải...' }}</span>
        </div>
      </div>

      <!-- Field Group 1: Date & Time -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Ngày hiện tại <span class="text-rose-400">*</span>
          </label>
          <input
            type="date"
            v-model="form.reqDate"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Giờ yêu cầu <span class="text-rose-400">*</span>
          </label>
          <input
            type="time"
            v-model="form.reqTime"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
            required
          />
        </div>
      </div>

      <!-- Field Group 2: Requester 3-line Searchable Droplist -->
      <div class="relative">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Người yêu cầu (Tìm kiếm theo tên / mã NV) <span class="text-rose-400">*</span>
        </label>
        
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            v-model="empSearch"
            @focus="showEmpDropdown = true"
            placeholder="Nhập tên hoặc mã nhân viên (VNxxxx)..."
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium pr-10"
          />
          <button
            v-if="empSearch"
            type="button"
            @click="clearEmpSelection"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        <!-- 3-Line Droplist Dropdown -->
        <div
          v-if="showEmpDropdown && filteredEmployees.length > 0"
          class="absolute z-30 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800"
        >
          <div
            v-for="emp in filteredEmployees"
            :key="emp.id || emp.mnv"
            @click="selectEmployee(emp)"
            class="p-3 hover:bg-slate-800 cursor-pointer transition flex flex-col gap-0.5"
          >
            <!-- Line 1: Name -->
            <div class="text-sm font-bold text-white">{{ emp.name }}</div>
            <!-- Line 2: MNV -->
            <div class="text-xs font-mono font-semibold text-sky-400">Mã NV: {{ emp.mnv }}</div>
            <!-- Line 3: Department & Role -->
            <div class="text-xs text-slate-400">{{ emp.dept || 'Sản xuất' }} • {{ emp.role || emp.area || 'Nhân viên' }}</div>
          </div>
        </div>

        <!-- Selected Feedback Badge -->
        <div v-if="form.reqBy" class="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
          <span>✓ Đã chọn:</span>
          <span class="text-white font-semibold">{{ form.reqBy }}</span>
        </div>
      </div>

      <!-- Field Group 3: Printing Tech & Machine -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Công nghệ in <span class="text-rose-400">*</span>
          </label>
          <select
            v-model="form.printTech"
            @change="onTechChange"
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer"
            required
          >
            <option value="" disabled>-- Chọn công nghệ in --</option>
            <option v-for="tech in techOptions" :key="tech" :value="tech">{{ tech }}</option>
            <option value="OTHER">Khác (Nhập ngoài)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Tên máy in <span class="text-rose-400">*</span>
          </label>
          <div v-if="!customMachineMode">
            <select
              v-model="form.machineName"
              class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer"
              required
            >
              <option value="" disabled>-- Chọn tên máy --</option>
              <option v-for="m in currentMachineList" :key="m" :value="m">{{ m }}</option>
              <option value="__custom__">+ Nhập tên máy khác...</option>
            </select>
          </div>
          <div v-else class="flex gap-2">
            <input
              type="text"
              v-model="form.machineName"
              placeholder="Nhập tên máy..."
              class="input-field flex-1 px-4 py-3 rounded-xl text-sm font-medium"
              required
            />
            <button
              type="button"
              @click="customMachineMode = false"
              class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-xl"
            >
              Chọn lại
            </button>
          </div>
        </div>
      </div>

      <!-- Field Group 4: Problem Description -->
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Mô tả sự cố <span class="text-rose-400">*</span>
        </label>
        <textarea
          v-model="form.problem"
          rows="4"
          placeholder="Mô tả cụ thể hiện tượng lỗi, chi tiết sự cố cần kỹ thuật xử lý..."
          class="input-field w-full p-4 rounded-xl text-sm font-medium resize-y"
          required
        ></textarea>
      </div>

      <!-- Field Group 5: Problem Status (2 BIG BUTTONS) -->
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Trạng thái sự cố <span class="text-rose-400">*</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            @click="form.machineStatus = 'Hàng SX lần đầu'"
            class="btn-toggle"
            :class="{ 'active-primary': form.machineStatus === 'Hàng SX lần đầu' }"
          >
            Hàng SX lần đầu
          </button>
          <button
            type="button"
            @click="form.machineStatus = 'Hàng SX nhiều lần'"
            class="btn-toggle"
            :class="{ 'active-primary': form.machineStatus === 'Hàng SX nhiều lần' }"
          >
            Hàng SX nhiều lần
          </button>
        </div>
      </div>

      <!-- Field Group 6: Priority Level (3 BIG BUTTONS) -->
      <div>
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Mức độ ưu tiên <span class="text-rose-400">*</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            @click="form.priority = 'Hỗ trợ ngay'"
            class="btn-toggle"
            :class="{ 'active-danger': form.priority === 'Hỗ trợ ngay' }"
          >
            Hỗ trợ ngay
          </button>
          <button
            type="button"
            @click="form.priority = 'Chạy tạm'"
            class="btn-toggle"
            :class="{ 'active-warning': form.priority === 'Chạy tạm' }"
          >
            Chạy tạm
          </button>
          <button
            type="button"
            @click="form.priority = 'Khác'"
            class="btn-toggle"
            :class="{ 'active-slate': form.priority === 'Khác' }"
          >
            Khác
          </button>
        </div>

        <!-- Priority Other Note Input -->
        <div v-if="form.priority === 'Khác'" class="mt-3">
          <input
            type="text"
            v-model="form.priorityOther"
            placeholder="Ghi chú rõ mức độ ưu tiên hoặc lý do..."
            class="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
          />
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
          <span v-if="!isSubmitting">GỬI YÊU CẦU KỸ THUẬT (CPSR)</span>
          <span v-else>Đang gửi yêu cầu...</span>
        </button>
      </div>
    </main>

  </div>

  <script>
    const { createApp, ref, computed, onMounted, watch } = Vue;

    createApp({
      setup() {
        const docNo = ref('');
        const isSubmitting = ref(false);
        const successModal = ref(false);
        const submittedDocNo = ref('');
        const submittedTime = ref('');
        const errorMessage = ref('');

        const employees = ref([]);
        const empSearch = ref('');
        const showEmpDropdown = ref(false);

        const techOptions = ref(['OFFSET', 'FLEXO', 'DIGITAL', 'THERMAL', 'PACKAGING', 'SCREEN']);
        const machineCatalog = ref({});
        const customMachineMode = ref(false);

        const todayStr = new Date().toISOString().slice(0, 10);
        const nowTimeStr = new Date().toTimeString().slice(0, 5);

        const form = ref({
          reqDate: todayStr,
          reqTime: nowTimeStr,
          reqBy: '',
          printTech: '',
          machineName: '',
          problem: '',
          machineStatus: 'Hàng SX lần đầu',
          priority: 'Hỗ trợ ngay',
          priorityOther: ''
        });

        // Fetch Next Code
        async function fetchNextCode() {
          try {
            const res = await fetch('/api/cpsr/next-code');
            if (res.ok) {
              const data = await res.json();
              if (data && data.docNo) docNo.value = data.docNo;
            }
          } catch (e) {
            console.warn('Fallback next code local generation');
            const d = new Date();
            const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
            docNo.value = 'CPSR-' + ymd + '-001';
          }
        }

        // Fetch Catalogs (Machines & Employees)
        async function loadCatalogs() {
          try {
            const res = await fetch('/api/public/catalogs');
            if (res.ok) {
              const data = await res.json();
              if (data.employees && data.employees.length) {
                employees.value = data.employees;
              }
              if (data.groupedMachines) {
                machineCatalog.value = data.groupedMachines;
                techOptions.value = Object.keys(data.groupedMachines);
              }
            }
          } catch (e) {
            console.warn('Could not load public catalogs:', e);
          }
        }

        // Filter employees for 3-line droplist
        const filteredEmployees = computed(() => {
          const q = (empSearch.value || '').trim().toLowerCase();
          if (!q) return employees.value.slice(0, 20);
          return employees.value.filter(emp => {
            const name = (emp.name || '').toLowerCase();
            const mnv = (emp.mnv || '').toLowerCase();
            const dept = (emp.dept || '').toLowerCase();
            return name.includes(q) || mnv.includes(q) || dept.includes(q);
          }).slice(0, 25);
        });

        function selectEmployee(emp) {
          form.value.reqBy = emp.name + ' - ' + emp.mnv;
          empSearch.value = emp.name + ' (' + emp.mnv + ')';
          showEmpDropdown.value = false;
        }

        function clearEmpSelection() {
          empSearch.value = '';
          form.value.reqBy = '';
          showEmpDropdown.value = true;
        }

        // Machines dropdown
        const currentMachineList = computed(() => {
          if (!form.value.printTech) return [];
          const list = machineCatalog.value[form.value.printTech] || [];
          return list.map(m => typeof m === 'string' ? m : (m.name || m.code));
        });

        function onTechChange() {
          form.value.machineName = '';
          customMachineMode.value = false;
        }

        watch(() => form.value.machineName, (val) => {
          if (val === '__custom__') {
            customMachineMode.value = true;
            form.value.machineName = '';
          }
        });

        // Submit CPSR Form
        async function submitForm() {
          errorMessage.value = '';
          if (!form.value.reqDate || !form.value.reqTime) {
            errorMessage.value = 'Vui lòng chọn ngày và giờ yêu cầu.';
            return;
          }
          if (!form.value.reqBy) {
            errorMessage.value = 'Vui lòng chọn người yêu cầu từ danh sách.';
            return;
          }
          if (!form.value.printTech) {
            errorMessage.value = 'Vui lòng chọn công nghệ in.';
            return;
          }
          if (!form.value.machineName) {
            errorMessage.value = 'Vui lòng chọn hoặc nhập tên máy in.';
            return;
          }
          if (!form.value.problem || !form.value.problem.trim()) {
            errorMessage.value = 'Vui lòng nhập mô tả sự cố.';
            return;
          }

          isSubmitting.value = true;
          const payload = {
            docNo: docNo.value || undefined,
            reqDate: form.value.reqDate,
            reqTime: form.value.reqTime,
            reqBy: form.value.reqBy,
            printTech: form.value.printTech,
            machineName: form.value.machineName,
            problem: form.value.problem.trim(),
            machineStatus: form.value.machineStatus,
            priority: form.value.priority,
            priorityOther: form.value.priority === 'Khác' ? form.value.priorityOther : undefined,
            submittedAt: new Date().toISOString()
          };

          try {
            const res = await fetch('/api/cpsr', {
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
            submittedTime.value = new Date().toLocaleString('vi-VN');
            successModal.value = true;
          } catch (err) {
            errorMessage.value = 'Gửi phiếu thất bại: ' + err.message;
          } finally {
            isSubmitting.value = false;
          }
        }

        function resetForm() {
          form.value.problem = '';
          form.value.priorityOther = '';
          successModal.value = false;
          fetchNextCode();
        }

        // Close dropdown on outside click
        window.addEventListener('click', (e) => {
          if (!e.target.closest('.relative')) {
            showEmpDropdown.value = false;
          }
        });

        onMounted(() => {
          fetchNextCode();
          loadCatalogs();
        });

        return {
          docNo,
          form,
          isSubmitting,
          successModal,
          submittedDocNo,
          submittedTime,
          errorMessage,
          employees,
          empSearch,
          showEmpDropdown,
          filteredEmployees,
          selectEmployee,
          clearEmpSelection,
          techOptions,
          currentMachineList,
          customMachineMode,
          onTechChange,
          submitForm,
          resetForm
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;
