import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service'; // Sostituisci con il percorso reale del tuo servizio

export const authGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se l'utente è loggato, permetti la navigazione
  if (authService.isLoggedIn()) {
    return true;
  }

  // Se NON è loggato, reindirizza alla pagina di login
  // Usiamo router.parseUrl per generare un UrlTree, che è l'approccio raccomandato in Angular
  return router.parseUrl('/login');
};
