// components/Testimonials.tsx
"use client";

import { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    comment: string;
    rating: number;
    avatar: string;
}

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Cookie Enthusiast",
            comment: "The pink sugar cookie is absolutely life-changing! I order every week without fail.",
            rating: 5,
            avatar: "SJ"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Food Blogger",
            comment: "Best cookies in town! The weekly rotations keep things exciting and delicious.",
            rating: 5,
            avatar: "MC"
        },
        {
            id: 3,
            name: "Jessica Williams",
            role: "Local Customer",
            comment: "Perfect for parties! Everyone loves the variety and quality of Crumbl cookies.",
            rating: 5,
            avatar: "JW"
        },
        {
            id: 4,
            name: "David Miller",
            role: "Regular Customer",
            comment: "The chilled sugar cookie is my absolute favorite. Can't get enough!",
            rating: 5,
            avatar: "DM"
        }
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What Our
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
              Customers Say
            </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Join thousands of satisfied cookie lovers
                    </p>
                </div>

                <div className="relative">
                    {/* Testimonial Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl max-w-4xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Avatar & Info */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {testimonials[currentIndex].avatar}
                  </span>
                                </div>

                                <div className="text-center mt-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {testimonials[currentIndex].name}
                                    </h3>
                                    <p className="text-gray-600">{testimonials[currentIndex].role}</p>

                                    <div className="flex items-center justify-center gap-1 mt-2">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <FiStar key={i} className="w-5 h-5 text-amber-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Text */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="text-6xl text-pink-200 mb-4">"</div>
                                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 italic mb-6">
                                    {testimonials[currentIndex].comment}
                                </p>
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <span className="text-gray-900 font-bold">250+</span>
                                    <span className="text-gray-500">cookies ordered</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
                        >
                            <FiChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>

                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex ? 'bg-pink-600 w-8' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
                        >
                            <FiChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 sm:mt-16">
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                        <div className="text-3xl sm:text-4xl font-bold text-pink-600 mb-2">4.9★</div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                        <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-2">50M+</div>
                        <div className="text-gray-600">Cookies Sold</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                        <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">200+</div>
                        <div className="text-gray-600">Locations</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                        <div className="text-3xl sm:text-4xl font-bold text-rose-600 mb-2">150+</div>
                        <div className="text-gray-600">Flavors</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;