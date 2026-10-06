import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CpsService } from '../services/cps.service';

@ApiTags('CPSR Chain Overview (1-1-1 Linkage & Control Panel)')
@Controller('api/cpsr-chain')
export class CpsrChainController {
  constructor(private readonly service: CpsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ chuỗi 1-1-1 (CPSR + CPST + CPSF) cho Control Panel' })
  getChain() {
    return this.service.getCpsrChainList();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Thống kê tổng quan trạng thái chuỗi phiếu CPSR / CPST / CPSF' })
  getStats() {
    return this.service.getStats();
  }
}
