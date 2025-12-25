import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import Link from "next/link";

export default async function AdminLoginPage() {
    const { success } = await getCurrentAdmin();

    if (success) {
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

