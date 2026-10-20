/**
 * modal.js - Multi-Modal Flow: Sad Modal, Confirm Modal, Reply Modal with Cute Chibi SVGs & Confetti
 */
import confetti from 'canvas-confetti';
import { saveResponse } from './supabase.js';
import { TextRainManager, DEFAULT_RAIN_WORDS } from './textRain.js';
import { sfx } from './sfx.js';

export class ModalManager {
  constructor({ onReplay, onCloseReply, onAgreed, onRejected, onModalOpen, onModalClose }) {
    this.onReplay = onReplay;
    this.onCloseReply = onCloseReply;
    this.onAgreed = onAgreed;
    this.onRejected = onRejected;
    this.onModalOpen = onModalOpen;
    this.onModalClose = onModalClose;

    // Trình quản lý hiệu ứng mưa rơi chữ khi đồng ý / suy nghĩ lại
    this.textRain = new TextRainManager({ words: DEFAULT_RAIN_WORDS });

    this.currentChoice = 'yes'; // 'yes', 'no_then_yes', 'no'
    this.currentMode = 'agree'; // 'agree', 'reconsidered', 'reject'

    // 1. Sad Modal Elements
    this.sadModal = document.getElementById('sad-modal');
    this.closeSadBtn = document.getElementById('close-sad-modal');
    this.btnReconsider = document.getElementById('btn-reconsider');
    this.btnStillNo = document.getElementById('btn-still-no');

    // 2. Confirm Modal Elements
    this.confirmModal = document.getElementById('confirm-modal');
    this.closeConfirmBtn = document.getElementById('close-confirm-modal');
    this.btnConfirmProceed = document.getElementById('btn-confirm-proceed');

    // 3. Reply Modal Elements
    this.replyModal = document.getElementById('reply-modal');
    this.closeReplyBtn = document.getElementById('close-reply-modal');
    this.replyForm = document.getElementById('reply-form');
    this.replySender = document.getElementById('reply-sender');
    this.replyMessage = document.getElementById('reply-message');
    this.replyLabelMessage = document.getElementById('reply-label-message');
    this.replyBadge = document.getElementById('reply-badge');
    this.replyTitle = document.getElementById('reply-title');
    this.replyDesc = document.getElementById('reply-desc');
    this.btnSubmit = document.getElementById('btn-submit-reply');
    this.btnSubmitText = document.getElementById('btn-submit-text');

    // Chibi containers inside Reply Modal
    this.chibiHappy = document.getElementById('chibi-happy');
    this.chibiBroken = document.getElementById('chibi-broken');

    // 4. Success Screen Elements
    this.successScreen = document.getElementById('success-screen');
    this.successTitle = document.getElementById('success-title');
    this.successDesc = document.getElementById('success-desc');
    this.btnReplay = document.getElementById('btn-replay');

    this.init();
  }

