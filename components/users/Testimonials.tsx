// components/Testimonials.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getTestimonials } from '@/server/testimonials';

interface Testimonial {
    id: string;
    name: string;
    role?: string | null;
    comment: string;
    rating: number;
    avatar?: string | null;
}

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000); // 5 second timeout

        getTestimonials(true).then((result) => {
            clearTimeout(timeout);
            if (result.success && result.testimonials) {
                setTestimonials(result.testimonials as Testimonial[]);
            }
            setLoading(false);
        }).catch(() => {
            clearTimeout(timeout);
            setLoading(false);
        });
    }, []);

    // Fallback testimonials if none in database
    const fallbackTestimonials: Testimonial[] = [
        {
            id: "1",
            name: "Sarah Johnson",
            role: "Cookie Enthusiast",
            comment: "The pink sugar cookie is absolutely life-changing! I order every week without fail.",
            rating: 5,
            avatar: "SJ"
        },
        {
            id: "2",
            name: "Michael Chen",
            role: "Food Blogger",
            comment: "Best cookies in town! The weekly rotations keep things exciting and delicious.",
            rating: 5,
            avatar: "MC"
        },
        {
            id: "3",
            name: "Jessica Williams",
            role: "Local Customer",
            comment: "Perfect for parties! Everyone loves the variety and quality of ROOKIES cookies.",
            rating: 5,
            avatar: "JW"
        },
        {
            id: "4",
            name: "David Miller",
            role: "Regular Customer",
            comment: "The chilled sugar cookie is my absolute favorite. Can't get enough!",
            rating: 5,
            avatar: "DM"
        }
    ];

    const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
    };

    if (loading) {
        return (
            <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-12 animate-pulse"></div>
                </div>
            </section>
        );
    }

    if (displayTestimonials.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-[#DFEFFF]/30 to-white">
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
                            Sweet Words
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Love from
                        <span className="block text-[#000096]">
                            Islamabad
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        What our customers are saying
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Testimonial Card */}
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl max-w-4xl mx-auto border-2 border-[#CDD6DA]"
                    >
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Avatar & Info */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#000096] rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl sm:text-3xl font-bold">
                                        {displayTestimonials[currentIndex].avatar || displayTestimonials[currentIndex].name.charAt(0)}
                                    </span>
                                </div>

                                <div className="text-center mt-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {displayTestimonials[currentIndex].name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {displayTestimonials[currentIndex].role || "F-10, Islamabad"}
                                    </p>

                                    <div className="flex items-center justify-center gap-1 mt-2">
                                        {[...Array(displayTestimonials[currentIndex].rating || 5)].map((_, i) => (
                                            <FiStar key={i} className="w-5 h-5 text-amber-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Text */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="text-6xl text-[#DFEFFF] mb-4">"</div>
                                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 italic mb-6">
                                    {displayTestimonials[currentIndex].comment}
                                </p>
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <span className="text-gray-900 font-bold">250+</span>
                                    <span className="text-gray-500">cookies ordered</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevTestimonial}
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border-2 border-[#CDD6DA]"
                        >
                            <FiChevronLeft className="w-6 h-6 text-gray-700" />
                        </motion.button>

                        <div className="flex gap-2">
                            {displayTestimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex ? 'bg-[#000096] w-8' : 'bg-gray-300 w-3'
                                    }`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextTestimonial}
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border-2 border-[#CDD6DA]"
                        >
                            <FiChevronRight className="w-6 h-6 text-gray-700" />
                        </motion.button>
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 sm:mt-16"
                >
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border-2 border-[#CDD6DA]">
                        <div className="text-3xl sm:text-4xl font-bold text-[#000096] mb-2">4.9★</div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border-2 border-[#CDD6DA]">
                        <div className="text-3xl sm:text-4xl font-bold text-[#FF0000] mb-2">50M+</div>
                        <div className="text-gray-600">Cookies Sold</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border-2 border-[#CDD6DA]">
                        <div className="text-3xl sm:text-4xl font-bold text-[#000096] mb-2">200+</div>
                        <div className="text-gray-600">Locations</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border-2 border-[#CDD6DA]">
                        <div className="text-3xl sm:text-4xl font-bold text-[#000096] mb-2">150+</div>
                        <div className="text-gray-600">Flavors</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;