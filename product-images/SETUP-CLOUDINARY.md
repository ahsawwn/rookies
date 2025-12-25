# Setting Up Cloudinary for Image Upload

## Why Cloudinary?

Cloudinary provides:
- Fast image delivery via CDN
- Automatic image optimization
- Image transformations on-the-fly
- Free tier with generous limits

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up" (it's free!)
3. Fill in your details and verify your email

## Step 2: Get Your API Credentials

After signing up, you'll be taken to your dashboard. You'll see:

- **Cloud Name**: Your unique cloud name (e.g., `dxyz1234`)
- **API Key**: Your API key (e.g., `123456789012345`)
- **API Secret**: Your API secret (keep this secure!)

## Step 3: Add Credentials to .env File

Open your `.env` file in the project root and add:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important**: 
- Replace the placeholder values with your actual credentials
- Never commit your `.env` file to git (it should already be in `.gitignore`)
- Keep your API Secret secure and never share it publicly

## Step 4: Upload Images

Once credentials are set up, run:

```bash
npm run upload:images
```

This will:
1. Read all images from `product-images/` folder
2. Upload them to Cloudinary
3. Update your database with Cloudinary URLs

## Step 5: Verify Upload

After running the upload script, you should see:
- ✅ Success messages for each uploaded image
- Cloudinary URLs in your database
- Images accessible via Cloudinary CDN

## Troubleshooting

### Error: "Must supply api_key"

**Solution**: Make sure all three Cloudinary credentials are in your `.env` file:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Error: "Invalid API key"

**Solution**: 
- Double-check your API key and secret
- Make sure there are no extra spaces in your `.env` file
- Restart your terminal/IDE after adding credentials

### Error: "Image not found"

**Solution**: 
- Make sure you've run `npm run download:images` first
- Check that images exist in `product-images/` folder
- Verify the image file names match product names

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- Unlimited transformations
- Perfect for small to medium projects!

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Cloudinary Support: https://support.cloudinary.com

