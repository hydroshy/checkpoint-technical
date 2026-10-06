/**
 * Styles dành riêng cho management-task-module (Quản Lý Phiếu Kỹ Thuật)
 */
export const MANAGEMENT_TASK_CSS = `
  /* Tabulator container inside management-task-module */
  .management-task-container {
    contain: layout paint;
  }

  /* 4 Core sections sub-tab pill transitions */
  .management-subtab-btn {
    transition: all 0.15s ease-in-out;
  }

  /* CPS Link badges */
  .cps-linked-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;
