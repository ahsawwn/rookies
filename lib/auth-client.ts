"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export Better Auth hooks and functions for easier use
export const { useSession, signIn, signOut, signUp } = authClient;

