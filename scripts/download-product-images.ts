import { config } from "dotenv";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

config({ path: ".env" });

// Product image URLs - Using free stock photo sources
// These URLs point to Unsplash images - you can replace them with better product-specific images
const productImages: Record<string, string> = {
    // COOKIES
    "Nankhatai": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop",
    "Chocolate Chip Cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop",
    "Butter Cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop",
    "Almond Cookies": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop",
    "Oatmeal Raisin Cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop",
    "Sugar Cookies": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop",
    
    // SHAKES
    "Mango Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop&q=80",
    "Chocolate Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop&q=80",
    "Strawberry Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop&q=80",
    "Vanilla Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop&q=80",
    "Banana Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop&q=80",
    "Oreo Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop&q=80",
    
    // CUPCAKES
    "Vanilla Cupcake": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80",
    "Chocolate Cupcake": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80",
    "Red Velvet Cupcake": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80",
    "Strawberry Cupcake": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80",
    "Lemon Cupcake": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80",
    
    // CAKES
    "Chocolate Cake (1kg)": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80",
    "Vanilla Cake (1kg)": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80",
    "Red Velvet Cake (1kg)": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80",
    "Birthday Cake (1kg)": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80",
    "Strawberry Cake (1kg)": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80",
    "Coffee Cake (1kg)": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80",
    
    // CROISSANTS
    "Plain Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop&q=80",
    "Chocolate Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop&q=80",
    "Almond Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop&q=80",
    "Ham & Cheese Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop&q=80",
    
    // BREADS
    "White Bread (Loaf)": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80",
    "Brown Bread (Loaf)": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80",
    "Naan (4 pieces)": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80",
    "Garlic Bread (Loaf)": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80",
    "Multigrain Bread (Loaf)": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80",
    "Roti (10 pieces)": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop&q=80",
};

async function downloadImage(url: string, filepath: string): Promise<void> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download ${url}: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        await writeFile(filepath, Buffer.from(buffer));
        console.log(`✅ Downloaded: ${filepath}`);
    } catch (error) {
        console.error(`❌ Error downloading ${url}:`, error);
        throw error;
    }
}

// Category mapping for organizing images
const categoryMap: Record<string, string> = {
    "Nankhatai": "cookies",
    "Chocolate Chip Cookies": "cookies",
    "Butter Cookies": "cookies",
    "Almond Cookies": "cookies",
    "Oatmeal Raisin Cookies": "cookies",
    "Sugar Cookies": "cookies",
    "Mango Shake": "shakes",
    "Chocolate Shake": "shakes",
    "Strawberry Shake": "shakes",
    "Vanilla Shake": "shakes",
    "Banana Shake": "shakes",
    "Oreo Shake": "shakes",
    "Vanilla Cupcake": "cupcakes",
    "Chocolate Cupcake": "cupcakes",
    "Red Velvet Cupcake": "cupcakes",
    "Strawberry Cupcake": "cupcakes",
    "Lemon Cupcake": "cupcakes",
    "Chocolate Cake (1kg)": "cakes",
    "Vanilla Cake (1kg)": "cakes",
    "Red Velvet Cake (1kg)": "cakes",
    "Birthday Cake (1kg)": "cakes",
    "Strawberry Cake (1kg)": "cakes",
    "Coffee Cake (1kg)": "cakes",
    "Plain Croissant": "croissants",
    "Chocolate Croissant": "croissants",
    "Almond Croissant": "croissants",
    "Ham & Cheese Croissant": "croissants",
    "White Bread (Loaf)": "breads",
    "Brown Bread (Loaf)": "breads",
    "Naan (4 pieces)": "breads",
    "Garlic Bread (Loaf)": "breads",
    "Multigrain Bread (Loaf)": "breads",
    "Roti (10 pieces)": "breads",
};

async function downloadAllImages() {
    const imagesDir = join(process.cwd(), "product-images");
    
    // Create main directory and category subdirectories
    if (!existsSync(imagesDir)) {
        await mkdir(imagesDir, { recursive: true });
    }

    // Create category folders
    const categories = ["cookies", "shakes", "cupcakes", "cakes", "croissants", "breads"];
    for (const category of categories) {
        const categoryDir = join(imagesDir, category);
        if (!existsSync(categoryDir)) {
            await mkdir(categoryDir, { recursive: true });
        }
    }

    console.log("📥 Starting image download...\n");

    for (const [productName, imageUrl] of Object.entries(productImages)) {
        try {
            // Get category for this product
            const category = categoryMap[productName] || "other";
            const categoryDir = join(imagesDir, category);
            
            // Create safe filename
            const filename = productName
                .toLowerCase()
                .replace(/[^a-z0-9\s]+/g, "")
                .replace(/\s+/g, "-")
                .replace(/^-+|-+$/g, "") + ".jpg";
            
            const filepath = join(categoryDir, filename);
            
            // Skip if already exists
            if (existsSync(filepath)) {
                console.log(`⏭️  Skipping ${productName} (already exists)`);
                continue;
            }

            console.log(`📥 Downloading ${productName}...`);
            await downloadImage(imageUrl, filepath);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Failed to download image for ${productName}:`, error);
        }
    }

    console.log(`\n✨ Image download completed!`);
    console.log(`📁 Images saved to: ${imagesDir}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Review downloaded images in the product-images/ folder`);
    console.log(`2. Replace any placeholder images with better ones if needed`);
    console.log(`3. Run 'npm run upload:images' to upload to Cloudinary`);
}

downloadAllImages().catch(console.error);

