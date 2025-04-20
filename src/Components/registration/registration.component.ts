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
  showPassword = false;
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
      email: ['', [Validators.required, Validators.email, this.domainValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.isPasswordValid()) {
      const newUser = {
        ...this.registerForm.value,
        createdDate: new Date().toISOString()
      };

      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      const isDuplicate = users.some((user: any) => 
        user.username === newUser.username || 
        user.email === newUser.email
      );

      if (isDuplicate) {
        alert('Username or email already exists!');
        return;
      }

      newUser.id = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 100 : 1;
      localStorage.setItem('MovieBuzzUsers', JSON.stringify([...users, newUser]));
      alert('Registration successful!');
      this.registerForm.reset();
      this.resetPasswordValidation();
    } else {
      alert('Please fill all fields correctly.');
    }
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  domainValidator(control: any) {
    const email = control.value || '';
    const validDomains = ['@gmail.com', '@moviebuzz.com', '@yahoo.com', '@outlook.com'];
    const endsWithValidDomain = validDomains.some(domain => 
      email.toLowerCase().endsWith(domain)
    );
    return endsWithValidDomain ? null : { invalidDomain: true };
  }

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
