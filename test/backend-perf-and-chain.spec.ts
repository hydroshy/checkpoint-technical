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
import { CpsService } from '../src/modules/cps/services/cps.service';
import { CpsrService } from '../src/modules/cps/services/cpsr.service';
import { CpstService } from '../src/modules/cps/services/cpst.service';
import { CpsfService } from '../src/modules/cps/services/cpsf.service';
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
  ],
})
class BackendPerfTestModule {}

export async function runBackendPerfAndChainTests() {
  console.log('⚡ [BACKEND PERF & CHAIN TEST] Kiểm thử tối ưu backend, liên kết 3 phiếu và chuẩn hóa Technician...\n');

  const app = await NestFactory.create<NestExpressApplication>(BackendPerfTestModule, {
    bodyParser: false,
    logger: ['error', 'warn'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const testPort = 3590;
  await app.listen(testPort);
  const baseUrl = `http://127.0.0.1:${testPort}`;

  const secret = process.env.JWT_SECRET || 'checkpoint_technical_secret_key_2026';
  const token = jwt.sign(
    { sub: 'usr-admin', username: 'admin', role: 'ADMIN', permissions: { canAccessControlPanel: true } },
    secret,
    { expiresIn: '1h' }
  );
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const dbService = app.get(DatabaseService);
    const cpsService = app.get(CpsService);
    const cpsrService = app.get(CpsrService);
    const cpstService = app.get(CpstService);
    const cpsfService = app.get(CpsfService);

    // =========================================================================
    // 1. Kiểm thử liên kết chuỗi 3 phiếu (CPSR -> CPST -> CPSF) vào CPS
    // =========================================================================
    console.log('--- 1. Kiểm thử liên kết chuỗi 3 phiếu (CPSR, CPST, CPSF) vào CPS ---');

    // 1.1 Tạo CPSR
    const cpsrDoc = (await cpsrService.getNextCpsrDocNo()).docNo;
    const cpsr = await cpsrService.createCpsr({
      docNo: cpsrDoc,
      reqDate: '2026-10-06',
      reqTime: '08:00',
      reqBy: 'Test Operator',
      printTech: 'Digital',
      machineName: 'Indigo 12000',
      problem: 'Error drum color calibration',
    });
    assert.strictEqual(cpsr.docNo, cpsrDoc, 'CPSR docNo phải khớp');

    // CPS tự động sinh và liên kết
    const linkedCps = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    assert.ok(linkedCps, 'CPS phải được tự động sinh và liên kết với CPSR');
    assert.strictEqual(linkedCps!.cpsrDocNo, cpsr.docNo);
    assert.strictEqual(linkedCps!.status, 'TO_ASSIGN');
    console.log(`  ✅ [PASS] CPS ${linkedCps!.docNo} tự động sinh và liên kết với CPSR ${cpsr.docNo}`);

    // 1.2 Tạo CPST
    const cpstDoc = (await cpstService.getNextCpstDocNo()).docNo;
    const cpst = await cpstService.createCpst({
      docNo: cpstDoc,
      cpsrDocNo: cpsr.docNo,
      recvBy: 'Technician Nguyễn Văn A',
      downtime: 40,
      chkStatus: 'Đã khắc phục',
    });
    assert.strictEqual(cpst.docNo, cpstDoc);

    // Kiểm tra CPS đã tự động cập nhật CPST, downtime, Technician và chuyển sang IN_PROGRESS
    const cpsAfterCpst = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    assert.ok(cpsAfterCpst);
    assert.strictEqual(cpsAfterCpst!.cpstDocNo, cpst.docNo, 'CPS phải liên kết cpstDocNo');
    assert.strictEqual(cpsAfterCpst!.downtime, 40, 'CPS phải cập nhật downtime từ CPST');
    assert.strictEqual(cpsAfterCpst!.status, 'IN_PROGRESS', 'CPS chuyển sang IN_PROGRESS');
    assert.strictEqual(cpsAfterCpst!.technician, 'Technician Nguyễn Văn A', 'CPS có technician đồng bộ từ CPST');
    console.log(`  ✅ [PASS] CPS ${cpsAfterCpst!.docNo} tự động liên kết CPST ${cpst.docNo}, downtime=40m, status=IN_PROGRESS`);

    // 1.3 Tạo CPSF
    const cpsfDoc = (await cpsfService.getNextCpsfDocNo()).docNo;
    const cpsf = await cpsfService.createCpsf({
      docNo: cpsfDoc,
      cpstDocNo: cpst.docNo,
      chkQuality: 'Đạt',
      workOrder: 'WO-88899',
      woTotalQty: 2000,
      wasteQty: 40,
      wasteUnit: 'pcs',
      prodMgr: 'Leader Duy',
    });
    assert.strictEqual(cpsf.docNo, cpsfDoc);

    // Kiểm tra CPS đã tự động cập nhật CPSF, tính % phế và chuyển sang CLOSED
    const cpsAfterCpsf = dbService.getCpsByCpsrDocNo(cpsr.docNo);
    assert.ok(cpsAfterCpsf);
    assert.strictEqual(cpsAfterCpsf!.cpsfDocNo, cpsf.docNo, 'CPS phải liên kết cpsfDocNo');
    assert.strictEqual(cpsAfterCpsf!.status, 'CLOSED', 'CPS phải chuyển sang CLOSED');
    assert.strictEqual(cpsAfterCpsf!.wastePercent, '2.00%', 'CPS tính đúng % phế = 40/2000 = 2.00%');
    console.log(`  ✅ [PASS] CPS ${cpsAfterCpsf!.docNo} tự động liên kết CPSF ${cpsf.docNo}, phế=2.00%, status=CLOSED`);

    // 1.4 Kiểm tra getCpsrChainList() chứa đầy đủ cả 4 phiếu
    const chains = dbService.getCpsrChainList();
    const chainItem = chains.find(c => c.cpsr.docNo === cpsr.docNo);
    assert.ok(chainItem, 'Chuỗi phải tồn tại trong getCpsrChainList');
    assert.ok(chainItem!.cpsr, 'Có đối tượng cpsr');
    assert.ok(chainItem!.cpst, 'Có đối tượng cpst');
    assert.ok(chainItem!.cpsf, 'Có đối tượng cpsf');
    assert.ok(chainItem!.cps, 'Có đối tượng cps liên kết');
    assert.strictEqual(chainItem!.docNo, cpsAfterCpsf!.docNo, 'Mã CPS chuẩn');
    assert.strictEqual(chainItem!.status, 'CLOSED', 'Trạng thái chuỗi chuẩn');
    console.log('  ✅ [PASS] Chuỗi 1-1-1 liên kết đầy đủ 4 đối tượng CPS + CPSR + CPST + CPSF');

    // =========================================================================
    // 2. Kiểm thử chuẩn hóa Technician và phân công công việc
    // =========================================================================
    console.log('--- 2. Kiểm thử chuẩn hóa Technician và API phân công ---');

    // 2.1 Tạo CPSR mới để kiểm tra phân công bằng trường technician
    const cpsrDoc2 = (await cpsrService.getNextCpsrDocNo()).docNo;
    await cpsrService.createCpsr({
      docNo: cpsrDoc2,
      reqDate: '2026-10-06',
      reqTime: '09:00',
      reqBy: 'Test Operator 2',
      printTech: 'Flexo',
      machineName: 'Mark Andy',
      problem: 'Sensor misalignment',
    });
    const cps2 = dbService.getCpsByCpsrDocNo(cpsrDoc2);
    assert.ok(cps2);

    // Gửi phân công với trường technician
    const assignRes = await fetch(`${baseUrl}/api/cps/${cps2!.docNo}/assign`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        technician: 'Technician Hoàng Gia Huy',
        deadline: '2026-10-07T12:00:00.000Z',
        priority: 'Hỗ trợ ngay',
        notes: 'Kiểm tra cảm biến và thay thế nếu hỏng',
      }),
    });
    assert.strictEqual(assignRes.status, 201, 'Assign CPS trả về 201 Created');
    const assignedData = await assignRes.json();
    assert.strictEqual(assignedData.technician, 'Technician Hoàng Gia Huy', 'Trường technician phản hồi đúng');
    assert.strictEqual(assignedData.assignedTo, 'Technician Hoàng Gia Huy', 'assignedTo đồng bộ với technician');
    assert.strictEqual(assignedData.status, 'IN_PROGRESS', 'Trạng thái chuyển thành IN_PROGRESS');
    console.log(`  ✅ [PASS] Phân công qua trường technician thành công: ${assignedData.technician}`);

    // Kiểm tra tìm kiếm qua query technician
    const filterRes = await fetch(`${baseUrl}/api/cps?technician=Hoàng Gia Huy`, {
      headers,
    });
    assert.strictEqual(filterRes.status, 200);
    const filterData = await filterRes.json();
    assert.ok(filterData.some((r: any) => r.docNo === cps2!.docNo), 'Tìm kiếm theo technician trả về đúng phiếu');
    console.log('  ✅ [PASS] Lọc phiếu qua query param technician hoạt động chính xác');

    // =========================================================================
    // 3. Kiểm thử hiệu năng cache và loại bỏ tính toán thừa
    // =========================================================================
    console.log('--- 3. Kiểm thử hiệu năng và cơ chế In-Memory Enrichment Cache ---');

    // Kiểm tra cache hit: 1000 lượt gọi getCpsList()
    const t0 = Date.now();
    for (let i = 0; i < 1000; i++) {
      dbService.getCpsList();
    }
    const elapsedCps = Date.now() - t0;
    assert.ok(elapsedCps < 100, `1000 lần gọi getCpsList() phải dưới 100ms (thực tế: ${elapsedCps}ms)`);
    console.log(`  ✅ [PASS] 1000 lần đọc getCpsList() hoàn thành trong ${elapsedCps}ms (siêu tốc nhờ cache)`);

    // Kiểm tra cache hit: 1000 lượt gọi getCpsrChainList()
    const t1 = Date.now();
    for (let i = 0; i < 1000; i++) {
      dbService.getCpsrChainList();
    }
    const elapsedChain = Date.now() - t1;
    assert.ok(elapsedChain < 100, `1000 lần gọi getCpsrChainList() phải dưới 100ms (thực tế: ${elapsedChain}ms)`);
    console.log(`  ✅ [PASS] 1000 lần đọc getCpsrChainList() hoàn thành trong ${elapsedChain}ms (siêu tốc nhờ cache)`);

    // Kiểm tra Invalidation khi cập nhật
    await cpsService.updateCps(cps2!.docNo, { notes: 'Updated notes test cache invalidation' });
    const freshCps = dbService.getCpsByIdOrDocNo(cps2!.docNo);
    assert.strictEqual(freshCps!.notes, 'Updated notes test cache invalidation', 'Cache bị invalidate và dữ liệu mới được nạp chuẩn xác');
    console.log('  ✅ [PASS] Cache Invalidation hoạt động chính xác khi có mutation');

    // Dọn dẹp dữ liệu kiểm thử
    await dbService.deleteCpsr(cpsr.id);
    await dbService.deleteCpsr(cpsrDoc2);

    console.log('\n🎉 TOÀN BỘ KIỂM THỬ TỐI ƯU BACKEND & CHUỖI PHIẾU ĐÃ VƯỢT QUA 100%!');
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  runBackendPerfAndChainTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Kiểm thử thất bại:', err);
      process.exit(1);
    });
}
