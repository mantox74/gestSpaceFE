import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserData, UserPayload } from '@app/core/auth/auth.model';
import { environment as env } from '@env/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Il signal principale gestisce il token (la fonte della verità)
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

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
   * fa il login dell'utente, memorizza il token e restituisce i dati dell'utente
   * @param email email
   * @param password password
   * @returns Observable<UserData | { error: string }>
   */
  login(email: string, password: string): Observable<UserData | { error: string }> {
    return this.http.post<UserData>(`${env.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: UserData) => {
        if("error" in response) {
          this.tokenSignal.set(null);
        } else {
          this.tokenSignal.set(response.token);
        }
      }),
      catchError((error) => {
        this.tokenSignal.set(null);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Metodo per il logout: rimuove il token.
   */
  logout() {
    this.tokenSignal.set(null);
  }
}
