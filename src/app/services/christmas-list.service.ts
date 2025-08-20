import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ChristmasItem {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  url?: string;
  purchased: boolean;
  purchasedBy?: string;
  userId: string;
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
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) {
      return new Observable(subscriber => subscriber.next([]));
    }

    const itemsRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      itemsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<ChristmasItem[]>;
  }

  async addItem(item: Omit<ChristmasItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const userId = this.authService.getCurrentUser()?.uid;
      if (!userId) {
        return { success: false, error: 'User not authenticated' };
      }

      const newItem: Omit<ChristmasItem, 'id'> = {
        ...item,
        userId,
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

  async togglePurchased(itemId: string, purchased: boolean, purchasedBy?: string): Promise<{ success: boolean; error?: string }> {
    return this.updateItem(itemId, { purchased, purchasedBy });
  }
}
