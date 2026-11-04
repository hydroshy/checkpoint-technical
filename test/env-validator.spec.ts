import { EnvValidator, DEFAULT_CONFIG } from '../src/common/utils/env-validator.util';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ ENV VALIDATOR — KIỂM TRA TOÀN DIỆN BIẾN MÔI TRƯỜNG');
console.log('================================================================');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedTests++;
  }
}

// Lưu lại process.env gốc
const originalEnv = { ...process.env };

function resetEnv() {
  for (const k of Object.keys(process.env)) {
    if (!(k in originalEnv)) {
      delete process.env[k];
    }
  }
  Object.assign(process.env, originalEnv);
}

try {
  // Test 1: Kiểm tra cấu hình mặc định khi không có biến môi trường
  console.log('\n--- 1. Kiểm tra Fallback Mặc Định (Default Values Fallback) ---');
  delete process.env.DB_HOST;
  delete process.env.POSTGRES_HOST;
  delete process.env.PORT;
  delete process.env.JWT_SECRET;
  delete process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  const defaultReport = EnvValidator.validate(true);
  assert(defaultReport.items.PORT.rawValue === '3001', 'PORT fallback đúng giá trị 3001');
  assert(defaultReport.items.DB_HOST.rawValue === '192.168.1.35', 'DB_HOST fallback đúng 192.168.1.35');
  assert(defaultReport.items.DB_PORT.rawValue === '5432', 'DB_PORT fallback đúng 5432');
  assert(defaultReport.items.DB_USERNAME.rawValue === 'admin', 'DB_USERNAME fallback đúng admin');
  assert(defaultReport.items.DB_NAME.rawValue === 'checkpoint_technical', 'DB_NAME fallback đúng checkpoint_technical');
  assert(defaultReport.items.DB_AUTO_INIT.displayValue === 'true', 'DB_AUTO_INIT mặc định true');
  assert(defaultReport.items.DATA_DIR.rawValue === './data', 'DATA_DIR fallback đúng ./data');

  // Test 2: Phân giải biến môi trường chính và Aliases
  console.log('\n--- 2. Kiểm tra Phân Giải Aliases & Ưu Tiên (Priority & Aliases) ---');
  // Ưu tiên DB_HOST hơn POSTGRES_HOST
  process.env.DB_HOST = 'custom-db-host';
  process.env.POSTGRES_HOST = 'legacy-postgres-host';
  const aliasReport1 = EnvValidator.validate(true);
  assert(aliasReport1.items.DB_HOST.rawValue === 'custom-db-host', 'DB_HOST được ưu tiên trước POSTGRES_HOST');
  assert(aliasReport1.items.DB_HOST.resolvedSource === 'DB_HOST', 'Nguồn ghi nhận đúng DB_HOST');

  // Khi DB_HOST vắng mặt, tự động dùng POSTGRES_HOST
  delete process.env.DB_HOST;
  const aliasReport2 = EnvValidator.validate(true);
  assert(aliasReport2.items.DB_HOST.rawValue === 'legacy-postgres-host', 'Phân giải đúng alias POSTGRES_HOST');
  assert(aliasReport2.items.DB_HOST.resolvedSource === 'POSTGRES_HOST', 'Nguồn ghi nhận đúng POSTGRES_HOST');

  // Test aliases của DB_USERNAME (DB_USER, POSTGRES_USER, USER)
  delete process.env.DB_USERNAME;
  delete process.env.DB_USER;
  delete process.env.USER;
  process.env.POSTGRES_USER = 'pg_service_user';
  const aliasUserRep = EnvValidator.validate(true);
  assert(aliasUserRep.items.DB_USERNAME.rawValue === 'pg_service_user', 'Phân giải đúng POSTGRES_USER');

  // Test aliases của DB_NAME (DB_DATABASE, POSTGRES_DB, DB)
  delete process.env.DB_NAME;
  delete process.env.POSTGRES_DB;
  delete process.env.DB;
  process.env.DB_DATABASE = 'db_via_database_alias';
  const aliasDbRep = EnvValidator.validate(true);
  assert(aliasDbRep.items.DB_NAME.rawValue === 'db_via_database_alias', 'Phân giải đúng DB_DATABASE alias');

  // Test 3: Che giấu thông tin nhạy cảm (Masking Logic)
  console.log('\n--- 3. Kiểm tra Che Giấu Thông Tin Nhạy Cảm (Masking) ---');
  const maskedSecret = EnvValidator.maskValue('JWT_SECRET', 'MySuperSecretKeyForJwt20261103!');
  assert(maskedSecret !== 'MySuperSecretKeyForJwt20261103!', 'JWT_SECRET không bị lộ nguyên văn');
  assert(maskedSecret.includes('****'), 'JWT_SECRET có chứa ký tự mask ****');
  assert(maskedSecret.startsWith('MySu'), 'Giữ lại một phần tiền tố để nhận diện');

  const maskedPass = EnvValidator.maskValue('DB_PASSWORD', 'Ph@nloi20031403');
  assert(maskedPass !== 'Ph@nloi20031403', 'DB_PASSWORD không bị lộ nguyên văn');
  assert(maskedPass.includes('****'), 'DB_PASSWORD có chứa ký tự mask ****');

  const plainHost = EnvValidator.maskValue('DB_HOST', '192.168.1.35');
  assert(plainHost === '192.168.1.35', 'Biến không nhạy cảm (DB_HOST) giữ nguyên giá trị');

  // Test 4: Cảnh báo trong môi trường Production
  console.log('\n--- 4. Kiểm tra Cảnh Báo An Toàn trong Môi Trường Production ---');
  process.env.NODE_ENV = 'production';
  process.env.JWT_SECRET = DEFAULT_CONFIG.JWT_SECRET; // Dùng default key
  process.env.DB_PASSWORD = DEFAULT_CONFIG.DB_PASSWORD; // Dùng default password
  delete process.env.DB_HOST; // Thiếu DB_HOST
  delete process.env.POSTGRES_HOST; // Thiếu POSTGRES_HOST

  const prodReport = EnvValidator.validate(true);
  assert(prodReport.isProduction === true, 'isProduction trả về true');
  assert(prodReport.items.JWT_SECRET.status === 'CRITICAL', 'Phát hiện lỗi CRITICAL cho JWT_SECRET mặc định trong production');
  assert(prodReport.hasCritical === true, 'hasCritical = true khi có JWT_SECRET mặc định');
  assert(prodReport.items.DB_PASSWORD.status === 'WARNING', 'Phát hiện WARNING cho DB_PASSWORD mặc định');
  assert(prodReport.items.DB_HOST.status === 'WARNING', 'Phát hiện WARNING khi thiếu DB_HOST trong production');
  assert(prodReport.warnings.length >= 2, `Ghi nhận đầy đủ danh sách cảnh báo (${prodReport.warnings.length} cảnh báo)`);

  // Khi đặt JWT_SECRET an toàn trong production
  process.env.JWT_SECRET = 'Super_Secure_Random_Custom_Key_For_Production_Deployment_2026!';
  process.env.DB_PASSWORD = 'StrongUniquePassword#992831!';
  process.env.DB_HOST = 'postgres_db';
  const prodSafeReport = EnvValidator.validate(true);
  assert(prodSafeReport.items.JWT_SECRET.status === 'VALID', 'JWT_SECRET an toàn đạt trạng thái VALID');
  assert(prodSafeReport.items.DB_PASSWORD.status === 'VALID', 'DB_PASSWORD mới đạt trạng thái VALID');
  assert(prodSafeReport.items.DB_HOST.status === 'VALID', 'DB_HOST trỏ container đạt trạng thái VALID');
  assert(prodSafeReport.hasCritical === false, 'hasCritical = false khi đã sửa khóa bí mật');

  // Test 5: Kiểm tra phát hiện giá trị không hợp lệ (Validation & Invalid Values)
  console.log('\n--- 5. Kiểm tra Phát Hiện Giá Trị Không Hợp Lệ (Invalid Detection) ---');
  process.env.PORT = 'abc_invalid_port';
  const invalidPortRep = EnvValidator.validate(true);
  assert(invalidPortRep.items.PORT.status === 'INVALID', 'Nhận diện PORT chuỗi không phải số là INVALID');
  assert(invalidPortRep.hasCritical === true, 'Báo cáo có hasCritical = true do PORT lỗi');

  process.env.PORT = '999999'; // Out of range
  const outOfRangePortRep = EnvValidator.validate(true);
  assert(outOfRangePortRep.items.PORT.status === 'INVALID', 'Nhận diện PORT vượt quá 65535 là INVALID');

  process.env.PORT = '3001';
  process.env.DB_PORT = 'xyz';
  const invalidDbPortRep = EnvValidator.validate(true);
  assert(invalidDbPortRep.items.DB_PORT.status === 'INVALID', 'Nhận diện DB_PORT chuỗi là INVALID');

  // Test 6: Kiểm tra cờ boolean DB_AUTO_INIT
  console.log('\n--- 6. Kiểm tra Xử Lý Boolean DB_AUTO_INIT ---');
  delete process.env.DB_PORT;
  process.env.DB_AUTO_INIT = 'false';
  assert(EnvValidator.getDatabaseConfig().autoInit === false, "DB_AUTO_INIT='false' -> boolean false");

  process.env.DB_AUTO_INIT = '0';
  assert(EnvValidator.getDatabaseConfig().autoInit === false, "DB_AUTO_INIT='0' -> boolean false");

  process.env.DB_AUTO_INIT = 'off';
  assert(EnvValidator.getDatabaseConfig().autoInit === false, "DB_AUTO_INIT='off' -> boolean false");

  process.env.DB_AUTO_INIT = 'true';
  assert(EnvValidator.getDatabaseConfig().autoInit === true, "DB_AUTO_INIT='true' -> boolean true");

  // Test 7: Kiểm tra định dạng bảng ASCII hiển thị (Table Output)
  console.log('\n--- 7. Kiểm tra Định Dạng Bảng Báo Cáo ASCII ---');
  const tableOutput = prodSafeReport.formattedTable;
  assert(typeof tableOutput === 'string' && tableOutput.length > 200, 'Tạo bảng formattedTable dạng chuỗi đầy đủ');
  assert(tableOutput.includes('CHECKPOINT TECHNICAL'), 'Bảng có tiêu đề thương hiệu Checkpoint');
  assert(tableOutput.includes('JWT_SECRET'), 'Bảng chứa tên biến JWT_SECRET');
  assert(tableOutput.includes('DB_HOST'), 'Bảng chứa tên biến DB_HOST');
  assert(tableOutput.includes('DB_PASSWORD'), 'Bảng chứa tên biến DB_PASSWORD');

} finally {
  resetEnv();
}

console.log('\n================================================================');
if (failedTests === 0) {
  console.log(`🎉 HOÀN THÀNH TẤT CẢ ${passedTests} KIỂM THỬ ENV VALIDATOR XUẤT SẮC! (0 LỖI)`);
} else {
  console.error(`💥 CÓ ${failedTests} KIỂM THỬ THẤT BẠI TRÊN TỔNG SỐ ${passedTests + failedTests}!`);
  process.exit(1);
}
console.log('================================================================');
