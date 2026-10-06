# Tài Liệu Kiến Trúc & Hướng Dẫn Vận Hành, Troubleshooting: `assign-task-module`

Tài liệu này cung cấp chi tiết về cấu trúc mã nguồn, luồng dữ liệu, hướng dẫn vận hành và các bước xử lý sự cố (troubleshooting) cho phân hệ **Phân Công Kỹ Thuật (`assign-task-module`)** trong Control Panel của hệ thống Checkpoint Technical.

---

## 1. Tổng Quan & Mục Tiêu

### 1.1 Mục đích
`assign-task-module` là phân hệ phục vụ trưởng nhóm kỹ thuật, điều phối viên hoặc quản lý bảo trì trong việc:
- Giám sát trạng thái toàn bộ yêu cầu kỹ thuật / phiếu bảo trì (CPS Ticket).
- Phân công kỹ thuật viên phụ trách (Technician) với thời hạn dự kiến và ghi chú chỉ đạo.
- Tái phân công / đổi kỹ thuật viên khi công việc quá hạn hoặc cần điều chuyển nhân sự.

### 1.2 Yêu cầu tinh gọn & chuẩn hóa UI/UX
- **Light & Dark Mode**: Tự động tương thích và hiển thị độ tương phản cao ở cả 2 chế độ sáng/tối. Triệt tiêu hoàn toàn lỗi chìm chữ trắng trên nền sáng.
- **Chuẩn hóa danh xưng & Tên nhân viên**:
  - Nhãn hiển thị quy chuẩn là **Technician** (thay cho cách gọi cũ KTV).
  - Tên nhân viên được chuẩn hóa hiển thị sạch: chỉ hiển thị họ và tên (ví dụ `Đỗ Đức Nhật`), tự động loại bỏ tiền tố `KTV`, `Technician` và hậu tố mã nhân viên `- VN...`.
- **Giao diện tinh gọn**:
  - Bỏ các nút bấm không cần thiết: nút *Làm mới* và *Xem Dạng Bảng (Tabulator)*.
  - Bỏ chú thích tiếng Anh thừa `(Assign Task)` và các đoạn mô tả dài dòng không cần thiết ở tiêu đề.

---

## 2. Cấu Trúc Mã Nguồn (Architecture & Directory Structure)

Mã nguồn được đóng gói độc lập theo cấu trúc module tại:
`checkpoint_technical/src/views/control-panel/modules/assign-task-module/`

```
checkpoint_technical/src/views/control-panel/modules/assign-task-module/
├── assign-tasks-tab.component.ts   # Template HTML chính: Grid Card hiển thị danh sách CPS, thanh KPI & bộ lọc
├── assign-modal.component.ts       # Template HTML Modal popup phân công / tái phân công Technician
├── assign-task.style.ts            # Định nghĩa các CSS class, transition, glassmorphism dành riêng cho module
├── assign-task.helpers.ts          # Các hàm tiện ích thuần (pure helpers) xử lý logic hiển thị
└── index.ts                        # Barrel export các component, style và helper
```

### Chi tiết các tệp:
1. **`assign-tasks-tab.component.ts`**:
   - `CP_ASSIGN_TASKS_TAB_HTML`: Đoạn HTML template cho tab `assign-tasks`.
   - Chứa 5 KPI Status Card: *Tất Cả CPS*, *Chờ Phân Công (TO_ASSIGN)*, *Đang Xử Lý (IN_PROGRESS)*, *Quá Hạn (OVER_DUE)*, *Đã Đóng (CLOSED)*.
   - Toolbar tìm kiếm thời gian thực (Search text, Status filter dropdown).
   - Danh sách thẻ task CPS dạng lưới (Card Grid) với thông tin: Mã CPS, Tên máy, Line/Location, Loại bảo trì, Độ ưu tiên, Tên Technician, Thời gian dự kiến, Nút thao tác *Phân công ngay* / *Đổi Technician*.
   - Thanh phân trang trực quan (Pagination bar).

