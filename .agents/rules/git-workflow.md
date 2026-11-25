# Rule: Git Workflow & Repository Hygiene

Quy chuẩn quản lý phiên bản Git, kiểm soát nhánh và bảo vệ an toàn kho lưu trữ SmartGym.
Áp dụng cho mọi hoạt động tương tác với Git trong workspace.

---

## 1. Quy tắc Tối cao dành cho AI Coding Assistant

1. **TUYỆT ĐỐI KHÔNG TỰ Ý COMMIT HOẶC PUSH**:
   - AI **không bao giờ** được tự động chạy `git commit` hoặc `git push` nếu không có chỉ thị bằng văn bản rõ ràng từ người dùng.
   - Mọi thay đổi mã nguồn phải được lưu trên workspace và báo cáo để người dùng review trước.
2. **KHÔNG BAO GIỜ COMMIT DỮ LIỆU NHẠY CẢM HOẶC FILE TẠM**:
   - File cấu hình môi trường chứa secret: `.env`, `.env.local`, `.env.production`.
   - File nhị phân nặng: Mô hình DeepFace (`.h5`, `.onnx`, weights), video demo dung lượng lớn.
   - Dữ liệu sinh trắc học thật hoặc ảnh mặt người dùng.
   - Thư mục build và dependencies: `node_modules/`, `dist/`, `.turbo/`, `__pycache__/`, `venv/`.

---

## 2. Chiến lược phân nhánh (Branching Strategy)

Vì đây là đồ án cá nhân, mô hình phân nhánh cần tinh gọn, an toàn và dễ theo dõi:

```
main (Production / Thesis Ready - Luôn trong trạng thái chạy demo được)
  ▲
  │ (Merge khi feature đã pass 100% tests)
  │
  ├── feat/design-system-and-ui
  ├── feat/auth-and-rbac
  ├── feat/booking-engine
  ├── feat/kiosk-face-attendance
  ├── feat/cpsat-scheduling
  └── fix/concurrency-race-condition
```

1. **Nhánh `main`**:
   - Là nhánh ổn định cao nhất, dùng để báo cáo tiến độ và demo trực tiếp trước Hội đồng chấm tốt nghiệp.
   - Mã nguồn trên `main` bắt buộc phải build thành công và vượt qua toàn bộ Acceptance Tests.
2. **Nhánh tính năng (`feat/...`)**:
   - Mỗi giai đoạn/tính năng lớn được phát triển trên nhánh riêng.
   - Tên nhánh chuẩn:
     - `feat/<ten-tinh-nang>`: Tính năng mới (ví dụ: `feat/kiosk-attendance`)
     - `fix/<ten-loi>`: Sửa lỗi (ví dụ: `fix/booking-overlap`)
     - `test/<pham-vi>`: Bổ sung bộ test (ví dụ: `test/concurrency-t01-t16`)
     - `docs/<noi-dung>`: Cập nhật tài liệu (ví dụ: `docs/api-specification`)

---

## 3. Quy chuẩn Commit Message (Conventional Commits)

Khi người dùng yêu cầu commit, thông điệp commit phải tuân thủ chuẩn Conventional Commits tiếng Anh hoặc tiếng Việt rõ nghĩa:

```
<type>(<scope>): <short summary>

[optional body explaining WHY and WHAT changed]
```

- **Các kiểu commit chính**:
  - `feat`: Thêm tính năng mới (ví dụ: `feat(booking): implement btree_gist exclusion constraint for PT slots`)
  - `fix`: Sửa lỗi (ví dụ: `fix(attendance): prevent multiple open sessions for same member`)
  - `refactor`: Tái cấu trúc mã nguồn không làm thay đổi tính năng
  - `perf`: Cải thiện hiệu năng (ví dụ: `perf(face): optimize embedding extraction pipeline latency`)
  - `test`: Thêm hoặc sửa unit/integration test (ví dụ: `test(acceptance): add automated tests for T01-T05`)
  - `docs`: Sửa đổi tài liệu hướng dẫn, design doc (ví dụ: `docs(architecture): add ADR for CP-SAT solver`)
  - `chore`: Thay đổi cấu hình build, dependencies, tooling

---

## 4. File `.gitignore` chuẩn mực cho Full-stack Monorepo

Trước khi khởi tạo code, file `.gitignore` ở root phải bao gồm:

```gitignore
# Environment & Secrets
.env
.env.*
!.env.example
*.pem
*.key

# Dependencies
node_modules/
.pnpm-store/
venv/
env/
__pycache__/
*.pyc

# Build outputs
dist/
build/
.next/
out/
*.egg-info/

# IDE & OS
.vscode/
.idea/
.DS_Store
Thumbs.db

# Heavy AI weights & Biometric Data
services/engine/weights/
*.weights
*.onnx
*.h5
*.pkl
dataset/
face_samples/

# Test & Coverage
coverage/
.nyc_output/
*.log
```
