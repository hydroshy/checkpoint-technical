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
import { CpstService } from '../services/cpst.service';
import { CreateCpstDto, UpdateCpstDto, FormFilterQuery } from '../dto';
import { extractUser, idOrDocNoClean } from '../../../common/utils/request-user.util';

@ApiTags('CPST - Phản hồi kỹ thuật (/technical-feedback)')
@Controller('api/cpst')
export class CpstController {
  constructor(private readonly service: CpstService) {}

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
