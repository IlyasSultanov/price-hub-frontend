import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink],
  template: `
    <div class="forbidden">
      <h1>403</h1>
      <p class="muted">You don't have permission to see this page.</p>
      <a class="btn btn-primary" routerLink="/feeds">Back to feeds</a>
    </div>
  `,
  styles: [
    `
      .forbidden {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }
      h1 {
        margin: 0;
        font-size: 48px;
      }
    `,
  ],
})
export class ForbiddenComponent {}
