import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { User } from '../../_models/user.modal';
import { UsersService } from '../../_services/users.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  passwordFocused: boolean = false;
  showPassword: boolean = false;
  moveButton: boolean = false;
  loginError: string = '';
  isSubmitting: boolean = false;
  isUsersLoaded: boolean = false;
  userData: User[] = [];

  private userService = inject(UsersService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        console.log('All Users from API:', data);
        if (Array.isArray(data)) {
          this.userData = data;
        } else if (data && Array.isArray(data.data)) {
          this.userData = data.data;
        } else {
          console.error('Unexpected API response format:', data);
          this.userData = [];
        }
        this.isUsersLoaded = true;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        // alert(err.error?.message)
        this.userData = [];
        this.isUsersLoaded = true; 
      },
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
      const { userName, password } = this.loginForm.value;
  
      this.userService.loginUser({ userName, password }).subscribe({
        next: (response) => {
          console.log("API Response:", response);
          if (response.success && response.data) {
  const userData = response;
  const role = userData.data.user.role;
  

  if (role === 'Admin') {
    this.authService.login(userData);
    alert('Admin Login Successful');
    this.router.navigate(['/admin-dashboard']);
  } else if (role === 'User') {
    this.authService.login(userData);
    alert('Login Successful');
    this.router.navigate(['/dashboard']);
  } else {
    this.handleLoginError('Invalid user role');
  }
}

          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.handleLoginError(err.error?.message || 'Login failed. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
  
  
  private handleLoginError(message: string) {
    this.loginError = message;
    // alert(message);
    this.moveButton = !this.moveButton;
  }
  
}