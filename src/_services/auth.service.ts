import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdmin:boolean=false;
  private isLoggedIn:boolean=false;

  constructor() { }

  login(username:string,password:string):boolean{
    if(username=='admin' && password=='admin123'){
      this.isAdmin=true;
      this.isLoggedIn=true;
      return true
    }
    else if(username && password){
      this.isAdmin=false;
      this.isLoggedIn=true;
      return true;
    }
    return false;

  }
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  isUserAdmin(): boolean {
    return this.isAdmin;
  }

  logout() {
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}
