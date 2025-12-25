"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayout, FiPackage, FiShoppingCart, FiBox, FiShoppingBag, FiDollarSign, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: FiLayout },
    { name: "Products", href: "/admin/products", icon: FiPackage },
    { name: "POS", href: "/admin/pos", icon: FiShoppingCart },
    { name: "Inventory", href: "/admin/inventory", icon: FiBox },
    { name: "Purchases", href: "/admin/purchases", icon: FiShoppingBag },
    { name: "Accounting", href: "/admin/accounting", icon: FiDollarSign },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
            >
                {isMobileOpen ? (
                    <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                    <FiMenu className="w-6 h-6 text-gray-700" />
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300",
                    "lg:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <div>
                                <div className="text-lg font-black text-gray-900">ROOKIES</div>
                                <div className="text-xs text-gray-500">Admin Panel</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 font-medium border border-pink-200"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-pink-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <span>← Back to Site</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
