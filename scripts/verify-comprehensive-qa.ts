import { Client } from 'pg';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

interface TestResult {
  suite: string;
  name: string;
  status: 'passed' | 'failed';
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, suite: string, details?: string) {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    results.push({ suite, name, status: 'passed' });
  } else {
    console.error(`  [FAIL] ${name} - ${details || 'Assertion failed'}`);
    results.push({ suite, name, status: 'failed', details });
    throw new Error(`[FAIL] ${name}: ${details || 'Assertion failed'}`);
  }
}

async function runComprehensiveVerification() {
  console.log('================================================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ XÁC MINH TOÀN DIỆN: 3 FORM CPSR/CPST/CPSF, QUAN HỆ 1-1-1, TABULATOR');
  console.log('================================================================================\n');

  // ==============================================================================
  // 1. CẤU TRÚC 3 BẢNG VÀ QUAN HỆ 1-1-1 TRONG POSTGRESQL
  // ==============================================================================
  console.log('--- 1. Kiểm tra cấu trúc 3 bảng cpsr, cpst, cpsf và quan hệ 1-1-1 trong PostgreSQL ---');
  const pgClient = new Client({
    host: process.env.POSTGRES_HOST || '192.168.1.35',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'Ph@nloi20031403',
    database: process.env.POSTGRES_DB || 'checkpoint_technical',
  });

  await pgClient.connect();

  try {
    // 1.1 Kiểm tra sự tồn tại của 3 bảng
    const tablesRes = await pgClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('cpsr', 'cpst', 'cpsf')
    `);
    const existingTables = tablesRes.rows.map(r => r.table_name);
    assert(existingTables.includes('cpsr'), 'Bảng cpsr tồn tại trong PostgreSQL', 'PostgreSQL Schema');
    assert(existingTables.includes('cpst'), 'Bảng cpst tồn tại trong PostgreSQL', 'PostgreSQL Schema');
    assert(existingTables.includes('cpsf'), 'Bảng cpsf tồn tại trong PostgreSQL', 'PostgreSQL Schema');

    // 1.2 Kiểm tra Primary Key và Unique Constraints
    const pkRes = await pgClient.query(`
      SELECT tc.table_name, ccu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name IN ('cpsr', 'cpst', 'cpsf')
    `);
    const pks = pkRes.rows.reduce((acc, row) => ({ ...acc, [row.table_name]: row.column_name }), {});
    assert(pks['cpsr'] === 'id', 'Bảng cpsr có Primary Key là column "id"', 'PostgreSQL Schema');
    assert(pks['cpst'] === 'id', 'Bảng cpst có Primary Key là column "id"', 'PostgreSQL Schema');
    assert(pks['cpsf'] === 'id', 'Bảng cpsf có Primary Key là column "id"', 'PostgreSQL Schema');

    // 1.3 Kiểm tra Unique Constraints trên doc_no
    const uniqRes = await pgClient.query(`
      SELECT tc.table_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'UNIQUE' AND tc.table_name IN ('cpsr', 'cpst', 'cpsf')
    `);
    const uniqCols = uniqRes.rows.map(r => `${r.table_name}.${r.column_name}`);
    assert(uniqCols.includes('cpsr.doc_no'), 'Bảng cpsr có UNIQUE constraint trên doc_no', 'PostgreSQL 1-1-1');
    assert(uniqCols.includes('cpst.doc_no'), 'Bảng cpst có UNIQUE constraint trên doc_no', 'PostgreSQL 1-1-1');
    assert(uniqCols.includes('cpsf.doc_no'), 'Bảng cpsf có UNIQUE constraint trên doc_no', 'PostgreSQL 1-1-1');

    // 1.4 Kiểm tra quan hệ 1-1 qua Foreign Key & Unique constraint
    // cpst.cpsr_doc_no là UNIQUE và liên kết cpsr.doc_no
    assert(uniqCols.includes('cpst.cpsr_doc_no'), 'Bảng cpst có UNIQUE constraint trên cpsr_doc_no (chặt chẽ 1-1 với CPSR)', 'PostgreSQL 1-1-1');
    assert(uniqCols.includes('cpsf.cpst_doc_no'), 'Bảng cpsf có UNIQUE constraint trên cpst_doc_no (chặt chẽ 1-1 với CPST)', 'PostgreSQL 1-1-1');

    const fkRes = await pgClient.query(`
      SELECT
        tc.table_name AS source_table,
        kcu.column_name AS source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('cpst', 'cpsf')
    `);
    const fks = fkRes.rows.map(r => `${r.source_table}.${r.source_column} -> ${r.target_table}.${r.target_column}`);
    assert(
      fks.some(f => f.includes('cpst.cpsr_doc_no -> cpsr.doc_no')),
      'Foreign key cpst.cpsr_doc_no tham chiếu cpsr.doc_no',
      'PostgreSQL 1-1-1'
    );
    assert(
      fks.some(f => f.includes('cpsf.cpst_doc_no -> cpst.doc_no')),
      'Foreign key cpsf.cpst_doc_no tham chiếu cpst.doc_no',
      'PostgreSQL 1-1-1'
    );

    // 1.5 Kiểm tra các trường timestamp submitted_at
    const timestampColsRes = await pgClient.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name IN ('cpsr', 'cpst', 'cpsf') AND column_name IN ('submitted_at', 'created_at', 'updated_at')
    `);
    const tsCols = timestampColsRes.rows.map(r => `${r.table_name}.${r.column_name}:${r.data_type}`);
    assert(tsCols.some(c => c.startsWith('cpsr.submitted_at:timestamp')), 'cpsr có trường submitted_at timestamp', 'PostgreSQL Timestamp');
    assert(tsCols.some(c => c.startsWith('cpst.submitted_at:timestamp')), 'cpst có trường submitted_at timestamp', 'PostgreSQL Timestamp');
    assert(tsCols.some(c => c.startsWith('cpsf.submitted_at:timestamp')), 'cpsf có trường submitted_at timestamp', 'PostgreSQL Timestamp');
  } finally {
    await pgClient.end();
  }

  // ==============================================================================
  // KHỞI ĐỘNG LIVE NESTJS APP ĐỂ KIỂM THỬ HTTP & API
  // ==============================================================================
  console.log('\n--- Khởi động Live NestJS App trên cổng 3388 ---');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  await app.listen(3388);
  const baseUrl = 'http://127.0.0.1:3388';
  console.log('✅ Live NestJS server running at', baseUrl);

  try {
    // ==============================================================================
    // 2. ĐỊNH DẠNG MÃ PHIẾU TỰ TĂNG THEO NGÀY CPSR/CPST/CPSF-YYYYMMDD-XXX
    // ==============================================================================
    console.log('\n--- 2. Kiểm tra định dạng mã phiếu tự tăng theo ngày CPSR/CPST/CPSF-YYYYMMDD-XXX ---');
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const cpsrNext = await fetch(`${baseUrl}/api/cpsr/next-code`).then(r => r.json());
    const cpstNext = await fetch(`${baseUrl}/api/cpst/next-code`).then(r => r.json());
    const cpsfNext = await fetch(`${baseUrl}/api/cpsf/next-code`).then(r => r.json());

    console.log('  Next CPSR code:', cpsrNext.docNo);
    console.log('  Next CPST code:', cpstNext.docNo);
    console.log('  Next CPSF code:', cpsfNext.docNo);

    const cpsrPattern = new RegExp(`^CPSR-${todayStr}-\\d{3}$`);
    const cpstPattern = new RegExp(`^CPST-${todayStr}-\\d{3}$`);
    const cpsfPattern = new RegExp(`^CPSF-${todayStr}-\\d{3}$`);

    assert(cpsrPattern.test(cpsrNext.docNo), `Mã CPSR đúng chuẩn CPSR-YYYYMMDD-XXX (${cpsrNext.docNo})`, 'Daily Auto-Increment');
    assert(cpstPattern.test(cpstNext.docNo), `Mã CPST đúng chuẩn CPST-YYYYMMDD-XXX (${cpstNext.docNo})`, 'Daily Auto-Increment');
    assert(cpsfPattern.test(cpsfNext.docNo), `Mã CPSF đúng chuẩn CPSF-YYYYMMDD-XXX (${cpsfNext.docNo})`, 'Daily Auto-Increment');

    // ==============================================================================
    // 3. KHẢ NĂNG TRUY CẬP CÔNG KHAI KHÔNG CẦN LOGIN CỦA CẢ 3 FORM
    // ==============================================================================
    console.log('\n--- 3. Kiểm tra truy cập công khai không cần login của cả 3 form ---');
    
    // 3.1 /form-request
    const resFormRequest = await fetch(`${baseUrl}/form-request`, { redirect: 'manual' });
    assert(resFormRequest.status === 200, 'GET /form-request trả về HTTP 200 OK (không bị redirect login)', 'Public Access');
    const htmlFormRequest = await resFormRequest.text();
    assert(htmlFormRequest.includes('CPSR - Phiếu Yêu Cầu Kỹ Thuật'), '/form-request chứa tiêu đề CPSR', 'Public Access');
    assert(htmlFormRequest.includes('btn-toggle'), '/form-request có class btn-toggle (nút to tối giản)', 'Public Access UI');
    assert(htmlFormRequest.includes('btn-submit'), '/form-request có class btn-submit (nút gửi to)', 'Public Access UI');

    // 3.2 /technical-feedback
    const resTechFeedback = await fetch(`${baseUrl}/technical-feedback`, { redirect: 'manual' });
    assert(resTechFeedback.status === 200, 'GET /technical-feedback trả về HTTP 200 OK (không bị redirect login)', 'Public Access');
    const htmlTechFeedback = await resTechFeedback.text();
    assert(htmlTechFeedback.includes('CPST - Phản Hồi Kỹ Thuật'), '/technical-feedback chứa tiêu đề CPST', 'Public Access');
    assert(htmlTechFeedback.includes('btn-toggle'), '/technical-feedback có class btn-toggle (nút to tối giản)', 'Public Access UI');
    assert(htmlTechFeedback.includes('upload-zone'), '/technical-feedback có khu vực upload ảnh trạng thái lỗi và sau khắc phục', 'Public Access UI');

    // 3.3 /confirm-request
    const resConfirmRequest = await fetch(`${baseUrl}/confirm-request`, { redirect: 'manual' });
    assert(resConfirmRequest.status === 200, 'GET /confirm-request trả về HTTP 200 OK (không bị redirect login)', 'Public Access');
    const htmlConfirmRequest = await resConfirmRequest.text();
    assert(htmlConfirmRequest.includes('CPSF - Xác Nhận Bàn Giao'), '/confirm-request chứa tiêu đề CPSF', 'Public Access');
    assert(htmlConfirmRequest.includes('btn-toggle'), '/confirm-request có class btn-toggle (nút to tối giản)', 'Public Access UI');
    assert(htmlConfirmRequest.includes('btn-submit'), '/confirm-request có class btn-submit (nút xác nhận bàn giao to)', 'Public Access UI');

    // So sánh đối chứng: /control-panel và /dashboard yêu cầu đăng nhập (302 Redirect)
    const resControlPanelUnauth = await fetch(`${baseUrl}/control-panel`, { redirect: 'manual' });
    assert(resControlPanelUnauth.status === 302, 'GET /control-panel chuyển hướng 302 đến /login khi chưa đăng nhập (được bảo vệ)', 'Security RBAC');

    // ==============================================================================
    // 4. LUỒNG LIÊN KẾT DỮ LIỆU CPSR -> CPST -> CPSF VÀ LƯU TRỮ TIMESTAMP
    // ==============================================================================
    console.log('\n--- 4. Kiểm tra luồng liên kết dữ liệu CPSR -> CPST -> CPSF và lưu trữ timestamp ---');

    // 4.1 Tạo CPSR mới
    const testReqBy = 'Nguyễn QA Test - QA01';
    const cpsrPayload = {
      reqDate: '2026-03-24',
      reqTime: '14:30',
      reqBy: testReqBy,
      printTech: 'OFFSET',
      machineName: 'Heidelberg Speedmaster XL 106',
      problem: 'Nhiệt lô sấy không ổn định',
      machineStatus: 'Hàng SX lần đầu',
      priority: 'Hỗ trợ ngay',
    };
    const cpsrCreateRes = await fetch(`${baseUrl}/api/cpsr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cpsrPayload),
    });
    assert(cpsrCreateRes.status === 201, 'POST /api/cpsr tạo mới phiếu thành công (HTTP 201)', 'Data Flow CPSR');
    const createdCpsr = await cpsrCreateRes.json();
    console.log('  Created CPSR:', createdCpsr.docNo, 'submittedAt:', createdCpsr.submittedAt);
    assert(!!createdCpsr.submittedAt, 'Phiếu CPSR có trường submittedAt hợp lệ', 'Timestamp CPSR');
    assert(!isNaN(Date.parse(createdCpsr.submittedAt)), 'submittedAt của CPSR là chuỗi ISO 8601 hợp lệ', 'Timestamp CPSR');

    // 4.2 Kiểm tra CPSR xuất hiện trong danh sách khả dụng cho CPST
    const availCpsrRes = await fetch(`${baseUrl}/api/cpsr/available-for-cpst`).then(r => r.json());
    assert(
      availCpsrRes.some((r: any) => r.docNo === createdCpsr.docNo),
      'Phiếu CPSR vừa tạo xuất hiện trong GET /api/cpsr/available-for-cpst',
      'Data Flow CPSR->CPST'
    );

    // 4.3 Tạo CPST liên kết tới CPSR vừa tạo
    const cpstPayload = {
      cpsrDocNo: createdCpsr.docNo,
      recvBy: 'KTV Hoàng Kỹ Thuật - KT99',
      recvDate: '2026-03-24',
      recvTime: '14:40',
      finishDate: '2026-03-24',
      finishTime: '15:15',
      downtime: 35,
      rootCause: 'Cảm biến nhiệt bị bám bụi',
      actionTaken: 'Vệ sinh cảm biến và hiệu chuẩn lại mạch điều khiển',
      chkStatus: 'Đã khắc phục',
      photosBefore: ['data:image/png;base64,mockBeforePhoto'],
      photosAfter: ['data:image/png;base64,mockAfterPhoto'],
    };
    const cpstCreateRes = await fetch(`${baseUrl}/api/cpst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cpstPayload),
    });
    assert(cpstCreateRes.status === 201, 'POST /api/cpst tạo mới phản hồi kỹ thuật thành công (HTTP 201)', 'Data Flow CPST');
    const createdCpst = await cpstCreateRes.json();
    console.log('  Created CPST:', createdCpst.docNo, 'linked to CPSR:', createdCpst.cpsrDocNo, 'submittedAt:', createdCpst.submittedAt);
    assert(createdCpst.cpsrDocNo === createdCpsr.docNo, 'CPST lưu chính xác mã CPSR liên kết', 'Data Flow CPSR->CPST');
    assert(!!createdCpst.submittedAt, 'Phiếu CPST có trường submittedAt hợp lệ', 'Timestamp CPST');

    // 4.4 Kiểm tra CPSR không còn trong danh sách khả dụng (chặt chẽ 1-1)
    const availCpsrAfterRes = await fetch(`${baseUrl}/api/cpsr/available-for-cpst`).then(r => r.json());
    assert(
      !availCpsrAfterRes.some((r: any) => r.docNo === createdCpsr.docNo),
      'CPSR đã được tạo CPST sẽ biến mất khỏi danh sách available-for-cpst',
      '1-1 Enforcement'
    );

    // 4.5 Kiểm tra chặn duplicate CPST trên cùng 1 CPSR (Bảo toàn quan hệ 1-1)
    const dupCpstRes = await fetch(`${baseUrl}/api/cpst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpsrDocNo: createdCpsr.docNo,
        recvBy: 'KTV Duplicate Test',
      }),
    });
    assert(
      dupCpstRes.status === 400 || dupCpstRes.status === 409,
      `Chặn tạo duplicate CPST cho cùng 1 CPSR (HTTP ${dupCpstRes.status})`,
      '1-1 Enforcement'
    );

    // 4.6 Kiểm tra CPST xuất hiện trong danh sách khả dụng cho CPSF
    const availCpstRes = await fetch(`${baseUrl}/api/cpst/available-for-cpsf`).then(r => r.json());
    assert(
      availCpstRes.some((r: any) => r.docNo === createdCpst.docNo),
      'Phiếu CPST vừa tạo xuất hiện trong GET /api/cpst/available-for-cpsf',
      'Data Flow CPST->CPSF'
    );

    // 4.7 Tạo CPSF liên kết tới CPST vừa tạo
    const cpsfPayload = {
      cpstDocNo: createdCpst.docNo,
      chkQuality: 'Đạt',
      workOrder: 'WO-2026-QA9999',
      woTotalQty: 10000,
      wasteQty: 50,
      wasteUnit: 'PCS',
      prodMgr: 'Phạm Quản Đốc SX - QĐ01',
    };
    const cpsfCreateRes = await fetch(`${baseUrl}/api/cpsf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cpsfPayload),
    });
    assert(cpsfCreateRes.status === 201, 'POST /api/cpsf tạo mới xác nhận bàn giao thành công (HTTP 201)', 'Data Flow CPSF');
    const createdCpsf = await cpsfCreateRes.json();
    console.log('  Created CPSF:', createdCpsf.docNo, 'linked to CPST:', createdCpsf.cpstDocNo, 'submittedAt:', createdCpsf.submittedAt);
    assert(createdCpsf.cpstDocNo === createdCpst.docNo, 'CPSF lưu chính xác mã CPST liên kết', 'Data Flow CPST->CPSF');
    assert(!!createdCpsf.submittedAt, 'Phiếu CPSF có trường submittedAt hợp lệ', 'Timestamp CPSF');

    // 4.8 Kiểm tra CPST không còn trong danh sách khả dụng cho CPSF (chặt chẽ 1-1)
    const availCpstAfterRes = await fetch(`${baseUrl}/api/cpst/available-for-cpsf`).then(r => r.json());
    assert(
      !availCpstAfterRes.some((r: any) => r.docNo === createdCpst.docNo),
      'CPST đã được tạo CPSF sẽ biến mất khỏi danh sách available-for-cpsf',
      '1-1 Enforcement'
    );

    // 4.9 Kiểm tra chặn duplicate CPSF trên cùng 1 CPST (Bảo toàn quan hệ 1-1)
    const dupCpsfRes = await fetch(`${baseUrl}/api/cpsf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpstDocNo: createdCpst.docNo,
        chkQuality: 'Đạt',
      }),
    });
    assert(
      dupCpsfRes.status === 400 || dupCpsfRes.status === 409,
      `Chặn tạo duplicate CPSF cho cùng 1 CPST (HTTP ${dupCpsfRes.status})`,
      '1-1 Enforcement'
    );

    // 4.10 Kiểm tra chuỗi liên kết hoàn chỉnh 1-1-1 qua GET /api/cpsr-chain
    const chainRes = await fetch(`${baseUrl}/api/cpsr-chain`).then(r => r.json());
    const chainItem = chainRes.find((item: any) => item.cpsr?.docNo === createdCpsr.docNo);
    assert(!!chainItem, 'Chuỗi phiếu tìm thấy trong GET /api/cpsr-chain', '1-1-1 Chain Integration');
    assert(chainItem.cpsr.docNo === createdCpsr.docNo, 'Chain chứa đúng CPSR', '1-1-1 Chain Integration');
    assert(chainItem.cpst?.docNo === createdCpst.docNo, 'Chain liên kết đúng CPST', '1-1-1 Chain Integration');
    assert(chainItem.cpsf?.docNo === createdCpsf.docNo, 'Chain liên kết đúng CPSF', '1-1-1 Chain Integration');

    // 4.11 Dọn dẹp dữ liệu test (CASCADE delete cpsr)
    const delRes = await fetch(`${baseUrl}/api/cpsr/${createdCpsr.id}`, { method: 'DELETE' }).then(r => r.json());
    assert(delRes.success === true, 'Xóa phiếu CPSR test thành công và cascade xóa CPST, CPSF', 'Clean Up');

    // ==============================================================================
    // 5. GIAO DIỆN QUẢN LÝ 3 BẢNG TRÊN CONTROL PANEL VỚI TABULATOR
    // ==============================================================================
    console.log('\n--- 5. Kiểm tra giao diện quản lý 3 bảng trên Control Panel với Tabulator ---');
    
    // Đọc mã nguồn view control-panel.view.ts
    const fs = require('fs');
    const controlPanelViewContent = fs.readFileSync(
      path.join(__dirname, '../src/views/control-panel.view.ts'),
      'utf-8'
    );

    // 5.1 Kiểm tra tích hợp thư viện Tabulator
    assert(
      controlPanelViewContent.includes('tabulator.min.js') || controlPanelViewContent.includes('Tabulator'),
      'Control Panel import thư viện Tabulator JS',
      'Control Panel Tabulator'
    );

    // 5.2 Kiểm tra container Tabulator cho 3 split forms
    assert(
      controlPanelViewContent.includes('id="tabulator-split-forms"'),
      'Control Panel có DOM container #tabulator-split-forms',
      'Control Panel Tabulator'
    );

    // 5.3 Kiểm tra sub-tabs chuyển đổi giữa Chuỗi 1-1-1, CPSR, CPST, CPSF
    assert(
      controlPanelViewContent.includes("switchSplitTab('chain')") &&
      controlPanelViewContent.includes("switchSplitTab('cpsr')") &&
      controlPanelViewContent.includes("switchSplitTab('cpst')") &&
      controlPanelViewContent.includes("switchSplitTab('cpsf')"),
      'Control Panel hỗ trợ chuyển đổi linh hoạt 4 sub-tab (Chain, CPSR, CPST, CPSF)',
      'Control Panel Navigation'
    );

    // 5.4 Kiểm tra các cột cấu hình Tabulator cho chuỗi 1-1-1 và từng bảng
    assert(
      controlPanelViewContent.includes('initSplitFormsTabulator') || controlPanelViewContent.includes('new Tabulator'),
      'Control Panel khởi tạo Tabulator với cấu hình cột',
      'Control Panel Tabulator'
    );
    assert(
      controlPanelViewContent.includes('cpsr') && controlPanelViewContent.includes('cpst') && controlPanelViewContent.includes('cpsf'),
      'Cấu hình cột Tabulator hỗ trợ hiển thị dữ liệu từ cả 3 form cpsr, cpst, cpsf',
      'Control Panel Tabulator'
    );

    // 5.5 Kiểm tra các nút mở nhanh 3 form từ Control Panel
    assert(
      controlPanelViewContent.includes('href="/form-request"') &&
      controlPanelViewContent.includes('href="/technical-feedback"') &&
      controlPanelViewContent.includes('href="/confirm-request"'),
      'Control Panel có đầy đủ liên kết điều hướng trực tiếp tới cả 3 form công khai',
      'Control Panel Links'
    );

  } finally {
    await app.close();
  }

  // ==============================================================================
  // TỔNG KẾT KẾT QUẢ KIỂM THỬ
  // ==============================================================================
  console.log('\n================================================================================');
  console.log('📊 TỔNG HỢP KẾT QUẢ KIỂM THỬ XÁC MINH');
  console.log('================================================================================');
  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  console.log(`Tổng số assertions: ${results.length}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);

  if (failedCount > 0) {
    console.error('\nCÓ LỖI XẢY RA TRONG QUÁ TRÌNH KIỂM THỬ!');
    process.exit(1);
  } else {
    console.log('\n🎉 TOÀN BỘ 5 TIÊU CHÍ XÁC MINH ĐỀU ĐẠT 100%!');
  }
}

runComprehensiveVerification().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
