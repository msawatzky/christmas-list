import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChristmasListService, ChristmasItem } from '../../services/christmas-list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-others',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-others.component.html',
  styleUrl: './view-others.component.css'
})
export class ViewOthersComponent implements OnInit {
  allItems: ChristmasItem[] = [];
  groupedItems: { [userId: string]: { userName: string; items: ChristmasItem[] } } = {};
  loading = false;
  userEmail = '';
  
  // Make Object available in template
  Object = Object;

  constructor(
    private authService: AuthService,
    private christmasListService: ChristmasListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userEmail = user.name;
        this.loadAllItems();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadAllItems() {
    this.loading = true;
    this.christmasListService.getAllItems().subscribe(items => {
      this.allItems = items;
      this.groupItemsByUser();
      this.loading = false;
    });
  }

  groupItemsByUser() {
    this.groupedItems = {};
    
    this.allItems.forEach(item => {
      if (!this.groupedItems[item.userId]) {
        this.groupedItems[item.userId] = {
          userName: item.userName || 'Unknown User',
          items: []
        };
      }
      this.groupedItems[item.userId].items.push(item);
    });
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

  goToMyList() {
    this.router.navigate(['/list']);
  }

  goToChoice() {
    this.router.navigate(['/choice']);
  }

  async signOut() {
    const result = await this.authService.signOut();
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
