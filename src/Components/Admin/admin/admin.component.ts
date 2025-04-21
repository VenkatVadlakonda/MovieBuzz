import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
   
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private authService = inject(AuthService);
  isSidebarClosed: boolean = false;

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  logout() {
    this.authService.logout(true);
  }
}
