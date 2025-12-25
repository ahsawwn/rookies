import { getProducts } from "@/server/products";
import { POSPageClient } from "@/components/admin/POSPageClient";

export default async function POSPage() {
    const result = await getProducts({});
    const products = result.success ? result.products : [];

    return <POSPageClient initialProducts={products} />;
}
