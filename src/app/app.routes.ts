import { Routes } from '@angular/router';

import { Permission } from '@core/enums';
import { authGuard } from '@core/guards/auth.guard';
import { permissionGuard } from '@core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./@layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'feeds' },
      {
        path: 'feeds',
        data: { permission: Permission.FeedsManage },
        canActivate: [permissionGuard],
        loadComponent: () => import('./pages/feeds/feeds.component').then((m) => m.FeedsComponent),
      },
      {
        path: 'mapping-profiles',
        data: { permission: Permission.MappingProfilesManage },
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./pages/mapping-profiles/mapping-profiles.component').then(
            (m) => m.MappingProfilesComponent,
          ),
      },
      {
        path: 'suppliers',
        data: { permission: Permission.SuppliersManage },
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./pages/suppliers/suppliers.component').then((m) => m.SuppliersComponent),
      },
      {
        path: 'users',
        data: { permission: Permission.UsersManage },
        canActivate: [permissionGuard],
        loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./pages/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
