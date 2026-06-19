import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Un signal che tiene traccia dello stato di login (es. controllando il localStorage)
  private isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  // Metodo sincrono usato dal Guard per il controllo immediato
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Metodo per il login: salva il token e aggiorna lo stato di autenticazione.
   * @param token jwd token
   */
  login(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticated.set(true);
  }

  /**
   * Metodo per il logout: rimuove il token e aggiorna lo stato di autenticazione.
   */
  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
  }
}
