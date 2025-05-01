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

  // onEditMovie(movie: any): void {
  //   this.selectedMovie = { ...movie };
  //   this.showTimeInput = movie.shows?.map((s: any) => s.showTime).join(', ') || '';
  //   this.selectedMovie.showDate = movie.shows?.[0]?.showDate || '';
  //   this.selectedMovie.availableSeats = movie.shows?.[0]?.availableSeats || 0;
  //   this.isEdit = true;
  //   this.selectedMovie = { ...movie };
  //   this.showList = movie.shows?.map((s: any) => ({
  //     showDate: s.showDate,
  //     showTime: s.showTime,
  //     availableSeats: s.availableSeats,
  //     showId: s.showId,
  //     movieId: s.movieId
  //   })) || [];
  //   this.isEdit = true;
  // }

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

  // saveMovie(movie: any): void {
  //   debugger
  //   const showTimes = this.showTimeInput.split(',')
  //       .map(time => time.trim())
  //       .filter(time => time.length > 0)
  //       .map(time => {
  //           // Convert to proper time format (e.g., "2:30 PM")
  //           if (!time.match(/[AP]M$/i)) {
  //               // Add AM/PM if not present
  //               return time + ' AM'; // or some default
  //           }
  //           return time;
  //       });

  //   const moviePayload = {
  //       movie: {
  //           movieName: movie.movieName,
  //           genre: movie.genre,
  //           ageRestriction: movie.ageRestriction,
  //           duration: movie.duration,
  //           description: movie.description,
  //           price: movie.price,
  //           posterImageUrl: movie.posterImageUrl,
  //           trailerUrl: movie.trailerUrl
  //       },
  //       shows: showTimes.map(time => ({
  //           showTime: time,
  //           showDate: movie.showDate, // Ensure this is in "YYYY-MM-DD" format
  //           availableSeats: movie.availableSeats || 100 // default value
  //       }))
  //   };

  //   const shows = this.showTimeInput.split(',').map((time, index) => {
  //     const baseShow = {
  //       showTime: time.trim(),
  //       showDate: new Date(movie.showDate).toISOString().split('T')[0],
  //       availableSeats: movie.availableSeats,
  //     };

  //     if (this.isEdit && movie.shows && movie.shows[index]) {
  //       return {
  //         ...baseShow,
  //         movieId: movie.movieId,
  //         showId: movie.shows[index].showId
  //       };
  //     }

  //     return baseShow;
  //   });

  //   const finalPayload = { ...moviePayload, shows };

  //   if (this.isEdit && movie.movieId) {
  //     debugger
  //     this.movieService.updateMovieAPI(movie.movieId, finalPayload).subscribe({
  //       next: (data) => {
  //         console.log(data)
  //         this.getMovies();
  //         this.onCancel();
  //       },
  //       error: (err) => console.error('Update failed', err)
  //     });
  //   } else {
  //     this.movieService.addMovieAPI(finalPayload).subscribe({
        
  //       next: (data) => {
  //         console.log(data)
  //         this.getMovies();
  //         this.onCancel();
  //       },
  //       error: (err) => console.error('Add failed', err)
  //     });
  //   }
  // }

  // saveMovie(movie: any): void {
  //   const formattedShowDate = this.formatDateToYYYYMMDD(movie.showDate); // FIXED
  
  //   const inputShowTimes = this.showTimeInput.split(',')
  //     .map(time => time.trim())
  //     .filter(time => time.length > 0)
  //     .map(time => {
  //       // Ensure time is in "hh:mm AM/PM" format
  //       if (!time.match(/[AP]M$/i)) {
  //         return time + ' AM'; // default fallback
  //       }
  //       return time;
  //     });
  
  //   // Prepare shows payload
  //   const shows: any[] = [];
  
  //   inputShowTimes.forEach(inputTime => {
  //     const matchedExistingShow = movie.shows?.find((s: any) =>
  //       s.showTime === inputTime && s.showDate === formattedShowDate
  //     );
  
  //     if (matchedExistingShow) {
  //       // Preserve existing showId and movieId
  //       shows.push({
  //         showId: matchedExistingShow.showId,
  //         movieId: movie.movieId,
  //         showTime: matchedExistingShow.showTime,
  //         showDate: matchedExistingShow.showDate,
  //         availableSeats: movie.availableSeats, // Update seats if needed
  //       });
  //     } else {
  //       // New show to be added
  //       shows.push({
  //         showTime: inputTime,
  //         showDate: formattedShowDate,
  //         availableSeats: movie.availableSeats || 100,
  //       });
  //     }
  //   });
  
  //   const finalPayload = {
  //     movie: {
  //       movieName: movie.movieName,
  //       genre: movie.genre,
  //       ageRestriction: movie.ageRestriction,
  //       duration: movie.duration,
  //       description: movie.description,
  //       price: movie.price,
  //       posterImageUrl: movie.posterImageUrl,
  //       trailerUrl: movie.trailerUrl,
  //     },
  //     shows: shows
  //   };
    
  
  //   if (this.isEdit && movie.movieId) {
  //     this.movieService.updateMovieAPI(movie.movieId, finalPayload).subscribe({
  //       next: () => {
  //         this.getMovies();
  //         this.onCancel();
  //       },
  //       error: (err) => console.error('Update failed', err)
  //     });
  //   } else {
  //     this.movieService.addMovieAPI(finalPayload).subscribe({
  //       next: () => {
  //         this.getMovies();
  //         this.onCancel();
  //       },
  //       error: (err) => console.error('Add failed', err)
  //     });
  //   }
  //   console.log('Sending payload:', JSON.stringify(finalPayload, null, 2));

  // }

  saveMovie(movie: any): void {
    if (!this.showList.length) {
      console.error('No shows added! Cannot save movie.');
      return;
    }
  
    // Convert date format if necessary
    this.showList = this.showList.map(show => ({
      showDate: this.formatDateToYYYYMMDD(show.showDate),
      showTime: show.showTime.trim(),
      availableSeats: show.availableSeats || 100,
      ...(this.isEdit ? { showId: show.showId, movieId: movie.movieId } : {})
    }));
  
    // Construct the final payload
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
      shows: this.showList // Use `showList` instead of `showTimeInput`
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
