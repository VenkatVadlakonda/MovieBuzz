import { Component, inject, OnInit } from '@angular/core';
import { Movies } from '../../../_models/movies.modal';
import { MoviesService } from '../../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { AdminmoviesPipe } from '../../../_pipes/adminmovies.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, AdminmoviesPipe, FormsModule],

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

  //Displays all movies
  getMovies(): void {
    this.movieService
      .getAllMovies()
      .subscribe((data) => (this.moviesData = data));
  }

  //updated the movie based on selected movie object
  modifyMovie(movie: Movies): void {
    this.selectedMovie = { ...movie };
    this.showTimeInput = movie.showTime.join(', ');
    this.isEdit = true;
  }

  //after update and add saves the movie in db.json
  saveMovie(movie: Movies): void {
    const movieToSave = {
      ...movie,
      id: movie.MovieID,
      showTime: this.showTimeInput.split(',').map((t) => t.trim()),
      CreatedOn: new Date().toISOString(),
      showDate: new Date(movie.showDate).toISOString(),
    };

    if (this.isEdit) {
      movieToSave.MovieID = movie.MovieID;
      this.movieService.updateMovie(movieToSave).subscribe({
        next: () => {
          this.getMovies();
          this.selectedMovie = null;
        },
        error: (error) => {
          console.error('Error updating movie:', error);
        },
      });
    } else if (!this.isEdit) {
      const id = Math.max(...this.moviesData.map((m) => m.MovieID)) + 1;
      movieToSave.id = id;
      movieToSave.MovieID = id;
      this.movieService.addMovie(movieToSave).subscribe(
        () => {
          this.getMovies();
          this.selectedMovie = null;
        },
        (error) => {
          console.error('Error adding movie:', error);
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
      AvailableSeats: 0,
    };
    this.showTimeInput = '';
    this.isEdit = false;
  }

  //active and inactive movies
  onToggleActive(movie: Movies): void {
    const update = {
      ...movie,
      MovieID: movie.MovieID,
      IsActive: !movie.IsActive,
    };
    this.movieService.updateMovie(update).subscribe(() => this.getMovies());
  }
}
