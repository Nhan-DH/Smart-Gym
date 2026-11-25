# Rule: Security & Data Privacy

Quy chuẩn an toàn thông tin, bảo vệ dữ liệu sinh trắc học và kiểm soát truy cập cho SmartGym.
Áp dụng cho mọi tầng hệ thống từ Web, API, Database đến Engine AI.

---

## 1. Bảo vệ Dữ liệu Sinh trắc học Khuôn mặt (Biometric Privacy)

SmartGym tuân thủ nghiêm ngặt các nguyên tắc bảo vệ quyền riêng tư cá nhân:

1. **Đồng thuận rõ ràng (Informed Consent)**:
   - Chỉ được thu thập dữ liệu khuôn mặt khi có sự đồng ý minh thị từ hội viên.
   - Bắt buộc ghi nhận mốc thời gian và phiên bản chính sách: lưu trường `consent_at` và `actor_id` của nhân viên thực hiện thu mẫu vào bảng `face_templates`.
   - Không ép buộc hội viên đăng ký sinh trắc học. Cung cấp phương thức check-in bằng mã QR dự phòng có giá trị tương đương.
2. **TUYỆT ĐỐI KHÔNG LƯU ẢNH THÔ (No Raw Images in Storage)**:
   - Khung hình camera (RGB frames) chỉ được lưu tạm thời trong bộ nhớ RAM trong quá trình trích xuất đặc trưng.
   - Sau khi trích xuất vector embedding thành công, **ảnh thô phải bị hủy ngay lập tức**.
   - Cơ sở dữ liệu chỉ lưu trữ: Vector embedding (kiểu `vector(D)` trong PostgreSQL), `model_version`, và ID hội viên.
3. **Quyền được lãng quên (Right to be Forgotten)**:
   - Hội viên có quyền yêu cầu xóa mẫu sinh trắc học bất kỳ lúc nào qua API `DELETE /api/v1/members/:id/face`.
   - Khi xóa: thực hiện xóa cứng (Hard Delete) bản ghi trong `face_templates`. Đảm bảo hệ thống nhận diện không thể đối khớp lại với dữ liệu đã bị xóa.
4. **Không thu thập dữ liệu người ngoài**:
   - Chỉ thu thập mẫu của hội viên chính thức trong luồng đăng ký có quản lý xác minh. Cấm tự động chụp hoặc lưu khuôn mặt của người qua lại trước camera Kiosk.

---

## 2. Bảo mật Check-in bằng Dynamic QR Code

1. **Cơ chế Dynamic Token (HMAC Signed)**:
   - Tuyệt đối không dùng mã QR tĩnh chứa `member_id` dạng plaintext (rất dễ bị sao chép hoặc in ra giấy để gian lận).
   - Mã QR được tạo thông qua API `POST /api/v1/me/qr` trả về một JWT ngắn hạn hoặc chuỗi ký HMAC gồm:
     - `sub`: `member_id`
     - `nonce`: Chuỗi ngẫu nhiên chống replay attack
     - `exp`: Hạn sử dụng tối đa **30 - 60 giây**
     - `purpose`: `"attendance_checkin"`
2. **Tiêu thụ nguyên tử (Atomic One-Time Consumption)**:
   - Khi Kiosk quét mã QR: Backend kiểm tra chữ ký, thời hạn và đánh dấu `nonce` đã sử dụng trong Database Transaction.
   - Một mã QR chỉ được check-in/out thành công đúng 1 lần. Chụp ảnh màn hình gửi cho người khác sẽ bị từ chối do quá hạn hoặc nonce đã bị tiêu thụ.

---

## 3. Xác thực & Phân quyền (Authentication & RBAC)

1. **Mật khẩu & Token**:
   - Mật khẩu băm bằng **Argon2id** (hoặc bcrypt với cost factor tối thiểu 12).
   - JWT Access Token có thời hạn ngắn (15 phút). Refresh Token có thời hạn 7 ngày, được lưu trữ an toàn trong `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
2. **Thu hồi phiên khi Khóa tài khoản**:
   - Khi Quản lý khóa tài khoản hội viên hoặc nhân viên: Thu hồi ngay lập tức toàn bộ Refresh Token của tài khoản đó.
   - Tài khoản bị khóa sẽ nhận mã lỗi `403 Forbidden` trên toàn bộ các endpoint bảo vệ.
3. **Kiểm tra quyền sở hữu bản ghi (Record-Level Ownership)**:
   - Không chỉ kiểm tra Role, mà phải kiểm tra xem Actor có quyền trên bản ghi cụ thể đó không:
     - Hội viên chỉ được xem gói tập, lịch sử check-in, lịch tập của chính mình.
     - Huấn luyện viên (PT) chỉ được xem thông tin bài tập, ca tập của hội viên được phân công. **PT không có quyền xem thông tin thanh toán hoặc vector khuôn mặt của hội viên**.
     - Kiosk là Client được cấp quyền riêng biệt với API Token giới hạn, chỉ được gọi các endpoint check-in/out, không có quyền truy cập dữ liệu quản trị.

---

## 4. Chống Gian lận & Tấn công (Anti-Spoofing & Hardening)

1. **Anti-Spoofing cơ bản trên Kiosk**:
   - Python Engine tích hợp thuật toán kiểm tra liveness cơ bản (phát hiện chuyển động nhấp nháy, kiểm tra phản xạ ánh sáng hoặc texture bất thường) để ngăn chặn việc đưa ảnh in hoặc màn hình điện thoại trước camera.
   - Ngưỡng Cosine Similarity trong pgvector phải được hiệu chỉnh thực nghiệm. Nếu khoảng cách tương đồng nằm trong vùng mơ hồ (ambiguous zone), Kiosk phải từ chối check-in và yêu cầu quét QR hoặc gặp lễ tân.
2. **Rate Limiting & Chống Brute Force**:
   - Giới hạn 5 lần đăng nhập sai liên tiếp trên một địa chỉ IP / email trong 15 phút.
   - Rate limit API nhận diện khuôn mặt tại Kiosk để tránh việc spam frame liên tục gây nghẽn Engine.
3. **Bảo mật Logging (Zero-Leak Logs)**:
   - Tuyệt đối không ghi mật khẩu, JWT token, payload ảnh base64, hoặc vector embedding vào console hay log files.
   - Các hành động nhạy cảm (sửa điểm danh thủ công, hoàn tiền, đổi lịch hộ) bắt buộc ghi vào bảng `audit_logs (actor_id, action, target_id, metadata, created_at)`.
