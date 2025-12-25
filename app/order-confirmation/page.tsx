import { redirect } from "next/navigation";
import Navbar from "@/components/users/Navbar";
import Footer from "@/components/users/Footer";
import { FiCheckCircle, FiTruck, FiMapPin, FiPackage } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getOrderByNumber } from "@/server/orders";

interface OrderConfirmationPageProps {
    searchParams: Promise<{
        orderNumber?: string;
    }>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
    const params = await searchParams;
    const orderNumber = params.orderNumber;

    if (!orderNumber) {
        redirect("/");
    }

    // Fetch order details
    const orderResult = await getOrderByNumber(orderNumber);

    if (!orderResult.success || !orderResult.order) {
        redirect("/");
    }

    const order = orderResult.order;
    const totalAmount = parseFloat(order.totalAmount);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <FiCheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                    <p className="text-lg text-gray-600 mb-2">
                        Thank you for your order. Your order number is:
                    </p>
                    <p className="text-2xl font-bold text-pink-600 mb-8">{orderNumber}</p>
                </div>

                {/* Order Details */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                {item.product?.image && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.product?.name || "Product"}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                        Rs. {(parseFloat(item.priceAtTime) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>Rs. {totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>Rs. {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery/Pickup Information */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        {order.deliveryType === "pickup" ? (
                            <>
                                <FiMapPin className="w-5 h-5 text-pink-600" />
                                Pickup Information
                            </>
                        ) : (
                            <>
                                <FiTruck className="w-5 h-5 text-pink-600" />
                                Delivery Information
                            </>
                        )}
                    </h2>
                    
                    {order.deliveryType === "pickup" ? (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Pickup Name</p>
                                <p className="font-semibold text-gray-900">{order.pickupName || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pickup Phone</p>
                                <p className="font-semibold text-gray-900">{order.pickupPhone || "N/A"}</p>
                            </div>
                            {order.pickupVerificationCode && (
                                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                                    <p className="text-sm text-pink-700 font-semibold mb-1">Verification Code</p>
                                    <p className="text-2xl font-bold text-pink-600">{order.pickupVerificationCode}</p>
                                    <p className="text-xs text-pink-600 mt-2">
                                        Please bring this code and a valid ID when picking up your order.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {order.deliveryAddress && typeof order.deliveryAddress === 'object' && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Delivery Address</p>
                                    <p className="font-semibold text-gray-900">
                                        {order.deliveryAddress.street || ""}
                                        {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                                        {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
                                        {order.deliveryAddress.zipCode && ` ${order.deliveryAddress.zipCode}`}
                                    </p>
                                    {order.deliveryAddress.phone && (
                                        <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment Information */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiPackage className="w-5 h-5 text-pink-600" />
                        Payment Information
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-semibold text-gray-900 capitalize">{order.paymentMethod || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status</span>
                            <span className={`font-semibold capitalize ${
                                order.paymentStatus === "completed" ? "text-green-600" : 
                                order.paymentStatus === "pending" ? "text-yellow-600" : 
                                "text-red-600"
                            }`}>
                                {order.paymentStatus || "Pending"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order Status</span>
                            <span className={`font-semibold capitalize ${
                                order.status === "completed" ? "text-green-600" : 
                                order.status === "processing" ? "text-blue-600" : 
                                "text-yellow-600"
                            }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> We've sent a confirmation email with your order details. 
                        You can track your order status in your profile.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/profile?tab=orders">
                        <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
                            View Orders
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="outline">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
