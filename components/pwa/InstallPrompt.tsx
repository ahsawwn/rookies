"use client";

import { useState, useEffect } from "react";
import { FiX, FiDownload, FiSmartphone, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [hasSeenInstructions, setHasSeenInstructions] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const checkStandalone = () => {
            const standalone = 
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as any).standalone === true ||
                document.referrer.includes("android-app://");
            
            setIsStandalone(standalone);
            
            if (standalone) {
                console.log("[PWA] App is already installed (standalone mode)");
                return true;
            }
            return false;
        };

        // Check immediately
        if (checkStandalone()) {
            return; // Don't show prompt if already installed
        }

        // Check for test mode (for debugging)
        const isTestMode = typeof window !== "undefined" && 
            (new URLSearchParams(window.location.search).get("pwa-test") === "true" ||
             localStorage.getItem("pwa-test-mode") === "true");

        // Check if user has seen instructions before
        const seenInstructions = localStorage.getItem("pwa-instructions-seen") === "true";
        setHasSeenInstructions(seenInstructions);

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(iOS);

        // Check if user has dismissed the prompt
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
        const daysSinceDismissed = dismissedTime > 0 ? (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24) : 999;

        // Check if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // Show prompt if:
        // 1. Not in standalone mode (not installed)
        // 2. On mobile device
        // 3. Not dismissed in last 7 days (or never dismissed)
        // 4. OR in test mode
        const shouldShow = (!checkStandalone() && isMobile && daysSinceDismissed > 7) || isTestMode;

        console.log("[PWA] Check:", {
            isStandalone: checkStandalone(),
            isMobile,
            isIOS: iOS,
            daysSinceDismissed,
            seenInstructions,
            isTestMode,
            shouldShow
        });

        if (!shouldShow) {
            return;
        }

        // For Android/Chrome - listen for beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log("[PWA] beforeinstallprompt event fired");
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);
            
            // Show prompt immediately when event fires
            if (!seenInstructions) {
                setShowPrompt(true);
                // Show instructions automatically for first-time users
                setTimeout(() => {
                    setShowInstructions(true);
                }, 500);
            }
        };

        // Listen for appinstalled event
        const handleAppInstalled = () => {
            console.log("[PWA] App was installed");
            setShowPrompt(false);
            setDeferredPrompt(null);
            // Mark instructions as seen
            localStorage.setItem("pwa-instructions-seen", "true");
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        // For Android/Chrome - show prompt after delay if event doesn't fire
        // (some browsers may not fire the event, but users can still install via menu)
        if (!iOS) {
            const androidTimeout = setTimeout(() => {
                if (!checkStandalone() && !seenInstructions) {
                    console.log("[PWA] Showing Android prompt (fallback)");
                    setShowPrompt(true);
                    // Show instructions automatically for first-time users
                    setTimeout(() => {
                        setShowInstructions(true);
                    }, 500);
                }
            }, 3000); // Show after 3 seconds
            
            return () => {
                clearTimeout(androidTimeout);
                window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
                window.removeEventListener("appinstalled", handleAppInstalled);
            };
        }

        // For iOS - show instructions after a delay
        if (iOS && !seenInstructions) {
            const iosTimeout = setTimeout(() => {
                if (!checkStandalone()) {
                    console.log("[PWA] Showing iOS prompt");
                    setShowPrompt(true);
                    setShowInstructions(true);
                }
            }, 3000); // Show after 3 seconds
            
            return () => {
                clearTimeout(iosTimeout);
                window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
                window.removeEventListener("appinstalled", handleAppInstalled);
            };
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []); // Empty dependency array - only run once on mount

    const handleInstallClick = async () => {
        console.log("[PWA] Install button clicked", { 
            deferredPrompt: !!deferredPrompt, 
            isIOS,
            showInstructions 
        });
        
        if (deferredPrompt) {
            try {
                // Android/Chrome - show native install prompt
                console.log("[PWA] Calling deferredPrompt.prompt()");
                await deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;

                console.log("[PWA] User choice:", outcome);
                if (outcome === "accepted") {
                    console.log("[PWA] User accepted the install prompt");
                    setShowPrompt(false);
                    setDeferredPrompt(null);
                    // Mark instructions as seen
                    localStorage.setItem("pwa-instructions-seen", "true");
                } else {
                    console.log("[PWA] User dismissed the install prompt");
                    // Keep instructions visible so user can try manual method
                }
            } catch (error) {
                console.error("[PWA] Error showing install prompt:", error);
                // Keep instructions visible
            }
        } else {
            // No deferred prompt available - toggle instructions
            console.log("[PWA] No deferred prompt available, toggling instructions");
            setShowInstructions(!showInstructions);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("pwa-install-dismissed", Date.now().toString());
        // Mark instructions as seen even if dismissed
        localStorage.setItem("pwa-instructions-seen", "true");
    };

    // Don't show if already installed
    if (isStandalone) {
        return null;
    }

    // Don't show if prompt state is false
    if (!showPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white shadow-2xl animate-slide-up">
            <div className="max-w-md mx-auto">
                {isIOS ? (
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-white/20 rounded-xl flex-shrink-0 backdrop-blur-sm">
                                <FiSmartphone className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-base mb-1">Install ROOKIES Bakery</p>
                                <p className="text-xs text-pink-100 leading-relaxed mb-3">
                                    Add ROOKIES to your home screen for quick access and a better experience!
                                </p>
                                {showInstructions && (
                                    <div className="bg-white/10 rounded-lg p-3 space-y-2 backdrop-blur-sm">
                                        <p className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                                            <FiCheckCircle className="w-4 h-4" />
                                            Installation Steps:
                                        </p>
                                        <ol className="text-xs text-pink-100 space-y-2 ml-4 list-decimal">
                                            <li>
                                                Tap the <span className="font-semibold text-white">Share</span> button 
                                                <span className="text-lg mx-1">⎋</span> at the bottom
                                            </li>
                                            <li>
                                                Scroll down and tap <span className="font-semibold text-white">"Add to Home Screen"</span>
                                            </li>
                                            <li>
                                                Tap <span className="font-semibold text-white">"Add"</span> to confirm
                                            </li>
                                        </ol>
                                        <div className="bg-white/5 rounded p-2 mt-2">
                                            <p className="text-xs text-pink-200">
                                                ✅ Once added, ROOKIES will work like a native app!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                                aria-label="Dismiss"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 rounded-xl flex-shrink-0 backdrop-blur-sm">
                                <FiDownload className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-base mb-1">Install ROOKIES Bakery App</p>
                                <p className="text-xs text-pink-100">
                                    Install locally on your phone - works offline, loads faster, feels like a native app!
                                </p>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                                aria-label="Dismiss"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <Button
                            onClick={handleInstallClick}
                            className="w-full bg-white text-pink-600 hover:bg-pink-50 font-semibold shadow-lg hover:shadow-xl transition-all"
                            size="sm"
                        >
                            <FiDownload className="w-4 h-4 mr-2" />
                            {deferredPrompt ? "Install Now" : showInstructions ? "Hide Instructions" : "Show Instructions"}
                        </Button>
                        
                        {showInstructions && (
                            <div className="bg-white/10 rounded-lg p-4 space-y-3 backdrop-blur-sm animate-slide-up">
                                <p className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                                    <FiCheckCircle className="w-4 h-4" />
                                    Installation Steps:
                                </p>
                                <p className="text-xs text-pink-100 mb-2">
                                    <span className="font-semibold text-white">"Add to Home Screen"</span> installs the app locally on your phone - 
                                    it works just like a native app!
                                </p>
                                <ol className="text-xs text-pink-100 space-y-2 ml-4 list-decimal">
                                    <li>
                                        Tap the <span className="font-semibold text-white">menu</span> button 
                                        <span className="mx-1 text-lg">(⋮)</span> in the top-right corner of your browser
                                    </li>
                                    <li>
                                        Look for <span className="font-semibold text-white">"Add to Home screen"</span> or 
                                        <span className="font-semibold text-white"> "Install app"</span> option
                                    </li>
                                    <li>
                                        Tap it and confirm - ROOKIES will be installed as an app on your phone
                                    </li>
                                </ol>
                                <div className="bg-white/5 rounded-lg p-3 mt-2 space-y-1">
                                    <p className="text-xs text-pink-200 flex items-center gap-2">
                                        <FiCheckCircle className="w-3 h-3" />
                                        Opens like a native app (no browser UI)
                                    </p>
                                    <p className="text-xs text-pink-200 flex items-center gap-2">
                                        <FiCheckCircle className="w-3 h-3" />
                                        Works offline with cached content
                                    </p>
                                    <p className="text-xs text-pink-200 flex items-center gap-2">
                                        <FiCheckCircle className="w-3 h-3" />
                                        Faster loading and better performance
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
