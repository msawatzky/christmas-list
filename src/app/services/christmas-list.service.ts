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

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  getItems(): Observable<ChristmasItem[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return new Observable(subscriber => subscriber.next([]));
    }

    const itemsRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      itemsRef,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map((items: any[]) => {
        // Add default priority to items that don't have it and sort by priority
        return items.map((item, index) => ({
          ...item,
          priority: item.priority || (index + 1)
        })).sort((a, b) => (a.priority || 0) - (b.priority || 0));
      })
    ) as Observable<ChristmasItem[]>;
  }

  async addItem(item: Omit<ChristmasItem, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const newItem: Omit<ChristmasItem, 'id'> = {
        ...item,
        priority: item.priority || 1,
        userId: user.id,
        userName: user.name,
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
    
    return collectionData(q, { idField: 'id' }) as Observable<ChristmasItem[]>;
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
