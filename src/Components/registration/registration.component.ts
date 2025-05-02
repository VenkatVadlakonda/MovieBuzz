import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../_services/users.service';
import { User } from '../../_models/user.modal';
import { setData, users } from '../../_utils/moviebook.utils';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit{
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
  apiData:User[]=[]
  private usersAdd=inject(UsersService)
  private router=inject(Router)
  

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, this.dobValidator.bind(this)]],
      emailId: [
        '',
        [Validators.required, Validators.email, this.domainValidator],
      ],
      phoneNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      password
      : ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.usersAdd.getAllUsers().subscribe({
      next: (data: any) => {
        // Handle different response formats
        if (Array.isArray(data)) {
          this.apiData = data;
        } else if (data && Array.isArray(data.data)) {
          this.apiData = data.data;
        } else {
          console.error('Unexpected API response format:', data);
          this.apiData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.apiData = [];
      }
    });
    
  }

  onSubmit() {
    if (this.registerForm.valid && this.isPasswordValid()) {
      const newUser = {
        ...this.registerForm.value,
        createdOn: new Date().toISOString(),
      };
      const addUser={...this.registerForm.value}

      
      const isDuplicate = users.some(
        (user: any) =>
          user.userName === newUser.userName ||
          user.emailId === newUser.emailId ||
          user.phoneNo === newUser.phoneNo
      );
      const isDup=this.apiData.some(
        user=>user.userName===addUser.userName ||  user.emailId === newUser.emailId ||  user.phoneNo === newUser.phoneNo
      )

      if (isDuplicate || isDup) {
        alert('Username or email or phone number already exists!');
        return;
      }

      newUser.id =
        users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 101;
      
      setData(newUser)
      this.usersAdd.addUsers(addUser).subscribe({
        next:res=>{
          console.log("Registration successfull from API")
        },
        error:(err)=>{
          if(err.status===400 && err.error=="User already exists"){
            alert("Username or email or phoneno alredy exists")
          }else{
            alert("something went wrong")
            console.log(err);
            
          }
        }

      })
      alert('Registration successful!');
      this.registerForm.reset();
      this.resetPasswordValidation();
      this.router.navigate(['/login'])
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
    const dobValue = new Date(this.registerForm.get('dateOfBirth')?.value);
    const year = dobValue.getFullYear();

    if (year > 2025) {
      alert('Invalid year! I think you are not born yet!😁 ');
    } else if (year > 2021) {
      alert('Age should be above 3 year 🤗');
    } else if (year>1000 && year < 1930) {
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
