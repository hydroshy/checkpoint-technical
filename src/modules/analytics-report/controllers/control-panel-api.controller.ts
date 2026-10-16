import { Controller, Get, Query, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsReportService } from '../services/analytics-report.service';
import { extractUser } from '../../../common/utils/request-user.util';

@ApiTags('Control Panel Bootstrap & Data Optimization')
@Controller('api/control-panel')
@ApiBearerAuth()
export class ControlPanelApiController {
  constructor(private readonly service: AnalyticsReportService) {}

  private assertNotEmployee(req: any) {
    const user = extractUser(req);
    if (user) {
      const role = user.role || user.userType;
      if (role === 'EMPLOYEE') {
        throw new ForbiddenException("Role 'EMPLOYEE' is not allowed to access Control Panel API.");
      }
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        if (!user.permissions?.canAccessControlPanel) {
          throw new ForbiddenException(`Role '${role}' is not allowed to access Control Panel API.`);
        }
      }
    }
    return user;
  }

  @Get('init-data')
  @ApiOperation({ summary: 'Nạp nhanh dữ liệu tổng hợp cho Control Panel' })
  getInitData(@Req() req: any) {
    const user = this.assertNotEmployee(req);
    return this.service.getControlPanelInitData(user);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê chỉ số và thời gian dừng máy theo khoảng ngày' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  getStats(
    @Req() req: any,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    this.assertNotEmployee(req);
    return this.service.getControlPanelStats(dateFrom, dateTo);
  }
}
