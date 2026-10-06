import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsReportService } from '../services/analytics-report.service';
import { extractUser } from '../../../common/utils/request-user.util';

@ApiTags('Control Panel Bootstrap & Data Optimization')
@Controller('api/control-panel')
export class ControlPanelApiController {
  constructor(private readonly service: AnalyticsReportService) {}

  @Get('init-data')
  @ApiOperation({ summary: 'Nạp nhanh dữ liệu tổng hợp cho Control Panel' })
  getInitData(@Req() req: any) {
    const user = extractUser(req);
    return this.service.getControlPanelInitData(user);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê chỉ số và thời gian dừng máy theo khoảng ngày' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  getStats(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.service.getControlPanelStats(dateFrom, dateTo);
  }
}
