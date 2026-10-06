/**
 * Helper: Chuẩn hóa hiển thị tên nhân viên/Technician
 * Loại bỏ các tiền tố KTV/Technician và mã nhân viên đính kèm nếu có để chỉ lấy tên nhân viên thực tế.
 * Ví dụ: 'KTV Đỗ Đức Nhật - VN5944' -> 'Đỗ Đức Nhật'
 *        'KTV Đỗ Đức Nhật - VN' -> 'Đỗ Đức Nhật'
 *        'Đỗ Đức Nhật - VN5944' -> 'Đỗ Đức Nhật'
 *        'Đỗ Đức Nhật' -> 'Đỗ Đức Nhật'
 */
export function formatTechnicianName(val?: string | null): string {
  if (!val) return '';
  let str = String(val).trim();
  // Loại bỏ tiền tố KTV / Technician (không phân biệt hoa thường)
  str = str.replace(/^(KTV|ktv|Technician|technician)\s*[-:]?\s*/i, '').trim();
  // Nếu có dạng "Tên - Mã" hoặc "Tên - VN...", chỉ lấy phần Tên nhân viên
  if (str.includes(' - ')) {
    const parts = str.split(' - ');
    if (parts[0] && parts[0].trim()) {
      str = parts[0].trim();
    }
  }
  return str;
}

/**
 * Lấy tên Technician hiển thị từ đối tượng CPS/Ticket
 */
export function getTechnicianDisplayName(item: any): string {
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
}

/**
 * Trả về class border tương ứng với trạng thái của Card (hỗ trợ Light & Dark mode)
 */
export function getCardBorderClass(status?: string | null): string {
  const s = (status || '').toUpperCase().trim();
  if (s === 'TO_ASSIGN') return 'border-amber-300 dark:border-amber-500/40 hover:border-amber-500';
  if (s === 'IN_PROGRESS') return 'border-sky-300 dark:border-sky-500/40 hover:border-sky-500';
  if (s === 'OVER_DUE') return 'border-rose-300 dark:border-rose-500/40 hover:border-rose-500';
  if (s === 'CLOSED') return 'border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-500';
  return 'border-slate-200 dark:border-slate-700/60 hover:border-slate-400 dark:hover:border-slate-500';
}
