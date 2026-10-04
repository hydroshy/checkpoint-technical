import {
  Controller,
  Get,
  Post,
  Body,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { MachinesService } from '../machines/machines.service';
import { EmployeesService } from '../employees/employees.service';
import { TechnicalRequestsService } from '../technical-requests/technical-requests.service';
import { CreateTechnicalRequestDto } from '../technical-requests/dto/create-technical-request.dto';

@ApiTags('Public Form APIs')
@Controller('api/public')
export class PublicController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly machinesService: MachinesService,
    private readonly employeesService: EmployeesService,
    private readonly technicalRequestsService: TechnicalRequestsService,
  ) {}

  @Get('form-status')
  @ApiOperation({ summary: 'Check public form status (Enabled/Disabled)' })
  getFormStatus() {
    return this.settingsService.getPublicFormStatus();
  }

  @Get('machines')
  @ApiOperation({ summary: 'Get machine list for public form' })
  getMachines() {
    return this.machinesService.getAll();
  }

  @Get('machines/grouped')
  @ApiOperation({ summary: 'Get machines grouped by tech for public form' })
  getMachinesGrouped() {
    return this.machinesService.getGroupedByTech();
  }

  @Get('employees')
  @ApiOperation({ summary: 'Get employee list for public form' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'dept', required: false, type: String })
  getEmployees(@Query('search') search?: string, @Query('dept') dept?: string) {
    return this.employeesService.getAll(search, dept);
  }

  @Get('employees/hierarchy')
  @ApiOperation({ summary: 'Get department and area hierarchy for public form' })
  getEmployeeHierarchy() {
    return this.employeesService.getHierarchy();
  }

  @Get('catalogs')
  @ApiOperation({ summary: 'Get combined machines and employees catalogs for public form' })
  getCatalogs() {
    return {
      machines: this.machinesService.getAll(),
      groupedMachines: this.machinesService.getGroupedByTech(),
      employees: this.employeesService.getAll(),
      hierarchy: this.employeesService.getHierarchy(),
    };
  }

  @Post('technical-requests')
  @ApiOperation({ summary: 'Submit technical request via public form (No JWT required when public enabled)' })
  async createPublicTechnicalRequest(@Body() dto: CreateTechnicalRequestDto) {
    if (!this.settingsService.isPublicFormEnabled()) {
      throw new ForbiddenException('Form yêu cầu công khai đang đóng.');
    }

    return this.technicalRequestsService.create(dto, {
      username: 'public',
      fullName: 'Public Guest',
      role: 'EMPLOYEE',
    });
  }
}
