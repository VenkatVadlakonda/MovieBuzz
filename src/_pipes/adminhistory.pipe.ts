import { Booking, BookingsHistory } from './../_models/booking.modal';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adminhistory',
})
export class AdminhistoryPipe implements PipeTransform {
  transform(bookingHistory: Booking[],history:string): Booking[] {
    return bookingHistory.filter(data=>data.userName.toLowerCase().includes(history.toLowerCase())||data.movieName.toLocaleLowerCase().includes(history.toLocaleLowerCase()))  
  }
}


