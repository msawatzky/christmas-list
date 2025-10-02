import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FamilyUser {
  id: string;
  name: string;
  avatar?: string;
  priority?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<FamilyUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Hard-coded family members with priorities (lower number = higher priority)
  private familyMembers: FamilyUser[] = [
    { id: 'grandpa', name: 'Grandpa', avatar: '👴', priority: 1 },
    { id: 'mamere', name: 'MeMere', avatar: '👵', priority: 2 },
    { id: 'matt', name: 'Matt', avatar: '👨', priority: 3 },
    { id: 'nicole', name: 'Nicole', avatar: '👩', priority: 4 },
    { id: 'nixon', name: 'Nixon', avatar: '👦', priority: 5 },
    { id: 'theo', name: 'Theo', avatar: '👦', priority: 6 },
    { id: 'baby-sawatzky', name: 'Baby Sawatzky', avatar: '👶', priority: 7 },
    { id: 'kristen', name: 'Kristen', avatar: '👩', priority: 8 },
    { id: 'garett', name: 'Garett', avatar: '👨', priority: 9 },
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

  getFamilyMemberById(id: string): FamilyUser | undefined {
    return this.familyMembers.find(member => member.id === id);
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
