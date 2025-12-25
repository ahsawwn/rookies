"use client";

import { cn } from "@/lib/utils";

interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "orders", label: "Orders" },
        { id: "settings", label: "Settings" },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === tab.id
                                ? "border-pink-600 text-pink-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}

