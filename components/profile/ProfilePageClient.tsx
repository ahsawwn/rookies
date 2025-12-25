"use client";

import { useState } from "react";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileTab } from "@/components/profile/ProfileTab";
import { OrdersTab } from "@/components/profile/OrdersTab";
import { SettingsTab } from "@/components/profile/SettingsTab";

interface ProfilePageClientProps {
    user: any;
}

export function ProfilePageClient({ user }: ProfilePageClientProps) {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <>
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {activeTab === "profile" && <ProfileTab user={user} />}
                {activeTab === "orders" && <OrdersTab userId={user.id} />}
                {activeTab === "settings" && <SettingsTab />}
            </div>
        </>
    );
}

