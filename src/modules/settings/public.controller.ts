import {
  Controller,
  Get,
  Post,
  Body,
  ForbiddenException,
  Query,
  Req,
  Optional,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { SettingsService } from './settings.service';
import { MachinesService } from '../machines/machines.service';
import { EmployeesService } from '../employees/employees.service';
import { TechnicalRequestsService } from '../technical-requests/technical-requests.service';
import { CreateTechnicalRequestDto } from '../technical-requests/dto/create-technical-request.dto';
import { DatabaseService, UserRecord } from '../database/database.service';

@ApiTags('Public Form APIs')
@Controller('api/public')
export class PublicController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly machinesService: MachinesService,
    private readonly employeesService: EmployeesService,
    private readonly technicalRequestsService: TechnicalRequestsService,
    @Optional() private readonly dbService?: DatabaseService,
  ) {}

  private extractUserFromRequest(req?: any): UserRecord | null {
    if (!req) return null;

    if (req.user && req.user.id) {
      const db = this.dbService || (this.settingsService as any)?.dbService;
      const u = db?.getUserById(req.user.id);
      if (u && u.isActive) return u;
      if (req.user.isActive !== false) return req.user;
    }

    let token: string | null = null;
    if (req.cookies) {
      token = req.cookies['access_token'] || req.cookies['checkpoint_token'];
    }
    if (!token && req.headers) {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (authHeader && typeof authHeader === 'string') {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
          token = parts[1];
        } else if (parts.length === 1 && !parts[0].includes(' ')) {
          token = parts[0];
        }
      }
      if (!token) {
        token = (req.headers['x-access-token'] || req.headers['checkpoint-token']) as string;
      }
      if (!token && req.headers.cookie) {
        const match = req.headers.cookie.match(/(?:access_token|checkpoint_token)=([^;]+)/);
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }
    }
    if (!token && req.query) {
      token = (req.query.token || req.query.access_token) as string;
    }

    if (!token) return null;

    try {
      const secret = process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!';
      const decoded: any = jwt.verify(token, secret);
      const db = this.dbService || (this.settingsService as any)?.dbService;
      if (!db) return null;

      if (decoded && decoded.sub) {
        const user = db.getUserById(decoded.sub);
        if (user && user.isActive) return user;
      }
      if (decoded && decoded.username) {
        const user = db.getUserByUsernameOrEmail(decoded.username);
        if (user && user.isActive) return user;
      }
    } catch (_) {
      // Invalid or expired token
    }

    return null;
  }

  @Get('form-status')
  @ApiOperation({ summary: 'Check public form status (Enabled/Disabled) with bypass for logged-in staff/admin' })
  getFormStatus(@Req() req?: any) {
    const user = this.extractUserFromRequest(req);
    const isPublic = this.settingsService.isPublicFormEnabled();
    const canAccess = isPublic || !!user;

    return {
      enabled: canAccess,
      isPublicFormEnabled: isPublic,
      canAccess,
      bypass: !isPublic && !!user,
      authenticated: !!user,
      user: user
        ? {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
          }
        : null,
      updatedAt: this.settingsService.getSettings()?.updatedAt,
    };
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

  @Get('lookup-options')
  @ApiOperation({ summary: 'Get form lookup options for public form' })
  @ApiQuery({ name: 'category', required: false, type: String })
  getLookupOptions(@Query('category') category?: string) {
    const db = this.dbService || (this.settingsService as any)?.dbService;
    return db ? db.getLookupOptions(category) : [];
  }

  @Get('catalogs')
  @ApiOperation({ summary: 'Get combined machines, employees, and lookup options for public form' })
  getCatalogs() {
    const db = this.dbService || (this.settingsService as any)?.dbService;
    return {
      machines: this.machinesService.getAll(),
      groupedMachines: this.machinesService.getGroupedByTech(),
      employees: this.employeesService.getAll(),
      hierarchy: this.employeesService.getHierarchy(),
      lookupOptions: db ? db.getLookupOptions() : [],
    };
  }

  @Post('technical-requests')
  @ApiOperation({ summary: 'Submit technical request via public form (Bypasses restriction for admin/staff)' })
  async createPublicTechnicalRequest(
    @Body() dto: CreateTechnicalRequestDto,
    @Req() req?: any,
  ) {
    const user = this.extractUserFromRequest(req);
    const isPublic = this.settingsService.isPublicFormEnabled();

    if (!isPublic && !user) {
      throw new ForbiddenException('Form yêu cầu công khai đang đóng.');
    }

    const creator = user
      ? {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        }
      : {
          username: 'public',
          fullName: 'Public Guest',
          role: 'EMPLOYEE',
        };

    return this.technicalRequestsService.create(dto, creator);
  }
}
