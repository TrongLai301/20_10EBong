/**
 * generate-qr.js - Tạo mã QR Trái Tim & Thiệp QR Quà Tặng 20/10 cực đẹp và quét chuẩn 100%
 */
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const TARGET_URL = 'https://20-10-e-bong.vercel.app/';

// Tạo ma trận QR với mức sửa lỗi cao nhất (High - H = 30% recovery)
const qr = QRCode.create(TARGET_URL, {
  errorCorrectionLevel: 'H'
});

const modules = qr.modules;
const size = modules.size; // 33x33

// Tọa độ 3 Finder Patterns (7x7)
function isFinderPattern(x, y) {
  if (x < 7 && y < 7) return true; // Top-Left
  if (x >= size - 7 && y < 7) return true; // Top-Right
  if (x < 7 && y >= size - 7) return true; // Bottom-Left
  return false;
}

// Vùng trung tâm (để đặt trái tim logo mà không đè finder patterns)
function isCenterLogo(x, y) {
  const centerStart = Math.floor(size / 2) - 3;
  const centerEnd = Math.floor(size / 2) + 3;
  return x >= centerStart && x <= centerEnd && y >= centerStart && y <= centerEnd;
}

// ==========================================
// 1. TẠO THIỆP QR TRÁI TIM TOÀN DIỆN (CARD)
// ==========================================
function generateGiftCardSVG() {
  const cardW = 900;
  const cardH = 1100;

  // Kích thước vùng vẽ QR code
  const qrBoxSize = 420;
  const qrStartX = (cardW - qrBoxSize) / 2;
  const qrStartY = 420;
  const moduleSize = qrBoxSize / size;

  let qrDotsSVG = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isCenterLogo(c, r)) continue; // Để trống tâm cho huy hiệu trái tim

      const isDark = modules.get(c, r);
      if (!isDark) continue;

      const x = qrStartX + c * moduleSize;
      const y = qrStartY + r * moduleSize;

      if (isFinderPattern(c, r)) {
        // Finder pattern dots: bo tròn mượt mà
        qrDotsSVG += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${moduleSize.toFixed(1)}" height="${moduleSize.toFixed(1)}" rx="3" ry="3" fill="#9e1b42" />\n`;
      } else {
        // Data dots: hạt ngọc tròn lấp lánh rose ruby
        const cx = (x + moduleSize / 2).toFixed(1);
        const cy = (y + moduleSize / 2).toFixed(1);
        const radius = (moduleSize * 0.44).toFixed(1);
        qrDotsSVG += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#dotGradient)" />\n`;
      }
    }
  }

  // Tọa độ tâm cho logo trái tim
  const logoCenterX = qrStartX + (size * moduleSize) / 2;
  const logoCenterY = qrStartY + (size * moduleSize) / 2;
  const logoRadius = moduleSize * 3.6;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardW} ${cardH}" width="${cardW}" height="${cardH}">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#2a1638" />
      <stop offset="60%" stop-color="#150d24" />
      <stop offset="100%" stop-color="#0a0514" />
    </radialGradient>

    <!-- Heart Background Glow -->
    <radialGradient id="heartGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ff758c" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#ff758c" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ff758c" stop-opacity="0" />
    </radialGradient>

    <!-- Golden Ribbon Gradient -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffeaa7" />
      <stop offset="50%" stop-color="#f6d365" />
      <stop offset="100%" stop-color="#fda085" />
    </linearGradient>

    <!-- QR Dots Gradient -->
    <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a8193f" />
      <stop offset="100%" stop-color="#c92252" />
    </linearGradient>

    <!-- Heart Card Border Gradient -->
    <linearGradient id="heartBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff85a2" />
      <stop offset="50%" stop-color="#ffd166" />
      <stop offset="100%" stop-color="#ff758c" />
    </linearGradient>

    <!-- Shadow Filters -->
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="25" flood-color="#000" flood-opacity="0.55" />
      <feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="#ff758c" flood-opacity="0.35" />
    </filter>

    <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.2" />
    </filter>
  </defs>

  <!-- 1. Background -->
  <rect width="${cardW}" height="${cardH}" rx="36" fill="url(#bgGradient)" />

  <!-- Hạt ánh sao lấp lánh ngẫu nhiên -->
  <g opacity="0.6">
    <circle cx="120" cy="180" r="2" fill="#ffd166" opacity="0.8" />
    <circle cx="780" cy="220" r="2.5" fill="#ffd166" opacity="0.9" />
    <circle cx="180" cy="850" r="2" fill="#ff758c" opacity="0.7" />
    <circle cx="750" cy="880" r="2" fill="#ff758c" opacity="0.8" />
    <circle cx="140" cy="500" r="1.5" fill="#fff" opacity="0.5" />
    <circle cx="760" cy="540" r="1.5" fill="#fff" opacity="0.5" />
    <!-- Ngôi sao 4 cánh -->
    <path d="M 720,130 Q 720,145 705,145 Q 720,145 720,160 Q 720,145 735,145 Q 720,145 720,130 Z" fill="#ffd166" opacity="0.85" />
    <path d="M 170,320 Q 170,332 158,332 Q 170,332 170,344 Q 170,332 182,332 Q 170,332 170,320 Z" fill="#ffd166" opacity="0.75" />
    <path d="M 740,720 Q 740,732 728,732 Q 740,732 740,744 Q 740,732 752,732 Q 740,732 740,720 Z" fill="#ff758c" opacity="0.75" />
  </g>

  <!-- 2. Header Tiêu Đề Lãng Mạn -->
  <g text-anchor="middle">
    <!-- Huy hiệu 20/10 -->
    <rect x="${cardW / 2 - 110}" y="70" width="220" height="36" rx="18" fill="rgba(246, 211, 101, 0.15)" stroke="rgba(246, 211, 101, 0.4)" stroke-width="1.2" />
    <text x="${cardW / 2}" y="94" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="#ffd166">✨ 20 · 10 · 2026 ✨</text>

    <!-- Tiêu đề lớn -->
    <text x="${cardW / 2}" y="165" font-family="'Playfair Display', Georgia, serif" font-size="38" font-weight="700" fill="#ffffff" letter-spacing="1">Món Quà Dành Tặng Em Bống</text>
    <text x="${cardW / 2}" y="205" font-family="'Outfit', sans-serif" font-size="16" font-weight="300" fill="rgba(255, 255, 255, 0.82)">Dành riêng cho cô gái ngọt ngào nhất ngày 20 tháng 10 🌸</text>
  </g>

  <!-- 3. Khung Trái Tim Khổng Lồ Ôm Trọn QR (Heart Container) -->
  <g filter="url(#softShadow)">
    <!-- Quầng sáng trái tim -->
    <path d="M 450,270 
             C 410,210 320,195 240,250 
             C 140,320 130,460 210,570 
             C 280,670 410,790 450,830 
             C 490,790 620,670 690,570 
             C 770,460 760,320 660,250 
             C 580,195 490,210 450,270 Z" 
          fill="url(#heartGlow)" />

    <!-- Thân khung trái tim sứ trắng ngọc trai -->
    <path d="M 450,285 
             C 415,225 330,210 255,262 
             C 160,330 150,465 225,570 
             C 292,665 415,780 450,818 
             C 485,780 608,665 675,570 
             C 750,465 740,330 645,262 
             C 570,210 485,225 450,285 Z" 
          fill="#fffdf9" 
          stroke="url(#heartBorder)" 
          stroke-width="5" />
  </g>

  <!-- Hoa anh đào và lá vàng đính trên góc trái tim -->
  <g>
    <!-- Hoa góc trái -->
    <circle cx="215" cy="275" r="14" fill="#ff758c" opacity="0.9" />
    <circle cx="205" cy="265" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="225" cy="265" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="205" cy="285" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="225" cy="285" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="215" cy="275" r="5" fill="#ffd166" />

    <!-- Hoa góc phải -->
    <circle cx="685" cy="275" r="14" fill="#ff758c" opacity="0.9" />
    <circle cx="675" cy="265" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="695" cy="265" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="675" cy="285" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="695" cy="285" r="9" fill="#ffb7b2" opacity="0.9" />
    <circle cx="685" cy="275" r="5" fill="#ffd166" />
  </g>

  <!-- 4. Lớp nền trắng QR Code tạo Quiet Zone chuẩn xác để Camera nhận diện tức thì -->
  <rect x="${qrStartX - 18}" y="${qrStartY - 18}" width="${qrBoxSize + 36}" height="${qrBoxSize + 36}" rx="24" fill="#ffffff" filter="url(#innerGlow)" />
  <rect x="${qrStartX - 18}" y="${qrStartY - 18}" width="${qrBoxSize + 36}" height="${qrBoxSize + 36}" rx="24" fill="none" stroke="rgba(255, 117, 140, 0.25)" stroke-width="1.5" />

  <!-- 5. Ma trận mã QR Code -->
  <g>
    ${qrDotsSVG}
  </g>

  <!-- 6. Huy hiệu Trái Tim Trung Tâm (Center Emblem với chữ "EB" / Trái Tim) -->
  <g filter="url(#innerGlow)">
    <!-- Vòng tròn nền trắng bảo vệ -->
    <circle cx="${logoCenterX}" cy="${logoCenterY}" r="${logoRadius}" fill="#ffffff" stroke="#ff758c" stroke-width="2.5" />
    <circle cx="${logoCenterX}" cy="${logoCenterY}" r="${logoRadius - 4}" fill="url(#dotGradient)" />
    
    <!-- Icon trái tim nhịp đập ở tâm -->
    <path d="M ${logoCenterX},${logoCenterY + 11}
             C ${logoCenterX - 18},${logoCenterY - 4} ${logoCenterX - 24},${logoCenterY - 18} ${logoCenterX - 10},${logoCenterY - 21}
             C ${logoCenterX - 1},${logoCenterY - 22} ${logoCenterX},${logoCenterY - 12} ${logoCenterX},${logoCenterY - 12}
             C ${logoCenterX},${logoCenterY - 12} ${logoCenterX + 1},${logoCenterY - 22} ${logoCenterX + 10},${logoCenterY - 21}
             C ${logoCenterX + 24},${logoCenterY - 18} ${logoCenterX + 18},${logoCenterY - 4} ${logoCenterX},${logoCenterY + 11} Z"
          fill="#ffffff" />
    <!-- Tên viết tắt em Bống siêu cute -->
    <text x="${logoCenterX}" y="${logoCenterY + 2.5}" font-family="'Outfit', sans-serif" font-size="10" font-weight="800" fill="#c92252" text-anchor="middle">EB</text>
  </g>

  <!-- 7. Footer Lời Dặn Quét Mã -->
  <g text-anchor="middle">
    <!-- Bong bóng hướng dẫn quét mã -->
    <rect x="${cardW / 2 - 190}" y="890" width="380" height="46" rx="23" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 117, 140, 0.45)" stroke-width="1.5" />
    <text x="${cardW / 2}" y="919" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" fill="#ffffff">📷 Mở Camera hoặc Zalo để quét nhé! 💕</text>

    <!-- Đường link trực tiếp -->
    <text x="${cardW / 2}" y="975" font-family="'Outfit', sans-serif" font-size="14" font-weight="400" fill="#ffd166" letter-spacing="1">https://20-10-e-bong.vercel.app/</text>
    <text x="${cardW / 2}" y="1010" font-family="'Dancing Script', cursive" font-size="22" font-weight="700" fill="#ff85a2">Chúc em Bống luôn rực rỡ và hạnh phúc ✨</text>
  </g>
