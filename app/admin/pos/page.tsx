import { getProducts } from "@/server/products";
import { POSPageClient } from "@/components/admin/POSPageClient";

export default async function POSPage() {
    try {
        const result = await getProducts({ includeInactive: true, limit: 1000 });
        const products = result.success ? result.products : [];
        
        console.log(`[POSPage] Loaded ${products.length} products`);
        if (!result.success) {
            console.error(`[POSPage] Error:`, result.error);
        }

        return <POSPageClient initialProducts={products} />;
    } catch (error) {
        console.error("[POSPage] Fatal error:", error);
        return <POSPageClient initialProducts={[]} />;
    }
}
