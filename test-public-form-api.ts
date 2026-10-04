import * as assert from 'assert';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from './src/modules/database/database.service';
import { SettingsService } from './src/modules/settings/settings.service';
import { SettingsController } from './src/modules/settings/settings.controller';
import { PublicController } from './src/modules/settings/public.controller';
import { MachinesService } from './src/modules/machines/machines.service';
import { EmployeesService } from './src/modules/employees/employees.service';
import { TechnicalRequestsService } from './src/modules/technical-requests/technical-requests.service';
import { ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function runTests() {
  console.log('Testing Public Form & Settings backend implementation...');

  // 1. Initialize DatabaseService
  const dbService = new DatabaseService();
  dbService.loadAll();

  // Test getSettings initial
  const initialSettings = dbService.getSettings();
  assert.ok(initialSettings !== undefined, 'Settings should be defined');
  console.log('   ✓ DatabaseService getSettings() loaded successfully');

  // Test updateSettings
  dbService.updateSettings({ isPublicFormEnabled: true }, 'admin');
  assert.strictEqual(dbService.getSettings().isPublicFormEnabled, true);
  dbService.updateSettings({ isPublicFormEnabled: false }, 'admin');
  assert.strictEqual(dbService.getSettings().isPublicFormEnabled, false);
  console.log('   ✓ DatabaseService updateSettings() works');

  // Test persistence to settings.json
  const settingsJsonPath = path.resolve('./data/settings.json');
  assert.ok(fs.existsSync(settingsJsonPath), 'settings.json should exist');
  const fileContent = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf-8'));
  assert.strictEqual(fileContent.isPublicFormEnabled, false);
  console.log('   ✓ Settings saved to settings.json properly');

  // 2. Test SettingsService
  const settingsService = new SettingsService(dbService);
  assert.strictEqual(settingsService.isPublicFormEnabled(), false);
  assert.deepStrictEqual(settingsService.getPublicFormStatus(), {
    enabled: false,
    isPublicFormEnabled: false,
  });

  const resSetTrue = settingsService.setPublicFormStatus(true, 'test-admin');
  assert.strictEqual(resSetTrue.success, true);
  assert.strictEqual(resSetTrue.enabled, true);
  assert.strictEqual(resSetTrue.isPublicFormEnabled, true);
  assert.strictEqual(settingsService.isPublicFormEnabled(), true);
  console.log('   ✓ SettingsService setPublicFormStatus() verified');

  // 3. Test SettingsController
  const settingsController = new SettingsController(settingsService);
  const adminUser = { username: 'admin', role: 'ADMIN' };

  const ctrlRes1 = settingsController.updatePublicFormStatus({ isPublicFormEnabled: false }, adminUser);
  assert.strictEqual(ctrlRes1.isPublicFormEnabled, false);

  const ctrlRes2 = settingsController.updatePublicFormStatus({ enabled: true }, adminUser);
  assert.strictEqual(ctrlRes2.isPublicFormEnabled, true);

  const ctrlRes3 = settingsController.getPublicFormStatus();
  assert.strictEqual(ctrlRes3.isPublicFormEnabled, true);
  assert.strictEqual(ctrlRes3.enabled, true);
  console.log('   ✓ SettingsController verified');

  // 4. Test Services for PublicController
  const machinesService = new MachinesService(dbService);
  const employeesService = new EmployeesService(dbService);
  const techRequestsService = new TechnicalRequestsService(dbService);

  const publicController = new PublicController(
    settingsService,
    machinesService,
    employeesService,
    techRequestsService,
  );

  // 4.1 Check form-status endpoint
  const statusRes = publicController.getFormStatus();
  assert.strictEqual(statusRes.isPublicFormEnabled, true);
  assert.strictEqual(statusRes.enabled, true);
  console.log('   ✓ PublicController getFormStatus() returns expected payload');

  // 4.2 Check catalogs
  const machines = publicController.getMachines();
  assert.ok(Array.isArray(machines) && machines.length > 0, 'Machines list should not be empty');

  const grouped = publicController.getMachinesGrouped();
  assert.ok(typeof grouped === 'object' && Object.keys(grouped).length > 0, 'Grouped machines should not be empty');

  const employees = publicController.getEmployees();
  assert.ok(Array.isArray(employees) && employees.length > 0, 'Employees list should not be empty');

  const hierarchy = publicController.getEmployeeHierarchy();
  assert.ok(typeof hierarchy === 'object' && Object.keys(hierarchy).length > 0, 'Hierarchy should not be empty');

  const catalogs = publicController.getCatalogs();
  assert.ok(catalogs.machines.length > 0, 'Catalogs.machines should match');
  assert.ok(catalogs.employees.length > 0, 'Catalogs.employees should match');
  console.log('   ✓ PublicController catalogs endpoints (machines, grouped, employees, hierarchy) verified');

  // 4.3 Submit technical request when public is enabled
  const validPayload = {
    reqDate: '2026-10-04',
    reqTime: '15:30',
    reqBy: 'Trần Văn Public - VN9999',
    printTech: 'OFFSET',
    machineName: 'SM 52',
    problem: 'Public test request issue',
    priority: 'Immediate',
    machineStatus: 'First Bulk Print',
    chkStatus: 'SUPPORT',
    chkQuality: 'OK',
  };

  const createdReq = await publicController.createPublicTechnicalRequest(validPayload as any);
  assert.ok(createdReq.id, 'Created request should have ID');
  assert.ok(createdReq.docNo, 'Created request should have docNo');
  assert.strictEqual(createdReq.createdBy, 'public', 'CreatedBy should be public');
  assert.strictEqual(createdReq.reqBy, validPayload.reqBy);
  assert.strictEqual(createdReq.problem, validPayload.problem);
  console.log('   ✓ PublicController createPublicTechnicalRequest() success when public is enabled');

  // 4.4 Submit technical request when public is DISABLED
  settingsService.setPublicFormStatus(false, 'admin');
  assert.strictEqual(settingsService.isPublicFormEnabled(), false);

  let forbiddenCaught = false;
  try {
    await publicController.createPublicTechnicalRequest(validPayload as any);
  } catch (err: any) {
    if (err instanceof ForbiddenException) {
      forbiddenCaught = true;
    }
  }
  assert.strictEqual(forbiddenCaught, true, 'Should throw ForbiddenException when public form is disabled');
  console.log('   ✓ PublicController rejects POST with 403 Forbidden when public form is disabled');

  // 4.5 Token bypass test when public form is DISABLED
  const secret = process.env.JWT_SECRET || 'Checkpoint_Systems_Technical_Key_2026_Secure!';
  const adminToken = jwt.sign({ sub: 'user-admin-1', username: 'admin', role: 'ADMIN' }, secret);
  const empToken = jwt.sign({ sub: 'user-emp-1', username: 'user01', role: 'EMPLOYEE' }, secret);

  // 4.5.1 form-status with admin token should allow access and indicate bypass
  const adminStatusRes = publicController.getFormStatus({
    headers: { authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminStatusRes.canAccess, true);
  assert.strictEqual(adminStatusRes.enabled, true);
  assert.strictEqual(adminStatusRes.isPublicFormEnabled, false);
  assert.strictEqual(adminStatusRes.bypass, true);
  assert.strictEqual(adminStatusRes.authenticated, true);
  assert.strictEqual(adminStatusRes.user?.username, 'admin');
  console.log('   ✓ PublicController getFormStatus() allows bypass with admin token');

  // 4.5.2 POST with admin token bypasses restriction
  const adminReq = await publicController.createPublicTechnicalRequest(validPayload as any, {
    headers: { authorization: `Bearer ${adminToken}` }
  });
  assert.ok(adminReq.id);
  assert.strictEqual(adminReq.createdBy, 'admin');
  console.log('   ✓ PublicController createPublicTechnicalRequest() succeeds with admin token bypass');

  // 4.5.3 POST with employee token in cookies bypasses restriction
  const empReq = await publicController.createPublicTechnicalRequest(validPayload as any, {
    cookies: { checkpoint_token: empToken }
  });
  assert.ok(empReq.id);
  assert.strictEqual(empReq.createdBy, 'user01');
  console.log('   ✓ PublicController createPublicTechnicalRequest() succeeds with employee cookie bypass');

  // 4.6 Catalogs and lookup options check
  const lookupRes = publicController.getLookupOptions();
  assert.ok(Array.isArray(lookupRes), 'lookupOptions should be an array');
  const catalogsWithLookup = publicController.getCatalogs();
  assert.ok(Array.isArray(catalogsWithLookup.lookupOptions), 'catalogs should include lookupOptions');
  console.log('   ✓ PublicController lookup-options and catalogs verified');

  // 4.7 Restore public form to enabled (default state = true)
  settingsService.setPublicFormStatus(true, 'system');
  assert.strictEqual(settingsService.isPublicFormEnabled(), true);
  const finalSettings = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf-8'));
  assert.strictEqual(finalSettings.isPublicFormEnabled, true);
  console.log('   ✓ Settings restored to default isPublicFormEnabled=true');

  console.log('✅ All Public Form & Settings tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
