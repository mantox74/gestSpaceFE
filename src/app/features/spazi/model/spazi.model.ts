import { PaginationTableDTO } from '@app/shared/model/table.model';

export interface SpaziSearchObj {
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
  stato?: SpazioStato;
  prezzo_min?: number;
  prezzo_max?: number;
  lunghezza_min?: number;
  larghezza_min?: number;
  altezza_min?: number;
  disponibile_da?: string;
  disponibile_a?: string;
}

export type SpazioStato = 'ATTIVO' | 'NON_ATTIVO';

export type SpaziFilterKey =
  | 'search'
  | 'stato'
  | 'prezzo_min'
  | 'prezzo_max'
  | 'lunghezza_min'
  | 'larghezza_min'
  | 'altezza_min';

export type SpaziFilters = Partial<Pick<SpaziSearchObj, SpaziFilterKey>>;

export interface SpaziDTO {
  data: SpazioDTO[];
  pagination: PaginationTableDTO;
}

export interface SpazioDTO {
  id: number;
  nome: string;
  descrizione: string;
  prezzo_giorno: string;
  stato: SpazioStato;
  note: string;
  created_at: string;
  lunghezza: string;
  larghezza: string;
  altezza: string;
  immagine: string | null;
}

export interface SpazioPayload {
  nome: string;
  descrizione: string | null;
  prezzo_giorno: number;
  stato: SpazioStato;
  note: string | null;
  lunghezza: number | null;
  larghezza: number | null;
  altezza: number | null;
  immagine?: File | null;
  rimuoviImmagine?: boolean;
}
