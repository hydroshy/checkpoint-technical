import * as assert from 'assert';
import { FORM_REQUEST_HTML } from './src/views/form-request.view';
import { TECHNICAL_FEEDBACK_HTML } from './src/views/technical-feedback.view';
import { CONFIRM_REQUEST_HTML } from './src/views/confirm-request.view';
import { CONTROL_PANEL_HTML } from './src/views/control-panel.view';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import * as http from 'http';

async function runFrontendVerification() {
  console.log('=== TEST T2: VERIFYING FRONTEND VIEWS & INTEGRATION ===\n');

  // 1. Verify /form-request (CPSR) View HTML Content & Structure
  console.log('1. Checking /form-request (CPSR) HTML view:');
  assert.ok(FORM_REQUEST_HTML.includes('PHIẾU YÊU CẦU KỸ THUẬT (CPSR)'), 'Must have CPSR header');
  assert.ok(FORM_REQUEST_HTML.includes('CPSR-'), 'Must support CPSR code format');
  assert.ok(FORM_REQUEST_HTML.includes('reqDate') && FORM_REQUEST_HTML.includes('reqTime'), 'Must have reqDate and reqTime fields');
  assert.ok(FORM_REQUEST_HTML.includes('filteredEmployees'), 'Must have searchable employee droplist');
  assert.ok(FORM_REQUEST_HTML.includes('Mã NV:') && FORM_REQUEST_HTML.includes('emp.dept'), 'Must render 3-line droplist for requester (Name, MNV, Dept/Role)');
  assert.ok(FORM_REQUEST_HTML.includes('printTech') && FORM_REQUEST_HTML.includes('machineName'), 'Must have tech & machine droplist/input');
  assert.ok(FORM_REQUEST_HTML.includes('problem'), 'Must have problem description textarea');
  assert.ok(FORM_REQUEST_HTML.includes('Hàng SX lần đầu') && FORM_REQUEST_HTML.includes('Hàng SX nhiều lần'), 'Must have 2 big buttons for machineStatus');
  assert.ok(FORM_REQUEST_HTML.includes('Hỗ trợ ngay') && FORM_REQUEST_HTML.includes('Chạy tạm') && FORM_REQUEST_HTML.includes('Khác'), 'Must have 3 big buttons for priority');
  assert.ok(FORM_REQUEST_HTML.includes('btn-toggle'), 'Must have big toggle button styling');
  assert.ok(FORM_REQUEST_HTML.includes('btn-submit'), 'Must have big submit button styling');
  assert.ok(FORM_REQUEST_HTML.includes('submittedAt'), 'Must save submission timestamp');
  assert.ok(FORM_REQUEST_HTML.includes('showConfirmModal') && FORM_REQUEST_HTML.includes('Bạn có muốn gửi hay không?'), 'Must have submit confirmation popup');
  assert.ok(FORM_REQUEST_HTML.includes('Hoàn thành'), 'Must have single Hoàn thành button on success');
  console.log('   ✓ CPSR view structure, 3-line droplist, 2-button status, 3-button priority verified.');

  // 2. Verify /technical-feedback (CPST) View HTML Content & Structure
  console.log('\n2. Checking /technical-feedback (CPST) HTML view:');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('PHIẾU PHẢN HỒI KỸ THUẬT (CPST)'), 'Must have CPST header');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('CPST-'), 'Must support CPST code format');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('cpsrDocNo'), 'Must select linked CPSR');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('selectedCpsr') && TECHNICAL_FEEDBACK_HTML.includes('Read-only'), 'Must auto-fill and show read-only CPSR details');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('recvBy') && TECHNICAL_FEEDBACK_HTML.includes('filteredTechnicians'), 'Must have technician 3-line droplist');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('rootCause') && TECHNICAL_FEEDBACK_HTML.includes('actionTaken'), 'Must have rootCause and actionTaken textareas');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('photosBefore') && TECHNICAL_FEEDBACK_HTML.includes('photosAfter'), 'Must have 2 photo columns (Trạng thái lỗi & Đã khắc phục)');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('upload-zone') && TECHNICAL_FEEDBACK_HTML.includes('dragover'), 'Must support drag-and-drop & file selection for photos');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('Đã khắc phục') && TECHNICAL_FEEDBACK_HTML.includes('Theo dõi thêm') && TECHNICAL_FEEDBACK_HTML.includes('Hư hỏng nặng'), 'Must have 3 big buttons for chkStatus');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('submittedAt'), 'Must save submission timestamp');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('showConfirmModal') && TECHNICAL_FEEDBACK_HTML.includes('Bạn có muốn gửi hay không?'), 'Must have submit confirmation popup');
  assert.ok(TECHNICAL_FEEDBACK_HTML.includes('Hoàn thành'), 'Must have single Hoàn thành button on success');
  console.log('   ✓ CPST view structure, auto-fill CPSR read-only, 2-column photos, 3-button status verified.');

  // 3. Verify /confirm-request (CPSF) View HTML Content & Structure
  console.log('\n3. Checking /confirm-request (CPSF) HTML view:');
  assert.ok(CONFIRM_REQUEST_HTML.includes('PHIẾU XÁC NHẬN BÀN GIAO (CPSF)'), 'Must have CPSF header');
  assert.ok(CONFIRM_REQUEST_HTML.includes('CPSF-'), 'Must support CPSF code format');
  assert.ok(CONFIRM_REQUEST_HTML.includes('cpstDocNo'), 'Must select linked CPST');
  assert.ok(CONFIRM_REQUEST_HTML.includes('selectedCpst') && CONFIRM_REQUEST_HTML.includes('Read-only'), 'Must auto-fill and show read-only CPST details');
  assert.ok(CONFIRM_REQUEST_HTML.includes('chkQuality'), 'Must have print quality evaluation');
  assert.ok(CONFIRM_REQUEST_HTML.includes('ĐẠT') && CONFIRM_REQUEST_HTML.includes('CHƯA ĐẠT'), 'Must have 2 big buttons for quality (Đạt / Chưa đạt)');
  assert.ok(CONFIRM_REQUEST_HTML.includes('workOrder') && CONFIRM_REQUEST_HTML.includes('woTotalQty') && CONFIRM_REQUEST_HTML.includes('wasteQty'), 'Must have WO, totalQty and wasteQty');
  assert.ok(CONFIRM_REQUEST_HTML.includes('calculatedWastePercent'), 'Must auto-calculate waste percentage');
  assert.ok(CONFIRM_REQUEST_HTML.includes('PCS') && CONFIRM_REQUEST_HTML.includes('Mét') && CONFIRM_REQUEST_HTML.includes('Tờ in'), 'Must have 3 big buttons for wasteUnit');
  assert.ok(CONFIRM_REQUEST_HTML.includes('prodMgr') && CONFIRM_REQUEST_HTML.includes('filteredManagers'), 'Must have production manager 3-line droplist');
  assert.ok(CONFIRM_REQUEST_HTML.includes('submittedAt'), 'Must save submission timestamp');
  assert.ok(CONFIRM_REQUEST_HTML.includes('showConfirmModal') && CONFIRM_REQUEST_HTML.includes('Bạn có muốn gửi hay không?'), 'Must have submit confirmation popup');
  assert.ok(CONFIRM_REQUEST_HTML.includes('Hoàn thành'), 'Must have single Hoàn thành button on success');
  console.log('   ✓ CPSF view structure, auto-fill CPST read-only, 2-button quality, 3-button unit, % waste verified.');

  // 4. Verify Control Panel Tabulator Integration
  console.log('\n4. Checking Control Panel Tabulator Integration:');
  assert.ok(CONTROL_PANEL_HTML.includes('CPSR • CPST • CPSF'), 'Must have 3 forms title in Control Panel');
  assert.ok(CONTROL_PANEL_HTML.includes('tabulator-split-forms'), 'Must have Tabulator container for split forms');
  assert.ok(CONTROL_PANEL_HTML.includes('switchSplitTab'), 'Must have sub-tab switching (chain, cpsr, cpst, cpsf)');
  assert.ok(CONTROL_PANEL_HTML.includes('modal-chain-detail'), 'Must have modal for viewing 1-1-1 chain details');
  assert.ok(CONTROL_PANEL_HTML.includes('exportCurrentTabExcel'), 'Must support exporting split forms to Excel');
  assert.ok(CONTROL_PANEL_HTML.includes('/form-request') && CONTROL_PANEL_HTML.includes('/technical-feedback') && CONTROL_PANEL_HTML.includes('/confirm-request'), 'Must link to all 3 public forms');
  console.log('   ✓ Control Panel Tabulator integration and 1-1-1 chain view verified.');

  // 5. Live NestJS App Verification (HTTP routes)
  console.log('\n5. Starting temporary NestJS test instance to verify HTTP routing:');
  const app = await NestFactory.create(AppModule, { logger: false });
  const server = await app.listen(0);
  const address = server.address() as any;
  const port = address.port;
  console.log(`   ✓ NestJS test server running on port ${port}`);

  function fetchUrl(path: string): Promise<{ status: number; text: string; contentType: string }> {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}${path}`, (res) => {
        let text = '';
        res.on('data', chunk => text += chunk);
        res.on('end', () => resolve({
          status: res.statusCode || 0,
          text,
          contentType: res.headers['content-type'] || ''
        }));
      }).on('error', reject);
    });
  }

  // 5.1 Verify public access to /form-request
  const cpsrRes = await fetchUrl('/form-request');
  assert.strictEqual(cpsrRes.status, 200, '/form-request must return 200 OK');
  assert.ok(cpsrRes.contentType.includes('text/html'), '/form-request must return HTML');
  assert.ok(cpsrRes.text.includes('PHIẾU YÊU CẦU KỸ THUẬT (CPSR)'), 'Must return CPSR view');
  console.log('   ✓ GET /form-request returned 200 OK (Public access confirmed)');

  // 5.2 Verify public access to /technical-feedback
  const cpstRes = await fetchUrl('/technical-feedback');
  assert.strictEqual(cpstRes.status, 200, '/technical-feedback must return 200 OK');
  assert.ok(cpstRes.contentType.includes('text/html'), '/technical-feedback must return HTML');
  assert.ok(cpstRes.text.includes('PHIẾU PHẢN HỒI KỸ THUẬT (CPST)'), 'Must return CPST view');
  console.log('   ✓ GET /technical-feedback returned 200 OK (Public access confirmed)');

  // 5.3 Verify public access to /confirm-request
  const cpsfRes = await fetchUrl('/confirm-request');
  assert.strictEqual(cpsfRes.status, 200, '/confirm-request must return 200 OK');
  assert.ok(cpsfRes.contentType.includes('text/html'), '/confirm-request must return HTML');
  assert.ok(cpsfRes.text.includes('PHIẾU XÁC NHẬN BÀN GIAO (CPSF)'), 'Must return CPSF view');
  console.log('   ✓ GET /confirm-request returned 200 OK (Public access confirmed)');

  // 5.4 Verify API next codes
  const nextCpsr = await fetchUrl('/api/cpsr/next-code');
  assert.strictEqual(nextCpsr.status, 200);
  const nextCpsrData = JSON.parse(nextCpsr.text);
  assert.ok(nextCpsrData.docNo.startsWith('CPSR-'), `Next CPSR docNo must start with CPSR-: ${nextCpsrData.docNo}`);

  const nextCpst = await fetchUrl('/api/cpst/next-code');
  assert.strictEqual(nextCpst.status, 200);
  const nextCpstData = JSON.parse(nextCpst.text);
  assert.ok(nextCpstData.docNo.startsWith('CPST-'), `Next CPST docNo must start with CPST-: ${nextCpstData.docNo}`);

  const nextCpsf = await fetchUrl('/api/cpsf/next-code');
  assert.strictEqual(nextCpsf.status, 200);
  const nextCpsfData = JSON.parse(nextCpsf.text);
  assert.ok(nextCpsfData.docNo.startsWith('CPSF-'), `Next CPSF docNo must start with CPSF-: ${nextCpsfData.docNo}`);
  console.log(`   ✓ Next codes verified: ${nextCpsrData.docNo}, ${nextCpstData.docNo}, ${nextCpsfData.docNo}`);

  // 5.5 Verify End-to-End flow via APIs: CPSR -> CPST -> CPSF
  console.log('\n6. Verifying E2E creation flow (CPSR -> CPST -> CPSF):');

  function postJson(path: string, body: any): Promise<{ status: number; data: any }> {
    return new Promise((resolve, reject) => {
      const dataStr = JSON.stringify(body);
      const req = http.request(`http://127.0.0.1:${port}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataStr)
        }
      }, (res) => {
        let text = '';
        res.on('data', chunk => text += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, data: JSON.parse(text) });
          } catch(e) {
            resolve({ status: res.statusCode || 0, data: text });
          }
        });
      });
      req.on('error', reject);
      req.write(dataStr);
      req.end();
    });
  }

  // Create CPSR
  const cpsrPayload = {
    reqDate: '2026-10-05',
    reqTime: '10:00',
    reqBy: 'Lê Minh Hoàng - VN5117',
    printTech: 'OFFSET',
    machineName: 'SM 52',
    problem: 'Frontend Verification Test - Lỗi mực in trục 1',
    machineStatus: 'Hàng SX lần đầu',
    priority: 'Hỗ trợ ngay',
    submittedAt: new Date().toISOString()
  };
  const createdCpsr = await postJson('/api/cpsr', cpsrPayload);
  assert.strictEqual(createdCpsr.status, 201, 'CPSR creation should return 201');
  const cpsrCode = createdCpsr.data.docNo;
  assert.ok(cpsrCode.startsWith('CPSR-'), 'Returned docNo must match CPSR pattern');
  console.log(`   ✓ Step 1: Created CPSR: ${cpsrCode}`);

  // Check available CPSR for CPST
  const availCpsr = await fetchUrl('/api/cpsr/available-for-cpst');
  assert.strictEqual(availCpsr.status, 200);
  const availCpsrList = JSON.parse(availCpsr.text);
  assert.ok(availCpsrList.some((c: any) => c.docNo === cpsrCode), 'Newly created CPSR must be available for CPST');

  // Create CPST linking to CPSR
  const cpstPayload = {
    cpsrDocNo: cpsrCode,
    recvBy: 'KTV Trịnh Văn Thuận - VN5300',
    recvDate: '2026-10-05',
    recvTime: '10:15',
    finishDate: '2026-10-05',
    finishTime: '10:45',
    downtime: 30,
    rootCause: 'Bụi bẩn bám cụm gạt mực',
    actionTaken: 'Vệ sinh và cân chỉnh áp lực gạt mực',
    photosBefore: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='],
    photosAfter: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='],
    chkStatus: 'Đã khắc phục',
    submittedAt: new Date().toISOString()
  };
  const createdCpst = await postJson('/api/cpst', cpstPayload);
  assert.strictEqual(createdCpst.status, 201, 'CPST creation should return 201');
  const cpstCode = createdCpst.data.docNo;
  assert.ok(cpstCode.startsWith('CPST-'), 'Returned docNo must match CPST pattern');
  console.log(`   ✓ Step 2: Created CPST: ${cpstCode} (Linked to ${cpsrCode})`);

  // Check available CPST for CPSF
  const availCpst = await fetchUrl('/api/cpst/available-for-cpsf');
  assert.strictEqual(availCpst.status, 200);
  const availCpstList = JSON.parse(availCpst.text);
  assert.ok(availCpstList.some((c: any) => c.docNo === cpstCode), 'Newly created CPST must be available for CPSF');

  // Create CPSF linking to CPST
  const cpsfPayload = {
    cpstDocNo: cpstCode,
    cpsrDocNo: cpsrCode,
    chkQuality: 'Đạt',
    workOrder: 'WO-20261005-01',
    woTotalQty: 5000,
    wasteQty: 12,
    wasteUnit: 'PCS',
    wastePercent: '0.24%',
    prodMgr: 'Phạm Hùng Sơn - VN5898',
    submittedAt: new Date().toISOString()
  };
  const createdCpsf = await postJson('/api/cpsf', cpsfPayload);
  assert.strictEqual(createdCpsf.status, 201, 'CPSF creation should return 201');
  const cpsfCode = createdCpsf.data.docNo;
  assert.ok(cpsfCode.startsWith('CPSF-'), 'Returned docNo must match CPSF pattern');
  console.log(`   ✓ Step 3: Created CPSF: ${cpsfCode} (Linked to ${cpstCode})`);

  // Verify Chain in /api/cpsr-chain
  const chainRes = await fetchUrl('/api/cpsr-chain');
  assert.strictEqual(chainRes.status, 200);
  const chainList = JSON.parse(chainRes.text);
  const matchedChain = chainList.find((c: any) => c.cpsr?.docNo === cpsrCode);
  assert.ok(matchedChain, 'Complete chain must be present in /api/cpsr-chain');
  assert.strictEqual(matchedChain.cpsr.docNo, cpsrCode);
  assert.strictEqual(matchedChain.cpst.docNo, cpstCode);
  assert.strictEqual(matchedChain.cpsf.docNo, cpsfCode);
  assert.strictEqual(matchedChain.cpsf.chkQuality, 'Đạt');
  console.log(`   ✓ Step 4: Chain 1-1-1 successfully formed and verified in /api/cpsr-chain: ${cpsrCode} -> ${cpstCode} -> ${cpsfCode}`);

  await app.close();
  console.log('\n=== ALL FRONTEND & INTEGRATION TESTS PASSED 100%! ===');
}

runFrontendVerification().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
