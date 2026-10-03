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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Users Management')
@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of system users (Admin only)' })
  getAll() {
    return this.service.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new user account (Admin only)' })
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user account (Admin only)' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account (Admin only)' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
