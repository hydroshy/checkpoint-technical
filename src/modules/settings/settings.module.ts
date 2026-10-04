import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MachinesModule } from '../machines/machines.module';
import { EmployeesModule } from '../employees/employees.module';
import { TechnicalRequestsModule } from '../technical-requests/technical-requests.module';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PublicController } from './public.controller';

@Module({
  imports: [
    DatabaseModule,
    MachinesModule,
    EmployeesModule,
    TechnicalRequestsModule,
  ],
  controllers: [SettingsController, PublicController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
