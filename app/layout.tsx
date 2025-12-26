import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const nunito = Nunito({ 
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-nunito',
});

export const metadata: Metadata = {
    title: 'ROOKIES Home based Bakery - Cookies, Shakes, Cupcakes, Cakes, Croissants & Breads',
    description: 'Fresh baked goods from Pakistan. Order cookies, shakes, cupcakes, cakes, croissants, and breads online. Home-based bakery delivering quality treats.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'ROOKIES Bakery',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#E91E63',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon-192.png" />
            <meta name="theme-color" content="#E91E63" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="ROOKIES Bakery" />
        </head>
        <body className={`${nunito.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
            {children}
        </Providers>
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    if ('serviceWorker' in navigator) {
                        window.addEventListener('load', () => {
                            navigator.serviceWorker.register('/sw.js')
                                .then((registration) => {
                                    console.log('SW registered:', registration);
                                })
                                .catch((error) => {
                                    console.log('SW registration failed:', error);
                                });
                        });
                    }
                `,
            }}
        />
        </body>
        </html>
    );
}