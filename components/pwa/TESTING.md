# Testing PWA Install Prompt

## Quick Test Methods

### Method 1: URL Parameter (Easiest)
Add `?pwa-test=true` to any URL:
```
http://localhost:3000/?pwa-test=true
```

### Method 2: LocalStorage
Open browser console and run:
```javascript
localStorage.setItem("pwa-test-mode", "true");
location.reload();
```

To disable test mode:
```javascript
localStorage.removeItem("pwa-test-mode");
localStorage.removeItem("pwa-install-dismissed");
location.reload();
```

### Method 3: Clear Dismissal
If you dismissed the prompt and want to see it again:
```javascript
localStorage.removeItem("pwa-install-dismissed");
location.reload();
```

## Debug Console Logs

The component logs debug information to the console. Check the browser console for:
- `[PWA] Check:` - Shows all detection values
- `[PWA] beforeinstallprompt event fired` - When Android install event fires
- `[PWA] Showing Android prompt (fallback)` - When fallback timeout triggers
- `[PWA] Showing iOS prompt` - When iOS prompt shows

## Common Issues

### Prompt Not Showing on Desktop
- The prompt only shows on mobile devices by design
- Use test mode: `?pwa-test=true` to test on desktop
- Or use Chrome DevTools device emulation

### Prompt Not Showing on Mobile
1. Check console logs for `[PWA] Check:` output
2. Verify you're not in standalone mode (already installed)
3. Check if dismissed recently (7-day cooldown)
4. Clear dismissal: `localStorage.removeItem("pwa-install-dismissed")`

### Android: Install Button Not Working
- The `beforeinstallprompt` event might not fire
- The prompt will still show with instructions
- Users can install via browser menu (3 dots → Install app)

### iOS: Instructions Not Clear
- The prompt shows step-by-step instructions
- Make sure you're on Safari (not Chrome on iOS)
- The Share button location varies by iOS version

## Production Testing

For real-world testing:
1. Deploy to HTTPS (required for PWA)
2. Test on actual mobile devices
3. Test on different browsers:
   - Chrome (Android)
   - Safari (iOS)
   - Samsung Internet
   - Firefox Mobile

