export const DASHBOARD_CSS = `    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      -webkit-tap-highlight-color: transparent;
    }
    [v-cloak] { display: none !important; }
    
    h1, h2, h3, h4, .brand-title {
      font-family: 'Host Grotesk', 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'Azeret Mono', monospace !important;
    }

    /* Light Theme */
    html.theme-light body {
      background-color: #f8fafc;
      color: #0f172a;
    }
    .theme-light .glass-header {
      background: rgba(255, 255, 255, 0.96);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .theme-light .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
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
    .theme-light .data-table thead th {
      background-color: #f1f5f9;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
    }
    .theme-light .data-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
    }
    .theme-light .data-table tbody tr:hover {
      background-color: #f8fafc;
    }

    /* Dark Theme */
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
    .theme-dark .data-table thead th {
      background-color: #0b1329;
      color: #94a3b8;
      border-bottom: 1px solid #1e293b;
    }
    .theme-dark .data-table tbody tr {
      border-bottom: 1px solid #1e293b;
    }
    .theme-dark .data-table tbody tr:hover {
      background-color: rgba(30, 41, 59, 0.5);
    }

    /* Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
    }

    /* Badges */
    .badge-critical { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-high { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
    .badge-medium { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .badge-low { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

    .theme-dark .badge-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
    .theme-dark .badge-high { background: rgba(249, 115, 22, 0.2); color: #fb923c; border-color: rgba(249, 115, 22, 0.3); }
    .theme-dark .badge-medium { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border-color: rgba(14, 165, 233, 0.3); }
    .theme-dark .badge-low { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; border-color: rgba(148, 163, 184, 0.3); }

    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(2, 6, 23, 0.7);
      backdrop-filter: blur(4px);
      z-index: 60;
    }
    .modal-content {
      transform: translateY(0);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
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
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 4px;
      margin-bottom: 2px;
      color: #0369a1;
    }
    .pdf-sub-title {
      font-size: 10px;
      text-align: center;
      color: #4b5563;
      margin-bottom: 12px;
    }
    .pdf-signature-box {
      display: flex;
      justify-content: space-between;
      padding: 15px 30px 10px 30px;
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

    /* Tabulator Table Styles */
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
    }`;
