import * as assert from 'assert';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import { AppModule } from '../src/app.module';
import {
  getDefaultPermissions,
  normalizePermissions,
  DatabaseService,
} from '../src/modules/database/database.service';
import { UsersService } from '../src/modules/users/users.service';

function httpRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<{ status: number; body: string; json?: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const method = options.method || 'GET';
    const headers = { ...(options.headers || {}) };
    let payload: string | null = null;

    if (options.body) {
      payload = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
      headers['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let json: any = undefined;
          try {
            json = JSON.parse(raw);
          } catch (_) {}
          resolve({
            status: res.statusCode || 200,
            body: raw,
            json,
            headers: res.headers,
          });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN RBAC VÀ QUẢN LÝ TÀI KHOẢN/MẬT KHẨU');
  console.log('================================================================\n');

  // --- 1. Test Unit getDefaultPermissions & normalizePermissions ---
  console.log('--- 1. Kiểm tra Unit Logic getDefaultPermissions & normalizePermissions ---');
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

  const custom = normalizePermissions('EMPLOYEE', { canViewKpi: true });
  assert.strictEqual(custom.canCreateRequest, true);
  assert.strictEqual(custom.canViewKpi, true);
  assert.strictEqual(custom.canAccessControlPanel, false);

  console.log('  ✅ [PASS] Phân quyền mặc định và normalizePermissions hoạt động chuẩn xác');

  // --- 2. Test DatabaseService & UsersService Unit ---
  console.log('\n--- 2. Kiểm tra DatabaseService & UsersService Unit ---');
  const dbService = new DatabaseService();
  dbService.loadAll();

  const users = dbService.getUsers();
  assert(users.length >= 3, 'Should load default users');
  const adminUser = users.find((u) => u.username === 'admin');
  assert(adminUser, 'Admin should exist');
  assert.strictEqual(adminUser.role, 'ADMIN');

  const empUser = users.find((u) => u.username === 'user01');
  assert(empUser, 'Employee user01 should exist');
  assert.strictEqual(empUser.role, 'EMPLOYEE');

  const techUser = users.find((u) => u.username === 'tech01');
  assert(techUser, 'Technician tech01 should exist');
  assert.strictEqual(techUser.role, 'TECHNICIAN');

  console.log('  ✅ [PASS] Đã nạp đầy đủ danh sách tài khoản hệ thống (admin, tech01, user01)');

  // --- 3. Khởi động E2E Test Server ---
  console.log('\n--- 3. Khởi động Test Server NestJS ---');
  const testPort = 3396;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error'],
  });
  app.use(cookieParser());
  await app.listen(testPort);
  console.log(`  ✅ Test server running on http://127.0.0.1:${testPort}`);

  try {
    const baseUrl = `http://127.0.0.1:${testPort}`;
    const db = app.get(DatabaseService);
    // Ensure clean state for tech01 and user01
    const techDbUser = db.getUserByUsername('tech01');
    if (techDbUser) {
      db.updateUser(techDbUser.id, {
        permissions: { canCreateRequest: true, canViewKpi: true, canAccessControlPanel: false },
      });
    }
    const empDbUser = db.getUserByUsername('user01');
    if (empDbUser) {
      const defaultHash = '$2a$10$d883mgjdQ8gjFw53m1SnRu0LVdyrH1r9ZGf1Ao3lvDgp2hqCI/YAW';
      db.updateUser(empDbUser.id, {
        passwordHash: defaultHash,
        permissions: { canCreateRequest: true, canViewKpi: false, canAccessControlPanel: false },
      });
    }

    // --- 4. Đăng nhập lấy JWT tokens ---
    console.log('\n--- 4. Kiểm tra Đăng nhập & Tạo Token phiên làm việc ---');
    const adminLoginRes = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'admin', password: 'Checkpoint@123' },
    });
    assert.strictEqual(adminLoginRes.status, 201);
    const adminToken = adminLoginRes.json.access_token;
    assert.ok(adminToken, 'Admin token được sinh thành công');

    const empLoginRes = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(empLoginRes.status, 201);
    const empToken = empLoginRes.json.access_token;
    assert.ok(empToken, 'Employee user01 token được sinh thành công');

    const techLoginRes = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'tech01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(techLoginRes.status, 201);
    const techToken = techLoginRes.json.access_token;
    assert.ok(techToken, 'Technician tech01 token được sinh thành công');

    console.log('  ✅ [PASS] Đăng nhập thành công cho cả 3 vai trò: Admin, Technician, Employee');

    // --- 5. Kiểm thử RBAC: Chặn EMPLOYEE truy cập GET /control-panel ---
    console.log('\n--- 5. Kiểm tra RBAC Route GET /control-panel ---');
    // 5.1 Employee truy cập /control-panel qua Cookie
    const empCpCookieRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${empToken}` },
    });
    assert.strictEqual(empCpCookieRes.status, 302, 'Employee bị từ chối và redirect 302');
    assert.ok(
      empCpCookieRes.headers.location?.includes('/dashboard?error=access_denied'),
      'Employee bị chuyển hướng về /dashboard?error=access_denied'
    );
    console.log('  ✅ [PASS] Quyền EMPLOYEE truy cập qua Cookie bị chặn và redirect về Dashboard');

    // 5.2 Employee truy cập /control-panel qua Query Token
    const empCpQueryRes = await httpRequest(`${baseUrl}/control-panel?token=${empToken}`);
    assert.strictEqual(empCpQueryRes.status, 302);
    assert.ok(empCpQueryRes.headers.location?.includes('/dashboard?error=access_denied'));
    console.log('  ✅ [PASS] Quyền EMPLOYEE truy cập qua Query Token bị chặn và redirect về Dashboard');

    // 5.3 Technician chưa cấp quyền truy cập /control-panel
    const techCpRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${techToken}` },
    });
    assert.strictEqual(techCpRes.status, 302);
    assert.ok(techCpRes.headers.location?.includes('/dashboard?error=access_denied'));
    console.log('  ✅ [PASS] Technician chưa có quyền canAccessControlPanel bị chặn truy cập');

    // 5.4 Admin truy cập /control-panel
    const adminCpRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${adminToken}` },
    });
    assert.strictEqual(adminCpRes.status, 200, 'Admin truy cập /control-panel trả về HTTP 200');
    assert.ok(adminCpRes.body.includes('Quản Lý Phiếu Kỹ Thuật'), 'Nội dung Control Panel tải thành công cho Admin');
    console.log('  ✅ [PASS] Admin truy cập hợp lệ thành công (HTTP 200)');

    // --- 6. Kiểm thử RBAC: Chặn EMPLOYEE truy cập API /api/control-panel/* ---
    console.log('\n--- 6. Kiểm tra RBAC API /api/control-panel/* ---');
    // 6.1 Employee gọi /api/control-panel/init-data
    const empInitDataRes = await httpRequest(`${baseUrl}/api/control-panel/init-data`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    assert.strictEqual(empInitDataRes.status, 403, 'Employee gọi init-data bị từ chối 403 Forbidden');
    console.log('  ✅ [PASS] Quyền EMPLOYEE gọi GET /api/control-panel/init-data bị trả về 403 Forbidden');

    // 6.2 Employee gọi /api/control-panel/stats
    const empStatsRes = await httpRequest(`${baseUrl}/api/control-panel/stats`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    assert.strictEqual(empStatsRes.status, 403, 'Employee gọi stats bị từ chối 403 Forbidden');
    console.log('  ✅ [PASS] Quyền EMPLOYEE gọi GET /api/control-panel/stats bị trả về 403 Forbidden');

    // 6.3 Admin gọi /api/control-panel/init-data
    const adminInitDataRes = await httpRequest(`${baseUrl}/api/control-panel/init-data`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(adminInitDataRes.status, 200, 'Admin gọi init-data thành công 200');
    assert.ok(adminInitDataRes.json.success === true, 'init-data success: true');
    console.log('  ✅ [PASS] Admin gọi GET /api/control-panel/init-data thành công (HTTP 200)');

    // --- 7. Kiểm thử Đổi mật khẩu cá nhân: POST /auth/change-password ---
    console.log('\n--- 7. Kiểm tra Đổi mật khẩu cá nhân (POST /auth/change-password) ---');
    // 7.1 Mật khẩu cũ sai
    const wrongOldRes = await httpRequest(`${baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${empToken}` },
      body: { oldPassword: 'WrongPassword@123', newPassword: 'NewEmployeePass@123' },
    });
    assert.strictEqual(wrongOldRes.status, 400, 'Sai mật khẩu cũ trả về 400 Bad Request');
    console.log('  ✅ [PASS] Đổi mật khẩu thất bại khi nhập sai mật khẩu cũ (400)');

    // 7.2 Mật khẩu mới quá ngắn
    const shortNewRes = await httpRequest(`${baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${empToken}` },
      body: { oldPassword: 'Checkpoint@123', newPassword: '123' },
    });
    assert.strictEqual(shortNewRes.status, 400, 'Mật khẩu mới ngắn hơn 6 ký tự trả về 400');
    console.log('  ✅ [PASS] Mật khẩu mới < 6 ký tự bị từ chối');

    // 7.3 Đổi mật khẩu thành công
    const changeSuccessRes = await httpRequest(`${baseUrl}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${empToken}` },
      body: { oldPassword: 'Checkpoint@123', newPassword: 'NewEmployeePass@123' },
    });
    assert.strictEqual(changeSuccessRes.status, 201, 'Đổi mật khẩu thành công trả về 201/200');
    assert.strictEqual(changeSuccessRes.json.success, true);
    console.log('  ✅ [PASS] user01 tự đổi mật khẩu thành công sang NewEmployeePass@123');

    // 7.4 Xác minh: Đăng nhập bằng mật khẩu cũ thất bại
    const oldLoginFail = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(oldLoginFail.status, 401, 'Đăng nhập bằng mật khẩu cũ bị từ chối 401');
    console.log('  ✅ [PASS] Đăng nhập bằng mật khẩu cũ Checkpoint@123 đã bị vô hiệu hóa (401)');

    // 7.5 Xác minh: Đăng nhập bằng mật khẩu mới thành công
    const newLoginSuccess = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'NewEmployeePass@123' },
    });
    assert.strictEqual(newLoginSuccess.status, 201, 'Đăng nhập bằng mật khẩu mới thành công');
    const updatedEmpToken = newLoginSuccess.json.access_token;
    assert.ok(updatedEmpToken);
    console.log('  ✅ [PASS] Đăng nhập bằng mật khẩu mới NewEmployeePass@123 thành công');

    // --- 8. Kiểm thử Admin Reset mật khẩu qua PUT /api/users/:id ---
    console.log('\n--- 8. Kiểm tra Admin Reset Mật Khẩu qua PUT /api/users/:id ---');
    const empId = empUser.id;

    // 8.1 Admin cập nhật mật khẩu cho user01
    const adminResetPutRes = await httpRequest(`${baseUrl}/api/users/${empId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { password: 'AdminAssignedPass@456' },
    });
    assert.strictEqual(adminResetPutRes.status, 200, 'Admin PUT /api/users/:id reset password thành công');
    console.log('  ✅ [PASS] Admin reset mật khẩu cho user01 qua PUT /api/users/:id thành công');

    // 8.2 Xác minh đăng nhập bằng mật khẩu Admin vừa reset
    const adminPassLoginRes = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'AdminAssignedPass@456' },
    });
    assert.strictEqual(adminPassLoginRes.status, 201, 'Đăng nhập bằng mật khẩu admin reset thành công');
    console.log('  ✅ [PASS] user01 đăng nhập thành công với mật khẩu do Admin cấp: AdminAssignedPass@456');

    // --- 9. Kiểm thử Endpoint Chuyên Dụng: POST /api/users/:id/reset-password ---
    console.log('\n--- 9. Kiểm tra Endpoint POST /api/users/:id/reset-password ---');
    // 9.1 Non-admin gọi endpoint reset-password bị 403
    const nonAdminResetRes = await httpRequest(`${baseUrl}/api/users/${empId}/reset-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${updatedEmpToken}` },
      body: { newPassword: 'HackedPass@123' },
    });
    assert.strictEqual(nonAdminResetRes.status, 403, 'User không phải admin bị 403');
    console.log('  ✅ [PASS] User thường không thể gọi API reset mật khẩu (403 Forbidden)');

    // 9.2 Admin gọi POST reset-password
    const adminResetDedicatedRes = await httpRequest(`${baseUrl}/api/users/${empId}/reset-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { newPassword: 'Checkpoint@123' },
    });
    assert.strictEqual(adminResetDedicatedRes.status, 201, 'Admin POST reset-password thành công');
    console.log('  ✅ [PASS] Admin reset mật khẩu qua POST /api/users/:id/reset-password thành công');

    // 9.3 user01 đăng nhập lại bằng mật khẩu Checkpoint@123
    const restoredLoginRes = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'user01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(restoredLoginRes.status, 201);
    console.log('  ✅ [PASS] user01 đăng nhập lại với mật khẩu ban đầu thành công');

    // --- 10. Kiểm thử Admin Quản lý Quyền User (Phân Quyền Control Panel) ---
    console.log('\n--- 10. Kiểm tra Admin Cập Nhật Quyền User (canAccessControlPanel) ---');
    const techId = techUser.id;

    // 10.1 Admin cấp quyền canAccessControlPanel cho Technician
    const grantPermRes = await httpRequest(`${baseUrl}/api/users/${techId}/permissions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { canAccessControlPanel: true, canViewKpi: true, canCreateRequest: true },
    });
    assert.strictEqual(grantPermRes.status, 200, 'Admin cập nhật quyền thành công');
    assert.strictEqual(grantPermRes.json.permissions.canAccessControlPanel, true);
    console.log('  ✅ [PASS] Admin cấp quyền canAccessControlPanel: true cho tech01 thành công');

    // 10.2 tech01 đăng nhập lại để nhận token mới
    const techReloginRes = await httpRequest(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { usernameOrEmail: 'tech01', password: 'Checkpoint@123' },
    });
    assert.strictEqual(techReloginRes.status, 201);
    const techNewToken = techReloginRes.json.access_token;

    // 10.3 tech01 truy cập /control-panel sau khi được cấp quyền
    const techCpAllowedRes = await httpRequest(`${baseUrl}/control-panel`, {
      headers: { Cookie: `access_token=${techNewToken}` },
    });
    assert.strictEqual(techCpAllowedRes.status, 200, 'Technician được cấp quyền truy cập /control-panel thành công');
    console.log('  ✅ [PASS] tech01 sau khi được Admin cấp quyền đã truy cập thành công /control-panel (HTTP 200)');

    // 10.4 Thu hồi quyền của tech01 về ban đầu
    await httpRequest(`${baseUrl}/api/users/${techId}/permissions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { canAccessControlPanel: false, canViewKpi: true, canCreateRequest: true },
    });
    console.log('  ✅ [PASS] Đã hoàn nguyên phân quyền của tech01 về ban đầu');

    console.log('\n================================================================');
    console.log('🎉 TẤT CẢ CÁC MỤC KIỂM THỬ RBAC, ĐỔI MẬT KHẨU & ADMIN RESET ĐỀU ĐẠT 100%!');
    console.log('================================================================\n');
  } finally {
    await app.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
