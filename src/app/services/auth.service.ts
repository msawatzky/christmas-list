import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FamilyUser {
  id: string;
  name: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<FamilyUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Hard-coded family members
  private familyMembers: FamilyUser[] = [
    { id: 'grandpa', name: 'Grandpa', avatar: '👴' },
    { id: 'mamere', name: 'MeMere', avatar: '👵' },
    { id: 'matt', name: 'Matt', avatar: '👨' },
    { id: 'nicole', name: 'Nicole', avatar: '👩' },
    { id: 'nixon', name: 'Nixon', avatar: '👦' },
    { id: 'theo', name: 'Theo', avatar: '👦' },
    { id: 'baby-sawatzky', name: 'Baby Sawatzky', avatar: '👶' },
    { id: 'kristen', name: 'Kristen', avatar: '👩' },
    { id: 'garett', name: 'Garett', avatar: '👨' },
    { id: 'baby-minarz', name: 'Baby Minarz', avatar: '👶' },
    { id: 'nick', name: 'Nick', avatar: '👨' },
    { id: 'shaley', name: 'Shaley', avatar: '👩' }
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
