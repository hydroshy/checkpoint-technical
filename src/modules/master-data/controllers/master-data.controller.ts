import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MasterDataService } from '../services/master-data.service';

@ApiTags('Master Data - Danh mục dùng chung')
@Controller('api/master-data')
export class MasterDataController {
  constructor(private readonly service: MasterDataService) {}

  @Get('catalogs')
  @ApiOperation({ summary: 'Lấy tất cả danh mục dùng chung (Máy, Nhân viên, Phân cấp, Tùy chọn form)' })
  getCatalogs() {
    return this.service.getCatalog();
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Lấy cơ cấu phòng ban và khu vực làm việc' })
  getHierarchy() {
    return this.service.getHierarchy();
  }

  @Get('lookup-options')
  @ApiOperation({ summary: 'Lấy các tùy chọn danh mục chọn trong form' })
  @ApiQuery({ name: 'category', required: false })
  getLookupOptions(@Query('category') category?: string) {
    return this.service.getLookupOptions(category);
  }
}
