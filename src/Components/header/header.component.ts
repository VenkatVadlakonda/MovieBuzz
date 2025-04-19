import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  timeLeft: number = 300; // 5 minutes in seconds
  timerDisplay: string = '05:00';
  private router=inject(Router)

  constructor() {
    this.startSessionTimer();
  }

  getSessionData() {
    const sessionData = localStorage.getItem('currentSession');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getSessionData();
  }

  isAdmin(): boolean {
    const session = this.getSessionData();
    return session ? session.user.isAdmin : false;
  }

  getUsername(): string {
    const session = this.getSessionData();
    return session ? session.user.username || session.user.email : '';
  }

  private startSessionTimer() {
    const session = this.getSessionData();
    if (!session) return;

    const now = new Date().getTime();
    const expiresAt = session.expiresAt;
    const remainingSeconds = Math.floor((expiresAt - now) / 1000);

    if (remainingSeconds > 0) {
      this.timeLeft = remainingSeconds;
      this.updateTimerDisplay();

      timer(1000, 1000).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.timeLeft--;
        this.updateTimerDisplay();
        
        if (this.timeLeft <= 0) {
          this.destroy$.next();
        }
      });
    }
  }

  private updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  logout() {
    // Clear session data
    localStorage.removeItem('currentSession');
    
    // Complete the timer observable
    this.destroy$.next();
    this.destroy$.complete();
    
    // Redirect to login page
    this.router.navigate(['/login']);
    
    // Optional: You can add a query parameter to show a logout message
    // this.router.navigate(['/login'], { queryParams: { reason: 'logout' } });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
