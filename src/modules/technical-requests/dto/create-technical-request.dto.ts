import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTechnicalRequestDto {
  @ApiPropertyOptional({ example: 'REQ-20261003-1430', description: 'Document Number' })
  @IsOptional()
  @IsString()
  docNo?: string;

  @ApiProperty({ example: '2026-10-03', description: 'Request Date' })
  @IsNotEmpty()
  @IsString()
  reqDate!: string;

  @ApiProperty({ example: '14:30', description: 'Request Time' })
  @IsNotEmpty()
  @IsString()
  reqTime!: string;

  @ApiProperty({ example: 'Nguyễn Văn A - NV001', description: 'Requested By' })
  @IsNotEmpty()
  @IsString()
  reqBy!: string;

  @ApiProperty({ example: 'OFFSET', description: 'Printing Technology' })
  @IsNotEmpty()
  @IsString()
  printTech!: string;

  @ApiProperty({ example: 'SM 52', description: 'Machine Name' })
  @IsNotEmpty()
  @IsString()
  machineName!: string;

  @ApiProperty({ example: 'Kẹt giấy cuộn cấp phôi liên tục', description: 'Problem Description' })
  @IsNotEmpty()
  @IsString()
  problem!: string;

  @ApiPropertyOptional({ example: 'First Bulk Print', description: 'Machine / Job status' })
  @IsOptional()
  @IsString()
  machineStatus?: string;

  @ApiPropertyOptional({ example: 'Immediate', description: 'Priority level' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Cần gấp cho ca sáng', description: 'Other priority text' })
  @IsOptional()
  @IsString()
  priorityOther?: string;

  @ApiPropertyOptional({ example: 'Phạm Minh Đức - NV004', description: 'Technical Received By' })
  @IsOptional()
  @IsString()
  recvBy?: string;

  @ApiPropertyOptional({ example: '2026-10-03', description: 'Received Date' })
  @IsOptional()
  @IsString()
  recvDate?: string;

  @ApiPropertyOptional({ example: '14:35', description: 'Received Time' })
  @IsOptional()
  @IsString()
  recvTime?: string;

  @ApiPropertyOptional({ example: '2026-10-03', description: 'Finish Date' })
  @IsOptional()
  @IsString()
  finishDate?: string;

  @ApiPropertyOptional({ example: '15:15', description: 'Finish Time' })
  @IsOptional()
  @IsString()
  finishTime?: string;

  @ApiPropertyOptional({ example: 40, description: 'Downtime in minutes' })
  @IsOptional()
  downtime?: number;

  @ApiPropertyOptional({ example: 'Cảm biến mắt đọc bị bám bụi mực', description: 'Root Cause' })
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional({ example: 'Vệ sinh sensor, cân chỉnh lại khe hở con lăn', description: 'Action Taken' })
  @IsOptional()
  @IsString()
  actionTaken?: string;

  @ApiPropertyOptional({ example: 'MACHINE', description: 'Error 4M Classification: MAN, MACHINE, MATERIAL, METHOD' })
  @IsOptional()
  @IsString()
  errCat?: string;

  @ApiPropertyOptional({ example: 'Press', description: 'Process Stage: Prepress, Press, PostPress' })
  @IsOptional()
  @IsString()
  errType?: string;

  @ApiPropertyOptional({ description: 'Array of base64 photos before fix' })
  @IsOptional()
  photosBefore?: string[];

  @ApiPropertyOptional({ description: 'Array of base64 photos after fix' })
  @IsOptional()
  photosAfter?: string[];

  @ApiPropertyOptional({ example: 'OK', description: 'Print Quality: OK | NG' })
  @IsOptional()
  @IsString()
  chkQuality?: string;

  @ApiPropertyOptional({ example: 'DONE', description: 'Ticket Status: DONE | MONITOR | SUPPORT' })
  @IsOptional()
  @IsString()
  chkStatus?: string;

  @ApiPropertyOptional({ example: 'WO-88291', description: 'Work Order No.' })
  @IsOptional()
  @IsString()
  workOrder?: string;

  @ApiPropertyOptional({ example: 5000, description: 'Total Quantity' })
  @IsOptional()
  woTotalQty?: number;

  @ApiPropertyOptional({ example: 25, description: 'Waste Quantity' })
  @IsOptional()
  wasteQty?: number;

  @ApiPropertyOptional({ example: 'Tờ in', description: 'Waste Unit' })
  @IsOptional()
  @IsString()
  wasteUnit?: string;

  @ApiPropertyOptional({ example: '0.5%', description: 'Waste percentage' })
  @IsOptional()
  @IsString()
  wastePercent?: string;

  @ApiPropertyOptional({ example: 'Ngô Trọng Nghĩa - NV008', description: 'Production handover receiver' })
  @IsOptional()
  @IsString()
  prodMgr?: string;
}
