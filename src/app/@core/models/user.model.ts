import { Role } from '@core/enums';

export interface AppUser {
  id: string;
  username: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  roles: Role[];
  is_active: boolean;
}

export interface UpdateUserRoleRequest {
  role: Role;
}
