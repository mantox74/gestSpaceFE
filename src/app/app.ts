import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from '@app/services/spinner.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinnerModule, ButtonModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  isMenuOpen = signal(true);
  readonly spinnerService: SpinnerService = inject(SpinnerService);

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}
