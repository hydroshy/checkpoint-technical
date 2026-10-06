/**
 * Helpers cho management-task-module (Quản Lý Phiếu Kỹ Thuật)
 */

/**
 * Chuẩn hóa tên Technician / Nhân viên (loại bỏ tiền tố KTV/Technician và phần mã "- VN...")
 */
export function formatTechnicianName(val?: string | null): string {
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
}

/**
 * Tính số lượng và tỷ lệ tiến độ chuỗi 1-1-1 từ phiếu CPS (link cả 3 phiếu CPSR, CPST, CPSF)
 */
export function getCpsChainProgress(row: any): { count: number; label: string; percent: number } {
  if (!row) return { count: 0, label: '0/3', percent: 0 };
  const hasCpsr = !!(row.cpsr || row.cpsrDocNo);
  const hasCpst = !!(row.cpst || row.cpstDocNo);
  const hasCpsf = !!(row.cpsf || row.cpsfDocNo);
  const count = (hasCpsr ? 1 : 0) + (hasCpst ? 1 : 0) + (hasCpsf ? 1 : 0);
  return {
    count,
    label: `${count}/3`,
    percent: Math.round((count / 3) * 100),
  };
}

/**
 * Lấy danh sách 3 mã phiếu liên kết trong chuỗi CPS
 */
export function getCpsLinkedDocNos(row: any): {
  cpsDocNo: string;
  cpsrDocNo: string;
  cpstDocNo: string;
  cpsfDocNo: string;
} {
  if (!row) return { cpsDocNo: '', cpsrDocNo: '', cpstDocNo: '', cpsfDocNo: '' };
  const cpsrDoc = row.cpsr?.docNo || row.cpsrDocNo || '';
  const cpstDoc = row.cpst?.docNo || row.cpstDocNo || '';
  const cpsfDoc = row.cpsf?.docNo || row.cpsfDocNo || '';
  const cpsDoc = row.docNo || (cpsrDoc ? cpsrDoc.replace('CPSR-', 'CPS-') : '');
  return {
    cpsDocNo: cpsDoc,
    cpsrDocNo: cpsrDoc,
    cpstDocNo: cpstDoc,
    cpsfDocNo: cpsfDoc,
  };
}

/**
 * Debounce function tối ưu tần suất gọi hàm (ví dụ: gõ tìm kiếm real-time)
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  waitMs = 150
): (...args: Parameters<T>) => void {
  let timeout: any = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
}
