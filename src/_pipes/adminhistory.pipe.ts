import { BookingsHistory } from './../_models/booking.modal';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adminhistory',
})
export class AdminhistoryPipe implements PipeTransform {
  transform(bookings: BookingsHistory[],history:string): BookingsHistory[] {
    return bookings.filter(data=>data.Username.toLowerCase().includes(history.toLowerCase())||data.movieName.toLocaleLowerCase().includes(history.toLocaleLowerCase()))  
  }
}


