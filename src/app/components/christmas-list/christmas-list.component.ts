import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChristmasListService, ChristmasItem } from '../../services/christmas-list.service';
import { AuthService } from '../../services/auth.service';
import { ProductScraperService, ScrapedProduct } from '../../services/product-scraper.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-christmas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './christmas-list.component.html',
  styleUrl: './christmas-list.component.css'
})
export class ChristmasListComponent implements OnInit {
  items: ChristmasItem[] = [];
  newItem: Partial<ChristmasItem> = {
    name: '',
    store: '',
    price: undefined,
    picture: '',
    purchaseUrl: '',
    purchased: false
  };
  editingItem: ChristmasItem | null = null;
  loading = false;
  scraping = false;
  userEmail = '';

  constructor(
    private christmasListService: ChristmasListService,
    private authService: AuthService,
    private productScraperService: ProductScraperService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userEmail = user.name;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadItems() {
    this.christmasListService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  async addItem() {
    if (!this.newItem.name?.trim()) return;

    this.loading = true;
    const result = await this.christmasListService.addItem({
      name: this.newItem.name.trim(),
      store: this.newItem.store?.trim() || '',
      price: this.newItem.price || undefined,
      picture: this.newItem.picture?.trim() || '',
      purchaseUrl: this.newItem.purchaseUrl?.trim() || '',
      purchased: false
    });

    if (result.success) {
      this.newItem = {
        name: '',
        store: '',
        price: undefined,
        picture: '',
        purchaseUrl: '',
        purchased: false
      };
    } else {
      console.error('Error adding item:', result.error);
    }
    this.loading = false;
  }



  async deleteItem(itemId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = await this.christmasListService.deleteItem(itemId);
      if (!result.success) {
        console.error('Error deleting item:', result.error);
      }
    }
  }

  async signOut() {
    const result = await this.authService.signOut();
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }

  goToChoice() {
    this.router.navigate(['/choice']);
  }

  goToViewOthers() {
    this.router.navigate(['/view-others']);
  }

  onImageError(event: any) {
    // Hide the image if it fails to load
    event.target.style.display = 'none';
  }



  editItem(item: ChristmasItem) {
    this.editingItem = { ...item };
    this.newItem = {
      name: '',
      store: '',
      price: undefined,
      picture: '',
      purchaseUrl: '',
      purchased: false
    };
  }

  cancelEdit() {
    this.editingItem = null;
    this.newItem = {
      name: '',
      store: '',
      price: undefined,
      picture: '',
      purchaseUrl: '',
      purchased: false
    };
  }

  async saveEdit() {
    if (!this.editingItem || !this.editingItem.id) return;

    this.loading = true;
    const result = await this.christmasListService.updateItem(this.editingItem.id, {
      name: this.editingItem.name,
      store: this.editingItem.store || '',
      price: this.editingItem.price,
      picture: this.editingItem.picture || '',
      purchaseUrl: this.editingItem.purchaseUrl || ''
    });

    if (result.success) {
      this.editingItem = null;
      this.newItem = {
        name: '',
        store: '',
        price: undefined,
        picture: '',
        purchaseUrl: '',
        purchased: false
      };
    } else {
      console.error('Error updating item:', result.error);
      alert('Error updating item: ' + result.error);
    }
    
    this.loading = false;
  }

  async fetchProductInfo() {
    const url = this.editingItem ? this.editingItem.purchaseUrl : this.newItem.purchaseUrl;
    
    if (!url || !this.productScraperService.isValidProductUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }

    this.scraping = true;
    
    this.productScraperService.scrapeProduct(url).subscribe({
      next: (product: ScrapedProduct) => {
        if (product.success) {
          if (this.editingItem) {
            this.editingItem.name = product.name || this.editingItem.name;
            this.editingItem.price = product.price || this.editingItem.price;
            this.editingItem.picture = product.imageUrl || this.editingItem.picture;
            this.editingItem.store = product.store || this.editingItem.store;
          } else {
            this.newItem.name = product.name || this.newItem.name;
            this.newItem.price = product.price || this.newItem.price;
            this.newItem.picture = product.imageUrl || this.newItem.picture;
            this.newItem.store = product.store || this.newItem.store;
          }
          

        } else {
          alert('❌ Failed to fetch product information: ' + (product.error || 'Unknown error'));
        }
        this.scraping = false;
      },
      error: (error) => {
        console.error('Scraping error:', error);
        alert('❌ Error fetching product information: ' + error.message);
        this.scraping = false;
      }
    });
  }

  canFetchProductInfo(): boolean {
    const url = this.editingItem ? this.editingItem.purchaseUrl : this.newItem.purchaseUrl;
    return !!url && this.productScraperService.isValidProductUrl(url);
  }
}
