import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';

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
    loadComponent: () =>
      import('@features/home/pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'preventivi',
    loadChildren: () =>
      import('@features/preventivi/preventivi.routes').then((m) => m.preventiviRoutes),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
  {
    path: 'account-manage',
    loadComponent: () =>
      import('@features/account/pages/account-manage/account-manage').then((m) => m.AccountManage),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () => import('@features/not-found/not-found').then((m) => m.NotFoundComponent), // lazy loading per la pagina 404
  },
];
