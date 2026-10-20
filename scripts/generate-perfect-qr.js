import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const TARGET_URL = 'https://20-10-e-bong.vercel.app/';

// Tạo QR code với mức sửa lỗi cao nhất H (30%)
const qr = QRCode.create(TARGET_URL, {
  errorCorrectionLevel: 'H'
});

const modules = qr.modules;
const size = modules.size; // 33x33

function isFinderPattern(x, y) {
  if (x < 7 && y < 7) return true; // Top-Left
  if (x >= size - 7 && y < 7) return true; // Top-Right
  if (x < 7 && y >= size - 7) return true; // Bottom-Left
  return false;
}

function isCenterLogo(x, y) {
  const centerStart = Math.floor(size / 2) - 3;
  const centerEnd = Math.floor(size / 2) + 3;
  return x >= centerStart && x <= centerEnd && y >= centerStart && y <= centerEnd;
}

const cardW = 900;
const cardH = 960;

// QR code kích thước vừa vặn (308x308) để trái tim ôm trọn từ đỉnh đến đuôi nhọn
const qrBoxSize = 308;
const qrStartX = (cardW - qrBoxSize) / 2; // 296
const qrStartY = 356;
const moduleSize = qrBoxSize / size;

let qrDotsSVG = '';

for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (isCenterLogo(c, r)) continue;

    const isDark = modules.get(c, r);
    if (!isDark) continue;

    const x = qrStartX + c * moduleSize;
    const y = qrStartY + r * moduleSize;

    if (isFinderPattern(c, r)) {
      qrDotsSVG += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${moduleSize.toFixed(1)}" height="${moduleSize.toFixed(1)}" rx="2.5" ry="2.5" fill="#9e1b42" />\n`;
    } else {
      const cx = (x + moduleSize / 2).toFixed(1);
      const cy = (y + moduleSize / 2).toFixed(1);
      const radius = (moduleSize * 0.44).toFixed(1);
      qrDotsSVG += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#dotGradient)" />\n`;
    }
  }
}

const logoCenterX = qrStartX + (size * moduleSize) / 2;
const logoCenterY = qrStartY + (size * moduleSize) / 2;
const logoRadius = moduleSize * 3.4;

