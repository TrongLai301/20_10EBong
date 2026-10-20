# Phase 4: Tương Tác Có / Không (Popup Buồn & Popup Hồi Đáp)

## 1. Mục Tiêu
Xây dựng logic phản hồi cảm xúc khi cô ấy bấm vào một trong 2 nút ở cuối bức thư:
- Khi bấm **"Không"**: Mở popup với giọng văn hụt hẫng, buồn đáng yêu để hỏi lại xem cô ấy có chắc chắn chưa, tạo cơ hội cho nàng quay lại chọn "Có".
- Khi bấm **"Có"** (hoặc sau khi đổi ý từ popup Không): Mở popup form để cô ấy viết lời hồi đáp tâm sự gửi lại cho bạn.

## 2. Danh Sách Công Việc Chi Tiết
- [ ] **4.1. Popup Nút "Không" (Sad / Hesitant Prompt Modal):**
  - Giao diện: Icon/Sticker cảm xúc dễ thương hơi ủ rũ 🥺, nền mờ kính (glassmorphism).
  - Nội dung text buồn nhẹ, chân thành và hóm hỉnh:
    > *"Cậu thật sự chọn 'Không' sao? 🥺"*  
    > *"Tớ đã dành rất nhiều tâm huyết chuẩn bị khu vườn hoa và bức thư này chỉ mong mang lại nụ cười cho cậu hôm nay..."*  
    > *"Cậu có chắc là không cho tớ một cơ hội nhỏ xíu nào hơm? 🌸"*
  - 2 lựa chọn trong popup buồn:
    1. **Nút "Tớ suy nghĩ lại rồi nè 💕"** (Nút chính, nổi bật): Đóng popup buồn và tự động kích hoạt mở Popup Hồi Đáp.
    2. **Nút "Vẫn không nha 🥺"** (Nút phụ mờ hơn): Cho phép nàng vẫn có thể viết vài dòng lý do gửi lại.
- [ ] **4.2. Popup Form Lời Hồi Đáp (Response Reply Modal):**
  - Giao diện: Thiết kế thiệp pastel thanh lịch, viền ánh sáng nhẹ.
  - Tiêu đề: *"Lời nhắn gửi lại cho tớ 💌"*
  - Gợi ý ngọt ngào bên dưới: *"Cậu có điều gì muốn nhắn nhủ hay chia sẻ với tớ không nè?"*
  - Trường nhập liệu:
    - Ô `textarea`: Để cô ấy gõ tự do (placeholder: *"Nhập lời nhắn gửi của cậu ở đây nhé..."*).
    - Ô `input` tên / biệt danh (tùy chọn, placeholder: *"Tên hoặc biệt danh của cậu (nếu muốn)"*).
  - Nút bấm hành động:
    - Nút **"Gửi lời hồi đáp ❤️"** với hiệu ứng nhịp đập trái tim và loading spinner khi gửi.

## 3. Tiêu Chí Hoàn Thành (Acceptance Criteria)
1. Bấm "Không" bật đúng popup buồn với giọng văn xúc động, không làm người xem khó chịu.
2. Nút "Tớ suy nghĩ lại rồi" chuyển mượt mà sang form hồi đáp.
3. Form nhập liệu mượt mà trên bàn phím điện thoại, không bị che khuất nút gửi.
