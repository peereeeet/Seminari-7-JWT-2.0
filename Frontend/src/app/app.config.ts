import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.getCurrentUser();
  
  if (currentUser) {
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
    return next(authReq);
  }
  
  return next(req);
};