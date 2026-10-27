import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div class="page-header__text">
        <h1>{{ title() }}</h1>
        <span class="muted">{{ subtitle() }}</span>
      </div>
      <div class="page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: [
    `
      .page-header {
        min-height: 76px;
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        padding: 16px 32px;
        border-bottom: 1px solid var(--border);
        background: var(--surface);
        gap: 16px;
      }
      .page-header__text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .page-header__text span {
        font-size: 13px;
      }
      .page-header__actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }
    `,
  ],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
