import Navbar from '@/components/users/Navbar';
import Footer from '@/components/users/Footer';
import Link from 'next/link';

export default function MenuPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
                <p className="text-center text-gray-600 mb-12">
                    Explore our delicious selection of baked goods
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Link href="/shop?category=breads" className="block">
                        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition">
                            <h2 className="text-2xl font-semibold mb-2">Breads</h2>
                            <p>Freshly baked breads and pastries</p>
                        </div>
                    </Link>
                    <Link href="/shop?category=cakes" className="block">
                        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition">
                            <h2 className="text-2xl font-semibold mb-2">Cakes</h2>
                            <p>Delicious cakes for every occasion</p>
                        </div>
                    </Link>
                    <Link href="/shop?category=cookies" className="block">
                        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition">
                            <h2 className="text-2xl font-semibold mb-2">Cookies</h2>
                            <p>Crunchy and chewy cookies</p>
                        </div>
                    </Link>
                    <Link href="/shop?category=cupcakes" className="block">
                        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition">
                            <h2 className="text-2xl font-semibold mb-2">Cupcakes</h2>
                            <p>Sweet and fluffy cupcakes</p>
                        </div>
                    </Link>
                    <Link href="/shop?category=croissants" className="block">
                        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition">
                            <h2 className="text-2xl font-semibold mb-2">Croissants</h2>
                            <p>Buttery and flaky croissants</p>
                        </div>
                    </Link>
                    <Link href="/shop?category=shakes" className="block">
                        <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition">
                            <h2 className="text-2xl font-semibold mb-2">Shakes</h2>
                            <p>Creamy milkshakes</p>
                        </div>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}