# SmartGym --- Software Design Document

Phiên bản 1.0 \| Phạm vi: đồ án cá nhân, một cơ sở Gym.

## 1. Mục tiêu và phạm vi

Web responsive cho quản lý, hội viên và PT. Hệ thống tự động là nhóm xử lý nội bộ, không phải actor bên ngoài trong UML. Hai trọng tâm: nhận diện khuôn mặt và tối ưu lịch PT. Thanh toán tiền mặt/chuyển khoản xác nhận thủ công. Không triển khai IoT, đa chi nhánh, payroll, mobile native hay cổng thanh toán. Dự báo mật độ và tái lập lịch hàng loạt là mở rộng.

## 2. Nghiệp vụ và ngoại lệ

### 2.1 Quản lý

-   Tài khoản: tạo PT, khóa/mở khóa hội viên, tìm kiếm, cập nhật hồ sơ. Email duy nhất; không xóa lịch sử khi khóa tài khoản; thu hồi phiên đăng nhập khi khóa.
-   Gói tập: tạo/sửa/ngừng bán, giá VND, thời hạn, quyền vào phòng, số lượt PT. Giá và quyền lợi đã bán được snapshot; không sửa hồi tố. Gói ngừng bán vẫn có hiệu lực với người đã mua.
-   Thanh toán: xem đơn chờ, đối chiếu tiền mặt/chuyển khoản, xác nhận hoặc từ chối có lý do. Thiếu tiền: giữ trạng thái chờ; thừa tiền: xử lý thủ công; xác nhận lặp không tạo thêm gói. Hoàn tiền là giao dịch điều chỉnh có nhật ký; kiểm tra lịch tương lai trước khi thu hồi quyền lợi.
-   PT: quản lý chuyên môn, ca làm việc, giới hạn giờ/ngày, nghỉ phép. Không nhận lịch ngoài ca; nghỉ có lịch đã đặt thì chuyển sang cần sắp xếp lại, giữ lượt đến khi đổi hoặc hủy.
-   Lịch: xem lịch toàn phòng, tạo/đổi/hủy thay hội viên, áp dụng cùng ràng buộc như hội viên; không ghi đè lịch đã hoàn thành. Hủy do phòng tập hoàn lượt.
-   Khuôn mặt: xác minh danh tính, ghi nhận đồng ý, thu 3--5 mẫu đạt chất lượng, đăng ký lại/xóa theo yêu cầu. Nhiều mặt, ảnh mờ, nghi trùng danh tính: dừng và xác minh. Không ép đăng ký sinh trắc học.
-   Check-in/out: vận hành kiosk có chế độ vào/ra rõ ràng; QR dự phòng; sửa phiên quên checkout có lý do và audit. Không xác nhận thành công khi backend mất kết nối.
-   Dashboard: hội viên hoạt động, doanh thu đã xác nhận trừ hoàn tiền, lượt PT hoàn thành, số phiên đang mở, lịch sử mật độ.

### 2.2 Hội viên

-   Đăng ký/đăng nhập, cập nhật hồ sơ, mục tiêu, thời gian rảnh; email trùng thì hướng dẫn đăng nhập; tài khoản khóa không được sử dụng dịch vụ.
-   Xem gói, tạo đơn, chọn phương thức thanh toán, theo dõi trạng thái, gia hạn. Gói chưa thanh toán không cấp quyền; gia hạn cùng loại bắt đầu sau gói hiện tại theo chính sách.
-   Check-in tại kiosk bằng mặt hoặc QR; kiểm tra quyền vào phòng, giờ mở cửa, sức chứa, phiên đang mở. Không nhận diện chắc chắn thì thử lại hoặc xác minh thay thế. Check-out vẫn được phép nếu gói hết hạn trong lúc tập.
-   Đặt lịch thủ công: chọn gói PT, PT, ngày và slot 60 phút; xác nhận thì giữ một lượt. Slot vừa bị đặt: trả 409 và tải lại. Gửi lặp: trả kết quả cũ.
-   Đặt lịch thông minh: nhập số buổi/tuần, ngày/giờ rảnh, mục tiêu, PT ưu tiên, cho phép đổi PT, ưu tiên ít đông. Xem tối đa 3 phương án; đề xuất không giữ chỗ. Không đủ lượt/ngày/slot: giải thích và đề xuất một phần, không tự nới điều kiện bắt buộc. Xác nhận cả phương án trong một transaction; xung đột thì rollback và tính lại.
-   Đổi/hủy: đổi lịch thành công mới giải phóng lịch cũ. Hủy trước ít nhất 12 giờ hoàn lượt; hủy muộn hoặc vắng mặt tính lượt; PT/phòng Gym hủy luôn hoàn lượt. Đây là chính sách giả định có thể cấu hình.
-   Xem giáo án, kết quả buổi tập, lịch sử ra vào, mật độ hiện tại, thông báo trong web.

