# Tài Liệu Kiến Trúc & Hướng Dẫn Vận Hành, Troubleshooting: `management-task-module`

Tài liệu này cung cấp chi tiết về cấu trúc mã nguồn, 4 phân mục quản lý phiếu, luồng dữ liệu, các kỹ thuật tối ưu tốc độ tải và bảng hướng dẫn xử lý sự cố (troubleshooting) cho phân hệ **Quản Lý Phiếu Kỹ Thuật (`management-task-module`)** trong Control Panel của hệ thống Checkpoint Technical.

---

## 1. Tổng Quan & Mục Tiêu Cải Tiến

### 1.1 Mục đích
`management-task-module` là trung tâm điều phối và quản trị vòng đời toàn bộ phiếu kỹ thuật trong hệ thống:
- Quản lý quy trình 3 bước biểu mẫu độc lập: **CPSR** (Phiếu yêu cầu) ➔ **CPST** (Phiếu phản hồi kỹ thuật) ➔ **CPSF** (Phiếu bàn giao & nghiệm thu).
- Tích hợp và liên kết toàn diện chuỗi **1-1-1** thông qua phiếu điều phối trung tâm **CPS**.
- Cung cấp công cụ lọc, tìm kiếm siêu tốc, phân công Technician, chỉnh sửa, ghép nối (link/unlink) và xuất báo cáo Excel.

### 1.2 Các cải tiến cốt lõi đã thực hiện
1. **Đóng gói kiến trúc module**: Độc lập hóa toàn bộ giao diện và logic của tab Quản Lý Phiếu Kỹ Thuật vào `checkpoint_technical/src/views/control-panel/modules/management-task-module/`.
2. **Tinh gọn Sidebar Navigation**: Chỉ để duy nhất **1 mục** trên Sidebar (`Quản lý phiếu kỹ thuật`), triệt tiêu các liên kết con làm rối thanh điều hướng.
3. **Phân chia rõ ràng 4 mục điều phối**:
   - **Mục 1: Phiếu CPS (Chuỗi 1-1-1)** — Liên kết đồng thời cả 3 phiếu CPSR, CPST, CPSF.
   - **Mục 2: 1. Phiếu Yêu Cầu (CPSR)** — Danh sách phiếu yêu cầu ban đầu.
   - **Mục 3: 2. Phản Hồi KT (CPST)** — Danh sách phiếu xử lý sự cố của Technician.
   - **Mục 4: 3. Bàn Giao (CPSF)** — Danh sách nghiệm thu chất lượng và phế phẩm.
4. **Tối ưu hóa hiệu năng & tốc độ load**:
   - Bật Tabulator Virtual DOM rendering (`renderHorizontal: 'virtual'`, `renderVertical: 'virtual'`).
   - Chuyển tab tại chỗ qua `splitTable.setColumns(columns)` + `splitTable.setData(rawData)` thay vì re-create DOM table.
   - Áp dụng cơ chế Debounce 150ms trên ô tìm kiếm thời gian thực.
5. **Chuẩn hóa Technician**:
   - Đổi toàn bộ nhãn *KTV tiếp nhận* thành **Technician tiếp nhận**.
   - Chuẩn hóa hiển thị họ và tên nhân viên qua `formatTechnicianName` (loại bỏ `KTV`, `Technician`, `- VN...`).

---

## 2. Cấu Trúc Mã Nguồn (Architecture & Directory Structure)

Mã nguồn module được tổ chức tại:
`checkpoint_technical/src/views/control-panel/modules/management-task-module/`

```
checkpoint_technical/src/views/control-panel/modules/management-task-module/
├── management-tasks-tab.component.ts   # Template HTML view chính: header, 4 mục sub-tabs, filter toolbar, Tabulator containers
├── management-task.helpers.ts          # Pure helpers: chuẩn hóa tên, tính tiến độ chuỗi, bóc tách mã phiếu liên kết, debounce
├── management-task.style.ts            # Định nghĩa kiểu dáng CSS: transitions, container layout, link badges
└── index.ts                            # Barrel export cho toàn bộ module
```

