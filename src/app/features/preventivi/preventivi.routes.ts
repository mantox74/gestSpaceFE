import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';

export const preventiviRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/preventivi/pages/preventivi-list/preventivi-list').then(
        (m) => m.PreventiviList,
      ),
    canActivate: [authGuard], // Protegge la rotta con l'AuthGuard
  },
];
