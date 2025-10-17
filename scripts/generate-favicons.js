const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/favicon.svg');
const publicDir = path.join(__dirname, '../public');

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Favicon configurations
const favicons = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-64x64.png', size: 64 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-128x128.png', size: 128 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-256x256.png', size: 256 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'mstile-150x150.png', size: 150 }
];

// Generate each favicon
async function generateFavicons() {
  console.log('🎨 Generating favicons from SVG...\n');

  for (const { name, size } of favicons) {
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));

      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message);
    }
  }

  // Generate OG image (larger with padding)
  try {
    // First, create the logo at a reasonable size
    const logoBuffer = await sharp(svgBuffer)
      .resize(400, 400)
      .png()
      .toBuffer();

    // Create the OG image with a dark background
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 10, g: 10, b: 10, alpha: 1 }
      }
    })
    .composite([{
      input: logoBuffer,
      top: 115,  // Center vertically: (630 - 400) / 2
      left: 400  // Center horizontally: (1200 - 400) / 2
    }])
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

    console.log('✅ Generated og-image.png (1200x630)');
  } catch (error) {
    console.error('❌ Error generating og-image.png:', error.message);
  }

  // Generate ICO file (multi-resolution)
  try {
    // For ICO, we'll generate a 32x32 PNG and rename it
    // Note: For a proper multi-resolution ICO, you'd need a specialized library
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-temp.png'));

    // Convert to ICO format (basic approach - single resolution)
    const png32 = fs.readFileSync(path.join(publicDir, 'favicon-temp.png'));

    // Create a simple ICO header for a single 32x32 image
    const icoHeader = Buffer.from([
      0x00, 0x00, // Reserved
      0x01, 0x00, // Type: 1 for ICO
      0x01, 0x00, // Number of images: 1
      // Image directory entry
      0x20,       // Width: 32
      0x20,       // Height: 32
      0x00,       // Color palette: 0 for true color
      0x00,       // Reserved
      0x01, 0x00, // Color planes: 1
      0x20, 0x00, // Bits per pixel: 32
      ...Buffer.from(new Uint32Array([png32.length]).buffer), // Size of image data
      0x16, 0x00, 0x00, 0x00  // Offset to image data (22 bytes header)
    ]);

    // Combine header and PNG data
    const icoBuffer = Buffer.concat([icoHeader, png32]);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

    // Clean up temp file
    fs.unlinkSync(path.join(publicDir, 'favicon-temp.png'));

    console.log('✅ Generated favicon.ico');
  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error.message);
  }

  console.log('\n🎉 Favicon generation complete!');
  console.log('📝 All files have been saved to the /public directory');
}

// Run the generation
generateFavicons().catch(console.error);