  init() {
    // Sad modal close button
    if (this.closeSadBtn) {
      this.closeSadBtn.addEventListener('click', () => {
        this.hideSadModal();
        if (this.onCloseReply) this.onCloseReply();
      });
    }

    // Confirm modal close button
    if (this.closeConfirmBtn) {
      this.closeConfirmBtn.addEventListener('click', () => {
        this.hideConfirmModal();
        if (this.textRain) this.textRain.clear();
        if (this.onCloseReply) this.onCloseReply();
      });
    }

    // Sad modal events
    if (this.btnReconsider) {
      this.btnReconsider.addEventListener('click', () => {
        // Bấm "Bống suy nghĩ lại rồi nè" -> hiển thị confirm modal và kích hoạt mưa rơi chữ
        this.hideSadModal();
        this.showConfirmModal();
      });
    }

    if (this.btnStillNo) {
      this.btnStillNo.addEventListener('click', () => {
        // Bấm "Vẫn không nha" -> mở form với template hỏi lý do từ chối kèm chibi buồn & tim vỡ
        this.hideSadModal();
        this.showReplyModal({ mode: 'reject' });
      });
    }

    // Confirm modal event: Bấm "Tiếp tục nè 🥰" -> mở form phản hồi đồng ý
    if (this.btnConfirmProceed) {
      this.btnConfirmProceed.addEventListener('click', () => {
        sfx.playAgreeChord();
        this.hideConfirmModal();
        this.showReplyModal({ mode: 'reconsidered' });
      });
    }

    // Reply modal close button
    if (this.closeReplyBtn) {
      this.closeReplyBtn.addEventListener('click', () => {
        this.hideReplyModal();
        if (this.textRain) this.textRain.clear();
        if (this.onCloseReply) this.onCloseReply();
      });
    }

    // Submit form
    if (this.replyForm) {
      this.replyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // Replay button ("Thưởng thức lại vườn hoa")
    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', () => {
        this.hideSuccessScreen();
        if (this.onReplay) this.onReplay();
      });
    }
  }

  showSadModal() {
    if (this.onModalOpen) this.onModalOpen();
    if (this.textRain) this.textRain.clear();
    this.currentMode = 'reject';
    this.currentChoice = 'no';
    this.hideConfirmModal();
    this.hideReplyModal();
    if (this.sadModal) {
      this.sadModal.classList.remove('hidden');
    }
  }

  hideSadModal() {
    if (this.sadModal) {
      this.sadModal.classList.add('hidden');
    }
  }

  showConfirmModal() {
    if (this.onModalOpen) this.onModalOpen();
    this.hideSadModal();
    this.hideReplyModal();
    if (this.confirmModal) {
      this.confirmModal.classList.remove('hidden');
    }
  }

  hideConfirmModal() {
    if (this.confirmModal) {
      this.confirmModal.classList.add('hidden');
    }
  }

  /**
   * Mở form phản hồi linh hoạt:
   * - mode = 'agree' (Đồng ý từ đầu -> Chibi Hạnh Phúc, nút tim đỏ)
   * - mode = 'reconsidered' (Đổi ý đồng ý -> Chibi Hạnh Phúc, nút tim đỏ)
   * - mode = 'reject' (Từ chối -> Chibi Buồn má ửng, template hỏi lý do, nút tim vỡ 💔)
   */
  showReplyModal(config = { mode: 'agree' }) {
    this.hideSadModal();
    this.hideConfirmModal();

    // SỬA LỖI: Luôn làm trống ô lời nhắn mỗi khi mở form mới để không bao giờ bị dính dữ liệu từ form từ chối sang đồng ý hoặc ngược lại
    if (this.replyMessage) {
      this.replyMessage.value = '';
    }

    let mode = 'agree';
    if (typeof config === 'string') {
      mode = config === 'no' ? 'reject' : (config === 'no_then_yes' ? 'reconsidered' : 'agree');
    } else if (config && config.mode) {
      mode = config.mode;
    }
    this.currentMode = mode;

    if (mode === 'reject') {
      if (this.textRain) this.textRain.clear();
      this.currentChoice = 'no';

      // 1. Chuyển Chibi: Ẩn Happy, Hiện Chibi Buồn nhô lên
      if (this.chibiHappy) this.chibiHappy.classList.add('hidden');
      if (this.chibiBroken) this.chibiBroken.classList.remove('hidden');

      // 2. Nội dung template hỏi lý do từ chối
      if (this.replyBadge) this.replyBadge.textContent = '🥺 LỜI HỒI ĐÁP';
      if (this.replyTitle) this.replyTitle.textContent = 'Anh có thể hỏi lý do sao em từ chối không ạ? 🥺';
      if (this.replyDesc) {
        this.replyDesc.textContent = 'Dù câu trả lời là gì thì anh vẫn rất trân trọng. Em có thể chia sẻ cho anh biết lý do được không... nếu suy nghĩ lại thì Bống có thể bấm x để mở lại thư...';
      }
      if (this.replyLabelMessage) {
        this.replyLabelMessage.innerHTML = 'Lý do: <span class="required">*</span>';
      }
      if (this.replyMessage) {
        this.replyMessage.placeholder = 'Chia sẻ cho anh biết lý do để anh hiểu hơn nha...';
      }

      // 3. Nút gửi lời hồi đáp kèm trái tim vỡ 💔
      if (this.btnSubmitText) this.btnSubmitText.textContent = 'Gửi lời hồi đáp 💔';
      if (this.btnSubmit) {
        this.btnSubmit.classList.add('btn-reject-submit');
      }
    } else {
      // Chế độ Đồng Ý (trực tiếp hoặc sau khi suy nghĩ lại ấn "Tiếp tục nè")
      this.currentChoice = mode === 'reconsidered' ? 'no_then_yes' : 'yes';
      // Không hiện text rain ở form nữa, chỉ hiện ở trang garden sau khi gửi
      if (this.textRain) this.textRain.clear();

      // 1. Chuyển Chibi: Hiện Chibi Hạnh Phúc nhô lên, Ẩn Chibi Buồn
      if (this.chibiHappy) this.chibiHappy.classList.remove('hidden');
      if (this.chibiBroken) this.chibiBroken.classList.add('hidden');

      // 2. Nội dung form đồng ý ngọt ngào
      if (this.replyBadge) {
        this.replyBadge.textContent = mode === 'reconsidered' ? '💖 LỜI HỒI ĐÁP NGỌT NGÀO' : '💌 LỜI HỒI ĐÁP CỦA BÉ';
      }
      if (this.replyTitle) this.replyTitle.textContent = 'HIHI vui quá, em bé có thể phản hồi cho anh biết bé đã đồng ý ở đây hoặc nhắn nhủ gì nho nhỏ đến anh không 💕';
      if (this.replyDesc) {
        this.replyDesc.textContent = mode === 'reconsidered'
          ? 'Cảm ơn em vì đã suy nghĩ kỹ 💖'
          : 'Mọi lời nhắn nhủ, cảm xúc hay chia sẻ của em đều sẽ được gửi thẳng đến anh, đừng thoát ra âm thầm nha :(( ✨';
      }
      if (this.replyLabelMessage) {
        this.replyLabelMessage.innerHTML = 'Lời nhắn gửi dành cho anh: <span class="required">*</span>';
      }
      if (this.replyMessage) {
        this.replyMessage.placeholder = 'Em muốn chia sẻ điều gì với anh nè...';
      }

      // 3. Nút gửi tim đỏ ❤️
      if (this.btnSubmitText) this.btnSubmitText.textContent = 'Gửi lời hồi đáp ❤️';
      if (this.btnSubmit) {
        this.btnSubmit.classList.remove('btn-reject-submit');
      }
    }

    if (this.onModalOpen) this.onModalOpen();

    if (this.replyModal) {
      this.replyModal.classList.remove('hidden');
    }

    if (this.replyMessage) {
      setTimeout(() => this.replyMessage.focus(), 300);
    }
  }

  hideReplyModal() {
    if (this.onModalClose) this.onModalClose();
    if (this.replyModal) {
      this.replyModal.classList.add('hidden');
    }
  }

  async handleSubmit() {
    const senderName = this.replySender ? this.replySender.value.trim() : '';
    const message = this.replyMessage ? this.replyMessage.value.trim() : '';

    if (!message) return;

    this.setSubmitting(true);

    try {
      await saveResponse({
        choice: this.currentChoice,
        message,
        senderName
      });

      this.hideReplyModal();
      this.showSuccessScreen();

      if (this.currentChoice === 'no') {
        if (this.textRain) this.textRain.clear();
        // Nhẹ nhàng, trân trọng khi nhận lời từ chối
        this.fireGentleConfetti();
        if (this.onRejected) this.onRejected();
      } else {
        // Bùng nổ pháo hoa trái tim và kích hoạt mưa rơi chữ lung linh trên trang vườn hoa
        if (this.textRain) this.textRain.start({ initialBurst: true });
        this.fireHeartConfetti();
        if (this.onAgreed) this.onAgreed();
      }
    } catch (err) {
      alert('Có chút gián đoạn kết nối, nhưng lời nhắn đã được chuẩn bị! Cậu thử bấm gửi lại nhé ❤️');
    } finally {
      this.setSubmitting(false);
    }
  }

  setSubmitting(isSubmitting) {
    if (!this.btnSubmit) return;
    const spinner = this.btnSubmit.querySelector('.spinner');

    this.btnSubmit.disabled = isSubmitting;
    if (isSubmitting) {
      if (this.btnSubmitText) this.btnSubmitText.textContent = 'Đang gửi lời nhắn...';
      if (spinner) spinner.classList.remove('hidden');
    } else {
      if (this.btnSubmitText) {
        this.btnSubmitText.textContent = this.currentChoice === 'no' ? 'Gửi lời hồi đáp 💔' : 'Gửi lời hồi đáp ❤️';
      }
      if (spinner) spinner.classList.add('hidden');
    }
  }

  showSuccessScreen() {
    if (this.currentChoice === 'no') {
      if (this.textRain) this.textRain.clear();
      if (this.successTitle) {
        this.successTitle.textContent = 'Cảm ơn nàng đã gửi lời phản hồi 🌸';
      }
      if (this.successDesc) {
        this.successDesc.innerHTML = 'Cảm ơn em đã chia sẻ những gì trong lòng mình.<br />Chúc bông hoa ấy luôn nở rộ và phát sáng trong mọi khu vườn cô ấy lựa chọn.<br /> Hy vọng món quà nhỏ này khiến em mỉm cười.';
      }
    } else {
      if (this.textRain) this.textRain.start({ initialBurst: true });
      if (this.successTitle) {
        this.successTitle.textContent = 'Lời nhắn đã bay thẳng đến tim anh rồi! 💕';
      }
      if (this.successDesc) {
        this.successDesc.innerHTML = 'Cảm ơn em Bống rất nhiều vì đã ghé thăm khu vườn này.<br />Hy vọng món quà nhỏ anh tự làm này làm em bống cười mỉm 💕';
      }
    }

    if (this.successScreen) {
      this.successScreen.classList.remove('hidden');
    }
  }

  hideSuccessScreen() {
    if (this.onModalClose) this.onModalClose();
    if (this.currentChoice === 'no') {
      if (this.textRain) this.textRain.clear();
    } else {
      // Trở lại trang vườn hoa: Mưa rơi chữ tiếp tục rơi lung linh khắp vườn hoa
      if (this.textRain) this.textRain.start({ initialBurst: true });
    }
    if (this.successScreen) {
      this.successScreen.classList.add('hidden');
    }
  }

  fireHeartConfetti() {
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    const colors = ['#ff758c', '#ff7eb3', '#f6d365', '#ffd1dc', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  fireGentleConfetti() {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffccd5', '#ffe5ec', '#ffffff']
    });
  }
}
