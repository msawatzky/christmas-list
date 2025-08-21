import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ScrapedProduct {
  name?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
  store?: string;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductScraperService {
  // You'll need to sign up for a free API key at https://www.scrapingbee.com/
  private readonly API_KEY = 'Z9XMF4K411U6E6T8929SOW6RB8MIEK6CZUNQN0P5R38AF4K8AZR3M7GH6RBLPU6JFZA59X6LIP9GQ0SX'; // Replace with your actual API key
  private readonly BASE_URL = 'https://app.scrapingbee.com/api/v1/';

  constructor(private http: HttpClient) {}

  scrapeProduct(url: string): Observable<ScrapedProduct> {
    if (!this.API_KEY) {
      return throwError(() => new Error('Please add your ScrapingBee API key to the service'));
    }

    const params = {
      api_key: this.API_KEY,
      url: url,
      ai_extract_rules: JSON.stringify({
        name: "Extract the product name or title",
        price: "Extract the product price as a number",
        imageUrl: "Extract the main product image URL",
        description: "Extract a brief product description",
        storeName: "Extract the store or website name (e.g., Amazon, eBay, Walmart, Target, etc.)"
      }),
      render_js: 'false',
      premium_proxy: 'false'
    };

    return this.http.get(this.BASE_URL, { params }).pipe(
      map((response: any) => {
        console.log('ScrapingBee response:', response);
        
        if (response.error) {
          return { success: false, error: response.error };
        }

        // Handle the AI extraction response format
        console.log('Extracted data:', response);
        
        // The data comes back directly in the response
        return {
          name: this.cleanText(response.name),
          price: this.extractPrice(response.price),
          imageUrl: this.cleanImageUrl(response.imageUrl, url),
          description: this.cleanText(response.description),
          store: this.cleanText(response.storeName) || this.extractStoreName(url),
          success: true
        };
      }),
      catchError(error => {
        console.error('Scraping error:', error);
        return throwError(() => new Error('Failed to fetch product information. Please try again.'));
      })
    );
  }

  private cleanText(text: string): string {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  private extractPrice(price: any): number | undefined {
    if (price === null || price === undefined) return undefined;
    
    // If it's already a number, return it
    if (typeof price === 'number') return price;
    
    // If it's a string, try to extract the number
    if (typeof price === 'string') {
      const priceMatch = price.match(/[\d,]+\.?\d*/);
      if (priceMatch) {
        const parsedPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
        return isNaN(parsedPrice) ? undefined : parsedPrice;
      }
    }
    
    return undefined;
  }

  private cleanImageUrl(imageUrl: string, baseUrl: string): string {
    if (!imageUrl) return '';
    
    // The imageUrl might be the full img tag, so we need to extract the src
    if (imageUrl.includes('<img')) {
      const srcMatch = imageUrl.match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        imageUrl = srcMatch[1];
      }
    }
    
    // Convert relative URLs to absolute URLs
    if (imageUrl.startsWith('//')) {
      return 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      const url = new URL(baseUrl);
      return url.origin + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
      const url = new URL(baseUrl);
      return url.origin + '/' + imageUrl;
    }
    
    return imageUrl;
  }

  private extractStoreName(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Handle Amazon shortened URLs
      if (hostname.includes('a.co') || hostname.includes('amzn.to')) {
        return 'Amazon';
      }
      
      // Extract store name from common domains
      if (hostname.includes('amazon')) return 'Amazon';
      if (hostname.includes('ebay')) return 'eBay';
      if (hostname.includes('walmart')) return 'Walmart';
      if (hostname.includes('target')) return 'Target';
      if (hostname.includes('bestbuy')) return 'Best Buy';
      if (hostname.includes('homedepot')) return 'Home Depot';
      if (hostname.includes('lowes')) return 'Lowe\'s';
      if (hostname.includes('etsy')) return 'Etsy';
      if (hostname.includes('costco')) return 'Costco';
      if (hostname.includes('macys')) return 'Macy\'s';
      if (hostname.includes('nordstrom')) return 'Nordstrom';
      if (hostname.includes('kohls')) return 'Kohl\'s';
      if (hostname.includes('wayfair')) return 'Wayfair';
      if (hostname.includes('overstock')) return 'Overstock';
      if (hostname.includes('newegg')) return 'Newegg';
      if (hostname.includes('b&h') || hostname.includes('bhphotovideo')) return 'B&H';
      if (hostname.includes('canadiantire')) return 'Canadian Tire';
      if (hostname.includes('canadacomputers')) return 'Canada Computers';
      if (hostname.includes('staples')) return 'Staples';
      if (hostname.includes('indigo') || hostname.includes('chapters')) return 'Indigo';
      if (hostname.includes('toysrus') || hostname.includes('toys r us')) return 'Toys "R" Us';
      if (hostname.includes('sportchek') || hostname.includes('sport chek')) return 'Sport Chek';
      if (hostname.includes('marks')) return 'Marks';
      if (hostname.includes('winners')) return 'Winners';
      if (hostname.includes('marshalls')) return 'Marshalls';
      if (hostname.includes('homesense') || hostname.includes('home sense')) return 'HomeSense';
      
      // For shortened URLs, return "Unknown Store"
      const shortenedUrls = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co', 'short.link', 'rebrand.ly'];
      if (shortenedUrls.some(shortened => hostname.includes(shortened))) {
        return 'Unknown Store';
      }
      
      // Return the domain name as fallback, capitalized
      const domain = hostname.replace('www.', '').split('.')[0];
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return '';
    }
  }

  isValidProductUrl(url: string): boolean {
    try {
      // Just check if it's a valid URL
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}