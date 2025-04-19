import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent{

  registerForm: FormGroup;
  passwordFocused = false;
  passwordValid = {
    length: false,
    alphabet: false,
    number: false,
    specialChar: false,
    capital: false
  };

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.gmailValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), this.phoneValidator]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.isPasswordValid()) {
      const newUser = {
        ...this.registerForm.value,
        createdDate: new Date().toISOString()
      };

      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      
      // Check for duplicates
      const isDuplicate = users.some((user: any) => 
        user.username === newUser.username || 
        user.email === newUser.email
      );

      if (isDuplicate) {
        alert('Username or email already exists!');
        return;
      }

      // Generate new ID
      newUser.id = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;

      // Save to localStorage
      localStorage.setItem('MovieBuzzUsers', JSON.stringify([...users, newUser]));

      alert('Registration successful!');
      this.registerForm.reset();
      this.resetPasswordValidation();
    } else {
      alert('Please fill all fields correctly.');
    }
  }

  // Password validation methods
  onPasswordInput() {
    const password = this.registerForm.get('password')?.value || '';
    this.passwordValid = {
      length: password.length >= 8 && password.length <= 12,
      alphabet: /[a-zA-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      capital: /[A-Z]/.test(password)
    };
  }

  isPasswordValid() {
    return Object.values(this.passwordValid).every(v => v);
  }
  // Add this property
showPassword = false;

// Add this method
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

  // Validators
  phoneValidator(control: any) {
    const phone = control.value || '';
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone) ? null : { invalidPhone: true };
  }

  gmailValidator(control: any) {
    const email = control.value || '';
    const endsWithGmail = email.toLowerCase().endsWith('@gmail.com');
    return endsWithGmail ? null : { invalidGmail: true };
  }

  //reset password validation
  private resetPasswordValidation() {
    this.passwordValid = {
      length: false,
      alphabet: false,
      number: false,
      specialChar: false,
      capital: false
    };
  }
}
