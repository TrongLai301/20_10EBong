/**
 * audio.js - Background Music Controller with Built-in Romantic Melody Engine
 */

export class AudioManager {
  constructor(audioElementId, toggleButtonId) {
    this.audio = document.getElementById(audioElementId);
    this.btn = document.getElementById(toggleButtonId);
    this.isPlaying = false;
    this.hasUnlocked = false;

    // Web Audio Synthesizer (Fallback & Zero-lag romantic melody)
    this.audioCtx = null;
    this.synthInterval = null;
    this.useSynth = false;

    this.init();
  }

  init() {
    if (!this.btn) return;

    this.icon = this.btn.querySelector('.music-icon');
    this.text = this.btn.querySelector('.music-text');

    // Click toggle button
    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlay();
    });
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.initAudioContext();

    if (this.audio && !this.useSynth) {
      if (!this.audio.src) {
        this.audio.src = '/audio/bgm.mp3';
      }
      this.audio.play().then(() => {
        this.setPlayingState(true);
      }).catch((err) => {
        // Nếu lỗi do autoplay policy (NotAllowedError), không chuyển sang synth vĩnh viễn
        if (err.name === 'NotAllowedError') {
          this.setPlayingState(false);
        } else {
          console.warn('Audio error, switching to synth:', err);
          this.startSynthMelody();
        }
      });
    } else {
      this.startSynthMelody();
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.stopSynthMelody();
    this.setPlayingState(false);
  }

  setPlayingState(isPlaying) {
    this.isPlaying = isPlaying;
    if (this.icon) {
      if (isPlaying) {
        this.icon.classList.add('disc-spinning');
      } else {
        this.icon.classList.remove('disc-spinning');
      }
    }
    if (this.text) {
      this.text.textContent = isPlaying ? 'Tắt nhạc' : 'Bật nhạc';
    }
  }

  startSynthMelody() {
    this.useSynth = true;
    this.setPlayingState(true);

    if (this.synthInterval) return;

    // Giai điệu lofi piano / hộp âm nhạc lãng mạn (Canon in C / Ballade)
    // Tần số các nốt (Hz): C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, G5
    const notes = [
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      392.00, 493.88, 587.33, 783.99,  // G4, B4, D5, G5
      440.00, 523.25, 659.25, 880.00,  // A4, C5, E5, A5
      329.63, 392.00, 493.88, 659.25,  // E4, G4, B4, E5
      349.23, 440.00, 523.25, 698.46,  // F4, A4, C5, F5
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      349.23, 440.00, 523.25, 698.46,  // F4, A4, C5, F5
      392.00, 493.88, 587.33, 783.99   // G4, B4, D5, G5
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isPlaying) return;
      const freq = notes[noteIdx];
      this.playChime(freq, 1.8);
      noteIdx = (noteIdx + 1) % notes.length;
    };

    playNextNote();
    this.synthInterval = setInterval(playNextNote, 600);
  }

  stopSynthMelody() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  playChime(freq, duration = 1.5) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Âm thanh mượt như tiếng đàn piano / chuông pha lê
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // ignore
    }
  }
}
