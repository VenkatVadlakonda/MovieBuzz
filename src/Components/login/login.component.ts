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
  passwordFocused:boolean = false;
  showPassword:boolean = false; 
  moveButton:boolean = false;
  loginError:string = '';
  isSubmitting:boolean = false;
  userData:User[]=[]

  private userService=inject(UsersService)

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        // Handle different response formats
        if (Array.isArray(data)) {
          this.userData = data;
        } else if (data && Array.isArray(data.data)) {
          this.userData = data.data;
        } else {
          console.error('Unexpected API response format:', data);
          this.userData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.userData = [];
      }
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

  //on submit if user user UI if admin adminUI
  onSubmit() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { userName, password } = this.loginForm.value;
      
      if (userName === 'Admin' && password === 'Admin@123') {
        this.authService.login({
          userName: 'Admin',
          isAdmin: true
        });
        alert("Admin Login Successfull")
        this.router.navigate(['/admin']);
        return;
      }

      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      const user = users.find((u: User) => u.userName === userName && u.password === password);
      const userapi=this.userData.find((users:User)=>users.userName===userName&& users.password===password)
      
      if (user) {
        this.authService.login({
          userId: user.id,
          userName: user.userName,
          password:user.password,
          emailId: user.emailId,
          isAdmin: false,
          dateOfBirth:user.dateOfBirth,
          firstName:user.firstName,
          lastName:user.lastName
        });
        alert("Login Successfull")
        this.router.navigate(['/dashboard']);
      }else if(userapi){
        this.authService.login({
          userapi
        });
        
        this.router.navigate(['/dashboard']);
      }
       else {
        alert("Username and password not exists")
        this.loginError = 'Invalid username or password';
        this.moveButton = !this.moveButton;
      }
      this.isSubmitting = false;
    }
  }

  
  
  private handleLoginError() {
    this.loginError = 'Invalid username or password';
    this.moveButton = !this.moveButton;
  }
}