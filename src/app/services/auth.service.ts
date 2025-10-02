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
    { id: 'grandpa', name: 'Grandpa', avatar: '👴', priority: 1 },
    { id: 'mamere', name: 'MeMere', avatar: '👵', priority: 2 },
    { id: 'matt', name: 'Matt', avatar: '👨', priority: 3, canManageLists: ['nixon', 'theo', 'baby-sawatzky'] },
    { id: 'nicole', name: 'Nicole', avatar: '👩', priority: 4, canManageLists: ['nixon', 'theo', 'baby-sawatzky'] },
    { id: 'kristen', name: 'Kristen', avatar: '👩', priority: 5, canManageLists: ['baby-minarz'] },
    { id: 'garett', name: 'Garett', avatar: '👨', priority: 6, canManageLists: ['baby-minarz'] },
    { id: 'nick', name: 'Nick', avatar: '👨', priority: 7 },
    { id: 'shaley', name: 'Shaley', avatar: '👩', priority: 8 }
  ];

  // All family members including kids (for internal use and view-others)
  private allFamilyMembers: FamilyUser[] = [
    { id: 'grandpa', name: 'Grandpa', avatar: '👴', priority: 1 },
    { id: 'mamere', name: 'MeMere', avatar: '👵', priority: 2 },
    { id: 'matt', name: 'Matt', avatar: '👨', priority: 3, canManageLists: ['nixon', 'theo', 'baby-sawatzky'] },
    { id: 'nicole', name: 'Nicole', avatar: '👩', priority: 4, canManageLists: ['nixon', 'theo', 'baby-sawatzky'] },
    { id: 'nixon', name: 'Nixon', avatar: '👦', priority: 5 },
    { id: 'theo', name: 'Theo', avatar: '👦', priority: 6 },
    { id: 'baby-sawatzky', name: 'Baby Sawatzky', avatar: '👶', priority: 7 },
    { id: 'kristen', name: 'Kristen', avatar: '👩', priority: 8, canManageLists: ['baby-minarz'] },
    { id: 'garett', name: 'Garett', avatar: '👨', priority: 9, canManageLists: ['baby-minarz'] },
    { id: 'baby-minarz', name: 'Baby Minarz', avatar: '👶', priority: 10 },
    { id: 'nick', name: 'Nick', avatar: '👨', priority: 11 },
    { id: 'shaley', name: 'Shaley', avatar: '👩', priority: 12 }
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
