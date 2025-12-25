"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/server/admin";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FiMail, FiLock, FiLoader, FiShield } from "react-icons/fi";

export function AdminLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasskeySupported, setIsPasskeySupported] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if WebAuthn/Passkey is supported
        setIsPasskeySupported(
            typeof window !== "undefined" &&
            typeof PublicKeyCredential !== "undefined" &&
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== undefined
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await adminLogin(email, password);

            if (result.success) {
                toast.success("Login successful!");
                router.push("/admin");
                router.refresh();
            } else {
                toast.error(result.error || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasskeyLogin = async () => {
        if (!isPasskeySupported) {
            toast.error("Passkey is not supported on this device");
            return;
        }

        // Note: Full passkey implementation requires server-side API routes
        // For now, show a message that this feature is coming soon
        toast.info("Passkey authentication is coming soon! Please use email/password for now.");
        
        // TODO: Implement full WebAuthn flow with server-side credential storage
        // This requires:
        // 1. API routes for credential registration (/api/webauthn/register)
        // 2. API routes for challenge generation (/api/webauthn/challenge)
        // 3. API routes for credential verification (/api/webauthn/verify)
        // 4. Database schema for storing WebAuthn credentials
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access the admin panel
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Login with Email"
                        )}
                    </Button>
                </form>

                {/* Passkey Login Option */}
                {isPasskeySupported && (
                    <>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300"></span>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handlePasskeyLogin}
                            variant="outline"
                            className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                            disabled={isLoading}
                        >
                            <FiShield className="w-4 h-4 mr-2" />
                            {isLoading ? "Authenticating..." : "Login with Passkey"}
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Use your fingerprint, face ID, or device PIN
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

