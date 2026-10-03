import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TechnicalRequestsService, RequestFilterQuery } from './technical-requests.service';
import { CreateTechnicalRequestDto } from './dto/create-technical-request.dto';
import { UpdateTechnicalRequestDto } from './dto/update-technical-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Technical Requests')
@Controller('api/technical-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TechnicalRequestsController {
  constructor(private readonly service: TechnicalRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of technical requests with filtering & search' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'printTech', required: false, type: String })
  @ApiQuery({ name: 'chkStatus', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, type: String })
  @ApiQuery({ name: 'errCat', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(@Query() query: RequestFilterQuery) {
    return this.service.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get summary statistics & KPI analytics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all technical requests backup' })
  async exportAll() {
    return this.service.exportAll();
  }

  @Post('import')
  @ApiOperation({ summary: 'Import technical requests backup' })
  async importAll(@Body() body: any) {
    return this.service.importAll(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get technical request detail by id or docNo' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new technical request' })
  async create(@Body() dto: CreateTechnicalRequestDto, @CurrentUser() user: any) {
    return this.service.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update technical request' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTechnicalRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete technical request' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
