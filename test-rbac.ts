import * as assert from 'assert';
import {
  getDefaultPermissions,
  normalizePermissions,
  DatabaseService,
} from './src/modules/database/database.service';
import { UsersService } from './src/modules/users/users.service';

async function runTests() {
  console.log('Testing RBAC logic...');

  // 1. Test getDefaultPermissions
  const adminPerms = getDefaultPermissions('ADMIN');
  assert.strictEqual(adminPerms.canCreateRequest, true);
  assert.strictEqual(adminPerms.canViewKpi, true);
  assert.strictEqual(adminPerms.canAccessControlPanel, true);

  const techPerms = getDefaultPermissions('TECHNICIAN');
  assert.strictEqual(techPerms.canCreateRequest, true);
  assert.strictEqual(techPerms.canViewKpi, true);
  assert.strictEqual(techPerms.canAccessControlPanel, false);

  const empPerms = getDefaultPermissions('EMPLOYEE');
  assert.strictEqual(empPerms.canCreateRequest, true);
  assert.strictEqual(empPerms.canViewKpi, false);
  assert.strictEqual(empPerms.canAccessControlPanel, false);

  // 2. Test normalizePermissions
  const custom = normalizePermissions('EMPLOYEE', { canViewKpi: true });
  assert.strictEqual(custom.canCreateRequest, true);
  assert.strictEqual(custom.canViewKpi, true);
  assert.strictEqual(custom.canAccessControlPanel, false);

  const snakeCase = normalizePermissions('EMPLOYEE', { can_create_request: false, can_view_kpi: true });
  assert.strictEqual(snakeCase.canCreateRequest, false);
  assert.strictEqual(snakeCase.canViewKpi, true);
  assert.strictEqual(snakeCase.canAccessControlPanel, false);

  // 3. Test DatabaseService and UsersService
  const dbService = new DatabaseService();
  dbService.loadAll();

  const users = dbService.getUsers();
  assert(users.length >= 3, 'Should load default users');
  const admin = users.find(u => u.username === 'admin');
  assert(admin, 'Admin should exist');
  assert.strictEqual(admin.permissions.canAccessControlPanel, true);
  assert.strictEqual(admin.permissions.canViewKpi, true);
  assert.strictEqual(admin.permissions.canCreateRequest, true);

  const tech = users.find(u => u.username === 'tech01');
  assert(tech, 'Tech should exist');
  assert.strictEqual(tech.permissions.canViewKpi, true);
  assert.strictEqual(tech.permissions.canAccessControlPanel, false);

  const emp = users.find(u => u.username === 'user01');
  assert(emp, 'Employee should exist');
  assert.strictEqual(emp.permissions.canViewKpi, false);
  assert.strictEqual(emp.permissions.canAccessControlPanel, false);

  // 4. Test UsersService
  const usersService = new UsersService(dbService);

  // Test create user with custom permissions
  const testUsername = 'test_user_' + Date.now();
  const created = await usersService.create({
    username: testUsername,
    role: 'EMPLOYEE',
    permissions: {
      canViewKpi: true,
      canCreateRequest: true,
      canAccessControlPanel: false,
    },
  });

  assert.strictEqual(created.username, testUsername);
  assert.strictEqual(created.permissions.canViewKpi, true);
  assert.strictEqual(created.permissions.canCreateRequest, true);
  assert.strictEqual(created.permissions.canAccessControlPanel, false);

  // Test updatePermissions
  const updatedPerms = await usersService.updatePermissions(created.id, {
    canAccessControlPanel: true,
  });
  assert.strictEqual(updatedPerms.permissions.canAccessControlPanel, true);
  assert.strictEqual(updatedPerms.permissions.canViewKpi, true);

  // Test update with nested permissions
  const updatedAll = await usersService.update(created.id, {
    fullName: 'Test User Full',
    permissions: {
      canViewKpi: false,
    },
  });
  assert.strictEqual(updatedAll.fullName, 'Test User Full');
  assert.strictEqual(updatedAll.permissions.canViewKpi, false);
  assert.strictEqual(updatedAll.permissions.canAccessControlPanel, true);

  // Clean up test user
  usersService.delete(created.id);
  const deleted = dbService.getUserById(created.id);
  assert.strictEqual(deleted, undefined);

  console.log('✅ All RBAC unit & service tests passed successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
