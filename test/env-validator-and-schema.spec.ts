import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { EnvValidator, DEFAULT_CONFIG } from '../src/common/utils/env-validator.util';

// Import all HTML view templates for HTML tag balance scanning
import { CONTROL_PANEL_HTML } from '../src/views/control-panel.view';
import { DASHBOARD_HTML } from '../src/views/dashboard.view';
import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { LOGIN_HTML } from '../src/views/login.view';

console.log('================================================================');
console.log('🧪 QA VERIFICATION SUITE: ENV VALIDATOR & POSTGRESQL 14 TABLES');
console.log('   + HTML TAG BALANCE SCANNER (0 DIV ERRORS) + DOCKER CONFIGS');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc: string, fn: () => void | boolean) {
  totalChecks++;
  try {
    const res = fn();
    if (res === false) {
      throw new Error('Condition returned false');
    }
    passedChecks++;
    console.log(`  ✅ [PASS] ${desc}`);
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
    throw err;
  }
}

// Save initial process.env to restore after tests
const initialEnv = { ...process.env };
function resetEnv() {
  for (const k of Object.keys(process.env)) {
    if (!(k in initialEnv)) {
      delete process.env[k];
    }
  }
  Object.assign(process.env, initialEnv);
}

// =========================================================================
// PHẦN 1: KIỂM THỬ TOÀN DIỆN ENV VALIDATOR
// =========================================================================
console.log('--- 1. Kiểm thử EnvValidator: Cấu trúc, 10 biến cốt lõi & Fallbacks ---');

check('EnvValidator methods and exports exist', () => {
  assert.strictEqual(typeof EnvValidator.validate, 'function');
  assert.strictEqual(typeof EnvValidator.logValidationReport, 'function');
  assert.strictEqual(typeof EnvValidator.getConfig, 'function');
  assert.strictEqual(typeof EnvValidator.getDatabaseConfig, 'function');
  assert.strictEqual(typeof EnvValidator.getJwtSecret, 'function');
  assert.strictEqual(typeof EnvValidator.getPort, 'function');
  assert.strictEqual(typeof EnvValidator.getDataDir, 'function');
  assert.strictEqual(typeof EnvValidator.isProduction, 'function');
  assert.strictEqual(typeof EnvValidator.maskValue, 'function');
});

check('EnvValidator re-exported at src/common/env.validator.ts and src/config/env.validator.ts', () => {
  const commonEnvPath = path.resolve(__dirname, '../src/common/env.validator.ts');
  const configEnvPath = path.resolve(__dirname, '../src/config/env.validator.ts');
  assert.ok(fs.existsSync(commonEnvPath), 'src/common/env.validator.ts must exist');
  assert.ok(fs.existsSync(configEnvPath), 'src/config/env.validator.ts must exist');

  const commonExport = require('../src/common/env.validator');
  const configExport = require('../src/config/env.validator');
  assert.strictEqual(typeof commonExport.EnvValidator, 'function');
  assert.strictEqual(typeof configExport.EnvValidator, 'function');
});

check('Default fallback values for 10 core variables in development', () => {
  resetEnv();
  delete process.env.PORT;
  delete process.env.DB_HOST;
  delete process.env.POSTGRES_HOST;
  delete process.env.DB_PORT;
  delete process.env.POSTGRES_PORT;
  delete process.env.DB_USERNAME;
  delete process.env.DB_USER;
  delete process.env.POSTGRES_USER;
  delete process.env.DB_PASSWORD;
  delete process.env.POSTGRES_PASSWORD;
  delete process.env.DB_NAME;
  delete process.env.DB_DATABASE;
  delete process.env.POSTGRES_DB;
  delete process.env.JWT_SECRET;
  delete process.env.DB_AUTO_INIT;
  delete process.env.DATA_DIR;
  process.env.NODE_ENV = 'development';

  const rep = EnvValidator.validate(true);
  assert.ok(rep.isValid, 'Development fallback should be valid');
  assert.strictEqual(rep.items.PORT.rawValue, '3001');
  assert.strictEqual(rep.items.DB_HOST.rawValue, '192.168.1.35');
  assert.strictEqual(rep.items.DB_PORT.rawValue, '5432');
  assert.strictEqual(rep.items.DB_USERNAME.rawValue, 'admin');
  assert.strictEqual(rep.items.DB_NAME.rawValue, 'checkpoint_technical');
  assert.strictEqual(rep.items.DB_AUTO_INIT.displayValue, 'true');
  assert.strictEqual(rep.items.DATA_DIR.rawValue, './data');
  assert.strictEqual(rep.items.JWT_SECRET.rawValue, DEFAULT_CONFIG.JWT_SECRET);
});

