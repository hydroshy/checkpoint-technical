-- ==============================================================================
-- CHECKPOINT TECHNICAL - DATABASE SCHEMA INITIALIZATION (POSTGRESQL)
-- ==============================================================================
-- Description: Complete schema for Users, Machines, Employees, and Technical Requests.
-- Auto-executed on PostgreSQL container startup or via DB_AUTO_INIT=true
-- ==============================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Users Table
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
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Machines Table
CREATE TABLE IF NOT EXISTS machines (
  id VARCHAR(255) PRIMARY KEY,
  tech VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255),
  note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_machines_tech ON machines(tech);
CREATE INDEX IF NOT EXISTS idx_machines_name ON machines(name);

-- 4. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(255) PRIMARY KEY,
  mnv VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  dept VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_mnv ON employees(mnv);
CREATE INDEX IF NOT EXISTS idx_employees_dept ON employees(dept);
CREATE INDEX IF NOT EXISTS idx_employees_area ON employees(area);

-- 5. Technical Requests Table
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

CREATE INDEX IF NOT EXISTS idx_tech_req_doc_no ON technical_requests(doc_no);
CREATE INDEX IF NOT EXISTS idx_tech_req_req_date ON technical_requests(req_date);
CREATE INDEX IF NOT EXISTS idx_tech_req_machine ON technical_requests(machine_name);
CREATE INDEX IF NOT EXISTS idx_tech_req_chk_status ON technical_requests(chk_status);
CREATE INDEX IF NOT EXISTS idx_tech_req_err_cat ON technical_requests(err_cat);
