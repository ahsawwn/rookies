"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiMail, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        // TODO: Implement newsletter subscription API
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubscribed(true);
            toast.success('Successfully subscribed to our newsletter!');
            setEmail('');
        }, 1000);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                        <FiMail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        Stay in the Loop
                    </h2>
                    <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter and be the first to know about new flavors, 
                        special offers, and exclusive deals.
                    </p>

                    {!isSubscribed ? (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 rounded-full px-6 py-4 text-lg focus:ring-2 focus:ring-white"
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-white text-purple-600 hover:bg-purple-50 rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-4 text-white"
                        >
                            <FiCheck className="w-5 h-5" />
                            <span className="font-semibold">Thank you for subscribing!</span>
                        </motion.div>
                    )}

                    <p className="text-sm text-purple-200 mt-6">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