check('Priority and Aliases resolution (DB_HOST, DB_USER, DB_NAME, DB_PASSWORD)', () => {
  resetEnv();
  // DB_HOST vs POSTGRES_HOST
  process.env.DB_HOST = 'custom-db-host';
  process.env.POSTGRES_HOST = 'alias-postgres-host';
  let rep = EnvValidator.validate(true);
  assert.strictEqual(rep.items.DB_HOST.rawValue, 'custom-db-host');
  assert.strictEqual(rep.items.DB_HOST.resolvedSource, 'DB_HOST');

  delete process.env.DB_HOST;
  rep = EnvValidator.validate(true);
  assert.strictEqual(rep.items.DB_HOST.rawValue, 'alias-postgres-host');
  assert.strictEqual(rep.items.DB_HOST.resolvedSource, 'POSTGRES_HOST');

  // DB_USERNAME aliases: DB_USER, POSTGRES_USER, USER
  delete process.env.DB_USERNAME;
  delete process.env.DB_USER;
  delete process.env.USER;
  process.env.POSTGRES_USER = 'service-postgres-user';
  rep = EnvValidator.validate(true);
  assert.strictEqual(rep.items.DB_USERNAME.rawValue, 'service-postgres-user');
  assert.strictEqual(rep.items.DB_USERNAME.resolvedSource, 'POSTGRES_USER');

  // DB_NAME aliases: DB_DATABASE, POSTGRES_DB, DB
  delete process.env.DB_NAME;
  delete process.env.POSTGRES_DB;
  delete process.env.DB;
  process.env.DB_DATABASE = 'db_via_database_env';
  rep = EnvValidator.validate(true);
  assert.strictEqual(rep.items.DB_NAME.rawValue, 'db_via_database_env');
  assert.strictEqual(rep.items.DB_NAME.resolvedSource, 'DB_DATABASE');
});

check('Sensitive values masking (JWT_SECRET, DB_PASSWORD)', () => {
  const secretMasked = EnvValidator.maskValue('JWT_SECRET', 'SuperSecretJwtTokenLongKey2026!');
  assert.notStrictEqual(secretMasked, 'SuperSecretJwtTokenLongKey2026!');
  assert.ok(secretMasked.includes('****'), 'Must contain asterisks mask');

  const passMasked = EnvValidator.maskValue('DB_PASSWORD', 'MyDatabasePassword123');
  assert.notStrictEqual(passMasked, 'MyDatabasePassword123');
  assert.ok(passMasked.includes('****'), 'Must contain asterisks mask');

  const hostUnmasked = EnvValidator.maskValue('DB_HOST', 'postgres_db');
  assert.strictEqual(hostUnmasked, 'postgres_db', 'Non-sensitive value must not be masked');
});

check('Production mode security warnings and critical detection', () => {
  resetEnv();
  process.env.NODE_ENV = 'production';
  process.env.JWT_SECRET = DEFAULT_CONFIG.JWT_SECRET;
  process.env.DB_PASSWORD = DEFAULT_CONFIG.DB_PASSWORD;
  delete process.env.DB_HOST;
  delete process.env.POSTGRES_HOST;

  const prodRep = EnvValidator.validate(true);
  assert.ok(prodRep.isProduction, 'Should detect production environment');
  assert.ok(prodRep.hasCritical, 'Default JWT_SECRET in production must trigger CRITICAL');
  assert.strictEqual(prodRep.isValid, false, 'Report must be invalid with critical security issue');
  assert.ok(prodRep.criticals.some(c => c.includes('JWT_SECRET')), 'Must alert on default JWT_SECRET');
  assert.ok(prodRep.warnings.some(w => w.includes('DB_PASSWORD')), 'Must warn on default DB_PASSWORD');
});

check('Formatted table generation and logger execution', () => {
  resetEnv();
  const rep = EnvValidator.validate(true);
  assert.ok(typeof rep.formattedTable === 'string' && rep.formattedTable.length > 50);
  assert.ok(rep.formattedTable.includes('PORT'));
  assert.ok(rep.formattedTable.includes('DB_HOST'));
  assert.ok(rep.formattedTable.includes('DB_NAME'));

  // Test logValidationReport without error
  EnvValidator.logValidationReport(rep);
});

