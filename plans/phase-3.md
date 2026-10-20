# Phase 3: Phong Bì Thư 3D & Hiệu Ứng Thư Tay Tiếng Việt

## 1. Mục Tiêu
Triển khai cơ chế đếm ngược 10 giây, hiển thị thông báo ngọt ngào kèm chiếc phong bì thư 3D bay ra trung tâm. Khi người dùng bấm vào, nắp phong bì mở ra bằng hiệu ứng 3D và bung bức thư tay viết bằng font chữ tiếng Việt nắn nót.

## 2. Danh Sách Công Việc Chi Tiết
- [ ] **3.1. Bộ Đếm Thời Gian 10 Giây & Toast Thông Báo:**
  - Timer 10 giây sau khi trang tải (hoặc kích hoạt ngay khi bấm nút xem sớm).
  - Toast thông báo dễ thương trượt xuống từ cạnh trên:
    > *"Ting! Bạn có 1 bức thư nho nhỏ, hãy xem đó là gì nhé... 💌"*
- [ ] **3.2. Thiết Kế Phong Bì Thư 3D (3D Envelope CSS):**
  - Dựng phong bì bằng CSS 3D Transforms với hiệu ứng bóng đổ, viền nẹp vàng kim sang trọng, con dấu sáp trái tim niêm phong (wax seal).
  - Phong bì lướt nhẹ nhàng từ dưới lên trung tâm màn hình và lơ lửng bồng bềnh (floating animation).
- [ ] **3.3. Animation Mở Nắp Phong Bì & Rút Thư:**
  - Khi click vào phong bì hoặc con dấu sáp:
    1. Con dấu vỡ/mở ra nhẹ nhàng.
    2. Nắp phong bì lật ngược 180 độ lên trên theo trục X (3D perspective).
    3. Tờ giấy viết thư cổ điển từ trong phong bì từ từ trượt lên và bung rộng toàn màn hình.
- [ ] **3.4. Trình Bày Bức Thư Viết Tay (Handwritten Letter Paper):**
  - Nền giấy parchment / giấy màu kem vintage với đường kẻ mờ tinh tế.
  - Phông chữ tiếng Việt viết tay (`Dancing Script` / `Caveat`), hiển thị từng dòng tự nhiên.
  - Nội dung bức thư do bạn viết gửi đến bạn nữ (có file cấu hình dễ dàng chỉnh sửa văn phong).
  - Phần kết thúc bức thư với lời ngỏ và 2 nút bấm tương tác:
    - **Nút "Có" (Đồng ý nè / Thích lắm 💕)**
    - **Nút "Không" (Thôi ngại lắm / Không nha 🙈)**

## 3. Tiêu Chí Hoàn Thành (Acceptance Criteria)
1. Phong bì bay ra đúng thời điểm 10 giây (hoặc ngay lập tức khi click nút xem sớm).
2. Chuyển động lật nắp phong bì và rút thư đạt độ chân thực cao, không bị lệch góc nhìn 3D.
3. Font chữ tiếng Việt hiển thị chuẩn xác, không bị lỗi gõ dấu (á, à, ả, ã, ạ, ư, ơ, ê,...).
