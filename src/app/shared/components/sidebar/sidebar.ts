import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { filter } from 'rxjs/internal/operators/filter';

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

  changeRoute = output<void>();

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.changeRoute.emit();
    });
  }

  gotoPage(path: string) {
    this.router.navigate([path]);
  }
}
