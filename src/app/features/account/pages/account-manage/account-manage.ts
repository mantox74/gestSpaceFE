import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, readonly, required, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserPayload } from '@app/core/auth/auth.model';
import { AuthService } from '@app/core/auth/auth.service';
import { SnackBarService } from '@app/core/services/snack-bar-service';
import { environment as env } from '@env/environment';

type AccountFormType = Omit<UserPayload, 'ruolo'> & {
  ruolo: string;
  vecchiaPassword: string;
  nuovaPassword: string;
  confermaNuovaPassword: string;
};

@Component({
  selector: 'app-account-manage',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormField,
    MatCardModule,
  ],
  templateUrl: './account-manage.html',
  styleUrl: './account-manage.scss',
})
export class AccountManage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  auth = inject(AuthService);

  formAccountModel = signal<AccountFormType>(undefined as unknown as AccountFormType);

  formAccount = form(this.formAccountModel, (schemaPath) => {
    readonly(schemaPath.ruolo);
    required(schemaPath.email, { message: 'La email è obbligatoria' });
    email(schemaPath.email, { message: 'La email non è valida' });
    required(schemaPath.nuovaPassword, {
      message: 'La nuova password è obbligatoria',
      when: ({ valueOf }) => valueOf(schemaPath.vecchiaPassword) !== '',
    });
    required(schemaPath.confermaNuovaPassword, {
      message: 'La conferma della nuova password è obbligatoria',
      when: ({ valueOf }) => valueOf(schemaPath.vecchiaPassword) !== '',
    });
    validate(schemaPath.confermaNuovaPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schemaPath.nuovaPassword)) {
        return {
          kind: 'nuovaPasswordMismatch',
          message: 'La conferma della nuova password non corrisponde',
        };
      }
      return null;
    });
  });

  constructor() {
    this.setInitData();
  }

  /**
   * Inizializza o resetta i dati del form con i dati dell'utente corrente
   */
  setInitData(): void {
    const currentUser = this.auth.currentUser();
    if (currentUser) {
      this.formAccountModel.set({
        ...currentUser,
        vecchiaPassword: '',
        nuovaPassword: '',
        confermaNuovaPassword: '',
      });
    }
  }

  salva(): void {
    this.http
      .patch<{
        message?: string;
        error?: string;
      }>(`${env.apiUrl}/account/modifica-account-utente`, this.formAccountModel())
      .subscribe({
        next: (response: { message?: string; error?: string }) => {
          if (response?.error) {
            this.snackBar.showError(response.error);
            return;
          }
          this.snackBar.showSuccess(response?.message || 'Account modificato con successo');
          // Faccio il logout perchè l'utente deve ricaricare il token con i nuovi dati!
          this.auth.logout();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error("Errore durante la modifica dell'account", error);
          this.snackBar.showError(
            "Errore durante la modifica dell'account, contattare un amministratore.",
          );
        },
      });
  }
}
