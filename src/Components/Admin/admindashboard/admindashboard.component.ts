import { Component, inject, OnInit } from '@angular/core';
import { Movies } from '../../../_models/movies.modal';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { AdminmoviesPipe } from '../../../_pipes/adminmovies.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminmoviesPipe],

  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss',
})
export class AdmindashboardComponent implements OnInit {
  

  movies: any[] = [];
  search:string=''
  selectedMovie: any = null;
  isEdit = false;
  showTimeInput: string = '';
  showList: any[] = [];

  constructor(private movieService: MoviesService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.movieService.getMoviesAPI().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.movies = data;
        } else if (data && data.data) {
          this.movies = data.data;
        }
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }
  addShow() {
    this.showList.push({
      showDate: '',
      showTime: '',
      availableSeats: 100
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
      showDate: '',
      availableSeats: 0,
      shows: []
    };
    this.isEdit = false;
    this.showTimeInput = '';
  }

  onEditMovie(movie: any): void {
    this.selectedMovie = { ...movie };
    this.showList = movie.shows?.map((s: any) => ({
      showDate: this.formatDateToYYYYMMDD(s.showDate),
      showTime: s.showTime,
      availableSeats: s.availableSeats,
      showId: s.showId,
      movieId: s.movieId
    })) || [];
  
    this.isEdit = true;
  }

  onCancel(): void {
    this.selectedMovie = null;
    this.isEdit = false;
  }

  saveMovie(movie: any): void {
    if (!this.showList.length) {
      console.error('No shows added! Cannot save movie.');
      return;
    }
  
    
    this.showList = this.showList.map(show => ({
      showDate: this.formatDateToYYYYMMDD(show.showDate),
      showTime: show.showTime.trim(),
      availableSeats: show.availableSeats || 100,
      ...(this.isEdit ? { showId: show.showId, movieId: movie.movieId } : {})
    }));
  
    const finalPayload = {
      movie: {
        movieName: movie.movieName,
        genre: movie.genre,
        ageRestriction: movie.ageRestriction,
        duration: movie.duration,
        description: movie.description,
        price: movie.price,
        posterImageUrl: movie.posterImageUrl,
        trailerUrl: movie.trailerUrl,
      },
      shows: this.showList 
    };
  
    console.log('Sending payload:', JSON.stringify(finalPayload, null, 2));
  
    if (this.isEdit && movie.movieId) {
      this.movieService.updateMovieAPI(movie.movieId, finalPayload).subscribe({
        next: () => {
          this.getMovies();
          this.onCancel();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.movieService.addMovieAPI(finalPayload).subscribe({
        next: () => {
          this.getMovies();
          this.onCancel();
        },
        error: (err) => console.error('Add failed', err)
      });
    }
  }
  
  formatDateToYYYYMMDD(dateStr: string): string {
    if (!dateStr) return ''; 
  
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr; 
  }
  
  onToggleActive(movie: any): void {
    this.movieService.toggleStatus(movie.movieId).subscribe({
      next: () => this.getMovies(),
      error: (err) => console.error('Toggle status failed', err),
    });
  }

}
