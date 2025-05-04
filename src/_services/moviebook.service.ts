import { Injectable } from '@angular/core';
import { MoviesService } from './movies.service';
import { Booking } from '../_models/booking.modal';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviebookService {
 
  constructor(private bookingsService:MoviesService){}
  
  saveBooking(booking: Booking): Observable<Booking> {
    return this.bookingsService.bookingMovie(booking).pipe(
      catchError(error => {
        console.error("Error Occurred", error);
        throw error; 
      })
    );
  }
}
