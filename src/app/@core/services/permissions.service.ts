import { Injectable, computed, inject } from '@angular/core';

import { Permission, ROLE_PERMISSIONS } from '@core/enums';
import { AuthService } from '@core/services/auth.service';

/**
 * Declarative role -> permission checks. UI-level only — the backend still
 * enforces access on every endpoint (and ownership of a specific supplier).
 */
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly auth = inject(AuthService);

  readonly permissions = computed<Permission[]>(() => {
    const roles = this.auth.currentUser()?.roles ?? [];
    const union = new Set<Permission>();
    for (const role of roles) {
      for (const permission of ROLE_PERMISSIONS[role]) union.add(permission);
    }
    return [...union];
  });

  has(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }
}