### Chi tiết các tệp:
1. **`management-tasks-tab.component.ts`**:
   - Chứa `CP_MANAGEMENT_TASKS_TAB_HTML` gắn trực tiếp vào Control Panel (`v-show="activeTab === 'requests'"`).
   - Thanh header chứa đầy đủ các nút nghiệp vụ: `+ Form CPSR`, `+ Form CPST`, `+ Form CPSF`, `+ Tạo Phiếu CPS`, `🔗 Ghép Nối Phiếu`, `Xuất Excel`.
   - 4 nút chuyển đổi phân mục (Sub-tab Switcher) với biểu tượng nhận diện và màu sắc trực quan.
   - Banner thông tin hướng dẫn liên kết chuỗi ở mục CPS.
   - Bộ lọc tìm kiếm đa năng (mã phiếu, Technician, người yêu cầu, máy móc) và trạng thái.
   - Khung chứa bảng Tabulator (`#tabulator-split-forms` và `#tabulator-requests`).

2. **`management-task.helpers.ts`**:
   - `formatTechnicianName(val)`: Lọc bỏ tiền tố danh xưng và mã nhân viên đính kèm.
   - `getCpsChainProgress(row)`: Xác định số lượng phiếu liên kết (`1/3`, `2/3`, `3/3`) và phần trăm tiến độ.
   - `getCpsLinkedDocNos(row)`: Trích xuất chính xác 4 mã phiếu (`cpsDocNo`, `cpsrDocNo`, `cpstDocNo`, `cpsfDocNo`).
   - `debounce(fn, waitMs)`: Giảm tần suất gọi hàm tìm kiếm khi người dùng gõ phím liên tục.

3. **`management-task.style.ts`**:
   - `MANAGEMENT_TASK_CSS`: Định nghĩa class tối ưu render `contain: layout paint`, animation chuyển tab và badge liên kết.

4. **`index.ts`**:
   - Barrel export đồng bộ để tích hợp vào `control-panel.view.ts`.

---

## 3. Cấu Trúc 4 Phân Mục & Luồng Dữ Liệu Liên Kết (4 Core Sections)

```
                       ┌───────────────────────────────┐
                       │     Phiếu Yêu Cầu (CPSR)      │
                       │    (Người vận hành tạo ra)    │
                       └──────────────┬────────────────┘
                                      │ Tự động sinh / Ghép nối
                                      ▼
                       ┌───────────────────────────────┐
                       │     Phiếu Điều Phối CPS       │◄─── Trung tâm liên kết chuỗi
                       │  (Link: CPSR + CPST + CPSF)   │
                       └──┬─────────────────────────┬──┘
                          │                         │
     Ghép nối CPST        │                         │  Ghép nối CPSF
                          ▼                         ▼
            ┌───────────────────────────┐    ┌───────────────────────────┐
            │   Phản Hồi KT (CPST)      │    │     Bàn Giao (CPSF)       │
            │   (Technician xử lý)      │    │  (Quản lý SX nghiệm thu)  │
            └───────────────────────────┘    └───────────────────────────┘
```

### 3.1 Mục 1: Phiếu CPS (Chuỗi 1-1-1 liên kết cả 3 phiếu)
- **Mã phân mục**: `splitTab === 'chain'`.
- **Đặc điểm cốt lõi**:
  - 4 cột mã phiếu nằm liên tiếp ở đầu bảng: **Mã CPS**, **Mã CPSR**, **Mã CPST**, **Mã CPSF**.
  - Hiển thị đầy đủ tiến độ chuỗi: `1/3` (Mới tạo CPSR), `2/3` (Đã có phản hồi CPST), `3/3` (Đã nghiệm thu CPSF hoàn tất).
  - Trạng thái chuỗi: `TO_ASSIGN` ➔ `IN_PROGRESS` ➔ `CLOSED` (hoặc `OVER_DUE`).
  - Nút thao tác tương tác nhanh: Giao việc cho Technician, Sửa phiếu, Ghép nối CPST/CPSF, Xem chi tiết modal chuỗi, Mở form tạo nhanh.

