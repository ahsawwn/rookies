"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get("error");

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "invalid_code":
                return {
                    title: "Authentication Failed",
                    description: "The authorization code is invalid or has expired. This usually happens if the Google OAuth client secret is incorrect or there was a connection issue.",
                    action: "Please try logging in again, or contact support if the problem persists.",
                };
            case "access_denied":
                return {
                    title: "Access Denied",
                    description: "You denied access to your Google account.",
                    action: "Please try again and grant the necessary permissions.",
                };
            default:
                return {
                    title: "Authentication Error",
                    description: error || "An unknown error occurred during authentication.",
                    action: "Please try logging in again.",
                };
        }
    };

    const errorInfo = getErrorMessage(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 p-4">
            <Card className="w-full max-w-md shadow-xl border-pink-200">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {errorInfo.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {errorInfo.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                        {errorInfo.action}
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
                        >
                            Back to Login
                        </Button>
                        {error === "invalid_code" && (
                            <p className="text-xs text-gray-500 text-center mt-2">
                                If this error persists, check that your GOOGLE_CLIENT_SECRET in .env matches your Google Cloud Console settings.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

