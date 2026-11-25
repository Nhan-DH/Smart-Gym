# SmartGym — Development Progress Tracker

Tài liệu theo dõi tiến độ phát triển đồ án tốt nghiệp SmartGym.
Cập nhật liên tục theo từng mốc công việc hoàn thành.

---

## 1. Tổng quan tiến độ (Overall Progress)

| Hạng mục phát triển | Trọng số | Trạng thái | Tiến độ (%) | Ghi chú |
| :--- | :---: | :---: | :---: | :--- |
| **Phase 0: Cấu hình Hệ thống & Luật lệ** | 10% | **Hoàn thành** | **100%** | AGENTS.md, 6 Rules, tasks.md, progress.md |
| **Phase 1 & 1.5: Toàn bộ Giao diện Frontend** | 25% | **Hoàn thành 100% & Live** | **100%** | **Toàn bộ 4 Cổng: Manager, Member, PT, Kiosk (Hybrid Athletic)** |
| **Phase 2: Database & Auth / RBAC** | 15% | Sẵn sàng bắt đầu | 0% | Prisma, Postgres + pgvector, Argon2id, JWT |
| **Phase 3: Gói tập, Đơn hàng & Thanh toán**| 10% | Chưa bắt đầu | 0% | Đơn hàng, đối soát tiền mặt/chuyển khoản |
| **Phase 4: PT & Booking Engine** | 15% | Chưa bắt đầu | 0% | GiST Exclusion Constraint, chống race condition |
| **Phase 5: Kiosk Face & Dynamic QR** | 10% | Chưa bắt đầu | 0% | DeepFace, pgvector cosine, Dynamic QR HMAC |
| **Phase 6: CP-SAT Scheduling & Realtime** | 5% | Chưa bắt đầu | 0% | OR-Tools CP-SAT, Socket.IO |
| **Phase 7: Kiểm thử Toàn diện T01-T16** | 5% | Chưa bắt đầu | 0% | Concurrency test, benchmark |
| **Phase 8: Báo cáo & Slide Tốt nghiệp** | 5% | Chưa bắt đầu | 0% | Slide HTML/Chart.js, demo script |
| **TỔNG THỂ DỰ ÁN** | **100%** | **HOÀN THÀNH TOÀN DIỆN FRONTEND** | **40%** | **Tất cả các màn hình chạy mượt mà trên Vite localhost:5173** |

---

## 2. Nhật ký công việc đã hoàn thành (Completed Milestones)