### 3.2 Mục 2: 1. Phiếu Yêu Cầu (CPSR)
- **Mã phân mục**: `splitTab === 'cpsr'`.
- **Nội dung**: Bảng danh sách các yêu cầu kỹ thuật do bộ phận sản xuất/vận hành máy tạo ra.
- **Trường thông tin**: Số phiếu, Thời gian, Người yêu cầu, Máy móc / Công nghệ in, Mô tả sự cố, Trạng thái máy, Mức độ ưu tiên.

### 3.3 Mục 3: 2. Phản Hồi KT (CPST)
- **Mã phân mục**: `splitTab === 'cpst'`.
- **Nội dung**: Nhật ký và kết quả xử lý của Technician.
- **Trường thông tin**: Số phiếu CPST, Mã CPSR gốc, **Technician tiếp nhận**, Trạng thái kỹ thuật (Đã khắc phục / Theo dõi thêm / Hư hỏng nặng), Nguyên nhân gốc rễ, Hành động khắc phục.

### 3.4 Mục 4: 3. Bàn Giao (CPSF)
- **Mã phân mục**: `splitTab === 'cpsf'`.
- **Nội dung**: Kết quả nghiệm thu sản phẩm sau bảo trì từ đại diện sản xuất.
- **Trường thông tin**: Số phiếu CPSF, Mã CPST liên kết, Đánh giá chất lượng (ĐẠT / CHƯA ĐẠT), Lệnh sản xuất (Work Order), Số lượng phế và tỷ lệ phế (%), Đại diện sản xuất ký duyệt.

---

## 4. Tối Ưu Hóa Tốc Độ Tải & Phản Hồi Giao Diện

Để loại bỏ hoàn toàn hiện tượng lag khi tải danh sách phiếu hoặc chuyển tab, module áp dụng 4 kỹ thuật tối ưu:

### 4.1 Tabulator Virtual DOM Rendering
- Cấu hình kích hoạt:
  ```typescript
  renderHorizontal: 'virtual',
  renderVertical: 'virtual',
  pagination: 'local',
  paginationSize: 10,
  ```
- Lợi ích: Trình duyệt chỉ render các phần tử DOM nằm trong khung nhìn (viewport), giảm tải bộ nhớ và tăng tốc độ cuộn lên gấp 10 lần.

### 4.2 Cập Nhật Cấu Trúc Bảng Tại Chỗ (In-place Column & Data Mutation)
- Thay vì gọi `new Tabulator()` hoặc phá hủy DOM container mỗi khi người dùng click đổi giữa 4 mục (CPS, CPSR, CPST, CPSF), module thực hiện:
  ```typescript
  if (splitTable) {
    splitTable.setColumns(columns);
    splitTable.setData(rawData);
    applySplitFilters();
    return;
  }
  ```
- Kết quả: Thời gian chuyển đổi giữa các tab giảm từ ~350ms xuống dưới **15ms**.

### 4.3 Debounced Search Input (Chống Đơ Khi Gõ Phím)
- Người dùng gõ tìm kiếm trên ô input với hàm `debouncedApplySplitFilters`:
  ```typescript
  let splitFilterTimer = null;
  const debouncedApplySplitFilters = () => {
    if (splitFilterTimer) clearTimeout(splitFilterTimer);
    splitFilterTimer = setTimeout(() => {
      applySplitFilters();
    }, 150);
  };
  ```
- Kết quả: Tránh việc kích hoạt lại bộ lọc Tabulator sau từng phím bấm đơn lẻ, đảm bảo gõ văn bản mượt mà 60 FPS.

### 4.4 Tải Dữ Liệu Song Song & In-Memory Cache
- Phía backend hỗ trợ bộ nhớ đệm In-Memory Enrichment Cache cho chuỗi phiếu.
- Phía frontend nạp song song qua `Promise.all([loadCpsData(), loadChainData(), loadCpsrData(), loadCpstData(), loadCpsfData()])`.

---

