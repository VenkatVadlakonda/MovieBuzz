import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminmoviesPipe } from "../../../_pipes/adminmovies.pipe";
import { forkJoin } from 'rxjs';
import { MovieAPI } from '../../../_models/movies.modal';

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
        isActive: movie.isActive || true
      },
      shows: this.showList
        .filter(show => !this.isEdit||show.showId !== 0) 
        .map(show => ({
          showId: show.showId || 0,
          movieId: this.isEdit ? movie.movieId : 0,
          showDate: this.formatDateToYYYYMMDD(show.showDate),
          showTime: show.showTime.trim(),
          availableSeats: show.availableSeats
        }))
    };
    debugger;
  
    if (this.isEdit && movie.movieId) {
      // First update the movie and existing shows
      this.movieService.updateMovieAPI(movie.movieId, movieObj).subscribe({
        next: () => {
          
          const newShows = this.showList.filter(show => show.showId === 0);
          if (newShows.length > 0) {
            this.addNewShows(movie.movieId, newShows);
          } else {
            this.getMovies();
            this.onCancel();
          }
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('Failed to update movie. Please try again.');
        }
      });
    } else {
      
      this.movieService.addMovieAPI(movieObj).subscribe({
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

  private addNewShows(movieId: number, newShows: any[]): void {
    const showObservables = newShows.map(show => {
      const showObj= {
        movieId: movieId,
        showTime: show.showTime.trim(),
        showDate: this.formatDateToYYYYMMDD(show.showDate),
        availableSeats: show.availableSeats
      };
      return this.movieService.addShowAPI(showObj);
    });
  
    // Execute all show additions in parallel
    forkJoin(showObservables).subscribe({
      next: () => {
        this.getMovies();
        this.onCancel();
      },
      error: (err) => {
        console.error('Error adding new shows', err);
        alert('Movie updated but failed to add some new shows. Please check.');
        this.getMovies();
        this.onCancel();
      }
    });
  }
  private validateForm(): boolean {
    
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
    if(!this.validateShowTimes()){
      return false;
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
  // private validateShowTimes(): boolean {
  //   const now = new Date();
  //   const currentDate = now.toISOString().split('T')[0];
  //   const currentHours = now.getHours();
  //   const currentMinutes = now.getMinutes();
  
  //   for (const show of this.showList) {
  //     if (!show.showDate || !show.showTime) continue;
  
    
  //     const showDate = this.formatDateToYYYYMMDD(show.showDate);
      
      
  //     const timeMatch = show.showTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  //     if (!timeMatch) {
  //       alert(`Invalid time format for show: ${show.showTime}. Please use format like "10:00 AM" or "13:30"`);
  //       return false;
  //     }
  
  //     let hours = parseInt(timeMatch[1], 10);
  //     const minutes = parseInt(timeMatch[2], 10);
  //     const period = timeMatch[3]?.toUpperCase();
  
  //     if (period === 'PM' && hours < 12) {
  //       hours += 12;
  //     } else if (period === 'AM' && hours === 12) {
  //       hours = 0;
  //     }
  
  //    if(!this.isEdit){
  //     if (showDate < currentDate) {
  //       alert(`Show date ${show.showDate} is in the past. Please select a future date.`);
  //       return false;
  //     } else if (showDate === currentDate) {
  //       if (hours < currentHours || (hours === currentHours && minutes < currentMinutes)) {
  //         alert(`Show time ${show.showTime} is in the past for today. Please select a future time.`);
  //         return false;
  //       }
  //     }
  //    }
  
  //     if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
  //       alert(`Invalid time: ${show.showTime}. Hours must be 0-23 and minutes 0-59.`);
  //       return false;
  //     }
  //   }
  
  //   return true;
  // }
  

  private validateShowTimes(): boolean {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
  
    // Loop through the shows to check for conflicts
    for (const show of this.showList) {
      if (!show.showDate || !show.showTime) continue;
  
      const showDate = this.formatDateToYYYYMMDD(show.showDate);
  
      // Parse the time in showTime to extract hours and minutes
      const timeMatch = show.showTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!timeMatch) {
        alert(`Invalid time format for show: ${show.showTime}. Please use format like "10:00 AM"`);
        return false;
      }
  
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3]?.toUpperCase();
  
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
  
      // Check if the show time is in the past
      if (!this.isEdit) {
        if (showDate < currentDate) {
          alert(`Show date ${show.showDate} is in the past. Please select a future date.`);
          return false;
        } else if (showDate === currentDate) {
          if (hours < currentHours || (hours === currentHours && minutes < currentMinutes)) {
            alert(`Show time ${show.showTime} is in the past for today. Please select a future time.`);
            return false;
          }
        }
      }
  
 
      for (const existingShow of this.showList) {
        if (existingShow === show) continue; 
  
        const existingShowDate = this.formatDateToYYYYMMDD(existingShow.showDate);
        const existingShowTime = existingShow.showTime.trim();

        if (existingShowDate === showDate && existingShowTime === show.showTime) {
          alert(`A show is already scheduled for this time (${show.showTime}) on this date (${showDate}). Please select a different time.`);
          return false;
        }
      }
    }
  
    return true;
  }

  onToggleActive(movie: any): void {
    this.movieService.toggleStatus(movie.movieId).subscribe({
      next: () => this.getMovies(),
      error: (err) => console.error('Toggle status failed', err),
    });
  }
}
