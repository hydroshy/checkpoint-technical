# 🖨️ Checkpoint Technical - Hệ Thống Quản Lý & Nhập Liệu Phiếu Yêu Cầu Kỹ Thuật

Dự án được xây dựng dựa trên nền tảng **NestJS** theo phong cách kiến trúc của `@dvt/`, tối ưu hóa dành riêng cho **Quản lý & Nhập liệu Phiếu Yêu cầu Kỹ thuật (Technical Request & Maintenance Platform)** cho nhà máy / phân xưởng in.

Dự án đã được loại bỏ toàn bộ các module về LoRaWAN, ChirpStack, Modbus, Serial UART và Quản lý máy chủ mạng, chỉ giữ lại và tập trung hoàn toàn vào:
1. **Hệ thống xác thực (Auth & RBAC)**: Đăng nhập session JWT + Cookie (`access_token`), phân quyền vai trò (Admin, Kỹ thuật viên, Nhân viên sản xuất).
2. **Giao diện Vận hành / Dashboard (`/dashboard`)**: Dành cho nhân viên & kỹ thuật viên thao tác nhập liệu trực quan, đầy đủ tính năng theo mẫu phiếu chuẩn HTML V4.1.
3. **Giao diện Quản trị / Control Panel (`/control-panel`)**: Dành cho Quản lý / Ban Giám đốc phân tích thống kê chỉ số Downtime, biểu đồ sự cố 4M, quản lý danh sách phiếu, danh mục máy in, danh sách nhân sự và tài khoản hệ thống.

---

## 🚀 Khởi Chạy Nhanh

### 1. Cài đặt dependencies
```bash
cd checkpoint_technical
npm install
```

### 2. Biên dịch source code
```bash
npm run build
```

### 3. Khởi chạy server
```bash
# Chạy production build
npm run start

# Hoặc chạy môi trường phát triển (hot reload)
npm run start:dev
```

