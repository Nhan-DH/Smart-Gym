# Rule: Frontend Design & UI/UX Standards

Quy chuẩn thiết kế giao diện, trải nghiệm người dùng và hệ thống Design System cho SmartGym.
Phong cách thiết kế chính thức được phê duyệt: **Hybrid Athletic** (Sidebar đen, nội dung trắng, điểm nhấn xanh Volt).
Áp dụng đồng bộ và nhất quán cho toàn bộ các ứng dụng tại `FE/` (Manager, Member, PT, Kiosk).

---

## 1. Định hướng Thẩm mỹ Chính thức: Hybrid Athletic

SmartGym mang bản sắc **Hybrid Athletic (Cân bằng giữa quản trị và thể thao)**:
- **Tinh thần**: Hiện đại, giàu năng lượng vận động nhưng giữ trọn sự chuẩn xác, rõ ràng và thanh lịch của hệ thống quản trị thể thao chuyên nghiệp.
- **Bố cục tổng quan**:
  - **Sidebar đen (Dark Athletic Slate)**: `#0A0D14` với viền `#1B2335`, icon và chữ tối ưu tương phản `#94A3B8`, mục active có nền `#182613` và viền/chữ **xanh Volt (`#D4F638`)**. Chiều rộng cố định **240px**.
  - **Nền nội dung sáng (Crisp White Canvas)**: Nền `#F8F9FB`, bề mặt thẻ và bảng biểu màu trắng `#FFFFFF`, viền mảnh hairline 1px `#E5E7EB`.
  - **Header trên cùng**: Màu trắng `#FFFFFF`, chiều cao cố định **64px**, đường viền dưới mảnh 1px (`#E5E7EB`).
  - **Màu nhấn thương hiệu**:
    - **Xanh Volt (`#D4F638`)**: Thể hiện chất thể thao đỉnh cao, tốc độ, năng lượng cho các nút hành động, chỉ số mật độ, và Kiosk.
    - **Xanh lá Gym (`#087A3E`)**: Dùng bổ trợ cho các chỉ số thành công, kích hoạt, an toàn.
  - **Chữ tối tương phản cao**: `#111827`, chữ phụ `#64748B`.
- **Quy tắc bất biến**: Không tự ý thay đổi phong cách giữa các màn hình. Toàn bộ Manager, Member Portal, PT Screen và Kiosk đều tuân theo phong cách Hybrid Athletic.

---

## 2. Chiến dịch loại bỏ "AI Slop" (Zero-Slop Policy)

Tuân thủ nghiêm ngặt kỹ năng `impeccable` và `frontend-design`:

| Anti-Pattern (AI Slop) | Lý do cấm | Quy chuẩn Hybrid Athletic của SmartGym |
| :--- | :--- | :--- |
| **Gradient tím - hồng - cam neon** | Gây cảm giác template giả tạo, mỏi mắt | Nền phẳng sạch sẽ (`#F8F9FB`), màu nhấn xanh Volt dứt khoát (`#D4F638`) |
| **Glassmorphism / Frosted Glass** | Làm mờ văn bản, giảm tương phản | Bề mặt phân tầng dứt khoát bằng màu trắng (`#FFFFFF`) và đường kẻ viền mảnh 1px (`#E5E7EB`) |
| **Card-itis (Nhồi nhét thẻ bo tròn)** | Phân mảnh thông tin, lãng phí diện tích hiển thị | Dùng layout phân vùng bằng đường kẻ mảnh (hairline dividers), bảng biểu dòng (data tables) chuyên nghiệp |
| **Lạm dụng Badge & Tag lòe loẹt** | Rối mắt, mất đi tính trang trọng | Chỉ dùng Badge cho các trạng thái nghiệp vụ chuẩn mực với màu ngữ nghĩa dịu mắt |
| **Emoji làm Icon giao diện** | Mất tính nghiêm túc của sản phẩm thương mại | **Tuyệt đối không dùng emoji** (💪, 🔥, 🏋️) làm icon chức năng. Sử dụng 100% vector SVG từ **Lucide React** |
| **Glow / Box-Shadow phát sáng lố lăng** | Gây cảm giác rẻ tiền | Không dùng bóng đổ phát sáng; chỉ dùng shadow siêu nhẹ 1-2px cho dropdown/dialog (`shadow-sm` / `shadow-md`) |
| **Bo góc quá lớn (`rounded-3xl`)** | Mềm yếu, bong bóng | Bo góc sắc sảo, dứt khoát: **6–8px** (`rounded-md` hoặc `rounded-lg`) |

---

## 3. Hệ thống Design Tokens Chính thức

