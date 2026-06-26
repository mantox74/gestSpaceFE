import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, CommonModule, SpinnerComponent, MatIconModule],
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
