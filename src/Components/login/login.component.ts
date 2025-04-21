import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordFocused = false;
  showPassword = false; 
  moveButton = false;
  loginError = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onHover() {
    if (this.loginForm.invalid) {
      this.moveButton = !this.moveButton;
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { username, password } = this.loginForm.value;
      
      // Admin login check
      if (username === 'admin' && password === 'admin123') {
        this.authService.login({
          username: 'admin',
          isAdmin: true
        });
        this.router.navigate(['/admin']);
        return;
      }

      // Regular user check
      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);

      if (user) {
        this.authService.login({
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: false,
          dob:user.dob,
          firstname:user.firstname,
          lastname:user.lastname
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'Invalid username or password';
        this.moveButton = !this.moveButton;
      }
      this.isSubmitting = false;
    }
  }
}
