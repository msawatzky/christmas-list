import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChristmasListService, ChristmasItem } from '../../services/christmas-list.service';
import { AuthService } from '../../services/auth.service';
import { ProductScraperService, ScrapedProduct } from '../../services/product-scraper.service';
import { CloudinaryService } from '../../services/cloudinary.service';

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
    price: null,
    picture: '',
    purchaseUrl: '',
    description: '',
    purchased: false
  };
  editingItem: ChristmasItem | null = null;
  loading = false;
  scraping = false;
  uploading = false;
  userEmail = '';
  fetchUrl = '';

  constructor(
    private christmasListService: ChristmasListService,
    private authService: AuthService,
    private productScraperService: ProductScraperService,
    private cloudinaryService: CloudinaryService,
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
    
    // Calculate the next priority (highest current priority + 1)
    const nextPriority = this.items.length > 0 
      ? Math.max(...this.items.map(item => item.priority || 0)) + 1 
      : 1;
    
    const result = await this.christmasListService.addItem({
      name: this.newItem.name.trim(),
      store: this.newItem.store?.trim() || '',
      price: this.newItem.price || null,
      picture: this.newItem.picture?.trim() || '',
      purchaseUrl: this.newItem.purchaseUrl?.trim() || '',
      description: this.newItem.description?.trim() || '',
      purchased: false,
      priority: nextPriority
    });

    if (result.success) {
      this.newItem = {
        name: '',
        store: '',
        price: null,
        picture: '',
        purchaseUrl: '',
        description: '',
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
      price: null,
      picture: '',
      purchaseUrl: '',
      description: '',
      purchased: false
    };
    
    // Scroll to the edit item section
    setTimeout(() => {
      const editSection = document.querySelector('.add-item-section');
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  cancelEdit() {
    this.editingItem = null;
    this.newItem = {
      name: '',
      store: '',
      price: null,
      picture: '',
      purchaseUrl: '',
      description: '',
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
      purchaseUrl: this.editingItem.purchaseUrl || '',
      description: this.editingItem.description || ''
    });

    if (result.success) {
      this.editingItem = null;
      this.newItem = {
        name: '',
        store: '',
        price: null,
        picture: '',
        purchaseUrl: '',
        description: '',
        purchased: false
      };
    } else {
      console.error('Error updating item:', result.error);
      alert('Error updating item: ' + result.error);
    }
    
    this.loading = false;
  }

  async fetchProductInfo() {
    if (!this.fetchUrl || !this.productScraperService.isValidProductUrl(this.fetchUrl)) {
      alert('Please enter a valid URL');
      return;
    }

    this.scraping = true;
    
    this.productScraperService.scrapeProduct(this.fetchUrl).subscribe({
              next: (product: ScrapedProduct) => {
          if (product.success) {
            if (this.editingItem) {
              this.editingItem.name = product.name || this.editingItem.name;
              this.editingItem.price = product.price || this.editingItem.price;
              this.editingItem.picture = product.imageUrl || this.editingItem.picture;
              this.editingItem.store = product.store || this.editingItem.store;
              this.editingItem.purchaseUrl = this.fetchUrl; // Set purchase link to fetch URL
            } else {
              this.newItem.name = product.name || this.newItem.name;
              this.newItem.price = product.price || this.newItem.price;
              this.newItem.picture = product.imageUrl || this.newItem.picture;
              this.newItem.store = product.store || this.newItem.store;
              this.newItem.purchaseUrl = this.fetchUrl; // Set purchase link to fetch URL
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
    return !!this.fetchUrl && this.productScraperService.isValidProductUrl(this.fetchUrl);
  }

  isFormValid(): boolean {
    const name = this.editingItem ? this.editingItem.name : this.newItem.name;
    return !!name && name.trim().length > 0;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    
    this.cloudinaryService.uploadImage(file).subscribe({
      next: (result) => {
        if (result.success && result.url) {
          if (this.editingItem) {
            this.editingItem.picture = result.url;
          } else {
            this.newItem.picture = result.url;
          }
        } else {
          console.error('Error uploading image:', result.error);
          alert('Error uploading image: ' + result.error);
        }
        this.uploading = false;
      },
      error: (error) => {
        console.error('Upload error:', error);
        alert('Error uploading image: ' + error.message);
        this.uploading = false;
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removePicture() {
    if (this.editingItem) {
      this.editingItem.picture = '';
    } else {
      this.newItem.picture = '';
    }
    // Clear the file input as well
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async changePriority(itemId: string, direction: 'up' | 'down') {
    this.loading = true;
    const result = await this.christmasListService.changePriority(itemId, direction);
    if (!result.success) {
      console.error('Error changing priority:', result.error);
      alert('Error changing priority: ' + result.error);
    }
    this.loading = false;
  }
}
