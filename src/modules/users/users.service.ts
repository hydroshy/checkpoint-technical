import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { DatabaseService, UserRecord } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  getAll(): Omit<UserRecord, 'passwordHash'>[] {
    return this.dbService.getUsers().map(u => {
      const { passwordHash, ...rest } = u;
      return rest;
    });
  }

  async create(body: { username: string; email?: string; password?: string; fullName?: string; role?: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE' }) {
    const existing = this.dbService.getUserByUsername(body.username);
    if (existing) {
      throw new ConflictException(`Tên đăng nhập '${body.username}' đã tồn tại.`);
    }

    const passwordHash = await bcrypt.hash(body.password || 'Checkpoint@123', 10);
    const now = new Date().toISOString();

    const newUser: UserRecord = {
      id: uuidv4(),
      username: body.username.trim(),
      email: body.email?.trim() || `${body.username.trim()}@checkpointsystems.com`,
      passwordHash,
      fullName: body.fullName?.trim() || body.username.trim(),
      role: body.role || 'EMPLOYEE',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.dbService.addUser(newUser);
    const { passwordHash: _, ...result } = newUser;
    return result;
  }

  async update(id: string, body: { fullName?: string; email?: string; role?: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE'; isActive?: boolean; password?: string }) {
    const updates: Partial<UserRecord> = {};
    if (body.fullName !== undefined) updates.fullName = body.fullName;
    if (body.email !== undefined) updates.email = body.email;
    if (body.role !== undefined) updates.role = body.role;
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    if (body.password) {
      updates.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const updated = this.dbService.updateUser(id, updates);
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
