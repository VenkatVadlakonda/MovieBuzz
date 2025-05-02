import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { BookingsHistory } from '../../_models/booking.modal';
import { MoviesService } from '../../_services/movies.service';
import { UsersService } from '../../_services/users.service';
import { AuthService } from '../../_services/auth.service';
import { dataObj } from '../../_utils/moviebook.utils';

@Component({
  selector: 'app-bookinghistory',
  imports: [CommonModule, NzQRCodeModule],
  templateUrl: './bookinghistory.component.html',
  styleUrl: './bookinghistory.component.scss',
})
export class BookinghistoryComponent implements OnInit {
  bookingHistory: BookingsHistory[] = [];
  id:number=0

  bookings:any;

  private bookingService=inject(MoviesService)
  private auth=inject(AuthService)

  ngOnInit(): void {
   
    this.id=dataObj().user.userId
    console.log("Users",this.id)
   
 
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
      }
    })
   
  }
  getBookingQRCode(booking: any): string {
    const details = {
      UserName: this.bookings.userName || '',
      Movie: this.bookings.movieName || '',
      Genre: this.bookings.genre || '',
      Date: this.bookings.showDate || '',
      Time: this.bookings.showTime || '',
      Tickets: this.bookings.numberOfTickets || 0,
      Total: this.bookings.totalPrice  || 0,
      BookingID: this.bookings.bookingId  || '',
    };

    return JSON.stringify(details, null, 2);
  }
}
