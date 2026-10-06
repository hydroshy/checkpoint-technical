import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from '../database/database.service';
import { SplitFormsService, FormFilterQuery } from './split-forms.service';
import { CreateCpsrDto, UpdateCpsrDto } from './dto/cpsr.dto';
import { CreateCpstDto, UpdateCpstDto } from './dto/cpst.dto';
import { CreateCpsfDto, UpdateCpsfDto } from './dto/cpsf.dto';
import { CreateCpsDto, AssignCpsDto, UpdateCpsDto, LinkCpsDto, UnlinkCpsDto } from './dto/cps.dto';

function extractUser(req?: any): any {
  if (!req) return null;
  if (req.user) return req.user;
  let token: string | null = null;
  if (req.cookies) {
    token = req.cookies['access_token'] || req.cookies['checkpoint_token'];
  }
  if (!token && req.headers) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') token = parts[1];
      else if (parts.length === 1 && !parts[0].includes(' ')) token = parts[0];
    }
    if (!token) token = req.headers['x-access-token'] as string;
  }
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!';
      return jwt.verify(token, secret);
    } catch (_) {}
  }
  return null;
}

// ==================== CPSR CONTROLLER ====================
@ApiTags('CPSR - Yêu cầu kỹ thuật (/form-request)')
@Controller('api/cpsr')
export class CpsrController {
  constructor(private readonly service: SplitFormsService) {}

  @Get('next-code')
  @ApiOperation({ summary: 'Lấy mã phiếu CPSR tự tăng tiếp theo (CPSR-YYYYMMDD-XXX)' })
  getNextCode() {
    return this.service.getNextCpsrDocNo();
  }

