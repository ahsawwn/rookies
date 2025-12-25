import type { Metadata } from 'next';
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
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={`${nunito.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}