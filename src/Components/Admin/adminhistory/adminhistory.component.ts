import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Booking } from '../../../_models/booking.modal';
import { FormsModule } from '@angular/forms';
import { AdminhistoryPipe } from '../../../_pipes/adminhistory.pipe';
import { MoviesService } from '../../../_services/movies.service';

@Component({
  selector: 'app-adminhistory',
  imports: [NzCardModule, CommonModule, FormsModule, AdminhistoryPipe],
  templateUrl: './adminhistory.component.html',
  styleUrl: './adminhistory.component.scss',
})
export class AdminhistoryComponent implements OnInit {
  book: string = '';
  history: string = '';
  TotalCount: number = 0;
  count: boolean = false;
  isLoading: boolean = true;

  bookingHistory: Booking[] = [];

  private adminService = inject(MoviesService);

  ngOnInit(): void {
    this.adminService.getAllBookingsForAdmin().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.bookingHistory = data;
        } else if (data && data.data) {
          this.bookingHistory = data.data;
        }

        this.TotalCount = this.bookingHistory.length;
        this.isLoading = false;

        if (this.TotalCount === 0) {
          this.count = true;
          this.book = 'No Bookings Found';
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false;
        this.count = true;
        this.book = 'Error fetching bookings';
      },
    });
  }
}
