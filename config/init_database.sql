-- ==============================================================================
-- CHECKPOINT SYSTEMS — POSTGRESQL DATABASE INITIALIZATION SCRIPT
-- ==============================================================================
-- Tệp cấu hình: checkpoint_technical/config/init_database.sql
-- Mục đích: Khởi tạo mới hoặc tái tạo toàn bộ CSDL "checkpoint_technical" cho hệ thống Checkpoint Technical.
-- Khắc phục: Lỗi relation "form_lookup_options" does not exist, tạo đầy đủ 9 bảng.
-- Tương thích: PostgreSQL 14, 15, 16+
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TẠO CƠ SỞ DỮ LIỆU CHECKPOINT_TECHNICAL & THIẾT LẬP KẾT NỐI
-- ------------------------------------------------------------------------------
-- Lưu ý: Chạy lệnh dưới đây với quyền postgres / superuser trên server.
-- Nếu cơ sở dữ liệu đã tồn tại sẵn, có thể bỏ qua lệnh CREATE DATABASE này.
CREATE DATABASE checkpoint_technical;

-- Chuyển kết nối tới cơ sở dữ liệu checkpoint_technical vừa tạo:
\c checkpoint_technical;

-- Cấu hình chuẩn cho mã hóa ký tự UTF-8 và xử lý chuỗi:
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ------------------------------------------------------------------------------
-- 2. KÍCH HOẠT TIỆN ÍCH MỞ RỘNG (EXTENSIONS)
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 3. TẠO CẤU TRÚC 9 BẢNG DỮ LIỆU & INDEXES (DDL SCHEMA)
-- ------------------------------------------------------------------------------

