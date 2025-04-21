import { Component, inject } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../Components/header/header.component';
import { FooterComponent } from '../Components/footer/footer.component';
import { AdminComponent } from "../Components/Admin/admin/admin.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AdminComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

authService=inject(AuthService)
  
}
