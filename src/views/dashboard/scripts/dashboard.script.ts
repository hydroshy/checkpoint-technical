export const DASHBOARD_SCRIPT = `    const { createApp, ref, computed, onMounted, nextTick } = Vue;

    createApp({
      setup() {
        const activeTab = ref('');
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({});
        try {
          const cachedUser = localStorage.getItem('checkpoint_user');
          if (cachedUser) currentUser.value = JSON.parse(cachedUser);
        } catch(e) {}

        const getAuthHeaders = (extra = {}) => {
          const headers = { ...extra };
          const token = localStorage.getItem('checkpoint_token');
          if (token) headers['Authorization'] = 'Bearer ' + token;
          return headers;
        };
        const savingServer = ref(false);
        const exportingPDF = ref(false);
        const customMachineMode = ref(false);
        const catalogSubTab = ref('requesters');
        const loadingWeekly = ref(false);

        // Weekly Technical Dashboard Entities
        const weeklyRequests = ref([]);
        const defectLogs = ref([]);
        const actionPlans = ref([]);
        const requestersList = ref([]);
        const rawMachinesList = ref([]);
        const lookupOptions = ref([]);

        // Filter states
        const reqFilter = ref({ search: '', severity: 'ALL', status: 'ALL', equipment: 'ALL' });
        const defectFilter = ref({ search: '', facility: 'ALL', rootCause: 'ALL' });
        const actionFilter = ref({ search: '', status: 'ALL', pic: 'ALL' });
        const requesterFilter = ref({ search: '', department: 'ALL' });
        const machineFilter = ref({ search: '', tech: 'ALL' });

        // Modal states
        const modalState = ref({ type: null, isEdit: false, item: {} });
        const showTimeModal = ref(false);
        const showPersonModal = ref(false);
        const showExcelModal = ref(false);
        const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
        const pickerHour = ref('08');
        const pickerMinute = ref('00');

        // Printable V4 Form State
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

        // Catalogs & History for V4 Form
        const machineCatalog = ref({});
        const employeeDatalist = ref([]);
        const historyItems = ref([]);
        const historyTotal = ref(0);
        const historyLoading = ref(false);
        const historyFilter = ref({ search: '', chkStatus: 'ALL', printTech: 'ALL' });
        let searchTimeout = null;

        // Modals state for V4
        const activeTimeTarget = ref(null);
        const activeTimeLabel = ref('Chọn Giờ');
        const activePersonTarget = ref(null);
        const pickerDept = ref('');
        const pickerArea = ref('');
        const pickerSelectedName = ref('');
        const excelStatus = ref({ show: false, isError: false, msg: '' });

        // Chart instances
        let chartSeverity = null;
        let chartStatus = null;
        let chartRootCause = null;
        let chartFixType = null;

        // Computed Properties
        const userInitials = computed(() => {
          const name = currentUser.value.fullName || currentUser.value.username || 'U';
          const parts = name.trim().split(' ');
          if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          }
          return name.substring(0, 2).toUpperCase();
        });

        const isAdmin = computed(() => {
          const u = currentUser.value;
          if (!u) return false;
          return u.username === 'admin' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN';
        });

        const canAccessControlPanel = computed(() => {
          const u = currentUser.value;
          if (!u || !u.username) return false;
          if (u.username === 'admin' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') return true;
          let perms = u.permissions;
          if (typeof perms === 'string') {
            try { perms = JSON.parse(perms); } catch(e) {}
          }
          if (perms && (perms.canAccessControlPanel || perms.isAdmin)) return true;
          return false;
        });

        const isAdminOrTech = canAccessControlPanel;

        const canCreateRequest = computed(() => {
          const u = currentUser.value;
          if (!u || !u.username) return true;
          if (u.username === 'admin' || u.role === 'ADMIN') return true;
          if (u.permissions && u.permissions.canCreateRequest !== undefined) {
            return Boolean(u.permissions.canCreateRequest);
          }
          return true;
        });

        const canViewKpi = computed(() => {
          const u = currentUser.value;
          if (!u || !u.username) return true;
          if (u.username === 'admin' || u.role === 'ADMIN') return true;
          if (u.permissions && u.permissions.canViewKpi !== undefined) {
            return Boolean(u.permissions.canViewKpi);
          }
          if (u.role === 'TECHNICIAN') return true;
          if (u.role === 'EMPLOYEE') return false;
          return false;
        });

        const isRequestActive = computed(() => {
          return activeTab.value === 'v4-form' || activeTab.value === 'v4-history';
        });

        const isKpiActive = computed(() => {
          return activeTab.value === 'weekly-kpi' ||
                 activeTab.value === 'weekly-requests' ||
                 activeTab.value === 'defect-logs' ||
                 activeTab.value === 'action-plans' ||
                 activeTab.value === 'catalog';
        });

        const selectMenuCard = (type) => {
          if (type === 'request') {
            if (!canCreateRequest.value) {
              showToast('Tài khoản của bạn không có quyền Tạo phiếu yêu cầu', true);
              return;
            }
            activeTab.value = 'v4-form';
          } else if (type === 'kpi') {
            if (!canViewKpi.value) {
              showToast('Tài khoản của bạn không có quyền Xem Dashboard KPI', true);
              return;
            }
            activeTab.value = 'weekly-kpi';
            if (!weeklyRequests.value.length) {
              loadAllWeeklyData();
            }
          }
        };

        // KPI Computations
        const kpiTotalRequests = computed(() => weeklyRequests.value.length);
        const kpiSlaMetCount = computed(() => weeklyRequests.value.filter(r => (r.metSla || 'Yes').toLowerCase().includes('yes')).length);
        const kpiSlaMetRate = computed(() => kpiTotalRequests.value ? Math.round((kpiSlaMetCount.value / kpiTotalRequests.value) * 100) : 100);
        const kpiOpenRequests = computed(() => weeklyRequests.value.filter(r => (r.status || '').toLowerCase() === 'open').length);
        const kpiInProgressRequests = computed(() => weeklyRequests.value.filter(r => (r.status || '').toLowerCase().includes('progress')).length);
        const kpiOverdueRequests = computed(() => weeklyRequests.value.filter(r => (r.status || '').toLowerCase() === 'overdue').length);
        const kpiClosedRequests = computed(() => weeklyRequests.value.filter(r => {
          const s = (r.status || '').toLowerCase();
          return s === 'closed' || s === 'completed' || s === 'done';
        }).length);
        const kpiTotalDefects = computed(() => defectLogs.value.length);
        const kpiDefect8DCount = computed(() => defectLogs.value.filter(d => (d.eightDRequired || '').toLowerCase().includes('yes')).length);
        const kpiDefectRecurringCount = computed(() => defectLogs.value.filter(d => (d.recurringIssue || '').toLowerCase().includes('yes')).length);
        const kpiTotalActions = computed(() => actionPlans.value.length);
        const kpiCompletedActions = computed(() => actionPlans.value.filter(a => (a.status || '').toLowerCase().includes('completed')).length);
        const kpiInProgressActions = computed(() => actionPlans.value.filter(a => (a.status || '').toLowerCase().includes('progress')).length);
        const kpiTotalMachines = computed(() => rawMachinesList.value.length);
        const kpiTotalRequesters = computed(() => requestersList.value.length);

        // Filtered Lists
        const filteredWeeklyRequests = computed(() => {
          let list = weeklyRequests.value;
          if (reqFilter.value.search) {
            const s = reqFilter.value.search.toLowerCase();
            list = list.filter(r => 
              (r.requestId || '').toLowerCase().includes(s) ||
              (r.itemEquipment || '').toLowerCase().includes(s) ||
              (r.reportedBy || '').toLowerCase().includes(s) ||
              (r.resolvedBy || '').toLowerCase().includes(s)
            );
          }
          if (reqFilter.value.severity !== 'ALL') {
            list = list.filter(r => (r.severity || '').toLowerCase() === reqFilter.value.severity.toLowerCase());
          }
          if (reqFilter.value.status !== 'ALL') {
            list = list.filter(r => (r.status || '').toLowerCase() === reqFilter.value.status.toLowerCase());
          }
          if (reqFilter.value.equipment !== 'ALL') {
            list = list.filter(r => r.itemEquipment === reqFilter.value.equipment);
          }
          return list;
        });

        const uniqueReqEquipments = computed(() => {
          return [...new Set(weeklyRequests.value.map(r => r.itemEquipment).filter(Boolean))].sort();
        });

        const filteredDefectLogs = computed(() => {
          let list = defectLogs.value;
          if (defectFilter.value.search) {
            const s = defectFilter.value.search.toLowerCase();
            list = list.filter(d => 
              (d.specificIssue || '').toLowerCase().includes(s) ||
              (d.affectedProduct || '').toLowerCase().includes(s) ||
              (d.facility || '').toLowerCase().includes(s)
            );
          }
          if (defectFilter.value.facility !== 'ALL') {
            list = list.filter(d => (d.facility || '').trim().toLowerCase() === defectFilter.value.facility.trim().toLowerCase());
          }
          if (defectFilter.value.rootCause !== 'ALL') {
            list = list.filter(d => (d.rootCauseCategory || '').trim().toLowerCase() === defectFilter.value.rootCause.trim().toLowerCase());
          }
          return list;
        });

        const filteredActionPlans = computed(() => {
          let list = actionPlans.value;
          if (actionFilter.value.search) {
            const s = actionFilter.value.search.toLowerCase();
            list = list.filter(a => 
              (a.actionId || '').toLowerCase().includes(s) ||
              (a.description || '').toLowerCase().includes(s) ||
              (a.pic || '').toLowerCase().includes(s)
            );
          }
          if (actionFilter.value.status !== 'ALL') {
            list = list.filter(a => (a.status || '').trim().toLowerCase() === actionFilter.value.status.trim().toLowerCase());
          }
          if (actionFilter.value.pic !== 'ALL') {
            list = list.filter(a => (a.pic || '').trim().toLowerCase() === actionFilter.value.pic.trim().toLowerCase());
          }
          return list;
        });

        const filteredRequesters = computed(() => {
          let list = requestersList.value;
          if (requesterFilter.value.search) {
            const s = requesterFilter.value.search.toLowerCase();
            list = list.filter(r => 
              (r.mnv || '').toLowerCase().includes(s) ||
              (r.fullName || '').toLowerCase().includes(s) ||
              (r.position || '').toLowerCase().includes(s)
            );
          }
          if (requesterFilter.value.department !== 'ALL') {
            list = list.filter(r => r.department === requesterFilter.value.department);
          }
          return list;
        });

        const uniqueDepartments = computed(() => {
          return [...new Set(requestersList.value.map(r => r.department).filter(Boolean))].sort();
        });

        const filteredMachines = computed(() => {
          let list = rawMachinesList.value;
          if (machineFilter.value.search) {
            const s = machineFilter.value.search.toLowerCase();
            list = list.filter(m => 
              (m.name || '').toLowerCase().includes(s) ||
              (m.tech || '').toLowerCase().includes(s)
            );
          }
          if (machineFilter.value.tech !== 'ALL') {
            list = list.filter(m => m.tech === machineFilter.value.tech);
          }
          return list;
        });

        const uniqueMachineTechs = computed(() => {
          return [...new Set(rawMachinesList.value.map(m => m.tech).filter(Boolean))].sort();
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
          return employeeDatalist.value.filter(e => {
            const matchDept = !pickerDept.value || e.dept === pickerDept.value;
            const matchArea = !pickerArea.value || e.area === pickerArea.value;
            return matchDept && matchArea;
          });
        });

        // Helpers
        const getSeverityClass = (sev) => {
          const s = (sev || '').toLowerCase();
          if (s === 'critical') return 'badge-critical';
          if (s === 'high') return 'badge-high';
          if (s === 'medium') return 'badge-medium';
          return 'badge-low';
        };

        const getStatusClass = (st) => {
          const s = (st || '').toLowerCase().trim();
          if (s === 'open') return 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30';
          if (s === 'in progress') return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
          if (s === 'overdue') return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30';
          if (s === 'closed' || s === 'completed' || s === 'done') return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
          return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30';
        };

        const showToast = (msg, isError = false) => {
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold transition-all transform duration-300 flex items-center gap-2 ' +
            (isError ? 'bg-red-600 text-white shadow-red-500/30' : 'bg-slate-900 text-white dark:bg-sky-500 shadow-sky-500/30');
          toast.innerHTML = (isError ? '<i class="fa-solid fa-circle-exclamation"></i> ' : '<i class="fa-solid fa-circle-check"></i> ') + msg;
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
          }, 3000);
        };

        // Navigation
        const switchTab = (tab) => {
          if ((tab === 'v4-form' || tab === 'v4-history') && !canCreateRequest.value) {
            showToast('Tài khoản của bạn không có quyền Tạo phiếu yêu cầu', true);
            return;
          }
          if ((tab === 'weekly-kpi' || tab === 'weekly-requests' || tab === 'defect-logs' || tab === 'action-plans' || tab === 'catalog') && !canViewKpi.value) {
            showToast('Tài khoản của bạn không có quyền Xem Dashboard KPI', true);
            return;
          }
          activeTab.value = tab;
          showTimeModal.value = false;
          showPersonModal.value = false;
          showExcelModal.value = false;
          modalState.value = { type: null, isEdit: false, item: {} };
          if (tab === 'weekly-kpi') {
            nextTick(() => renderCharts());
          }
          if (tab === 'v4-history') {
            loadHistory();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Data Loading
        const loadAllWeeklyData = async () => {
          loadingWeekly.value = true;
          try {
            await Promise.all([
              loadWeeklyRequests(),
              loadDefectLogs(),
              loadActionPlans(),
              loadRequesters(),
              loadMachinesList(),
              loadLookupOptions()
            ]);
            nextTick(() => renderCharts());
            showToast('Đã đồng bộ số liệu thành công');
          } catch(e) {
            console.error('Error loading data:', e);
            showToast('Lỗi khi tải số liệu', true);
          } finally {
            loadingWeekly.value = false;
          }
        };

        const loadWeeklyRequests = async () => {
          const res = await fetch('/api/weekly-requests', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) weeklyRequests.value = await res.json();
        };

        const loadDefectLogs = async () => {
          const res = await fetch('/api/defect-logs', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) defectLogs.value = await res.json();
        };

        const loadActionPlans = async () => {
          const res = await fetch('/api/action-plans', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) actionPlans.value = await res.json();
        };

        const loadRequesters = async () => {
          const res = await fetch('/api/requesters', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) requestersList.value = await res.json();
        };

        const loadMachinesList = async () => {
          const res = await fetch('/api/machines', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) rawMachinesList.value = await res.json();
        };

        const loadLookupOptions = async () => {
          const res = await fetch('/api/lookup-options', { headers: getAuthHeaders(), credentials: 'include' });
          if (res.ok) lookupOptions.value = await res.json();
        };

        // Charts
        const renderCharts = () => {
          if (activeTab.value !== 'weekly-kpi') return;

          // 1. Severity Chart
          const sevCanvas = document.getElementById('chart-severity');
          if (sevCanvas) {
            if (chartSeverity) chartSeverity.destroy();
            const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
            weeklyRequests.value.forEach(r => {
              const k = r.severity || 'Medium';
              if (counts[k] !== undefined) counts[k]++;
            });
            chartSeverity = new Chart(sevCanvas, {
              type: 'doughnut',
              data: {
                labels: ['Critical', 'High', 'Medium', 'Low'],
                datasets: [{
                  data: [counts.Critical, counts.High, counts.Medium, counts.Low],
                  backgroundColor: ['#ef4444', '#f97316', '#0ea5e9', '#94a3b8'],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }
            });
          }

          // 2. Status Chart
          const statusCanvas = document.getElementById('chart-status');
          if (statusCanvas) {
            if (chartStatus) chartStatus.destroy();
            const stCounts = { Open: 0, 'In Progress': 0, Overdue: 0, Closed: 0 };
            weeklyRequests.value.forEach(r => {
              const s = (r.status || 'Open').trim().toLowerCase();
              if (s === 'open') stCounts.Open++;
              else if (s === 'in progress') stCounts['In Progress']++;
              else if (s === 'overdue') stCounts.Overdue++;
              else if (s === 'closed' || s === 'completed' || s === 'done') stCounts.Closed++;
              else stCounts.Open++;
            });
            chartStatus = new Chart(statusCanvas, {
              type: 'bar',
              data: {
                labels: ['Open', 'In Progress', 'Overdue', 'Closed'],
                datasets: [{
                  label: 'Số phiếu',
                  data: [stCounts.Open, stCounts['In Progress'], stCounts.Overdue, stCounts.Closed],
                  backgroundColor: ['#0ea5e9', '#f59e0b', '#f43f5e', '#10b981'],
                  borderRadius: 8
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
              }
            });
          }

          // 3. Root Cause Chart
          const rcCanvas = document.getElementById('chart-rootcause');
          if (rcCanvas) {
            if (chartRootCause) chartRootCause.destroy();
            const rcCounts = {};
            defectLogs.value.forEach(d => {
              const k = (d.rootCauseCategory || 'Khác').trim();
              rcCounts[k] = (rcCounts[k] || 0) + 1;
            });
            chartRootCause = new Chart(rcCanvas, {
              type: 'pie',
              data: {
                labels: Object.keys(rcCounts),
                datasets: [{
                  data: Object.values(rcCounts),
                  backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#94a3b8'],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }
            });
          }

          // 4. Fix Type Chart
          const fixCanvas = document.getElementById('chart-fixtype');
          if (fixCanvas) {
            if (chartFixType) chartFixType.destroy();
            const fixCounts = {};
            actionPlans.value.forEach(a => {
              const k = (a.fixType || 'Khác').trim();
              fixCounts[k] = (fixCounts[k] || 0) + 1;
            });
            chartFixType = new Chart(fixCanvas, {
              type: 'bar',
              data: {
                labels: Object.keys(fixCounts),
                datasets: [{
                  label: 'Kế hoạch',
                  data: Object.values(fixCounts),
                  backgroundColor: '#3b82f6',
                  borderRadius: 6
                }]
              },
              options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
              }
            });
          }
        };

        // Modals Management
        const closeCurrentModal = () => {
          modalState.value = { type: null, isEdit: false, item: {} };
        };

        const openWeeklyRequestModal = (item = null) => {
          modalState.value = {
            type: 'weekly-request',
            isEdit: !!item,
            item: item ? { ...item } : {
              requestId: requestersList.value[0] ? (requestersList.value[0].mnv + ' - ' + requestersList.value[0].fullName) : '',
              requestDate: new Date().toISOString().split('T')[0],
              requestType: 'Machine Running ',
              itemEquipment: rawMachinesList.value[0] ? rawMachinesList.value[0].name : 'PFL1',
              severity: 'High',
              status: 'Open',
              slaTargetHours: 1,
              actualHours: 0.5,
              metSla: 'Yes',
              reportedBy: currentUser.value.fullName || 'Steve',
              resolvedBy: ''
            }
          };
        };

        const saveWeeklyRequestForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/weekly-requests/' + item.id) : '/api/weekly-requests';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast(isEdit ? 'Đã cập nhật phiếu thành công' : 'Đã tạo phiếu mới thành công');
              closeCurrentModal();
              await loadWeeklyRequests();
              renderCharts();
            } else {
              showToast('Lỗi lưu phiếu kỹ thuật', true);
            }
          } catch(e) {
            showToast('Lỗi hệ thống', true);
          }
        };

        const deleteWeeklyRequest = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa phiếu yêu cầu này không?')) return;
          try {
            const res = await fetch('/api/weekly-requests/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa phiếu kỹ thuật');
              await loadWeeklyRequests();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Defect Log CRUD
        const openDefectModal = (item = null) => {
          modalState.value = {
            type: 'defect-log',
            isEdit: !!item,
            item: item ? { ...item } : {
              defectId: defectLogs.value.length ? Math.max(...defectLogs.value.map(d => Number(d.defectId) || 0)) + 1 : 1,
              defectDate: new Date().toLocaleDateString('vi-VN'),
              facility: 'RFID ',
              source: 'Internal',
              rootCauseCategory: 'Machine',
              specificIssue: '',
              affectedProduct: '',
              downtimeMinutes: '0',
              recurringIssue: 'No',
              eightDRequired: 'No'
            }
          };
        };

        const saveDefectLogForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/defect-logs/' + item.id) : '/api/defect-logs';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast(isEdit ? 'Đã cập nhật sự cố' : 'Đã ghi nhận sự cố mới');
              closeCurrentModal();
              await loadDefectLogs();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi lưu sự cố', true);
          }
        };

        const deleteDefectLog = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa sự cố Defect này không?')) return;
          try {
            const res = await fetch('/api/defect-logs/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa sự cố Defect');
              await loadDefectLogs();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Action Plan CRUD
        const openActionPlanModal = (item = null) => {
          modalState.value = {
            type: 'action-plan',
            isEdit: !!item,
            item: item ? { ...item } : {
              actionId: 'ACT-' + (actionPlans.value.length + 1),
              dateLogged: new Date().toLocaleDateString('vi-VN'),
              facility: 'RFID',
              relatedDefectId: '7',
              fixType: 'Long-term preventive',
              description: '',
              pic: currentUser.value.fullName || 'Steve',
              deadline: new Date().toLocaleDateString('vi-VN'),
              status: 'In Progress',
              resourceNeeded: 'Spare Parts',
              remarks: ''
            }
          };
        };

        const saveActionPlanForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/action-plans/' + item.id) : '/api/action-plans';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast(isEdit ? 'Đã cập nhật kế hoạch' : 'Đã thêm kế hoạch mới');
              closeCurrentModal();
              await loadActionPlans();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi lưu kế hoạch', true);
          }
        };

        const deleteActionPlan = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa kế hoạch này không?')) return;
          try {
            const res = await fetch('/api/action-plans/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa kế hoạch');
              await loadActionPlans();
              renderCharts();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Requester CRUD
        const openRequesterModal = (item = null) => {
          modalState.value = {
            type: 'requester',
            isEdit: !!item,
            item: item ? { ...item } : {
              stt: requestersList.value.length + 1,
              mnv: '',
              fullName: '',
              department: 'Production',
              area: 'Production',
              position: 'Operator'
            }
          };
        };

        const saveRequesterForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/requesters/' + item.id) : '/api/requesters';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã lưu thông tin người yêu cầu');
              closeCurrentModal();
              await loadRequesters();
            }
          } catch(e) {
            showToast('Lỗi khi lưu người yêu cầu', true);
          }
        };

        const deleteRequester = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa người yêu cầu này?')) return;
          try {
            const res = await fetch('/api/requesters/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa người yêu cầu');
              await loadRequesters();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Machine CRUD
        const openMachineModal = (item = null) => {
          modalState.value = {
            type: 'machine',
            isEdit: !!item,
            item: item ? { ...item } : {
              stt: rawMachinesList.value.length + 1,
              tech: 'PFL',
              name: ''
            }
          };
        };

        const saveMachineForm = async () => {
          const item = modalState.value.item;
          const isEdit = modalState.value.isEdit;
          const url = isEdit ? ('/api/machines/' + item.id) : '/api/machines';
          const method = isEdit ? 'PUT' : 'POST';

          try {
            const res = await fetch(url, {
              method,
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(item),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã lưu thông tin máy');
              closeCurrentModal();
              await loadMachinesList();
              await loadMachinesCatalog();
            }
          } catch(e) {
            showToast('Lỗi khi lưu máy', true);
          }
        };

        const deleteMachine = async (id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa máy này khỏi danh mục?')) return;
          try {
            const res = await fetch('/api/machines/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa máy');
              await loadMachinesList();
              await loadMachinesCatalog();
            }
          } catch(e) {
            showToast('Lỗi khi xóa', true);
          }
        };

        // Excel Exporting
        const exportWeeklyRequestsExcel = () => {
          try {
            const exportData = weeklyRequests.value.map(r => ({
              'Request_ID': r.requestId,
              'Date': r.requestDate,
              'Request_Type': r.requestType,
              'Item_Equipment': r.itemEquipment,
              'Severity': r.severity,
              'Status': r.status,
              'SLA_Target_Hours': r.slaTargetHours,
              'Actual_Hours': r.actualHours,
              'Met_SLA': r.metSla,
              'Reported_By': r.reportedBy,
              'Resolved_By': r.resolvedBy
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '1_Technical_Requests');
            XLSX.writeFile(wb, '1_Technical_Requests_' + new Date().toISOString().split('T')[0] + '.xlsx');
            showToast('Đã xuất file 1_Technical_Requests.xlsx thành công');
          } catch(e) {
            showToast('Lỗi khi xuất file Excel', true);
          }
        };

        const exportDefectLogsExcel = () => {
          try {
            const exportData = defectLogs.value.map(d => ({
              'Defect_ID': d.defectId,
              'Date': d.defectDate,
              'Facility': d.facility,
              'Source': d.source,
              'Root_Cause_Category': d.rootCauseCategory,
              'Specific_Issue': d.specificIssue,
              'Affected_Product': d.affectedProduct,
              'Downtime_Minutes': d.downtimeMinutes,
              'Recurring_Issue': d.recurringIssue,
              '8D_Required': d.eightDRequired
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '2_Defect_Log');
            XLSX.writeFile(wb, '2_Defect_Log_' + new Date().toISOString().split('T')[0] + '.xlsx');
            showToast('Đã xuất file 2_Defect_Log.xlsx thành công');
          } catch(e) {
            showToast('Lỗi khi xuất file Excel', true);
          }
        };

        const exportActionPlansExcel = () => {
          try {
            const exportData = actionPlans.value.map(a => ({
              'Action_ID': a.actionId,
              'Date_Logged': a.dateLogged,
              'Facility': a.facility,
              'Related_Defect_ID': a.relatedDefectId,
              'Fix_Type': a.fixType,
              'Description': a.description,
              'PIC': a.pic,
              'Deadline': a.deadline,
              'Status': a.status,
              'Resource_Needed': a.resourceNeeded,
              'Remarks': a.remarks
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '3_Action_Plan');
            XLSX.writeFile(wb, '3_Action_Plan_' + new Date().toISOString().split('T')[0] + '.xlsx');
            showToast('Đã xuất file 3_Action_Plan.xlsx thành công');
          } catch(e) {
            showToast('Lỗi khi xuất file Excel', true);
          }
        };

        const exportRequestersExcel = () => {
          try {
            const exportData = requestersList.value.map(r => ({
              'STT': r.stt,
              'Bộ phận': r.department,
              'Khu Vực': r.area,
              'MNV': r.mnv,
              'TÊN': r.fullName,
              'Chức Vụ': r.position
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Requester');
            XLSX.writeFile(wb, 'Requester_List.xlsx');
            showToast('Đã xuất danh sách người yêu cầu');
          } catch(e) {
            showToast('Lỗi khi xuất Excel', true);
          }
        };

        const exportMachinesExcel = () => {
          try {
            const exportData = rawMachinesList.value.map(m => ({
              'STT': m.stt,
              'Khu vực': m.tech,
              'Tên máy': m.name
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Machine list');
            XLSX.writeFile(wb, 'Machine_List.xlsx');
            showToast('Đã xuất danh sách máy móc');
          } catch(e) {
            showToast('Lỗi khi xuất Excel', true);
          }
        };

        // Theme management
        const setTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
          userMenuOpen.value = false;
        };

        // V4.1 Printable Form Methods (Retained verbatim)
        const initForm = () => {
          const now = new Date();
          const dStr = now.toISOString().split('T')[0];
          const tStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          form.value.reqDate = dStr;
          form.value.reqTime = tStr;
          form.value.docNo = 'CPS-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + Math.floor(100 + Math.random() * 900);
        };

        const clearForm = () => {
          if (!confirm('Bạn có muốn làm mới toàn bộ biểu mẫu Phiếu Nhập Liệu?')) return;
          initForm();
          form.value.problem = '';
          form.value.rootCause = '';
          form.value.actionTaken = '';
          form.value.photosBefore = [];
          form.value.photosAfter = [];
          showToast('Đã làm mới biểu mẫu Phiếu Nhập Liệu');
        };

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

        const saveToServer = async () => {
          savingServer.value = true;
          try {
            const res = await fetch('/api/technical-requests', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(form.value),
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              showToast('Lưu phiếu ' + form.value.docNo + ' thành công!');
              await loadHistory();
            } else {
              showToast('Lỗi khi lưu Phiếu Nhập Liệu', true);
            }
          } catch(e) {
            showToast('Lỗi kết nối máy chủ', true);
          } finally {
            savingServer.value = false;
          }
        };

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

        const quickDownloadPDF = (item) => {
          form.value = { ...form.value, ...item };
          setTimeout(() => generatePDF(), 100);
        };

        const loadItemIntoForm = (item) => {
          form.value = { ...form.value, ...item };
          switchTab('v4-form');
          showToast('Đã nạp phiếu ' + item.docNo + ' vào biểu mẫu');
        };

        const loadHistory = async () => {
          historyLoading.value = true;
          try {
            let url = '/api/technical-requests?limit=50';
            if (historyFilter.value.search) url += '&search=' + encodeURIComponent(historyFilter.value.search);
            if (historyFilter.value.chkStatus && historyFilter.value.chkStatus !== 'ALL') url += '&chkStatus=' + historyFilter.value.chkStatus;
            if (historyFilter.value.printTech && historyFilter.value.printTech !== 'ALL') url += '&printTech=' + historyFilter.value.printTech;

            const res = await fetch(url, { headers: getAuthHeaders(), credentials: 'include' });
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

        const loadMachinesCatalog = async () => {
          try {
            const res = await fetch('/api/machines/grouped', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) machineCatalog.value = await res.json();
          } catch(e) {}
        };

        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) employeeDatalist.value = await res.json();
          } catch(e) {}
        };

        const loadSession = async () => {
          try {
            const res = await fetch('/auth/session', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              currentUser.value = await res.json();
              localStorage.setItem('checkpoint_user', JSON.stringify(currentUser.value));
              if (isKpiActive.value && !canViewKpi.value && canCreateRequest.value) {
                activeTab.value = 'v4-form';
              } else if (isRequestActive.value && !canCreateRequest.value && canViewKpi.value) {
                activeTab.value = 'weekly-kpi';
              }
            } else {
              window.location.replace('/login');
            }
          } catch (e) {}
        };

        const handleLogout = async () => {
          await fetch('/auth/logout', { method: 'POST', headers: getAuthHeaders(), credentials: 'include' });
          localStorage.removeItem('checkpoint_token');
          localStorage.removeItem('checkpoint_user');
          window.location.replace('/login?logout=1');
        };

        const handleGlobalClick = () => {
          userMenuOpen.value = false;
        };

        // Modal pickers for V4
        const setTimeToNow = () => {
          const now = new Date();
          pickerHour.value = String(now.getHours()).padStart(2, '0');
          pickerMinute.value = String(now.getMinutes()).padStart(2, '0');
        };

        const openTimePicker = (target, label) => {
          activeTimeTarget.value = target;
          if (!label) {
            if (target === 'reqTime') label = 'Chọn Giờ Yêu Cầu';
            else if (target === 'recvTime') label = 'Chọn Giờ Tiếp Nhận';
            else if (target === 'finishTime') label = 'Chọn Giờ Hoàn Thành';
            else label = 'Chọn Giờ';
          }
          activeTimeLabel.value = label;
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

        const closeTimeModal = () => {
          showTimeModal.value = false;
        };

        const confirmTime = () => {
          if (activeTimeTarget.value) {
            form.value[activeTimeTarget.value] = pickerHour.value + ':' + pickerMinute.value;
            calculateDowntime();
          }
          showTimeModal.value = false;
        };

        const openPersonPicker = (target) => {
          activePersonTarget.value = target;
          pickerDept.value = '';
          pickerArea.value = '';
          pickerSelectedName.value = '';
          showPersonModal.value = true;
        };

        const closePersonModal = () => {
          showPersonModal.value = false;
        };

        const confirmPerson = () => {
          if (activePersonTarget.value && pickerSelectedName.value && pickerSelectedName.value !== 'OTHER') {
            form.value[activePersonTarget.value] = pickerSelectedName.value;
          }
          showPersonModal.value = false;
        };

        const closeModal = (id) => {
          if (id === 'modal-time') showTimeModal.value = false;
          else if (id === 'modal-person') showPersonModal.value = false;
          else if (id === 'modal-excel') showExcelModal.value = false;
          else {
            const modal = document.getElementById(id);
            if (modal) modal.style.display = 'none';
          }
        };

        const onPickerDeptChange = () => { pickerArea.value = ''; pickerSelectedName.value = ''; };
        const onPickerAreaChange = () => { pickerSelectedName.value = ''; };
        const openExcelUploader = () => {
          excelStatus.value = { show: false, isError: false, msg: '' };
          showExcelModal.value = true;
        };

        const closeExcelModal = () => {
          showExcelModal.value = false;
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

                const res = await fetch('/api/employees/bulk-import', {
                  method: 'POST',
                  headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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

        const formatDisplayDate = (d) => {
          if (!d) return '—';
          const p = String(d).split('-');
          return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
        };

        const formatShortDate = (d) => {
          if (!d) return '';
          const p = String(d).split('-');
          return p.length === 3 ? p[2] + '/' + p[1] : d;
        };

        const toggleTheme = () => {
          setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        onMounted(() => {
          initForm();
          loadSession();
          if (isKpiActive.value && canViewKpi.value) {
            loadAllWeeklyData();
          }
          loadMachinesCatalog();
          loadEmployees();
          loadHistory();

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;

          // Support ?tab= parameter in URL
          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get('tab');
          if (tabParam) {
            switchTab(tabParam);
          }
        });

        return {
          activeTab,
          switchTab,
          selectMenuCard,
          isRequestActive,
          isKpiActive,
          canCreateRequest,
          canViewKpi,
          isAdmin,
          isAdminOrTech,
          canAccessControlPanel,
          userMenuOpen,
          currentTheme,
          currentUser,
          userInitials,
          loadingWeekly,
          weeklyRequests,
          defectLogs,
          actionPlans,
          requestersList,
          rawMachinesList,
          lookupOptions,
          reqFilter,
          defectFilter,
          actionFilter,
          requesterFilter,
          machineFilter,
          catalogSubTab,
          modalState,
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
          kpiTotalRequests,
          kpiSlaMetCount,
          kpiSlaMetRate,
          kpiOpenRequests,
          kpiInProgressRequests,
          kpiOverdueRequests,
          kpiClosedRequests,
          kpiTotalDefects,
          kpiDefect8DCount,
          kpiDefectRecurringCount,
          kpiTotalActions,
          kpiCompletedActions,
          kpiInProgressActions,
          kpiTotalMachines,
          kpiTotalRequesters,
          filteredWeeklyRequests,
          uniqueReqEquipments,
          filteredDefectLogs,
          filteredActionPlans,
          filteredRequesters,
          uniqueDepartments,
          filteredMachines,
          uniqueMachineTechs,
          getSeverityClass,
          getStatusClass,
          loadAllWeeklyData,
          closeCurrentModal,
          openWeeklyRequestModal,
          saveWeeklyRequestForm,
          deleteWeeklyRequest,
          openDefectModal,
          saveDefectLogForm,
          deleteDefectLog,
          openActionPlanModal,
          saveActionPlanForm,
          deleteActionPlan,
          openRequesterModal,
          saveRequesterForm,
          deleteRequester,
          openMachineModal,
          saveMachineForm,
          deleteMachine,
          exportWeeklyRequestsExcel,
          exportDefectLogsExcel,
          exportActionPlansExcel,
          exportRequestersExcel,
          exportMachinesExcel,
          setTheme,
          toggleTheme,
          clearForm,
          calculateDowntime,
          calculateWastePercent,
          handleTechChange,
          handleMachineSelectChange,
          triggerUpload,
          handleImageUpload,
          removePhoto,
          saveToServer,
          generatePDF,
          quickDownloadPDF,
          loadItemIntoForm,
          loadHistory,
          debouncedSearchHistory,
          handleLogout,
          handleGlobalClick,
          openTimePicker,
          closeTimeModal,
          confirmTime,
          openPersonPicker,
          closePersonModal,
          confirmPerson,
          closeModal,
          onPickerDeptChange,
          onPickerAreaChange,
          openExcelUploader,
          closeExcelModal,
          processExcelFile,
          showTimeModal,
          showPersonModal,
          showExcelModal,
          hourOptions,
          minuteOptions,
          pickerHour,
          pickerMinute,
          setTimeToNow,
          triggerBackup,
          triggerRestore,
          processRestoreFile,
          formatDisplayDate,
          formatShortDate
        };
      }
    }).mount('#app');`;
