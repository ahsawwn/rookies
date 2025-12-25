"use client";

import { useState, useEffect, useRef } from "react";
import { FiBell, FiX } from "react-icons/fi";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "order" | "promotion" | "system";
    read: boolean;
    createdAt: Date;
    link?: string;
}

interface NotificationsDropdownProps {
    userId?: string;
}

export function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock notifications for now (Phase 5 will implement full notification system)
    useEffect(() => {
        // TODO: Fetch real notifications from API in Phase 5
        const mockNotifications: Notification[] = [];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const markAsRead = (notificationId: string) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
                aria-label="Notifications"
            >
                <FiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FiBell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${
                                            !notification.read ? "bg-pink-50/50" : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <p
                                                    className={`font-medium text-sm ${
                                                        !notification.read
                                                            ? "text-gray-900"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(
                                                        notification.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <button
                                                    onClick={() =>
                                                        markAsRead(notification.id)
                                                    }
                                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                    aria-label="Mark as read"
                                                >
                                                    <FiX className="w-4 h-4 text-gray-400" />
                                                </button>
                                            )}
                                        </div>
                                        {notification.link && (
                                            <Link
                                                href={notification.link}
                                                onClick={() => setIsOpen(false)}
                                                className="text-xs text-pink-600 hover:text-pink-700 mt-2 inline-block"
                                            >
                                                View details →
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-gray-200 p-3 text-center">
                            <Link
                                href="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

