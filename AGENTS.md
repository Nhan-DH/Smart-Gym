# SmartGym — Agent Development Principles & System Governance

Tài liệu hướng dẫn phát triển hệ thống SmartGym dành cho AI Coding Assistant và Developer.
Dự án: **Đồ án tốt nghiệp cá nhân — Hệ thống quản lý phòng Gym thông minh (1 cơ sở).**

---

## 1. Vai trò & Tôn chỉ kiến trúc

Trong dự án này, AI đóng vai trò kết hợp:
- **Senior Software Architect**: Thiết kế cấu trúc hệ thống rõ ràng, phân định ranh giới module dứt khoát, tối ưu khả năng chịu tải và tính toàn vẹn dữ liệu.
- **UI/UX Designer**: Xây dựng trải nghiệm thể thao hiện đại, nhất quán, tiện dụng cho cả 4 đối tượng (Manager, Member, Trainer, Kiosk); kiên quyết bài trừ "AI Slop".
- **Full-stack Developer**: Viết mã nguồn sạch, typed chặt chẽ, tối ưu hiệu năng, áp dụng TDD cho các logic cốt lõi.

### Nguyên tắc chỉ đạo đồ án tốt nghiệp:
1. **Đơn giản & Thực chất (Simplicity & Pragmatism)**: Ưu tiên giải pháp dễ hiểu, dễ chứng minh và giải thích lưu loát trước hội đồng chấm điểm tốt nghiệp. Không đưa vào các công nghệ thừa thãi (như Kafka, Kubernetes, Microservices phân tán) khi Modular Monolith giải quyết hoàn hảo.
2. **Toàn vẹn dữ liệu là số 1**: Tránh xung đột đặt lịch, chống race condition, không để âm lượt tập, không ghi đè dữ liệu.
3. **Bảo mật & Tôn trọng quyền riêng tư**: Xử lý dữ liệu sinh trắc học khuôn mặt theo đúng quy định pháp lý (không lưu ảnh thô, mã hóa vector, cơ chế rút lại quyền).
4. **Kỷ luật thực thi**: Không tự ý thay đổi nghiệp vụ trong `design.md`, không tự ý sinh code khi chưa thống nhất cấu hình, không tự ý commit/push Git.

---

## 2. Kiến trúc tổng thể hệ thống (System Architecture)

```
                    ┌──────────────────────────────────────────────┐
                    │               CLIENT APPLICATIONS            │
                    │   React 19 + TypeScript + Tailwind + shadcn  │
                    │   (Manager Web, Member Portal, PT, Kiosk)    │
                    └──────────────┬───────────────────▲───────────┘
                                   │ HTTPS / REST      │ WebSocket
                                   ▼                   │ (Socket.IO)
                    ┌──────────────────────────────────┴───────────┐
                    │            API GATEWAY & BUSINESS CORE       │
                    │            NestJS Modular Monolith           │
                    │         (Prisma ORM + Guards + Events)       │
                    └──────────────┬───────────────────┬───────────┘
                                   │                   │ Internal HTTP
                                   │                   ▼
                                   │    ┌──────────────────────────┐
                                   │    │      AI & OPT ENGINE     │
                                   │    │      Python FastAPI      │
                                   │    │  • DeepFace/OpenCV       │
                                   │    │  • OR-Tools CP-SAT       │
                                   │    └──────────────────────────┘
                                   ▼
                    ┌──────────────────────────────────────────────┐
                    │               DATA PERSISTENCE               │
                    │         PostgreSQL 16 + pgvector             │
                    │  • btree_gist Exclusion Constraints (Slots)  │
                    │  • Partial Unique Indexes (Attendance)       │
                    │  • Cosine Similarity Vector Matching         │
                    └──────────────────────────────────────────────┘
```

- **NestJS (Modular Monolith)**: Sở hữu toàn bộ business logic, xác thực, phân quyền (RBAC), quản lý transaction và ghi dữ liệu vào PostgreSQL.
- **Python FastAPI Engine**: Đóng vai trò **Stateless Computation Worker**, chỉ tính toán 2 nhiệm vụ nặng:
  1. Trích xuất vector đặc trưng khuôn mặt (Embedding) & kiểm tra chất lượng/liveness cơ bản.
  2. Giải bài toán tối ưu xếp lịch đa mục tiêu với Google OR-Tools (CP-SAT).
- **PostgreSQL 16 + pgvector**: Lưu trữ dữ liệu quan hệ và vector embedding (D chiều tùy model). Áp dụng `btree_gist` exclusion constraints cho các dải thời gian đặt lịch `[starts_at, ends_at)` và partial unique index cho các phiên check-in đang mở.

---

## 3. Phân loại và Ma trận sử dụng 33 Agent Skills

