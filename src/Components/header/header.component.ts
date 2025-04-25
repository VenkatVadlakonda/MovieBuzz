import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit,OnDestroy{
  isLoggedIn: boolean = false;
  isAdminUser: boolean = false;
  userName: string = '';
  private destroy$ = new Subject<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  
  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.updateAuthStatus();
      });
    this.updateAuthStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdminUser = this.authService.isAdmin();
    this.userName = this.authService.getCurrentUser()?.userName || '';
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
  


}
