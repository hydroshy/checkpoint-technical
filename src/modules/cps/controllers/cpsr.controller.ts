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
import { CpsrService } from '../services/cpsr.service';
import { CreateCpsrDto, UpdateCpsrDto, FormFilterQuery } from '../dto';
import { extractUser, idOrDocNoClean } from '../../../common/utils/request-user.util';

@ApiTags('CPSR - Yêu cầu kỹ thuật (/form-request)')
@Controller('api/cpsr')
export class CpsrController {
  constructor(private readonly service: CpsrService) {}

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