Workspace hiện có 33 skills trong `.agents/skills/`. Để tránh xung đột và tối ưu hóa năng suất, hệ thống phân chia thành 5 nhóm với thứ bậc ưu tiên rõ ràng:

### 3.1 Nhóm 1: UI/UX & Design Intelligence (10 skills)
- **`frontend-design` (Ưu tiên cao nhất về thẩm mỹ)**: Định hình ngôn ngữ thị giác riêng của SmartGym, loại bỏ các khuôn mẫu AI thông thường.
- **`design-system`**: Kiến tạo hệ thống token 3 lớp (Primitive -> Semantic -> Component) và biến CSS.
- **`ui-ux-pro-max`**: Cung cấp 141 quy chuẩn UX, độ tương phản (WCAG AA), kích thước cảm ứng (44x44px), spacing và layout logic.
- **`impeccable` (Cổng kiểm duyệt chất lượng - Anti-Slop)**: Rà soát giao diện, loại bỏ chi tiết thừa, gọt giũa mật độ thông tin, kiểm tra UX copy.
- **`web-design-guidelines`**: Đảm bảo tuân thủ tiêu chuẩn web hiện đại, semantic HTML, accessibility (a11y) và quản lý bàn phím/focus.
- **`ui-styling`**: Cung cấp mẫu tích hợp Tailwind CSS và shadcn/ui (chỉ dùng các pattern tối giản, không dùng hiệu ứng rườm rà).
- **`brand`**: Định hướng giọng văn, định vị thương hiệu phòng gym kỷ luật - hiện đại.
- **`banner-design`**: Thiết kế banner quảng bá các gói tập khi cần visual assets.
- **`slides`**: Tạo slide thuyết trình bảo vệ đồ án tốt nghiệp bằng HTML/Chart.js.
- **`design`**: Kỹ năng đồ họa đa năng, dùng bổ trợ khi cần mockup truyền thông.

### 3.2 Nhóm 2: React & Frontend Engineering (4 skills)
- **`vercel-react-best-practices` (Cốt lõi hiệu năng React)**: Loại bỏ network waterfalls, tối ưu hóa bundle size, quản lý re-render, memoization hợp lý.
- **`vercel-composition-patterns` (Kiến trúc component)**: Áp dụng Compound Components, Context Providers tinh gọn, Headless Hooks, tránh boolean prop explosion.
- **`vercel-react-view-transitions`**: Chuyển tab mượt mà, chuyển trang tự nhiên giữa các dashboard.
- **`vercel-optimize`**: Tối ưu hóa thời gian tải trang, Web Vitals cho production.

### 3.3 Nhóm 3: Quy trình phát triển, Test & Debugging - Superpowers (16 skills)
- **`using-superpowers`**: Kỹ năng điều phối tổng quát các skills.
- **`brainstorming`**: Động não giải pháp trước khi bắt tay vào thiết kế logic phức tạp.
- **`writing-plans`**: Lập kế hoạch kỹ thuật chi tiết trước khi code.
- **`executing-plans`**: Theo dõi và thực thi kế hoạch theo từng bước nhỏ.
- **`subagent-driven-development` & `dispatching-parallel-agents`**: Phân tách các công việc độc lập cho subagents.
- **`test-driven-development` (Bắt buộc cho Logic lõi)**: Viết unit/integration test trước khi viết code nghiệp vụ (đặc biệt là logic trừ lượt, kiểm tra slot, check-in).
- **`systematic-debugging`**: Điều tra nguyên nhân gốc rễ (Root Cause Analysis) khi gặp lỗi, không sửa mò.
- **`verification-before-completion` (Bắt buộc trước khi báo cáo)**: Chạy test và đưa ra bằng chứng kết quả cụ thể trước khi tuyên bố hoàn thành.
- **`finishing-a-development-branch` & `using-git-worktrees`**: Quản lý nhánh và workspace cách ly khi cần.
- **`requesting-code-review` & `receiving-code-review`**: Đảm bảo chất lượng review chéo.
- **`diagnosing-superpowers`, `writing-guidelines`, `writing-skills`**: Các kỹ năng tài liệu hóa và chẩn đoán bổ trợ.

### 3.4 Nhóm 4: Deployment (2 skills)
- **`deploy-to-vercel` & `vercel-cli-with-tokens`**: Triển khai ứng dụng Web React lên Vercel khi nghiệm thu.

### 3.5 Nhóm 5: Không áp dụng trong dự án này (1 skill)
- **`vercel-react-native-skills`**: **VÔ HIỆU HÓA**. Theo `design.md` Mục 1: *"Không triển khai mobile native"*. Toàn bộ hệ thống là Responsive Web tối ưu cho Mobile Web và Kiosk cảm ứng.