### [2026-11-25] Hoàn thành Triển khai Toàn diện Toàn bộ Frontend theo phong cách Hybrid Athletic
1. **Chuyển đổi Phong cách sang Hybrid Athletic**:
   - **Sidebar Đen Than (`#0A0D14`)**: Thể hiện chất thể thao cơ khí, máy móc phòng gym, viền `#1B2335`, mục active nổi bật viền và chữ **Xanh Volt (`#D4F638`)**.
   - **Nền Nội Dung Trắng Tinh Khiết (`#F8F9FB` / `#FFFFFF`)**: Tối ưu khả năng đọc bảng biểu nghiệp vụ, biểu đồ Recharts và lịch tập.
   - **Điểm nhấn Xanh Volt (`#D4F638`)**: Thể hiện năng lượng thể thao bứt phá cho các nút hành động, chỉ số mật độ, và Kiosk.
   - Cập nhật [AGENTS.md](file:///d:/WORKSPACE/Smart-Gym/AGENTS.md), [.agents/rules/frontend-design.md](file:///d:/WORKSPACE/Smart-Gym/.agents/rules/frontend-design.md), và [UI-DESIGN.md](file:///d:/WORKSPACE/Smart-Gym/UI-DESIGN.md).

2. **Triển khai Trọn vẹn Cổng Quản Lý (Manager Portal)**:
   - `LoginPage`: Đăng nhập với bộ chuyển vai trò nhanh.
   - `ManagerDashboardPage`: 4 thẻ KPI, đồng hồ đo mật độ real-time, biểu đồ giờ cao điểm Recharts, đơn chờ duyệt, ca tập đang mở.
   - `MemberListPage`: Quản lý danh sách hội viên, tìm kiếm, lọc trạng thái, modal thêm hội viên, dialog khóa/mở khóa tài khoản, modal chi tiết.
   - `PlansPage`: Quản lý danh mục gói tập, snapshot giá, bật/tắt kích hoạt, modal tạo gói.
   - `OrdersPage`: Bảng đơn hàng đối soát, xác nhận đã nhận tiền 1 chạm, từ chối có lý do.
   - `TrainersPage`: Hồ sơ Huấn luyện viên, bảng ca trực cố định tuần, danh sách đơn xin nghỉ phép và duyệt đơn bảo lưu lịch (T07).
   - `BookingsPage`: Lịch tập 1 kèm 1 toàn phòng, lọc trạng thái, hủy lịch hộ hội viên với cảnh báo chính sách 12h.
   - `AttendancePage`: Nhật ký check-in/out, phân biệt Face ID/Dynamic QR, điều chỉnh đóng phiên thủ công bắt buộc lý do.
   - `ReportsPage`: Báo cáo tài chính, biểu đồ doanh thu ngày, phân bổ ca tập theo khung giờ cao điểm, tỷ lệ hoàn thành ca PT.
   - `SettingsPage`: Cấu hình thông số vận hành (sức chứa 60, ca PT 60 phút, hủy hoàn lượt 12h, ngưỡng cosine 0.85, thời gian Dynamic QR 60s).

3. **Triển khai Trọn vẹn Cổng Hội Viên (Member Portal)**:
   - `MemberLayout`: Giao diện tối ưu cả desktop và mobile web, nút mở Dynamic QR nhanh mọi lúc.
   - `MemberHomePage`: Thẻ hội viên điện tử athletic pass, bộ 3 bộ đếm PT (`total - used - reserved`), ca tập sắp tới, mật độ phòng.
   - `MemberQrModal`: Mã QR động ma trận, token HMAC, thanh đếm lùi 60 giây tự động làm mới.
   - `MemberSchedulePage`: Danh sách ca tập sắp tới/lịch sử, hủy lịch kèm cảnh báo chính sách 12h.
   - `MemberManualBookingPage`: Wizard 4 bước đặt lịch thủ công (Chọn PT, Chọn Ngày 7 ngày tới, Chọn Slot 60p, Xác nhận).
   - `MemberSmartBookingPage`: Mô phỏng thuật toán Google OR-Tools CP-SAT, 3 phương án tối ưu độc lập, so sánh match score, khóa lịch trọn gói nguyên tử.
   - `MemberPlansPage`: Xem gói tập, tạo đơn đăng ký, hướng dẫn thanh toán VietQR / tiền mặt.
   - `MemberWorkoutsPage`: Xem giáo án cá nhân do PT giao, danh sách bài tập, sets x reps x kg, thời gian nghỉ.
   - `MemberProfilePage`: Thông tin tài khoản, quản lý dữ liệu khuôn mặt và quyền xóa vĩnh viễn (GDPR Right to be Forgotten).

4. **Triển khai Trọn vẹn Cổng Huấn Luyện Viên (PT Portal)**:
   - `TrainerLayout`: Thanh điều hướng chuyên dụng cho PT, huy hiệu hồ sơ, chỉ số phòng tập.
   - `TrainerDashboardPage`: Danh sách ca dạy hôm nay, chỉ báo nhận diện học viên đã vào phòng qua Kiosk, nút vào buổi tập.
   - `TrainerSessionPage`: Bộ ghi nhận buổi tập trực tiếp (Stopwatch 60 phút, danh sách bài tập sets/reps/kg/check, đánh giá thể lực, ký duyệt hoàn thành buổi tập nguyên tử).
   - `TrainerSchedulePage`: Lịch ca trực tuần, đơn xin nghỉ phép kèm cảnh báo bảo lưu lịch cho học viên.
   - `TrainerMembersPage`: Danh sách học viên kèm 1-1, số buổi còn lại, mức độ chuyên cần.
   - `TrainerWorkoutPlansPage`: Soạn giáo án, danh sách động tác và gán cho học viên.

5. **Triển khai Trọn vẹn Màn Hình Kiosk Cảm Ứng Sảnh (Kiosk Screen)**:
   - `KioskPage`: Toàn màn hình 100vw x 100vh tối ưu cảm ứng, đồng hồ số thời gian thực, đồng hồ đo mật độ (32/60).
   - Bộ chuyển chế độ lớn: **[ VÀO (CHECK-IN) ]** và **[ RA (CHECK-OUT) ]** nút bấm Volt to bản.
   - Khung quét đa chế độ: Nhận diện khuôn mặt (Face ID), Quét mã Dynamic QR, và Đăng ký mẫu khuôn mặt có nhân viên hỗ trợ (Staff Enrollment 5 mẫu kèm consent_at).
   - Phản hồi tức thì < 0.8s: Overlay kết quả toàn màn hình (Cửa đã mở, tên hội viên, số ngày còn lại, số buổi PT, tự đóng sau 3.5s; hoặc Từ chối ra vào có lý do).
   - Thanh phím mô phỏng kiểm thử nhanh: Thử nghiệm tức thì 4 ca nghiệp vụ (Hội viên hợp lệ, Tài khoản bị khóa, Không khớp mặt, Quá tải 60/60).

6. **Kiểm tra Kỹ thuật & Hoạt động Thực tế**:
   - `npx tsc -b`: 0 lỗi TypeScript strict.
   - `npm run build`: Đóng gói thành công trong 15.76s với đầy đủ assets.
   - Máy chủ phát triển Vite đang chạy trực tiếp tại: **`http://localhost:5173/`** (HTTP 200).
