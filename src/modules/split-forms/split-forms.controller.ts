import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { SplitFormsService, FormFilterQuery } from './split-forms.service';
import { CreateCpsrDto, UpdateCpsrDto } from './dto/cpsr.dto';
import { CreateCpstDto, UpdateCpstDto } from './dto/cpst.dto';
import { CreateCpsfDto, UpdateCpsfDto } from './dto/cpsf.dto';

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
  @ApiOperation({ summary: 'Cập nhật phiếu CPSR (Control Panel)' })
  update(@Param('id') id: string, @Body() dto: UpdateCpsrDto, @Req() req: any) {
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
  @ApiOperation({ summary: 'Cập nhật phiếu CPST (Control Panel)' })
  update(@Param('id') id: string, @Body() dto: UpdateCpstDto, @Req() req: any) {
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
  @ApiOperation({ summary: 'Cập nhật phiếu CPSF (Control Panel)' })
  update(@Param('id') id: string, @Body() dto: UpdateCpsfDto, @Req() req: any) {
    const user = extractUser(req);
    return this.service.updateCpsf(idOrDocNoClean(id), dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phiếu CPSF (Control Panel)' })
  remove(@Param('id') id: string) {
    return this.service.deleteCpsf(idOrDocNoClean(id));
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

function idOrDocNoClean(val: string): string {
  return decodeURIComponent(val || '').trim();
}
