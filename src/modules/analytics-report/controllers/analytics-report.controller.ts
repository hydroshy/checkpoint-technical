import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsReportService } from '../services/analytics-report.service';
import { ReportFilterDto } from '../dto/report-filter.dto';

@ApiTags('Analytics & Technical Reports')
@Controller('api/analytics')
export class AnalyticsReportController {
  constructor(private readonly service: AnalyticsReportService) {}

  @Get('kpi')
  @ApiOperation({ summary: 'Chỉ số KPI kỹ thuật & tỷ lệ khắc phục' })
  getKpi(@Query() query: ReportFilterDto) {
    return this.service.getKpiSummary(query.dateFrom, query.dateTo);
  }

  @Get('downtime')
  @ApiOperation({ summary: 'Phân tích thời gian dừng máy theo máy & công nghệ' })
  getDowntime(@Query() query: ReportFilterDto) {
    return this.service.getDowntimeAnalytics(query.dateFrom, query.dateTo, query.printTech);
  }

  @Get('report-technical')
  @ApiOperation({ summary: 'Báo cáo tổng hợp Report Technical theo mốc thời gian' })
  getReportTechnical(@Query() query: ReportFilterDto) {
    return this.service.getReportTechnical(query.dateFrom, query.dateTo);
  }
}
