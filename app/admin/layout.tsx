import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentAdmin } from "@/server/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    // Skip auth check for login page to prevent redirect loop
    if (pathname === "/admin/login" || pathname.includes("/admin/login")) {
        return <>{children}</>;
    }

    const { success, admin } = await getCurrentAdmin();

    if (!success || !admin) {
        redirect("/admin/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="lg:pl-64">
                <AdminHeader adminName={admin.name} adminEmail={admin.email} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

