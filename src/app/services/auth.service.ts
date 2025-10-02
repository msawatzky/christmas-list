import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FamilyUser {
  id: string;
  name: string;
  avatar?: string;
  priority?: number;
  canManageLists?: string[]; // Array of user IDs this user can manage
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<FamilyUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Hard-coded family members with priorities (lower number = higher priority)
  // Kids are managed by parents, so they don't appear in login
  private familyMembers: FamilyUser[] = [
    { id: 'grandpa', name: 'Grandpa', avatar: '👴', priority: 1, canManageLists: ['grandpa-mamere'] },
    { id: 'mamere', name: 'MeMere', avatar: '👵', priority: 2, canManageLists: ['grandpa-mamere'] },
    { id: 'matt', name: 'Matt', avatar: '👨', priority: 3, canManageLists: ['nixon', 'theo', 'baby-sawatzky', 'matt-nicole', 'nixon-theo'] },
    { id: 'nicole', name: 'Nicole', avatar: '👩', priority: 4, canManageLists: ['nixon', 'theo', 'baby-sawatzky', 'matt-nicole', 'nixon-theo'] },
    { id: 'kristen', name: 'Kristen', avatar: '👩', priority: 5, canManageLists: ['baby-minarz', 'kristen-garett'] },
    { id: 'garett', name: 'Garett', avatar: '👨', priority: 6, canManageLists: ['baby-minarz', 'kristen-garett'] },
    { id: 'nick', name: 'Nick', avatar: '👨', priority: 7, canManageLists: ['nick-shaley'] },
    { id: 'shaley', name: 'Shaley', avatar: '👩', priority: 8, canManageLists: ['nick-shaley'] }
  ];

  // All family members including kids and shared lists (for internal use and view-others)
  // Individual lists first, then shared/couple lists
  private allFamilyMembers: FamilyUser[] = [
    // Individual family members
    { id: 'grandpa', name: 'Grandpa', avatar: '👴', priority: 1, canManageLists: ['grandpa-mamere'] },
    { id: 'mamere', name: 'MeMere', avatar: '👵', priority: 2, canManageLists: ['grandpa-mamere'] },
    { id: 'matt', name: 'Matt', avatar: '👨', priority: 3, canManageLists: ['nixon', 'theo', 'baby-sawatzky', 'matt-nicole', 'nixon-theo'] },
    { id: 'nicole', name: 'Nicole', avatar: '👩', priority: 4, canManageLists: ['nixon', 'theo', 'baby-sawatzky', 'matt-nicole', 'nixon-theo'] },
    { id: 'nixon', name: 'Nixon', avatar: '👦', priority: 5 },
    { id: 'theo', name: 'Theo', avatar: '👦', priority: 6 },
    { id: 'baby-sawatzky', name: 'Baby Sawatzky', avatar: '👶', priority: 7 },
    { id: 'kristen', name: 'Kristen', avatar: '👩', priority: 8, canManageLists: ['baby-minarz', 'kristen-garett'] },
    { id: 'garett', name: 'Garett', avatar: '👨', priority: 9, canManageLists: ['baby-minarz', 'kristen-garett'] },
    { id: 'baby-minarz', name: 'Baby Minarz', avatar: '👶', priority: 10 },
    { id: 'nick', name: 'Nick', avatar: '👨', priority: 11, canManageLists: ['nick-shaley'] },
    { id: 'shaley', name: 'Shaley', avatar: '👩', priority: 12, canManageLists: ['nick-shaley'] },
    // Shared/couple lists (appear after individual lists)
    { id: 'grandpa-mamere', name: 'Grandpa & MeMere', avatar: '👴👵', priority: 13 },
    { id: 'matt-nicole', name: 'Matt & Nicole', avatar: '👫', priority: 14 },
    { id: 'kristen-garett', name: 'Kristen & Garett', avatar: '👫', priority: 15 },
    { id: 'nick-shaley', name: 'Nick & Shaley', avatar: '👫', priority: 16 },
    { id: 'nixon-theo', name: 'Nixon & Theo', avatar: '👦👦', priority: 17 }
  ];

  constructor() {
    // Check if there's a saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  getFamilyMembers(): FamilyUser[] {
    return this.familyMembers;
  }

  getAllFamilyMembers(): FamilyUser[] {
    return this.allFamilyMembers;
  }

  getFamilyMemberById(id: string): FamilyUser | undefined {
    return this.allFamilyMembers.find(member => member.id === id);
  }

  getManageableLists(): FamilyUser[] {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.canManageLists) {
      return [];
    }
    
    return currentUser.canManageLists
      .map(userId => this.getFamilyMemberById(userId))
      .filter((member): member is FamilyUser => member !== undefined);
  }

  hasManageableLists(): boolean {
    return this.getManageableLists().length > 0;
  }

  signIn(userId: string): { success: boolean; user?: FamilyUser; error?: string } {
    const user = this.familyMembers.find(member => member.id === userId);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'User not found' };
  }

  signOut(): { success: boolean; error?: string } {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    return { success: true };
  }

  getCurrentUser(): FamilyUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
