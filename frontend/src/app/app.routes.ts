import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(d => d.Dashboard)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./features/analysis/analysis').then(a => a.Analysis)
  },
  {
    path: 'shipping',
    loadComponent: () => import('./features/shipping/shipping').then(s => s.Shipping)
  },
];
