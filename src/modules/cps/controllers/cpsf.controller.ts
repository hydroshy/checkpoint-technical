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
import { CpsfService } from '../services/cpsf.service';
import { CreateCpsfDto, UpdateCpsfDto, FormFilterQuery } from '../dto';
import { extractUser, idOrDocNoClean } from '../../../common/utils/request-user.util';

@ApiTags('CPSF - Xác nhận bàn giao (/confirm-request)')
@Controller('api/cpsf')
export class CpsfController {
  constructor(private readonly service: CpsfService) {}

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
