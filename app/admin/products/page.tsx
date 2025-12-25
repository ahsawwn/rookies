import { getProducts } from "@/server/products";
import { AdminProductsPageClient } from "./page-client";

export default async function AdminProductsPage() {
    const result = await getProducts({});
    const products = result.success ? result.products : [];

    return <AdminProductsPageClient initialProducts={products} />;
}

