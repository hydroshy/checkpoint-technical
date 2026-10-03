import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, TechnicalRequestRecord } from '../database/database.service';
import { CreateTechnicalRequestDto } from './dto/create-technical-request.dto';
import { UpdateTechnicalRequestDto } from './dto/update-technical-request.dto';

export interface RequestFilterQuery {
  search?: string;
  printTech?: string;
  chkStatus?: string;
  priority?: string;
  errCat?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class TechnicalRequestsService {
  private readonly logger = new Logger(TechnicalRequestsService.name);

  constructor(private readonly dbService: DatabaseService) {}

  private generateDocNo(): string {
    const d = new Date();
    const p = (v: number) => String(v).padStart(2, '0');
    return `REQ-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }

  async findAll(query?: RequestFilterQuery) {
    let list = [...this.dbService.getRequests()];

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.docNo && r.docNo.toLowerCase().includes(q)) ||
        (r.machineName && r.machineName.toLowerCase().includes(q)) ||
        (r.reqBy && r.reqBy.toLowerCase().includes(q)) ||
        (r.recvBy && r.recvBy.toLowerCase().includes(q)) ||
        (r.problem && r.problem.toLowerCase().includes(q)) ||
        (r.workOrder && r.workOrder.toLowerCase().includes(q))
      );
    }

    if (query?.printTech && query.printTech !== 'ALL') {
      list = list.filter(r => r.printTech === query.printTech);
    }

    if (query?.chkStatus && query.chkStatus !== 'ALL') {
      list = list.filter(r => r.chkStatus === query.chkStatus);
    }

    if (query?.priority && query.priority !== 'ALL') {
      list = list.filter(r => r.priority === query.priority);
    }

    if (query?.errCat && query.errCat !== 'ALL') {
      list = list.filter(r => r.errCat === query.errCat);
    }

    if (query?.dateFrom) {
      list = list.filter(r => r.reqDate >= query.dateFrom!);
    }

    if (query?.dateTo) {
      list = list.filter(r => r.reqDate <= query.dateTo!);
    }

    if (query?.createdBy) {
      list = list.filter(r => r.createdBy === query.createdBy);
    }

    const total = list.length;
    const offset = query?.offset ? Number(query.offset) : 0;
    const limit = query?.limit ? Number(query.limit) : 100;

    const items = list.slice(offset, offset + limit);

    return {
      items,
      total,
      offset,
      limit,
    };
  }

  async findOne(id: string): Promise<TechnicalRequestRecord> {
    const item = this.dbService.getRequestById(id);
    if (!item) {
      throw new NotFoundException(`Phiếu yêu cầu '${id}' không tồn tại trên hệ thống.`);
    }
    return item;
  }

  async create(dto: CreateTechnicalRequestDto, user?: any): Promise<TechnicalRequestRecord> {
    const now = new Date().toISOString();
    const docNo = dto.docNo?.trim() || this.generateDocNo();

    const record: TechnicalRequestRecord = {
      id: uuidv4(),
      docNo,
      reqDate: dto.reqDate,
      reqTime: dto.reqTime,
      reqBy: dto.reqBy,
      printTech: dto.printTech,
      machineName: dto.machineName,
      problem: dto.problem,
      machineStatus: dto.machineStatus,
      priority: dto.priority || 'Immediate',
      priorityOther: dto.priorityOther,
      recvBy: dto.recvBy,
      recvDate: dto.recvDate,
      recvTime: dto.recvTime,
      finishDate: dto.finishDate,
      finishTime: dto.finishTime,
      downtime: dto.downtime !== undefined ? Number(dto.downtime) : undefined,
      rootCause: dto.rootCause,
      actionTaken: dto.actionTaken,
      errCat: dto.errCat,
      errType: dto.errType,
      photosBefore: dto.photosBefore || [],
      photosAfter: dto.photosAfter || [],
      chkQuality: dto.chkQuality || 'OK',
      chkStatus: dto.chkStatus || 'DONE',
      workOrder: dto.workOrder,
      woTotalQty: dto.woTotalQty ? Number(dto.woTotalQty) : undefined,
      wasteQty: dto.wasteQty ? Number(dto.wasteQty) : undefined,
      wasteUnit: dto.wasteUnit,
      wastePercent: dto.wastePercent,
      prodMgr: dto.prodMgr,
      createdBy: user?.username || 'system',
      createdAt: now,
      updatedAt: now,
    };

    this.dbService.addRequest(record);
    this.logger.log(`📄 Technical request created: ${record.docNo} by ${record.createdBy}`);
    return record;
  }

  async update(id: string, dto: UpdateTechnicalRequestDto, user?: any): Promise<TechnicalRequestRecord> {
    const existing = await this.findOne(id);
    const updated = this.dbService.updateRequest(existing.id, {
      ...dto,
      downtime: dto.downtime !== undefined ? Number(dto.downtime) : existing.downtime,
      woTotalQty: dto.woTotalQty !== undefined ? Number(dto.woTotalQty) : existing.woTotalQty,
      wasteQty: dto.wasteQty !== undefined ? Number(dto.wasteQty) : existing.wasteQty,
    });
    if (!updated) {
      throw new NotFoundException(`Không thể cập nhật phiếu '${id}'.`);
    }
    this.logger.log(`✏️ Technical request updated: ${updated.docNo} by ${user?.username || 'system'}`);
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.findOne(id);
    this.dbService.deleteRequest(existing.id);
    this.logger.log(`🗑️ Technical request deleted: ${existing.docNo}`);
    return { success: true, message: `Đã xóa thành công phiếu ${existing.docNo}` };
  }

  async getStats() {
    const all = this.dbService.getRequests();

    let doneCount = 0;
    let monitorCount = 0;
    let supportCount = 0;
    let totalDowntime = 0;
    let downtimeItemsCount = 0;
    let totalWastePercent = 0;
    let wastePercentCount = 0;

    const techCounts: Record<string, number> = {};
    const errCatCounts: Record<string, number> = { MAN: 0, MACHINE: 0, MATERIAL: 0, METHOD: 0 };
    const errTypeCounts: Record<string, number> = { Prepress: 0, Press: 0, PostPress: 0 };
    const qualityCounts: Record<string, number> = { OK: 0, NG: 0 };
    const machineCounts: Record<string, number> = {};

    for (const r of all) {
      if (r.chkStatus === 'DONE') doneCount++;
      else if (r.chkStatus === 'MONITOR') monitorCount++;
      else if (r.chkStatus === 'SUPPORT') supportCount++;

      if (r.downtime && r.downtime > 0) {
        totalDowntime += r.downtime;
        downtimeItemsCount++;
      }

      if (r.wastePercent) {
        const num = parseFloat(r.wastePercent.replace('%', ''));
        if (!isNaN(num)) {
          totalWastePercent += num;
          wastePercentCount++;
        }
      }

      if (r.printTech) {
        techCounts[r.printTech] = (techCounts[r.printTech] || 0) + 1;
      }

      if (r.errCat && errCatCounts[r.errCat] !== undefined) {
        errCatCounts[r.errCat]++;
      }

      if (r.errType && errTypeCounts[r.errType] !== undefined) {
        errTypeCounts[r.errType]++;
      }

      if (r.chkQuality && qualityCounts[r.chkQuality] !== undefined) {
        qualityCounts[r.chkQuality]++;
      }

      if (r.machineName) {
        machineCounts[r.machineName] = (machineCounts[r.machineName] || 0) + 1;
      }
    }

    // Top machines with problems
    const topMachines = Object.entries(machineCounts)
      .map(([machine, count]) => ({ machine, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total: all.length,
      done: doneCount,
      monitor: monitorCount,
      support: supportCount,
      totalDowntimeMinutes: totalDowntime,
      avgDowntimeMinutes: downtimeItemsCount > 0 ? Math.round(totalDowntime / downtimeItemsCount) : 0,
      avgWastePercent: wastePercentCount > 0 ? Number((totalWastePercent / wastePercentCount).toFixed(2)) : 0,
      techDistribution: techCounts,
      errCatDistribution: errCatCounts,
      errTypeDistribution: errTypeCounts,
      qualityDistribution: qualityCounts,
      topMachines,
    };
  }

  async exportAll() {
    return this.dbService.getRequests();
  }

  async importAll(requests: TechnicalRequestRecord[]) {
    if (!Array.isArray(requests)) {
      throw new Error('Data import must be an array of technical requests');
    }
    for (const r of requests) {
      if (!r.id) r.id = uuidv4();
      if (!r.docNo) r.docNo = this.generateDocNo();
      const existing = this.dbService.getRequestById(r.id);
      if (existing) {
        this.dbService.updateRequest(r.id, r);
      } else {
        this.dbService.addRequest(r);
      }
    }
    return { success: true, count: requests.length };
  }
}
