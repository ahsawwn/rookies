# PWA Installation Guide - ROOKIES Bakery

## Understanding PWA Installation

**Important:** On mobile browsers, "Add to Home Screen" **IS** the installation method. When you add a PWA to your home screen, it installs the app locally on your phone - it's not just a bookmark!

### What Happens When You Install:

1. ✅ App icon appears on your home screen
2. ✅ Opens in standalone mode (no browser UI)
3. ✅ Works offline (with cached content)
4. ✅ Faster loading (cached resources)
5. ✅ Feels like a native app
6. ✅ Can receive push notifications (if configured)

## Installation Methods by Browser

### Android Chrome/Edge
- **Method 1:** Browser shows "Install app" banner → Tap "Install"
- **Method 2:** Menu (⋮) → "Install app" or "Add to Home screen"
- **Result:** App installed locally, works like native app

### Android Samsung Internet
- Menu → "Add page to" → "Home screen"
- **Result:** App installed locally

### iOS Safari
- Share button (⎋) → "Add to Home Screen"
- **Result:** App installed locally, works like native app

### Firefox Mobile
- Menu → "Install" or "Add to Home Screen"
- **Result:** App installed locally

## Why "Add to Home Screen" = Installation

When you add a PWA to your home screen:
- It creates a local app on your device
- It uses the service worker for offline functionality
- It opens in standalone mode (no browser chrome)
- It's stored locally, not just a shortcut

**This IS the installation process for PWAs on mobile!**

## Making Your PWA More Installable

The PWA is configured with:
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Proper icons (192px, 512px)
- ✅ Standalone display mode
- ✅ HTTPS ready (required for production)

## Troubleshooting

### If "Install" option doesn't appear:

1. **Check HTTPS:** PWAs require HTTPS (or localhost for development)
2. **Check Service Worker:** Open DevTools → Application → Service Workers
3. **Check Manifest:** Open DevTools → Application → Manifest
4. **Clear Cache:** Clear browser cache and reload
5. **Check Icons:** Ensure icon files exist and are accessible

### For Development (localhost):
- Service workers work on localhost
- Install prompt may not appear in all browsers on localhost
- Test on actual device or use HTTPS

### For Production:
- Must be served over HTTPS
- All icons must be accessible
- Service worker must register successfully
- Manifest must be valid JSON

## Testing Installation

1. Open site on mobile device
2. Look for install banner or menu option
3. Tap "Add to Home Screen" or "Install app"
4. Confirm installation
5. App icon appears on home screen
6. Tap icon - app opens in standalone mode (no browser UI)

## Key Points

- **"Add to Home Screen" = Installation** - It installs the app locally
- The app works offline after installation
- The app opens like a native app (no browser UI)
- The app is stored locally on your device
- You can uninstall it like any other app

