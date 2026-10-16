import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService, UserRecord } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, pass: string): Promise<UserRecord | null> {
    const user = this.dbService.getUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return null;
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị tạm khóa. Vui lòng liên hệ quản trị viên.');
    }
    let isMatch = false;
    if (user.passwordHash) {
      if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(pass, user.passwordHash);
      } else {
        isMatch = pass === user.passwordHash;
      }
    }
    if (!isMatch && user.passwordHash === 'Checkpoint@123' && pass === 'Checkpoint@123') {
      isMatch = true;
    }
    if (isMatch) {
      return user;
    }
    return null;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    if (!userId) {
      throw new UnauthorizedException('Xác thực không hợp lệ. Vui lòng đăng nhập lại.');
    }
    const user = this.dbService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng.');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị tạm khóa.');
    }

    const { oldPassword, newPassword } = changePasswordDto;
    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      throw new BadRequestException('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }

    let isOldValid = false;
    if (user.passwordHash) {
      if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
        isOldValid = await bcrypt.compare(oldPassword, user.passwordHash);
      } else {
        isOldValid = oldPassword === user.passwordHash;
      }
    }
    if (!isOldValid && user.passwordHash === 'Checkpoint@123' && oldPassword === 'Checkpoint@123') {
      isOldValid = true;
    }

    if (!isOldValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác.');
    }

    const passwordHash = await bcrypt.hash(newPassword.trim(), 10);
    this.dbService.updateUser(userId, { passwordHash });

    this.logger.log(`🔑 Người dùng '${user.username}' đã đổi mật khẩu thành công`);
    return {
      success: true,
      message: 'Đổi mật khẩu thành công.',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      userType: user.role,
      permissions: user.permissions,
    };

    const token = this.jwtService.sign(payload);

    this.logger.log(`👤 User '${user.username}' (${user.role}) logged in successfully`);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 30 * 24 * 3600, // 30 days
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        userType: user.role,
        permissions: user.permissions,
      },
    };
  }
}
