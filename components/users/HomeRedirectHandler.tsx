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
            // #region agent log
            const redirectAfterLogin = typeof window !== "undefined" ? localStorage.getItem("redirectAfterLogin") : null;
            const userSession = typeof window !== "undefined" ? localStorage.getItem("userSession") : null;
            fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeRedirectHandler.tsx:12',message:'Home page loaded',data:{redirectAfterLogin,hasUserSession:!!userSession,currentPath:typeof window !== "undefined" ? window.location.pathname : "unknown"},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
            // #endregion
            
            // If we have redirectAfterLogin but no session in localStorage, try to get session from Better Auth
            // This handles OAuth callbacks where session cookie exists but localStorage hasn't been updated yet
            if (typeof window !== "undefined" && redirectAfterLogin && !userSession) {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeRedirectHandler.tsx:18',message:'No session in localStorage, checking Better Auth',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
                // #endregion
                
                // Retry getting session (OAuth cookies might not be immediately available)
                for (let i = 0; i < 5; i++) {
                    await new Promise(resolve => setTimeout(resolve, 300 * (i + 1)));
                    try {
                        const sessionData = await authClient.getSession();
                        if (sessionData.data?.session?.user) {
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeRedirectHandler.tsx:26',message:'Session found from Better Auth, storing',data:{userId:sessionData.data.session.user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
                            // #endregion
                            
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
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/9e60db85-81e9-4252-8847-88441cf72423',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeRedirectHandler.tsx:50',message:'Redirecting from home to saved URL',data:{redirectAfterLogin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
                // #endregion
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

