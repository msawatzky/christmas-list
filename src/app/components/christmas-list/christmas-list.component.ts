import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChristmasListService, ChristmasItem } from '../../services/christmas-list.service';
import { AuthService } from '../../services/auth.service';
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
    purchased: false
  };
  loading = false;
  userEmail = '';

  constructor(
    private christmasListService: ChristmasListService,
    private authService: AuthService,
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
      purchased: false
    });

    if (result.success) {
      this.newItem = {
        name: '',
        store: '',
        price: undefined,
        picture: '',
        purchased: false
      };
    } else {
      console.error('Error adding item:', result.error);
    }
    this.loading = false;
  }

  async togglePurchased(item: ChristmasItem) {
    const result = await this.christmasListService.togglePurchased(
      item.id!,
      !item.purchased,
      item.purchased ? undefined : this.userEmail
    );
    
    if (!result.success) {
      console.error('Error toggling purchased status:', result.error);
    }
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
}
