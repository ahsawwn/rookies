"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiCalendar, FiGift, FiBox } from 'react-icons/fi';

export default function ServicesSection() {
    const services = [
        {
            icon: <FiCalendar className="w-8 h-8" />,
            title: "Catering & Events",
            description: "Perfect for birthdays, corporate meetings, and weddings. Custom packages tailored to your event needs.",
            link: "/catering",
            gradient: "from-[#000096] to-[#00008B]"
        },
        {
            icon: <FiGift className="w-8 h-8" />,
            title: "Corporate Gifting",
            description: "Curated gift boxes with options for branding. Impress clients and employees with premium baked goods.",
            link: "/catering?type=corporate",
            gradient: "from-[#000096] to-[#00008B]"
        },
        {
            icon: <FiBox className="w-8 h-8" />,
            title: "Subscription Box",
            description: "Weekly or monthly surprise bake box. Get fresh treats delivered regularly to your doorstep.",
            link: "/catering?type=subscription",
            gradient: "from-[#000096] to-[#00008B]"
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
                            Services Beyond the Box
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                        <span className="text-[#000096]">
                            Services Beyond the Box
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Elevate your events and celebrations with our premium catering and gifting services
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-white rounded-2xl p-8 border-2 border-[#CDD6DA] hover:border-[#000096] hover:shadow-2xl transition-all duration-500"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg`}>
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#000096] transition-colors">
                                {service.title}
                            </h3>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {service.description}
                            </p>

                            <Link href={service.link}>
                                <Button
                                    size="lg"
                                    className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-full font-bold"
                                >
                                    Get a Custom Quote
                                    <FiArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

