"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import {
    syncCartToDatabase,
    getCartFromDatabase,
    clearCartFromDatabase,
    mergeCarts,
    type CartItemInput,
} from "@/server/cart";

export interface CartItem {
    productId: string;
    quantity: number;
    product?: {
        id: string;
        name: string;
        price: string;
        image: string;
        slug: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addItem: (productId: string, quantity?: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getItemCount: () => number;
    getTotal: () => number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rookies_cart";
const SESSION_ID_KEY = "rookies_session_id";

function getSessionId(): string {
    if (typeof window === "undefined") return "";
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: sessionData } = useSession();
    // Better Auth returns: { data: session } where session = { user: {...} }
    const session = sessionData || null;
    const user = session?.user || null;
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart on mount and when session changes
    useEffect(() => {
        if (typeof window === "undefined") return;

        const loadCart = async () => {
            try {
                // Load from localStorage first
                const storedCart = localStorage.getItem(CART_STORAGE_KEY);
                if (storedCart) {
                    const parsedItems = JSON.parse(storedCart);
                    setItems(parsedItems);
                }

                // Use session from Better Auth (no API call needed)
                const userId = user?.id;

                if (userId) {
                    // Load from database and merge
                    const dbResult = await getCartFromDatabase(userId);
                    if (dbResult.success && dbResult.items.length > 0) {
                        // Merge with localStorage cart
                        const localItems = storedCart ? JSON.parse(storedCart) : [];
                        if (localItems.length > 0) {
                            // Merge carts
                            const mergedResult = await mergeCarts(
                                localItems.map((item: CartItem) => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                })),
                                userId
                            );
                            if (mergedResult.success) {
                                const mergedCart = await getCartFromDatabase(userId);
                                if (mergedCart.success) {
                                    setItems(mergedCart.items as CartItem[]);
                                    localStorage.setItem(
                                        CART_STORAGE_KEY,
                                        JSON.stringify(mergedCart.items)
                                    );
                                }
                            }
                        } else {
                            // Use database cart
                            setItems(dbResult.items as CartItem[]);
                            localStorage.setItem(
                                CART_STORAGE_KEY,
                                JSON.stringify(dbResult.items)
                            );
                        }
                    }
                } else {
                    // Guest user - load from localStorage or database with sessionId
                    const sessionId = getSessionId();
                    const dbResult = await getCartFromDatabase(undefined, sessionId);
                    if (dbResult.success && dbResult.items.length > 0) {
                        setItems(dbResult.items as CartItem[]);
                        localStorage.setItem(
                            CART_STORAGE_KEY,
                            JSON.stringify(dbResult.items)
                        );
                    }
                }
            } catch (error) {
                console.error("Error loading cart:", error);
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        loadCart();
    }, [user?.id]); // Reload when session changes

    // Sync to localStorage and database (called after state updates, not during render)
    const syncCart = useCallback(
        async (newItems: CartItem[]) => {
            if (typeof window === "undefined") return;

            // Always update localStorage
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));

            // Sync to database if logged in or has session
            try {
                // Use session from Better Auth (no API call needed)
                const userId = user?.id;
                const sessionId = userId ? undefined : getSessionId();

                const cartItems: CartItemInput[] = newItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                }));

                await syncCartToDatabase(cartItems, userId, sessionId);
            } catch (error) {
                console.error("Error syncing cart to database:", error);
                // Don't throw - localStorage is the source of truth
            }
        },
        [user?.id]
    );

    // Sync cart to database after items change (but not during initial load)
    useEffect(() => {
        if (!isInitialized) return; // Don't sync during initial load
        
        // Debounce sync to avoid too many database calls
        const syncTimeout = setTimeout(() => {
            syncCart(items);
        }, 500);

        return () => clearTimeout(syncTimeout);
    }, [items, isInitialized, syncCart]);

    const addItem = useCallback(
        async (productId: string, quantity: number = 1, productDetails?: CartItem["product"]) => {
            setItems((prevItems) => {
                const existingItem = prevItems.find(
                    (item) => item.productId === productId
                );
                let newItems: CartItem[];

                if (existingItem) {
                    newItems = prevItems.map((item) =>
                        item.productId === productId
                            ? { 
                                ...item, 
                                quantity: item.quantity + quantity,
                                product: productDetails || item.product
                            }
                            : item
                    );
                } else {
                    newItems = [
                        ...prevItems,
                        {
                            productId,
                            quantity,
                            product: productDetails,
                        },
                    ];
                }
                // Update localStorage immediately for instant UI feedback
                if (typeof window !== "undefined") {
                    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
                }
                return newItems;
            });
        },
        []
    );

    const removeItem = useCallback(
        async (productId: string) => {
            setItems((prevItems) => {
                const newItems = prevItems.filter(
                    (item) => item.productId !== productId
                );
                // Update localStorage immediately for instant UI feedback
                if (typeof window !== "undefined") {
                    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
                }
                return newItems;
            });
        },
        []
    );

    const updateQuantity = useCallback(
        async (productId: string, quantity: number) => {
            if (quantity <= 0) {
                await removeItem(productId);
                return;
            }

            setItems((prevItems) => {
                const newItems = prevItems.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                );
                // Update localStorage immediately for instant UI feedback
                if (typeof window !== "undefined") {
                    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
                }
                return newItems;
            });
        },
        [removeItem]
    );

    const clearCart = useCallback(async () => {
        setItems([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(CART_STORAGE_KEY);

            try {
                // Use session from Better Auth (no API call needed)
                const userId = user?.id;
                const sessionId = userId ? undefined : getSessionId();
                await clearCartFromDatabase(userId, sessionId);
            } catch (error) {
                console.error("Error clearing cart from database:", error);
            }
        }
    }, []);

    const getItemCount = useCallback(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const getTotal = useCallback(() => {
        return items.reduce((total, item) => {
            const price = item.product?.price
                ? parseFloat(item.product.price)
                : 0;
            return total + price * item.quantity;
        }, 0);
    }, [items]);

    // Listen for auth changes to sync cart
    useEffect(() => {
        if (!isInitialized) return;

        const checkAuthAndSync = async () => {
            // Use session from Better Auth (no API call needed)
            const userId = user?.id;

            if (userId && items.length > 0) {
                // User logged in - sync cart
                const cartItems: CartItemInput[] = items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                }));
                await syncCartToDatabase(cartItems, userId);
            }
        };

        // Check periodically (every 30 seconds) for auth changes - REDUCED from 5s to 30s for performance
        const interval = setInterval(checkAuthAndSync, 30000);
        return () => clearInterval(interval);
    }, [items, isInitialized]);

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotal,
        isLoading,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

