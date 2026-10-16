/**
 * Bilingual Translation Dictionary and Helpers (EN / VI)
 * Default Language: EN
 */

export const I18N_DICTIONARY: Record<string, { en: string; vi: string }> = {
  // Common & Navigation
  'common.appName': { en: 'Checkpoint Systems', vi: 'Checkpoint Systems' },
  'common.dashboard': { en: 'Dashboard', vi: 'Bảng Điều Khiển' },
  'common.controlPanel': { en: 'Control Panel', vi: 'Bảng Quản Trị' },
  'common.settings': { en: 'Settings & Password', vi: 'Cài Đặt & Mật Khẩu' },
  'common.changePassword': { en: 'Change Password', vi: 'Đổi Mật Khẩu' },
  'common.logout': { en: 'Sign Out', vi: 'Đăng Xuất' },
  'common.theme': { en: 'Theme', vi: 'Giao Diện' },
  'common.light': { en: 'Light', vi: 'Sáng' },
  'common.dark': { en: 'Dark', vi: 'Tối' },
  'common.language': { en: 'Language', vi: 'Ngôn Ngữ' },
  'common.active': { en: 'Active', vi: 'Hoạt động' },
  'common.save': { en: 'Save', vi: 'Lưu' },
  'common.cancel': { en: 'Cancel', vi: 'Hủy' },
  'common.close': { en: 'Close', vi: 'Đóng' },
  'common.confirm': { en: 'Confirm', vi: 'Xác Nhận' },
  'common.search': { en: 'Search', vi: 'Tìm kiếm' },
  'common.filter': { en: 'Filter', vi: 'Lọc' },
  'common.actions': { en: 'Actions', vi: 'Thao Tác' },
  'common.status': { en: 'Status', vi: 'Trạng Thái' },
  'common.exportExcel': { en: 'Export Excel', vi: 'Xuất Excel' },
  'common.add': { en: 'Add', vi: 'Thêm' },
  'common.edit': { en: 'Edit', vi: 'Sửa' },
  'common.delete': { en: 'Delete', vi: 'Xóa' },
  'common.reset': { en: 'Reset', vi: 'Đặt lại' },
  'common.all': { en: 'All', vi: 'Tất cả' },
  'common.success': { en: 'Success', vi: 'Thành công' },
  'common.error': { en: 'Error', vi: 'Lỗi' },
  'common.loading': { en: 'Loading...', vi: 'Đang tải...' },
  'common.noData': { en: 'No data available', vi: 'Không có dữ liệu' },

  // Control Panel Sidebar & Sections
  'cp.overview': { en: 'Overview Hub', vi: 'Trung Tâm Tổng Quan' },
  'cp.assignTasks': { en: 'Task Assignment', vi: 'Phân Công Công Việc' },
  'cp.manageTasks': { en: 'Task Management', vi: 'Quản Lý Phiếu (CPS)' },
  'cp.masterData': { en: 'Master Data', vi: 'Dữ Liệu Gốc' },
  'cp.reportTechnical': { en: 'Report Technical', vi: 'Báo Cáo Kỹ Thuật' },
  'cp.machines': { en: 'Machines', vi: 'Máy Móc' },
  'cp.employees': { en: 'Employees', vi: 'Nhân Sự' },
  'cp.users': { en: 'Users & RBAC', vi: 'Tài Khoản & Phân Quyền' },
  'cp.database': { en: 'Database', vi: 'Cơ Sở Dữ Liệu' },

  // Dashboard Navigation & Cards
  'dash.createRequest': { en: 'Create Request (CPSR)', vi: 'Tạo Yêu Cầu (CPSR)' },
  'dash.technicalFeedback': { en: 'Technical Feedback (CPST)', vi: 'Phản Hồi Kỹ Thuật (CPST)' },
  'dash.confirmAcceptance': { en: 'Acceptance & Closure (CPSF)', vi: 'Nghiệm Thu Hoàn Tất (CPSF)' },
  'dash.weeklyKpi': { en: 'Weekly KPI', vi: 'KPI Hàng Tuần' },
  'dash.weeklyRequests': { en: 'Weekly Requests', vi: 'Danh Sách Yêu Cầu' },
  'dash.defectLogs': { en: 'Defect Logs', vi: 'Nhật Ký Sự Cố' },
  'dash.actionPlans': { en: 'Action Plans', vi: 'Kế Hoạch Hành Động' },
  'dash.requesters': { en: 'Requesters', vi: 'Người Yêu Cầu' },

  // KPI Metrics
  'kpi.totalRequests': { en: 'Total Requests', vi: 'Tổng Yêu Cầu' },
  'kpi.slaRate': { en: 'SLA Met Rate', vi: 'Tỷ Lệ Đạt SLA' },
  'kpi.open': { en: 'Open', vi: 'Đang Mở' },
  'kpi.inProgress': { en: 'In Progress', vi: 'Đang Xử Lý' },
  'kpi.closed': { en: 'Closed', vi: 'Đã Đóng' },
  'kpi.overdue': { en: 'Overdue', vi: 'Quá Hạn' },
  'kpi.totalDefects': { en: 'Total Defects', vi: 'Tổng Sự Cố' },
  'kpi.eightD': { en: '8D Required', vi: 'Yêu Cầu 8D' },
  'kpi.recurring': { en: 'Recurring', vi: 'Lặp Lại' },
  'kpi.completedActions': { en: 'Completed Actions', vi: 'Hành Động Hoàn Thành' },
  'kpi.fourMRatio': { en: '4M Ratio', vi: 'Tỷ Lệ 4M' },

  // 4M Categories
  'rootCause.man': { en: 'Man (Human)', vi: 'Man (Con người)' },
  'rootCause.machine': { en: 'Machine (Equipment)', vi: 'Machine (Máy móc / Thiết bị)' },
  'rootCause.material': { en: 'Material', vi: 'Material (Nguyên vật liệu)' },
  'rootCause.method': { en: 'Method (Process)', vi: 'Method (Phương pháp / Quy trình)' },
  'rootCause.systemProcess': { en: 'System / Process', vi: 'System / Process (Hệ thống / Quy trình)' },

  // Users & Password Management
  'user.username': { en: 'Username', vi: 'Tên Đăng Nhập' },
  'user.fullName': { en: 'Full Name', vi: 'Họ và Tên' },
  'user.email': { en: 'Email', vi: 'Email' },
  'user.role': { en: 'Role', vi: 'Vai Trò' },
  'user.permissions': { en: 'Permissions', vi: 'Phân Quyền' },
  'user.addUser': { en: 'Add User Account', vi: 'Thêm Tài Khoản Đăng Nhập' },
  'user.resetPassword': { en: 'Reset Password', vi: 'Đặt Lại Mật Khẩu' },
  'user.oldPassword': { en: 'Current Password', vi: 'Mật Khẩu Hiện Tại' },
  'user.newPassword': { en: 'New Password', vi: 'Mật Khẩu Mới' },
  'user.confirmPassword': { en: 'Confirm New Password', vi: 'Xác Nhận Mật Khẩu Mới' },
  'user.passwordMinLength': { en: 'Password must be at least 6 characters.', vi: 'Mật khẩu phải có ít nhất 6 ký tự.' },
  'user.passwordMismatch': { en: 'New passwords do not match.', vi: 'Mật khẩu xác nhận không khớp.' },
  'user.passwordChangedSuccess': { en: 'Password changed successfully!', vi: 'Đổi mật khẩu thành công!' },
  'user.passwordResetSuccess': { en: 'Password reset successfully for user', vi: 'Đã đặt lại mật khẩu thành công cho' },
};

/**
 * Client-side script snippet to inject into views.
 * Initializes currentLang (default 'en'), setLanguage, t(en, vi)
 */
export const I18N_CLIENT_SCRIPT = `
  window.__I18N_DICT__ = ${JSON.stringify(I18N_DICTIONARY)};
  
  // Initialize language: Default to 'en', or load from localStorage
  var __savedLang = localStorage.getItem('checkpoint_lang');
  if (!__savedLang) {
    __savedLang = 'en';
    localStorage.setItem('checkpoint_lang', 'en');
  }
  document.documentElement.setAttribute('lang', __savedLang);
`;
