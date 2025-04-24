import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registerForm: FormGroup;
  passwordFocused: boolean = false;
  showPassword: boolean = false;
  passwordValid = {
    length: false,
    alphabet: false,
    number: false,
    specialChar: false,
    capital: false,
  };

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      dob: ['', [Validators.required, this.dobValidator.bind(this)]],
      email: [
        '',
        [Validators.required, Validators.email, this.domainValidator],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.isPasswordValid()) {
      const newUser = {
        ...this.registerForm.value,
        createdDate: new Date().toISOString(),
      };

      const users = JSON.parse(localStorage.getItem('MovieBuzzUsers') || '[]');
      const isDuplicate = users.some(
        (user: any) =>
          user.username === newUser.username ||
          user.email === newUser.email ||
          user.phone === newUser.phone
      );

      if (isDuplicate) {
        alert('Username or email or phone number already exists!');
        return;
      }

      newUser.id =
        users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 100 : 1;
      localStorage.setItem(
        'MovieBuzzUsers',
        JSON.stringify([...users, newUser])
      );
      alert('Registration successful!');
      this.registerForm.reset();
      this.resetPasswordValidation();
    } else {
      alert('Please fill all fields correctly.');
    }
  }

  //password validation
  onPasswordInput() {
    const password = this.registerForm.get('password')?.value || '';
    this.passwordValid = {
      length: password.length >= 8,
      alphabet: /[a-zA-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      capital: /[A-Z]/.test(password),
    };
  }

  isPasswordValid() {
    return Object.values(this.passwordValid).every((v) => v);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  //email validator
  domainValidator(control: any) {
    const email = control.value || '';
    const validDomains = [
      '@gmail.com',
      '@moviebuzz.com',
      '@yahoo.com',
      '@outlook.com',
      '@vivejaitservices.com',
    ];
    const endsWithValidDomain = validDomains.some((domain) =>
      email.toLowerCase().endsWith(domain)
    );
    return endsWithValidDomain ? null : { invalidDomain: true };
  }

  //dob validator
  dobValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const dob = new Date(value);

    const year = dob.getFullYear();

    if (year >= 2025 || year < 1930 || year >= 2022)
      return { invalidYear: true };
    if (year < 1930 && year > 2021) return { recentYear: true };
    return null;
  }
  onDobChange() {
    const dobValue = new Date(this.registerForm.get('dob')?.value);
    const year = dobValue.getFullYear();

    if (year > 2025) {
      alert('Invalid year! I think you are not born yet!😁 ');
    } else if (year > 2021) {
      alert('Age should be above 3 year 🤗');
    } else if (year < 1930) {
      alert('You are died! No entry for Ghosts 👻');
    }
  }

  private resetPasswordValidation() {
    this.passwordValid = {
      length: false,
      alphabet: false,
      number: false,
      specialChar: false,
      capital: false,
    };
  }
}
