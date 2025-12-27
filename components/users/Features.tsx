// components/Features.tsx
"use client";

import { motion } from 'framer-motion';
import { FiTruck, FiGift, FiHome, FiStar } from 'react-icons/fi';

const Features = () => {
    const features = [
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: "Free Delivery",
            description: "On orders over Rs. 2000. Fast and reliable delivery to your doorstep.",
            gradient: "from-[#000096] to-[#00008B]"
        },
        {
            icon: <FiGift className="w-8 h-8" />,
            title: "Gift Packages",
            description: "Perfect gifts for any occasion. Customizable cookie boxes available.",
            gradient: "from-amber-500 to-orange-500"
        },
        {
            icon: <FiHome className="w-8 h-8" />,
            title: "Curbside Pickup",
            description: "Order online and pick up curbside. No contact required.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <FiStar className="w-8 h-8" />,
            title: "Rewards Program",
            description: "Earn points with every purchase. Redeem for free cookies!",
            gradient: "from-[#000096] to-[#00008B]"
        }
    ];

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-[#DFEFFF]/20 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DFEFFF] rounded-full mb-4">
                        <span className="text-sm font-semibold text-[#000096] uppercase tracking-wider">
                            Why Choose Us
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose
                        <span className="block text-[#000096]">
                            ROOKIES
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        We're committed to delivering the best cookie experience
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#CDD6DA] hover:border-[#000096] hover:shadow-2xl transition-all duration-500"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#000096] transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;