import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/admin";
import { getAllWeeklyProducts } from "@/server/weekly-products";
import { getProducts } from "@/server/products";
import WeeklyProductsPageClient from "@/components/admin/WeeklyProductsPageClient";

export default async function WeeklyProductsPage() {
    const { success, admin } = await getCurrentAdmin();

    if (!success || !admin) {
        redirect("/admin/login");
    }

    const weeklyProductsResult = await getAllWeeklyProducts();
    const productsResult = await getProducts({ limit: 1000 });

    return (
        <WeeklyProductsPageClient
            initialWeeklyProducts={weeklyProductsResult.success ? weeklyProductsResult.weeklyProducts : []}
            initialProducts={productsResult.success ? productsResult.products : []}
        />
    );
}

