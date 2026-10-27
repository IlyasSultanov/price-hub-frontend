import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Permission } from '@core/enums';
import { AuthService } from '@core/services/auth.service';
import { PermissionsService } from '@core/services/permissions.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly permissions = inject(PermissionsService);

  protected readonly Permission = Permission;

  protected get userInitial(): string {
    const name = this.auth.currentUser()?.username ?? '?';
    return name.charAt(0).toUpperCase();
  }

  protected logout(): void {
    this.auth.logout();
  }
}
