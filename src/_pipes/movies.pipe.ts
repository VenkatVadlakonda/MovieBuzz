import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { MovieAPI } from '../_models/movies.modal';

@Pipe({
  name: 'movies',
  standalone:true
})
@Injectable({ providedIn: 'root' }) 
export class MoviesPipe implements PipeTransform {

  transform(movieAPI: MovieAPI[], searchMovie: string,selectedGenre?:string|null): MovieAPI[] {
    if (!movieAPI) return [];

    let filtered = movieAPI;

    if (searchMovie) {
      filtered = filtered.filter(movie =>
        movie.movieName.toLowerCase().includes(searchMovie.toLowerCase())
      );
    }

    if (selectedGenre && selectedGenre !== 'All') {
      filtered = filtered.filter(movie =>
        movie.genre.toLowerCase().split(',').map((g:any) => g.trim()).includes(selectedGenre.toLowerCase())
      );
    }

    return filtered;
  }

}
