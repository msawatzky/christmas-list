# ☁️ Cloudinary Setup Guide

## 📋 **Step 1: Get Your Free Cloudinary Account**

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click **"Sign Up For Free"**
3. Create an account (no credit card required for free tier)
4. Verify your email

## 🔑 **Step 2: Get Your Credentials**

1. **Log into your Cloudinary Dashboard**
2. **Copy your Cloud Name** (found in the dashboard)
3. **Create an Upload Preset**:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Set "Folder" to "christmas-list" (optional)
   - Save the preset name

## ⚙️ **Step 3: Add Your Credentials**

1. Open `src/app/services/cloudinary.service.ts`
2. Replace the placeholder values:
   ```typescript
   private readonly CLOUD_NAME = 'your-cloud-name-here';
   private readonly UPLOAD_PRESET = 'your-upload-preset-name';
   private readonly API_KEY = 'your-api-key'; // Optional for unsigned uploads
   ```

## 🎯 **Step 4: Test the Feature**

1. Build and deploy your app:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

2. Go to your Christmas list app
3. Add a new item
4. Click "📷 Upload Image" button
5. Select an image file
6. Watch it upload to Cloudinary! ✨

## 🆓 **Free Tier Benefits**

- **25 GB storage** (plenty for Christmas list images!)
- **25 GB bandwidth/month**
- **Automatic image optimization**
- **CDN delivery** (fast loading)
- **Image transformations** (resize, crop, etc.)
- **1 year storage** - no problem!

## 🛠️ **How It Works**

1. **User selects image** from their device
2. **Image uploads to Cloudinary** with optimization
3. **Cloudinary returns a URL** for the image
4. **URL is saved** in your Christmas list item
5. **Image displays** in your app via Cloudinary CDN

## 🎨 **Image Optimization**

The service automatically:
- **Converts to optimal format** (WebP, AVIF, etc.)
- **Compresses for web** (quality optimization)
- **Resizes to max 800px width** (faster loading)
- **Delivers via CDN** (global fast access)

## 🚨 **Troubleshooting**

- **"Please configure your Cloudinary credentials"**: Make sure you've added your cloud name and upload preset
- **"Image size must be less than 10MB"**: The free tier has size limits
- **"Please select an image file"**: Only image files are allowed

## 💡 **Tips**

- Use the "Unsigned" upload preset for security
- Images are automatically optimized for web
- URLs are permanent and won't expire
- Perfect for Christmas list photos!

---

**Happy uploading! ☁️✨**
