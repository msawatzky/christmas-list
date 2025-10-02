import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
export class ViewOthersComponent implements OnInit, AfterViewInit, OnDestroy {
  allItems: ChristmasItem[] = [];
  groupedItems: { [userId: string]: { userName: string; items: ChristmasItem[] } } = {};
  loading = false;
  userEmail = '';
  selectedImage: { src: string; alt: string } | null = null;
  
  // Make Object available in template
  Object = Object;
  
  @ViewChild('skipToSection', { static: false }) skipToSection!: ElementRef;
  private scrollObserver?: IntersectionObserver;

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

  ngAfterViewInit() {
    // Set up intersection observer for sticky behavior
    if (this.skipToSection) {
      this.setupStickyObserver();
    }
  }

  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
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

    // Sort items within each user's list by priority
    Object.keys(this.groupedItems).forEach(userId => {
      this.groupedItems[userId].items.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    });
  }

  // Get ordered list of family members for display
  getOrderedFamilyMembers(): { userId: string; userName: string; itemCount: number; priority: number }[] {
    return Object.keys(this.groupedItems).map(userId => {
      const familyMember = this.authService.getFamilyMemberById(userId);
      return {
        userId,
        userName: this.groupedItems[userId].userName,
        itemCount: this.groupedItems[userId].items.length,
        priority: familyMember?.priority || 999 // Default high priority for unknown users
      };
    }).sort((a, b) => a.priority - b.priority);
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

  openImageModal(src: string, alt: string) {
    this.selectedImage = { src, alt };
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeImageModal() {
    this.selectedImage = null;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  // Skip to specific person's list
  skipToPerson(userId: string) {
    const element = document.getElementById(`user-list-${userId}`);
    if (element) {
      // Get the height of the sticky skip-to section
      const skipToHeight = this.skipToSection ? this.skipToSection.nativeElement.offsetHeight : 80;
      
      // Calculate the position with offset
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - skipToHeight - 20; // Extra 20px padding
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
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
    return this.getOrderedFamilyMembers().map(member => ({
      userId: member.userId,
      userName: member.userName,
      itemCount: member.itemCount
    }));
  }

  private setupStickyObserver() {
    if (!this.skipToSection) return;

    // Create a placeholder element to observe
    const placeholder = document.createElement('div');
    placeholder.style.height = '1px';
    this.skipToSection.nativeElement.parentNode.insertBefore(placeholder, this.skipToSection.nativeElement);

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Element is visible, remove sticky class
            this.skipToSection.nativeElement.classList.remove('is-sticky');
          } else {
            // Element is not visible, add sticky class
            this.skipToSection.nativeElement.classList.add('is-sticky');
          }
        });
      },
      {
        rootMargin: '0px 0px 0px 0px',
        threshold: 0
      }
    );

    this.scrollObserver.observe(placeholder);
  }
}
