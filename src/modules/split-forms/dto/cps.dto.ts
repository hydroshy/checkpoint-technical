import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignCpsDto {
  @ApiPropertyOptional({ example: 'KTV Trần Văn B - KT02', description: 'Tên hoặc thông tin KTV phân công' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  // Support frontend sending 'assignee' as alias
  @ApiPropertyOptional({ example: 'KTV Trần Văn B - KT02', description: 'Alias cho assignedTo' })
  @IsOptional()
  @IsString()
  assignee?: string;

  @ApiPropertyOptional({ example: 'EMP-002', description: 'Mã NV hoặc ID nhân viên' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 'EMP-002', description: 'Alias cho assignedToId' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ example: 'Trần Văn B', description: 'Họ tên nhân viên hiển thị' })
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional({ example: '2026-10-06T17:00:00.000Z', description: 'Thời hạn hoàn thành (Deadline - mặc định có thể để trống)' })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional({ example: 'Hỗ trợ ngay', description: 'Mức độ ưu tiên cập nhật' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Ưu tiên khắc phục sớm trước ca chiều', description: 'Ghi chú phân công' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCpsDto {
  @ApiPropertyOptional({ example: 'IN_PROGRESS', description: 'Trạng thái CPS (OPEN_TASK | TO_ASSIGN | IN_PROGRESS | OVER_DUE | CLOSED)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
