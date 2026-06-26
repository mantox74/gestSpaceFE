import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Sidebar } from '@shared/components/sidebar/sidebar';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    CommonModule,
    SpinnerComponent,
    MatIconModule,
    MatSidenavModule,
    Sidebar,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  readonly authService: AuthService = inject(AuthService);
  private router = inject(Router);

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
