import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCpsrDto {
  @ApiPropertyOptional({ example: 'CPSR-20260324-001', description: 'Mã phiếu CPSR (nếu để trống hệ thống tự sinh)' })
  @IsOptional()
  @IsString()
  docNo?: string;

  @ApiProperty({ example: '2026-03-24', description: 'Ngày yêu cầu' })
  @IsNotEmpty()
  @IsString()
  reqDate!: string;

  @ApiProperty({ example: '14:30', description: 'Giờ yêu cầu' })
  @IsNotEmpty()
  @IsString()
  reqTime!: string;

  @ApiProperty({ example: 'Nguyễn Văn A - NV001', description: 'Người yêu cầu' })
  @IsNotEmpty()
  @IsString()
  reqBy!: string;

  @ApiProperty({ example: 'OFFSET', description: 'Công nghệ in' })
  @IsNotEmpty()
  @IsString()
  printTech!: string;

  @ApiProperty({ example: 'SM 52', description: 'Tên máy' })
  @IsNotEmpty()
  @IsString()
  machineName!: string;

  @ApiProperty({ example: 'Lệch màu đầu in trục số 2', description: 'Mô tả sự cố' })
  @IsNotEmpty()
  @IsString()
  problem!: string;

  @ApiPropertyOptional({ example: 'Hàng SX lần đầu', description: 'Trạng thái sự cố (Hàng SX lần đầu / Hàng SX nhiều lần)' })
  @IsOptional()
  @IsString()
  machineStatus?: string;

  @ApiPropertyOptional({ example: 'Hỗ trợ ngay', description: 'Mức độ ưu tiên (Hỗ trợ ngay / Chạy tạm / Khác)' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Gấp cho đơn hàng xuất xưởng', description: 'Ưu tiên khác' })
  @IsOptional()
  @IsString()
  priorityOther?: string;
}

export class UpdateCpsrDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reqDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reqTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reqBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  printTech?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  machineName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  machineStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priorityOther?: string;
}