Mặc định server sẽ lắng nghe trên cổng `PORT=3001` (có thể cấu hình trong file `.env`):
- **Trang Đăng Nhập**: [http://localhost:3001/login](http://localhost:3001/login)
- **Giao Diện Nhập Liệu (Dashboard)**: [http://localhost:3001/dashboard](http://localhost:3001/dashboard)
- **Giao Diện Quản Trị (Control Panel)**: [http://localhost:3001/control-panel](http://localhost:3001/control-panel)
- **Tài liệu Swagger API**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 🐘 Cấu Hình Kết Nối PostgreSQL & Biến Môi Trường

Hệ thống hỗ trợ kết nối trực tiếp với **container PostgreSQL có sẵn** của bạn (ví dụ stack `iot_postgres` trên mạng Docker `internal_net`) hoặc PostgreSQL cài cục bộ, thông qua biến môi trường cấu hình trong file `.env` hoặc truyền vào `docker-compose.yml`:

### 1. Bảng Biến Môi Trường (Environment Variables)

| Tên Biến | Mặc Định | Mô Tả |
| :--- | :--- | :--- |
| `PORT` | `3001` | Cổng HTTP lắng nghe của máy chủ NestJS |
| `NODE_ENV` | `development` | Môi trường chạy (`development` / `production`) |
| `JWT_SECRET` | `Daviteq_...` | Chuỗi khóa bí mật ký cấp JWT Auth token |
| `DB_HOST` | `postgres` / `localhost` | Hostname của PostgreSQL (`postgres` hoặc `iot_postgres` khi chạy Docker, `localhost` khi chạy dev) |
| `DB_PORT` | `5432` | Cổng kết nối PostgreSQL (hoặc `POSTGRES_PORT`) |
| `DB_USERNAME` | `admin` | Tên đăng nhập cơ sở dữ liệu (hỗ trợ cả `POSTGRES_USER`) |
| `DB_PASSWORD` | `mason` | Mật khẩu truy cập PostgreSQL (hỗ trợ cả `POSTGRES_PASSWORD`) |
| `DB_NAME` | `checkpoint_technical` | Tên cơ sở dữ liệu PostgreSQL (hỗ trợ cả `POSTGRES_DB` / `dvt`) |
| `DB_SSL` | `false` | Bật/tắt SSL khi kết nối PostgreSQL (`true`/`false`) |
| `DB_AUTO_INIT` | `true` | **Tự động tạo database nếu chưa có, khởi tạo bảng DDL & nạp dữ liệu mẫu** khi kết nối DB |
| `DATA_DIR` | `./data` | Thư mục lưu file JSON backup hoặc dự phòng khi DB offline |

> 💡 **Khả Năng Chống Lỗi (Resilience Fallback)**: Khi khởi động, hệ thống sẽ tự động kiểm tra kết nối PostgreSQL:
> 1. Nếu database `DB_NAME` chưa tồn tại, hệ thống tự động chạy lệnh `CREATE DATABASE` để khởi tạo.
> 2. Nếu `DB_AUTO_INIT=true`, hệ thống tự động chạy DDL tạo đầy đủ các bảng (`users`, `machines`, `employees`, `technical_requests`) và nạp dữ liệu mặc định.
> 3. Nếu PostgreSQL tạm thời chưa sẵn sàng, hệ thống sẽ ghi log cảnh báo và tự động chuyển về cơ chế file JSON dự phòng mà không làm sập server.

### 2. Khởi Chạy Nhanh Với Docker Compose (Dùng Chung Container PostgreSQL Có Sẵn)

File `docker-compose.yml` được cấu hình để kết nối trực tiếp vào mạng nội bộ `internal_net` của container PostgreSQL hiện có:

```bash
# 1. Đảm bảo stack PostgreSQL & Metabase của bạn đang chạy và có mạng 'internal_net'
# (Nếu mạng có tiền tố theo thư mục, có thể đặt tên mạng rõ ràng là internal_net)

# 2. Khởi chạy Checkpoint Technical App
cd checkpoint_technical
docker compose up -d --build

# Xem log hoạt động
docker compose logs -f app

# Dừng hệ thống
docker compose down
```

---

## 🔑 Tài Khoản Mặc Định (Default Credentials)

Hệ thống được thiết lập sẵn 3 tài khoản mẫu ứng với các vai trò khác nhau (mật khẩu mặc định: `Dvt@123`):

| Tên Đăng Nhập | Mật Khẩu | Vai Trò | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **`admin`** | `Dvt@123` | **ADMIN** | Toàn quyền: Truy cập cả Dashboard và Control Panel, xem phân tích sự cố, quản lý toàn bộ phiếu, máy móc, nhân sự và người dùng. |
| **`tech01`** | `Dvt@123` | **TECHNICIAN** | Kỹ thuật viên: Nhập & xử lý phiếu, phân tích nguyên nhân 4M, cập nhật downtime, quản lý máy móc & nhân sự. |
| **`user01`** | `Dvt@123` | **EMPLOYEE** | Nhân viên sản xuất: Nhập phiếu yêu cầu mới, xem lịch sử các phiếu của mình, xuất báo cáo PDF. |

---

## 🌟 Tính Năng Chi Tiết

### 1. Giao Diện Nhập Liệu Nhân Viên (`/dashboard`)
Đầy đủ tính năng tương thích 100% với form HTML gốc:
- **Tự động sinh mã tài liệu**: `REQ-YYYYMMDD-HHMM` theo thời gian thực.
- **Section 1 - Thông tin yêu cầu (Sản xuất)**:
  - Ngày yêu cầu, giờ yêu cầu (kèm **Time Picker Modal** dạng con lăn cảm ứng hiện đại).
  - Người yêu cầu (hỗ trợ gợi ý Datalist và **Person Picker Modal** lọc theo Bộ phận & Khu vực chuyền).
  - Công nghệ in: RFID/Thermal/Laser, OFFSET, Digital, HTL, PFL, WOVEN, DIECUT, hoặc Khác.
  - Tên máy: Tự động tải danh sách máy tương ứng với công nghệ đã chọn từ database, hoặc nhập máy mới bằng tay.
  - Mô tả sự cố chi tiết.
  - Trạng thái sự cố: Hàng SX lần đầu (First Bulk Print) hoặc Hàng SX nhiều lần (Repeat Print).
  - Mức độ ưu tiên: Hỗ trợ ngay (Immediate), Chạy tạm (Hold), hoặc Khác.
- **Section 2 - Phân tích & Xử lý (Kỹ thuật)**:
  - Người tiếp nhận kỹ thuật.
  - Ngày giờ tiếp nhận & Ngày giờ hoàn thành.
  - **Tự động tính thời gian Downtime** chính xác theo phút.
  - Nguyên nhân gốc (Root Cause) & Hành động khắc phục (Action Taken).
  - Phân loại lỗi **4M** (Con người MAN, Máy móc MACHINE, Vật tư MATERIAL, Phương pháp METHOD).
  - Nhóm công đoạn: Trước in (Prepress), Trong in (Press), Sau in (PostPress).
- **Section 3 - Hình ảnh hiện trường**:
  - Ảnh trước khi sửa (tối đa 3 ảnh): Tải file hoặc chụp ảnh trực tiếp từ camera.
  - Ảnh sau khi sửa (tối đa 3 ảnh): Tải file hoặc chụp ảnh trực tiếp từ camera.
  - Xem thumbnail thu nhỏ, nút xóa từng ảnh.
- **Section 4 - Xác nhận & Bàn giao**:
  - Đánh giá chất lượng in: Đạt chuẩn (OK) hoặc Chưa đạt (NG).
  - Tình trạng phiếu: Đã khắc phục (DONE), Đang theo dõi (MONITOR), Cần hỗ trợ (SUPPORT).
  - Work Order, Total Quantity, Waste Quantity, Đơn vị, **Tự động tính tỷ lệ % Waste**.
  - Đại diện sản xuất ký nhận bàn giao.
- **Thanh thao tác nhanh (Bottom Action Bar)**:
  - 💾 **Lưu Lên Hệ Thống**: Gửi dữ liệu lên API Backend NestJS và lưu trữ vĩnh viễn vào CSDL.
  - 📄 **Xuất PDF báo cáo**: Render mẫu phiếu A4 tiêu chuẩn 2 trang (kèm hình ảnh trước & sau) bằng `jsPDF` + `html2canvas`.
  - 📂 **Phục hồi (Restore)**: Đọc file JSON sao lưu nạp lại vào form.
  - 💾 **Sao lưu (Backup)**: Tải file JSON chứa dữ liệu form về máy tính.
  - 📊 **Nạp NV Excel**: Nạp nhanh danh sách nhân sự từ file `.xlsx`/`.xls`.
  - 🗑️ **Làm mới form**: Xóa trắng dữ liệu để nhập phiếu mới.
- **Tab Lịch Sử Phiếu**: Xem lại các phiếu đã lưu, nạp ngược lại vào form để sửa/in hoặc tải PDF trực tiếp.

---

### 2. Giao Diện Quản Trị Control Panel (`/control-panel`)
Thiết kế chuẩn Corporate Industrial Dashboard (tương thích Light Mode & Dark Mode):
- **📊 Tổng Quan & Phân Tích (Overview Hub)**:
  - Thẻ KPI: Tổng số phiếu, Số phiếu đã hoàn thành, Số phiếu đang theo dõi / cần hỗ trợ, Tổng thời gian downtime (phút), Tỷ lệ phế phẩm bình quân (% Waste).
  - Biểu đồ phân bố nguyên nhân theo mô hình 4M (MAN, MACHINE, MATERIAL, METHOD).
  - Biểu đồ phân loại sự cố theo từng công nghệ in.
  - Thống kê theo nhóm công đoạn (Trước in, Trong in, Sau in).
  - Bảng xếp hạng Top máy phát sinh sự cố nhiều nhất.
- **📋 Quản Lý Phiếu Yêu Cầu Kỹ Thuật (Master Table)**:
  - Xem danh sách toàn bộ phiếu yêu cầu trên toàn bộ nhà máy.
  - Bộ lọc thông minh: Theo trạng thái (DONE, MONITOR, SUPPORT), theo công nghệ in, mức độ ưu tiên, từ khóa tìm kiếm.
  - Cập nhật trạng thái phiếu trực tiếp.
  - Xuất toàn bộ danh sách phiếu ra file Excel (`.xlsx`).
  - Xem chi tiết đầy đủ của phiếu trong Modal popup (bao gồm hình ảnh hiện trường).
  - Xóa phiếu.
- **🖨️ Quản Lý Máy Móc & Công Nghệ In**:
  - Quản lý danh mục công nghệ in (RFID, OFFSET, Digital, HTL, PFL, WOVEN, DIECUT...).
  - Thêm máy in mới, chỉnh sửa, xóa máy in.
  - Dữ liệu cập nhật ngay lập tức vào dropdown của form nhập liệu Dashboard.
- **👥 Quản Lý Nhân Sự & Bộ Phận**:
  - Quản lý nhân viên theo Mã NV, Họ tên, Bộ phận, Khu vực chuyền, Chức vụ.
  - Nạp danh sách nhân sự hàng loạt từ file Excel.
  - Thêm nhân viên mới, sửa, xóa.
  - Xuất danh sách nhân sự ra file Excel.
- **🛡️ Quản Lý Người Dùng & Phân Quyền (Admin Only)**:
  - Danh sách tài khoản đăng nhập hệ thống.
  - Thêm tài khoản mới, phân quyền (ADMIN, TECHNICIAN, EMPLOYEE).
  - Khóa / Kích hoạt tài khoản, đổi mật khẩu.

---

## 📁 Cấu Trúc Mã Nguồn (Directory Structure)

```
checkpoint_technical/
├── .env                          # Cấu hình PORT, JWT_SECRET, DATA_DIR
├── .env.example
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── data/                         # Thư mục lưu trữ CSDL JSON bền vững
│   ├── users.json                # Dữ liệu tài khoản & quyền hạn
│   ├── machines.json             # Danh mục máy in theo công nghệ
│   ├── employees.json            # Danh sách nhân sự & bộ phận
│   └── technical_requests.json   # Dữ liệu các phiếu yêu cầu kỹ thuật
├── docs/
│   └── Technical request V4 1.html # Bản sao mẫu HTML gốc làm đối chiếu
├── public/                       # Tài nguyên tĩnh (ảnh logo, vendor)
│   ├── images/
│   └── vendor/
└── src/
    ├── main.ts                   # Điểm khởi động NestJS, Swagger, CORS, Static assets
    ├── app.module.ts             # Root module
    ├── app.controller.ts         # Điều hướng giao diện (/login, /dashboard, /control-panel)
    ├── common/
    │   ├── decorators/           # @CurrentUser, @Roles
    │   └── guards/               # JwtAuthGuard, RolesGuard
    ├── modules/
    │   ├── database/             # File-backed DatabaseService an toàn & atomic
    │   ├── auth/                 # Xác thực JWT, đăng nhập, đăng xuất, profile
    │   ├── technical-requests/   # CRUD API phiếu kỹ thuật, stats KPI, Excel export
    │   ├── machines/             # CRUD API danh mục máy móc & công nghệ in
    │   ├── employees/            # CRUD API nhân sự & bulk-import Excel
    │   └── users/                # Quản lý tài khoản hệ thống (Admin)
    └── views/
        ├── login.view.ts         # Giao diện Đăng Nhập phong cách glassmorphism
        ├── dashboard.view.ts     # Giao diện Nhập Liệu nhân viên (Chuẩn mẫu V4.1)
        └── control-panel.view.ts # Giao diện Quản trị viên (Control Panel)
```

---

## 🛠️ API Endpoints Chính

| Phương thức | Đường dẫn | Mô tả | Quyền |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Đăng nhập hệ thống, sinh JWT & thiết lập cookie | Public |
| `GET/POST`| `/auth/logout` | Đăng xuất, xóa session cookie | Public |
| `GET` | `/auth/session` | Lấy thông tin user đăng nhập hiện tại | Authenticated |
| `GET` | `/api/technical-requests` | Lấy danh sách phiếu yêu cầu (hỗ trợ lọc & tìm kiếm) | Authenticated |
| `GET` | `/api/technical-requests/stats` | Lấy thống kê KPI, biểu đồ 4M, downtime, % waste | Authenticated |
| `POST` | `/api/technical-requests` | Tạo mới phiếu yêu cầu kỹ thuật | Authenticated |
| `PUT` | `/api/technical-requests/:id` | Cập nhật thông tin phiếu yêu cầu | Authenticated |
| `DELETE`| `/api/technical-requests/:id` | Xóa phiếu yêu cầu | Authenticated |
| `GET` | `/api/machines/grouped` | Lấy danh sách máy nhóm theo công nghệ in | Authenticated |
| `POST` | `/api/machines` | Thêm máy in mới vào danh mục | Tech / Admin |
| `GET` | `/api/employees` | Lấy danh sách nhân viên | Authenticated |
| `POST` | `/api/employees/bulk-import` | Nạp hàng loạt nhân sự từ file Excel | Tech / Admin |
| `GET` | `/api/users` | Danh sách tài khoản đăng nhập | Admin |
| `POST` | `/api/users` | Tạo tài khoản đăng nhập mới | Admin |
# checkpoint-technical
