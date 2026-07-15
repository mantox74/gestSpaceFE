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

  creaSpazio(payload: SpazioPayload): Observable<SpazioDTO> {
    return this.http.post<SpazioDTO>(`${env.environment.apiUrl}/spazi/nuovo`, payload);
  }

  modificaSpazio(id: number, payload: SpazioPayload): Observable<SpazioDTO> {
    return this.http.put<SpazioDTO>(`${env.environment.apiUrl}/spazi/${id}`, payload);
  }
}
