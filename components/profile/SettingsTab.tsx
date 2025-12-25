"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiLogOut, FiSettings, FiShield, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

export function SettingsTab() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleSignOut = async () => {
        try {
            setIsLoggingOut(true);
            await authClient.signOut();
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out. Please try again.");
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                            <FiSettings className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Manage your account preferences and security
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-pink-100">
                        <div className="flex items-center gap-3 mb-2">
                            <FiShield className="w-5 h-5 text-pink-600" />
                            <h3 className="font-semibold text-gray-900">Security</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Password change and security settings will be available soon.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FiLogOut className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <CardTitle>Sign Out</CardTitle>
                            <CardDescription>
                                Sign out of your account
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                    >
                        {isLoggingOut ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing out...
                            </>
                        ) : (
                            <>
                                <FiLogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FiTrash2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <CardTitle>Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">
                            Account deletion will be available soon. This action cannot be undone.
                        </p>
                        <Button
                            disabled
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            Delete Account (Coming Soon)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

