# PWA Install Prompt Component

## Overview

The `InstallPrompt` component automatically detects mobile users and prompts them to install the ROOKIES Bakery PWA on their home screen.

## Features

### Android/Chrome
- Uses the native `beforeinstallprompt` event
- Shows a native install dialog when user clicks "Install"
- Automatically detects if PWA is already installed

### iOS/Safari
- Shows step-by-step instructions for adding to home screen
- Detects iOS devices automatically
- Provides clear visual guidance

### Smart Behavior
- Only shows on mobile devices
- Doesn't show if already installed (standalone mode)
- Remembers user dismissal for 7 days
- Auto-dismisses after user installs

## Usage

The component is already integrated into `app/layout.tsx` and will automatically appear for mobile users.

## Customization

### Change Dismissal Period
Edit `components/pwa/InstallPrompt.tsx`:
```typescript
const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
// Change 7 to your desired number of days
if (!isStandaloneMode && isMobile && daysSinceDismissed > 7) {
```

### Change Delay for iOS
Edit the setTimeout delay:
```typescript
if (iOS) {
    setTimeout(() => {
        setShowPrompt(true);
    }, 3000); // Change 3000ms to your desired delay
}
```

### Styling
The component uses Tailwind classes and can be customized:
- Background: `bg-gradient-to-r from-pink-600 to-rose-600`
- Text colors: `text-white`, `text-pink-100`
- Animation: `animate-slide-up`

## Testing

### Desktop
- Component won't show (mobile-only)

### Android/Chrome
1. Open Chrome DevTools
2. Enable device emulation
3. Select a mobile device
4. The prompt should appear after page load
5. Click "Install" to test native prompt

### iOS/Safari
1. Open Safari on iPhone/iPad
2. Visit the site
3. Prompt should appear after 3 seconds
4. Follow the instructions shown

## Browser Support

- ✅ Chrome/Edge (Android) - Native install prompt
- ✅ Safari (iOS) - Manual instructions
- ✅ Samsung Internet - Native install prompt
- ✅ Firefox (Android) - Manual instructions
- ❌ Desktop browsers - Hidden (not mobile)

