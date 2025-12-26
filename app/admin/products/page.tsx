import { getProducts } from "@/server/products";
import { AdminProductsPageClient } from "./page-client";

export default async function AdminProductsPage() {
    try {
        const result = await getProducts({ includeInactive: true, limit: 1000 });
        const products = result.success ? result.products : [];
        
        console.log(`[AdminProductsPage] Loaded ${products.length} products`);
        if (!result.success) {
            console.error(`[AdminProductsPage] Error:`, result.error);
        }

        return <AdminProductsPageClient initialProducts={products} />;
    } catch (error) {
        console.error("[AdminProductsPage] Fatal error:", error);
        return <AdminProductsPageClient initialProducts={[]} />;
    }
}

