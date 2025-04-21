import { MoviesPipe } from './../../_pipes/movies.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../../_services/movies.service';
import { Movies } from '../../_models/movies.modal';
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
  moviesData: Movies[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  searchMovie: string = '';

  

  currentPage: number = 1;
  pageSize: number = 4; // movies per page

  private movieService = inject(MoviesService);
  private router = inject(Router);
  private authService=inject(AuthService)
  private moviesPipe=inject(MoviesPipe)
  
  genreList: string[] = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance'];
  selectedGenre: string = 'All';
  


  ngOnInit(): void {
    this.getMoviesData();
  }
  getMoviesData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.movieService
      .getAllMovies()
      .pipe(
        catchError((error) => {
          console.error('Error Occured:', error);
          this.errorMessage = 'Failed to fetch the Movies Data';
          return throwError(() => new Error(error));
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: Movies[]) => {
          const user=this.authService.getCurrentUser()
          console.log(user)

          if (user && user.dob) {
            const userAge = this.getUserAge(user.dob);
            console.log('User Age:', userAge);
  
            this.moviesData = data.filter(movie => {
              const restriction = Number(movie.AgeRestriction);
              return userAge >= restriction;
            });
          } else {
            this.moviesData = data;
          }
          
        },
        error: (err) => {
          alert(err);
        },
      });
  }
  get paginatedMovies(): Movies[] {
    const filtered = this.moviesPipe.transform(this.moviesData, this.searchMovie, this.selectedGenre);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalMovies(): number {
    return this.moviesPipe.transform(this.moviesData, this.searchMovie, this.selectedGenre).length;
  }

  onMovieClick(id:number){
    const user=this.authService.getCurrentUser();

    if(!user){
      alert("Please login to continue")
      this.router.navigate(['/login'])
    }else{
      this.router.navigate(['/movie',id])
    }
  }
  getUserAge(dob:string):number{
    const dateOfBirth=new Date(dob)
    const today=new Date()
    const month=today.getMonth()-dateOfBirth.getMonth()
    let age=today.getFullYear()-dateOfBirth.getFullYear()

    if(month<0||(month==0 && today.getDate()<dateOfBirth.getDate())){
      age--
    }
    
    
    return age

  }
}
