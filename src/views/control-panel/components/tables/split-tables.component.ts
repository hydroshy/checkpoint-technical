import { CP_MANAGEMENT_TASKS_TAB_HTML } from '../../modules/management-task-module';

/**
 * Re-export CP_MANAGEMENT_TASKS_TAB_HTML as CP_SPLIT_TABLES_HTML
 * Đảm bảo tương thích ngược 100% với các import hiện có trong Control Panel
 */
export const CP_SPLIT_TABLES_HTML = CP_MANAGEMENT_TASKS_TAB_HTML;
