/**
 * sfx.js - Web Audio SFX Engine
 * Hiệu ứng âm thanh ngọt ngào, tinh tế, êm dịu (nhỏ hơn nhạc nền, 0ms lag)
 */

export class SFXManager {
  constructor({ masterVolume = 0.2 } = {}) {
    this.masterVolume = masterVolume;
    this.audioCtx = null;
    this.lastPlayTime = 0;
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * 1. Âm thanh bấm nút (Tactile Bubble Pop / Soft Tap)
   * Êm ái, hiện đại, không chói tai
   */
  playButtonClick() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Debounce nhẹ tránh spam click
    if (now - this.lastPlayTime < 0.04) return;
    this.lastPlayTime = now;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch lượn nhẹ từ 580Hz xuống 240Hz trong 65ms tạo tiếng pop mềm mại
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.065);

      gain.gain.setValueAtTime(this.masterVolume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (err) {
      // AudioContext fallback
    }
  }

  /**
   * 2. Âm thanh phong bì thư bay đến (Ethereal Glide / Soft Whoosh)
   * Âm hưởng lướt gió thần tiên êm dịu khi lá thư xuất hiện
   */
  playEnvelopeArrival() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    try {
      // Thành phần 1: Tiếng gió lướt nhẹ nhàng (Filter sweeping)
      const bufferSize = ctx.sampleRate * 0.45; // 450ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.45);
      filter.Q.value = 3.5;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(this.masterVolume * 0.65, now + 0.18);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.46);

      // Thành phần 2: Chuông ngọc lấp lánh nhẹ (Chime chime)
      const chimes = [783.99, 1046.50]; // G5, C6
      chimes.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();

        chimeOsc.type = 'triangle';
        chimeOsc.frequency.setValueAtTime(freq, now + 0.15 + idx * 0.1);

        chimeGain.gain.setValueAtTime(0.001, now + 0.15 + idx * 0.1);
        chimeGain.gain.linearRampToValueAtTime(this.masterVolume * 0.7, now + 0.18 + idx * 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65 + idx * 0.1);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        chimeOsc.start(now + 0.15 + idx * 0.1);
        chimeOsc.stop(now + 0.7 + idx * 0.1);
      });
    } catch (err) {
      // Safe fallback
    }
  }

  /**
   * 3. Âm thanh mở phong bì (Crack seal & Paper unfold)
   */
  playEnvelopeOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    try {
      // Nốt chuông mở thư ngọt ngào
      const notes = [659.25, 880.0, 1174.66]; // E5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.85, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch (err) {
      // Safe fallback
    }
  }

  /**
   * 4. Âm thanh ngọt ngào khi đồng ý (Romantic Sweet Chord)
   */
  playAgreeChord() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    try {
      // Hợp âm C Major 9 lấp lánh (C5, E5, G5, B5, C6)
      const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.75, now + idx * 0.05 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.65);
      });
    } catch (err) {
      // Safe fallback
    }
  }

  /**
   * 5. Âm thanh thông báo toast xuất hiện (Soft Ting)
   */
  playNotification() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.08); // D6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.7, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (err) {
      // Safe fallback
    }
  }

  /**
   * Tự động gắn âm thanh click cho các button trên toàn trang web
   */
  attachButtonSounds() {
    const handleBtnClick = (e) => {
      const target = e.target.closest('button, .btn, .icon-btn, .quick-btn');
      if (target) {
        // Tránh trùng với các nút có hiệu ứng âm thanh riêng biệt
        const id = target.id;
        if (id === 'envelope-seal' || id === 'btn-accept' || id === 'btn-confirm-proceed') {
          return;
        }
        this.playButtonClick();
      }
    };

    document.addEventListener('click', handleBtnClick, { passive: true });
  }
}

// Khởi tạo một singleton SFX Manager dùng chung toàn ứng dụng
export const sfx = new SFXManager({ masterVolume: 0.18 });
