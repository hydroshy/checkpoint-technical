import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { DatabaseService } from '../database/database.service';

const cookieOrHeaderExtractor = (req: Request): string | null => {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'] || req.cookies['lorawan_token'];
  }
  if (!token && req && req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dbService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieOrHeaderExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    const user = this.dbService.getUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account not found or deactivated');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      userType: user.role,
    };
  }
}
