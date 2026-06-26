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
      import('@features/login/pages/login.component').then((m) => m.LoginComponent), // Esempio di lazy loading per il login
  },
  {
    path: 'home',
    loadComponent: () => import('@features/home/pages/home.component').then((m) => m.HomeComponent), // Esempio di lazy loading per il dashboard
    canActivate: [authGuard], // Protegge la rotta con l'AuthGuard
  },
];