check('Getter helper methods return synchronized configuration', () => {
  resetEnv();
  process.env.PORT = '3005';
  process.env.DB_HOST = 'custom-db-pg';
  process.env.DB_PORT = '5433';
  process.env.DB_USERNAME = 'pg_tester';
  process.env.DB_NAME = 'checkpoint_test_db';

  assert.strictEqual(EnvValidator.getPort(), 3005);
  const dbConfig = EnvValidator.getDatabaseConfig();
  assert.strictEqual(dbConfig.host, 'custom-db-pg');
  assert.strictEqual(dbConfig.port, 5433);
  assert.strictEqual(dbConfig.user, 'pg_tester');
  assert.strictEqual(dbConfig.database, 'checkpoint_test_db');
  assert.strictEqual(typeof EnvValidator.getJwtSecret(), 'string');
  assert.strictEqual(typeof EnvValidator.getDataDir(), 'string');
});

// Restore environment
resetEnv();

// =========================================================================
// PHẦN 2: KIỂM THỬ TOÀN VẸN SCHEMA SQL 14 BẢNG (POSTGRESQL DDL)
// =========================================================================
console.log('\n--- 2. Kiểm thử tính toàn vẹn 14 bảng trong Schema SQL & DDL ---');

const sqlFilePaths = [
  { name: 'config/schema.sql', path: path.resolve(__dirname, '../config/schema.sql') },
  { name: 'config/init_database.sql', path: path.resolve(__dirname, '../config/init_database.sql') },
  { name: 'checkpoint_technical/deploy/database/docker-entrypoint-initdb.sql', path: path.resolve(__dirname, '../deploy/database/docker-entrypoint-initdb.sql') },
];

const workspaceRootDeploySql = path.resolve(__dirname, '../../deploy/database/docker-entrypoint-initdb.sql');
if (fs.existsSync(workspaceRootDeploySql)) {
  sqlFilePaths.push({ name: 'deploy/database/docker-entrypoint-initdb.sql (root)', path: workspaceRootDeploySql });
}

const expected14Tables = [
  'users',
  'requesters',
  'machines',
  'weekly_technical_requests',
  'defect_logs',
  'action_plans',
  'form_lookup_options',
  'sheet_lists_do_not_delete',
  'technical_requests',
  'system_settings',
  'cpsr',
  'cpst',
  'cpsf',
  'cps',
];

