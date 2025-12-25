import { getProducts } from "@/server/products";
import { ShopPageClient } from "@/components/shop/ShopPageClient";
import Navbar from "@/components/users/Navbar";

interface ShopPageProps {
    searchParams: {
        category?: string;
        search?: string;
        sortBy?: string;
    };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const category = searchParams.category || "all";
    const search = searchParams.search || "";
    const sortBy = (searchParams.sortBy as any) || "newest";

    const result = await getProducts({
        category: category !== "all" ? category : undefined,
        search: search || undefined,
        sortBy: sortBy as any,
    });

    const products = result.success ? result.products : [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Our Cookie
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                            Collection
                        </span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Discover our premium selection of freshly baked cookies, from classic favorites to
                        seasonal specials.
                    </p>
                </div>

                <ShopPageClient
                    initialProducts={products}
                    initialCategory={category}
                    initialSearch={search}
                    initialSort={sortBy}
                />
            </div>
        </div>
    );
}