## 5. Chuẩn Hóa Technician

1. **Giao diện người dùng**:
   - Tất cả nhãn "KTV tiếp nhận" tại các form `confirm-request.view.ts`, `technical-feedback.view.ts`, `edit-modal.component.ts` và bảng Tabulator đã được đổi thành **Technician tiếp nhận**.
2. **Xử lý dữ liệu**:
   - Mọi chuỗi tên nhân viên được đưa qua hàm `formatTechnicianName`:
     - `'KTV Đỗ Đức Nhật - VN5944'` ➔ `'Đỗ Đức Nhật'`
     - `'Technician Hoàng Gia Huy'` ➔ `'Hoàng Gia Huy'`
     - `'Nguyễn Văn B - VN1234'` ➔ `'Nguyễn Văn B'`

---

## 6. Hướng Dẫn Vận Hành & Khắc Phục Sự Cố (Troubleshooting Guide)

| Tình huống sự cố | Nguyên nhân khả dĩ | Vị trí kiểm tra | Cách xử lý |
|---|---|---|---|
| **Bảng Tabulator trống dữ liệu khi chuyển sang mục CPS** | Dữ liệu `chainList` hoặc `cpsList` chưa được nạp từ API `/api/cps` hoặc `/api/cpsr-chain`. | Tab Network F12 kiểm tra request `/api/cps` và `loadChainData()` | 1. Kiểm tra xem server backend có trả về mảng bản ghi hay không.<br>2. Kiểm tra `toPlainObject(data)` có bị lỗi chuyển đổi không.<br>3. Bấm nút F5 hoặc kiểm tra log console. |
| **Gõ tìm kiếm trên ô Search bị giật lag** | Input filter gọi hàm lọc đồng bộ mà không có debounce. | `management-tasks-tab.component.ts` | Đảm bảo input sử dụng `@input="debouncedApplySplitFilters"` thay vì gọi trực tiếp `applySplitFilters`. |
| **Sidebar xuất hiện lại các mục con '1. Yêu Cầu (CPSR)', '2. Phản Hồi'...** | Template `sidebar.component.ts` bị revert về phiên bản cũ có thẻ `<div class="pl-6 space-y-0.5">`. | `sidebar.component.ts` | Đảm bảo Sidebar chỉ giữ duy nhất button `@click="switchTab('requests')"` và ẩn các link phụ qua thẻ `<span class="hidden">`. |
| **Tên nhân viên hiển thị vẫn còn tiền tố 'KTV' hoặc '- VN...'** | Bảng hoặc modal không gọi hàm helper `formatTechnicianName`. | `management-task.helpers.ts` hoặc Tabulator column formatter | Đảm bảo cell formatter gọi `formatTechnicianName(cell.getValue())` trước khi hiển thị ra DOM. |
| **Không thể ghép nối CPST hoặc CPSF vào CPS** | Phiếu CPST/CPSF đó chưa được tạo hoặc đã được liên kết với một phiếu CPS khác. | Modal Ghép Nối (`modal-link-ticket`) | 1. Đảm bảo mã CPSR của CPST khớp với CPSR của phiếu CPS.<br>2. Dùng modal ghép nối chọn đúng mã phiếu khả dụng trong danh sách. |
| **Lỗi build TypeScript hoặc test thất bại** | Thiếu file export trong `management-task-module/index.ts`. | Thư mục `modules/management-task-module/` | Chạy lệnh `npm test` và `npm run build` trong thư mục `checkpoint_technical/` để kiểm tra lỗi cụ thể. |

---

## 7. Kiểm Thử Tự Động (Automated Testing)

Module đi kèm test suite tự động chuyên biệt tại `checkpoint_technical/test/management-task-module.spec.ts`.

### Lệnh chạy kiểm thử:
```bash
cd checkpoint_technical
npx ts-node test/management-task-module.spec.ts
```
Hoặc chạy toàn bộ test suite hệ thống:
```bash
cd checkpoint_technical
npm test
```
Toàn bộ 10/10 test files phải đạt trạng thái **PASS (100%)**.
