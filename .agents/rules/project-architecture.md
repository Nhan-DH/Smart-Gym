# Rule: Project Architecture

Quy chuẩn kiến trúc hệ thống dự án SmartGym.
Áp dụng cho toàn bộ quá trình thiết kế, tổ chức module và giao tiếp giữa các thành phần.

---

## 1. Nguyên tắc cốt lõi (Core Architectural Principles)

1. **Modular Monolith với NestJS**:
   - Backend được tổ chức thành các Domain Modules độc lập, có ranh giới rõ ràng trong một codebase duy nhất.
   - Không chia tách microservices phức tạp ở phạm vi đồ án một cơ sở Gym. Đảm bảo tính dễ giải thích, dễ triển khai local và dễ debug.
2. **Phân định ranh giới trách nhiệm (Separation of Concerns)**:
   - **NestJS Core API**: Sở hữu toàn bộ business logic, RBAC, kiểm tra quyền sở hữu bản ghi, database transactions và phát sự kiện realtime.
   - **Python AI Engine (FastAPI)**: Đóng vai trò **Stateless Computation Service**. Chỉ nhận dữ liệu đầu vào (ảnh khuôn mặt hoặc ma trận ràng buộc), tính toán và trả kết quả. Python Engine **KHÔNG kết nối trực tiếp vào cơ sở dữ liệu**.
   - **PostgreSQL 16 + pgvector**: Nguồn chân lý duy nhất (Single Source of Truth) cho cả dữ liệu quan hệ và vector embeddings.
3. **Tính toàn vẹn dữ liệu (Data Integrity First)**:
   - Tất cả các thao tác thay đổi số dư lượt tập, đặt lịch, check-in phòng tập phải được thực thi trong Database Transaction với Isolation Level phù hợp (`ReadCommitted` hoặc `Serializable` khi xử lý tranh chấp).
   - Tuyệt đối không tính toán số dư hoặc kiểm tra xung đột chỉ ở phía client.

---

## 2. Cấu trúc thư mục chuẩn (Repository Structure)

```
smartgym/
├── .agents/
│   ├── rules/                 # Bộ quy chuẩn hệ thống (Architecture, Design, Security...)
│   └── skills/                # 33 Agent Skills đã cài đặt
├── apps/
│   ├── web/                   # Frontend React 19 + TypeScript + Vite + Tailwind + shadcn
│   │   ├── src/
│   │   │   ├── api/           # API clients & Typed hooks
│   │   │   ├── components/    # Reusable UI primitives (Buttons, Tables, Dialogs...)
│   │   │   ├── features/      # Feature modules (auth, booking, kiosk, attendance, pt...)
│   │   │   ├── layouts/       # Dashboard, Kiosk & Public layouts
│   │   │   └── routes/        # Router configuration
│   └── api/                   # Backend NestJS Modular Monolith
│       ├── prisma/            # schema.prisma, migrations, seed.ts
│       └── src/
│           ├── common/        # Decorators, Filters, Guards, Interceptors, Pipes
│           └── modules/       # Domain modules:
│               ├── auth/              # JWT, Argon2id, RBAC
│               ├── members/           # Hồ sơ hội viên
│               ├── plans/             # Gói tập
│               ├── orders-payments/   # Đơn hàng, thanh toán tiền mặt/chuyển khoản
│               ├── trainers/          # Hồ sơ PT, ca làm việc, nghỉ phép
│               ├── bookings/          # Đặt lịch thủ công, thông minh, đổi/hủy
│               ├── attendance/        # Check-in Kiosk (Face & QR)
│               ├── workout-plans/     # Giáo án & ghi nhận kết quả tập
│               ├── notifications/     # Thông báo hệ thống & WebSocket
│               └── reports/           # Thống kê doanh thu, mật độ, lượt PT
├── services/
│   └── engine/                # Python FastAPI Engine
│       ├── face/              # Trích xuất vector (DeepFace), liveness & quality
│       ├── scheduling/        # Bộ giải OR-Tools CP-SAT
│       ├── main.py            # FastAPI entry point
│       └── requirements.txt
├── docs/                      # Tài liệu đồ án, quyết định kiến trúc (ADR)
├── docker-compose.yml         # Postgres 16 + pgvector, Backend, Engine, Web
├── AGENTS.md                  # Nguyên tắc phát triển tổng thể
├── tasks.md                   # Danh sách công việc
└── progress.md                # Theo dõi tiến độ
```

---

## 3. Quy chuẩn Cơ sở dữ liệu & Ràng buộc toàn vẹn

1. **Khóa chính & Thời gian**:
   - Sử dụng `UUIDv4` cho toàn bộ các bảng nghiệp vụ.
   - Thời gian luôn lưu trữ dưới dạng `TIMESTAMPTZ` (UTC). Hiển thị trên client theo timezone `Asia/Ho_Chi_Minh`.
   - Tiền tệ (VND) lưu dưới dạng `BIGINT` hoặc `NUMERIC(15, 0)` nguyên.
2. **Exclusion Constraints cho Booking (Chống trùng lịch 100%)**:
   - Cài đặt extension `btree_gist` trong PostgreSQL.
   - Áp dụng Exclusion Constraint cho khoảng thời gian `tstzrange(starts_at, ends_at, '[)')`:
     - Không cho phép 1 Trainer có 2 booking trùng thời gian ở trạng thái `CONFIRMED`.
     - Không cho phép 1 Member có 2 booking trùng thời gian ở trạng thái `CONFIRMED`.
3. **Partial Unique Index cho Attendance**:
   - Mỗi hội viên chỉ được có **tối đa 1 phiên check-in đang mở**:
     ```sql
     CREATE UNIQUE INDEX idx_attendance_member_open 
     ON attendance(member_id) 
     WHERE check_out_at IS NULL;
     ```
4. **Idempotency Keys**:
   - Bảng `idempotency_keys (actor_id, key, request_hash, response, expires_at)`.
   - Mọi API thanh toán, xác nhận lịch, check-in phải kiểm tra key để chống gửi lặp do rớt mạng.

---

## 4. Giao tiếp giữa các thành phần

- **Client <-> NestJS**:
  - RESTful API chuẩn: `/api/v1/...`
  - Chuẩn hóa lỗi: `{ code: string, message: string, details?: any, requestId: string }`
  - WebSocket (Socket.IO): Sự kiện realtime (`occupancy.updated`, `booking.updated`, `notification.created`). Chỉ emit sự kiện **sau khi database transaction đã commit thành công**.
- **NestJS <-> Python Engine**:
  - Giao tiếp qua HTTP REST nội bộ (hoặc gRPC nếu cần benchmark cao hơn).
  - Timeout giới hạn: nhận diện khuôn mặt tối đa 2.5s; tối ưu xếp lịch CP-SAT tối đa 3s.
  - Xử lý graceful fallback nếu Python Engine tạm thời không phản hồi (HTTP 503).
