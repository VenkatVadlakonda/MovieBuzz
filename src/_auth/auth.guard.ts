import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router=inject(Router);
  const sessionData = localStorage.getItem('currentSession');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    const now = new Date().getTime();
    
    if (now < session.expiresAt) {
      
      return true;
    } else {
    
      localStorage.removeItem('currentSession');
    }
  }
  
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;

  
};
