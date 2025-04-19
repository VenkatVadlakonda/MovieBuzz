import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize from localStorage if available
    const session = localStorage.getItem('currentSession');
    if (session) {
      this.currentUserSubject.next(JSON.parse(session).user);
    }
  }

  login(userData: any) {
    const sessionData = {
      user: userData,
      expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes session
    };
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    this.currentUserSubject.next(userData);
  }

  logout() {
    localStorage.removeItem('currentSession');
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn() {
    return !!this.currentUserSubject.value;
  }

  isAdmin() {
    return this.currentUserSubject.value?.isAdmin;
  }
}
