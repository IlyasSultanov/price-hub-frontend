import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Permission } from '@core/enums';
import { PermissionsService } from '@core/services/permissions.service';

/** Route config supplies the permission via data: { permission: Permission.UsersManage }. */
export const permissionGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);

  const required = route.data['permission'] as Permission | undefined;
  if (!required || permissions.has(required)) {
    return true;
  }

  return router.createUrlTree([
    permissions.has(Permission.FeedsManage) ? '/feeds' : '/forbidden',
  ]);
};
