import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as assert from 'assert';
import * as http from 'http';

async function verifyAll() {
  console.log('🧪 BẮT ĐẦU KIỂM THỬ XÁC MINH TOÀN DIỆN LIGHT MODE & HEADER:');

  const app = await NestFactory.create(AppModule, { logger: false });
  const server = await app.listen(0);
  const address = server.address() as any;
  const port = address.port;
  console.log(`📡 Server NestJS test đang chạy tại port ${port}`);

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

  try {
    // 1. Kiểm tra route /form-request
    console.log('\n1. Kiểm tra GET /form-request:');
    const formReq = await fetchUrl('/form-request');
    assert.strictEqual(formReq.status, 200, '/form-request phải trả về HTTP 200');

    // Xác minh Light mode
    assert.ok(formReq.text.includes('background-color: #f8fafc;'), 'Body phải có nền sáng #f8fafc');
    assert.ok(formReq.text.includes('color: #0f172a;'), 'Body text phải màu tối #0f172a');
    assert.ok(formReq.text.includes('background: #ffffff;'), 'Card-panel phải có nền trắng #ffffff');
    assert.ok(!formReq.text.includes('background-color: #0f172a;'), 'Body không được chứa nền dark #0f172a');
    assert.ok(!formReq.text.includes('toggleTheme'), 'Không còn hàm toggleTheme chuyển dark mode');
    console.log('   ✓ Light mode cố định (#f8fafc nền, card trắng #ffffff, text tương phản cao).');

    // Xác minh Header chỉ có logo-full
    const headerHtml = formReq.text.match(/<header[\s\S]*?<\/header>/)?.[0] || '';
    assert.ok(headerHtml.includes('/images/logo-full.png'), 'Header phải chứa logo-full.png');
    assert.ok(!headerHtml.includes('1. Yêu Cầu (CPSR)'), 'Header không được có link "1. Yêu Cầu (CPSR)"');
    assert.ok(!headerHtml.includes('2. Phản Hồi (CPST)'), 'Header không được có link "2. Phản Hồi (CPST)"');
    assert.ok(!headerHtml.includes('3. Bàn Giao (CPSF)'), 'Header không được có link "3. Bàn Giao (CPSF)"');
    assert.ok(!headerHtml.includes('/control-panel'), 'Header không được có link /control-panel');
    assert.ok(!headerHtml.includes('<nav'), 'Header không được chứa thẻ điều hướng <nav>');
    console.log('   ✓ Header chỉ có duy nhất logo-full ở góc trái trên cùng, không có nav bar hay mục điều hướng CPSR/CPST/CPSF/Control Panel.');

    // 2. Kiểm tra các view liên quan: /technical-feedback và /confirm-request
    console.log('\n2. Kiểm tra GET /technical-feedback & /confirm-request:');
    const cpstReq = await fetchUrl('/technical-feedback');
    assert.strictEqual(cpstReq.status, 200);
    assert.ok(cpstReq.text.includes('background-color: #f8fafc;'), 'CPST phải đồng bộ light mode #f8fafc');
    assert.ok(cpstReq.text.includes('/images/logo-full.png'), 'CPST header có logo-full');
    assert.ok(!cpstReq.text.includes('1. Yêu Cầu (CPSR)'), 'CPST header không có nav link');

    const cpsfReq = await fetchUrl('/confirm-request');
    assert.strictEqual(cpsfReq.status, 200);
    assert.ok(cpsfReq.text.includes('background-color: #f8fafc;'), 'CPSF phải đồng bộ light mode #f8fafc');
    assert.ok(cpsfReq.text.includes('/images/logo-full.png'), 'CPSF header có logo-full');
    assert.ok(!cpsfReq.text.includes('1. Yêu Cầu (CPSR)'), 'CPSF header không có nav link');
    console.log('   ✓ Cả CPST và CPSF đã đồng bộ chuẩn Light mode và logo header.');

    // 3. Kiểm tra chức năng gửi phiếu CPSR (form submission)
    console.log('\n3. Kiểm tra chức năng gửi phiếu (API /api/cpsr):');
    const nextCodeRes = await fetchUrl('/api/cpsr/next-code');
    assert.strictEqual(nextCodeRes.status, 200);
    const nextCodeData = JSON.parse(nextCodeRes.text);
    console.log(`   Mã phiếu dự kiến tiếp theo: ${nextCodeData.docNo}`);

    const newTicket = {
      reqDate: '2026-10-05',
      reqTime: '14:30',
      reqBy: 'QA Test - Kiểm thử Light Mode',
      printTech: 'OFFSET',
      machineName: 'SM 52',
      problem: 'Kiểm thử gửi phiếu sau khi chuyển giao diện Light Mode',
      machineStatus: 'Hàng SX lần đầu',
      priority: 'Hỗ trợ ngay',
      submittedAt: new Date().toISOString()
    };

    const submitRes = await postJson('/api/cpsr', newTicket);
    assert.strictEqual(submitRes.status, 201, 'Tạo phiếu CPSR phải trả về 201 Created');
    assert.ok(submitRes.data.docNo.startsWith('CPSR-'), 'Mã phiếu phải có tiền tố CPSR-');
    console.log(`   ✓ Gửi phiếu thành công: docNo = ${submitRes.data.docNo}, id = ${submitRes.data.id}`);

    // Dọn dẹp bản ghi kiểm thử
    await new Promise((resolve) => {
      const delReq = http.request(`http://127.0.0.1:${port}/api/cpsr/${submitRes.data.id}`, { method: 'DELETE' }, () => resolve(true));
      delReq.on('error', () => resolve(false));
      delReq.end();
    });
    console.log('   ✓ Đã dọn dẹp bản ghi test an toàn.');

    console.log('\n🎉 TOÀN BỘ KIỂM THỬ XÁC MINH LIGHT MODE & HEADER ĐẠT 100%!');
  } finally {
    await app.close();
  }
}

verifyAll().catch(err => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
