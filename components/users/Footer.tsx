import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#FF6B9D] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold text-black">ROOKIES</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Fresh baked goods from Pakistan. Home-based bakery delivering quality treats.
                        </p>
                        <div className="flex items-center space-x-4 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 hover:bg-[#FF6B9D] rounded-full flex items-center justify-center transition-colors"
                            >
                                <FiFacebook className="w-5 h-5 text-gray-700 hover:text-white" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 hover:bg-[#FF6B9D] rounded-full flex items-center justify-center transition-colors"
                            >
                                <FiTwitter className="w-5 h-5 text-gray-700 hover:text-white" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-100 hover:bg-[#FF6B9D] rounded-full flex items-center justify-center transition-colors"
                            >
                                <FiInstagram className="w-5 h-5 text-gray-700 hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-black">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/shop" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Order
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="/rewards" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Rewards
                                </Link>
                            </li>
                            <li>
                                <Link href="/nutrition" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Nutrition & Allergy
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Get Involved */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-black">Get Involved</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/press" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Press
                                </Link>
                            </li>
                            <li>
                                <Link href="/collaborate" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Collaborate
                                </Link>
                            </li>
                            <li>
                                <Link href="/franchising" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Franchising
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-black">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">
                                    Pakistan<br />
                                    Home-based Bakery
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <a href="tel:+923001234567" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    +92 300 1234567
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <a href="mailto:info@rookies.com" className="text-gray-600 hover:text-black transition-colors text-sm">
                                    info@rookies.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm text-center md:text-left">
                            © {2024} Rookies. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/privacy" className="text-gray-600 hover:text-black transition-colors">
                                Privacy policy
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link href="/terms" className="text-gray-600 hover:text-black transition-colors">
                                Terms and Conditions
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link href="/gift-cards" className="text-gray-600 hover:text-black transition-colors">
                                Gift Card Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
