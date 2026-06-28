import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  private snackBar: SnackBarService = inject(SnackBarService);

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
      const { email, password } = this.loginForm().value();
      this.authService.login(email, password).subscribe({
        next: (response: UserData | { error: string }) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Errore durante il login:', error);
          this.snackBar.showError('Errore durante il login');
        },
      });
    }
  }
}
