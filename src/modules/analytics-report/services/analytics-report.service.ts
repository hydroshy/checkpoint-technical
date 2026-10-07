import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface ReportStatsResult {
  totalRequests: number;
  totalDowntimeMinutes: number;
  totalDowntimeHours: number;
  openTask: number;
  toAssign: number;
  inProgress: number;
  toConfirm?: number;
  closed: number;
  overDue: number;
  totalStatusCps: number;
  avgDowntimeMinutes: number;
}

export interface KpiSummaryResult {
  totalRequests: number;
  closedCount: number;
  closedPercent: string;
  totalDowntimeMinutes: number;
  avgDowntimeMinutes: number;
  totalWasteQty: number;
  avgWastePercent: string;
}

export interface DowntimeAnalyticsResult {
  totalDowntimeMinutes: number;
  totalDowntimeHours: number;
  downtimeByMachine: Record<string, number>;
  downtimeByTech: Record<string, number>;
  topMachines: Array<{ machineName: string; printTech: string; downtimeMinutes: number }>;
}

@Injectable()
export class AnalyticsReportService {
  constructor(private readonly dbService: DatabaseService) {}

  getControlPanelInitData(user: any) {
    const isAdmin =
      user &&
      (user.role === 'ADMIN' ||
        user.userType === 'ADMIN' ||
        user.permissions?.canAccessControlPanel);

    const allReqs = this.dbService.getRequests();
    let done = 0;
    let monitor = 0;
    let support = 0;
    let totalDowntimeMinutes = 0;
    let dtCount = 0;
    for (const r of allReqs) {
      if (r.chkStatus === 'DONE') done++;
      else if (r.chkStatus === 'MONITOR') monitor++;
      else if (r.chkStatus === 'SUPPORT') support++;
      if (r.downtime && r.downtime > 0) {
        totalDowntimeMinutes += r.downtime;
        dtCount++;
      }
    }

    const machines = this.dbService.getMachines();
    const machinesGrouped: Record<string, string[]> = {};
    for (const m of machines) {
      if (m.isActive !== false) {
        if (!machinesGrouped[m.tech]) machinesGrouped[m.tech] = [];
        if (!machinesGrouped[m.tech].includes(m.name)) machinesGrouped[m.tech].push(m.name);
      }
    }

    return {
      success: true,
      stats: {
        total: allReqs.length,
        done,
        monitor,
        support,
        totalDowntimeMinutes,
        avgDowntimeMinutes: dtCount > 0 ? Math.round(totalDowntimeMinutes / dtCount) : 0,
      },
      machines,
      machinesGrouped,
      cps: this.dbService.getCpsList(),
      cpsrChain: this.dbService.getCpsrChainList(),
      employees: this.dbService.getEmployees(),
      publicFormEnabled: this.dbService.getSettings()?.isPublicFormEnabled ?? true,
      users: isAdmin
        ? this.dbService.getUsers().map(({ passwordHash, ...u }) => u)
        : undefined,
    };
  }

