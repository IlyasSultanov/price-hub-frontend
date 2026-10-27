export enum SupplierStatus {
  Active = 'active',
  Paused = 'paused',
  Blocked = 'blocked',
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  status: SupplierStatus;
  currency: string;
  rating: number;
  quota_mb: number;
}

export interface CreateSupplierRequest {
  name: string;
  slug: string;
  status: SupplierStatus;
  currency: string;
  rating: number;
  quota_mb: number;
}
