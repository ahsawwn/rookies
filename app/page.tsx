// app/page.tsx
import Navbar from '@/components/users/Navbar';
import HeroSection from '@/components/users/HeroSection';
import WeeklyMenu from '@/components/users/WeeklyMenu';
import Footer from '@/components/users/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <HeroSection />
            <WeeklyMenu />
            <Footer />
        </div>
    );
}
