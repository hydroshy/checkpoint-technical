import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { CpsModule } from './modules/cps/cps.module';
import { AnalyticsReportModule } from './modules/analytics-report/analytics-report.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SplitFormsModule } from './modules/split-forms/split-forms.module';
import { TechnicalRequestsModule } from './modules/technical-requests/technical-requests.module';
import { WeeklyDashboardModule } from './modules/weekly-dashboard/weekly-dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    DatabaseModule,
    AuthModule,
    MasterDataModule,
    CpsModule,
    AnalyticsReportModule,
    SettingsModule,
    SplitFormsModule,
    TechnicalRequestsModule,
    WeeklyDashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
