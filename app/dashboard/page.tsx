import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/server/users";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // If not logged in, redirect to login
    if (!session?.user) {
        redirect("/login?redirect=/dashboard");
    }

    // Check if user is an admin
    const adminCheck = await isUserAdmin(session.user.id);
    
    if (adminCheck.success && adminCheck.isAdmin) {
        // Redirect admin users to admin dashboard
        redirect("/admin");
    }

    // Regular users - show user dashboard (or redirect to profile)
    redirect("/profile");
}

