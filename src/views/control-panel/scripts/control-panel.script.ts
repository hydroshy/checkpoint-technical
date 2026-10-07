export const CONTROL_PANEL_SCRIPT = `    if (typeof Vue === 'undefined') {
      var _vueErr = new Error('Vue 3 framework chưa được tải hoặc bị lỗi');
      if (window.__CP_REPORT_ERROR__) window.__CP_REPORT_ERROR__(_vueErr, 'Vue Bootstrap');
      throw _vueErr;
    }

    const { createApp, ref, computed, onMounted, nextTick, toRaw, markRaw } = Vue;

    const toPlainObject = (obj) => {
      if (!obj) return null;
      try {
        return JSON.parse(JSON.stringify(toRaw ? toRaw(obj) : obj));
      } catch (_) {
        return { ...obj };
      }
    };

    const app = createApp({
      setup() {
        if (window.__CP_DEBUG__) {
          window.__CP_DEBUG__.log('Vue', 'Initializing Control Panel Vue application setup');
        }
        const activeTab = ref('overview'); // const activeTab = ref('requests');
        const showTicketDetailModal = ref(false);
        const showAddMachineModal = ref(false);
        const showAddEmployeeModal = ref(false);
        const showAddUserModal = ref(false);
        const showExcelModal = ref(false);
        const sidebarOpen = ref(false);
        const sidebarCollapsed = ref(false);
        const userMenuOpen = ref(false);
        const currentTheme = ref('light');
        const currentUser = ref({
          username: 'admin',
          fullName: 'Quản trị viên',
          role: 'ADMIN',
          permissions: {
            canCreateRequest: true,
            canViewKpi: true,
            canAccessControlPanel: true
          }
        });
        try {
          const cachedUser = localStorage.getItem('checkpoint_user');
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            if (parsed && typeof parsed === 'object') {
              currentUser.value = { ...currentUser.value, ...parsed };
            }
          }
        } catch(e) {}

        const getAuthHeaders = (extra = {}) => {
          const headers = { ...extra };
          const token = localStorage.getItem('checkpoint_token');
          if (token) headers['Authorization'] = 'Bearer ' + token;
          return headers;
        };

        // Tabulator instances & Crash-proof helpers
        let reqTable = null;
        let machinesTable = null;
        let empTable = null;
        let usersTable = null;
        let existingDataTable = null;

        const isTabulatorReady = () => typeof Tabulator !== 'undefined';
        const safeRedraw = (tbl) => {
          try {
            if (tbl && typeof tbl.redraw === 'function') {
              tbl.redraw(true);
            }
          } catch (_) {}
        };
        const safeDestroy = (tbl) => {
          try {
            if (tbl && typeof tbl.destroy === 'function') {
              tbl.destroy();
            }
          } catch (_) {}
          return null;
        };

        // Overview stats
        const stats = ref({});

        // Public Form Sharing Configuration
        const isPublicFormEnabled = ref(false);
        const togglingPublicForm = ref(false);
        const copySuccess = ref(false);
        const publicFormUrl = computed(() => {
          if (typeof window !== 'undefined') {
            return window.location.origin + '/form-request';
          }
          return '/form-request';
        });

        const loadPublicFormStatus = async () => {
          try {
            const res = await fetch('/api/public/form-status');
            if (res.ok) {
              const data = await res.json();
              isPublicFormEnabled.value = !!(data.enabled ?? data.isPublicFormEnabled);
            }
          } catch (e) {
            console.error('Failed to load public form status:', e);
          }
        };

        const togglePublicForm = async () => {
          if (togglingPublicForm.value) return;
          togglingPublicForm.value = true;
          const targetState = !isPublicFormEnabled.value;
          try {
            const res = await fetch('/api/settings/public-form', {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({ isPublicFormEnabled: targetState, enabled: targetState }),
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              isPublicFormEnabled.value = !!(data.enabled ?? data.isPublicFormEnabled ?? targetState);
              showToast(isPublicFormEnabled.value ? 'Đã BẬT chia sẻ form công khai' : 'Đã TẮT chia sẻ form công khai');
            } else {
              showToast('Không thể cập nhật cấu hình form công khai', true);
            }
          } catch (e) {
            showToast('Lỗi kết nối máy chủ', true);
          } finally {
            togglingPublicForm.value = false;
          }
        };

        const copyPublicFormLink = async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(publicFormUrl.value);
            } else {
              const textarea = document.createElement('textarea');
              textarea.value = publicFormUrl.value;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
            }
            copySuccess.value = true;
            showToast('Đã sao chép liên kết form công khai vào clipboard!');
            setTimeout(() => { copySuccess.value = false; }, 2500);
          } catch (e) {
            showToast('Không thể tự động sao chép, vui lòng copy thủ công', true);
          }
        };

        // Split Forms (CPSR, CPST, CPSF, Chain)
        const splitTab = ref('chain');
        const chainList = ref([]);
        const cpsrList = ref([]);
        const cpstList = ref([]);
        const cpsfList = ref([]);
        const splitFilter = ref({ search: '', status: 'ALL' });
        const selectedChain = ref(null);
        const showChainModal = ref(false);
        const lightboxImage = ref(null);
        const openLightbox = (url) => { lightboxImage.value = url; };
        const closeLightbox = () => { lightboxImage.value = null; };
        let splitTable = null;

        // CPS & Assign Task State (Module Phân Công Kỹ Thuật)
        const cpsList = ref([]);
        const assignCardStatus = ref('ALL');
        const assignCardSearch = ref('');
        const showAssignModal = ref(false);
        const selectedCpsForAssign = ref(null);
        const assignForm = ref({ employee: '', deadline: '', notes: '' });
        const isAssigning = ref(false);

        // Edit Ticket Modal State (CPSR, CPST, CPSF, CPS)
        const showEditModal = ref(false);
        const isSavingEdit = ref(false);
        const editForm = ref({
          type: 'cps',
          docNo: '',
          cpsrDocNo: '',
          assignedTo: '',
          priority: 'Khác',
          status: 'TO_ASSIGN',
          deadline: '',
          notes: '',
          // CPSR fields
          reqBy: '',
          machineName: '',
          printTech: '',
          machineStatus: '',
          problem: '',
          // CPST fields
          recvBy: '',
          chkStatus: 'Đã khắc phục',
          downtime: 0,
          rootCause: '',
          actionTaken: '',
          // CPSF fields
          chkQuality: 'Đạt',
          workOrder: '',
          woTotalQty: 0,
          wasteQty: 0,
          wasteUnit: 'PCS',
          prodMgr: ''
        });

        // Link Ticket Modal State (Link CPS with CPST & CPSF)
        const showLinkModal = ref(false);
        const isLinking = ref(false);
        const linkForm = ref({
          cpsDocNo: '',
          cpsrDocNo: '',
          machineName: '',
          problem: '',
          currentCpst: '',
          currentCpsf: '',
          selectedCpst: '',
          selectedCpsf: ''
        });

        // Create CPS Modal State (Enforcing CPS requires CPSR)
        const showCreateCpsModal = ref(false);
        const isCreatingCps = ref(false);
        const createCpsForm = ref({
          cpsrDocNo: '',
          assignedTo: '',
          priority: 'Bình thường',
          deadline: '',
          notes: ''
        });

        const availableCpsrForCps = computed(() => {
          try {
            const usedCpsr = new Set();
            (chainList.value || []).forEach(c => {
              const doc = c.cpsrDocNo || c.cpsr?.docNo;
              if (doc) usedCpsr.add(doc);
            });
            const list = Array.isArray(cpsrList.value) ? cpsrList.value : (Array.isArray(cpsrList.value?.data) ? cpsrList.value.data : []);
            return list.filter(r => r && r.docNo && !usedCpsr.has(r.docNo));
          } catch (_) {
            return [];
          }
        });

        // Report Technical State & Computeds
        const reportDateFrom = ref('');
        const reportDateTo = ref('');
        const reportQuickPreset = ref('7d');
        const reportSearch = ref('');
        const reportStatusFilter = ref('ALL');
        let reportChartInstance = null;
        let report4MChartInstance = null;
        let reportTableInstance = null;

        const initReportDates = () => {
          const today = new Date();
          const pad = n => String(n).padStart(2, '0');
          reportDateTo.value = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

          const from = new Date();
          from.setDate(from.getDate() - 7);
          reportDateFrom.value = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '-' + pad(from.getDate());
          reportQuickPreset.value = '7d';
        };

        const setReportPreset = (preset) => {
          reportQuickPreset.value = preset;
          const today = new Date();
          const pad = n => String(n).padStart(2, '0');
          const todayStr = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
          reportDateTo.value = todayStr;

          if (preset === 'today') {
            reportDateFrom.value = todayStr;
          } else if (preset === '7d') {
            const from = new Date();
            from.setDate(from.getDate() - 7);
            reportDateFrom.value = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '-' + pad(from.getDate());
          } else if (preset === 'month') {
            const from = new Date(today.getFullYear(), today.getMonth(), 1);
            reportDateFrom.value = from.getFullYear() + '-' + pad(from.getMonth() + 1) + '-' + pad(from.getDate());
          } else if (preset === 'all') {
            reportDateFrom.value = '';
            reportDateTo.value = '';
          }
          onReportFilterChange();
        };

        const filteredReportCps = computed(() => {
          try {
            let list = Array.isArray(chainList.value) && chainList.value.length > 0
              ? chainList.value
              : (Array.isArray(cpsList.value) ? cpsList.value : []);

            if (reportDateFrom.value || reportDateTo.value) {
              list = list.filter(item => {
                if (!item) return false;
                const rawDate = item.reqDate || item.cpsr?.reqDate || item.createdAt || item.updatedAt;
                if (!rawDate) return true;
                let dStr = '';
                if (typeof rawDate === 'string') {
                  if (rawDate.includes('T')) {
                    dStr = rawDate.split('T')[0];
                  } else if (rawDate.includes('/')) {
                    const parts = rawDate.split('/');
                    if (parts.length === 3) {
                      if (parts[0].length === 4) dStr = parts[0] + '-' + parts[1].padStart(2, '0') + '-' + parts[2].padStart(2, '0');
                      else dStr = parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
                    }
                  } else {
                    dStr = rawDate.trim();
                  }
                }
                if (!dStr) return true;
                if (reportDateFrom.value && dStr < reportDateFrom.value) return false;
                if (reportDateTo.value && dStr > reportDateTo.value) return false;
                return true;
              });
            }

            if (reportStatusFilter.value && reportStatusFilter.value !== 'ALL') {
              list = list.filter(item => {
                const s = item.status || (item.cpsf ? 'CLOSED' : (item.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                return s === reportStatusFilter.value;
              });
            }

            const q = String(reportSearch.value || '').trim().toLowerCase();
            if (q) {
              list = list.filter(item => {
                const doc = String(item.docNo || '').toLowerCase();
                const cpsr = String(item.cpsrDocNo || item.cpsr?.docNo || '').toLowerCase();
                const mach = String(item.machineName || item.cpsr?.machineName || '').toLowerCase();
                const prob = String(item.problem || item.cpsr?.problem || '').toLowerCase();
                const req = String(item.reqBy || item.cpsr?.reqBy || '').toLowerCase();
                const ass = String(item.assignedTo || item.cpst?.recvBy || '').toLowerCase();
                return doc.includes(q) || cpsr.includes(q) || mach.includes(q) || prob.includes(q) || req.includes(q) || ass.includes(q);
              });
            }

            return list;
          } catch (e) {
            console.warn('Error in filteredReportCps:', e);
            return [];
          }
        });

        const reportStats = computed(() => {
          const list = filteredReportCps.value || [];
          let openTask = 0;
          let toAssign = 0;
          let inProgress = 0;
          let closed = 0;
          let overDue = 0;
          let totalDowntimeMinutes = 0;

          list.forEach(c => {
            const s = c.status || (c.cpsf ? 'CLOSED' : (c.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
            if (s === 'OPEN_TASK') openTask++;
            else if (s === 'TO_ASSIGN') toAssign++;
            else if (s === 'IN_PROGRESS') inProgress++;
            else if (s === 'CLOSED') closed++;
            else if (s === 'OVER_DUE') overDue++;
            else toAssign++;

            const dt = Number(c.downtime != null ? c.downtime : (c.cpst?.downtime != null ? c.cpst.downtime : 0)) || 0;
            totalDowntimeMinutes += dt;
          });

          const totalStatusCps = openTask + toAssign + inProgress + closed + overDue;
          const totalDowntimeHours = Math.round((totalDowntimeMinutes / 60) * 10) / 10;

          return {
            totalRequests: list.length,
            totalDowntimeMinutes,
            totalDowntimeHours,
            openTask,
            toAssign,
            inProgress,
            closed,
            overDue,
            totalStatusCps
          };
        });

        // 4M Ratio Computed Client-side (Man, Machine, Material, Method đã giải quyết)
        const report4MStats = computed(() => {
          const list = filteredReportCps.value || [];
          let man = 0;
          let machine = 0;
          let material = 0;
          let method = 0;

          list.forEach(c => {
            if (!c) return;
            const rc = String(c.rootCause || c.cpst?.rootCause || c.root_cause || c.cpst?.root_cause || '').trim();
            if (!rc) return;
            const lower = rc.toLowerCase();
            if (lower === 'man' || lower.includes('người') || lower.includes('human') || lower.includes('thao tác') || lower.includes('nhân sự')) {
              man++;
            } else if (lower === 'machine' || lower.includes('máy') || lower.includes('thiết bị') || lower.includes('hỏng') || lower.includes('cảm biến') || lower.includes('bụi')) {
              machine++;
            } else if (lower === 'material' || lower.includes('vật liệu') || lower.includes('nguyên liệu') || lower.includes('mực') || lower.includes('giấy') || lower.includes('phôi')) {
              material++;
            } else if (lower === 'method' || lower.includes('phương pháp') || lower.includes('quy trình') || lower.includes('cài đặt') || lower.includes('setup') || lower.includes('hướng dẫn')) {
              method++;
            } else {
              machine++;
            }
          });

          return {
            man,
            machine,
            material,
            method,
            total: man + machine + material + method
          };
        });

        // Helpers for Gantt Timeline Parsing
        const parseDateToMs = (dateStr, timeStr) => {
          if (!dateStr) return null;
          let iso = String(dateStr).trim();
          if (iso.includes('/')) {
            const parts = iso.split('/');
            if (parts.length === 3) {
              if (parts[0].length === 4) iso = parts[0] + '-' + parts[1].padStart(2, '0') + '-' + parts[2].padStart(2, '0');
              else iso = parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
            }
          }
          const t = timeStr && String(timeStr).trim() ? String(timeStr).trim() : '00:00';
          const dt = new Date(iso + 'T' + (t.length === 5 ? t + ':00' : t));
          if (!isNaN(dt.getTime())) return dt.getTime();
          return null;
        };

        const getCpsStartTimestamp = (item) => {
          if (!item) return null;
          const reqD = item.cpsr?.reqDate || item.reqDate;
          const reqT = item.cpsr?.reqTime || item.reqTime;
          const fromReq = parseDateToMs(reqD, reqT);
          if (fromReq) return fromReq;

          const rawCreated = item.cpsr?.createdAt || item.createdAt || item.cpsr?.submittedAt;
          if (rawCreated) {
            const dt = new Date(rawCreated);
            if (!isNaN(dt.getTime())) return dt.getTime();
          }
          return null;
        };

        // Gantt Chart Range: 0h00 ngày bắt đầu -> 23h59 ngày kết thúc
        const ganttTimeRange = computed(() => {
          let startMs = 0;
          let endMs = 0;

          if (reportDateFrom.value) {
            const s = new Date(reportDateFrom.value + 'T00:00:00');
            if (!isNaN(s.getTime())) startMs = s.getTime();
          }
          if (reportDateTo.value) {
            const e = new Date(reportDateTo.value + 'T23:59:59');
            if (!isNaN(e.getTime())) endMs = e.getTime();
          }

          const list = filteredReportCps.value || [];
          if (!startMs || !endMs) {
            let minT = Infinity;
            let maxT = -Infinity;
            list.forEach(c => {
              const t = getCpsStartTimestamp(c);
              if (t) {
                if (t < minT) minT = t;
                if (t > maxT) maxT = t;
              }
            });

            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
            const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();

            if (!startMs) startMs = isFinite(minT) ? minT : todayStart;
            if (!endMs) endMs = isFinite(maxT) ? maxT : todayEnd;
          }

          if (endMs <= startMs) {
            endMs = startMs + 24 * 60 * 60 * 1000 - 1000;
          }

          const pad = n => String(n).padStart(2, '0');
          const fmt = (ms) => {
            const dt = new Date(ms);
            return pad(dt.getDate()) + '/' + pad(dt.getMonth() + 1) + ' ' + pad(dt.getHours()) + ':' + pad(dt.getMinutes());
          };

          return {
            startMs,
            endMs,
            durationMs: Math.max(1000, endMs - startMs),
            startLabel: fmt(startMs),
            endLabel: fmt(endMs)
          };
        });

        // Gantt Chart Time Markers & 1-Hour Grid Lines on X-Axis
        const ganttTimeTicks = computed(() => {
          const range = ganttTimeRange.value;
          const ticks = [];
          const pad = n => String(n).padStart(2, '0');
          const oneHourMs = 3600000;
          const duration = range.durationMs || (24 * oneHourMs);
          const totalHours = Math.max(1, Math.round(duration / oneHourMs));

          const stepHours = totalHours <= 72 ? 1 : Math.ceil(totalHours / 48);
          const labelStep = totalHours <= 24 ? 2 : (totalHours <= 48 ? 4 : Math.ceil(totalHours / 8));

          for (let h = 0; h <= totalHours; h += stepHours) {
            const p = Math.min(100, (h / totalHours) * 100);
            const ms = range.startMs + (h * oneHourMs);
            const dt = new Date(ms);
            const showLabel = (h % labelStep === 0) || (h === totalHours);
            const label = showLabel
              ? (totalHours <= 24 ? (pad(dt.getHours()) + ':00') : (pad(dt.getDate()) + '/' + pad(dt.getMonth() + 1) + ' ' + pad(dt.getHours()) + 'h'))
              : '';
            ticks.push({
              percent: Math.round(p * 100) / 100,
              label,
              hour: dt.getHours(),
              isMajor: h % labelStep === 0
            });
          }
          return ticks;
        });

        // Gantt Chart Rows: Trục Y là tên máy, dải màu vàng thể hiện khoảng downtime
        const ganttMachineRows = computed(() => {
          const list = filteredReportCps.value || [];
          const range = ganttTimeRange.value;
          const machineMap = new Map();

          const pad = n => String(n).padStart(2, '0');
          const fmtDt = (ms) => {
            const dt = new Date(ms);
            return pad(dt.getDate()) + '/' + pad(dt.getMonth() + 1) + ' ' + pad(dt.getHours()) + ':' + pad(dt.getMinutes());
          };

          list.forEach(item => {
            if (!item) return;
            const mach = String(item.machineName || item.cpsr?.machineName || 'Chưa định danh').trim();
            if (!machineMap.has(mach)) {
              machineMap.set(mach, {
                machineName: mach,
                totalDowntime: 0,
                bars: []
              });
            }
            const mData = machineMap.get(mach);

            const startMs = getCpsStartTimestamp(item) || range.startMs;
            const dtVal = Number(item.downtime != null ? item.downtime : (item.cpst?.downtime != null ? item.cpst.downtime : 0)) || 0;
            mData.totalDowntime += dtVal;

            const durationMin = dtVal > 0 ? dtVal : 15;
            const endMs = startMs + durationMin * 60 * 1000;

            const clampedStart = Math.max(range.startMs, startMs);
            const clampedEnd = Math.min(range.endMs, endMs);

            if (clampedEnd >= clampedStart) {
              const left = Math.max(0, Math.min(100, ((clampedStart - range.startMs) / range.durationMs) * 100));
              const width = Math.max(1.2, Math.min(100 - left, ((clampedEnd - clampedStart) / range.durationMs) * 100));

              const doc = item.docNo || (item.cpsr?.docNo ? item.cpsr.docNo.replace('CPSR-', 'CPS-') : (item.cpsrDocNo ? item.cpsrDocNo.replace('CPSR-', 'CPS-') : 'CPS'));
              const prob = item.problem || item.cpsr?.problem || 'Không có mô tả';
              const tech = formatTechnicianName(item.assignedToName || item.assignedTo || item.cpst?.recvBy || '') || 'Chưa giao';
              const tooltip = '[' + doc + '] ' + mach + '\\nDowntime: ' + (dtVal > 0 ? dtVal + 'p' : 'Đang xử lý') + '\\nTừ: ' + fmtDt(startMs) + ' → Đến: ' + fmtDt(endMs) + '\\nSự cố: ' + prob + '\\nTechnician: ' + tech;

              mData.bars.push({
                left: Math.round(left * 10) / 10,
                width: Math.round(width * 10) / 10,
                downtime: dtVal > 0 ? dtVal : durationMin,
                tooltip,
                item
              });
            }
          });

          return Array.from(machineMap.values()).sort((a, b) => b.totalDowntime - a.totalDowntime);
        });

        const pendingAssignCount = computed(() => {
          try {
            const list = Array.isArray(cpsList.value) ? cpsList.value : [];
            return list.filter(c => c && (c.status === 'TO_ASSIGN' || (!c.assignedTo && c.status !== 'CLOSED'))).length;
          } catch (_) {
            return 0;
          }
        });

        const cpsCountByStatus = (status) => {
          try {
            if (!Array.isArray(cpsList.value)) return 0;
            return cpsList.value.filter(c => c && c.status === status).length;
          } catch (_) {
            return 0;
          }
        };

        const filteredCpsCards = computed(() => {
          try {
            let list = Array.isArray(cpsList.value) ? cpsList.value : [];
            const st = assignCardStatus.value;
            if (st && st !== 'ALL') {
              list = list.filter(c => c && c.status === st);
            }
            const q = String(assignCardSearch.value || '').trim().toLowerCase();
            if (q) {
              list = list.filter(c => {
                if (!c) return false;
                const doc = String(c.docNo || '').toLowerCase();
                const cpsr = String(c.cpsrDocNo || c.cpsr?.docNo || '').toLowerCase();
                const mach = String(c.machineName || c.cpsr?.machineName || '').toLowerCase();
                const prob = String(c.problem || c.cpsr?.problem || '').toLowerCase();
                const req = String(c.reqBy || c.cpsr?.reqBy || '').toLowerCase();
                const ass = String(c.assignedTo || '').toLowerCase();
                return doc.includes(q) || cpsr.includes(q) || mach.includes(q) || prob.includes(q) || req.includes(q) || ass.includes(q);
              });
            }
            return list;
          } catch (err) {
            console.warn('Error in filteredCpsCards:', err);
            return [];
          }
        });

        const currentSplitCount = computed(() => {
          if (splitTab.value === 'chain') return (chainList.value || []).length;
          if (splitTab.value === 'cpsr') return (Array.isArray(cpsrList.value) ? cpsrList.value : (cpsrList.value?.data || [])).length;
          if (splitTab.value === 'cpst') return (Array.isArray(cpstList.value) ? cpstList.value : (cpstList.value?.data || [])).length;
          if (splitTab.value === 'cpsf') return (Array.isArray(cpsfList.value) ? cpsfList.value : (cpsfList.value?.data || [])).length;
          return 0;
        });

        // Requests Master Table
        const requestsList = ref([]);
        const reqFilter = ref({ search: '', chkStatus: 'ALL', printTech: 'ALL', priority: 'ALL' });
        const selectedTicket = ref(null);

        // Machines
        const machineCatalog = ref({});
        const machinesFlatList = ref([]);
        const machineTechFilter = ref('ALL');
        const machineSearch = ref('');
        const newMachine = ref({ tech: '', name: '', code: '' });

        // Employees
        const employeesList = ref([]);
        const empSearch = ref('');
        const empDeptFilter = ref('ALL');
        const newEmployee = ref({ mnv: '', name: '', dept: 'Sản Xuất', area: '', role: 'Operator' });

        // Users
        const usersList = ref([]);
        const userSearch = ref('');
        const userRoleFilter = ref('ALL');
        const newUser = ref({
          username: '',
          password: 'Checkpoint@123',
          fullName: '',
          email: '',
          role: 'EMPLOYEE',
          permissions: {
            canCreateRequest: true,
            canViewKpi: false,
            canAccessControlPanel: false
          }
        });

        // Existing Datasets Management
        const activeDataset = ref('weekly-requests');
        const datasetSearch = ref('');
        const weeklyRequestsList = ref([]);
        const defectLogsList = ref([]);
        const actionPlansList = ref([]);
        const requestersList = ref([]);

        // Computed
        const currentTabLabel = computed(() => {
          const map = {
            overview: 'Tổng Quan Hệ Thống',
            'assign-tasks': 'Phân Công Kỹ Thuật',
            requests: 'Quản Lý Phiếu Kỹ Thuật',
            'report-technical': 'Report Technical',
            machines: 'Máy móc & Thiết bị',
            employees: 'Nhân sự & Phân xưởng',
            users: 'Danh sách User & Phân quyền',
            database: 'Database',
            'existing-data': 'Database'
          };
          return map[activeTab.value] || 'Tổng Quan Hệ Thống';
        });

        const userInitials = computed(() => {
          try {
            const user = currentUser.value || {};
            const rawName = user.fullName || user.username || 'CP';
            const name = String(rawName).trim();
            if (!name) return 'CP';
            const parts = name.split(/\\s+/).filter(Boolean);
            if (parts.length > 1) {
              const first = parts[0]?.[0] || '';
              const last = parts[parts.length - 1]?.[0] || '';
              const combined = (first + last).toUpperCase();
              if (combined) return combined;
            }
            return name.substring(0, 2).toUpperCase() || 'CP';
          } catch (_) {
            return 'CP';
          }
        });

        const distinctDepts = computed(() => {
          return [...new Set(employeesList.value.map(e => e.dept).filter(Boolean))];
        });

        // Helpers
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

        const openModal = (id) => {
          if (id === 'modal-ticket-detail') showTicketDetailModal.value = true;
          else if (id === 'modal-chain-detail') showChainModal.value = true;
          else if (id === 'modal-edit-ticket') showEditModal.value = true;
          else if (id === 'modal-link-ticket') showLinkModal.value = true;
          else if (id === 'modal-create-cps') showCreateCpsModal.value = true;
          else if (id === 'modal-add-machine') showAddMachineModal.value = true;
          else if (id === 'modal-add-employee') showAddEmployeeModal.value = true;
          else if (id === 'modal-add-user') showAddUserModal.value = true;
          else if (id === 'modal-excel') showExcelModal.value = true;
          else if (id === 'modal-assign-task') showAssignModal.value = true;
          else document.getElementById(id)?.classList.add('show');
        };

        const closeModal = (id) => {
          if (id === 'modal-ticket-detail') showTicketDetailModal.value = false;
          else if (id === 'modal-chain-detail') showChainModal.value = false;
          else if (id === 'modal-edit-ticket') showEditModal.value = false;
          else if (id === 'modal-link-ticket') showLinkModal.value = false;
          else if (id === 'modal-create-cps') showCreateCpsModal.value = false;
          else if (id === 'modal-add-machine') showAddMachineModal.value = false;
          else if (id === 'modal-add-employee') showAddEmployeeModal.value = false;
          else if (id === 'modal-add-user') showAddUserModal.value = false;
          else if (id === 'modal-excel') showExcelModal.value = false;
          else if (id === 'modal-assign-task') showAssignModal.value = false;
          else document.getElementById(id)?.classList.remove('show');
        };

        const closeChainModal = () => {
          showChainModal.value = false;
        };
        const closeSplitDetailModal = closeChainModal;

        const closeTicketDetailModal = () => {
          showTicketDetailModal.value = false;
        };

        const closeAssignModal = () => {
          showAssignModal.value = false;
        };

        const triggerUpload = (id) => document.getElementById(id)?.click();

        const get4MLabel = (k) => {
          const map = { MAN: 'Con người (MAN)', MACHINE: 'Máy móc (MACHINE)', MATERIAL: 'Vật tư (MATERIAL)', METHOD: 'Phương pháp (METHOD)' };
          return map[k] || k;
        };

        const getPercent = (v, total) => {
          if (!total || total === 0) return 0;
          return Math.round((v / total) * 100);
        };

        const setTheme = (theme) => {
          currentTheme.value = theme;
          localStorage.setItem('checkpoint_theme', theme);
          document.documentElement.classList.remove('theme-light', 'theme-dark', 'dark');
          document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          }
          if (activeTab.value === 'report-technical') {
            nextTick(() => {
              renderReportChart();
              renderReport4MChart();
            });
          }
        };

        const toggleTheme = () => {
          setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
        };

        const formatCpsStatus = (s) => {
          if (!s) return 'Chờ phân công';
          const map = {
            TO_ASSIGN: 'Chờ phân công',
            IN_PROGRESS: 'Đang xử lý',
            OVER_DUE: 'Quá hạn',
            CLOSED: 'Đã đóng',
            OPEN_TASK: 'Mở'
          };
          return map[s] || String(s);
        };

        const formatTechnicianName = (val) => {
          if (!val) return '';
          let str = String(val).trim();
          str = str.replace(/^(KTV|ktv|Technician|technician)\\s*[-:]?\\s*/i, '').trim();
          if (str.includes(' - ')) {
            const parts = str.split(' - ');
            if (parts[0] && parts[0].trim()) {
              str = parts[0].trim();
            }
          }
          return str;
        };

        const getTechnicianDisplayName = (item) => {
          if (!item) return '';
          if (item.assignedToName) {
            return formatTechnicianName(item.assignedToName);
          }
          if (item.assignedTo) {
            return formatTechnicianName(item.assignedTo);
          }
          if (item.assignee) {
            return formatTechnicianName(item.assignee);
          }
          return '';
        };

        const getCardBorderClass = (s) => {
          const status = (s || '').toUpperCase().trim();
          if (status === 'TO_ASSIGN') return 'border-amber-300 dark:border-amber-500/40 hover:border-amber-500';
          if (status === 'IN_PROGRESS') return 'border-sky-300 dark:border-sky-500/40 hover:border-sky-500';
          if (status === 'OVER_DUE') return 'border-rose-300 dark:border-rose-500/40 hover:border-rose-500';
          if (status === 'CLOSED') return 'border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-500';
          return 'border-slate-200 dark:border-slate-700/60 hover:border-slate-400 dark:hover:border-slate-500';
        };

        const formatDateTimeDisplay = (val) => {
          if (!val) return '-';
          try {
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
          } catch(e) {
            return val;
          }
        };

        const openAssignModal = (cps) => {
          if (!cps) return;
          const raw = toPlainObject(cps);
          selectedCpsForAssign.value = raw;
          let initialDeadline = '';
          if (raw.deadline) {
            try {
              const d = new Date(raw.deadline);
              if (!isNaN(d.getTime())) {
                const pad = (n) => String(n).padStart(2, '0');
                initialDeadline = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
              }
            } catch (_) {}
          }

          let foundEmp = '';
          if (raw.assignedTo && employeesList.value.length > 0) {
            const rawTechName = formatTechnicianName(raw.assignedToName || raw.assignedTo);
            foundEmp = employeesList.value.find(e => {
              const fullStr = e.name + ' - ' + e.mnv;
              return fullStr === raw.assignedTo || e.name === raw.assignedTo || e.name === rawTechName || e.mnv === raw.assignedToId;
            }) || '';
          }

          assignForm.value = {
            employee: foundEmp || '',
            deadline: initialDeadline,
            notes: raw.notes || ''
          };
          showAssignModal.value = true;
          if (employeesList.value.length === 0) {
            loadEmployees();
          }
        };

        const submitAssignTask = async () => {
          if (!selectedCpsForAssign.value) return;
          if (!assignForm.value.employee) {
            showToast('Vui lòng chọn Technician tiếp nhận', true);
            return;
          }
          isAssigning.value = true;
          try {
            const emp = assignForm.value.employee;
            const empDisplayName = typeof emp === 'object' ? emp.name : formatTechnicianName(emp);
            const empId = typeof emp === 'object' ? (emp.mnv || emp.id) : '';

            const cpsTarget = selectedCpsForAssign.value.docNo || selectedCpsForAssign.value.id || (selectedCpsForAssign.value.cpsrDocNo ? selectedCpsForAssign.value.cpsrDocNo.replace('CPSR-', 'CPS-') : '');
            const payload = {
              assignedTo: empDisplayName,
              assignee: empDisplayName,
              assignedToName: empDisplayName,
              assignedToId: empId,
              employeeId: empId,
              deadline: assignForm.value.deadline ? new Date(assignForm.value.deadline).toISOString() : null,
              notes: assignForm.value.notes || '',
              status: 'IN_PROGRESS'
            };

            let res = await fetch('/api/cps/' + encodeURIComponent(cpsTarget) + '/assign', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (!res.ok && (res.status === 404 || res.status === 405)) {
              res = await fetch('/api/cps/' + encodeURIComponent(cpsTarget) + '/assign', {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                credentials: 'include',
                body: JSON.stringify(payload)
              });
            }

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || ('Lỗi máy chủ (' + res.status + ')'));
            }

            showToast('Đã phân công Technician ' + empDisplayName + ' cho phiếu ' + cpsTarget + ' (IN_PROGRESS)');
            showAssignModal.value = false;
            await loadAllSplitData();
          } catch (err) {
            showToast('Lỗi phân công: ' + err.message, true);
          } finally {
            isAssigning.value = false;
          }
        };

        // =====================================================================
        // CRUD & LINK METHODS FOR CPSR, CPST, CPSF, CPS (MODAL & ACTIONS)
        // =====================================================================
        const openEditModal = async (type, data) => {
          if (!data) return;
          let raw = toPlainObject(data) || {};

          if (type === 'cpsr') {
            const targetDocNo = raw.cpsr?.docNo || raw.cpsrDocNo || (typeof raw.docNo === 'string' && raw.docNo.startsWith('CPSR-') ? raw.docNo : (raw.cpsr || raw.docNo));
            let found = null;
            if (targetDocNo && typeof targetDocNo === 'string') {
              const currentList = Array.isArray(cpsrList.value) ? cpsrList.value : (Array.isArray(cpsrList.value?.data) ? cpsrList.value.data : []);
              found = currentList.find(c => c && (c.docNo === targetDocNo || c.id === targetDocNo));
              if (!found) {
                try {
                  const res = await fetch('/api/cpsr/' + encodeURIComponent(targetDocNo), { headers: getAuthHeaders(), credentials: 'include' });
                  if (res.ok) {
                    found = await res.json();
                  }
                } catch (_) {}
              }
            }
            if (found) {
              raw = toPlainObject(found);
            } else if (raw.cpsr && typeof raw.cpsr === 'object') {
              raw = toPlainObject(raw.cpsr);
            } else if (raw.cpsrDocNo) {
              raw = { ...raw, docNo: raw.cpsrDocNo };
            }
          }

          let deadlineStr = '';
          if (raw.deadline) {
            try {
              const d = new Date(raw.deadline);
              if (!isNaN(d.getTime())) {
                const pad = (n) => String(n).padStart(2, '0');
                deadlineStr = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
              }
            } catch (_) {}
          }

          editForm.value = {
            type: type,
            docNo: raw.docNo || raw.id || '',
            cpsrDocNo: raw.cpsrDocNo || raw.cpsr?.docNo || '',
            assignedTo: raw.assignedTo || raw.cpst?.recvBy || '',
            priority: raw.priority || raw.cpsr?.priority || 'Khác',
            status: raw.status || (raw.cpsf ? 'CLOSED' : (raw.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN')),
            deadline: deadlineStr,
            notes: raw.notes || '',
            // CPSR
            reqBy: raw.reqBy || raw.cpsr?.reqBy || '',
            machineName: raw.machineName || raw.cpsr?.machineName || '',
            printTech: raw.printTech || raw.cpsr?.printTech || '',
            machineStatus: raw.machineStatus || raw.cpsr?.machineStatus || '',
            problem: raw.problem || raw.cpsr?.problem || '',
            reqDate: raw.reqDate || raw.cpsr?.reqDate || '',
            reqTime: raw.reqTime || raw.cpsr?.reqTime || '',
            // CPST
            recvBy: raw.recvBy || raw.cpst?.recvBy || raw.assignedTo || '',
            chkStatus: raw.chkStatus || raw.cpst?.chkStatus || 'Đã khắc phục',
            downtime: raw.downtime != null ? raw.downtime : (raw.cpst?.downtime != null ? raw.cpst.downtime : 0),
            rootCause: raw.rootCause || raw.cpst?.rootCause || '',
            actionTaken: raw.actionTaken || raw.cpst?.actionTaken || '',
            // CPSF
            chkQuality: raw.chkQuality || raw.cpsf?.chkQuality || 'Đạt',
            workOrder: raw.workOrder || raw.cpsf?.workOrder || '',
            woTotalQty: raw.woTotalQty != null ? raw.woTotalQty : (raw.cpsf?.woTotalQty != null ? raw.cpsf.woTotalQty : 0),
            wasteQty: raw.wasteQty != null ? raw.wasteQty : (raw.cpsf?.wasteQty != null ? raw.cpsf.wasteQty : 0),
            wasteUnit: raw.wasteUnit || raw.cpsf?.wasteUnit || 'PCS',
            prodMgr: raw.prodMgr || raw.cpsf?.prodMgr || ''
          };
          showEditModal.value = true;
        };

        const closeEditModal = () => {
          showEditModal.value = false;
        };

        const submitEditTicket = async () => {
          if (!editForm.value.docNo) return;
          isSavingEdit.value = true;
          try {
            const type = editForm.value.type;
            const docNo = editForm.value.docNo;
            const url = "/api/" + type + "/" + encodeURIComponent(docNo);
            let body = {};
            if (type === 'cps') {
              body = {
                assignedTo: editForm.value.assignedTo,
                assignee: editForm.value.assignedTo,
                priority: editForm.value.priority,
                status: editForm.value.status,
                deadline: editForm.value.deadline ? new Date(editForm.value.deadline).toISOString() : null,
                notes: editForm.value.notes
              };
            } else if (type === 'cpsr') {
              body = {
                reqBy: editForm.value.reqBy,
                machineName: editForm.value.machineName,
                printTech: editForm.value.printTech,
                machineStatus: editForm.value.machineStatus,
                priority: editForm.value.priority,
                problem: editForm.value.problem,
                ...(editForm.value.reqDate ? { reqDate: editForm.value.reqDate } : {}),
                ...(editForm.value.reqTime ? { reqTime: editForm.value.reqTime } : {})
              };
            } else if (type === 'cpst') {
              body = {
                recvBy: editForm.value.recvBy,
                chkStatus: editForm.value.chkStatus,
                downtime: Number(editForm.value.downtime) || 0,
                rootCause: editForm.value.rootCause,
                actionTaken: editForm.value.actionTaken
              };
            } else if (type === 'cpsf') {
              body = {
                chkQuality: editForm.value.chkQuality,
                workOrder: editForm.value.workOrder,
                woTotalQty: Number(editForm.value.woTotalQty) || 0,
                wasteQty: Number(editForm.value.wasteQty) || 0,
                wasteUnit: editForm.value.wasteUnit,
                prodMgr: editForm.value.prodMgr
              };
            }

            const res = await fetch(url, {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(body)
            });

            if (res.ok) {
              showToast("Đã cập nhật phiếu " + docNo + " thành công!");
              showEditModal.value = false;
              await loadAllSplitData();
              if (showChainModal.value && selectedChain.value) {
                const refreshedDoc = selectedChain.value.docNo || selectedChain.value.cpsrDocNo || selectedChain.value.cpsr?.docNo;
                if (refreshedDoc) {
                  const updatedChain = (chainList.value || []).find(c => c.docNo === refreshedDoc || c.cpsrDocNo === refreshedDoc || c.cpsr?.docNo === refreshedDoc);
                  if (updatedChain) selectedChain.value = updatedChain;
                }
              }
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Cập nhật phiếu thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi kết nối: ' + e.message, true);
          } finally {
            isSavingEdit.value = false;
          }
        };

        const deleteCpsRecord = async (cps) => {
          if (!cps) return;
          const raw = toPlainObject(cps);
          const docNo = raw.docNo || raw.id;
          if (!confirm("Bạn có chắc chắn muốn xóa phiếu CPS " + docNo + "?")) return;
          try {
            const res = await fetch("/api/cps/" + encodeURIComponent(docNo), {
              method: 'DELETE',
              headers: getAuthHeaders(),
              credentials: 'include'
            });
            if (res.ok) {
              showToast("Đã xóa phiếu CPS " + docNo + " thành công!");
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Xóa phiếu thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi xóa: ' + e.message, true);
          }
        };

        const openCreateCpsModal = () => {
          createCpsForm.value = {
            cpsrDocNo: availableCpsrForCps.value[0]?.docNo || '',
            assignedTo: '',
            priority: 'Bình thường',
            deadline: '',
            notes: ''
          };
          showCreateCpsModal.value = true;
        };

        const closeCreateCpsModal = () => {
          showCreateCpsModal.value = false;
        };

        const submitCreateCps = async () => {
          if (!createCpsForm.value.cpsrDocNo) {
            showToast('Vui lòng chọn phiếu CPSR gốc!', true);
            return;
          }
          isCreatingCps.value = true;
          try {
            const payload = {
              cpsrDocNo: createCpsForm.value.cpsrDocNo,
              assignedTo: createCpsForm.value.assignedTo || undefined,
              assignee: createCpsForm.value.assignedTo || undefined,
              priority: createCpsForm.value.priority || 'Bình thường',
              deadline: createCpsForm.value.deadline ? new Date(createCpsForm.value.deadline).toISOString() : undefined,
              notes: createCpsForm.value.notes || undefined
            };

            const res = await fetch('/api/cps', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              const data = await res.json();
              showToast("Đã tạo thành công phiếu CPS " + (data.docNo || "") + "!");
              showCreateCpsModal.value = false;
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Tạo phiếu CPS thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi tạo CPS: ' + e.message, true);
          } finally {
            isCreatingCps.value = false;
          }
        };

        const openLinkModal = (cps) => {
          let target = cps;
          if (!target && chainList.value && chainList.value.length > 0) {
            target = chainList.value[0];
          }
          if (!target) {
            showToast('Chưa có phiếu CPS nào để ghép nối!', true);
            return;
          }
          const raw = toPlainObject(target);
          linkForm.value = {
            cpsDocNo: raw.docNo || (raw.cpsr?.docNo ? raw.cpsr.docNo.replace('CPSR-', 'CPS-') : raw.id || ''),
            cpsrDocNo: raw.cpsrDocNo || raw.cpsr?.docNo || '',
            machineName: raw.machineName || raw.cpsr?.machineName || '',
            problem: raw.problem || raw.cpsr?.problem || '',
            currentCpst: raw.cpstDocNo || raw.cpst?.docNo || '',
            currentCpsf: raw.cpsfDocNo || raw.cpsf?.docNo || '',
            selectedCpst: '',
            selectedCpsf: ''
          };
          showLinkModal.value = true;
        };

        const onSelectLinkCps = (docNo) => {
          const found = (chainList.value || []).find(c => c && (c.docNo === docNo || c.id === docNo));
          if (found) {
            const raw = toPlainObject(found);
            linkForm.value.cpsDocNo = raw.docNo || raw.id;
            linkForm.value.cpsrDocNo = raw.cpsrDocNo || raw.cpsr?.docNo || '';
            linkForm.value.machineName = raw.machineName || raw.cpsr?.machineName || '';
            linkForm.value.problem = raw.problem || raw.cpsr?.problem || '';
            linkForm.value.currentCpst = raw.cpstDocNo || raw.cpst?.docNo || '';
            linkForm.value.currentCpsf = raw.cpsfDocNo || raw.cpsf?.docNo || '';
            linkForm.value.selectedCpst = '';
            linkForm.value.selectedCpsf = '';
          }
        };

        const closeLinkModal = () => {
          showLinkModal.value = false;
        };

        const submitLinkTickets = async () => {
          if (!linkForm.value.cpsDocNo) return;
          isLinking.value = true;
          try {
            const payload = {};
            if (linkForm.value.selectedCpst) payload.cpstDocNo = linkForm.value.selectedCpst;
            if (linkForm.value.selectedCpsf) payload.cpsfDocNo = linkForm.value.selectedCpsf;

            const res = await fetch("/api/cps/" + encodeURIComponent(linkForm.value.cpsDocNo) + "/link", {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              showToast("Đã ghép nối phiếu CPS " + linkForm.value.cpsDocNo + " thành công!");
              showLinkModal.value = false;
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Ghép nối thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi ghép nối: ' + e.message, true);
          } finally {
            isLinking.value = false;
          }
        };

        const unlinkItem = async (type) => {
          if (!linkForm.value.cpsDocNo) return;
          try {
            const payload = type === 'cpst' ? { unlinkCpst: true } : { unlinkCpsf: true };
            const res = await fetch("/api/cps/" + encodeURIComponent(linkForm.value.cpsDocNo) + "/unlink", {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              showToast("Đã hủy ghép nối " + type.toUpperCase() + " thành công!");
              if (type === 'cpst') linkForm.value.currentCpst = '';
              if (type === 'cpsf') linkForm.value.currentCpsf = '';
              await loadAllSplitData();
            } else {
              const err = await res.json().catch(() => ({}));
              showToast(err.message || 'Hủy ghép nối thất bại', true);
            }
          } catch (e) {
            showToast('Lỗi khi hủy ghép: ' + e.message, true);
          }
        };

        const onReportFilterChange = () => {
          nextTick(() => {
            renderReportChart();
            renderReport4MChart();
            initOrUpdateReportTable();
          });
        };

        const renderReportChart = () => {
          const canvas = document.getElementById('chart-report-technical-donut');
          if (!canvas || typeof Chart === 'undefined') return;

          if (reportChartInstance) {
            reportChartInstance.destroy();
            reportChartInstance = null;
          }

          const stats = reportStats.value;
          const isDark = currentTheme.value === 'dark';
          const dataVals = [stats.openTask, stats.toAssign, stats.inProgress, stats.closed, stats.overDue];
          const allZeros = dataVals.every(v => v === 0);

          reportChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: ['OPEN_TASK', 'TO_ASSIGN', 'IN_PROGRESS', 'CLOSED', 'OVER_DUE'],
              datasets: [{
                data: allZeros ? [1] : dataVals,
                backgroundColor: allZeros ? ['#94a3b8'] : ['#64748b', '#f59e0b', '#0284c7', '#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: isDark ? '#0f172a' : '#ffffff',
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '72%',
              animation: { duration: 300 },
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: !allZeros,
                  callbacks: {
                    label: function(ctx) {
                      const val = ctx.raw || 0;
                      const total = stats.totalStatusCps || 1;
                      const pct = Math.round((val / total) * 100);
                      return " " + ctx.label + ": " + val + " phiếu (" + pct + "%)";
                    }
                  }
                }
              }
            }
          });
        };

        const renderReport4MChart = () => {
          const canvas = document.getElementById('chart-report-technical-4m');
          if (!canvas || typeof Chart === 'undefined') return;

          if (report4MChartInstance) {
            report4MChartInstance.destroy();
            report4MChartInstance = null;
          }

          const stats = report4MStats.value;
          const isDark = currentTheme.value === 'dark';
          const dataVals = [stats.man, stats.machine, stats.material, stats.method];
          const allZeros = dataVals.every(v => v === 0);

          report4MChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: ['Man (Con người)', 'Machine (Máy móc)', 'Material (Vật tư)', 'Method (Phương pháp)'],
              datasets: [{
                data: allZeros ? [1] : dataVals,
                backgroundColor: allZeros ? ['#94a3b8'] : ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
                borderWidth: 2,
                borderColor: isDark ? '#0f172a' : '#ffffff',
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '72%',
              animation: { duration: 300 },
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: !allZeros,
                  callbacks: {
                    label: function(ctx) {
                      const val = ctx.raw || 0;
                      const total = stats.total || 1;
                      const pct = Math.round((val / total) * 100);
                      return " " + ctx.label + ": " + val + " (" + pct + "%)";
                    }
                  }
                }
              }
            }
          });
        };

        const initOrUpdateReportTable = () => {
          const el = document.getElementById('tabulator-report-technical');
          if (!el || typeof Tabulator === 'undefined') return;

          const data = filteredReportCps.value || [];
          const columns = [
            {
              title: 'Mã CPS',
              field: 'docNo',
              minWidth: 140,
              formatter: cell => {
                const r = cell.getRow().getData();
                const code = r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '-'));
                return '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + code + '</span>';
              }
            },
            {
              title: 'Ngày khởi tạo',
              minWidth: 130,
              formatter: cell => {
                const r = cell.getRow().getData();
                const d = r.cpsr?.reqDate || r.reqDate || (r.createdAt ? r.createdAt.slice(0, 10) : '-');
                const t = r.cpsr?.reqTime || r.reqTime || '';
                return '<div class="text-xs font-medium text-slate-800 dark:text-slate-200">' + d + (t ? ' <span class="text-[10px] text-slate-400 font-mono">' + t + '</span>' : '') + '</div>';
              }
            },
            {
              title: 'Người yêu cầu',
              minWidth: 140,
              formatter: cell => {
                const r = cell.getRow().getData();
                const req = r.cpsr?.reqBy || r.reqBy || '-';
                return '<div class="text-xs font-semibold text-slate-800 dark:text-slate-200">' + req + '</div>';
              }
            },
            {
              title: 'Máy',
              minWidth: 150,
              formatter: cell => {
                const r = cell.getRow().getData();
                const mach = r.cpsr?.machineName || r.machineName || '-';
                const tech = r.cpsr?.printTech || r.printTech || '';
                return '<div><span class="font-semibold text-slate-800 dark:text-slate-200 text-xs">' + mach + '</span>' + (tech ? '<span class="block text-[10px] text-slate-400 font-mono">' + tech + '</span>' : '') + '</div>';
              }
            },
            {
              title: 'Sự cố',
              minWidth: 180,
              formatter: cell => {
                const r = cell.getRow().getData();
                const p = r.cpsr?.problem || r.problem || '-';
                return '<span class="truncate block max-w-xs text-xs text-slate-700 dark:text-slate-300" title="' + p + '">' + p + '</span>';
              }
            },
            {
              title: 'Technician',
              minWidth: 140,
              formatter: cell => {
                const r = cell.getRow().getData();
                const ass = r.assignedTo || r.cpst?.recvBy;
                const techName = formatTechnicianName(r.assignedToName || ass);
                if (!techName) return '<span class="text-amber-600 dark:text-amber-400 italic text-[11px]">Chưa giao</span>';
                return '<div class="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"><i class="fa-solid fa-user-check text-[10px] text-emerald-600 dark:text-emerald-400"></i> ' + techName + '</div>';
              }
            },
            {
              title: 'Trạng thái',
              field: 'status',
              minWidth: 130,
              hozAlign: 'center',
              formatter: cell => {
                const r = cell.getRow().getData();
                const s = r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                if (s === 'TO_ASSIGN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">⏳ TO_ASSIGN</span>';
                if (s === 'IN_PROGRESS') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30">⚡ IN_PROGRESS</span>';
                if (s === 'OVER_DUE') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">⚠️ OVER_DUE</span>';
                if (s === 'CLOSED') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">✅ CLOSED</span>';
                return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30">📋 ' + s + '</span>';
              }
            },
            {
              title: 'Downtime',
              minWidth: 90,
              hozAlign: 'center',
              formatter: cell => {
                const r = cell.getRow().getData();
                const dt = r.downtime != null ? r.downtime : r.cpst?.downtime;
                if (dt == null || dt === '') return '<span class="text-slate-400">-</span>';
                return '<span class="font-mono font-bold text-amber-700 dark:text-amber-400">' + dt + 'p</span>';
              }
            },
            {
              title: 'Xem chi tiết',
              hozAlign: 'center',
              minWidth: 120,
              headerSort: false,
              formatter: () => '<button class="btn-report-view px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold cursor-pointer transition flex items-center gap-1 mx-auto"><i class="fa-solid fa-eye"></i> Xem chi tiết</button>',
              cellClick: (e, cell) => {
                const r = cell.getRow().getData();
                if (e.target.closest('.btn-report-view')) {
                  openChainDetailModal(r);
                }
              }
            }
          ];

          if (reportTableInstance) {
            safeDestroy(reportTableInstance);
            reportTableInstance = null;
          }

          try {
            reportTableInstance = new Tabulator(el, {
              data: toPlainObject(data),
              columns: columns,
              layout: 'fitColumns',
              responsiveLayout: false,
              pagination: 'local',
              paginationSize: 15,
              paginationSizeSelector: [10, 15, 25, 50],
              height: 'auto',
              placeholder: '<div class="p-8 text-center text-slate-400 text-xs">Không tìm thấy phiếu kỹ thuật nào trong khoảng thời gian đã chọn</div>'
            });
            if (window.__CP_DEBUG__) {
              window.__CP_DEBUG__.markMounted('report-technical', 'mounted');
              window.__CP_DEBUG__.log('Tabulator', 'reportTableInstance mounted');
            }
          } catch (err) {
            console.warn('Error init report table:', err);
          }
        };

        const exportReportTechnicalExcel = () => {
          const rows = filteredReportCps.value.map(r => ({
            'Mã CPS': r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '')),
            'Ngày Khởi Tạo': r.cpsr?.reqDate || r.reqDate || '',
            'Người Yêu Cầu': r.cpsr?.reqBy || r.reqBy || '',
            'Máy': r.cpsr?.machineName || r.machineName || '',
            'Công Nghệ': r.cpsr?.printTech || r.printTech || '',
            'Sự Cố': r.cpsr?.problem || r.problem || '',
            'Technician': formatTechnicianName(r.assignedToName || r.assignedTo || r.cpst?.recvBy || ''),
            'Trạng Thái': r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN')),
            'Downtime (Phút)': r.downtime != null ? r.downtime : (r.cpst?.downtime != null ? r.cpst.downtime : ''),
            'Mã CPSR': r.cpsr?.docNo || r.cpsrDocNo || '',
            'Mã CPST': r.cpst?.docNo || r.cpstDocNo || '',
            'Mã CPSF': r.cpsf?.docNo || r.cpsfDocNo || '',
            'Nguyên Nhân Gốc': r.rootCause || r.cpst?.rootCause || ''
          }));

          if (typeof XLSX === 'undefined') {
            showToast('Thư viện XLSX chưa tải xong', true);
            return;
          }

          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Du_Lieu_Phieu_Yeu_Cau');
          const from = reportDateFrom.value || 'All';
          const to = reportDateTo.value || 'All';
          XLSX.writeFile(wb, "Du_Lieu_Phieu_Yeu_Cau_" + from + "_den_" + to + ".xlsx");
          showToast('Đã xuất file Excel dữ liệu phiếu yêu cầu!');
        };

        const loadCpsData = async () => {
          try {
            const res = await fetch('/api/cps', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              cpsList.value = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            }
          } catch (e) {
            console.warn('Could not load cps data', e);
          }
        };

        const switchTab = (tab) => {
          activeTab.value = tab;
          sidebarOpen.value = false;
          showTicketDetailModal.value = false;
          showChainModal.value = false;
          showEditModal.value = false;
          showLinkModal.value = false;
          showCreateCpsModal.value = false;
          showAddMachineModal.value = false;
          showAddEmployeeModal.value = false;
          showAddUserModal.value = false;
          showExcelModal.value = false;
          showAssignModal.value = false;

          nextTick(() => {
            if (tab === 'overview') loadStats();
            if (tab === 'assign-tasks') {
              loadCpsData();
              if (employeesList.value.length === 0) loadEmployees();
            }
            if (tab === 'requests') {
              loadAllSplitData().then(() => {
                nextTick(() => {
                  initOrUpdateSplitTable();
                  safeRedraw(splitTable);
                });
              });
            }
            if (tab === 'machines') {
              if (machinesFlatList.value.length === 0) loadMachines();
              else { initOrUpdateMachinesTable(); safeRedraw(machinesTable); }
            }
            if (tab === 'employees') {
              if (employeesList.value.length === 0) loadEmployees();
              else { initOrUpdateEmployeesTable(); safeRedraw(empTable); }
            }
            if (tab === 'users') {
              if (usersList.value.length === 0) loadUsers();
              else { initOrUpdateUsersTable(); safeRedraw(usersTable); }
            }
            if (tab === 'existing-data' || tab === 'database') {
              loadCurrentDataset();
            }
            if (tab === 'report-technical') {
              if (!reportDateFrom.value && !reportDateTo.value) {
                initReportDates();
              }
              loadAllSplitData().then(() => {
                nextTick(() => {
                  renderReportChart();
                  renderReport4MChart();
                  initOrUpdateReportTable();
                });
              });
            }
          });
        };

        // =====================================================================
        // TABULATOR: SPLIT FORMS (CPSR, CPST, CPSF, CHAIN 1-1-1 & CPS)
        // =====================================================================
        const loadChainData = async () => {
          try {
            // Check /api/cps for enriched chain and assignment records
            let res = await fetch('/api/cps', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                chainList.value = data;
                cpsList.value = data;
                if (splitTab.value === 'chain') initOrUpdateSplitTable();
                return;
              } else if (Array.isArray(data?.data)) {
                chainList.value = data.data;
                cpsList.value = data.data;
                if (splitTab.value === 'chain') initOrUpdateSplitTable();
                return;
              }
            }
            res = await fetch('/api/cpsr-chain', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              chainList.value = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
              if (splitTab.value === 'chain') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load chain data', e); }
        };

        const loadCpsrData = async () => {
          try {
            const res = await fetch('/api/cpsr', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const resJson = await res.json();
              cpsrList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);
              if (splitTab.value === 'cpsr') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load cpsr data', e); }
        };

        const loadCpstData = async () => {
          try {
            const res = await fetch('/api/cpst', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const resJson = await res.json();
              cpstList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);
              if (splitTab.value === 'cpst') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load cpst data', e); }
        };

        const loadCpsfData = async () => {
          try {
            const res = await fetch('/api/cpsf', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const resJson = await res.json();
              cpsfList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);
              if (splitTab.value === 'cpsf') initOrUpdateSplitTable();
            }
          } catch(e) { console.warn('Could not load cpsf data', e); }
        };

        const loadAllSplitData = async () => {
          await Promise.all([loadCpsData(), loadChainData(), loadCpsrData(), loadCpstData(), loadCpsfData()]);
          if (activeTab.value === 'report-technical') {
            onReportFilterChange();
          }
          if (activeTab.value === 'requests') {
            initOrUpdateSplitTable();
            safeRedraw(splitTable);
          }
        };

        const switchSplitTab = async (tab) => {
          splitTab.value = tab;
          splitFilter.value.search = '';
          splitFilter.value.status = 'ALL';
          if (tab === 'cpsr') {
            await loadCpsrData();
          } else if (tab === 'cpst') {
            await loadCpstData();
          } else if (tab === 'cpsf') {
            await loadCpsfData();
          } else if (tab === 'chain' || tab === 'cps') {
            await Promise.all([loadChainData(), loadCpsData()]);
          }
          nextTick(() => {
            initOrUpdateSplitTable();
            safeRedraw(splitTable);
          });
        };

        const initOrUpdateSplitTable = () => {
          const el = document.getElementById('tabulator-split-forms');
          if (!el || typeof Tabulator === 'undefined') return;

          let data = [];
          let columns = [];

          if (splitTab.value === 'chain') {
            data = chainList.value;
            columns = [
              {
                title: 'Mã CPS',
                field: 'docNo',
                minWidth: 140,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const code = r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '-'));
                  return '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + code + '</span>';
                }
              },
              {
                title: 'Mã CPSR',
                field: 'cpsr.docNo',
                minWidth: 160,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const doc = r.cpsr?.docNo || r.cpsrDocNo || '';
                  if (!doc) return '<span class="text-slate-400">-</span>';
                  return '<div class="flex items-center gap-1.5">' +
                    '<button class="btn-cps-view-cpsr font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer" title="Xem chi tiết CPSR ' + doc + '">' + doc + '</button>' +
                    '<button class="btn-cps-edit-cpsr p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer" title="Sửa CPSR ' + doc + '"><i class="fa-solid fa-pen-to-square"></i></button>' +
                  '</div>';
                },
                cellClick: (e, cell) => {
                  const r = toPlainObject(cell.getRow().getData());
                  const cpsrData = r.cpsr || { docNo: r.cpsrDocNo, ...r };
                  if (e.target.closest('.btn-cps-edit-cpsr')) {
                    e.stopPropagation();
                    openEditModal('cpsr', cpsrData);
                  } else if (e.target.closest('.btn-cps-view-cpsr')) {
                    e.stopPropagation();
                    openChainDetailModal({ cpsr: cpsrData });
                  }
                }
              },
              {
                title: 'Mã CPST',
                field: 'cpst.docNo',
                minWidth: 130,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const doc = r.cpst?.docNo || r.cpstDocNo;
                  if (!doc) return '<span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Chưa phản hồi</span>';
                  return '<span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">' + doc + '</span>';
                }
              },
              {
                title: 'Mã CPSF',
                field: 'cpsf.docNo',
                minWidth: 130,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const doc = r.cpsf?.docNo || r.cpsfDocNo;
                  if (!doc) return '<span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Chưa bàn giao</span>';
                  return '<span class="font-mono font-bold text-purple-700 dark:text-purple-400">' + doc + '</span>';
                }
              },
              {
                title: 'Trạng Thái Chuỗi',
                field: 'status',
                minWidth: 130,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const s = r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                  if (s === 'TO_ASSIGN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">⏳ TO_ASSIGN</span>';
                  if (s === 'IN_PROGRESS') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/30">⚡ IN_PROGRESS</span>';
                  if (s === 'OVER_DUE') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">⚠️ OVER_DUE</span>';
                  if (s === 'CLOSED') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">✅ CLOSED</span>';
                  if (s === 'OPEN_TASK') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30">📋 OPEN_TASK</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">' + s + '</span>';
                }
              },
              {
                title: 'Thời Gian',
                field: 'cpsr.reqDate',
                minWidth: 120,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const d = r.cpsr?.reqDate || r.reqDate || '';
                  const t = r.cpsr?.reqTime || r.reqTime || '';
                  return '<div class="text-[11px] text-slate-800 dark:text-slate-300 font-medium">' + d + ' <span class="font-mono text-slate-500 block text-[10px]">' + t + '</span></div>';
                }
              },
              {
                title: 'Người YC / Máy In',
                field: 'cpsr.reqBy',
                minWidth: 160,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const req = r.cpsr?.reqBy || r.reqBy || '';
                  const tech = r.cpsr?.printTech || r.printTech || '';
                  const mach = r.cpsr?.machineName || r.machineName || '';
                  return '<div><strong class="text-slate-900 dark:text-slate-100">' + req + '</strong><span class="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">' + tech + ' - ' + mach + '</span></div>';
                }
              },
              {
                title: 'Nhân Viên KT',
                field: 'assignedTo',
                minWidth: 140,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const name = formatTechnicianName(r.assignedToName || r.assignedTo || r.cpst?.recvBy);
                  if (!name) return '<span class="text-amber-600 dark:text-amber-400/80 italic text-[11px] font-semibold">Chưa giao</span>';
                  return '<div class="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"><i class="fa-solid fa-user-check text-[10px] text-emerald-600 dark:text-emerald-400"></i> ' + name + '</div>';
                }
              },
              {
                title: 'Deadline',
                field: 'deadline',
                minWidth: 120,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  if (!r.deadline) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return '<span class="font-mono text-[11px] text-sky-700 dark:text-sky-300 font-semibold">' + formatDateTimeDisplay(r.deadline) + '</span>';
                }
              },
              {
                title: 'Downtime',
                field: 'downtime',
                minWidth: 95,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const dt = r.downtime != null ? r.downtime : r.cpst?.downtime;
                  if (dt == null || dt === '') return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return '<span class="font-mono font-bold text-amber-700 dark:text-amber-400">' + dt + ' phút</span>';
                }
              },
              {
                title: 'Tỉ Lệ Phế',
                field: 'wastePercent',
                minWidth: 90,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const wp = r.wastePercent || r.cpsf?.wastePercent;
                  if (!wp) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return '<span class="font-mono font-bold text-rose-700 dark:text-rose-400">' + wp + '</span>';
                }
              },
              {
                title: 'Trạng Thái KT',
                field: 'cpst.chkStatus',
                minWidth: 110,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const s = r.chkStatus || r.cpst?.chkStatus || '';
                  if (!s) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  if (s === 'Đã khắc phục') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Đã khắc phục</span>';
                  if (s === 'Hư hỏng nặng') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">Hư hỏng nặng</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">' + s + '</span>';
                }
              },
              {
                title: 'Chất Lượng In',
                field: 'cpsf.chkQuality',
                minWidth: 90,
                hozAlign: 'center',
                formatter: cell => {
                  const r = cell.getRow().getData();
                  const q = r.chkQuality || r.cpsf?.chkQuality || '';
                  if (!q) return '<span class="text-slate-400 dark:text-slate-500">-</span>';
                  return q === 'Đạt' ? '<span class="text-emerald-700 dark:text-emerald-400 font-bold">ĐẠT</span>' : '<span class="text-rose-700 dark:text-rose-400 font-bold">CHƯA ĐẠT</span>';
                }
              },
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 320,
                headerSort: false,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  let h = '<div class="flex items-center justify-end gap-1">';
                  h += '<button class="btn-chain-assign px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 text-[11px] font-bold transition cursor-pointer" title="Phân công Technician"><i class="fa-solid fa-user-gear"></i> Giao</button>';
                  h += '<button class="btn-chain-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa phiếu CPS"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>';
                  h += '<button class="btn-chain-edit-cpsr px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPSR gốc"><i class="fa-solid fa-pen-to-square"></i> Sửa CPSR</button>';
                  h += '<button class="btn-chain-link px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 text-[11px] font-bold transition cursor-pointer" title="Ghép nối CPST/CPSF"><i class="fa-solid fa-link"></i> Ghép</button>';
                  h += '<button class="btn-chain-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold transition cursor-pointer" title="Xem chi tiết phiếu CPS"><i class="fa-solid fa-eye"></i></button>';
                  if (!r.cpst && !r.cpstDocNo) {
                    h += '<a href="/technical-feedback?cpsr=' + encodeURIComponent(r.cpsr?.docNo || r.cpsrDocNo || '') + '" target="_blank" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition cursor-pointer shadow-xs">+ CPST</a>';
                  } else if (!r.cpsf && !r.cpsfDocNo) {
                    h += '<a href="/confirm-request?cpst=' + encodeURIComponent(r.cpst?.docNo || r.cpstDocNo || '') + '" target="_blank" class="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition cursor-pointer shadow-xs">+ CPSF</a>';
                  }
                  h += '<button class="btn-chain-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa phiếu CPS"><i class="fa-solid fa-trash-can"></i></button>';
                  h += '</div>';
                  return h;
                },
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-chain-assign')) {
                    openAssignModal(r);
                  } else if (e.target.closest('.btn-chain-edit')) {
                    openEditModal('cps', r);
                  } else if (e.target.closest('.btn-chain-edit-cpsr')) {
                    const cpsrData = r.cpsr || { docNo: r.cpsrDocNo, ...r };
                    openEditModal('cpsr', cpsrData);
                  } else if (e.target.closest('.btn-chain-link')) {
                    openLinkModal(r);
                  } else if (e.target.closest('.btn-chain-view')) {
                    openChainDetailModal(r);
                  } else if (e.target.closest('.btn-chain-del')) {
                    deleteCpsRecord(r);
                  }
                }
              }
            ];
          } else if (splitTab.value === 'cpsr') {
            data = Array.isArray(cpsrList.value) ? cpsrList.value : (Array.isArray(cpsrList.value?.data) ? cpsrList.value.data : []);
            columns = [
              { title: 'Số Phiếu', field: 'docNo', minWidth: 140, formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Ngày Giờ', field: 'reqDate', minWidth: 120, formatter: cell => { const r = cell.getRow().getData(); return r.reqDate + ' ' + (r.reqTime || ''); } },
              { title: 'Người Yêu Cầu', field: 'reqBy', minWidth: 150 },
              { title: 'Công Nghệ / Máy', field: 'machineName', minWidth: 150, formatter: cell => { const r = cell.getRow().getData(); return (r.printTech || '') + ' - ' + (r.machineName || ''); } },
              { title: 'Mô Tả Sự Cố', field: 'problem', minWidth: 180, formatter: cell => '<span class="truncate block max-w-xs">' + (cell.getValue() || '') + '</span>' },
              { title: 'Trạng Thái', field: 'machineStatus', minWidth: 120, hozAlign: 'center', formatter: cell => '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">' + (cell.getValue() || '-') + '</span>' },
              { title: 'Mức Ưu Tiên', field: 'priority', minWidth: 110, hozAlign: 'center', formatter: cell => {
                const p = cell.getValue() || '';
                return p === 'Hỗ trợ ngay' ? '<span class="text-rose-700 dark:text-rose-400 font-bold">Hỗ trợ ngay</span>' : (p === 'Chạy tạm' ? '<span class="text-amber-700 dark:text-amber-400 font-bold">Chạy tạm</span>' : '<span class="text-slate-600 dark:text-slate-400">' + p + '</span>');
              }},
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 180,
                headerSort: false,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  return '<div class="flex items-center justify-end gap-1.5">' +
                    '<button class="btn-split-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPSR"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>' +
                    '<button class="btn-split-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                    '<a href="/technical-feedback?cpsr=' + encodeURIComponent(r.docNo) + '" target="_blank" class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs">+ CPST</a>' +
                    '<button class="btn-split-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa CPSR"><i class="fa-solid fa-trash-can"></i></button>' +
                  '</div>';
                },
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-split-edit')) openEditModal('cpsr', r);
                  else if (e.target.closest('.btn-split-view')) openChainDetailModal({ cpsr: r });
                  else if (e.target.closest('.btn-split-del')) deleteSplitRecord('cpsr', r.docNo || r.id);
                }
              }
            ];
          } else if (splitTab.value === 'cpst') {
            data = Array.isArray(cpstList.value) ? cpstList.value : (Array.isArray(cpstList.value?.data) ? cpstList.value.data : []);
            columns = [
              { title: 'Số Phiếu', field: 'docNo', minWidth: 140, formatter: cell => '<span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Mã CPSR Gốc', field: 'cpsrDocNo', minWidth: 140, formatter: cell => '<span class="font-mono text-sky-700 dark:text-sky-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Technician Tiếp Nhận', field: 'recvBy', minWidth: 140, formatter: cell => formatTechnicianName(cell.getValue()) },
              { title: 'Trạng Thái', field: 'chkStatus', minWidth: 120, hozAlign: 'center', formatter: cell => {
                const s = cell.getValue() || '';
                return s === 'Đã khắc phục' ? '<span class="text-emerald-700 dark:text-emerald-400 font-bold">Đã khắc phục</span>' : (s === 'Hư hỏng nặng' ? '<span class="text-rose-700 dark:text-rose-400 font-bold">Hư hỏng nặng</span>' : '<span class="text-amber-700 dark:text-amber-400 font-bold">' + s + '</span>');
              }},
              { title: 'Nguyên Nhân Gốc', field: 'rootCause', minWidth: 160, formatter: cell => '<span class="truncate block max-w-xs">' + (cell.getValue() || '') + '</span>' },
              { title: 'Hành Động Khắc Phục', field: 'actionTaken', minWidth: 160, formatter: cell => '<span class="truncate block max-w-xs">' + (cell.getValue() || '') + '</span>' },
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 180,
                headerSort: false,
                formatter: cell => {
                  const r = cell.getRow().getData();
                  return '<div class="flex items-center justify-end gap-1.5">' +
                    '<button class="btn-split-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPST"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>' +
                    '<button class="btn-split-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                    '<a href="/confirm-request?cpst=' + encodeURIComponent(r.docNo) + '" target="_blank" class="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs">+ CPSF</a>' +
                    '<button class="btn-split-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa CPST"><i class="fa-solid fa-trash-can"></i></button>' +
                  '</div>';
                },
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-split-edit')) openEditModal('cpst', r);
                  else if (e.target.closest('.btn-split-view')) openChainDetailModal({ cpst: r, cpsr: { docNo: r.cpsrDocNo } });
                  else if (e.target.closest('.btn-split-del')) deleteSplitRecord('cpst', r.docNo || r.id);
                }
              }
            ];
          } else if (splitTab.value === 'cpsf') {
            data = Array.isArray(cpsfList.value) ? cpsfList.value : (Array.isArray(cpsfList.value?.data) ? cpsfList.value.data : []);
            columns = [
              { title: 'Số Phiếu', field: 'docNo', minWidth: 140, formatter: cell => '<span class="font-mono font-bold text-purple-700 dark:text-purple-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Mã CPST', field: 'cpstDocNo', minWidth: 140, formatter: cell => '<span class="font-mono text-emerald-700 dark:text-emerald-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Chất Lượng', field: 'chkQuality', minWidth: 100, hozAlign: 'center', formatter: cell => (cell.getValue() === 'Đạt' ? '<span class="text-emerald-700 dark:text-emerald-400 font-bold">ĐẠT</span>' : '<span class="text-rose-700 dark:text-rose-400 font-bold">CHƯA ĐẠT</span>') },
              { title: 'Work Order', field: 'workOrder', minWidth: 110, formatter: cell => '<span class="font-mono">' + (cell.getValue() || '-') + '</span>' },
              { title: 'Tổng SL', field: 'woTotalQty', minWidth: 90, hozAlign: 'right', formatter: cell => Number(cell.getValue() || 0).toLocaleString() },
              { title: 'Phế & Tỷ Lệ', field: 'wasteQty', minWidth: 110, hozAlign: 'right', formatter: cell => { const r = cell.getRow().getData(); return r.wasteQty + ' (' + (r.wastePercent || '0%') + ')'; } },
              { title: 'Đơn Vị', field: 'wasteUnit', minWidth: 70, hozAlign: 'center' },
              { title: 'Đại Diện SX', field: 'prodMgr', minWidth: 140 },
              {
                title: 'Thao Tác',
                hozAlign: 'right',
                minWidth: 140,
                headerSort: false,
                formatter: () => '<div class="flex items-center justify-end gap-1.5">' +
                  '<button class="btn-split-edit px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[11px] font-bold transition cursor-pointer" title="Chỉnh sửa CPSF"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>' +
                  '<button class="btn-split-view px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 border border-slate-300 dark:border-slate-700 text-[11px] font-bold" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                  '<button class="btn-split-del p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer" title="Xóa CPSF"><i class="fa-solid fa-trash-can"></i></button>' +
                '</div>',
                cellClick: (e, cell) => {
                  e.stopPropagation();
                  const r = toPlainObject(cell.getRow().getData());
                  if (e.target.closest('.btn-split-edit')) openEditModal('cpsf', r);
                  else if (e.target.closest('.btn-split-view')) openChainDetailModal({ cpsf: r, cpst: { docNo: r.cpstDocNo }, cpsr: { docNo: r.cpsrDocNo } });
                  else if (e.target.closest('.btn-split-del')) deleteSplitRecord('cpsf', r.docNo || r.id);
                }
              }
            ];
          }

          const rawData = toPlainObject(data) || [];

          if (splitTable) {
            try {
              splitTable.setColumns(columns);
              splitTable.setData(rawData);
              applySplitFilters();
              safeRedraw(splitTable);
              return;
            } catch (_) {
              safeDestroy(splitTable);
              splitTable = null;
            }
          }

          try {
            splitTable = new Tabulator('#tabulator-split-forms', {
              data: rawData,
              layout: 'fitDataStretch',
              responsiveLayout: false,
              renderHorizontal: 'virtual',
              renderVertical: 'virtual',
              pagination: 'local',
              paginationSize: 10,
              paginationSizeSelector: [10, 20, 50, 100],
              placeholder: '<span>Không có dữ liệu trong bảng này</span>',
              columns: columns
            });
            if (window.__CP_DEBUG__) {
              window.__CP_DEBUG__.markMounted('split-tables', 'mounted');
              window.__CP_DEBUG__.log('Tabulator', 'splitTable mounted');
            }

            splitTable.on('rowDblClick', (e, row) => {
              try { openChainDetailModal(toPlainObject(row.getData())); } catch (_) {}
            });

            applySplitFilters();
          } catch (err) {
            console.warn('Tabulator split forms init error:', err);
          }
        };

        let splitFilterTimer = null;
        const debouncedApplySplitFilters = () => {
          if (splitFilterTimer) clearTimeout(splitFilterTimer);
          splitFilterTimer = setTimeout(() => {
            applySplitFilters();
          }, 150);
        };

        const applySplitFilters = () => {
          if (!splitTable) return;
          try {
            splitTable.clearFilter();
            const filters = [];
          const q = (splitFilter.value.search || '').trim().toLowerCase();
          const st = splitFilter.value.status;

          if (q) {
            if (splitTab.value === 'chain') {
              filters.push([
                { field: 'docNo', type: 'like', value: q },
                { field: 'cpsr.docNo', type: 'like', value: q },
                { field: 'cpsrDocNo', type: 'like', value: q },
                { field: 'cpst.docNo', type: 'like', value: q },
                { field: 'cpstDocNo', type: 'like', value: q },
                { field: 'cpsf.docNo', type: 'like', value: q },
                { field: 'cpsfDocNo', type: 'like', value: q },
                { field: 'cpsr.reqBy', type: 'like', value: q },
                { field: 'reqBy', type: 'like', value: q },
                { field: 'cpsr.machineName', type: 'like', value: q },
                { field: 'machineName', type: 'like', value: q },
                { field: 'problem', type: 'like', value: q },
                { field: 'assignedTo', type: 'like', value: q }
              ]);
            } else {
              filters.push([
                { field: 'docNo', type: 'like', value: q },
                { field: 'reqBy', type: 'like', value: q },
                { field: 'recvBy', type: 'like', value: q },
                { field: 'prodMgr', type: 'like', value: q },
                { field: 'machineName', type: 'like', value: q }
              ]);
            }
          }

          if (st && st !== 'ALL') {
            if (splitTab.value === 'chain') {
              filters.push({
                field: 'id',
                type: (h, r, rowData) => {
                  if (st === 'TO_ASSIGN' || st === 'IN_PROGRESS' || st === 'OVER_DUE' || st === 'CLOSED' || st === 'OPEN_TASK') {
                    const rowStatus = rowData.status || (rowData.cpsf ? 'CLOSED' : (rowData.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN'));
                    return rowStatus === st;
                  }
                  const count = ((rowData.cpsr || rowData.cpsrDocNo) ? 1 : 0) + ((rowData.cpst || rowData.cpstDocNo) ? 1 : 0) + ((rowData.cpsf || rowData.cpsfDocNo) ? 1 : 0);
                  if (st === '3/3') return count === 3;
                  if (st === '2/3') return count === 2;
                  if (st === '1/3') return count === 1;
                  return true;
                },
                value: st
              });
            } else if (splitTab.value === 'cpsr') {
              filters.push({ field: 'machineStatus', type: '=', value: st });
            } else if (splitTab.value === 'cpst') {
              filters.push({ field: 'chkStatus', type: '=', value: st });
            } else if (splitTab.value === 'cpsf') {
              filters.push({ field: 'chkQuality', type: '=', value: st });
            }
          }

          if (filters.length > 0) splitTable.setFilter(filters);
          } catch (err) {
            console.warn('Tabulator split filter error:', err);
          }
        };

        const openChainDetailModal = async (data) => {
          if (!data) return;
          if (data.cpsr && (data.cpst !== undefined || data.cpsf !== undefined)) {
            selectedChain.value = data;
          } else {
            const doc = data.docNo || data.cpsrDocNo || data.cpsr?.docNo;
            const found = (chainList.value || []).find(c => c.cpsr?.docNo === doc || c.cpsrDocNo === doc || c.docNo === doc || c.cpst?.docNo === doc || c.cpsf?.docNo === doc);
            if (found) {
              selectedChain.value = found;
            } else {
              const currentCpsrList = Array.isArray(cpsrList.value) ? cpsrList.value : (Array.isArray(cpsrList.value?.data) ? cpsrList.value.data : []);
              const cpsrItem = data.cpsr || currentCpsrList.find(r => r && (r.docNo === doc || r.id === doc)) || data;
              selectedChain.value = { cpsr: cpsrItem, cpst: data.cpst || null, cpsf: data.cpsf || null };
            }
          }

          // Ensure cpst has photos loaded if available
          const cpstDoc = selectedChain.value?.cpst?.docNo || selectedChain.value?.cpstDocNo || data.cpstDocNo || data.cpst?.docNo;
          if (cpstDoc) {
            const allCpst = Array.isArray(cpstList.value) ? cpstList.value : (Array.isArray(cpstList.value?.data) ? cpstList.value.data : []);
            const foundT = allCpst.find(t => t && (t.docNo === cpstDoc || t.id === cpstDoc || t.cpsrDocNo === selectedChain.value?.cpsr?.docNo));
            if (foundT) {
              selectedChain.value = {
                ...selectedChain.value,
                cpst: { ...foundT, ...(selectedChain.value.cpst || {}) }
              };
            }
          }

          showChainModal.value = true;
        };

        const deleteSplitRecord = async (type, id) => {
          if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
          try {
            const res = await fetch('/api/' + type + '/' + id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa thành công!');
              await loadAllSplitData();
            } else {
              showToast('Xóa thất bại', true);
            }
          } catch(e) {
            showToast('Lỗi khi xóa: ' + e.message, true);
          }
        };

        const exportCurrentTabExcel = () => {
          let rows = [];
          let filename = 'Checkpoint_';
          if (splitTab.value === 'chain') {
            filename += 'Chain_1-1-1';
            rows = chainList.value.map(r => ({
              'Mã CPS': r.docNo || (r.cpsr?.docNo ? r.cpsr.docNo.replace('CPSR-', 'CPS-') : (r.cpsrDocNo ? r.cpsrDocNo.replace('CPSR-', 'CPS-') : '')),
              'Mã CPSR': r.cpsr?.docNo || r.cpsrDocNo || '',
              'Mã CPST': r.cpst?.docNo || r.cpstDocNo || 'Chưa phản hồi',
              'Mã CPSF': r.cpsf?.docNo || r.cpsfDocNo || 'Chưa bàn giao',
              'Trạng Thái Chuỗi': r.status || (r.cpsf ? 'CLOSED' : (r.cpst ? 'IN_PROGRESS' : 'TO_ASSIGN')),
              'Ngày Yêu Cầu': r.cpsr?.reqDate || r.reqDate || '',
              'Giờ Yêu Cầu': r.cpsr?.reqTime || r.reqTime || '',
              'Người Yêu Cầu': r.cpsr?.reqBy || r.reqBy || '',
              'Công Nghệ': r.cpsr?.printTech || r.printTech || '',
              'Tên Máy': r.cpsr?.machineName || r.machineName || '',
              'Sự Cố': r.cpsr?.problem || r.problem || '',
              'Nhân Viên KT': formatTechnicianName(r.assignedToName || r.assignedTo || r.cpst?.recvBy || '') || '-',
              'Deadline': r.deadline || '-',
              'Downtime (Phút)': r.downtime != null ? r.downtime : (r.cpst?.downtime != null ? r.cpst.downtime : '-'),
              'Tỉ Lệ Phế': r.wastePercent || r.cpsf?.wastePercent || '-',
              'Technician Tiếp Nhận': formatTechnicianName(r.cpst?.recvBy || r.assignedToName || r.assignedTo || '') || '-',
              'Trạng Thái KT': r.cpst?.chkStatus || r.chkStatus || '-',
              'Chất Lượng In': r.cpsf?.chkQuality || r.chkQuality || '-',
              'Work Order': r.cpsf?.workOrder || r.workOrder || '-'
            }));
          } else if (splitTab.value === 'cpsr') {
            filename += 'CPSR';
            rows = Array.isArray(cpsrList.value) ? cpsrList.value : (Array.isArray(cpsrList.value?.data) ? cpsrList.value.data : []);
          } else if (splitTab.value === 'cpst') {
            filename += 'CPST';
            rows = Array.isArray(cpstList.value) ? cpstList.value : (Array.isArray(cpstList.value?.data) ? cpstList.value.data : []);
          } else if (splitTab.value === 'cpsf') {
            filename += 'CPSF';
            rows = Array.isArray(cpsfList.value) ? cpsfList.value : (Array.isArray(cpsfList.value?.data) ? cpsfList.value.data : []);
          }

          if (rows.length === 0) {
            showToast('Không có dữ liệu để xuất', true);
            return;
          }

          try {
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, splitTab.value.toUpperCase());
            XLSX.writeFile(wb, filename + '_' + new Date().toISOString().slice(0, 10) + '.xlsx');
            showToast('Đã xuất Excel thành công!');
          } catch(e) {
            showToast('Lỗi xuất Excel: ' + e.message, true);
          }
        };

        // =====================================================================
        // TABULATOR: 1. REQUESTS TABLE
        // =====================================================================
        const initOrUpdateRequestsTable = () => {
          const el = document.getElementById('tabulator-requests');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!reqTable) {
              reqTable = new Tabulator('#tabulator-requests', {
                data: Array.isArray(requestsList.value) ? requestsList.value : [],
              layout: 'fitColumns',
              responsiveLayout: 'collapse',
              pagination: 'local',
              paginationSize: 10,
              paginationSizeSelector: [10, 20, 50, 100],
              placeholder: '<span>Không có dữ liệu phiếu yêu cầu kỹ thuật</span>',
              columns: [
                {
                  title: 'Số Phiếu',
                  field: 'docNo',
                  sorter: 'string',
                  minWidth: 120,
                  formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Thời Gian',
                  field: 'reqDate',
                  sorter: 'string',
                  minWidth: 130,
                  formatter: cell => {
                    const r = cell.getRow().getData();
                    return '<div class="text-slate-700 dark:text-slate-300 font-medium">' + (r.reqDate || '') + ' <span class="font-mono text-[10px] text-slate-400 block">' + (r.reqTime || '') + '</span></div>';
                  }
                },
                {
                  title: 'Công Nghệ / Máy',
                  field: 'machineName',
                  sorter: 'string',
                  minWidth: 160,
                  formatter: cell => {
                    const r = cell.getRow().getData();
                    return '<div><span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono mr-1 font-bold text-slate-600 dark:text-slate-300">' + (r.printTech || 'OTHER') + '</span> <strong class="text-slate-900 dark:text-white">' + (r.machineName || '') + '</strong></div>';
                  }
                },
                {
                  title: 'Người Yêu Cầu',
                  field: 'reqBy',
                  sorter: 'string',
                  minWidth: 120
                },
                {
                  title: 'Sự Cố',
                  field: 'problem',
                  minWidth: 180,
                  formatter: cell => '<span class="truncate block max-w-xs" title="' + String(cell.getValue() || '').replace(/"/g, '&quot;') + '">' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Downtime',
                  field: 'downtime',
                  sorter: 'number',
                  hozAlign: 'center',
                  minWidth: 90,
                  formatter: cell => {
                    const v = Number(cell.getValue() || 0);
                    return '<span class="font-mono font-bold ' + (v > 0 ? 'text-red-500' : 'text-slate-400') + '">' + v + 'm</span>';
                  }
                },
                {
                  title: 'Trạng Thái',
                  field: 'chkStatus',
                  sorter: 'string',
                  hozAlign: 'center',
                  minWidth: 120,
                  editor: 'select',
                  editorParams: {
                    values: ['Open', 'In Progress', 'Overdue', 'Closed']
                  },
                  cellEdited: (cell) => {
                    const r = cell.getRow().getData();
                    updateTicketStatus(r, cell.getValue());
                  },
                  formatter: cell => {
                    const s = cell.getValue() || cell.getRow().getData().status || 'Open';
                    const lower = String(s).toLowerCase();
                    if (lower === 'open') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Open</span>';
                    if (lower === 'in progress' || lower === 'monitor') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">In Progress</span>';
                    if (lower === 'overdue' || lower === 'support') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Overdue</span>';
                    if (lower === 'closed' || lower === 'done' || lower === 'completed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Closed</span>';
                    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">' + s + '</span>';
                  }
                },
                {
                  title: 'Thao Tác',
                  hozAlign: 'right',
                  minWidth: 90,
                  headerSort: false,
                  formatter: () => {
                    return '<div class="flex items-center justify-end gap-1">' +
                      '<button class="btn-ticket-view p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>' +
                      '<button class="btn-ticket-delete p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa phiếu"><i class="fa-solid fa-trash-can"></i></button>' +
                    '</div>';
                  },
                  cellClick: (e, cell) => {
                    const target = e.target.closest('button');
                    if (!target) return;
                    const r = cell.getRow().getData();
                    if (target.classList.contains('btn-ticket-view') || target.closest('.btn-ticket-view')) {
                      viewTicketDetail(r);
                    } else if (target.classList.contains('btn-ticket-delete') || target.closest('.btn-ticket-delete')) {
                      deleteRequest(r);
                    }
                  }
                }
              ]
            });
            reqTable.on('rowDblClick', (e, row) => {
              try { viewTicketDetail(row.getData()); } catch (_) {}
            });
            if (window.__CP_DEBUG__) {
              window.__CP_DEBUG__.markMounted('requests-table', 'mounted');
              window.__CP_DEBUG__.log('Tabulator', 'reqTable mounted');
            }
          } else {
            reqTable.setData(Array.isArray(requestsList.value) ? requestsList.value : []);
            safeRedraw(reqTable);
          }
          applyReqFilters();
        } catch (err) {
          console.warn('Tabulator requests table error:', err);
        }
      };

      const applyReqFilters = () => {
        if (!reqTable) return;
        try {
          reqTable.clearFilter();
          const filters = [];
          if (reqFilter.value.chkStatus && reqFilter.value.chkStatus !== 'ALL') {
            const fVal = reqFilter.value.chkStatus.toLowerCase();
            filters.push({
              field: 'chkStatus',
              type: (headerValue, rowValue, rowData) => {
                const s = String(rowData.chkStatus || rowData.status || '').toLowerCase();
                if (fVal === 'closed') return s === 'closed' || s === 'done';
                if (fVal === 'in progress') return s === 'in progress' || s === 'monitor';
                if (fVal === 'overdue') return s === 'overdue' || s === 'support';
                return s === fVal;
              },
              value: reqFilter.value.chkStatus
            });
          }
          if (reqFilter.value.printTech && reqFilter.value.printTech !== 'ALL') {
            filters.push({ field: 'printTech', type: '=', value: reqFilter.value.printTech });
          }
          if (reqFilter.value.priority && reqFilter.value.priority !== 'ALL') {
            filters.push({ field: 'priority', type: '=', value: reqFilter.value.priority });
          }
          if (reqFilter.value.search) {
            const q = reqFilter.value.search.trim().toLowerCase();
            filters.push([
              { field: 'docNo', type: 'like', value: q },
              { field: 'machineName', type: 'like', value: q },
              { field: 'reqBy', type: 'like', value: q },
              { field: 'problem', type: 'like', value: q }
            ]);
          }
          if (filters.length > 0) reqTable.setFilter(filters);
        } catch (err) {
          console.warn('Tabulator req filter error:', err);
        }
      };

        // =====================================================================
        // TABULATOR: 2. MACHINES TABLE
        // =====================================================================
        const initOrUpdateMachinesTable = () => {
          const el = document.getElementById('tabulator-machines');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!machinesTable) {
              machinesTable = new Tabulator('#tabulator-machines', {
                data: Array.isArray(machinesFlatList.value) ? machinesFlatList.value : [],
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 10,
                paginationSizeSelector: [10, 25, 50],
                placeholder: '<span>Không có dữ liệu máy móc</span>',
                columns: [
                  { title: 'STT', formatter: 'rownum', hozAlign: 'center', width: 60, headerSort: false },
                  {
                    title: 'Công Nghệ In / Phân Xưởng',
                    field: 'tech',
                    sorter: 'string',
                    minWidth: 160,
                    formatter: cell => '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Tên Máy / Thiết Bị',
                    field: 'name',
                    sorter: 'string',
                    minWidth: 180,
                    formatter: cell => '<span class="font-bold text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Mã Thiết Bị',
                    field: 'code',
                    sorter: 'string',
                    minWidth: 120,
                    formatter: cell => '<span class="font-mono text-slate-500">' + (cell.getValue() || '—') + '</span>'
                  },
                  {
                    title: 'Trạng Thái',
                    field: 'isActive',
                    hozAlign: 'center',
                    minWidth: 120,
                    formatter: () => '<span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Hoạt động</span>'
                  },
                  {
                    title: 'Thao Tác',
                    hozAlign: 'right',
                    minWidth: 90,
                    headerSort: false,
                    formatter: () => '<button class="btn-machine-delete p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa máy này"><i class="fa-solid fa-trash-can"></i></button>',
                    cellClick: (e, cell) => {
                      const target = e.target.closest('.btn-machine-delete');
                      if (!target) return;
                      deleteMachineItem(cell.getRow().getData());
                    }
                  }
                ]
              });
            } else {
              machinesTable.setData(Array.isArray(machinesFlatList.value) ? machinesFlatList.value : []);
              safeRedraw(machinesTable);
            }
            applyMachineFilters();
            if (window.__CP_DEBUG__) {
              window.__CP_DEBUG__.markMounted('master-tables', 'mounted');
              window.__CP_DEBUG__.log('Tabulator', 'machinesTable mounted');
            }
          } catch (err) {
            console.warn('Tabulator machines table error:', err);
          }
        };

        const applyMachineFilters = () => {
          if (!machinesTable) return;
          try {
            machinesTable.clearFilter();
            const filters = [];
            if (machineTechFilter.value && machineTechFilter.value !== 'ALL') {
              filters.push({ field: 'tech', type: '=', value: machineTechFilter.value });
            }
            if (machineSearch.value) {
              const q = machineSearch.value.trim().toLowerCase();
              filters.push([
                { field: 'name', type: 'like', value: q },
                { field: 'code', type: 'like', value: q },
                { field: 'tech', type: 'like', value: q }
              ]);
            }
            if (filters.length > 0) machinesTable.setFilter(filters);
          } catch (err) {
            console.warn('Tabulator machine filter error:', err);
          }
        };

        // =====================================================================
        // TABULATOR: 3. EMPLOYEES TABLE
        // =====================================================================
        const initOrUpdateEmployeesTable = () => {
          const el = document.getElementById('tabulator-employees');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!empTable) {
              empTable = new Tabulator('#tabulator-employees', {
                data: Array.isArray(employeesList.value) ? employeesList.value : [],
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 10,
                paginationSizeSelector: [10, 25, 50, 100],
                placeholder: '<span>Không có dữ liệu nhân sự</span>',
                columns: [
                  {
                    title: 'Mã NV',
                    field: 'mnv',
                    sorter: 'string',
                    minWidth: 100,
                    formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '—') + '</span>'
                  },
                  {
                    title: 'Họ và Tên',
                    field: 'name',
                    sorter: 'string',
                    minWidth: 160,
                    formatter: cell => '<span class="font-semibold text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Bộ Phận / Phòng Ban',
                    field: 'dept',
                    sorter: 'string',
                    minWidth: 140,
                    formatter: cell => '<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">' + (cell.getValue() || '') + '</span>'
                  },
                  {
                    title: 'Khu Vực / Chuyền',
                    field: 'area',
                    sorter: 'string',
                    minWidth: 140,
                    formatter: cell => '<span class="text-slate-500">' + (cell.getValue() || '—') + '</span>'
                  },
                  {
                    title: 'Chức Vụ',
                    field: 'role',
                    sorter: 'string',
                    minWidth: 120,
                    formatter: cell => '<span class="text-slate-500">' + (cell.getValue() || 'Staff') + '</span>'
                  },
                  {
                    title: 'Thao Tác',
                    hozAlign: 'right',
                    minWidth: 80,
                    headerSort: false,
                    formatter: () => '<button class="btn-emp-delete p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa nhân viên"><i class="fa-solid fa-trash-can"></i></button>',
                    cellClick: (e, cell) => {
                      const target = e.target.closest('.btn-emp-delete');
                      if (!target) return;
                      deleteEmployee(cell.getRow().getData());
                    }
                  }
                ]
              });
            } else {
              empTable.setData(Array.isArray(employeesList.value) ? employeesList.value : []);
              safeRedraw(empTable);
            }
            applyEmpFilters();
          } catch (err) {
            console.warn('Tabulator employees table error:', err);
          }
        };

        const applyEmpFilters = () => {
          if (!empTable) return;
          try {
            empTable.clearFilter();
            const filters = [];
            if (empDeptFilter.value && empDeptFilter.value !== 'ALL') {
              filters.push({ field: 'dept', type: '=', value: empDeptFilter.value });
            }
            if (empSearch.value) {
              const q = empSearch.value.trim().toLowerCase();
              filters.push([
                { field: 'name', type: 'like', value: q },
                { field: 'mnv', type: 'like', value: q },
                { field: 'area', type: 'like', value: q }
              ]);
            }
            if (filters.length > 0) empTable.setFilter(filters);
          } catch (err) {
            console.warn('Tabulator emp filter error:', err);
          }
        };

        // =====================================================================
        // TABULATOR: 4. USERS & PERMISSIONS TABLE
        // =====================================================================
        const initOrUpdateUsersTable = () => {
          const el = document.getElementById('tabulator-users');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          try {
            if (!usersTable) {
              usersTable = new Tabulator('#tabulator-users', {
                data: Array.isArray(usersList.value) ? usersList.value : [],
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 10,
                paginationSizeSelector: [10, 25, 50],
                placeholder: '<span>Không có dữ liệu tài khoản</span>',
                columns: [
                {
                  title: 'Tên Đăng Nhập',
                  field: 'username',
                  sorter: 'string',
                  minWidth: 130,
                  formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">@' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Họ và Tên',
                  field: 'fullName',
                  sorter: 'string',
                  minWidth: 150,
                  formatter: cell => '<span class="font-semibold text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</span>'
                },
                {
                  title: 'Email',
                  field: 'email',
                  sorter: 'string',
                  minWidth: 160,
                  formatter: cell => '<span class="font-mono text-slate-400 text-xs">' + (cell.getValue() || '—') + '</span>'
                },
                {
                  title: 'Vai Trò',
                  field: 'role',
                  sorter: 'string',
                  minWidth: 110,
                  hozAlign: 'center',
                  formatter: cell => {
                    const r = cell.getValue();
                    if (r === 'ADMIN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">ADMIN</span>';
                    if (r === 'TECHNICIAN') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">TECHNICIAN</span>';
                    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">EMPLOYEE</span>';
                  }
                },
                {
                  title: 'Phân Quyền Chi Tiết (Tạo phiếu / Xem KPI / Admin)',
                  minWidth: 320,
                  headerSort: false,
                  formatter: cell => {
                    const u = cell.getRow().getData();
                    const canReq = getUserPerm(u, 'canCreateRequest');
                    const canKpi = getUserPerm(u, 'canViewKpi');
                    const canCp = getUserPerm(u, 'canAccessControlPanel');
                    const isAdmin = u.username === 'admin';
                    return '<div class="flex items-center gap-3 text-[11px]">' +
                      '<label class="inline-flex items-center gap-1.5 cursor-pointer select-none">' +
                        '<input type="checkbox" data-perm="canCreateRequest" ' + (canReq ? 'checked' : '') + ' ' + (isAdmin ? 'disabled' : '') + ' class="perm-chk rounded text-sky-600 h-3.5 w-3.5 cursor-pointer" />' +
                        '<span class="text-slate-700 dark:text-slate-300">Tạo phiếu</span>' +
                      '</label>' +
                      '<label class="inline-flex items-center gap-1.5 cursor-pointer select-none">' +
                        '<input type="checkbox" data-perm="canViewKpi" ' + (canKpi ? 'checked' : '') + ' ' + (isAdmin ? 'disabled' : '') + ' class="perm-chk rounded text-emerald-600 h-3.5 w-3.5 cursor-pointer" />' +
                        '<span class="text-slate-700 dark:text-slate-300">Xem KPI</span>' +
                      '</label>' +
                      '<label class="inline-flex items-center gap-1.5 cursor-pointer select-none">' +
                        '<input type="checkbox" data-perm="canAccessControlPanel" ' + (canCp ? 'checked' : '') + ' ' + (isAdmin ? 'disabled' : '') + ' class="perm-chk rounded text-amber-600 h-3.5 w-3.5 cursor-pointer" />' +
                        '<span class="font-bold text-amber-600 dark:text-amber-400">Admin CP</span>' +
                      '</label>' +
                    '</div>';
                  },
                  cellClick: (e, cell) => {
                    if (e.target && e.target.classList.contains('perm-chk')) {
                      const u = cell.getRow().getData();
                      const permKey = e.target.getAttribute('data-perm');
                      toggleUserPerm(u, permKey, e.target.checked);
                    }
                  }
                },
                {
                  title: 'Trạng Thái',
                  field: 'isActive',
                  hozAlign: 'center',
                  minWidth: 100,
                  formatter: cell => {
                    const active = cell.getValue();
                    return '<span class="inline-flex items-center gap-1.5 text-[11px] font-bold ' + (active ? 'text-emerald-500' : 'text-red-500') + '">' +
                      '<span class="w-2 h-2 rounded-full ' + (active ? 'bg-emerald-500' : 'bg-red-500') + '"></span>' +
                      (active ? 'Kích hoạt' : 'Tạm khóa') +
                    '</span>';
                  }
                },
                {
                  title: 'Thao Tác',
                  hozAlign: 'right',
                  minWidth: 80,
                  headerSort: false,
                  formatter: cell => {
                    const u = cell.getRow().getData();
                    if (u.username === 'admin') return '';
                    return '<button class="btn-user-delete p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer" title="Xóa tài khoản"><i class="fa-solid fa-trash-can"></i></button>';
                  },
                  cellClick: (e, cell) => {
                    const target = e.target.closest('.btn-user-delete');
                    if (!target) return;
                    deleteUser(cell.getRow().getData());
                  }
                }
              ]
            });
          } else {
            usersTable.setData(Array.isArray(usersList.value) ? usersList.value : []);
            safeRedraw(usersTable);
          }
          applyUserFilters();
        } catch (err) {
          console.warn('Tabulator users table error:', err);
        }
      };

      const applyUserFilters = () => {
        if (!usersTable) return;
        try {
          usersTable.clearFilter();
          const filters = [];
          if (userRoleFilter.value && userRoleFilter.value !== 'ALL') {
            filters.push({ field: 'role', type: '=', value: userRoleFilter.value });
          }
          if (userSearch.value) {
            const q = userSearch.value.trim().toLowerCase();
            filters.push([
              { field: 'username', type: 'like', value: q },
              { field: 'fullName', type: 'like', value: q },
              { field: 'email', type: 'like', value: q }
            ]);
          }
          if (filters.length > 0) usersTable.setFilter(filters);
        } catch (err) {
          console.warn('Tabulator user filter error:', err);
        }
      };

        // =====================================================================
        // TABULATOR: 5. EXISTING DATASETS MANAGEMENT
        // =====================================================================
        const getDatasetColumns = (type) => {
          if (type === 'weekly-requests') {
            return [
              { title: 'STT', formatter: 'rownum', width: 60, hozAlign: 'center', headerSort: false },
              {
                title: 'Mã / Người Yêu Cầu',
                field: 'requestId',
                sorter: 'string',
                minWidth: 160,
                formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>'
              },
              { title: 'Loại Yêu Cầu', field: 'requestType', sorter: 'string', minWidth: 130 },
              {
                title: 'Thiết Bị',
                field: 'itemEquipment',
                sorter: 'string',
                minWidth: 110,
                formatter: cell => '<span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold">' + (cell.getValue() || '') + '</span>'
              },
              {
                title: 'Mức Độ',
                field: 'severity',
                sorter: 'string',
                minWidth: 100,
                hozAlign: 'center',
                formatter: cell => {
                  const v = cell.getValue();
                  if (v === 'Critical') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-500 border border-red-500/30">Critical</span>';
                  if (v === 'High') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">High</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-500 border border-sky-500/30">' + (v || 'Normal') + '</span>';
                }
              },
              {
                title: 'Trạng Thái',
                field: 'status',
                sorter: 'string',
                minWidth: 110,
                hozAlign: 'center',
                editor: 'select',
                editorParams: {
                  values: ['Open', 'In Progress', 'Overdue', 'Closed']
                },
                formatter: cell => {
                  const s = cell.getValue() || 'Open';
                  const lower = String(s).toLowerCase();
                  if (lower === 'open') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Open</span>';
                  if (lower === 'in progress') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">In Progress</span>';
                  if (lower === 'overdue') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Overdue</span>';
                  if (lower === 'closed' || lower === 'done' || lower === 'completed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Closed</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">' + s + '</span>';
                }
              },
              { title: 'SLA (Giờ)', field: 'slaTargetHours', sorter: 'number', hozAlign: 'center', minWidth: 90 },
              {
                title: 'Thực Tế',
                field: 'actualHours',
                sorter: 'number',
                hozAlign: 'center',
                minWidth: 90,
                formatter: cell => '<span class="font-mono font-bold">' + (cell.getValue() || 0) + 'h</span>'
              },
              {
                title: 'Đạt SLA',
                field: 'metSla',
                sorter: 'string',
                hozAlign: 'center',
                minWidth: 90,
                formatter: cell => cell.getValue() === 'Yes' ? '<span class="text-emerald-500 font-bold">✓ Đạt</span>' : '<span class="text-red-500 font-bold">✗ Chưa</span>'
              }
            ];
          }
          if (type === 'defect-logs') {
            return [
              { title: 'Defect ID', field: 'defectId', sorter: 'number', width: 90, hozAlign: 'center', formatter: cell => '<span class="font-mono font-bold text-amber-600 dark:text-amber-400">#' + (cell.getValue() || '') + '</span>' },
              { title: 'Ngày', field: 'defectDate', sorter: 'string', minWidth: 100 },
              { title: 'Phân Xưởng', field: 'facility', sorter: 'string', minWidth: 110, formatter: cell => '<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">' + (cell.getValue() || '') + '</span>' },
              { title: 'Nguyên Nhân Gốc', field: 'rootCauseCategory', sorter: 'string', minWidth: 130 },
              { title: 'Chi Tiết Sự Cố', field: 'specificIssue', minWidth: 200, formatter: cell => '<span class="truncate block max-w-xs" title="' + String(cell.getValue() || '').replace(/"/g, '&quot;') + '">' + (cell.getValue() || '') + '</span>' },
              { title: 'Sản Phẩm Ảnh Hưởng', field: 'affectedProduct', minWidth: 140 },
              { title: 'Lặp Lại', field: 'recurringIssue', hozAlign: 'center', minWidth: 90, formatter: cell => cell.getValue() === 'Yes' ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">Có</span>' : '<span class="text-slate-400">Không</span>' },
              { title: 'Yêu Cầu 8D', field: 'eightDRequired', hozAlign: 'center', minWidth: 100, formatter: cell => cell.getValue() === 'Yes' ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500">8D Required</span>' : '<span class="text-slate-400">Không</span>' }
            ];
          }
          if (type === 'action-plans') {
            return [
              { title: 'Action ID', field: 'actionId', sorter: 'string', minWidth: 100, formatter: cell => '<span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">' + (cell.getValue() || '') + '</span>' },
              { title: 'Ngày Tạo', field: 'dateLogged', sorter: 'string', minWidth: 100 },
              { title: 'Phân Xưởng', field: 'facility', sorter: 'string', minWidth: 110 },
              { title: 'Defect ID', field: 'relatedDefectId', minWidth: 90, hozAlign: 'center', formatter: cell => cell.getValue() ? '<span class="font-mono text-amber-500 font-bold">#' + cell.getValue() + '</span>' : '—' },
              { title: 'Loại Hành Động', field: 'fixType', minWidth: 130 },
              { title: 'Nội Dung', field: 'description', minWidth: 200, formatter: cell => '<span class="truncate block max-w-xs" title="' + String(cell.getValue() || '').replace(/"/g, '&quot;') + '">' + (cell.getValue() || '') + '</span>' },
              { title: 'Người Phụ Trách', field: 'pic', sorter: 'string', minWidth: 120, formatter: cell => '<strong class="text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</strong>' },
              { title: 'Hạn Chót', field: 'deadline', sorter: 'string', minWidth: 100, formatter: cell => '<span class="font-mono text-red-500 font-medium">' + (cell.getValue() || '') + '</span>' },
              {
                title: 'Trạng Thái',
                field: 'status',
                sorter: 'string',
                minWidth: 110,
                hozAlign: 'center',
                formatter: cell => {
                  const s = cell.getValue();
                  if (s === 'Done' || s === 'Closed') return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Done</span>';
                  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">' + (s || 'In Progress') + '</span>';
                }
              }
            ];
          }
          // requesters
          return [
            { title: 'STT', field: 'stt', sorter: 'number', width: 60, hozAlign: 'center' },
            { title: 'Mã NV', field: 'mnv', sorter: 'string', minWidth: 100, formatter: cell => '<span class="font-mono font-bold text-sky-600 dark:text-sky-400">' + (cell.getValue() || '') + '</span>' },
            { title: 'Họ và Tên', field: 'fullName', sorter: 'string', minWidth: 160, formatter: cell => '<strong class="text-slate-800 dark:text-slate-200">' + (cell.getValue() || '') + '</strong>' },
            { title: 'Bộ Phận', field: 'department', sorter: 'string', minWidth: 130 },
            { title: 'Khu Vực', field: 'area', sorter: 'string', minWidth: 120 },
            { title: 'Chức Danh', field: 'position', sorter: 'string', minWidth: 160 }
          ];
        };

        const getActiveDatasetList = () => {
          if (activeDataset.value === 'weekly-requests') return weeklyRequestsList.value;
          if (activeDataset.value === 'defect-logs') return defectLogsList.value;
          if (activeDataset.value === 'action-plans') return actionPlansList.value;
          if (activeDataset.value === 'requesters') return requestersList.value;
          return [];
        };

        const initOrUpdateExistingDataTable = () => {
          const el = document.getElementById('tabulator-existing-data');
          if (!el) return;
          if (typeof Tabulator === 'undefined') return;

          const data = getActiveDatasetList();
          const columns = getDatasetColumns(activeDataset.value);

          if (existingDataTable) {
            safeDestroy(existingDataTable);
            existingDataTable = null;
          }

          try {
            existingDataTable = new Tabulator('#tabulator-existing-data', {
              data: Array.isArray(data) ? data : [],
              layout: 'fitColumns',
              pagination: 'local',
              paginationSize: 10,
              paginationSizeSelector: [10, 25, 50, 100],
              placeholder: '<span>Không có dữ liệu trong tập này</span>',
              columns: columns
            });
            applyDatasetFilter();
          } catch (err) {
            console.warn('Tabulator existing data error:', err);
          }
        };

        const switchDataset = (ds) => {
          activeDataset.value = ds;
          datasetSearch.value = '';
          loadCurrentDataset();
        };

        const loadCurrentDataset = async () => {
          try {
            if (activeDataset.value === 'weekly-requests') {
              const res = await fetch('/api/weekly-requests', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) weeklyRequestsList.value = await res.json();
            } else if (activeDataset.value === 'defect-logs') {
              const res = await fetch('/api/defect-logs', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) defectLogsList.value = await res.json();
            } else if (activeDataset.value === 'action-plans') {
              const res = await fetch('/api/action-plans', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) actionPlansList.value = await res.json();
            } else if (activeDataset.value === 'requesters') {
              const res = await fetch('/api/requesters', { headers: getAuthHeaders(), credentials: 'include' });
              if (res.ok) requestersList.value = await res.json();
            }
            initOrUpdateExistingDataTable();
          } catch (e) {
            console.error(e);
          }
        };

        const applyDatasetFilter = () => {
          if (!existingDataTable) return;
          try {
            existingDataTable.clearFilter();
            if (datasetSearch.value) {
              const q = datasetSearch.value.trim().toLowerCase();
              const cols = getDatasetColumns(activeDataset.value).filter(c => c.field);
              const orFilters = cols.map(c => ({ field: c.field, type: 'like', value: q }));
              if (orFilters.length > 0) existingDataTable.setFilter([orFilters]);
            }
          } catch (err) {
            console.warn('Tabulator dataset filter error:', err);
          }
        };

        const exportCurrentDatasetExcel = () => {
          const list = getActiveDatasetList();
          if (!list || list.length === 0) {
            showToast('Không có dữ liệu để xuất', true);
            return;
          }
          const ws = XLSX.utils.json_to_sheet(list);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, activeDataset.value);
          XLSX.writeFile(wb, 'Checkpoint_' + activeDataset.value + '_' + new Date().toISOString().split('T')[0] + '.xlsx');
          showToast('Đã xuất file Excel dữ liệu thành công!');
        };

        // Data Loaders
        const loadStats = async () => {
          try {
            const res = await fetch('/api/technical-requests/stats', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              stats.value = await res.json();
            }
          } catch (e) {
            console.error(e);
          }
        };

        const loadRequests = async () => {
          try {
            let url = '/api/technical-requests?limit=500';
            const res = await fetch(url, { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              requestsList.value = data.items || [];
              if (document.getElementById('tabulator-requests')) {
                initOrUpdateRequestsTable();
              }
            }
          } catch (e) {
            console.error(e);
          }
        };

        const viewTicketDetail = (ticket) => {
          selectedTicket.value = ticket;
          openModal('modal-ticket-detail');
        };

        const updateTicketStatus = async (ticket, newStatus) => {
          try {
            const res = await fetch('/api/technical-requests/' + ticket.id, {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify({ chkStatus: newStatus, status: newStatus })
            });
            if (res.ok) {
              ticket.chkStatus = newStatus;
              ticket.status = newStatus;
              showToast('Đã cập nhật trạng thái phiếu thành ' + newStatus);
              loadStats();
              loadRequests();
            }
          } catch (err) {
            showToast('Lỗi cập nhật', true);
          }
        };

        const getStatusBadgeClass = (status) => {
          const s = (status || '').toLowerCase().trim();
          if (s === 'open' || s === 'open_task') return 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30';
          if (s === 'to_assign') return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
          if (s === 'in progress' || s === 'in_progress' || s === 'monitor') return 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30';
          if (s === 'overdue' || s === 'over_due' || s === 'support') return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30';
          if (s === 'closed' || s === 'done' || s === 'completed') return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
          return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30';
        };

        const deleteRequest = async (ticket) => {
          if (!confirm('Bạn có chắc chắn muốn xóa phiếu ' + ticket.docNo + '?')) return;
          try {
            const res = await fetch('/api/technical-requests/' + ticket.id, {
              method: 'DELETE',
              headers: getAuthHeaders(),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã xóa phiếu thành công');
              loadRequests();
              loadStats();
            }
          } catch (err) {
            showToast('Lỗi xóa phiếu', true);
          }
        };

        // Machines Management
        const loadMachines = async () => {
          try {
            const [grpRes, allRes] = await Promise.all([
              fetch('/api/machines/grouped', { headers: getAuthHeaders(), credentials: 'include' }),
              fetch('/api/machines', { headers: getAuthHeaders(), credentials: 'include' })
            ]);
            if (grpRes.ok) machineCatalog.value = await grpRes.json();
            if (allRes.ok) {
              const data = await allRes.json();
              machinesFlatList.value = Array.isArray(data) ? data : [];
              initOrUpdateMachinesTable();
            }
          } catch (e) {}
        };

        const openAddMachineModal = () => {
          newMachine.value = { tech: '', name: '', code: '' };
          openModal('modal-add-machine');
        };

        const submitAddMachine = async () => {
          try {
            const res = await fetch('/api/machines', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(newMachine.value)
            });
            if (res.ok) {
              showToast('Thêm máy in thành công!');
              closeModal('modal-add-machine');
              loadMachines();
            }
          } catch (err) {
            showToast('Lỗi thêm máy in', true);
          }
        };

        const deleteMachineItem = async (mach) => {
          if (!confirm('Xóa máy ' + mach.name + ' thuộc nhóm ' + mach.tech + '?')) return;
          try {
            const res = await fetch('/api/machines/' + mach.id, {
              method: 'DELETE',
              headers: getAuthHeaders(),
              credentials: 'include'
            });
            if (res.ok) {
              showToast('Đã xóa máy ' + mach.name);
              loadMachines();
            } else {
              showToast('Lỗi xóa máy', true);
            }
          } catch (e) {
            showToast('Lỗi xóa máy', true);
          }
        };

        // Employees Management
        const loadEmployees = async () => {
          try {
            const res = await fetch('/api/employees', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              employeesList.value = await res.json();
              initOrUpdateEmployeesTable();
            }
          } catch (e) {}
        };

        const openAddEmployeeModal = () => {
          newEmployee.value = { mnv: '', name: '', dept: 'Sản Xuất', area: '', role: 'Operator' };
          openModal('modal-add-employee');
        };

        const submitAddEmployee = async () => {
          try {
            const res = await fetch('/api/employees', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(newEmployee.value)
            });
            if (res.ok) {
              showToast('Thêm nhân viên thành công!');
              closeModal('modal-add-employee');
              loadEmployees();
            }
          } catch (err) {
            showToast('Lỗi thêm nhân viên', true);
          }
        };

        const deleteEmployee = async (emp) => {
          if (!confirm('Xóa nhân viên ' + emp.name + '?')) return;
          try {
            const res = await fetch('/api/employees/' + emp.id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa nhân viên');
              loadEmployees();
            }
          } catch (e) {
            showToast('Lỗi xóa', true);
          }
        };

        const openExcelUploader = () => openModal('modal-excel');

        const processExcelFile = (e) => {
          const file = e.target.files[0];
          if (!file) return;
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
                  showToast('Đã nạp ' + employees.length + ' nhân viên từ Excel');
                  closeModal('modal-excel');
                  loadEmployees();
                }
              }
            } catch (err) {
              showToast('Lỗi đọc Excel', true);
            }
          };
          reader.readAsArrayBuffer(file);
        };

        // Users Management
        const loadUsers = async () => {
          try {
            const res = await fetch('/api/users', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              usersList.value = await res.json();
              initOrUpdateUsersTable();
            }
          } catch (e) {}
        };

        const getUserPerm = (u, permKey) => {
          if (!u) return false;
          if (u.username === 'admin') return true;
          if (u.permissions && u.permissions[permKey] !== undefined) {
            return Boolean(u.permissions[permKey]);
          }
          if (u.role === 'ADMIN') return true;
          if (u.role === 'TECHNICIAN') {
            return permKey === 'canCreateRequest' || permKey === 'canViewKpi';
          }
          if (u.role === 'EMPLOYEE') {
            return permKey === 'canCreateRequest';
          }
          return false;
        };

        const toggleUserPerm = async (u, permKey, checked) => {
          const currentPerms = {
            canCreateRequest: getUserPerm(u, 'canCreateRequest'),
            canViewKpi: getUserPerm(u, 'canViewKpi'),
            canAccessControlPanel: getUserPerm(u, 'canAccessControlPanel')
          };
          currentPerms[permKey] = checked;

          let newRole = u.role;
          if (permKey === 'canAccessControlPanel') {
            if (checked) {
              newRole = 'ADMIN';
            } else if (u.role === 'ADMIN') {
              newRole = 'EMPLOYEE';
            }
          }

          u.permissions = currentPerms;
          u.role = newRole;

          try {
            const payload = {
              fullName: u.fullName,
              email: u.email,
              role: u.role,
              isActive: u.isActive,
              permissions: currentPerms
            };
            const res = await fetch('/api/users/' + u.id, {
              method: 'PUT',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              showToast('Đã cập nhật phân quyền cho @' + u.username);
            } else {
              const resPerms = await fetch('/api/users/' + u.id + '/permissions', {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                credentials: 'include',
                body: JSON.stringify(currentPerms)
              });
              if (resPerms.ok) {
                showToast('Đã cập nhật phân quyền cho @' + u.username);
              } else {
                const err = await res.json().catch(() => ({}));
                showToast(err.message || 'Lỗi cập nhật phân quyền', true);
                loadUsers();
              }
            }
          } catch (e) {
            showToast('Lỗi kết nối khi cập nhật phân quyền', true);
            loadUsers();
          }
        };

        const onNewUserRoleChange = () => {
          if (newUser.value.role === 'ADMIN') {
            newUser.value.permissions = { canCreateRequest: true, canViewKpi: true, canAccessControlPanel: true };
          } else if (newUser.value.role === 'TECHNICIAN') {
            newUser.value.permissions = { canCreateRequest: true, canViewKpi: true, canAccessControlPanel: false };
          } else {
            newUser.value.permissions = { canCreateRequest: true, canViewKpi: false, canAccessControlPanel: false };
          }
        };

        const openAddUserModal = () => {
          newUser.value = {
            username: '',
            password: 'Checkpoint@123',
            fullName: '',
            email: '',
            role: 'EMPLOYEE',
            permissions: {
              canCreateRequest: true,
              canViewKpi: false,
              canAccessControlPanel: false
            }
          };
          openModal('modal-add-user');
        };

        const submitAddUser = async () => {
          try {
            const res = await fetch('/api/users', {
              method: 'POST',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              credentials: 'include',
              body: JSON.stringify(newUser.value)
            });
            if (res.ok) {
              showToast('Tạo tài khoản thành công!');
              closeModal('modal-add-user');
              loadUsers();
            } else {
              const err = await res.json();
              showToast(err.message || 'Lỗi tạo tài khoản', true);
            }
          } catch (e) {
            showToast('Lỗi tạo tài khoản', true);
          }
        };

        const deleteUser = async (u) => {
          if (!confirm('Xóa tài khoản @' + u.username + '?')) return;
          try {
            const res = await fetch('/api/users/' + u.id, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              showToast('Đã xóa tài khoản');
              loadUsers();
            }
          } catch (e) {
            showToast('Lỗi xóa tài khoản', true);
          }
        };

        // Excel Exports
        const exportRequestsExcel = () => {
          if (requestsList.value.length === 0) {
            showToast('Không có dữ liệu để xuất', true);
            return;
          }
          const rows = requestsList.value.map(r => ({
            'Số Phiếu': r.docNo,
            'Ngày Yêu Cầu': r.reqDate,
            'Giờ Yêu Cầu': r.reqTime,
            'Người Yêu Cầu': r.reqBy,
            'Công Nghệ': r.printTech,
            'Tên Máy': r.machineName,
            'Mô Tả Sự Cố': r.problem,
            'Mức Ưu Tiên': r.priority,
            'Người Tiếp Nhận': r.recvBy,
            'Ngày Nhận': r.recvDate,
            'Giờ Nhận': r.recvTime,
            'Ngày Hoàn Thành': r.finishDate,
            'Giờ Hoàn Thành': r.finishTime,
            'Downtime (Phút)': r.downtime,
            'Nguyên Nhân Gốc': r.rootCause,
            'Hành Động Khắc Phục': r.actionTaken,
            'Phân Loại 4M': r.errCat,
            'Nhóm Công Đoạn': r.errType,
            'Chất Lượng In': r.chkQuality,
            'Trạng Thái Phiếu': r.chkStatus,
            'Work Order': r.workOrder,
            'Tổng SL': r.woTotalQty,
            'SL Phế Phẩm': r.wasteQty,
            '% Waste': r.wastePercent,
            'Người Bàn Giao': r.prodMgr
          }));
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'DanhSachPhieu');
          XLSX.writeFile(wb, 'Checkpoint_PhieuYeuCau_' + new Date().toISOString().split('T')[0] + '.xlsx');
          showToast('Đã xuất file Excel danh sách phiếu');
        };

        const exportEmployeesExcel = () => {
          if (employeesList.value.length === 0) return;
          const rows = employeesList.value.map(e => ({
            'Mã NV': e.mnv,
            'Họ và Tên': e.name,
            'Bộ Phận': e.dept,
            'Khu Vực': e.area,
            'Chức Vụ': e.role
          }));
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'NhanSu');
          XLSX.writeFile(wb, 'Checkpoint_DanhSachNhanSu.xlsx');
          showToast('Đã xuất file Excel nhân sự');
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

        onMounted(async () => {
          if (window.__CP_DEBUG__) {
            window.__CP_DEBUG__.log('Vue:Lifecycle', 'onMounted initiated');
            window.__CP_DEBUG__.markMounted('app-root', 'mounted');
            window.__CP_DEBUG__.markMounted('header', 'mounted');
            window.__CP_DEBUG__.markMounted('sidebar', 'mounted');
            window.__CP_DEBUG__.markMounted('overview-hub', 'mounted');
            window.__CP_DEBUG__.markMounted('assign-tasks', 'mounted');
            window.__CP_DEBUG__.markMounted('management-tasks', 'mounted');
            window.__CP_DEBUG__.markMounted('modals', 'mounted');
          }
          try {
            const res = await fetch('/auth/session', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const sessionUser = await res.json();
              if (sessionUser && typeof sessionUser === 'object') {
                currentUser.value = { ...currentUser.value, ...sessionUser };
              }
            } else {
              // Fallback an toàn khi chưa có session, không cưỡng chế chuyển hướng /login
              if (!currentUser.value || !currentUser.value.username) {
                currentUser.value = {
                  username: 'admin',
                  fullName: 'Quản trị viên',
                  role: 'ADMIN',
                  permissions: { canAccessControlPanel: true, canCreateRequest: true, canViewKpi: true }
                };
              }
            }
          } catch (e) {
            // Không cưỡng chế chuyển hướng /login khi gặp lỗi hoặc offline
            if (!currentUser.value || !currentUser.value.username) {
              currentUser.value = {
                username: 'admin',
                fullName: 'Quản trị viên (Offline)',
                role: 'ADMIN',
                permissions: { canAccessControlPanel: true, canCreateRequest: true, canViewKpi: true }
              };
            }
          }

          const savedTheme = localStorage.getItem('checkpoint_theme') || 'light';
          currentTheme.value = savedTheme;
          setTheme(savedTheme);

          window.addEventListener('resize', () => {
            safeRedraw(splitTable);
            safeRedraw(machinesTable);
            safeRedraw(empTable);
            safeRedraw(usersTable);
            safeRedraw(existingDataTable);
            safeRedraw(reportTableInstance);
          });

          initReportDates();
          loadStats();
          loadMachines();
          loadRequests();
          loadAllSplitData();
          loadCpsData();
          loadEmployees();
          loadPublicFormStatus();
          loadUsers();

          // Preload dataset counts
          fetch('/api/weekly-requests', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) weeklyRequestsList.value = d; }).catch(() => {});
          fetch('/api/defect-logs', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) defectLogsList.value = d; }).catch(() => {});
          fetch('/api/action-plans', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) actionPlansList.value = d; }).catch(() => {});
          fetch('/api/requesters', { headers: getAuthHeaders(), credentials: 'include' })
            .then(r => r.ok && r.json()).then(d => { if (Array.isArray(d)) requestersList.value = d; }).catch(() => {});
        });

        return {
          activeTab,
          currentTabLabel,
          sidebarOpen,
          sidebarCollapsed,
          userMenuOpen,
          currentTheme,
          currentUser,
          userInitials,
          stats,
          requestsList,
          reqFilter,
          selectedTicket,
          splitTab,
          chainList,
          cpsrList,
          cpstList,
          cpsfList,
          splitFilter,
          currentSplitCount,
          selectedChain,
          showChainModal,
          lightboxImage,
          openLightbox,
          closeLightbox,
          closeChainModal,
          closeSplitDetailModal,
          closeTicketDetailModal,
          switchSplitTab,
          applySplitFilters,
          debouncedApplySplitFilters,
          openChainDetailModal,
          deleteSplitRecord,
          exportCurrentTabExcel,
          loadAllSplitData,
          cpsList,
          assignCardStatus,
          assignCardSearch,
          showAssignModal,
          selectedCpsForAssign,
          assignForm,
          isAssigning,
          pendingAssignCount,
          cpsCountByStatus,
          filteredCpsCards,
          formatCpsStatus,
          formatTechnicianName,
          getTechnicianDisplayName,
          getCardBorderClass,
          formatDateTimeDisplay,
          openAssignModal,
          closeAssignModal,
          submitAssignTask,
          showEditModal,
          isSavingEdit,
          editForm,
          openEditModal,
          closeEditModal,
          submitEditTicket,
          deleteCpsRecord,
          showLinkModal,
          isLinking,
          linkForm,
          openLinkModal,
          closeLinkModal,
          submitLinkTickets,
          unlinkItem,
          onSelectLinkCps,
          showCreateCpsModal,
          isCreatingCps,
          createCpsForm,
          availableCpsrForCps,
          openCreateCpsModal,
          closeCreateCpsModal,
          submitCreateCps,
          reportDateFrom,
          reportDateTo,
          reportQuickPreset,
          reportSearch,
          reportStatusFilter,
          filteredReportCps,
          reportStats,
          report4MStats,
          ganttTimeRange,
          ganttTimeTicks,
          ganttMachineRows,
          initReportDates,
          setReportPreset,
          onReportFilterChange,
          renderReportChart,
          renderReport4MChart,
          initOrUpdateReportTable,
          exportReportTechnicalExcel,
          loadCpsData,
          machineCatalog,
          machinesFlatList,
          machineTechFilter,
          machineSearch,
          newMachine,
          employeesList,
          empSearch,
          empDeptFilter,
          distinctDepts,
          newEmployee,
          usersList,
          userSearch,
          userRoleFilter,
          newUser,
          activeDataset,
          datasetSearch,
          weeklyRequestsList,
          defectLogsList,
          actionPlansList,
          requestersList,
          getUserPerm,
          toggleUserPerm,
          onNewUserRoleChange,
          setTheme,
          toggleTheme,
          switchTab,
          loadStats,
          loadRequests,
          applyReqFilters,
          viewTicketDetail,
          updateTicketStatus,
          getStatusBadgeClass,
          deleteRequest,
          loadMachines,
          applyMachineFilters,
          openAddMachineModal,
          submitAddMachine,
          deleteMachineItem,
          loadEmployees,
          applyEmpFilters,
          openAddEmployeeModal,
          submitAddEmployee,
          deleteEmployee,
          openExcelUploader,
          triggerUpload,
          processExcelFile,
          loadUsers,
          applyUserFilters,
          openAddUserModal,
          submitAddUser,
          deleteUser,
          switchDataset,
          loadCurrentDataset,
          applyDatasetFilter,
          exportCurrentDatasetExcel,
          exportRequestsExcel,
          exportEmployeesExcel,
          handleLogout,
          handleGlobalClick,
          closeModal,
          get4MLabel,
          getPercent,
          showTicketDetailModal,
          showAddMachineModal,
          showAddEmployeeModal,
          showAddUserModal,
          showExcelModal,
          isPublicFormEnabled,
          togglingPublicForm,
          copySuccess,
          publicFormUrl,
          loadPublicFormStatus,
          togglePublicForm,
          copyPublicFormLink
        };
      }
    });

    app.config.errorHandler = function(err, instance, info) {
      console.error('[Vue Error Boundary]', err, info);
      if (window.__CP_REPORT_ERROR__) {
        window.__CP_REPORT_ERROR__(err, 'Vue: ' + (info || 'Component'));
      }
    };

    try {
      app.mount('#app');
      if (window.__CP_DEBUG__) {
        window.__CP_DEBUG__.markMounted('app-root', 'mounted');
        window.__CP_DEBUG__.log('Vue', 'App successfully mounted to #app');
      }
    } catch (mountErr) {
      console.error('[Vue Mount Error]', mountErr);
      if (window.__CP_REPORT_ERROR__) {
        window.__CP_REPORT_ERROR__(mountErr, 'Vue App Mount Error');
      }
      if (window.__CP_DEBUG__) {
        window.__CP_DEBUG__.markMounted('app-root', 'failed');
        window.__CP_DEBUG__.log('Vue', 'App failed to mount to #app', mountErr);
      }
    };`;
