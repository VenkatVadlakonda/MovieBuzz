import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, switchMap } from 'rxjs';
import { Movies, ShowTime } from '../_models/movies.modal';
import { log } from 'ng-zorro-antd/core/logger';
import { Booking } from '../_models/booking.modal';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http:HttpClient) { }

  private url="https://localhost:7084/Movies"

  //getting movies form API
  getMoviesAPI():Observable<Movies[]>{
    return this.http.get<Movies[]>(this.url)
  }

  getMovieByID(id:number):Observable<{success:boolean,data:Movies,message:string}>{
    return this.http.get<{success:boolean,data:Movies,message:string}>(`${this.url}/${id}`)
  }

  getShows(id:number):Observable<{success:boolean,data:Movies,message:string}>{
    return this.http.get<{success:boolean,data:Movies,message:string}>(`https://localhost:7084/Shows/movie/${id}`)
  }

  
  bookingMovie(movie:Booking):Observable<Booking>{
    return this.http.post<Booking>("https://localhost:7084/Bookings",movie)
  }

  getBookings(id:number):Observable<Booking>{
    return this.http.get<Booking>(`https://localhost:7084/Bookings/user/${id}`)
  }

  getAllBookingsForAdmin():Observable<Booking>{
    return this.http.get<Booking>("https://localhost:7084/Bookings/admin")
  }

  addMovieAPI(movieShows: any): Observable<Movies> {
    return this.http.post<Movies>(`${this.url}/with-shows`, movieShows);
  }

  updateMovieAPI(movieId: number, movieShows: any): Observable<Movies> {
    return this.http.put<Movies>(`${this.url}/with-shows/${movieId}`, movieShows);
  }

  toggleStatus(movieId: number): Observable<any> {
    return this.http.patch(`${this.url}/${movieId}/toggle-status`, {});
  }

  getShowsForMovie(movieId: number): Observable<Movies[]> {
    return this.http.get<Movies[]>(`https://localhost:7084/Shows/movie/${movieId}`);
  }

  addShowAPI(show: any): Observable<any> {
    return this.http.post('https://localhost:7084/Shows', show);
  }
  
  updateShowAPI(showId: number, show: any): Observable<any> {
    return this.http.put(`https://localhost:7084/Shows/${showId}`, show);
  }
  getAllShows():Observable<ShowTime>{
    return this.http.get<ShowTime>("https://localhost:7084/Shows")
  }

  





 

  
}
