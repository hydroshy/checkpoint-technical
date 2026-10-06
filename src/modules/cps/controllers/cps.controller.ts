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
import { CpsService } from '../services/cps.service';
import {
  CreateCpsDto,
  AssignCpsDto,
  UpdateCpsDto,
  LinkCpsDto,
  UnlinkCpsDto,
  FormFilterQuery,
} from '../dto';
import { extractUser, idOrDocNoClean } from '../../../common/utils/request-user.util';

@ApiTags('CPS - Xâu chuỗi 1-1-1 & Quản lý Phân công nhiệm vụ (/api/cps)')
@Controller('api/cps')
export class CpsController {
  constructor(private readonly service: CpsService) {}

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
