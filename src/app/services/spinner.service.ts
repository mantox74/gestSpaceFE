import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  // Contatore delle richieste HTTP in corso
  private activeRequests = signal<number>(0);

  // Signal booleano letto dai componenti (es. la root del progetto)
  readonly isLoading = computed(() => this.activeRequests() > 0);

  show() {
    this.activeRequests.update((count) => count + 1);
  }

  hide() {
    this.activeRequests.update((count) => Math.max(0, count - 1)); // Evita valori negativi
  }
}