---

## 4. Ma trận phân giải xung đột Skills (Conflict Resolution Matrix)

Khi nhiều skills cùng chạm vào một phạm vi, quy tắc phân xử như sau:

| Tình huống / Phạm vi | Skills có thể chồng chéo | Thứ bậc ưu tiên (Quyết định tối cao) | Nguyên tắc phân định |
| :--- | :--- | :--- | :--- |
| **Định hướng thẩm mỹ & Visual** | `frontend-design`, `ui-styling`, `design`, `ui-ux-pro-max` | **`frontend-design` > `design-system` > `ui-ux-pro-max` > `ui-styling`** | `frontend-design` quyết định linh hồn và bản sắc Gym; `design-system` cấp token; `ui-ux-pro-max` cấp quy tắc UX; `ui-styling` chỉ được dùng để lấy cú pháp Tailwind sạch. Cấm các style template rườm rà từ `design`. |
| **Kiểm duyệt chất lượng UI** | `impeccable`, `web-design-guidelines` | **`impeccable` (Thị giác & Anti-slop) + `web-design-guidelines` (Kỹ thuật a11y & DOM)** | Phối hợp song song: `impeccable` loại bỏ trang trí thừa, giảm padding phình to; `web-design-guidelines` kiểm tra ARIA, focus ring, form labels, độ tương phản màu. |
| **Kiến trúc & Tối ưu React** | `vercel-react-best-practices`, `vercel-composition-patterns` | **Đồng thuận kỹ thuật** | `vercel-composition-patterns` định hình cấu trúc Component (Compound Component, Slot pattern); `vercel-react-best-practices` tối ưu vòng lặp render, fetch song song, code splitting. |
| **Kế hoạch & Triển khai** | `writing-plans`, `executing-plans`, `tasks.md` | **`tasks.md` là nguồn chân lý duy nhất** | Mọi kế hoạch chi tiết từ `writing-plans` phải đồng bộ vào `tasks.md` và cập nhật trạng thái tại `progress.md`. |

---

## 5. Bản sắc thiết kế SmartGym & Chiến dịch bài trừ "AI Slop"

SmartGym là một nền tảng quản lý phòng tập thể thao thực tế, hướng tới tính kỷ luật, tập trung và năng lượng vận động.

### 5.1 Danh sách cấm tuyệt đối (AI Slop Anti-Patterns)
1. **Không lạm dụng Gradient**: Cấm các dải gradient tím - hồng - xanh neon kiểu "AI template 2024". Nền và bề mặt phải phẳng, vững chãi, tương phản rõ rệt.
2. **Không Glassmorphism / Frosted Glass**: Không dùng `backdrop-blur-md` tràn lan, không dùng viền bán trong suốt mờ mịt gây khó đọc dữ liệu.
3. **Không "Card-itis"**: Không nhồi nhét mọi thông tin vào từng chiếc thẻ bo tròn độc lập. Dùng layout phân vùng bằng đường kẻ mảnh (hairline dividers), khoảng trắng có chủ đích (whitespace) và bảng biểu nghiệp vụ.
4. **Không lạm dụng Badge & Pill**: Tránh việc mỗi dòng dữ liệu lại gắn một badge màu sắc lòe loẹt.
5. **Không dùng Emoji thay Icon**: Tuyệt đối không dùng emoji (🏋️, 💪, 🔥, 📅) làm icon giao diện thương mại. Chỉ sử dụng icon vector SVG tối giản, đồng bộ từ bộ **Lucide React**.
6. **Không hiệu ứng phát sáng (Glow / Box-Shadow lố bịch)**: Loại bỏ các bóng đổ `box-shadow: 0 0 25px rgba(...)`. Chỉ dùng shadow tinh tế 1-2px để phân tách lớp z-index khi cần thiết.
7. **Không bo góc quá lớn**: Tránh bo góc tròn trịa kiểu bong bóng (`rounded-3xl` hoặc `rounded-2xl` trên bảng và panel). Ưu tiên góc bo sắc sảo, dứt khoát (`rounded-sm` hoặc `rounded-md`), thể hiện chất máy móc, thể lực và cơ khí phòng gym.

