import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import { CreateUserDto, UpdateUserDto, UpdateUserPermissionsDto } from './dto/user.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user account (Admin only)' })
  create(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user account (Admin only)' })
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.update(id, body);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update user permissions (Admin only)' })
  updatePermissions(@Param('id') id: string, @Body() body: UpdateUserPermissionsDto) {
    return this.service.updatePermissions(id, body);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Patch user permissions (Admin only)' })
  patchPermissions(@Param('id') id: string, @Body() body: UpdateUserPermissionsDto) {
    return this.service.updatePermissions(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user account (Admin only)' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
