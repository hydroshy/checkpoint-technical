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
    // 1. Initial form status should be true by default
    const resStatus1 = await fetch(`${baseUrl}/api/public/form-status`);
    assert.strictEqual(resStatus1.status, 200, 'form-status should return 200');
    const dataStatus1 = await resStatus1.json();
    console.log('   ✓ GET /api/public/form-status (initial default enabled):', dataStatus1);
    assert.strictEqual(dataStatus1.enabled, true);
    assert.strictEqual(dataStatus1.isPublicFormEnabled, true);

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

    const resLookup = await fetch(`${baseUrl}/api/public/lookup-options`);
    assert.strictEqual(resLookup.status, 200);
    const lookupData = await resLookup.json();
    assert.ok(Array.isArray(lookupData));
    console.log(`   ✓ GET /api/public/lookup-options returned ${lookupData.length} options`);

    // 3. Login as admin
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

    // 4. Submit technical request while enabled -> 201 Created (no token!)
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

    // 5. Disable public form via PUT /api/settings/public-form with admin token
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

    // 6. Verify unauthenticated form status reflects disabled
    const resStatusDisabled = await fetch(`${baseUrl}/api/public/form-status`);
    const dataStatusDisabled = await resStatusDisabled.json();
    assert.strictEqual(dataStatusDisabled.enabled, false);
    assert.strictEqual(dataStatusDisabled.isPublicFormEnabled, false);
    console.log('   ✓ GET /api/public/form-status without auth is disabled (enabled: false)');

    // 7. Verify authenticated admin form status reflects BYPASS (enabled: true, bypass: true)
    const resStatusAdmin = await fetch(`${baseUrl}/api/public/form-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dataStatusAdmin = await resStatusAdmin.json();
    assert.strictEqual(dataStatusAdmin.enabled, true, 'Admin should have access even when public is disabled');
    assert.strictEqual(dataStatusAdmin.isPublicFormEnabled, false);
    assert.strictEqual(dataStatusAdmin.bypass, true);
    assert.strictEqual(dataStatusAdmin.authenticated, true);
    console.log('   ✓ GET /api/public/form-status with admin token bypasses lock (enabled: true, bypass: true)');

    // 8. Submit technical request while disabled without auth -> 403 Forbidden
    const resPostDisabled = await fetch(`${baseUrl}/api/public/technical-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqPayload),
    });
    assert.strictEqual(resPostDisabled.status, 403, 'POST should return 403 when public is disabled and no token');
    console.log('   ✓ POST /api/public/technical-requests returned 403 for guest when disabled');

    // 9. Submit technical request while disabled WITH admin token -> 201 Created (Bypass!)
    const resPostAdminBypass = await fetch(`${baseUrl}/api/public/technical-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqPayload),
    });
    assert.strictEqual(resPostAdminBypass.status, 201, 'POST with admin token should bypass lock');
    const adminCreatedReq = await resPostAdminBypass.json();
    assert.strictEqual(adminCreatedReq.createdBy, 'admin');
    console.log('   ✓ POST /api/public/technical-requests succeeded with admin token bypass (createdBy: admin)');

    // 10. Re-enable public form via PUT /api/settings/public-form to keep default state true
    const resPutReenabled = await fetch(`${baseUrl}/api/settings/public-form`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublicFormEnabled: true }),
    });
    assert.strictEqual(resPutReenabled.status, 200);
    const putReenabledData = await resPutReenabled.json();
    assert.strictEqual(putReenabledData.isPublicFormEnabled, true);
    console.log('   ✓ Re-enabled public form (default state = true)');

    console.log('🎉 ALL HTTP E2E tests passed cleanly!');
  } finally {
    await app.close();
  }
}

testHttpEndpoints().catch((err) => {
  console.error('❌ E2E Test failed:', err);
  process.exit(1);
});
