/**
 * main.js - Application Entry Point
 */
import { GardenCanvas } from './scripts/garden.js';
import { AudioManager } from './scripts/audio.js';
import { LetterManager } from './scripts/letter.js';
import { ModalManager } from './scripts/modal.js';

document.addEventListener('DOMContentLoaded', () => {
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

  console.log('🌸 Vườn hoa 20/10 đã sẵn sàng mang lại nụ cười cho cô gái nhỏ! ✨');
});
