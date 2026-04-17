// Generates public/icons/icon-192x192.png and icon-512x512.png
// using sharp (already in devDependencies). Uses geometric SVG shapes
// so no font rendering is required.
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");

mkdirSync(iconsDir, { recursive: true });

function buildSvg(size) {
  const r = Math.round(size * 0.18);
  const barW = Math.round(size * 0.60);
  const barH = Math.round(size * 0.14);
  const barX = Math.round((size - barW) / 2);
  const barY = Math.round(size * 0.26);
  const stemW = Math.round(size * 0.14);
  const stemX = Math.round((size - stemW) / 2);
  const stemH = Math.round(size * 0.52);

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${r}" fill="#C29E5F"/>
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" fill="#FAFAF7"/>
  <rect x="${stemX}" y="${barY}" width="${stemW}" height="${stemH}" fill="#FAFAF7"/>
</svg>`;
}

for (const size of [192, 512]) {
  const outPath = join(iconsDir, `icon-${size}x${size}.png`);
  await sharp(Buffer.from(buildSvg(size))).png().toFile(outPath);
  console.log(`✓ public/icons/icon-${size}x${size}.png`);
}
