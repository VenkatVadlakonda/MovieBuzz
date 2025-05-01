import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, switchMap } from 'rxjs';
import { MovieAPI, Movies } from '../_models/movies.modal';
import { log } from 'ng-zorro-antd/core/logger';
import { Booking } from '../_models/booking.modal';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private apiUrl="http://localhost:3000/MovieBuzz";

  constructor(private http:HttpClient) { }

  //get all movies
  getAllMovies():Observable<Movies[]>{
    return this.http.get<Movies[]>(this.apiUrl);
  }

  updateAvaliableSeats(movieID:number,seats:number):Observable<any>{
    return this.http.patch(`${this.apiUrl}/${movieID}`,{AvailableSeats:seats})
  }


  //adds new movie from admin
  addMovie(movie:Movies):Observable<Movies>{
    return this.http.post<Movies>(this.apiUrl,movie)
  }

  //update the movie after modifying
  updateMovie(movie:Movies):Observable<Movies>{
    console.log("ID:",movie.MovieID)
    return this.http.put<Movies>(`${this.apiUrl}/${movie.MovieID}`, movie)

  }
  private url="https://localhost:7084/Movies"

  //getting movies form API
  getMoviesAPI():Observable<any>{
    return this.http.get<any>(this.url)
  }

  getMovieByID(id:number):Observable<{success:boolean,data:MovieAPI,message:string}>{
    return this.http.get<{success:boolean,data:MovieAPI,message:string}>(`${this.url}/${id}`)
  }

  getShows(id:number):Observable<{success:boolean,data:MovieAPI,message:string}>{
    return this.http.get<{success:boolean,data:MovieAPI,message:string}>(`https://localhost:7084/Shows/movie/${id}`)
  }

  
  bookingMovie(movie:Booking):Observable<Booking>{
    return this.http.post<Booking>("https://localhost:7084/Bookings",movie)
  }

  getBookings(id:number):Observable<any>{
    return this.http.get<any>(`https://localhost:7084/Bookings/user/${id}`)
  }

  getAllBookingsForAdmin():Observable<Booking>{
    return this.http.get<Booking>("https://localhost:7084/Bookings/admin")
  }

  addMovieAPI(movieShows: any): Observable<any> {
    return this.http.post(`${this.url}/with-shows`, movieShows);
  }

  updateMovieAPI(movieId: number, movieShows: any): Observable<any> {
    return this.http.put(`${this.url}/with-shows/${movieId}`, movieShows);
  }

  toggleStatus(movieId: number): Observable<any> {
    return this.http.patch(`${this.url}/${movieId}/toggle-status`, {});
  }

  getShowsForMovie(movieId: number): Observable<any> {
    return this.http.get(`https://localhost:7084/Shows/movie/${movieId}`);
  }

  addShowAPI(show: any): Observable<any> {
    return this.http.post('https://localhost:7084/Shows', show);
  }
  
  updateShowAPI(showId: number, show: any): Observable<any> {
    return this.http.put(`https://localhost:7084/Shows/${showId}`, show);
  }





 

  
}
