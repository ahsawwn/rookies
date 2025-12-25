# Product Images for ROOKIES Bakery

This folder contains product images organized by category for upload to Cloudinary.

## Folder Structure

```
product-images/
├── cookies/
├── shakes/
├── cupcakes/
├── cakes/
├── croissants/
└── breads/
```

## How to Download Images

### Option 1: Use the Download Script (Recommended)

Run the download script to automatically download all product images:

```bash
npm run download:images
```

This will:
- Download images from the URLs specified in `image-urls.json`
- Save them in the `product-images/` folder
- Name files based on product names (e.g., `nankhatai.jpg`, `mango-shake.jpg`)

### Option 2: Manual Download

1. Visit free stock photo websites:
   - **Unsplash**: https://unsplash.com
   - **Pexels**: https://www.pexels.com
   - **Pixabay**: https://pixabay.com

2. Search for each product and download high-quality images (800x800px or larger)

3. Save images in the appropriate category folders:
   - `cookies/` - For all cookie products
   - `shakes/` - For all shake products
   - `cupcakes/` - For all cupcake products
   - `cakes/` - For all cake products
   - `croissants/` - For all croissant products
   - `breads/` - For all bread products

4. Name files using the product name in lowercase with hyphens:
   - Example: `nankhatai.jpg`, `chocolate-chip-cookies.jpg`, `mango-shake.jpg`

## Image Requirements

- **Format**: JPG or PNG
- **Size**: Minimum 800x800px (square format preferred)
- **Quality**: High resolution for best results
- **Aspect Ratio**: 1:1 (square) is ideal

## Product List

### Cookies (6 products)
- Nankhatai
- Chocolate Chip Cookies
- Butter Cookies
- Almond Cookies
- Oatmeal Raisin Cookies
- Sugar Cookies

### Shakes (6 products)
- Mango Shake
- Chocolate Shake
- Strawberry Shake
- Vanilla Shake
- Banana Shake
- Oreo Shake

### Cupcakes (5 products)
- Vanilla Cupcake
- Chocolate Cupcake
- Red Velvet Cupcake
- Strawberry Cupcake
- Lemon Cupcake

### Cakes (6 products)
- Chocolate Cake (1kg)
- Vanilla Cake (1kg)
- Red Velvet Cake (1kg)
- Birthday Cake (1kg)
- Strawberry Cake (1kg)
- Coffee Cake (1kg)

### Croissants (4 products)
- Plain Croissant
- Chocolate Croissant
- Almond Croissant
- Ham & Cheese Croissant

### Breads (6 products)
- White Bread (Loaf)
- Brown Bread (Loaf)
- Naan (4 pieces)
- Garlic Bread (Loaf)
- Multigrain Bread (Loaf)
- Roti (10 pieces)

**Total: 33 products**

## Uploading to Cloudinary

After downloading images, you can upload them to Cloudinary using:

1. **Cloudinary Dashboard**: Upload manually via web interface
2. **Upload Script**: Run `npm run upload:images` (after setting up Cloudinary credentials)

## Notes

- All images should be free to use commercially
- Ensure images accurately represent the products
- For Pakistani products (Nankhatai, Naan, Roti), try to find authentic-looking images
- Consider using images with clean backgrounds for better product presentation

