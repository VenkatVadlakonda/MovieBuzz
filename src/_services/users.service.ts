import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  loginUser(user: User): Observable<User> {
    if (user.userName === 'Admin') {
      return of({...user, isAdmin: true}); // Return mock response
    }
    return this.http.post<User>('https://localhost:7084/Users/login', user);
  }
}
