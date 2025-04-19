import { Routes } from '@angular/router';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';
import { RegistrationComponent } from '../Components/registration/registration.component';
import { LoginComponent } from '../Components/login/login.component';
import { BookinghistoryComponent } from '../Components/bookinghistory/bookinghistory.component';
import { MoviebookComponent } from '../Components/moviebook/moviebook.component';
import { NotfoundComponent } from '../Components/notfound/notfound.component';
import { authGuard } from '../_auth/auth.guard';
import { AdmindashboardComponent } from '../Components/AdminComponents/admindashboard/admindashboard.component';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
  
  { 
    path: 'admin', 
    canActivate: [authGuard],
    data: { requiresAdmin: true },
    children: [
      { path: 'admindashboard', component: AdmindashboardComponent },
      
    ]
  },
  {
    path:'',redirectTo:'dashboard',pathMatch:'full'
  },
  {
    path:'dashboard',component:DashboardComponent,canActivate: [authGuard]
  },
  {
    path:'register',component:RegistrationComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'history',component:BookinghistoryComponent
  },
  {
    path:'movie',component:MoviebookComponent
  },
  {
    path:'**',component:NotfoundComponent
  }
];
