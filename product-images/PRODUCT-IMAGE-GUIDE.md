# Complete Product Image Guide for ROOKIES Bakery

## Overview

This guide helps you find and organize high-quality images for all 33 products in the ROOKIES Bakery catalog.

## Quick Start

1. **Download existing images**: Run `npm run download:images` (already done - 29 images downloaded)
2. **Review downloaded images**: Check the `product-images/` folder
3. **Replace missing/better images**: Use the sources below to find better images
4. **Upload to Cloudinary**: Run `npm run upload:images` after setting up Cloudinary credentials

## Current Status

✅ **Downloaded Successfully (29 images)**:
- All shakes (6/6)
- All cupcakes (5/5)
- All cakes (6/6)
- All croissants (4/4)
- All breads (6/6)
- Most cookies (3/6)

❌ **Need Better Images (4 products)**:
- Nankhatai
- Oatmeal Raisin Cookies
- Sugar Cookies

## Best Free Image Sources

### 1. Unsplash (Recommended)
- **URL**: https://unsplash.com
- **License**: Free, no attribution required
- **Quality**: Very high
- **Search**: Use product names directly

### 2. Pexels
- **URL**: https://www.pexels.com
- **License**: Free, no attribution required
- **Quality**: High
- **Search**: Use product names + "food" or "bakery"

### 3. Pixabay
- **URL**: https://pixabay.com
- **License**: Free, no attribution required
- **Quality**: Good
- **Search**: Use product names

## Product-Specific Search Terms

### Cookies (6 products)

| Product | Search Terms | Notes |
|---------|-------------|-------|
| **Nankhatai** | "nankhatai", "indian cookies", "shortbread cookies pakistani" | Try Indian/Pakistani food sites |
| **Chocolate Chip Cookies** | "chocolate chip cookies", "cookies" | ✅ Downloaded |
| **Butter Cookies** | "butter cookies", "shortbread cookies" | ✅ Downloaded |
| **Almond Cookies** | "almond cookies", "nut cookies" | ✅ Downloaded |
| **Oatmeal Raisin Cookies** | "oatmeal cookies", "raisin cookies" | Need better image |
| **Sugar Cookies** | "sugar cookies", "iced cookies" | Need better image |

### Shakes (6 products) - All Downloaded ✅

| Product | Search Terms |
|---------|-------------|
| Mango Shake | "mango milkshake", "mango shake" |
| Chocolate Shake | "chocolate milkshake" |
| Strawberry Shake | "strawberry milkshake" |
| Vanilla Shake | "vanilla milkshake" |
| Banana Shake | "banana milkshake" |
| Oreo Shake | "oreo milkshake" |

### Cupcakes (5 products) - All Downloaded ✅

| Product | Search Terms |
|---------|-------------|
| Vanilla Cupcake | "vanilla cupcake" |
| Chocolate Cupcake | "chocolate cupcake" |
| Red Velvet Cupcake | "red velvet cupcake" |
| Strawberry Cupcake | "strawberry cupcake" |
| Lemon Cupcake | "lemon cupcake" |

### Cakes (6 products) - All Downloaded ✅

| Product | Search Terms |
|---------|-------------|
| Chocolate Cake | "chocolate cake", "chocolate layer cake" |
| Vanilla Cake | "vanilla cake", "white cake" |
| Red Velvet Cake | "red velvet cake" |
| Birthday Cake | "birthday cake", "decorated cake" |
| Strawberry Cake | "strawberry cake" |
| Coffee Cake | "coffee cake" |

### Croissants (4 products) - All Downloaded ✅

| Product | Search Terms |
|---------|-------------|
| Plain Croissant | "croissant", "plain croissant" |
| Chocolate Croissant | "chocolate croissant" |
| Almond Croissant | "almond croissant" |
| Ham & Cheese Croissant | "ham cheese croissant", "savory croissant" |

### Breads (6 products) - All Downloaded ✅

| Product | Search Terms | Notes |
|---------|-------------|-------|
| White Bread | "white bread", "bread loaf" |
| Brown Bread | "brown bread", "whole wheat bread" |
| **Naan** | "naan bread", "indian naan", "tandoori naan" | Pakistani/Indian food sites |
| Garlic Bread | "garlic bread" |
| Multigrain Bread | "multigrain bread" |
| **Roti** | "roti", "chapati", "indian roti" | Pakistani/Indian food sites |

## Image Requirements

- **Format**: JPG or PNG
- **Size**: Minimum 800x800px (square preferred)
- **Resolution**: High quality (at least 72 DPI)
- **Aspect Ratio**: 1:1 (square) is ideal for product display
- **Background**: Clean, preferably white or neutral
- **Lighting**: Well-lit, professional quality

## Folder Structure

