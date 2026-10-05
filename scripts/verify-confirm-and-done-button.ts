import * as assert from 'assert';
import { FORM_REQUEST_HTML } from '../src/views/form-request.view';
import { TECHNICAL_FEEDBACK_HTML } from '../src/views/technical-feedback.view';
import { CONFIRM_REQUEST_HTML } from '../src/views/confirm-request.view';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as http from 'http';

async function runQAVerification() {
  console.log('=== QA VERIFICATION: CONFIRM POPUP & DONE BUTTON FLOW ===\n');

  const views = [
    { name: 'CPSR (form-request)', html: FORM_REQUEST_HTML, label: 'Gửi Yêu Cầu' },
    { name: 'CPST (technical-feedback)', html: TECHNICAL_FEEDBACK_HTML, label: 'Gửi Phản Hồi' },
    { name: 'CPSF (confirm-request)', html: CONFIRM_REQUEST_HTML, label: 'Gửi Bàn Giao' }
  ];

  // 1. Static Contract & UI Inspection across all 3 forms
  for (const v of views) {
    console.log(`Checking view: ${v.name}`);

    // Requirement 1: Confirm modal with "Bạn có muốn gửi hay không?", OK and Cancel buttons
    assert.ok(v.html.includes('showConfirmModal'), `${v.name} must have showConfirmModal reactive state`);
    assert.ok(v.html.includes('Bạn có muốn gửi hay không?'), `${v.name} must contain question "Bạn có muốn gửi hay không?"`);
    assert.ok(v.html.includes('Hủy / Cancel'), `${v.name} must have 'Hủy / Cancel' button`);
    assert.ok(v.html.includes('OK'), `${v.name} must have 'OK' button`);

    // Requirement 2: Cancel closes modal and does not submit
    assert.ok(
      v.html.includes('@click="showConfirmModal = false"') || v.html.includes('@click="closeConfirmModal"'),
      `${v.name} cancel button must close confirm modal`
    );

    // Requirement 3: OK calls confirmSubmit
    assert.ok(
      v.html.includes('@click="confirmSubmit"'),
      `${v.name} OK button must trigger confirmSubmit`
    );
    assert.ok(
      v.html.includes('confirmSubmit'),
      `${v.name} must define confirmSubmit function`
    );

    // Requirement 3 & 4: Success popup only has single 'Hoàn thành' button
    assert.ok(v.html.includes('Hoàn thành'), `${v.name} must have 'Hoàn thành' button`);
    assert.ok(
      v.html.includes('@click="resetForm"') && v.html.includes('Hoàn thành'),
      `${v.name} 'Hoàn thành' button must trigger resetForm`
    );

    // Ensure previous multi-buttons are removed from success modal
    assert.ok(!v.html.includes('Tiếp Tục: Chuyển Sang'), `${v.name} must NOT have 'Tiếp Tục: Chuyển Sang...' button`);
    assert.ok(!v.html.includes('Xem trên Control Panel'), `${v.name} must NOT have 'Xem trên Control Panel' button`);
    assert.ok(!v.html.includes('+ Tạo Phiếu Yêu Cầu Mới'), `${v.name} must NOT have '+ Tạo Phiếu Yêu Cầu Mới' button`);
    assert.ok(!v.html.includes('+ Tạo Phản Hồi Mới'), `${v.name} must NOT have '+ Tạo Phản Hồi Mới' button`);
    assert.ok(!v.html.includes('+ Tạo Xác Nhận Bàn Giao Mới'), `${v.name} must NOT have '+ Tạo Xác Nhận Bàn Giao Mới' button`);

    // submitForm validation before showing confirm modal
    assert.ok(v.html.includes('showConfirmModal.value = true'), `${v.name} submitForm must open showConfirmModal`);

    console.log(`   ✓ ${v.name} verified: Confirm popup (OK/Cancel) and single Done button.\n`);
  }

  // 2. HTTP Server End-to-End Rendering Verification
  console.log('Starting NestJS server instance for E2E HTTP response check...');
  const app = await NestFactory.create(AppModule, { logger: false });
  const server = await app.listen(0);
  const address = server.address() as any;
  const port = address.port;
  console.log(`NestJS server listening on port ${port}`);

  function fetchUrl(path: string): Promise<{ status: number; text: string }> {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}${path}`, (res) => {
        let text = '';
        res.on('data', chunk => text += chunk);
        res.on('end', () => resolve({
          status: res.statusCode || 0,
          text
        }));
      }).on('error', reject);
    });
  }

  const endpoints = [
    { path: '/form-request', title: 'CPSR' },
    { path: '/technical-feedback', title: 'CPST' },
    { path: '/confirm-request', title: 'CPSF' }
  ];

  for (const ep of endpoints) {
    const res = await fetchUrl(ep.path);
    assert.strictEqual(res.status, 200, `GET ${ep.path} must return 200`);
    assert.ok(res.text.includes('Bạn có muốn gửi hay không?'), `GET ${ep.path} must contain confirm dialog text`);
    assert.ok(res.text.includes('Hủy / Cancel'), `GET ${ep.path} must contain Cancel button`);
    assert.ok(res.text.includes('Hoàn thành'), `GET ${ep.path} must contain Hoàn thành button`);
    console.log(`   ✓ GET ${ep.path} served HTML with confirm modal and Hoàn thành button correctly.`);
  }

  await app.close();
  console.log('\n=== ALL QA VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
}

runQAVerification().catch(err => {
  console.error('QA Verification Failed:', err);
  process.exit(1);
});
