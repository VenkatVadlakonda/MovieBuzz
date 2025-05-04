import { Pipe, PipeTransform } from '@angular/core';
import { Movies } from '../_models/movies.modal';


@Pipe({
  name: 'adminmovies',
})
export class AdminmoviesPipe implements PipeTransform {
  transform(movies: Movies[], search: string): Movies[] {
    return movies.filter(
      (data) =>
        data.movieName.toLocaleLowerCase().includes(
          search.toLocaleLowerCase()
        ) ||
        data.genre.split(', ')
          .toString()
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
    );
  }
}
