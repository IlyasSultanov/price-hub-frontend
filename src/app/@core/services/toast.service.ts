import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message: string;
}

/** Tiny home-grown toast queue — kept dependency-free rather than pulling in a UI library for one widget. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly nextId = signal(1);
  readonly toasts = signal<Toast[]>([]);

  success(message: string, title = 'Done'): void {
    this.push('success', title, message);
  }

  error(message: string, title = 'Error'): void {
    this.push('error', title, message);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  private push(kind: ToastKind, title: string, message: string): void {
    const id = this.nextId();
    this.nextId.set(id + 1);
    this.toasts.update((current) => [...current, { id, kind, title, message }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
