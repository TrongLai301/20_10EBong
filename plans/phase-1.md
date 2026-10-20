# Phase 1: Khởi Tạo Dự Án & Cấu Hình Môi Trường

## 1. Mục Tiêu
Khởi tạo cấu trúc dự án web với Vite (Vanilla JS), cài đặt các dependencies cần thiết, thiết lập cấu trúc thư mục chuẩn và chuẩn bị file cấu hình kết nối Supabase.

## 2. Danh Sách Công Việc Chi Tiết
- [ ] **1.1. Khởi tạo dự án Vite:**
  - Chạy `npm create vite@latest . -- --template vanilla` (hoặc tạo file `package.json` chuẩn và cài đặt npm).
  - Cài đặt các package: `@supabase/supabase-js`, `canvas-confetti`.
- [ ] **1.2. Thiết lập cấu trúc thư mục:**
  ```text
  ├── public/
  │   ├── audio/          # Nhạc nền lofi piano
  │   └── favicon.ico
  ├── src/
  │   ├── styles/
  │   │   ├── base.css    # Reset, font, root variables
  │   │   ├── garden.css  # Style cho canvas và vườn hoa
  │   │   ├── letter.css  # Phong bì 3D và thư tay
  │   │   └── modal.css   # Popup buồn và popup hồi đáp
  │   ├── scripts/
  │   │   ├── garden.js   # Canvas engine vẽ hoa & cánh hoa rơi
  │   │   ├── audio.js    # Quản lý phát nhạc nền
  │   │   ├── letter.js   # Logic phong bì thư & đếm ngược 10s
  │   │   ├── modal.js    # Logic popup Có / Không & Form hồi đáp
  │   │   └── supabase.js # Client Supabase & hàm insert dữ liệu
  │   └── main.js         # Entry point kết nối toàn bộ module
  ├── index.html          # HTML khung chuẩn SEO, nhúng Google Fonts
  ├── .env.example        # Mẫu biến môi trường Supabase
  ├── vercel.json         # Cấu hình deploy Vercel
  └── package.json
  ```
- [ ] **1.3. Cấu hình Google Fonts & Biến môi trường:**
  - Nhúng fonts: `Dancing Script`, `Playfair Display`, `Outfit` từ Google Fonts.
  - Tạo `.env.example` và `.env` với các biến `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.

## 3. Tiêu Chí Hoàn Thành (Acceptance Criteria)
1. Chạy `npm run dev` hiển thị trang web trắng không có lỗi console.
2. Google Fonts tải thành công, hỗ trợ gõ tiếng Việt có dấu.
3. Dependencies `@supabase/supabase-js` và `canvas-confetti` được import thành công.
