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
  TotalUsers:number=0
  AllUsers:any;
  search:string=''
  users:User[] = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
  private userServices=inject(UsersService)
  ngOnInit():void{
    this.TotalUsers=this.users.length
    this.userServices.getAllUsers().subscribe({
      next: (data: any) => {
        // Ensure data is an array before assigning
        if (Array.isArray(data)) {
          this.AllUsers = data;
        } else if (data && data.data) { // If your API wraps the array in a data property
          this.AllUsers = data.data;
        }
        this.TotalUsers = this.AllUsers.length; // Update count with actual API data
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });

  }

}
