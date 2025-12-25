import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️  Warning: Cloudinary credentials not fully configured');
}

/**
 * Upload an image from a URL to Cloudinary
 */
export async function uploadImageFromUrl(
    imageUrl: string,
    folder: string = 'rookies-bakery',
    publicId?: string
): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder,
            public_id: publicId,
            transformation: [
                { width: 800, height: 800, crop: 'fill', quality: 'auto' },
            ],
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}

/**
 * Upload an image from a file path to Cloudinary
 */
export async function uploadImageFromFile(
    filePath: string,
    folder: string = 'rookies-bakery',
    publicId?: string
): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            public_id: publicId,
            transformation: [
                { width: 800, height: 800, crop: 'fill', quality: 'auto' },
            ],
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image file to Cloudinary:', error);
        throw error;
    }
}

/**
 * Upload an image from a buffer to Cloudinary
 */
export async function uploadImageFromBuffer(
    buffer: Buffer,
    folder: string = 'rookies-bakery',
    publicId?: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                transformation: [
                    { width: 800, height: 800, crop: 'fill', quality: 'auto' },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result!.secure_url);
                }
            }
        );

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number
): string {
    const transformations: any = {
        quality: 'auto',
        fetch_format: 'auto',
    };

    if (width) transformations.width = width;
    if (height) transformations.height = height;

    return cloudinary.url(publicId, {
        secure: true,
        transformation: [transformations],
    });
}

