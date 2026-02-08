import sharp from 'sharp';
import { readFileSync } from 'fs';

const svgBuffer = readFileSync('landing-page/images/app-icon.svg');
const outDir = 'landing-page/images';

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`${outDir}/${name}`);
  console.log(`Created ${name} (${size}x${size})`);
}

// Generate .ico from 16, 32, 48 (use 32x32 as the main .ico)
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(`${outDir}/favicon.ico`);
console.log('Created favicon.ico (32x32)');

console.log('All favicons generated!');
