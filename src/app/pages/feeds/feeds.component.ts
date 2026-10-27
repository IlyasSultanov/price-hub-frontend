import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { forkJoin, interval } from 'rxjs';

import { Permission, TERMINAL_FEED_STATUSES } from '@core/enums';
import { Feed } from '@core/models/feed.model';
import { Supplier } from '@core/models/supplier.model';
import { AuthService } from '@core/services/auth.service';
import { FeedsService } from '@core/services/feeds.service';
import { PermissionsService } from '@core/services/permissions.service';
import { SuppliersService } from '@core/services/suppliers.service';
import { PageHeaderComponent } from '@shared/page-header/page-header.component';

const POLL_INTERVAL_MS = 3000;

@Component({
  selector: 'app-feeds',
  imports: [FormsModule, DatePipe, PageHeaderComponent],
  templateUrl: './feeds.component.html',
  styleUrl: './feeds.component.scss',
})
export class FeedsComponent {
  private readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionsService);
  private readonly suppliersService = inject(SuppliersService);
  private readonly feedsService = inject(FeedsService);
  private readonly destroyRef = inject(DestroyRef);

  /** Only admins see a picker — a supplier_manager always acts on their own supplier,
   *  taken straight from the `supplier_id` token claim (they have no access to list suppliers). */
  protected readonly canPickAnySupplier = this.permissions.has(Permission.SuppliersManage);
  protected readonly ownSupplierId = this.auth.currentUser()?.supplierId ?? null;

  protected readonly suppliers = signal<Supplier[]>([]);
  protected selectedSupplierId = '';

  protected selectedFile: File | null = null;
  protected readonly uploading = signal(false);
  protected readonly feeds = signal<Feed[]>([]);

  /** Plain method, not a computed() — `selectedSupplierId` is an ngModel-bound
   *  field, not a signal, so a computed() here would never re-run after init. */
  protected targetSupplierId(): string | null {
    return this.canPickAnySupplier ? this.selectedSupplierId : this.ownSupplierId;
  }

  constructor() {
    if (this.canPickAnySupplier) {
      this.suppliersService.getSuppliers().subscribe({
        next: (suppliers) => this.suppliers.set(suppliers),
      });
    }

    interval(POLL_INTERVAL_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.pollActiveFeeds());
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  protected uploadFeed(): void {
    const supplierId = this.targetSupplierId();
    if (!supplierId || !this.selectedFile) return;

    this.uploading.set(true);
    this.feedsService.uploadFeed(supplierId, this.selectedFile).subscribe({
      next: ({ feed }) => {
        this.feeds.update((current) => [feed, ...current.filter((f) => f.id !== feed.id)]);
        this.selectedFile = null;
        this.uploading.set(false);
      },
      error: () => this.uploading.set(false),
    });
  }

  protected isTerminal(feed: Feed): boolean {
    return TERMINAL_FEED_STATUSES.includes(feed.status);
  }

  private pollActiveFeeds(): void {
    const active = this.feeds().filter((feed) => !this.isTerminal(feed));
    if (!active.length) return;

    forkJoin(active.map((feed) => this.feedsService.getFeed(feed.id))).subscribe({
      next: (refreshed) => {
        this.feeds.update((current) =>
          current.map((feed) => refreshed.find((r) => r.id === feed.id) ?? feed),
        );
      },
    });
  }
}
