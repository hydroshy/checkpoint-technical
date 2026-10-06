import { Module } from '@nestjs/common';
import { CpsModule } from '../cps/cps.module';
import { AnalyticsReportModule } from '../analytics-report/analytics-report.module';
import { SplitFormsService } from './split-forms.service';

@Module({
  imports: [CpsModule, AnalyticsReportModule],
  providers: [SplitFormsService],
  exports: [CpsModule, AnalyticsReportModule, SplitFormsService],
})
export class SplitFormsModule {}
