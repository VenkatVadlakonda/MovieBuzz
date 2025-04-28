import { Component, inject, OnInit } from '@angular/core';
import { Movies } from '../../_models/movies.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import {
  extractYouTubeVideoID,
  generateShowDates,
} from '../../_utils/moviebook.utils';
import { MoviebookService } from '../../_services/moviebook.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-moviebook',
  standalone: true,
  imports: [CommonModule, FormsModule, NzModalModule],
  templateUrl: './moviebook.component.html',
  styleUrl: './moviebook.component.scss',
})
export class MoviebookComponent implements OnInit {
  movieID: number = 0;
  movieData: any;
  trailerurl: SafeResourceUrl = '';

  selectedDate: string = '';
  selectedTime: string = '';
  ticketCount: number = 0;
  totalPrice: number = 0;
  showDates: string[] = [];
  bookingId: number = 200;

  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private movieService = inject(MoviesService);
  private safe = inject(DomSanitizer);
  private bookingService = inject(MoviebookService);
  private authService = inject(AuthService);
  private modal = inject(NzModalService);

  //display movie based on ID
  ngOnInit(): void {
    this.movieID = Number(this.router.snapshot.paramMap.get('id'));
    this.getMovie();
    this.showDates = generateShowDates();
    this.selectedDate = this.showDates[0];
  }

  //displays the movie based on selected ID
  getMovie(): void {
    this.movieService.getAllMovies().subscribe((movies: Movies[]) => {
      this.movieData = movies.find((movie) => movie.MovieID === this.movieID);
      if (this.movieData && this.movieData.TrailerURL) {
        const videoID = extractYouTubeVideoID(this.movieData.TrailerURL);
        const embed = `https://www.youtube.com/embed/${videoID}`;
        this.trailerurl = this.safe.bypassSecurityTrustResourceUrl(embed);
      }
    });
  }

  increaseQuantity(): void {
    if (this.ticketCount < 6) {
      this.ticketCount++;
      this.calculateTotal();
    }
    
  }

  decreaseQuantity(): void {
    if (this.ticketCount > 0) {
      this.ticketCount--;
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.totalPrice = this.ticketCount * (this.movieData?.Price || 0);
  }

  //confirmation box before booking ticket
  showBookingSummary(): void {
    this.modal.confirm({
      nzTitle: 'Confirm Booking',
      nzContent: `
        <h1>Movie:</h1> ${this.movieData.MovieName} <br/>
        <b>Date:</b> ${this.selectedDate} <br/>
        <b>Time:</b> ${this.selectedTime} <br/>
        <b>Tickets:</b> ${this.ticketCount} <br/>
        <b>Total Price:</b> Rs. ${this.totalPrice}
      `,
      nzOnOk: () => this.storeBooking(),
    });
  }

  //after successfull booking storing the data
  storeBooking(): void {
    const user = this.authService.getCurrentUser();
    const remainingSeats = this.movieData.AvailableSeats - this.ticketCount;
    if (remainingSeats < 0) {
      alert('Not enough seats available!');
      return;
    }
    const newBooking = {
      bookingId: this.bookingService.getNextBookingId(),
      movieId: this.movieID,
      movieName: this.movieData.MovieName,
      genre: this.movieData.Genre,
      imageURL: this.movieData.PosterImageURL,
      date: this.selectedDate,
      time: this.selectedTime,
      Quantity: this.ticketCount,
      totalPrice: this.totalPrice,
      userId: user.id,
      Username: user.userName,
    };

    this.movieService
      .updateAvaliableSeats(this.movieID, remainingSeats)
      .subscribe(() => {
        this.movieData.AvailableSeats = remainingSeats;
      });
    this.bookingService.saveBooking(newBooking);

    alert('Booking Successful!');
    this.route.navigate(['/history']);
    this.ticketCount = 0;
    this.selectedDate = '';
    this.selectedTime = '';
  }

  //booking a movie
  bookNow(): void {
    if (this.ticketCount === 0) {
      alert('Please select at least 1 ticket');
      return;
    }
    if (this.ticketCount > 6) {
      alert('Maximum limit reached');
      return;
    }

    const remainingSeats = this.movieData.AvailableSeats - this.ticketCount;
    const user = this.authService.getCurrentUser();

    if (remainingSeats < 0) {
      alert('Not enough seats available!');
      return;
    }

    if (confirm('Do you want to confirm your booking?')) {
      this.movieService
        .updateAvaliableSeats(this.movieID, remainingSeats)
        .subscribe(() => {
          this.movieData.AvailableSeats = remainingSeats;

          const newBooking = {
            bookingId: this.bookingService.getNextBookingId(),
            movieId: this.movieID,
            movieName: this.movieData.MovieName,
            genre: this.movieData.Genre,
            imageURL: this.movieData.PosterImageURL,
            date: this.selectedDate,
            time: this.selectedTime,
            Quantity: this.ticketCount,
            totalPrice: this.totalPrice,
            userId: user.id,
            Username: user.userName,
          };

          this.bookingService.saveBooking(newBooking);

          alert('Booking successful!');
        });
    }
  }

  //if the is past it wil disable
  isTimeDisabled(time: string): boolean {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const dateTimeString = `${this.selectedDate} ${time}`;
    const selectedDateTime = new Date(dateTimeString);

    if (isNaN(selectedDateTime.getTime())) return false;
    const today = new Date();
    const isToday =
      selectedDateTime.getDate() === today.getDate() &&
      selectedDateTime.getMonth() === today.getMonth() &&
      selectedDateTime.getFullYear() === today.getFullYear();

    return isToday && selectedDateTime <= now;
  }
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
