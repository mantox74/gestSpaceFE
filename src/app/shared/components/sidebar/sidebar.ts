import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);

  gotoPage(path: string) {
    this.router.navigate([path]);
  }
}
