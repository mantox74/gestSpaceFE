import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';

export const clientiRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/clienti/pages/clienti-list/clienti-list').then((m) => m.ClientiList),
    canActivate: [authGuard],
  },
];
