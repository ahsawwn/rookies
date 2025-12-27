# PWA Setup - ROOKIES Bakery

## ✅ PWA Features Implemented

### Icons
- ✅ **icon-192.png** - 192x192px icon for Android home screen
- ✅ **icon-512.png** - 512x512px icon for splash screens and high-DPI displays
- ✅ **apple-touch-icon.png** - 180x180px icon for iOS home screen
- ✅ **favicon.ico** - Standard favicon for browsers

### Manifest
- ✅ **manifest.json** - Complete PWA manifest with:
  - App name and description
  - Theme colors (pink gradient: #ec4899 to #f43f5e)
  - Icons configuration
  - App shortcuts (Shop, Cart, Menu)
  - Standalone display mode

### Service Worker
- ✅ **sw.js** - Service worker for offline support:
  - Caches essential pages and assets
  - Offline-first strategy
  - Automatic cache updates

### Metadata
- ✅ **Open Graph** tags for social sharing
- ✅ **Twitter Card** metadata
- ✅ **Apple Web App** meta tags
- ✅ **Theme color** configuration
- ✅ **SEO** optimized metadata

## 🎨 Icon Generation

Icons have been automatically generated with a pink gradient background and "R" logo.

To regenerate icons:
```bash
npm run generate:icons
```

To create custom branded icons:
1. Design your icon (512x512px recommended)
2. Export as PNG
3. Replace files in `public/`:
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
   - `favicon.ico`

Recommended tools:
- [Favicon.io](https://favicon.io/) - Generate from text or image
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive generator
- [Figma](https://figma.com/) - Design tool

## 📱 Testing PWA

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest** - Should show all icons and metadata
   - **Service Workers** - Should show registered worker
   - **Cache Storage** - Should show cached resources

### Lighthouse
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Progressive Web App** category
4. Click **Generate report**
5. Should score 90+ for PWA

### Installation Testing
- **Chrome/Edge**: Look for install icon in address bar
- **Safari (iOS)**: Tap Share > Add to Home Screen
- **Android Chrome**: Tap menu > Add to Home Screen

## 🔧 Configuration

### Environment Variables
Make sure `NEXT_PUBLIC_APP_URL` is set in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

This is used for Open Graph and metadata URLs.

### Theme Colors
Current theme colors (pink gradient):
- Primary: `#ec4899`
- Secondary: `#f43f5e`
- Background: `#ffffff`

To change colors, update:
- `public/manifest.json` - `theme_color` and `background_color`
- `app/layout.tsx` - `viewport.themeColor`

## 📋 PWA Checklist

- [x] Manifest.json configured
- [x] Icons generated (192px, 512px, apple-touch-icon, favicon)
- [x] Service worker registered
- [x] Offline support implemented
- [x] Meta tags for iOS/Android
- [x] Theme color configured
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] App shortcuts configured
- [x] HTTPS ready (required for production)

## 🚀 Production Deployment

Before deploying to production:
1. ✅ Replace generated icons with branded versions
2. ✅ Set `NEXT_PUBLIC_APP_URL` to production domain
3. ✅ Ensure HTTPS is enabled (required for PWA)
4. ✅ Test installation on iOS and Android devices
5. ✅ Run Lighthouse PWA audit

## 📝 Notes

- Icons are currently auto-generated placeholders with pink gradient
- For production, replace with professionally designed icons
- Service worker caches pages for offline access
- PWA works best on HTTPS (required for service workers)
