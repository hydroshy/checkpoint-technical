import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DatabaseService,
  CpsrRecord,
  CpstRecord,
  CpsfRecord,
  CpsrChainRecord,
} from '../database/database.service';
import { CreateCpsrDto, UpdateCpsrDto } from './dto/cpsr.dto';
import { CreateCpstDto, UpdateCpstDto } from './dto/cpst.dto';
import { CreateCpsfDto, UpdateCpsfDto } from './dto/cpsf.dto';

export interface FormFilterQuery {
  search?: string;
  printTech?: string;
  machineStatus?: string;
  priority?: string;
  chkStatus?: string;
  chkQuality?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class SplitFormsService {
  private readonly logger = new Logger(SplitFormsService.name);

  constructor(private readonly dbService: DatabaseService) {}

  // ==================== NEXT CODE GENERATION ====================
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
    this.logger.log(`✏️ CPSR updated: ${existing.docNo} by ${user?.username || 'system'}`);
    return updated;
  }

  async deleteCpsr(id: string) {
    const existing = this.dbService.getCpsrByIdOrDocNo(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy phiếu CPSR với mã hoặc ID: ${id}`);
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
