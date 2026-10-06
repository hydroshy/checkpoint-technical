import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateCpstDto {
  @ApiPropertyOptional({ example: 'CPST-20260324-001', description: 'Mã phiếu CPST (nếu để trống hệ thống tự sinh)' })
  @IsOptional()
  @IsString()
  docNo?: string;

  @ApiProperty({ example: 'CPSR-20260324-001', description: 'Mã phiếu CPSR cần liên kết (quan hệ 1-1)' })
  @IsNotEmpty()
  @IsString()
  cpsrDocNo!: string;

  @ApiProperty({ example: 'Trần Văn B - NV002', description: 'Kỹ thuật viên tiếp nhận' })
  @IsNotEmpty()
  @IsString()
  recvBy!: string;

  @ApiPropertyOptional({ example: '2026-03-24', description: 'Ngày tiếp nhận' })
  @IsOptional()
  @IsString()
  recvDate?: string;

  @ApiPropertyOptional({ example: '14:40', description: 'Giờ tiếp nhận' })
  @IsOptional()
  @IsString()
  recvTime?: string;

  @ApiPropertyOptional({ example: '2026-03-24', description: 'Ngày hoàn thành' })
  @IsOptional()
  @IsString()
  finishDate?: string;

  @ApiPropertyOptional({ example: '15:15', description: 'Giờ hoàn thành' })
  @IsOptional()
  @IsString()
  finishTime?: string;

  @ApiPropertyOptional({ example: 35, description: 'Thời gian dừng máy (phút)' })
  @IsOptional()
  @IsNumber()
  downtime?: number;

  @ApiPropertyOptional({ example: 'Bụi mực bám vào cảm biến quang', description: 'Nguyên nhân gốc rễ' })
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional({ example: 'Vệ sinh đầu cảm biến và hiệu chỉnh lại bước trục', description: 'Hành động khắc phục' })
  @IsOptional()
  @IsString()
  actionTaken?: string;

  @ApiPropertyOptional({ example: 'MACHINE', description: 'Phân loại lỗi gốc (MAN, MACHINE, MATERIAL, METHOD)' })
  @IsOptional()
  @IsString()
  errCat?: string;

  @ApiPropertyOptional({ example: 'Press', description: 'Công đoạn lỗi' })
  @IsOptional()
  @IsString()
  errType?: string;

  @ApiPropertyOptional({ example: [], description: 'Danh sách ảnh trạng thái lỗi (Base64 hoặc URL)' })
  @IsOptional()
  @IsArray()
  photosBefore?: string[];

  @ApiPropertyOptional({ example: [], description: 'Danh sách ảnh đã khắc phục' })
  @IsOptional()
  @IsArray()
  photosAfter?: string[];

  @ApiPropertyOptional({ example: 'Đã khắc phục', description: 'Trạng thái xử lý (Đã khắc phục / Theo dõi thêm / Hư hỏng nặng)' })
  @IsOptional()
  @IsString()
  chkStatus?: string;
}

export class UpdateCpstDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recvBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recvDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recvTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  finishDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  finishTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  downtime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionTaken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errCat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  photosBefore?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  photosAfter?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chkStatus?: string;
}
