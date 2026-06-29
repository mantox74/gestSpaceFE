import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@shared/components/sidebar/sidebar';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { UserMenu } from './shared/components/user-menu/user-menu';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    SpinnerComponent,
    MatIconModule,
    MatSidenavModule,
    Sidebar,
    UserMenu,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
