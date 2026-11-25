# SmartGym Design System — Hybrid Athletic Specification

Tài liệu đặc tả hệ thống thiết kế cho SmartGym (Frontend tại `FE/` và `apps/web/`).

---

## 1. Triết lý Thiết kế: Hybrid Athletic

- **Sidebar Đen (`#0A0D14`)**: Thể hiện chất phòng gym mạnh mẽ, máy móc, cơ khí vững chãi, các mục điều hướng rõ ràng, thanh thoát.
- **Nội dung Trắng (`#F8F9FB` / `#FFFFFF`)**: Nền sáng thanh lịch, bề mặt thẻ trắng tinh khiết, phân tách bằng đường viền mảnh 1px (`#E5E7EB`), tối đa hóa khả năng đọc biểu đồ, bảng dữ liệu và lịch tập.
- **Điểm nhấn Xanh Volt (`#D4F638`)**: Thể hiện năng lượng thể thao bứt phá, tập trung sự chú ý vào các nút hành động quan trọng (CTA, check-in, xác nhận) và trạng thái active.
- **Xanh Lá Gym (`#087A3E`)**: Biểu trưng cho sự bền bỉ, an toàn, sức khỏe và chuẩn mực quản trị.

---

## 2. Bảng Màu & Design Tokens

| Tên Token | Mã Hex | Ứng dụng |
| :--- | :--- | :--- |
| `--volt` | `#D4F638` | Điểm nhấn chính, nút CTA, viền active, icon thương hiệu |
| `--volt-hover` | `#C0E224` | Hover trạng thái nút Volt |
| `--sidebar-bg` | `#0A0D14` | Nền Sidebar cố định 240px |
| `--sidebar-border` | `#1B2335` | Đường viền ngăn cách Sidebar |
| `--sidebar-text` | `#94A3B8` | Chữ mục điều hướng mặc định |
| `--primary` | `#087A3E` | Màu thành công, nhãn trạng thái kích hoạt |
| `--background` | `#F8F9FB` | Nền canvas toàn bộ khu vực làm việc |
| `--surface` | `#FFFFFF` | Thẻ dữ liệu (Card), Modal Dialog, Bảng |
| `--border` | `#E5E7EB` | Đường viền ngăn cách thành phần (1px) |
| `--text-primary` | `#111827` | Tiêu đề, chữ số, nội dung quan trọng |
| `--text-secondary`| `#64748B` | Nhãn phụ, thời gian, mô tả nhỏ |

---

## 3. Quy chuẩn Typography & Spacing

- **Font chữ**: `Be Vietnam Pro` (hỗ trợ dấu tiếng Việt 100%, sắc nét ở mọi kích cỡ).
- **Hệ số Spacing**: `4px, 8px, 12px, 16px, 24px, 32px`.
- **Bo góc (Border Radius)**: `4px` (nhỏ), `6px` (mặc định), `8px` (thẻ).
- **Iconography**: 100% SVG từ **Lucide React**. Không dùng emoji làm icon chức năng.
