import { Injectable, Logger } from '@nestjs/common';
import {
  CpsrRecord,
  CpstRecord,
  CpsfRecord,
  CpsRecord,
  CpsrChainRecord,
} from '../database/database.service';
import {
  CpsrService,
  CpstService,
  CpsfService,
  CpsService,
} from '../cps/services';
import {
  CreateCpsrDto,
  UpdateCpsrDto,
  CreateCpstDto,
  UpdateCpstDto,
  CreateCpsfDto,
  UpdateCpsfDto,
  CreateCpsDto,
  AssignCpsDto,
  UpdateCpsDto,
  LinkCpsDto,
  UnlinkCpsDto,
  FormFilterQuery,
} from '../cps/dto';

export { FormFilterQuery };

/**
 * SplitFormsService (Facade pattern)
 * Cung cấp giao diện tương thích 100% với phiên bản cũ,
 * đồng thời phân luồng ủy quyền trực tiếp tới các Domain Services chuyên biệt:
 * CpsrService, CpstService, CpsfService, CpsService.
 */
@Injectable()
export class SplitFormsService {
  private readonly logger = new Logger(SplitFormsService.name);

  constructor(
    private readonly cpsrService: CpsrService,
    private readonly cpstService: CpstService,
    private readonly cpsfService: CpsfService,
    private readonly cpsService: CpsService,
  ) {}

  // ==================== NEXT CODE GENERATION ====================
  getNextCpsDocNo(): Promise<{ docNo: string }> {
    return this.cpsService.getNextCpsDocNo();
  }

  getNextCpsrDocNo(): Promise<{ docNo: string }> {
    return this.cpsrService.getNextCpsrDocNo();
  }

  getNextCpstDocNo(): Promise<{ docNo: string }> {
    return this.cpstService.getNextCpstDocNo();
  }

  getNextCpsfDocNo(): Promise<{ docNo: string }> {
    return this.cpsfService.getNextCpsfDocNo();
  }

  // ==================== CPSR DOMAIN ====================
  createCpsr(dto: CreateCpsrDto, creator?: any): Promise<CpsrRecord> {
    return this.cpsrService.createCpsr(dto, creator);
  }

  findAllCpsr(query?: FormFilterQuery) {
    return this.cpsrService.findAllCpsr(query);
  }

  findCpsrOne(idOrDocNo: string) {
    return this.cpsrService.findCpsrOne(idOrDocNo);
  }

  updateCpsr(id: string, dto: UpdateCpsrDto, user?: any) {
    return this.cpsrService.updateCpsr(id, dto, user);
  }

  deleteCpsr(id: string) {
    return this.cpsrService.deleteCpsr(id);
  }

  getAvailableCpsrForCpst() {
    return this.cpsrService.getAvailableCpsrForCpst();
  }

  // ==================== CPST DOMAIN ====================
  createCpst(dto: CreateCpstDto, creator?: any): Promise<CpstRecord> {
    return this.cpstService.createCpst(dto, creator);
  }

  findAllCpst(query?: FormFilterQuery) {
    return this.cpstService.findAllCpst(query);
  }

  findCpstOne(idOrDocNo: string) {
    return this.cpstService.findCpstOne(idOrDocNo);
  }

  updateCpst(id: string, dto: UpdateCpstDto, user?: any) {
    return this.cpstService.updateCpst(id, dto, user);
  }

  deleteCpst(id: string) {
    return this.cpstService.deleteCpst(id);
  }

  getAvailableCpstForCpsf() {
    return this.cpstService.getAvailableCpstForCpsf();
  }

  // ==================== CPSF DOMAIN ====================
  createCpsf(dto: CreateCpsfDto, creator?: any): Promise<CpsfRecord> {
    return this.cpsfService.createCpsf(dto, creator);
  }

  findAllCpsf(query?: FormFilterQuery) {
    return this.cpsfService.findAllCpsf(query);
  }

  findCpsfOne(idOrDocNo: string) {
    return this.cpsfService.findCpsfOne(idOrDocNo);
  }

  updateCpsf(id: string, dto: UpdateCpsfDto, user?: any) {
    return this.cpsfService.updateCpsf(id, dto, user);
  }

  deleteCpsf(id: string) {
    return this.cpsfService.deleteCpsf(id);
  }

  // ==================== CPS TICKETS & LINKING DOMAIN ====================
  findAllCps(query?: FormFilterQuery) {
    return this.cpsService.findAllCps(query);
  }

  findCpsOne(idOrDocNo: string): CpsRecord {
    return this.cpsService.findCpsOne(idOrDocNo);
  }

  createCps(dto: CreateCpsDto, creator?: any): Promise<CpsRecord> {
    return this.cpsService.createCps(dto, creator);
  }

  assignTask(idOrDocNo: string, dto: AssignCpsDto, user?: any): Promise<CpsRecord> {
    return this.cpsService.assignTask(idOrDocNo, dto, user);
  }

  updateCps(idOrDocNo: string, dto: UpdateCpsDto, user?: any): Promise<CpsRecord> {
    return this.cpsService.updateCps(idOrDocNo, dto, user);
  }

  deleteCps(idOrDocNo: string) {
    return this.cpsService.deleteCps(idOrDocNo);
  }

  linkCps(idOrDocNo: string, dto: LinkCpsDto, user?: any): Promise<CpsRecord> {
    return this.cpsService.linkCps(idOrDocNo, dto, user);
  }

  unlinkCps(idOrDocNo: string, dto: UnlinkCpsDto, user?: any): Promise<CpsRecord> {
    return this.cpsService.unlinkCps(idOrDocNo, dto, user);
  }

  getCpsStats() {
    return this.cpsService.getCpsStats();
  }

  // ==================== CPSR CHAIN & STATS ====================
  getCpsrChainList(): CpsrChainRecord[] {
    return this.cpsService.getCpsrChainList();
  }

  getStats() {
    return this.cpsService.getStats();
  }
}
