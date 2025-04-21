import { Component, inject, OnInit } from '@angular/core';
import { Movies } from '../../../_models/movies.modal';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { AdminmoviesPipe } from '../../../_pipes/adminmovies.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admindashboard',
  standalone:true,
  imports: [
    CommonModule,
    AdminmoviesPipe,
    FormsModule,
    
    
  ],
  
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss',
})
export class AdmindashboardComponent implements OnInit {
  moviesData: Movies[] = [];
    searchItem: string = '';
    selectedMovie: Movies | null = null;
    isEdit: boolean = false;
    showTimeInput: string = ''; // For comma-separated times
    private movieService = inject(MoviesService);

    ngOnInit(): void {
      this.getMovies();
    }

    getMovies(): void {
      this.movieService.getAllMovies().subscribe(data => this.moviesData = data);
    }

    modifyMovie(movie: Movies): void {
      this.selectedMovie = { ...movie };
      this.showTimeInput = movie.showTime.join(', ');
      this.isEdit = true;
    }

    // saveMovie(movie: Movies): void {
    //   const movieToSave = {
    //     ...movie,
    //     showTime: this.showTimeInput.split(',').map(t => t.trim()),
    //     CreatedOn: new Date().toISOString(),
    //     showDate: new Date(movie.showDate),
    //   };

    //   if (this.isEdit) {
    //     movieToSave.MovieID=movie.MovieID
    //     this.movieService.updateMovie(movieToSave).subscribe(() => {
    //       this.getMovies();
    //       this.selectedMovie = null;
    //     });
    //   } else {
    //     const id = Math.max(...this.moviesData.map(m => m.MovieID)) + 1;
    //     movieToSave.MovieID = id;
    //     this.movieService.addMovie(movieToSave).subscribe(() => {
    //       this.getMovies();
    //       this.selectedMovie = null;
    //     });
    //   }

    //   this.showTimeInput = '';
    // }
    saveMovie(movie: Movies): void {
      // Convert show times into an array
      const movieToSave = {
        ...movie,
        showTime: this.showTimeInput.split(',').map(t => t.trim()), // Split and trim the show times
        CreatedOn: new Date().toISOString(),
        showDate: new Date(movie.showDate).toISOString(), // Ensure it's an ISO string
      };

      if (this.isEdit) {
        movieToSave.MovieID = movie.MovieID;  // Ensure MovieID is retained for updating
        this.movieService.updateMovie(movieToSave).subscribe(
          () => {
            // On success, refresh the movie list
            this.getMovies();
            this.selectedMovie = null; // Close the modal
          },
          (error) => {
            console.error('Error updating movie:', error); // Log any errors
          }
        );
      } else {
        const id = Math.max(...this.moviesData.map(m => m.MovieID)) + 1;  // Generate new ID
        movieToSave.MovieID = id;
        this.movieService.addMovie(movieToSave).subscribe(
          () => {
            // On success, refresh the movie list
            this.getMovies();
            this.selectedMovie = null; // Close the modal
          },
          (error) => {
            console.error('Error adding movie:', error); // Log any errors
          }
        );
      }
      console.log('Updating movie:', movieToSave);

    }

    modalOpen(): void {
      this.selectedMovie = {
        MovieID: 0,
        MovieName: '',
        Genre: '',
        AgeRestriction: 0,
        Duration: 0,
        Description: '',
        Price: 0,
        PosterImageURL: '',
        TrailerURL: '',
        CreatedOn: new Date().toISOString(),
        IsActive: true,
        showDate: new Date().toISOString(),
        showTime: [],
        AvailableSeats: 0
      };
      this.showTimeInput = '';
      this.isEdit = false;
    }

    onToggleActive(movie: Movies): void {
      movie.IsActive = !movie.IsActive;
      this.movieService.updateMovie(movie).subscribe(() => this.getMovies());
    }


}
