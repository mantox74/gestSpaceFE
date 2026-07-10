import { PaginationTableDTO } from '@app/shared/model/table.model';

export interface SpaziSearchObj {
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

export interface SpaziDTO {
  data: SpazioDTO[];
  pagination: PaginationTableDTO;
}

export interface SpazioDTO {
  id: number;
  nome: string;
  descrizione: string;
  prezzo_giorno: string;
  stato: string;
  note: string;
  created_at: string;
  lunghezza: string;
  larghezza: string;
  altezza: string;
  immagine: string | null;
}
