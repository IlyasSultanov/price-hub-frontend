import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API } from '@core/api';
import { Feed, FeedUploadResponse } from '@core/models/feed.model';
import { BackendService } from '@core/services/backend.service';

@Injectable({ providedIn: 'root' })
export class FeedsService {
  private readonly backend = inject(BackendService);

  uploadFeed(supplierId: string, file: File): Observable<FeedUploadResponse> {
    const form = new FormData();
    form.append('supplier_id', supplierId);
    form.append('file', file, file.name);
    return this.backend.post<FeedUploadResponse>(API.feeds.upload, form, {
      successMessage: 'Feed uploaded',
    });
  }

  /** Polled by the feeds page while a feed's status is non-terminal — disables
   *  the spinner/toast so background refreshes stay invisible to the user. */
  getFeed(id: string): Observable<Feed> {
    return this.backend.get<Feed>(API.feeds.detail(id), {
      disableSpinner: true,
      disableErrorToastr: true,
    });
  }
}
