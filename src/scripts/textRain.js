/**
 * textRain.js - Hiệu ứng mưa rơi các chữ ngọt ngào khi Đồng Ý / Suy Nghĩ Lại
 */

/**
 * =========================================================================
 * DANH SÁCH TỪ NGỮ HIỆU ỨNG MƯA RƠI CHỮ
 * 👉 Cậu có thể tự do thêm, bớt hoặc thay đổi các từ/cụm từ tùy thích tại đây:
 * =========================================================================
 */
export const DEFAULT_RAIN_WORDS = [
  'Thích',
  'ebong',
  'bống iu',
  'Thích Bống 💕',
  'Yêu em nhìu',
  'Dễ thương quá trời',
  'Bé Bống ngoan 🌸',
  'ỎOOOOOOOOOO đồng ý rồi✨',
  '20/10 ngọt ngào',
  'HIHIIIIIIIIII 🥰',
  'Hạnh phúc nè',
  'Thương ơi là thương ❤️',
  'Công chúa nhỏ',
];

export class TextRainManager {
  constructor({ containerId = 'text-rain-container', words = DEFAULT_RAIN_WORDS } = {}) {
    this.containerId = containerId;
    this.words = Array.isArray(words) && words.length > 0 ? [...words] : [...DEFAULT_RAIN_WORDS];
    this.container = document.getElementById(this.containerId);
    this.isRunning = false;
    this.spawnTimer = null;

    // Bảng màu lãng mạn cao cấp phù hợp với giao diện đêm và hoa
    this.colorPalettes = [
      { text: '#ffffff', glow: 'rgba(255, 117, 140, 0.95)', border: 'rgba(255, 117, 140, 0.45)' },
      { text: '#ffd1dc', glow: 'rgba(255, 105, 180, 0.85)', border: 'rgba(255, 182, 193, 0.45)' },
      { text: '#ff758c', glow: 'rgba(255, 117, 140, 0.8)', border: 'rgba(255, 117, 140, 0.4)' },
      { text: '#ff85a2', glow: 'rgba(255, 94, 126, 0.85)', border: 'rgba(255, 94, 126, 0.4)' },
      { text: '#ffd166', glow: 'rgba(255, 209, 102, 0.9)', border: 'rgba(255, 209, 102, 0.45)' },
      { text: '#ffe5ec', glow: 'rgba(255, 182, 193, 0.9)', border: 'rgba(255, 255, 255, 0.4)' },
      { text: '#ff9aa2', glow: 'rgba(255, 154, 162, 0.85)', border: 'rgba(255, 154, 162, 0.4)' }
    ];

    this.styles = ['style-glow', 'style-pill', 'style-handwritten'];
    this.decorIcons = ['💕', '🌸', '✨', '❤️', '🥰', '💖', '🌷', '🎀'];

    this.ensureContainer();
  }

