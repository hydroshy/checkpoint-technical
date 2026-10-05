import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function testHttp() {
  console.log('🌐 Testing HTTP Endpoints via live server...');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  await app.listen(3399);

  const baseUrl = 'http://127.0.0.1:3399';

  try {
    // 1. Next codes
    const r1 = await fetch(`${baseUrl}/api/cpsr/next-code`).then(r => r.json());
    console.log('GET /api/cpsr/next-code:', r1);
    if (!r1.docNo || !r1.docNo.startsWith('CPSR-')) throw new Error('CPSR next-code HTTP failed');

    const r2 = await fetch(`${baseUrl}/api/cpst/next-code`).then(r => r.json());
    console.log('GET /api/cpst/next-code:', r2);
    if (!r2.docNo || !r2.docNo.startsWith('CPST-')) throw new Error('CPST next-code HTTP failed');

    const r3 = await fetch(`${baseUrl}/api/cpsf/next-code`).then(r => r.json());
    console.log('GET /api/cpsf/next-code:', r3);
    if (!r3.docNo || !r3.docNo.startsWith('CPSF-')) throw new Error('CPSF next-code HTTP failed');

    // 2. Create CPSR via HTTP
    const postCpsrRes = await fetch(`${baseUrl}/api/cpsr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reqDate: '2026-03-24',
        reqTime: '11:00',
        reqBy: 'HTTP Test User',
        printTech: 'DIGITAL',
        machineName: 'HP Indigo 12000',
        problem: 'Test problem via HTTP',
      }),
    });
    const createdCpsr = await postCpsrRes.json();
    console.log('POST /api/cpsr status:', postCpsrRes.status, 'docNo:', createdCpsr.docNo);
    if (postCpsrRes.status !== 201) throw new Error('Failed to create CPSR via HTTP');

    // 3. Available for CPST
    const availCpsr = await fetch(`${baseUrl}/api/cpsr/available-for-cpst`).then(r => r.json());
    console.log('GET /api/cpsr/available-for-cpst count:', availCpsr.length);
    if (!availCpsr.some((x: any) => x.docNo === createdCpsr.docNo)) {
      throw new Error('Created CPSR not in available-for-cpst list');
    }

    // 4. Create CPST via HTTP
    const postCpstRes = await fetch(`${baseUrl}/api/cpst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpsrDocNo: createdCpsr.docNo,
        recvBy: 'HTTP Technician',
        chkStatus: 'Đã khắc phục',
        actionTaken: 'Fixed via HTTP',
      }),
    });
    const createdCpst = await postCpstRes.json();
    console.log('POST /api/cpst status:', postCpstRes.status, 'docNo:', createdCpst.docNo);
    if (postCpstRes.status !== 201) throw new Error('Failed to create CPST via HTTP');

    // 5. Available for CPSF
    const availCpst = await fetch(`${baseUrl}/api/cpst/available-for-cpsf`).then(r => r.json());
    console.log('GET /api/cpst/available-for-cpsf count:', availCpst.length);
    if (!availCpst.some((x: any) => x.docNo === createdCpst.docNo)) {
      throw new Error('Created CPST not in available-for-cpsf list');
    }

    // 6. Create CPSF via HTTP
    const postCpsfRes = await fetch(`${baseUrl}/api/cpsf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpstDocNo: createdCpst.docNo,
        chkQuality: 'Đạt',
        workOrder: 'WO-HTTP-001',
        prodMgr: 'HTTP Production Manager',
      }),
    });
    const createdCpsf = await postCpsfRes.json();
    console.log('POST /api/cpsf status:', postCpsfRes.status, 'docNo:', createdCpsf.docNo);
    if (postCpsfRes.status !== 201) throw new Error('Failed to create CPSF via HTTP');

    // 7. Chain overview via HTTP
    const chainRes = await fetch(`${baseUrl}/api/cpsr-chain`).then(r => r.json());
    console.log('GET /api/cpsr-chain count:', chainRes.length);
    const item = chainRes.find((x: any) => x.cpsr.docNo === createdCpsr.docNo);
    if (!item || !item.cpst || !item.cpsf) {
      throw new Error('1-1-1 chain incomplete via HTTP');
    }
    console.log('Chain item verified:', {
      cpsr: item.cpsr.docNo,
      cpst: item.cpst.docNo,
      cpsf: item.cpsf.docNo,
    });

    // 8. Clean up
    await fetch(`${baseUrl}/api/cpsr/${createdCpsr.id}`, { method: 'DELETE' });
    console.log('Cleaned up test record via DELETE /api/cpsr/:id');

    console.log('🎉 ALL HTTP ENDPOINTS VERIFIED SUCCESSFULLY!');
  } finally {
    await app.close();
  }
}

testHttp().catch(err => {
  console.error('❌ HTTP test failed:', err);
  process.exit(1);
});
