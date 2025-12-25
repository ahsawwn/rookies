# PWA Setup Instructions

## PWA Icons Required

To complete the PWA setup, you need to create two icon files in the `public` directory:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

These icons should be:
- Square images
- PNG format
- Optimized for web
- Should represent the ROOKIES Bakery brand

### Quick Setup

You can use any image editor or online tool to create these icons. Recommended tools:
- [Favicon.io](https://favicon.io/) - Generate icons from text or images
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive favicon/PWA icon generator

### Icon Requirements

- **icon-192.png**: Minimum 192x192px, recommended for Android home screen
- **icon-512.png**: Minimum 512x512px, recommended for splash screens and high-DPI displays

Both icons should have:
- Transparent or solid background
- Clear, recognizable design
- High contrast for visibility

## PWA Features Implemented

✅ **Manifest.json** - App metadata and configuration
✅ **Service Worker** - Offline support and caching
✅ **Meta Tags** - iOS/Android app-like experience
✅ **Theme Color** - Pink (#E91E63) matching brand

## Testing PWA

1. Open Chrome DevTools
2. Go to Application tab
3. Check "Manifest" section
4. Check "Service Workers" section
5. Use "Lighthouse" to test PWA score

## Installation

Users can install the PWA by:
- **Chrome/Edge**: Click the install icon in the address bar
- **Safari (iOS)**: Tap Share > Add to Home Screen
- **Android**: Tap the menu > Add to Home Screen

