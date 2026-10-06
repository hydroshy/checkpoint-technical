export const DASHBOARD_PDF_TEMPLATE_HTML = `    <!-- HIDDEN A4 PDF TEMPLATE -->
    <div id="pdf-template">
      <div id="pdf-render-area" class="pdf-page">
        <div class="pdf-border">
          <!-- Header -->
          <div class="pdf-header">
            <div class="pdf-meta">
              <div>Mã hiệu: BM-KT-04</div>
              <div>Lần ban hành: 01</div>
              <div>Ngày ban hành: 01/01/2026</div>
              <div>Trang: 1/1</div>
            </div>
            <div class="pdf-title-box">
              <div class="pdf-title">PHIẾU YÊU CẦU HỖ TRỢ KỸ THUẬT</div>
              <div class="pdf-subtitle">TECHNICAL SUPPORT / REPAIR REQUEST</div>
            </div>
          </div>

          <!-- Section 1 -->
          <div class="pdf-section-title" style="background-color: #dbeafe;">
            <span>1. Thông Tin Yêu Cầu Sửa Chữa (Requester)</span>
            <span style="font-weight: normal; font-size: 10px;">Số tài liệu / Doc No: <strong id="pdf_doc_no">{{ form.docNo }}</strong></span>
          </div>
          <div class="pdf-row">
            <div class="pdf-field"><span class="pdf-label">Ngày (Date):</span><div class="pdf-value" id="pdf_req_date">{{ formatDisplayDate(form.reqDate) }}</div></div>
            <div class="pdf-field ml-4"><span class="pdf-label">Giờ (Time):</span><div class="pdf-value w-16 text-center" id="pdf_req_time">{{ form.reqTime }}</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Người yêu cầu (Requested By):</span><div class="pdf-value flex-1" id="pdf_req_by">{{ form.reqBy }}</div></div>
            <div class="pdf-field ml-auto gap-4 items-center mb-1">
              <div class="flex items-center gap-1.5"><div class="pdf-checkbox" :class="{ checked: form.machineStatus === 'First Bulk Print' }"></div> <span class="text-[10px]">Hàng SX lần đầu</span></div>
              <div class="flex items-center gap-1.5"><div class="pdf-checkbox" :class="{ checked: form.machineStatus === 'Repeat Print' }"></div> <span class="text-[10px]">Hàng SX nhiều lần</span></div>
            </div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Công Nghệ / Tên máy (Tech/Machine):</span><div class="pdf-value flex-1" id="pdf_machine">[{{ form.printTech || '—' }}] {{ form.machineName || '—' }}</div></div>
            <div class="pdf-field ml-auto gap-3 items-center mb-1">
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Immediate' }"></div> <span class="text-[10px] text-red-600 font-bold">Hỗ trợ ngay</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Hold' }"></div> <span class="text-[10px] text-amber-600 font-bold">Chạy tạm</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.priority === 'Other' }"></div> <span class="text-[10px] text-blue-600 font-bold">Khác: </span><div class="pdf-value min-w-[50px] inline-block">{{ form.priority === 'Other' ? form.priorityOther : '' }}</div></div>
            </div>
          </div>
          <div class="pdf-row border-b-0 pb-1">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Mô tả sự cố (Problem):</span><div class="pdf-value flex-1" id="pdf_prob">{{ form.problem }}</div></div>
          </div>

          <!-- Section 2 -->
          <div class="pdf-section-title" style="background-color: #dcfce7;">
            <span>2. Thông Tin Xử Lý Của Kỹ Thuật (Technical Section)</span>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Người nhận (Receive By):</span><div class="pdf-value flex-1" id="pdf_recv_by">{{ form.recvBy }}</div></div>
            <div class="pdf-field ml-4"><span class="pdf-label">Downtime:</span><div class="pdf-value w-16 text-center font-bold text-red-600" id="pdf_downtime">{{ form.downtime || 0 }}</div><span class="text-[9px]">phút</span></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field flex-1"><span class="pdf-label">Nhận:</span><div class="pdf-value flex-1 text-center" id="pdf_recv_time_full">{{ form.recvTime }} ({{ formatShortDate(form.recvDate) }})</div></div>
            <div class="pdf-field flex-1 ml-4"><span class="pdf-label">Hoàn Thành:</span><div class="pdf-value flex-1 text-center" id="pdf_fin_time_full">{{ form.finishTime }} ({{ formatShortDate(form.finishDate) }})</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Nguyên nhân (Root Cause):</span><div class="pdf-value flex-1" id="pdf_rc">{{ form.rootCause }}</div></div>
          </div>
          <div class="pdf-row">
            <div class="pdf-field w-full items-start"><span class="pdf-label pt-1">Nội dung xử lý (Action Taken):</span><div class="pdf-value flex-1" id="pdf_act">{{ form.actionTaken }}</div></div>
          </div>
          <div class="pdf-row border-b-0 pb-1 flex justify-between bg-slate-50">
            <div class="flex gap-4 items-center">
              <div class="font-bold text-[10px] mr-2">PHÂN LOẠI LỖI:</div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MAN' }"></div> <span class="text-[10px]">MAN</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MACHINE' }"></div> <span class="text-[10px]">MACHINE</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'MATERIAL' }"></div> <span class="text-[10px]">MATERIAL</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errCat === 'METHOD' }"></div> <span class="text-[10px]">METHOD</span></div>
            </div>
            <div class="flex gap-4 items-center border-l-2 pl-4 border-slate-300">
              <div class="font-bold text-[10px] mr-2">NHÓM:</div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'Prepress' }"></div> <span class="text-[10px]">Trước in</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'Press' }"></div> <span class="text-[10px]">In</span></div>
              <div class="flex items-center gap-1"><div class="pdf-checkbox" :class="{ checked: form.errType === 'PostPress' }"></div> <span class="text-[10px]">GC sau in</span></div>
            </div>
          </div>

          <!-- Section 3 & 4 -->
          <div class="pdf-section-title" style="background-color: #f3f4f6;">
            <span>3. Xác Nhận Bàn Giao</span>
          </div>
          <div class="pdf-row justify-between bg-slate-50 min-h-[40px]">
            <div class="flex items-center gap-3">
              <span class="pdf-label font-bold">Chất lượng in sau xử lý:</span>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkQuality === 'OK' }"></div> <span class="text-[10px]">Đạt chuẩn</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkQuality === 'NG' }"></div> <span class="text-[10px]">Chưa đạt</span></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="pdf-label font-bold">Tình trạng sự cố:</span>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'DONE' }"></div> <span class="text-[10px]">Đã khắc phục</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'MONITOR' }"></div> <span class="text-[10px]">Đang theo dõi</span></div>
              <div class="flex items-center gap-1"><div class="pdf-radio" :class="{ checked: form.chkStatus === 'SUPPORT' }"></div> <span class="text-[10px]">Cần hỗ trợ</span></div>
            </div>
          </div>

          <div class="pdf-row bg-slate-50 min-h-[30px] border-t-0 text-[10px] gap-2 flex-nowrap overflow-hidden">
            <div class="pdf-field flex-[1.5]"><span class="pdf-label font-bold">Work Order:</span><div class="pdf-value flex-1">{{ form.workOrder }}</div></div>
            <div class="pdf-field flex-1"><span class="pdf-label font-bold">Total Qty:</span><div class="pdf-value flex-1 text-center">{{ form.woTotalQty }}</div></div>
            <div class="pdf-field flex-1"><span class="pdf-label font-bold">Waste:</span><div class="pdf-value flex-1 text-center">{{ form.wasteQty }}</div></div>
            <div class="pdf-field flex-[0.8] min-w-[50px]"><span class="pdf-label font-bold">Đơn vị:</span><div class="pdf-value flex-1 text-center">{{ form.wasteUnit }}</div></div>
            <div class="pdf-field flex-[0.8] min-w-[50px]"><span class="pdf-label font-bold">% Waste:</span><div class="pdf-value flex-1 text-center">{{ form.wastePercent }}</div></div>
          </div>

          <!-- Signatures -->
          <div class="pdf-signature-box flex-1">
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">SẢN XUẤT YÊU CẦU</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.reqBy || '').split('-')[0] }}</div>
            </div>
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">KỸ THUẬT THỰC HIỆN</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.recvBy || '').split('-')[0] }}</div>
            </div>
            <div class="pdf-signature-col">
              <div class="text-[10px] font-bold">SẢN XUẤT NHẬN BÀN GIAO</div>
              <div class="text-[9px] text-gray-500">(Ký & ghi rõ họ tên)</div>
              <div class="pdf-signature-line mt-4"></div>
              <div class="font-bold text-[11px]">{{ (form.prodMgr || '').split('-')[0] }}</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="pdf-footer">
            <span>Doc No: {{ form.docNo }}</span>
            <span>Hệ thống Quản lý Yêu cầu Kỹ thuật Checkpoint Systems</span>
            <span>Page 1/1</span>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         NEW MODALS FOR WEEKLY DASHBOARD CRUD
         ========================================================================= -->`;
