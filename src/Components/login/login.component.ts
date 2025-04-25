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
    this.userService.getAllUsers().subscribe(data=>this.userData=data)
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
      
      if (userName === 'admin' && password === 'admin123') {
        this.authService.login({
          userName: 'admin',
          isAdmin: true
        });
        this.router.navigate(['/admin']);
        return;
      }

      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      const user = users.find((u: any) => u.userName === userName && u.password === password);
      const userapi=this.userData.find((users)=>users.userName===userName&& users.password===password)
      
      if (user || userapi) {
        this.authService.login({
          id: user.id,
          userName: user.userName,
          emailId: user.emailId,
          isAdmin: false,
          dateOfBirth:user.dateOfBirth,
          firstName:user.firstName,
          lastName:user.lastName
        });
        this.router.navigate(['/dashboard']);
      } else {
        alert("Username and password not exists")
        this.loginError = 'Invalid username or password';
        this.moveButton = !this.moveButton;
      }
      this.isSubmitting = false;
    }
  }
}
