import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type EnvValidationStatus = 'VALID' | 'DEFAULT_FALLBACK' | 'WARNING' | 'CRITICAL' | 'INVALID';

export interface EnvValidationItem {
  key: string;
  aliases: string[];
  resolvedSource: string;
  rawValue: string;
  displayValue: string;
  isSet: boolean;
  isDefault: boolean;
  status: EnvValidationStatus;
  description: string;
  recommendation: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  dbAutoInit: boolean;
  dbSsl: boolean | { rejectUnauthorized: boolean };
  dataDir: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  autoInit: boolean;
  ssl: boolean | { rejectUnauthorized: boolean };
  dataDir: string;
}

export interface EnvValidationReport {
  isValid: boolean;
  hasWarnings: boolean;
  hasCritical: boolean;
  environment: string;
  isProduction: boolean;
  items: Record<string, EnvValidationItem>;
  warnings: string[];
  criticals: string[];
  formattedTable: string;
  config: AppConfig;
}

export const DEFAULT_CONFIG = {
  PORT: '3001',
  NODE_ENV: 'development',
  JWT_SECRET: 'Checkpoint_Systems_Technical_Key_2026_Secure!',
  DB_HOST: '192.168.1.35',
  DB_PORT: '5432',
  DB_USERNAME: 'admin',
  DB_PASSWORD: 'Ph@nloi20031403',
  DB_NAME: 'checkpoint_technical',
  DB_AUTO_INIT: 'true',
  DATA_DIR: './data',
  DB_SSL: 'false',
};

export class EnvValidator {
  private static readonly logger = new Logger('EnvValidator');
  private static dotenvLoaded = false;

