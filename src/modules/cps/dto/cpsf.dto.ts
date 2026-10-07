import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCpsfDto {
  @ApiPropertyOptional({ example: 'CPSF-20260324-001', description: 'Mã phiếu CPSF (nếu để trống hệ thống tự sinh)' })
  @IsOptional()
  @IsString()
  docNo?: string;

  @ApiProperty({ example: 'CPST-20260324-001', description: 'Mã phiếu CPST cần liên kết (quan hệ 1-1)' })
  @IsNotEmpty()
  @IsString()
  cpstDocNo!: string;

  @ApiPropertyOptional({ example: 'CPSR-20260324-001', description: 'Mã phiếu CPSR gốc (tự động suy ra từ CPST)' })
  @IsOptional()
  @IsString()
  cpsrDocNo?: string;

  @ApiPropertyOptional({ example: 'Đạt', description: 'Chất lượng in (Đạt / Chưa đạt)' })
  @IsOptional()
  @IsString()
  chkQuality?: string;

  @ApiPropertyOptional({ example: 'WO-20260324-88', description: 'Mã đơn hàng / Work Order (không bắt buộc)' })
  @IsOptional()
  @IsString()
  workOrder?: string;

  @ApiPropertyOptional({ example: 'WO-20260324-88', description: 'Alias mã đơn hàng / Work Order (không bắt buộc)' })
  @IsOptional()
  @IsString()
  wo?: string;

  @ApiPropertyOptional({ example: 10000, description: 'Tổng số lượng đơn hàng (không bắt buộc)' })
  @IsOptional()
  @IsNumber()
  woTotalQty?: number;

  @ApiPropertyOptional({ example: 10000, description: 'Alias tổng số lượng đơn hàng (không bắt buộc)' })
  @IsOptional()
  @IsNumber()
  totalQty?: number;

  @ApiPropertyOptional({ example: 25, description: 'Số lượng phế (không bắt buộc)' })
  @IsOptional()
  @IsNumber()
  wasteQty?: number;

  @ApiPropertyOptional({ example: 25, description: 'Alias phế phát sinh / scrap quantity (không bắt buộc)' })
  @IsOptional()
  @IsNumber()
  scrapQty?: number;

  @ApiPropertyOptional({ example: 'PCS', description: 'Đơn vị tính phế (PCS / Mét / Tờ in)' })
  @IsOptional()
  @IsString()
  wasteUnit?: string;

  @ApiPropertyOptional({ example: '0.25%', description: 'Tỷ lệ phế' })
  @IsOptional()
  @IsString()
  wastePercent?: string;

  @ApiProperty({ example: 'Lê Văn C - Trưởng ca SX', description: 'Đại diện sản xuất xác nhận ký nhận' })
  @IsNotEmpty()
  @IsString()
  prodMgr!: string;
}

export class UpdateCpsfDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chkQuality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workOrder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  woTotalQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  wasteQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  scrapQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wasteUnit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wastePercent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prodMgr?: string;
}
