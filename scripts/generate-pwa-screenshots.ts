import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate PWA screenshots as PNG files
 * These are required for PWA installability
 */

async function generateScreenshots() {
    try {
        let sharp: any;
        try {
            sharp = (await import('sharp')).default;
        } catch {
            console.log('Sharp not available, creating SVG placeholders instead...');
            generateSVGScreenshots();
            return;
        }

        const publicDir = join(process.cwd(), 'public');

        // Mobile screenshot (narrow) - 540x720 (common mobile size)
        const mobileScreenshot = generateScreenshotSVG(540, 720, 'mobile');
        const mobileBuffer = await sharp(Buffer.from(mobileScreenshot))
            .resize(540, 720)
            .png()
            .toBuffer();
        
        writeFileSync(join(publicDir, 'screenshot-mobile.png'), mobileBuffer);
        console.log('✓ Generated screenshot-mobile.png (540x720)');

        // Desktop screenshot (wide) - 1280x720 (common desktop size)
        const desktopScreenshot = generateScreenshotSVG(1280, 720, 'desktop');
        const desktopBuffer = await sharp(Buffer.from(desktopScreenshot))
            .resize(1280, 720)
            .png()
            .toBuffer();
        
        writeFileSync(join(publicDir, 'screenshot-desktop.png'), desktopBuffer);
        console.log('✓ Generated screenshot-desktop.png (1280x720)');

    } catch (error) {
        console.error('Error generating screenshots:', error);
        generateSVGScreenshots();
    }
}

function generateSVGScreenshots() {
    const publicDir = join(process.cwd(), 'public');
    
    // Mobile screenshot
    const mobileSvg = generateScreenshotSVG(540, 720, 'mobile');
    writeFileSync(join(publicDir, 'screenshot-mobile.svg'), mobileSvg, 'utf-8');
    console.log('✓ Generated screenshot-mobile.svg (placeholder)');

    // Desktop screenshot
    const desktopSvg = generateScreenshotSVG(1280, 720, 'desktop');
    writeFileSync(join(publicDir, 'screenshot-desktop.svg'), desktopSvg, 'utf-8');
    console.log('✓ Generated screenshot-desktop.svg (placeholder)');

    console.log('\n⚠️  Note: SVG screenshots are placeholders. Install sharp to generate PNG:');
    console.log('   npm install --save-dev sharp\n');
}

function generateScreenshotSVG(width: number, height: number, type: 'mobile' | 'desktop'): string {
    const isMobile = type === 'mobile';
    const fontSize = isMobile ? width * 0.08 : width * 0.04;
    const iconSize = isMobile ? width * 0.2 : width * 0.1;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad${type}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fce7f3;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGrad${type}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad${type})"/>
  
  <!-- App Icon -->
  <rect x="${(width - iconSize) / 2}" y="${height * 0.2}" width="${iconSize}" height="${iconSize}" 
        fill="url(#iconGrad${type})" rx="${iconSize * 0.15}"/>
  <text x="${width / 2}" y="${height * 0.2 + iconSize / 2 + fontSize * 0.3}" 
        font-family="Arial, sans-serif" font-size="${fontSize * 1.2}" font-weight="bold" 
        fill="#ec4899" text-anchor="middle" dominant-baseline="middle">R</text>
  
  <!-- App Name -->
  <text x="${width / 2}" y="${height * 0.45}" font-family="Arial, sans-serif" 
        font-size="${fontSize * 1.5}" font-weight="bold" fill="#111827" 
        text-anchor="middle" dominant-baseline="middle">ROOKIES</text>
  <text x="${width / 2}" y="${height * 0.5}" font-family="Arial, sans-serif" 
        font-size="${fontSize}" fill="#6b7280" text-anchor="middle" 
        dominant-baseline="middle">Home based Bakery</text>
  
  <!-- Features -->
  <text x="${width / 2}" y="${height * 0.65}" font-family="Arial, sans-serif" 
        font-size="${fontSize * 0.8}" fill="#374151" text-anchor="middle" 
        dominant-baseline="middle">Fresh Baked Goods</text>
  <text x="${width / 2}" y="${height * 0.72}" font-family="Arial, sans-serif" 
        font-size="${fontSize * 0.7}" fill="#6b7280" text-anchor="middle" 
        dominant-baseline="middle">Cookies • Cakes • Cupcakes • Shakes</text>
</svg>`;
}

// Run the generator
generateScreenshots().catch(console.error);