for (const sqlFile of sqlFilePaths) {
  check(`File ${sqlFile.name} tồn tại và không rỗng`, () => {
    assert.ok(fs.existsSync(sqlFile.path), `${sqlFile.name} phải tồn tại`);
    const content = fs.readFileSync(sqlFile.path, 'utf-8');
    assert.ok(content.length > 500, `${sqlFile.name} không được rỗng`);
  });

  check(`File ${sqlFile.name} chứa đầy đủ 14 bảng`, () => {
    const content = fs.readFileSync(sqlFile.path, 'utf-8');
    for (const tbl of expected14Tables) {
      const tableRegex = new RegExp(`CREATE\\s+TABLE\\s+(IF\\s+NOT\\s+EXISTS\\s+)?${tbl}\\b`, 'i');
      assert.ok(tableRegex.test(content), `${sqlFile.name} thiếu bảng '${tbl}'`);
    }
  });

  check(`File ${sqlFile.name} chứa các cột mới nhất trên cpsf (notes, chk_quality, wo, total_qty, scrap_qty)`, () => {
    const content = fs.readFileSync(sqlFile.path, 'utf-8');
    assert.ok(/chk_quality\s+VARCHAR\(100\)/i.test(content) || /ALTER\s+TABLE\s+cpsf\s+ALTER\s+COLUMN\s+chk_quality\s+TYPE\s+VARCHAR\(100\)/i.test(content), `${sqlFile.name} cpsf thiếu chk_quality VARCHAR(100)`);
    assert.ok(content.includes('total_qty') && content.includes('scrap_qty'), `${sqlFile.name} cpsf thiếu total_qty / scrap_qty`);
    assert.ok(content.includes('wo VARCHAR(255)') || content.includes('ADD COLUMN IF NOT EXISTS wo'), `${sqlFile.name} cpsf thiếu cột wo`);
    assert.ok(content.includes('notes TEXT') || content.includes('ADD COLUMN IF NOT EXISTS notes'), `${sqlFile.name} cpsf thiếu cột notes`);
  });

  check(`File ${sqlFile.name} chứa các cột mới nhất trên cps (notes, chk_quality, wo, total_qty, scrap_qty)`, () => {
    const content = fs.readFileSync(sqlFile.path, 'utf-8');
    assert.ok(content.includes('wo_total_qty') && content.includes('waste_qty'), `${sqlFile.name} cps thiếu wo_total_qty / waste_qty`);
    assert.ok(content.includes('total_qty') && content.includes('scrap_qty'), `${sqlFile.name} cps thiếu total_qty / scrap_qty`);
    assert.ok(content.includes('wo VARCHAR(255)') || content.includes('ADD COLUMN IF NOT EXISTS wo'), `${sqlFile.name} cps thiếu cột wo`);
  });

  check(`File ${sqlFile.name} chứa các indexes cần thiết cho cpsr, cpst, cpsf, cps`, () => {
    const content = fs.readFileSync(sqlFile.path, 'utf-8');
    assert.ok(content.includes('idx_cpsr_doc_no'), `${sqlFile.name} thiếu idx_cpsr_doc_no`);
    assert.ok(content.includes('idx_cpst_doc_no'), `${sqlFile.name} thiếu idx_cpst_doc_no`);
    assert.ok(content.includes('idx_cpsf_doc_no'), `${sqlFile.name} thiếu idx_cpsf_doc_no`);
    assert.ok(content.includes('idx_cps_doc_no'), `${sqlFile.name} thiếu idx_cps_doc_no`);
  });

  check(`File ${sqlFile.name} chứa các lệnh ALTER TABLE ADD COLUMN IF NOT EXISTS an toàn cho migration`, () => {
    const content = fs.readFileSync(sqlFile.path, 'utf-8');
    assert.ok(content.includes('ALTER TABLE') && content.includes('ADD COLUMN IF NOT EXISTS'), `${sqlFile.name} phải chứa lệnh migration an toàn`);
  });
}

// Kiểm tra tính đồng bộ trong DatabaseService (initPgSchema)
check('DatabaseService (database.service.ts) chứa định nghĩa đầy đủ 14 bảng và migration an toàn', () => {
  const dbServicePath = path.resolve(__dirname, '../src/modules/database/database.service.ts');
  assert.ok(fs.existsSync(dbServicePath));
  const content = fs.readFileSync(dbServicePath, 'utf-8');

  for (const tbl of expected14Tables) {
    const tableRegex = new RegExp(`CREATE\\s+TABLE\\s+(IF\\s+NOT\\s+EXISTS\\s+)?${tbl}\\b`, 'i');
    assert.ok(tableRegex.test(content), `DatabaseService thiếu DDL cho bảng '${tbl}'`);
  }

  assert.ok(content.includes('EnvValidator.getDatabaseConfig()'), 'DatabaseService phải nạp config qua EnvValidator');
  assert.ok(content.includes('EnvValidator.getDataDir()'), 'DatabaseService phải nạp DATA_DIR qua EnvValidator');
});

// =========================================================================
// PHẦN 3: QUÉT KIỂM TRA TÍNH CÂN BẰNG THẺ HTML (0 LỖI DIV / TAG LỆCH)
// =========================================================================
console.log('\n--- 3. Quét kiểm tra tính cân bằng thẻ HTML (0 lỗi div / unclosed / mismatch) ---');

const viewTemplates: Record<string, string> = {
  'CONTROL_PANEL_HTML (control-panel.view.ts)': CONTROL_PANEL_HTML,
  'DASHBOARD_HTML (dashboard.view.ts)': DASHBOARD_HTML,
  'FORM_REQUEST_HTML (form-request.view.ts)': FORM_REQUEST_HTML,
  'CONFIRM_REQUEST_HTML (confirm-request.view.ts)': CONFIRM_REQUEST_HTML,
  'TECHNICAL_FEEDBACK_HTML (technical-feedback.view.ts)': TECHNICAL_FEEDBACK_HTML,
  'LOGIN_HTML (login.view.ts)': LOGIN_HTML,
};

