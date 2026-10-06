import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, CpstRecord } from '../../database/database.service';
import { CreateCpstDto, UpdateCpstDto, FormFilterQuery } from '../dto';

@Injectable()
export class CpstService {
  private readonly logger = new Logger(CpstService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getNextCpstDocNo(): Promise<{ docNo: string }> {
    const docNo = await this.dbService.getNextDocNo('CPST');
    return { docNo };
  }

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
    const paged = list.slice(offset, offset + limit);

    const cpsrMap = new Map<string, any>();
    for (const r of this.dbService.getCpsrList()) {
      cpsrMap.set(r.docNo, r);
    }
    const cpsfByCpst = new Map<string, any>();
    for (const f of this.dbService.getCpsfList()) {
      if (f.cpstDocNo) cpsfByCpst.set(f.cpstDocNo, f);
    }

    const data = paged.map(cpst => {
      const cpsr = cpsrMap.get(cpst.cpsrDocNo) || null;
      const cpsf = cpsfByCpst.get(cpst.docNo) || null;
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
      let downtime = dto.downtime !== undefined ? Number(dto.downtime) : undefined;
      if ((downtime === undefined || downtime === 0) && (dto.finishDate || dto.finishTime || dto.recvDate || dto.recvTime)) {
        const fDate = dto.finishDate || existing.finishDate;
        const fTime = dto.finishTime || existing.finishTime;
        const rDate = dto.recvDate || existing.recvDate;
        const rTime = dto.recvTime || existing.recvTime;
        if (fDate && fTime && rDate && rTime) {
          try {
            const start = new Date(`${rDate}T${rTime}`);
            const end = new Date(`${fDate}T${fTime}`);
            const diffMin = Math.round((end.getTime() - start.getTime()) / 60000);
            if (diffMin > 0) downtime = diffMin;
          } catch (_) {}
        }
      }
      await this.dbService.updateCps(existingCps.id, {
        ...(downtime !== undefined ? { downtime } : {}),
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
}
