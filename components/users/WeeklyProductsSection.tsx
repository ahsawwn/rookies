"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getWeeklyProducts } from '@/server/weekly-products';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

export default function WeeklyProductsSection() {
    const [weeklyProducts, setWeeklyProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [weekRange, setWeekRange] = useState<{ start: Date; end: Date } | null>(null);

    useEffect(() => {
        getWeeklyProducts().then((result) => {
            if (result.success && result.products) {
                setWeeklyProducts(result.products);
                if (result.weekRange) {
                    setWeekRange(result.weekRange);
                }
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-purple-50/50 via-indigo-50/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (weeklyProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-b from-purple-50/50 via-indigo-50/30 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
                        <FiCalendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                            This Week's Special
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Weekly Selection
                        </span>
                    </h2>
                    {weekRange && (
                        <p className="text-lg text-gray-600 mb-2">
                            Available from {format(weekRange.start, 'MMM d')} to {format(weekRange.end, 'MMM d, yyyy')}
                        </p>
                    )}
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Limited-time flavors available exclusively this week
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {weeklyProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <Link href={`/shop/${product.slug}`}>
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200">
                                    {/* Product Image */}
                                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Weekly Badge */}
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                This Week
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {product.shortDescription || product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                                                    <span className="text-sm text-gray-400 line-through mr-2">
                                                        Rs. {parseFloat(product.originalPrice).toFixed(2)}
                                                    </span>
                                                )}
                                                <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                    Rs. {parseFloat(product.price).toFixed(2)}
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full"
                                            >
                                                <FiArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link href="/shop">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-6 rounded-full text-lg font-bold transition-all"
                        >
                            Explore Full Menu
                            <FiArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

