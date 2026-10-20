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

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Tạo hệ thống cánh hoa bay (petals)
    const petalCount = Math.min(40, Math.floor(this.width / 20));
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Tạo đom đóm / ánh sao (fireflies)
    const fireflyCount = Math.min(50, Math.floor(this.width / 18));
    for (let i = 0; i < fireflyCount; i++) {
      this.fireflies.push(this.createFirefly());
    }

    this.loop();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Tái tạo hoa & vườn cỏ phủ kín theo tỷ lệ màn hình
    this.createGarden();
  }

  createGarden() {
    this.flowers = [];
    this.grassBlades = [];
    this.grassFlowers = [];

    const isMobile = this.width < 500;

    // ==========================================
    // 1. TẠO NHIỀU HOA (Đa tầng: Hậu cảnh & Tiền cảnh)
    // ==========================================
    // Tăng đáng kể số lượng hoa: 14-18 đóa trên mobile, 26-34 đóa trên desktop
    const totalFlowers = isMobile
      ? Math.max(14, Math.min(18, Math.floor(this.width / 24)))
      : Math.max(24, Math.min(34, Math.floor(this.width / 42)));

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
      // Chia lớp: 45% hoa lớp sau (cao hơn, dịu hơn), 55% hoa lớp trước (rực rỡ)
      const isBackLayer = i % 2 === 0;
      const x = spacing * (i + 1) + (Math.random() - 0.5) * (spacing * 0.7);

      let targetHeight;
      if (isBackLayer) {
        targetHeight = isMobile
          ? this.height * (0.24 + Math.random() * 0.16)
          : this.height * (0.32 + Math.random() * 0.24);
      } else {
        targetHeight = isMobile
          ? this.height * (0.16 + Math.random() * 0.14)
          : this.height * (0.20 + Math.random() * 0.18);
      }

      const palette = flowerPalettes[i % flowerPalettes.length];
      const curve = (Math.random() - 0.5) * (isMobile ? 26 : 46);
      const bloomDelay = 500 + i * 160 + Math.random() * 300;

      this.flowers.push({
        x,
        baseY: this.height + 20,
        targetHeight,
        currentHeight: 0,
        curve,
        palette,
        bloomDelay,
        bloomProgress: 0,
        swaySpeed: 0.0014 + Math.random() * 0.0012,
        swayOffset: Math.random() * Math.PI * 2,
        leafCount: 2,
        petalCount: 6 + Math.floor(Math.random() * 3),
        size: isMobile ? (isBackLayer ? 13 : 16) + Math.random() * 6 : (isBackLayer ? 18 : 23) + Math.random() * 8,
        isBackLayer,
        stalkWidth: isMobile ? (isBackLayer ? 2.6 : 3.4) : (isBackLayer ? 3.2 : 4.4)
      });
    }

    // ==========================================
    // 2. TẠO VƯỜN CỎ DÀY ĐẶC PHÍA TRƯỚC HOA
    // ==========================================
    // Số lượng nhánh cỏ: phủ kín đáy canvas
    const bladeCount = Math.floor(this.width / (isMobile ? 3.2 : 3.8));
    const grassSpacing = this.width / bladeCount;

    for (let i = 0; i < bladeCount; i++) {
      const x = i * grassSpacing + (Math.random() - 0.5) * (grassSpacing * 0.8);
      const height = isMobile
        ? 35 + Math.random() * 55
        : 50 + Math.random() * 85;
      const width = isMobile ? 2.5 + Math.random() * 2.2 : 3.5 + Math.random() * 3.0;
      const lean = (Math.random() - 0.5) * (height * 0.45);
      const swaySpeed = 0.0016 + Math.random() * 0.0015;
      const swayOffset = Math.random() * Math.PI * 2;

      // Độ sáng xanh tươi mát
      const greenType = Math.random();
      let colorBottom = '#18381d';
      let colorTop = '#4e8555';
      if (greenType > 0.6) {
        colorBottom = '#1e4425';
        colorTop = '#71ab78';
      } else if (greenType > 0.3) {
        colorBottom = '#143118';
        colorTop = '#3f7347';
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
    const grassFlowerCount = isMobile ? 12 : 24;
    for (let i = 0; i < grassFlowerCount; i++) {
      this.grassFlowers.push({
        x: Math.random() * this.width,
        y: this.height - (10 + Math.random() * (isMobile ? 45 : 70)),
        radius: 2 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#ffd1dc' : '#fff9c4'),
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.002
      });
    }
  }

  createPetal(randomY = false) {
    const colors = ['#ffb7b2', '#ff9aa2', '#ffdac1', '#e2f0cb', '#f6b9ad', '#ffffff'];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: 7 + Math.random() * 8,
      speedY: 0.8 + Math.random() * 1.4,
      speedX: -0.5 + Math.random() * 1.0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.4 + Math.random() * 0.5,
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
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      alpha: Math.random(),
      alphaSpeed: 0.01 + Math.random() * 0.02,
      color: Math.random() > 0.4 ? '#f6d365' : '#ff9aa2'
    };
  }

  update(now) {
    // Cập nhật hoa vươn cành & nở
    this.flowers.forEach(f => {
      if (f.currentHeight < f.targetHeight) {
        f.currentHeight += (f.targetHeight - f.currentHeight) * 0.035;
      }
      if (now > f.bloomDelay && f.bloomProgress < 1) {
        f.bloomProgress += 0.022;
        if (f.bloomProgress > 1) f.bloomProgress = 1;
      }
    });

    // Cập nhật cánh hoa rơi
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

    // Cập nhật đom đóm
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
    const sway = Math.sin(now * f.swaySpeed + f.swayOffset) * (f.isBackLayer ? 9 : 14) * (f.currentHeight / f.targetHeight);
    const topX = f.x + f.curve + sway;
    const topY = f.baseY - f.currentHeight;

    // 1. Thân cành hoa
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(f.x, f.baseY);
    this.ctx.quadraticCurveTo(f.x + f.curve * 0.5, f.baseY - f.currentHeight * 0.5, topX, topY);
    this.ctx.lineWidth = f.stalkWidth;
    this.ctx.strokeStyle = f.isBackLayer ? '#3d6949' : '#4a7c59';
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    // 2. Lá nhỏ trên thân
    if (f.currentHeight > f.targetHeight * 0.4) {
      const leafY = f.baseY - f.currentHeight * 0.45;
      const leafX = f.x + (f.curve * 0.5) + (sway * 0.45);
      this.ctx.beginPath();
      this.ctx.ellipse(leafX - 11, leafY, 13, 5.5, -0.4, 0, Math.PI * 2);
      this.ctx.ellipse(leafX + 11, leafY - 14, 13, 5.5, 0.4, 0, Math.PI * 2);
      this.ctx.fillStyle = f.isBackLayer ? '#486f50' : '#5d8a66';
      this.ctx.fill();
    }
    this.ctx.restore();

    // 3. Đóa hoa nở
    if (f.bloomProgress > 0) {
      this.ctx.save();
      this.ctx.translate(topX, topY);
      const scale = f.bloomProgress;
      this.ctx.scale(scale, scale);

      // Vẽ cánh hoa
      const petalAngle = (Math.PI * 2) / f.petalCount;
      for (let i = 0; i < f.petalCount; i++) {
        this.ctx.save();
        this.ctx.rotate(i * petalAngle);
        this.ctx.beginPath();
        this.ctx.ellipse(0, -f.size, f.size * 0.56, f.size * 0.92, 0, 0, Math.PI * 2);
        
        const grad = this.ctx.createRadialGradient(0, -f.size * 0.6, 1, 0, -f.size, f.size);
        grad.addColorStop(0, f.palette.inner);
        grad.addColorStop(1, f.palette.petal);

        this.ctx.fillStyle = grad;
        this.ctx.shadowBlur = f.isBackLayer ? 6 : 10;
        this.ctx.shadowColor = f.palette.petal;
        this.ctx.fill();
        this.ctx.restore();
      }

      // Nhụy hoa phát sáng ở tâm
      this.ctx.beginPath();
      this.ctx.arc(0, 0, f.size * 0.38, 0, Math.PI * 2);
      this.ctx.fillStyle = f.palette.center;
      this.ctx.shadowBlur = 14;
      this.ctx.shadowColor = '#fff';
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  drawGrassMeadow(now) {
    // 1. Lớp mù sương ánh xanh dịu ở chân vườn cỏ
    const mistGrad = this.ctx.createLinearGradient(0, this.height - 110, 0, this.height);
    mistGrad.addColorStop(0, 'rgba(12, 28, 16, 0)');
    mistGrad.addColorStop(1, 'rgba(16, 36, 20, 0.6)');
    this.ctx.fillStyle = mistGrad;
    this.ctx.fillRect(0, this.height - 110, this.width, 110);

    // 2. Vẽ từng nhánh cỏ đung đưa trước hoa
    this.grassBlades.forEach(g => {
      const sway = Math.sin(now * g.swaySpeed + g.swayOffset) * 6;
      const tipX = g.x + g.lean + sway;
      const tipY = g.baseY - g.height;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(g.x - g.width * 0.5, g.baseY);
      this.ctx.quadraticCurveTo(g.x + sway * 0.4, g.baseY - g.height * 0.5, tipX, tipY);
      this.ctx.quadraticCurveTo(g.x + sway * 0.4, g.baseY - g.height * 0.5, g.x + g.width * 0.5, g.baseY);
      this.ctx.closePath();

      const bladeGrad = this.ctx.createLinearGradient(g.x, g.baseY, tipX, tipY);
      bladeGrad.addColorStop(0, g.colorBottom);
      bladeGrad.addColorStop(1, g.colorTop);

      this.ctx.fillStyle = bladeGrad;
      this.ctx.fill();
      this.ctx.restore();
    });

    // 3. Những bông hoa dại nhỏ li ti điểm xuyết trong cỏ
    this.grassFlowers.forEach(gf => {
      const sway = Math.sin(now * gf.swaySpeed + gf.swayOffset) * 3;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(gf.x + sway, gf.y, gf.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gf.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = gf.color;
      this.ctx.fill();
      this.ctx.restore();
    });
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

    // 4. VẼ VƯỜN CỎ ĐẬM CHẤT THIÊN NHIÊN NGAY TRƯỚC HOA
    this.drawGrassMeadow(now);

    // 5. Vẽ cánh hoa bay bồng bềnh
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

  loop() {
    const now = performance.now();
    this.update(now);
    this.draw(now);
    this.animId = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
