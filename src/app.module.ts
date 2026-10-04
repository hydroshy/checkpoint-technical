import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TechnicalRequestsModule } from './modules/technical-requests/technical-requests.module';
import { MachinesModule } from './modules/machines/machines.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { UsersModule } from './modules/users/users.module';
import { WeeklyDashboardModule } from './modules/weekly-dashboard/weekly-dashboard.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    DatabaseModule,
    AuthModule,
    TechnicalRequestsModule,
    MachinesModule,
    EmployeesModule,
    UsersModule,
    WeeklyDashboardModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
