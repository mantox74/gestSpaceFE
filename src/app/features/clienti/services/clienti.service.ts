import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  ClienteDTO,
  ClientePayload,
  ClientiDTO,
  ClientiSearchObj,
} from '@app/features/clienti/model/clienti.model';
import * as env from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';

@Service()
export class ClientiService {
  private http = inject(HttpClient);

  getClienti(searchObj: ClientiSearchObj): Observable<ClientiDTO> {
    return this.http.post<ClientiDTO>(`${env.environment.apiUrl}/clienti`, {
      ...searchObj,
    });
  }

  getCliente(id: number): Observable<ClienteDTO> {
    return this.http.get<ClienteDTO>(`${env.environment.apiUrl}/clienti/${id}`);
  }

  creaCliente(payload: ClientePayload): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${env.environment.apiUrl}/clienti/nuovo`, payload);
  }

  modificaCliente(id: number, payload: ClientePayload): Observable<ClienteDTO> {
    return this.http.put<ClienteDTO>(`${env.environment.apiUrl}/clienti/${id}`, payload);
  }

  eliminaCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${env.environment.apiUrl}/clienti/${id}`);
  }
}
