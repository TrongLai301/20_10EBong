# Phase 6: Tối Ưu Responsive, Kiểm Thử Toàn Diện & Triển Khai Vercel

## 1. Mục Tiêu
Kiểm thử kỹ lưỡng toàn bộ luồng trải nghiệm trên trình duyệt (cả chế độ giả lập Mobile iPhone/Android và Desktop), đảm bảo font tiếng Việt hiển thị trọn vẹn, hiệu năng 60fps mượt mà, và hoàn tất cấu hình để deploy lên Vercel.

## 2. Danh Sách Công Việc Chi Tiết
- [x] **6.1. Tối Ưu Hiển Thị Trên Thiết Bị Di Động (Mobile-First Polish):**
  - Đảm bảo tỷ lệ khung phong bì và tờ giấy thư tay vừa vặn với màn hình điện thoại (không bị tràn ngang).
  - Tối ưu kích thước chữ để dễ đọc dưới ánh sáng điện thoại mà không cần phóng to.
  - Xử lý các sự kiện chạm cảm ứng (touch events, tap) nhạy bén, loại bỏ highlight xám (`-webkit-tap-highlight-color: transparent`).
  - Thêm `viewport-fit=cover` và thẻ meta theme color (`#110d26`).
  - Cấu hình OpenGraph metadata (title, description, locale) cho Zalo / Messenger preview.
- [x] **6.2. Kiểm Thử Trình Duyệt & Hiệu Năng:**
  - Khởi chạy dev server (`npm run dev`).
  - Kiểm tra các mốc:
    1. Vườn hoa đa tầng rực rỡ và đồi cỏ xanh ngát.
    2. Nhạc nền BINZ x ĐEN phát tự động khi vào trang, nút bật/tắt đĩa quay mượt mà.
    3. Dòng chữ chúc mừng hiển thị mở màn; chữ báo hiệu biến mất vĩnh viễn khi mở thư lần đầu.
    4. Toast thông báo rơi từ trên xuống sau 10s, phong thư nhún nhảy ra sau 11.4s.
    5. Mở nắp phong bì 3D và đọc thư tay nắn nót.
    6. Bấm nút "Không" -> Popup buồn với Chibi Huhu ươn ướt mi.
    7. Chọn "Vẫn không nha..." -> Form hỏi lý do từ chối với Chibi Buồn ôm tim vỡ, nút gửi tim vỡ 💔.
    8. Khi submit từ chối -> Nút "🌸 Bống có muốn suy nghĩ lại không? 💕" hiện giữa vườn hoa và nút "💌 Xem lại thư" góc trên.
    9. Chọn "Bống suy nghĩ lại rồi nè!" -> Popup xác nhận với Chibi Vui Sướng vỡ òa -> Form hồi đáp ngọt ngào với Chibi Hạnh Phúc -> Bắn pháo hoa tim rực rỡ và ẩn cả 2 nút.
- [x] **6.3. Cấu Hình Triển Khai Vercel:**
  - Tạo file `vercel.json` cấu hình framework Vite, cache headers 1 năm cho nhạc nền (`/audio/`) và assets (`/assets/`).
  - Đảm bảo `npm run build` xuất thư mục `dist` sạch sẽ, không lỗi bundle.
  - Viết tài liệu hướng dẫn chi tiết deploy lên Vercel.

## 3. Hướng Dẫn Triển Khai Lên Vercel (2 Cách Đơn Giản)

### Cách 1: Deploy Qua GitHub + Vercel Dashboard (Khuyên Dùng - Tự động cập nhật)
1. **Khởi tạo Git và đẩy code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete romantic 20/10 gift website for em Bong"
   git branch -M main
   # Tạo một repo mới trên GitHub (Private hoặc Public), sau đó liên kết:
   git remote add origin https://github.com/<tai-khoan-github>/<ten-repo>.git
   git push -u origin main
   ```
2. **Import vào Vercel:**
   - Đăng nhập [vercel.com](https://vercel.com).
   - Chọn **Add New...** -> **Project**.
   - Chọn repository GitHub vừa tạo và bấm **Import**.
3. **Cấu hình Environment Variables trên Vercel:**
   - Trong mục **Environment Variables**, thêm 2 biến từ file `.env`:
     - `VITE_SUPABASE_URL` = `<URL Supabase của bạn>`
     - `VITE_SUPABASE_ANON_KEY` = `<Anon Key của bạn>`
   - Bấm **Deploy**.
4. **Nhận link:**
   - Sau ~1 phút, Vercel sẽ cấp link dạng: `https://ten-du-an.vercel.app`.
   - Có thể đổi tên domain miễn phí trong mục **Settings -> Domains**.

---

### Cách 2: Deploy Trực Tiếp Bằng Vercel CLI
1. Cài đặt Vercel CLI (nếu chưa có):
   ```bash
   npm i -g vercel
   ```
2. Đăng nhập và deploy:
   ```bash
   vercel login
   vercel
   ```
3. Khi deploy, CLI sẽ hỏi:
   - *Set up and deploy?* -> `Y`
   - *Which scope?* -> Chọn tài khoản Vercel của bạn
   - *Link to existing project?* -> `N`
   - *Project name?* -> `tang-em-bong-20-10`
   - *In which directory is your code located?* -> `./`
4. Cấu hình biến môi trường trên Vercel:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel --prod
   ```

## 4. Checklist Trước Khi Gửi Link Cho Em Bống
- [ ] Mở thử link Vercel trên điện thoại (4G / Wifi).
- [ ] Chạm vào màn hình để nghe nhạc bài *Cho Mình Em*.
- [ ] Thử test gửi 1 tin nhắn mẫu để kiểm tra dữ liệu đã vào Supabase Table `replies` chưa.
- [ ] Xóa tin nhắn test trong Supabase Dashboard (nếu muốn).
- [ ] Copy link và gửi kèm lời chúc ngọt ngào cho em Bống! 💕
