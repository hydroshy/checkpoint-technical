import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdatePublicFormSettingDto } from './dto/update-public-form-setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Settings')
@Controller('api/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all system settings' })
  getAllSettings() {
    return this.settingsService.getSettings();
  }

  @Get('public-form')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get public form setting status' })
  getPublicFormStatus() {
    return this.settingsService.getPublicFormStatus();
  }

  @Put('public-form')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update public form setting status' })
  updatePublicFormStatus(
    @Body() dto: UpdatePublicFormSettingDto,
    @CurrentUser() user: any,
  ) {
    const enabled = dto.isPublicFormEnabled !== undefined
      ? Boolean(dto.isPublicFormEnabled)
      : (dto.enabled !== undefined ? Boolean(dto.enabled) : false);

    return this.settingsService.setPublicFormStatus(
      enabled,
      user?.username || user?.fullName || 'admin',
    );
  }
}
