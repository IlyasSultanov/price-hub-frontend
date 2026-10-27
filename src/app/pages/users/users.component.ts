import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ASSIGNABLE_ROLES, Role } from '@core/enums';
import { AppUser } from '@core/models/user.model';
import { UsersService } from '@core/services/users.service';
import { PageHeaderComponent } from '@shared/page-header/page-header.component';

interface UserRow extends AppUser {
  roleChanging: boolean;
}

@Component({
  selector: 'app-users',
  imports: [FormsModule, PageHeaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);

  protected readonly assignableRoles = ASSIGNABLE_ROLES;

  protected readonly rows = signal<UserRow[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.loadUsers();
  }

  protected onRoleChange(userId: string, role: Role): void {
    this.setRowFlag(userId, true);
    this.usersService.updateRole(userId, role).subscribe({
      next: (user) => this.replaceRow(userId, user),
      error: () => this.setRowFlag(userId, false),
    });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.rows.set(users.map((user) => ({ ...user, roleChanging: false })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private setRowFlag(userId: string, value: boolean): void {
    this.rows.update((current) =>
      current.map((row) => (row.id === userId ? { ...row, roleChanging: value } : row)),
    );
  }

  private replaceRow(userId: string, user: AppUser): void {
    this.rows.update((current) =>
      current.map((row) => (row.id === userId ? { ...user, roleChanging: false } : row)),
    );
  }
}
