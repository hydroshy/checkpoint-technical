export const CONTROL_PANEL_CSS = `    body {
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

    /* Light Mode (Default) */
    html.theme-light body {
      background-color: #f8fafc;
      color: #0f172a;
    }
    .theme-light .glass-header {
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 1px solid #cbd5e1;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-sidebar {
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .input-box {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .theme-light .input-box:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
    }
    .theme-light .input-box::placeholder {
      color: #64748b;
    }
    .theme-light .nav-item {
      color: #334155;
    }
    .theme-light .nav-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .theme-light .nav-item.active {
      background-color: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      border-left: 3px solid #0284c7;
    }

    /* Light Mode High Contrast Overrides */
    html.theme-light .text-slate-400 {
      color: #475569 !important;
    }
    html.theme-light .text-slate-500 {
      color: #334155 !important;
    }
    html.theme-light .text-sky-400 {
      color: #0284c7 !important;
    }
    html.theme-light .text-emerald-400 {
      color: #047857 !important;
    }
    html.theme-light .text-amber-400 {
      color: #b45309 !important;
    }
    html.theme-light .text-rose-400 {
      color: #be123c !important;
    }
    html.theme-light .text-purple-400 {
      color: #7e22ce !important;
    }
    html.theme-light .tabulator .btn-chain-view,
    html.theme-light .tabulator .btn-split-view {
      background-color: #f1f5f9 !important;
      color: #0284c7 !important;
      border: 1px solid #cbd5e1 !important;
    }
    html.theme-light .tabulator .btn-chain-view:hover,
    html.theme-light .tabulator .btn-split-view:hover {
      background-color: #e2e8f0 !important;
      color: #0369a1 !important;
    }
    html.theme-light .tabulator .btn-chain-assign {
      background-color: #fef3c7 !important;
      color: #b45309 !important;
      border: 1px solid #fcd34d !important;
    }
    html.theme-light .tabulator .btn-chain-assign:hover {
      background-color: #fde68a !important;
    }
    html.theme-light .tabulator .btn-chain-edit,
    html.theme-light .tabulator .btn-split-edit {
      background-color: #e0f2fe !important;
      color: #0369a1 !important;
      border: 1px solid #7dd3fc !important;
    }
    html.theme-light .tabulator .btn-chain-edit:hover,
    html.theme-light .tabulator .btn-split-edit:hover {
      background-color: #bae6fd !important;
      color: #0284c7 !important;
    }
    html.theme-light .tabulator .btn-chain-link {
      background-color: #f3e8ff !important;
      color: #7e22ce !important;
      border: 1px solid #d8b4fe !important;
    }
    html.theme-light .tabulator .btn-chain-link:hover {
      background-color: #e9d5ff !important;
      color: #6b21a8 !important;
    }
    html.theme-light .tabulator .btn-chain-del,
    html.theme-light .tabulator .btn-split-del {
      color: #e11d48 !important;
    }
    html.theme-light .tabulator .btn-chain-del:hover,
    html.theme-light .tabulator .btn-split-del:hover {
      background-color: #ffe4e6 !important;
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
    .theme-dark .glass-sidebar {
      background: #0f172a;
      border-right: 1px solid #1e293b;
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
    }
    .theme-dark .nav-item {
      color: #94a3b8;
    }
    .theme-dark .nav-item:hover {
      background-color: #1e293b;
      color: #ffffff;
    }
    .theme-dark .nav-item.active {
      background-color: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      font-weight: 700;
    }

    /* Modals */
    .modal-overlay {
      transition: opacity 0.25s ease;
    }
    .modal-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      transform: translateY(0) scale(1);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-overlay.show .modal-content {
      transform: translateY(0) scale(1);
    }

    /* =========================================================================
       TABULATOR MODERN THEME OVERRIDES (LIGHT & DARK)
       ========================================================================= */
    .tabulator {
      border: 1px solid #cbd5e1;
      border-radius: 1rem;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.8125rem;
      background-color: #ffffff;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .tabulator .tabulator-header {
      background-color: #f1f5f9;
      border-bottom: 2px solid #cbd5e1;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      font-size: 0.6875rem;
      letter-spacing: 0.05em;
    }
    .tabulator .tabulator-header .tabulator-col {
      background-color: #f1f5f9;
      border-right: 1px solid #e2e8f0;
    }
    .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
      background-color: #e2e8f0;
      color: #0f172a;
    }
    .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
      padding: 11px 14px;
    }
    .tabulator .tabulator-row {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      color: #0f172a;
      transition: background-color 0.15s ease;
    }
    .tabulator .tabulator-row:hover {
      background-color: #f8fafc !important;
    }
    .tabulator .tabulator-row.tabulator-row-even {
      background-color: #f8fafc;
    }
    .tabulator .tabulator-row.tabulator-row-even:hover {
      background-color: #f1f5f9 !important;
    }
    .tabulator .tabulator-cell {
      padding: 11px 14px;
      border-right: 1px solid #e2e8f0;
      vertical-align: middle;
      color: #0f172a;
    }
    .tabulator .tabulator-footer {
      background-color: #ffffff;
      border-top: 1px solid #cbd5e1;
      padding: 10px 16px;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tabulator .tabulator-page-size {
      padding: 5px 10px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-size: 0.75rem;
      font-weight: 600;
      color: #0f172a;
      outline: none;
    }
    .tabulator button.tabulator-page {
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #1e293b;
      padding: 4px 10px;
      margin: 0 2px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tabulator button.tabulator-page:hover:not(:disabled) {
      background-color: #f1f5f9;
      color: #0f172a;
      border-color: #94a3b8;
    }
    .tabulator button.tabulator-page.active {
      background-color: #0284c7 !important;
      border-color: #0284c7 !important;
      color: #ffffff !important;
    }
    .tabulator button.tabulator-page:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .tabulator .tabulator-placeholder span {
      color: #64748b;
      font-size: 0.8125rem;
      font-style: italic;
    }

    /* Dark Mode Tabulator */
    html.theme-dark .tabulator {
      border-color: #1e293b;
      background-color: #0f172a;
      color: #f1f5f9;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    html.theme-dark .tabulator .tabulator-header {
      background-color: #0f172a;
      border-bottom: 1px solid #1e293b;
      color: #94a3b8;
    }
    html.theme-dark .tabulator .tabulator-header .tabulator-col {
      background-color: #0f172a;
      border-right: 1px solid #1e293b;
    }
    html.theme-dark .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
      background-color: #1e293b;
    }
    html.theme-dark .tabulator .tabulator-row {
      background-color: #0f172a;
      border-bottom: 1px solid #1e293b;
      color: #f1f5f9;
    }
    html.theme-dark .tabulator .tabulator-row:hover {
      background-color: #1e293b !important;
    }
    html.theme-dark .tabulator .tabulator-row.tabulator-row-even {
      background-color: #0f172a;
    }
    html.theme-dark .tabulator .tabulator-cell {
      border-right: 1px solid #1e293b;
    }
    html.theme-dark .tabulator .tabulator-footer {
      background-color: #0f172a;
      border-top: 1px solid #1e293b;
      color: #94a3b8;
    }
    html.theme-dark .tabulator .tabulator-page-size {
      background: #0f172a;
      border-color: #334155;
      color: #f8fafc;
    }
    html.theme-dark .tabulator button.tabulator-page {
      border-color: #334155;
      background: #1e293b;
      color: #e2e8f0;
    }
    html.theme-dark .tabulator button.tabulator-page:hover:not(:disabled) {
      background-color: #334155;
      color: #ffffff;
    }
    html.theme-dark .tabulator button.tabulator-page.active {
      background-color: #38bdf8 !important;
      border-color: #38bdf8 !important;
      color: #0f172a !important;
    }
    html.theme-dark .tabulator .btn-chain-edit,
    html.theme-dark .tabulator .btn-split-edit {
      background-color: rgba(14, 165, 233, 0.15) !important;
      color: #38bdf8 !important;
      border: 1px solid rgba(14, 165, 233, 0.3) !important;
    }
    html.theme-dark .tabulator .btn-chain-edit:hover,
    html.theme-dark .tabulator .btn-split-edit:hover {
      background-color: rgba(14, 165, 233, 0.25) !important;
      color: #7dd3fc !important;
    }
    html.theme-dark .tabulator .btn-chain-link {
      background-color: rgba(168, 85, 247, 0.15) !important;
      color: #c084fc !important;
      border: 1px solid rgba(168, 85, 247, 0.3) !important;
    }
    html.theme-dark .tabulator .btn-chain-link:hover {
      background-color: rgba(168, 85, 247, 0.25) !important;
      color: #e9d5ff !important;
    }
    html.theme-dark .tabulator .btn-chain-del,
    html.theme-dark .tabulator .btn-split-del {
      color: #f43f5e !important;
    }
    html.theme-dark .tabulator .btn-chain-del:hover,
    html.theme-dark .tabulator .btn-split-del:hover {
      background-color: rgba(244, 63, 94, 0.15) !important;
    }`;
