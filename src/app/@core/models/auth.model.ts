import { Role } from '@core/enums';

export interface CurrentUser {
  username: string;
  /** The single highest-privilege role, for display (e.g. the sidebar badge). */
  role: Role | null;
  /** Every role the token actually grants — permissions are the union across all of these. */
  roles: Role[];
  /**
   * The supplier this user manages, from the `supplier_id` token claim.
   * Only ever set for supplier_manager accounts; admins act on any
   * supplier via a picker instead (see SuppliersService).
   */
  supplierId: string | null;
}

export interface ApiErrorBody {
  detail: string | { loc: (string | number)[]; msg: string; type: string }[];
}
