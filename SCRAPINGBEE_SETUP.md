# 🚀 ScrapingBee Setup Guide

## 📋 **Step 1: Get Your Free API Key**

1. Go to [https://www.scrapingbee.com/](https://www.scrapingbee.com/)
2. Click **"Start Free Trial"** or **"Sign Up"**
3. Create an account (no credit card required for free tier)
4. Get your **API Key** from the dashboard

## 🔑 **Step 2: Add Your API Key**

1. Open `src/app/services/product-scraper.service.ts`
2. Find this line:
   ```typescript
   private readonly API_KEY = 'YOUR_SCRAPINGBEE_API_KEY';
   ```
3. Replace `'YOUR_SCRAPINGBEE_API_KEY'` with your actual API key:
   ```typescript
   private readonly API_KEY = 'your-actual-api-key-here';
   ```

## 🎯 **Step 3: Test the Feature**

1. Build and deploy your app:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

2. Go to your Christmas list app
3. Add a new item
4. Paste a product URL (Amazon, eBay, Walmart, etc.)
5. Click the **"🔍 Fetch Info"** button
6. Watch the magic happen! ✨

## 🆓 **Free Tier Limits**

- **1,000 API calls per month** (plenty for personal use!)
- Works with most e-commerce sites
- No credit card required

## 🛠️ **Supported Stores**

- ✅ Amazon
- ✅ eBay  
- ✅ Walmart
- ✅ Target
- ✅ Best Buy
- ✅ Home Depot
- ✅ Lowe's
- ✅ Etsy
- ✅ And many more!

## 🎁 **How It Works**

1. **Paste URL**: Copy a product URL from any supported store
2. **Click Fetch**: The app automatically extracts:
   - Product name
   - Price
   - Product image
   - Store name
3. **Auto-fill**: Form fields are populated automatically
4. **Save**: Add the item to your Christmas list!

## 🚨 **Troubleshooting**

- **"Please add your API key"**: Make sure you've added your ScrapingBee API key
- **"Invalid URL"**: Make sure it's a product URL from a supported store
- **"Failed to fetch"**: The product page might be protected or the selectors need updating

## 💡 **Tips**

- Use product URLs, not category or search pages
- The feature works best with direct product links
- If one store doesn't work, try another!
- The free tier is perfect for personal Christmas list use

---

**Happy scraping! 🎄✨**
