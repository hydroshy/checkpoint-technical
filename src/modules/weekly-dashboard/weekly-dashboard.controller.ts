import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DatabaseService, RequesterRecord, WeeklyTechnicalRequestRecord, DefectLogRecord, ActionPlanRecord, FormLookupOptionRecord } from '../database/database.service';

@ApiTags('Weekly Technical Dashboard & Database')
@Controller('api')
export class WeeklyDashboardController {
  constructor(private readonly dbService: DatabaseService) {}

  // 1. Requesters (Name of reqester.xlsx -> Sheet Requester)
  @Get('requesters')
  @ApiOperation({ summary: 'Lấy danh sách người yêu cầu (Sheet Requester)' })
  getRequesters() {
    return this.dbService.getRequesters();
  }

  @Post('requesters')
  @ApiOperation({ summary: 'Thêm mới hoặc cập nhật người yêu cầu' })
  addRequester(@Body() body: RequesterRecord) {
    if (!body.id) body.id = 'req-' + Date.now();
    this.dbService.addRequester(body);
    return { success: true, data: body };
  }

  @Put('requesters/:id')
  @ApiOperation({ summary: 'Cập nhật người yêu cầu' })
  updateRequester(@Param('id') id: string, @Body() body: Partial<RequesterRecord>) {
    const updated = this.dbService.updateRequester(id, body);
    return { success: !!updated, data: updated };
  }

  @Delete('requesters/:id')
  @ApiOperation({ summary: 'Xóa người yêu cầu' })
  deleteRequester(@Param('id') id: string) {
    const deleted = this.dbService.deleteRequester(id);
    return { success: deleted };
  }

  // 2. Weekly Technical Requests (Weekly_Technical_Dashboard_Database.xlsx -> Sheet 1_Technical_Requests)
  @Get('weekly-requests')
  @ApiOperation({ summary: 'Lấy danh sách phiếu yêu cầu kỹ thuật (Sheet 1_Technical_Requests)' })
  getWeeklyRequests() {
    return this.dbService.getWeeklyRequests();
  }

  @Post('weekly-requests')
  @ApiOperation({ summary: 'Thêm mới phiếu yêu cầu kỹ thuật' })
  addWeeklyRequest(@Body() body: WeeklyTechnicalRequestRecord) {
    if (!body.id) {
      body.id = 'wreq-' + Date.now();
    }
    this.dbService.addWeeklyRequest(body);
    return { success: true, data: body };
  }

  @Put('weekly-requests/:id')
  @ApiOperation({ summary: 'Cập nhật phiếu yêu cầu kỹ thuật' })
  updateWeeklyRequest(@Param('id') id: string, @Body() body: Partial<WeeklyTechnicalRequestRecord>) {
    const updated = this.dbService.updateWeeklyRequest(id, body);
    return { success: !!updated, data: updated };
  }

  @Delete('weekly-requests/:id')
  @ApiOperation({ summary: 'Xóa phiếu yêu cầu kỹ thuật' })
  deleteWeeklyRequest(@Param('id') id: string) {
    const deleted = this.dbService.deleteWeeklyRequest(id);
    return { success: deleted };
  }

  // 3. Defect Logs (Weekly_Technical_Dashboard_Database.xlsx -> Sheet 2_Defect_Log)
  @Get('defect-logs')
  @ApiOperation({ summary: 'Lấy danh sách lỗi kỹ thuật (Sheet 2_Defect_Log)' })
  getDefectLogs() {
    return this.dbService.getDefectLogs();
  }

  @Post('defect-logs')
  @ApiOperation({ summary: 'Thêm mới lỗi kỹ thuật vào Defect Log' })
  addDefectLog(@Body() body: DefectLogRecord) {
    if (!body.id) {
      body.id = 'defect-' + Date.now();
    }
    this.dbService.addDefectLog(body);
    return { success: true, data: body };
  }

  @Put('defect-logs/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin lỗi kỹ thuật' })
  updateDefectLog(@Param('id') id: string, @Body() body: Partial<DefectLogRecord>) {
    const updated = this.dbService.updateDefectLog(id, body);
    return { success: !!updated, data: updated };
  }

  @Delete('defect-logs/:id')
  @ApiOperation({ summary: 'Xóa lỗi kỹ thuật' })
  deleteDefectLog(@Param('id') id: string) {
    const deleted = this.dbService.deleteDefectLog(id);
    return { success: deleted };
  }

  // 4. Action Plans (Weekly_Technical_Dashboard_Database.xlsx -> Sheet 3_Action_Plan)
  @Get('action-plans')
  @ApiOperation({ summary: 'Lấy danh sách kế hoạch hành động (Sheet 3_Action_Plan)' })
  getActionPlans() {
    return this.dbService.getActionPlans();
  }

  @Post('action-plans')
  @ApiOperation({ summary: 'Thêm mới kế hoạch hành động' })
  addActionPlan(@Body() body: ActionPlanRecord) {
    if (!body.id) {
      body.id = 'act-' + Date.now();
    }
    this.dbService.addActionPlan(body);
    return { success: true, data: body };
  }

  @Put('action-plans/:id')
  @ApiOperation({ summary: 'Cập nhật kế hoạch hành động' })
  updateActionPlan(@Param('id') id: string, @Body() body: Partial<ActionPlanRecord>) {
    const updated = this.dbService.updateActionPlan(id, body);
    return { success: !!updated, data: updated };
  }

  @Delete('action-plans/:id')
  @ApiOperation({ summary: 'Xóa kế hoạch hành động' })
  deleteActionPlan(@Param('id') id: string) {
    const deleted = this.dbService.deleteActionPlan(id);
    return { success: deleted };
  }

  // 5. Form Lookup Options (Weekly_Technical_Dashboard_Database.xlsx -> Sheet Lists_DO_NOT_DELETE)
  @Get('lookup-options')
  @ApiOperation({ summary: 'Lấy các trường dữ liệu chọn được trong form (Sheet Lists_DO_NOT_DELETE)' })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục (Request_Type, Severity, Status_Req, Root_Cause, Fix_Type, Status_Act, Resource_Needed, etc.)' })
  getLookupOptions(@Query('category') category?: string) {
    return this.dbService.getLookupOptions(category);
  }

  @Get('sheet-lists')
  @ApiOperation({ summary: 'Lấy nguyên dạng dòng của sheet Lists_DO_NOT_DELETE' })
  getSheetLists() {
    return this.dbService.getSheetLists();
  }
}
