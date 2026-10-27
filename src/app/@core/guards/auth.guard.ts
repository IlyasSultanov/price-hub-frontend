import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '@core/services/auth.service';

/** Not authenticated means a hard redirect to Keycloak's hosted login — there is no in-app login route. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    return true;
  }

  auth.login();
  return false;
};
