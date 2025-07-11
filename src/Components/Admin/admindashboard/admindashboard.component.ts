import { routes } from './../../../app/app.routes';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminmoviesPipe } from '../../../_pipes/adminmovies.pipe';
import { forkJoin } from 'rxjs';
import { Movies } from '../../../_models/movies.modal';
import {
  formatDateForInput,
  formatDateToYYYYMMDD,
  validateShowTimes,
} from '../../../_utils/admindashboard.utils';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminmoviesPipe],

  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss',
})
export class AdmindashboardComponent implements OnInit {
  movies: Movies[] = [];
  search: string = '';
  selectedMovie: any;
  isEdit: boolean = false;
  showList: any[] = [];
  display: string = '';
  c: boolean = false;
  count: number = 0;
  isLoading: boolean = false;
  constructor(
    private movieService: MoviesService,
    private cdr: ChangeDetectorRef,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.isLoading = true;
    this.movieService.getMoviesAPI().subscribe({
      next: (data: any) => {
        this.movies = Array.isArray(data) ? data : data?.data || [];
        this.count = this.movies.length;
        this.isLoading = false;
        if (this.count == 0) {
          this.c = true;
          this.display = 'No Movies Found';
        }
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        // alert(err.error?.errors)
        alert(err.error.message)
        // const backendErrors = err.error?.errors;


        
        this.isLoading = false;
        this.c = true;
        this.display = 'Error Fetching Movies';
      },
    });
  }

  addShow() {
    this.showList.push({
      showDate: '',
      showTime: '',
      availableSeats: 100,
      showId: 0,
    });
  }

  onAddMovie(): void {
    this.selectedMovie = {
      movieName: '',
      genre: '',
      ageRestriction: null,
      duration: null,
      description: '',
      price: 0,
      posterImageUrl: '',
      trailerUrl: '',
    };
    this.showList = [];
    this.addShow();
    this.isEdit = false;
  }

  onEditMovie(movie: any): void {
    
    this.movieService.getMovieByID(movie.movieId).subscribe({
      next: (movieDetails: any) => {
        const movies = Array.isArray(movieDetails)
          ? movieDetails
          : movieDetails?.data || [];
        this.selectedMovie = {
          movieId: movies.movieId,
          movieName: movies.movieName,
          genre: movies.genre,
          ageRestriction: movies.ageRestriction,
          duration: movies.duration,
          description: movies.description,
          price: movies.price,
          posterImageUrl: movies.posterImageUrl,
          trailerUrl: movies.trailerUrl,
          isActive: movies.isActive || true,
        };

        this.movieService.getShowsForMovie(movie.movieId).subscribe({
          next: (showsResponse: any) => {
            const shows = showsResponse.data || showsResponse || [];
            this.showList = shows.map((show: any) => ({
              showId: show.showId,
              movieId: show.movieId,
              showDate: formatDateForInput(show.showDate),
              showTime: show.showTime,
              availableSeats: show.availableSeats || 100,
            }));

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading shows:', err);
            const backendErrors = err.error?.errors;
            alert(err.error.message)
            alert(err.error?.errors)

            if (backendErrors) {
              const messages = Object.values(backendErrors).flat();
              alert(messages.join('\n'));
            } else {
              alert(err.error?.title || 'Something went wrong');
            }
            this.showList = [];
          },
        });

        this.isEdit = true;
      },
      error: (err) => {
        console.error('Error loading movie details:', err);
        const backendErrors = err.error?.errors;
        alert(err.error.message)

        if (backendErrors) {
          const messages = Object.values(backendErrors).flat();
          alert(messages.join('\n'));
        } else {
          alert(err.error?.title || 'Something went wrong');
        }
      },
    });
  }

  onCancel(): void {
    this.selectedMovie = null;
    this.showList = [];
    this.isEdit = false;
  }

