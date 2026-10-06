import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateCpsDto {
  @ApiPropertyOptional({ example: 'CPS-20261005-013', description: 'Mã phiếu CPS (tùy chọn, nếu không gửi hệ thống tự sinh)' })
  @IsOptional()
  @IsString()
  docNo?: string;

  @ApiProperty({ example: 'CPSR-20261005-012', description: 'Mã phiếu CPSR (bắt buộc: CPS chỉ được tạo khi có CPSR)' })
  @IsNotEmpty({ message: 'Bắt buộc phải có mã phiếu CPSR (cpsrDocNo) để tạo phiếu CPS.' })
  @IsString()
  cpsrDocNo!: string;

  @ApiPropertyOptional({ description: 'ID của phiếu CPSR trong hệ thống' })
  @IsOptional()
  @IsString()
  cpsrId?: string;

  @ApiPropertyOptional({ example: 'CPST-20261005-011', description: 'Mã phiếu CPST cần ghép nối (nếu có)' })
  @IsOptional()
  @IsString()
  cpstDocNo?: string;

  @ApiPropertyOptional({ description: 'ID phiếu CPST' })
  @IsOptional()
  @IsString()
  cpstId?: string;

  @ApiPropertyOptional({ example: 'CPSF-20261005-008', description: 'Mã phiếu CPSF cần ghép nối (nếu có)' })
  @IsOptional()
  @IsString()
  cpsfDocNo?: string;

  @ApiPropertyOptional({ description: 'ID phiếu CPSF' })
  @IsOptional()
  @IsString()
  cpsfId?: string;

  @ApiPropertyOptional({ example: 'KTV Đỗ Đức Nhật - VN5944', description: 'Kỹ thuật viên tiếp nhận / phân công' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'VN5944', description: 'Mã nhân viên KTV' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 'Đỗ Đức Nhật', description: 'Tên KTV' })
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional({ example: '2026-10-05T16:00:00.000Z', description: 'Hạn chót xử lý' })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional({ example: 'Hỗ trợ ngay', description: 'Mức độ ưu tiên' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Woven', description: 'Công nghệ in' })
  @IsOptional()
  @IsString()
  printTech?: string;

  @ApiPropertyOptional({ example: 'Woven 2', description: 'Tên máy' })
  @IsOptional()
  @IsString()
  machineName?: string;

  @ApiPropertyOptional({ example: 'Lệch khổ in và đứt chỉ', description: 'Mô tả sự cố' })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn Kiểm Thử', description: 'Người yêu cầu' })
  @IsOptional()
  @IsString()
  reqBy?: string;

  @ApiPropertyOptional({ example: '2026-10-05', description: 'Ngày yêu cầu' })
  @IsOptional()
  @IsString()
  reqDate?: string;

  @ApiPropertyOptional({ example: '10:00', description: 'Giờ yêu cầu' })
  @IsOptional()
  @IsString()
  reqTime?: string;

  @ApiPropertyOptional({ example: 'Kiểm tra kỹ đầu dò sợi', description: 'Ghi chú phân công' })
  @IsOptional()
  @IsString()
  notes?: string;
}

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

  @ApiPropertyOptional({ example: 'KTV Đỗ Đức Nhật - VN5944' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'VN5944' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 'Đỗ Đức Nhật' })
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional({ example: '2026-10-05T16:00:00.000Z' })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional({ example: 'Hỗ trợ ngay' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Woven' })
  @IsOptional()
  @IsString()
  printTech?: string;

  @ApiPropertyOptional({ example: 'Woven 2' })
  @IsOptional()
  @IsString()
  machineName?: string;

  @ApiPropertyOptional({ example: 'Lệch khổ in' })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn Kiểm Thử' })
  @IsOptional()
  @IsString()
  reqBy?: string;

  @ApiPropertyOptional({ example: '2026-10-05' })
  @IsOptional()
  @IsString()
  reqDate?: string;

  @ApiPropertyOptional({ example: '10:00' })
  @IsOptional()
  @IsString()
  reqTime?: string;

  @ApiPropertyOptional({ example: 45, description: 'Thời gian dừng máy (phút)' })
  @IsOptional()
  @IsNumber()
  downtime?: number;

  @ApiPropertyOptional({ example: 'WO-20261005-99' })
  @IsOptional()
  @IsString()
  workOrder?: string;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsNumber()
  woTotalQty?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  wasteQty?: number;

  @ApiPropertyOptional({ example: '2.50%' })
  @IsOptional()
  @IsString()
  wastePercent?: string;

  @ApiPropertyOptional({ example: 'PCS' })
  @IsOptional()
  @IsString()
  wasteUnit?: string;

  @ApiPropertyOptional({ example: 'Đã khắc phục' })
  @IsOptional()
  @IsString()
  chkStatus?: string;

  @ApiPropertyOptional({ example: 'Đạt' })
  @IsOptional()
  @IsString()
  chkQuality?: string;

  @ApiPropertyOptional({ example: 'CPST-20261005-011', description: 'Mã phiếu CPST cần ghép nối' })
  @IsOptional()
  @IsString()
  cpstDocNo?: string | null;

  @ApiPropertyOptional({ description: 'ID phiếu CPST cần ghép nối' })
  @IsOptional()
  @IsString()
  cpstId?: string | null;

  @ApiPropertyOptional({ example: 'CPSF-20261005-008', description: 'Mã phiếu CPSF cần ghép nối' })
  @IsOptional()
  @IsString()
  cpsfDocNo?: string | null;

  @ApiPropertyOptional({ description: 'ID phiếu CPSF cần ghép nối' })
  @IsOptional()
  @IsString()
  cpsfId?: string | null;

  @ApiPropertyOptional({ example: 'CPSR-20261005-012', description: 'Mã phiếu CPSR liên kết' })
  @IsOptional()
  @IsString()
  cpsrDocNo?: string;

  @ApiPropertyOptional({ description: 'ID phiếu CPSR' })
  @IsOptional()
  @IsString()
  cpsrId?: string;

  @ApiPropertyOptional({ example: 'Kiểm tra kỹ đầu dò sợi' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class LinkCpsDto {
  @ApiPropertyOptional({ example: 'CPS-20261005-012', description: 'Mã phiếu CPS cần ghép nối (khi gọi endpoint tổng)' })
  @IsOptional()
  @IsString()
  cpsDocNo?: string;

  @ApiPropertyOptional({ description: 'ID của phiếu CPS' })
  @IsOptional()
  @IsString()
  cpsId?: string;

  @ApiPropertyOptional({ example: 'CPST-20261005-011', description: 'Mã phiếu CPST cần ghép nối' })
  @IsOptional()
  @IsString()
  cpstDocNo?: string;

  @ApiPropertyOptional({ description: 'ID phiếu CPST cần ghép nối' })
  @IsOptional()
  @IsString()
  cpstId?: string;

  @ApiPropertyOptional({ example: 'CPSF-20261005-008', description: 'Mã phiếu CPSF cần ghép nối' })
  @IsOptional()
  @IsString()
  cpsfDocNo?: string;

  @ApiPropertyOptional({ description: 'ID phiếu CPSF cần ghép nối' })
  @IsOptional()
  @IsString()
  cpsfId?: string;

  @ApiPropertyOptional({ example: 'CPSR-20261005-012', description: 'Mã phiếu CPSR (đối chiếu kiểm tra liên kết)' })
  @IsOptional()
  @IsString()
  cpsrDocNo?: string;
}

export class UnlinkCpsDto {
  @ApiPropertyOptional({ example: true, description: 'Hủy ghép nối phiếu CPST' })
  @IsOptional()
  @IsBoolean()
  unlinkCpst?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Hủy ghép nối phiếu CPSF' })
  @IsOptional()
  @IsBoolean()
  unlinkCpsf?: boolean;
}
