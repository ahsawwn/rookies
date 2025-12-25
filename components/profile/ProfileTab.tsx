"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FiMail, FiPhone, FiUser, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface ProfileTabProps {
    user: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        emailVerified: boolean;
        phoneVerified: boolean;
        image: string | null;
        createdAt: Date;
    };
}

export function ProfileTab({ user }: ProfileTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border-4 border-pink-200"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-pink-200">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-600 mt-1">Account Information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <FiUser className="w-5 h-5 text-pink-600" />
                            <h3 className="font-semibold text-gray-900">Full Name</h3>
                        </div>
                        <p className="text-gray-700">{user.name}</p>
                    </CardContent>
                </Card>

                {user.email && (
                    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <FiMail className="w-5 h-5 text-pink-600" />
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                </div>
                                {user.emailVerified ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <FiCheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                        <FiXCircle className="w-3 h-3 mr-1" />
                                        Not Verified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-gray-700">{user.email}</p>
                        </CardContent>
                    </Card>
                )}

                {user.phone && (
                    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <FiPhone className="w-5 h-5 text-pink-600" />
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                </div>
                                {user.phoneVerified ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <FiCheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                        <FiXCircle className="w-3 h-3 mr-1" />
                                        Not Verified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-gray-700">{user.phone}</p>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <FiCalendar className="w-5 h-5 text-pink-600" />
                            <h3 className="font-semibold text-gray-900">Member Since</h3>
                        </div>
                        <p className="text-gray-700">
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

