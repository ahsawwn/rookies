import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/server/users";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/users/Navbar";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const { currentUser } = await getCurrentUser();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your account settings and view your order history
                    </p>
                </div>

                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-pink-100">
                    <CardContent className="p-6">
                        <ProfilePageClient user={currentUser} />
                    </CardContent>
                </Card>
            </div>
        </div>
        </div>
    );
}

