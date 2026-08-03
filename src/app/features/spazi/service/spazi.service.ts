import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  SpaziDTO,
  SpazioDTO,
  SpazioPayload,
  SpaziSearchObj,
} from '@app/features/spazi/model/spazi.model';
import * as env from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';

@Service()
export class SpaziService {
  private http = inject(HttpClient);

  /**
   * Recupera gli spazi in base ai parametri di ricerca forniti.
   * @param searchObj Oggetto contenente i parametri di ricerca per filtrare gli spazi.
   * @returns Observable contenente i dati degli spazi.
   */
  getSpazi(searchObj: SpaziSearchObj): Observable<SpaziDTO> {
    return this.http.post<SpaziDTO>(`${env.environment.apiUrl}/spazi`, {
      ...searchObj,
    });
  }

  eliminaSpazio(id: number): Observable<void> {
    return this.http.delete<void>(`${env.environment.apiUrl}/spazi/${id}`);
  }

  creaSpazio(payload: SpazioPayload): Observable<SpazioDTO> {
    return this.http.post<SpazioDTO>(
      `${env.environment.apiUrl}/spazi/nuovo`,
      this.toFormData(payload),
    );
  }

  modificaSpazio(id: number, payload: SpazioPayload): Observable<SpazioDTO> {
    return this.http.put<SpazioDTO>(
      `${env.environment.apiUrl}/spazi/${id}`,
      this.toFormData(payload),
    );
  }

  private toFormData(payload: SpazioPayload): FormData {
    const formData = new FormData();

    formData.set('nome', payload.nome);
    formData.set('prezzo_giorno', String(payload.prezzo_giorno));
    formData.set('stato', payload.stato);

    if (payload.descrizione !== null) {
      formData.set('descrizione', payload.descrizione);
    }

    if (payload.note !== null) {
      formData.set('note', payload.note);
    }

    if (payload.lunghezza !== null) {
      formData.set('lunghezza', String(payload.lunghezza));
    }

    if (payload.larghezza !== null) {
      formData.set('larghezza', String(payload.larghezza));
    }

    if (payload.altezza !== null) {
      formData.set('altezza', String(payload.altezza));
    }

    if (payload.immagine) {
      formData.set('immagine', payload.immagine);
    }

    if (payload.rimuoviImmagine) {
      formData.set('rimuoviImmagine', 'true');
    }

    return formData;
  }
}