  ensureContainer() {
    if (!this.container) {
      this.container = document.getElementById(this.containerId);
    }
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.container.className = 'text-rain-container';
      this.container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.container);
    }
  }

  /**
   * Cập nhật danh sách từ rơi mới nếu cần
   */
  setWords(newWords) {
    if (Array.isArray(newWords) && newWords.length > 0) {
      this.words = [...newWords];
    }
  }

  /**
   * Bắt đầu mưa chữ (hỗ trợ hẹn giờ delayMs)
   */
  start({ delayMs = 0, initialBurst = false } = {}) {
    this.ensureContainer();
    this.clearDelayTimeout();

    if (delayMs > 0) {
      this.delayTimeout = setTimeout(() => {
        this.delayTimeout = null;
        this._executeStart({ initialBurst });
      }, delayMs);
      return;
    }

    this._executeStart({ initialBurst });
  }

  _executeStart({ initialBurst = false } = {}) {
    if (this.isRunning) return;
    this.isRunning = true;

    if (initialBurst) {
      // Tạo một đợt chữ ban đầu rải rác sẵn trên màn hình
      const initialBurstCount = window.innerWidth < 600 ? 10 : 16;
      for (let i = 0; i < initialBurstCount; i++) {
        const delay = -(Math.random() * 4.5 + 0.3);
        this.spawnWord({ delaySeconds: delay });
      }
    } else {
      // Bắt đầu rơi tự nhiên từ trên đỉnh xuống
      this.spawnWord();
      setTimeout(() => this.spawnWord(), 160);
      setTimeout(() => this.spawnWord(), 320);
    }

    // Định kỳ rơi đều đặn liên tục
    const intervalTime = window.innerWidth < 600 ? 320 : 250;
    this.spawnTimer = setInterval(() => {
      if (!this.isRunning) return;
      this.spawnWord();
    }, intervalTime);
  }

  clearDelayTimeout() {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
    }
  }

  /**
   * Sinh một chữ rơi ngẫu nhiên
   */
  spawnWord({ delaySeconds = 0 } = {}) {
    if (!this.container || !this.isRunning) return;

    // Giới hạn số lượng phần tử trên màn hình để đảm bảo siêu mượt (60fps) trên mọi điện thoại
    const maxItems = window.innerWidth < 600 ? 26 : 38;
    if (this.container.childElementCount >= maxItems) return;

    const wordText = this.words[Math.floor(Math.random() * this.words.length)];
    const palette = this.colorPalettes[Math.floor(Math.random() * this.colorPalettes.length)];
    const styleChoice = this.styles[Math.floor(Math.random() * this.styles.length)];

    // Tọa độ X (tránh sát mép quá mức)
    const posX = Math.floor(Math.random() * 88 + 6);
    const swayX = Math.floor((Math.random() - 0.5) * 70); // Dao động ngang -35px đến +35px
    const rotStart = Math.floor((Math.random() - 0.5) * 22);
    const rotEnd = Math.floor((Math.random() - 0.5) * 22);
    const duration = (Math.random() * 2.4 + 4.2).toFixed(2); // 4.2s - 6.6s
    const targetOpacity = (Math.random() * 0.2 + 0.8).toFixed(2);

    let fontSize = 17;
    if (styleChoice === 'style-handwritten') {
      fontSize = Math.floor(Math.random() * 9 + 23); // 23px - 31px
    } else if (styleChoice === 'style-pill') {
      fontSize = Math.floor(Math.random() * 4 + 14); // 14px - 17px
    } else {
      fontSize = Math.floor(Math.random() * 7 + 16); // 16px - 22px
    }

    // Trên màn hình di động nhỏ, co nhẹ kích cỡ chữ
    if (window.innerWidth < 480) {
      fontSize = Math.max(13, fontSize - 2.5);
    }

    const item = document.createElement('div');
    item.className = `rain-word-item ${styleChoice}`;
    item.style.setProperty('--pos-x', `${posX}%`);
    item.style.setProperty('--sway-x', `${swayX}px`);
    item.style.setProperty('--rot-start', `${rotStart}deg`);
    item.style.setProperty('--rot-end', `${rotEnd}deg`);
    item.style.setProperty('--fall-duration', `${duration}s`);
    item.style.setProperty('--fall-delay', `${delaySeconds}s`);
    item.style.setProperty('--glow-color', palette.glow);
    item.style.setProperty('--border-color', palette.border);
    item.style.setProperty('--target-opacity', targetOpacity);
    item.style.color = palette.text;
    item.style.fontSize = `${fontSize}px`;
    item.style.left = `${posX}%`;

    // Ghép chữ và thỉnh thoảng thêm icon xinh xắn
    const hasIconAlready = /[\u{1F300}-\u{1F9FF}]/u.test(wordText);
    const shouldAddIcon = !hasIconAlready && Math.random() < 0.45;
    const randomIcon = shouldAddIcon ? this.decorIcons[Math.floor(Math.random() * this.decorIcons.length)] : '';

    item.innerHTML = `
      <span class="rain-word-text">${wordText}</span>
      ${shouldAddIcon ? `<span class="rain-word-icon">${randomIcon}</span>` : ''}
    `;

    // Tự hủy khi animation hoàn thành
    const cleanup = () => {
      item.removeEventListener('animationend', cleanup);
      if (item.parentNode) {
        item.remove();
      }
    };
    item.addEventListener('animationend', cleanup);

    this.container.appendChild(item);
  }

  /**
   * Dừng tạo chữ mới
   */
  stop() {
    this.clearDelayTimeout();
    this.isRunning = false;
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
  }

  /**
   * Xóa sạch toàn bộ chữ rơi ngay lập tức
   */
  clear() {
    this.stop();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
