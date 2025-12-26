"use client";

import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentQRCodeProps {
    paymentMethod: string;
    accountNumber?: string;
    qrCodeData?: string;
    amount: number;
}

export function PaymentQRCode({ paymentMethod, accountNumber, qrCodeData, amount }: PaymentQRCodeProps) {
    const [copied, setCopied] = useState(false);

    // Generate QR code data if not provided
    const qrData = qrCodeData || accountNumber || `payment-${paymentMethod}-${amount}`;

    const handleCopy = () => {
        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            toast.success("Account number copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const paymentMethodNames: Record<string, string> = {
        jazzcash: "JazzCash",
        easypaisa: "EasyPaisa",
        nayapay: "NayaPay",
        raast: "Raast",
        cash: "Cash on Delivery",
    };

    return (
        <Card className="border-2 border-purple-200">
            <CardHeader>
                <CardTitle className="text-lg">Scan to Pay</CardTitle>
                <CardDescription>
                    Pay via {paymentMethodNames[paymentMethod] || paymentMethod}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-purple-100">
                    <QRCodeSVG
                        value={qrData}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                {accountNumber && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Account Number</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={accountNumber}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <FiCheck className="w-4 h-4 text-green-600" />
                                ) : (
                                    <FiCopy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900">
                        Amount: Rs. {amount.toFixed(2)}
                    </p>
                </div>

                <p className="text-xs text-gray-600 text-center">
                    Scan the QR code with your {paymentMethodNames[paymentMethod] || paymentMethod} app to complete payment
                </p>
            </CardContent>
        </Card>
    );
}

