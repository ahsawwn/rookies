"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import Image from "next/image";
import { toast } from "sonner";

interface PaymentScreenshotUploadProps {
    onUpload: (file: File) => void;
    uploadedImage?: string | null;
    onRemove: () => void;
}

export function PaymentScreenshotUpload({
    onUpload,
    uploadedImage,
    onRemove,
}: PaymentScreenshotUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        try {
            onUpload(file);
            toast.success("Screenshot uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload screenshot");
        } finally {
            setIsUploading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
        disabled: isUploading || !!uploadedImage,
    });

    if (uploadedImage) {
        return (
            <Card className="border-2 border-green-200">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FiImage className="w-5 h-5 text-green-600" />
                        Payment Screenshot Uploaded
                    </CardTitle>
                    <CardDescription>
                        Your payment screenshot has been uploaded successfully
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                            src={uploadedImage}
                            alt="Payment screenshot"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={onRemove}
                        className="w-full"
                    >
                        <FiX className="w-4 h-4 mr-2" />
                        Remove Screenshot
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 border-purple-200">
            <CardHeader>
                <CardTitle className="text-lg">Upload Payment Screenshot</CardTitle>
                <CardDescription>
                    Upload a screenshot of your payment confirmation
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                        ${isDragActive
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                        }
                        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    <input {...getInputProps()} />
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    {isUploading ? (
                        <p className="text-gray-600">Uploading...</p>
                    ) : isDragActive ? (
                        <p className="text-purple-600 font-medium">Drop the image here</p>
                    ) : (
                        <>
                            <p className="text-gray-700 font-medium mb-2">
                                Drag & drop an image here, or click to select
                            </p>
                            <p className="text-sm text-gray-500">
                                PNG, JPG, JPEG up to 5MB
                            </p>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

