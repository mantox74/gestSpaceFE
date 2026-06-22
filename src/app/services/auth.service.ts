import { computed, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  nome: string;
  cognome: string;
  ruolo: 'ADMIN' | 'OPERATORE';
  stato: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Il signal principale gestisce il token (la fonte della verità)
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  // Stato di autenticazione derivato dal token
  isAuthenticated = computed(() => !!this.tokenSignal());

  // Dati utente derivati AUTOMATICAMENTE dal token
  currentUser = computed<UserPayload | null>(() => {
    const token = this.tokenSignal();
    if (!token) return null;
    try {
      return jwtDecode<UserPayload>(token);
    } catch (e) {
      console.error('Token non valido', e);
      return null;
    }
  });

  // Metodo sincrono usato dal Guard per il controllo immediato
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Metodo per il login: salva il token e aggiorna lo stato di autenticazione.
   * @param token jwt token
   */
  login(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Metodo per il logout: rimuove il token e aggiorna lo stato di autenticazione.
   */
  logout() {
    localStorage.removeItem('token');
  }
}
