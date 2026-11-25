# Rule: Code Quality & Engineering Standards

Quy chuẩn chất lượng mã nguồn, kiến trúc code và tối ưu hóa hiệu năng cho SmartGym.
Áp dụng cho cả Frontend React (`apps/web`), Backend NestJS (`apps/api`), và Python Engine (`services/engine`).

---

## 1. Quy chuẩn TypeScript (Web & NestJS API)

1. **Chế độ kiểm tra nghiêm ngặt (Strict Type Safety)**:
   - Cấu hình `tsconfig.json`: `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
   - **Cấm sử dụng kiểu `any`**. Nếu dữ liệu động chưa xác định, dùng `unknown` và bắt buộc bọc qua Type Guard hoặc Zod/Pydantic validation.
   - Luôn khai báo tường minh kiểu trả về cho các hàm công khai (`public API methods`, `Service functions`).
2. **DTO & Request Validation trong NestJS**:
   - Mọi endpoint phải nhận payload thông qua DTO class được validate bởi `class-validator` và `class-transformer`.
   - Bật toàn cục `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
   - Dữ liệu trả về từ Controller phải được định dạng theo chuẩn chung:
     ```typescript
     interface ApiResponse<T> {
       code: string;       // Ví dụ: 'SUCCESS', 'BOOKING_CONFLICT'
       message: string;    // Thông điệp thân thiện
       data?: T;           // Payload dữ liệu
       details?: any;      // Chi tiết lỗi nếu có
       requestId: string;  // UUID để đối soát log
     }
     ```

---

## 2. Quy chuẩn React & Vercel Best Practices (`apps/web`)

Dựa trên bộ nguyên tắc từ `vercel-react-best-practices` và `vercel-composition-patterns`:

1. **Triệt tiêu Network Waterfalls (`async-parallel`)**:
   - Không gọi tuần tự các API độc lập bằng `await a; await b;`. Sử dụng `Promise.all([fetchA(), fetchB()])` để tải dữ liệu song song.
   - Đẩy các điều kiện kiểm tra đồng bộ lên trước `await` để tránh delay mạng vô ích.
2. **Kiểm soát vòng lặp Render & Re-render (`rerender-derived-state`)**:
   - **Không dùng `useEffect` để tính toán state phái sinh (derived state)**. Luôn tính toán trực tiếp trong hàm render hoặc bọc qua `useMemo` nếu thuật toán nặng.
   - Tách biệt State logic và Event Handler: đưa code xử lý tương tác người dùng vào trực tiếp event handler thay vì kích hoạt qua effect.
   - Tránh định nghĩa Component lồng bên trong Component khác (`rerender-no-inline-components`).
3. **Kiến trúc Component (Composition Patterns)**:
   - Ưu tiên **Compound Components** (ví dụ: `<Tabs>`, `<Tabs.List>`, `<Tabs.Trigger>`, `<Tabs.Content>`) để chia sẻ ngữ cảnh sạch sẽ, tránh truyền props quá sâu (prop drilling).
   - Tách biệt rõ ràng:
     - **Container / Page Component**: Chịu trách nhiệm fetch dữ liệu, xử lý router, quản lý query state.
     - **Presentational Component**: Thuần túy nhận props và render UI, không phụ thuộc vào global stores hay API clients.
4. **Tối ưu Bundle Size**:
   - Import trực tiếp từ file cụ thể, tránh các barrel file khổng lồ làm phình bundle (`bundle-barrel-imports`).
   - Sử dụng dynamic import (`React.lazy`) cho các module nặng như: Chart.js, Camera Video Stream, QR Scanner, Modal báo cáo lớn.

---

## 3. Quy chuẩn Python Code (`services/engine`)

1. **Tuân thủ PEP 8 & Typing**:
   - Sử dụng Type Hints cho 100% hàm và biến: `def extract_embedding(image_bytes: bytes) -> list[float]:`.
   - Toàn bộ Schema đầu vào/đầu ra phải định nghĩa bằng **Pydantic v2** (`BaseModel`).
2. **Quản lý tài nguyên & Bộ nhớ**:
   - Giải phóng bộ nhớ đệm OpenCV (`cv2.destroyAllWindows()`, giải phóng video capture handles).
   - Tránh nạp lại trọng số mô hình DeepFace sau mỗi request: khởi tạo model singleton một lần duy nhất lúc FastAPI startup.
3. **Xử lý ngoại lệ rõ ràng**:
   - Bắt các lỗi cụ thể (`FaceNotFoundError`, `LowQualityImageError`, `SolverTimeoutError`), không dùng khối `except Exception:` chung chung làm ẩn giấu lỗi.
   - Trả HTTP status codes chính xác: `422 Unprocessable Entity` khi ảnh không nhận diện được mặt; `408 Request Timeout` khi CP-SAT chạm ngưỡng thời gian tối đa.

---

## 4. Quản lý Idempotency & Clean Code

1. **Idempotency Key**:
   - Header `Idempotency-Key: <UUID>` là bắt buộc trên các endpoint:
     - `POST /api/v1/orders/:id/confirm`
     - `POST /api/v1/bookings`
     - `POST /api/v1/bookings/confirm-plan`
     - `POST /api/v1/attendance/face`
     - `POST /api/v1/attendance/qr`
   - Nếu client gửi lại cùng một key với cùng payload: trả về kết quả đã lưu trước đó kèm header `X-Cache: IDEMPOTENT-HIT`.
   - Nếu cùng key nhưng khác payload: trả ngay `409 Conflict`.
2. **Không Mock trong Code chính thức**:
   - Không được viết hardcode `return { success: true }` để vượt qua kiểm tra. Mọi logic phải được kiểm chứng bằng cơ sở dữ liệu thật hoặc test harness chuẩn.
