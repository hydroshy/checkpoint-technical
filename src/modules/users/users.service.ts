import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import {
  DatabaseService,
  UserRecord,
  UserPermissions,
  getDefaultPermissions,
  normalizePermissions,
} from '../database/database.service';
import { CreateUserDto, UpdateUserDto, UpdateUserPermissionsDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  getAll(): Omit<UserRecord, 'passwordHash'>[] {
    return this.dbService.getUsers().map(u => {
      const { passwordHash, ...rest } = u;
      return rest;
    });
  }

  getById(id: string): Omit<UserRecord, 'passwordHash'> {
    const user = this.dbService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`Tài khoản ID '${id}' không tồn tại.`);
    }
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async create(body: CreateUserDto) {
    const existing = this.dbService.getUserByUsername(body.username);
    if (existing) {
      throw new ConflictException(`Tên đăng nhập '${body.username}' đã tồn tại.`);
    }

    const passwordHash = await bcrypt.hash(body.password || 'Checkpoint@123', 10);
    const now = new Date().toISOString();
    const role = body.role || 'EMPLOYEE';
    const permissions = normalizePermissions(role, body.permissions);

    const newUser: UserRecord = {
      id: uuidv4(),
      username: body.username.trim(),
      email: body.email?.trim() || `${body.username.trim()}@checkpointsystems.com`,
      passwordHash,
      fullName: body.fullName?.trim() || body.username.trim(),
      role,
      isActive: true,
      permissions,
      createdAt: now,
      updatedAt: now,
    };

    this.dbService.addUser(newUser);
    const { passwordHash: _, ...result } = newUser;
    return result;
  }

  async update(id: string, body: UpdateUserDto) {
    const updates: Partial<UserRecord> = {};
    if (body.fullName !== undefined) updates.fullName = body.fullName;
    if (body.email !== undefined) updates.email = body.email;
    if (body.role !== undefined) updates.role = body.role;
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    if (body.password) {
      updates.passwordHash = await bcrypt.hash(body.password, 10);
    }
    if (body.permissions !== undefined) {
      const current = this.dbService.getUserById(id);
      const targetRole = body.role || current?.role || 'EMPLOYEE';
      updates.permissions = normalizePermissions(targetRole, {
        ...(current?.permissions || getDefaultPermissions(targetRole)),
        ...body.permissions,
      });
    }

    const updated = this.dbService.updateUser(id, updates);
    if (!updated) {
      throw new NotFoundException(`Tài khoản ID '${id}' không tồn tại.`);
    }
    const { passwordHash: _, ...result } = updated;
    return result;
  }

  async updatePermissions(id: string, body: UpdateUserPermissionsDto) {
    const current = this.dbService.getUserById(id);
    if (!current) {
      throw new NotFoundException(`Tài khoản ID '${id}' không tồn tại.`);
    }

    const rawPermissions =
      body.permissions && typeof body.permissions === 'object' ? body.permissions : body;
    const permissions = normalizePermissions(current.role, {
      ...current.permissions,
      ...rawPermissions,
    });

    const updated = this.dbService.updateUser(id, { permissions });
    if (!updated) {
      throw new NotFoundException(`Tài khoản ID '${id}' không tồn tại.`);
    }
    const { passwordHash: _, ...result } = updated;
    return result;
  }

  delete(id: string) {
    const user = this.dbService.getUserById(id);
    if (user?.username === 'admin') {
      throw new ConflictException('Không thể xóa tài khoản Quản trị viên mặc định (admin).');
    }
    const deleted = this.dbService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`Tài khoản ID '${id}' không tồn tại.`);
    }
    return { success: true };
  }
}
