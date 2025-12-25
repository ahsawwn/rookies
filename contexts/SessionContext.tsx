"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { getStoredSession, storeSession, clearStoredSession, type StoredSession } from '@/lib/session-storage';

interface SessionUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface Session {
    user: SessionUser;
}

interface SessionContextType {
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    refreshSession: () => Promise<void>;
    clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasVerified, setHasVerified] = useState(false);

    // Load session from localStorage synchronously
    const loadFromStorage = useCallback(() => {
        try {
            const stored = getStoredSession();
            if (stored && stored.user && stored.user.id) {
                const sessionObj: Session = { user: stored.user };
                setSession(sessionObj);
                const userEmail = stored.user?.email;
                setIsAdmin(userEmail?.includes('admin') || false);
                return true;
            }
        } catch (error) {
            console.error("Error loading session from storage:", error);
        }
        setSession(null);
        setIsAdmin(false);
        return false;
    }, []);

    // Verify session with API (only when needed)
    const verifySession = useCallback(async () => {
        try {
            const sessionData = await authClient.getSession();
            const authSession = sessionData.data?.session || null;

            // Better-auth returns session with user property
            if (authSession && 'user' in authSession && authSession.user) {
                const user = authSession.user as SessionUser;
                const sessionObj: Session = { user };
                setSession(sessionObj);
                storeSession({
                    user: {
                        id: user.id,
                        name: user.name ?? null,
                        email: user.email ?? null,
                        image: user.image ?? null,
                    },
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                });
                const userEmail = user?.email;
                setIsAdmin(userEmail?.includes('admin') || false);
            } else {
                setSession(null);
                clearStoredSession();
                setIsAdmin(false);
            }
        } catch (error) {
            console.error("Error verifying session:", error);
            // On error, keep using localStorage session if available
            if (!session) {
                loadFromStorage();
            }
        } finally {
            setIsLoading(false);
            setHasVerified(true);
        }
    }, [session, loadFromStorage]);

    // Refresh session (for manual refresh)
    const refreshSession = useCallback(async () => {
        await verifySession();
    }, [verifySession]);

    // Clear session
    const clearSession = useCallback(() => {
        setSession(null);
        setIsAdmin(false);
        clearStoredSession();
    }, []);

    // Initialize on mount
    useEffect(() => {
        // Load from localStorage immediately (synchronous)
        const hasStored = loadFromStorage();
        setIsLoading(false);

        // Verify with API after a short delay to ensure session is valid (only once)
        const verifyTimeout = setTimeout(() => {
            verifySession();
        }, hasStored ? 1000 : 300);

        // Listen for storage changes (cross-tab updates)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'userSession' || e.key === null) {
                loadFromStorage();
            }
        };

        // Listen for custom session update event (same-tab updates)
        let updateTimeout: NodeJS.Timeout | null = null;
        let isUpdating = false;
        const handleSessionUpdate = () => {
            // Prevent concurrent updates
            if (isUpdating) return;
            
            // Debounce rapid updates to prevent loops
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            updateTimeout = setTimeout(() => {
                isUpdating = true;
                // Immediately load from storage to update UI
                const hasStored = loadFromStorage();
                // Only verify with API if we loaded a session (to avoid unnecessary calls)
                if (hasStored) {
                    verifySession();
                }
                isUpdating = false;
            }, 200);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('sessionUpdated', handleSessionUpdate);

        return () => {
            clearTimeout(verifyTimeout);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('sessionUpdated', handleSessionUpdate);
        };
    }, [loadFromStorage, verifySession, hasVerified]);

    return (
        <SessionContext.Provider
            value={{
                session,
                isLoading,
                isAdmin,
                refreshSession,
                clearSession,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

