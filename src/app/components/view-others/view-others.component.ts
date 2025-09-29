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
    const currentUser = this.authService.getCurrentUser();
    
    this.allItems.forEach(item => {
      // Skip items belonging to the current user
      if (item.userId === currentUser?.id) {
        return;
      }
      
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
      item.purchased ? null : this.userEmail
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

  // Skip to specific person's list
  skipToPerson(userId: string) {
    const element = document.getElementById(`user-list-${userId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // Handle select change event
  onSkipToChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target.value) {
      this.skipToPerson(target.value);
      target.value = ''; // Reset the select
    }
  }

  // Get list of available people for skip-to dropdown
  getPeopleList(): { userId: string; userName: string; itemCount: number }[] {
    return Object.keys(this.groupedItems).map(userId => ({
      userId,
      userName: this.groupedItems[userId].userName,
      itemCount: this.groupedItems[userId].items.length
    })).sort((a, b) => a.userName.localeCompare(b.userName));
  }
}
