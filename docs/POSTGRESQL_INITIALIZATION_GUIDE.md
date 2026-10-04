# HƯỚNG DẪN KHỞI TẠO CƠ SỞ DỮ LIỆU POSTGRESQL
## CHECKPOINT SYSTEMS — TECHNICAL REQUEST MANAGEMENT SYSTEM
### Khắc phục triệt để lỗi: `relation "form_lookup_options" does not exist`

---

## 1. TỔNG QUAN & NGUYÊN NHÂN SỰ CỐ

### 1.1. Bối cảnh hệ thống
Hệ thống **Checkpoint Systems — Technical Request Management** áp dụng mô hình lưu trữ kép linh hoạt (Hybrid Persistence):
1. **PostgreSQL 16+**: Cơ sở dữ liệu quan hệ đóng vai trò là nguồn dữ liệu chuẩn (Single Source of Truth), quản lý toàn bộ 9 bảng nghiệp vụ bao gồm tài khoản, danh bạ nhân sự, thiết bị máy móc, phiếu yêu cầu kỹ thuật, nhật ký sự cố 8D, kế hoạch hành động và bảng danh mục lựa chọn giao diện.
2. **Local JSON Fallback (`data/`)**: Chế độ dự phòng khi máy chủ chưa kết nối được tới PostgreSQL, ứng dụng tiếp tục hoạt động thông qua các tệp JSON cục bộ để đảm bảo tính liên tục của sản xuất.

### 1.2. Nguyên nhân lỗi `relation "form_lookup_options" does not exist`
Lỗi phát sinh khi:
- Ứng dụng khởi động và kết nối thành công tới Database PostgreSQL trống (mới tạo) hoặc database chưa được khởi tạo schema đầy đủ.
- Phương thức `loadFromPg()` trong `DatabaseService` thực thi câu lệnh:
  ```sql
  SELECT * FROM form_lookup_options ORDER BY category, sort_order ASC;
  ```
  Nhưng bảng `form_lookup_options` chưa được tạo trong CSDL, dẫn đến lỗi runtime:
  ```
  QueryFailedError: relation "form_lookup_options" does not exist
  ```
- Hoặc biến môi trường `DB_AUTO_INIT` bị đặt là `false`, khiến hàm tự động tạo bảng `initPgSchema()` bị bỏ qua.

### 1.3. Giải pháp khắc phục
Hệ thống cung cấp **2 phương pháp** chuẩn để khởi tạo CSDL:
- **Cách 1 (Thủ công / Quản trị viên CSDL)**: Thực thi tệp kịch bản SQL DDL hoàn chỉnh `checkpoint_technical/config/init_database.sql` (hoặc `schema.sql`) qua các công cụ trực quan như **psql**, **pgAdmin 4**, **DBeaver** hoặc tự động nạp qua volume **Docker Compose**.
- **Cách 2 (Tự động - Khuyên dùng)**: Kích hoạt cơ chế tự sinh schema và nạp seed data tự động của ứng dụng bằng biến môi trường `DB_AUTO_INIT=true`.

---

## 2. THÔNG SỐ KẾT NỐI POSTGRESQL CHUẨN

Các thông số mặc định được đồng bộ trong toàn bộ mã nguồn, cấu hình Docker và tệp môi trường của Checkpoint Systems:

| Thông số | Tên biến môi trường (.env) | Giá trị mặc định | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Host** | `POSTGRES_HOST` / `DB_HOST` | `192.168.1.35` | IP máy chủ CSDL nội bộ (hoặc `localhost` / `postgres_db`) |
| **Port** | `POSTGRES_PORT` / `DB_PORT` | `5432` | Cổng tiêu chuẩn PostgreSQL |
| **Database** | `POSTGRES_DB` / `DB_NAME` | `checkpoint` | Tên cơ sở dữ liệu chính thức |
| **Username** | `POSTGRES_USER` / `DB_USERNAME` | `admin` | Tài khoản quản trị ứng dụng |
| **Password** | `POSTGRES_PASSWORD` / `DB_PASSWORD` | `Ph@nloi20031403` | Mật khẩu truy cập |
| **Auto Init** | `DB_AUTO_INIT` | `true` | Tự động tạo bảng & nạp seed khi boot |

**Chuỗi kết nối chuẩn (Connection String)**:
```
postgresql://admin:Ph@nloi20031403@192.168.1.35:5432/checkpoint
```

---