  getControlPanelStats(dateFrom?: string, dateTo?: string): ReportStatsResult {
    let list = this.dbService.getCpsList();

    if (dateFrom) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) <= dateTo);
    }

    let openTask = 0;
    let toAssign = 0;
    let inProgress = 0;
    let toConfirm = 0;
    let closed = 0;
    let overDue = 0;
    let totalDowntimeMinutes = 0;
    let dtIncidentsCount = 0;

    for (const item of list) {
      if (item.status === 'CLOSED') closed++;
      else if (item.status === 'OVER_DUE') overDue++;
      else if (item.status === 'TO_CONFIRM') toConfirm++;
      else if (item.status === 'IN_PROGRESS') inProgress++;
      else if (item.status === 'OPEN_TASK') openTask++;
      else toAssign++;

      const dt = Number(item.downtime) || 0;
      if (dt > 0) {
        totalDowntimeMinutes += dt;
        dtIncidentsCount++;
      }
    }

    const totalStatusCps = openTask + toAssign + inProgress + toConfirm + closed + overDue;
    const totalDowntimeHours = Math.round((totalDowntimeMinutes / 60) * 10) / 10;
    const avgDowntimeMinutes =
      dtIncidentsCount > 0 ? Math.round(totalDowntimeMinutes / dtIncidentsCount) : 0;

    return {
      totalRequests: list.length,
      totalDowntimeMinutes,
      totalDowntimeHours,
      openTask,
      toAssign,
      inProgress,
      toConfirm,
      closed,
      overDue,
      totalStatusCps,
      avgDowntimeMinutes,
    };
  }

  getKpiSummary(dateFrom?: string, dateTo?: string): KpiSummaryResult {
    let list = this.dbService.getCpsList();

    if (dateFrom) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) <= dateTo);
    }

    let closedCount = 0;
    let totalDowntimeMinutes = 0;
    let dtCount = 0;
    let totalWasteQty = 0;
    let totalWoQty = 0;

    for (const r of list) {
      if (r.status === 'CLOSED') closedCount++;
      const dt = Number(r.downtime) || 0;
      if (dt > 0) {
        totalDowntimeMinutes += dt;
        dtCount++;
      }
      if (r.wasteQty) totalWasteQty += Number(r.wasteQty);
      if (r.woTotalQty) totalWoQty += Number(r.woTotalQty);
    }

    const totalRequests = list.length;
    const closedPercent =
      totalRequests > 0 ? ((closedCount / totalRequests) * 100).toFixed(1) + '%' : '0%';
    const avgDowntimeMinutes =
      dtCount > 0 ? Math.round(totalDowntimeMinutes / dtCount) : 0;
    const avgWastePercent =
      totalWoQty > 0 ? ((totalWasteQty / totalWoQty) * 100).toFixed(2) + '%' : '0%';

    return {
      totalRequests,
      closedCount,
      closedPercent,
      totalDowntimeMinutes,
      avgDowntimeMinutes,
      totalWasteQty,
      avgWastePercent,
    };
  }

  getDowntimeAnalytics(
    dateFrom?: string,
    dateTo?: string,
    printTech?: string,
  ): DowntimeAnalyticsResult {
    let list = this.dbService.getCpsList();

    if (dateFrom) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) <= dateTo);
    }
    if (printTech && printTech !== 'ALL') {
      list = list.filter((r) => r.printTech === printTech);
    }

    const downtimeByMachine: Record<string, number> = {};
    const downtimeByTech: Record<string, number> = {};
    const machineTechMap: Record<string, string> = {};
    let totalDowntimeMinutes = 0;

    for (const r of list) {
      const dt = Number(r.downtime) || 0;
      if (dt > 0) {
        totalDowntimeMinutes += dt;
        const m = r.machineName || 'Chưa xác định';
        const t = r.printTech || 'Khác';
        downtimeByMachine[m] = (downtimeByMachine[m] || 0) + dt;
        downtimeByTech[t] = (downtimeByTech[t] || 0) + dt;
        machineTechMap[m] = t;
      }
    }

    const topMachines = Object.entries(downtimeByMachine)
      .map(([machineName, downtimeMinutes]) => ({
        machineName,
        printTech: machineTechMap[machineName] || 'Khác',
        downtimeMinutes,
      }))
      .sort((a, b) => b.downtimeMinutes - a.downtimeMinutes);

    return {
      totalDowntimeMinutes,
      totalDowntimeHours: Math.round((totalDowntimeMinutes / 60) * 10) / 10,
      downtimeByMachine,
      downtimeByTech,
      topMachines,
    };
  }

  getReportTechnical(dateFrom?: string, dateTo?: string) {
    const stats = this.getControlPanelStats(dateFrom, dateTo);
    const kpi = this.getKpiSummary(dateFrom, dateTo);
    const downtime = this.getDowntimeAnalytics(dateFrom, dateTo);

    let list = this.dbService.getCpsList();
    if (dateFrom) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((r) => (r.reqDate || r.createdAt.slice(0, 10)) <= dateTo);
    }

    return {
      stats,
      kpi,
      downtime,
      records: list,
    };
  }
}
