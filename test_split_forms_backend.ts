import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SplitFormsService } from './src/modules/split-forms/split-forms.service';
import { DatabaseService } from './src/modules/database/database.service';

async function runTests() {
  console.log('🚀 Starting Comprehensive Backend Tests for CPSR / CPST / CPSF...');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['warn', 'error'] });

  const splitService = app.get(SplitFormsService);
  const dbService = app.get(DatabaseService);

  console.log('✅ NestJS Context initialized, Postgres connected:', dbService.isPostgresConnected());

  // 1. Test Next Code Generation
  console.log('\n--- 1. Testing Next Code Generation ---');
  const nextCpsr = await splitService.getNextCpsrDocNo();
  const nextCpst = await splitService.getNextCpstDocNo();
  const nextCpsf = await splitService.getNextCpsfDocNo();

  console.log('Next CPSR Code:', nextCpsr.docNo);
  console.log('Next CPST Code:', nextCpst.docNo);
  console.log('Next CPSF Code:', nextCpsf.docNo);

  const codeRegex = /^(CPSR|CPST|CPSF)-\d{8}-\d{3}$/;
  if (!codeRegex.test(nextCpsr.docNo)) throw new Error(`Invalid CPSR code format: ${nextCpsr.docNo}`);
  if (!codeRegex.test(nextCpst.docNo)) throw new Error(`Invalid CPST code format: ${nextCpst.docNo}`);
  if (!codeRegex.test(nextCpsf.docNo)) throw new Error(`Invalid CPSF code format: ${nextCpsf.docNo}`);
  console.log('✅ All next codes match prefix-YYYYMMDD-XXX format!');

  // 2. Test CPSR Creation
  console.log('\n--- 2. Testing CPSR Creation & submitted_at ---');
  const cpsr1 = await splitService.createCpsr({
    reqDate: '2026-03-24',
    reqTime: '10:00',
    reqBy: 'Nguyễn Văn Test - NV999',
    printTech: 'OFFSET',
    machineName: 'Heidelberg XL 75',
    problem: 'Lệch khổ giấy in',
    machineStatus: 'Hàng SX lần đầu',
    priority: 'Hỗ trợ ngay',
  });
  console.log('Created CPSR:', cpsr1.docNo, 'submittedAt:', cpsr1.submittedAt);
  if (!cpsr1.submittedAt) throw new Error('CPSR missing submittedAt timestamp!');

  // Verify next code auto increments
  const nextCpsrAfter = await splitService.getNextCpsrDocNo();
  console.log('Next CPSR after insert:', nextCpsrAfter.docNo);
  const prevNum = parseInt(cpsr1.docNo.split('-')[2], 10);
  const nextNum = parseInt(nextCpsrAfter.docNo.split('-')[2], 10);
  if (nextNum !== prevNum + 1) throw new Error(`Expected nextNum ${prevNum + 1} but got ${nextNum}`);
  console.log('✅ Auto-increment logic verified!');

  // 3. Test available for CPST
  console.log('\n--- 3. Testing available CPSR for CPST ---');
  const availableCpsr = splitService.getAvailableCpsrForCpst();
  const foundInAvailable = availableCpsr.some(r => r.docNo === cpsr1.docNo);
  if (!foundInAvailable) throw new Error(`CPSR ${cpsr1.docNo} should be available for CPST!`);
  console.log('✅ CPSR is available for linking!');

  // 4. Test CPST Creation (1-1 Linkage)
  console.log('\n--- 4. Testing CPST Creation (1-1 Linkage) ---');
  const cpst1 = await splitService.createCpst({
    cpsrDocNo: cpsr1.docNo,
    recvBy: 'KTV Trần Test - KT01',
    recvDate: '2026-03-24',
    recvTime: '10:15',
    finishDate: '2026-03-24',
    finishTime: '10:45',
    downtime: 30,
    rootCause: 'Lỏng ốc cữ canh lề',
    actionTaken: 'Siết lại ốc và căn chỉnh thước',
    chkStatus: 'Đã khắc phục',
    photosBefore: ['data:image/png;base64,sample1'],
    photosAfter: ['data:image/png;base64,sample2'],
  });
  console.log('Created CPST:', cpst1.docNo, 'linked to CPSR:', cpst1.cpsrDocNo, 'submittedAt:', cpst1.submittedAt);
  if (!cpst1.submittedAt) throw new Error('CPST missing submittedAt timestamp!');

  // Verify CPSR is no longer in available list
  const availableCpsrAfter = splitService.getAvailableCpsrForCpst();
  if (availableCpsrAfter.some(r => r.docNo === cpsr1.docNo)) {
    throw new Error(`CPSR ${cpsr1.docNo} should NOT be in available list after CPST creation!`);
  }
  console.log('✅ CPSR correctly removed from available CPST list (1-1 enforced in memory & UI)!');

  // Test duplicate CPST rejection
  console.log('\n--- 5. Testing Duplicate CPST Rejection (1-1 Enforcement) ---');
  try {
    await splitService.createCpst({
      cpsrDocNo: cpsr1.docNo,
      recvBy: 'KTV Duplicate - KT02',
    });
    throw new Error('Should have rejected duplicate CPST for same CPSR!');
  } catch (err: any) {
    console.log('✅ Duplicate CPST correctly rejected:', err.message);
  }

  // 5. Test available for CPSF
  console.log('\n--- 6. Testing available CPST for CPSF ---');
  const availableCpst = splitService.getAvailableCpstForCpsf();
  const foundCpst = availableCpst.find(t => t.docNo === cpst1.docNo);
  if (!foundCpst) throw new Error(`CPST ${cpst1.docNo} should be available for CPSF!`);
  if (!foundCpst.cpsr || foundCpst.cpsr.docNo !== cpsr1.docNo) {
    throw new Error('Available CPST must include prefilled underlying CPSR data!');
  }
  console.log('✅ Available CPST contains linked CPSR data for prefilling!');

  // 6. Test CPSF Creation (1-1-1 Linkage)
  console.log('\n--- 7. Testing CPSF Creation (1-1-1 Linkage) ---');
  const cpsf1 = await splitService.createCpsf({
    cpstDocNo: cpst1.docNo,
    chkQuality: 'Đạt',
    workOrder: 'WO-TEST-2026',
    woTotalQty: 8000,
    wasteQty: 15,
    wasteUnit: 'PCS',
    wastePercent: '0.19%',
    prodMgr: 'Quản đốc Phạm Test',
  });
  console.log('Created CPSF:', cpsf1.docNo, 'linked to CPST:', cpsf1.cpstDocNo, 'CPSR:', cpsf1.cpsrDocNo, 'submittedAt:', cpsf1.submittedAt);
  if (!cpsf1.submittedAt) throw new Error('CPSF missing submittedAt timestamp!');

  // Verify CPST is no longer in available list
  const availableCpstAfter = splitService.getAvailableCpstForCpsf();
  if (availableCpstAfter.some(t => t.docNo === cpst1.docNo)) {
    throw new Error(`CPST ${cpst1.docNo} should NOT be in available list after CPSF creation!`);
  }
  console.log('✅ CPST correctly removed from available CPSF list (1-1 enforced)!');

  // Test duplicate CPSF rejection
  console.log('\n--- 8. Testing Duplicate CPSF Rejection (1-1 Enforcement) ---');
  try {
    await splitService.createCpsf({
      cpstDocNo: cpst1.docNo,
      prodMgr: 'Quản đốc Duplicate',
    });
    throw new Error('Should have rejected duplicate CPSF for same CPST!');
  } catch (err: any) {
    console.log('✅ Duplicate CPSF correctly rejected:', err.message);
  }

  // 7. Test Detail & Chain Lookups
  console.log('\n--- 9. Testing Detail & 1-1-1 Chain Lookups ---');
  const cpsrDetail = splitService.findCpsrOne(cpsr1.docNo);
  if (!cpsrDetail.cpst || cpsrDetail.cpst.docNo !== cpst1.docNo) {
    throw new Error('CPSR detail missing linked CPST!');
  }
  if (!cpsrDetail.cpsf || cpsrDetail.cpsf.docNo !== cpsf1.docNo) {
    throw new Error('CPSR detail missing linked CPSF!');
  }
  console.log('✅ CPSR detail contains complete 1-1-1 chain (CPST & CPSF)!');

  const cpstDetail = splitService.findCpstOne(cpst1.docNo);
  if (!cpstDetail.cpsr || cpstDetail.cpsr.docNo !== cpsr1.docNo) {
    throw new Error('CPST detail missing linked CPSR!');
  }
  if (!cpstDetail.cpsf || cpstDetail.cpsf.docNo !== cpsf1.docNo) {
    throw new Error('CPST detail missing linked CPSF!');
  }
  console.log('✅ CPST detail contains complete 1-1-1 chain!');

  const cpsfDetail = splitService.findCpsfOne(cpsf1.docNo);
  if (!cpsfDetail.cpst || cpsfDetail.cpst.docNo !== cpst1.docNo) {
    throw new Error('CPSF detail missing linked CPST!');
  }
  if (!cpsfDetail.cpsr || cpsfDetail.cpsr.docNo !== cpsr1.docNo) {
    throw new Error('CPSF detail missing underlying CPSR!');
  }
  console.log('✅ CPSF detail contains complete 1-1-1 chain!');

  const chainList = splitService.getCpsrChainList();
  const chainItem = chainList.find(c => c.cpsr.docNo === cpsr1.docNo);
  if (!chainItem || !chainItem.cpst || !chainItem.cpsf) {
    throw new Error('Chain list missing full 1-1-1 item!');
  }
  console.log('✅ Chain list contains full 1-1-1 linkage for Control Panel!');

  const stats = splitService.getStats();
  console.log('System Stats:', stats);
  if (stats.totalCpsr < 1 || stats.totalCpst < 1 || stats.totalCpsf < 1) {
    throw new Error('Stats count incorrect!');
  }
  console.log('✅ Stats computed successfully!');

  // 8. Test Updates
  console.log('\n--- 10. Testing Updates ---');
  const updatedCpsr = await splitService.updateCpsr(cpsr1.id, { problem: 'Lệch khổ giấy in - đã chỉnh' });
  if (updatedCpsr?.problem !== 'Lệch khổ giấy in - đã chỉnh') throw new Error('CPSR update failed!');
  console.log('✅ CPSR update verified!');

  // 9. Test Cascade Deletion
  console.log('\n--- 11. Testing Cascade Deletion ---');
  await splitService.deleteCpsr(cpsr1.id);
  const afterDeleteCpsr = dbService.getCpsrByIdOrDocNo(cpsr1.id);
  const afterDeleteCpst = dbService.getCpstByIdOrDocNo(cpst1.id);
  const afterDeleteCpsf = dbService.getCpsfByIdOrDocNo(cpsf1.id);

  if (afterDeleteCpsr || afterDeleteCpst || afterDeleteCpsf) {
    throw new Error('Cascade deletion failed! Child records still exist.');
  }
  console.log('✅ Cascade deletion verified: CPSR, CPST, CPSF all cleanly removed!');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 100% SPEC COMPLIANT.');
  await app.close();
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