2. **`assign-modal.component.ts`**:
   - `CP_ASSIGN_MODAL_HTML`: Đoạn HTML template cho modal popup khi click phân công.
   - Chứa dropdown danh sách Technician (hiển thị tên sạch qua `formatTechnicianName`), trường chọn `Thời gian bắt đầu dự kiến`, trường `Ghi chú chỉ đạo`, nút Hủy và nút Xác nhận.

3. **`assign-task.style.ts`**:
   - `ASSIGN_TASK_CSS`: Định nghĩa kiểu dáng card, animations, responsive grid và status accents.

4. **`assign-task.helpers.ts`**:
   - `formatTechnicianName(val?: string | null): string`: Chuẩn hóa tên nhân viên, cắt bỏ `KTV`/`Technician` và phần ` - VN...`.
   - `getTechnicianDisplayName(item: any): string`: Truy xuất tên Technician từ object CPS thông qua `assignedToName`, `assignedTo`, `assignee`.
   - `getCardBorderClass(status?: string | null): string`: Xác định viền màu thẻ theo trạng thái cho cả Light & Dark mode.

5. **`index.ts`**:
   - Export thống nhất toàn bộ module để tích hợp vào `control-panel.view.ts`.

---

## 3. Luồng Dữ Liệu (Data Flow)

```
[ Backend REST API / Database ]
        │
        ├──> GET /api/v1/cps ─────────────> cpsList (Vue Reactive State)
        └──> GET /api/v1/users/technicians ─> technicians (Vue Reactive State)
                                                    │
                                                    ▼
                                  [ Filter & Search Pipeline ]
                                  (assignCardSearch, assignCardStatus)
                                                    │
                                                    ▼
                                  [ assignCardsFiltered Pagination ]
                                                    │
                                                    ▼
                                  [ Render Cards: assign-tasks-tab ]
                                  (Hiển thị getTechnicianDisplayName)
                                                    │
                                      (User click Phân công)
                                                    │
                                                    ▼
                                  [ Open Modal: assign-modal ]
                                  (Select Technician, Thời gian, Note)
                                                    │
                                      (User click Xác nhận)
                                                    │
                                                    ▼
                                  [ submitAssignTask() ]
                                  (Chuẩn hóa tên bằng formatTechnicianName)
                                                    │
                                  [ PATCH /api/v1/cps/:id/assign ]
                                                    │
                                  Cập nhật cpsList & Lưu Database
```

### 3.1 Nạp dữ liệu (Initialization)
- Khi Control Panel khởi chạy, hàm `loadData()` kích hoạt gọi API:
  - Lấy danh sách phiếu: `GET /api/v1/cps` -> gán vào `cpsList`.
  - Lấy danh sách kỹ thuật viên: `GET /api/v1/users/technicians` -> gán vào `technicians`.

### 3.2 Lọc & Phân trang (Filter & Pagination)
- Thuộc tính tính toán `assignCardsFiltered`:
  - Lọc theo từ khóa `assignCardSearch`: tìm kiếm theo mã CPS, tên máy, mô tả sự cố, người yêu cầu, tên technician.
  - Lọc theo trạng thái `assignCardStatus`: `ALL`, `TO_ASSIGN`, `IN_PROGRESS`, `OVER_DUE`, `CLOSED`.
- Thuộc tính tính toán `assignCardsPaginated`:
  - Cắt mảng theo trang hiện tại `assignCardPage` và kích thước trang `assignCardPageSize` (mặc định 6 items/trang).

