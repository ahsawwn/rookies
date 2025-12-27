# Next.js PWA Implementation - Aligned with Official Docs

## Changes Made Per [Next.js PWA Documentation](https://nextjs.org/docs/app/guides/progressive-web-apps)

### ✅ 1. Manifest File (Next.js Way)

**Before**: Using `public/manifest.json` (static file)  
**After**: Using `app/manifest.ts` (Next.js convention)

- ✅ Created `app/manifest.ts` following Next.js TypeScript pattern
- ✅ Uses `MetadataRoute.Manifest` type for type safety
- ✅ Next.js automatically serves it at `/manifest.json`
- ✅ Removed manual `<link rel="manifest">` from layout (Next.js handles it)

**Note**: The `public/manifest.json` file can remain as a fallback, but Next.js will prioritize the generated manifest from `app/manifest.ts`.

### ✅ 2. Service Worker Registration

**Updated**: Added `updateViaCache: 'none'` option

```typescript
navigator.serviceWorker.register('/sw.js', { 
    scope: '/',
    updateViaCache: 'none'  // ← Added per Next.js recommendation
})
```

This ensures the service worker always checks for updates, preventing stale cached versions.

### ✅ 3. Security Headers

**Added**: Comprehensive security headers in `next.config.ts`

**Global Headers** (applied to all routes):
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Protects against clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information

**Service Worker Specific Headers**:
- `Content-Type: application/javascript; charset=utf-8` - Ensures correct MIME type
- `Cache-Control: no-cache, no-store, must-revalidate` - Prevents caching of service worker
- `Content-Security-Policy: default-src 'self'; script-src 'self'` - Strict CSP for service worker

### ✅ 4. Service Worker Location

**Current**: `public/sw.js` ✅ (Correct per Next.js docs)

### ✅ 5. Manifest Configuration

All required fields are properly configured:
- ✅ `id`: Unique identifier
- ✅ `name` and `short_name`: App names
- ✅ `start_url`: `/` (simplified from `/?utm_source=pwa`)
- ✅ `scope`: `/`
- ✅ `display`: `standalone` (critical for app-like experience)
- ✅ `icons`: 192x192 and 512x512 with both `any` and `maskable` purposes
- ✅ `screenshots`: Mobile and desktop screenshots
- ✅ `shortcuts`: App shortcuts for quick access

## Key Benefits

1. **Type Safety**: Using TypeScript manifest with `MetadataRoute.Manifest` type
2. **Automatic Generation**: Next.js handles manifest generation and linking
3. **Better Caching**: `updateViaCache: 'none'` ensures fresh service worker updates
4. **Enhanced Security**: Security headers protect against common vulnerabilities
5. **Standards Compliance**: Follows Next.js 16.1.1 best practices

## Testing

After these changes:

1. **Verify Manifest**:
   - Visit `/manifest.json` - should show generated manifest
   - Check DevTools → Application → Manifest for validation

2. **Check Service Worker**:
   - DevTools → Application → Service Workers
   - Should show registered with `updateViaCache: 'none'`

3. **Test Installation**:
   - Install the app on mobile device
   - Should open in standalone mode (no browser UI)

4. **Verify Security Headers**:
   - DevTools → Network → Headers
   - Check response headers for security headers

## Next Steps (Optional)

Per Next.js documentation, you can also:

1. **Add Push Notifications**: Implement web push notifications using VAPID keys
2. **Offline Support**: Consider using [Serwist](https://github.com/serwist/serwist) for advanced offline capabilities
3. **HTTPS Testing**: Use `next dev --experimental-https` for local HTTPS testing

## References

- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Next.js Manifest API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)

