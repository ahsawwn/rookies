import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Generate PWA icons as PNG files
 */

async function generatePNGIcons() {
    try {
        // Try to use sharp if available
        let sharp: any;
        try {
            sharp = (await import('sharp')).default;
        } catch {
            console.log('Sharp not available, creating SVG placeholders instead...');
            generateSVGIcons();
            return;
        }

        const iconSizes = [192, 512];
        const publicDir = join(process.cwd(), 'public');

        for (const size of iconSizes) {
            // Create a simple gradient icon
            const svg = generateIconSVG(size);
            const svgBuffer = Buffer.from(svg);
            
            // Convert SVG to PNG
            const pngBuffer = await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toBuffer();

            const outputPath = join(publicDir, `icon-${size}.png`);
            writeFileSync(outputPath, pngBuffer);
            console.log(`✓ Generated icon-${size}.png`);
        }

        // Also create favicon.ico
        const faviconSvg = generateIconSVG(32);
        const faviconBuffer = await sharp(Buffer.from(faviconSvg))
            .resize(32, 32)
            .png()
            .toBuffer();
        
        writeFileSync(join(publicDir, 'favicon.ico'), faviconBuffer);
        console.log('✓ Generated favicon.ico');

        // Create apple-touch-icon (180x180)
        const appleIconSvg = generateIconSVG(180);
        const appleIconBuffer = await sharp(Buffer.from(appleIconSvg))
            .resize(180, 180)
            .png()
            .toBuffer();
        
        writeFileSync(join(publicDir, 'apple-touch-icon.png'), appleIconBuffer);
        console.log('✓ Generated apple-touch-icon.png');

    } catch (error) {
        console.error('Error generating icons:', error);
        console.log('Falling back to SVG icons...');
        generateSVGIcons();
    }
}

function generateSVGIcons() {
    const iconSizes = [192, 512];
    const publicDir = join(process.cwd(), 'public');

    iconSizes.forEach(size => {
        const svg = generateIconSVG(size);
        const publicPath = join(publicDir, `icon-${size}.svg`);
        writeFileSync(publicPath, svg, 'utf-8');
        console.log(`✓ Generated icon-${size}.svg (placeholder)`);
    });

    console.log('\n⚠️  Note: SVG icons are placeholders. Install sharp to generate PNG:');
    console.log('   npm install --save-dev sharp\n');
}

function generateIconSVG(size: number): string {
    const fontSize = size * 0.4;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad${size})" rx="${size * 0.15}"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >R</text>
</svg>`;
}

// Run the generator
generatePNGIcons().catch(console.error);
