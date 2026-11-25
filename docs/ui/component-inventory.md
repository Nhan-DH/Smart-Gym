# SmartGym — Component Inventory & UI Catalog (Professional Light)

Danh mục và đặc tả kỹ thuật của 22 UI Components dùng chung trong hệ thống SmartGym.
Được xây dựng dựa trên: **React 19, TypeScript, Tailwind CSS, shadcn/ui primitives và Lucide React**.
Thiết kế theo chuẩn: **Professional Light, Modern Athletic Minimalism**.
Bảng màu chính thức: Primary `#087A3E`, Background `#F8F9FB`, Surface `#FFFFFF`, Border `#E5E7EB`, Text `#111827`.
Phông chữ: **Be Vietnam Pro**. Bo góc: **6–8px**.

---

## 1. Bảng Tổng hợp 22 Components Cốt lõi

| STT | Tên Component | Mục đích sử dụng | Vị trí xuất hiện chính |
| :---: | :--- | :--- | :--- |
| **01** | `Button` | Nút bấm thực hiện hành động | Toàn bộ hệ thống |
| **02** | `Input` | Ô nhập liệu văn bản, số, mật khẩu | Form đăng nhập, tìm kiếm, nhập hồ sơ |
| **03** | `Select` | Menu chọn một giá trị duy nhất | Chọn gói tập, chọn PT, chọn cơ sở |
| **04** | `Checkbox` | Chọn nhiều tùy chọn độc lập | Chọn ngày rảnh trong tuần (T2-CN) |
| **05** | `RadioGroup` | Chọn 1 trong nhiều lựa chọn tương hỗ | Chọn phương thức thanh toán (Tiền mặt / CK) |
| **06** | `DataTable` | Bảng hiển thị dữ liệu dạng dòng chuyên nghiệp | Quản lý hội viên, đơn hàng, điểm danh |
| **07** | `Pagination` | Phân trang cho bảng dữ liệu lớn | Chân trang của mọi Data Table |
| **08** | `Dialog` (Modal) | Hộp thoại xác nhận, popup chi tiết | Duyệt thanh toán, xác nhận xóa khuôn mặt |
| **09** | `Drawer` (Sheet) | Bảng trượt từ cạnh màn hình | Xem nhanh chi tiết hội viên, form nhập giáo án |
| **10** | `DropdownMenu` | Menu tác vụ ẩn theo từng dòng dữ liệu | Nút ba chấm (...) thao tác nhanh trên bảng |
| **11** | `Toast` | Thông báo nổi tự tắt sau 3 giây | Báo lưu thành công, thông báo lỗi server |
| **12** | `Tabs` | Chuyển đổi các phân vùng nội dung song song | Chuyển 3 phương án CP-SAT, chuyển tab đơn hàng |
| **13** | `Calendar` | Xem ngày tháng dạng lưới tháng | Lịch cá nhân của hội viên, lịch ca của PT |
| **14** | `DatePicker` | Chọn một ngày cụ thể từ popover | Chọn ngày sinh, lọc báo cáo theo ngày |
| **15** | `TimePicker` / Slot | Chọn slot thời gian 60 phút | Đặt lịch thủ công, chọn giờ rảnh |
| **16** | `Sidebar` | Thanh điều hướng 240px cố định bên trái | Manager Dashboard, PT Portal Desktop |
| **17** | `Header` | Thanh tiêu đề 64px trên cùng kèm KPI/Status | Toàn bộ các trang |
| **18** | `Breadcrumb` | Điều hướng phân cấp vị trí hiện tại | Trang chi tiết hội viên, cấu hình sâu |
| **19** | `StatusIndicator`| Chấm màu + nhãn ngữ nghĩa hiển thị trạng thái| Trạng thái thẻ, trạng thái slot, đơn hàng |
| **20** | `Skeleton` | Khung xương giả lập bố cục khi đang tải dữ liệu| Thay thế toàn bộ spinner quay tròn |
| **21** | `EmptyState` | Giao diện hiển thị khi không có dữ liệu | Bảng trống, lịch trống, không có đơn hàng |
| **22** | `ErrorState` | Giao diện thông báo lỗi kèm nút thử lại | Lỗi mạng, 404, 409 xung đột lịch |

---

## 2. Đặc tả Kỹ thuật Chi tiết Từng Component (Professional Light)

