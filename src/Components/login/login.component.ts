import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  moveButton: boolean = false;
  loginError: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Watch for form changes to trigger button movement
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginForm.invalid) {
        this.moveButton = !this.moveButton;
      }
    });
  }

  onHover() {
    if (this.loginForm.invalid) {
      this.moveButton = !this.moveButton;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      // Admin login check
      if (username === 'admin' && password === 'admin123') {
        this.handleSuccessfulLogin({
          username: 'admin',
          isAdmin: true
        }, '/admin-dashboard');
        return;
      }

      // Regular user check
      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);

      if (user) {
        this.handleSuccessfulLogin({
          username: user.username,
          email: user.email,
          isAdmin: false
        }, '/dashboard');
      } else {
        this.loginError = 'Invalid username or password';
        // Trigger button movement on invalid credentials
        this.moveButton = !this.moveButton;
      }
    }
  }

  private handleSuccessfulLogin(userData: any, redirectPath: string) {
    const sessionData = {
      user: userData,
      expiresAt: new Date().getTime() + (5 * 60 * 1000) // 5 minutes
    };
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    this.router.navigate([redirectPath]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