  saveMovie(movie: any): void {
    
    if (!this.validateForm()) {
      return;
    }

    const movieObj = {
      movie: {
        movieId: this.isEdit ? movie.movieId : 0,
        movieName: movie.movieName,
        genre: movie.genre,
        ageRestriction: movie.ageRestriction,
        duration: movie.duration,
        description: movie.description,
        price: movie.price,
        posterImageUrl: movie.posterImageUrl,
        trailerUrl: movie.trailerUrl,
        isActive: movie.isActive || true,
      },
      shows: this.showList
        .filter((show) => !this.isEdit || show.showId !== 0)
        .map((show) => ({
          showId: show.showId || 0,
          movieId: this.isEdit ? movie.movieId : 0,
          showDate: formatDateToYYYYMMDD(show.showDate),
          showTime: show.showTime.trim(),
          availableSeats: show.availableSeats,
        })),
    };
    

    if (this.isEdit && movie.movieId) {
      this.movieService.updateMovieAPI(movie.movieId, movieObj).subscribe({
        next: () => {
          const newShows = this.showList.filter((show) => show.showId === 0);
          if (newShows.length > 0) {
            this.addNewShows(movie.movieId, newShows);
          } else {
            this.getMovies();
            this.onCancel();
          }
        },
        error: (err) => {
          console.error('Update failed', err);
          const backendErrors = err.error?.errors;
          console.log(err.error?.errors)
          alert(err.error?.errors)

          if (backendErrors) {
            const messages = Object.values(backendErrors).flat();
            alert(messages.join('\n'));
          } else {
            alert(err.error?.title || 'Something went wrong');
          }
        },
      });
    } else {
      this.movieService.addMovieAPI(movieObj).subscribe({
        next: () => {
          this.getMovies();
          this.onCancel();
        },
        error: (err) => {
          console.error('Add failed', err);
          const backendErrors = err.error?.errors;
          alert(err.error.message)
          
          if (backendErrors) {
            const messages = Object.values(backendErrors);
            alert(messages.join('\n'));
          } else {
            alert(err.error?.message);
          }
        },
      });
    }
  }

  private addNewShows(movieId: number, newShows: any[]): void {
    debugger
    const showObservables = newShows.map((show) => {
      const showObj = {
        movieId: movieId,
        showTime: show.showTime.trim(),
        showDate: formatDateToYYYYMMDD(show.showDate),
        availableSeats: show.availableSeats,
      };
      return this.movieService.addShowAPI(showObj);
    });

    forkJoin(showObservables).subscribe({
      next: () => {
        this.getMovies();
        this.onCancel();
      },
      error: (err) => {
        alert(err.error.message)
        alert(err.error?.errors.ShowDate)

        this.getMovies();
        this.onCancel();
      },
    });
  }
  private validateForm(): boolean {
    if (
      !this.selectedMovie.movieName ||
      !this.selectedMovie.genre ||
      !this.selectedMovie.ageRestriction ||
      !this.selectedMovie.duration ||
      !this.selectedMovie.description ||
      !this.selectedMovie.price ||
      !this.selectedMovie.posterImageUrl ||
      !this.selectedMovie.trailerUrl
    ) {
      alert('Please fill all movie details');
      return false;
    }

    if (this.showList.length === 0) {
      alert('Please add at least one show');
      return false;
    }

    for (const show of this.showList) {
      if (!show.showDate || !show.showTime || !show.availableSeats) {
        alert('Please fill all show details');
        return false;
      }
    }
    if (!validateShowTimes(this.showList, this.isEdit)) {
      return false;
    }

    return true;
  }

  onToggleActive(movie: any): void {
    const action = movie.isActive ? 'inactive' : 'active';
    const confirmation = confirm(`Do you want to ${action} this movie?`);
  
    if (confirmation) {
      this.movieService.toggleStatus(movie.movieId).subscribe({
        next: () => this.getMovies(),
        error: (err) => {
          alert(err.error?.message)
        },
      });
    }
  }
  
}