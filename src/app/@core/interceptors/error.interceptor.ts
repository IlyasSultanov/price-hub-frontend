import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '@core/services/auth.service';

/**
 * A 401 only means "go log in again" when we locally have no session at all.
 * If keycloak-js still considers us authenticated but the backend rejects the
 * token anyway, forcing login() here would just loop — let that surface as a
 * normal error instead of fighting the backend with redirects.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !auth.isAuthenticated()) {
        auth.login();
      }
      return throwError(() => error);
    }),
  );
};
