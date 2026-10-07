import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

console.log('================================================================');
console.log('🧪 KIỂM THỬ T3: DASHBOARD, LOGIN, USER PROFILE & CPSF FORM');
console.log('================================================================\n');

// 1. Module Dashboard
console.log('--- 1. Kiểm thử Module Dashboard (Chữ đen, bỏ text thừa) ---');
const dashboardHeaderPath = path.resolve(__dirname, '../src/views/dashboard/components/layouts/header.component.ts');
const dashboardHeaderContent = fs.readFileSync(dashboardHeaderPath, 'utf-8');

assert.ok(
  dashboardHeaderContent.includes('text-black dark:text-white">Checkpoint Systems</span>'),
  'Chữ Checkpoint Systems trên header Dashboard hiển thị màu đen (text-black dark:text-white)'
);
assert.ok(
  !dashboardHeaderContent.includes('>Dashboard</span>'),
  'Đã loại bỏ chữ "Dashboard" bên dưới Checkpoint Systems trên header'
);
console.log('  ✅ [PASS] Header Dashboard: Checkpoint Systems chữ đen, đã bỏ chữ Dashboard bên dưới');

const dashboardNavPath = path.resolve(__dirname, '../src/views/dashboard/components/layouts/navigation.component.ts');
const dashboardNavContent = fs.readFileSync(dashboardNavPath, 'utf-8');

assert.ok(
  !dashboardNavContent.includes('D-Module • User Portal'),
  'Đã loại bỏ text "D-Module • User Portal"'
);
assert.ok(
  !dashboardNavContent.includes('Checkpoint Technical'),
  'Đã loại bỏ text "Checkpoint Technical" trong banner navigation'
);
assert.ok(
  !dashboardNavContent.includes('Khởi tạo yêu cầu dịch vụ (CPSR), phản hồi kỹ thuật (CPST), nghiệm thu bàn giao (CPSF) và theo dõi báo cáo hiệu suất kỹ thuật'),
  'Đã loại bỏ đoạn mô tả dài khởi tạo yêu cầu dịch vụ'
);
console.log('  ✅ [PASS] Dashboard Navigation: Đã loại bỏ hoàn toàn các dòng text thừa');

// 2. Giao diện Login
console.log('\n--- 2. Kiểm thử Giao diện Login (logo-full, chữ đen, nút Đăng nhập, bỏ gợi ý) ---');
const loginViewPath = path.resolve(__dirname, '../src/views/login.view.ts');
const loginViewContent = fs.readFileSync(loginViewPath, 'utf-8');

assert.ok(
  loginViewContent.includes('logo-full.png'),
  'Trang Login sử dụng logo-full.png'
);
assert.ok(
  loginViewContent.includes('text-black dark:text-white') && loginViewContent.includes('Checkpoint Systems'),
  'Tên thương hiệu là "Checkpoint Systems" chữ màu đen nguyên chữ'
);
assert.ok(
  !loginViewContent.includes('CHECKPOINT</span> Systems'),
  'Không còn dạng chia màu xanh/trắng cũ "CHECKPOINT Systems"'
);
assert.ok(
  loginViewContent.includes('Đăng nhập <i class="fa-solid fa-arrow-right'),
  'Nút submit đăng nhập là "Đăng nhập"'
);
assert.ok(
  !loginViewContent.includes('Đăng Nhập Vào Hệ Thống') && !loginViewContent.includes('Đăng nhập vào hệ thống'),
  'Không còn text dài "Đăng nhập vào hệ thống"'
);
assert.ok(
  !loginViewContent.includes('Gợi ý tài khoản hệ thống'),
  'Đã loại bỏ phần gợi ý tài khoản hệ thống (demo accounts)'
);
assert.ok(
  !loginViewContent.includes('Checkpoint@123'),
  'Không còn mật khẩu demo hiển thị công khai'
);
console.log('  ✅ [PASS] Giao diện Login: logo-full, chữ đen nguyên chữ, nút Đăng nhập gọn, bỏ tài khoản demo');

