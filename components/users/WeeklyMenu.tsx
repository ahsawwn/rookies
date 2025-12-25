import { getProducts } from "@/server/products";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WeeklyMenu() {
    // Get all active products (this week's menu)
    const result = await getProducts({});
    const products = result.success ? result.products : [];

    return (
        <section className="bg-white py-12 sm:py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Crumbl Style */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 uppercase tracking-wider">This week's</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6">
                        National Flavors
                    </h1>
                </div>

                {/* Products Grid - Crumbl Style */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                        {products.map((product: any) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl overflow-hidden"
                            >
                                {/* Product Image - Large and Prominent */}
                                <Link href={`/shop/${product.slug}`}>
                                    <div className="relative w-full aspect-square overflow-hidden bg-gray-50 mb-4">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                    </div>
                                </Link>

                                {/* Product Info */}
                                <div className="px-2 sm:px-4 pb-4 sm:pb-6">
                                    <Link href={`/shop/${product.slug}`}>
                                        <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3 group-hover:text-[#FF6B9D] transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed min-h-[3rem] line-clamp-2">
                                        {product.shortDescription || product.description}
                                    </p>

                                    {/* Buttons - Crumbl Style */}
                                    <div className="flex flex-col gap-3">
                                        <Link href={`/shop/${product.slug}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full border-2 border-[#FF6B9D] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white"
                                            >
                                                Learn More
                                            </Button>
                                        </Link>
                                        <Link href="/shop">
                                            <Button
                                                className="w-full bg-[#FF6B9D] hover:bg-[#FF4A7A] text-white"
                                            >
                                                Order Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No products available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
