"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiAward, FiHeart, FiCoffee } from 'react-icons/fi';

export default function AboutSection() {
    const features = [
        {
            icon: <FiAward className="w-8 h-8" />,
            title: "Premium Quality",
            description: "Only the finest ingredients make it into our kitchen",
        },
        {
            icon: <FiHeart className="w-8 h-8" />,
            title: "Made with Love",
            description: "Every item is crafted with passion and care",
        },
        {
            icon: <FiCoffee className="w-8 h-8" />,
            title: "Fresh Daily",
            description: "Baked fresh every morning for the perfect taste",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-9xl opacity-20">🍪</div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4">
                            <span className="text-sm font-semibold text-purple-700 uppercase tracking-wider">
                                Our Story
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
                            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Crafting Excellence
                            </span>
                            <br />
                            <span className="text-gray-900">Since Day One</span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            At ROOKIES, we believe that every bite should be an experience. Our journey began with a simple mission: 
                            to create the most delicious, fresh-baked treats using only premium ingredients. Every cookie, cake, and 
                            pastry is handcrafted with meticulous attention to detail.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We source the finest ingredients from trusted suppliers and bake everything fresh daily. Our commitment 
                            to quality and flavor has made us a favorite among cookie lovers everywhere.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-4 text-purple-600">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

