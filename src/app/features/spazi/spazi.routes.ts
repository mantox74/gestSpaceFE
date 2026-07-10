import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';

export const spaziRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/spazi/pages/spazi-list/spazi-list').then((m) => m.SpaziList),
    canActivate: [authGuard],
  },
];
