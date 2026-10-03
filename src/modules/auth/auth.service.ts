import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService, UserRecord } from '../database/database.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, pass: string): Promise<UserRecord | null> {
    const user = this.dbService.getUserByUsernameOrEmail(usernameOrEmail);
    if (!user) return null;
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị tạm khóa. Vui lòng liên hệ quản trị viên.');
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (isMatch) {
      return user;
    }
    return null;
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
      },
    };
  }
}
