// app/page.tsx
import Navbar from '@/components/users/Navbar';
import HeroSection from '@/components/users/HeroSection';
import FeaturedProductsSection from '@/components/users/FeaturedProductsSection';
import WeeklyProductsSection from '@/components/users/WeeklyProductsSection';
import AboutSection from '@/components/users/AboutSection';
import Testimonials from '@/components/users/Testimonials';
import NewsletterSection from '@/components/users/NewsletterSection';
import Features from '@/components/users/Features';
import Footer from '@/components/users/Footer';
import { HomeRedirectHandler } from '@/components/users/HomeRedirectHandler';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <HomeRedirectHandler />
            <Navbar />
            <HeroSection />
            <FeaturedProductsSection />
            <WeeklyProductsSection />
            <AboutSection />
            <Features />
            <Testimonials />
            <NewsletterSection />
            <Footer />
        </div>
    );
}