## 3. CÁCH 1: KHỞI TẠO THỦ CÔNG QUA SCRIPT SQL DDL

Tệp kịch bản DDL & Seed chuẩn được lưu trữ tại:
```
checkpoint_technical/config/init_database.sql
(hoặc checkpoint_technical/config/schema.sql)
```

Tệp script đã chứa sẵn:
1. Lệnh tạo Database `checkpoint` và kết nối ngữ cảnh (`\c checkpoint`).
2. Kích hoạt các extension: `uuid-ossp`, `pgcrypto`.
3. Định nghĩa hoàn chỉnh toàn bộ 9 bảng nghiệp vụ:
   - `users`: Tài khoản đăng nhập & phân quyền RBAC.
   - `requesters`: Danh bạ 30 nhân viên yêu cầu hỗ trợ kỹ thuật.
   - `machines`: Danh mục 121 thiết bị máy móc sản xuất.
   - `weekly_technical_requests`: Nhật ký 28 sự vụ hàng tuần (Weekly Dashboard).
   - `defect_logs`: Nhật ký 4 sự cố lỗi kỹ thuật phân tích 8D.
   - `action_plans`: 5 kế hoạch hành động khắc phục lỗi.
   - `form_lookup_options`: **167 mục lựa chọn danh mục dropdown động** (khắc phục dứt điểm lỗi thiếu bảng).
   - `sheet_lists_do_not_delete`: 109 dòng tham chiếu gốc Excel.
   - `technical_requests`: Phiếu yêu cầu kỹ thuật chi tiết Biểu mẫu V4.1.
4. Đầy đủ chỉ mục (`INDEX`) tối ưu hóa tốc độ truy vấn.
5. Bộ dữ liệu mẫu (`INSERT ... ON CONFLICT DO NOTHING`) đảm bảo tính toàn vẹn và không trùng lặp dữ liệu.

---

### Phương Án 1.1: Sử Dụng Dòng Lệnh `psql`

#### A. Chạy trực tiếp từ máy Client / Terminal phát triển
```bash
# 1. Di chuyển vào thư mục dự án
cd /workspace/steve/checkpoint_technical

# 2. Thực thi tệp script SQL (nhập mật khẩu Ph@nloi20031403 khi được hỏi)
PGPASSWORD='Ph@nloi20031403' psql -h 192.168.1.35 -p 5432 -U admin -d postgres -f config/init_database.sql
```

*Lưu ý*: Nếu kết nối ban đầu vào database `postgres`, script sẽ tự động tạo database `checkpoint` và switch sang kết nối `checkpoint`. Nếu đã tạo database `checkpoint` từ trước, bạn có thể thực thi trực tiếp vào `checkpoint`:
```bash
PGPASSWORD='Ph@nloi20031403' psql -h 192.168.1.35 -p 5432 -U admin -d checkpoint -f config/schema.sql
```

#### B. Chạy qua Docker Exec (khi PostgreSQL chạy trong container)
```bash
# Giả sử container PostgreSQL tên là "checkpoint_postgres" hoặc "postgres_db"
docker exec -i checkpoint_postgres psql -U admin -d checkpoint < config/init_database.sql
```

---

### Phương Án 1.2: Sử Dụng pgAdmin 4

1. **Kết nối tới Server**:
   - Mở pgAdmin 4.
   - Nhấp chuột phải vào **Servers** -> **Register** -> **Server...**.
   - Tab **General**: Đặt tên gợi nhớ (vd: `Checkpoint Server 192.168.1.35`).
   - Tab **Connection**:
     - *Host name/address*: `192.168.1.35`
     - *Port*: `5432`
     - *Maintenance database*: `postgres` (hoặc `checkpoint`)
     - *Username*: `admin`
     - *Password*: `Ph@nloi20031403` (tích chọn *Save password*).
   - Nhấn **Save**.

2. **Tạo Cơ Sở Dữ Liệu (Nếu chưa có)**:
   - Trong cây điều hướng bên trái, chuột phải vào **Databases** -> **Create** -> **Database...**.
   - *Database*: `checkpoint`
   - *Owner*: `admin`
   - Nhấn **Save**.