### 2.3 PT

-   Đăng nhập tài khoản quản lý cấp; cập nhật hồ sơ, chuyên môn cần quản lý xác nhận.
-   Xem ca làm việc, đề nghị nghỉ/đổi ca; quản lý duyệt; không xóa ca có lịch mà chưa xử lý lịch bị ảnh hưởng.
-   Xem lịch ngày/tuần, thông tin hội viên liên quan; không xem thanh toán hoặc vector khuôn mặt.
-   Bắt đầu buổi tập khi hội viên có phiên check-in hợp lệ; đến muộn xử lý theo quy định; vắng mặt sau thời gian chờ do quản lý cấu hình.
-   Tạo giáo án gồm bài tập, nhóm cơ, hiệp, lần, mức tạ, nghỉ; kiểm tra giá trị hợp lệ; lưu phiên bản khi cập nhật giáo án đã dùng.
-   Ghi nhận kết quả và nhận xét; hoàn thành buổi tập đúng một lần, chuyển lượt giữ thành lượt sử dụng. Mất mạng: thử lại cùng idempotency key. Sửa kết quả đã chốt cần audit.

### 2.4 Hệ thống tự động

-   Xác thực, RBAC và kiểm tra quyền sở hữu từng bản ghi.
-   Quản lý vòng đời đơn, gói, lượt PT, lịch và phiên ra vào.
-   Nhận diện khuôn mặt, kiểm tra chất lượng, anti-spoofing cơ bản, so khớp vector; không tự động chấp nhận kết quả mơ hồ.
-   Kiểm tra xung đột lịch, tối ưu lịch, xử lý đồng thời, đồng bộ WebSocket sau commit.
-   Nhắc lịch và hết hạn bằng tác vụ định kỳ; chống tạo thông báo trùng.
-   Dự báo mật độ (mở rộng): tổng hợp dữ liệu phiên ra vào, baseline trung bình cùng thứ/giờ; không dự báo khi thiếu dữ liệu.

## 3. Kiến trúc

``` mermaid
flowchart TD
  UI[React TypeScript: Manager Member PT Kiosk] --> API[NestJS modular monolith]
  API --> DB[(PostgreSQL + pgvector)]
  API --> PY[Python FastAPI: Face + Scheduling]
  API --> WS[Socket.IO]
  WS --> UI
```

React + TypeScript, NestJS, Prisma, PostgreSQL, pgvector, Python FastAPI, DeepFace/OpenCV, OR-Tools CP-SAT, Docker Compose. Python chỉ tính toán; NestJS sở hữu nghiệp vụ và ghi DB. Không cần Redis/Kafka/Kubernetes ở MVP. Kiểm tra giấy phép từng mô hình AI trước khi sử dụng. Camera chạy trên localhost hoặc HTTPS. Kiosk là màn hình được quản lý cấp quyền, không phải API check-in công khai.

