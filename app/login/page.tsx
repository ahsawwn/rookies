import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        // Check for redirect URL in search params (client-side will handle localStorage redirect)
        redirect("/");
    }
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 md:p-10 relative overflow-hidden">
            {/* Animated background elements with home page colors */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-pink-100/50 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-amber-100/50 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            
            <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
                <Link
                    className="flex items-center gap-3 self-center font-bold text-xl group transition-transform duration-300 hover:scale-105"
                    href="/"
                >
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 text-white text-xl font-bold shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3">
                        C
                    </div>
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        ROOKIES
                    </span>
                </Link>
                <LoginForm />
            </div>
        </div>
    );
}