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
import { log } from 'ng-zorro-antd/core/logger';

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

  movieAPI: any;
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
    // this.getMoviesData();
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
            moviesArray = data;
          } else if (data && Array.isArray(data.data)) {
            moviesArray = data.data;
          } else if (data && typeof data === 'object') {
            moviesArray = [data];
          }
          console.log('Movie', moviesArray);

          const user = this.authService.getCurrentUser();
          console.log('User:', user);
          
          // Handle case where user or user.data is null/undefined
          if (!user || !user.data) {
            console.warn('No user data available - showing all movies');
            this.movieAPI = moviesArray;
            return;
          }

          console.log('User DOB:', user.data.dateOfBirth);

          if (user.data.dateOfBirth) {
            const userAge = this.getUserAge(user.data.dateOfBirth);
            console.log('User Age:', userAge);

            this.movieAPI = moviesArray.filter((movie) => {
              const restriction = Number(movie.ageRestriction || 0);
              return userAge >= restriction;
            });
          } else {
            this.movieAPI = moviesArray;
          }

          console.log('Filtered Movies:', this.movieAPI);
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = err.message || 'Failed to fetch movies';
          this.movieAPI = [];
        },
      });
  }

  //pagination logic for page display 4 movie cards
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

  //age filtering
  getUserAge(dob: string): number {
    const dateOfBirth = new Date(dob);
    const today = new Date();
    const month = today.getMonth() - dateOfBirth.getMonth();
    let age = today.getFullYear() - dateOfBirth.getFullYear();

    if (month < 0 || (month == 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
}
