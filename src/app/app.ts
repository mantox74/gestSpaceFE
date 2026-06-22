import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from '@app/shared/components/spinner/spinner.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinnerModule, ButtonModule, CommonModule, SpinnerComponent],
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