```
product-images/
├── cookies/
│   ├── nankhatai.jpg (NEED BETTER IMAGE)
│   ├── chocolate-chip-cookies.jpg ✅
│   ├── butter-cookies.jpg ✅
│   ├── almond-cookies.jpg ✅
│   ├── oatmeal-raisin-cookies.jpg (NEED BETTER IMAGE)
│   └── sugar-cookies.jpg (NEED BETTER IMAGE)
├── shakes/
│   ├── mango-shake.jpg ✅
│   ├── chocolate-shake.jpg ✅
│   ├── strawberry-shake.jpg ✅
│   ├── vanilla-shake.jpg ✅
│   ├── banana-shake.jpg ✅
│   └── oreo-shake.jpg ✅
├── cupcakes/
│   ├── vanilla-cupcake.jpg ✅
│   ├── chocolate-cupcake.jpg ✅
│   ├── red-velvet-cupcake.jpg ✅
│   ├── strawberry-cupcake.jpg ✅
│   └── lemon-cupcake.jpg ✅
├── cakes/
│   ├── chocolate-cake-1kg.jpg ✅
│   ├── vanilla-cake-1kg.jpg ✅
│   ├── red-velvet-cake-1kg.jpg ✅
│   ├── birthday-cake-1kg.jpg ✅
│   ├── strawberry-cake-1kg.jpg ✅
│   └── coffee-cake-1kg.jpg ✅
├── croissants/
│   ├── plain-croissant.jpg ✅
│   ├── chocolate-croissant.jpg ✅
│   ├── almond-croissant.jpg ✅
│   └── ham-cheese-croissant.jpg ✅
└── breads/
    ├── white-bread-loaf.jpg ✅
    ├── brown-bread-loaf.jpg ✅
    ├── naan-4-pieces.jpg ✅
    ├── garlic-bread-loaf.jpg ✅
    ├── multigrain-bread-loaf.jpg ✅
    └── roti-10-pieces.jpg ✅
```

## Manual Download Instructions

### For Missing/Better Images:

1. **Visit Unsplash, Pexels, or Pixabay**
2. **Search for the product** using the search terms above
3. **Filter by**:
   - Free license
   - High resolution (800x800 or larger)
   - Square format (if available)
4. **Download the image**
5. **Save to the correct folder**:
   - Cookies → `product-images/cookies/`
   - Shakes → `product-images/shakes/`
   - Cupcakes → `product-images/cupcakes/`
   - Cakes → `product-images/cakes/`
   - Croissants → `product-images/croissants/`
   - Breads → `product-images/breads/`
6. **Name the file** using the product name in lowercase with hyphens:
   - Example: `nankhatai.jpg`, `oatmeal-raisin-cookies.jpg`

## Pakistani-Specific Products

For authentic Pakistani products, try these specialized sources:

1. **Food Photography Blogs**: Search for "Pakistani food photography"
2. **Recipe Websites**: Many recipe sites have high-quality food photos
3. **Instagram**: Search hashtags like #nankhatai #pakistanifood #naan
4. **Food Stock Photo Sites**: Some sites specialize in ethnic food photography

## Uploading to Cloudinary

Once you have all images:

1. **Set up Cloudinary**:
   - Sign up at https://cloudinary.com
   - Get your API credentials
   - Add to `.env`:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

2. **Update upload script**:
   - Edit `scripts/upload-images.ts`
   - Update the `imagePlaceholders` object with your actual image file paths

3. **Run upload**:
   ```bash
   npm run upload:images
   ```

## Alternative: Direct Cloudinary Upload

You can also upload images directly via Cloudinary Dashboard:

1. Go to https://cloudinary.com/console
2. Navigate to Media Library
3. Create folders: `rookies-bakery/cookies`, `rookies-bakery/shakes`, etc.
4. Upload images to respective folders
5. Copy the Cloudinary URLs
6. Update `scripts/seed-products.ts` with the Cloudinary URLs

## Tips for Best Results

1. **Consistency**: Use similar lighting and background style across all images
2. **Product Focus**: Images should clearly show the product
3. **Appetizing**: Choose images that make the product look delicious
4. **Professional**: Avoid blurry, dark, or low-quality images
5. **Square Format**: Square images work best for product grids
6. **High Resolution**: Higher resolution = better quality when displayed

## Next Steps

1. ✅ Review downloaded images in `product-images/` folder
2. 🔍 Find better images for the 4 missing products (Nankhatai, Oatmeal Raisin, Sugar Cookies)
3. 📤 Set up Cloudinary account and credentials
4. 🚀 Run `npm run upload:images` to upload all images
5. ✅ Update product seed script with Cloudinary URLs
6. 🌱 Run `npm run seed:products` to update database

