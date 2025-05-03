import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { remove, session, userDataAPI } from '../_utils/moviebook.utils';

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
  

  //user login, login session open for 30mins and if user logs in display user UI if admin , admin UI
  login(userData: any) {
    
    console.log("UserData:",userData)
    
    session(userData)
    
    
    this.currentUserSubject.next(userData);

    if(userData.isAdmin){
       this.router.navigate(['/admin-dashboard'])
    }
    else{
      this.router.navigate(['/dashboard'])
    }
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

  isAdmin() {
    return this.currentUserSubject.value?.isAdmin;
  }
  
}