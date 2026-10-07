export const DASHBOARD_SCRIPT = `    const { createApp, ref, computed, onMounted, nextTick, toRaw } = Vue;

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

        const toPlainObject = (obj) => {
          if (!obj) return null;
          try {
            return JSON.parse(JSON.stringify(toRaw ? toRaw(obj) : obj));
          } catch (_) {
            return { ...obj };
          }
        };

        const safeDestroy = (tbl) => {
          try {
            if (tbl && typeof tbl.destroy === 'function') {
              tbl.destroy();
            }
          } catch (_) {}
          return null;
        };

        const formatTechnicianName = (val) => {
          if (!val) return '';
          let str = String(val).trim();
          str = str.replace(/^(KTV|ktv|Technician|technician)\s*[-:]?\s*/i, '').trim();
          if (str.includes(' - ')) {
            const parts = str.split(' - ');
            if (parts[0] && parts[0].trim()) {
              str = parts[0].trim();
            }
          }
          return str;
        };

        const getPercent = (v, total) => {
          if (!total || total === 0) return 0;
          return Math.round((v / total) * 100);
        };

        // Report Technical State & Computeds
        const reportDateFrom = ref('');
        const reportDateTo = ref('');
        const reportQuickPreset = ref('7d');
        const reportSearch = ref('');
        const reportStatusFilter = ref('ALL');
        let reportChartInstance = null;
        let report4MChartInstance = null;
        let reportTableInstance = null;

        const chainList = ref([]);
        const cpsList = ref([]);
        const cpsrList = ref([]);
        const cpstList = ref([]);
        const cpsfList = ref([]);
        const showChainModal = ref(false);
        const lightboxImage = ref(null);
        const openLightbox = (url) => { lightboxImage.value = url; };
        const closeLightbox = () => { lightboxImage.value = null; };
        const selectedChain = ref(null);

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
              const tooltip = '[' + doc + '] ' + mach + '\\n' + 'Downtime: ' + (dtVal > 0 ? dtVal + 'p' : 'Đang xử lý') + '\\n' + 'Từ: ' + fmtDt(startMs) + ' → Đến: ' + fmtDt(endMs) + '\\n' + 'Sự cố: ' + prob + '\\n' + 'Technician: ' + tech;

              mData.bars.push({
                left: Math.round(left * 10) / 10,
                width: Math.round(width * 10) / 10,
                downtime: dtVal,
                tooltip,
                item
              });
            }
          });

          return Array.from(machineMap.values());
        });

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
          } catch (err) {
            console.warn('Error init report table:', err);
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

        const closeChainModal = () => {
          showChainModal.value = false;
          selectedChain.value = null;
        };
        const closeSplitDetailModal = closeChainModal;

        const openEditModal = (type, item) => {
          if (type === 'cpsr') window.location.href = '/form-request';
          else if (type === 'cpst') window.location.href = '/technical-feedback';
          else if (type === 'cpsf') window.location.href = '/confirm-request';
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

        const loadChainData = async () => {
          try {
            let res = await fetch('/api/cps', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                chainList.value = data;
                cpsList.value = data;
                return;
              } else if (Array.isArray(data?.data)) {
                chainList.value = data.data;
                cpsList.value = data.data;
                return;
              }
            }
            res = await fetch('/api/cpsr-chain', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              chainList.value = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            }
          } catch(e) { console.warn('Could not load chain data', e); }
        };

        const loadCpsrData = async () => {
          try {
            const res = await fetch('/api/cpsr', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const resJson = await res.json();
              cpsrList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);
            }
          } catch(e) { console.warn('Could not load cpsr data', e); }
        };

        const loadCpstData = async () => {
          try {
            const res = await fetch('/api/cpst', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const resJson = await res.json();
              cpstList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);
            }
          } catch(e) { console.warn('Could not load cpst data', e); }
        };

        const loadCpsfData = async () => {
          try {
            const res = await fetch('/api/cpsf', { headers: getAuthHeaders(), credentials: 'include' });
            if (res.ok) {
              const resJson = await res.json();
              cpsfList.value = Array.isArray(resJson) ? resJson : (Array.isArray(resJson?.data) ? resJson.data : []);
            }
          } catch(e) { console.warn('Could not load cpsf data', e); }
        };

        const loadAllSplitData = async () => {
          await Promise.all([loadChainData(), loadCpsrData(), loadCpstData(), loadCpsfData()]);
          if (activeTab.value === 'report-technical') {
            onReportFilterChange();
          }
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
          return true; // Dashboard d-module cho phép tất cả người dùng xem Report Technical
        });

        const isRequestActive = computed(() => {
          return false;
        });

        const isKpiActive = computed(() => {
          return activeTab.value === 'report-technical' ||
                 activeTab.value === 'weekly-kpi' ||
                 activeTab.value === 'weekly-requests' ||
                 activeTab.value === 'defect-logs' ||
                 activeTab.value === 'action-plans' ||
                 activeTab.value === 'catalog';
        });

        const selectMenuCard = (type) => {
          if (type === 'cpsr' || type === 'form-request') {
            window.location.href = '/form-request';
          } else if (type === 'cpst' || type === 'technical-feedback') {
            window.location.href = '/technical-feedback';
          } else if (type === 'cpsf' || type === 'confirm-request') {
            window.location.href = '/confirm-request';
          } else if (type === 'kpi' || type === 'report-technical') {
            switchTab('report-technical');
          } else if (type === 'request') {
            window.location.href = '/form-request';
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
          if (tab === 'cpsr') {
            window.location.href = '/form-request';
            return;
          }
          if (tab === 'cpst') {
            window.location.href = '/technical-feedback';
            return;
          }
          if (tab === 'cpsf') {
            window.location.href = '/confirm-request';
            return;
          }
          activeTab.value = tab;
          showTimeModal.value = false;
          showPersonModal.value = false;
          showExcelModal.value = false;
          modalState.value = { type: null, isEdit: false, item: {} };
          if (tab === 'weekly-kpi' || tab === 'report-technical') {
            activeTab.value = 'report-technical';
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
            switchTab('report-technical');
          }
          loadMachinesCatalog();
          loadEmployees();
          loadHistory();

          // Global ESC handler for dismissing any active modal
          window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              closeCurrentModal();
              closeChainModal();
              userMenuOpen.value = false;
            }
          });

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
          reportDateFrom,
          reportDateTo,
          reportQuickPreset,
          setReportPreset,
          reportSearch,
          reportStatusFilter,
          reportStats,
          getPercent,
          report4MStats,
          ganttTimeTicks,
          ganttMachineRows,
          onReportFilterChange,
          exportReportTechnicalExcel,
          openChainDetailModal,
          closeChainModal,
          closeSplitDetailModal,
          showChainModal,
          lightboxImage,
          openLightbox,
          closeLightbox,
          selectedChain,
          openEditModal,
          formatTechnicianName,
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
