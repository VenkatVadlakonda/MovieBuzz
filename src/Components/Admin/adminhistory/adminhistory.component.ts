import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BookingsHistory } from '../../../_models/booking.modal';

@Component({
  selector: 'app-adminhistory',
  imports: [NzCardModule,CommonModule],
  templateUrl: './adminhistory.component.html',
  styleUrl: './adminhistory.component.scss'
})
export class AdminhistoryComponent implements OnInit{
  book:any;
  bookings:BookingsHistory[]=JSON.parse(localStorage.getItem('bookingHistory')||'[]')
  TotalCount:number=0
  ngOnInit(): void {
    this.TotalCount=this.bookings.length
    if(this.TotalCount==0){
      this.book="No Bookings Found"
    }
    
  }


}
