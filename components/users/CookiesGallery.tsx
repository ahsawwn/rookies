import { getProducts } from "@/server/products";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";

const CookiesGallery = async () => {
    const result = await getProducts({});
    const products = result.success ? result.products : [];

    const categories = [
        { id: 'all', name: 'All Cookies' },
        { id: 'classic', name: 'Classic' },
        { id: 'featured', name: 'Featured' },
        { id: 'seasonal', name: 'Seasonal' },
    ];

    const categoryCounts = {
        all: products.length,
        classic: products.filter((p: any) => p.category === 'classic').length,
        featured: products.filter((p: any) => p.category === 'featured').length,
        seasonal: products.filter((p: any) => p.category === 'seasonal').length,
    };

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <span className="inline-block bg-pink-50 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        🍪 COOKIE COLLECTION
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Explore Our
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                            Cookie Gallery
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        From classic favorites to weekly specials, discover our delicious cookie selection
                    </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.slice(0, 8).map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No products available at the moment.</p>
                    </div>
                )}

                {/* View More Button */}
                {products.length > 0 && (
                    <div className="text-center mt-10 sm:mt-14">
                        <Link
                            href="/shop"
                            className="group bg-white text-gray-800 border-2 border-gray-200 hover:border-pink-300 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3"
                        >
                            <span>View All Products</span>
                            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CookiesGallery;
