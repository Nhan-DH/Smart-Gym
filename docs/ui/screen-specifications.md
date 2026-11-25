# SmartGym — Screen Specifications & State Management

Tài liệu đặc tả chi tiết cấu trúc, phân cấp thông tin, hành động chính và ma trận 5 trạng thái (Loading, Empty, Error, Success, Exception) cho toàn bộ các màn hình trong hệ thống SmartGym.
Căn cứ: [design.md](file:///d:/WORKSPACE/Smart-Gym/design.md) và [sitemap.md](file:///d:/WORKSPACE/Smart-Gym/docs/ui/sitemap.md).

---

## 1. Quy chuẩn 5 Trạng thái Bắt buộc trên Toàn bộ Màn hình

Mỗi màn hình trong SmartGym phải xử lý trọn vẹn 5 trạng thái để đảm bảo trải nghiệm thương mại thực thụ và ngăn ngừa lỗi giao diện:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MA TRẬN 5 TRẠNG THÁI GIAO DIỆN CHUẨN                 │
├────────────────────────────────────────────────────────────────────────┤
│ 1. LOADING   : Skeleton UI tương ứng với bố cục thật (Không dùng vòng  │
│                xoay spinner giữa màn hình trắng).                      │
│ 2. EMPTY     : Minh họa icon Lucide mờ + Lời giải thích súc tích + Nút │
│                kêu gọi hành động (CTA) rõ ràng.                        │
│ 3. ERROR     : Thông báo lỗi dạng văn bản con người hiểu được + Mã lỗi │
│                nghiệp vụ + Nút Thử lại (Retry).                        │
│ 4. SUCCESS   : Phản hồi thị giác tức thì (Toast notification hoặc      │
│                Banner xanh lá) trong vòng 3 giây tự biến mất.          │
│ 5. EXCEPTION : Xử lý tranh chấp (409 Conflict), hết hạn phiên, rớt     │
│                mạng WebSocket, quá tải sức chứa phòng tập.             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Đặc tả Chi tiết Màn hình Nhóm Quản trị (Manager Web)

### 2.1 MNG-01: Manager Dashboard (`/admin/dashboard`)
- **Mục tiêu**: Cung cấp bức tranh thời gian thực về tình hình vận hành phòng Gym trong ngày.
- **Bố cục**:
  - Hàng 1 (4 KPI Cards cốt lõi):
    1. **Mật độ phòng hiện tại**: Số phiên mở / Sức chứa tối đa (Kèm thanh tiến độ màu ngữ nghĩa: Xanh < 70%, Vàng 70-90%, Đỏ > 90%).
    2. **Hội viên đang hoạt động (Active Members)**: Tổng số hội viên có thẻ còn hạn.
    3. **Doanh thu hôm nay**: Tổng tiền đơn hàng `CONFIRMED` trừ hoàn tiền (VND).
    4. **Lượt PT hoàn thành hôm nay**: Số buổi tập đã chốt kết quả.
  - Hàng 2: Biểu đồ mật độ theo giờ trong ngày (Line chart so sánh thực tế vs Baseline trung bình) + Danh sách 5 đơn hàng chờ duyệt gấp.
- **Hành động chính**: Bấm vào đơn hàng để đối soát nhanh; bấm vào Mật độ để xem danh sách phiên đang mở; lọc theo ngày.
- **Đặc tả 5 trạng thái**:
  - *Loading*: 4 khối Skeleton hình chữ nhật cho KPI Cards; Skeleton biểu đồ dạng khối xám.
  - *Empty (khi mở phòng đầu ngày)*: Mật độ hiển thị `0 / 60`; Bảng đơn hàng hiển thị icon `Inbox` + *"Chưa có đơn hàng nào phát sinh hôm nay"*.
  - *Error*: Banner đỏ đầu trang *"Không thể đồng bộ dữ liệu thời gian thực. Đang kết nối lại..."* + Nút *"Tải lại"*.
  - *Success*: Toast *"Cập nhật cấu hình phòng tập thành công"*.
  - *Exception*: WebSocket rớt mạng -> Tự động chuyển sang polling REST API mỗi 30s.

### 2.2 MNG-02: Quản lý Hội viên (`/admin/members`)
- **Mục tiêu**: Tìm kiếm, lọc và thực hiện các thao tác quản trị trên hồ sơ hội viên.
- **Bố cục**:
  - Thanh công cụ trên: Ô tìm kiếm (Tên, Email, SĐT) + Bộ lọc trạng thái (`ACTIVE`, `LOCKED`, `EXPIRED`) + Nút *"Thêm hội viên"*.
  - Bảng dữ liệu (Data Table):
    - Cột: Mã HV | Họ tên | Email | Gói tập hiện tại | Số lượt PT (còn/tổng) | Trạng thái khuôn mặt | Trạng thái tài khoản | Thao tác.
  - Phân trang dưới đáy: Hiển thị `1-20 / 450 hội viên` + Nút Previous / Next.
- **Hành động chính**:
  - Bấm vào tên để mở trang chi tiết.
  - Nút nhanh: Khóa / Mở khóa tài khoản (Hiển thị Dialog xác nhận, yêu cầu nhập lý do; khi khóa lập tức thu hồi Refresh Token).
- **Đặc tả trạng thái**:
  - *Empty (khi tìm kiếm không ra)*: Icon `SearchX` + *"Không tìm thấy hội viên nào khớp với từ khóa '{query}'"* + Nút *"Xóa bộ lọc"*.

### 2.3 MNG-05: Quản lý Đơn hàng & Thanh toán (`/admin/orders`)
- **Mục tiêu**: Đối soát các giao dịch chuyển khoản / nộp tiền mặt và kích hoạt gói tập.
- **Bố cục**:
  - 3 Tabs: `Chờ đối soát (PENDING)` | `Đã xác nhận (CONFIRMED)` | `Đã từ chối / Hủy`.
  - Danh sách đơn dạng bảng: Mã đơn | Hội viên | Gói mua | Số tiền VND | Phương thức (Tiền mặt/Chuyển khoản) | Thời gian tạo | Thao tác.
- **Hành động chính**:
  - Nút **[ Xác nhận ]**: Mở dialog xác nhận, hiển thị snapshot quyền lợi sẽ cấp. Bấm xác nhận gửi kèm header `Idempotency-Key`.
  - Nút **[ Từ chối ]**: Mở dialog bắt buộc nhập lý do từ chối (ví dụ: *"Chưa nhận được tiền vào tài khoản"*).
- **Đặc tả Exception**:
  - *Bấm xác nhận lặp do mạng lag (T01)*: Server phát hiện đơn đã `CONFIRMED` -> trả về `200 OK` kèm kết quả cũ, UI hiển thị thông báo *"Đơn hàng này đã được xác nhận trước đó"*, không cấp trùng gói.

---

## 3. Đặc tả Chi tiết Màn hình Nhóm Hội viên (Member Portal)

### 3.1 MEM-01: Trang chủ Hội viên (`/app/home`)
- **Mục tiêu**: Cung cấp thẻ tập điện tử, tra cứu số lượt PT và mở mã QR check-in nhanh.
- **Bố cục (Mobile-first)**:
  - Header: Lời chào *"Chào buổi sáng, {Tên}!"* + Icon chuông thông báo.
  - Thẻ Membership chính (Giao diện thẻ ngân hàng thể thao - Sport Card):
    - Tên gói: Ví dụ *"GÓI VIP 3 THÁNG + 24 BUỔI PT"*
    - Thời hạn: `Còn 45 ngày (Hết hạn: 15/01/2027)`
    - Quyền vào phòng: `Bình thường (ACTIVE)`
    - Chỉ số PT: `18 lượt khả dụng` (Chi tiết: 24 tổng - 4 đã tập - 2 đang giữ chỗ).
  - Khối hành động nổi bật:
    - Nút lớn kích thước 56px: **[ QUÉT MÃ QR CHECK-IN ]** (Nền Xanh lá đậm `#087A3E`, chữ trắng đậm).
  - Khối thông tin phụ: Mật độ phòng tập hiện tại (Thanh đo trực quan) + Buổi tập kế tiếp (nếu có).
- **Đặc tả Exception**:
  - *Hội viên bị khóa tài khoản*: Thẻ chuyển sang màu đỏ xám; hiển thị banner *"Tài khoản của bạn đang tạm khóa. Vui lòng liên hệ quầy lễ tân"*; vô hiệu hóa nút QR.

### 3.2 MEM-02: Modal Dynamic QR Check-in (`/app/qr-modal`)
- **Mục tiêu**: Hiển thị mã QR động có chữ ký bảo mật để quét tại camera Kiosk.
- **Bố cục**:
  - Mã QR kích thước `240 x 240px` ở chính giữa.
  - Đồng hồ đếm ngược: `Mã có hiệu lực trong: 48s` (Thanh đếm ngược thời gian từ 60s về 0s).
  - Dòng ghi chú bảo mật: *"Mã thay đổi sau mỗi 60 giây. Chống chụp màn hình gian lận"*.
  - Nút: *"Đóng"* hoặc tự động refresh mã mới khi hết 60s.
- **Hành vi thiết bị**: Tự động kích hoạt độ sáng màn hình điện thoại tối đa khi modal mở ra để camera Kiosk dễ quét.

### 3.3 MEM-05: Đặt lịch Thông minh CP-SAT (`/app/bookings/smart`)
- **Mục tiêu**: Giúp hội viên chọn lịch tập cho cả tuần chỉ trong 1 lần thiết lập, tối ưu theo thuật toán OR-Tools.
- **Bố cục dạng Wizard (3 bước)**:
  - **Bước 1 (Nhập điều kiện)**:
    - Chọn gói PT áp dụng (Hiển thị số lượt khả dụng: `Còn 12 lượt`).
    - Chọn số buổi/tuần: Slider hoặc nút chọn `[ 2 buổi ]  [ 3 buổi ]  [ 4 buổi ]`.
    - Chọn các ngày rảnh trong tuần: Nút chọn `[ T2 ] [ T3 ] [ T4 ] [ T5 ] [ T6 ] [ T7 ] [ CN ]`.
    - Chọn khung giờ rảnh: Range slider (ví dụ: `17:00 - 20:00`).
    - Huấn luyện viên ưu tiên: Dropdown chọn PT quen + Checkbox `[x] Cho phép đổi PT khác nếu PT quen kín lịch`.
    - Nút hành động: **[ TÌM PHƯƠNG ÁN TỐI ƯU ]**.
  - **Bước 2 (Xem so sánh 3 phương án gợi ý từ CP-SAT)**:
    - Hiển thị 3 Tabs: `Phương án 1 (Khuyến nghị cao nhất)` | `Phương án 2` | `Phương án 3`.
    - Chi tiết phương án 1:
      - Buổi 1: Thứ 2 (18:00 - 19:00) — PT Hoàng Long — Cơ ngực.
      - Buổi 2: Thứ 4 (18:00 - 19:00) — PT Hoàng Long — Cơ lưng.
      - Buổi 3: Thứ 6 (18:00 - 19:00) — PT Tuấn Anh — Chân & Cardio.
      - Điểm đánh giá: `98/100 (Khớp 100% giờ mong muốn, đúng PT ưu tiên 2/3 buổi)`.
  - **Bước 3 (Xác nhận)**:
    - Nút lớn: **[ XÁC NHẬN CẢ TUẦN (GIỮ 3 LƯỢT) ]**.
- **Đặc tả Exception**:
  - *Solver không tìm đủ slot (T16)*: Hiển thị thông báo màu vàng: *"Hệ thống chỉ tìm được tối đa 2/3 buổi phù hợp với các điều kiện ngặt nghèo của bạn. Xem phương án 2 buổi dưới đây hoặc mở rộng khung giờ rảnh!"*.
  - *Xung đột slot khi xác nhận (T06)*: Người khác đã đặt 1 slot trong lúc đang phân vân -> Server rollback toàn bộ, trả về 409 Conflict -> Modal hiện *"Slot Thứ 4 (18:00) vừa bị hội viên khác đặt trước. Đang tính lại phương án mới cho bạn..."*.

---

## 4. Đặc tả Chi tiết Màn hình Huấn luyện viên (PT Portal)

### 4.1 PT-01: Ca dạy Hôm nay (`/trainer/today`)
- **Mục tiêu**: Huấn luyện viên theo dõi lịch dạy trong ngày và trạng thái có mặt của học viên.
- **Bố cục**:
  - Danh sách các slot 60 phút theo dòng thời gian (Timeline):
    - Slot 14:00 - 15:00: Hội viên Lê Văn C | Trạng thái phòng: `ĐÃ CHECK-IN (13:50)` | Nút: **[ Bắt đầu buổi tập ]**.
    - Slot 16:00 - 17:00: Hội viên Phạm Thị D | Trạng thái phòng: `CHƯA CHECK-IN` | Nút: *Mờ (Chưa thể bắt đầu)*.
    - Slot 18:00 - 19:00: Slot trống trong ca làm việc.
- **Hành vi nghiệp vụ**:
  - Chỉ cho phép bấm "Bắt đầu buổi tập" khi hội viên tương ứng đã có phiên điểm danh hợp lệ đang mở tại Kiosk.

### 4.2 PT-05: Giao diện Thực thi Buổi tập (`/trainer/sessions/:id`)
- **Mục tiêu**: Nhập số liệu tập luyện thực tế theo giáo án trong lúc hướng dẫn học viên.
- **Bố cục (Tối ưu thao tác 1 tay)**:
  - Header: Tên hội viên + Mục tiêu cá nhân + Thời gian buổi tập đang trôi (`00:42:15`).
  - Danh sách bài tập dạng bảng gọn:
    - Bài 1: Barbell Bench Press (Ngực) | Dự kiến: 4 sets x 10 reps @ 60kg.
    - Input nhập thực tế: `[ Set 1: 10r @ 60kg ]` `[ Set 2: 10r @ 60kg ]` `[ Set 3: 8r @ 60kg ]` `[ Set 4: 8r @ 55kg ]`.
  - Ô nhập nhận xét: TextArea *"Hôm nay cơ ngực tốt, cần chú ý khóa khớp vai ở hiệp cuối"*.
  - Nút cố định đáy màn hình: **[ HOÀN THÀNH BUỔI TẬP ]** (Màu Xanh lá đậm `#087A3E`, chữ trắng).
- **Đặc tả Exception**:
  - Mất mạng di động trong lúc tập: Lưu tạm kết quả vào LocalStorage; khi có mạng lại gửi kèm `Idempotency-Key` cũ để đảm bảo không bị trừ lượt 2 lần.

---

## 5. Đặc tả Chi tiết Màn hình Kiosk Điểm danh (`/kiosk`)

### 5.1 KIOSK-01: Nhận diện Khuôn mặt Toàn màn hình (`/kiosk/face`)
- **Mục tiêu**: Check-in / Check-out tự động bằng khuôn mặt trong thời gian dưới 1 giây.
- **Bố cục**:
  - 100vw x 100vh. Khung hình camera chiếm 85% diện tích trung tâm, có khung viền căn chỉnh khuôn mặt (Face Alignment Guide).
  - Thanh trạng thái trên:
    - Trái: Logo SmartGym + Giờ thực tế (`17:45:02`).
    - Phải: Nút gạt chế độ kích thước 56px: **[ VÀO PHÒNG (CHECK-IN) ]** (Active) / **[ RA VỀ (CHECK-OUT) ]**.
  - Thanh hướng dẫn dưới:
    - Chữ to, độ tương phản cực đại: *"Vui lòng nhìn thẳng vào camera"*.
    - Nút phụ kích thước 48px: `[ Chuyển sang Quét mã QR trên điện thoại ]`.
- **Phản hồi Trạng thái tức thì (Hiển thị đè lên camera trong 0.8s)**:
  - *Thành công (Xanh Lá #16A34A / #087A3E)*:
    - Khung viền camera chuyển màu xanh lá sáng.
    - Modal popup xuất hiện: Icon `CheckCircle2` + Chữ to 24px: *"XIN CHÀO: NGUYỄN VĂN A!"* + Dòng phụ: *"Thẻ VIP — Còn 45 ngày | Lượt PT còn: 18"*.
    - Âm thanh: "Bíp" nhẹ xác nhận.
  - *Từ chối do Mặt lạ / Không chắc chắn (Màu vàng/cam)*:
    - Viền chuyển màu vàng.
    - Thông báo: *"Không nhận diện chắc chắn. Vui lòng thử lại hoặc chạm vào nút Quét mã QR bên dưới!"*.
  - *Từ chối do Hết hạn / Quá sức chứa (Màu đỏ)*:
    - Viền chuyển đỏ.
    - Thông báo: *"Phòng tập đã đạt sức chứa tối đa (60/60). Vui lòng chờ vài phút!"*.
