import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import './globals.css';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-poppins',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'ROOKIES Home based Bakery',
        template: '%s | ROOKIES Bakery',
    },
    description: 'Fresh baked goods from Pakistan. Order cookies, shakes, cupcakes, cakes, croissants, and breads online. Home-based bakery delivering quality treats.',
    keywords: ['bakery', 'cookies', 'cakes', 'cupcakes', 'shakes', 'breads', 'croissants', 'Pakistan', 'fresh baked', 'home bakery'],
    authors: [{ name: 'ROOKIES Bakery' }],
    creator: 'ROOKIES Bakery',
    publisher: 'ROOKIES Bakery',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: 'ROOKIES Bakery',
        title: 'ROOKIES Home based Bakery - Fresh Baked Goods',
        description: 'Fresh baked goods from Pakistan. Order cookies, shakes, cupcakes, cakes, croissants, and breads online.',
        images: [
            {
                url: '/icon-512.png',
                width: 512,
                height: 512,
                alt: 'ROOKIES Bakery Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ROOKIES Home based Bakery',
        description: 'Fresh baked goods from Pakistan. Order cookies, shakes, cupcakes, cakes, croissants, and breads online.',
        images: ['/icon-512.png'],
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'ROOKIES Bakery',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ec4899' },
        { media: '(prefers-color-scheme: dark)', color: '#ec4899' },
    ],
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <head>
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
            <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="ROOKIES Bakery" />
            <meta name="application-name" content="ROOKIES Bakery" />
            <meta name="msapplication-TileColor" content="#ec4899" />
            <meta name="msapplication-TileImage" content="/icon-192.png" />
            <meta name="theme-color" content="#ec4899" />
            <meta name="msapplication-navbutton-color" content="#ec4899" />
        </head>
        <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
            {children}
            <InstallPrompt />
        </Providers>
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        if ('serviceWorker' in navigator) {
                            // Register service worker immediately
                            navigator.serviceWorker.register('/sw.js', { 
                                    scope: '/',
                                    updateViaCache: 'none'
                                })
                                .then((registration) => {
                                    console.log('[PWA] Service Worker registered:', registration.scope);
                                    
                                    // Wait for service worker to be ready
                                    return navigator.serviceWorker.ready;
                                })
                                .then((registration) => {
                                    console.log('[PWA] Service Worker ready and controlling page');
                                    
                                    // Check if service worker is controlling this page
                                    if (registration.active) {
                                        console.log('[PWA] Service Worker is active and controlling');
                                    }
                                    
                                    // Check for updates
                                    registration.addEventListener('updatefound', () => {
                                        console.log('[PWA] New service worker found, updating...');
                                    });
                                })
                                .catch((error) => {
                                    console.error('[PWA] Service Worker registration failed:', error);
                                });
                            
                            // Ensure service worker controls the page
                            if (navigator.serviceWorker.controller) {
                                console.log('[PWA] Service Worker is already controlling this page');
                            } else {
                                console.log('[PWA] Waiting for Service Worker to take control...');
                            }
                        }
                    })();
                `,
            }}
        />
        </body>
        </html>
    );
}