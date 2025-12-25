import { getProducts } from "@/server/products";
import { InventoryPageClient } from "./page-client";

export default async function InventoryPage() {
    const result = await getProducts({});
    const products = result.success ? result.products : [];

    return <InventoryPageClient initialProducts={products} />;
}