const heartPath = `M 450,795 
C 240,660 115,530 115,395 
C 115,250 250,210 365,260 
C 410,280 435,308 450,330 
C 465,308 490,280 535,260 
C 650,210 785,250 785,395 
C 785,530 660,660 450,795 Z`;

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardW} ${cardH}" width="${cardW}" height="${cardH}">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#241432" />
      <stop offset="60%" stop-color="#140c22" />
      <stop offset="100%" stop-color="#090512" />
    </radialGradient>

    <!-- QR Dots Gradient -->
    <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a8193f" />
      <stop offset="100%" stop-color="#c92252" />
    </linearGradient>

    <!-- Heart Border Gradient -->
    <linearGradient id="heartBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff85a2" />
      <stop offset="45%" stop-color="#ffd166" />
      <stop offset="100%" stop-color="#ff758c" />
    </linearGradient>

    <!-- Shadow Filters -->
    <filter id="heartShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#000" flood-opacity="0.65" />
      <feDropShadow dx="0" dy="0" stdDeviation="22" flood-color="#ff758c" flood-opacity="0.45" />
    </filter>

    <filter id="qrCardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="rgba(180, 40, 80, 0.15)" />
    </filter>
  </defs>

  <!-- 1. Background -->
  <rect width="${cardW}" height="${cardH}" rx="40" fill="url(#bgGradient)" />

  <!-- Ánh sao lung linh -->
  <g opacity="0.65">
    <circle cx="110" cy="150" r="2.2" fill="#ffd166" opacity="0.85" />
    <circle cx="790" cy="180" r="2.5" fill="#ffd166" opacity="0.9" />
    <circle cx="130" cy="840" r="2" fill="#ff758c" opacity="0.75" />
    <circle cx="770" cy="860" r="2.2" fill="#ff758c" opacity="0.8" />
    <path d="M 730,120 Q 730,132 718,132 Q 730,132 730,144 Q 730,132 742,132 Q 730,132 730,120 Z" fill="#ffd166" opacity="0.9" />
    <path d="M 160,260 Q 160,270 150,270 Q 160,270 160,280 Q 160,270 170,270 Q 160,270 160,260 Z" fill="#ffd166" opacity="0.8" />
    <path d="M 760,680 Q 760,690 750,690 Q 760,690 760,700 Q 760,690 770,690 Q 760,690 760,680 Z" fill="#ff758c" opacity="0.8" />
  </g>

  <!-- 2. Header Tiêu Đề -->
  <g text-anchor="middle">
    <!-- Badge 20/10 -->
    <rect x="${cardW / 2 - 110}" y="52" width="220" height="34" rx="17" fill="rgba(246, 211, 101, 0.14)" stroke="rgba(246, 211, 101, 0.4)" stroke-width="1.2" />
    <text x="${cardW / 2}" y="74.5" font-family="'Outfit', -apple-system, sans-serif" font-size="13.5" font-weight="600" letter-spacing="3" fill="#ffd166">✨ 20 · 10 · 2026 ✨</text>

    <!-- Tiêu đề lớn -->
    <text x="${cardW / 2}" y="132" font-family="'Playfair Display', Georgia, serif" font-size="36" font-weight="700" fill="#ffffff" letter-spacing="0.5">Món Quà Dành Tặng Em Bống</text>
    <text x="${cardW / 2}" y="168" font-family="'Outfit', -apple-system, sans-serif" font-size="15" font-weight="300" fill="rgba(255, 255, 255, 0.85)">Dành riêng cho cô gái ngọt ngào nhất ngày 20 tháng 10 🌸</text>
  </g>

  <!-- 3. Toàn Bộ Trái Tim Khổng Lồ Tuyệt Đẹp (Nhìn thấy trọn vẹn cả trái tim từ tai đến đuôi nhọn) -->
  <g filter="url(#heartShadow)">
    <path d="${heartPath}" fill="#fffdfb" stroke="url(#heartBorder)" stroke-width="5" />
  </g>

  <!-- Hai cụm hoa anh đào đính ở viền trái tim -->
  <g>
    <!-- Cụm hoa góc trái -->
    <circle cx="205" cy="285" r="13" fill="#ff758c" opacity="0.95" />
    <circle cx="195" cy="275" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="215" cy="275" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="195" cy="295" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="215" cy="295" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="205" cy="285" r="4.5" fill="#ffd166" />

    <!-- Cụm hoa góc phải -->
    <circle cx="695" cy="285" r="13" fill="#ff758c" opacity="0.95" />
    <circle cx="685" cy="275" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="705" cy="275" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="685" cy="295" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="705" cy="295" r="8.5" fill="#ffb7b2" opacity="0.9" />
    <circle cx="695" cy="285" r="4.5" fill="#ffd166" />
  </g>

  <!-- 4. Khung nền QR Card bo tròn mềm mại nằm gọn gàng bên trong lòng trái tim -->
  <rect x="${qrStartX - 16}" y="${qrStartY - 16}" width="${qrBoxSize + 32}" height="${qrBoxSize + 32}" rx="20" fill="#ffffff" stroke="rgba(255, 117, 140, 0.35)" stroke-width="1.5" filter="url(#qrCardShadow)" />

  <!-- 5. Ma trận mã QR Code -->
  <g>
    ${qrDotsSVG}
  </g>

  <!-- 6. Huy hiệu Trái Tim Trung Tâm (Center Emblem chữ "EB") -->
  <g>
    <circle cx="${logoCenterX}" cy="${logoCenterY}" r="${logoRadius}" fill="#ffffff" stroke="#ff758c" stroke-width="2.2" />
    <circle cx="${logoCenterX}" cy="${logoCenterY}" r="${logoRadius - 3.5}" fill="url(#dotGradient)" />
    <!-- Biểu tượng trái tim trắng -->
    <path d="M ${logoCenterX},${logoCenterY + 10}
             C ${logoCenterX - 15},${logoCenterY - 3} ${logoCenterX - 20},${logoCenterY - 15} ${logoCenterX - 8},${logoCenterY - 17}
             C ${logoCenterX - 1},${logoCenterY - 18} ${logoCenterX},${logoCenterY - 10} ${logoCenterX},${logoCenterY - 10}
             C ${logoCenterX},${logoCenterY - 10} ${logoCenterX + 1},${logoCenterY - 18} ${logoCenterX + 8},${logoCenterY - 17}
             C ${logoCenterX + 20},${logoCenterY - 15} ${logoCenterX + 15},${logoCenterY - 3} ${logoCenterX},${logoCenterY + 10} Z"
          fill="#ffffff" />
    <text x="${logoCenterX}" y="${logoCenterY + 2}" font-family="'Outfit', -apple-system, sans-serif" font-size="9" font-weight="800" fill="#c92252" text-anchor="middle">EB</text>
  </g>

  <!-- 7. Bottom Badge Hướng Dẫn Quét Sắc Nét -->
  <g>
    <rect x="${cardW / 2 - 190}" y="865" width="380" height="46" rx="23" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 117, 140, 0.5)" stroke-width="1.5" />
    <!-- Vector Camera Icon -->
    <g transform="translate(285, 878) scale(0.85)">
      <path d="M 4 5 L 8 1 L 16 1 L 20 5 L 22 5 C 23.1 5 24 5.9 24 7 L 24 19 C 24 20.1 23.1 21 22 21 L 2 21 C 0.9 21 0 20.1 0 19 L 0 7 C 0 5.9 0.9 5 2 5 L 4 5 Z" fill="#ffd166" />
      <circle cx="12" cy="13" r="4.5" fill="#241432" stroke="#ffd166" stroke-width="1.5" />
    </g>
    <text x="465" y="894.5" font-family="'Outfit', -apple-system, sans-serif" font-size="15.5" font-weight="600" fill="#ffffff" text-anchor="middle">Mở Camera hoặc Zalo để quét nhé! 💕</text>
  </g>
</svg>
`;

// Ghi file SVG
const svgPath = path.join(projectRoot, 'public/qr-heart-card.svg');
fs.writeFileSync(svgPath, svgContent, 'utf-8');

// Render PNG siêu nét
const pngRootPath = path.join(projectRoot, 'qr-tang-em-bong.png');
const pngPublicPath = path.join(projectRoot, 'public/qr-tang-em-bong.png');

await sharp(svgPath, { density: 300 })
  .resize(1800, 1920)
  .png({ quality: 100 })
  .toFile(pngRootPath);

fs.copyFileSync(pngRootPath, pngPublicPath);
console.log('✅ Đã tạo hoàn hảo: qr-tang-em-bong.png');
