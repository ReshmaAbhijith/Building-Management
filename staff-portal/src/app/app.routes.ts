import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'complaints',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/complaints/complaint-list/complaint-list.component').then(m => m.ComplaintListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/complaints/complaint-detail/complaint-detail.component').then(m => m.ComplaintDetailComponent)
      }
    ]
  },
  {
    path: 'tenants',
    loadComponent: () => import('./components/tenants/tenant-list/tenant-list.component').then(m => m.TenantListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'staff',
    loadComponent: () => import('./components/staff/staff-list/staff-list.component').then(m => m.StaffListComponent),
    canActivate: [authGuard, roleGuard(['Admin', 'Supervisor'])]
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard, roleGuard(['Admin'])]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
