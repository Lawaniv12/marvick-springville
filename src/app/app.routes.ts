import { Routes } from '@angular/router';

export const routes: Routes = [
  // ── Agency site routes ─────────────────────────────────────────────────────
  // These all render inside AppComponent's <router-outlet>
  // which already has the navbar + footer wrapping them.
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

  // ── Music platform ─────────────────────────────────────────────────────────
  // MusicShellComponent is its OWN full-page layout.
  // It has no navbar or footer from AppComponent — it renders completely
  // independently with its own shell and persistent audio player.
  // Angular sees this BEFORE the ** wildcard so it won't get redirected.
  {
    path: 'music',
    loadComponent: () => import('./features/music/music-shell/music-shell.component').then(m => m.MusicShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/music/music-home/music-home.component').then(m => m.MusicHomeComponent),
      },
      {
        path: 'store',
        loadComponent: () => import('./features/music/music-store/music-store.component').then(m => m.MusicStoreComponent),
      },
      {
        path: 'gifts',
        loadComponent: () => import('./features/music/music-gifts/music-gifts.component').then(m => m.MusicGiftsComponent),
      },
    ],
  },

  // ── Wildcard — must always be last ─────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
  },
];