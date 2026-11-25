# Rule: Testing & Verification Standards

Quy chuẩn kiểm thử, tự động hóa kiểm thử và tiêu chí nghiệm thu cho SmartGym.
Áp dụng cho toàn bộ các module nghiệp vụ và luồng tích hợp hệ thống.

---

## 1. Chiến lược kiểm thử kim tự tháp (Testing Pyramid)

1. **Unit Tests (Kiểm thử đơn vị)**:
   - Tập trung vào các hàm tính toán nghiệp vụ thuần túy:
     - Công thức tính số lượt PT: `available = total - used - reserved`.
     - Logic kiểm tra khoảng thời gian giao nhau (Overlap calculation).
     - Kiểm tra điều kiện hoàn lượt khi hủy lịch (> 12h: hoàn lượt; <= 12h: trừ lượt).
     - Định dạng dữ liệu đầu vào cho OR-Tools solver.
2. **Integration Tests (Kiểm thử tích hợp)**:
   - Kiểm thử các luồng giao tiếp giữa NestJS Service với PostgreSQL thông qua Prisma.
   - Kiểm thử tính đúng đắn của Database Transactions: Rollback toàn bộ khi 1 bước trong luồng đặt lịch thông minh bị lỗi.
   - Kiểm thử tìm kiếm vector tương đồng (pgvector cosine similarity) với các vector mẫu đã biết trước.
3. **Concurrency & Load Tests (Kiểm thử đồng thời - Cực kỳ quan trọng)**:
   - Kiểm thử khả năng chịu tải và chống Race Condition của hệ thống đặt lịch và check-in.

---

## 2. Bộ 16 Acceptance Tests bắt buộc (T01 - T16)

Mọi tính năng liên quan đến 16 kịch bản này phải có integration test tự động chứng minh kết quả trước khi nghiệm thu:

| ID | Tình huống kiểm thử | Hành vi kỳ vọng của hệ thống |
| :--- | :--- | :--- |
| **T01** | Quản lý xác nhận thanh toán đơn hàng 2 lần liên tiếp | Chỉ tạo ra **duy nhất 1 Membership**; lần 2 trả về kết quả cũ (Idempotent). |
| **T02** | Hai hội viên cùng gửi request đặt 1 PT tại cùng 1 slot giờ đồng thời | **Chính xác 1 request thành công**; request còn lại nhận lỗi `409 Conflict`. |
| **T03** | Hội viên còn đúng 1 lượt PT, gửi 2 request đặt 2 slot khác nhau đồng thời | **Chỉ 1 slot được xác nhận thành công**; slot thứ 2 bị từ chối do không đủ lượt khả dụng. |
| **T04** | Hội viên hủy lịch trước giờ tập 14h vs hủy trước 6h | Hủy trước 14h: hoàn lại 1 lượt khả dụng (`reserved-1`). Hủy trước 6h: tính là lượt đã dùng (`reserved-1, used+1`). |
| **T05** | Đổi lịch sang một slot vừa bị người khác đặt kín | Giữ nguyên lịch cũ của hội viên; không làm mất lịch cũ khi đổi thất bại. |
| **T06** | Xác nhận phương án đặt lịch thông minh nhưng có 1 slot vừa bị chiếm | Rollback toàn bộ transaction; thông báo cho hội viên và yêu cầu tính toán lại phương án. |
| **T07** | Huấn luyện viên xin nghỉ ca đã có hội viên đặt lịch trước | Chuyển trạng thái các booking bị ảnh hưởng sang `NEEDS_RESCHEDULE`; giữ nguyên số lượt của hội viên. |
| **T08** | Người lạ hoặc khuôn mặt có điểm tương đồng không vượt ngưỡng an toàn | Kiosk từ chối check-in; không tạo bản ghi điểm danh; yêu cầu thử lại hoặc quét QR. |
| **T09** | Cùng một hội viên quét khuôn mặt liên tục 3 lần tại Kiosk | Chỉ tạo **duy nhất 1 phiên điểm danh mở** (`attendance` với `check_out_at IS NULL`). |
| **T10** | Phòng tập chỉ còn 1 chỗ trống theo sức chứa; 2 người check-in cùng lúc | **Chỉ 1 người check-in thành công**; người thứ 2 bị từ chối do phòng đã đạt sức chứa tối đa. |
| **T11** | Gói tập của hội viên hết hạn trong lúc đang tập trong phòng | Vẫn cho phép hội viên Check-out thành công tại Kiosk mà không bị chặn lỗi. |
| **T12** | Quét mã QR check-in đã qua 60 giây hoặc đã được sử dụng trước đó | Từ chối check-in; báo lỗi `401 Unauthorized` (mã QR không hợp lệ/hết hạn). |
| **T13** | Huấn luyện viên cố tình truy cập thông tin buổi tập của hội viên khác | Hệ thống chặn truy cập; trả về lỗi `403 Forbidden` hoặc `404 Not Found`. |
| **T14** | Mạng WebSocket bị rớt kết nối đột ngột giữa chừng | Client tự động reconnect; tải lại snapshot mới nhất qua REST API để đồng bộ dữ liệu. |
| **T15** | Hội viên xóa quyền đồng ý sinh trắc học và xóa khuôn mặt | Kiosk không thể nhận diện được hội viên đó nữa; tìm kiếm pgvector không trả về kết quả. |
| **T16** | Thuật toán CP-SAT không tìm được đủ số buổi theo mong muốn của hội viên | Trả về phương án tối đa có thể tìm được kèm giải thích rõ ràng, không cố tình vi phạm ràng buộc cứng. |

---

## 3. Tiêu chí hiệu năng (Performance Benchmarks)

Các chỉ số kỹ thuật mục tiêu cần đo đạc và báo cáo trong đồ án tốt nghiệp:
1. **API CRUD cơ bản**: Thời gian phản hồi p95 < **500 ms** trên môi trường thử nghiệm.
2. **Pipeline Nhận diện khuôn mặt**:
   - Từ lúc Kiosk gửi frame đến khi nhận kết quả check-in: p95 < **3.0 giây**.
   - Thời gian trích xuất vector tại Python Engine: < **1.5 giây**.
   - Thời gian tìm kiếm Cosine Similarity trong pgvector: < **100 ms**.
3. **Bộ giải xếp lịch CP-SAT**:
   - Thời gian giải bài toán 1 tuần cho 1 hội viên: giới hạn tối đa **2.0 - 3.0 giây**.
   - Phải có cơ chế ngắt solver và trả về phương án tốt nhất tìm được (`FEASIBLE`).

---

## 4. Nguyên tắc "Bằng chứng trước khi Tuyên bố" (Verification First)

Tuân thủ nghiêm ngặt skill `verification-before-completion`:
- AI **không được phép khẳng định** một module đã hoàn thành hoặc hoạt động tốt nếu chưa chạy lệnh test thực tế và kiểm tra output.
- Khi báo cáo tiến độ, luôn đính kèm log thực thi test hoặc mã lỗi cụ thể nếu có.
