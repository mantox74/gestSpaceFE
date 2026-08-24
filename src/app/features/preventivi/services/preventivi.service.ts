import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {
  ClientiSearchResponse,
  PreventiviListResponse,
  PreventiviSearchObj,
  PreventivoDTO,
  PreventivoMessageResponse,
  PreventivoPayload,
  PreventivoStato,
} from '@app/features/preventivi/model/preventivi.interfaces';
import * as env from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

type PreventivoDetailResponse = PreventivoDTO & {
  cliente_nome?: string;
  cliente_cognome?: string;
  cliente_email?: string;
  cliente_telefono?: string;
  cliente_indirizzo?: string;
  codice_fiscale?: string | null;
  p_iva?: string | null;
  spazio_nome?: string;
  prezzo_giorno?: number;
};

@Service()
export class PreventiviService {
  private http = inject(HttpClient);

  getPreventivi(searchObj: PreventiviSearchObj): Observable<PreventivoDTO[]> {
    return this.http.post<PreventivoDTO[]>(`${env.environment.apiUrl}/preventivi`, {
      ...searchObj,
    });
  }

  getPreventivo(id: number): Observable<PreventivoDTO> {
    return this.http
      .get<PreventivoDetailResponse>(`${env.environment.apiUrl}/preventivi/${id}`)
      .pipe(map((preventivo) => this.toPreventivoDTO(preventivo)));
  }

  stampaPreventivo(id: number): Observable<Blob> {
    return this.http.get(`${env.environment.apiUrl}/preventivi/${id}/stampa`, {
      responseType: 'blob',
    });
  }

  creaPreventivo(payload: PreventivoPayload): Observable<PreventivoDTO> {
    return this.http.post<PreventivoDTO>(`${env.environment.apiUrl}/preventivi/nuovo`, payload);
  }

  modificaPreventivo(id: number, payload: PreventivoPayload): Observable<PreventivoDTO> {
    return this.http.put<PreventivoDTO>(
      `${env.environment.apiUrl}/preventivi/${id}/modifica`,
      payload,
    );
  }

  inviaPreventivo(id: number): Observable<PreventivoMessageResponse> {
    return this.http.post<PreventivoMessageResponse>(
      `${env.environment.apiUrl}/preventivi/${id}/invia`,
      {},
    );
  }

  convertiPreventivo(id: number): Observable<PreventivoMessageResponse> {
    return this.http.post<PreventivoMessageResponse>(
      `${env.environment.apiUrl}/preventivi/${id}/converti`,
      {},
    );
  }

  rifiutaPreventivo(id: number): Observable<PreventivoMessageResponse> {
    return this.cambiaStatoPreventivo(id, 'RIFIUTATO');
  }

  annullaPreventivo(id: number): Observable<PreventivoMessageResponse> {
    return this.cambiaStatoPreventivo(id, 'ANNULLATO');
  }

  getPreventiviAperti(): Observable<PreventiviListResponse> {
    return this.http.get<PreventiviListResponse>(`${env.environment.apiUrl}/preventivi/aperti`);
  }

  getPreventiviDaInviare(): Observable<PreventiviListResponse> {
    return this.http.get<PreventiviListResponse>(`${env.environment.apiUrl}/preventivi/da-inviare`);
  }

  getClientiOptions(): Observable<ClientiSearchResponse> {
    return this.http.post<ClientiSearchResponse>(`${env.environment.apiUrl}/clienti`, {
      orderBy: 'cognome',
      orderDir: 'ASC',
      page: 1,
      limit: 100,
    });
  }

  private cambiaStatoPreventivo(
    id: number,
    stato: Extract<PreventivoStato, 'RIFIUTATO' | 'ANNULLATO'>,
  ): Observable<PreventivoMessageResponse> {
    return this.http.put<PreventivoMessageResponse>(
      `${env.environment.apiUrl}/preventivi/${id}/rifiuta-annulla`,
      { stato },
    );
  }

  private toPreventivoDTO(preventivo: PreventivoDetailResponse): PreventivoDTO {
    if (preventivo.cliente && preventivo.spazio) {
      return preventivo;
    }

    return {
      ...preventivo,
      cliente: {
        id: preventivo.cliente_id,
        nome: preventivo.cliente_nome ?? '',
        cognome: preventivo.cliente_cognome ?? '',
        email: preventivo.cliente_email ?? '',
        telefono: preventivo.cliente_telefono ?? '',
        indirizzo: preventivo.cliente_indirizzo ?? '',
        citta: '',
        cap: null,
        p_iva: preventivo.p_iva ?? null,
        codice_fiscale: preventivo.codice_fiscale ?? '',
      },
      spazio: {
        id: preventivo.spazio_id,
        nome: preventivo.spazio_nome ?? '',
        prezzo_giorno: Number(preventivo.prezzo_giorno ?? 0),
        lunghezza: null,
        larghezza: null,
        altezza: null,
      },
    };
  }
}