  @Get('available-for-cpst')
  @ApiOperation({ summary: 'Lấy danh sách phiếu CPSR chưa có phản hồi CPST để chọn liên kết' })
  getAvailableForCpst() {
    return this.service.getAvailableCpsrForCpst();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách phiếu CPSR với bộ lọc & tìm kiếm' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'printTech', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, type: String })
  @ApiQuery({ name: 'machineStatus', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query: FormFilterQuery) {
    return this.service.findAllCpsr(query);
  }

  @Get(':idOrCode')
  @ApiOperation({ summary: 'Chi tiết phiếu CPSR kèm chuỗi phản hồi liên quan' })
  findOne(@Param('idOrCode') idOrCode: string) {
    return this.service.findCpsrOne(idOrDocNoClean(idOrCode));
  }

  @Post()
  @ApiOperation({ summary: 'Gửi lưu phiếu yêu cầu kỹ thuật CPSR mới (Public)' })
  create(@Body() dto: CreateCpsrDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.createCpsr(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật phiếu CPSR (Control Panel - PUT)' })
  update(@Param('id') id: string, @Body() dto: UpdateCpsrDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpsr(idOrDocNoClean(id), dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một phần phiếu CPSR (Control Panel - PATCH)' })
  patch(@Param('id') id: string, @Body() dto: UpdateCpsrDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpsr(idOrDocNoClean(id), dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phiếu CPSR (Control Panel)' })
  remove(@Param('id') id: string) {
    return this.service.deleteCpsr(idOrDocNoClean(id));
  }
}

// ==================== CPST CONTROLLER ====================
@ApiTags('CPST - Phản hồi kỹ thuật (/technical-feedback)')
@Controller('api/cpst')
export class CpstController {
  constructor(private readonly service: SplitFormsService) {}

  @Get('next-code')
  @ApiOperation({ summary: 'Lấy mã phiếu CPST tự tăng tiếp theo (CPST-YYYYMMDD-XXX)' })
  getNextCode() {
    return this.service.getNextCpstDocNo();
  }

  @Get('available-for-cpsf')
  @ApiOperation({ summary: 'Lấy danh sách phiếu CPST chưa có xác nhận bàn giao CPSF để chọn liên kết' })
  getAvailableForCpsf() {
    return this.service.getAvailableCpstForCpsf();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách phiếu CPST với bộ lọc & tìm kiếm' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'chkStatus', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query: FormFilterQuery) {
    return this.service.findAllCpst(query);
  }

  @Get(':idOrCode')
  @ApiOperation({ summary: 'Chi tiết phiếu CPST kèm thông tin CPSR và CPSF liên quan' })
  findOne(@Param('idOrCode') idOrCode: string) {
    return this.service.findCpstOne(idOrDocNoClean(idOrCode));
  }

  @Post()
  @ApiOperation({ summary: 'Gửi lưu phản hồi kỹ thuật CPST mới (Public)' })
  create(@Body() dto: CreateCpstDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.createCpst(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật phiếu CPST (Control Panel - PUT)' })
  update(@Param('id') id: string, @Body() dto: UpdateCpstDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpst(idOrDocNoClean(id), dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một phần phiếu CPST (Control Panel - PATCH)' })
  patch(@Param('id') id: string, @Body() dto: UpdateCpstDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpst(idOrDocNoClean(id), dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phiếu CPST (Control Panel)' })
  remove(@Param('id') id: string) {
    return this.service.deleteCpst(idOrDocNoClean(id));
  }
}

// ==================== CPSF CONTROLLER ====================
@ApiTags('CPSF - Xác nhận bàn giao (/confirm-request)')
@Controller('api/cpsf')
export class CpsfController {
  constructor(private readonly service: SplitFormsService) {}

  @Get('next-code')
  @ApiOperation({ summary: 'Lấy mã phiếu CPSF tự tăng tiếp theo (CPSF-YYYYMMDD-XXX)' })
  getNextCode() {
    return this.service.getNextCpsfDocNo();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách phiếu CPSF với bộ lọc & tìm kiếm' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'chkQuality', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query: FormFilterQuery) {
    return this.service.findAllCpsf(query);
  }

  @Get(':idOrCode')
  @ApiOperation({ summary: 'Chi tiết phiếu CPSF kèm thông tin CPST và CPSR' })
  findOne(@Param('idOrCode') idOrCode: string) {
    return this.service.findCpsfOne(idOrDocNoClean(idOrCode));
  }

  @Post()
  @ApiOperation({ summary: 'Gửi lưu xác nhận bàn giao CPSF mới (Public)' })
  create(@Body() dto: CreateCpsfDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.createCpsf(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật phiếu CPSF (Control Panel - PUT)' })
  update(@Param('id') id: string, @Body() dto: UpdateCpsfDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpsf(idOrDocNoClean(id), dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một phần phiếu CPSF (Control Panel - PATCH)' })
  patch(@Param('id') id: string, @Body() dto: UpdateCpsfDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpsf(idOrDocNoClean(id), dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phiếu CPSF (Control Panel)' })
  remove(@Param('id') id: string) {
    return this.service.deleteCpsf(idOrDocNoClean(id));
  }
}

// ==================== CPS CHAIN CONTROLLER ====================
@ApiTags('CPS - Xâu chuỗi 1-1-1 & Quản lý Phân công nhiệm vụ (/api/cps)')
@Controller('api/cps')
export class CpsController {
  constructor(private readonly service: SplitFormsService) {}

  @Get('next-code')
  @ApiOperation({ summary: 'Lấy mã phiếu CPS tự tăng tiếp theo (CPS-YYYYMMDD-XXX)' })
  getNextCode() {
    return this.service.getNextCpsDocNo();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Thống kê tổng quan trạng thái các thẻ CPS (OPEN_TASK, TO_ASSIGN, IN_PROGRESS, OVER_DUE, CLOSED)' })
  getStats() {
    return this.service.getCpsStats();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách phiếu CPS xâu chuỗi kèm trạng thái, tính OVER_DUE, downtime & % phế' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'printTech', required: false, type: String })
  @ApiQuery({ name: 'assignedTo', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'paginate', required: false, type: Boolean })
  findAll(@Query() query: FormFilterQuery) {
    return this.service.findAllCps(query);
  }

  @Get(':idOrDocNo')
  @ApiOperation({ summary: 'Chi tiết phiếu CPS xâu chuỗi kèm CPSR, CPST, CPSF' })
  findOne(@Param('idOrDocNo') idOrDocNo: string) {
    return this.service.findCpsOne(idOrDocNoClean(idOrDocNo));
  }

  @Post()
  @ApiOperation({ summary: 'Tạo phiếu CPS mới (Ràng buộc nghiệp vụ: Bắt buộc phải có phiếu CPSR)' })
  create(@Body() dto: CreateCpsDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.createCps(dto, user);
  }

  @Post(':docNo/assign')
  @ApiOperation({ summary: 'Phân công nhân viên và hạn chót cho phiếu CPS (POST)' })
  assignPost(
    @Param('docNo') docNo: string,
    @Body() dto: AssignCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.assignTask(idOrDocNoClean(docNo), dto, user);
  }

  @Put(':docNo/assign')
  @ApiOperation({ summary: 'Phân công nhân viên và hạn chót cho phiếu CPS (PUT)' })
  assignPut(
    @Param('docNo') docNo: string,
    @Body() dto: AssignCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.assignTask(idOrDocNoClean(docNo), dto, user);
  }

  @Patch(':docNo/assign')
  @ApiOperation({ summary: 'Phân công nhân viên và hạn chót cho phiếu CPS (PATCH)' })
  assignPatch(
    @Param('docNo') docNo: string,
    @Body() dto: AssignCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.assignTask(idOrDocNoClean(docNo), dto, user);
  }

  @Post('link')
  @ApiOperation({ summary: 'Ghép nối phiếu CPS với CPST và CPSF (Endpoint chung POST)' })
  linkGeneral(@Body() dto: LinkCpsDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.linkCps(dto.cpsDocNo || dto.cpsId || '', dto, user);
  }

  @Post(':idOrDocNo/link')
  @ApiOperation({ summary: 'Ghép nối phiếu CPS với CPST và CPSF (POST)' })
  linkPost(
    @Param('idOrDocNo') idOrDocNo: string,
    @Body() dto: LinkCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.linkCps(idOrDocNoClean(idOrDocNo), dto, user);
  }

  @Put(':idOrDocNo/link')
  @ApiOperation({ summary: 'Ghép nối phiếu CPS với CPST và CPSF (PUT)' })
  linkPut(
    @Param('idOrDocNo') idOrDocNo: string,
    @Body() dto: LinkCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.linkCps(idOrDocNoClean(idOrDocNo), dto, user);
  }

  @Patch(':idOrDocNo/link')
  @ApiOperation({ summary: 'Ghép nối phiếu CPS với CPST và CPSF (PATCH)' })
  linkPatch(
    @Param('idOrDocNo') idOrDocNo: string,
    @Body() dto: LinkCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.linkCps(idOrDocNoClean(idOrDocNo), dto, user);
  }

  @Post(':idOrDocNo/unlink')
  @ApiOperation({ summary: 'Hủy ghép nối phiếu CPST / CPSF khỏi phiếu CPS (POST)' })
  unlinkPost(
    @Param('idOrDocNo') idOrDocNo: string,
    @Body() dto: UnlinkCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.unlinkCps(idOrDocNoClean(idOrDocNo), dto, user);
  }

  @Put(':idOrDocNo/unlink')
  @ApiOperation({ summary: 'Hủy ghép nối phiếu CPST / CPSF khỏi phiếu CPS (PUT)' })
  unlinkPut(
    @Param('idOrDocNo') idOrDocNo: string,
    @Body() dto: UnlinkCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.unlinkCps(idOrDocNoClean(idOrDocNo), dto, user);
  }

  @Patch(':idOrDocNo/unlink')
  @ApiOperation({ summary: 'Hủy ghép nối phiếu CPST / CPSF khỏi phiếu CPS (PATCH)' })
  unlinkPatch(
    @Param('idOrDocNo') idOrDocNo: string,
    @Body() dto: UnlinkCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.unlinkCps(idOrDocNoClean(idOrDocNo), dto, user);
  }

  @Put(':docNo')
  @ApiOperation({ summary: 'Cập nhật thông tin phiếu CPS (PUT)' })
  updatePut(
    @Param('docNo') docNo: string,
    @Body() dto: UpdateCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.updateCps(idOrDocNoClean(docNo), dto, user);
  }

  @Patch(':docNo')
  @ApiOperation({ summary: 'Cập nhật thông tin phiếu CPS (PATCH)' })
  updatePatch(
    @Param('docNo') docNo: string,
    @Body() dto: UpdateCpsDto,
    @Req() req: any,
  ) {
    const user = extractUser(req);
    return this.service.updateCps(idOrDocNoClean(docNo), dto, user);
  }

  @Delete(':idOrDocNo')
  @ApiOperation({ summary: 'Xóa phiếu CPS (Control Panel)' })
  remove(@Param('idOrDocNo') idOrDocNo: string) {
    return this.service.deleteCps(idOrDocNoClean(idOrDocNo));
  }
}

// ==================== CPSR CHAIN & OVERVIEW CONTROLLER ====================
@ApiTags('CPSR Chain Overview (1-1-1 Linkage & Control Panel)')
@Controller('api/cpsr-chain')
export class CpsrChainController {
  constructor(private readonly service: SplitFormsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ chuỗi 1-1-1 (CPSR + CPST + CPSF) cho Control Panel' })
  getChain() {
    return this.service.getCpsrChainList();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Thống kê tổng quan trạng thái chuỗi phiếu CPSR / CPST / CPSF' })
  getStats() {
    return this.service.getStats();
  }
}

// ==================== CONTROL PANEL BOOTSTRAP CONTROLLER ====================
@ApiTags('Control Panel Bootstrap & Data Optimization')
@Controller('api/control-panel')
export class ControlPanelApiController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get('init-data')
  @ApiOperation({ summary: 'Nạp nhanh dữ liệu tổng hợp cho Control Panel' })
  getInitData(@Req() req: any) {
    const user = extractUser(req);
    const isAdmin = user && (user.role === 'ADMIN' || user.userType === 'ADMIN' || user.permissions?.canAccessControlPanel);

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
      users: isAdmin ? this.dbService.getUsers().map(({ passwordHash, ...u }) => u) : undefined,
    };
  }
}

function idOrDocNoClean(val: string): string {
  return decodeURIComponent(val || '').trim();
}
