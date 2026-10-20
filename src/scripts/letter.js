/**
 * letter.js - Envelope 3D Interactions, Zero-Horn Geometry, Staggered Toast, Center Reconsider & Smooth UX
 */

export class LetterManager {
  constructor({ onAccept, onReject }) {
    this.onAccept = onAccept;
    this.onReject = onReject;

    this.toast = document.getElementById('letter-toast');
    this.section = document.getElementById('envelope-section');
    this.wrapper = document.getElementById('envelope-wrapper');
    this.envelope = document.getElementById('envelope');
    this.seal = document.getElementById('envelope-seal');
    this.quickBtn = document.getElementById('quick-open-btn');
    this.greetingBanner = document.getElementById('greeting-banner');

    this.centerReconsiderContainer = document.getElementById('center-reconsider-container');
    this.btnCenterReconsider = document.getElementById('btn-center-reconsider');

    this.letterModal = document.getElementById('letter-modal');
    this.btnCloseLetter = document.getElementById('btn-close-letter');
    this.btnAccept = document.getElementById('btn-accept');
    this.btnReject = document.getElementById('btn-reject');
    this.dateDisplay = document.getElementById('letter-current-date');

    this.isOpened = false;
    this.hasOpened = false; // Cờ đánh dấu người dùng đã mở thư trước đó
    this.timerToast = null;
    this.timerEnvelope = null;

    this.init();
  }

  startSequence() {
    if (this.hasOpened) return;
    this.cancelAutoTimers();
    this.hasOpened = false;

    // 1. Sau đúng 10 giây từ khi mở cổng: Hiển thị thông báo có thư lên trước
    this.timerToast = setTimeout(() => {
      if (this.hasOpened) return;
      this.showToast();

      // 2. Sau 1.4 giây: Phong thư mới bắt đầu nhảy từ từ ra
      this.timerEnvelope = setTimeout(() => {
        if (this.hasOpened) return;
        this.showEnvelope();
      }, 1400);
    }, 10000);
  }

