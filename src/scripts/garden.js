/**
 * garden.js - Realistic Procedural Flower Bloom, Foreground Lush Grass Meadow & Floating Petals Engine
 */

export class GardenCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.flowers = [];
    this.grassBlades = [];
    this.grassFlowers = [];
    this.petals = [];
    this.fireflies = [];
    this.animId = null;

    // Trạng thái nở hoa: Chỉ nở khi mở cổng!
    this.isStarted = false;
    this.startTime = 0;
    this.grassGrowth = 0;

    this.init();
  }

  startBloom() {
    if (this.isStarted) return;
    this.isStarted = true;
    this.startTime = performance.now();
    console.log('🌸 Vườn hoa bắt đầu vươn cành và nở rộ!');
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Tạo hệ thống cánh hoa bay (petals)
    const petalCount = Math.min(36, Math.floor(this.width / 22));
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Tạo đom đóm / ánh sao (fireflies)
    const fireflyCount = Math.min(45, Math.floor(this.width / 20));
    for (let i = 0; i < fireflyCount; i++) {
      this.fireflies.push(this.createFirefly());
    }

    // Nếu không có welcome-gate thì tự động nở luôn (fallback)
    if (!document.getElementById('welcome-gate')) {
      this.startBloom();
    }

    this.loop();
  }

  resize() {
    const oldWidth = this.width;
    const oldHeight = this.height;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Nếu đã nở rồi và chỉ là resize cửa sổ, cập nhật lại toạ độ để không bị mất hoa
    if (this.isStarted && this.flowers.length > 0) {
      const scaleX = this.width / (oldWidth || this.width);
      const scaleY = this.height / (oldHeight || this.height);

      this.flowers.forEach(f => {
        f.x = f.x * scaleX;
        f.baseY = this.height + 5;
        f.targetHeight = f.targetHeight * scaleY;
        f.currentHeight = f.targetHeight;
        f.bloomProgress = 1;
      });

      this.grassBlades.forEach(g => {
        g.x = g.x * scaleX;
        g.baseY = this.height + 5;
      });

      this.grassFlowers.forEach(gf => {
        gf.x = gf.x * scaleX;
        gf.y = this.height - (this.height - gf.y) * scaleY;
      });
    } else {
      // Tái tạo hoa & vườn cỏ theo kích thước màn hình
      this.createGarden();
    }
  }

  createGarden() {
    this.flowers = [];
    this.grassBlades = [];
    this.grassFlowers = [];

    const isMobile = this.width < 500;

    // ==========================================
    // 1. TẠO NHIỀU HOA RỰC RỠ CAO VƯỢT TRÊN CỎ
    // ==========================================
    const totalFlowers = isMobile
      ? Math.max(14, Math.min(18, Math.floor(this.width / 24)))
      : Math.max(22, Math.min(32, Math.floor(this.width / 44)));

    const flowerPalettes = [
      { petal: '#ff758c', inner: '#ffb199', center: '#ffeaa7' }, // Rose pink
      { petal: '#ff8e9e', inner: '#ffd1dc', center: '#f6d365' }, // Peony soft pink
      { petal: '#b39ddb', inner: '#d1c4e9', center: '#fff9c4' }, // Lavender violet
      { petal: '#ff6b81', inner: '#ffa4b5', center: '#ffffff' }, // Coral pink
      { petal: '#ea80fc', inner: '#f8bbd0', center: '#ffe082' }, // Orchid glow
      { petal: '#ff9aa2', inner: '#ffdac1', center: '#fff3b0' }, // Peach blossom
      { petal: '#f48fb1', inner: '#fce4ec', center: '#fff59d' }, // Cherry blossom
      { petal: '#ffab91', inner: '#ffe0b2', center: '#ffffff' }  // Warm apricot
    ];

    const spacing = this.width / (totalFlowers + 1);

    for (let i = 0; i < totalFlowers; i++) {
      const isBackLayer = i % 2 === 0;
      const x = spacing * (i + 1) + (Math.random() - 0.5) * (spacing * 0.65);

      // Chiều cao hoa vươn cao rõ rệt trên màn hình (không bị cỏ che khuất)
      let targetHeight;
      if (isBackLayer) {
        targetHeight = isMobile
          ? this.height * (0.38 + Math.random() * 0.16)
          : this.height * (0.44 + Math.random() * 0.20);
      } else {
        targetHeight = isMobile
          ? this.height * (0.26 + Math.random() * 0.14)
          : this.height * (0.30 + Math.random() * 0.16);
      }

      const palette = flowerPalettes[i % flowerPalettes.length];
      const curve = (Math.random() - 0.5) * (isMobile ? 22 : 38);

      // Độ trễ nở hoa: Nở nối tiếp nhau như một đợt sóng từ 0ms đến 800ms
      const delay = (i / totalFlowers) * 750 + Math.random() * 120;

      this.flowers.push({
        x,
        baseY: this.height + 5,
        targetHeight,
        currentHeight: 0,
        curve,
        palette,
        delay,
        bloomProgress: 0,
        swaySpeed: 0.0014 + Math.random() * 0.0012,
        swayOffset: Math.random() * Math.PI * 2,
        leafCount: 2,
        petalCount: 6 + (i % 3),
        size: isMobile ? (isBackLayer ? 15 : 18) + Math.random() * 5 : (isBackLayer ? 20 : 25) + Math.random() * 7,
        isBackLayer,
        stalkWidth: isMobile ? (isBackLayer ? 2.8 : 3.6) : (isBackLayer ? 3.4 : 4.6)
      });
    }

    // ==========================================
    // 2. TẠO THẢM CỎ XANH Ở CHÂN VƯỜN HOA
    // ==========================================
    const bladeCount = Math.floor(this.width / (isMobile ? 4.0 : 4.6));
    const grassSpacing = this.width / bladeCount;

    for (let i = 0; i < bladeCount; i++) {
      const x = i * grassSpacing + (Math.random() - 0.5) * (grassSpacing * 0.8);
      // Chiều cao cỏ vừa vặn (30-65px), làm nền tôn hoa lên
      const height = isMobile
        ? 30 + Math.random() * 35
        : 45 + Math.random() * 45;
      const width = isMobile ? 2.4 + Math.random() * 1.8 : 3.2 + Math.random() * 2.4;
      const lean = (Math.random() - 0.5) * (height * 0.4);
      const swaySpeed = 0.0016 + Math.random() * 0.0015;
      const swayOffset = Math.random() * Math.PI * 2;

      const greenType = Math.random();
      let colorBottom = '#153319';
      let colorTop = '#447a4b';
      if (greenType > 0.6) {
        colorBottom = '#1b3d21';
        colorTop = '#5f9966';
      } else if (greenType > 0.3) {
        colorBottom = '#112a14';
        colorTop = '#37683f';
      }

      this.grassBlades.push({
        x,
        baseY: this.height + 5,
        height,
        width,
        lean,
        swaySpeed,
        swayOffset,
        colorBottom,
        colorTop
      });
    }

    // 3. Những bông hoa dại nhỏ li ti điểm xuyết trong thảm cỏ
    const grassFlowerCount = isMobile ? 12 : 20;
    for (let i = 0; i < grassFlowerCount; i++) {
      this.grassFlowers.push({
        x: Math.random() * this.width,
        y: this.height - (10 + Math.random() * (isMobile ? 35 : 55)),
        radius: 2 + Math.random() * 2.2,
        color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#ffd1dc' : '#fff9c4'),
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.002
      });
    }
  }

  createPetal(randomY = false) {
    const colors = ['#ffb7b2', '#ff9aa2', '#ffdac1', '#fcd5ce', '#f6b9ad', '#ffffff'];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: 7 + Math.random() * 8,
      speedY: 0.8 + Math.random() * 1.3,
      speedX: -0.4 + Math.random() * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.035,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.45 + Math.random() * 0.45,
      oscillationSpeed: 0.02 + Math.random() * 0.02,
      oscillationDistance: 0.8 + Math.random() * 1.5,
      step: Math.random() * 100
    };
  }

  createFirefly() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: 1 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random(),
      alphaSpeed: 0.01 + Math.random() * 0.02,
      color: Math.random() > 0.4 ? '#f6d365' : '#ff9aa2'
    };
  }

  update(now) {
    if (this.isStarted) {
      const elapsed = now - this.startTime;

      // 1. Cỏ vươn lên mượt mà trong 1.0 giây
      if (this.grassGrowth < 1) {
        this.grassGrowth = Math.min(1, elapsed / 1000);
      }

      // 2. Hoa mọc thân và nở bung rực rỡ
      this.flowers.forEach(f => {
        if (elapsed < f.delay) return;

        // Tiến trình sinh trưởng của từng bông hoa (1.3s để vươn hết cành)
        const flowerElapsed = elapsed - f.delay;
        const growT = Math.min(1, flowerElapsed / 1300);

        // Hàm ease-out cubic giúp cành hoa vươn lên tự nhiên
        const easeGrow = 1 - Math.pow(1 - growT, 3);
        f.currentHeight = f.targetHeight * easeGrow;

        // Khi cành đã vươn được 35% độ cao, đóa hoa bắt đầu nở bung
        if (growT >= 0.35) {
          const bloomT = Math.min(1, (growT - 0.35) / 0.65);
          // Ease-out mượt cho cánh hoa bung nở
          f.bloomProgress = 1 - Math.pow(1 - bloomT, 2.4);
        } else {
          f.bloomProgress = 0;
        }
      });

      // 3. Cập nhật cánh hoa bay
      this.petals.forEach(p => {
        p.step += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.step) * p.oscillationDistance;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > this.height + 20) {
          Object.assign(p, this.createPetal(false));
        }
        if (p.x > this.width + 20) p.x = -20;
        if (p.x < -20) p.x = this.width + 20;
      });
    }

    // 4. Cập nhật đom đóm (luôn bay nhẹ nhàng)
    this.fireflies.forEach(ff => {
      ff.x += ff.speedX;
      ff.y += ff.speedY;
      ff.alpha += ff.alphaSpeed;

      if (ff.alpha > 0.95 || ff.alpha < 0.1) {
        ff.alphaSpeed = -ff.alphaSpeed;
      }

      if (ff.x < 0) ff.x = this.width;
      if (ff.x > this.width) ff.x = 0;
      if (ff.y < 0) ff.y = this.height;
      if (ff.y > this.height) ff.y = 0;
    });
  }

  drawFlower(f, now) {
    if (!this.isStarted || f.currentHeight <= 2) return;

    const sway = Math.sin(now * f.swaySpeed + f.swayOffset) * (f.isBackLayer ? 8 : 12) * (f.currentHeight / f.targetHeight);
    const topX = f.x + f.curve + sway;
    const topY = f.baseY - f.currentHeight;

    // 1. Thân cành hoa
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(f.x, f.baseY);
    this.ctx.quadraticCurveTo(f.x + f.curve * 0.5, f.baseY - f.currentHeight * 0.5, topX, topY);
    this.ctx.lineWidth = f.stalkWidth;
    this.ctx.strokeStyle = f.isBackLayer ? '#3a6645' : '#4a7c59';
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    // 2. Lá nhỏ trên thân
    if (f.currentHeight > f.targetHeight * 0.35) {
      const leafFactor = Math.min(1, (f.currentHeight - f.targetHeight * 0.35) / (f.targetHeight * 0.3));
      const leafY = f.baseY - f.currentHeight * 0.42;
      const leafX = f.x + (f.curve * 0.5) + (sway * 0.42);

      this.ctx.beginPath();
      this.ctx.ellipse(leafX - 11 * leafFactor, leafY, 13 * leafFactor, 5.5 * leafFactor, -0.4, 0, Math.PI * 2);
      this.ctx.ellipse(leafX + 11 * leafFactor, leafY - 12 * leafFactor, 13 * leafFactor, 5.5 * leafFactor, 0.4, 0, Math.PI * 2);
      this.ctx.fillStyle = f.isBackLayer ? '#486f50' : '#5d8a66';
      this.ctx.fill();
    }
    this.ctx.restore();

    // 3. Đóa hoa nở bung
    if (f.bloomProgress > 0) {
      this.ctx.save();
      this.ctx.translate(topX, topY);
      const scale = Math.max(0.01, f.bloomProgress);
      this.ctx.scale(scale, scale);

      // Vẽ cánh hoa tròn trịa, rực rỡ
      const petalAngle = (Math.PI * 2) / f.petalCount;
      for (let i = 0; i < f.petalCount; i++) {
        this.ctx.save();
        this.ctx.rotate(i * petalAngle);
        this.ctx.beginPath();
        this.ctx.ellipse(0, -f.size, f.size * 0.58, f.size * 0.95, 0, 0, Math.PI * 2);

        const grad = this.ctx.createRadialGradient(0, -f.size * 0.6, 1, 0, -f.size, f.size);
        grad.addColorStop(0, f.palette.inner);
        grad.addColorStop(1, f.palette.petal);

        this.ctx.fillStyle = grad;
        this.ctx.shadowBlur = f.isBackLayer ? 8 : 14;
        this.ctx.shadowColor = f.palette.petal;
        this.ctx.fill();
        this.ctx.restore();
      }

      // Nhụy hoa phát sáng ở tâm
      this.ctx.beginPath();
      this.ctx.arc(0, 0, f.size * 0.36, 0, Math.PI * 2);
      this.ctx.fillStyle = f.palette.center;
      this.ctx.shadowBlur = 16;
      this.ctx.shadowColor = '#fff';
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  drawGrassMeadow(now) {
    if (!this.isStarted || this.grassGrowth <= 0.001) return;

    // 1. Mù sương nhẹ ở chân thảm cỏ
    const mistAlpha = 0.45 * this.grassGrowth;
    const mistGrad = this.ctx.createLinearGradient(0, this.height - 65, 0, this.height);
    mistGrad.addColorStop(0, 'rgba(12, 28, 16, 0)');
    mistGrad.addColorStop(1, `rgba(16, 36, 20, ${mistAlpha})`);
    this.ctx.fillStyle = mistGrad;
    this.ctx.fillRect(0, this.height - 65, this.width, 65);

    // 2. Từng nhánh cỏ đung đưa
    const growth = this.grassGrowth;
    this.grassBlades.forEach(g => {
      const currentHeight = g.height * growth;
      if (currentHeight < 2) return;

      const sway = Math.sin(now * g.swaySpeed + g.swayOffset) * 5 * growth;
      const tipX = g.x + g.lean * growth + sway;
      const tipY = g.baseY - currentHeight;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(g.x - g.width * 0.5 * growth, g.baseY);
      this.ctx.quadraticCurveTo(g.x + sway * 0.4, g.baseY - currentHeight * 0.5, tipX, tipY);
      this.ctx.quadraticCurveTo(g.x + sway * 0.4, g.baseY - currentHeight * 0.5, g.x + g.width * 0.5 * growth, g.baseY);
      this.ctx.closePath();

      const bladeGrad = this.ctx.createLinearGradient(g.x, g.baseY, tipX, tipY);
      bladeGrad.addColorStop(0, g.colorBottom);
      bladeGrad.addColorStop(1, g.colorTop);

      this.ctx.fillStyle = bladeGrad;
      this.ctx.fill();
      this.ctx.restore();
    });

    // 3. Những bông hoa dại nhỏ li ti điểm xuyết trong cỏ
    if (this.grassGrowth > 0.4) {
      const flowerAlpha = Math.min(1, (this.grassGrowth - 0.4) / 0.6);
      this.grassFlowers.forEach(gf => {
        const sway = Math.sin(now * gf.swaySpeed + gf.swayOffset) * 2.5;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(gf.x + sway, gf.y, gf.radius * flowerAlpha, 0, Math.PI * 2);
        this.ctx.fillStyle = gf.color;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = gf.color;
        this.ctx.globalAlpha = flowerAlpha;
        this.ctx.fill();
        this.ctx.restore();
      });
    }
  }

  draw(now) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Vẽ đom đóm lung linh
    this.fireflies.forEach(ff => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = ff.color;
      this.ctx.globalAlpha = Math.max(0, Math.min(1, ff.alpha));
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = ff.color;
      this.ctx.fill();
      this.ctx.restore();
    });

    // 2. Vẽ hoa lớp sau (Background Flowers)
    this.flowers.forEach(f => {
      if (f.isBackLayer) {
        this.drawFlower(f, now);
      }
    });

    // 3. Vẽ hoa lớp trước (Foreground Flowers)
    this.flowers.forEach(f => {
      if (!f.isBackLayer) {
        this.drawFlower(f, now);
      }
    });

    // 4. VẼ VƯỜN CỎ ĐẬM CHẤT THIÊN NHIÊN NGAY CHÂN HOA
    this.drawGrassMeadow(now);

    // 5. Vẽ cánh hoa bay bồng bềnh (chỉ sau khi mở cổng)
    if (this.isStarted) {
      this.petals.forEach(p => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.restore();
      });
    }
  }

  loop() {
    if (this.isPaused) return;
    const now = performance.now();
    this.update(now);
    this.draw(now);
    this.animId = requestAnimationFrame(() => this.loop());
  }

  pause() {
    this.isPaused = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.loop();
  }

  destroy() {
    this.pause();
  }
}
