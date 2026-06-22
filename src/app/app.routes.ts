import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard'; // Assicurati che il percorso sia corretto

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@features/home/home.routes').then((m) => m.homeRoutes),
    canActivateChild: [authGuard], // <--- Applicato qui! Protegge tutti i figli di home
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/features/login/pages/login.component').then((m) => m.LoginComponent), // Esempio di lazy loading per il login
  },
];
