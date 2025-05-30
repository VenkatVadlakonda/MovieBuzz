import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

import { MoviesService } from '../../_services/movies.service';
import { UsersService } from '../../_services/users.service';
import { AuthService } from '../../_services/auth.service';
import { userDataAPI } from '../../_utils/moviebook.utils';
import { Booking } from '../../_models/booking.modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-bookinghistory',
  imports: [CommonModule, NzQRCodeModule,NzPaginationModule],
  templateUrl: './bookinghistory.component.html',
  styleUrl: './bookinghistory.component.scss',
})
export class BookinghistoryComponent implements OnInit {

  id: number = 0;
  userName: string = '';
  bookings: Booking[]=[];
  isLoading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 2;

  private bookingService = inject(MoviesService);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    console.log("current user bookin",user)
    this.id = user.userId;
    this.userName = user.userName || 'User';

    this.isLoading = true;
    this.bookingService.getBookings(this.id).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.bookings = data;
        } else if (data && data.data) {
          this.bookings = data.data;
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert(err.error?.message)
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getBookingQRCode(booking: any): string {
    const details = {
      UserName: booking.userName || '',
      Movie: booking.movieName || '',
      Genre: booking.genre || '',
      Date: booking.showDate || '',
      Time: booking.showTime || '',
      Tickets: booking.numberOfTickets || 0,
      Total: booking.totalPrice || 0,
      BookingID: booking.bookingId || '',
    };
    return JSON.stringify(details, null, 2);
  }
  get paginatedMovies(): any[] {
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.bookings.reverse().slice(startIndex, startIndex + this.pageSize);
  }
  get totalMovies(): number {
    return this.bookings.length;
  }
}
