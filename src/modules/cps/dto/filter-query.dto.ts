export interface FormFilterQuery {
  search?: string;
  printTech?: string;
  machineStatus?: string;
  priority?: string;
  chkStatus?: string;
  chkQuality?: string;
  status?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
  paginate?: boolean | string;
}
