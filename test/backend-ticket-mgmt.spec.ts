import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { DatabaseModule } from '../src/modules/database/database.module';
import { SplitFormsModule } from '../src/modules/split-forms/split-forms.module';
import { SplitFormsService } from '../src/modules/split-forms/split-forms.service';
import { DatabaseService } from '../src/modules/database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    DatabaseModule,
    SplitFormsModule,
  ],
})
class TestModule {}

async function runTests() {
  console.log('🚀 [TEST T2] Bắt đầu kiểm thử toàn diện API backend: CRUD phiếu, ghép nối CPS và ràng buộc tạo CPS...\n');

  const app = await NestFactory.create<NestExpressApplication>(TestModule, {
    bodyParser: false,
    logger: ['error', 'warn'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const testPort = 3399;
  await app.listen(testPort);
  const baseUrl = `http://127.0.0.1:${testPort}`;

  const splitService = app.get(SplitFormsService);
  const dbService = app.get(DatabaseService);

  console.log(`✅ Test server running on ${baseUrl}`);

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${msg}`);
      testPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      testFailed++;
      throw new Error(`Test assertion failed: ${msg}`);
    }
  }

  try {
    // =========================================================================
    // SECTION 1: RÀNG BUỘC NGHIỆP VỤ - CPS CHỈ ĐƯỢC TẠO KHI CÓ CPSR
    // =========================================================================
    console.log('\n--- 1. Kiểm thử ràng buộc nghiệp vụ: CPS chỉ được tạo khi có CPSR ---');

    // 1.1 Tạo CPS không có cpsrDocNo -> Phải trả về 400
    const resNoCpsr = await fetch(`${baseUrl}/api/cps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: 'Tạo CPS không có CPSR' }),
    });
    assert(resNoCpsr.status === 400, 'Tạo CPS không có cpsrDocNo bị từ chối với status 400');
    const errNoCpsr = await resNoCpsr.json();
    console.log('      Thông báo lỗi nhận được:', errNoCpsr.message);

    // 1.2 Tạo CPS với cpsrDocNo không tồn tại -> Phải trả về 400
    const resFakeCpsr = await fetch(`${baseUrl}/api/cps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpsrDocNo: 'CPSR-99999999-999', notes: 'CPSR ảo không tồn tại' }),
    });
    assert(resFakeCpsr.status === 400, 'Tạo CPS với cpsrDocNo không tồn tại bị từ chối với status 400');
    const errFakeCpsr = await resFakeCpsr.json();
    console.log('      Thông báo lỗi nhận được:', errFakeCpsr.message);

    // =========================================================================
    // SECTION 2: CRUD CPSR, CPST, CPSF
    // =========================================================================
    console.log('\n--- 2. Kiểm thử CRUD CPSR & Tự động sinh CPS kèm đồng bộ ---');

    // 2.1 Tạo CPSR hợp lệ
    const nextCpsrCode = await splitService.getNextCpsrDocNo();
    const cpsrDocNo = nextCpsrCode.docNo;
    const resCreateCpsr = await fetch(`${baseUrl}/api/cpsr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docNo: cpsrDocNo,
        reqDate: '2026-10-06',
        reqTime: '08:30',
        reqBy: 'Kỹ Sư Test - VN0001',
        printTech: 'OFFSET',
        machineName: 'SM 52',
        problem: 'Lỗi kẹt giấy tại bộ phận nạp',
        priority: 'Hỗ trợ ngay',
      }),
    });
    assert(resCreateCpsr.status === 201 || resCreateCpsr.status === 200, `Tạo phiếu CPSR ${cpsrDocNo} thành công`);
    const createdCpsr = await resCreateCpsr.json();
    assert(createdCpsr.docNo === cpsrDocNo, `Mã CPSR tạo ra khớp ${cpsrDocNo}`);

    // Kiểm tra CPS tự động tạo tương ứng
    const autoCps = dbService.getCpsByCpsrDocNo(cpsrDocNo);
    assert(!!autoCps, `CPS tự động được tạo và liên kết với ${cpsrDocNo}`);
    assert(autoCps!.status === 'TO_ASSIGN', `Trạng thái ban đầu của CPS là TO_ASSIGN`);
    assert(autoCps!.problem === 'Lỗi kẹt giấy tại bộ phận nạp', `Mô tả sự cố được sao chép vào CPS`);

    // 2.2 Thử tạo thêm một CPS khác trỏ vào cùng cpsrDocNo -> Phải từ chối vì đã có CPS liên kết
    const resDupCps = await fetch(`${baseUrl}/api/cps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpsrDocNo, notes: 'Thử tạo trùng CPS' }),
    });
    assert(resDupCps.status === 400, 'Tạo trùng CPS cho cùng 1 CPSR bị từ chối với status 400');
    const errDupCps = await resDupCps.json();
    console.log('      Thông báo lỗi trùng lặp:', errDupCps.message);

    // 2.3 Cập nhật CPSR bằng PUT và PATCH
    const resUpdatePutCpsr = await fetch(`${baseUrl}/api/cpsr/${cpsrDocNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem: 'Lỗi kẹt giấy và rách mép tờ in (PUT Updated)',
        priority: 'Khác',
      }),
    });
    assert(resUpdatePutCpsr.ok, `PUT cập nhật CPSR ${cpsrDocNo} thành công`);

    const resUpdatePatchCpsr = await fetch(`${baseUrl}/api/cpsr/${cpsrDocNo}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem: 'Lỗi kẹt giấy đã chỉnh sửa qua PATCH',
      }),
    });
    assert(resUpdatePatchCpsr.ok, `PATCH cập nhật CPSR ${cpsrDocNo} thành công`);

    // Kiểm tra CPS được đồng bộ theo CPSR
    const updatedCpsAfterCpsr = dbService.getCpsByCpsrDocNo(cpsrDocNo);
    assert(updatedCpsAfterCpsr?.problem === 'Lỗi kẹt giấy đã chỉnh sửa qua PATCH', 'CPS đã tự động đồng bộ sự cố từ CPSR');

    // =========================================================================
    // SECTION 3: CPST - TẠO, SỬA (PUT/PATCH), GHÉP NỐI & XÓA
    // =========================================================================
    console.log('\n--- 3. Kiểm thử CPST: Tạo, cập nhật (PUT/PATCH) và đồng bộ CPS ---');

    const nextCpstCode = await splitService.getNextCpstDocNo();
    const cpstDocNo = nextCpstCode.docNo;
    const resCreateCpst = await fetch(`${baseUrl}/api/cpst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docNo: cpstDocNo,
        cpsrDocNo,
        recvBy: 'KTV Trần Văn B - KT02',
        recvDate: '2026-10-06',
        recvTime: '08:45',
        finishDate: '2026-10-06',
        finishTime: '09:30',
        downtime: 45,
        rootCause: 'Bụi giấy làm tắc mắt đọc cảm biến',
        actionTaken: 'Thổi bụi và vệ sinh cảm biến nạp giấy',
        chkStatus: 'Đã khắc phục',
      }),
    });
    assert(resCreateCpst.ok, `Tạo phiếu CPST ${cpstDocNo} thành công`);

    // Kiểm tra CPS tự động cập nhật CPST
    let cpsAfterCpst = dbService.getCpsByCpsrDocNo(cpsrDocNo);
    assert(cpsAfterCpst?.cpstDocNo === cpstDocNo, 'CPS đã liên kết với CPST');
    assert(cpsAfterCpst?.downtime === 45, 'CPS cập nhật downtime = 45 phút');
    assert(cpsAfterCpst?.status === 'IN_PROGRESS', 'CPS chuyển sang trạng thái IN_PROGRESS');

    // Thử cập nhật CPST qua PATCH
    const resPatchCpst = await fetch(`${baseUrl}/api/cpst/${cpstDocNo}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        downtime: 60,
        chkStatus: 'Theo dõi thêm',
      }),
    });
    assert(resPatchCpst.ok, `PATCH cập nhật CPST ${cpstDocNo} thành công`);
    cpsAfterCpst = dbService.getCpsByCpsrDocNo(cpsrDocNo);
    assert(cpsAfterCpst?.downtime === 60, 'CPS đã đồng bộ downtime mới = 60');
    assert(cpsAfterCpst?.chkStatus === 'Theo dõi thêm', 'CPS đã đồng bộ chkStatus mới');

    // =========================================================================
    // SECTION 4: CPSF - TẠO, SỬA (PUT/PATCH), GHÉP NỐI & ĐÓNG PHIẾU CPS
    // =========================================================================
    console.log('\n--- 4. Kiểm thử CPSF: Tạo, cập nhật (PUT/PATCH), tính % phế & CLOSED CPS ---');

    const nextCpsfCode = await splitService.getNextCpsfDocNo();
    const cpsfDocNo = nextCpsfCode.docNo;
    const resCreateCpsf = await fetch(`${baseUrl}/api/cpsf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docNo: cpsfDocNo,
        cpstDocNo,
        chkQuality: 'Đạt',
        workOrder: 'WO-20261006-01',
        woTotalQty: 5000,
        wasteQty: 100,
        wasteUnit: 'Tờ in',
        prodMgr: 'Quản Đốc Lê Văn C',
      }),
    });
    assert(resCreateCpsf.ok, `Tạo phiếu CPSF ${cpsfDocNo} thành công`);

    // Kiểm tra CPS được cập nhật thành CLOSED
    let cpsAfterCpsf = dbService.getCpsByCpsrDocNo(cpsrDocNo);
    assert(cpsAfterCpsf?.cpsfDocNo === cpsfDocNo, 'CPS đã liên kết với CPSF');
    assert(cpsAfterCpsf?.status === 'CLOSED', 'CPS chuyển sang trạng thái CLOSED');
    assert(cpsAfterCpsf?.wastePercent === '2.00%', 'CPS tính đúng tỷ lệ phế: 2.00% (100 / 5000)');
    assert(!!cpsAfterCpsf?.closedAt, 'CPS có thời điểm closedAt');

    // Cập nhật CPSF qua PATCH (thay đổi số lượng phế)
    const resPatchCpsf = await fetch(`${baseUrl}/api/cpsf/${cpsfDocNo}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wasteQty: 250,
      }),
    });
    assert(resPatchCpsf.ok, `PATCH cập nhật CPSF ${cpsfDocNo} thành công`);
    cpsAfterCpsf = dbService.getCpsByCpsrDocNo(cpsrDocNo);
    assert(cpsAfterCpsf?.wasteQty === 250, 'CPS đã cập nhật số lượng phế = 250');
    assert(cpsAfterCpsf?.wastePercent === '5.00%', 'CPS tính lại đúng tỷ lệ phế: 5.00% (250 / 5000)');

    // =========================================================================
    // SECTION 5: GHÉP NỐI & HỦY GHÉP NỐI (LINK & UNLINK API)
    // =========================================================================
    console.log('\n--- 5. Kiểm thử API ghép nối (Link) & Hủy ghép nối (Unlink) CPS ---');

    // 5.1 Test hủy ghép nối CPSF khỏi CPS
    const resUnlinkCpsf = await fetch(`${baseUrl}/api/cps/${cpsAfterCpsf!.docNo}/unlink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unlinkCpsf: true }),
    });
    assert(resUnlinkCpsf.ok, `Hủy ghép nối CPSF khỏi CPS ${cpsAfterCpsf!.docNo} thành công`);
    let cpsUnlinked = await resUnlinkCpsf.json();
    assert(cpsUnlinked.cpsfDocNo === null, 'cpsfDocNo đã được xóa về null');
    assert(cpsUnlinked.status === 'IN_PROGRESS', 'Trạng thái CPS mở lại thành IN_PROGRESS');

    // 5.2 Test ghép nối lại CPSF qua endpoint /api/cps/:idOrDocNo/link
    const resRelinkCpsf = await fetch(`${baseUrl}/api/cps/${cpsAfterCpsf!.docNo}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpsfDocNo }),
    });
    assert(resRelinkCpsf.ok, `Ghép nối lại CPSF ${cpsfDocNo} vào CPS thành công`);
    let cpsRelinked = await resRelinkCpsf.json();
    assert(cpsRelinked.cpsfDocNo === cpsfDocNo, 'CPS đã được ghép nối lại với CPSF');
    assert(cpsRelinked.status === 'CLOSED', 'CPS quay lại trạng thái CLOSED sau khi ghép nối CPSF');

    // 5.3 Test ghép nối qua endpoint chung /api/cps/link
    const resGeneralLink = await fetch(`${baseUrl}/api/cps/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpsDocNo: cpsAfterCpsf!.docNo,
        cpstDocNo,
        cpsfDocNo,
      }),
    });
    assert(resGeneralLink.ok, 'Endpoint chung POST /api/cps/link ghép nối thành công');

    // 5.4 Test ghép nối với CPST/CPSF không tồn tại -> Báo lỗi 400
    const resInvalidLink = await fetch(`${baseUrl}/api/cps/${cpsAfterCpsf!.docNo}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpstDocNo: 'CPST-NON-EXISTENT' }),
    });
    assert(resInvalidLink.status === 400, 'Ghép nối với mã CPST không tồn tại bị từ chối với status 400');

    // =========================================================================
    // SECTION 6: CHỈNH SỬA & XÓA PHIẾU CPS (CRUD CPS)
    // =========================================================================
    console.log('\n--- 6. Kiểm thử chỉnh sửa & xóa phiếu CPS ---');

    // 6.1 Chỉnh sửa CPS qua PUT
    const resPutCps = await fetch(`${baseUrl}/api/cps/${cpsAfterCpsf!.docNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priority: 'Khác',
        notes: 'Ghi chú kỹ thuật đã được cập nhật qua PUT',
        assignedTo: 'KTV Lê Văn Thử Nghiệm',
      }),
    });
    assert(resPutCps.ok, `PUT cập nhật CPS ${cpsAfterCpsf!.docNo} thành công`);
    const updatedCpsData = await resPutCps.json();
    assert(updatedCpsData.priority === 'Khác', 'Đã cập nhật priority');
    assert(updatedCpsData.notes === 'Ghi chú kỹ thuật đã được cập nhật qua PUT', 'Đã cập nhật notes');

    // 6.2 Xóa CPS qua DELETE /api/cps/:idOrDocNo
    const resDeleteCps = await fetch(`${baseUrl}/api/cps/${cpsAfterCpsf!.docNo}`, {
      method: 'DELETE',
    });
    assert(resDeleteCps.ok, `DELETE xóa CPS ${cpsAfterCpsf!.docNo} thành công`);
    const delCpsResult = await resDeleteCps.json();
    assert(delCpsResult.success === true, 'Kết quả trả về success: true');

    // Kiểm tra lại trong DB: CPS không còn tồn tại
    const findDeletedCps = dbService.getCpsByIdOrDocNo(cpsAfterCpsf!.docNo);
    assert(!findDeletedCps, 'CPS đã bị xóa hoàn toàn khỏi DB');

    // =========================================================================
    // SECTION 7: TẠO CPS MỚI QUA POST /api/cps BẰNG CÁCH CHỈ ĐỊNH CPSR
    // =========================================================================
    console.log('\n--- 7. Kiểm thử tạo CPS mới qua POST /api/cps với CPSR vừa bị xóa CPS ---');

    // Do CPS cũ đã bị xóa, CPSR vẫn còn đó, ta có thể tạo lại một CPS mới gắn với CPSR này!
    const nextCpsCode = await splitService.getNextCpsDocNo();
    const newCpsDocNo = nextCpsCode.docNo;
    const resCreateNewCps = await fetch(`${baseUrl}/api/cps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docNo: newCpsDocNo,
        cpsrDocNo,
        assignedTo: 'KTV Hoàng Văn Mới - KT99',
        priority: 'Hỗ trợ ngay',
        notes: 'CPS tạo lại chủ động sau khi xóa',
      }),
    });
    assert(resCreateNewCps.ok, `Tạo phiếu CPS mới ${newCpsDocNo} thành công với cpsrDocNo=${cpsrDocNo}`);
    const newCpsRecord = await resCreateNewCps.json();
    assert(newCpsRecord.docNo === newCpsDocNo, `Mã CPS khớp ${newCpsDocNo}`);
    assert(newCpsRecord.cpsrDocNo === cpsrDocNo, `Đã gắn chính xác với CPSR ${cpsrDocNo}`);
    assert(newCpsRecord.status === 'IN_PROGRESS', 'Có KTV phân công nên status là IN_PROGRESS');

    // =========================================================================
    // SECTION 8: XÓA CPSF, CPST, CPSR
    // =========================================================================
    console.log('\n--- 8. Kiểm thử xóa CPSF, CPST, CPSR (DELETE endpoints) ---');

    // 8.1 Xóa CPSF
    const resDelCpsf = await fetch(`${baseUrl}/api/cpsf/${cpsfDocNo}`, { method: 'DELETE' });
    assert(resDelCpsf.ok, `DELETE phiếu CPSF ${cpsfDocNo} thành công`);
    assert(!dbService.getCpsfByIdOrDocNo(cpsfDocNo), 'CPSF đã bị xóa khỏi DB');

    // 8.2 Xóa CPST
    const resDelCpst = await fetch(`${baseUrl}/api/cpst/${cpstDocNo}`, { method: 'DELETE' });
    assert(resDelCpst.ok, `DELETE phiếu CPST ${cpstDocNo} thành công`);
    assert(!dbService.getCpstByIdOrDocNo(cpstDocNo), 'CPST đã bị xóa khỏi DB');

    // 8.3 Xóa CPSR
    const resDelCpsr = await fetch(`${baseUrl}/api/cpsr/${cpsrDocNo}`, { method: 'DELETE' });
    assert(resDelCpsr.ok, `DELETE phiếu CPSR ${cpsrDocNo} thành công`);
    assert(!dbService.getCpsrByIdOrDocNo(cpsrDocNo), 'CPSR đã bị xóa khỏi DB');

    console.log(`\n🎉 TẤT CẢ ${testPassed} KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC! (0 lỗi)\n`);
  } catch (err: any) {
    console.error('\n❌ GẶP LỖI TRONG QUÁ TRÌNH KIỂM THỬ:', err.message);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

runTests();
