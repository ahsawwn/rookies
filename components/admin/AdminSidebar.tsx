"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayout, FiPackage, FiShoppingCart, FiBox, FiShoppingBag, FiDollarSign, FiSettings, FiMenu, FiX, FiList, FiHome, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: FiLayout, category: "main" },
    { name: "Orders", href: "/admin/orders", icon: FiList, category: "main" },
    { name: "Products", href: "/admin/products", icon: FiPackage, category: "products" },
    { name: "Weekly Products", href: "/admin/weekly-products", icon: FiCalendar, category: "products" },
    { name: "POS", href: "/admin/pos", icon: FiShoppingCart, category: "sales" },
    { name: "Inventory", href: "/admin/inventory", icon: FiBox, category: "products" },
    { name: "Purchases", href: "/admin/purchases", icon: FiShoppingBag, category: "products" },
    { name: "Accounting", href: "/admin/accounting", icon: FiDollarSign, category: "finance" },
    { name: "Testimonials", href: "/admin/testimonials", icon: FiMessageSquare, category: "settings" },
    { name: "Settings", href: "/admin/settings", icon: FiSettings, category: "settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu when clicking outside or on route change
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-gray-900 rounded border border-gray-700 hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileOpen ? (
                    <FiX className="w-5 h-5 text-gray-300" />
                ) : (
                    <FiMenu className="w-5 h-5 text-gray-300" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 z-[45] transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-[50] transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-800 bg-gray-900">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center group-hover:bg-gray-750 transition-colors">
                                <span className="text-gray-300 font-bold text-lg">R</span>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-100">ROOKIES</div>
                                <div className="text-xs text-gray-500">Admin</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {/* Main Section */}
                        <div className="mb-4">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Main</span>
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
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative",
                                            isActive
                                                ? "bg-gray-800 text-white border-l-2 border-gray-400"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300")} />
                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Sales Section */}
                        <div className="mb-4">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</span>
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
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative",
                                            isActive
                                                ? "bg-gray-800 text-white border-l-2 border-gray-400"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300")} />
                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Products Section */}
                        <div className="mb-4">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Products</span>
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
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative",
                                            isActive
                                                ? "bg-gray-800 text-white border-l-2 border-gray-400"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300")} />
                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Finance Section */}
                        <div className="mb-4">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Finance</span>
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
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative",
                                            isActive
                                                ? "bg-gray-800 text-white border-l-2 border-gray-400"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300")} />
                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
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
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative",
                                            isActive
                                                ? "bg-gray-800 text-white border-l-2 border-gray-400"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300")} />
                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-800 bg-gray-900">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors"
                        >
                            <FiHome className="w-4 h-4" />
                            <span>Back to Site</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
