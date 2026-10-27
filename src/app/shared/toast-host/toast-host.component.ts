import { Component, inject } from '@angular/core';

import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    <div class="toast-host">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.toast--error]="toast.kind === 'error'">
          <span class="toast__title">{{ toast.title }}</span>
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" type="button" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-host {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 2000;
        max-width: 360px;
      }
      .toast {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 12px 36px 12px 14px;
        border-radius: 10px;
        background: var(--pos-soft);
        border: 1px solid var(--pos);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      .toast--error {
        background: var(--neg-soft);
        border-color: var(--neg);
      }
      .toast__title {
        font-weight: 700;
        font-size: 13px;
      }
      .toast__message {
        font-size: 13px;
      }
      .toast__close {
        position: absolute;
        top: 6px;
        right: 8px;
        border: 0;
        background: transparent;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        color: inherit;
        opacity: 0.6;
      }
      .toast__close:hover {
        opacity: 1;
      }
    `,
  ],
})
export class ToastHostComponent {
  protected readonly toastService = inject(ToastService);
}
