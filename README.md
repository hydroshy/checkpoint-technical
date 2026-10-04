# 🖨️ Checkpoint Technical - Hệ Thống Quản Lý & Nhập Liệu Phiếu Yêu Cầu Kỹ Thuật

Dự án được xây dựng dựa trên nền tảng **NestJS** theo phong cách kiến trúc của Checkpoint Systems, tối ưu hóa dành riêng cho **Quản lý & Nhập liệu Phiếu Yêu cầu Kỹ thuật (Technical Request & Maintenance Platform)** cho nhà máy / phân xưởng in.

Hệ thống tập trung hoàn toàn vào:
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

## 🐳 Cấu Hình Docker Compose & Biến Môi Trường

Hệ thống kết nối trực tiếp với PostgreSQL (`192.168.1.35:5432/checkpoint`) hoặc container PostgreSQL nội bộ:

### 1. File `docker-compose.yml` Chuẩn

```yaml
version: "3.8"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: checkpoint_technical_app
    restart: unless-stopped
    ports:
      - "${PORT:-3001}:3001"
    environment:
      - PORT=${PORT:-3001}
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET:-Checkpoint_Systems_Technical_Key_2026_Secure!}
      # PostgreSQL Server Connection Variables (192.168.1.35:5432/checkpoint)
      - POSTGRES_HOST=${POSTGRES_HOST:-192.168.1.35}
      - POSTGRES_PORT=${POSTGRES_PORT:-5432}
      - POSTGRES_USER=${POSTGRES_USER:-admin}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-Ph@nloi20031403}
      - POSTGRES_DB=${POSTGRES_DB:-checkpoint}
      # YAML Environment Direct Aliases
      - USER=${USER:-admin}
      - PASSWORD=${PASSWORD:-Ph@nloi20031403}
      - DB=${DB:-checkpoint}
      # Compatible DB_* environment variables
      - DB_HOST=${DB_HOST:-${POSTGRES_HOST:-192.168.1.35}}
      - DB_PORT=${DB_PORT:-${POSTGRES_PORT:-5432}}
      - DB_USERNAME=${DB_USERNAME:-${POSTGRES_USER:-admin}}
      - DB_PASSWORD=${DB_PASSWORD:-${POSTGRES_PASSWORD:-Ph@nloi20031403}}
      - DB_NAME=${DB_NAME:-${POSTGRES_DB:-checkpoint}}
      - DB_AUTO_INIT=${DB_AUTO_INIT:-true}
    volumes:
      - ./data:/app/data
    networks:
      - iot_postgres_internal_net
      - dockge_default

> 💡 **Hướng dẫn khởi tạo CSDL PostgreSQL chi tiết**:
> - Xem tệp tài liệu toàn diện: [`docs/POSTGRESQL_INITIALIZATION_GUIDE.md`](./docs/POSTGRESQL_INITIALIZATION_GUIDE.md)
> - Script SQL DDL & Seed hoàn chỉnh: [`config/init_database.sql`](./config/init_database.sql)
> - Hướng dẫn 2 cách: Cách 1 dùng script qua `psql` / `pgAdmin 4` / `DBeaver` / Docker Compose, Cách 2 tự động qua `DB_AUTO_INIT=true` (xử lý triệt để lỗi `relation "form_lookup_options" does not exist`).

networks:
  iot_postgres_internal_net:
    external: true
  dockge_default:
    external: true
```

### 2. Danh Mục Các Bảng Dữ Liệu Khởi Tạo (Từ 2 File Excel)

Hệ thống tự động khởi tạo và nạp đầy đủ dữ liệu từ 2 file Excel vào các bảng PostgreSQL và tệp JSON dự phòng:

| Tên Bảng (SQL) | Nguồn File Excel | Tên Sheet | Số Lượng Bản Ghi | Mô Tả & Các Cột Chính |
| :--- | :--- | :--- | :--- | :--- |
| **`requesters`** | `Name of reqester.xlsx` | `Requester` | 30 | Danh sách người yêu cầu: `stt`, `department`, `area`, `mnv`, `full_name`, `position`. |
| **`machines`** | `Name of reqester.xlsx` | `Machine list` | 121 | Danh mục thiết bị & máy in: `stt`, `area`, `machine_name`, `code`, `note`, `is_active`. |
| **`weekly_technical_requests`** | `Weekly_Technical_Dashboard_Database.xlsx` | `1_Technical_Requests` | 28 | Danh sách phiếu yêu cầu: `request_id`, `request_date`, `request_type`, `item_equipment`, `severity`, `status`, `sla_target_hours`, `actual_hours`, `met_sla`, `reported_by`, `resolved_by`. |
| **`defect_logs`** | `Weekly_Technical_Dashboard_Database.xlsx` | `2_Defect_Log` | 4 | Nhật ký sự cố kỹ thuật: `defect_id`, `defect_date`, `facility`, `source`, `root_cause_category`, `specific_issue`, `affected_product`, `downtime_minutes`, `recurring_issue`, `eight_d_required`. |
| **`action_plans`** | `Weekly_Technical_Dashboard_Database.xlsx` | `3_Action_Plan` | 5 | Kế hoạch hành động khắc phục: `action_id`, `date_logged`, `facility`, `related_defect_id`, `fix_type`, `description`, `pic`, `deadline`, `status`, `resource_needed`, `remarks`. |
| **`form_lookup_options`** | `Weekly_Technical_Dashboard_Database.xlsx` | `Lists_DO_NOT_DELETE` | 167 | Danh mục tùy chọn dropdown form: `category`, `item_value`, `item_label`, `sort_order`, `is_active`. |
| **`sheet_lists_do_not_delete`** | `Weekly_Technical_Dashboard_Database.xlsx` | `Lists_DO_NOT_DELETE` | 109 | Bảng nguyên mẫu 11 cột từ sheet: `row_index`, `request_id`, `request_type`, `item_equipment`, `severity`, `status_req`, `yes_no`, `source`, `root_cause`, `fix_type`, `status_act`, `resource_needed`. |
| **`technical_requests`** | Hệ thống Web Form | Form V4.1 | Động | Phiếu bảo trì đầy đủ: 4M, downtime, waste %, ảnh trước/sau, ký số. |
| **`users`** | Hệ thống Xác thực | RBAC | 3 | Tài khoản đăng nhập hệ thống: `admin`, `tech01`, `user01`. |

### 3. Các API Endpoints Truy Vấn Dữ Liệu

- `GET /api/requesters`: Xem danh sách người yêu cầu
- `POST /api/requesters`: Thêm/cập nhật người yêu cầu
- `GET /api/weekly-requests`: Xem danh sách phiếu yêu cầu kỹ thuật
- `POST /api/weekly-requests`: Thêm mới phiếu yêu cầu
- `PUT /api/weekly-requests/:id`: Sửa phiếu yêu cầu
- `DELETE /api/weekly-requests/:id`: Xóa phiếu yêu cầu
- `GET /api/defect-logs`: Xem danh mục lỗi Defect Log
- `POST /api/defect-logs`: Thêm lỗi mới
- `PUT /api/defect-logs/:id`: Cập nhật lỗi
- `DELETE /api/defect-logs/:id`: Xóa lỗi
- `GET /api/action-plans`: Xem danh sách Action Plan
- `POST /api/action-plans`: Thêm Action Plan mới
- `PUT /api/action-plans/:id`: Cập nhật Action Plan
- `DELETE /api/action-plans/:id`: Xóa Action Plan
- `GET /api/lookup-options?category=...`: Lấy danh sách dropdown theo loại (Request_Type, Severity, Status_Req, Root_Cause, Fix_Type, Status_Act, Resource_Needed, etc.)
- `GET /api/sheet-lists`: Xem dữ liệu nguyên dạng của sheet Lists_DO_NOT_DELETE

---

## 🔑 Tài Khoản Mặc Định (Default Credentials)

Hệ thống được thiết lập sẵn 3 tài khoản mẫu ứng với các vai trò khác nhau (mật khẩu mặc định: `Checkpoint@123`):

| Tên Đăng Nhập | Mật Khẩu | Vai Trò | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **`admin`** | `Checkpoint@123` | **ADMIN** | Toàn quyền: Truy cập cả Dashboard và Control Panel, xem phân tích sự cố, quản lý toàn bộ phiếu, máy móc, nhân sự và người dùng. |
| **`tech01`** | `Checkpoint@123` | **TECHNICIAN** | Kỹ thuật viên: Nhập & xử lý phiếu, phân tích nguyên nhân 4M, cập nhật downtime, quản lý máy móc & nhân sự. |
| **`user01`** | `Checkpoint@123` | **EMPLOYEE** | Nhân viên sản xuất: Nhập phiếu yêu cầu mới, xem lịch sử các phiếu của mình, xuất báo cáo PDF. |

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