### 3.1 Primitive & Semantic Tokens
```css
:root {
  /* Athletic Volt Accent */
  --volt:               #D4F638;  /* Xanh Volt thể thao đỉnh cao */
  --volt-hover:         #C0E224;
  --volt-light:         #F5FDD6;
  --volt-dark:          #1C2707;

  /* Brand Emerald Green */
  --primary:            #087A3E;  /* Xanh lá đậm thương hiệu */
  --primary-hover:      #056332;
  --primary-light:      #E7F5EC;
  
  /* Dark Sidebar */
  --sidebar-bg:         #0A0D14;  /* Sidebar than đen thể thao */
  --sidebar-border:     #1B2335;
  --sidebar-text:       #94A3B8;
  --sidebar-active:     #D4F638;
  
  /* Background & Surface */
  --background:         #F8F9FB;  /* Nền ứng dụng sáng */
  --surface:            #FFFFFF;  /* Bề mặt panel, card, table */
  --surface-hover:      #F1F5F9;  /* Hover dòng bảng */
  
  /* Borders & Dividers */
  --border:             #E5E7EB;  /* Viền mảnh hairline 1px */
  --border-strong:      #D1D5DB;  /* Viền input khi focus */

  /* Typography Colors */
  --text-primary:       #111827;  /* Chữ đen than có độ tương phản cao */
  --text-secondary:     #64748B;  /* Chữ phụ, nhãn, subtitle */
  --text-muted:         #94A3B8;  /* Chữ mờ, placeholder */

  /* Functional Status Colors */
  --success:            #16A34A;  /* Xanh lá tươi - Thành công, Active */
  --success-bg:         #DCFCE7;
  --warning:            #D97706;  /* Vàng cam - Chờ đối soát, Cần đổi lịch */
  --warning-bg:         #FEF3C7;
  --danger:             #DC2626;  /* Đỏ - Khóa tài khoản, Từ chối, Vắng mặt */
  --danger-bg:          #FEE2E2;
  --info:               #2563EB;  /* Xanh dương - Thông tin, Mật độ phòng */
  --info-bg:            #DBEAFE;
  
  /* Focus Ring */
  --ring:               #087A3E;
}
```

### 3.2 Kích thước Bố cục & Spacing Chuẩn
- **Kích thước Cố định**:
  - `Sidebar width`: **240px** cố định trên Desktop.
  - `Header height`: **64px** cố định.
  - `Border radius`: **6–8px** (`rounded-md` cho button/input, `rounded-lg` cho modal/panel).
- **Thang khoảng cách (Spacing Scale)**:
  - `4px` (`gap-1`, `p-1`): Khoảng cách icon và nhãn nhỏ.
  - `8px` (`gap-2`, `p-2`): Khoảng cách giữa các nút con, padding input.
  - `12px` (`gap-3`, `p-3`): Padding ô bảng dữ liệu (Data Table row).
  - `16px` (`gap-4`, `p-4`): Padding chuẩn cho Panel, Card nội dung.
  - `24px` (`gap-6`, `p-6`): Khoảng cách giữa các khối chức năng chính.
  - `32px` (`gap-8`, `p-8`): Margin top phân tách các section lớn.

---

## 4. Typography (Phông chữ Be Vietnam Pro)

- **Phông chữ duy nhất**: **Be Vietnam Pro** (hỗ trợ hiển thị dấu tiếng Việt hoàn hảo, nét chữ đứng đắn, hiện đại, hình học sắc sảo).
- **Tỉ lệ phân cấp (Type Scale)**:
  - `Display KPI`: 32px / 36px, Weight 700 (Số đếm mật độ phòng, tổng doanh thu ngày).
  - `Heading 1`: 24px / 30px, Weight 600 (Tiêu đề trang: Dashboard, Quản lý hội viên).
  - `Heading 2`: 18px / 24px, Weight 600 (Tiêu đề khối nội dung, Modal title).
  - `Heading 3`: 15px / 20px, Weight 500 (Tiêu đề cột bảng, tên gói tập).
  - `Body Standard`: 14px / 20px, Weight 400 (Nội dung bảng dữ liệu, nhãn form, văn bản).
  - `Body Small`: 12px / 16px, Weight 400/500 (Timestamp, breadcrumb, mã đơn ID).

---

## 5. Quy chuẩn Thiết kế cho 4 Persona (Đồng bộ Professional Light)

1. **Manager Web Dashboard (`/admin`)**:
   - Sidebar 240px màu trắng viền phải, Header 64px màu trắng viền dưới.
   - Nền nội dung `#F8F9FB`. Bảng dữ liệu dòng phẳng màu trắng `#FFFFFF`, viền `#E5E7EB`.
   - Nút hành động chính (Duyệt đơn, Thêm hội viên) dùng màu `#087A3E` (chữ trắng đậm).
2. **Member Portal (`/app`)**:
   - Giao diện Web Responsive tối ưu cho điện thoại.
   - Nền sáng `#F8F9FB`. Thẻ hội viên điện tử màu xanh đậm `#087A3E` chữ trắng hoặc nền trắng viền xanh lá đậm.
   - Nút hiển thị mã Dynamic QR lớn 56px, nổi bật với viền và nền nhấn `#087A3E`.
3. **PT Portal (`/trainer`)**:
   - Xem lịch tuần dạng bảng lưới sáng sủa, phân biệt rõ các slot dạy, slot trống và slot nghỉ phép.
   - Bảng nhập giáo án nhanh (Exercise, Sets, Reps, Weight kg, Rest) theo phong cách tối giản.
4. **Kiosk Check-in/Check-out (`/kiosk`)**:
   - Giữ vững phong cách Professional Light: Khung viền camera sắc nét đặt trên nền sáng `#F8F9FB`.
   - Header 64px hiển thị tên Kiosk, giờ thực tế và nút chuyển chế độ VÀO / RA to rõ (56px) với màu `#087A3E`.
   - Popup kết quả nhận diện khuôn mặt hiển thị trang trọng, chữ to rõ, tương phản hoàn hảo trong < 0.8 giây.
