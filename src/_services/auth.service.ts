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

  
  login(userData: any) {
    console.log("UserData in AuthService:", userData);
     
   session(userData);
    this.currentUserSubject.next(userData);
    // const role = (userData.data.user.role || '').toLowerCase();
    // this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/dashboard']);
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
    return this.currentUserSubject.value?.data?.user;
  }

  isLoggedIn() {
    return !!this.currentUserSubject.value?.data?.token;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? (user.data.user?.role === 'Admin') : false;
  }
//   getToken(): string  {
//     debugger
//   const currentUser = this.currentUserSubject.value;
  
//   console.log("current:",currentUser.data.token)
//   return currentUser.data.token || null;
// }
  getToken(): string | null {
  const session = this.currentUserSubject.value;

  if (session?.data.token) {
    console.log("token bhai:",session.data.token)
    return session.data.token;
  }
  

  return null;
}
}