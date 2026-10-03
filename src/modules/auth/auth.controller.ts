import { Controller, Post, Body, Get, Res, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and establish session (Sets session cookie & returns JWT)' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    // Set cookie for browser views
    res.cookie('access_token', result.access_token, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
    });
    res.cookie('checkpoint_token', result.access_token, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
    });
    return result;
  }

  @Get('logout')
  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear session cookies' })
  async logout(@Req() req: Request, @Res() res: Response) {
    const cookieNames = ['access_token', 'checkpoint_token', 'session_id', 'connect.sid'];
    cookieNames.forEach((name) => {
      res.clearCookie(name, { path: '/', sameSite: 'lax', httpOnly: false });
      res.clearCookie(name, { path: '/', sameSite: 'lax', httpOnly: true });
      res.clearCookie(name, { path: '/' });
      res.clearCookie(name);
    });
    if (req.method === 'GET') {
      return res.redirect('/login?logout=1');
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  }

  @Get('session')
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user session profile' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
