import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../components/service/auth/auth';

export const authGuard = () => {
  const auth = inject(AuthService), router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};

export const adminGuard = () => {
  const auth = inject(AuthService), router = inject(Router);
  if (auth.isLoggedIn() && auth.isAdmin()) return true;
  router.navigate([auth.isLoggedIn() ? '/' : '/login']);
  return false;
};

export const guestGuard = () => {
  const auth = inject(AuthService), router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  router.navigate(['/']);
  return false;
};
