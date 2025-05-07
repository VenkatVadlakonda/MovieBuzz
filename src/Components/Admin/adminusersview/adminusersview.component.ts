import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { User } from '../../../_models/user.modal';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../_services/users.service';
import { AdminuserPipe } from "../../../_pipes/adminuser.pipe";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminusersview',
  imports: [CommonModule, AdminuserPipe,FormsModule],
  templateUrl: './adminusersview.component.html',
  styleUrl: './adminusersview.component.scss'
})
export class AdminusersviewComponent implements OnInit{
  TotalUsers: number = 0;
  AllUsers: any;
  search: string = '';
  count: boolean = false;
  u: string = '';
  isLoading: boolean = true;
  users: User[] = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
  private userServices = inject(UsersService);

  ngOnInit(): void {
    this.TotalUsers = this.users.length;
    this.userServices.getAllUsers().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.AllUsers = data;
        } else if (data && data.data) {
          this.AllUsers = data.data;
        }
        this.TotalUsers = this.AllUsers.length;
        this.isLoading = false;

        if (!this.AllUsers || this.AllUsers.length <= 1) {
          this.count = true;
          this.u = 'No users found';
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert(err.error?.message)
        this.isLoading = false;
        this.count = true;
        this.u = 'Error fetching users';
      }
    });
  }

}
