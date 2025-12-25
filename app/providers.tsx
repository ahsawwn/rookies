"use client"

import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                <Toaster />
                {children}
            </CartProvider>
        </SessionProvider>
    );
}