import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../components/service/auth/auth';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.validateSession().pipe(
    map(() => {
      if (auth.isAdmin()) {
        return true;
      }
      return router.createUrlTree(['/admin/login']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/admin/login']));
    })
  );
};

