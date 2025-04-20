import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-bookinghistory',
  imports: [CommonModule, NzQRCodeModule],
  templateUrl: './bookinghistory.component.html',
  styleUrl: './bookinghistory.component.scss',
})
export class BookinghistoryComponent implements OnInit {
  bookingHistory: any[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('bookingHistory');
    this.bookingHistory = data ? JSON.parse(data) : [];
  }
  getBookingQRCode(booking: any): string {
    const details = {
      Movie: booking.movieName || 'N/A',
      Genre: booking.genre || 'N/A',
      Date: booking.date || 'N/A',
      Time: booking.time || 'N/A',
      Tickets: booking.Quantity || booking.tickets || 0,
      Total: booking.totalPrice || booking.total || 0,
      BookingID: booking.bookingId || booking.bookingID || 'N/A',
    };

    return JSON.stringify(details, null, 2);
  }
}
