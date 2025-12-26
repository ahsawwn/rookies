"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { FiPrinter, FiShare2, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ReceiptItem {
    product: {
        name: string;
        price: string;
    };
    quantity: number;
}

interface ReceiptPrinterProps {
    items: ReceiptItem[];
    subtotal: number;
    discount: number;
    discountAmount: number;
    tax: number;
    total: number;
    paymentMethod: string;
    saleNumber?: string;
    autoDownload?: boolean;
}

export function ReceiptPrinter({
    items,
    subtotal,
    discount,
    discountAmount,
    tax,
    total,
    paymentMethod,
    saleNumber,
    autoDownload = false,
}: ReceiptPrinterProps) {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
    const [lastSaleNumber, setLastSaleNumber] = useState<string | undefined>(undefined);

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt-${saleNumber || Date.now()}`,
    });

    const generateAndDownloadPDF = useCallback(async () => {
        if (!receiptRef.current || isGenerating) {
            return;
        }
        
        setIsGenerating(true);
        try {
            // Temporarily show the receipt content for rendering
            const receiptElement = receiptRef.current.parentElement as HTMLElement;
            const originalDisplay = receiptElement?.style.display;
            const originalPosition = receiptElement?.style.position;
            const originalLeft = receiptElement?.style.left;
            
            if (receiptElement) {
                receiptElement.style.display = 'block';
                receiptElement.style.position = 'absolute';
                receiptElement.style.left = '-9999px';
                receiptElement.style.top = '0';
            }

            // Wait a bit for styles to apply
            await new Promise(resolve => setTimeout(resolve, 100));

            // Use jsPDF to generate PDF directly - avoids CSS parsing issues
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 200] // Receipt size (80mm width, auto height)
            });

            // Set font
            pdf.setFont('helvetica');

            // Header
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.text('ROOKIES', 40, 15, { align: 'center' });
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Freshly Baked Happiness', 40, 20, { align: 'center' });
            
            pdf.setFontSize(8);
            pdf.text(format(new Date(), "MMM d, yyyy h:mm a"), 40, 25, { align: 'center' });
            
            if (saleNumber) {
                pdf.text(`Sale #: ${saleNumber}`, 40, 28, { align: 'center' });
            }

            // Line separator
            pdf.setLineWidth(0.5);
            pdf.line(5, 32, 75, 32);

            // Items
            let yPos = 38;
            pdf.setFontSize(9);
            items.forEach((item) => {
                const itemName = item.product.name;
                const itemPrice = parseFloat(item.product.price);
                const quantity = item.quantity;
                const lineTotal = itemPrice * quantity;

                // Item name (truncate if too long)
                pdf.setFont('helvetica', 'bold');
                pdf.text(itemName.substring(0, 30), 5, yPos);
                
                // Quantity and price
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                pdf.text(`${quantity} x Rs. ${itemPrice.toFixed(2)}`, 5, yPos + 4);
                
                // Line total
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Rs. ${lineTotal.toFixed(2)}`, 70, yPos + 2, { align: 'right' });
                
                yPos += 10;
            });

            // Line separator
            pdf.line(5, yPos, 75, yPos);
            yPos += 5;

            // Totals
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            
            // Subtotal
            pdf.text('Subtotal', 5, yPos);
            pdf.text(`Rs. ${subtotal.toFixed(2)}`, 70, yPos, { align: 'right' });
            yPos += 5;

            // Discount
            if (discount > 0) {
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(22, 163, 74); // Green
                pdf.text(`Discount (${discount}%)`, 5, yPos);
                pdf.text(`-Rs. ${discountAmount.toFixed(2)}`, 70, yPos, { align: 'right' });
                pdf.setTextColor(0, 0, 0); // Reset to black
                yPos += 5;
            }

            // Tax
            pdf.setFont('helvetica', 'normal');
            pdf.text('Tax', 5, yPos);
            pdf.text(`Rs. ${tax.toFixed(2)}`, 70, yPos, { align: 'right' });
            yPos += 5;

            // Total
            pdf.line(5, yPos, 75, yPos);
            yPos += 5;
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Total', 5, yPos);
            pdf.text(`Rs. ${total.toFixed(2)}`, 70, yPos, { align: 'right' });
            yPos += 8;

            // Payment Method
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Payment Method', 40, yPos, { align: 'center' });
            yPos += 4;
            pdf.setFont('helvetica', 'bold');
            pdf.text(paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1), 40, yPos, { align: 'center' });
            yPos += 8;

            // Footer
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Thank you for your purchase!', 40, yPos, { align: 'center' });
            yPos += 4;
            pdf.text('Visit us again soon', 40, yPos, { align: 'center' });

            // Hide receipt element again
            if (receiptElement) {
                receiptElement.style.display = originalDisplay || 'none';
                receiptElement.style.position = originalPosition || '';
                receiptElement.style.left = originalLeft || '';
            }

            // Download PDF
            const filename = `receipt-${saleNumber || Date.now()}.pdf`;
            pdf.save(filename);
            
            toast.success("Receipt downloaded successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate receipt");
        } finally {
            setIsGenerating(false);
        }
    }, [saleNumber, isGenerating]);

    // Reset hasAutoDownloaded when saleNumber changes
    useEffect(() => {
        if (saleNumber !== lastSaleNumber) {
            setHasAutoDownloaded(false);
            setLastSaleNumber(saleNumber);
        }
    }, [saleNumber, lastSaleNumber]);

    // Auto-download when saleNumber is set and autoDownload is true
    useEffect(() => {
        if (autoDownload && saleNumber && !hasAutoDownloaded && receiptRef.current) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                generateAndDownloadPDF();
                setHasAutoDownloaded(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [saleNumber, autoDownload, hasAutoDownloaded, generateAndDownloadPDF]);

    const handleWhatsAppShare = async () => {
        if (!receiptRef.current) return;
        
        setIsGenerating(true);
        try {
            const receiptElement = receiptRef.current.parentElement as HTMLElement;
            const originalDisplay = receiptElement?.style.display;
            const originalPosition = receiptElement?.style.position;
            const originalLeft = receiptElement?.style.left;
            
            if (receiptElement) {
                receiptElement.style.display = 'block';
                receiptElement.style.position = 'absolute';
                receiptElement.style.left = '-9999px';
                receiptElement.style.top = '0';
            }

            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(receiptRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
            });

            if (receiptElement) {
                receiptElement.style.display = originalDisplay || 'none';
                receiptElement.style.position = originalPosition || '';
                receiptElement.style.left = originalLeft || '';
                receiptElement.style.top = '';
            }

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const whatsappUrl = `https://wa.me/?text=Receipt%20from%20ROOKES%20Bakery%20-%20Sale%20${saleNumber || ''}`;
                    window.open(whatsappUrl, '_blank');
                    // Note: WhatsApp web doesn't support media parameter in URL, so we'll just open with text
                    toast.success("Opening WhatsApp...");
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                }
            });
        } catch (error) {
            console.error("Error generating image:", error);
            toast.error("Failed to generate image");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <div className="flex gap-2">
                <Button
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    <FiPrinter className="w-4 h-4 mr-2" />
                    Print
                </Button>
                <Button
                    onClick={generateAndDownloadPDF}
                    disabled={isGenerating}
                    variant="outline"
                >
                    <FiDownload className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Download PDF"}
                </Button>
                <Button
                    onClick={handleWhatsAppShare}
                    disabled={isGenerating}
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                >
                    <FiShare2 className="w-4 h-4 mr-2" />
                    WhatsApp
                </Button>
            </div>

            <div style={{ display: "none" }}>
                <div ref={receiptRef} className="p-8 max-w-sm mx-auto bg-white">
                    {/* Receipt Header */}
                    <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
                        <h1 className="text-2xl font-black mb-2">ROOKIES</h1>
                        <p className="text-sm text-gray-600">Freshly Baked Happiness</p>
                        <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(), "MMM d, yyyy h:mm a")}
                        </p>
                        {saleNumber && (
                            <p className="text-xs text-gray-500 mt-1">Sale #: {saleNumber}</p>
                        )}
                    </div>

                    {/* Items */}
                    <div className="mb-4 space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-gray-600">
                                        {item.quantity} x Rs. {parseFloat(item.product.price).toFixed(2)}
                                    </p>
                                </div>
                                <p className="font-semibold">
                                    Rs. {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t-2 border-gray-300 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({discount}%)</span>
                                <span>-Rs. {discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>Rs. {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-2">
                            <span>Total</span>
                            <span>Rs. {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-6 pt-4 border-t-2 border-gray-300 text-center">
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold capitalize">{paymentMethod}</p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>Thank you for your purchase!</p>
                        <p className="mt-2">Visit us again soon</p>
                    </div>
                </div>
            </div>
        </>
    );
}

