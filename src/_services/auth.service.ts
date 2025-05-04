import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { remove, session, userDataAPI } from '../_utils/moviebook.utils';
import { User } from '../_models/user.modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private router=inject(Router)
  private userService=inject(UsersService)

  constructor() {
    const sessionData = localStorage.getItem('currentSession');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          this.currentUserSubject.next(parsed.user);
        } else {
          console.warn('Session expired');
          remove();
        }
      } catch (e) {
        console.error('Failed to parse session data:', e);
        remove();
      }
    }
  }
  
  login(userData: any) {
    console.log("UserData in AuthService:", userData);
     
   session(userData);
    this.currentUserSubject.next(userData);
    const role = (userData.role || '').toLowerCase();
    this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/dashboard']);
  }
  //logout
  logout(redirect:boolean=false) {
    remove()
    this.currentUserSubject.next(null);
    if(redirect){
      this.router.navigate(['/dashboard'])
    }
    else{
      this.router.navigate(['/login'])
    }
  }

  //get logged user object
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn() {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? (user.role?.toLowerCase() === 'admin' || user.isAdmin === true) : false;
  }
  
}