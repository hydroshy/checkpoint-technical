import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePublicFormSettingDto {
  @ApiPropertyOptional({ example: true, description: 'Trạng thái bật/tắt form công khai' })
  @IsOptional()
  @IsBoolean()
  isPublicFormEnabled?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Alias cho isPublicFormEnabled' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
