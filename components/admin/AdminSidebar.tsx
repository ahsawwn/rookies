"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayout, FiPackage, FiShoppingCart, FiBox, FiShoppingBag, FiDollarSign, FiSettings, FiMenu, FiX, FiList, FiHome } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: FiLayout, category: "main" },
    { name: "Orders", href: "/admin/orders", icon: FiList, category: "main" },
    { name: "Products", href: "/admin/products", icon: FiPackage, category: "products" },
    { name: "POS", href: "/admin/pos", icon: FiShoppingCart, category: "sales" },
    { name: "Inventory", href: "/admin/inventory", icon: FiBox, category: "products" },
    { name: "Purchases", href: "/admin/purchases", icon: FiShoppingBag, category: "products" },
    { name: "Accounting", href: "/admin/accounting", icon: FiDollarSign, category: "finance" },
    { name: "Settings", href: "/admin/settings", icon: FiSettings, category: "settings" },
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
                    "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg z-40 transition-transform duration-300",
                    "lg:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 via-rose-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <span className="text-white font-black text-2xl">🍪</span>
                            </div>
                            <div>
                                <div className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">ROOKIES</div>
                                <div className="text-xs font-medium text-gray-500">Admin Dashboard</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {/* Main Section */}
                        <div className="mb-6">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</span>
                            </div>
                            {menuItems.filter(item => item.category === "main").map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-pink-600")} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Sales Section */}
                        <div className="mb-6">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sales</span>
                            </div>
                            {menuItems.filter(item => item.category === "sales").map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-pink-600")} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Products Section */}
                        <div className="mb-6">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</span>
                            </div>
                            {menuItems.filter(item => item.category === "products").map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-pink-600")} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Finance Section */}
                        <div className="mb-6">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Finance</span>
                            </div>
                            {menuItems.filter(item => item.category === "finance").map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-pink-600")} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Settings Section */}
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</span>
                            </div>
                            {menuItems.filter(item => item.category === "settings").map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-pink-600")} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all group"
                        >
                            <FiHome className="w-4 h-4 group-hover:text-pink-600" />
                            <span>Back to Site</span>
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
