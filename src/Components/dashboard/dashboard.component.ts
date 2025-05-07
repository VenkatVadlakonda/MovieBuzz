import { MoviesPipe } from './../../_pipes/movies.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../../_services/movies.service';

import { CommonModule } from '@angular/common';
import { catchError, finalize, throwError } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../../_services/auth.service';

import { getUserAge } from '../../_utils/dashboard.utils';
import { Movies } from '../../_models/movies.modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzCardModule,
    FormsModule,
    NzPaginationModule,
    MoviesPipe,

    NzSelectModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  movieAPI: Movies[]=[];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchMovie: string = '';
  currentPage: number = 1;
  pageSize: number = 4;

  //injecting services
  private movieService = inject(MoviesService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private moviesPipe = inject(MoviesPipe);

  genreList: string[] = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance','Horror','Crime','Mystery'];
  selectedGenre: string = 'All';
  ngOnInit(): void {
    
    this.getAPIMovies();
  }
  getAPIMovies() {
    this.isLoading = true;
    this.errorMessage = null;
    this.movieService
      .getMoviesAPI()
      .pipe(
        catchError((error) => {
          console.error('Error Occurred:', error);
          this.errorMessage = 'Failed to fetch the Movies Data';
          return throwError(() => new Error(error));
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('API Response:', data);

          let moviesArray: any[] = [];

          if (Array.isArray(data)) {
            moviesArray = data.filter(data=>data.isActive=data.isActive);
          } else if (data && Array.isArray(data.data)) {
            moviesArray = data.data.filter((data:any)=>data.isActive=data.isActive);
          } else if (data && typeof data === 'object') {
            moviesArray = [data.filter((data:any)=>data.isActive=data.isActive)];
          }
          console.log('Movie', moviesArray.filter(data=>data.isActive=data.isActive));

          const user = this.authService.getCurrentUser();
          console.log('User:', user);
          
         
          if (!user || !user.data) {
            console.log('No user data available');
            this.movieAPI = moviesArray;
            return;
          }

          console.log('User DOB:', user.data.dateOfBirth);

          // if (user.data.dateOfBirth) {
          //   const userAge = getUserAge(user.data.dateOfBirth);
          //   console.log('User Age:', userAge);

          //   this.movieAPI = moviesArray.filter((movie) => {
          //     const restriction = Number(movie.ageRestriction || 0);
          //     return userAge >= restriction;
          //   });
          // } 
          // else {
          //   this.movieAPI = moviesArray;
          // }

          console.log('Filtered Movies:', this.movieAPI);
        },
        error: (err) => {
          console.error('Error:', err);
          alert(err.error?.message)
          this.errorMessage = err.message || 'Failed to fetch movies';
          this.movieAPI = [];
        },
      });
  }

  //pagination logic for page to display 4 movie cards
  get paginatedMovies(): any[] {
    const filtered = this.moviesPipe.transform(
      this.movieAPI,
      this.searchMovie,
      this.selectedGenre
    );
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  get totalMovies(): number {
    return this.moviesPipe.transform(
      this.movieAPI,
      this.searchMovie,
      this.selectedGenre
    ).length;
  }

  onMovieClick(movie: any) {
    const user = this.authService.getCurrentUser();
    if (!movie.isActive) {
      alert('This movie is not active');
      return;
    }
    if (!user) {
      alert('Please login to continue');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/movie', movie.movieId]);
    }
  }
}