  /**
   * Đảm bảo các tệp .env và .env.example được nạp vào process.env nếu dotenv khả dụng
   */
  public static ensureDotenvLoaded(): void {
    if (this.dotenvLoaded) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const dotenv = require('dotenv');
      const candidatePaths = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '.env.example'),
        path.resolve(__dirname, '../../..', '.env'),
        path.resolve(__dirname, '../../..', '.env.example'),
        path.resolve(__dirname, '../../../..', '.env'),
      ];

      for (const envPath of candidatePaths) {
        if (fs.existsSync(envPath)) {
          dotenv.config({ path: envPath });
          break;
        }
      }
      this.dotenvLoaded = true;
    } catch {
      // Bỏ qua nếu dotenv không có sẵn (môi trường container nạp trực tiếp qua Docker)
      this.dotenvLoaded = true;
    }
  }

  /**
   * Che giấu một phần các chuỗi nhạy cảm (mật khẩu, jwt secret) để bảo mật khi in log
   */
  public static maskValue(key: string, value: string): string {
    if (!value) return '(empty)';
    const upperKey = key.toUpperCase();
    if (upperKey.includes('PASSWORD') || upperKey.includes('PASS') || upperKey.includes('SECRET')) {
      if (value.length <= 4) return '****';
      if (value.length <= 8) return value.slice(0, 2) + '****';
      const visibleStart = Math.min(4, Math.floor(value.length / 4));
      const visibleEnd = Math.min(3, Math.floor(value.length / 4));
      return (
        value.slice(0, visibleStart) +
        '*'.repeat(Math.max(4, value.length - visibleStart - visibleEnd)) +
        value.slice(value.length - visibleEnd)
      );
    }
    return value;
  }

  /**
   * Phân giải giá trị theo danh sách ưu tiên: Biến chính -> Danh sách Alias -> Giá trị mặc định
   */
  public static resolveVariable(
    primaryKey: string,
    aliases: string[] = [],
    defaultValue: string,
  ): { key: string; source: string; value: string; isSet: boolean; isDefault: boolean } {
    if (process.env[primaryKey] !== undefined && process.env[primaryKey] !== '') {
      return {
        key: primaryKey,
        source: primaryKey,
        value: process.env[primaryKey]!,
        isSet: true,
        isDefault: false,
      };
    }

    for (const alias of aliases) {
      if (process.env[alias] !== undefined && process.env[alias] !== '') {
        return {
          key: primaryKey,
          source: alias,
          value: process.env[alias]!,
          isSet: true,
          isDefault: false,
        };
      }
    }

    return {
      key: primaryKey,
      source: 'DEFAULT',
      value: defaultValue,
      isSet: false,
      isDefault: true,
    };
  }

  /**
   * Kiểm tra toàn diện 10 biến môi trường cốt lõi của hệ thống
   */
  public static validate(silent = false): EnvValidationReport {
    this.ensureDotenvLoaded();

    const rawNodeEnv = process.env.NODE_ENV || DEFAULT_CONFIG.NODE_ENV;
    const isProd = rawNodeEnv.toLowerCase().trim() === 'production';
    const items: Record<string, EnvValidationItem> = {};
    const warnings: string[] = [];
    const criticals: string[] = [];

    // 1. NODE_ENV
    const nodeEnvResolved = this.resolveVariable('NODE_ENV', [], DEFAULT_CONFIG.NODE_ENV);
    const validEnvs = ['development', 'production', 'test', 'staging'];
    let nodeEnvStatus: EnvValidationStatus = nodeEnvResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    let nodeEnvRec = 'Môi trường thực thi ứng dụng.';
    if (!validEnvs.includes(nodeEnvResolved.value.toLowerCase())) {
      nodeEnvStatus = 'WARNING';
      nodeEnvRec = `Giá trị không thông dụng '${nodeEnvResolved.value}'. Khuyến nghị dùng: ${validEnvs.join(', ')}`;
      warnings.push(`[NODE_ENV]: ${nodeEnvRec}`);
    }
    items.NODE_ENV = {
      key: 'NODE_ENV',
      aliases: [],
      resolvedSource: nodeEnvResolved.source,
      rawValue: nodeEnvResolved.value,
      displayValue: nodeEnvResolved.value,
      isSet: nodeEnvResolved.isSet,
      isDefault: nodeEnvResolved.isDefault,
      status: nodeEnvStatus,
      description: 'Môi trường thực thi của ứng dụng (development/production/test)',
      recommendation: nodeEnvRec,
    };

    // 2. PORT
    const portResolved = this.resolveVariable('PORT', [], DEFAULT_CONFIG.PORT);
    const portNum = parseInt(portResolved.value, 10);
    let portStatus: EnvValidationStatus = portResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    let portRec = 'Cổng HTTP Server lắng nghe (mặc định 3001).';
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      portStatus = 'INVALID';
      portRec = `Giá trị PORT '${portResolved.value}' không hợp lệ. Phải là số nguyên từ 1 đến 65535.`;
      criticals.push(`[PORT]: ${portRec}`);
    }
    items.PORT = {
      key: 'PORT',
      aliases: [],
      resolvedSource: portResolved.source,
      rawValue: portResolved.value,
      displayValue: portResolved.value,
      isSet: portResolved.isSet,
      isDefault: portResolved.isDefault,
      status: portStatus,
      description: 'Cổng lắng nghe của NestJS HTTP Web Server',
      recommendation: portRec,
    };

    // 3. JWT_SECRET
    const jwtResolved = this.resolveVariable('JWT_SECRET', [], DEFAULT_CONFIG.JWT_SECRET);
    let jwtStatus: EnvValidationStatus = 'VALID';
    let jwtRec = 'Khóa bí mật mã hóa và xác thực JWT token.';
    const isDefaultJwt = jwtResolved.value === DEFAULT_CONFIG.JWT_SECRET;

    if (isProd) {
      if (jwtResolved.isDefault || isDefaultJwt) {
        jwtStatus = 'CRITICAL';
        jwtRec = 'NGUY CƠ BẢO MẬT: Đang dùng JWT_SECRET mặc định trong production! Bắt buộc đổi sang chuỗi ngẫu nhiên >= 32 ký tự.';
        criticals.push(`[JWT_SECRET]: ${jwtRec}`);
      } else if (jwtResolved.value.length < 32) {
        jwtStatus = 'WARNING';
        jwtRec = 'JWT_SECRET có độ dài dưới 32 ký tự. Khuyến nghị nâng độ dài chuỗi để chống brute-force.';
        warnings.push(`[JWT_SECRET]: ${jwtRec}`);
      }
    } else {
      if (jwtResolved.isDefault) {
        jwtStatus = 'DEFAULT_FALLBACK';
        jwtRec = 'Đang dùng khóa JWT mặc định cho môi trường dev. Chú ý đổi khi đưa lên production.';
      }
    }
    items.JWT_SECRET = {
      key: 'JWT_SECRET',
      aliases: [],
      resolvedSource: jwtResolved.source,
      rawValue: jwtResolved.value,
      displayValue: this.maskValue('JWT_SECRET', jwtResolved.value),
      isSet: jwtResolved.isSet,
      isDefault: jwtResolved.isDefault,
      status: jwtStatus,
      description: 'Khóa bí mật ký xác thực JWT session & API token',
      recommendation: jwtRec,
    };

    // 4. DB_HOST
    const dbHostResolved = this.resolveVariable('DB_HOST', ['POSTGRES_HOST'], DEFAULT_CONFIG.DB_HOST);
    let dbHostStatus: EnvValidationStatus = dbHostResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    let dbHostRec = 'Địa chỉ IP hoặc hostname của PostgreSQL Server.';
    if (isProd) {
      if (dbHostResolved.isDefault) {
        dbHostStatus = 'WARNING';
        dbHostRec = 'Chưa thiết lập biến DB_HOST/POSTGRES_HOST trong production. Đang dùng IP mặc định 192.168.1.35.';
        warnings.push(`[DB_HOST]: ${dbHostRec}`);
      } else if (['localhost', '127.0.0.1'].includes(dbHostResolved.value.toLowerCase())) {
        dbHostStatus = 'WARNING';
        dbHostRec = "DB_HOST đang trỏ 'localhost' trong production. Nếu chạy Docker container, hãy trỏ tên service (ví dụ: postgres_db).";
        warnings.push(`[DB_HOST]: ${dbHostRec}`);
      }
    }
    items.DB_HOST = {
      key: 'DB_HOST',
      aliases: ['POSTGRES_HOST'],
      resolvedSource: dbHostResolved.source,
      rawValue: dbHostResolved.value,
      displayValue: dbHostResolved.value,
      isSet: dbHostResolved.isSet,
      isDefault: dbHostResolved.isDefault,
      status: dbHostStatus,
      description: 'Địa chỉ máy chủ cơ sở dữ liệu PostgreSQL',
      recommendation: dbHostRec,
    };

    // 5. DB_PORT
    const dbPortResolved = this.resolveVariable('DB_PORT', ['POSTGRES_PORT'], DEFAULT_CONFIG.DB_PORT);
    const dbPortNum = parseInt(dbPortResolved.value, 10);
    let dbPortStatus: EnvValidationStatus = dbPortResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    let dbPortRec = 'Cổng kết nối PostgreSQL (chuẩn 5432).';
    if (isNaN(dbPortNum) || dbPortNum < 1 || dbPortNum > 65535) {
      dbPortStatus = 'INVALID';
      dbPortRec = `Giá trị cổng DB_PORT '${dbPortResolved.value}' không hợp lệ.`;
      criticals.push(`[DB_PORT]: ${dbPortRec}`);
    }
    items.DB_PORT = {
      key: 'DB_PORT',
      aliases: ['POSTGRES_PORT'],
      resolvedSource: dbPortResolved.source,
      rawValue: dbPortResolved.value,
      displayValue: dbPortResolved.value,
      isSet: dbPortResolved.isSet,
      isDefault: dbPortResolved.isDefault,
      status: dbPortStatus,
      description: 'Cổng mạng kết nối máy chủ PostgreSQL (5432)',
      recommendation: dbPortRec,
    };

    // 6. DB_USERNAME / DB_USER
    const dbUserResolved = this.resolveVariable(
      'DB_USERNAME',
      ['DB_USER', 'POSTGRES_USER', 'USER'],
      DEFAULT_CONFIG.DB_USERNAME,
    );
    const dbUserStatus: EnvValidationStatus = dbUserResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    items.DB_USERNAME = {
      key: 'DB_USERNAME',
      aliases: ['DB_USER', 'POSTGRES_USER', 'USER'],
      resolvedSource: dbUserResolved.source,
      rawValue: dbUserResolved.value,
      displayValue: dbUserResolved.value,
      isSet: dbUserResolved.isSet,
      isDefault: dbUserResolved.isDefault,
      status: dbUserStatus,
      description: 'Tài khoản đăng nhập PostgreSQL',
      recommendation: 'Tài khoản kết nối CSDL (mặc định admin).',
    };

    // 7. DB_PASSWORD
    const dbPassResolved = this.resolveVariable(
      'DB_PASSWORD',
      ['POSTGRES_PASSWORD', 'PASSWORD'],
      DEFAULT_CONFIG.DB_PASSWORD,
    );
    let dbPassStatus: EnvValidationStatus = dbPassResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    let dbPassRec = 'Mật khẩu kết nối PostgreSQL.';
    const isDefaultPass = dbPassResolved.value === DEFAULT_CONFIG.DB_PASSWORD;

    if (isProd && (dbPassResolved.isDefault || isDefaultPass)) {
      dbPassStatus = 'WARNING';
      dbPassRec = 'Đang dùng mật khẩu cơ sở dữ liệu mặc định trong môi trường production. Khuyến nghị cập nhật mật khẩu mạnh.';
      warnings.push(`[DB_PASSWORD]: ${dbPassRec}`);
    }
    items.DB_PASSWORD = {
      key: 'DB_PASSWORD',
      aliases: ['POSTGRES_PASSWORD', 'PASSWORD'],
      resolvedSource: dbPassResolved.source,
      rawValue: dbPassResolved.value,
      displayValue: this.maskValue('DB_PASSWORD', dbPassResolved.value),
      isSet: dbPassResolved.isSet,
      isDefault: dbPassResolved.isDefault,
      status: dbPassStatus,
      description: 'Mật khẩu xác thực người dùng PostgreSQL',
      recommendation: dbPassRec,
    };

    // 8. DB_NAME / DB_DATABASE
    const dbNameResolved = this.resolveVariable(
      'DB_NAME',
      ['DB_DATABASE', 'POSTGRES_DB', 'DB'],
      DEFAULT_CONFIG.DB_NAME,
    );
    const dbNameStatus: EnvValidationStatus = dbNameResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    items.DB_NAME = {
      key: 'DB_NAME',
      aliases: ['DB_DATABASE', 'POSTGRES_DB', 'DB'],
      resolvedSource: dbNameResolved.source,
      rawValue: dbNameResolved.value,
      displayValue: dbNameResolved.value,
      isSet: dbNameResolved.isSet,
      isDefault: dbNameResolved.isDefault,
      status: dbNameStatus,
      description: 'Tên cơ sở dữ liệu PostgreSQL của Checkpoint Systems',
      recommendation: 'Tên CSDL đích (mặc định: checkpoint_technical).',
    };

    // 9. DB_AUTO_INIT
    const autoInitResolved = this.resolveVariable('DB_AUTO_INIT', [], DEFAULT_CONFIG.DB_AUTO_INIT);
    const autoInitLower = autoInitResolved.value.toLowerCase().trim();
    const autoInitBool = !['false', '0', 'no', 'off'].includes(autoInitLower);
    const autoInitStatus: EnvValidationStatus = autoInitResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    items.DB_AUTO_INIT = {
      key: 'DB_AUTO_INIT',
      aliases: [],
      resolvedSource: autoInitResolved.source,
      rawValue: autoInitResolved.value,
      displayValue: String(autoInitBool),
      isSet: autoInitResolved.isSet,
      isDefault: autoInitResolved.isDefault,
      status: autoInitStatus,
      description: 'Cờ tự động tạo cấu trúc bảng (14 bảng DDL) khi kết nối PostgreSQL',
      recommendation: 'Đặt true để tự động khởi tạo bảng khi chạy Docker mới.',
    };

    // 10. DATA_DIR
    const dataDirResolved = this.resolveVariable('DATA_DIR', [], DEFAULT_CONFIG.DATA_DIR);
    let dataDirStatus: EnvValidationStatus = dataDirResolved.isDefault ? 'DEFAULT_FALLBACK' : 'VALID';
    let dataDirRec = 'Thư mục lưu tệp dữ liệu JSON dự phòng khi PostgreSQL mất kết nối.';
    const resolvedPath = path.resolve(process.cwd(), dataDirResolved.value);
    if (!fs.existsSync(resolvedPath)) {
      try {
        fs.mkdirSync(resolvedPath, { recursive: true });
      } catch (err: any) {
        dataDirStatus = 'WARNING';
        dataDirRec = `Không thể tạo thư mục DATA_DIR '${resolvedPath}': ${err.message}`;
        warnings.push(`[DATA_DIR]: ${dataDirRec}`);
      }
    }
    items.DATA_DIR = {
      key: 'DATA_DIR',
      aliases: [],
      resolvedSource: dataDirResolved.source,
      rawValue: dataDirResolved.value,
      displayValue: dataDirResolved.value,
      isSet: dataDirResolved.isSet,
      isDefault: dataDirResolved.isDefault,
      status: dataDirStatus,
      description: 'Thư mục lưu trữ JSON cục bộ (Chế độ Hybrid Fallback)',
      recommendation: dataDirRec,
    };

    // DB_SSL (bổ sung)
    const dbSslEnv = process.env.DB_SSL;
    const dbSsl = dbSslEnv === 'true' ? { rejectUnauthorized: false } : false;

    // Tổng hợp config
    const config: AppConfig = {
      port: isNaN(portNum) ? 3001 : portNum,
      nodeEnv: nodeEnvResolved.value,
      jwtSecret: jwtResolved.value,
      dbHost: dbHostResolved.value,
      dbPort: isNaN(dbPortNum) ? 5432 : dbPortNum,
      dbUser: dbUserResolved.value,
      dbPassword: dbPassResolved.value,
      dbName: dbNameResolved.value,
      dbAutoInit: autoInitBool,
      dbSsl,
      dataDir: resolvedPath,
    };

    const hasWarnings = warnings.length > 0;
    const hasCritical = criticals.length > 0;
    const isValid = !hasCritical;

    const formattedTable = this.renderTable(items, isProd, warnings, criticals);

    const report: EnvValidationReport = {
      isValid,
      hasWarnings,
      hasCritical,
      environment: config.nodeEnv,
      isProduction: isProd,
      items,
      warnings,
      criticals,
      formattedTable,
      config,
    };

    if (!silent && (hasWarnings || hasCritical || isProd)) {
      this.logValidationReport(report);
    }

    return report;
  }

  /**
   * Tạo bảng ASCII căn chỉnh đẹp mắt để in log ra console
   */
  private static renderTable(
    items: Record<string, EnvValidationItem>,
    isProduction: boolean,
    warnings: string[],
    criticals: string[],
  ): string {
    const colWidths = {
      key: 15,
      source: 16,
      value: 22,
      status: 18,
      note: 48,
    };

    const pad = (str: string, len: number) => {
      const s = String(str || '');
      return s.length > len ? s.slice(0, len - 3) + '...' : s.padEnd(len, ' ');
    };

    const line = (char: string, sep: string, left: string, right: string) => {
      return (
        left +
        char.repeat(colWidths.key + 2) +
        sep +
        char.repeat(colWidths.source + 2) +
        sep +
        char.repeat(colWidths.value + 2) +
        sep +
        char.repeat(colWidths.status + 2) +
        sep +
        char.repeat(colWidths.note + 2) +
        right
      );
    };

    const topBorder = line('─', '┬', '┌', '┐');
    const midBorder = line('─', '┼', '├', '┤');
    const botBorder = line('─', '┴', '└', '┘');

    const header =
      `│ ${pad('Biến Môi Trường', colWidths.key)} ` +
      `│ ${pad('Nguồn / Alias', colWidths.source)} ` +
      `│ ${pad('Giá Trị (Đã Mask)', colWidths.value)} ` +
      `│ ${pad('Trạng Thái', colWidths.status)} ` +
      `│ ${pad('Khuyến Nghị / Ghi Chú', colWidths.note)} │`;

    const statusIcons: Record<EnvValidationStatus, string> = {
      VALID: '✅ VALID',
      DEFAULT_FALLBACK: 'ℹ️ DEFAULT',
      WARNING: '⚠️ WARNING',
      CRITICAL: '🚨 CRITICAL',
      INVALID: '❌ INVALID',
    };

    const rows = Object.values(items).map((item) => {
      const iconStatus = statusIcons[item.status] || item.status;
      return (
        `│ ${pad(item.key, colWidths.key)} ` +
        `│ ${pad(item.resolvedSource, colWidths.source)} ` +
        `│ ${pad(item.displayValue, colWidths.value)} ` +
        `│ ${pad(iconStatus, colWidths.status)} ` +
        `│ ${pad(item.recommendation, colWidths.note)} │`
      );
    });

    const divider = '='.repeat(129);
    const subDivider = '-'.repeat(129);

    let output = `\n${divider}\n`;
    output += `📋 CHECKPOINT TECHNICAL — BÁO CÁO KIỂM TRA BIẾN MÔI TRƯỜNG KHỞI ĐỘNG (ENV VALIDATOR)\n`;
    output += `   Môi trường: ${isProduction ? '🔴 PRODUCTION' : '🟢 DEVELOPMENT'} | Thời điểm: ${new Date().toISOString()}\n`;
    output += `${subDivider}\n`;
    output += `${topBorder}\n`;
    output += `${header}\n`;
    output += `${midBorder}\n`;
    output += rows.join('\n') + '\n';
    output += `${botBorder}\n`;

    if (criticals.length > 0) {
      output += `\n🚨 PHÁT HIỆN ${criticals.length} LỖI BẢO MẬT HOẶC CẤU HÌNH NGHIÊM TRỌNG:\n`;
      criticals.forEach((c, idx) => {
        output += `   [${idx + 1}] ${c}\n`;
      });
    }

    if (warnings.length > 0) {
      output += `\n⚠️  CẢNH BÁO CẤU HÌNH (${warnings.length} lưu ý cần tối ưu):\n`;
      warnings.forEach((w, idx) => {
        output += `   [${idx + 1}] ${w}\n`;
      });
    }

    if (criticals.length === 0 && warnings.length === 0) {
      output += `\n✨ TẤT CẢ BIẾN MÔI TRƯỜNG ĐÃ HỢP LỆ VÀ SẴN SÀNG CHO HỆ THỐNG.\n`;
    }

    output += `${divider}\n`;
    return output;
  }

  /**
   * Xuất báo cáo ra Logger của NestJS hoặc Console
   */
  public static logValidationReport(report?: EnvValidationReport, targetLogger?: Logger): void {
    const rep = report || this.validate(true);
    const logInstance = targetLogger || this.logger;

    // In trực tiếp ra console để giữ nguyên format bảng ASCII
    console.log(rep.formattedTable);

    if (rep.hasCritical) {
      logInstance.error(`🚨 Phát hiện ${rep.criticals.length} cấu hình không hợp lệ hoặc rủi ro bảo mật nghiêm trọng!`);
    } else if (rep.hasWarnings) {
      logInstance.warn(`⚠️ Khởi động với ${rep.warnings.length} cảnh báo fallback/mặc định cần lưu ý.`);
    } else {
      logInstance.log(`✅ Toàn bộ cấu hình biến môi trường đã được kiểm tra hợp lệ.`);
    }
  }

  /**
   * Lấy cấu hình đầy đủ của ứng dụng
   */
  public static getConfig(): AppConfig {
    return this.validate(true).config;
  }

  /**
   * Lấy cấu hình kết nối PostgreSQL chuẩn hóa
   */
  public static getDatabaseConfig(): DatabaseConfig {
    const config = this.getConfig();
    return {
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      autoInit: config.dbAutoInit,
      ssl: config.dbSsl,
      dataDir: config.dataDir,
    };
  }

  /**
   * Lấy JWT Secret chuẩn hóa
   */
  public static getJwtSecret(): string {
    return this.getConfig().jwtSecret;
  }

  /**
   * Lấy Port lắng nghe của HTTP Server
   */
  public static getPort(): number {
    return this.getConfig().port;
  }

  /**
   * Lấy thư mục dữ liệu cục bộ
   */
  public static getDataDir(): string {
    return this.getConfig().dataDir;
  }

  /**
   * Kiểm tra xem có đang chạy trong môi trường production hay không
   */
  public static isProduction(): boolean {
    return this.validate(true).isProduction;
  }
}
