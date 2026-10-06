export const CP_ERROR_AND_DEBUG_HEAD_SCRIPT = `(function() {
  // --- GLOBAL ERROR BOUNDARY & HANDLER ---
  function removeCloak() {
    try {
      var cloaked = document.querySelectorAll('[v-cloak]');
      for (var i = 0; i < cloaked.length; i++) {
        cloaked[i].removeAttribute('v-cloak');
      }
      var app = document.getElementById('app');
      if (app && app.style.display === 'none') {
        app.style.display = '';
      }
    } catch (_) {}
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  var reportedErrors = new Set();

  function renderErrorBanner(details) {
    removeCloak();

    var errKey = (details.message || '') + '|' + (details.source || '') + '|' + (details.lineno || '');
    if (reportedErrors.has(errKey)) return;
    reportedErrors.add(errKey);

    var bannerId = 'cp-error-banner';
    var existing = document.getElementById(bannerId);
    if (existing) {
      var list = existing.querySelector('.cp-error-list');
      if (list) {
        var item = document.createElement('div');
        item.style.marginTop = '6px';
        item.style.borderTop = '1px dashed rgba(255,255,255,0.3)';
        item.style.paddingTop = '6px';
        item.innerHTML = '<div><b>Lỗi bổ sung:</b> ' + escapeHtml(details.message || 'Lỗi không xác định') + '</div>' +
          (details.source ? '<div style="font-size:11px;opacity:0.85;margin-top:2px;"><b>File:</b> ' + escapeHtml(details.source) + ' | <b>Dòng:</b> ' + (details.lineno || '?') + ' : <b>Cột:</b> ' + (details.colno || '?') + '</div>' : '');
        list.appendChild(item);
      }
      return;
    }

    var banner = document.createElement('div');
    banner.id = bannerId;
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:linear-gradient(135deg,#b91c1c,#dc2626);color:#ffffff;padding:12px 18px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:13px;line-height:1.5;box-shadow:0 4px 20px rgba(0,0,0,0.4);border-bottom:3px solid #f87171;';

    var msg = details.message || 'Lỗi thực thi JavaScript không xác định';
    var src = details.source || 'inline script';
    var line = details.lineno !== undefined && details.lineno !== null ? details.lineno : 'N/A';
    var col = details.colno !== undefined && details.colno !== null ? details.colno : 'N/A';

    banner.innerHTML = [
      '<div style="max-width:1400px;margin:0 auto;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">',
      '  <div style="flex:1;">',
      '    <div style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;letter-spacing:0.3px;">',
      '      <span style="font-size:16px;">⚠️</span>',
      '      <span>LỖI GIAO DIỆN CONTROL PANEL (ERROR BOUNDARY)</span>',
      '      <span style="background:rgba(0,0,0,0.3);padding:1px 6px;border-radius:4px;font-size:11px;font-weight:normal;">[v-cloak] đã tự động gỡ bỏ</span>',
      '    </div>',
      '    <div class="cp-error-list" style="margin-top:8px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;background:rgba(0,0,0,0.25);padding:8px 12px;border-radius:6px;word-break:break-word;">',
      '      <div><b>Thông báo lỗi:</b> ' + escapeHtml(msg) + '</div>',
      '      <div style="margin-top:4px;font-size:11px;opacity:0.9;"><b>Tệp tin:</b> ' + escapeHtml(src) + ' | <b>Dòng:</b> ' + line + ' | <b>Cột:</b> ' + col + '</div>',
      '    </div>',
      '    <div style="margin-top:8px;display:flex;align-items:center;gap:12px;font-size:12px;flex-wrap:wrap;">',
      '      <span style="background:rgba(255,255,255,0.2);padding:3px 8px;border-radius:4px;font-weight:600;">👉 Hướng dẫn: Nhấn phím F12 (hoặc Chuột phải -&gt; Inspect -&gt; Console) để kiểm tra toàn bộ Call Stack</span>',
      '    </div>',
      '  </div>',
      '  <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">',
      '    <button id="cp-error-reload-btn" type="button" style="background:#ffffff;color:#b91c1c;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.2);">🔄 Thử tải lại (F5)</button>',
      '    <button id="cp-error-close-btn" type="button" style="background:rgba(0,0,0,0.2);color:#ffffff;border:1px solid rgba(255,255,255,0.3);padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer;" title="Đóng">✕</button>',
      '  </div>',
      '</div>'
    ].join('');

    var closeBtn = banner.querySelector('#cp-error-close-btn');
    if (closeBtn) {
      closeBtn.onclick = function() { banner.remove(); };
    }
    var reloadBtn = banner.querySelector('#cp-error-reload-btn');
    if (reloadBtn) {
      reloadBtn.onclick = function() { window.location.reload(); };
    }

    function insertBanner() {
      if (document.body) {
        document.body.insertBefore(banner, document.body.firstChild);
      } else if (document.documentElement) {
        document.documentElement.appendChild(banner);
      }
    }

    if (document.body || document.documentElement) {
      insertBanner();
    } else {
      document.addEventListener('DOMContentLoaded', insertBanner);
    }
  }

  window.__CP_REPORT_ERROR__ = function(err, context) {
    var msg = (err && (err.message || err.toString())) || 'Lỗi không xác định';
    var src = (err && (err.fileName || err.filename || err.source)) || '';
    var line = (err && (err.lineNumber !== undefined ? err.lineNumber : err.lineno)) || 0;
    var col = (err && (err.columnNumber !== undefined ? err.columnNumber : err.colno)) || 0;
    if (context) msg = '[' + context + '] ' + msg;
    renderErrorBanner({ message: msg, source: src, lineno: line, colno: col, error: err });
  };

  window.onerror = function(message, source, lineno, colno, error) {
    renderErrorBanner({
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      error: error
    });
    return false;
  };

  window.addEventListener('error', function(event) {
    if (!event) return;
    if (event.target && event.target !== window && event.target.tagName) {
      var tag = event.target.tagName.toLowerCase();
      var src = event.target.src || event.target.href || '';
      renderErrorBanner({
        message: 'Lỗi tải tài nguyên thẻ <' + tag + '>: ' + src,
        source: src,
        lineno: 0,
        colno: 0
      });
      return;
    }
    var err = event.error || {};
    renderErrorBanner({
      message: event.message || err.message || 'Lỗi không xác định',
      source: event.filename || err.fileName || '',
      lineno: event.lineno || err.lineNumber || 0,
      colno: event.colno || err.columnNumber || 0,
      error: err
    });
  });

  window.addEventListener('unhandledrejection', function(event) {
    var reason = (event && event.reason) || {};
    var msg = reason.message || (typeof reason === 'string' ? reason : 'Promise bị từ chối không có bộ xử lý');
    renderErrorBanner({
      message: '[Unhandled Rejection] ' + msg,
      source: reason.fileName || '',
      lineno: reason.lineNumber || 0,
      colno: reason.columnNumber || 0,
      error: reason
    });
  });

  // --- QUERY PARAM ?debug=1 DEBUG HANDLER ---
  var isDebug = false;
  try {
    var sp = new URLSearchParams(window.location.search);
    isDebug = sp.get('debug') === '1' || window.__CP_FORCE_DEBUG__ === true;
  } catch(_) {}

  var components = [
    { key: 'app-root', name: 'Vue App Root (#app)', status: 'pending', time: null },
    { key: 'header', name: 'Header (App Bar)', status: 'pending', time: null },
    { key: 'sidebar', name: 'Sidebar Navigation', status: 'pending', time: null },
    { key: 'overview-hub', name: 'Overview & KPI Cards', status: 'pending', time: null },
    { key: 'assign-tasks', name: 'Assign Tasks Module', status: 'pending', time: null },
    { key: 'management-tasks', name: 'Management Tasks Module', status: 'pending', time: null },
    { key: 'split-tables', name: 'Split Forms Tabulator', status: 'pending', time: null },
    { key: 'requests-table', name: 'Requests Tabulator', status: 'pending', time: null },
    { key: 'master-tables', name: 'Master Tabulators (Machines/Users)', status: 'pending', time: null },
    { key: 'report-technical', name: 'Report Technical (KPIs & Charts)', status: 'pending', time: null },
    { key: 'modals', name: 'Action & Detail Modals', status: 'pending', time: null }
  ];

  var compMap = {};
  components.forEach(function(c) { compMap[c.key] = c; });

  window.__CP_DEBUG__ = {
    active: isDebug,
    components: compMap,
    logs: [],
    log: function(mod, msg, extra) {
      if (!isDebug) return;
      var now = new Date();
      var time = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      var entry = { time: time, mod: mod, msg: msg, extra: extra };
      window.__CP_DEBUG__.logs.push(entry);
      if (extra !== undefined) {
        console.log('[CP-DEBUG ' + time + '][' + mod + ']', msg, extra);
      } else {
        console.log('[CP-DEBUG ' + time + '][' + mod + ']', msg);
      }
      updateDebugUI();
    },
    markMounted: function(key, status, meta) {
      if (!compMap[key]) {
        compMap[key] = { key: key, name: key, status: status || 'mounted', time: Date.now() };
        components.push(compMap[key]);
      } else {
        compMap[key].status = status || 'mounted';
        compMap[key].time = Date.now();
        if (meta) compMap[key].meta = meta;
      }
      if (isDebug) {
        window.__CP_DEBUG__.log('ComponentMount', key + ' -> ' + (status || 'mounted'), meta);
        updateDebugUI();
      }
    }
  };

  if (!isDebug) return;

  function createDebugPanel() {
    var panel = document.createElement('div');
    panel.id = 'cp-debug-panel';
    panel.style.cssText = 'position:fixed;bottom:16px;right:16px;width:350px;max-height:85vh;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:12px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;z-index:999990;display:flex;flex-direction:column;overflow:hidden;transition:all 0.2s ease;';

    panel.innerHTML = [
      '<div id="cp-debug-header" style="background:#1e293b;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;cursor:pointer;user-select:none;">',
      '  <div style="display:flex;align-items:center;gap:6px;font-weight:700;color:#38bdf8;">',
      '    <span>🐞</span>',
      '    <span>CP Debugger (?debug=1)</span>',
      '    <span id="cp-debug-badge" style="background:#0369a1;color:#fff;padding:1px 5px;border-radius:9999px;font-size:10px;">0/11</span>',
      '  </div>',
      '  <div style="display:flex;gap:6px;align-items:center;">',
      '    <button id="cp-debug-toggle" type="button" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:12px;padding:2px 4px;">▼</button>',
      '  </div>',
      '</div>',
      '<div id="cp-debug-body" style="padding:10px;overflow-y:auto;max-height:60vh;display:flex;flex-direction:column;gap:8px;">',
      '  <div>',
      '    <div style="font-weight:700;color:#94a3b8;margin-bottom:4px;text-transform:uppercase;font-size:10px;letter-spacing:0.5px;">Trạng Thái Mount Component:</div>',
      '    <div id="cp-debug-components-list" style="display:flex;flex-direction:column;gap:4px;"></div>',
      '  </div>',
      '  <div style="border-top:1px solid #334155;padding-top:6px;">',
      '    <div style="font-weight:700;color:#94a3b8;margin-bottom:4px;text-transform:uppercase;font-size:10px;letter-spacing:0.5px;">Live Debug Log:</div>',
      '    <div id="cp-debug-log-list" style="max-height:120px;overflow-y:auto;background:#020617;padding:6px;border-radius:6px;font-size:10px;color:#cbd5e1;display:flex;flex-direction:column;gap:2px;"></div>',
      '  </div>',
      '</div>'
    ].join('');

    function ensurePanelAttached() {
      if (!document.getElementById('cp-debug-panel') && document.body) {
        document.body.appendChild(panel);
        var toggleBtn = document.getElementById('cp-debug-toggle');
        var bodyEl = document.getElementById('cp-debug-body');
        var headerEl = document.getElementById('cp-debug-header');
        var collapsed = false;
        function toggleCollapse() {
          collapsed = !collapsed;
          bodyEl.style.display = collapsed ? 'none' : 'flex';
          if (toggleBtn) toggleBtn.textContent = collapsed ? '▲' : '▼';
        }
        if (headerEl) headerEl.addEventListener('click', toggleCollapse);
        updateDebugUI();
      }
    }

    if (document.body) {
      ensurePanelAttached();
    } else {
      document.addEventListener('DOMContentLoaded', ensurePanelAttached);
      window.addEventListener('load', ensurePanelAttached);
    }
    window.__cp_ensure_debug_panel = ensurePanelAttached;
  }

  function updateDebugUI() {
    if (!isDebug) return;
    if (window.__cp_ensure_debug_panel) window.__cp_ensure_debug_panel();
    var listEl = document.getElementById('cp-debug-components-list');
    var badgeEl = document.getElementById('cp-debug-badge');
    var logEl = document.getElementById('cp-debug-log-list');
    if (!listEl) return;

    var mountedCount = 0;
    var html = '';
    components.forEach(function(c) {
      var isMounted = c.status === 'mounted' || c.status === 'ready';
      var isFailed = c.status === 'failed' || c.status === 'error';
      if (isMounted) mountedCount++;

      var statusColor = isMounted ? '#34d399' : (isFailed ? '#f87171' : '#fbbf24');
      var statusIcon = isMounted ? '✅' : (isFailed ? '❌' : '⏳');
      var statusText = isMounted ? 'MOUNTED' : (isFailed ? 'FAILED' : 'PENDING');

      html += '<div style="display:flex;align-items:center;justify-content:space-between;background:#1e293b;padding:4px 8px;border-radius:4px;border-left:3px solid ' + statusColor + ';">' +
        '<span style="color:#e2e8f0;font-size:10.5px;">' + c.name + '</span>' +
        '<span style="color:' + statusColor + ';font-weight:700;font-size:10px;display:flex;align-items:center;gap:3px;">' +
        '<span>' + statusIcon + '</span><span>' + statusText + '</span>' +
        '</span></div>';
    });
    listEl.innerHTML = html;
    if (badgeEl) badgeEl.textContent = mountedCount + '/' + components.length;

    if (logEl) {
      var recent = window.__CP_DEBUG__.logs.slice(-8);
      var logHtml = '';
      recent.forEach(function(l) {
        logHtml += '<div style="line-height:1.3;"><span style="color:#64748b;">[' + l.time + ']</span> <b style="color:#38bdf8;">' + l.mod + ':</b> ' + escapeHtml(l.msg) + '</div>';
      });
      logEl.innerHTML = logHtml || '<span style="color:#64748b;">Chưa có log</span>';
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  createDebugPanel();
})();`;
