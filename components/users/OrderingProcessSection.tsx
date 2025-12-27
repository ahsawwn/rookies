"use client";

import { motion } from 'framer-motion';
import { FiShoppingBag, FiMessageCircle, FiCreditCard, FiTruck } from 'react-icons/fi';

export default function OrderingProcessSection() {
    const steps = [
        {
            icon: <FiShoppingBag className="w-8 h-8" />,
            title: "Browse Menu",
            description: "Explore our weekly selection and full menu of fresh-baked treats",
            number: "1"
        },
        {
            icon: <FiMessageCircle className="w-8 h-8" />,
            title: "Message to Order",
            description: "Add items to cart and send your order inquiry via WhatsApp or Instagram",
            number: "2"
        },
        {
            icon: <FiCreditCard className="w-8 h-8" />,
            title: "Pay via Easypaisa",
            description: "Complete payment through Easypaisa for a seamless checkout experience",
            number: "3"
        },
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: "Pickup/Delivery",
            description: "Collect your order or have it delivered fresh to your doorstep",
            number: "4"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white via-[#DFEFFF]/30 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DFEFFF] rounded-full mb-4">
                        <span className="text-sm font-semibold text-[#000096] uppercase tracking-wider">
                            How It Works
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                        <span className="text-[#000096]">
                            Ordering is Simple
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Follow these easy steps to get your favorite baked goods
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="w-10 h-10 bg-[#000096] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                    {step.number}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border-2 border-[#CDD6DA] hover:border-[#000096] hover:shadow-xl transition-all duration-300 pt-12">
                                <div className="w-16 h-16 bg-[#DFEFFF] rounded-2xl flex items-center justify-center mb-6 text-[#000096] mx-auto">
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                    {step.title}
                                </h3>

                                <p className="text-gray-600 text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connector Line (hidden on last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#CDD6DA] transform -translate-y-1/2 z-0">
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-[#CDD6DA] border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