### 01. `Button` (Nút bấm)
- **Props**:
  - `variant`:
    - `'primary'`: Nền xanh lá đậm `#087A3E`, chữ trắng `#FFFFFF`, hover `#056332`.
    - `'secondary'`: Nền trắng `#FFFFFF`, viền `#E5E7EB`, chữ `#111827`, hover `#F8F9FB`.
    - `'outline'`: Nền trong suốt, viền xanh `#087A3E`, chữ `#087A3E`, hover `#E7F5EC`.
    - `'ghost'`: Không viền, không nền, hover `#F1F5F9`.
    - `'danger'`: Nền đỏ `#DC2626`, chữ trắng, hover `#B91C1C`.
    - `'kiosk'`: Kích thước 56px, nền `#087A3E`, chữ trắng, tối ưu cảm ứng.
  - `size`: `'sm'` (32px), `'md'` (40px chuẩn), `'lg'` (48px), `'xl'` (56px Kiosk).
  - `isLoading`: boolean (Hiển thị loader spinner nhỏ, giữ nguyên width).
  - `icon`: LucideIcon (Tùy chọn hiển thị icon trước hoặc sau nhãn).
- **Quy chuẩn Anti-Slop**:
  - Không có hiệu ứng viền phát sáng (No glow).
  - Bo góc dứt khoát `6–8px` (`rounded-md`).
  - Khi hover: Chuyển màu nhẹ nhàng 150ms (`transition-colors duration-150`).
- **Khả năng tiếp cận (a11y)**:
  - Focus ring rõ nét khi bấm Tab: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087A3E]`.

### 02. `Input` (Ô nhập liệu)
- **Props**:
  - `type`: `'text' | 'password' | 'email' | 'number' | 'search'`.
  - `label`: string (Nhãn bắt buộc, không dùng placeholder làm nhãn duy nhất).
  - `error`: string (Thông báo lỗi đỏ hiển thị ngay dưới trường nhập).
  - `helperText`: string (Gợi ý định dạng, ví dụ: *"Mật khẩu tối thiểu 8 ký tự"*).
- **Styling**:
  - Nền trắng `#FFFFFF`, viền `border-[#E5E7EB]`, chữ `#111827`.
  - Khi focus: Viền đổi sang `#087A3E`, vòng ring mờ `ring-1 ring-[#087A3E]`. Bo góc `6px`.

### 06. `DataTable` (Bảng dữ liệu dòng chuyên nghiệp)
- **Cấu trúc dựa trên TanStack Table + shadcn**:
  - Phần Header: Cố định (Sticky), nền `#F8FAFC`, chữ hoa nhỏ `text-xs font-semibold text-[#64748B] tracking-wider`, viền dưới `border-b border-[#E5E7EB]`.
  - Phần Body: Mỗi dòng là 1 thẻ `<tr>`, nền trắng `#FFFFFF`, phân cách bằng đường kẻ mảnh 1px (`border-b border-[#E5E7EB]/70`).
  - Hiệu ứng Hover dòng: Đổi sang màu `#F8F9FB` nhẹ nhàng.
  - Padding ô chuẩn: `py-3 px-4` (Mật độ thông tin cao, không padding phình to).

### 08. `Dialog` (Hộp thoại xác nhận / Modal)
- **Cấu trúc**:
  - Backdrop: Màu đen mờ tĩnh `bg-black/50` (Không dùng backdrop-blur nặng).
  - Thân hộp thoại: Nền trắng `#FFFFFF`, viền `border border-[#E5E7EB]`, bo góc `rounded-lg` (8px), bóng đổ `shadow-lg`.
  - Header: Tiêu đề Be Vietnam Pro 18px font-semibold + Nút tắt (X).
  - Footer: Nút phụ `Hủy bỏ` (Secondary) bên trái, Nút chính `Xác nhận` (Primary `#087A3E` hoặc Danger `#DC2626`) bên phải.

### 11. `Toast` (Thông báo nổi tự tắt)
- **Vị trí**: Góc dưới bên phải trên Desktop; Góc trên cùng ở Mobile.
- **Biến thể**:
  - `success`: Viền xanh `#16A34A`, icon `CheckCircle2`, nền trắng `#FFFFFF`, nội dung ngắn.
  - `error`: Viền đỏ `#DC2626`, icon `AlertCircle`, nền trắng `#FFFFFF`.
  - `info`: Viền xanh dương `#2563EB`, icon `Info`.
- **Thời gian tồn tại**: 3000ms, có nút tắt nhanh (X).

### 12. `Tabs` (Thanh chuyển đổi tab)
- **Biến thể**:
  - `line`: Dạng gạch chân mảnh (Tab active có chữ `#087A3E` và đường gạch chân `#087A3E` cao 2px).
  - `pill-subtle`: Dạng khối bo vuông nhẹ `rounded-md` (Tab active có nền `#E7F5EC`, chữ `#087A3E`, tab thường chữ `#64748B`).