</svg>
`;

  return svg;
}

// ==========================================
// 2. TẠO MÃ QR TRÁI TIM ĐỘC LẬP (STANDALONE BADGE)
// ==========================================
function generateStandaloneHeartQRSVG() {
  const sizePx = 600;
  const padding = 50;
  const qrBox = sizePx - padding * 2;
  const moduleSize = qrBox / size;

  let dots = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isCenterLogo(c, r)) continue;
      const isDark = modules.get(c, r);
      if (!isDark) continue;

      const x = padding + c * moduleSize;
      const y = padding + r * moduleSize;

      if (isFinderPattern(c, r)) {
        dots += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${moduleSize.toFixed(1)}" height="${moduleSize.toFixed(1)}" rx="3.5" ry="3.5" fill="#b31942" />\n`;
      } else {
        const cx = (x + moduleSize / 2).toFixed(1);
        const cy = (y + moduleSize / 2).toFixed(1);
        const rad = (moduleSize * 0.44).toFixed(1);
        dots += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#d62256" />\n`;
      }
    }
  }

  const centerX = sizePx / 2;
  const centerY = sizePx / 2;
  const logoRadius = moduleSize * 3.5;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sizePx} ${sizePx}" width="${sizePx}" height="${sizePx}">
  <defs>
    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#ff758c" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Nền trái tim viền hồng -->
  <rect width="${sizePx}" height="${sizePx}" rx="40" fill="#ffffff" stroke="#ff758c" stroke-width="4" filter="url(#badgeShadow)" />

  <!-- Ma trận QR -->
  ${dots}

  <!-- Huy hiệu trái tim trung tâm -->
  <circle cx="${centerX}" cy="${centerY}" r="${logoRadius}" fill="#ffffff" stroke="#ff758c" stroke-width="2" />
  <circle cx="${centerX}" cy="${centerY}" r="${logoRadius - 3}" fill="#ff5e7e" />
  <path d="M ${centerX},${centerY + 10}
           C ${centerX - 15},${centerY - 3} ${centerX - 20},${centerY - 15} ${centerX - 8},${centerY - 17}
           C ${centerX - 1},${centerY - 18} ${centerX},${centerY - 10} ${centerX},${centerY - 10}
           C ${centerX},${centerY - 10} ${centerX + 1},${centerY - 18} ${centerX + 8},${centerY - 17}
           C ${centerX + 20},${centerY - 15} ${centerX + 15},${centerY - 3} ${centerX},${centerY + 10} Z"
        fill="#ffffff" />
  <text x="${centerX}" y="${centerY + 2}" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ff5e7e" text-anchor="middle">EB</text>
</svg>
`;
}

// Lưu các file SVG
const publicDir = path.join(projectRoot, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const cardSVG = generateGiftCardSVG();
fs.writeFileSync(path.join(publicDir, 'qr-heart-card.svg'), cardSVG, 'utf-8');
console.log('✅ Đã tạo file: public/qr-heart-card.svg (Thiệp QR Trái Tim Nghệ Thuật)');

const badgeSVG = generateStandaloneHeartQRSVG();
fs.writeFileSync(path.join(publicDir, 'qr-heart-badge.svg'), badgeSVG, 'utf-8');
console.log('✅ Đã tạo file: public/qr-heart-badge.svg (Mã QR Trái Tim Độc Lập)');
