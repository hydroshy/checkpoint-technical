import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Employees & Personnel')
@Controller('api/employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of employees' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'dept', required: false, type: String })
  getAll(@Query('search') search?: string, @Query('dept') dept?: string) {
    return this.service.getAll(search, dept);
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get department and area hierarchy for modal picker' })
  getHierarchy() {
    return this.service.getHierarchy();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TECHNICIAN')
  @ApiOperation({ summary: 'Create new employee' })
  create(@Body() body: { mnv?: string; name: string; dept?: string; area?: string; role?: string }) {
    return this.service.create(body);
  }

  @Post('bulk-import')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TECHNICIAN')
  @ApiOperation({ summary: 'Bulk import employees from Excel json' })
  bulkImport(@Body() body: { employees: Array<{ name: string; mnv?: string; dept?: string; area?: string; role?: string }> }) {
    return this.service.bulkImport(body.employees);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TECHNICIAN')
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete employee' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
