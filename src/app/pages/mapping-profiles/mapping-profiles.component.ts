import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FeedFormat, Permission } from '@core/enums';
import {
  AVAILABLE_TRANSFORMS,
  CreateMappingProfileRequest,
  DEFAULT_READER_OPTS,
  MAPPABLE_FIELDS,
  MappableField,
  MappingProfile,
  OnDuplicateSku,
  OnNegativeStock,
  ReaderOpts,
  REQUIRED_FIELDS,
} from '@core/models/mapping-profile.model';
import { Supplier } from '@core/models/supplier.model';
import { AuthService } from '@core/services/auth.service';
import { MappingProfilesService } from '@core/services/mapping-profiles.service';
import { PermissionsService } from '@core/services/permissions.service';
import { SuppliersService } from '@core/services/suppliers.service';
import { PageHeaderComponent } from '@shared/page-header/page-header.component';

type Blank = '';
const NONE: Blank = '';

@Component({
  selector: 'app-mapping-profiles',
  imports: [FormsModule, DatePipe, PageHeaderComponent],
  templateUrl: './mapping-profiles.component.html',
  styleUrl: './mapping-profiles.component.scss',
})
export class MappingProfilesComponent {
  private readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionsService);
  private readonly suppliersService = inject(SuppliersService);
  private readonly profilesService = inject(MappingProfilesService);

  protected readonly canPickAnySupplier = this.permissions.has(Permission.SuppliersManage);
  protected readonly ownSupplierId = this.auth.currentUser()?.supplierId ?? null;

  protected readonly suppliers = signal<Supplier[]>([]);
  protected selectedSupplierId = '';

  protected readonly mappableFields = MAPPABLE_FIELDS;
  protected readonly requiredFields = REQUIRED_FIELDS;
  protected readonly availableTransforms = AVAILABLE_TRANSFORMS;

  /** Header name in the supplier's file for each field — blank means "not mapped". */
  protected columnMap: Record<MappableField, string> = this.emptyColumnMap();
  /** Comma-separated transform names per field, applied left to right. */
  protected transformsText: Record<MappableField, string> = this.emptyColumnMap();

  protected readerOpts: ReaderOpts = { ...DEFAULT_READER_OPTS };
  protected onDuplicateSku: OnDuplicateSku | Blank = NONE;
  protected onNegativeStock: OnNegativeStock | Blank = NONE;
  protected onlyFirstColumnFilled = false;
  protected skipRowIfTitleMatches = '';

  protected readonly saving = signal(false);
  protected readonly savedProfiles = signal<MappingProfile[]>([]);

  constructor() {
    if (this.canPickAnySupplier) {
      this.suppliersService.getSuppliers().subscribe({
        next: (suppliers) => this.suppliers.set(suppliers),
      });
    }
  }

  protected targetSupplierId(): string | null {
    return this.canPickAnySupplier ? this.selectedSupplierId : this.ownSupplierId;
  }

  protected missingRequiredFields(): MappableField[] {
    return this.requiredFields.filter((field) => !this.columnMap[field]?.trim());
  }

  protected save(): void {
    const supplierId = this.targetSupplierId();
    if (!supplierId || this.missingRequiredFields().length) return;

    const column_map: Partial<Record<MappableField, string>> = {};
    const transforms: Partial<Record<MappableField, string[]>> = {};
    for (const field of this.mappableFields) {
      const header = this.columnMap[field]?.trim();
      if (!header) continue;
      column_map[field] = header;
      const names = this.transformsText[field]
        ?.split(',')
        .map((name) => name.trim())
        .filter(Boolean);
      if (names?.length) transforms[field] = names;
    }

    const payload: CreateMappingProfileRequest = {
      format: FeedFormat.Csv,
      supplier_id: supplierId,
      column_map,
      // User-typed, free-text transform names — the backend is the source of
      // truth on which are valid and 422s on a bad one.
      transforms: transforms as CreateMappingProfileRequest['transforms'],
      reader_opts: this.readerOpts,
      rules: {
        on_duplicate_sku: this.onDuplicateSku || null,
        on_negative_stock: this.onNegativeStock || null,
        service_row_heuristic: this.onlyFirstColumnFilled ? 'only_first_column_filled' : null,
        skip_row_if_title_matches: this.skipRowIfTitleMatches.trim() || null,
      },
    };

    this.saving.set(true);
    this.profilesService.createProfile(payload).subscribe({
      next: (profile) => {
        this.savedProfiles.update((current) => [profile, ...current]);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  private emptyColumnMap(): Record<MappableField, string> {
    return Object.fromEntries(MAPPABLE_FIELDS.map((field) => [field, ''])) as Record<
      MappableField,
      string
    >;
  }
}