3. **Thực thi Script SQL**:
   - Nhấp chuột phải vào Database `checkpoint` vừa tạo -> chọn **Query Tool**.
   - Bấm biểu tượng **Open File** (thư mục mở) trên thanh công cụ, chọn tệp:
     `checkpoint_technical/config/init_database.sql` (hoặc mở file copy toàn bộ nội dung dán vào khung soạn thảo).
   - Nhấn nút **Execute / Refresh** (biểu tượng hình tam giác Play ▶ hoặc bấm phím tắt `F5`).
   - Thông báo kết quả hiển thị tại tab **Data Output / Messages**:
     `Query returned successfully in ... msec`.

4. **Kiểm tra kết quả**:
   - Mở rộng nhánh `checkpoint` -> **Schemas** -> **public** -> **Tables**.
   - Nhấp chuột phải vào **Tables** chọn **Refresh**.
   - Xác nhận có đủ **9 bảng**: `users`, `requesters`, `machines`, `weekly_technical_requests`, `defect_logs`, `action_plans`, `form_lookup_options`, `sheet_lists_do_not_delete`, `technical_requests`.

---

### Phương Án 1.3: Sử Dụng DBeaver Community

1. **Tạo Kết Nối Mới**:
   - Khởi động DBeaver.
   - Chọn menu **Database** -> **New Database Connection**.
   - Chọn driver **PostgreSQL** -> Nhấn **Next**.
   - Cấu hình thông số kết nối:
     - *Host*: `192.168.1.35`
     - *Port*: `5432`
     - *Database*: `checkpoint`
     - *Authentication*: Database Native
     - *Username*: `admin`
     - *Password*: `Ph@nloi20031403`
   - Nhấn nút **Test Connection...** để đảm bảo thông mạng.
   - Nhấn **Finish**.

2. **Chạy Kịch Bản SQL**:
   - Chuột phải vào kết nối vừa tạo -> chọn **SQL Editor** -> **New SQL Script** (hoặc phím tắt `F3`).
   - Mở tệp `checkpoint_technical/config/init_database.sql` kéo thả vào DBeaver hoặc copy toàn bộ nội dung tệp dán vào.
   - Nhấn tổ hợp phím **Alt + X** (hoặc chọn biểu tượng **Execute SQL Script** trên thanh công cụ bên trái của cửa sổ SQL).
   - DBeaver sẽ thực thi tuần tự toàn bộ các lệnh DDL và INSERT seed data.

3. **Xác nhận**:
   - Mở rộng cây điều hướng: `checkpoint` -> `Databases` -> `checkpoint` -> `Schemas` -> `public` -> `Tables`.
   - Xem dữ liệu bảng `form_lookup_options`: Chuột phải -> **View Data** (F4), kiểm tra có đủ 167 dòng dữ liệu.

---

### Phương Án 1.4: Tự Động Khởi Tạo Khi Dùng Docker Compose (Initdb Container)

Nếu triển khai mới toàn bộ ngăn xếp gồm PostgreSQL và ứng dụng bằng `docker-compose.yml`, mount trực tiếp tệp SQL vào thư mục `/docker-entrypoint-initdb.d/`:

```yaml
version: "3.8"

services:
  postgres_db:
    image: postgres:16-alpine
    container_name: checkpoint_postgres_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: checkpoint
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: Ph@nloi20031403
    volumes:
      - pg_data:/var/lib/postgresql/data
      # File SQL sẽ được PostgreSQL tự động thực thi khi khởi tạo container lần đầu
      - ./config/init_database.sql:/docker-entrypoint-initdb.d/01_init.sql:ro
    ports:
      - "5432:5432"
    networks:
      - checkpoint_net

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: checkpoint_technical_app
    restart: unless-stopped
    depends_on:
      - postgres_db
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - NODE_ENV=production
      - POSTGRES_HOST=postgres_db
      - POSTGRES_PORT=5432
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=Ph@nloi20031403
      - POSTGRES_DB=checkpoint
      - DB_AUTO_INIT=true
    volumes:
      - ./data:/app/data
    networks:
      - checkpoint_net

volumes:
  pg_data:

networks:
  checkpoint_net:
    driver: bridge
```

---

## 4. CÁCH 2: TỰ ĐỘNG KHỞI TẠO QUA BIẾN MÔI TRƯỜNG `DB_AUTO_INIT=true` (KHUYÊN DÙNG)

Đây là giải pháp **tối ưu nhất, không cần can thiệp thủ công** vào CSDL, thích hợp cho môi trường CI/CD và triển khai tự động.

