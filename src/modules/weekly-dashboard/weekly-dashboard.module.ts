import { Module } from '@nestjs/common';
import { WeeklyDashboardController } from './weekly-dashboard.controller';

@Module({
  controllers: [WeeklyDashboardController],
})
export class WeeklyDashboardModule {}
