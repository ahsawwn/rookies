"use client";

/**
 * Session storage utilities for client-side session management
 */

const SESSION_KEY = "userSession";
const SESSION_EXPIRY_DAYS = 30;

export interface StoredSession {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    expiresAt: string;
}

/**
 * Store session in localStorage
 */
export function storeSession(session: StoredSession): void {
    if (typeof window === "undefined") return;
    
    // Validate session has user before storing
    if (!session.user || !session.user.id) {
        console.error("Cannot store session: missing user or user.id");
        return;
    }
    
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const stored: StoredSession = {
        user: {
            id: session.user.id,
            name: session.user.name ?? null,
            email: session.user.email ?? null,
            image: session.user.image ?? null,
        },
        expiresAt: expiresAt.toISOString(),
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    
    // Dispatch custom event to notify other components (debounced in SessionContext)
    window.dispatchEvent(new CustomEvent('sessionUpdated'));
}

/**
 * Get session from localStorage
 */
export function getStoredSession(): StoredSession | null {
    if (typeof window === "undefined") return null;
    
    try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (!stored) return null;
        
        const session: StoredSession = JSON.parse(stored);
        
        // Validate session structure
        if (!session.user || !session.user.id) {
            console.warn("Invalid session structure in localStorage");
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        
        // Check if expired
        const expiresAt = new Date(session.expiresAt);
        if (expiresAt < new Date()) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        
        return session;
    } catch (error) {
        console.error("Error reading session from localStorage:", error);
        return null;
    }
}

/**
 * Clear session from localStorage
 */
export function clearStoredSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if session is valid
 */
export function isSessionValid(): boolean {
    const session = getStoredSession();
    return session !== null;
}