### 3.3 Phân công (Assign Action)
- Người dùng bấm nút "Phân công ngay" hoặc "Đổi Technician" -> Kích hoạt `openAssignModal(cps)`.
- Người dùng chọn Technician, ngày giờ bắt đầu và ghi chú.
- Bấm "Xác nhận phân công" -> Gọi hàm `submitAssignTask()`:
  - Chuẩn hóa tên nhân viên qua `formatTechnicianName(assignForm.assignedTo)`.
  - Cập nhật các trường: `assignedTo`, `assignedToName`, `assignedAt`, `plannedStartDate`, `assignNote`, `status = 'IN_PROGRESS'`.
  - Gửi request cập nhật xuống backend.

---

## 4. Hướng Dẫn Vận Hành (Operation Guide)

### 4.1 Xem danh sách và trạng thái phiếu
1. Tại menu bên trái của Control Panel, bấm chọn tab **Phân Công Kỹ Thuật**.
2. Quan sát hàng số liệu KPI trên cùng:
   - **Tất Cả CPS**: Tổng số phiếu hiện có trong hệ thống.
   - **Chờ Phân Công**: Các phiếu chưa có người tiếp nhận (`TO_ASSIGN`).
   - **Đang Xử Lý**: Các phiếu kỹ thuật viên đang tiến hành sửa chữa (`IN_PROGRESS`).
   - **Quá Hạn**: Các phiếu bị trễ tiến độ so với kế hoạch (`OVER_DUE`).
   - **Đã Đóng**: Các phiếu đã hoàn thành sửa chữa (`CLOSED`).
3. Click trực tiếp vào từng thẻ KPI để lọc nhanh danh sách tương ứng.

### 4.2 Tìm kiếm phiếu
- Nhập từ khóa vào ô tìm kiếm: hỗ trợ tìm theo Mã CPS (ví dụ `CPS-2024-001`), Tên thiết bị (ví dụ `Máy hàn điểm`), Tên nhân viên (ví dụ `Đỗ Đức Nhật`), hoặc nội dung sự cố.

### 4.3 Thực hiện phân công mới
1. Tìm phiếu có trạng thái **Chờ Phân Công** (thẻ có viền vàng cam).
2. Bấm nút **Phân công ngay**.
3. Trong hộp thoại Phân Công Kỹ Thuật:
   - Chọn **Technician phụ trách** từ danh sách thả xuống.
   - Chọn **Thời gian bắt đầu dự kiến**.
   - Nhập **Ghi chú chỉ đạo** (nếu có hướng dẫn đặc biệt).
4. Bấm **Xác nhận phân công**.
5. Phiếu sẽ tự động chuyển sang trạng thái **Đang Xử Lý** với tên Technician hiển thị trên thẻ.

### 4.4 Đổi / Tái phân công Technician
1. Tìm phiếu đang xử lý hoặc quá hạn cần đổi người.
2. Bấm nút **Đổi Technician**.
3. Chọn Technician mới và cập nhật ghi chú bàn giao.
4. Bấm **Xác nhận phân công**.

---

## 5. Hướng Dẫn Xử Lý Sự Cố (Troubleshooting Guide)

