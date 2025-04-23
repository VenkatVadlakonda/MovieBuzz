import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoviebookService {
  //storing booking data in localstorage
  saveBooking(booking: any): void {
    const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    history.push(booking);
    localStorage.setItem('bookingHistory', JSON.stringify(history));
  }

  getBookingHistory(): any[] {
    return JSON.parse(localStorage.getItem('bookingHistory') || '[]');
  }

  getNextBookingId(): number {
    const history = this.getBookingHistory();
    return history.length ? history[history.length - 1].bookingId + 1 : 200;
  }
}
