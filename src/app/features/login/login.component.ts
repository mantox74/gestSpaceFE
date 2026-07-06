import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserData } from '@app/core/auth/auth.model';
import { AuthService } from '@app/core/auth/auth.service';
import { SnackBarService } from '@app/core/services/snack-bar-service';
import { finalize } from 'rxjs/internal/operators/finalize';

type LoginFormType = {
  email: string;
  password: string;
};
@Component({
  selector: 'app-login.component',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    FormField,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router: Router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private snackBar: SnackBarService = inject(SnackBarService);
  isLoading = signal(false);

  loginForm = form(
    signal<LoginFormType>({
      email: '',
      password: '',
    }),
    (schemaPath) => {
      required(schemaPath.email, { message: `Username è obbligatorio` });
      required(schemaPath.password, { message: `Password è obbligatorio` });
    },
  );

  login(): void {
    if (this.loginForm().valid()) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm().value();
      this.authService
        .login(email, password)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isLoading.set(false)),
        )
        .subscribe({
          next: (response: UserData | { error: string }) => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.snackBar.showError(
              error.error.error ||
                error.message ||
                "Errore durante il login. Contattare l'amministratore",
            );
          },
        });
    }
  }
}
