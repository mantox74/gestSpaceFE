import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '@services/spinner.service';
import { finalize } from 'rxjs/operators';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);

  // Mostra lo spinner all'avvio della richiesta
  spinnerService.show();

  return next(req).pipe(
    // Il finalize viene eseguito SEMPRE, sia su successo (200 OK) che su errore (4xx, 5xx)
    finalize(() => {
      spinnerService.hide();
    }),
  );
};
