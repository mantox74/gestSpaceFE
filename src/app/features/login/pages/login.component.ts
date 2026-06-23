import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

type LoginFormType = {
  username: string;
  password: string;
};
@Component({
  selector: 'app-login.component',
  imports: [CommonModule, InputTextModule, CardModule, PasswordModule, FormField, ButtonModule],
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
