import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AnalyticsReportService } from './services/analytics-report.service';
import {
  ControlPanelApiController,
  AnalyticsReportController,
} from './controllers';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ControlPanelApiController,
    AnalyticsReportController,
  ],
  providers: [AnalyticsReportService],
  exports: [AnalyticsReportService],
})
export class AnalyticsReportModule {}
