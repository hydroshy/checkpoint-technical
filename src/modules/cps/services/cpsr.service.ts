import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, CpsrRecord, CpsRecord } from '../../database/database.service';
import { CreateCpsrDto, UpdateCpsrDto, FormFilterQuery } from '../dto';

@Injectable()
export class CpsrService {
  private readonly logger = new Logger(CpsrService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getNextCpsrDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPSR');
    return { docNo };
  }

  async createCpsr(dto: CreateCpsrDto, creator?: any): Promise<CpsrRecord> {
    let docNo = dto.docNo?.trim();
    if (!docNo) {
      docNo = await this.dbService.getNextDocNo('CPSR');
    } else {
      const existing = this.dbService.getCpsrByIdOrDocNo(docNo);
      if (existing) {
        throw new BadRequestException(`Mã phiếu CPSR ${docNo} đã tồn tại trong hệ thống.`);
      }
    }

    const now = new Date().toISOString();
    const record: CpsrRecord = {
      id: uuidv4(),
      docNo,
      reqDate: dto.reqDate,
      reqTime: dto.reqTime,
      reqBy: dto.reqBy,
      printTech: dto.printTech,
      machineName: dto.machineName,
      problem: dto.problem,
      machineStatus: dto.machineStatus || undefined,
      priority: dto.priority || undefined,
      priorityOther: dto.priorityOther || undefined,
      submittedAt: now,
      createdBy: creator?.username || creator?.fullName || 'public',
      createdAt: now,
      updatedAt: now,
    };

    await this.dbService.addCpsr(record);
    this.logger.log(`📋 CPSR created: ${record.docNo} by ${record.createdBy}`);

    // Tự động tạo và liên kết bản ghi CPS (CPS-YYYYMMDD-XXX)
    try {
      const cpsDocNo = await this.dbService.getNextDocNo('CPS');
      const cpsRecord: CpsRecord = {
        id: uuidv4(),
        docNo: cpsDocNo,
        cpsrId: record.id,
        cpsrDocNo: record.docNo,
        cpstId: null,
        cpstDocNo: null,
        cpsfId: null,
        cpsfDocNo: null,
        status: 'TO_ASSIGN',
        assignedTo: null,
        assignedToId: null,
        assignedToName: null,
        assignedBy: null,
        assignedAt: null,
        deadline: null,
        priority: record.priority,
        printTech: record.printTech,
        machineName: record.machineName,
        problem: record.problem,
        reqBy: record.reqBy,
        reqDate: record.reqDate,
        reqTime: record.reqTime,
        downtime: 0,
        woTotalQty: 0,
        wasteQty: 0,
        wastePercent: '0%',
        wasteUnit: null,
        workOrder: null,
        chkStatus: null,
        chkQuality: null,
        notes: null,
        closedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      await this.dbService.addCps(cpsRecord);
      this.logger.log(`🔗 CPS auto-created: ${cpsRecord.docNo} linked to CPSR ${record.docNo}`);
    } catch (cpsErr: any) {
      this.logger.error(`Error auto-creating CPS for CPSR ${record.docNo}: ${cpsErr.message}`);
    }

    return record;
  }

  findAllCpsr(query?: FormFilterQuery) {
    let list = [...this.dbService.getCpsrList()];

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.docNo && r.docNo.toLowerCase().includes(q)) ||
        (r.reqBy && r.reqBy.toLowerCase().includes(q)) ||
        (r.machineName && r.machineName.toLowerCase().includes(q)) ||
        (r.problem && r.problem.toLowerCase().includes(q))
      );
    }

    if (query?.printTech && query.printTech !== 'ALL') {
      list = list.filter(r => r.printTech === query.printTech);
    }

    if (query?.machineStatus && query.machineStatus !== 'ALL') {
      list = list.filter(r => r.machineStatus === query.machineStatus);
    }

    if (query?.priority && query.priority !== 'ALL') {
      list = list.filter(r => r.priority === query.priority);
    }

    if (query?.dateFrom) {
      list = list.filter(r => (r.reqDate || r.createdAt.slice(0, 10)) >= query.dateFrom!);
    }

    if (query?.dateTo) {
      list = list.filter(r => (r.reqDate || r.createdAt.slice(0, 10)) <= query.dateTo!);
    }

    const total = list.length;
    const offset = query?.offset ? Number(query.offset) : 0;
    const limit = query?.limit ? Number(query.limit) : 1000;
    const paged = list.slice(offset, offset + limit);

    const cpstByCpsr = new Map<string, any>();
    for (const t of this.dbService.getCpstList()) {
      if (t.cpsrDocNo) cpstByCpsr.set(t.cpsrDocNo, t);
    }
    const cpsfByCpst = new Map<string, any>();
    for (const f of this.dbService.getCpsfList()) {
      if (f.cpstDocNo) cpsfByCpst.set(f.cpstDocNo, f);
    }

    const data = paged.map(cpsr => {
      const cpst = cpstByCpsr.get(cpsr.docNo) || null;
      const cpsf = cpst ? (cpsfByCpst.get(cpst.docNo) || null) : null;
      return {
        ...cpsr,
        cpst,
        cpsf,
        hasCpst: !!cpst,
        hasCpsf: !!cpsf,
        chainStatus: cpsf ? 'Completed' : (cpst ? 'Pending CPSF' : 'Pending CPST'),
      };
    });

    return { total, data };
  }

  findCpsrOne(idOrDocNo: string) {
    const cpsr = this.dbService.getCpsrByIdOrDocNo(idOrDocNo);
    if (!cpsr) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSR với mã hoặc ID: ${idOrDocNo}`);
    }
    const cpst = this.dbService.getCpstList().find(t => t.cpsrDocNo === cpsr.docNo) || null;
    const cpsf = cpst ? (this.dbService.getCpsfList().find(f => f.cpstDocNo === cpst.docNo) || null) : null;
    return {
      ...cpsr,
      cpst,
      cpsf,
      chainStatus: cpsf ? 'Completed' : (cpst ? 'Pending CPSF' : 'Pending CPST'),
    };
  }

  async updateCpsr(id: string, dto: UpdateCpsrDto, user?: any) {
    const existing = this.dbService.getCpsrByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSR với mã hoặc ID: ${id}`);
    }
    const updated = await this.dbService.updateCpsr(existing.id, dto);
    const existingCps = this.dbService.getCpsByCpsrDocNo(existing.docNo);
    if (existingCps) {
      await this.dbService.updateCps(existingCps.id, {
        ...(dto.priority ? { priority: dto.priority } : {}),
        ...(dto.printTech ? { printTech: dto.printTech } : {}),
        ...(dto.machineName ? { machineName: dto.machineName } : {}),
        ...(dto.problem ? { problem: dto.problem } : {}),
        ...(dto.reqBy ? { reqBy: dto.reqBy } : {}),
        ...(dto.reqDate ? { reqDate: dto.reqDate } : {}),
        ...(dto.reqTime ? { reqTime: dto.reqTime } : {}),
      });
    }
    this.logger.log(`✏️ CPSR updated: ${existing.docNo} by ${user?.username || 'system'}`);
    return updated;
  }

  async deleteCpsr(id: string) {
    const existing = this.dbService.getCpsrByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSR với mã hoặc ID: ${id}`);
    }
    const existingCps = this.dbService.getCpsByCpsrDocNo(existing.docNo);
    if (existingCps) {
      await this.dbService.deleteCps(existingCps.id);
    }
    await this.dbService.deleteCpsr(existing.id);
    this.logger.log(`🗑️ CPSR deleted: ${existing.docNo}`);
    return { success: true, message: `Đã xóa thành công phiếu CPSR ${existing.docNo} cùng chuỗi phản hồi liên quan.` };
  }

  getAvailableCpsrForCpst() {
    return this.dbService.getAvailableCpsrForCpst();
  }
}
