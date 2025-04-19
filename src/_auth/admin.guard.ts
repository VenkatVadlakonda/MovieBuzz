import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
 
  const authService=inject(AuthService)
  const router=inject(Router)

 
    if (authService.isAdmin() && authService.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/dashboard']);
      return false;
    }
  
};
