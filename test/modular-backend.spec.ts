import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import * as assert from 'assert';

import { DatabaseModule } from '../src/modules/database/database.module';
import { DatabaseService } from '../src/modules/database/database.service';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CpsModule } from '../src/modules/cps/cps.module';
import { CpsrService } from '../src/modules/cps/services/cpsr.service';
import { CpstService } from '../src/modules/cps/services/cpst.service';
import { CpsfService } from '../src/modules/cps/services/cpsf.service';
import { CpsService } from '../src/modules/cps/services/cps.service';

import { AnalyticsReportModule } from '../src/modules/analytics-report/analytics-report.module';
import { AnalyticsReportService } from '../src/modules/analytics-report/services/analytics-report.service';

import { MasterDataModule } from '../src/modules/master-data/master-data.module';
import { MasterDataService } from '../src/modules/master-data/services/master-data.service';
import * as jwt from 'jsonwebtoken';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    DatabaseModule,
    AuthModule,
    CpsModule,
    AnalyticsReportModule,
    MasterDataModule,
  ],
})
class ModularBackendTestModule {}

async function runModularBackendTests() {
  console.log('🚀 [MODULAR BACKEND TEST] Kiểm thử trực tiếp 3 Domain Modules mới...\n');

  const app = await NestFactory.create<NestExpressApplication>(ModularBackendTestModule, {
    bodyParser: false,
    logger: ['error', 'warn'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const testPort = 3456;
  await app.listen(testPort);
  const baseUrl = `http://127.0.0.1:${testPort}`;

  try {
    // 1. Kiểm thử CpsModule & Dedicated Services
    console.log('--- 1. Kiểm thử CpsModule (CpsrService, CpstService, CpsfService, CpsService) ---');
    const cpsrService = app.get(CpsrService);
    const cpstService = app.get(CpstService);
    const cpsfService = app.get(CpsfService);
    const cpsService = app.get(CpsService);

    assert.ok(cpsrService, 'CpsrService phải được inject thành công');
    assert.ok(cpstService, 'CpstService phải được inject thành công');
    assert.ok(cpsfService, 'CpsfService phải được inject thành công');
    assert.ok(cpsService, 'CpsService phải được inject thành công');
    console.log('  ✅ [PASS] 4 Domain Services của CpsModule đã khởi tạo và inject thành công');

    const nextCpsr = await cpsrService.getNextCpsrDocNo();
    assert.ok(nextCpsr.docNo.startsWith('CPSR-'), 'Mã CPSR tự tăng chuẩn');
    const nextCpst = await cpstService.getNextCpstDocNo();
    assert.ok(nextCpst.docNo.startsWith('CPST-'), 'Mã CPST tự tăng chuẩn');
    const nextCpsf = await cpsfService.getNextCpsfDocNo();
    assert.ok(nextCpsf.docNo.startsWith('CPSF-'), 'Mã CPSF tự tăng chuẩn');
    const nextCps = await cpsService.getNextCpsDocNo();
    assert.ok(nextCps.docNo.startsWith('CPS-'), 'Mã CPS tự tăng chuẩn');
    console.log('  ✅ [PASS] Sinh mã tự tăng của từng service hoạt động chính xác');

    // 2. Kiểm thử API Endpoints của CpsModule
    console.log('\n--- 2. Kiểm thử CpsModule HTTP API Endpoints ---');
    const cpsrRes = await fetch(`${baseUrl}/api/cpsr/next-code`);
    assert.strictEqual(cpsrRes.status, 200, 'GET /api/cpsr/next-code trả về 200');

    const cpstRes = await fetch(`${baseUrl}/api/cpst/next-code`);
    assert.strictEqual(cpstRes.status, 200, 'GET /api/cpst/next-code trả về 200');

    const cpsfRes = await fetch(`${baseUrl}/api/cpsf/next-code`);
    assert.strictEqual(cpsfRes.status, 200, 'GET /api/cpsf/next-code trả về 200');

    const cpsRes = await fetch(`${baseUrl}/api/cps/next-code`);
    assert.strictEqual(cpsRes.status, 200, 'GET /api/cps/next-code trả về 200');

    const chainRes = await fetch(`${baseUrl}/api/cpsr-chain`);
    assert.strictEqual(chainRes.status, 200, 'GET /api/cpsr-chain trả về 200');

    const cpsStatsRes = await fetch(`${baseUrl}/api/cps/stats`);
    assert.strictEqual(cpsStatsRes.status, 200, 'GET /api/cps/stats trả về 200');
    console.log('  ✅ [PASS] Mọi endpoint của CpsModule phản hồi HTTP 200 OK');

    // 3. Kiểm thử AnalyticsReportModule
    console.log('\n--- 3. Kiểm thử AnalyticsReportModule (KPI, Downtime, Time-Range, Report Technical) ---');
    const analyticsService = app.get(AnalyticsReportService);
    assert.ok(analyticsService, 'AnalyticsReportService inject thành công');

    const initDataRes = await fetch(`${baseUrl}/api/control-panel/init-data`);
    assert.strictEqual(initDataRes.status, 200, 'GET /api/control-panel/init-data trả về 200');
    const initData = await initDataRes.json();
    assert.ok(initData.success === true, 'init-data success: true');
    assert.ok(Array.isArray(initData.cps), 'init-data có mảng cps');
    assert.ok(initData.stats, 'init-data có trường stats');

    const cpStatsRes = await fetch(`${baseUrl}/api/control-panel/stats?dateFrom=2026-01-01`);
    assert.strictEqual(cpStatsRes.status, 200, 'GET /api/control-panel/stats trả về 200');
    const cpStats = await cpStatsRes.json();
    assert.ok(typeof cpStats.totalRequests === 'number', 'cpStats có totalRequests');
    assert.ok(typeof cpStats.totalDowntimeMinutes === 'number', 'cpStats có totalDowntimeMinutes');

    const kpiRes = await fetch(`${baseUrl}/api/analytics/kpi`);
    assert.strictEqual(kpiRes.status, 200, 'GET /api/analytics/kpi trả về 200');
    const kpiData = await kpiRes.json();
    assert.ok(typeof kpiData.totalRequests === 'number', 'kpiData có totalRequests');
    assert.ok(typeof kpiData.closedPercent === 'string', 'kpiData có closedPercent');

    const downtimeRes = await fetch(`${baseUrl}/api/analytics/downtime`);
    assert.strictEqual(downtimeRes.status, 200, 'GET /api/analytics/downtime trả về 200');
    const dtData = await downtimeRes.json();
    assert.ok(Array.isArray(dtData.topMachines), 'downtime có topMachines');

    const repTechRes = await fetch(`${baseUrl}/api/analytics/report-technical`);
    assert.strictEqual(repTechRes.status, 200, 'GET /api/analytics/report-technical trả về 200');
    const repData = await repTechRes.json();
    assert.ok(repData.stats && repData.kpi && repData.downtime && Array.isArray(repData.records), 'Report technical trả về đầy đủ');
    console.log('  ✅ [PASS] AnalyticsReportModule đáp ứng đầy đủ KPI, Downtime, Time-Range và Report Technical');

    // 4. Kiểm thử MasterDataModule
    console.log('\n--- 4. Kiểm thử MasterDataModule (Machines, Employees, Users, Catalogs) ---');
    const masterDataService = app.get(MasterDataService);
    assert.ok(masterDataService, 'MasterDataService inject thành công');

    const catRes = await fetch(`${baseUrl}/api/master-data/catalogs`);
    assert.strictEqual(catRes.status, 200, 'GET /api/master-data/catalogs trả về 200');
    const catData = await catRes.json();
    assert.ok(Array.isArray(catData.machines), 'catalogs có danh sách machines');
    assert.ok(Array.isArray(catData.employees), 'catalogs có danh sách employees');
    assert.ok(catData.hierarchy, 'catalogs có hierarchy');

    const machRes = await fetch(`${baseUrl}/api/machines`);
    assert.strictEqual(machRes.status, 200, 'GET /api/machines trả về 200');

    const dbService = app.get(DatabaseService);
    const adminUser = dbService.getUsers().find((u) => u.role === 'ADMIN') || dbService.getUsers()[0];
    const secret = process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!';
    const token = jwt.sign({ sub: adminUser.id, username: adminUser.username, role: adminUser.role }, secret);

    const empRes = await fetch(`${baseUrl}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(empRes.status, 200, 'GET /api/employees trả về 200');

    console.log('  ✅ [PASS] MasterDataModule cung cấp đầy đủ dữ liệu máy móc, nhân viên và danh mục');

    console.log('\n🎉 TOÀN BỘ KIỂM THỬ 3 DOMAIN MODULES MỚI ĐÃ VƯỢT QUA 100% THÀNH CÔNG!\n');
  } finally {
    await app.close();
  }
}

runModularBackendTests().catch((err) => {
  console.error('❌ Lỗi kiểm thử modular backend:', err);
  process.exit(1);
});
