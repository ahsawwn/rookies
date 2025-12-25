import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadImageFromFile } from "@/lib/cloudinary";
import { join } from "path";
import { existsSync } from "fs";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql);

// Map product names to their local image file names
// This matches the naming convention used in download-product-images.ts
function getImageFileName(productName: string, category: string): string {
    // Use the same logic as download-product-images.ts
    const filename = productName
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, "")  // Remove special chars
        .replace(/\s+/g, "-")          // Replace spaces with hyphens
        .replace(/^-+|-+$/g, "") + ".jpg";  // Remove leading/trailing hyphens and add extension
    
    return filename;
}

// Category mapping
const categoryMap: Record<string, string> = {
    "cookies": "cookies",
    "shakes": "shakes",
    "cupcakes": "cupcakes",
    "cakes": "cakes",
    "croissants": "croissants",
    "breads": "breads",
};

async function uploadProductImages() {
    try {
        console.log("📸 Starting image upload to Cloudinary...\n");

        // Check for Cloudinary credentials
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.error("❌ ERROR: CLOUDINARY_CLOUD_NAME is not set in .env file");
            console.error("\n📋 Please add the following to your .env file:");
            console.error("   CLOUDINARY_CLOUD_NAME=your_cloud_name");
            console.error("   CLOUDINARY_API_KEY=your_api_key");
            console.error("   CLOUDINARY_API_SECRET=your_api_secret");
            console.error("\n🔗 Get your credentials from: https://cloudinary.com/console");
            process.exit(1);
        }

        if (!process.env.CLOUDINARY_API_KEY) {
            console.error("❌ ERROR: CLOUDINARY_API_KEY is not set in .env file");
            process.exit(1);
        }

        if (!process.env.CLOUDINARY_API_SECRET) {
            console.error("❌ ERROR: CLOUDINARY_API_SECRET is not set in .env file");
            process.exit(1);
        }

        console.log("✅ Cloudinary credentials found\n");

        // Get all products
        const products = await db.select().from(product);
        console.log(`📦 Found ${products.length} products to process...\n`);

        const imagesDir = join(process.cwd(), "product-images");
        let uploadedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const prod of products) {
            try {
                // Skip if already has a real Cloudinary URL (not demo/placeholder)
                if (prod.image && 
                    prod.image.includes("res.cloudinary.com") && 
                    !prod.image.includes("/demo/") &&
                    !prod.image.includes("cloudinary.com/demo")) {
                    console.log(`⏭️  Skipping ${prod.name} (already has Cloudinary URL)`);
                    skippedCount++;
                    continue;
                }

                // Get category folder
                const category = categoryMap[prod.category] || prod.category;
                const imageFileName = getImageFileName(prod.name, category);
                const imagePath = join(imagesDir, category, imageFileName);

                // Check if image file exists
                if (!existsSync(imagePath)) {
                    console.log(`⚠️  Image not found for ${prod.name}`);
                    console.log(`   Expected: ${imagePath}`);
                    errorCount++;
                    continue;
                }

                console.log(`📤 Uploading: ${prod.name}`);
                console.log(`   File: ${imagePath}`);

                // Upload to Cloudinary
                const cloudinaryUrl = await uploadImageFromFile(
                    imagePath,
                    "rookies-bakery/products",
                    `${category}/${prod.slug}`
                );

                // Update product with Cloudinary URL
                await db
                    .update(product)
                    .set({ 
                        image: cloudinaryUrl,
                        updatedAt: new Date()
                    })
                    .where(eq(product.id, prod.id));

                console.log(`✅ Uploaded: ${prod.name}`);
                console.log(`   URL: ${cloudinaryUrl}\n`);
                uploadedCount++;

                // Small delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ Error processing ${prod.name}:`, error);
                errorCount++;
                // Continue with next product
            }
        }

        console.log("\n✨ Image upload completed!");
        console.log(`📊 Summary:`);
        console.log(`   ✅ Uploaded: ${uploadedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
    } catch (error) {
        console.error("❌ Error uploading images:", error);
        process.exit(1);
    }
}

uploadProductImages();