-- 3.1. Bảng users (Quản lý người dùng, mật khẩu bcrypt và phân quyền RBAC)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3.2. Bảng requesters (Danh bạ nhân sự yêu cầu hỗ trợ kỹ thuật)
CREATE TABLE IF NOT EXISTS requesters (
  id VARCHAR(255) PRIMARY KEY,
  stt INT,
  department VARCHAR(255),
  area VARCHAR(255),
  mnv VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_requesters_mnv ON requesters(mnv);
CREATE INDEX IF NOT EXISTS idx_requesters_area ON requesters(area);

-- 3.3. Bảng machines (Danh mục máy móc & công nghệ in)
CREATE TABLE IF NOT EXISTS machines (
  id VARCHAR(255) PRIMARY KEY,
  stt INT DEFAULT 0,
  tech VARCHAR(255),
  name VARCHAR(255),
  area VARCHAR(255),
  machine_name VARCHAR(255),
  code VARCHAR(100),
  note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_machines_tech ON machines(tech);
CREATE INDEX IF NOT EXISTS idx_machines_name ON machines(name);
CREATE INDEX IF NOT EXISTS idx_machines_area ON machines(area);
CREATE INDEX IF NOT EXISTS idx_machines_machine_name ON machines(machine_name);

-- 3.4. Bảng weekly_technical_requests (Báo cáo sự vụ kỹ thuật hàng tuần)
CREATE TABLE IF NOT EXISTS weekly_technical_requests (
  id VARCHAR(255) PRIMARY KEY,
  request_id VARCHAR(255) NOT NULL,
  request_date VARCHAR(50),
  request_type VARCHAR(255),
  item_equipment VARCHAR(255),
  severity VARCHAR(100),
  status VARCHAR(100),
  sla_target_hours NUMERIC,
  actual_hours NUMERIC,
  met_sla VARCHAR(50),
  reported_by VARCHAR(255),
  resolved_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wtr_req_id ON weekly_technical_requests(request_id);
CREATE INDEX IF NOT EXISTS idx_wtr_status ON weekly_technical_requests(status);
CREATE INDEX IF NOT EXISTS idx_wtr_equipment ON weekly_technical_requests(item_equipment);

-- 3.5. Bảng defect_logs (Nhật ký sự cố & phân tích lỗi 8D)
CREATE TABLE IF NOT EXISTS defect_logs (
  id VARCHAR(255) PRIMARY KEY,
  defect_id INT NOT NULL,
  defect_date VARCHAR(50),
  facility VARCHAR(255),
  source VARCHAR(255),
  root_cause_category VARCHAR(255),
  specific_issue TEXT,
  affected_product TEXT,
  downtime_minutes VARCHAR(100),
  recurring_issue VARCHAR(50),
  eight_d_required VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_defect_logs_defect_id ON defect_logs(defect_id);
CREATE INDEX IF NOT EXISTS idx_defect_logs_facility ON defect_logs(facility);

-- 3.6. Bảng action_plans (Kế hoạch hành động xử lý và phòng ngừa)
CREATE TABLE IF NOT EXISTS action_plans (
  id VARCHAR(255) PRIMARY KEY,
  action_id VARCHAR(100) NOT NULL,
  date_logged VARCHAR(50),
  facility VARCHAR(255),
  related_defect_id VARCHAR(100),
  fix_type VARCHAR(255),
  description TEXT,
  pic VARCHAR(255),
  deadline VARCHAR(50),
  status VARCHAR(100),
  resource_needed VARCHAR(255),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_action_plans_action_id ON action_plans(action_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_status ON action_plans(status);

-- 3.7. Bảng form_lookup_options (Danh mục tùy chọn dropdown form V4.1)
CREATE TABLE IF NOT EXISTS form_lookup_options (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  item_value VARCHAR(255) NOT NULL,
  item_label VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lookup_category ON form_lookup_options(category);
CREATE INDEX IF NOT EXISTS idx_lookup_active ON form_lookup_options(is_active);

-- 3.8. Bảng sheet_lists_do_not_delete (Dữ liệu đối chiếu gốc từ Excel Lists_DO_NOT_DELETE)
CREATE TABLE IF NOT EXISTS sheet_lists_do_not_delete (
  id VARCHAR(255) PRIMARY KEY,
  row_index INT,
  request_id VARCHAR(255),
  request_type VARCHAR(255),
  item_equipment VARCHAR(255),
  severity VARCHAR(100),
  status_req VARCHAR(100),
  yes_no VARCHAR(50),
  source VARCHAR(255),
  root_cause VARCHAR(255),
  fix_type VARCHAR(255),
  status_act VARCHAR(100),
  resource_needed VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sheet_lists_row ON sheet_lists_do_not_delete(row_index);

-- 3.9. Bảng technical_requests (Phiếu yêu cầu kỹ thuật chi tiết Biểu Mẫu V4.1)
CREATE TABLE IF NOT EXISTS technical_requests (
  id VARCHAR(255) PRIMARY KEY,
  doc_no VARCHAR(255) UNIQUE NOT NULL,
  req_date VARCHAR(50),
  req_time VARCHAR(50),
  req_by VARCHAR(255),
  print_tech VARCHAR(255),
  machine_name VARCHAR(255),
  problem TEXT,
  machine_status VARCHAR(100),
  priority VARCHAR(100),
  priority_other TEXT,
  recv_by VARCHAR(255),
  recv_date VARCHAR(50),
  recv_time VARCHAR(50),
  finish_date VARCHAR(50),
  finish_time VARCHAR(50),
  downtime NUMERIC DEFAULT 0,
  root_cause TEXT,
  action_taken TEXT,
  err_cat VARCHAR(100),
  err_type VARCHAR(100),
  photos_before JSONB DEFAULT '[]'::jsonb,
  photos_after JSONB DEFAULT '[]'::jsonb,
  chk_quality VARCHAR(50),
  chk_status VARCHAR(50),
  work_order VARCHAR(255),
  wo_total_qty NUMERIC DEFAULT 0,
  waste_qty NUMERIC DEFAULT 0,
  waste_unit VARCHAR(50),
  waste_percent VARCHAR(50),
  prod_mgr VARCHAR(255),
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS doc_no VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS req_date VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS req_time VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS req_by VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS print_tech VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS machine_name VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS problem TEXT;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS machine_status VARCHAR(100);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS priority VARCHAR(100);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS priority_other TEXT;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS recv_by VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS recv_date VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS recv_time VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS finish_date VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS finish_time VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS downtime NUMERIC DEFAULT 0;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS root_cause TEXT;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS action_taken TEXT;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS err_cat VARCHAR(100);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS err_type VARCHAR(100);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS photos_before JSONB DEFAULT '[]'::jsonb;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS photos_after JSONB DEFAULT '[]'::jsonb;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS chk_quality VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS chk_status VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS work_order VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS wo_total_qty NUMERIC DEFAULT 0;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS waste_qty NUMERIC DEFAULT 0;
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS waste_unit VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS waste_percent VARCHAR(50);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS prod_mgr VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE technical_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
CREATE INDEX IF NOT EXISTS idx_tech_req_doc_no ON technical_requests(doc_no);
CREATE INDEX IF NOT EXISTS idx_tech_req_created_at ON technical_requests(created_at);

-- ------------------------------------------------------------------------------
-- 4. DỮ LIỆU MẪU BAN ĐẦU (SEED DATA TỪ HỆ THỐNG GỐC EXCEL & JSON)
-- ------------------------------------------------------------------------------

-- 4.1. Seed bảng users (3 tài khoản chuẩn: admin, tech01, user01 - Mật khẩu mặc định: Checkpoint@123)
INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES ('user-admin-1', 'admin', 'admin@checkpointsystems.com', '$2a$10$d883mgjdQ8gjFw53m1SnRu0LVdyrH1r9ZGf1Ao3lvDgp2hqCI/YAW', 'Super Administrator', 'ADMIN', true, '2026-10-03T08:28:04.802Z', '2026-10-03T08:28:04.802Z') ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES ('user-tech-1', 'tech01', 'tech01@checkpointsystems.com', '$2a$10$d883mgjdQ8gjFw53m1SnRu0LVdyrH1r9ZGf1Ao3lvDgp2hqCI/YAW', 'Kỹ Thuật Viên Trưởng', 'TECHNICIAN', true, '2026-10-03T08:28:04.802Z', '2026-10-03T08:28:04.802Z') ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES ('user-emp-1', 'user01', 'user01@checkpointsystems.com', '$2a$10$d883mgjdQ8gjFw53m1SnRu0LVdyrH1r9ZGf1Ao3lvDgp2hqCI/YAW', 'Nguyễn Văn A (SX)', 'EMPLOYEE', true, '2026-10-03T08:28:04.802Z', '2026-10-03T08:28:04.802Z') ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = EXCLUDED.is_active;

-- 4.2. Seed bảng requesters (30 nhân sự)
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5117', 1, 'Production', 'Production', 'VN5117', 'Lê Minh Hoàng', 'Assistant Production Manager') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5898', 2, 'Production', 'Production', 'VN5898', 'Phạm Hùng Sơn', 'Supervisor Production') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5207', 3, 'Production', 'PFL', 'VN5207', 'Lục Xuân Trường', 'PFL Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5430', 4, 'Production', 'PFL', 'VN5430', 'Trần Công Hậu', 'PFL Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5356', 5, 'Production', 'RFID', 'VN5356', 'Phan Thị Thêm', 'RFID Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5855', 6, 'Production', 'RFID', 'VN5855', 'Đỗ Văn Vẹn', 'RFID Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN6024', 7, 'Production', 'Woven', 'VN6024', 'Phạm Văn Tuấn', 'Woven Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN6173', 8, 'Production', 'HTL', 'VN6173', 'Lâm Hữu Phước', 'HTL Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5805', 9, 'Production', 'Ink mix', 'VN5805', 'Nguyễn Quốc Cường', 'Inkmix Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5454', 10, 'Production', 'OFFSET', 'VN5454', 'Quách Tiến Dũng', 'OFFSET Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5571', 11, 'Production', 'Packing', 'VN5571', 'Trần Thị Loan', 'Packing Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5456', 12, 'Production', 'QA', 'VN5456', 'Nguyễn Ngọc Mỹ', 'QC Team Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5381', 13, 'Production', 'SnP', 'VN5381', 'Nguyễn Thị Thanh Hồng', 'SnP Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5741', 14, 'Production', 'SnP', 'VN5741', 'Huỳnh Thị Thanh Lên', 'SnP Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5634', 15, 'Production', 'Digital', 'VN5634', 'Nguyễn Văn Khỏe', 'Digital Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5663', 16, 'Production', 'Diecut', 'VN5663', 'Nguyễn Văn Thể', 'Diecut Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN6048', 17, 'Production', 'HTL', 'VN6048', 'Nguyễn Thành Sang', 'HTL Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5944', 18, 'Production', 'Process', 'VN5944', 'Đỗ Đức Nhật', 'Process Eng') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5830', 19, 'QA', 'QA', 'VN5830', 'Lê Đình Bình', 'QC Team Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5900', 20, 'QA', 'QA', 'VN5900', 'Mai Nhật Tân', 'QC Team Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5696', 21, 'QA', 'QA', 'VN5696', 'TRẦN QUANG HẢI', 'QA  Assistant Manager') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5793', 22, 'QA', 'QA', 'VN5793', 'PHẠM VIỆT KHÁI', 'QA Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5899', 23, 'QA', 'QA', 'VN5899', 'CAO ĐĂNG KHOA', 'QA Leader') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5831', 24, 'Maintenance', 'Maintenance', 'VN5831', 'Trương Hoàng Anh', 'Maintenance Manager') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5789', 25, 'Maintenance', 'Maintenance', 'VN5789', 'Trần Thanh Hóa', 'Maintenance') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5995', 26, 'Maintenance', 'Maintenance', 'VN5995', 'Phùng Thanh Vũ', 'Maintenance') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5813', 27, 'EHS', 'EHS', 'VN5813', 'Nguyễn Thị Xuân', 'EHS Specialist') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5901', 28, 'HR', 'HR', 'VN5901', 'Nguyễn Thị Thoa', 'HR Executive') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5875', 29, 'IT', 'HR', 'VN5875', 'Lê Trường', 'IT Specialist') ON CONFLICT (mnv) DO NOTHING;
INSERT INTO requesters (id, stt, department, area, mnv, full_name, position) VALUES ('req-VN5810', 30, 'Warehouse', 'Warehouse', 'VN5810', 'Nông Ích Nam', 'Warehouse Team Leader') ON CONFLICT (mnv) DO NOTHING;

-- 4.3. Seed bảng machines (121 thiết bị máy móc)
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-1', 1, 'PFL', 'PFL1', 'PFL', 'PFL1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-2', 2, 'PFL', 'PFL2', 'PFL', 'PFL2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-3', 3, 'PFL', 'PFL3', 'PFL', 'PFL3', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-4', 4, 'PFL', 'PFL4', 'PFL', 'PFL4', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-5', 5, 'PFL', 'PFL5', 'PFL', 'PFL5', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-6', 6, 'PFL', 'PFL6', 'PFL', 'PFL6', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-7', 7, 'PFL', 'C&F1', 'PFL', 'C&F1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-8', 8, 'PFL', 'C&F2', 'PFL', 'C&F2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-9', 9, 'PFL', 'C&F3', 'PFL', 'C&F3', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-10', 10, 'PFL', 'C&F4', 'PFL', 'C&F4', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-11', 11, 'PFL', 'C&F5', 'PFL', 'C&F5', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-12', 12, 'PFL', 'C&F6', 'PFL', 'C&F6', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-13', 13, 'PFL', 'C&F7', 'PFL', 'C&F7', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-14', 14, 'PFL', 'C&F8', 'PFL', 'C&F8', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-15', 15, 'PFL', 'C&F9', 'PFL', 'C&F9', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-16', 16, 'PFL', 'C&F10', 'PFL', 'C&F10', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-17', 17, 'PFL', 'C&F11', 'PFL', 'C&F11', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-18', 18, 'PFL', 'C&F12', 'PFL', 'C&F12', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-19', 19, 'PFL', 'C&F13', 'PFL', 'C&F13', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-20', 20, 'PFL', 'C&F14', 'PFL', 'C&F14', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-21', 21, 'PFL', 'C&F15', 'PFL', 'C&F15', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-22', 22, 'PFL', 'C&F16', 'PFL', 'C&F16', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-23', 23, 'PFL', 'C&F17', 'PFL', 'C&F17', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-24', 24, 'PFL', 'C&F18', 'PFL', 'C&F18', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-25', 25, 'PFL', 'C&F19', 'PFL', 'C&F19', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-26', 26, 'PFL', 'C&F20', 'PFL', 'C&F20', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-27', 27, 'PFL', 'Inspection System', 'PFL', 'Inspection System', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-28', 28, 'PFL', 'EAS-1', 'PFL', 'EAS-1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-29', 29, 'PFL', 'Máy sấy Focus', 'PFL', 'Máy sấy Focus', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-30', 30, 'PFL', 'Máy sấy PFL', 'PFL', 'Máy sấy PFL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-31', 31, 'OFFSET', 'Máy co nhiệt', 'OFFSET', 'Máy co nhiệt', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-32', 32, 'OFFSET', 'LAMINATION FBK 800', 'OFFSET', 'LAMINATION FBK 800', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-33', 33, 'OFFSET', 'SM 52 - 5 colors', 'OFFSET', 'SM 52 - 5 colors', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-34', 34, 'OFFSET', 'SX 52 - 6 colors', 'OFFSET', 'SX 52 - 6 colors', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-35', 35, 'RFID', 'Laser printer 1', 'RFID', 'Laser printer 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-36', 36, 'RFID', 'Laser printer 2', 'RFID', 'Laser printer 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-37', 37, 'RFID', 'Laser cut', 'RFID', 'Laser cut', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-38', 38, 'HTL', 'ATMA', 'HTL', 'ATMA', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-39', 39, 'HTL', 'GSF Powder dusting' || CHR(10) || 'HTL', 'HTL', 'GSF Powder dusting' || CHR(10) || 'HTL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-40', 40, 'HTL', 'Automatic Flat Conveyor' || CHR(10) || 'HTL', 'HTL', 'Automatic Flat Conveyor' || CHR(10) || 'HTL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-41', 41, 'HTL', 'Automatic Sheet Stacker' || CHR(10) || 'HTL', 'HTL', 'Automatic Sheet Stacker' || CHR(10) || 'HTL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-42', 42, 'HTL', 'Chiller HTL', 'HTL', 'Chiller HTL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-43', 43, 'Die Cut', 'HT760', 'Die Cut', 'HT760', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-44', 44, 'Die Cut', 'HT760T', 'Die Cut', 'HT760T', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-45', 45, 'Digital', 'IR Coating', 'Digital', 'IR Coating', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-46', 46, 'OFFSET', 'Polar_(PO L0)', 'OFFSET', 'Polar_(PO L0)', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-47', 47, 'RFID', 'CLS P2P 1', 'RFID', 'CLS P2P 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-48', 48, 'RFID', 'CLS P2P 2', 'RFID', 'CLS P2P 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-49', 49, 'RFID', 'CLS R2R', 'RFID', 'CLS R2R', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-50', 50, 'Die Cut', 'Rotary cutting machine(CLS)', 'Die Cut', 'Rotary cutting machine(CLS)', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-51', 51, 'OFFSET', 'CLS Labeling', 'OFFSET', 'CLS Labeling', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-52', 52, 'RFID', 'Care Label Feeder', 'RFID', 'Care Label Feeder', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-53', 53, 'RFID', 'Ecopet G1', 'RFID', 'Ecopet G1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-54', 54, 'RFID', 'Ecopet G2', 'RFID', 'Ecopet G2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-55', 55, 'Digital', 'HP 7K chiller 1_Origin', 'Digital', 'HP 7K chiller 1_Origin', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-56', 56, 'Digital', 'HP Indigo 7K digital press', 'Digital', 'HP Indigo 7K digital press', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-57', 57, 'RFID', 'RFID1', 'RFID', 'RFID1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-58', 58, 'RFID', 'RFID2', 'RFID', 'RFID2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-59', 59, 'RFID', 'RFID3', 'RFID', 'RFID3', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-60', 60, 'RFID', 'RFID4', 'RFID', 'RFID4', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-61', 61, 'RFID', 'RFID5', 'RFID', 'RFID5', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-62', 62, 'RFID', 'RFID6', 'RFID', 'RFID6', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-63', 63, 'RFID', 'RFID7', 'RFID', 'RFID7', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-64', 64, 'RFID', 'AFINA', 'RFID', 'AFINA', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-65', 65, 'RFID', 'ITD (ETUN)', 'RFID', 'ITD (ETUN)', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-66', 66, 'RFID', 'TOSHIBA', 'RFID', 'TOSHIBA', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-67', 67, 'RFID', 'Epson 1', 'RFID', 'Epson 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-68', 68, 'RFID', 'Epson 2', 'RFID', 'Epson 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-69', 69, 'Warehouse', 'Forklift', 'Warehouse', 'Forklift', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-70', 70, 'SnP', 'Taping  Machine 1', 'SnP', 'Taping  Machine 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-71', 71, 'SnP', 'Taping  Machine 2', 'SnP', 'Taping  Machine 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-72', 72, 'SnP', 'Taping  Machine 3', 'SnP', 'Taping  Machine 3', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-73', 73, 'HTL', 'Heat Press Machine', 'HTL', 'Heat Press Machine', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-74', 74, 'QA', 'Spectrophotometer', 'QA', 'Spectrophotometer', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-75', 75, 'QA', 'Washing machine 1', 'QA', 'Washing machine 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-76', 76, 'QA', 'Washing machine 2', 'QA', 'Washing machine 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-77', 77, 'QA', 'Enviroment chamber', 'QA', 'Enviroment chamber', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-78', 78, 'QA', 'Drying machine 1', 'QA', 'Drying machine 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-79', 79, 'QA', 'Drying machine 2', 'QA', 'Drying machine 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-80', 80, 'QA', 'Water boiler 1', 'QA', 'Water boiler 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-81', 81, 'QA', 'Water boiller 2', 'QA', 'Water boiller 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-82', 82, 'Digital', 'UV Coating', 'Digital', 'UV Coating', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-83', 83, 'OFFSET', 'GWS Cutting machine', 'OFFSET', 'GWS Cutting machine', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-84', 84, 'Digital', 'Gluing Machine (Máy bồi tay)', 'Digital', 'Gluing Machine (Máy bồi tay)', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-85', 85, 'Digital', 'PDM labeling', 'Digital', 'PDM labeling', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-86', 86, 'HTL', 'Lò sấy bảng', 'HTL', 'Lò sấy bảng', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-87', 87, 'HTL', 'Máy chụp Bảng', 'HTL', 'Máy chụp Bảng', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-88', 88, 'HTL', 'Wash-Out Booth', 'HTL', 'Wash-Out Booth', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-89', 89, 'Warehouse', 'Dehumidity machine', 'Warehouse', 'Dehumidity machine', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-90', 90, 'Digital', 'HP 7K chiller 2_Back up', 'Digital', 'HP 7K chiller 2_Back up', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-91', 91, 'HTL', 'Sheet label cutter', 'HTL', 'Sheet label cutter', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-92', 92, 'HTL', 'HTL R2R', 'HTL', 'HTL R2R', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-93', 93, 'HTL', 'Rewinding Machine HTL', 'HTL', 'Rewinding Machine HTL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-94', 94, 'HTL', 'Slitting machine HTL', 'HTL', 'Slitting machine HTL', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-95', 95, 'Die Cut', 'Rotary Die Cut', 'Die Cut', 'Rotary Die Cut', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-96', 96, 'Die Cut', 'Auto Stripping Handtag', 'Die Cut', 'Auto Stripping Handtag', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-97', 97, 'OFFSET', 'Water base coating', 'OFFSET', 'Water base coating', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-98', 98, 'RFID', 'Fan Folding', 'RFID', 'Fan Folding', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-99', 99, 'Woven', 'Woven Auto Coating Starching', 'Woven', 'Woven Auto Coating Starching', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-100', 100, 'Digital', 'CLS Labeling', 'Digital', 'CLS Labeling', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-101', 101, 'Woven', 'Musonic', 'Woven', 'Musonic', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-102', 102, 'Woven', 'Woven 1', 'Woven', 'Woven 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-103', 103, 'Woven', 'Woven 2', 'Woven', 'Woven 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-104', 104, 'Woven', 'Woven 3', 'Woven', 'Woven 3', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-105', 105, 'Woven', 'Woven 4', 'Woven', 'Woven 4', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-106', 106, 'Woven', 'Woven 5', 'Woven', 'Woven 5', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-107', 107, 'Woven', 'Woven 6', 'Woven', 'Woven 6', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-108', 108, 'OFFSET', 'Auto Lamination Machine', 'OFFSET', 'Auto Lamination Machine', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-109', 109, 'Utility', 'Air Comp 1', 'Utility', 'Air Comp 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-110', 110, 'Utility', 'Air Comp 2', 'Utility', 'Air Comp 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-111', 111, 'Utility', 'Chiller 1', 'Utility', 'Chiller 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-112', 112, 'Utility', 'Chiller 2', 'Utility', 'Chiller 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-113', 113, 'Utility', 'AHU 1', 'Utility', 'AHU 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-114', 114, 'Utility', 'AHU 2', 'Utility', 'AHU 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-115', 115, 'Utility', 'AHU 3', 'Utility', 'AHU 3', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-116', 116, 'Utility', 'AHU 4', 'Utility', 'AHU 4', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-117', 117, 'Utility', 'GEN 1', 'Utility', 'GEN 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-118', 118, 'Utility', 'GEN 2', 'Utility', 'GEN 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-119', 119, 'Utility', 'Fire Pump 1', 'Utility', 'Fire Pump 1', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-120', 120, 'Utility', 'Fire Pump 2', 'Utility', 'Fire Pump 2', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active) VALUES ('mach-121', 121, 'Utility', 'Domestic water pump', 'Utility', 'Domestic water pump', NULL, NULL, true) ON CONFLICT (id) DO NOTHING;

-- 4.4. Seed bảng weekly_technical_requests (28 bản ghi tổng hợp tuần)
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-1', 'VN5117 - Lê Minh Hoàng', NULL, 'Machine Running', 'PFL2', 'High', 'Open', 1, 0.5, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-10', 'VN5454 - Quách Tiến Dũng', NULL, 'Machine Running', 'PFL2', 'Critical', 'Open', 3, 2.4, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-11', 'VN5571 - Trần Thị Loan', NULL, 'Machine Running', 'PFL6', 'Medium', 'Open', 2, 1, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-12', 'VN5456 - Nguyễn Ngọc Mỹ', NULL, 'Machine Set up', 'C&F1', 'Medium', 'Open', 2, 1, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-13', 'VN5381 - Nguyễn Thị Thanh Hồng', NULL, 'Machine Running', 'PFL2', 'Medium', 'Open', 4, 3, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-14', 'VN5741 - Huỳnh Thị Thanh Lên', NULL, 'Machine Set up', 'PFL6', 'Medium', 'Open', 4, 3, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-15', 'VN5634 - Nguyễn Văn Khỏe', NULL, 'Machine Running', 'C&F3', 'Low', 'Open', 5, 2, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-16', 'VN5663 - Nguyễn Văn Thể', NULL, 'Machine Running', 'PFL4', 'High', 'Open', 6, 5, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-17', 'VN6048 - Nguyễn Thành Sang', NULL, 'Machine Running', 'PFL6', 'Medium', 'Open', 6, 7, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-18', 'VN5944 - Đỗ Đức Nhật', NULL, 'Machine Running', 'PFL4', 'Low', 'Open', 2, 8, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-19', 'VN5830 - Lê Đình Bình', NULL, 'Machine Running', 'PFL4', 'High', 'Open', 2, 3, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-2', 'VN5898 - Phạm Hùng Sơn', NULL, 'Machine Set up', 'PFL4', 'Medium', 'Open', 2, 0.2, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-20', 'VN5900 - Mai Nhật Tân', NULL, 'Machine Set up', 'PFL5', 'Critical', 'Open', 1, 3, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-21', 'VN5696 - Trần Quang Hải', NULL, 'Machine Running', 'PFL4', 'Medium', 'In Progress', 1, 2, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-22', 'VN5793 - Phạm Việt Khái', NULL, 'Machine Running', 'PFL4', 'Medium', 'In Progress', 2, 1, 'No', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-23', 'VN5899 - Cao Đăng Khoa', NULL, 'Machine Running', 'PFL4', 'Medium', 'In Progress', 2, 3, 'No', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-24', 'VN5831 - Trương Hoàng Anh', NULL, 'Machine Running', 'PFL4', 'High', 'In Progress', 3, 1, 'No', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-25', 'VN5789 - Trần Thanh Hóa', NULL, 'Machine Running', 'PFL4', 'Critical', 'In Progress', 3, 2, 'No', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-26', 'VN5995 - Phùng Thanh Vũ', NULL, 'Machine Running', 'C&F3', 'Medium', 'In Progress', 3, 1, 'No', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-27', 'VN5875 - Lê Trường', NULL, '', '', '', '', NULL, NULL, NULL, '', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-28', 'VN5810 - Nông Ích Nam', NULL, '', '', '', '', NULL, NULL, NULL, '', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-3', 'VN5207 - Lục Xuân Trường', NULL, 'Machine Set up', 'PFL1', 'Low', 'Open', 3, 0.3, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-4', 'VN5430 - Trần Công Hậu', NULL, 'Machine Set up', 'PFL2', 'High', 'Open', 4, 0.6, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-5', 'VN5356 - Phan Thị Thêm', NULL, 'Machine Set up', 'PFL2', 'Critical', 'Open', 1, 0.8, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-6', 'VN5855 - Đỗ Văn Vẹn', NULL, 'Machine Set up', 'PFL2', 'Medium', 'Open', 2, 0.4, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-7', 'VN6024 - Phạm Văn Tuấn', NULL, 'Machine Running', 'Laser printer 1', 'Medium', 'Open', 2, 1.2, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-8', 'VN6173 - Lâm Hữu Phước', NULL, 'Machine Running', 'PFL3', 'Medium', 'Open', 3, 2.2, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;
INSERT INTO weekly_technical_requests (id, request_id, request_date, request_type, item_equipment, severity, status, sla_target_hours, actual_hours, met_sla, reported_by, resolved_by) VALUES ('wreq-9', 'VN5805 - Nguyễn Quốc Cường', NULL, 'Machine Running', 'PFL2', 'High', 'Open', 3, 2.3, 'Yes', 'Steve', 'Steve') ON CONFLICT (id) DO NOTHING;

-- 4.5. Seed bảng defect_logs (4 bản ghi lỗi)
INSERT INTO defect_logs (id, defect_id, defect_date, facility, source, root_cause_category, specific_issue, affected_product, downtime_minutes, recurring_issue, eight_d_required) VALUES ('defect-1', 1, '17/09/2026', 'RFID', 'Internal', 'Machine', 'eqwoeioqweiqowieo1111', 'abcxyzcbczxcb', '', 'No', 'No') ON CONFLICT (id) DO NOTHING;
INSERT INTO defect_logs (id, defect_id, defect_date, facility, source, root_cause_category, specific_issue, affected_product, downtime_minutes, recurring_issue, eight_d_required) VALUES ('defect-2', 2, '18/09/2026', 'WOVEN', 'Internal', 'System', '231231qweqweqweqweqwe1', 'iwueuqiwoeuoiqwe', '', 'Yes', 'Yes') ON CONFLICT (id) DO NOTHING;
INSERT INTO defect_logs (id, defect_id, defect_date, facility, source, root_cause_category, specific_issue, affected_product, downtime_minutes, recurring_issue, eight_d_required) VALUES ('defect-3', 3, '19/09/2026', 'LASER', 'Internal', 'Machine', 'đâsd', 'eqweqwsjapldjp', '', 'Yes', 'No') ON CONFLICT (id) DO NOTHING;
INSERT INTO defect_logs (id, defect_id, defect_date, facility, source, root_cause_category, specific_issue, affected_product, downtime_minutes, recurring_issue, eight_d_required) VALUES ('defect-4', 4, '10/02/2026', 'RFID', 'External (Customer complaint)', 'Method', 'đasa', 'dá', 'sdaas', 'Yes', 'Yes') ON CONFLICT (id) DO NOTHING;

-- 4.6. Seed bảng action_plans (5 kế hoạch hành động)
INSERT INTO action_plans (id, action_id, date_logged, facility, related_defect_id, fix_type, description, pic, deadline, status, resource_needed, remarks) VALUES ('act-1', 'CLS010', '17/09/2026', 'RFID', '7', 'Long-term preventive', 'tsjdkasjkdsasda', 'Steve', '17/09/2026', 'In Progress', 'Training', '') ON CONFLICT (id) DO NOTHING;
INSERT INTO action_plans (id, action_id, date_logged, facility, related_defect_id, fix_type, description, pic, deadline, status, resource_needed, remarks) VALUES ('act-2', 'SX52', '18/09/2026', 'OFFSET', '7', '8D Report', 'jqkwdjqiwjd0xcnz', 'Wayne', '18/09/2026', 'In Progress', 'Spare Parts', '') ON CONFLICT (id) DO NOTHING;
INSERT INTO action_plans (id, action_id, date_logged, facility, related_defect_id, fix_type, description, pic, deadline, status, resource_needed, remarks) VALUES ('act-3', 'HP Indigo 7K', '19/09/2026', 'DIGITAL', '7', 'Long-term preventive', 'dqwdjqwidoqwi', 'Steve', '19/09/2026', 'Pending', 'Spare Parts', '') ON CONFLICT (id) DO NOTHING;
INSERT INTO action_plans (id, action_id, date_logged, facility, related_defect_id, fix_type, description, pic, deadline, status, resource_needed, remarks) VALUES ('act-4', 'Ecopet', '17/09/2027', 'RFID', '7', 'Process Update', 'djqwodjqpowdjasojdaosd', 'Wayne', '17/09/2027', 'Completed', 'Spare Parts', '') ON CONFLICT (id) DO NOTHING;
INSERT INTO action_plans (id, action_id, date_logged, facility, related_defect_id, fix_type, description, pic, deadline, status, resource_needed, remarks) VALUES ('act-5', 'MiniEco', '18/09/2027', 'RFID', '7', 'Short-term fix', 'qưkejqwkejqw', 'Steve', '18/09/2027', 'In Progress', 'Spare Parts', '') ON CONFLICT (id) DO NOTHING;

-- 4.7. Seed bảng form_lookup_options (167 danh mục dropdown options)
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-1', 'Request_ID', 'VN5117 - Lê Minh Hoàng', 'VN5117 - Lê Minh Hoàng', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-2', 'Request_ID', 'VN5898 - Phạm Hùng Sơn', 'VN5898 - Phạm Hùng Sơn', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-3', 'Request_ID', 'VN5207 - Lục Xuân Trường', 'VN5207 - Lục Xuân Trường', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-4', 'Request_ID', 'VN5430 - Trần Công Hậu', 'VN5430 - Trần Công Hậu', 4, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-5', 'Request_ID', 'VN5356 - Phan Thị Thêm', 'VN5356 - Phan Thị Thêm', 5, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-6', 'Request_ID', 'VN5855 - Đỗ Văn Vẹn', 'VN5855 - Đỗ Văn Vẹn', 6, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-7', 'Request_ID', 'VN6024 - Phạm Văn Tuấn', 'VN6024 - Phạm Văn Tuấn', 7, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-8', 'Request_ID', 'VN6173 - Lâm Hữu Phước', 'VN6173 - Lâm Hữu Phước', 8, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-9', 'Request_ID', 'VN5805 - Nguyễn Quốc Cường', 'VN5805 - Nguyễn Quốc Cường', 9, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-10', 'Request_ID', 'VN5454 - Quách Tiến Dũng', 'VN5454 - Quách Tiến Dũng', 10, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-11', 'Request_ID', 'VN5571 - Trần Thị Loan', 'VN5571 - Trần Thị Loan', 11, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-12', 'Request_ID', 'VN5456 - Nguyễn Ngọc Mỹ', 'VN5456 - Nguyễn Ngọc Mỹ', 12, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-13', 'Request_ID', 'VN5381 - Nguyễn Thị Thanh Hồng', 'VN5381 - Nguyễn Thị Thanh Hồng', 13, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-14', 'Request_ID', 'VN5741 - Huỳnh Thị Thanh Lên', 'VN5741 - Huỳnh Thị Thanh Lên', 14, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-15', 'Request_ID', 'VN5634 - Nguyễn Văn Khỏe', 'VN5634 - Nguyễn Văn Khỏe', 15, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-16', 'Request_ID', 'VN5663 - Nguyễn Văn Thể', 'VN5663 - Nguyễn Văn Thể', 16, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-17', 'Request_ID', 'VN5944 - Đỗ Đức Nhật', 'VN5944 - Đỗ Đức Nhật', 17, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-18', 'Request_ID', 'VN5830 - Lê Đình Bình', 'VN5830 - Lê Đình Bình', 18, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-19', 'Request_ID', 'VN5696 - Trần Quang Hải', 'VN5696 - Trần Quang Hải', 19, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-20', 'Request_ID', 'VN5793 - Phạm Việt Khái', 'VN5793 - Phạm Việt Khái', 20, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-21', 'Request_ID', 'VN5899 - Cao Đăng Khoa', 'VN5899 - Cao Đăng Khoa', 21, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-22', 'Request_ID', 'VN5831 - Trương Hoàng Anh', 'VN5831 - Trương Hoàng Anh', 22, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-23', 'Request_ID', 'VN5789 - Trần Thanh Hóa', 'VN5789 - Trần Thanh Hóa', 23, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-24', 'Request_ID', 'VN5995 - Phùng Thanh Vũ', 'VN5995 - Phùng Thanh Vũ', 24, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-25', 'Request_ID', 'VN5813 - Nguyễn Thị Xuân', 'VN5813 - Nguyễn Thị Xuân', 25, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-26', 'Request_ID', 'VN5901 - Nguyễn Thị Thoa', 'VN5901 - Nguyễn Thị Thoa', 26, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-27', 'Request_ID', 'VN5875 - Lê Trường', 'VN5875 - Lê Trường', 27, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-28', 'Request_ID', 'VN5810 - Nông Ích Nam', 'VN5810 - Nông Ích Nam', 28, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-29', 'Request_Type', 'Machine Running', 'Machine Running', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-30', 'Request_Type', 'Machine Set up', 'Machine Set up', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-31', 'Item_Equipment', 'PFL1', 'PFL1', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-32', 'Item_Equipment', 'PFL2', 'PFL2', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-33', 'Item_Equipment', 'PFL3', 'PFL3', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-34', 'Item_Equipment', 'PFL4', 'PFL4', 4, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-35', 'Item_Equipment', 'PFL5', 'PFL5', 5, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-36', 'Item_Equipment', 'PFL6', 'PFL6', 6, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-37', 'Item_Equipment', 'C&F1', 'C&F1', 7, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-38', 'Item_Equipment', 'C&F2', 'C&F2', 8, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-39', 'Item_Equipment', 'C&F3', 'C&F3', 9, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-40', 'Item_Equipment', 'C&F4', 'C&F4', 10, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-41', 'Item_Equipment', 'C&F5', 'C&F5', 11, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-42', 'Item_Equipment', 'C&F6', 'C&F6', 12, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-43', 'Item_Equipment', 'C&F7', 'C&F7', 13, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-44', 'Item_Equipment', 'C&F8', 'C&F8', 14, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-45', 'Item_Equipment', 'C&F9', 'C&F9', 15, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-46', 'Item_Equipment', 'C&F10', 'C&F10', 16, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-47', 'Item_Equipment', 'C&F11', 'C&F11', 17, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-48', 'Item_Equipment', 'C&F12', 'C&F12', 18, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-49', 'Item_Equipment', 'C&F13', 'C&F13', 19, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-50', 'Item_Equipment', 'C&F14', 'C&F14', 20, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-51', 'Item_Equipment', 'C&F15', 'C&F15', 21, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-52', 'Item_Equipment', 'C&F16', 'C&F16', 22, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-53', 'Item_Equipment', 'C&F17', 'C&F17', 23, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-54', 'Item_Equipment', 'C&F18', 'C&F18', 24, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-55', 'Item_Equipment', 'C&F19', 'C&F19', 25, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-56', 'Item_Equipment', 'C&F20', 'C&F20', 26, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-57', 'Item_Equipment', 'Inspection System', 'Inspection System', 27, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-58', 'Item_Equipment', 'EAS-1', 'EAS-1', 28, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-59', 'Item_Equipment', 'Máy sấy Focus', 'Máy sấy Focus', 29, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-60', 'Item_Equipment', 'Máy sấy PFL', 'Máy sấy PFL', 30, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-61', 'Item_Equipment', 'Máy co nhiệt', 'Máy co nhiệt', 31, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-62', 'Item_Equipment', 'LAMINATION FBK 800', 'LAMINATION FBK 800', 32, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-63', 'Item_Equipment', 'SM 52 - 5 colors', 'SM 52 - 5 colors', 33, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-64', 'Item_Equipment', 'SX 52 - 6 colors', 'SX 52 - 6 colors', 34, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-65', 'Item_Equipment', 'Laser printer 1', 'Laser printer 1', 35, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-66', 'Item_Equipment', 'Laser printer 2', 'Laser printer 2', 36, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-67', 'Item_Equipment', 'Laser cut', 'Laser cut', 37, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-68', 'Item_Equipment', 'ATMA', 'ATMA', 38, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-69', 'Item_Equipment', 'GSF Powder dusting' || CHR(10) || 'HTL', 'GSF Powder dusting' || CHR(10) || 'HTL', 39, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-70', 'Item_Equipment', 'Automatic Flat Conveyor' || CHR(10) || 'HTL', 'Automatic Flat Conveyor' || CHR(10) || 'HTL', 40, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-71', 'Item_Equipment', 'Automatic Sheet Stacker' || CHR(10) || 'HTL', 'Automatic Sheet Stacker' || CHR(10) || 'HTL', 41, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-72', 'Item_Equipment', 'Chiller HTL', 'Chiller HTL', 42, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-73', 'Item_Equipment', 'HT760', 'HT760', 43, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-74', 'Item_Equipment', 'HT760T', 'HT760T', 44, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-75', 'Item_Equipment', 'IR Coating', 'IR Coating', 45, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-76', 'Item_Equipment', 'Polar_(PO L0)', 'Polar_(PO L0)', 46, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-77', 'Item_Equipment', 'CLS P2P 1', 'CLS P2P 1', 47, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-78', 'Item_Equipment', 'CLS P2P 2', 'CLS P2P 2', 48, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-79', 'Item_Equipment', 'CLS R2R', 'CLS R2R', 49, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-80', 'Item_Equipment', 'Rotary cutting machine(CLS)', 'Rotary cutting machine(CLS)', 50, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-81', 'Item_Equipment', 'CLS Labeling', 'CLS Labeling', 51, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-82', 'Item_Equipment', 'Care Label Feeder', 'Care Label Feeder', 52, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-83', 'Item_Equipment', 'Ecopet G1', 'Ecopet G1', 53, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-84', 'Item_Equipment', 'Ecopet G2', 'Ecopet G2', 54, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-85', 'Item_Equipment', 'HP 7K chiller 1_Origin', 'HP 7K chiller 1_Origin', 55, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-86', 'Item_Equipment', 'HP Indigo 7K digital press', 'HP Indigo 7K digital press', 56, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-87', 'Item_Equipment', 'RFID1', 'RFID1', 57, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-88', 'Item_Equipment', 'RFID2', 'RFID2', 58, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-89', 'Item_Equipment', 'RFID3', 'RFID3', 59, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-90', 'Item_Equipment', 'RFID4', 'RFID4', 60, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-91', 'Item_Equipment', 'RFID5', 'RFID5', 61, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-92', 'Item_Equipment', 'RFID6', 'RFID6', 62, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-93', 'Item_Equipment', 'RFID7', 'RFID7', 63, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-94', 'Item_Equipment', 'AFINA', 'AFINA', 64, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-95', 'Item_Equipment', 'ITD (ETUN)', 'ITD (ETUN)', 65, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-96', 'Item_Equipment', 'TOSHIBA', 'TOSHIBA', 66, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-97', 'Item_Equipment', 'Epson 1', 'Epson 1', 67, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-98', 'Item_Equipment', 'Epson 2', 'Epson 2', 68, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-99', 'Item_Equipment', 'Epson 3 C8', 'Epson 3 C8', 69, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-100', 'Item_Equipment', 'Forklift', 'Forklift', 70, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-101', 'Item_Equipment', 'Taping  Machine 1', 'Taping  Machine 1', 71, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-102', 'Item_Equipment', 'Taping  Machine 2', 'Taping  Machine 2', 72, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-103', 'Item_Equipment', 'Taping  Machine 3', 'Taping  Machine 3', 73, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-104', 'Item_Equipment', 'Heat Press Machine', 'Heat Press Machine', 74, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-105', 'Item_Equipment', 'Spectrophotometer', 'Spectrophotometer', 75, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-106', 'Item_Equipment', 'Washing machine 1', 'Washing machine 1', 76, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-107', 'Item_Equipment', 'Washing machine 2', 'Washing machine 2', 77, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-108', 'Item_Equipment', 'Enviroment chamber', 'Enviroment chamber', 78, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-109', 'Item_Equipment', 'Drying machine 1', 'Drying machine 1', 79, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-110', 'Item_Equipment', 'Drying machine 2', 'Drying machine 2', 80, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-111', 'Item_Equipment', 'Water boiler 1', 'Water boiler 1', 81, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-112', 'Item_Equipment', 'Water boiller 2', 'Water boiller 2', 82, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-113', 'Item_Equipment', 'UV Coating', 'UV Coating', 83, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-114', 'Item_Equipment', 'GWS Cutting machine', 'GWS Cutting machine', 84, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-115', 'Item_Equipment', 'Gluing Machine (Máy bồi tay)', 'Gluing Machine (Máy bồi tay)', 85, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-116', 'Item_Equipment', 'PDM labeling', 'PDM labeling', 86, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-117', 'Item_Equipment', 'Lò sấy bảng', 'Lò sấy bảng', 87, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-118', 'Item_Equipment', 'Máy chụp Bảng', 'Máy chụp Bảng', 88, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-119', 'Item_Equipment', 'Wash-Out Booth', 'Wash-Out Booth', 89, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-120', 'Item_Equipment', 'Dehumidity machine', 'Dehumidity machine', 90, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-121', 'Item_Equipment', 'HP 7K chiller 2_Back up', 'HP 7K chiller 2_Back up', 91, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-122', 'Item_Equipment', 'Sheet label cutter', 'Sheet label cutter', 92, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-123', 'Item_Equipment', 'HTL R2R', 'HTL R2R', 93, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-124', 'Item_Equipment', 'Rewinding Machine HTL', 'Rewinding Machine HTL', 94, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-125', 'Item_Equipment', 'Slitting machine HTL', 'Slitting machine HTL', 95, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-126', 'Item_Equipment', 'Rotary Die Cut', 'Rotary Die Cut', 96, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-127', 'Item_Equipment', 'Auto Stripping Handtag', 'Auto Stripping Handtag', 97, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-128', 'Item_Equipment', 'Water base coating', 'Water base coating', 98, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-129', 'Item_Equipment', 'Fan Folding', 'Fan Folding', 99, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-130', 'Item_Equipment', 'Woven Auto Coating Starching', 'Woven Auto Coating Starching', 100, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-131', 'Item_Equipment', 'Musonic', 'Musonic', 101, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-132', 'Item_Equipment', 'Woven 1', 'Woven 1', 102, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-133', 'Item_Equipment', 'Woven 2', 'Woven 2', 103, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-134', 'Item_Equipment', 'Woven 3', 'Woven 3', 104, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-135', 'Item_Equipment', 'Woven 4', 'Woven 4', 105, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-136', 'Item_Equipment', 'Woven 5', 'Woven 5', 106, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-137', 'Item_Equipment', 'Woven 6', 'Woven 6', 107, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-138', 'Item_Equipment', 'Auto Lamination Machine', 'Auto Lamination Machine', 108, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-139', 'Severity', 'Critical', 'Critical', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-140', 'Severity', 'High', 'High', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-141', 'Severity', 'Medium', 'Medium', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-142', 'Severity', 'Low', 'Low', 4, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-143', 'Status_Req', 'Open', 'Open', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-144', 'Status_Req', 'In Progress', 'In Progress', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-145', 'Status_Req', 'Closed', 'Closed', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-146', 'Status_Req', 'Overdue', 'Overdue', 4, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-147', 'Yes_No', 'Yes', 'Yes', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-148', 'Yes_No', 'No', 'No', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-149', 'Source', 'Internal', 'Internal', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-150', 'Source', 'External (Customer complaint)', 'External (Customer complaint)', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-151', 'Root_Cause', 'Machine', 'Machine', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-152', 'Root_Cause', 'Material', 'Material', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-153', 'Root_Cause', 'Method', 'Method', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-154', 'Root_Cause', 'Man', 'Man', 4, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-155', 'Root_Cause', 'System', 'System', 5, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-156', 'Root_Cause', 'Other', 'Other', 6, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-157', 'Fix_Type', 'Short-term fix', 'Short-term fix', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-158', 'Fix_Type', 'Long-term preventive', 'Long-term preventive', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-159', 'Fix_Type', '8D Report', '8D Report', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-160', 'Fix_Type', 'Process Update', 'Process Update', 4, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-161', 'Status_Act', 'Pending', 'Pending', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-162', 'Status_Act', 'In Progress', 'In Progress', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-163', 'Status_Act', 'Completed', 'Completed', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-164', 'Resource_Needed', 'Training', 'Training', 1, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-165', 'Resource_Needed', 'Spare Parts', 'Spare Parts', 2, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-166', 'Resource_Needed', 'Software Update', 'Software Update', 3, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active) VALUES ('opt-167', 'Resource_Needed', 'Other', 'Other', 4, true) ON CONFLICT (id) DO NOTHING;

-- 4.8. Seed bảng sheet_lists_do_not_delete (109 dòng dữ liệu tham chiếu gốc)
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-1', 1, 'VN5117 - Lê Minh Hoàng', 'Machine Running', 'PFL1', 'Critical', 'Open', 'Yes', 'Internal', 'Machine', 'Short-term fix', 'Pending', 'Training') ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-2', 2, 'VN5898 - Phạm Hùng Sơn', 'Machine Set up', 'PFL2', 'High', 'In Progress', 'No', 'External (Customer complaint)', 'Material', 'Long-term preventive', 'In Progress', 'Spare Parts') ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-3', 3, 'VN5207 - Lục Xuân Trường', NULL, 'PFL3', 'Medium', 'Closed', NULL, NULL, 'Method', '8D Report', 'Completed', 'Software Update') ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-4', 4, 'VN5430 - Trần Công Hậu', NULL, 'PFL4', 'Low', 'Overdue', NULL, NULL, 'Man', 'Process Update', NULL, 'Other') ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-5', 5, 'VN5356 - Phan Thị Thêm', NULL, 'PFL5', NULL, NULL, NULL, NULL, 'System', NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-6', 6, 'VN5855 - Đỗ Văn Vẹn', NULL, 'PFL6', NULL, NULL, NULL, NULL, 'Other', NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-7', 7, 'VN6024 - Phạm Văn Tuấn', NULL, 'C&F1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-8', 8, 'VN6173 - Lâm Hữu Phước', NULL, 'C&F2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-9', 9, 'VN5805 - Nguyễn Quốc Cường', NULL, 'C&F3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-10', 10, 'VN5454 - Quách Tiến Dũng', NULL, 'C&F4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-11', 11, 'VN5571 - Trần Thị Loan', NULL, 'C&F5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-12', 12, 'VN5456 - Nguyễn Ngọc Mỹ', NULL, 'C&F6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-13', 13, 'VN5381 - Nguyễn Thị Thanh Hồng', NULL, 'C&F7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-14', 14, 'VN5741 - Huỳnh Thị Thanh Lên', NULL, 'C&F8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-15', 15, 'VN5634 - Nguyễn Văn Khỏe', NULL, 'C&F9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-16', 16, 'VN5663 - Nguyễn Văn Thể', NULL, 'C&F10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-17', 17, 'VN5944 - Đỗ Đức Nhật', NULL, 'C&F11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-18', 18, 'VN5830 - Lê Đình Bình', NULL, 'C&F12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-19', 19, 'VN5696 - Trần Quang Hải', NULL, 'C&F13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-20', 20, 'VN5793 - Phạm Việt Khái', NULL, 'C&F14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-21', 21, 'VN5899 - Cao Đăng Khoa', NULL, 'C&F15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-22', 22, 'VN5831 - Trương Hoàng Anh', NULL, 'C&F16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-23', 23, 'VN5789 - Trần Thanh Hóa', NULL, 'C&F17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-24', 24, 'VN5995 - Phùng Thanh Vũ', NULL, 'C&F18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-25', 25, 'VN5813 - Nguyễn Thị Xuân', NULL, 'C&F19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-26', 26, 'VN5901 - Nguyễn Thị Thoa', NULL, 'C&F20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-27', 27, 'VN5875 - Lê Trường', NULL, 'Inspection System', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-28', 28, 'VN5810 - Nông Ích Nam', NULL, 'EAS-1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-29', 29, NULL, NULL, 'Máy sấy Focus', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-30', 30, NULL, NULL, 'Máy sấy PFL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-31', 31, NULL, NULL, 'Máy co nhiệt', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-32', 32, NULL, NULL, 'LAMINATION FBK 800', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-33', 33, NULL, NULL, 'SM 52 - 5 colors', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-34', 34, NULL, NULL, 'SX 52 - 6 colors', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-35', 35, NULL, NULL, 'Laser printer 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-36', 36, NULL, NULL, 'Laser printer 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-37', 37, NULL, NULL, 'Laser cut', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-38', 38, NULL, NULL, 'ATMA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-39', 39, NULL, NULL, 'GSF Powder dusting' || CHR(10) || 'HTL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-40', 40, NULL, NULL, 'Automatic Flat Conveyor' || CHR(10) || 'HTL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-41', 41, NULL, NULL, 'Automatic Sheet Stacker' || CHR(10) || 'HTL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-42', 42, NULL, NULL, 'Chiller HTL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-43', 43, NULL, NULL, 'HT760', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-44', 44, NULL, NULL, 'HT760T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-45', 45, NULL, NULL, 'IR Coating', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-46', 46, NULL, NULL, 'Polar_(PO L0)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-47', 47, NULL, NULL, 'CLS P2P 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-48', 48, NULL, NULL, 'CLS P2P 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-49', 49, NULL, NULL, 'CLS R2R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-50', 50, NULL, NULL, 'Rotary cutting machine(CLS)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-51', 51, NULL, NULL, 'CLS Labeling', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-52', 52, NULL, NULL, 'Care Label Feeder', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-53', 53, NULL, NULL, 'Ecopet G1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-54', 54, NULL, NULL, 'Ecopet G2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-55', 55, NULL, NULL, 'HP 7K chiller 1_Origin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-56', 56, NULL, NULL, 'HP Indigo 7K digital press', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-57', 57, NULL, NULL, 'RFID1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-58', 58, NULL, NULL, 'RFID2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-59', 59, NULL, NULL, 'RFID3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-60', 60, NULL, NULL, 'RFID4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-61', 61, NULL, NULL, 'RFID5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-62', 62, NULL, NULL, 'RFID6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-63', 63, NULL, NULL, 'RFID7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-64', 64, NULL, NULL, 'AFINA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-65', 65, NULL, NULL, 'ITD (ETUN)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-66', 66, NULL, NULL, 'TOSHIBA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-67', 67, NULL, NULL, 'Epson 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-68', 68, NULL, NULL, 'Epson 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-69', 69, NULL, NULL, 'Epson 3 C8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-70', 70, NULL, NULL, 'Forklift', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-71', 71, NULL, NULL, 'Taping  Machine 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-72', 72, NULL, NULL, 'Taping  Machine 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-73', 73, NULL, NULL, 'Taping  Machine 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-74', 74, NULL, NULL, 'Heat Press Machine', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-75', 75, NULL, NULL, 'Spectrophotometer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-76', 76, NULL, NULL, 'Washing machine 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-77', 77, NULL, NULL, 'Washing machine 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-78', 78, NULL, NULL, 'Enviroment chamber', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-79', 79, NULL, NULL, 'Drying machine 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-80', 80, NULL, NULL, 'Drying machine 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-81', 81, NULL, NULL, 'Water boiler 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-82', 82, NULL, NULL, 'Water boiller 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-83', 83, NULL, NULL, 'UV Coating', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-84', 84, NULL, NULL, 'GWS Cutting machine', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-85', 85, NULL, NULL, 'Gluing Machine (Máy bồi tay)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-86', 86, NULL, NULL, 'PDM labeling', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-87', 87, NULL, NULL, 'Lò sấy bảng', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-88', 88, NULL, NULL, 'Máy chụp Bảng', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-89', 89, NULL, NULL, 'Wash-Out Booth', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-90', 90, NULL, NULL, 'Dehumidity machine', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-91', 91, NULL, NULL, 'HP 7K chiller 2_Back up', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-92', 92, NULL, NULL, 'Sheet label cutter', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-93', 93, NULL, NULL, 'HTL R2R', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-94', 94, NULL, NULL, 'Rewinding Machine HTL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-95', 95, NULL, NULL, 'Slitting machine HTL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-96', 96, NULL, NULL, 'Rotary Die Cut', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-97', 97, NULL, NULL, 'Auto Stripping Handtag', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-98', 98, NULL, NULL, 'Water base coating', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-99', 99, NULL, NULL, 'Fan Folding', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-100', 100, NULL, NULL, 'Woven Auto Coating Starching', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-101', 101, NULL, NULL, 'CLS Labeling', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-102', 102, NULL, NULL, 'Musonic', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-103', 103, NULL, NULL, 'Woven 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-104', 104, NULL, NULL, 'Woven 2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-105', 105, NULL, NULL, 'Woven 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-106', 106, NULL, NULL, 'Woven 4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-107', 107, NULL, NULL, 'Woven 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-108', 108, NULL, NULL, 'Woven 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed) VALUES ('list-row-109', 109, NULL, NULL, 'Auto Lamination Machine', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;

-- 4.9. Bảng technical_requests (Không nạp dữ liệu mẫu - hệ thống chỉ lưu và nạp dữ liệu thực tế do người dùng tạo)

-- Hoàn tất khởi tạo cơ sở dữ liệu checkpoint_technical.