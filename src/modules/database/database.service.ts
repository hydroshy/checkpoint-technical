import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { Pool, PoolConfig } from 'pg';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MachineRecord {
  id: string;
  tech: string;
  name: string;
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

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly dataDir: string;
  private pgPool: Pool | null = null;
  private isPgConnected = false;

  private usersCache: UserRecord[] = [];
  private machinesCache: MachineRecord[] = [];
  private employeesCache: EmployeeRecord[] = [];
  private requestsCache: TechnicalRequestRecord[] = [];

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
    const dbHost = process.env.DB_HOST || process.env.POSTGRES_HOST;
    const dbPort = parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10);
    const dbUser = process.env.DB_USERNAME || process.env.DB_USER || process.env.POSTGRES_USER || 'admin';
    const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.POSTGRES_PASSWORD !== undefined ? process.env.POSTGRES_PASSWORD : 'mason');
    const dbName = process.env.DB_NAME || process.env.DB_DATABASE || process.env.POSTGRES_DB || 'checkpoint_technical';
    const dbSsl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
    const autoInit = process.env.DB_AUTO_INIT !== 'false';

    // Build candidate hosts if running inside or outside Docker
    const candidateHosts: string[] = [];
    if (dbHost) candidateHosts.push(dbHost);
    const defaults = ['postgres', 'iot_postgres', 'localhost', '127.0.0.1', 'postgres_db'];
    for (const h of defaults) {
      if (!candidateHosts.includes(h)) candidateHosts.push(h);
    }

    let connected = false;

    // Only attempt PostgreSQL connection if DB_HOST is explicitly provided or we have postgres environment configured
    if (dbHost || process.env.DB_NAME || process.env.POSTGRES_DB || process.env.POSTGRES_USER) {
      for (const host of candidateHosts) {
        try {
          const poolConfig: PoolConfig = {
            host,
            port: dbPort,
            user: dbUser,
            password: dbPassword,
            database: dbName,
            ssl: dbSsl,
            connectionTimeoutMillis: 2500,
            max: 10,
          };

          let pool = new Pool(poolConfig);
          try {
            await pool.query('SELECT 1');
          } catch (connErr: any) {
            // If target database does not exist (PostgreSQL code 3D000), try auto-creating it
            if (connErr.code === '3D000' || (connErr.message && connErr.message.includes('does not exist'))) {
              this.logger.log(`Database "${dbName}" does not exist on ${host}. Attempting auto-creation...`);
              const maintenanceDb = ['postgres', 'template1'].includes(dbName) ? 'template1' : 'postgres';
              const adminPool = new Pool({
                host,
                port: dbPort,
                user: dbUser,
                password: dbPassword,
                database: maintenanceDb,
                ssl: dbSsl,
                connectionTimeoutMillis: 2500,
              });
              try {
                await adminPool.query(`CREATE DATABASE "${dbName}"`);
                this.logger.log(`✅ Successfully auto-created PostgreSQL database: "${dbName}"`);
                await adminPool.end();
                // Reconnect to newly created database
                pool = new Pool(poolConfig);
                await pool.query('SELECT 1');
              } catch (createErr: any) {
                await adminPool.end().catch(() => {});
                throw createErr;
              }
            } else {
              throw connErr;
            }
          }

          this.pgPool = pool;
          this.isPgConnected = true;
          connected = true;
          this.logger.log(`✅ Connected to PostgreSQL database: ${host}:${dbPort}/${dbName}`);
          break;
        } catch (err: any) {
          // Continue to next candidate host
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
   */
  private async initPgSchema() {
    if (!this.pgPool) return;

    try {
      await this.pgPool.query(`
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
      `);
      this.logger.log('✅ PostgreSQL Schema verified / initialized (users, machines, employees, technical_requests)');
    } catch (e: any) {
      this.logger.error(`Failed to initialize PostgreSQL schema: ${e.message}`);
    }
  }

  /**
   * Load data from PostgreSQL into cache.
   */
  private async loadFromPg() {
    if (!this.pgPool) return;

    try {
      // 1. Users
      const usersRes = await this.pgPool.query('SELECT * FROM users ORDER BY created_at ASC');
      this.usersCache = usersRes.rows.map(r => ({
        id: r.id,
        username: r.username,
        email: r.email,
        passwordHash: r.password_hash,
        fullName: r.full_name,
        role: r.role,
        isActive: r.is_active,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));

      // 2. Machines
      const machinesRes = await this.pgPool.query('SELECT * FROM machines ORDER BY tech, name');
      this.machinesCache = machinesRes.rows.map(r => ({
        id: r.id,
        tech: r.tech,
        name: r.name,
        code: r.code || undefined,
        note: r.note || undefined,
        isActive: r.is_active,
      }));

      // 3. Employees
      const empRes = await this.pgPool.query('SELECT * FROM employees ORDER BY dept, name');
      this.employeesCache = empRes.rows.map(r => ({
        id: r.id,
        mnv: r.mnv,
        name: r.name,
        dept: r.dept,
        area: r.area,
        role: r.role,
        phone: r.phone || undefined,
        email: r.email || undefined,
      }));

      // 4. Requests
      const reqRes = await this.pgPool.query('SELECT * FROM technical_requests ORDER BY created_at DESC');
      this.requestsCache = reqRes.rows.map(r => ({
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

      this.logger.log(`📦 PostgreSQL Database loaded: ${this.usersCache.length} users, ${this.machinesCache.length} machines, ${this.employeesCache.length} employees, ${this.requestsCache.length} requests.`);
    } catch (e: any) {
      this.logger.error(`Error loading data from PostgreSQL: ${e.message}`);
    }
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

  public loadAll() {
    this.usersCache = this.readJson<UserRecord[]>('users.json', []);
    this.machinesCache = this.readJson<MachineRecord[]>('machines.json', []);
    this.employeesCache = this.readJson<EmployeeRecord[]>('employees.json', []);
    this.requestsCache = this.readJson<TechnicalRequestRecord[]>('technical_requests.json', []);
    this.logger.log(`📦 Local Database loaded: ${this.usersCache.length} users, ${this.machinesCache.length} machines, ${this.employeesCache.length} employees, ${this.requestsCache.length} requests.`);
  }

  public async seedDefaults() {
    // 1. Seed Default Users
    if (this.usersCache.length === 0) {
      const defaultPasswordHash = await bcrypt.hash('Dvt@123', 10);
      const now = new Date().toISOString();
      const defaultUsers: UserRecord[] = [
        {
          id: 'user-admin-1',
          username: 'admin',
          email: 'admin@daviteq.com',
          passwordHash: defaultPasswordHash,
          fullName: 'Super Administrator',
          role: 'ADMIN',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'user-tech-1',
          username: 'tech01',
          email: 'tech01@daviteq.com',
          passwordHash: defaultPasswordHash,
          fullName: 'Kỹ Thuật Viên Trưởng',
          role: 'TECHNICIAN',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'user-emp-1',
          username: 'user01',
          email: 'user01@daviteq.com',
          passwordHash: defaultPasswordHash,
          fullName: 'Nguyễn Văn A (SX)',
          role: 'EMPLOYEE',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ];

      for (const u of defaultUsers) {
        this.addUser(u);
      }
      this.logger.log('✅ Default users seeded (admin, tech01, user01 / Dvt@123)');
    }

    // 2. Seed Default Machines
    if (this.machinesCache.length === 0) {
      const defaultMachines: Record<string, string[]> = {
        'RFID/Thermal/Laser': [
          'Laser printer 1', 'Laser printer 2', 'Laser cut', 'CLS P2P 1', 'CLS P2P 2',
          'CLS R2R', 'Care Label Feeder', 'Ecopet G1', 'Ecopet G2', 'RFID1', 'RFID2',
          'RFID3', 'RFID4', 'RFID5', 'RFID6', 'RFID7', 'AFINA', 'ITD (ETUN)', 'TOSHIBA',
          'Epson 1', 'Epson 2', 'Fan Folding',
        ],
        'OFFSET': [
          'Máy co nhiệt', 'LAMINATION FBK 800', 'SM 52', 'SX 52', 'Polar',
          'CLS Labeling', 'GWS Cutting', 'Water base coating', 'Auto Lamination',
        ],
        'Digital': [
          'IR Coating', 'HP Indigo 7K', 'HP 7K chiller 1', 'HP 7K chiller 2',
          'UV Coating', 'Gluing Machine', 'PDM labeling',
        ],
        'HTL': [
          'ATMA', 'GSF Powder dusting', 'Automatic Flat Conveyor', 'Automatic Sheet Stacker',
          'Chiller HTL', 'Heat Press', 'Lò sấy bảng', 'Máy chụp Bảng', 'Wash-Out Booth',
          'Sheet label cutter', 'HTL R2R', 'Rewinding', 'Slitting',
        ],
        'PFL': [
          'PFL1', 'PFL2', 'PFL3', 'PFL4', 'PFL5', 'PFL6', 'C&F1', 'C&F2', 'C&F3', 'C&F4',
          'C&F5', 'C&F6', 'C&F7', 'C&F8', 'C&F9', 'C&F10', 'C&F11', 'C&F12', 'C&F14',
          'Inspection System', 'EAS-1', 'Máy sấy Focus', 'Máy sấy PFL',
        ],
        'WOVEN': ['WOVEN 1', 'WOVEN 2', 'WOVEN 3', 'WOVEN 4', 'WOVEN 5', 'WOVEN 6'],
        'DIECUT': ['DIECUT 1', 'DIECUT 2', 'Máy Cán Màng'],
      };

      let count = 1;
      for (const [tech, machines] of Object.entries(defaultMachines)) {
        for (const name of machines) {
          this.addMachine({
            id: `mach-${count++}`,
            tech,
            name,
            isActive: true,
          });
        }
      }
      this.logger.log(`✅ Default machines seeded (${this.machinesCache.length} machines)`);
    }

    // 3. Seed Default Employees
    if (this.employeesCache.length === 0) {
      const defaultEmps: EmployeeRecord[] = [
        { id: 'emp-1', mnv: 'NV001', name: 'Nguyễn Văn An', dept: 'Sản Xuất', area: 'OFFSET', role: 'Operator' },
        { id: 'emp-2', mnv: 'NV002', name: 'Trần Thị Bình', dept: 'Sản Xuất', area: 'Digital', role: 'Operator' },
        { id: 'emp-3', mnv: 'NV003', name: 'Lê Hoàng Cường', dept: 'Sản Xuất', area: 'RFID', role: 'Leader' },
        { id: 'emp-4', mnv: 'NV004', name: 'Phạm Minh Đức', dept: 'Kỹ Thuật In', area: 'Press', role: 'Technician' },
        { id: 'emp-5', mnv: 'NV005', name: 'Võ Thành Đạt', dept: 'Kỹ Thuật In', area: 'Prepress', role: 'Supervisor' },
        { id: 'emp-6', mnv: 'NV006', name: 'Đặng Quốc Huy', dept: 'Kỹ Thuật In', area: 'PostPress', role: 'Technician' },
        { id: 'emp-7', mnv: 'NV007', name: 'Hoàng Kim Loan', dept: 'QA / QC', area: 'QA', role: 'Inspector' },
        { id: 'emp-8', mnv: 'NV008', name: 'Ngô Trọng Nghĩa', dept: 'Sản Xuất', area: 'HTL', role: 'Manager' },
      ];

      for (const emp of defaultEmps) {
        this.addEmployee(emp);
      }
      this.logger.log(`✅ Default employees seeded (${this.employeesCache.length} employees)`);
    }
  }

  // --- Users Accessors ---
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
    const existingIdx = this.usersCache.findIndex(u => u.id === user.id);
    if (existingIdx !== -1) {
      this.usersCache[existingIdx] = user;
    } else {
      this.usersCache.push(user);
    }
    this.saveUsers();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           username = EXCLUDED.username,
           email = EXCLUDED.email,
           password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           role = EXCLUDED.role,
           is_active = EXCLUDED.is_active,
           updated_at = EXCLUDED.updated_at`,
        [user.id, user.username, user.email, user.passwordHash, user.fullName, user.role, user.isActive, user.createdAt, user.updatedAt],
      ).catch(err => this.logger.error(`PG Error inserting user: ${err.message}`));
    }
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const idx = this.usersCache.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.usersCache[idx] = { ...this.usersCache[idx], ...updates, updatedAt: new Date().toISOString() };
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
             updated_at = $8
           WHERE id = $1`,
          [id, updates.username, updates.email, updates.passwordHash, updates.fullName, updates.role, updates.isActive, updated.updatedAt],
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

  // --- Machines Accessors ---
  getMachines(): MachineRecord[] { return this.machinesCache; }
  saveMachines(): void { this.writeJson('machines.json', this.machinesCache); }

  addMachine(machine: MachineRecord): void {
    const idx = this.machinesCache.findIndex(m => m.id === machine.id);
    if (idx !== -1) {
      this.machinesCache[idx] = machine;
    } else {
      this.machinesCache.push(machine);
    }
    this.saveMachines();

    if (this.isPgConnected && this.pgPool) {
      this.pgPool.query(
        `INSERT INTO machines (id, tech, name, code, note, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           tech = EXCLUDED.tech,
           name = EXCLUDED.name,
           code = EXCLUDED.code,
           note = EXCLUDED.note,
           is_active = EXCLUDED.is_active,
           updated_at = now()`,
        [machine.id, machine.tech, machine.name, machine.code || null, machine.note || null, machine.isActive],
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
             tech = COALESCE($2, tech),
             name = COALESCE($3, name),
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

  // --- Employees Accessors ---
  getEmployees(): EmployeeRecord[] { return this.employeesCache; }
  saveEmployees(): void { this.writeJson('employees.json', this.employeesCache); }

  setEmployees(list: EmployeeRecord[]): void {
    this.employeesCache = list;
    this.saveEmployees();

    if (this.isPgConnected && this.pgPool) {
      // Bulk insert/replace
      for (const emp of list) {
        this.addEmployee(emp);
      }
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
        `INSERT INTO employees (id, mnv, name, dept, area, role, phone, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           mnv = EXCLUDED.mnv,
           name = EXCLUDED.name,
           dept = EXCLUDED.dept,
           area = EXCLUDED.area,
           role = EXCLUDED.role,
           phone = EXCLUDED.phone,
           email = EXCLUDED.email,
           updated_at = now()`,
        [emp.id, emp.mnv, emp.name, emp.dept, emp.area, emp.role, emp.phone || null, emp.email || null],
      ).catch(err => this.logger.error(`PG Error inserting employee: ${err.message}`));
    }
  }

  updateEmployee(id: string, updates: Partial<EmployeeRecord>): EmployeeRecord | undefined {
    const idx = this.employeesCache.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.employeesCache[idx] = { ...this.employeesCache[idx], ...updates };
      this.saveEmployees();
      const updated = this.employeesCache[idx];

      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query(
          `UPDATE employees SET
             mnv = COALESCE($2, mnv),
             name = COALESCE($3, name),
             dept = COALESCE($4, dept),
             area = COALESCE($5, area),
             role = COALESCE($6, role),
             phone = COALESCE($7, phone),
             email = COALESCE($8, email),
             updated_at = now()
           WHERE id = $1`,
          [id, updates.mnv, updates.name, updates.dept, updates.area, updates.role, updates.phone, updates.email],
        ).catch(err => this.logger.error(`PG Error updating employee: ${err.message}`));
      }

      return updated;
    }
    return undefined;
  }

  deleteEmployee(id: string): boolean {
    const initialLen = this.employeesCache.length;
    this.employeesCache = this.employeesCache.filter(e => e.id !== id);
    if (this.employeesCache.length !== initialLen) {
      this.saveEmployees();
      if (this.isPgConnected && this.pgPool) {
        this.pgPool.query('DELETE FROM employees WHERE id = $1', [id])
          .catch(err => this.logger.error(`PG Error deleting employee: ${err.message}`));
      }
      return true;
    }
    return false;
  }

  // --- Technical Requests Accessors ---
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
}
