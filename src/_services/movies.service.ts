import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, switchMap } from 'rxjs';
import { Movies } from '../_models/movies.modal';
import { log } from 'ng-zorro-antd/core/logger';

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

 

  
}
