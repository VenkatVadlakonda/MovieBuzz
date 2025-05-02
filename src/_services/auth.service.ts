import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { remove, session } from '../_utils/moviebook.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private router=inject(Router)
  private userService=inject(UsersService)

  constructor() {
    const session = localStorage.getItem('currentSession');
    if (session) {
      this.currentUserSubject.next(JSON.parse(session).user);
    }
    
  }

  //user login, login session open for 30mins and if user logs in display user UI if admin , admin UI
  login(userData: any) {
    const sessionData = {
      user: userData, 
    };
    
    session(sessionData)
    this.userService.loginUser(userData).subscribe({
      next:()=>{

        console.log("Login Successfull",userData)
      },
      error:(error)=>{
        console.log("Error Occurried",error)
      }
    })
    
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