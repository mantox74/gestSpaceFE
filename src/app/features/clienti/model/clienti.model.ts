import { PaginationTableDTO } from '@app/shared/model/table.model';

export interface ClientiSearchObj {
  orderBy?: ClienteSortKey;
  orderDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

export type ClienteSortKey = 'nome' | 'cognome' | 'email' | 'created_at';

export type ClientiFilterKey = 'search';

export type ClientiFilters = Partial<Pick<ClientiSearchObj, ClientiFilterKey>>;

export interface ClientiDTO {
  data: ClienteDTO[];
  pagination: PaginationTableDTO;
}

export interface ClienteDTO {
  id: number;
  nome: string;
  cognome: string;
  email: string | null;
  telefono: string | null;
  indirizzo: string | null;
  numero_civico: string | null;
  cap: string | null;
  citta: string | null;
  provincia: string | null;
  codice_fiscale: string | null;
  p_iva: string | null;
  created_at: string;
  totale_prenotazioni?: string | number;
  ultima_prenotazione?: string | null;
}

export interface ClientePayload {
  nome: string;
  cognome: string;
  email: string | null;
  telefono: string | null;
  indirizzo: string | null;
  numero_civico: string | null;
  cap: string | null;
  citta: string | null;
  provincia: string | null;
  codice_fiscale: string | null;
  p_iva: string | null;
}
