import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, finalize, take, tap } from 'rxjs';

import { ApiErrorBody } from '@core/models/auth.model';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  successMessage?: string;
  disableErrorToastr?: boolean;
  disableSpinner?: boolean;
}

/** Single entry point for HTTP: spinner, success/error toasts and FastAPI-shaped (RFC 9457-ish) error parsing. */
@Injectable({ providedIn: 'root' })
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(LoadingService);
  private readonly toast = inject(ToastService);

  get<T>(url: string, options: RequestOptions = {}): Observable<T> {
    return this.run(this.http.get<T>(url, { params: this.buildParams(options.params) }), options);
  }

  post<T>(url: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.run(this.http.post<T>(url, body), options);
  }

  patch<T>(url: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.run(this.http.patch<T>(url, body), options);
  }

  private run<T>(request$: Observable<T>, options: RequestOptions): Observable<T> {
    if (!options.disableSpinner) this.loading.start();
    return request$.pipe(
      take(1),
      tap({
        next: () => {
          if (options.successMessage) {
            this.toast.success(options.successMessage);
          }
        },
        error: (error: HttpErrorResponse) => {
          if (!options.disableErrorToastr) {
            this.toast.error(this.parseError(error));
          }
        },
      }),
      finalize(() => {
        if (!options.disableSpinner) this.loading.stop();
      }),
    );
  }

  private buildParams(params?: Record<string, string | number | boolean | undefined>): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }

  private parseError(error: HttpErrorResponse): string {
    const body = error.error as ApiErrorBody | undefined;
    if (body?.detail) {
      if (Array.isArray(body.detail)) {
        return body.detail.map((item) => `${item.loc.join('.')}: ${item.msg}`).join('; ');
      }
      return body.detail;
    }
    if (error.status === 0) {
      return 'Could not connect to the server';
    }
    return `Server error (${error.status})`;
  }
}
