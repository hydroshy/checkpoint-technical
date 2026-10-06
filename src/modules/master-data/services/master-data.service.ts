import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { MachinesService } from '../../machines/machines.service';
import { EmployeesService } from '../../employees/employees.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class MasterDataService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly machinesService: MachinesService,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  getCatalog() {
    return {
      machines: this.machinesService.getAll(),
      machinesGrouped: this.machinesService.getGroupedByTech(),
      employees: this.employeesService.getAll(),
      hierarchy: this.employeesService.getHierarchy(),
      lookupOptions: this.dbService.getLookupOptions(),
      requesters: this.dbService.getRequesters(),
    };
  }

  getHierarchy() {
    return this.employeesService.getHierarchy();
  }

  getLookupOptions(category?: string) {
    return this.dbService.getLookupOptions(category);
  }

  getMachinesService(): MachinesService {
    return this.machinesService;
  }

  getEmployeesService(): EmployeesService {
    return this.employeesService;
  }

  getUsersService(): UsersService {
    return this.usersService;
  }
}