### 4.1. Cơ Chế Hoạt Động Của DatabaseService Trong NestJS
Khi ứng dụng khởi động (`OnModuleInit`), module `DatabaseService` thực hiện tuần tự:
1. **Kết nối PostgreSQL**: Thử kết nối lần lượt các host ứng viên (`POSTGRES_HOST`, `192.168.1.35`, `postgres_db`, `localhost`, `127.0.0.1`).
2. **Kiểm tra cờ `DB_AUTO_INIT`**:
   - Nếu `DB_AUTO_INIT !== 'false'` (mặc định = `true`):
     - Gọi `initPgSchema()`: Tự động chạy `CREATE EXTENSION IF NOT EXISTS` và `CREATE TABLE IF NOT EXISTS` cho đủ **9 bảng** nghiệp vụ cùng các chỉ mục.
     - Tự động chạy `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` để đảm bảo tương thích ngược nếu schema có bổ sung cột mới (như `shift`, `estimated_cost`).
     - Gọi `seedDefaults()`: Tự động nạp dữ liệu ban đầu cho các bảng rỗng:
       - 3 tài khoản quản trị và kỹ thuật mặc định (`admin`, `tech01`, `user01`).
       - 30 nhân viên yêu cầu từ `requesters.json`.
       - 121 thiết bị máy móc từ `machines.json`.
       - **167 danh mục metadata từ `form_lookup_options.json`**.
       - 109 dòng tham chiếu Excel từ `sheet_lists_do_not_delete.json`.
3. **Đồng bộ Cache**: Nạp dữ liệu từ PostgreSQL vào bộ nhớ RAM của ứng dụng (`loadFromPg()`) với tốc độ truy vấn sub-millisecond.

### 4.2. Cách Cấu Hình
Chỉ cần đảm bảo tệp `.env` hoặc cấu hình Docker chứa:

Trong tệp `.env`:
```env
# Kích hoạt tự động khởi tạo cơ sở dữ liệu
DB_AUTO_INIT=true

# Thông số kết nối PostgreSQL
POSTGRES_HOST=192.168.1.35
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=Ph@nloi20031403
POSTGRES_DB=checkpoint
```

Khởi chạy ứng dụng:
```bash
cd checkpoint_technical
npm run build
npm run start:prod
```

---

## 5. BẢNG KIỂM TRA ĐỐI CHIẾU 9 BẢNG & TRUY VẤN XÁC MINH (VERIFICATION CHECKLIST)

### 5.1. Danh Sách 9 Bảng & Dữ Liệu Khởi Tạo Chuẩn

| STT | Tên Bảng (Table Name) | Mô Tả Nghiệp Vụ | Số Bản Ghi Seed Chuẩn |
| :---: | :--- | :--- | :---: |
| 1 | `users` | Tài khoản đăng nhập hệ thống & RBAC | 3 |
| 2 | `requesters` | Danh bạ nhân viên yêu cầu sửa chữa | 30 |
| 3 | `machines` | Danh mục máy móc thiết bị sản xuất | 121 |
| 4 | `weekly_technical_requests` | Nhật ký sự cố kỹ thuật hàng tuần (SLA) | 28 |
| 5 | `defect_logs` | Nhật ký sự cố lỗi 8D | 4 |
| 6 | `action_plans` | Kế hoạch hành động khắc phục lỗi | 5 |
| 7 | **`form_lookup_options`** | **Danh mục các dropdown động (Dropdown Options)** | **167** |
| 8 | `sheet_lists_do_not_delete` | Dòng tham chiếu gốc Excel | 109 |
| 9 | `technical_requests` | Phiếu yêu cầu kỹ thuật biểu mẫu V4.1 | >= 1 |

---

### 5.2. Các Câu Lệnh SQL Xác Minh Tính Toàn Vẹn

Mở SQL Tool (psql, DBeaver, pgAdmin) và chạy các truy vấn sau:

