"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiUser, FiX, FiLogOut, FiSettings, FiHeart, FiPackage, FiHome, FiMapPin } from 'react-icons/fi';
import { useSession, signOut as authSignOut } from '@/lib/auth-client';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: sessionData, isPending } = useSession();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const { getItemCount } = useCart();
    const cartCount = getItemCount();
    
    // Extract session and user from Better Auth response
    // Better Auth useSession returns: { data: session, isPending: boolean }
    // where session = { user: { id, name, email, image } }
    // Wait for loading to complete before checking session
    const session = (!isPending && sessionData) ? (sessionData as any) : null;
    const user = session?.user || null;
    const isAdmin = user?.email?.includes('admin') || false;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        try {
            await authSignOut();
            setIsMenuOpen(false);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const navLinks = [
        { name: 'Home', href: '/', icon: FiHome },
        { name: 'Order', href: '/shop', icon: FiPackage },
        { name: 'Locations', href: '/locations', icon: FiMapPin },
        { name: 'Catering', href: '/catering', icon: FiPackage },
        { name: 'Gift Cards', href: '/gift-cards', icon: FiPackage },
    ];

    return (
        <>
            {/* Main Navigation - Mobile First */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Hamburger Menu */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Menu"
                        >
                            {/* Cartoon-style Hamburger Icon */}
                            <div className="w-6 h-5 flex flex-col justify-between">
                                <span className={`block h-0.5 w-full bg-black rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block h-0.5 w-full bg-black rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block h-0.5 w-full bg-black rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>

                        {/* Center: Logo */}
                        <Link href="/" className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                            <div className="w-10 h-10 bg-[#FF6B9D] rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold text-black tracking-tight hidden sm:block">ROOKIES</span>
                        </Link>

                        {/* Right: Cart & Profile */}
                        <div className="flex items-center gap-3">
                            {/* Cart */}
                            <Link 
                                href="/cart" 
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Shopping Cart"
                            >
                                <FiShoppingCart className="w-6 h-6 text-black" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#FF6B9D] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Profile Button (when logged in) or Sign In (when not) */}
                            {user ? (
                                <Link
                                    href="/profile"
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Profile"
                                >
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name || 'User'}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-[#FF6B9D] flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-full bg-[#FF6B9D] text-white text-sm font-medium hover:bg-[#FF4A7A] transition-colors"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Slide-out Menu */}
            <div
                ref={menuRef}
                className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#FF6B9D] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-xl font-bold text-black">ROOKIES</span>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close Menu"
                        >
                            <FiX className="w-6 h-6 text-black" />
                        </button>
                    </div>

                    {/* Menu Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Navigation Links */}
                        <nav className="p-4 space-y-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors"
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Section */}
                        {user ? (
                            <div className="border-t border-gray-200 p-4 space-y-2">
                                <div className="px-4 py-3 flex items-center gap-3">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name || 'User'}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#FF6B9D] flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-black truncate">
                                            {user.name || 'User'}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span className="font-medium">Profile</span>
                                </Link>

                                <Link
                                    href="/profile?tab=orders"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors"
                                >
                                    <FiPackage className="w-5 h-5" />
                                    <span className="font-medium">Orders</span>
                                </Link>

                                <Link
                                    href="/profile?tab=favorites"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors"
                                >
                                    <FiHeart className="w-5 h-5" />
                                    <span className="font-medium">Favorites</span>
                                </Link>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6B9D] hover:bg-pink-50 transition-colors"
                                    >
                                        <FiSettings className="w-5 h-5" />
                                        <span className="font-medium">Admin Panel</span>
                                    </Link>
                                )}

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="border-t border-gray-200 p-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 rounded-full bg-[#FF6B9D] text-white font-medium hover:bg-[#FF4A7A] transition-colors"
                                >
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default Navbar;
