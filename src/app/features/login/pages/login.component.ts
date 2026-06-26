import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type LoginFormType = {
  username: string;
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = form(
    signal<LoginFormType>({
      username: '',
      password: '',
    }),
    (schemaPath) => {
      required(schemaPath.username, { message: `Username è obbligatorio` });
      required(schemaPath.password, { message: `Password è obbligatorio` });
    },
  );

  login(): void {
    if (this.loginForm().valid()) {
      console.log('Login con', this.loginForm().value());
    } else {
      console.log('Form non valido', this.loginForm().errors());
    }
  }
}
