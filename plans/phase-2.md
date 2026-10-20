# Phase 2: Vườn Hoa Nở Rộ, Chữ Chúc 20/10 & Nhạc Nền

## 1. Mục Tiêu
Xây dựng trải nghiệm mở màn (0s - 10s): Vườn hoa đêm/hoàng hôn nở rộ mượt mà 60fps bằng HTML5 Canvas, hiệu ứng cánh hoa bay và đom đóm lấp lánh, dòng chữ chúc mừng 20/10 phát sáng lung linh, cùng trình phát nhạc nền lofi piano dịu dàng.

## 2. Danh Sách Công Việc Chi Tiết
- [ ] **2.1. Canvas Engine Vườn Hoa (Blooming Garden):**
  - Viết thuật toán vẽ hoa nở (procedural flower growth): Cành vươn lên, lá xòe nhẹ, các cánh hoa nở bung theo timeline mềm mại.
  - Phối màu hoa rực rỡ nhưng pastel ngọt ngào (Hồng phấn, Tím lavender, Trắng ngà, Cam san hô).
- [ ] **2.2. Hiệu Ứng Hạt Cánh Hoa & Đom Đóm (Floating Petals & Fireflies):**
  - Tạo hệ thống hạt (Particle System) cho cánh hoa hồng/anh đào bay lơ lửng theo gió.
  - Hiệu ứng đom đóm/ánh sao lấp lánh (sparkles) nhấp nháy tạo không gian thần tiên.
- [ ] **2.3. Lời Chúc Mừng 20/10 Phát Sáng (Glowing Message):**
  - Chữ hiển thị trang trọng, mềm mại ở trung tâm/phông nền:
    > *"Chúc cô gái nhỏ một ngày 20/10 thật rạng rỡ và tràn ngập niềm vui! ✨🌸"*
  - Hiệu ứng phát quang mờ ảo (soft glow effect) và xuất hiện nhẹ nhàng (fade-in mượt).
- [ ] **2.4. Trình Phát Nhạc Nền (Background Music Controller):**
  - Nút biểu tượng đĩa nhạc / nốt nhạc 🎵 quay tròn tinh tế ở góc trên cùng.
  - Xử lý chính sách autoplay của trình duyệt: Tự động kích hoạt phát nhạc khi có tương tác đầu tiên (hoặc click nút).
  - Tích hợp một bản nhạc piano lofi lãng mạn nhẹ nhàng (không lời).
- [ ] **2.5. Nút Mở Thư Sớm (Skip/Open Letter):**
  - Nút nhỏ tinh tế góc dưới: *"Xem bức thư bí mật ngay 💌"* dành cho nàng nếu muốn mở ngay mà không cần đợi hết 10 giây.

## 3. Tiêu Chí Hoàn Thành (Acceptance Criteria)
1. Canvas chạy mượt mà 60fps trên cả mobile và desktop, tự động resize theo kích thước màn hình.
2. Cánh hoa và hoa nở hiển thị tự nhiên, không bị giật lag.
3. Nhạc nền phát êm ái khi bật, có nút pause/play dễ dùng.
