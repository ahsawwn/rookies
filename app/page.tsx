// app/page.tsx
import Navbar from '@/components/users/Navbar';
import HeroSection from '@/components/users/HeroSection';
import AboutSection from '@/components/users/AboutSection';
import WeeklyProductsSection from '@/components/users/WeeklyProductsSection';
import ServicesSection from '@/components/users/ServicesSection';
import Testimonials from '@/components/users/Testimonials';
import OrderingProcessSection from '@/components/users/OrderingProcessSection';
import NewsletterSection from '@/components/users/NewsletterSection';
import Footer from '@/components/users/Footer';
import { HomeRedirectHandler } from '@/components/users/HomeRedirectHandler';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <HomeRedirectHandler />
            <Navbar />
            <HeroSection />
            <AboutSection />
            <WeeklyProductsSection />
            <ServicesSection />
            <Testimonials />
            <OrderingProcessSection />
            <NewsletterSection />
            <Footer />
        </div>
    );
}
