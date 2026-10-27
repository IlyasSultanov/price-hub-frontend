import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API } from '@core/api';
import { CreateSupplierRequest, Supplier } from '@core/models/supplier.model';
import { BackendService } from '@core/services/backend.service';

/** catalog_admin / system_admin only — supplier_manager has no access to this endpoint
 *  (their own supplier comes straight from the `supplier_id` token claim instead). */
@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private readonly backend = inject(BackendService);

  getSuppliers(): Observable<Supplier[]> {
    return this.backend.get<Supplier[]>(API.suppliers.list, { params: { limit: 100 } });
  }

  createSupplier(payload: CreateSupplierRequest): Observable<Supplier> {
    return this.backend.post<Supplier>(API.suppliers.create, payload, {
      successMessage: 'Supplier created',
    });
  }
}
