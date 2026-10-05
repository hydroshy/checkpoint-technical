import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DatabaseService,
  CpsrRecord,
  CpstRecord,
  CpsfRecord,
  CpsRecord,
  CpsStatus,
  computeCpsStatus,
  CpsrChainRecord,
} from '../database/database.service';
import { CreateCpsrDto, UpdateCpsrDto } from './dto/cpsr.dto';
import { CreateCpstDto, UpdateCpstDto } from './dto/cpst.dto';
import { CreateCpsfDto, UpdateCpsfDto } from './dto/cpsf.dto';
import { AssignCpsDto, UpdateCpsDto } from './dto/cps.dto';

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

@Injectable()
export class SplitFormsService {
  private readonly logger = new Logger(SplitFormsService.name);

  constructor(private readonly dbService: DatabaseService) {}

  // ==================== NEXT CODE GENERATION ====================
  async getNextCpsDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPS');
    return { docNo };
  }

  async getNextCpsrDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPSR');
    return { docNo };
  }

  async getNextCpstDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPST');
    return { docNo };
  }

  async getNextCpsfDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPSF');
    return { docNo };
  }

  // ==================== CPSR (Yêu cầu kỹ thuật) ====================
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
        (r.machineName && r.machineName.toLowerCase().includes(q)) ||
        (r.reqBy && r.reqBy.toLowerCase().includes(q)) ||
        (r.problem && r.problem.toLowerCase().includes(q)) ||
        (r.printTech && r.printTech.toLowerCase().includes(q))
      );
    }

    if (query?.printTech && query.printTech !== 'ALL') {
      list = list.filter(r => r.printTech === query.printTech);
    }

    if (query?.priority && query.priority !== 'ALL') {
      list = list.filter(r => r.priority === query.priority);
    }

    if (query?.machineStatus && query.machineStatus !== 'ALL') {
      list = list.filter(r => r.machineStatus === query.machineStatus);
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
    const data = list.slice(offset, offset + limit).map(cpsr => {
      const cpst = this.dbService.getCpstList().find(t => t.cpsrDocNo === cpsr.docNo) || null;
      const cpsf = cpst ? (this.dbService.getCpsfList().find(f => f.cpstDocNo === cpst.docNo) || null) : null;
      return {
        ...cpsr,
        cpst,
        cpsf,
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

  // ==================== CPST (Phản hồi kỹ thuật) ====================
  async createCpst(dto: CreateCpstDto, creator?: any): Promise<CpstRecord> {
    const cpsrDocNo = dto.cpsrDocNo.trim();
    const cpsr = this.dbService.getCpsrByIdOrDocNo(cpsrDocNo);
    if (!cpsr) {
      throw new BadRequestException(`Phiếu CPSR với mã "${cpsrDocNo}" không tồn tại trong hệ thống.`);
    }

    const existingLinkedCpst = this.dbService.getCpstList().find(t => t.cpsrDocNo === cpsr.docNo);
    if (existingLinkedCpst) {
      throw new BadRequestException(`Phiếu CPSR "${cpsr.docNo}" đã có phản hồi kỹ thuật CPST "${existingLinkedCpst.docNo}" rồi (Quan hệ 1-1).`);
    }

    let docNo = dto.docNo?.trim();
    if (!docNo) {
      docNo = await this.dbService.getNextDocNo('CPST');
    } else {
      const existing = this.dbService.getCpstByIdOrDocNo(docNo);
      if (existing) {
        throw new BadRequestException(`Mã phiếu CPST ${docNo} đã tồn tại trong hệ thống.`);
      }
    }

    const now = new Date().toISOString();
    const record: CpstRecord = {
      id: uuidv4(),
      docNo,
      cpsrId: cpsr.id,
      cpsrDocNo: cpsr.docNo,
      recvBy: dto.recvBy,
      recvDate: dto.recvDate || undefined,
      recvTime: dto.recvTime || undefined,
      finishDate: dto.finishDate || undefined,
      finishTime: dto.finishTime || undefined,
      downtime: dto.downtime !== undefined ? Number(dto.downtime) : 0,
      rootCause: dto.rootCause || undefined,
      actionTaken: dto.actionTaken || undefined,
      errCat: dto.errCat || undefined,
      errType: dto.errType || undefined,
      photosBefore: Array.isArray(dto.photosBefore) ? dto.photosBefore : [],
      photosAfter: Array.isArray(dto.photosAfter) ? dto.photosAfter : [],
      chkStatus: dto.chkStatus || undefined,
      submittedAt: now,
      createdBy: creator?.username || creator?.fullName || 'public',
      createdAt: now,
      updatedAt: now,
    };

    await this.dbService.addCpst(record);
    this.logger.log(`🔧 CPST created: ${record.docNo} linked to ${record.cpsrDocNo}`);

    // Tự động liên kết CPST -> cập nhật cpst_doc_no, downtime, trạng thái trong CPS
    try {
      const existingCps = this.dbService.getCpsByCpsrDocNo(cpsr.docNo);
      if (existingCps) {
        let downtime = record.downtime || 0;
        if ((!downtime || downtime === 0) && record.finishDate && record.finishTime && record.recvDate && record.recvTime) {
          try {
            const start = new Date(`${record.recvDate}T${record.recvTime}`);
            const end = new Date(`${record.finishDate}T${record.finishTime}`);
            const diffMin = Math.round((end.getTime() - start.getTime()) / 60000);
            if (diffMin > 0) downtime = diffMin;
          } catch (_) {}
        }
        const assignedTo = existingCps.assignedTo || record.recvBy;
        await this.dbService.updateCps(existingCps.id, {
          cpstId: record.id,
          cpstDocNo: record.docNo,
          downtime,
          chkStatus: record.chkStatus,
          assignedTo,
          status: existingCps.status === 'CLOSED' ? 'CLOSED' : 'IN_PROGRESS',
        });
        this.logger.log(`🔗 CPS ${existingCps.docNo} updated with CPST ${record.docNo} (downtime: ${downtime}m)`);
      }
    } catch (cpsErr: any) {
      this.logger.error(`Error updating CPS for CPST ${record.docNo}: ${cpsErr.message}`);
    }

    return record;
  }

  findAllCpst(query?: FormFilterQuery) {
    let list = [...this.dbService.getCpstList()];

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.docNo && r.docNo.toLowerCase().includes(q)) ||
        (r.cpsrDocNo && r.cpsrDocNo.toLowerCase().includes(q)) ||
        (r.recvBy && r.recvBy.toLowerCase().includes(q)) ||
        (r.actionTaken && r.actionTaken.toLowerCase().includes(q)) ||
        (r.rootCause && r.rootCause.toLowerCase().includes(q))
      );
    }

    if (query?.chkStatus && query.chkStatus !== 'ALL') {
      list = list.filter(r => r.chkStatus === query.chkStatus);
    }

    const total = list.length;
    const offset = query?.offset ? Number(query.offset) : 0;
    const limit = query?.limit ? Number(query.limit) : 1000;
    const data = list.slice(offset, offset + limit).map(cpst => {
      const cpsr = this.dbService.getCpsrByIdOrDocNo(cpst.cpsrDocNo) || null;
      const cpsf = this.dbService.getCpsfList().find(f => f.cpstDocNo === cpst.docNo) || null;
      return {
        ...cpst,
        cpsr,
        cpsf,
        hasCpsf: !!cpsf,
      };
    });

    return { total, data };
  }

  findCpstOne(idOrDocNo: string) {
    const cpst = this.dbService.getCpstByIdOrDocNo(idOrDocNo);
    if (!cpst) {
      throw new NotFoundException(`Không tìm thấy phiếu CPST với mã hoặc ID: ${idOrDocNo}`);
    }
    const cpsr = this.dbService.getCpsrByIdOrDocNo(cpst.cpsrDocNo) || null;
    const cpsf = this.dbService.getCpsfList().find(f => f.cpstDocNo === cpst.docNo) || null;
    return {
      ...cpst,
      cpsr,
      cpsf,
    };
  }

  async updateCpst(id: string, dto: UpdateCpstDto, user?: any) {
    const existing = this.dbService.getCpstByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPST với mã hoặc ID: ${id}`);
    }
    const updated = await this.dbService.updateCpst(existing.id, dto);
    const existingCps = this.dbService.getCpsByCpsrDocNo(existing.cpsrDocNo);
    if (existingCps) {
      await this.dbService.updateCps(existingCps.id, {
        ...(dto.downtime !== undefined ? { downtime: Number(dto.downtime) } : {}),
        ...(dto.chkStatus ? { chkStatus: dto.chkStatus } : {}),
        ...(dto.recvBy && !existingCps.assignedTo ? { assignedTo: dto.recvBy } : {}),
      });
    }
    this.logger.log(`✏️ CPST updated: ${existing.docNo} by ${user?.username || 'system'}`);
    return updated;
  }

  async deleteCpst(id: string) {
    const existing = this.dbService.getCpstByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPST với mã hoặc ID: ${id}`);
    }
    await this.dbService.deleteCpst(existing.id);
    this.logger.log(`🗑️ CPST deleted: ${existing.docNo}`);
    return { success: true, message: `Đã xóa thành công phiếu CPST ${existing.docNo} cùng CPSF xác nhận nếu có.` };
  }

  getAvailableCpstForCpsf() {
    return this.dbService.getAvailableCpstForCpsf();
  }

  // ==================== CPSF (Xác nhận bàn giao) ====================
  async createCpsf(dto: CreateCpsfDto, creator?: any): Promise<CpsfRecord> {
    const cpstDocNo = dto.cpstDocNo.trim();
    const cpst = this.dbService.getCpstByIdOrDocNo(cpstDocNo);
    if (!cpst) {
      throw new BadRequestException(`Phiếu CPST với mã "${cpstDocNo}" không tồn tại trong hệ thống.`);
    }

    const existingLinkedCpsf = this.dbService.getCpsfList().find(f => f.cpstDocNo === cpst.docNo);
    if (existingLinkedCpsf) {
      throw new BadRequestException(`Phiếu CPST "${cpst.docNo}" đã có xác nhận bàn giao CPSF "${existingLinkedCpsf.docNo}" rồi (Quan hệ 1-1).`);
    }

    let docNo = dto.docNo?.trim();
    if (!docNo) {
      docNo = await this.dbService.getNextDocNo('CPSF');
    } else {
      const existing = this.dbService.getCpsfByIdOrDocNo(docNo);
      if (existing) {
        throw new BadRequestException(`Mã phiếu CPSF ${docNo} đã tồn tại trong hệ thống.`);
      }
    }

    const now = new Date().toISOString();
    const record: CpsfRecord = {
      id: uuidv4(),
      docNo,
      cpstId: cpst.id,
      cpstDocNo: cpst.docNo,
      cpsrDocNo: cpst.cpsrDocNo,
      chkQuality: dto.chkQuality || undefined,
      workOrder: dto.workOrder || undefined,
      woTotalQty: dto.woTotalQty !== undefined ? Number(dto.woTotalQty) : 0,
      wasteQty: dto.wasteQty !== undefined ? Number(dto.wasteQty) : 0,
      wasteUnit: dto.wasteUnit || undefined,
      wastePercent: dto.wastePercent || undefined,
      prodMgr: dto.prodMgr,
      submittedAt: now,
      createdBy: creator?.username || creator?.fullName || 'public',
      createdAt: now,
      updatedAt: now,
    };

    await this.dbService.addCpsf(record);
    this.logger.log(`✅ CPSF created: ${record.docNo} linked to CPST ${record.cpstDocNo} & CPSR ${record.cpsrDocNo}`);

    // Tự động liên kết CPSF -> cập nhật cpsf_doc_no, tổng SL, phế, tính % phế, tính downtime, đổi trạng thái CLOSED
    try {
      const cpsrDocNo = record.cpsrDocNo || cpst.cpsrDocNo;
      const existingCps = this.dbService.getCpsByCpsrDocNo(cpsrDocNo);
      if (existingCps) {
        const woTotalQty = record.woTotalQty || 0;
        const wasteQty = record.wasteQty || 0;
        const calcPercent = woTotalQty > 0
          ? ((wasteQty / woTotalQty) * 100).toFixed(2) + '%'
          : (record.wastePercent || '0%');
        const downtime = existingCps.downtime || cpst.downtime || 0;

        await this.dbService.updateCps(existingCps.id, {
          cpsfId: record.id,
          cpsfDocNo: record.docNo,
          chkQuality: record.chkQuality,
          workOrder: record.workOrder,
          woTotalQty,
          wasteQty,
          wastePercent: calcPercent,
          wasteUnit: record.wasteUnit,
          downtime,
          status: 'CLOSED',
          closedAt: now,
        });
        this.logger.log(`🔗 CPS ${existingCps.docNo} CLOSED with CPSF ${record.docNo} (total: ${woTotalQty}, waste: ${wasteQty}, rate: ${calcPercent}, downtime: ${downtime}m)`);
      }
    } catch (cpsErr: any) {
      this.logger.error(`Error updating CPS for CPSF ${record.docNo}: ${cpsErr.message}`);
    }

    return record;
  }

  findAllCpsf(query?: FormFilterQuery) {
    let list = [...this.dbService.getCpsfList()];

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.docNo && r.docNo.toLowerCase().includes(q)) ||
        (r.cpstDocNo && r.cpstDocNo.toLowerCase().includes(q)) ||
        (r.cpsrDocNo && r.cpsrDocNo.toLowerCase().includes(q)) ||
        (r.workOrder && r.workOrder.toLowerCase().includes(q)) ||
        (r.prodMgr && r.prodMgr.toLowerCase().includes(q))
      );
    }

    if (query?.chkQuality && query.chkQuality !== 'ALL') {
      list = list.filter(r => r.chkQuality === query.chkQuality);
    }

    const total = list.length;
    const offset = query?.offset ? Number(query.offset) : 0;
    const limit = query?.limit ? Number(query.limit) : 1000;
    const data = list.slice(offset, offset + limit).map(cpsf => {
      const cpst = this.dbService.getCpstByIdOrDocNo(cpsf.cpstDocNo) || null;
      const cpsr = cpst ? (this.dbService.getCpsrByIdOrDocNo(cpst.cpsrDocNo) || null) : null;
      return {
        ...cpsf,
        cpst,
        cpsr,
      };
    });

    return { total, data };
  }

  findCpsfOne(idOrDocNo: string) {
    const cpsf = this.dbService.getCpsfByIdOrDocNo(idOrDocNo);
    if (!cpsf) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSF với mã hoặc ID: ${idOrDocNo}`);
    }
    const cpst = this.dbService.getCpstByIdOrDocNo(cpsf.cpstDocNo) || null;
    const cpsr = cpst ? (this.dbService.getCpsrByIdOrDocNo(cpst.cpsrDocNo) || null) : null;
    return {
      ...cpsf,
      cpst,
      cpsr,
    };
  }

  async updateCpsf(id: string, dto: UpdateCpsfDto, user?: any) {
    const existing = this.dbService.getCpsfByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSF với mã hoặc ID: ${id}`);
    }
    const updated = await this.dbService.updateCpsf(existing.id, dto);
    const existingCps = this.dbService.getCpsByCpsrDocNo(existing.cpsrDocNo || '');
    if (existingCps) {
      const woTotalQty = dto.woTotalQty !== undefined ? Number(dto.woTotalQty) : (existingCps.woTotalQty || 0);
      const wasteQty = dto.wasteQty !== undefined ? Number(dto.wasteQty) : (existingCps.wasteQty || 0);
      const calcPercent = woTotalQty > 0
        ? ((wasteQty / woTotalQty) * 100).toFixed(2) + '%'
        : (dto.wastePercent || existingCps.wastePercent || '0%');

      await this.dbService.updateCps(existingCps.id, {
        ...(dto.chkQuality ? { chkQuality: dto.chkQuality } : {}),
        ...(dto.workOrder ? { workOrder: dto.workOrder } : {}),
        woTotalQty,
        wasteQty,
        wastePercent: calcPercent,
        ...(dto.wasteUnit ? { wasteUnit: dto.wasteUnit } : {}),
      });
    }
    this.logger.log(`✏️ CPSF updated: ${existing.docNo} by ${user?.username || 'system'}`);
    return updated;
  }

  async deleteCpsf(id: string) {
    const existing = this.dbService.getCpsfByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSF với mã hoặc ID: ${id}`);
    }
    await this.dbService.deleteCpsf(existing.id);
    this.logger.log(`🗑️ CPSF deleted: ${existing.docNo}`);
    return { success: true, message: `Đã xóa thành công phiếu CPSF ${existing.docNo}.` };
  }

  // ==================== CPS (CHAIN & ASSIGN TASK) ====================
  findAllCps(query?: FormFilterQuery) {
    let list = [...this.dbService.getCpsList()];

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.docNo && r.docNo.toLowerCase().includes(q)) ||
        (r.cpsrDocNo && r.cpsrDocNo.toLowerCase().includes(q)) ||
        (r.cpstDocNo && r.cpstDocNo.toLowerCase().includes(q)) ||
        (r.cpsfDocNo && r.cpsfDocNo.toLowerCase().includes(q)) ||
        (r.machineName && r.machineName.toLowerCase().includes(q)) ||
        (r.reqBy && r.reqBy.toLowerCase().includes(q)) ||
        (r.assignedTo && r.assignedTo.toLowerCase().includes(q)) ||
        (r.problem && r.problem.toLowerCase().includes(q)) ||
        (r.printTech && r.printTech.toLowerCase().includes(q)) ||
        (r.workOrder && r.workOrder.toLowerCase().includes(q))
      );
    }

    if (query?.status && query.status !== 'ALL') {
      const targetStatus = query.status.trim().toUpperCase();
      list = list.filter(r => r.status === targetStatus);
    }

    if (query?.printTech && query.printTech !== 'ALL') {
      list = list.filter(r => r.printTech === query.printTech);
    }

    if (query?.assignedTo && query.assignedTo !== 'ALL') {
      const a = query.assignedTo.toLowerCase().trim();
      list = list.filter(r => r.assignedTo && r.assignedTo.toLowerCase().includes(a));
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
    const data = list.slice(offset, offset + limit);

    if (query?.paginate === true || query?.paginate === 'true') {
      return { total, data };
    }
    return data;
  }

  findCpsOne(idOrDocNo: string): CpsRecord {
    const cps = this.dbService.getCpsByIdOrDocNo(idOrDocNo);
    if (!cps) {
      throw new NotFoundException(`Không tìm thấy phiếu CPS với mã hoặc ID: ${idOrDocNo}`);
    }
    return cps;
  }

  async assignTask(idOrDocNo: string, dto: AssignCpsDto, user?: any): Promise<CpsRecord> {
    const existing = this.dbService.getCpsByIdOrDocNo(idOrDocNo);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPS với mã hoặc ID: ${idOrDocNo}`);
    }

    const assignedTo = (dto.assignedTo || dto.assignee || '').trim();
    const assignedToId = (dto.assignedToId || dto.employeeId || '').trim() || null;
    const assignedToName = (dto.assignedToName || assignedTo).trim() || null;
    const now = new Date().toISOString();

    let deadlineIso: string | null = null;
    if (dto.deadline && dto.deadline.trim() !== '') {
      const d = new Date(dto.deadline);
      if (!isNaN(d.getTime())) {
        deadlineIso = d.toISOString();
      } else {
        deadlineIso = dto.deadline.trim();
      }
    }

    const updates: Partial<CpsRecord> = {
      assignedTo: assignedTo || existing.assignedTo || null,
      assignedToId: assignedToId || existing.assignedToId || null,
      assignedToName: assignedToName || existing.assignedToName || null,
      assignedBy: user?.username || user?.fullName || 'admin',
      assignedAt: now,
      deadline: deadlineIso !== null ? deadlineIso : existing.deadline,
      ...(dto.priority ? { priority: dto.priority } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    };

    if (existing.status !== 'CLOSED' && !existing.cpsfDocNo) {
      if (updates.deadline) {
        const d = new Date(updates.deadline);
        if (!isNaN(d.getTime()) && d.getTime() < Date.now()) {
          updates.status = 'OVER_DUE';
        } else {
          updates.status = updates.assignedTo ? 'IN_PROGRESS' : existing.status;
        }
      } else if (updates.assignedTo) {
        updates.status = 'IN_PROGRESS';
      }
    }

    const updated = await this.dbService.updateCps(existing.id, updates);
    this.logger.log(`📌 CPS task assigned: ${existing.docNo} -> ${updates.assignedTo} (deadline: ${updates.deadline || 'none'}, status: ${updated?.status})`);
    return updated!;
  }

  async updateCps(idOrDocNo: string, dto: UpdateCpsDto, user?: any): Promise<CpsRecord> {
    const existing = this.dbService.getCpsByIdOrDocNo(idOrDocNo);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPS với mã hoặc ID: ${idOrDocNo}`);
    }
    const updates: Partial<CpsRecord> = { ...dto } as any;
    if (dto.deadline && dto.deadline.trim() !== '') {
      const d = new Date(dto.deadline);
      if (!isNaN(d.getTime())) updates.deadline = d.toISOString();
    }
    const updated = await this.dbService.updateCps(existing.id, updates);
    this.logger.log(`✏️ CPS updated: ${existing.docNo} by ${user?.username || 'system'}`);
    return updated!;
  }

  getCpsStats() {
    const list = this.dbService.getCpsList();
    const total = list.length;
    let openTask = 0;
    let toAssign = 0;
    let inProgress = 0;
    let overdue = 0;
    let closed = 0;
    let totalDowntime = 0;
    let totalWasteQty = 0;
    let totalWoQty = 0;

    for (const item of list) {
      if (item.status === 'CLOSED') closed++;
      else if (item.status === 'OVER_DUE') overdue++;
      else if (item.status === 'IN_PROGRESS') inProgress++;
      else if (item.status === 'OPEN_TASK') openTask++;
      else toAssign++;

      if (item.downtime) totalDowntime += Number(item.downtime);
      if (item.wasteQty) totalWasteQty += Number(item.wasteQty);
      if (item.woTotalQty) totalWoQty += Number(item.woTotalQty);
    }

    const avgWastePercent = totalWoQty > 0 ? ((totalWasteQty / totalWoQty) * 100).toFixed(2) + '%' : '0%';

    return {
      total,
      openTask,
      toAssign,
      inProgress,
      overdue,
      closed,
      totalDowntime,
      totalWasteQty,
      avgWastePercent,
    };
  }

  // ==================== 1-1-1 CHAIN & SUMMARY ====================
  getCpsrChainList(): CpsrChainRecord[] {
    return this.dbService.getCpsrChainList();
  }

  getStats() {
    const cpsrList = this.dbService.getCpsrList();
    const cpstList = this.dbService.getCpstList();
    const cpsfList = this.dbService.getCpsfList();

    const totalCpsr = cpsrList.length;
    const totalCpst = cpstList.length;
    const totalCpsf = cpsfList.length;

    const pendingCpst = cpsrList.filter(r => !cpstList.some(t => t.cpsrDocNo === r.docNo)).length;
    const pendingCpsf = cpstList.filter(t => !cpsfList.some(f => f.cpstDocNo === t.docNo)).length;
    const fullyCompleted = cpsfList.length;

    return {
      totalCpsr,
      totalCpst,
      totalCpsf,
      pendingCpst,
      pendingCpsf,
      fullyCompleted,
    };
  }
}