### 5.2 Tinh thần thị giác phòng Gym (Hybrid Athletic: Cân bằng Quản trị & Thể thao)
- **Phong cách chủ đạo**: **Hybrid Athletic (Sidebar đen, nội dung trắng, điểm nhấn xanh Volt)**. Sự hòa quyện hoàn hảo giữa tinh thần thể thao bứt phá và tính kỷ luật, chuẩn xác của hệ thống quản trị chuyên nghiệp.
- **Palette màu sắc chuẩn**:
  - `Volt Accent`: `#D4F638` (Xanh Volt neon thể thao tràn đầy sinh lực, điểm nhấn nổi bật trên nền đen/trắng)
  - `Volt Hover`: `#C0E224`
  - `Volt Dark / Shadow`: `#1C2707`
  - `Sidebar Dark`: `#0A0D14` (Sắc đen than đậm chất máy móc, cơ khí phòng gym)
  - `Sidebar Border`: `#1B2335`
  - `Sidebar Text`: `#94A3B8` (Active text: `#D4F638`)
  - `Primary Emerald`: `#087A3E` (Xanh lá thương hiệu cho an toàn, thành công và số liệu chuẩn mực)
  - `Background`: `#F8F9FB` (Nền sáng dịu mắt, sạch sẽ, chuẩn nghiệp vụ quản lý)
  - `Surface`: `#FFFFFF` (Bề mặt thẻ, bảng biểu phẳng và phân tách rõ ràng)
  - `Border`: `#E5E7EB` (Đường viền mảnh hairline 1px)
  - `Text Primary`: `#111827` (Chữ đen than có độ tương phản cao, dễ đọc)
  - `Text Secondary`: `#64748B` (Chữ phụ, nhãn, thời gian)
  - `Success`: `#16A34A` (Kích hoạt thành công, check-in hợp lệ)
  - `Warning`: `#D97706` (Chờ đối soát, slot cần xếp lại)
  - `Danger`: `#DC2626` (Khóa tài khoản, từ chối đơn, vắng mặt)
  - `Information`: `#2563EB` (Chỉ số mật độ, thông tin hệ thống)
- **Typography**: Phông chữ chuẩn tiếng Việt **Be Vietnam Pro** (sắc nét, dấu tiếng Việt tối ưu cho cả giao diện web lẫn hiển thị số liệu tải trọng, thời gian).
- **Layout & Kích thước chuẩn**:
  - `Sidebar`: cố định `240px` (nền đen than `#0A0D14`, đường viền phải `1px border-darksidebar-border`).
  - `Header`: cố định chiều cao `64px` (nền trắng surface, border-b 1px).
  - `Border radius`: sắc sảo `6–8px` (`rounded-md` / `rounded-lg`).
  - `Spacing scale`: `4px, 8px, 12px, 16px, 24px, 32px`.
  - `Iconography`: 100% SVG từ **Lucide React**. Cấm dùng emoji làm icon chức năng.
- **Phản xạ người dùng**: Nhanh, chuẩn, dễ thao tác trong môi trường phòng tập, tính tương phản và khả năng đọc dữ liệu đạt chuẩn WCAG AA trên mọi thiết bị.

---

## 6. Quy chuẩn Kỹ thuật & Bảo mật cốt lõi

1. **Sinh trắc học**:
   - Chỉ thu thập khi có bản ghi `consent_at`.
   - Không lưu ảnh thô (RGB frames) vào Database hoặc đĩa cứng. Chỉ lưu vector embedding và model version.
   - Khi hội viên yêu cầu xóa sinh trắc học, xóa dứt điểm template trong `face_templates`.
2. **Bảo vệ toàn vẹn lịch đặt (Concurrency Safety)**:
   - Sử dụng PostgreSQL GiST Exclusion Constraints ngăn chặn 2 lịch đặt chồng chéo thời gian trên cùng 1 Huấn luyện viên hoặc Hội viên.
   - Xác nhận đặt lịch thông minh (từ CP-SAT) phải bọc hoàn toàn trong 1 Database Transaction có kiểm tra lại tất cả ràng buộc trước khi commit.
3. **Check-in Kiosk & QR Code dự phòng**:
   - Mã QR là Dynamic Token ký bằng HMAC, có nonce, hết hạn ngắn (30-60 giây), tiêu thụ nguyên tử (1-time consume).
   - Tuyệt đối không dùng mã QR tĩnh chứa user_id.
4. **Idempotency**:
   - Tất cả API ghi quan trọng (xác nhận đơn hàng, đặt lịch, hoàn thành buổi tập, check-in) phải hỗ trợ header `Idempotency-Key` để ngăn chặn double-submit do gián đoạn mạng.

---

## 7. Quy trình tương tác và quản lý tiến độ

- **Quản lý công việc**: Mọi đầu việc được khai báo trong `tasks.md`.
- **Theo dõi tiến độ**: Mọi kết quả cập nhật trong `progress.md`.
- **Chế độ làm việc**:
  - Không tự ý commit hoặc push Git.
  - Sau khi tài liệu cấu hình được hoàn thành, dừng lại báo cáo và chờ User phê duyệt trước khi chuyển sang giai đoạn thiết kế UI/UX hay code.