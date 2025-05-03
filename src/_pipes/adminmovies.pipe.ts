import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'adminmovies',
})
export class AdminmoviesPipe implements PipeTransform {
  transform(movies: any[], search: string): any {
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
