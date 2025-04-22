import { Component, inject, OnInit } from '@angular/core';
import { Movies } from '../../_models/movies.modal';
import { ActivatedRoute } from '@angular/router';
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
  private movieService = inject(MoviesService);
  private safe = inject(DomSanitizer);
  



  constructor(
    private modal: NzModalService,
    private bookingService: MoviebookService,
    private authService:AuthService
  ) {}
 

  ngOnInit(): void {
    this.movieID = Number(this.router.snapshot.paramMap.get('id'));
    this.getMovie();
    this.showDates = generateShowDates();
    this.selectedDate = this.showDates[0];

  }
  

  getMovie(): void {
    this.movieService.getAllMovies().subscribe((movies: Movies[]) => {
      this.movieData = movies.find((movie) => movie.MovieID === this.movieID);
      if (this.movieData && this.movieData.TrailerURL) {
        const videoID = extractYouTubeVideoID(this.movieData.TrailerURL);
        const embed = `https://www.youtube.com/embed/${videoID}`;
        this.trailerurl = this.safe.bypassSecurityTrustResourceUrl(embed);
      }

      if (this.movieData?.showTime?.length) {
        this.selectedTime = this.movieData.showTime[0];
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

  storeBooking(): void {
    const user=this.authService.getCurrentUser()
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
      userId:user.id,
      Username:user.username
    };

    this.bookingService.saveBooking(newBooking);

    alert('Booking Successful!');
    this.ticketCount = 0;
    this.selectedDate = '';
    this.selectedTime = '';
  }

  bookNow(): void {
    if (this.ticketCount === 0) {
      alert('Please select at least 1 ticket');
      return;
    }

    const remainingSeats = this.movieData.AvailableSeats - this.ticketCount;
    const user=this.authService.getCurrentUser()

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
            userId:user.id,
            username:user.username
          };

          this.bookingService.saveBooking(newBooking);

          alert('Booking successful!');
        });
    }
  }
}
