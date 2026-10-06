import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, CpsfRecord } from '../../database/database.service';
import { CreateCpsfDto, UpdateCpsfDto, FormFilterQuery } from '../dto';

@Injectable()
export class CpsfService {
  private readonly logger = new Logger(CpsfService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getNextCpsfDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPSF');
    return { docNo };
  }

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
    const paged = list.slice(offset, offset + limit);

    const cpstMap = new Map<string, any>();
    for (const t of this.dbService.getCpstList()) {
      cpstMap.set(t.docNo, t);
    }
    const cpsrMap = new Map<string, any>();
    for (const r of this.dbService.getCpsrList()) {
      cpsrMap.set(r.docNo, r);
    }

    const data = paged.map(cpsf => {
      const cpst = cpstMap.get(cpsf.cpstDocNo) || null;
      const cpsr = cpst ? (cpsrMap.get(cpst.cpsrDocNo) || null) : (cpsf.cpsrDocNo ? cpsrMap.get(cpsf.cpsrDocNo) : null);
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
}
