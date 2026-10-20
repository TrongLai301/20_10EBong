/**
 * main.js - Application Entry Point
 */
import { GardenCanvas } from './scripts/garden.js';
import { AudioManager } from './scripts/audio.js';
import { LetterManager } from './scripts/letter.js';
import { ModalManager } from './scripts/modal.js';
import { sfx } from './scripts/sfx.js';

import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Tự động gắn hiệu ứng âm thanh click nút êm dịu
  sfx.attachButtonSounds();

  // 1. Khởi động Vườn hoa Canvas
  const garden = new GardenCanvas('garden-canvas');

  // 2. Khởi động trình quản lý âm thanh BGM
  const audio = new AudioManager('bgm-audio', 'music-toggle-btn');

  // 3. Khởi động Modal Manager & Letter Manager
  let letterManager;

  const modalManager = new ModalManager({
    onReplay: () => {
      if (letterManager) {
        letterManager.reset();
      }
    },
    onCloseReply: () => {
      if (letterManager) {
        letterManager.closeAndVanish();
      }
    },
    onAgreed: () => {
      if (letterManager) {
        letterManager.handleAgreed();
      }
    },
    onRejected: () => {
      if (letterManager) {
        letterManager.handleRejected();
      }
    },
    onModalOpen: () => {
      garden.pause();
    },
    onModalClose: () => {
      garden.resume();
    }
  });

  letterManager = new LetterManager({
    onAccept: () => {
      modalManager.showReplyModal({ mode: 'agree' });
    },
    onReject: () => {
      modalManager.showSadModal();
    }
  });

  // 4. Cánh cổng trái tim lung linh mở đầu (Chạm để mở cổng -> kích hoạt nhạc, hoa nở, text chúc mừng)
  const welcomeGate = document.getElementById('welcome-gate');
  const greetingBanner = document.getElementById('greeting-banner');
  const btnOpenGate = document.getElementById('btn-open-gate');
  const heartGateTrigger = document.getElementById('heart-gate-trigger');

  if (welcomeGate) {
    let gateOpened = false;

    const handleOpenGate = (e) => {
      if (gateOpened) return;
      gateOpened = true;
      if (e && e.type === 'touchend' && e.cancelable) {
        e.preventDefault();
      }

      // 1. Kích hoạt phát nhạc ngay trong tương tác chạm đầu tiên của người dùng
      audio.play();

      // 2. Kích hoạt animation hiện hoa, vươn cành và thảm cỏ nở rộ
      garden.startBloom();

      // 3. Kích hoạt animation dòng text chúc mừng
      if (greetingBanner) {
        greetingBanner.classList.add('active');
      }

      // 4. Bắn pháo hoa ánh sao nhẹ chào đón
      try {
        confetti({
          particleCount: 38,
          spread: 75,
          origin: { y: 0.52 },
          colors: ['#ff758c', '#ffd166', '#ff85a2', '#ffffff']
        });
      } catch (err) {
        // Safe fallback
      }

      // 5. Hiệu ứng mở cánh cổng trái tim biến mất
      welcomeGate.classList.add('gate-opened');
      setTimeout(() => {
        welcomeGate.style.display = 'none';
      }, 850);

      // 6. Bắt đầu chuỗi đếm giờ 6s xuất hiện thư
      if (letterManager) {
        letterManager.startSequence();
      }
    };

    welcomeGate.addEventListener('click', handleOpenGate);
    welcomeGate.addEventListener('touchend', handleOpenGate);
    if (btnOpenGate) {
      btnOpenGate.addEventListener('click', handleOpenGate);
      btnOpenGate.addEventListener('touchend', handleOpenGate);
    }
    if (heartGateTrigger) {
      heartGateTrigger.addEventListener('click', handleOpenGate);
      heartGateTrigger.addEventListener('touchend', handleOpenGate);
    }
  }

  console.log('🌸 Vườn hoa 20/10 đã sẵn sàng mang lại nụ cười cho cô gái nhỏ! ✨');
});
