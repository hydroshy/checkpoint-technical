import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { Pool, PoolConfig } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface UserPermissions {
  canCreateRequest: boolean;
  canViewKpi: boolean;
  canAccessControlPanel: boolean;
}

export function getDefaultPermissions(role?: string): UserPermissions {
  if (role === 'ADMIN') {
    return {
      canCreateRequest: true,
      canViewKpi: true,
      canAccessControlPanel: true,
    };
  }
  if (role === 'TECHNICIAN') {
    return {
      canCreateRequest: true,
      canViewKpi: true,
      canAccessControlPanel: false,
    };
  }
  return {
    canCreateRequest: true,
    canViewKpi: false,
    canAccessControlPanel: false,
  };
}

export function normalizePermissions(role: string = 'EMPLOYEE', perms?: any): UserPermissions {
  const def = getDefaultPermissions(role);
  if (!perms || typeof perms !== 'object') {
    return def;
  }
  return {
    canCreateRequest: typeof perms.canCreateRequest === 'boolean'
      ? perms.canCreateRequest
      : (typeof perms.can_create_request === 'boolean' ? perms.can_create_request : def.canCreateRequest),
    canViewKpi: typeof perms.canViewKpi === 'boolean'
      ? perms.canViewKpi
      : (typeof perms.can_view_kpi === 'boolean' ? perms.can_view_kpi : def.canViewKpi),
    canAccessControlPanel: typeof perms.canAccessControlPanel === 'boolean'
      ? perms.canAccessControlPanel
      : (typeof perms.can_access_control_panel === 'boolean' ? perms.can_access_control_panel : def.canAccessControlPanel),
  };
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE';
  isActive: boolean;
  permissions: UserPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface RequesterRecord {
  id: string;
  stt: number;
  department: string;
  area: string;
  mnv: string;
  fullName: string;
  position: string;
}

export interface MachineRecord {
  id: string;
  tech: string; // Khu vực / Công nghệ (PFL, OFFSET, DIGITAL, etc.)
  name: string; // Tên máy
  code?: string;
  note?: string;
  isActive: boolean;
}

export interface EmployeeRecord {
  id: string;
  mnv: string;
  name: string;
  dept: string;
  area: string;
  role: string;
  phone?: string;
  email?: string;
}

export type TicketStatus = 'Open' | 'In Progress' | 'Overdue' | 'Closed';
export const VALID_TICKET_STATUSES: readonly TicketStatus[] = ['Open', 'In Progress', 'Overdue', 'Closed'] as const;

export function normalizeTicketStatus(status?: string | null): TicketStatus {
  if (!status) return 'Open';
  const s = status.trim().toLowerCase();
  if (s === 'in progress' || s === 'in_progress' || s === 'inprogress' || s === 'progress') return 'In Progress';
  if (s === 'overdue' || s === 'late') return 'Overdue';
  if (s === 'closed' || s === 'done' || s === 'completed' || s === 'resolved') return 'Closed';
  if (s === 'open') return 'Open';
  return 'Open';
}

export interface WeeklyTechnicalRequestRecord {
  id: string;
  requestId: string;
  requestDate?: string;
  requestType: string;
  itemEquipment: string;
  severity: string;
  status: TicketStatus | string;
  slaTargetHours?: number | null;
  actualHours?: number | null;
  metSla?: string;
  reportedBy: string;
  resolvedBy?: string;
}

export interface DefectLogRecord {
  id: string;
  defectId: number;
  defectDate: string;
  facility: string;
  source: string;
  rootCauseCategory: string;
  specificIssue: string;
  affectedProduct: string;
  downtimeMinutes?: string | null;
  recurringIssue: string;
  eightDRequired: string;
}

export interface ActionPlanRecord {
  id: string;
  actionId: string;
  dateLogged: string;
  facility: string;
  relatedDefectId?: string | null;
  fixType: string;
  description: string;
  pic: string;
  deadline: string;
  status: string;
  resourceNeeded: string;
  remarks?: string | null;
}

export interface FormLookupOptionRecord {
  id: string;
  category: string;
  itemValue: string;
  itemLabel: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SheetListsRowRecord {
  id: string;
  rowIndex: number;
  requestId?: string | null;
  requestType?: string | null;
  itemEquipment?: string | null;
  severity?: string | null;
  statusReq?: string | null;
  yesNo?: string | null;
  source?: string | null;
  rootCause?: string | null;
  fixType?: string | null;
  statusAct?: string | null;
  resourceNeeded?: string | null;
}

export interface TechnicalRequestRecord {
  id: string;
  docNo: string;
  reqDate: string;
  reqTime: string;
  reqBy: string;
  printTech: string;
  machineName: string;
  problem: string;
  machineStatus?: string; // 'First Bulk Print' | 'Repeat Print'
  priority?: string; // 'Immediate' | 'Hold' | 'Other'
  priorityOther?: string;
  recvBy?: string;
  recvDate?: string;
  recvTime?: string;
  finishDate?: string;
  finishTime?: string;
  downtime?: number; // minutes
  rootCause?: string;
  actionTaken?: string;
  errCat?: string; // 'MAN' | 'MACHINE' | 'MATERIAL' | 'METHOD'
  errType?: string; // 'Prepress' | 'Press' | 'PostPress'
  photosBefore?: string[];
  photosAfter?: string[];
  chkQuality?: string; // 'OK' | 'NG'
  chkStatus?: string; // 'DONE' | 'MONITOR' | 'SUPPORT'
  workOrder?: string;
  woTotalQty?: number;
  wasteQty?: number;
  wasteUnit?: string;
  wastePercent?: string;
  prodMgr?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsRecord {
  isPublicFormEnabled: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CpsrRecord {
  id: string;
  docNo: string;
  reqDate: string;
  reqTime: string;
  reqBy: string;
  printTech: string;
  machineName: string;
  problem: string;
  machineStatus?: string;
  priority?: string;
  priorityOther?: string;
  submittedAt: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CpstRecord {
  id: string;
  docNo: string;
  cpsrId?: string;
  cpsrDocNo: string;
  recvBy: string;
  recvDate?: string;
  recvTime?: string;
  finishDate?: string;
  finishTime?: string;
  downtime?: number;
  rootCause?: string;
  actionTaken?: string;
  errCat?: string;
  errType?: string;
  photosBefore?: string[];
  photosAfter?: string[];
  chkStatus?: string;
  submittedAt: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CpsfRecord {
  id: string;
  docNo: string;
  cpstId?: string;
  cpstDocNo: string;
  cpsrDocNo?: string;
  chkQuality?: string;
  workOrder?: string;
  woTotalQty?: number;
  wasteQty?: number;
  wasteUnit?: string;
  wastePercent?: string;
  prodMgr?: string;
  submittedAt: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CpsrChainRecord {
  cpsr: CpsrRecord;
  cpst?: CpstRecord | null;
  cpsf?: CpsfRecord | null;
}

export type CpsStatus = 'OPEN_TASK' | 'TO_ASSIGN' | 'IN_PROGRESS' | 'OVER_DUE' | 'CLOSED';

export function computeCpsStatus(cps: {
  status?: string;
  cpsfDocNo?: string | null;
  assignedTo?: string | null;
  deadline?: string | Date | null;
}): CpsStatus {
  if (cps.cpsfDocNo && cps.cpsfDocNo.trim() !== '') {
    return 'CLOSED';
  }
  if (cps.status === 'CLOSED') {
    return 'CLOSED';
  }
  if (cps.deadline) {
    const d = new Date(cps.deadline);
    if (!isNaN(d.getTime()) && d.getTime() < Date.now()) {
      return 'OVER_DUE';
    }
  }
  if (cps.assignedTo && cps.assignedTo.trim() !== '') {
    return 'IN_PROGRESS';
  }
  if (cps.status === 'OPEN_TASK') {
    return 'OPEN_TASK';
  }
  return 'TO_ASSIGN';
}

export interface CpsRecord {
  id: string;
  docNo: string;
  cpsrId?: string | null;
  cpsrDocNo: string;
  cpstId?: string | null;
  cpstDocNo?: string | null;
  cpsfId?: string | null;
  cpsfDocNo?: string | null;
  status: CpsStatus;
  assignedTo?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  assignedBy?: string | null;
  assignedAt?: string | null;
  deadline?: string | null;
  priority?: string;
  printTech?: string;
  machineName?: string;
  problem?: string;
  reqBy?: string;
  reqDate?: string;
  reqTime?: string;
  downtime?: number;
  woTotalQty?: number;
  wasteQty?: number;
  wastePercent?: string;
  wasteUnit?: string | null;
  workOrder?: string | null;
  chkStatus?: string | null;
  chkQuality?: string | null;
  notes?: string | null;
  closedAt?: string | null;
  cpsr?: CpsrRecord | null;
  cpst?: CpstRecord | null;
  cpsf?: CpsfRecord | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly dataDir: string;
  private pgPool: Pool | null = null;
  private isPgConnected = false;

  private usersCache: UserRecord[] = [];
  private requestersCache: RequesterRecord[] = [];
  private machinesCache: MachineRecord[] = [];
  private employeesCache: EmployeeRecord[] = [];
  private weeklyRequestsCache: WeeklyTechnicalRequestRecord[] = [];
  private defectLogsCache: DefectLogRecord[] = [];
  private actionPlansCache: ActionPlanRecord[] = [];
  private formLookupOptionsCache: FormLookupOptionRecord[] = [];
  private sheetListsCache: SheetListsRowRecord[] = [];
  private requestsCache: TechnicalRequestRecord[] = [];
  private cpsrCache: CpsrRecord[] = [];
  private cpstCache: CpstRecord[] = [];
  private cpsfCache: CpsfRecord[] = [];
  private cpsCache: CpsRecord[] = [];
  private settingsCache: SystemSettingsRecord = { isPublicFormEnabled: true };

  constructor() {
    this.dataDir = path.resolve(process.env.DATA_DIR || './data');
    if (!fs.existsSync(this.dataDir)) {
      try {
        fs.mkdirSync(this.dataDir, { recursive: true });
      } catch (e: any) {
        this.logger.warn(`Could not create data directory ${this.dataDir}: ${e.message}`);
      }
    }
  }

  async onModuleInit() {
    await this.initDatabaseConnection();
  }

  /**
   * Initialize PostgreSQL connection if environment variables are provided.
   * Gracefully falls back to local JSON persistence if PG is unreachable.
   */
  private async initDatabaseConnection() {
    const dbHost = process.env.POSTGRES_HOST || process.env.DB_HOST;
    const dbPort = parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10);
    const dbUser = process.env.POSTGRES_USER || process.env.DB_USERNAME || process.env.DB_USER || process.env.USER || 'admin';
    const dbPassword = process.env.POSTGRES_PASSWORD !== undefined
      ? process.env.POSTGRES_PASSWORD
      : (process.env.DB_PASSWORD !== undefined
        ? process.env.DB_PASSWORD
        : (process.env.PASSWORD !== undefined ? process.env.PASSWORD : 'Ph@nloi20031403'));
    const dbName = process.env.POSTGRES_DB || process.env.DB_NAME || process.env.DB_DATABASE || process.env.DB || 'checkpoint_technical';
    const dbSsl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
    // Tự động khởi tạo Schema mặc định = true nếu chưa có biến môi trường
    const autoInitEnv = process.env.DB_AUTO_INIT;
    const autoInit = autoInitEnv === undefined || autoInitEnv === null || autoInitEnv.trim() === ''
      ? true
      : !['false', '0', 'no', 'off'].includes(autoInitEnv.toLowerCase().trim());

    const candidateHosts: string[] = [];
    if (dbHost) candidateHosts.push(dbHost);
    const defaults = ['192.168.1.35', 'postgres_db', 'localhost', '127.0.0.1'];
    for (const h of defaults) {
      if (!candidateHosts.includes(h)) candidateHosts.push(h);
    }

    let connected = false;

    if (dbHost || process.env.DB_NAME || process.env.POSTGRES_DB || process.env.DB) {
      for (const host of candidateHosts) {
        let testPool: Pool | null = null;
        try {
          const poolConfig: PoolConfig = {
            host,
            port: dbPort,
            user: dbUser,
            password: dbPassword,
            database: dbName,
            ssl: dbSsl,
            connectionTimeoutMillis: 3000,
            idleTimeoutMillis: 30000,
            max: 10,
          };

          testPool = new Pool(poolConfig);
          testPool.on('error', (err) => {
            this.logger.error(`PostgreSQL pool client error: ${err.message}`);
          });

          await testPool.query('SELECT 1');
          this.pgPool = testPool;
          this.isPgConnected = true;
          connected = true;
          this.logger.log(`✅ Connected to PostgreSQL database: ${host}:${dbPort}/${dbName}`);
          break;
        } catch (err: any) {
          if (testPool) {
            await testPool.end().catch(() => {});
          }
        }
      }
    }

    if (connected && this.pgPool) {
      if (autoInit) {
        await this.initPgSchema();
      }
      await this.loadFromPg();
      await this.seedDefaults();
    } else {
      this.logger.warn(`ℹ️ Running with local JSON file storage (${this.dataDir}). (PostgreSQL will be used automatically when DB_HOST is reachable).`);
      this.loadAll();
      await this.seedDefaults();
    }
  }

  /**
   * Create schema tables in PostgreSQL if they do not exist.
   * Executes each table creation independently to ensure complete resilience:
   * even if one table or extension has an issue, all other tables (including form_lookup_options)
   * are guaranteed to be created.
   */
  private async initPgSchema() {
    if (!this.pgPool) return;

    try {
      try {
        await this.pgPool.query(`
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        `);
      } catch (extErr: any) {
        this.logger.debug(`Optional PostgreSQL extensions skipped: ${extErr.message}`);
      }

      const tableStatements = [
        {
          name: 'users',
          sql: `
            CREATE TABLE IF NOT EXISTS users (
              id VARCHAR(255) PRIMARY KEY,
              username VARCHAR(255) UNIQUE NOT NULL,
              email VARCHAR(255) NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              full_name VARCHAR(255) NOT NULL,
              role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
              is_active BOOLEAN NOT NULL DEFAULT true,
              permissions JSONB NOT NULL DEFAULT '{"canCreateRequest":true,"canViewKpi":false,"canAccessControlPanel":false}'::jsonb,
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'EMPLOYEE';
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"canCreateRequest":true,"canViewKpi":false,"canAccessControlPanel":false}'::jsonb;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
          `,
        },
        {
          name: 'requesters',
          sql: `
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
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS stt INT;
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS department VARCHAR(255);
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS area VARCHAR(255);
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS mnv VARCHAR(100);
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS position VARCHAR(255);
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE requesters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_requesters_mnv ON requesters(mnv);
            CREATE INDEX IF NOT EXISTS idx_requesters_area ON requesters(area);
          `,
        },
        {
          name: 'machines',
          sql: `
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
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS stt INT DEFAULT 0;
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS tech VARCHAR(255);
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS name VARCHAR(255);
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS area VARCHAR(255);
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS machine_name VARCHAR(255);
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS code VARCHAR(100);
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS note TEXT;
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE machines ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_machines_tech ON machines(tech);
            CREATE INDEX IF NOT EXISTS idx_machines_name ON machines(name);
          `,
        },
        {
          name: 'weekly_technical_requests',
          sql: `
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
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS request_id VARCHAR(255);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS request_date VARCHAR(50);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS request_type VARCHAR(255);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS item_equipment VARCHAR(255);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS severity VARCHAR(100);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS status VARCHAR(100);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS sla_target_hours NUMERIC;
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS actual_hours NUMERIC;
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS met_sla VARCHAR(50);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS reported_by VARCHAR(255);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS resolved_by VARCHAR(255);
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE weekly_technical_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_wtr_req_id ON weekly_technical_requests(request_id);
            CREATE INDEX IF NOT EXISTS idx_wtr_status ON weekly_technical_requests(status);
            ALTER TABLE weekly_technical_requests DROP CONSTRAINT IF EXISTS chk_weekly_status;
            ALTER TABLE weekly_technical_requests ADD CONSTRAINT chk_weekly_status CHECK (status IN ('Open', 'In Progress', 'Overdue', 'Closed'));
          `,
        },
        {
          name: 'defect_logs',
          sql: `
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
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS defect_id INT;
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS defect_date VARCHAR(50);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS facility VARCHAR(255);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS source VARCHAR(255);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS root_cause_category VARCHAR(255);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS specific_issue TEXT;
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS affected_product TEXT;
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS downtime_minutes VARCHAR(100);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS recurring_issue VARCHAR(50);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS eight_d_required VARCHAR(50);
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE defect_logs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_defect_logs_defect_id ON defect_logs(defect_id);
          `,
        },
        {
          name: 'action_plans',
          sql: `
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
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS action_id VARCHAR(100);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS date_logged VARCHAR(50);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS facility VARCHAR(255);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS related_defect_id VARCHAR(100);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS fix_type VARCHAR(255);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS description TEXT;
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS pic VARCHAR(255);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS deadline VARCHAR(50);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS status VARCHAR(100);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS resource_needed VARCHAR(255);
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS remarks TEXT;
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE action_plans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_action_plans_action_id ON action_plans(action_id);
          `,
        },
        {
          name: 'form_lookup_options',
          sql: `
            CREATE TABLE IF NOT EXISTS form_lookup_options (
              id VARCHAR(255) PRIMARY KEY,
              category VARCHAR(100) NOT NULL,
              item_value VARCHAR(255) NOT NULL,
              item_label VARCHAR(255),
              sort_order INT DEFAULT 0,
              is_active BOOLEAN NOT NULL DEFAULT true,
              created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            ALTER TABLE form_lookup_options ADD COLUMN IF NOT EXISTS category VARCHAR(100);
            ALTER TABLE form_lookup_options ADD COLUMN IF NOT EXISTS item_value VARCHAR(255);
            ALTER TABLE form_lookup_options ADD COLUMN IF NOT EXISTS item_label VARCHAR(255);
            ALTER TABLE form_lookup_options ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
            ALTER TABLE form_lookup_options ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
            ALTER TABLE form_lookup_options ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_lookup_category ON form_lookup_options(category);
          `,
        },
        {
          name: 'sheet_lists_do_not_delete',
          sql: `
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
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS row_index INT;
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS request_id VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS request_type VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS item_equipment VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS severity VARCHAR(100);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS status_req VARCHAR(100);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS yes_no VARCHAR(50);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS source VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS root_cause VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS fix_type VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS status_act VARCHAR(100);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS resource_needed VARCHAR(255);
            ALTER TABLE sheet_lists_do_not_delete ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
          `,
        },
        {
          name: 'technical_requests',
          sql: `
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
          `,
        },
        {
          name: 'system_settings',
          sql: `
            CREATE TABLE IF NOT EXISTS system_settings (
              key VARCHAR(100) PRIMARY KEY,
              value JSONB NOT NULL,
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_by VARCHAR(255)
            );
          `,
        },
        {
          name: 'cpsr',
          sql: `
            CREATE TABLE IF NOT EXISTS cpsr (
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
              submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              created_by VARCHAR(255) DEFAULT 'public',
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_cpsr_doc_no ON cpsr(doc_no);
            CREATE INDEX IF NOT EXISTS idx_cpsr_submitted_at ON cpsr(submitted_at);
          `,
        },
        {
          name: 'cpst',
          sql: `
            CREATE TABLE IF NOT EXISTS cpst (
              id VARCHAR(255) PRIMARY KEY,
              doc_no VARCHAR(255) UNIQUE NOT NULL,
              cpsr_id VARCHAR(255) REFERENCES cpsr(id) ON DELETE CASCADE,
              cpsr_doc_no VARCHAR(255) UNIQUE REFERENCES cpsr(doc_no) ON DELETE CASCADE,
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
              chk_status VARCHAR(100),
              submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              created_by VARCHAR(255) DEFAULT 'public',
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_cpst_doc_no ON cpst(doc_no);
            CREATE INDEX IF NOT EXISTS idx_cpst_cpsr_doc_no ON cpst(cpsr_doc_no);
            CREATE INDEX IF NOT EXISTS idx_cpst_submitted_at ON cpst(submitted_at);
          `,
        },
        {
          name: 'cpsf',
          sql: `
            CREATE TABLE IF NOT EXISTS cpsf (
              id VARCHAR(255) PRIMARY KEY,
              doc_no VARCHAR(255) UNIQUE NOT NULL,
              cpst_id VARCHAR(255) REFERENCES cpst(id) ON DELETE CASCADE,
              cpst_doc_no VARCHAR(255) UNIQUE REFERENCES cpst(doc_no) ON DELETE CASCADE,
              cpsr_doc_no VARCHAR(255),
              chk_quality VARCHAR(50),
              work_order VARCHAR(255),
              wo_total_qty NUMERIC DEFAULT 0,
              waste_qty NUMERIC DEFAULT 0,
              waste_unit VARCHAR(50),
              waste_percent VARCHAR(50),
              prod_mgr VARCHAR(255),
              submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              created_by VARCHAR(255) DEFAULT 'public',
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_cpsf_doc_no ON cpsf(doc_no);
            CREATE INDEX IF NOT EXISTS idx_cpsf_cpst_doc_no ON cpsf(cpst_doc_no);
            CREATE INDEX IF NOT EXISTS idx_cpsf_submitted_at ON cpsf(submitted_at);
          `,
        },
        {
          name: 'cps',
          sql: `
            CREATE TABLE IF NOT EXISTS cps (
              id VARCHAR(255) PRIMARY KEY,
              doc_no VARCHAR(255) UNIQUE NOT NULL,
              cpsr_id VARCHAR(255) REFERENCES cpsr(id) ON DELETE SET NULL,
              cpsr_doc_no VARCHAR(255) REFERENCES cpsr(doc_no) ON DELETE SET NULL,
              cpst_id VARCHAR(255) REFERENCES cpst(id) ON DELETE SET NULL,
              cpst_doc_no VARCHAR(255) REFERENCES cpst(doc_no) ON DELETE SET NULL,
              cpsf_id VARCHAR(255) REFERENCES cpsf(id) ON DELETE SET NULL,
              cpsf_doc_no VARCHAR(255) REFERENCES cpsf(doc_no) ON DELETE SET NULL,
              status VARCHAR(50) NOT NULL DEFAULT 'TO_ASSIGN',
              assigned_to VARCHAR(255),
              assigned_to_id VARCHAR(255),
              assigned_to_name VARCHAR(255),
              assigned_by VARCHAR(255),
              assigned_at TIMESTAMPTZ,
              deadline TIMESTAMPTZ,
              priority VARCHAR(100),
              print_tech VARCHAR(255),
              machine_name VARCHAR(255),
              problem TEXT,
              req_by VARCHAR(255),
              req_date VARCHAR(50),
              req_time VARCHAR(50),
              downtime NUMERIC DEFAULT 0,
              wo_total_qty NUMERIC DEFAULT 0,
              waste_qty NUMERIC DEFAULT 0,
              waste_percent VARCHAR(50),
              waste_unit VARCHAR(50),
              work_order VARCHAR(255),
              chk_status VARCHAR(100),
              chk_quality VARCHAR(50),
              notes TEXT,
              closed_at TIMESTAMPTZ,
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS cpsr_id VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS cpsr_doc_no VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS cpst_id VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS cpst_doc_no VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS cpsf_id VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS cpsf_doc_no VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'TO_ASSIGN';
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS assigned_to_id VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS assigned_to_name VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS assigned_by VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS priority VARCHAR(100);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS print_tech VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS machine_name VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS problem TEXT;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS req_by VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS req_date VARCHAR(50);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS req_time VARCHAR(50);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS downtime NUMERIC DEFAULT 0;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS wo_total_qty NUMERIC DEFAULT 0;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS waste_qty NUMERIC DEFAULT 0;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS waste_percent VARCHAR(50);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS waste_unit VARCHAR(50);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS work_order VARCHAR(255);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS chk_status VARCHAR(100);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS chk_quality VARCHAR(50);
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS notes TEXT;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            ALTER TABLE cps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            CREATE INDEX IF NOT EXISTS idx_cps_doc_no ON cps(doc_no);
            CREATE INDEX IF NOT EXISTS idx_cps_status ON cps(status);
            CREATE INDEX IF NOT EXISTS idx_cps_cpsr_doc_no ON cps(cpsr_doc_no);
            CREATE INDEX IF NOT EXISTS idx_cps_cpst_doc_no ON cps(cpst_doc_no);
            CREATE INDEX IF NOT EXISTS idx_cps_cpsf_doc_no ON cps(cpsf_doc_no);
            CREATE INDEX IF NOT EXISTS idx_cps_deadline ON cps(deadline);
          `,
        },
      ];

      for (const t of tableStatements) {
        try {
          await this.pgPool.query(t.sql);
        } catch (tableErr: any) {
          this.logger.error(`Failed to initialize table ${t.name}: ${tableErr.message}`);
        }
      }

      this.logger.log('✅ PostgreSQL Schema verified / initialized (14 tables: users, requesters, machines, weekly_technical_requests, defect_logs, action_plans, form_lookup_options, sheet_lists_do_not_delete, technical_requests, system_settings, cpsr, cpst, cpsf, cps)');
    } catch (e: any) {
      this.logger.error(`Failed to initialize PostgreSQL schema: ${e.message}`);
    }
  }

  /**
   * Load all tables from PostgreSQL into cache with per-table resilience and JSON fallback.
   */
  private async loadFromPg() {
    if (!this.pgPool) return;

    // 1. Users
    try {
      const usersRes = await this.pgPool.query('SELECT * FROM users ORDER BY created_at ASC');
      this.usersCache = usersRes.rows.map(r => ({
        id: r.id,
        username: r.username,
        email: r.email,
        passwordHash: r.password_hash,
        fullName: r.full_name,
        role: r.role,
        isActive: r.is_active,
        permissions: this.parsePermissions(r.role, r.permissions),
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load users from PG (${err.message}). Using local JSON fallback.`);
      this.usersCache = this.readJson<UserRecord[]>('users.json', []).map(u => ({
        ...u,
        permissions: this.parsePermissions(u.role, (u as any).permissions),
      }));
    }

    // 2. Requesters
    try {
      const requestersRes = await this.pgPool.query('SELECT * FROM requesters ORDER BY stt ASC, id ASC');
      this.requestersCache = requestersRes.rows.map(r => ({
        id: r.id,
        stt: r.stt || 0,
        department: r.department || '',
        area: r.area || '',
        mnv: r.mnv || '',
        fullName: r.full_name || '',
        position: r.position || '',
      }));
      this.employeesCache = this.requestersCache.map(r => ({
        id: r.id,
        mnv: r.mnv,
        name: r.fullName,
        dept: r.department,
        area: r.area,
        role: r.position,
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load requesters from PG (${err.message}). Using local JSON fallback.`);
      this.requestersCache = this.readJson<RequesterRecord[]>('requesters.json', []);
      this.employeesCache = this.readJson<EmployeeRecord[]>('employees.json', []);
    }

    // 3. Machines
    try {
      const machinesRes = await this.pgPool.query('SELECT * FROM machines ORDER BY id ASC');
      this.machinesCache = machinesRes.rows.map(r => ({
        id: r.id,
        tech: r.tech || r.area || '',
        name: r.name || r.machine_name || '',
        code: r.code || undefined,
        note: r.note || undefined,
        isActive: r.is_active !== undefined ? r.is_active : true,
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load machines from PG (${err.message}). Using local JSON fallback.`);
      this.machinesCache = this.readJson<MachineRecord[]>('machines.json', []);
    }

    // 4. Weekly Requests
    try {
      const weeklyRes = await this.pgPool.query('SELECT * FROM weekly_technical_requests ORDER BY id ASC');
      this.weeklyRequestsCache = weeklyRes.rows.map(r => ({
        id: r.id,
        requestId: r.request_id || '',
        requestDate: r.request_date || undefined,
        requestType: r.request_type || '',
        itemEquipment: r.item_equipment || '',
        severity: r.severity || '',
        status: normalizeTicketStatus(r.status),
        slaTargetHours: r.sla_target_hours !== null ? Number(r.sla_target_hours) : null,
        actualHours: r.actual_hours !== null ? Number(r.actual_hours) : null,
        metSla: r.met_sla || undefined,
        reportedBy: r.reported_by || '',
        resolvedBy: r.resolved_by || undefined,
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load weekly_technical_requests from PG (${err.message}). Using local JSON fallback.`);
      this.weeklyRequestsCache = this.readJson<WeeklyTechnicalRequestRecord[]>('weekly_technical_requests.json', []);
    }

    // 5. Defect Logs
    try {
      const defectRes = await this.pgPool.query('SELECT * FROM defect_logs ORDER BY defect_id ASC');
      this.defectLogsCache = defectRes.rows.map(r => ({
        id: r.id,
        defectId: r.defect_id,
        defectDate: r.defect_date || '',
        facility: r.facility || '',
        source: r.source || '',
        rootCauseCategory: r.root_cause_category || '',
        specificIssue: r.specific_issue || '',
        affectedProduct: r.affected_product || '',
        downtimeMinutes: r.downtime_minutes || null,
        recurringIssue: r.recurring_issue || '',
        eightDRequired: r.eight_d_required || '',
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load defect_logs from PG (${err.message}). Using local JSON fallback.`);
      this.defectLogsCache = this.readJson<DefectLogRecord[]>('defect_logs.json', []);
    }

    // 6. Action Plans
    try {
      const actionRes = await this.pgPool.query('SELECT * FROM action_plans ORDER BY id ASC');
      this.actionPlansCache = actionRes.rows.map(r => ({
        id: r.id,
        actionId: r.action_id || '',
        dateLogged: r.date_logged || '',
        facility: r.facility || '',
        relatedDefectId: r.related_defect_id || null,
        fixType: r.fix_type || '',
        description: r.description || '',
        pic: r.pic || '',
        deadline: r.deadline || '',
        status: r.status || '',
        resourceNeeded: r.resource_needed || '',
        remarks: r.remarks || null,
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load action_plans from PG (${err.message}). Using local JSON fallback.`);
      this.actionPlansCache = this.readJson<ActionPlanRecord[]>('action_plans.json', []);
    }

    // 7. Form Lookup Options
    try {
      const lookupRes = await this.pgPool.query('SELECT * FROM form_lookup_options ORDER BY category, sort_order ASC');
      this.formLookupOptionsCache = lookupRes.rows.map(r => ({
        id: r.id,
        category: r.category,
        itemValue: r.item_value,
        itemLabel: r.item_label || r.item_value,
        sortOrder: r.sort_order || 0,
        isActive: r.is_active,
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load form_lookup_options from PG (${err.message}). Using local JSON fallback.`);
      this.formLookupOptionsCache = this.readJson<FormLookupOptionRecord[]>('form_lookup_options.json', []);
    }

    // 8. Sheet Lists DO NOT DELETE
    try {
      const sheetListsRes = await this.pgPool.query('SELECT * FROM sheet_lists_do_not_delete ORDER BY row_index ASC');
      this.sheetListsCache = sheetListsRes.rows.map(r => ({
        id: r.id,
        rowIndex: r.row_index,
        requestId: r.request_id,
        requestType: r.request_type,
        itemEquipment: r.item_equipment,
        severity: r.severity,
        statusReq: r.status_req,
        yesNo: r.yes_no,
        source: r.source,
        rootCause: r.root_cause,
        fixType: r.fix_type,
        statusAct: r.status_act,
        resourceNeeded: r.resource_needed,
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load sheet_lists_do_not_delete from PG (${err.message}). Using local JSON fallback.`);
      this.sheetListsCache = this.readJson<SheetListsRowRecord[]>('sheet_lists_do_not_delete.json', []);
    }

    // 9. Technical Requests Form V4.1
    try {
      const techReqRes = await this.pgPool.query('SELECT * FROM technical_requests ORDER BY created_at DESC');
      this.requestsCache = techReqRes.rows
        .filter(r => r.id !== '2f8c2b65-9660-4041-9c22-aeac7310fdce' && r.doc_no !== 'REQ-20261003-1945')
        .map(r => ({
        id: r.id,
        docNo: r.doc_no,
        reqDate: r.req_date || '',
        reqTime: r.req_time || '',
        reqBy: r.req_by || '',
        printTech: r.print_tech || '',
        machineName: r.machine_name || '',
        problem: r.problem || '',
        machineStatus: r.machine_status || undefined,
        priority: r.priority || undefined,
        priorityOther: r.priority_other || undefined,
        recvBy: r.recv_by || undefined,
        recvDate: r.recv_date || undefined,
        recvTime: r.recv_time || undefined,
        finishDate: r.finish_date || undefined,
        finishTime: r.finish_time || undefined,
        downtime: r.downtime !== null ? Number(r.downtime) : 0,
        rootCause: r.root_cause || undefined,
        actionTaken: r.action_taken || undefined,
        errCat: r.err_cat || undefined,
        errType: r.err_type || undefined,
        photosBefore: Array.isArray(r.photos_before) ? r.photos_before : (r.photos_before ? JSON.parse(r.photos_before) : []),
        photosAfter: Array.isArray(r.photos_after) ? r.photos_after : (r.photos_after ? JSON.parse(r.photos_after) : []),
        chkQuality: r.chk_quality || undefined,
        chkStatus: r.chk_status || undefined,
        workOrder: r.work_order || undefined,
        woTotalQty: r.wo_total_qty !== null ? Number(r.wo_total_qty) : 0,
        wasteQty: r.waste_qty !== null ? Number(r.waste_qty) : 0,
        wasteUnit: r.waste_unit || undefined,
        wastePercent: r.waste_percent || undefined,
        prodMgr: r.prod_mgr || undefined,
        createdBy: r.created_by || undefined,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load technical_requests from PG (${err.message}). Using local JSON fallback.`);
      this.requestsCache = this.readJson<TechnicalRequestRecord[]>('technical_requests.json', [])
        .filter(r => r.id !== '2f8c2b65-9660-4041-9c22-aeac7310fdce' && r.docNo !== 'REQ-20261003-1945');
    }

    // 10. System Settings
    try {
      const settingsRes = await this.pgPool.query("SELECT * FROM system_settings WHERE key = 'public_form'");
      if (settingsRes.rows.length > 0) {
        const val = typeof settingsRes.rows[0].value === 'string'
          ? JSON.parse(settingsRes.rows[0].value)
          : settingsRes.rows[0].value;
        this.settingsCache = {
          isPublicFormEnabled: !!val.isPublicFormEnabled,
          updatedAt: settingsRes.rows[0].updated_at ? new Date(settingsRes.rows[0].updated_at).toISOString() : undefined,
          updatedBy: settingsRes.rows[0].updated_by || undefined,
        };
      } else {
        this.settingsCache = this.readJson<SystemSettingsRecord>('settings.json', { isPublicFormEnabled: true });
      }
    } catch (err: any) {
      this.logger.warn(`Could not load system_settings from PG (${err.message}). Using local JSON fallback.`);
      this.settingsCache = this.readJson<SystemSettingsRecord>('settings.json', { isPublicFormEnabled: true });
    }

    // 11. CPSR
    try {
      const cpsrRes = await this.pgPool.query('SELECT * FROM cpsr ORDER BY created_at DESC');
      this.cpsrCache = cpsrRes.rows.map(r => ({
        id: r.id,
        docNo: r.doc_no,
        reqDate: r.req_date || '',
        reqTime: r.req_time || '',
        reqBy: r.req_by || '',
        printTech: r.print_tech || '',
        machineName: r.machine_name || '',
        problem: r.problem || '',
        machineStatus: r.machine_status || undefined,
        priority: r.priority || undefined,
        priorityOther: r.priority_other || undefined,
        submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : new Date().toISOString(),
        createdBy: r.created_by || 'public',
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load cpsr from PG (${err.message}). Using local JSON fallback.`);
      this.cpsrCache = this.readJson<CpsrRecord[]>('cpsr.json', []);
    }

    // 12. CPST
    try {
      const cpstRes = await this.pgPool.query('SELECT * FROM cpst ORDER BY created_at DESC');
      this.cpstCache = cpstRes.rows.map(r => ({
        id: r.id,
        docNo: r.doc_no,
        cpsrId: r.cpsr_id || undefined,
        cpsrDocNo: r.cpsr_doc_no,
        recvBy: r.recv_by || '',
        recvDate: r.recv_date || undefined,
        recvTime: r.recv_time || undefined,
        finishDate: r.finish_date || undefined,
        finishTime: r.finish_time || undefined,
        downtime: r.downtime !== null ? Number(r.downtime) : 0,
        rootCause: r.root_cause || undefined,
        actionTaken: r.action_taken || undefined,
        errCat: r.err_cat || undefined,
        errType: r.err_type || undefined,
        photosBefore: Array.isArray(r.photos_before) ? r.photos_before : (r.photos_before ? JSON.parse(r.photos_before) : []),
        photosAfter: Array.isArray(r.photos_after) ? r.photos_after : (r.photos_after ? JSON.parse(r.photos_after) : []),
        chkStatus: r.chk_status || undefined,
        submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : new Date().toISOString(),
        createdBy: r.created_by || 'public',
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load cpst from PG (${err.message}). Using local JSON fallback.`);
      this.cpstCache = this.readJson<CpstRecord[]>('cpst.json', []);
    }

    // 13. CPSF
    try {
      const cpsfRes = await this.pgPool.query('SELECT * FROM cpsf ORDER BY created_at DESC');
      this.cpsfCache = cpsfRes.rows.map(r => ({
        id: r.id,
        docNo: r.doc_no,
        cpstId: r.cpst_id || undefined,
        cpstDocNo: r.cpst_doc_no,
        cpsrDocNo: r.cpsr_doc_no || undefined,
        chkQuality: r.chk_quality || undefined,
        workOrder: r.work_order || undefined,
        woTotalQty: r.wo_total_qty !== null ? Number(r.wo_total_qty) : 0,
        wasteQty: r.waste_qty !== null ? Number(r.waste_qty) : 0,
        wasteUnit: r.waste_unit || undefined,
        wastePercent: r.waste_percent || undefined,
        prodMgr: r.prod_mgr || undefined,
        submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString() : new Date().toISOString(),
        createdBy: r.created_by || 'public',
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load cpsf from PG (${err.message}). Using local JSON fallback.`);
      this.cpsfCache = this.readJson<CpsfRecord[]>('cpsf.json', []);
    }

    // 14. CPS (Chain & Task Master)
    try {
      const cpsRes = await this.pgPool.query('SELECT * FROM cps ORDER BY created_at DESC');
      this.cpsCache = cpsRes.rows.map(r => ({
        id: r.id,
        docNo: r.doc_no,
        cpsrId: r.cpsr_id || null,
        cpsrDocNo: r.cpsr_doc_no,
        cpstId: r.cpst_id || null,
        cpstDocNo: r.cpst_doc_no || null,
        cpsfId: r.cpsf_id || null,
        cpsfDocNo: r.cpsf_doc_no || null,
        status: (r.status as CpsStatus) || 'TO_ASSIGN',
        assignedTo: r.assigned_to || null,
        assignedToId: r.assigned_to_id || null,
        assignedToName: r.assigned_to_name || null,
        assignedBy: r.assigned_by || null,
        assignedAt: r.assigned_at ? new Date(r.assigned_at).toISOString() : null,
        deadline: r.deadline ? new Date(r.deadline).toISOString() : null,
        priority: r.priority || undefined,
        printTech: r.print_tech || undefined,
        machineName: r.machine_name || undefined,
        problem: r.problem || undefined,
        reqBy: r.req_by || undefined,
        reqDate: r.req_date || undefined,
        reqTime: r.req_time || undefined,
        downtime: r.downtime !== null ? Number(r.downtime) : 0,
        woTotalQty: r.wo_total_qty !== null ? Number(r.wo_total_qty) : 0,
        wasteQty: r.waste_qty !== null ? Number(r.waste_qty) : 0,
        wastePercent: r.waste_percent || undefined,
        wasteUnit: r.waste_unit || undefined,
        workOrder: r.work_order || undefined,
        chkStatus: r.chk_status || undefined,
        chkQuality: r.chk_quality || undefined,
        notes: r.notes || undefined,
        closedAt: r.closed_at ? new Date(r.closed_at).toISOString() : null,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Could not load cps from PG (${err.message}). Using local JSON fallback.`);
      this.cpsCache = this.readJson<CpsRecord[]>('cps.json', []);
    }

    // Auto-sync any CPSR chains into CPS table
    await this.syncCpsFromChains();

    this.logger.log(`📦 Database loaded: ${this.usersCache.length} users, ${this.requestersCache.length} requesters, ${this.machinesCache.length} machines, ${this.weeklyRequestsCache.length} weekly reqs, ${this.defectLogsCache.length} defect logs, ${this.actionPlansCache.length} action plans, ${this.formLookupOptionsCache.length} lookup options, ${this.requestsCache.length} v4 requests, ${this.cpsrCache.length} cpsr, ${this.cpstCache.length} cpst, ${this.cpsfCache.length} cpsf, ${this.cpsCache.length} cps.`);
  }

  private getFilePath(filename: string): string {
    return path.join(this.dataDir, filename);
  }

  private readJson<T>(filename: string, defaultValue: T): T {
    const filePath = this.getFilePath(filename);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e: any) {
      this.logger.error(`Error reading ${filename}: ${e.message}`);
    }
    return defaultValue;
  }

  private writeJson(filename: string, data: any): void {
    const filePath = this.getFilePath(filename);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    try {
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, filePath);
    } catch (e: any) {
      this.logger.error(`Error writing ${filename}: ${e.message}`);
      if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch (_) {}
      }
    }
  }

  private parsePermissions(role: string, perms: any): UserPermissions {
    if (typeof perms === 'string') {
      try {
        return normalizePermissions(role, JSON.parse(perms));
      } catch {
        return getDefaultPermissions(role);
      }
    }
    return normalizePermissions(role, perms);
  }

  public loadAll() {
    this.usersCache = this.readJson<UserRecord[]>('users.json', []).map(u => ({
      ...u,
      permissions: this.parsePermissions(u.role, (u as any).permissions),
    }));
    this.requestersCache = this.readJson<RequesterRecord[]>('requesters.json', []);
    this.machinesCache = this.readJson<MachineRecord[]>('machines.json', []);
    this.weeklyRequestsCache = this.readJson<WeeklyTechnicalRequestRecord[]>('weekly_technical_requests.json', []).map(w => ({
      ...w,
      status: normalizeTicketStatus(w.status),
    }));
    this.defectLogsCache = this.readJson<DefectLogRecord[]>('defect_logs.json', []);
    this.actionPlansCache = this.readJson<ActionPlanRecord[]>('action_plans.json', []);
    this.formLookupOptionsCache = this.readJson<FormLookupOptionRecord[]>('form_lookup_options.json', []);
    this.sheetListsCache = this.readJson<SheetListsRowRecord[]>('sheet_lists_do_not_delete.json', []);
    this.requestsCache = this.readJson<TechnicalRequestRecord[]>('technical_requests.json', [])
      .filter(r => r.id !== '2f8c2b65-9660-4041-9c22-aeac7310fdce' && r.docNo !== 'REQ-20261003-1945');
    this.cpsrCache = this.readJson<CpsrRecord[]>('cpsr.json', []);
    this.cpstCache = this.readJson<CpstRecord[]>('cpst.json', []);
    this.cpsfCache = this.readJson<CpsfRecord[]>('cpsf.json', []);
    this.cpsCache = this.readJson<CpsRecord[]>('cps.json', []);
    this.settingsCache = this.readJson<SystemSettingsRecord>('settings.json', { isPublicFormEnabled: true });
    this.syncCpsFromChains();

    // Sync employeesCache from requesters
    if (this.requestersCache.length > 0) {
      this.employeesCache = this.requestersCache.map(r => ({
        id: r.id,
        mnv: r.mnv,
        name: r.fullName,
        dept: r.department,
        area: r.area,
        role: r.position,
      }));
    } else {
      this.employeesCache = this.readJson<EmployeeRecord[]>('employees.json', []);
    }

    this.logger.log(`📦 Local Database loaded: ${this.usersCache.length} users, ${this.requestersCache.length} requesters, ${this.machinesCache.length} machines, ${this.weeklyRequestsCache.length} weekly reqs, ${this.defectLogsCache.length} defect logs, ${this.actionPlansCache.length} action plans, ${this.requestsCache.length} requests.`);
  }

  public async seedDefaults() {
    // 1. Seed Users
    if (this.usersCache.length === 0) {
      const defaultPasswordHash = await bcrypt.hash('Checkpoint@123', 10);
      const now = new Date().toISOString();
      const defaultUsers: UserRecord[] = [
        {
          id: 'user-admin-1',
          username: 'admin',
          email: 'admin@checkpointsystems.com',
          passwordHash: defaultPasswordHash,
          fullName: 'Super Administrator',
          role: 'ADMIN',
          isActive: true,
          permissions: getDefaultPermissions('ADMIN'),
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'user-tech-1',
          username: 'tech01',
          email: 'tech01@checkpointsystems.com',
          passwordHash: defaultPasswordHash,
          fullName: 'Kỹ Thuật Viên Trưởng',
          role: 'TECHNICIAN',
          isActive: true,
          permissions: getDefaultPermissions('TECHNICIAN'),
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'user-emp-1',
          username: 'user01',
          email: 'user01@checkpointsystems.com',
          passwordHash: defaultPasswordHash,
          fullName: 'Nguyễn Văn A (SX)',
          role: 'EMPLOYEE',
          isActive: true,
          permissions: getDefaultPermissions('EMPLOYEE'),
          createdAt: now,
          updatedAt: now,
        },
      ];

      for (const u of defaultUsers) {
        this.addUser(u);
      }
      this.logger.log('✅ Default users seeded (admin, tech01, user01 / Checkpoint@123)');
    }

    // 2. If PostgreSQL is connected and requesters table is empty, seed from JSON
    if (this.isPgConnected && this.pgPool && this.requestersCache.length === 0) {
      const jsonRequesters = this.readJson<RequesterRecord[]>('requesters.json', []);
      for (const r of jsonRequesters) {
        this.addRequester(r);
      }
    }

    // 3. If PostgreSQL is connected and machines table is empty or missing records, seed from JSON
    const jsonMachines = this.readJson<MachineRecord[]>('machines.json', []);
    if (this.isPgConnected && this.pgPool && this.machinesCache.length < jsonMachines.length) {
      for (const m of jsonMachines) {
        this.addMachine(m);
      }
    }

    // 4. Operational tables (weekly_technical_requests, defect_logs, action_plans, technical_requests):
    // 100% real data from PostgreSQL, do NOT auto-seed mock data.

    // 7. If PostgreSQL is connected and form_lookup_options table is empty, seed from JSON
    if (this.isPgConnected && this.pgPool && this.formLookupOptionsCache.length === 0) {
      const jsonOpts = this.readJson<FormLookupOptionRecord[]>('form_lookup_options.json', []);
      for (const o of jsonOpts) {
        this.addLookupOption(o);
      }
    }

    // 8. If PostgreSQL is connected and sheet_lists_do_not_delete table is empty, seed from JSON
    if (this.isPgConnected && this.pgPool && this.sheetListsCache.length === 0) {
      const jsonSheetLists = this.readJson<SheetListsRowRecord[]>('sheet_lists_do_not_delete.json', []);
      this.sheetListsCache = jsonSheetLists;
      for (const s of jsonSheetLists) {
        this.pgPool
          .query(
            `INSERT INTO sheet_lists_do_not_delete (id, row_index, request_id, request_type, item_equipment, severity, status_req, yes_no, source, root_cause, fix_type, status_act, resource_needed)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (id) DO NOTHING`,
            [s.id, s.rowIndex, s.requestId, s.requestType, s.itemEquipment, s.severity, s.statusReq, s.yesNo, s.source, s.rootCause, s.fixType, s.statusAct, s.resourceNeeded],
          )
          .catch((err) => this.logger.error(`PG Error inserting sheet lists row: ${err.message}`));
      }
    }

    // 9. Technical requests: operational data only, do not seed mock data.
    if (this.isPgConnected && this.pgPool) {
      try {
        await this.pgPool.query(
          "DELETE FROM technical_requests WHERE id = '2f8c2b65-9660-4041-9c22-aeac7310fdce' OR doc_no = 'REQ-20261003-1945'"
        );
      } catch (err: any) {
        // Ignore table or query error during cleanup
      }
    }
  }

  // ==================== USERS ACCESSORS ====================
  getUsers(): UserRecord[] { return this.usersCache; }
  getUserById(id: string): UserRecord | undefined { return this.usersCache.find(u => u.id === id); }
  getUserByUsername(username: string): UserRecord | undefined {
    return this.usersCache.find(u => u.username.toLowerCase() === username.toLowerCase());
  }
  getUserByUsernameOrEmail(identifier: string): UserRecord | undefined {
    const val = identifier.toLowerCase().trim();
    return this.usersCache.find(u => u.username.toLowerCase() === val || (u.email && u.email.toLowerCase() === val));
  }
  saveUsers(): void { this.writeJson('users.json', this.usersCache); }

  addUser(user: UserRecord): void {
    const userToSave: UserRecord = {
      ...user,
      permissions: normalizePermissions(user.role, user.permissions),
    };
    const existingIdx = this.usersCache.findIndex(u => u.id === user.id);
    if (existingIdx !== -1) {
      this.usersCache[existingIdx] = userToSave;
    } else {
      this.usersCache.push(userToSave);
    }
    this.saveUsers();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, permissions, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
           username = EXCLUDED.username,
           email = EXCLUDED.email,
           password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           role = EXCLUDED.role,
           is_active = EXCLUDED.is_active,
           permissions = EXCLUDED.permissions,
           updated_at = EXCLUDED.updated_at`,
        [
          userToSave.id,
          userToSave.username,
          userToSave.email,
          userToSave.passwordHash,
          userToSave.fullName,
          userToSave.role,
          userToSave.isActive,
          JSON.stringify(userToSave.permissions),
          userToSave.createdAt,
          userToSave.updatedAt,
        ],
      ).catch(err => this.logger.error(`PG Error inserting user: ${err.message}`));
    }
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const idx = this.usersCache.findIndex(u => u.id === id);
    if (idx !== -1) {
      const current = this.usersCache[idx];
      const newRole = updates.role || current.role;
      const newPermissions = updates.permissions
        ? normalizePermissions(newRole, { ...current.permissions, ...updates.permissions })
        : current.permissions;

      this.usersCache[idx] = {
        ...current,
        ...updates,
        permissions: newPermissions,
        updatedAt: new Date().toISOString(),
      };
      this.saveUsers();
      const updated = this.usersCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query(
          `UPDATE users SET
             username = COALESCE($2, username),
             email = COALESCE($3, email),
             password_hash = COALESCE($4, password_hash),
             full_name = COALESCE($5, full_name),
             role = COALESCE($6, role),
             is_active = COALESCE($7, is_active),
             permissions = COALESCE($8::jsonb, permissions),
             updated_at = $9
           WHERE id = $1`,
          [
            id,
            updates.username,
            updates.email,
            updates.passwordHash,
            updates.fullName,
            updates.role,
            updates.isActive,
            updates.permissions ? JSON.stringify(updated.permissions) : null,
            updated.updatedAt,
          ],
        ).catch(err => this.logger.error(`PG Error updating user: ${err.message}`));
      }

      return updated;
    }
    return undefined;
  }

  deleteUser(id: string): boolean {
    const initialLen = this.usersCache.length;
    this.usersCache = this.usersCache.filter(u => u.id !== id);
    if (this.usersCache.length !== initialLen) {
      this.saveUsers();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM users WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting user: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== REQUESTERS (Name of reqester.xlsx) ====================
  getRequesters(): RequesterRecord[] { return this.requestersCache; }
  getRequesterById(id: string): RequesterRecord | undefined { return this.requestersCache.find(r => r.id === id); }
  getRequesterByMnv(mnv: string): RequesterRecord | undefined {
    return this.requestersCache.find(r => r.mnv.toLowerCase() === mnv.toLowerCase().trim());
  }
  saveRequesters(): void { this.writeJson('requesters.json', this.requestersCache); }

  addRequester(r: RequesterRecord): void {
    const idx = this.requestersCache.findIndex(x => x.id === r.id || x.mnv === r.mnv);
    if (idx !== -1) {
      this.requestersCache[idx] = r;
    } else {
      this.requestersCache.push(r);
    }
    this.saveRequesters();

    // Mirror to employeesCache
    this.addEmployee({
      id: r.id,
      mnv: r.mnv,
      name: r.fullName,
      dept: r.department,
      area: r.area,
      role: r.position,
    });

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO requesters (id, stt, department, area, mnv, full_name, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (mnv) DO UPDATE SET
           department = EXCLUDED.department,
           area = EXCLUDED.area,
           full_name = EXCLUDED.full_name,
           position = EXCLUDED.position,
           updated_at = now()`,
        [r.id, r.stt, r.department, r.area, r.mnv, r.fullName, r.position],
      ).catch(err => this.logger.error(`PG Error inserting requester: ${err.message}`));
    }
  }

  updateRequester(id: string, updates: Partial<RequesterRecord>): RequesterRecord | undefined {
    const idx = this.requestersCache.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.requestersCache[idx] = { ...this.requestersCache[idx], ...updates };
      this.saveRequesters();
      const updated = this.requestersCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query(
          `UPDATE requesters SET
             department = COALESCE($2, department),
             area = COALESCE($3, area),
             full_name = COALESCE($4, full_name),
             position = COALESCE($5, position),
             updated_at = now()
           WHERE id = $1`,
          [id, updates.department, updates.area, updates.fullName, updates.position],
        ).catch(err => this.logger.error(`PG Error updating requester: ${err.message}`));
      }

      return updated;
    }
    return undefined;
  }

  deleteRequester(id: string): boolean {
    const initialLen = this.requestersCache.length;
    this.requestersCache = this.requestersCache.filter(r => r.id !== id);
    if (this.requestersCache.length !== initialLen) {
      this.saveRequesters();
      this.deleteEmployee(id);
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM requesters WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting requester: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== MACHINES (Name of reqester.xlsx) ====================
  getMachines(): MachineRecord[] { return this.machinesCache; }
  getMachineById(id: string): MachineRecord | undefined { return this.machinesCache.find(m => m.id === id); }
  saveMachines(): void { this.writeJson('machines.json', this.machinesCache); }

  addMachine(machine: MachineRecord): void {
    const idx = this.machinesCache.findIndex(
      m => m.id === machine.id ||
      ((m.name || '').toLowerCase() === (machine.name || '').toLowerCase() &&
       (m.tech || '').toLowerCase() === (machine.tech || '').toLowerCase())
    );
    if (idx !== -1) {
      this.machinesCache[idx] = machine;
    } else {
      this.machinesCache.push(machine);
    }
    this.saveMachines();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO machines (id, stt, tech, name, area, machine_name, code, note, is_active)
         VALUES ($1, $2, $3, $4, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           tech = EXCLUDED.tech,
           name = EXCLUDED.name,
           area = EXCLUDED.area,
           machine_name = EXCLUDED.machine_name,
           code = EXCLUDED.code,
           note = EXCLUDED.note,
           is_active = EXCLUDED.is_active,
           updated_at = now()`,
        [machine.id, 0, machine.tech, machine.name, machine.code || null, machine.note || null, machine.isActive],
      ).catch(err => this.logger.error(`PG Error inserting machine: ${err.message}`));
    }
  }

  updateMachine(id: string, updates: Partial<MachineRecord>): MachineRecord | undefined {
    const idx = this.machinesCache.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.machinesCache[idx] = { ...this.machinesCache[idx], ...updates };
      this.saveMachines();
      const updated = this.machinesCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query(
          `UPDATE machines SET
             area = COALESCE($2, area),
             machine_name = COALESCE($3, machine_name),
             code = COALESCE($4, code),
             note = COALESCE($5, note),
             is_active = COALESCE($6, is_active),
             updated_at = now()
           WHERE id = $1`,
          [id, updates.tech, updates.name, updates.code, updates.note, updates.isActive],
        ).catch(err => this.logger.error(`PG Error updating machine: ${err.message}`));
      }

      return updated;
    }
    return undefined;
  }

  deleteMachine(id: string): boolean {
    const initialLen = this.machinesCache.length;
    this.machinesCache = this.machinesCache.filter(m => m.id !== id);
    if (this.machinesCache.length !== initialLen) {
      this.saveMachines();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM machines WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting machine: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== EMPLOYEES ====================
  getEmployees(): EmployeeRecord[] { return this.employeesCache; }
  saveEmployees(): void { this.writeJson('employees.json', this.employeesCache); }

  setEmployees(list: EmployeeRecord[]): void {
    this.employeesCache = list;
    this.saveEmployees();
    for (const emp of list) {
      this.addEmployee(emp);
    }
  }

  addEmployee(emp: EmployeeRecord): void {
    const idx = this.employeesCache.findIndex(e => e.id === emp.id || e.mnv === emp.mnv);
    if (idx !== -1) {
      this.employeesCache[idx] = emp;
    } else {
      this.employeesCache.push(emp);
    }
    this.saveEmployees();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO requesters (id, stt, department, area, mnv, full_name, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (mnv) DO UPDATE SET
           department = EXCLUDED.department,
           area = EXCLUDED.area,
           full_name = EXCLUDED.full_name,
           position = EXCLUDED.position,
           updated_at = now()`,
        [emp.id, 0, emp.dept, emp.area, emp.mnv, emp.name, emp.role],
      ).catch(() => {});
    }
  }

  updateEmployee(id: string, updates: Partial<EmployeeRecord>): EmployeeRecord | undefined {
    const idx = this.employeesCache.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.employeesCache[idx] = { ...this.employeesCache[idx], ...updates };
      this.saveEmployees();
      return this.employeesCache[idx];
    }
    return undefined;
  }

  deleteEmployee(id: string): boolean {
    const initialLen = this.employeesCache.length;
    this.employeesCache = this.employeesCache.filter(e => e.id !== id);
    if (this.employeesCache.length !== initialLen) {
      this.saveEmployees();
      return true;
    }
    return false;
  }

  // ==================== WEEKLY TECHNICAL REQUESTS (1_Technical_Requests) ====================
  getWeeklyRequests(): WeeklyTechnicalRequestRecord[] { return this.weeklyRequestsCache; }
  getWeeklyRequestById(id: string): WeeklyTechnicalRequestRecord | undefined {
    return this.weeklyRequestsCache.find(w => w.id === id || w.requestId === id);
  }
  saveWeeklyRequests(): void { this.writeJson('weekly_technical_requests.json', this.weeklyRequestsCache); }

  addWeeklyRequest(w: WeeklyTechnicalRequestRecord): void {
    const itemToSave: WeeklyTechnicalRequestRecord = {
      ...w,
      status: normalizeTicketStatus(w.status),
    };
    const idx = this.weeklyRequestsCache.findIndex(x => x.id === itemToSave.id);
    if (idx !== -1) {
      this.weeklyRequestsCache[idx] = itemToSave;
    } else {
      this.weeklyRequestsCache.unshift(itemToSave);
    }
    this.saveWeeklyRequests();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO weekly_technical_requests (
           id, request_id, request_date, request_type, item_equipment, severity, status,
           sla_target_hours, actual_hours, met_sla, reported_by, resolved_by
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           request_id = EXCLUDED.request_id,
           request_date = EXCLUDED.request_date,
           request_type = EXCLUDED.request_type,
           item_equipment = EXCLUDED.item_equipment,
           severity = EXCLUDED.severity,
           status = EXCLUDED.status,
           sla_target_hours = EXCLUDED.sla_target_hours,
           actual_hours = EXCLUDED.actual_hours,
           met_sla = EXCLUDED.met_sla,
           reported_by = EXCLUDED.reported_by,
           resolved_by = EXCLUDED.resolved_by,
           updated_at = now()`,
        [itemToSave.id, itemToSave.requestId, itemToSave.requestDate || null, itemToSave.requestType, itemToSave.itemEquipment, itemToSave.severity, itemToSave.status, itemToSave.slaTargetHours, itemToSave.actualHours, itemToSave.metSla || null, itemToSave.reportedBy, itemToSave.resolvedBy || null],
      ).catch(err => this.logger.error(`PG Error inserting weekly request: ${err.message}`));
    }
  }

  updateWeeklyRequest(id: string, updates: Partial<WeeklyTechnicalRequestRecord>): WeeklyTechnicalRequestRecord | undefined {
    const idx = this.weeklyRequestsCache.findIndex(w => w.id === id);
    if (idx !== -1) {
      const cleanUpdates = {
        ...updates,
        ...(updates.status !== undefined ? { status: normalizeTicketStatus(updates.status) } : {}),
      };
      this.weeklyRequestsCache[idx] = { ...this.weeklyRequestsCache[idx], ...cleanUpdates };
      this.saveWeeklyRequests();
      const updated = this.weeklyRequestsCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.addWeeklyRequest(updated);
      }
      return updated;
    }
    return undefined;
  }

  deleteWeeklyRequest(id: string): boolean {
    const initialLen = this.weeklyRequestsCache.length;
    this.weeklyRequestsCache = this.weeklyRequestsCache.filter(w => w.id !== id);
    if (this.weeklyRequestsCache.length !== initialLen) {
      this.saveWeeklyRequests();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM weekly_technical_requests WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting weekly request: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== DEFECT LOGS (2_Defect_Log) ====================
  getDefectLogs(): DefectLogRecord[] { return this.defectLogsCache; }
  getDefectLogById(id: string | number): DefectLogRecord | undefined {
    return this.defectLogsCache.find(d => d.id === String(id) || d.defectId === Number(id));
  }
  saveDefectLogs(): void { this.writeJson('defect_logs.json', this.defectLogsCache); }

  addDefectLog(d: DefectLogRecord): void {
    const idx = this.defectLogsCache.findIndex(x => x.id === d.id || x.defectId === d.defectId);
    if (idx !== -1) {
      this.defectLogsCache[idx] = d;
    } else {
      this.defectLogsCache.unshift(d);
    }
    this.saveDefectLogs();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO defect_logs (
           id, defect_id, defect_date, facility, source, root_cause_category,
           specific_issue, affected_product, downtime_minutes, recurring_issue, eight_d_required
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           defect_date = EXCLUDED.defect_date,
           facility = EXCLUDED.facility,
           source = EXCLUDED.source,
           root_cause_category = EXCLUDED.root_cause_category,
           specific_issue = EXCLUDED.specific_issue,
           affected_product = EXCLUDED.affected_product,
           downtime_minutes = EXCLUDED.downtime_minutes,
           recurring_issue = EXCLUDED.recurring_issue,
           eight_d_required = EXCLUDED.eight_d_required,
           updated_at = now()`,
        [d.id, d.defectId, d.defectDate, d.facility, d.source, d.rootCauseCategory, d.specificIssue, d.affectedProduct, d.downtimeMinutes || null, d.recurringIssue, d.eightDRequired],
      ).catch(err => this.logger.error(`PG Error inserting defect log: ${err.message}`));
    }
  }

  updateDefectLog(id: string, updates: Partial<DefectLogRecord>): DefectLogRecord | undefined {
    const idx = this.defectLogsCache.findIndex(d => d.id === id || String(d.defectId) === id);
    if (idx !== -1) {
      this.defectLogsCache[idx] = { ...this.defectLogsCache[idx], ...updates };
      this.saveDefectLogs();
      const updated = this.defectLogsCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.addDefectLog(updated);
      }
      return updated;
    }
    return undefined;
  }

  deleteDefectLog(id: string): boolean {
    const initialLen = this.defectLogsCache.length;
    this.defectLogsCache = this.defectLogsCache.filter(d => d.id !== id && String(d.defectId) !== id);
    if (this.defectLogsCache.length !== initialLen) {
      this.saveDefectLogs();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM defect_logs WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting defect log: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== ACTION PLANS (3_Action_Plan) ====================
  getActionPlans(): ActionPlanRecord[] { return this.actionPlansCache; }
  getActionPlanById(id: string): ActionPlanRecord | undefined {
    return this.actionPlansCache.find(a => a.id === id || a.actionId === id);
  }
  saveActionPlans(): void { this.writeJson('action_plans.json', this.actionPlansCache); }

  addActionPlan(a: ActionPlanRecord): void {
    const idx = this.actionPlansCache.findIndex(x => x.id === a.id || x.actionId === a.actionId);
    if (idx !== -1) {
      this.actionPlansCache[idx] = a;
    } else {
      this.actionPlansCache.unshift(a);
    }
    this.saveActionPlans();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO action_plans (
           id, action_id, date_logged, facility, related_defect_id, fix_type,
           description, pic, deadline, status, resource_needed, remarks
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           action_id = EXCLUDED.action_id,
           date_logged = EXCLUDED.date_logged,
           facility = EXCLUDED.facility,
           related_defect_id = EXCLUDED.related_defect_id,
           fix_type = EXCLUDED.fix_type,
           description = EXCLUDED.description,
           pic = EXCLUDED.pic,
           deadline = EXCLUDED.deadline,
           status = EXCLUDED.status,
           resource_needed = EXCLUDED.resource_needed,
           remarks = EXCLUDED.remarks,
           updated_at = now()`,
        [a.id, a.actionId, a.dateLogged, a.facility, a.relatedDefectId || null, a.fixType, a.description, a.pic, a.deadline, a.status, a.resourceNeeded, a.remarks || null],
      ).catch(err => this.logger.error(`PG Error inserting action plan: ${err.message}`));
    }
  }

  updateActionPlan(id: string, updates: Partial<ActionPlanRecord>): ActionPlanRecord | undefined {
    const idx = this.actionPlansCache.findIndex(a => a.id === id || a.actionId === id);
    if (idx !== -1) {
      this.actionPlansCache[idx] = { ...this.actionPlansCache[idx], ...updates };
      this.saveActionPlans();
      const updated = this.actionPlansCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.addActionPlan(updated);
      }
      return updated;
    }
    return undefined;
  }

  deleteActionPlan(id: string): boolean {
    const initialLen = this.actionPlansCache.length;
    this.actionPlansCache = this.actionPlansCache.filter(a => a.id !== id && a.actionId !== id);
    if (this.actionPlansCache.length !== initialLen) {
      this.saveActionPlans();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM action_plans WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting action plan: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== FORM LOOKUP OPTIONS (Lists_DO_NOT_DELETE) ====================
  getLookupOptions(category?: string): FormLookupOptionRecord[] {
    if (this.formLookupOptionsCache.length === 0) {
      this.formLookupOptionsCache = this.readJson<FormLookupOptionRecord[]>('form_lookup_options.json', []);
    }
    if (category) {
      return this.formLookupOptionsCache.filter(o => o.category.toLowerCase() === category.toLowerCase());
    }
    return this.formLookupOptionsCache;
  }
  saveLookupOptions(): void { this.writeJson('form_lookup_options.json', this.formLookupOptionsCache); }

  addLookupOption(opt: FormLookupOptionRecord): void {
    const idx = this.formLookupOptionsCache.findIndex(o => o.id === opt.id || (o.category === opt.category && o.itemValue === opt.itemValue));
    if (idx !== -1) {
      this.formLookupOptionsCache[idx] = opt;
    } else {
      this.formLookupOptionsCache.push(opt);
    }
    this.saveLookupOptions();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO form_lookup_options (id, category, item_value, item_label, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           item_value = EXCLUDED.item_value,
           item_label = EXCLUDED.item_label,
           sort_order = EXCLUDED.sort_order,
           is_active = EXCLUDED.is_active`,
        [opt.id, opt.category, opt.itemValue, opt.itemLabel || opt.itemValue, opt.sortOrder || 0, opt.isActive ?? true],
      ).catch(err => this.logger.error(`PG Error inserting lookup option: ${err.message}`));
    }
  }

  getSheetLists(): SheetListsRowRecord[] { return this.sheetListsCache; }

  // ==================== TECHNICAL REQUESTS FORM V4.1 ====================
  getRequests(): TechnicalRequestRecord[] { return this.requestsCache; }

  getRequestById(id: string): TechnicalRequestRecord | undefined {
    return this.requestsCache.find(r => r.id === id || r.docNo === id);
  }

  saveRequests(): void { this.writeJson('technical_requests.json', this.requestsCache); }

  addRequest(req: TechnicalRequestRecord): void {
    const idx = this.requestsCache.findIndex(r => r.id === req.id || r.docNo === req.docNo);
    if (idx !== -1) {
      this.requestsCache[idx] = req;
    } else {
      this.requestsCache.unshift(req);
    }
    this.saveRequests();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO technical_requests (
           id, doc_no, req_date, req_time, req_by, print_tech, machine_name, problem,
           machine_status, priority, priority_other, recv_by, recv_date, recv_time,
           finish_date, finish_time, downtime, root_cause, action_taken, err_cat, err_type,
           photos_before, photos_after, chk_quality, chk_status, work_order, wo_total_qty,
           waste_qty, waste_unit, waste_percent, prod_mgr, created_by, created_at, updated_at
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8,
           $9, $10, $11, $12, $13, $14,
           $15, $16, $17, $18, $19, $20, $21,
           $22, $23, $24, $25, $26, $27,
           $28, $29, $30, $31, $32, $33, $34
         ) ON CONFLICT (id) DO UPDATE SET
           doc_no = EXCLUDED.doc_no,
           req_date = EXCLUDED.req_date,
           req_time = EXCLUDED.req_time,
           req_by = EXCLUDED.req_by,
           print_tech = EXCLUDED.print_tech,
           machine_name = EXCLUDED.machine_name,
           problem = EXCLUDED.problem,
           machine_status = EXCLUDED.machine_status,
           priority = EXCLUDED.priority,
           priority_other = EXCLUDED.priority_other,
           recv_by = EXCLUDED.recv_by,
           recv_date = EXCLUDED.recv_date,
           recv_time = EXCLUDED.recv_time,
           finish_date = EXCLUDED.finish_date,
           finish_time = EXCLUDED.finish_time,
           downtime = EXCLUDED.downtime,
           root_cause = EXCLUDED.root_cause,
           action_taken = EXCLUDED.action_taken,
           err_cat = EXCLUDED.err_cat,
           err_type = EXCLUDED.err_type,
           photos_before = EXCLUDED.photos_before,
           photos_after = EXCLUDED.photos_after,
           chk_quality = EXCLUDED.chk_quality,
           chk_status = EXCLUDED.chk_status,
           work_order = EXCLUDED.work_order,
           wo_total_qty = EXCLUDED.wo_total_qty,
           waste_qty = EXCLUDED.waste_qty,
           waste_unit = EXCLUDED.waste_unit,
           waste_percent = EXCLUDED.waste_percent,
           prod_mgr = EXCLUDED.prod_mgr,
           created_by = EXCLUDED.created_by,
           updated_at = EXCLUDED.updated_at`,
        [
          req.id, req.docNo, req.reqDate, req.reqTime, req.reqBy, req.printTech, req.machineName, req.problem,
          req.machineStatus || null, req.priority || null, req.priorityOther || null,
          req.recvBy || null, req.recvDate || null, req.recvTime || null,
          req.finishDate || null, req.finishTime || null, req.downtime || 0,
          req.rootCause || null, req.actionTaken || null, req.errCat || null, req.errType || null,
          JSON.stringify(req.photosBefore || []), JSON.stringify(req.photosAfter || []),
          req.chkQuality || null, req.chkStatus || null, req.workOrder || null,
          req.woTotalQty || 0, req.wasteQty || 0, req.wasteUnit || null, req.wastePercent || null,
          req.prodMgr || null, req.createdBy || null, req.createdAt, req.updatedAt,
        ],
      ).catch(err => this.logger.error(`PG Error inserting request: ${err.message}`));
    }
  }

  updateRequest(id: string, updates: Partial<TechnicalRequestRecord>): TechnicalRequestRecord | undefined {
    const idx = this.requestsCache.findIndex(r => r.id === id || r.docNo === id);
    if (idx !== -1) {
      this.requestsCache[idx] = { ...this.requestsCache[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveRequests();
      const updated = this.requestsCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.addRequest(updated);
      }

      return updated;
    }
    return undefined;
  }

  deleteRequest(id: string): boolean {
    const initialLen = this.requestsCache.length;
    this.requestsCache = this.requestsCache.filter(r => r.id !== id && r.docNo !== id);
    if (this.requestsCache.length !== initialLen) {
      this.saveRequests();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM technical_requests WHERE id = $1 OR doc_no = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting request: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // ==================== CPSR / CPST / CPSF (1-1-1 SPLIT FORMS) ====================
  saveCpsrList(): void { this.writeJson('cpsr.json', this.cpsrCache); }
  saveCpstList(): void { this.writeJson('cpst.json', this.cpstCache); }
  saveCpsfList(): void { this.writeJson('cpsf.json', this.cpsfCache); }

  getCpsrList(): CpsrRecord[] { return this.cpsrCache; }

  getCpsrByIdOrDocNo(id: string): CpsrRecord | undefined {
    return this.cpsrCache.find(r => r.id === id || r.docNo === id);
  }

  async addCpsr(req: CpsrRecord): Promise<void> {
    const idx = this.cpsrCache.findIndex(r => r.id === req.id || r.docNo === req.docNo);
    if (idx !== -1) {
      this.cpsrCache[idx] = req;
    } else {
      this.cpsrCache.unshift(req);
    }
    this.saveCpsrList();

    if (this.isPgConnected && this.pgPool) {
      try {
        await this.pgPool.query(
          `INSERT INTO cpsr (
             id, doc_no, req_date, req_time, req_by, print_tech, machine_name,
             problem, machine_status, priority, priority_other, submitted_at,
             created_by, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT (id) DO UPDATE SET
             doc_no = EXCLUDED.doc_no,
             req_date = EXCLUDED.req_date,
             req_time = EXCLUDED.req_time,
             req_by = EXCLUDED.req_by,
             print_tech = EXCLUDED.print_tech,
             machine_name = EXCLUDED.machine_name,
             problem = EXCLUDED.problem,
             machine_status = EXCLUDED.machine_status,
             priority = EXCLUDED.priority,
             priority_other = EXCLUDED.priority_other,
             submitted_at = EXCLUDED.submitted_at,
             created_by = EXCLUDED.created_by,
             updated_at = EXCLUDED.updated_at`,
          [
            req.id, req.docNo, req.reqDate, req.reqTime, req.reqBy, req.printTech, req.machineName,
            req.problem, req.machineStatus || null, req.priority || null, req.priorityOther || null,
            req.submittedAt, req.createdBy || 'public', req.createdAt, req.updatedAt,
          ]
        );
      } catch (err: any) {
        this.logger.error(`PG Error inserting cpsr: ${err.message}`);
        throw err;
      }
    }
  }

  async updateCpsr(id: string, updates: Partial<CpsrRecord>): Promise<CpsrRecord | undefined> {
    const idx = this.cpsrCache.findIndex(r => r.id === id || r.docNo === id);
    if (idx !== -1) {
      this.cpsrCache[idx] = { ...this.cpsrCache[idx], ...updates, updatedAt: new Date().toISOString() };
      const updated = this.cpsrCache[idx];
      this.saveCpsrList();
      if (this.isPgConnected && this.pgPool) {
        await this.addCpsr(updated);
      }
      return updated;
    }
    return undefined;
  }

  async deleteCpsr(id: string): Promise<boolean> {
    const target = this.cpsrCache.find(r => r.id === id || r.docNo === id);
    if (!target) return false;
    this.cpsrCache = this.cpsrCache.filter(r => r.id !== target.id && r.docNo !== target.docNo);
    const deletedCpst = this.cpstCache.find(t => t.cpsrDocNo === target.docNo);
    this.cpstCache = this.cpstCache.filter(t => t.cpsrDocNo !== target.docNo);
    if (deletedCpst) {
      this.cpsfCache = this.cpsfCache.filter(f => f.cpstDocNo !== deletedCpst.docNo);
    }
    const linkedCps = this.cpsCache.find(c => c.cpsrDocNo === target.docNo);
    if (linkedCps) {
      this.cpsCache = this.cpsCache.filter(c => c.cpsrDocNo !== target.docNo && c.id !== linkedCps.id);
    }
    this.saveCpsrList();
    this.saveCpstList();
    this.saveCpsfList();
    this.saveCpsList();

    if (this.isPgConnected && this.pgPool) {
      await this.pgPool.query('DELETE FROM cpsr WHERE id = $1 OR doc_no = $1', [target.id])
        .catch(err => this.logger.error(`PG Error deleting cpsr: ${err.message}`));
      if (linkedCps) {
        await this.pgPool.query('DELETE FROM cps WHERE id = $1 OR doc_no = $1 OR cpsr_doc_no = $2', [linkedCps.id, target.docNo])
          .catch(err => this.logger.error(`PG Error deleting cps: ${err.message}`));
      }
    }
    return true;
  }

  getCpstList(): CpstRecord[] { return this.cpstCache; }

  getCpstByIdOrDocNo(id: string): CpstRecord | undefined {
    return this.cpstCache.find(r => r.id === id || r.docNo === id);
  }

  async addCpst(req: CpstRecord): Promise<void> {
    const idx = this.cpstCache.findIndex(r => r.id === req.id || r.docNo === req.docNo);
    if (idx !== -1) {
      this.cpstCache[idx] = req;
    } else {
      this.cpstCache.unshift(req);
    }
    this.saveCpstList();

    if (this.isPgConnected && this.pgPool) {
      try {
        await this.pgPool.query(
          `INSERT INTO cpst (
             id, doc_no, cpsr_id, cpsr_doc_no, recv_by, recv_date, recv_time,
             finish_date, finish_time, downtime, root_cause, action_taken,
             err_cat, err_type, photos_before, photos_after, chk_status,
             submitted_at, created_by, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
           ON CONFLICT (id) DO UPDATE SET
             doc_no = EXCLUDED.doc_no,
             cpsr_id = EXCLUDED.cpsr_id,
             cpsr_doc_no = EXCLUDED.cpsr_doc_no,
             recv_by = EXCLUDED.recv_by,
             recv_date = EXCLUDED.recv_date,
             recv_time = EXCLUDED.recv_time,
             finish_date = EXCLUDED.finish_date,
             finish_time = EXCLUDED.finish_time,
             downtime = EXCLUDED.downtime,
             root_cause = EXCLUDED.root_cause,
             action_taken = EXCLUDED.action_taken,
             err_cat = EXCLUDED.err_cat,
             err_type = EXCLUDED.err_type,
             photos_before = EXCLUDED.photos_before,
             photos_after = EXCLUDED.photos_after,
             chk_status = EXCLUDED.chk_status,
             submitted_at = EXCLUDED.submitted_at,
             created_by = EXCLUDED.created_by,
             updated_at = EXCLUDED.updated_at`,
          [
            req.id, req.docNo, req.cpsrId || null, req.cpsrDocNo, req.recvBy,
            req.recvDate || null, req.recvTime || null, req.finishDate || null, req.finishTime || null,
            req.downtime || 0, req.rootCause || null, req.actionTaken || null,
            req.errCat || null, req.errType || null,
            JSON.stringify(req.photosBefore || []), JSON.stringify(req.photosAfter || []),
            req.chkStatus || null, req.submittedAt, req.createdBy || 'public', req.createdAt, req.updatedAt,
          ]
        );
      } catch (err: any) {
        this.logger.error(`PG Error inserting cpst: ${err.message}`);
        throw err;
      }
    }
  }

  async updateCpst(id: string, updates: Partial<CpstRecord>): Promise<CpstRecord | undefined> {
    const idx = this.cpstCache.findIndex(r => r.id === id || r.docNo === id);
    if (idx !== -1) {
      this.cpstCache[idx] = { ...this.cpstCache[idx], ...updates, updatedAt: new Date().toISOString() };
      const updated = this.cpstCache[idx];
      this.saveCpstList();
      if (this.isPgConnected && this.pgPool) {
        await this.addCpst(updated);
      }
      return updated;
    }
    return undefined;
  }

  async deleteCpst(id: string): Promise<boolean> {
    const target = this.cpstCache.find(r => r.id === id || r.docNo === id);
    if (!target) return false;
    this.cpstCache = this.cpstCache.filter(r => r.id !== target.id && r.docNo !== target.docNo);
    this.cpsfCache = this.cpsfCache.filter(f => f.cpstDocNo !== target.docNo);

    // Unlink CPST & CPSF in CPS
    const linkedCps = this.cpsCache.find(c => c.cpsrDocNo === target.cpsrDocNo || c.cpstDocNo === target.docNo);
    if (linkedCps) {
      linkedCps.cpstId = null;
      linkedCps.cpstDocNo = null;
      linkedCps.cpsfId = null;
      linkedCps.cpsfDocNo = null;
      linkedCps.downtime = 0;
      linkedCps.chkStatus = null;
      linkedCps.chkQuality = null;
      linkedCps.workOrder = null;
      linkedCps.woTotalQty = 0;
      linkedCps.wasteQty = 0;
      linkedCps.wastePercent = '0%';
      linkedCps.closedAt = null;
      linkedCps.status = computeCpsStatus(linkedCps);
      linkedCps.updatedAt = new Date().toISOString();
      if (this.isPgConnected && this.pgPool) {
        this.addCps(linkedCps).catch(() => {});
      }
    }

    this.saveCpstList();
    this.saveCpsfList();
    this.saveCpsList();

    if (this.isPgConnected && this.pgPool) {
      await this.pgPool.query('DELETE FROM cpst WHERE id = $1 OR doc_no = $1', [target.id])
        .catch(err => this.logger.error(`PG Error deleting cpst: ${err.message}`));
    }
    return true;
  }

  getCpsfList(): CpsfRecord[] { return this.cpsfCache; }

  getCpsfByIdOrDocNo(id: string): CpsfRecord | undefined {
    return this.cpsfCache.find(r => r.id === id || r.docNo === id);
  }

  async addCpsf(req: CpsfRecord): Promise<void> {
    const idx = this.cpsfCache.findIndex(r => r.id === req.id || r.docNo === req.docNo);
    if (idx !== -1) {
      this.cpsfCache[idx] = req;
    } else {
      this.cpsfCache.unshift(req);
    }
    this.saveCpsfList();

    if (this.isPgConnected && this.pgPool) {
      try {
        await this.pgPool.query(
          `INSERT INTO cpsf (
             id, doc_no, cpst_id, cpst_doc_no, cpsr_doc_no, chk_quality,
             work_order, wo_total_qty, waste_qty, waste_unit, waste_percent,
             prod_mgr, submitted_at, created_by, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO UPDATE SET
             doc_no = EXCLUDED.doc_no,
             cpst_id = EXCLUDED.cpst_id,
             cpst_doc_no = EXCLUDED.cpst_doc_no,
             cpsr_doc_no = EXCLUDED.cpsr_doc_no,
             chk_quality = EXCLUDED.chk_quality,
             work_order = EXCLUDED.work_order,
             wo_total_qty = EXCLUDED.wo_total_qty,
             waste_qty = EXCLUDED.waste_qty,
             waste_unit = EXCLUDED.waste_unit,
             waste_percent = EXCLUDED.waste_percent,
             prod_mgr = EXCLUDED.prod_mgr,
             submitted_at = EXCLUDED.submitted_at,
             created_by = EXCLUDED.created_by,
             updated_at = EXCLUDED.updated_at`,
          [
            req.id, req.docNo, req.cpstId || null, req.cpstDocNo, req.cpsrDocNo || null,
            req.chkQuality || null, req.workOrder || null, req.woTotalQty || 0,
            req.wasteQty || 0, req.wasteUnit || null, req.wastePercent || null,
            req.prodMgr || null, req.submittedAt, req.createdBy || 'public', req.createdAt, req.updatedAt,
          ]
        );
      } catch (err: any) {
        this.logger.error(`PG Error inserting cpsf: ${err.message}`);
        throw err;
      }
    }
  }

  async updateCpsf(id: string, updates: Partial<CpsfRecord>): Promise<CpsfRecord | undefined> {
    const idx = this.cpsfCache.findIndex(r => r.id === id || r.docNo === id);
    if (idx !== -1) {
      this.cpsfCache[idx] = { ...this.cpsfCache[idx], ...updates, updatedAt: new Date().toISOString() };
      const updated = this.cpsfCache[idx];
      this.saveCpsfList();
      if (this.isPgConnected && this.pgPool) {
        await this.addCpsf(updated);
      }
      return updated;
    }
    return undefined;
  }

  async deleteCpsf(id: string): Promise<boolean> {
    const target = this.cpsfCache.find(r => r.id === id || r.docNo === id);
    if (!target) return false;
    this.cpsfCache = this.cpsfCache.filter(r => r.id !== target.id && r.docNo !== target.docNo);

    // Unlink CPSF in CPS and reopen from CLOSED
    const linkedCps = this.cpsCache.find(c => c.cpsfDocNo === target.docNo || c.cpstDocNo === target.cpstDocNo);
    if (linkedCps) {
      linkedCps.cpsfId = null;
      linkedCps.cpsfDocNo = null;
      linkedCps.chkQuality = null;
      linkedCps.workOrder = null;
      linkedCps.woTotalQty = 0;
      linkedCps.wasteQty = 0;
      linkedCps.wastePercent = '0%';
      linkedCps.closedAt = null;
      linkedCps.status = computeCpsStatus(linkedCps);
      linkedCps.updatedAt = new Date().toISOString();
      if (this.isPgConnected && this.pgPool) {
        this.addCps(linkedCps).catch(() => {});
      }
    }

    this.saveCpsfList();
    this.saveCpsList();

    if (this.isPgConnected && this.pgPool) {
      await this.pgPool.query('DELETE FROM cpsf WHERE id = $1 OR doc_no = $1', [target.id])
        .catch(err => this.logger.error(`PG Error deleting cpsf: ${err.message}`));
    }
    return true;
  }

  // ==================== CPS (CHAIN & ASSIGN TASK MASTER) ====================
  saveCpsList(): void { this.writeJson('cps.json', this.cpsCache); }

  getCpsList(): CpsRecord[] {
    return this.cpsCache.map(r => {
      const cpsr = this.cpsrCache.find(x => x.docNo === r.cpsrDocNo) || null;
      const cpst = (r.cpstDocNo ? this.cpstCache.find(x => x.docNo === r.cpstDocNo) : (cpsr ? this.cpstCache.find(x => x.cpsrDocNo === cpsr.docNo) : null)) || null;
      const cpsf = (r.cpsfDocNo ? this.cpsfCache.find(x => x.docNo === r.cpsfDocNo) : (cpst ? this.cpsfCache.find(x => x.cpstDocNo === cpst.docNo) : null)) || null;

      const cpstDocNo = r.cpstDocNo || cpst?.docNo || null;
      const cpsfDocNo = r.cpsfDocNo || cpsf?.docNo || null;
      const downtime = (r.downtime !== undefined && r.downtime > 0) ? r.downtime : (cpst?.downtime || 0);
      const woTotalQty = (r.woTotalQty !== undefined && r.woTotalQty > 0) ? r.woTotalQty : (cpsf?.woTotalQty || 0);
      const wasteQty = (r.wasteQty !== undefined && r.wasteQty > 0) ? r.wasteQty : (cpsf?.wasteQty || 0);
      const wastePercent = (woTotalQty > 0)
        ? ((wasteQty / woTotalQty) * 100).toFixed(2) + '%'
        : (r.wastePercent || cpsf?.wastePercent || '0%');

      const evaluatedStatus = computeCpsStatus({
        status: r.status,
        cpsfDocNo,
        assignedTo: r.assignedTo || cpst?.recvBy || null,
        deadline: r.deadline,
      });

      return {
        ...r,
        cpstDocNo,
        cpsfDocNo,
        downtime,
        woTotalQty,
        wasteQty,
        wastePercent,
        status: evaluatedStatus,
        cpsr,
        cpst,
        cpsf,
      };
    });
  }

  getCpsByIdOrDocNo(id: string): CpsRecord | undefined {
    const clean = (id || '').trim();
    const list = this.getCpsList();
    return list.find(r => r.id === clean || r.docNo === clean || r.cpsrDocNo === clean);
  }

  getCpsByCpsrDocNo(cpsrDocNo: string): CpsRecord | undefined {
    const clean = (cpsrDocNo || '').trim();
    const list = this.getCpsList();
    return list.find(r => r.cpsrDocNo === clean);
  }

  async addCps(req: CpsRecord): Promise<void> {
    const idx = this.cpsCache.findIndex(r => r.id === req.id || r.docNo === req.docNo);
    if (idx !== -1) {
      this.cpsCache[idx] = req;
    } else {
      this.cpsCache.unshift(req);
    }
    this.saveCpsList();

    if (this.isPgConnected && this.pgPool) {
      try {
        await this.pgPool.query(
          `INSERT INTO cps (
             id, doc_no, cpsr_id, cpsr_doc_no, cpst_id, cpst_doc_no, cpsf_id, cpsf_doc_no,
             status, assigned_to, assigned_to_id, assigned_to_name, assigned_by, assigned_at,
             deadline, priority, print_tech, machine_name, problem, req_by, req_date, req_time,
             downtime, wo_total_qty, waste_qty, waste_percent, waste_unit, work_order,
             chk_status, chk_quality, notes, closed_at, created_at, updated_at
           ) VALUES (
             $1, $2, $3, $4, $5, $6, $7, $8,
             $9, $10, $11, $12, $13, $14,
             $15, $16, $17, $18, $19, $20, $21, $22,
             $23, $24, $25, $26, $27, $28,
             $29, $30, $31, $32, $33, $34
           )
           ON CONFLICT (id) DO UPDATE SET
             doc_no = EXCLUDED.doc_no,
             cpsr_id = EXCLUDED.cpsr_id,
             cpsr_doc_no = EXCLUDED.cpsr_doc_no,
             cpst_id = EXCLUDED.cpst_id,
             cpst_doc_no = EXCLUDED.cpst_doc_no,
             cpsf_id = EXCLUDED.cpsf_id,
             cpsf_doc_no = EXCLUDED.cpsf_doc_no,
             status = EXCLUDED.status,
             assigned_to = EXCLUDED.assigned_to,
             assigned_to_id = EXCLUDED.assigned_to_id,
             assigned_to_name = EXCLUDED.assigned_to_name,
             assigned_by = EXCLUDED.assigned_by,
             assigned_at = EXCLUDED.assigned_at,
             deadline = EXCLUDED.deadline,
             priority = EXCLUDED.priority,
             print_tech = EXCLUDED.print_tech,
             machine_name = EXCLUDED.machine_name,
             problem = EXCLUDED.problem,
             req_by = EXCLUDED.req_by,
             req_date = EXCLUDED.req_date,
             req_time = EXCLUDED.req_time,
             downtime = EXCLUDED.downtime,
             wo_total_qty = EXCLUDED.wo_total_qty,
             waste_qty = EXCLUDED.waste_qty,
             waste_percent = EXCLUDED.waste_percent,
             waste_unit = EXCLUDED.waste_unit,
             work_order = EXCLUDED.work_order,
             chk_status = EXCLUDED.chk_status,
             chk_quality = EXCLUDED.chk_quality,
             notes = EXCLUDED.notes,
             closed_at = EXCLUDED.closed_at,
             updated_at = EXCLUDED.updated_at`,
          [
            req.id, req.docNo, req.cpsrId || null, req.cpsrDocNo, req.cpstId || null, req.cpstDocNo || null,
            req.cpsfId || null, req.cpsfDocNo || null, req.status, req.assignedTo || null,
            req.assignedToId || null, req.assignedToName || null, req.assignedBy || null,
            req.assignedAt ? new Date(req.assignedAt).toISOString() : null,
            req.deadline ? new Date(req.deadline).toISOString() : null,
            req.priority || null, req.printTech || null, req.machineName || null, req.problem || null,
            req.reqBy || null, req.reqDate || null, req.reqTime || null,
            req.downtime || 0, req.woTotalQty || 0, req.wasteQty || 0,
            req.wastePercent || null, req.wasteUnit || null, req.workOrder || null,
            req.chkStatus || null, req.chkQuality || null, req.notes || null,
            req.closedAt ? new Date(req.closedAt).toISOString() : null,
            req.createdAt ? new Date(req.createdAt).toISOString() : new Date().toISOString(),
            req.updatedAt ? new Date(req.updatedAt).toISOString() : new Date().toISOString(),
          ]
        );
      } catch (err: any) {
        this.logger.error(`PG Error inserting cps: ${err.message}`);
        throw err;
      }
    }
  }

  async updateCps(id: string, updates: Partial<CpsRecord>): Promise<CpsRecord | undefined> {
    const idx = this.cpsCache.findIndex(r => r.id === id || r.docNo === id || r.cpsrDocNo === id);
    if (idx !== -1) {
      const existing = this.cpsCache[idx];
      const now = new Date().toISOString();
      const updated: CpsRecord = {
        ...existing,
        ...updates,
        updatedAt: now,
      };
      updated.status = computeCpsStatus(updated);
      this.cpsCache[idx] = updated;
      this.saveCpsList();
      if (this.isPgConnected && this.pgPool) {
        await this.addCps(updated);
      }
      return updated;
    }
    return undefined;
  }

  async deleteCps(id: string): Promise<boolean> {
    const target = this.cpsCache.find(r => r.id === id || r.docNo === id);
    if (!target) return false;
    this.cpsCache = this.cpsCache.filter(r => r.id !== target.id && r.docNo !== target.docNo);
    this.saveCpsList();

    if (this.isPgConnected && this.pgPool) {
      await this.pgPool.query('DELETE FROM cps WHERE id = $1 OR doc_no = $1', [target.id])
        .catch(err => this.logger.error(`PG Error deleting cps: ${err.message}`));
    }
    return true;
  }

  public async syncCpsFromChains(): Promise<void> {
    let changed = false;
    for (const cpsr of this.cpsrCache) {
      const existing = this.cpsCache.find(c => c.cpsrDocNo === cpsr.docNo);
      const cpst = this.cpstCache.find(t => t.cpsrDocNo === cpsr.docNo);
      const cpsf = cpst ? this.cpsfCache.find(f => f.cpstDocNo === cpst.docNo) : null;

      const woTotalQty = (cpsf && cpsf.woTotalQty) ? Number(cpsf.woTotalQty) : (existing?.woTotalQty || 0);
      const wasteQty = (cpsf && cpsf.wasteQty) ? Number(cpsf.wasteQty) : (existing?.wasteQty || 0);
      const wastePercent = (woTotalQty > 0)
        ? ((wasteQty / woTotalQty) * 100).toFixed(2) + '%'
        : (cpsf?.wastePercent || existing?.wastePercent || '0%');
      const downtime = (cpst && cpst.downtime !== undefined) ? Number(cpst.downtime) : (existing?.downtime || 0);

      if (!existing) {
        let docNo = cpsr.docNo.replace(/^CPSR-/, 'CPS-');
        if (this.cpsCache.some(c => c.docNo === docNo)) {
          docNo = await this.getNextDocNo('CPS');
        }
        const now = new Date().toISOString();
        const newRecord: CpsRecord = {
          id: uuidv4(),
          docNo,
          cpsrId: cpsr.id,
          cpsrDocNo: cpsr.docNo,
          cpstId: cpst?.id || null,
          cpstDocNo: cpst?.docNo || null,
          cpsfId: cpsf?.id || null,
          cpsfDocNo: cpsf?.docNo || null,
          status: 'TO_ASSIGN',
          assignedTo: cpst?.recvBy || null,
          deadline: null,
          priority: cpsr.priority,
          printTech: cpsr.printTech,
          machineName: cpsr.machineName,
          problem: cpsr.problem,
          reqBy: cpsr.reqBy,
          reqDate: cpsr.reqDate,
          reqTime: cpsr.reqTime,
          downtime,
          woTotalQty,
          wasteQty,
          wastePercent,
          wasteUnit: cpsf?.wasteUnit || null,
          workOrder: cpsf?.workOrder || null,
          chkStatus: cpst?.chkStatus || null,
          chkQuality: cpsf?.chkQuality || null,
          closedAt: cpsf ? (cpsf.submittedAt || now) : null,
          createdAt: cpsr.createdAt || now,
          updatedAt: now,
        };
        newRecord.status = computeCpsStatus(newRecord);
        this.cpsCache.push(newRecord);
        changed = true;
        if (this.isPgConnected && this.pgPool) {
          try {
            await this.addCps(newRecord);
          } catch (e: any) {
            this.logger.warn(`Could not sync CPS ${newRecord.docNo} to PG: ${e.message}`);
          }
        }
      } else {
        let needUpdate = false;
        if (cpst && existing.cpstDocNo !== cpst.docNo) {
          existing.cpstId = cpst.id;
          existing.cpstDocNo = cpst.docNo;
          needUpdate = true;
        }
        if (cpsf && existing.cpsfDocNo !== cpsf.docNo) {
          existing.cpsfId = cpsf.id;
          existing.cpsfDocNo = cpsf.docNo;
          existing.woTotalQty = woTotalQty;
          existing.wasteQty = wasteQty;
          existing.wastePercent = wastePercent;
          existing.wasteUnit = cpsf.wasteUnit || null;
          existing.workOrder = cpsf.workOrder || null;
          existing.chkQuality = cpsf.chkQuality || null;
          existing.closedAt = cpsf.submittedAt || new Date().toISOString();
          needUpdate = true;
        }
        if (cpst && existing.downtime !== downtime) {
          existing.downtime = downtime;
          existing.chkStatus = cpst.chkStatus || null;
          needUpdate = true;
        }
        const updatedStatus = computeCpsStatus(existing);
        if (existing.status !== updatedStatus) {
          existing.status = updatedStatus;
          needUpdate = true;
        }
        if (needUpdate) {
          existing.updatedAt = new Date().toISOString();
          changed = true;
          if (this.isPgConnected && this.pgPool) {
            try {
              await this.addCps(existing);
            } catch (e: any) {
              this.logger.warn(`Could not update CPS ${existing.docNo} in PG: ${e.message}`);
            }
          }
        }
      }
    }
    if (changed) {
      this.saveCpsList();
    }
  }

  async getNextDocNo(prefix: 'CPS' | 'CPSR' | 'CPST' | 'CPSF'): Promise<string> {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;
    const prefixPattern = `${prefix}-${dateStr}-`;

    let maxNum = 0;

    // 1. Check in cache
    let list: { docNo: string }[] = [];
    if (prefix === 'CPS') list = this.cpsCache;
    else if (prefix === 'CPSR') list = this.cpsrCache;
    else if (prefix === 'CPST') list = this.cpstCache;
    else if (prefix === 'CPSF') list = this.cpsfCache;

    for (const item of list) {
      if (item.docNo && item.docNo.startsWith(prefixPattern)) {
        const numPart = item.docNo.slice(prefixPattern.length);
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed) && parsed > maxNum) {
          maxNum = parsed;
        }
      }
    }

    // 2. Check in PG if connected
    if (this.isPgConnected && this.pgPool) {
      try {
        const table = prefix.toLowerCase();
        const res = await this.pgPool.query(
          `SELECT doc_no FROM ${table} WHERE doc_no LIKE $1 ORDER BY doc_no DESC LIMIT 20`,
          [`${prefixPattern}%`]
        );
        for (const row of res.rows) {
          if (row.doc_no && row.doc_no.startsWith(prefixPattern)) {
            const numPart = row.doc_no.slice(prefixPattern.length);
            const parsed = parseInt(numPart, 10);
            if (!isNaN(parsed) && parsed > maxNum) {
              maxNum = parsed;
            }
          }
        }
      } catch (e: any) {
        this.logger.error(`Error querying next doc_no from PG: ${e.message}`);
      }
    }

    const nextSeq = maxNum + 1;
    const seqStr = String(nextSeq).padStart(3, '0');
    return `${prefixPattern}${seqStr}`;
  }

  getAvailableCpsrForCpst(): CpsrRecord[] {
    const linkedDocNos = new Set(this.cpstCache.map(c => c.cpsrDocNo));
    return this.cpsrCache.filter(r => !linkedDocNos.has(r.docNo));
  }

  getAvailableCpstForCpsf(): any[] {
    const linkedDocNos = new Set(this.cpsfCache.map(c => c.cpstDocNo));
    return this.cpstCache
      .filter(r => !linkedDocNos.has(r.docNo))
      .map(cpst => {
        const cpsr = this.cpsrCache.find(r => r.docNo === cpst.cpsrDocNo);
        return {
          ...cpst,
          cpsr: cpsr || null,
        };
      });
  }

  getCpsrChainList(): CpsrChainRecord[] {
    return this.cpsrCache.map(cpsr => {
      const cpst = this.cpstCache.find(t => t.cpsrDocNo === cpsr.docNo) || null;
      const cpsf = cpst ? (this.cpsfCache.find(f => f.cpstDocNo === cpst.docNo) || null) : null;
      return {
        cpsr,
        cpst,
        cpsf,
      };
    });
  }

  getSettings(): SystemSettingsRecord {
    return this.settingsCache;
  }

  saveSettings(): void {
    this.writeJson('settings.json', this.settingsCache);
  }

  updateSettings(updates: Partial<SystemSettingsRecord>, updatedBy?: string): SystemSettingsRecord {
    const now = new Date().toISOString();
    this.settingsCache = {
      ...this.settingsCache,
      ...updates,
      updatedAt: now,
      ...(updatedBy ? { updatedBy } : {}),
    };
    this.saveSettings();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO system_settings (key, value, updated_at, updated_by)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key) DO UPDATE SET
           value = EXCLUDED.value,
           updated_at = EXCLUDED.updated_at,
           updated_by = EXCLUDED.updated_by`,
        ['public_form', JSON.stringify({ isPublicFormEnabled: this.settingsCache.isPublicFormEnabled }), now, updatedBy || null]
      ).catch((err: any) => {
        this.logger.error(`PG Error updating system_settings: ${err.message}`);
      });
    }

    return this.settingsCache;
  }

  async onModuleDestroy() {
    if (this.pgPool) {
      try {
        await this.pgPool.end();
        this.logger.log('PostgreSQL connection pool closed.');
      } catch (err: any) {
        this.logger.warn(`Error closing PostgreSQL pool: ${err.message}`);
      }
    }
  }

  public isPostgresConnected(): boolean {
    return this.isPgConnected;
  }

  public getDatabaseInfo() {
    return {
      connected: this.isPgConnected,
      type: this.isPgConnected ? 'postgresql' : 'json_file',
      host: process.env.POSTGRES_HOST || process.env.DB_HOST || '192.168.1.35',
      port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10),
      database: process.env.POSTGRES_DB || process.env.DB_NAME || process.env.DB || 'checkpoint_technical',
      user: process.env.POSTGRES_USER || process.env.DB_USERNAME || process.env.USER || 'admin',
    };
  }
}
