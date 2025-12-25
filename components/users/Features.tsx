// components/Features.tsx
import { FiTruck, FiGift, FiHome, FiStar } from 'react-icons/fi';

const Features = () => {
    const features = [
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: "Free Delivery",
            description: "On orders over $25. Fast and reliable delivery to your doorstep.",
            color: "bg-pink-100 text-pink-600"
        },
        {
            icon: <FiGift className="w-8 h-8" />,
            title: "Gift Packages",
            description: "Perfect gifts for any occasion. Customizable cookie boxes available.",
            color: "bg-amber-100 text-amber-600"
        },
        {
            icon: <FiHome className="w-8 h-8" />,
            title: "Curbside Pickup",
            description: "Order online and pick up curbside. No contact required.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: <FiStar className="w-8 h-8" />,
            title: "Rewards Program",
            description: "Earn points with every purchase. Redeem for free cookies!",
            color: "bg-rose-100 text-rose-600"
        }
    ];

    return (
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
              Crumbl Cookies
            </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        We're committed to delivering the best cookie experience
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;