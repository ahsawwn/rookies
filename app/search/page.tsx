import { searchProducts, getProducts } from "@/server/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import Navbar from "@/components/users/Navbar";
import Footer from "@/components/users/Footer";

interface SearchPageProps {
    searchParams: {
        q?: string;
        category?: string;
        sortBy?: string;
        minPrice?: string;
        maxPrice?: string;
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || "";
    const category = searchParams.category || "all";
    const sortBy = (searchParams.sortBy as any) || "newest";
    const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
    const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

    let products: any[] = [];

    if (query) {
        const searchResult = await searchProducts(query);
        if (searchResult.success) {
            products = searchResult.products;
        }
    } else {
        const allProductsResult = await getProducts({
            category: category !== "all" ? category : undefined,
            sortBy,
        });
        if (allProductsResult.success) {
            products = allProductsResult.products;
        }
    }

    // Apply price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        products = products.filter((product) => {
            const price = parseFloat(product.price);
            if (minPrice !== undefined && price < minPrice) return false;
            if (maxPrice !== undefined && price > maxPrice) return false;
            return true;
        });
    }

    // Apply sorting
    if (sortBy) {
        switch (sortBy) {
            case "price-asc":
                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "price-desc":
                products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case "name-asc":
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                products.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "newest":
            default:
                products.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {query ? `Search Results for "${query}"` : "All Products"}
                    </h1>
                    <p className="text-gray-600">
                        {products.length} {products.length === 1 ? "product" : "products"} found
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <ShopFilters
                            initialCategory={category}
                            initialSortBy={sortBy}
                            initialSearch={query}
                        />
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg mb-4">
                                    {query
                                        ? `No products found for "${query}"`
                                        : "No products found"}
                                </p>
                                <p className="text-gray-400">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

