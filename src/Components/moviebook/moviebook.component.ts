import { Component, inject, OnInit } from '@angular/core';
import { MovieAPI, Movies } from '../../_models/movies.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../_services/movies.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import {
  extractYouTubeVideoID,
  
} from '../../_utils/moviebook.utils';
import { MoviebookService } from '../../_services/moviebook.service';
import { AuthService } from '../../_services/auth.service';
import { showTime } from '../../_models/showtime.modal';
import { Booking } from '../../_models/booking.modal';

@Component({
  selector: 'app-moviebook',
  standalone: true,
  imports: [CommonModule, FormsModule, NzModalModule],
  templateUrl: './moviebook.component.html',
  styleUrl: './moviebook.component.scss',
})
export class MoviebookComponent implements OnInit {
  movieId: number = 0;
  movieAPI: MovieAPI | null = null;
  trailerurl: SafeResourceUrl | null = null;
  shows: any[] = [];

  selectedDate: string = '';
  selectedTime: string = '';
  selectedShow: showTime | null = null;
  ticketCount: number = 0;
  totalPrice: number = 0;
  showDates: string[] = [];
  showTimes: string[] = [];
  // bookingId: number = 200;
  newBooking: any;

  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private movieService = inject(MoviesService);
  private safe = inject(DomSanitizer);
  private bookingService = inject(MoviebookService);
  private authService = inject(AuthService);
  private modal = inject(NzModalService);

  ngOnInit(): void {
    this.movieId = Number(this.router.snapshot.paramMap.get('id'));
    this.loadMovieData();
  }

  loadMovieData(): void {
    // Get movie details
    this.movieService.getMovieByID(this.movieId).subscribe({
      next: (movieResponse) => {
        if (movieResponse?.success && movieResponse?.data) {
          this.movieAPI = movieResponse.data;
          this.processTrailerUrl();
          console.log(movieResponse)

          // Get show times for this movie
          this.movieService.getShows(this.movieId).subscribe({
            next: (showsResponse) => {
              if (showsResponse?.success && showsResponse?.data) {
                this.shows = Array.isArray(showsResponse.data)
                  ? showsResponse.data
                  : [showsResponse.data];
                this.processShowData();
                console.log('all shows:', this.shows);
              }
            },
            error: (err) => {
              console.error('Error fetching shows:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching movie:', err);
        this.route.navigate(['/dashboard']);
      },
    });
  }

  private processTrailerUrl(): void {
    if (this.movieAPI?.trailerUrl) {
      const videoID = extractYouTubeVideoID(this.movieAPI.trailerUrl);
      if (videoID) {
        this.trailerurl = this.safe.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoID}`
        );
      }
    }
  }

  private processShowData(): void {

    this.showDates = [...new Set(this.shows.map((show) => show.showDate))];

    if (this.showDates.length > 0) {
      this.selectedDate = this.showDates[0];
      this.onDateChange();
    }
  }

  onDateChange(): void {
  
    const showsForDate = this.shows.filter(
      (show) => show.showDate === this.selectedDate
    );

    this.showTimes = showsForDate.map((show) => show.showTime);

    this.selectedTime = '';
    this.selectedShow = null;
    this.ticketCount = 0;
    this.totalPrice = 0;
  }

  onTimeChange(): void {
 
    this.selectedShow =
      this.shows.find(
        (show) =>
          show.showDate === this.selectedDate &&
          show.showTime === this.selectedTime
      ) || null;


    this.ticketCount = 0;
    this.totalPrice = 0;
  }

  increaseQuantity(): void {
    if (
      this.selectedShow &&
      this.ticketCount < 6 &&
      this.ticketCount < this.selectedShow.availableSeats
    ) {
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
    if (this.movieAPI) {
      this.totalPrice = this.ticketCount * this.movieAPI.price;
    }
  }

  showBookingSummary(): void {
    if (!this.selectedShow) return;

    this.modal.confirm({
      nzTitle: 'Confirm Booking',
      nzContent: `
        <h1>Movie:</h1> ${this.movieAPI?.movieName} <br/>
        <b>Date:</b> ${this.selectedDate} <br/>
        <b>Time:</b> ${this.selectedTime} <br/>
        <b>Tickets:</b> ${this.ticketCount} <br/>
        <b>Total Price:</b> Rs. ${this.totalPrice}
      `,
      nzOnOk: () => this.storeBooking(),
    });
  }

  storeBooking(): void {
    if (!this.selectedShow || !this.movieAPI) return;

    const user = this.authService.getCurrentUser();
    const remainingSeats = this.selectedShow.availableSeats - this.ticketCount;

    if (remainingSeats < 0) {
      alert('Not enough seats available!');
      return;
    }

    const bookingPayload = {
      movieId: this.movieAPI.movieId,
      movieName: this.movieAPI.movieName,
      genre: this.movieAPI.genre,
      imageURL: this.movieAPI.posterImageUrl,
      showDate: this.selectedDate,
      showTime: this.selectedTime,
      numberOfTickets: this.ticketCount,
      totalPrice: this.totalPrice,
      userId: user.userId,
      userName: user.userName,
      showId: this.selectedShow.showId, 
    };

    console.log('Sending booking:', bookingPayload);

    this.bookingService.saveBooking(bookingPayload).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.modal.success({
          nzTitle: 'Booking Successful',
          nzContent: 'Your tickets have been booked successfully!',
          nzOnOk: () => this.route.navigate(['/history']),
        });
      },
      error: (err) => {
        console.error('Booking failed:', err);
        this.modal.error({
          nzTitle: 'Booking Failed',
          nzContent:
            err.error?.message ||
            'There was an error processing your booking. Please try again.',
        });
      },
    });
  }

  isTimeDisabled(time: string): boolean {
    if (!this.selectedDate) return false;

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
}
