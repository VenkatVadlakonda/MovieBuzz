import { Pipe, PipeTransform } from '@angular/core';
import { Movies } from '../_models/movies.modal';

@Pipe({
  name: 'adminmovies',
})
export class AdminmoviesPipe implements PipeTransform {
  transform(moviesData: Movies[], searchItem: string): Movies[] {
    return moviesData.filter(
      (data) =>
        data.MovieName.toLocaleLowerCase().includes(
          searchItem.toLocaleLowerCase()
        ) ||
        data.Genre.split(', ')
          .toString()
          .toLocaleLowerCase()
          .includes(searchItem.toLocaleLowerCase())
    );
  }
}
