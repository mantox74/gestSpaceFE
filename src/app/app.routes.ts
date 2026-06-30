import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard'; // Assicurati che il percorso sia corretto

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('@features/home/pages/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard], // Protegge la rotta con l'AuthGuard
  },
  {
    path: 'preventivi',
    loadChildren: () =>
      import('@features/preventivi/preventivi.routes').then((m) => m.preventiviRoutes),
    canActivate: [authGuard], // Protegge la rotta con l'AuthGuard
  }
  {
    path: '**',
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFoundComponent), // lazy loading per la pagina 404
  },
];
