import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MachinesService } from './machines.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Machines & Printing Tech')
@Controller('api/machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all machines list' })
  getAll() {
    return this.machinesService.getAll();
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Get machines grouped by technology for dropdowns' })
  getGrouped() {
    return this.machinesService.getGroupedByTech();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'TECHNICIAN')
  @ApiOperation({ summary: 'Add machine to technology category' })
  addMachine(@Body() body: { tech: string; name: string; code?: string; note?: string }) {
    return this.machinesService.addMachine(body.tech, body.name, body.code, body.note);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'TECHNICIAN')
  @ApiOperation({ summary: 'Update machine' })
  updateMachine(@Param('id') id: string, @Body() body: any) {
    return this.machinesService.updateMachine(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete machine' })
  deleteMachine(@Param('id') id: string) {
    return this.machinesService.deleteMachine(id);
  }
}
