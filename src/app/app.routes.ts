import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'get-started',
    loadComponent: () => import('./features/pipeline/pipeline.component').then(m => m.PipelineComponent),
  },
  {
    path: 'get-started/:package',
    loadComponent: () => import('./features/pipeline/pipeline.component').then(m => m.PipelineComponent),
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
  },
  {
    path: 'crm',
    loadComponent: () => import('./features/crm/crm.component').then(m => m.CrmComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
