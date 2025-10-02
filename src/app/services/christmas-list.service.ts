import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface ChristmasItem {
  id?: string;
  name: string;
  store?: string;
  price?: number | null;
  picture?: string;
  purchaseUrl?: string;
  description?: string;
  purchased: boolean;
  purchasedBy?: string | null;
  userId: string;
  userName?: string;
  priority?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChristmasListService {
  private readonly COLLECTION_NAME = 'christmas-items';
  private currentManagingUserId: string | null = null; // Track which user's list we're managing

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Method to switch which user's list we're managing
  switchToUser(userId: string): void {
    this.currentManagingUserId = userId || null;
  }

  // Method to get the current user ID (either managing or logged in user)
  private getCurrentUserId(): string {
    if (this.currentManagingUserId) {
      return this.currentManagingUserId;
    }
    const user = this.authService.getCurrentUser();
    return user?.id || '';
  }

  // Method to get the current user name (either managing or logged in user)
  getCurrentUserName(): string {
    if (this.currentManagingUserId) {
      const managingUser = this.authService.getFamilyMemberById(this.currentManagingUserId);
      return managingUser?.name || 'Unknown';
    }
    const user = this.authService.getCurrentUser();
    return user?.name || 'Unknown';
  }

  // Method to check if we're managing someone else's list
  isManagingOtherUser(): boolean {
    return this.currentManagingUserId !== null;
  }

  getItems(): Observable<ChristmasItem[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return new Observable(subscriber => subscriber.next([]));
    }

    const itemsRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      itemsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) => {
        // Assign priorities to items that don't have them (per user)
        let nextPriority = 1;
        const itemsWithPriorities = items.map(item => {
          if (!item.priority) {
            return { ...item, priority: nextPriority++ };
          }
          return item;
        });
        
        // Sort by priority
        return itemsWithPriorities.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      })
    ) as Observable<ChristmasItem[]>;
  }

  async addItem(item: Omit<ChristmasItem, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const userId = this.getCurrentUserId();
      const userName = this.getCurrentUserName();
      
      if (!userId) {
        return { success: false, error: 'User not authenticated' };
      }

      // Get the next available priority for this user
      const userItems = await this.getItems().pipe(take(1)).toPromise() || [];
      const maxPriority = userItems.length > 0 ? Math.max(...userItems.map(i => i.priority || 0)) : 0;
      
      const newItem: Omit<ChristmasItem, 'id'> = {
        ...item,
        priority: item.priority || (maxPriority + 1),
        userId: userId,
        userName: userName,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(this.firestore, this.COLLECTION_NAME), newItem);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateItem(itemId: string, updates: Partial<ChristmasItem>): Promise<{ success: boolean; error?: string }> {
    try {
      const itemRef = doc(this.firestore, this.COLLECTION_NAME, itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteItem(itemId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const itemRef = doc(this.firestore, this.COLLECTION_NAME, itemId);
      await deleteDoc(itemRef);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async togglePurchased(itemId: string, purchased: boolean, purchasedBy?: string | null): Promise<{ success: boolean; error?: string }> {
    return this.updateItem(itemId, { purchased, purchasedBy });
  }

  getAllItems(): Observable<ChristmasItem[]> {
    const itemsRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      itemsRef,
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) => {
        // Group items by user and assign priorities per user
        const userGroups: { [userId: string]: ChristmasItem[] } = {};
        
        // Group items by userId
        items.forEach(item => {
          if (!userGroups[item.userId]) {
            userGroups[item.userId] = [];
          }
          userGroups[item.userId].push(item);
        });
        
        // Assign priorities per user
        const allItemsWithPriorities: ChristmasItem[] = [];
        Object.keys(userGroups).forEach(userId => {
          const userItems = userGroups[userId];
          let nextPriority = 1;
          
          const userItemsWithPriorities = userItems.map(item => {
            if (!item.priority) {
              return { ...item, priority: nextPriority++ };
            }
            return item;
          });
          
          allItemsWithPriorities.push(...userItemsWithPriorities);
        });
        
        // Sort by priority
        return allItemsWithPriorities.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      })
    ) as Observable<ChristmasItem[]>;
  }

  async changePriority(itemId: string, direction: 'up' | 'down'): Promise<{ success: boolean; error?: string }> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const items = await this.getItems().pipe(take(1)).toPromise() || [];
      const currentItem = items.find(item => item.id === itemId);
      
      if (!currentItem) {
        return { success: false, error: 'Item not found' };
      }

      const currentPriority = currentItem.priority || 1;
      let targetItem: ChristmasItem | undefined;

      if (direction === 'up') {
        // Find item with next higher priority (lower priority number = higher priority)
        targetItem = items
          .filter(item => (item.priority || 1) < currentPriority)
          .sort((a, b) => (b.priority || 1) - (a.priority || 1))[0];
      } else {
        // Find item with next lower priority (higher priority number = lower priority)
        targetItem = items
          .filter(item => (item.priority || 1) > currentPriority)
          .sort((a, b) => (a.priority || 1) - (b.priority || 1))[0];
      }

      if (!targetItem) {
        return { success: false, error: `Cannot move ${direction} - item is already at the ${direction === 'up' ? 'top' : 'bottom'}` };
      }

      // Swap priorities
      await Promise.all([
        this.updateItem(itemId, { priority: targetItem.priority || 1 }),
        this.updateItem(targetItem.id!, { priority: currentPriority })
      ]);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
