import * as assert from 'assert';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function testHttpEndpoints() {
  console.log('Starting NestJS HTTP E2E tests on port 3999...');
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
  await app.listen(3999);

  const baseUrl = 'http://localhost:3999';

  try {
    // 1. Initial form status should be false
    const resStatus1 = await fetch(`${baseUrl}/api/public/form-status`);
    assert.strictEqual(resStatus1.status, 200, 'form-status should return 200');
    const dataStatus1 = await resStatus1.json();
    console.log('   ✓ GET /api/public/form-status:', dataStatus1);
    assert.strictEqual(dataStatus1.enabled, false);

    // 2. Catalogs public endpoints
    const resMachines = await fetch(`${baseUrl}/api/public/machines`);
    assert.strictEqual(resMachines.status, 200);
    const machinesData = await resMachines.json();
    assert.ok(Array.isArray(machinesData) && machinesData.length > 0);
    console.log(`   ✓ GET /api/public/machines returned ${machinesData.length} machines`);

    const resGrouped = await fetch(`${baseUrl}/api/public/machines/grouped`);
    assert.strictEqual(resGrouped.status, 200);
    const groupedData = await resGrouped.json();
    assert.ok(typeof groupedData === 'object');
    console.log('   ✓ GET /api/public/machines/grouped returned keys:', Object.keys(groupedData));

    const resEmployees = await fetch(`${baseUrl}/api/public/employees`);
    assert.strictEqual(resEmployees.status, 200);
    const employeesData = await resEmployees.json();
    assert.ok(Array.isArray(employeesData) && employeesData.length > 0);
    console.log(`   ✓ GET /api/public/employees returned ${employeesData.length} employees`);

    const resHierarchy = await fetch(`${baseUrl}/api/public/employees/hierarchy`);
    assert.strictEqual(resHierarchy.status, 200);
    const hierarchyData = await resHierarchy.json();
    assert.ok(typeof hierarchyData === 'object');
    console.log('   ✓ GET /api/public/employees/hierarchy returned departments:', Object.keys(hierarchyData));

    const resCatalogs = await fetch(`${baseUrl}/api/public/catalogs`);
    assert.strictEqual(resCatalogs.status, 200);
    const catalogsData = await resCatalogs.json();
    assert.ok(catalogsData.machines && catalogsData.employees);
    console.log('   ✓ GET /api/public/catalogs verified');

    // 3. Submit technical request while disabled -> 403
    const reqPayload = {
      reqDate: '2026-10-04',
      reqTime: '15:45',
      reqBy: 'Lê Minh Hoàng - VN5117',
      printTech: 'OFFSET',
      machineName: 'SM 52',
      problem: 'Lỗi cấp phôi tự động',
      priority: 'Immediate',
      machineStatus: 'First Bulk Print',
    };

    const resPostDisabled = await fetch(`${baseUrl}/api/public/technical-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqPayload),
    });
    assert.strictEqual(resPostDisabled.status, 403, 'POST should return 403 when public is disabled');
    console.log('   ✓ POST /api/public/technical-requests returned 403 when disabled');

    // 4. PUT /api/settings/public-form without auth -> 401
    const resPutNoAuth = await fetch(`${baseUrl}/api/settings/public-form`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublicFormEnabled: true }),
    });
    assert.strictEqual(resPutNoAuth.status, 401, 'PUT settings without auth must be 401');
    console.log('   ✓ PUT /api/settings/public-form correctly blocked with 401 without auth');

    // 5. Login as admin
    const resLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'admin', password: 'Checkpoint@123' }),
    });
    assert.ok(resLogin.status === 200 || resLogin.status === 201, 'Login admin should succeed');
    const loginData = await resLogin.json();
    const token = loginData.access_token || loginData.accessToken || loginData.token;
    assert.ok(token, 'Access token should be returned');
    console.log('   ✓ Admin login successful');

    // 6. Enable public form via PUT /api/settings/public-form with token
    const resPutEnabled = await fetch(`${baseUrl}/api/settings/public-form`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublicFormEnabled: true }),
    });
    assert.strictEqual(resPutEnabled.status, 200, 'PUT settings with admin auth must be 200');
    const putData = await resPutEnabled.json();
    assert.strictEqual(putData.success, true);
    assert.strictEqual(putData.isPublicFormEnabled, true);
    console.log('   ✓ PUT /api/settings/public-form enabled successfully by admin:', putData);

    // 7. Verify GET /api/public/form-status is now true
    const resStatus2 = await fetch(`${baseUrl}/api/public/form-status`);
    const dataStatus2 = await resStatus2.json();
    assert.strictEqual(dataStatus2.enabled, true);
    assert.strictEqual(dataStatus2.isPublicFormEnabled, true);
    console.log('   ✓ GET /api/public/form-status reflects enabled state');

    // 8. Submit technical request while enabled -> 201 Created (no token!)
    const resPostEnabled = await fetch(`${baseUrl}/api/public/technical-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqPayload),
    });
    assert.strictEqual(resPostEnabled.status, 201, 'POST should return 201 when public is enabled');
    const createdReq = await resPostEnabled.json();
    assert.ok(createdReq.id);
    assert.ok(createdReq.docNo);
    assert.strictEqual(createdReq.createdBy, 'public');
    console.log(`   ✓ POST /api/public/technical-requests created request ${createdReq.docNo} (createdBy: ${createdReq.createdBy})`);

    // 9. Disable public form via PUT /api/settings/public-form
    const resPutDisabled = await fetch(`${baseUrl}/api/settings/public-form`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublicFormEnabled: false }),
    });
    assert.strictEqual(resPutDisabled.status, 200);
    const putDisabledData = await resPutDisabled.json();
    assert.strictEqual(putDisabledData.isPublicFormEnabled, false);
    console.log('   ✓ PUT /api/settings/public-form disabled successfully by admin');

    // 10. Verify POST is blocked again
    const resPostBlockedAgain = await fetch(`${baseUrl}/api/public/technical-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqPayload),
    });
    assert.strictEqual(resPostBlockedAgain.status, 403);
    console.log('   ✓ POST /api/public/technical-requests blocked again with 403');

    console.log('🎉 ALL HTTP E2E tests passed cleanly!');
  } finally {
    await app.close();
  }
}

testHttpEndpoints().catch((err) => {
  console.error('❌ E2E Test failed:', err);
  process.exit(1);
});
