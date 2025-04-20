import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movies } from '../_models/movies.modal';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private apiUrl="http://localhost:3000/MovieBuzz";

  constructor(private http:HttpClient) { }

  getAllMovies():Observable<Movies[]>{
    return this.http.get<Movies[]>(this.apiUrl);
  }
  
}