function scanHtmlTagBalance(name: string, html: string) {
  const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*?)?(\/?)>/gs;
  let match: RegExpExecArray | null;
  const stack: { tag: string; line: number }[] = [];
  const errors: string[] = [];
  let divOpenCount = 0;
  let divCloseCount = 0;

  while ((match = tagRegex.exec(html)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    const isSelfClosing = match[2] === '/' || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag);
    const isClosing = full.startsWith('</');
    if (isSelfClosing) continue;

    const lineNum = html.substring(0, match.index).split('\n').length;
    if (!isClosing) {
      if (tag === 'div') divOpenCount++;
      stack.push({ tag, line: lineNum });
    } else {
      if (tag === 'div') divCloseCount++;
      if (stack.length === 0) {
        errors.push(`Thẻ đóng thừa </${tag}> tại dòng ${lineNum}`);
      } else {
        const top = stack.pop()!;
        if (top.tag !== tag) {
          errors.push(`Lệch thẻ tại dòng ${lineNum}: mong đợi </${top.tag}> (mở dòng ${top.line}) nhưng gặp </${tag}>`);
        }
      }
    }
  }

  assert.strictEqual(errors.length, 0, `${name} có lỗi thẻ HTML lệch/thừa: ${errors.join('; ')}`);
  assert.strictEqual(stack.length, 0, `${name} có thẻ chưa đóng: ${stack.map(s => `<${s.tag}> (dòng ${s.line})`).join(', ')}`);
  assert.strictEqual(divOpenCount, divCloseCount, `${name} có số lượng thẻ div không cân bằng: ${divOpenCount} mở vs ${divCloseCount} đóng`);
  return { divCount: divOpenCount };
}

for (const [viewName, htmlContent] of Object.entries(viewTemplates)) {
  check(`Cân bằng 100% thẻ HTML tại ${viewName}`, () => {
    const res = scanHtmlTagBalance(viewName, htmlContent);
    assert.ok(res.divCount > 0, 'Phải có ít nhất 1 thẻ div');
  });
}

// =========================================================================
// PHẦN 4: KIỂM THỬ CẤU HÌNH DOCKER & MÔI TRƯỜNG DOCKER DEPLOYMENT
// =========================================================================
console.log('\n--- 4. Kiểm tra cấu hình triển khai Docker (.env.example, Dockerfile, docker-compose.yml) ---');

check('.env.example chứa đầy đủ cấu hình cho 10 biến môi trường cốt lõi', () => {
  const envExamplePath = path.resolve(__dirname, '../.env.example');
  assert.ok(fs.existsSync(envExamplePath));
  const content = fs.readFileSync(envExamplePath, 'utf-8');

  const requiredKeys = [
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_AUTO_INIT',
    'DATA_DIR',
  ];

  for (const k of requiredKeys) {
    assert.ok(content.includes(k), `.env.example thiếu key ${k}`);
  }
});

check('Dockerfile chuẩn hóa cho triển khai Production container', () => {
  const dockerfilePath = path.resolve(__dirname, '../Dockerfile');
  assert.ok(fs.existsSync(dockerfilePath));
  const content = fs.readFileSync(dockerfilePath, 'utf-8');
  assert.ok(content.includes('FROM node:'), 'Dockerfile phải có base image Node.js');
  assert.ok(content.includes('npm run build'), 'Dockerfile phải chạy build step');
  assert.ok(content.includes('EXPOSE') && (content.includes('3000') || content.includes('3001')), 'Dockerfile phải expose port');
});

check('docker-compose.yml cấu hình chuẩn hóa biến môi trường và volume lưu trữ', () => {
  const composePath = path.resolve(__dirname, '../docker-compose.yml');
  assert.ok(fs.existsSync(composePath));
  const content = fs.readFileSync(composePath, 'utf-8');
  assert.ok(content.includes('services:'), 'docker-compose.yml phải có services block');
  assert.ok(content.includes('DB_HOST') && content.includes('DB_PORT'), 'docker-compose.yml phải cấu hình biến DB');
  assert.ok(content.includes('DB_AUTO_INIT'), 'docker-compose.yml phải có cờ DB_AUTO_INIT');
  assert.ok(content.includes('DATA_DIR') || content.includes('/app/data'), 'docker-compose.yml phải cấu hình DATA_DIR / volume');
});

console.log('\n================================================================');
console.log(`🎉 TẤT CẢ ${passedChecks}/${totalChecks} MỤC KIỂM THỬ ĐÃ PASS 100% THÀNH CÔNG!`);
console.log('================================================================\n');

process.exit(0);
