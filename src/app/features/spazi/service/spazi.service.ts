import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { SpaziDTO, SpaziSearchObj } from '@app/features/spazi/model/spazi.model';
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
      ...(searchObj as any),
    });
  }
}
