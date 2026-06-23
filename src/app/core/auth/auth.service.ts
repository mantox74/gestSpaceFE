import { computed, effect, Injectable, signal } from '@angular/core';
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

  // Dati utente derivati AUTOMATICAMENTE dal token
  currentUser = computed<UserPayload | null>(() => {
    const token = this.tokenSignal();
    if (!token) return null;
    try {
      return jwtDecode<UserPayload>(token);
      // return {
      //   nome: 'Massimiliano',
      //   cognome: 'Mantovani',
      //   ruolo: 'OPERATORE',
      //   stato: 'ATTIVO',
      // };
    } catch (e) {
      console.error('Token non valido', e);
      return null;
    }
  });

  constructor() {
    effect(() => {
      const token = this.tokenSignal();
      // console.log('Token aggiornato:', token);
      token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
    });
  }

  // Metodo sincrono usato dal Guard per il controllo immediato
  isLoggedIn(): boolean {
    // console.log('Controllo isLoggedIn:', !!this.tokenSignal());
    return !!this.tokenSignal();
  }

  /**
   * Metodo per il login: salva il token .
   * @param token jwt token
   */
  login(token: string) {
    this.tokenSignal.set(token);
  }

  /**
   * Metodo per il logout: rimuove il token.
   */
  logout() {
    this.tokenSignal.set(null);
  }
}
