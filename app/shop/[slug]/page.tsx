import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/server/products";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { ProductActionsWithDetails } from "@/components/shop/ProductActionsWithDetails";
import { ProductCard } from "@/components/shop/ProductCard";
import Navbar from "@/components/users/Navbar";
import { Badge } from "@/components/ui/badge";
import { FiPackage, FiCalendar, FiStar } from "react-icons/fi";

interface ProductDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const result = await getProductBySlug(slug);

    if (!result.success || !result.product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: result.product.name,
        description: result.product.shortDescription || result.product.description,
    };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const result = await getProductBySlug(slug);

    if (!result.success || !result.product) {
        notFound();
    }

    const product = result.product;

    // Get related products (same category, excluding current product)
    const relatedResult = await getProducts({
        category: product.category,
    });

    const relatedProducts = relatedResult.success
        ? relatedResult.products.filter((p) => p.id !== product.id).slice(0, 4)
        : [];

    const categoryColors: Record<string, string> = {
        classic: "bg-blue-100 text-blue-700 border-blue-200",
        featured: "bg-pink-100 text-pink-700 border-pink-200",
        seasonal: "bg-orange-100 text-orange-700 border-orange-200",
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-600">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <a href="/" className="hover:text-pink-600">
                                Home
                            </a>
                        </li>
                        <li>/</li>
                        <li>
                            <a href="/shop" className="hover:text-pink-600">
                                Shop
                            </a>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Image Gallery */}
                    <div>
                        <ProductImageGallery
                            mainImage={product.image}
                            images={product.images}
                            productName={product.name}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <Badge
                            className={
                                categoryColors[product.category] ||
                                "bg-gray-100 text-gray-700 border-gray-200"
                            }
                        >
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </Badge>

                        {/* Product Name */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        {/* Short Description */}
                        {product.shortDescription && (
                            <p className="text-xl text-gray-600">{product.shortDescription}</p>
                        )}

                        {/* Full Description */}
                        {product.description && (
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Product Specifications */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            {product.calories && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <FiPackage className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Calories</p>
                                        <p className="font-semibold text-gray-900">{product.calories} cal</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <FiStar className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="font-semibold text-gray-900 capitalize">
                                        {product.category}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Actions */}
                        <ProductActionsWithDetails
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                stock: product.stock || 0,
                                image: product.image,
                                slug: product.slug,
                            }}
                        />
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

