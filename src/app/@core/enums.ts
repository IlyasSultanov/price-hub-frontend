/** Mirrors `app.utils.enums.UserRole` in price-hub's backend. */
export enum Role {
  SupplierManager = 'supplier_manager',
  CatalogAdmin = 'catalog_admin',
  SystemAdmin = 'system_admin',
}

export enum Permission {
  SuppliersManage = 'suppliers:manage',
  MappingProfilesManage = 'mapping_profiles:manage',
  FeedsManage = 'feeds:manage',
  UsersManage = 'users:manage',
}

/** Roles a system_admin can change an existing account to — accounts are created via Keycloak, never in this UI. */
export const ASSIGNABLE_ROLES: Role[] = [Role.SupplierManager, Role.CatalogAdmin, Role.SystemAdmin];

/**
 * Mirrors the role/permission matrix enforced by price-hub's backend:
 * - supplier_manager only ever acts on their own supplier (its id comes from
 *   the `supplier_id` token claim, not a picker — see SuppliersService).
 * - catalog_admin / system_admin can act on any supplier; only system_admin
 *   manages user accounts/roles.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SupplierManager]: [Permission.MappingProfilesManage, Permission.FeedsManage],
  [Role.CatalogAdmin]: [
    Permission.SuppliersManage,
    Permission.MappingProfilesManage,
    Permission.FeedsManage,
  ],
  [Role.SystemAdmin]: [
    Permission.SuppliersManage,
    Permission.MappingProfilesManage,
    Permission.FeedsManage,
    Permission.UsersManage,
  ],
};

/** Feed formats the backend's mapping-profile parser currently understands (CSV only — see ТЗ Этап 2/3). */
export enum FeedFormat {
  Csv = 'csv',
}

export enum FeedStatus {
  Uploaded = 'uploaded',
  Queued = 'queued',
  Parsing = 'parsing',
  Validating = 'validating',
  Matching = 'matching',
  Pricing = 'pricing',
  Publishing = 'publishing',
  Completed = 'completed',
  PartiallyCompleted = 'partially_completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

/** Statuses the backend never moves past again — safe to stop polling. */
export const TERMINAL_FEED_STATUSES: FeedStatus[] = [
  FeedStatus.Completed,
  FeedStatus.PartiallyCompleted,
  FeedStatus.Failed,
  FeedStatus.Cancelled,
];
