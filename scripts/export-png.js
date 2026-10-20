import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

async function exportPNG() {
  const cardSvgPath = path.join(publicDir, 'qr-heart-card.svg');
  const cardPngPath = path.join(publicDir, 'qr-heart-card.png');

  const badgeSvgPath = path.join(publicDir, 'qr-heart-badge.svg');
  const badgePngPath = path.join(publicDir, 'qr-heart-badge.png');

  // 1. Export Thiệp QR Card (1800x2200px - siêu nét)
  await sharp(cardSvgPath, { density: 300 })
    .resize(1800, 2200)
    .png({ quality: 100 })
    .toFile(cardPngPath);
  console.log('✅ Đã tạo PNG siêu nét: public/qr-heart-card.png (1800x2200px)');

  // 2. Export QR Badge (1200x1200px)
  await sharp(badgeSvgPath, { density: 300 })
    .resize(1200, 1200)
    .png({ quality: 100 })
    .toFile(badgePngPath);
  console.log('✅ Đã tạo PNG siêu nét: public/qr-heart-badge.png (1200x1200px)');
}

exportPNG().catch(console.error);
