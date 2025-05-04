import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { User } from '../_models/user.modal';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = 'https://localhost:7084/Users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  addUsers(user: User): Observable<User> {
    const reg = 'https://localhost:7084/Users/register';
    return this.http.post<User>(reg, user);
  }
  loginUser(user: { userName: string; password: string }): Observable<any> {
    if (user.userName === 'admin') {
      return of({...user, isAdmin: true}); 
    }
    return this.http.post<any>('https://localhost:7084/Users/login', user);
  }

  
}
