import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateSupplierRequest, Supplier, SupplierStatus } from '@core/models/supplier.model';
import { SuppliersService } from '@core/services/suppliers.service';
import { PageHeaderComponent } from '@shared/page-header/page-header.component';

interface SupplierForm {
  name: string;
  slug: string;
  currency: string;
  quota_mb: number;
  status: SupplierStatus;
  rating: number;
}

const EMPTY_FORM: SupplierForm = {
  name: '',
  slug: '',
  currency: 'RUB',
  quota_mb: 500,
  status: SupplierStatus.Active,
  rating: 0,
};

@Component({
  selector: 'app-suppliers',
  imports: [FormsModule, PageHeaderComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent {
  private readonly suppliersService = inject(SuppliersService);

  protected readonly suppliers = signal<Supplier[]>([]);
  protected readonly loading = signal(true);
  protected readonly creating = signal(false);
  protected readonly showForm = signal(false);
  protected form: SupplierForm = { ...EMPTY_FORM };
  protected readonly SupplierStatus = SupplierStatus;
  protected readonly statuses = Object.values(SupplierStatus);

  constructor() {
    this.loadSuppliers();
  }

  protected toggleForm(): void {
    this.showForm.update((v) => !v);
    if (this.showForm()) this.form = { ...EMPTY_FORM };
  }

  protected createSupplier(): void {
    const value = this.form;
    if (!value.name.trim() || !value.slug.trim()) return;

    const payload: CreateSupplierRequest = {
      ...value,
      name: value.name.trim(),
      slug: value.slug.trim(),
      currency: value.currency.trim().toUpperCase(),
      quota_mb: Number(value.quota_mb),
      rating: Number(value.rating),
    };

    this.creating.set(true);
    this.suppliersService.createSupplier(payload).subscribe({
      next: (supplier) => {
        this.suppliers.update((current) => [...current, supplier]);
        this.creating.set(false);
        this.showForm.set(false);
      },
      error: () => this.creating.set(false),
    });
  }

  private loadSuppliers(): void {
    this.loading.set(true);
    this.suppliersService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers.set(suppliers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
