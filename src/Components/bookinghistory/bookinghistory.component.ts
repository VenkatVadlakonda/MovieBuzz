import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { BookingsHistory } from '../../_models/booking.modal';

@Component({
  selector: 'app-bookinghistory',
  imports: [CommonModule, NzQRCodeModule],
  templateUrl: './bookinghistory.component.html',
  styleUrl: './bookinghistory.component.scss',
})
export class BookinghistoryComponent implements OnInit {
  bookingHistory: BookingsHistory[] = [];

  ngOnInit(): void {
    const users=JSON.parse(localStorage.getItem('currentSession')||'{}')
    const data = localStorage.getItem('bookingHistory');
    this.bookingHistory = data ? JSON.parse(data) : [];
    const bookings=data?JSON.parse(data):[]
    this.bookingHistory=bookings.filter((movie:any)=>movie.userId==users.user.id)

    
  }
  getBookingQRCode(booking: any): string {
    const details = {
      Movie: booking.movieName || '',
      Genre: booking.genre || '',
      Date: booking.date || '',
      Time: booking.time || '',
      Tickets: booking.Quantity || booking.tickets || 0,
      Total: booking.totalPrice || booking.total || 0,
      BookingID: booking.bookingId || booking.bookingID || '',
     
    };

    return JSON.stringify(details, null, 2);
  }
}