```sql
-- 1. Kiểm tra danh sách đủ 9 bảng trong schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Kiểm tra số lượng bản ghi của toàn bộ 9 bảng
SELECT 'users' AS table_name, count(*) AS total_rows FROM users
UNION ALL
SELECT 'requesters', count(*) FROM requesters
UNION ALL
SELECT 'machines', count(*) FROM machines
UNION ALL
SELECT 'weekly_technical_requests', count(*) FROM weekly_technical_requests
UNION ALL
SELECT 'defect_logs', count(*) FROM defect_logs
UNION ALL
SELECT 'action_plans', count(*) FROM action_plans
UNION ALL
SELECT 'form_lookup_options', count(*) FROM form_lookup_options
UNION ALL
SELECT 'sheet_lists_do_not_delete', count(*) FROM sheet_lists_do_not_delete
UNION ALL
SELECT 'technical_requests', count(*) FROM technical_requests;

-- 3. Kiểm tra phân loại danh mục trong bảng form_lookup_options
SELECT category, count(*) AS item_count 
FROM form_lookup_options 
GROUP BY category 
ORDER BY item_count DESC;

-- 4. Kiểm tra tài khoản quản trị admin có tồn tại
SELECT id, username, role, full_name, is_active FROM users WHERE username = 'admin';
```

---

## 6. KIỂM THỬ BIÊN DỊCH & LOG VẬN HÀNH CHUẨN

### 6.1. Kiểm thử biên dịch TypeScript (NestJS)
```bash
cd /workspace/steve/checkpoint_technical
npm run build
```
Kết quả mong đợi:
```
> checkpoint-technical@1.0.0 prebuild
> node -e "try { require('fs').rmSync('dist', { recursive: true, force: true }); } catch(e) {}"

> checkpoint-technical@1.0.0 build
> nest build && node -e "try { require('fs').cpSync('public', 'dist/public', { recursive: true }); } catch(e) {}"
```
Quá trình build thành công hoàn toàn, không có bất kỳ lỗi cú pháp hoặc thiếu kiểu dữ liệu nào.

### 6.2. Log Khởi Động Thành Công Mẫu (Boot Logs)
Khi khởi động ứng dụng với `npm run start:prod` hoặc Docker, console sẽ hiển thị các dấu tick xanh xác nhận:
```text
[Nest] 1024  - 10/04/2026, 06:30:00 AM     LOG [DatabaseService] ✅ Connected to PostgreSQL database: 192.168.1.35:5432/checkpoint
[Nest] 1024  - 10/04/2026, 06:30:01 AM     LOG [DatabaseService] ✅ PostgreSQL Schema verified / initialized (users, requesters, machines, weekly_technical_requests, defect_logs, action_plans, form_lookup_options, sheet_lists_do_not_delete, technical_requests)
[Nest] 1024  - 10/04/2026, 06:30:01 AM     LOG [DatabaseService] ✅ Loaded from PostgreSQL: 3 users, 30 requesters, 121 machines, 167 lookup options, 28 weekly requests, 4 defect logs, 5 action plans, 109 sheet lists, 1 technical requests.
[Nest] 1024  - 10/04/2026, 06:30:01 AM     LOG [NestApplication] Nest application successfully started
[Nest] 1024  - 10/04/2026, 06:30:01 AM     LOG 🚀 Server is running on: http://localhost:3001
[Nest] 1024  - 10/04/2026, 06:30:01 AM     LOG 📚 Swagger API documentation: http://localhost:3001/api/docs
```

---

## 7. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

| Hiện Tượng | Nguyên Nhân | Biện Pháp Khắc Phục |
| :--- | :--- | :--- |
| `relation "form_lookup_options" does not exist` | CSDL chưa chạy script DDL hoặc `DB_AUTO_INIT=false` | Đặt `DB_AUTO_INIT=true` trong `.env` hoặc thực thi `config/init_database.sql` qua psql/pgAdmin/DBeaver. |
| `Connection refused: 192.168.1.35:5432` | Máy chủ DB không mở cổng hoặc sai địa chỉ IP | Kiểm tra mạng LAN tới `192.168.1.35`, kiểm tra service PostgreSQL đang chạy. Ứng dụng tự động chuyển sang chế độ dự phòng JSON nên không bị gián đoạn. |
| `FATAL: password authentication failed for user "admin"` | Sai mật khẩu cấu hình | Kiểm tra lại biến `POSTGRES_PASSWORD=Ph@nloi20031403`. |
| `database "checkpoint" does not exist` | Chưa tạo Database trên máy chủ | Tạo database bằng lệnh `CREATE DATABASE checkpoint;` qua user postgres trước khi chạy script. |
| `permission denied for schema public` | User `admin` thiếu quyền ghi | Cấp quyền: `GRANT ALL ON SCHEMA public TO admin; GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;` |

---
*Tài liệu được biên soạn và bảo trì bởi Đội ngũ Kỹ thuật & Quản trị Cơ sở Dữ liệu — Checkpoint Systems.*