## 4. Thiết kế dữ liệu

  --------------------------------------------------------------------------------------------------------------------------------------------
  Bảng                                Trường chính
  ----------------------------------- --------------------------------------------------------------------------------------------------------
  users                               id, email unique, password_hash, role, status, phone, name

  member_profiles                     user_id PK/FK, goal

  trainer_profiles                    user_id PK/FK, bio, specialties, daily_limit_minutes

  gym_settings                        id, timezone, opening_hours, member_capacity, cancel_hours, max_parallel_pt

  plans                               id, name, price_vnd, duration_days, pt_sessions, gym_access, status

  orders                              id, member_id, plan_id, snapshot, amount_vnd, status

  payments                            id, order_id, amount_vnd, method, status, confirmed_by, confirmed_at

  memberships                         id, member_id, order_id unique, starts_at, ends_at, total_pt, used_pt, reserved_pt, gym_access, status

  trainer_shifts                      id, trainer_id, starts_at, ends_at

  leave_requests                      id, trainer_id, starts_at, ends_at, status

  bookings                            id, member_id, trainer_id, membership_id, starts_at, ends_at, status, cancellation_reason

  attendance                          id, member_id, check_in_at, check_out_at nullable, method, correction_reason

  face_templates                      id, member_id, embedding vector(D), model_version, consent_at, created_at

  workout_plans                       id, member_id, trainer_id, version, status, title

  workout_items                       id, workout_plan_id, exercise, sets, reps, weight, rest_seconds

  workout_results                     id, booking_id, item_id, actual_sets, actual_reps, actual_weight, notes

  notifications                       id, user_id, type, payload, read_at, dedup_key

  audit_logs                          id, actor_id, action, target_id, metadata, created_at

  idempotency_keys                    actor_id, key, request_hash, response, expires_at
  --------------------------------------------------------------------------------------------------------------------------------------------

D phụ thuộc mô hình embedding. UUID cho khóa; timestamptz lưu UTC, hiển thị Asia/Ho_Chi_Minh; VND dùng bigint hoặc numeric nguyên. Khoảng thời gian \[start,end). Foreign keys, CHECK end \> start, CHECK used_pt + reserved_pt \<= total_pt và các số không âm. Một attendance mở/hội viên bằng partial unique index. Exclusion constraints GiST cho trainer_id và member_id trên khoảng thời gian booking đang chiếm chỗ; dùng migration SQL với btree_gist. Không xóa cứng giao dịch cần lưu giữ; dữ liệu sinh trắc học có quy trình xóa riêng.

## 5. Trạng thái và quy tắc

-   Order: PENDING → CONFIRMED / REJECTED / CANCELLED; CONFIRMED → REFUNDED qua nghiệp vụ điều chỉnh.
-   Membership: SCHEDULED → ACTIVE → EXPIRED; CANCELLED nếu thu hồi. Hết lượt PT là thuộc tính quyền lợi, không đồng nghĩa mất quyền vào Gym.
-   Booking: CONFIRMED → IN_PROGRESS → COMPLETED; CONFIRMED → CANCELLED / NO_SHOW / NEEDS_RESCHEDULE. NEEDS_RESCHEDULE giữ lượt nhưng không chiếm slot cũ; đổi thành CONFIRMED hoặc CANCELLED.
-   Attendance: OPEN → CLOSED; cờ cần xác minh độc lập với trạng thái.
-   Available PT = total - used - reserved. Đặt: reserved+1; hoàn thành/hủy muộn/vắng: reserved-1, used+1; hủy đúng hạn/do Gym: reserved-1. Mỗi chuyển trạng thái chỉ thực hiện một lần.
-   Gói phải bao phủ toàn bộ thời gian buổi PT. Không trùng PT hoặc hội viên. Mỗi ngày tối đa một buổi trong đề xuất thông minh (giả định MVP). Không tự thay đổi lịch đã xác nhận.
-   Kiểm tra quyền vào phòng và quyền PT riêng biệt. Check-out không bị chặn bởi hết hạn gói.

## 6. API dự kiến

