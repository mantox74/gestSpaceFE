import { inject, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Service()
export class SnackBarService {
  snackbar = inject(MatSnackBar);

  showSuccess(msg: string, duration: number = 4000) {
    this.snackbar.open(msg, 'OK', {
      duration: duration,
      panelClass: 'success',
    });
  }

  showError(msg: string, duration: number = 4000) {
    this.snackbar.open(msg, 'OK', {
      duration: duration,
      panelClass: 'error',
    });
  }

  showWarning(msg: string, duration: number = 4000) {
    this.snackbar.open(msg, 'OK', {
      duration: duration,
      panelClass: 'warning',
    });
  }
}
