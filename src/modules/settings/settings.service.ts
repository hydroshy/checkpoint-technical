import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService, SystemSettingsRecord } from '../database/database.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly dbService: DatabaseService) {}

  getSettings(): SystemSettingsRecord {
    return this.dbService.getSettings();
  }

  isPublicFormEnabled(): boolean {
    const settings = this.dbService.getSettings();
    return !!settings?.isPublicFormEnabled;
  }

  getPublicFormStatus() {
    const isPublicFormEnabled = this.isPublicFormEnabled();
    return {
      enabled: isPublicFormEnabled,
      isPublicFormEnabled,
    };
  }

  setPublicFormStatus(enabled: boolean, updatedBy?: string) {
    const updated = this.dbService.updateSettings(
      { isPublicFormEnabled: enabled },
      updatedBy,
    );
    this.logger.log(`⚙️ Public Form Status changed to: ${enabled} by ${updatedBy || 'admin'}`);
    return {
      success: true,
      enabled: updated.isPublicFormEnabled,
      isPublicFormEnabled: updated.isPublicFormEnabled,
      updatedAt: updated.updatedAt,
      updatedBy: updated.updatedBy,
    };
  }
}
