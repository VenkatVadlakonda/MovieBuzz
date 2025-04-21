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

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
  
  
  {
    path:'',redirectTo:'dashboard',pathMatch:'full'
  },
  {
    path:'admin',component:AdminComponent,canActivate:[authGuard]
  },
  {
    path:'admin-dashboard',component:AdmindashboardComponent
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
