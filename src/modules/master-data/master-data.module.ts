import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MachinesModule } from '../machines/machines.module';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { MasterDataService } from './services/master-data.service';
import { MasterDataController } from './controllers/master-data.controller';

@Module({
  imports: [
    DatabaseModule,
    MachinesModule,
    EmployeesModule,
    UsersModule,
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [
    MasterDataService,
    MachinesModule,
    EmployeesModule,
    UsersModule,
  ],
})
export class MasterDataModule {}