Prefix /api/v1. JSON, JWT, validate DTO. Lỗi dạng {code,message,details,requestId}. 401 chưa xác thực; 403 không có quyền; 404 không tồn tại; 409 xung đột; 422 vi phạm nghiệp vụ; 503 dịch vụ tạm lỗi.

  -----------------------------------------------------------------------------------------------------
  Method + path                                                   Vai trò / mục đích
  --------------------------------------------------------------- -------------------------------------
  POST /auth/register, /auth/login, /auth/refresh, /auth/logout   đăng ký hội viên, xác thực

  GET/PATCH /me                                                   hồ sơ cá nhân

  GET /members; PATCH /members/:id/status                         Manager

  GET /plans; POST /plans; PATCH /plans/:id                       xem công khai; ghi Manager

  POST /orders; GET /me/orders                                    Member

  POST /orders/:id/confirm; /orders/:id/reject                    Manager

  GET /me/memberships                                             Member

  GET /trainers; POST /trainers; PATCH /trainers/:id              xem Member; ghi Manager

  GET /trainers/:id/availability                                  Member/Manager

  POST /leave-requests; POST /leave-requests/:id/approve          PT/Manager

  POST /bookings; GET /bookings                                   theo phạm vi quyền

  POST /bookings/suggest                                          Member, trả phương án không giữ chỗ

  POST /bookings/confirm-plan                                     Member, xác nhận nguyên tử

  POST /bookings/:id/reschedule; /bookings/:id/cancel             Member/Manager theo quyền

  POST /bookings/:id/start; /complete; /no-show                   PT phụ trách

  POST /members/:id/face/enroll; DELETE /members/:id/face         Manager có xác minh/đồng ý

  POST /attendance/face; /attendance/qr                           kiosk được cấp quyền, mode IN/OUT

  POST /me/qr                                                     Member, token ngắn hạn

  POST /attendance/:id/correct                                    Manager, audit

  GET /occupancy; GET /me/attendance                              mật độ/lịch sử cá nhân

  POST /workout-plans; PATCH /workout-plans/:id                   PT phụ trách

  GET /me/workout-plans; POST /bookings/:id/results               Member/PT tương ứng

  GET /notifications; PATCH /notifications/:id/read               người sở hữu

  GET /reports/overview                                           Manager
  -----------------------------------------------------------------------------------------------------

Các API ghi quan trọng hỗ trợ Idempotency-Key; cùng key khác payload trả 409. Phân trang danh sách. WebSocket events: occupancy.updated, booking.updated, notification.created; chỉ gửi dữ liệu cá nhân vào room đã xác thực; reconnect tải snapshot qua REST.

## 7. Face Recognition Engine

1.  Enrollment tại kiosk: quản lý xác minh danh tính và consent; thu mẫu; phát hiện đúng một mặt; kiểm tra chất lượng, liveness; căn chỉnh; trích xuất embedding; kiểm tra mẫu nhất quán và nghi trùng; lưu template phiên bản mô hình. Không lưu ảnh thô mặc định.
2.  Recognition: camera gửi frame giới hạn kích thước/tần suất; Python kiểm tra chất lượng và anti-spoofing, trả embedding; backend tìm top candidates bằng cosine similarity trong pgvector. Chỉ chấp nhận nếu vượt ngưỡng đã hiệu chỉnh và cách biệt đủ với ứng viên khác; không coi similarity là xác suất.
3.  NestJS kiểm tra quyền lợi và ghi attendance. Không tin member_id hoặc điểm nhận diện do browser tự khai.
4.  QR dự phòng: token HMAC có subject, nonce, exp, purpose; dùng một lần, xác thực server và consume nguyên tử. Không dùng QR tĩnh chứa mã hội viên làm bằng chứng duy nhất.
5.  Lỗi camera, nhiều mặt, ánh sáng yếu, mặt lạ, nghi ảnh/video, timeout: không ghi attendance; thử lại hoặc QR/xác minh thủ công. Anti-spoofing camera RGB không bảo đảm tuyệt đối.
6.  Kiểm thử với người tình nguyện đồng ý: FAR/FRR, tỷ lệ nhận diện đúng 1:N, false identification, độ trễ p50/p95; chia mẫu hiệu chỉnh và kiểm thử độc lập; thử điều kiện ánh sáng/góc/ảnh giả. So sánh cosine và Euclidean nếu phù hợp; exact search trước, HNSW chỉ khi benchmark cần.

## 8. Scheduling Engine

MVP: slot 60 phút cố định, lập lịch một hội viên trong 7 ngày; tối ưu hàng loạt là mở rộng. Input gồm thời gian rảnh, số buổi, gói, PT ưu tiên, chuyên môn, ca, lịch đã đặt, giới hạn ngày, mật độ dự báo tùy chọn.