  init() {
    this.updateDate();

    // Nếu không có welcome-gate thì tự động chạy sequence (fallback)
    if (!document.getElementById('welcome-gate')) {
      this.startSequence();
    }

    // Mở thư sớm / Mở lại thư khi click nút góc phải
    if (this.quickBtn) {
      this.quickBtn.addEventListener('click', () => {
        this.openImmediately();
      });
    }

    // Nút "Bống có muốn suy nghĩ lại không?" ở giữa màn hình
    if (this.btnCenterReconsider) {
      this.btnCenterReconsider.addEventListener('click', () => {
        this.hideCenterReconsider();
        this.openImmediately();
      });
    }

    // Click toast cũng mở phong bì
    if (this.toast) {
      this.toast.addEventListener('click', () => {
        this.openLetter();
      });
    }

    // Chạm vào seal hoặc envelope để mở
    if (this.seal) {
      this.seal.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openLetter();
      });
    }

    if (this.wrapper) {
      this.wrapper.addEventListener('click', () => {
        if (!this.isOpened) {
          this.openLetter();
        }
      });
    }

    // Bấm nút đóng "✕": kích hoạt animation đóng thư và phong bì thu nhỏ biến mất
    if (this.btnCloseLetter) {
      this.btnCloseLetter.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAndVanish();
      });
    }

    // Sự kiện 2 nút Có / Không
    if (this.btnAccept) {
      this.btnAccept.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeLetterModalDirectly();
        if (this.onAccept) this.onAccept();
      });
    }

    if (this.btnReject) {
      this.btnReject.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeLetterModalDirectly();
        if (this.onReject) this.onReject();
      });
    }
  }

  updateDate() {
    if (this.dateDisplay) {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      this.dateDisplay.textContent = `Ngày ${day} tháng ${month}, ${year}`;
    }
  }

  showToast() {
    if (this.hasOpened) return;
    if (this.toast) {
      this.toast.classList.remove('hidden');
      this.toast.classList.remove('hiding');
      this.toast.classList.add('show');
      setTimeout(() => {
        this.hideToast();
      }, 7000);
    }
  }

  hideToast() {
    if (this.toast && this.toast.classList.contains('show')) {
      this.toast.classList.remove('show');
      this.toast.classList.add('hiding');
      setTimeout(() => {
        if (this.toast && this.toast.classList.contains('hiding')) {
          this.toast.classList.remove('hiding');
          this.toast.classList.add('hidden');
        }
      }, 600);
    }
  }

  showEnvelope() {
    if (this.hasOpened) return;
    if (this.wrapper) {
      this.wrapper.classList.remove('vanish');
      this.wrapper.classList.add('bounce-in');
    }
    if (this.section) {
      this.section.classList.remove('closing');
      this.section.classList.remove('hidden');
    }
  }

  cancelAutoTimers() {
    this.hasOpened = true;
    if (this.timerToast) {
      clearTimeout(this.timerToast);
      this.timerToast = null;
    }
    if (this.timerEnvelope) {
      clearTimeout(this.timerEnvelope);
      this.timerEnvelope = null;
    }
    this.hideToast();
  }

  removeComingSoonText() {
    const comingSoon = document.getElementById('greeting-coming-soon');
    if (comingSoon) {
      comingSoon.remove();
    }
  }

  openImmediately() {
    this.cancelAutoTimers();
    this.hideCenterReconsider();
    this.removeComingSoonText();

    if (this.section) {
      this.section.classList.remove('closing');
      this.section.classList.remove('hidden');
    }
    if (this.wrapper) {
      this.wrapper.classList.remove('vanish');
      this.wrapper.classList.remove('bounce-in');
    }
    if (this.letterModal) {
      this.letterModal.classList.remove('closing');
    }

    setTimeout(() => {
      this.openLetter();
    }, 200);
  }

  openLetter() {
    this.isOpened = true;
    this.cancelAutoTimers();
    this.hideCenterReconsider();
    this.removeComingSoonText();

    if (this.quickBtn) this.quickBtn.classList.add('hidden');
    if (this.greetingBanner) this.greetingBanner.classList.add('fade-out');

    // 1. Mở nắp phong bì 3D
    if (this.envelope) {
      this.envelope.classList.add('open');
    }

    // 2. Sau 550ms, mở modal đọc thư
    setTimeout(() => {
      this.openLetterModal();
    }, 550);
  }

  openLetterModal() {
    if (this.letterModal) {
      this.letterModal.classList.remove('closing');
      this.letterModal.classList.remove('hidden');
    }
  }

  closeLetterModalDirectly() {
    if (this.letterModal) {
      this.letterModal.classList.add('hidden');
    }
  }

  /**
   * Đóng thư đồng bộ:
   * - Nếu lá thư đang hiển thị, thu nhỏ lá thư êm ái rồi cất phong bì.
   * - Nếu lá thư đã ẩn trước đó (đang ở popup phản hồi), không kích hoạt animation mở lại thư!
   */
  closeAndVanish() {
    const isLetterVisible = this.letterModal && !this.letterModal.classList.contains('hidden');

    if (isLetterVisible) {
      this.letterModal.classList.add('closing');
      if (this.section) {
        this.section.classList.add('closing');
      }
      setTimeout(() => {
        this.finalizeCloseAndVanish();
      }, 250);
    } else {
      this.finalizeCloseAndVanish();
    }
  }

  finalizeCloseAndVanish() {
    if (this.letterModal) {
      this.letterModal.classList.remove('closing');
      this.letterModal.classList.add('hidden');
    }
    if (this.section) {
      this.section.classList.remove('closing');
      this.section.classList.add('hidden');
    }
    if (this.envelope) {
      this.envelope.classList.remove('open');
    }
    if (this.greetingBanner) {
      this.greetingBanner.classList.remove('fade-out');
    }
    this.showQuickBtn();
    this.isOpened = false;
  }

  /**
   * Khi người dùng bấm "Thưởng thức lại vườn hoa"
   * TUYỆT ĐỐI KHÔNG hẹn giờ 10s tự động bật lại thông báo và phong thư nữa!
   */
  reset() {
    this.isOpened = false;
    this.cancelAutoTimers();

    if (this.envelope) this.envelope.classList.remove('open');
    if (this.wrapper) {
      this.wrapper.classList.remove('vanish');
      this.wrapper.classList.remove('bounce-in');
    }
    if (this.letterModal) {
      this.letterModal.classList.remove('closing');
      this.letterModal.classList.add('hidden');
    }
    if (this.section) this.section.classList.add('hidden');
    if (this.greetingBanner) this.greetingBanner.classList.remove('fade-out');
  }

  showCenterReconsider() {
    if (this.centerReconsiderContainer) {
      this.centerReconsiderContainer.classList.remove('hidden');
    }
  }

  hideCenterReconsider() {
    if (this.centerReconsiderContainer) {
      this.centerReconsiderContainer.classList.add('hidden');
    }
  }

  showQuickBtn() {
    if (this.quickBtn) {
      const span = this.quickBtn.querySelector('span');
      if (span) span.textContent = '💌 Xem lại thư';
      this.quickBtn.classList.remove('hidden');
    }
  }

  hideQuickBtn() {
    if (this.quickBtn) {
      this.quickBtn.classList.add('hidden');
    }
  }

  /**
   * Xử lý khi cô ấy ĐỒNG Ý:
   * - Ẩn nút xem lại thư
   * - Ẩn nút suy nghĩ lại
   */
  handleAgreed() {
    this.hideQuickBtn();
    this.hideCenterReconsider();
  }

  /**
   * Xử lý khi cô ấy TỪ CHỐI:
   * - Giữ nút xem lại thư góc trên
   * - Hiện nút "Bống có muốn suy nghĩ lại không?" ở giữa màn hình vườn hoa
   */
  handleRejected() {
    this.showQuickBtn();
    this.showCenterReconsider();
  }
}
