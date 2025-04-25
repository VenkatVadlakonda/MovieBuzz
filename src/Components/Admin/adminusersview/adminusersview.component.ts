import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { User } from '../../../_models/user.modal';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../_services/users.service';

@Component({
  selector: 'app-adminusersview',
  imports: [CommonModule],
  templateUrl: './adminusersview.component.html',
  styleUrl: './adminusersview.component.scss'
})
export class AdminusersviewComponent implements OnInit{
  TotalUsers:number=0
  AllUsers:any;
  users:User[] = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
  private userServices=inject(UsersService)
  ngOnInit():void{
    this.TotalUsers=this.users.length
    this.userServices.getAllUsers().subscribe(data=>this.AllUsers=data)

  }

}