-   Sinh ứng viên (PT, slot) hợp lệ; loại lịch ngoài ca, nghỉ, ngoài hạn gói, trùng lịch, sai chuyên môn bắt buộc.
-   Overlap: a.start \< b.end AND b.start \< a.end. Hai lịch liền kề không trùng.
-   Biến nhị phân x\[p,t\] biểu thị chọn PT p tại slot t. Tổng x \<= min(số buổi yêu cầu, lượt khả dụng). Mỗi ngày \<= 1; mỗi slot \<= 1; giới hạn PT và số buổi đồng thời còn khả dụng.
-   Tối ưu hai giai đoạn: tối đa số buổi; sau đó tối đa điểm ưu tiên trong số buổi đạt được. Điểm nguyên có trọng số PT, giờ mong muốn, khoảng cách buổi, mật độ nếu có. Trọng số cấu hình và ghi trong báo cáo.
-   CP-SAT giới hạn thời gian (ví dụ 2 giây, cần benchmark); trả FEASIBLE/OPTIMAL hoặc không có phương án; không gọi FEASIBLE là tối ưu đã chứng minh. Có thể lấy 3 phương án khác nhau bằng ràng buộc loại nghiệm cũ.
-   Baseline FCFS/greedy cùng dữ liệu, so sánh số buổi, điểm ưu tiên, thời gian chạy và số vi phạm (phải bằng 0).
-   Confirm: không tin kết quả solver cũ; kiểm tra lại tất cả ràng buộc trong transaction. Khóa membership và tài nguyên liên quan theo thứ tự nhất quán; exclusion constraint chống trùng; rollback toàn bộ nếu lỗi. Kiểm tra ca/nghỉ và giới hạn đồng thời bằng khóa tài nguyên tương ứng.

## 9. Đồng thời và mật độ

-   Attendance: khóa bản ghi gym_settings trong transaction check-in để kiểm tra sức chứa rồi insert; unique index chống phiên trùng. Check-out/correction cũng tuân thủ quy ước khóa. Không tăng/giảm bộ đếm dựa trên sự kiện client.
-   Occupancy = số phiên mở / sức chứa hội viên. Đây là mật độ hội viên ghi nhận, không phải tổng số người vật lý gồm nhân viên. Quên checkout cần quản lý xác minh; không tự bịa thời gian ra.
-   Booking: khóa quyền lợi, kiểm tra trạng thái, cập nhật lượt và lịch nguyên tử. Retry lỗi serialization/deadlock có giới hạn. WebSocket chỉ phát sau commit; reconnect đọc DB.
-   Dự báo mở rộng: tính số phiên giao với từng mốc giờ; so sánh trung bình cùng thứ/giờ với exponential smoothing, chia train/test theo thời gian, MAE/RMSE. Dữ liệu giả lập phải ghi rõ.

## 10. Bảo mật và yêu cầu phi chức năng

-   Argon2id/bcrypt, HTTPS, RBAC, kiểm tra ownership, rate limit login và recognition, validate file/frame, không ghi token/ảnh/vector vào log.
-   Consent riêng cho sinh trắc học, QR thay thế, quyền xóa, giới hạn lưu giữ, mã hóa lưu trữ và backup, khóa truy cập DB. Không công khai danh tính hội viên trên màn hình chung quá mức cần thiết. Không thu dữ liệu người ngoài để thử nghiệm.
-   Mục tiêu thử nghiệm: 100 yêu cầu đặt cùng slot chỉ một thành công; không âm lượt; không vượt sức chứa ghi nhận; p95 API CRUD dưới 500 ms và nhận diện dưới 3 giây trên máy thử nghiệm là mục tiêu, không phải kết quả đã đo.

## 11. Cấu trúc repository đề xuất

    smartgym/
      design.md
      README.md
      .env.example
      docker-compose.yml
      apps/web/src/{features,components,api,routes}/
      apps/api/src/{auth,members,plans,payments,trainers,bookings,attendance,notifications,reports}/
      apps/api/prisma/{schema.prisma,migrations}/
      services/engine/{main.py,face/,scheduling/,tests/,requirements.txt}
      tests/{integration,load}/
      docs/{api,decisions}/