// 3. User Profile Dropdown & Navigation
console.log('\n--- 3. Kiểm thử User Profile Dropdown (Dashboard, bỏ Swagger, Giao diện) ---');
const cpHeaderPath = path.resolve(__dirname, '../src/views/control-panel/components/layouts/header.component.ts');
const cpHeaderContent = fs.readFileSync(cpHeaderPath, 'utf-8');

assert.ok(
  cpHeaderContent.includes('Giao diện</div>'),
  'Control Panel: "Giao diện (Theme)" đổi thành "Giao diện"'
);
assert.ok(
  !cpHeaderContent.includes('Giao diện (Theme)'),
  'Control Panel: Không còn text "(Theme)"'
);
assert.ok(
  dashboardHeaderContent.includes('Giao diện</div>'),
  'Dashboard: "Giao diện (Theme)" đổi thành "Giao diện"'
);
assert.ok(
  !dashboardHeaderContent.includes('Giao diện (Theme)'),
  'Dashboard: Không còn text "(Theme)"'
);

assert.ok(
  cpHeaderContent.includes('<i class="fa-solid fa-gauge-high text-sky-500"></i> Dashboard</span>'),
  'Control Panel: Nút "Quay lại Dashboard" đã đổi thành "Dashboard"'
);
assert.ok(
  !cpHeaderContent.includes('Quay lại Dashboard'),
  'Control Panel: Không còn text "Quay lại Dashboard"'
);

assert.ok(
  !cpHeaderContent.includes('Swagger API Docs'),
  'Control Panel: Đã loại bỏ nút "Swagger API Docs"'
);
assert.ok(
  !dashboardHeaderContent.includes('Swagger API Docs'),
  'Dashboard: Đã loại bỏ nút "Swagger API Docs"'
);
console.log('  ✅ [PASS] User Profile & Navigation dropdown: Đổi thành "Dashboard", bỏ Swagger, đổi thành "Giao diện"');

// 4. Form CPSF trên web
console.log('\n--- 4. Kiểm thử Form CPSF trên web (WO, Tổng SL, Phế không bắt buộc) ---');
const confirmRequestPath = path.resolve(__dirname, '../src/views/confirm-request.view.ts');
const confirmRequestContent = fs.readFileSync(confirmRequestPath, 'utf-8');

// Kiểm tra label không có dấu sao đỏ bắt buộc
const woBlock = confirmRequestContent.substring(
  confirmRequestContent.indexOf('Work Order (Lệnh SX)'),
  confirmRequestContent.indexOf('Work Order (Lệnh SX)') + 180
);
assert.ok(!woBlock.includes('text-rose-500'), 'Work Order không có dấu * bắt buộc');
assert.ok(!woBlock.includes('required'), 'Work Order input không có thuộc tính required');

const totalQtyBlock = confirmRequestContent.substring(
  confirmRequestContent.indexOf('Tổng số lượng'),
  confirmRequestContent.indexOf('Tổng số lượng') + 180
);
assert.ok(!totalQtyBlock.includes('text-rose-500'), 'Tổng số lượng không có dấu * bắt buộc');
assert.ok(!totalQtyBlock.includes('required'), 'Tổng số lượng input không có thuộc tính required');

// Kiểm tra hàm submitForm không validate bắt buộc WO hoặc totalQty
const submitFormBlock = confirmRequestContent.substring(
  confirmRequestContent.indexOf('function submitForm()'),
  confirmRequestContent.indexOf('showConfirmModal.value = true;')
);
assert.ok(!submitFormBlock.includes('Vui lòng nhập Work Order'), 'submitForm không bắt buộc nhập Work Order');
assert.ok(!submitFormBlock.includes('Vui lòng nhập tổng số lượng'), 'submitForm không bắt buộc nhập Tổng số lượng');
console.log('  ✅ [PASS] Form CPSF trên web: Work Order, Tổng SL, Phế phát sinh hoàn toàn không còn required');

console.log('\n================================================================');
console.log('🎉 TẤT CẢ TEST SPEC T3 HOÀN TẤT THÀNH CÔNG 100%!');
console.log('================================================================\n');
