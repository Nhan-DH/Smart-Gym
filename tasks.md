# SmartGym — Master Task List

Bảng quản lý công việc toàn diện theo chu trình phát triển 12 tuần của đồ án tốt nghiệp SmartGym.
Nguồn chân lý nghiệp vụ: [design.md](file:///d:/WORKSPACE/Smart-Gym/design.md).
Nguyên tắc quản trị: [AGENTS.md](file:///d:/WORKSPACE/Smart-Gym/AGENTS.md).

---

## Bảng ký hiệu trạng thái
- `[ ]` Chưa bắt đầu (Pending)
- `[/]` Đang tiến hành (In Progress)
- `[x]` Đã hoàn thành và kiểm chứng (Completed)
- `[-]` Tạm hoãn / Chờ phụ thuộc (Blocked/Deferred)

---

## Phase 0: Cấu hình Hệ thống, Luật lệ & Chuẩn bị Kiến trúc (Hoàn thành)
> **Mục tiêu**: Xây dựng bộ quy tắc phát triển, phân bổ skills, ma trận xung đột, thiết lập AGENTS.md, Rules, tasks.md, progress.md.

- [x] **TASK-001**: Khảo sát toàn bộ repository và đọc chi tiết tài liệu thiết kế `design.md`.
- [x] **TASK-002**: Khảo sát 33 Agent Skills đã cài đặt trong `.agents/skills/` và phân nhóm chức năng.
- [x] **TASK-003**: Xây dựng ma trận giải quyết xung đột kỹ năng và định hướng chiến dịch bài trừ AI Slop.
- [x] **TASK-004**: Thiết lập file `AGENTS.md` tại thư mục gốc.
- [x] **TASK-005**: Tạo 6 bộ Rule chi tiết trong `.agents/rules/`:
  - [x] `project-architecture.md`
  - [x] `frontend-design.md`
  - [x] `code-quality.md`
  - [x] `security.md`
  - [x] `testing.md`
  - [x] `git-workflow.md`
- [x] **TASK-006**: Xây dựng `tasks.md` và `progress.md`.
- [x] **TASK-007**: Đề xuất danh sách MCP cần thiết cho các giai đoạn phát triển.
- [x] **TASK-008**: Báo cáo tổng thể cấu hình dự án và được User phê duyệt.

---

## Phase 1 & 1.5: Triển khai Toàn diện Frontend 4 Cổng Ứng dụng (Hybrid Athletic - Hoàn thành)
> **Stack chính thức**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Lucide React + TanStack Query + TanStack Table + Recharts.
> **Phong cách chính thức**: **Hybrid Athletic (Sidebar đen than `#0A0D14`, Nội dung trắng `#F8F9FB`/`#FFFFFF`, Điểm nhấn xanh Volt `#D4F638`, Font Be Vietnam Pro, Bo góc 6–8px)**.

- [x] **TASK-101**: Thiết lập cấu trúc thư mục `BE/` và `FE/` (kèm directory junction `apps/web` trỏ đến `FE/`).
- [x] **TASK-102**: Cấu hình Design Tokens Hybrid Athletic trong `tailwind.config.js` và `globals.css` (Dark sidebar, Volt accent, Crisp light canvas).
- [x] **TASK-103**: Xây dựng bộ thư viện UI Components dùng chung (Button, Input, Badge, Card, Dialog, StatusIndicator, Pagination, Skeleton).
- [x] **TASK-104**: Xây dựng Layouts đồng bộ (ManagerLayout với Sidebar đen 240px, MemberLayout responsive, TrainerLayout, KioskLayout fullscreen).
- [x] **TASK-105**: Triển khai toàn bộ màn hình Cổng Quản Lý (Manager Web):
  - [x] **105.1 Đăng nhập**: `LoginPage` với bộ chuyển vai trò nhanh.
  - [x] **105.2 Tổng quan**: `ManagerDashboardPage` với 4 thẻ KPI, đồng hồ đo mật độ real-time, biểu đồ Recharts, đơn chờ duyệt, phiên tập đang mở.
  - [x] **105.3 Hội viên**: `MemberListPage` với TanStack Table, tìm kiếm, lọc trạng thái, modal thêm hội viên, dialog khóa/mở khóa tài khoản, modal chi tiết.
  - [x] **105.4 Gói tập**: `PlansPage` quản lý gói tập, snapshot giá, bật/tắt kích hoạt, modal tạo gói.
  - [x] **105.5 Đơn hàng**: `OrdersPage` quản lý đơn đối soát, xác nhận đã nhận tiền một chạm, modal từ chối có lý do.
  - [x] **105.6 Huấn luyện viên**: `TrainersPage` hồ sơ PT, bảng ca trực cố định hàng tuần, danh sách đơn nghỉ phép và duyệt đơn bảo lưu lịch (T07).
  - [x] **105.7 Lịch toàn phòng**: `BookingsPage` lịch tập 1-1, lọc trạng thái, hủy lịch hộ hội viên với cảnh báo chính sách 12h.
  - [x] **105.8 Điểm danh Kiosk**: `AttendancePage` nhật ký check-in/out, phân biệt Face ID/Dynamic QR, điều chỉnh đóng phiên thủ công bắt buộc lý do.
  - [x] **105.9 Báo cáo doanh thu**: `ReportsPage` biểu đồ doanh thu tuần, phân bổ ca tập theo khung giờ cao điểm, tỷ lệ hoàn thành ca PT.
  - [x] **105.10 Cấu hình hệ thống**: `SettingsPage` sức chứa 60 người, ca PT 60 phút, ngưỡng hủy lịch 12h, ngưỡng cosine 0.85, thời gian Dynamic QR 60s.
- [x] **TASK-106**: Triển khai toàn bộ màn hình Cổng Hội Viên (Member Portal):
  - [x] **106.1 Trang chủ hội viên**: `MemberHomePage` thẻ hội viên số athletic pass, bộ 3 bộ đếm PT (`total - used - reserved`), ca tập sắp tới, mật độ phòng.
  - [x] **106.2 Dynamic QR Modal**: `MemberQrModal` mã QR động ma trận, token HMAC, thanh đếm lùi 60 giây tự động làm mới.
  - [x] **106.3 Lịch tập cá nhân**: `MemberSchedulePage` danh sách ca tập sắp tới/lịch sử, hủy lịch kèm cảnh báo chính sách 12h.
  - [x] **106.4 Đặt lịch thủ công**: `MemberManualBookingPage` wizard 4 bước (Chọn PT, Chọn Ngày 7 ngày tới, Chọn Slot 60p, Xác nhận).
  - [x] **106.5 Đặt lịch thông minh CP-SAT**: `MemberSmartBookingPage` mô phỏng thuật toán OR-Tools CP-SAT, 3 phương án tối ưu độc lập, so sánh match score, khóa lịch trọn gói nguyên tử.
  - [x] **106.6 Gói tập & Mua gói**: `MemberPlansPage` xem gói tập, tạo đơn đăng ký, hướng dẫn thanh toán VietQR / tiền mặt.
  - [x] **106.7 Giáo án bài tập**: `MemberWorkoutsPage` xem giáo án cá nhân do PT giao, danh sách bài tập, sets x reps x kg, thời gian nghỉ.
  - [x] **106.8 Hồ sơ & Sinh trắc**: `MemberProfilePage` thông tin tài khoản, quản lý dữ liệu khuôn mặt và quyền xóa vĩnh viễn (GDPR Right to be Forgotten).
- [x] **TASK-107**: Triển khai toàn bộ màn hình Cổng Huấn Luyện Viên (PT Portal):
  - [x] **107.1 Ca dạy hôm nay**: `TrainerDashboardPage` danh sách ca dạy trong ngày, chỉ báo nhận diện học viên đã vào phòng qua Kiosk, nút vào buổi tập.
  - [x] **107.2 Ghi nhận buổi tập trực tiếp**: `TrainerSessionPage` đồng hồ đếm giờ 60 phút, danh sách bài tập (sets, reps, kg, hoàn thành), đánh giá thể lực, ký duyệt hoàn thành buổi tập nguyên tử.
  - [x] **107.3 Lịch làm việc tuần**: `TrainerSchedulePage` ca trực tuần, đơn xin nghỉ phép kèm cảnh báo bảo lưu lịch cho học viên.
  - [x] **107.4 Học viên phụ trách**: `TrainerMembersPage` danh sách học viên kèm 1-1, số buổi còn lại, mức độ chuyên cần.
  - [x] **107.5 Soạn giáo án**: `TrainerWorkoutPlansPage` soạn giáo án, danh sách động tác và gán cho học viên.
- [x] **TASK-108**: Triển khai Màn hình Kiosk Cảm ứng Sảnh (Kiosk Screen):
  - [x] **108.1 Giao diện Fullscreen 100vw x 100vh**: `KioskPage` tối ưu cảm ứng, đồng hồ số thời gian thực, đồng hồ đo mật độ (32/60).
  - [x] **108.2 Bộ chuyển chế độ lớn**: [ VÀO (CHECK-IN) ] và [ RA (CHECK-OUT) ] nút bấm Volt to bản.
  - [x] **108.3 Khung quét đa chế độ**: Nhận diện khuôn mặt (Face ID), Quét mã Dynamic QR, và Đăng ký mẫu khuôn mặt có nhân viên hỗ trợ (Staff Enrollment 5 mẫu kèm consent_at).
  - [x] **108.4 Phản hồi tức thì < 0.8s**: Overlay kết quả toàn màn hình (Cửa đã mở, tên hội viên, số ngày còn lại, số buổi PT, tự đóng sau 3.5s; hoặc Từ chối ra vào có lý do).
  - [x] **108.5 Thanh phím mô phỏng kiểm thử**: Thử nghiệm tức thì 4 ca nghiệp vụ (Hội viên hợp lệ, Tài khoản bị khóa, Không khớp mặt, Quá tải 60/60).
- [x] **TASK-109**: Kết nối điều hướng tổng thể trong `AppRoutes.tsx` và Header demo role switcher.
- [x] **TASK-110**: Kiểm thử TypeScript strict (`npx tsc -b`) đạt 0 lỗi và đóng gói sản phẩm hoàn chỉnh (`npm run build`) trong 15.76s.
- [x] **TASK-111**: Chuẩn hóa Nghiệp vụ Cấp phát Tài khoản Tập trung (Centralized Account Provisioning):
  - [x] **111.1**: Cập nhật `design.md` (Mục 2.1, 2.2, 5, 6) chốt mô hình Quản lý/Lễ tân cấp phát tài khoản có kiểm soát an ninh cho cả Hội viên (kèm gói tập ban đầu) và PT (kèm ca trực, chuyên môn, giới hạn giờ dạy).
  - [x] **111.2**: Điều chỉnh `LoginPage`: Thay link tự đăng ký bằng thông báo hướng dẫn đăng ký trực tiếp tại quầy lễ tân để nhận tài khoản kích hoạt.
  - [x] **111.3**: Tối ưu `AddMemberDialog` tại `/admin/members`: Cấp tài khoản định danh, chọn gói tập, thu tiền mặt/chuyển khoản, cấp mật khẩu mặc định `SmartGym@123`.
  - [x] **111.4**: Bổ sung `AddTrainerDialog` tại `/admin/trainers`: Cấp tài khoản nội bộ cho PT kèm chuyên môn, giới hạn giờ dạy (CP-SAT bound), mật khẩu mặc định `SmartGym@PT123`.
  - [x] **111.5**: Nâng cấp `MemberProfilePage`: Bổ sung form đổi mật khẩu cá nhân bảo mật và cập nhật mục tiêu rèn luyện/thông tin liên hệ.
  - [x] **111.6**: Xây dựng `UserDropdown` phong cách Facebook: Avatar tròn kèm mũi tên chevron nhỏ ở góc dưới, mở thẻ menu hồ sơ cá nhân nổi bật, các nút tính năng bo tròn có icon xám và mũi tên điều hướng, phím tắt Dynamic QR, đổi mật khẩu và nút Đăng xuất chuyển về `/auth/login`. Tích hợp đồng bộ cho Cổng Hội viên (`MemberLayout`), Cổng PT (`TrainerLayout`) và Cổng Quản lý (`Header`).
  - [x] **111.7**: Tối ưu cân đối trung tâm cho 2 thanh trên cùng (Top Header & Navigation Tabs) tại Cổng Hội viên và Cổng PT: Bao bọc nội dung trong container `max-w-6xl w-full mx-auto`, căn giữa toàn bộ các tab điều hướng (`justify-center`), khắc phục triệt để tình trạng lệch trái và khoảng trống thừa bên phải.
  - [x] **111.8**: Xây dựng & Tích hợp Tính năng Đánh giá PT (PT Rating & Review):
    - Bổ sung quy tắc nghiệp vụ trong `design.md`: Đánh giá 1 lần (idempotency) sau khi ca tập hoàn thành (`COMPLETED`), thu thập số sao (1-5★), tiêu chí nhanh (tags) và nhận xét.
    - Xây dựng modal tương tác `ReviewTrainerModal.tsx` tại Cổng Hội viên (`/app/schedule`).
    - Hiển thị huy hiệu đánh giá sao vàng, nhận xét đã gửi và nút "Đánh giá PT" trực quan.
    - Hiển thị điểm rating trung bình của từng PT tại Cổng Quản trị (`TrainersPage`).
  - [x] **111.9**: Kiểm tra toàn bộ codebase đạt 0 lỗi TypeScript strict (`npx tsc -b`) và đóng gói thành công (`npm run build`).
  - [x] **111.10**: Tối ưu thanh chức năng điều hướng và lược bỏ mật độ phòng tập:
    - Loại bỏ hoàn toàn widget mật độ phòng tập (`Mật độ phòng tập: 32/60`) trên header Cổng Hội viên (`MemberLayout`) và Cổng PT (`TrainerLayout`).
    - Điều chỉnh thanh điều hướng chức năng bên dưới (`nav`) với lớp nền đen trải dài 100% toàn màn hình (`w-full bg-darksidebar-bg border-b border-darksidebar-border shadow-sm`), trong khi các tab nội dung bên trong được bao bọc trong container `max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2`, khớp hoàn hảo với chiều ngang của các thẻ thông tin bên dưới.
    - Bổ sung thanh điều hướng đáy di động cho Cổng PT (`TrainerLayout`) đồng bộ với Cổng Hội viên.

---

## Phase 2: Database & Backend Core Architecture (Sắp tới)
> **Mục tiêu**: Xây dựng NestJS Modular Monolith, PostgreSQL 16 + pgvector, Prisma ORM, GiST Exclusion Constraints, Argon2id, JWT, RBAC Guards.