## 12. Kế hoạch triển khai 12 tuần

  -------------------------------------------------------------------------------------------------------------------
  Tuần                    Công việc                                      Điều kiện hoàn thành
  ----------------------- ---------------------------------------------- --------------------------------------------
  1--2                    ERD, UI, repo, auth                            chạy local, RBAC test

  3--4                    Hội viên, PT, gói, thanh toán                  kích hoạt đúng một lần

  5--6                    Booking thủ công, lượt PT                      test concurrency, hủy/đổi

  7--8                    Face enrollment, recognition, QR, attendance   demo nhận diện và fallback

  9--10                   CP-SAT, đề xuất lịch, realtime                 so sánh baseline, không vi phạm constraint

  11                      Giáo án cơ bản, dashboard, kiểm thử            luồng end-to-end

  12                      Báo cáo, demo, sửa lỗi                         README và kết quả benchmark
  -------------------------------------------------------------------------------------------------------------------

## 13. Acceptance tests tối thiểu

  ---------------------------------------------------------------------------------------------------------
  ID                      Tình huống                              Kết quả
  ----------------------- --------------------------------------- -----------------------------------------
  T01                     Xác nhận đơn hai lần                    một membership

  T02                     Hai request đặt cùng PT/slot            một thành công

  T03                     Còn một lượt, đặt hai slot đồng thời    một thành công

  T04                     Hủy đúng hạn/hủy muộn                   hoàn lượt/tính lượt đúng

  T05                     Đổi lịch sang slot đã kín               giữ nguyên lịch cũ

  T06                     Đề xuất hết hiệu lực do slot bị chiếm   rollback, yêu cầu tính lại

  T07                     PT nghỉ có lịch                         đánh dấu cần xử lý, không mất lượt

  T08                     Mặt lạ hoặc điểm mơ hồ                  không check-in

  T09                     Quét liên tục cùng người                một phiên mở

  T10                     Hai người tranh chỗ cuối                một check-in thành công

  T11                     Hết hạn trong lúc tập                   checkout thành công

  T12                     QR đã dùng/hết hạn                      từ chối

  T13                     PT xem hội viên không liên quan         403 hoặc 404

  T14                     WebSocket mất kết nối                   reconnect và tải snapshot

  T15                     Xóa consent/template                    không nhận diện lại bằng dữ liệu đã xóa

  T16                     Solver không đủ slot                    phương án một phần hoặc thông báo rõ
  ---------------------------------------------------------------------------------------------------------

## 14. Quy tắc dành cho AI coding assistant

-   Đọc design.md trước khi sửa code; kiểm tra repository hiện có, không giả định module đã tồn tại.
-   Chỉ thực hiện task được giao; không tự mở rộng phạm vi hay đổi stack. Nếu mâu thuẫn nghiệp vụ, hỏi trước hoặc ghi quyết định vào docs/decisions.
-   Mỗi task: nêu kế hoạch, file cần sửa, migration, test; triển khai từng module nhỏ; chạy test và báo kết quả thực tế.
-   Không mock thành công trong production, không hardcode secret, không bỏ qua authorization hoặc transaction để demo.
-   Không sửa/xóa dữ liệu hoặc migration đã áp dụng tùy tiện. Không ghi dữ liệu sinh trắc học vào Git.
-   Cập nhật README và design.md khi quyết định thiết kế được người dùng duyệt. Phân biệt mục tiêu, giả định và kết quả đã kiểm thử.

## 15. Các quyết định cần xác nhận trước khi code

Chính sách hủy 12 giờ, thời lượng slot 60 phút, giờ mở cửa, sức chứa, giới hạn PT, quy tắc gia hạn, ngưỡng nhận diện và thời hạn lưu sinh trắc học là cấu hình/giả định cần chốt. Chưa có dữ liệu thực tế hay benchmark. Ưu tiên P0 nghiệp vụ cơ bản, P1 face + scheduling, P2 giáo án/dashboard, P3 forecasting/rescheduling hàng loạt.
