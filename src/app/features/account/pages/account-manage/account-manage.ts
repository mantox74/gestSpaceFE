import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, readonly, required, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserPayload } from '@app/core/auth/auth.model';
import { AuthService } from '@app/core/auth/auth.service';

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
  auth = inject(AuthService);

  formAccountModel = signal<AccountFormType>({
    ...(this.auth.currentUser() as UserPayload),
    vecchiaPassword: '',
    nuovaPassword: '',
    confermaNuovaPassword: '',
  });

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

  /**
   * Resets the form to the current user data, clearing password fields.
   */
  resetForm(): void {
    this.formAccountModel.set({
      ...(this.auth.currentUser() as UserPayload),
      vecchiaPassword: '',
      nuovaPassword: '',
      confermaNuovaPassword: '',
    });
  }

  salva(): void {
    console.log('Salvataggio dati account:', this.formAccount().value());
  }
}
