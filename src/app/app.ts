import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ProgressSpinnerModule,
    ButtonModule,
    CommonModule,
    SpinnerComponent,
    AvatarModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  isMenuOpen = signal(false);
  readonly authService: AuthService = inject(AuthService);
  private router = inject(Router);

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}
