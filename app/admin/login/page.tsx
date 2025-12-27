import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import Link from "next/link";

export default async function AdminLoginPage() {
    let isDatabaseConfigured = true;
    let currentAdmin = null;
    
    try {
        const result = await getCurrentAdmin();
        currentAdmin = result.admin;
        // Check if database is configured by checking if we got a proper error or just no session
        isDatabaseConfigured = process.env.DATABASE_URL ? true : false;
    } catch (error) {
        // If error is about DATABASE_URL, database is not configured
        isDatabaseConfigured = false;
    }

    if (currentAdmin) {
        redirect("/admin");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-2xl font-black text-gray-900">ROOKIES</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-600">Access the admin dashboard</p>
                </div>

                {!isDatabaseConfigured && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                        <p className="font-semibold mb-1">Database Not Configured</p>
                        <p>Please set DATABASE_URL in your .env.local file to enable admin login.</p>
                    </div>
                )}

                <AdminLoginForm />

                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

