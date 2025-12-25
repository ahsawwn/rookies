"use client";

import { useRouter } from "next/navigation";
import { adminLogout } from "@/server/admin";
import { AdminButton } from "./Button";
import { FiLogOut, FiBell, FiSearch } from "react-icons/fi";
import { toast } from "sonner";

interface AdminHeaderProps {
    adminName: string;
    adminEmail: string;
}

export function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        const result = await adminLogout();
        if (result.success) {
            toast.success("Logged out successfully");
            router.push("/admin/login");
            router.refresh();
        } else {
            toast.error("Failed to logout");
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-md">
                    <div className="relative w-full">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiBell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Admin Info */}
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{adminName}</div>
                            <div className="text-xs text-gray-500">{adminEmail}</div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <AdminButton
                        variant="outline"
                        onClick={handleLogout}
                        icon={<FiLogOut className="w-4 h-4" />}
                    >
                        <span className="hidden sm:inline">Logout</span>
                    </AdminButton>
                </div>
            </div>
        </header>
    );
}