| Hiện tượng sự cố | Nguyên nhân khả dĩ | Vị trí kiểm tra | Cách khắc phục |
|---|---|---|---|
| **Chữ bị mờ hoặc chìm màu trắng khi ở Light Mode** | CSS áp dụng class màu cố định của dark mode (như `text-slate-100`, `text-slate-200`) mà không có style ghi đè cho light mode. | `control-panel.style.ts` và `assign-task.style.ts` | Đảm bảo selector `html.theme-light` có các rule override: `html.theme-light .text-slate-100 { color: #1e293b !important; }`. Sử dụng cặp class Tailwind `text-slate-800 dark:text-slate-100`. |
| **Tên nhân viên hiển thị dạng `KTV Đỗ Đức Nhật - VN`** | Dữ liệu nhân viên được gán trực tiếp chuỗi thô từ database hoặc người dùng nhập cả chức danh và mã quốc gia. | `assign-task.helpers.ts` (`formatTechnicianName`) | Kiểm tra xem view có gọi hàm `getTechnicianDisplayName(item)` hoặc `formatTechnicianName(name)` hay không. Helper này sử dụng regex `^(KTV|Technician)\s*[-:]?\s*` và cắt bỏ đoạn sau dấu ` - ` để giữ lại tên chuẩn. |
| **Dropdown Technician trong Modal trống không** | API `/api/v1/users/technicians` không trả về dữ liệu hoặc chưa có user nào được cấp role `TECHNICIAN`. | Browser Console (Network tab) & `UserController.getTechnicians` | 1. Mở F12 kiểm tra request `/api/v1/users/technicians`.<br>2. Kiểm tra database bảng users, đảm bảo trường roles có giá trị chứa `TECHNICIAN`.<br>3. Kiểm tra hàm `loadTechnicians()` trong `control-panel.view.ts`. |
| **Phân công xong nhưng tải lại trang (F5) bị mất dữ liệu** | Giao diện chỉ cập nhật state tạm thời trên Vue reactive store mà chưa gửi request lưu xuống backend hoặc API bị lỗi 500/403. | `submitAssignTask()` trong `control-panel.view.ts` | 1. Mở tab Network F12 kiểm tra mã HTTP response khi bấm Lưu.<br>2. Đảm bảo API `PATCH /api/v1/cps/:id/assign` trả về status 200/204.<br>3. Kiểm tra log backend NestJS xem có bị lỗi transaction rollback hay không. |
| **Nút 'Xem Dạng Bảng' hoặc 'Làm mới' xuất hiện lại** | Template cũ bị merge đè hoặc chưa chuyển sang import từ `assign-tasks-tab.component.ts`. | `checkpoint_technical/src/views/control-panel.view.ts` | Kiểm tra template trong `control-panel.view.ts`, đảm bảo sử dụng `CP_ASSIGN_TASKS_TAB_HTML` từ module `assign-task-module`. |
| **Lỗi biên dịch TypeScript khi build (`npm run build`)** | Thiếu export/import giữa các file module hoặc sai kiểu dữ liệu. | Thư mục `modules/assign-task-module/` | Chạy lệnh kiểm tra `npm test` và `npm run build` trong thư mục `checkpoint_technical/` để đọc thông báo lỗi chi tiết. |

---

## 6. Hướng Dẫn Kiểm Thử Tự Động (Automated Testing)

Module đi kèm với bộ test case tự động tại `checkpoint_technical/test/assign-task-module.spec.ts`.

### Các test case bao gồm:
1. `formatTechnicianName`:
   - Chuẩn hóa chuỗi có tiền tố `'KTV Đỗ Đức Nhật - VN'` -> `'Đỗ Đức Nhật'`.
   - Chuẩn hóa chuỗi có tiền tố `'Technician Nguyễn Văn A - VN1234'` -> `'Nguyễn Văn A'`.
   - Giữ nguyên tên đã sạch `'Trần Văn Bình'` -> `'Trần Văn Bình'`.
   - Xử lý các giá trị `null`, `undefined`, rỗng an toàn.
2. `getTechnicianDisplayName`:
   - Ưu tiên đọc `assignedToName`, fallback sang `assignedTo`, fallback sang `assignee`.
3. `getCardBorderClass`:
   - Đảm bảo trả về class tương thích cả Light mode và Dark mode cho các trạng thái: `TO_ASSIGN`, `IN_PROGRESS`, `OVER_DUE`, `CLOSED`.
4. Template Cleanliness:
   - Đảm bảo template `CP_ASSIGN_TASKS_TAB_HTML` không chứa `(Assign Task)`.
   - Đảm bảo không chứa nút `Làm mới` hoặc `Xem Dạng Bảng`.
   - Đảm bảo từ khóa `Technician` được sử dụng thay thế cho `KTV`.

### Lệnh chạy kiểm thử:
```bash
cd checkpoint_technical
npm test
```
Toàn bộ các test suite phải báo trạng thái `PASS`.
