import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Movies } from '../../../_models/movies.modal';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminmoviesPipe } from "../../../_pipes/adminmovies.pipe";

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminmoviesPipe],

  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss',
})
export class AdmindashboardComponent implements OnInit {
 
  movies: any[] = [];
  search: string = '';
  selectedMovie: any ;
  isEdit = false;
  showList: any[] = [];

  constructor(private movieService: MoviesService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.movieService.getMoviesAPI().subscribe({
      next: (data: any) => {
        this.movies = Array.isArray(data) ? data : (data?.data || []);
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
      availableSeats: 100,
      showId: 0 
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
      trailerUrl: ''
    };
    this.showList = [];
    this.addShow(); 
    this.isEdit = false;
  }

  onEditMovie(movie: any): void {
    this.movieService.getMovieByID(movie.movieId).subscribe({
      next: (movieDetails: any) => {
        // Ensure all fields are properly initialized
        const movies=Array.isArray(movieDetails)? movieDetails : (movieDetails?.data || [])
        this.selectedMovie = {
          movieId: movies.movieId,
          movieName: movies.movieName || '',
          genre: movies.genre || '',
          ageRestriction: movies.ageRestriction || null,
          duration: movies.duration || null,
          description: movies.description || '',
          price: movies.price || 0,
          posterImageUrl: movies.posterImageUrl || '',
          trailerUrl: movies.trailerUrl || '',
          isActive: movies.isActive || true
        };
  
        // Load shows for this movie
        this.movieService.getShowsForMovie(movie.movieId).subscribe({
          next: (showsResponse: any) => {
            const shows = showsResponse.data || showsResponse || [];
            this.showList = shows.map((show: any) => ({
              showId: show.showId,
              movieId: show.movieId,
              showDate: this.formatDateForInput(show.showDate),
              showTime: show.showTime || '',
              availableSeats: show.availableSeats || 100
            }));
  
            // Force UI update
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading shows:', err);
            this.showList = [];
          }
        });
  
        this.isEdit = true;
      },
      error: (err) => {
        console.error('Error loading movie details:', err);
      }
    });
  }
 
  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
   
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // For other formats, create a Date object
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
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

    const payload = {
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
        isActive: movie.isActive || true
      },
      shows: this.showList.map(show => ({
        showId: show.showId || 0,
        movieId: this.isEdit ? movie.movieId : 0,
        showDate: this.formatDateToYYYYMMDD(show.showDate),
        showTime: show.showTime.trim(),
        availableSeats: show.availableSeats
      }))
    };

    console.log('Sending payload:', payload); 

    if (this.isEdit && movie.movieId) {
      this.movieService.updateMovieAPI(movie.movieId, payload).subscribe({
        next: () => {
          this.getMovies();
          this.onCancel();
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('Failed to update movie. Please try again.');
        }
      });
    } else {
      this.movieService.addMovieAPI(payload).subscribe({
        next: () => {
          this.getMovies();
          this.onCancel();
        },
        error: (err) => {
          console.error('Add failed', err);
          alert('Failed to add movie. Please try again.');
        }
      });
    }
  }
  private validateForm(): boolean {
    // Validate movie details
    if (!this.selectedMovie.movieName || 
        !this.selectedMovie.genre || 
        !this.selectedMovie.ageRestriction ||
        !this.selectedMovie.duration ||
        !this.selectedMovie.description ||
        !this.selectedMovie.price ||
        !this.selectedMovie.posterImageUrl ||
        !this.selectedMovie.trailerUrl) {
      alert('Please fill all movie details');
      return false;
    }

    // Validate shows
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

    return true;
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
