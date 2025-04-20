import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Movies } from '../_models/movies.modal';

@Pipe({
  name: 'movies',
  standalone:true
})
@Injectable({ providedIn: 'root' }) 
export class MoviesPipe implements PipeTransform {

  transform(moviesData: Movies[], searchMovie: string,selectedGenre?:string|null): Movies[] {
    if (!moviesData) return [];

    let filtered = moviesData;

    if (searchMovie) {
      filtered = filtered.filter(movie =>
        movie.MovieName.toLowerCase().includes(searchMovie.toLowerCase())
      );
    }

    if (selectedGenre && selectedGenre !== 'All') {
      filtered = filtered.filter(movie =>
        movie.Genre.toLowerCase().split(',').map(g => g.trim()).includes(selectedGenre.toLowerCase())
      );
    }

    return filtered;
  }

}