### 15. `TimePicker / Slot Grid` (Lưới chọn Slot tập 60 phút)
- **Hiển thị lưới các slot giờ**:
  - Mỗi ô đại diện cho 1 slot 60 phút (ví dụ: `08:00 - 09:00`, `09:00 - 10:00`).
  - Trạng thái ô:
    - *Còn trống (Available)*: Nền trắng `#FFFFFF`, viền `#E5E7EB`, chữ `#111827`, hover viền `#087A3E`.
    - *Đã kín (Booked)*: Nền `#F1F5F9`, viền `#E5E7EB`, chữ mờ `#94A3B8`, gạch ngang nhẹ, con trỏ `cursor-not-allowed`.
    - *Đang chọn (Selected)*: Nền xanh lá đậm `#087A3E`, chữ trắng đậm `#FFFFFF`.
    - *Bị xung đột vừa chiếm*: Nhấp nháy viền đỏ `#DC2626` và tự vô hiệu hóa.

### 16. `Sidebar` (Thanh điều hướng cố định)
- **Kích thước**: Chiều rộng cố định **240px**.
- **Styling**: Nền trắng `#FFFFFF`, viền phải `1px solid #E5E7EB`.
- **Item menu**: Chiều cao 40px, padding ngang 12px, bo góc `6px`.
  - Active item: Nền `#E7F5EC`, chữ và icon màu `#087A3E` font-semibold.
  - Inactive item: Chữ `#64748B`, hover nền `#F8F9FB`, chữ `#111827`.

### 17. `Header` (Thanh tiêu đề trên cùng)
- **Kích thước**: Chiều cao cố định **64px**.
- **Styling**: Nền trắng `#FFFFFF`, viền dưới `1px solid #E5E7EB`, padding ngang 24px.
- **Nội dung**: Tên màn hình / breadcrumb bên trái; Chỉ số mật độ phòng thời gian thực, chuông thông báo và avatar người dùng bên phải.

### 19. `StatusIndicator` (Chấm trạng thái nghiệp vụ)
- **Cấu trúc**: 1 chấm tròn vector `w-2 h-2` + Nhãn văn bản đi kèm.
- **Quy ước màu chuẩn**:
  - Xanh lá (`#16A34A`): `ACTIVE` (Hội viên hoạt động), `CONFIRMED` (Lịch đã chốt), `CHECKED_IN` (Đang trong phòng).
  - Vàng cam (`#D97706`): `PENDING` (Đơn chờ đối soát), `NEEDS_RESCHEDULE` (Cần đổi lịch do PT nghỉ).
  - Đỏ (`#DC2626`): `LOCKED` (Tài khoản bị khóa), `CANCELLED` (Đã hủy), `NO_SHOW` (Vắng mặt).
  - Xám (`#64748B`): `EXPIRED` (Gói tập hết hạn), `CLOSED` (Phiên tập đã kết thúc).

### 20. `Skeleton` (Khung xương tải dữ liệu)
- **Styling**: Nền xám nhạt `#E2E8F0`, hiệu ứng nhấp nháy êm dịu `animate-pulse`, bo góc `6px`.
- Tỉ lệ khớp chính xác với avatar tròn, dòng text và bảng dữ liệu thực tế.

### 21. `EmptyState` (Màn hình trống dữ liệu)
- **Cấu trúc**:
  - Khung viền nét đứt mảnh `border border-dashed border-[#E5E7EB] rounded-lg p-8 bg-[#FFFFFF]`.
  - Icon Lucide minh họa kích thước `40x40px`, màu xám `#94A3B8`.
  - Tiêu đề ngắn gọn font-semibold `#111827` + đoạn giải thích `#64748B`.
  - Nút CTA chính: **[ Đặt lịch tập ngay ]** (Primary Button `#087A3E`).

### 22. `ErrorState` (Màn hình báo lỗi & Exception)
- **Cấu trúc**:
  - Icon cảnh báo `AlertTriangle` màu cam hoặc đỏ.
  - Tiêu đề lỗi rõ nghĩa font-semibold `#111827`.
  - Hướng dẫn hành động cụ thể cho người dùng (ví dụ: *"Không thể tải danh sách ca làm việc do mất kết nối mạng. Vui lòng kiểm tra lại đường truyền."*).
  - Nút hành động: **[ Thử lại ]** và link **[ Quay về trang chủ ]**.
