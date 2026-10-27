import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API } from '@core/api';
import { Role } from '@core/enums';
import { AppUser, UpdateUserRoleRequest } from '@core/models/user.model';
import { BackendService } from '@core/services/backend.service';

/** system_admin only. */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly backend = inject(BackendService);

  getUsers(): Observable<AppUser[]> {
    return this.backend.get<AppUser[]>(API.users.list);
  }

  updateRole(userId: string, role: Role): Observable<AppUser> {
    const payload: UpdateUserRoleRequest = { role };
    return this.backend.patch<AppUser>(API.users.updateRole(userId), payload, {
      successMessage: 'Role updated',
    });
  }
}
