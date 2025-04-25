import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';
import { RegistrationComponent } from '../Components/registration/registration.component';
import { LoginComponent } from '../Components/login/login.component';
import { BookinghistoryComponent } from '../Components/bookinghistory/bookinghistory.component';
import { MoviebookComponent } from '../Components/moviebook/moviebook.component';
import { NotfoundComponent } from '../Components/notfound/notfound.component';
import { authGuard } from '../_auth/auth.guard';
import { AdmindashboardComponent } from '../Components/Admin/admindashboard/admindashboard.component';
import { AdminComponent } from '../Components/Admin/admin/admin.component';
import { AdminusersviewComponent } from '../Components/Admin/adminusersview/adminusersview.component';
import { AdminhistoryComponent } from '../Components/Admin/adminhistory/adminhistory.component';

export const routes: Routes = [
 
  {
    path:'',redirectTo:'dashboard',pathMatch:'full'
  },
  {
    path:'admin',redirectTo:'admin-dashboard',pathMatch:'full'
  },
  {
    path:'admin',component:AdminComponent,canActivate:[authGuard]
  },
  {
    path:'admin-dashboard',
    loadComponent:()=>import('../Components/Admin/admindashboard/admindashboard.component').then(dash=>dash.AdmindashboardComponent)
  },
  {
    path:'admin-user',
    loadComponent:()=>import('../Components/Admin/adminusersview/adminusersview.component').then(user=>user.AdminusersviewComponent)
  },
  {
    path:'admin-history',
    loadComponent:()=>import('../Components/Admin/adminhistory/adminhistory.component').then(history=>history.AdminhistoryComponent)
  },
  
  {
    path:'dashboard',component:DashboardComponent
  },
  {
    path:'register',component:RegistrationComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'history',
    loadComponent:()=>import('../Components/bookinghistory/bookinghistory.component').then(history=>history.BookinghistoryComponent),
    canActivate:[authGuard]
  },
  {
    path:'movie/:id',
    loadComponent:()=>import('../Components/moviebook/moviebook.component').then(movies=>movies.MoviebookComponent)
  },
  {
    path:'**',component:NotfoundComponent
  }
];
