import { Injectable } from '@angular/core';
import { MoviesService } from './movies.service';
import { Booking } from '../_models/booking.modal';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviebookService {
  //storing booking data in localstorage
  constructor(private bookingsService:MoviesService){}
  // saveBooking(booking: Booking){
  //   // const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
  //   // history.push(booking);
  //   // localStorage.setItem('bookingHistory', JSON.stringify(history));
  //   return this.bookingsService.bookingMovie(booking).subscribe({
  //     next:(data)=>{
  //       console.log(data);
        
  //     },
  //     error:(error)=>{
  //       console.log("Error Occured",error)
  //     }
  //   })
  // }

  // getBookingHistory(): any[] {
  //   return JSON.parse(localStorage.getItem('bookingHistory') || '[]');
  // }

  // getNextBookingId(): number {
  //   const history = this.getBookingHistory();
  //   return history.length ? history[history.length - 1].bookingId + 1 : 200;
  // }

  saveBooking(booking: any): Observable<any> {
    return this.bookingsService.bookingMovie(booking).pipe(
      catchError(error => {
        console.error("Error Occurred", error);
        throw error; 
      })
    );
  }
}
