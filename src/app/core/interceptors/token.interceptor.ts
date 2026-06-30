import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Lista degli URL da escludere (login e logout)
  const excludedUrls = ['/api/auth/login', '/api/auth/logout'];
  const router = inject(Router);

  // Controlla se l'URL della richiesta corrente corrisponde a uno di quelli esclusi
  const shouldExclude = excludedUrls.some((url) => req.url.includes(url));

  if (shouldExclude) {
    // Se è login o logout, passa la richiesta modificata così com'è
    return next(req);
  }

  // Recupera il token dal localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Clona la richiesta per aggiungere l'header Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Il token è scaduto o non valido sul server
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
    );
  } else {
    router.navigate(['/login']);

    throw new Error('Utente non autenticato. Reindirizzamento al login.');
  }
};
