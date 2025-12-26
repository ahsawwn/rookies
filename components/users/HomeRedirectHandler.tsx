"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { storeSession } from '@/lib/session-storage';

export function HomeRedirectHandler() {
    const router = useRouter();
    const [hasChecked, setHasChecked] = useState(false);
    
    useEffect(() => {
        const checkAndRedirect = async () => {
            const redirectAfterLogin = typeof window !== "undefined" ? localStorage.getItem("redirectAfterLogin") : null;
            const userSession = typeof window !== "undefined" ? localStorage.getItem("userSession") : null;
            
            // If we have redirectAfterLogin but no session in localStorage, try to get session from Better Auth
            // This handles OAuth callbacks where session cookie exists but localStorage hasn't been updated yet
            if (typeof window !== "undefined" && redirectAfterLogin && !userSession) {
                // Retry getting session (OAuth cookies might not be immediately available)
                for (let i = 0; i < 5; i++) {
                    await new Promise(resolve => setTimeout(resolve, 300 * (i + 1)));
                    try {
                        const sessionData = await authClient.getSession();
                        if (sessionData.data?.session?.user) {
                            // Store session in localStorage
                            storeSession({
                                user: sessionData.data.session.user,
                                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            });
                            
                            // Dispatch event to notify SessionContext
                            window.dispatchEvent(new CustomEvent('sessionUpdated'));
                            
                            // Wait a moment for context to update, then redirect
                            setTimeout(() => {
                                localStorage.removeItem("redirectAfterLogin");
                                router.push(redirectAfterLogin);
                            }, 200);
                            setHasChecked(true);
                            return;
                        }
                    } catch (error) {
                        console.error("Error getting session:", error);
                    }
                }
            }
            
            // Check if user just logged in and has a redirect URL (session already in localStorage)
            if (typeof window !== "undefined" && redirectAfterLogin && userSession) {
                localStorage.removeItem("redirectAfterLogin");
                router.push(redirectAfterLogin);
            }
            
            setHasChecked(true);
        };
        
        if (!hasChecked) {
            checkAndRedirect();
        }
    }, [router, hasChecked]);
    
    return null; // This component doesn't render anything
}

