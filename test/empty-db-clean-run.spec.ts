import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/modules/database/database.service';

async function runEmptyDbCleanRunTest() {
  console.log('🚀 [EMPTY DB VERIFICATION] Kiểm thử hệ thống chạy sạch với cơ sở dữ liệu rỗng (0 mock data)...\n');

  // 1. Kiểm tra các file data ticket trong data/ phải rỗng
  console.log('--- 1. Kiểm tra các file JSON dữ liệu phiếu phải hoàn toàn sạch (0 mock data) ---');
  const dataDir = path.resolve(__dirname, '..', 'data');
  const ticketFiles = [
    'cps.json',
    'cpsr.json',
    'cpst.json',
    'cpsf.json',
    'technical_requests.json',
    'weekly_technical_requests.json',
    'defect_logs.json',
    'action_plans.json',
  ];

  for (const file of ticketFiles) {
    const filePath = path.join(dataDir, file);
    assert.ok(fs.existsSync(filePath), `File ${file} phải tồn tại`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    assert.ok(Array.isArray(content), `File ${file} phải chứa mảng JSON`);
    assert.strictEqual(
      content.length,
      0,
      `File ${file} phải có đúng 0 bản ghi (sạch hoàn toàn mock data, hiện tại: ${content.length})`,
    );
    console.log(`  ✅ [PASS] data/${file}: 0 bản ghi (sạch sẽ)`);
  }

  // 2. Khởi tạo NestJS application và listen
  console.log('\n--- 2. Khởi động ứng dụng NestJS trên môi trường DB rỗng ---');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    logger: ['error', 'warn'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const testPort = 3599;
  await app.listen(testPort);
  const baseUrl = `http://127.0.0.1:${testPort}`;
  console.log(`  ✅ [PASS] Ứng dụng khởi động thành công trên ${baseUrl}`);

  try {
    const dbService = app.get(DatabaseService);

    // 3. Kiểm tra các API trả về mảng rỗng và thống kê zero an toàn
    console.log('\n--- 3. Kiểm thử API phiếu trả về mảng rỗng không crash ---');
    
    // CPS list
    const cpsRes = await fetch(`${baseUrl}/api/cps`);
    assert.strictEqual(cpsRes.status, 200, 'GET /api/cps trả về 200');
    const cpsList = await cpsRes.json();
    assert.ok(Array.isArray(cpsList) && cpsList.length === 0, 'Danh sách CPS rỗng (0 phiếu)');
    console.log('  ✅ [PASS] GET /api/cps: 200 OK, 0 phiếu');

    // CPSR list (returns { total, data })
    const cpsrRes = await fetch(`${baseUrl}/api/cpsr`);
    assert.strictEqual(cpsrRes.status, 200, 'GET /api/cpsr trả về 200');
    const cpsrList = await cpsrRes.json();
    assert.strictEqual(cpsrList.total, 0, 'CPSR total === 0');
    assert.ok(Array.isArray(cpsrList.data) && cpsrList.data.length === 0, 'Danh sách CPSR rỗng (0 phiếu)');
    console.log('  ✅ [PASS] GET /api/cpsr: 200 OK, 0 phiếu');

    // CPST list (returns { total, data })
    const cpstRes = await fetch(`${baseUrl}/api/cpst`);
    assert.strictEqual(cpstRes.status, 200, 'GET /api/cpst trả về 200');
    const cpstList = await cpstRes.json();
    assert.strictEqual(cpstList.total, 0, 'CPST total === 0');
    assert.ok(Array.isArray(cpstList.data) && cpstList.data.length === 0, 'Danh sách CPST rỗng (0 phiếu)');
    console.log('  ✅ [PASS] GET /api/cpst: 200 OK, 0 phiếu');

    // CPSF list (returns { total, data })
    const cpsfRes = await fetch(`${baseUrl}/api/cpsf`);
    assert.strictEqual(cpsfRes.status, 200, 'GET /api/cpsf trả về 200');
    const cpsfList = await cpsfRes.json();
    assert.strictEqual(cpsfList.total, 0, 'CPSF total === 0');
    assert.ok(Array.isArray(cpsfList.data) && cpsfList.data.length === 0, 'Danh sách CPSF rỗng (0 phiếu)');
    console.log('  ✅ [PASS] GET /api/cpsf: 200 OK, 0 phiếu');

    // CPSR chain
    const chainRes = await fetch(`${baseUrl}/api/cpsr-chain`);
    assert.strictEqual(chainRes.status, 200, 'GET /api/cpsr-chain trả về 200');
    const chainList = await chainRes.json();
    assert.ok(Array.isArray(chainList) && chainList.length === 0, 'Chuỗi CPSR-CPST-CPSF rỗng (0 chuỗi)');
    console.log('  ✅ [PASS] GET /api/cpsr-chain: 200 OK, 0 chuỗi');

    // Control Panel init-data
    const initDataRes = await fetch(`${baseUrl}/api/control-panel/init-data`);
    assert.strictEqual(initDataRes.status, 200, 'GET /api/control-panel/init-data trả về 200');
    const initData = await initDataRes.json();
    assert.strictEqual(initData.success, true, 'init-data success: true');
    assert.ok(Array.isArray(initData.cps) && initData.cps.length === 0, 'initData.cps rỗng');
    assert.strictEqual(initData.stats.total, 0, 'initData.stats.total === 0');
    console.log('  ✅ [PASS] GET /api/control-panel/init-data: 200 OK, dữ liệu khởi tạo sạch');

    // Analytics KPI
    const kpiRes = await fetch(`${baseUrl}/api/analytics/kpi`);
    assert.strictEqual(kpiRes.status, 200, 'GET /api/analytics/kpi trả về 200');
    const kpiData = await kpiRes.json();
    assert.strictEqual(kpiData.totalRequests, 0, 'KPI totalRequests === 0');
    assert.strictEqual(kpiData.closedPercent, '0%', 'KPI closedPercent === "0%" (không bị NaN/lỗi chia 0)');
    console.log('  ✅ [PASS] GET /api/analytics/kpi: 200 OK, an toàn không lỗi chia 0');

    // Analytics Downtime
    const dtRes = await fetch(`${baseUrl}/api/analytics/downtime`);
    assert.strictEqual(dtRes.status, 200, 'GET /api/analytics/downtime trả về 200');
    const dtData = await dtRes.json();
    assert.ok(Array.isArray(dtData.topMachines) && dtData.topMachines.length === 0, 'Downtime topMachines rỗng');
    console.log('  ✅ [PASS] GET /api/analytics/downtime: 200 OK');

    // Analytics Report Technical
    const repRes = await fetch(`${baseUrl}/api/analytics/report-technical`);
    assert.strictEqual(repRes.status, 200, 'GET /api/analytics/report-technical trả về 200');
    const repData = await repRes.json();
    assert.ok(Array.isArray(repData.records) && repData.records.length === 0, 'Report technical records rỗng');
    assert.strictEqual(repData.stats.totalRequests, 0, 'Report technical stats.totalRequests === 0');
    console.log('  ✅ [PASS] GET /api/analytics/report-technical: 200 OK');

    // 4. Kiểm tra sinh mã tự tăng từ trạng thái rỗng
    console.log('\n--- 4. Kiểm tra sinh mã số tự tăng từ trạng thái DB rỗng ---');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}${mm}${dd}`;

    const nextCpsr = await (await fetch(`${baseUrl}/api/cpsr/next-code`)).json();
    assert.strictEqual(nextCpsr.docNo, `CPSR-${todayStr}-001`, `Mã CPSR đầu tiên phải là CPSR-${todayStr}-001`);
    console.log(`  ✅ [PASS] Mã CPSR khởi đầu: ${nextCpsr.docNo}`);

    const nextCpst = await (await fetch(`${baseUrl}/api/cpst/next-code`)).json();
    assert.strictEqual(nextCpst.docNo, `CPST-${todayStr}-001`, `Mã CPST đầu tiên phải là CPST-${todayStr}-001`);
    console.log(`  ✅ [PASS] Mã CPST khởi đầu: ${nextCpst.docNo}`);

    const nextCpsf = await (await fetch(`${baseUrl}/api/cpsf/next-code`)).json();
    assert.strictEqual(nextCpsf.docNo, `CPSF-${todayStr}-001`, `Mã CPSF đầu tiên phải là CPSF-${todayStr}-001`);
    console.log(`  ✅ [PASS] Mã CPSF khởi đầu: ${nextCpsf.docNo}`);

    const nextCps = await (await fetch(`${baseUrl}/api/cps/next-code`)).json();
    assert.strictEqual(nextCps.docNo, `CPS-${todayStr}-001`, `Mã CPS đầu tiên phải là CPS-${todayStr}-001`);
    console.log(`  ✅ [PASS] Mã CPS khởi đầu: ${nextCps.docNo}`);

    // 5. Kiểm tra Master Data không bị mất
    console.log('\n--- 5. Kiểm tra Master Data (máy móc, nhân sự) nguyên vẹn ---');
    const machRes = await fetch(`${baseUrl}/api/machines`);
    assert.strictEqual(machRes.status, 200, 'GET /api/machines trả về 200');
    const machines = await machRes.json();
    assert.ok(Array.isArray(machines) && machines.length > 0, `Danh mục máy móc có ${machines.length} máy`);
    console.log(`  ✅ [PASS] Danh mục máy móc: ${machines.length} máy sẵn sàng`);

    const adminUser = dbService.getUsers().find((u) => u.role === 'ADMIN') || dbService.getUsers()[0];
    const secret = process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!';
    const token = jwt.sign({ sub: adminUser.id, username: adminUser.username, role: adminUser.role }, secret);
    const empRes = await fetch(`${baseUrl}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(empRes.status, 200, 'GET /api/employees trả về 200');
    const employees = await empRes.json();
    assert.ok(Array.isArray(employees) && employees.length > 0, `Danh sách nhân viên có ${employees.length} người`);
    console.log(`  ✅ [PASS] Danh sách nhân viên: ${employees.length} nhân sự sẵn sàng`);

    // 6. Kiểm tra các trang View giao diện HTML render 200 OK
    console.log('\n--- 6. Kiểm tra render các View HTML không lỗi ---');
    const viewsToCheck = [
      { url: '/', title: 'Trang chủ / Login' },
      { url: '/control-panel', title: 'Quản lý phiếu kỹ thuật (Control Panel)' },
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/form-request', title: 'Form CPSR' },
      { url: '/technical-feedback', title: 'Form CPST' },
      { url: '/confirm-request', title: 'Form CPSF' },
    ];

    for (const v of viewsToCheck) {
      const res = await fetch(`${baseUrl}${v.url}`);
      assert.strictEqual(res.status, 200, `${v.title} (${v.url}) phản hồi HTTP 200 OK`);
      console.log(`  ✅ [PASS] ${v.title} (${v.url}) tải thành công 200 OK`);
    }

    console.log('\n🎉 TOÀN BỘ KIỂM THỬ EMPTY DB CLEAN RUN ĐÃ HOÀN TOÀN ĐẠT CHUẨN! (0 lỗi)\n');
  } finally {
    await app.close();
  }
}

runEmptyDbCleanRunTest().catch((err) => {
  console.error('❌ Lỗi kiểm thử empty db clean run:', err);
  process.exit(1);
});
