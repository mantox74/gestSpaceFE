export interface PreventivoDTO {
  cliente: PreventivoCliente;
  cliente_id: number;
  created_at: string;
  data_accettazione: string | null;
  data_fine: string;
  data_inizio: string;
  data_invio: string | null;
  dettaglio_calcolo: {
    giorni: number;
    importo: number;
    importo_iva?: number;
    importo_netto?: number;
    iva_percentuale?: number;
  };
  id: number;
  importo_totale: number;
  iva_percentuale: number;
  note: string;
  sconto_manuale_note: string | null;
  sconto_manuale_tipo: string | null;
  sconto_manuale_valore: number | null;
  spazio: PreventivoSpazio;
  spazio_id: number;
  stato: string;
}

export type PreventivoStato = 'BOZZA' | 'INVIATO' | 'ACCETTATO' | 'RIFIUTATO' | 'ANNULLATO';

export interface PreventiviSearchObj {
  stato?: PreventivoStato;
  cliente_id?: number;
  spazio_id?: number;
  data_inizio_da?: string;
  data_inizio_a?: string;
  search?: string;
  ordina_per?: PreventivoSortKey;
  direzione?: 'asc' | 'desc';
}

export type PreventivoSortKey =
  | 'created_at'
  | 'data_inizio'
  | 'data_fine'
  | 'importo_totale'
  | 'stato';

export type PreventiviFilterKey =
  | 'search'
  | 'stato'
  | 'cliente_id'
  | 'spazio_id'
  | 'data_inizio_da'
  | 'data_inizio_a';

export type PreventiviFilters = Partial<Pick<PreventiviSearchObj, PreventiviFilterKey>>;

export interface PreventivoPayload {
  cliente_id: number;
  spazio_id: number;
  data_inizio: string;
  data_fine: string;
  data_accettazione: string | null;
  note: string | null;
  stato?: PreventivoStato;
  sconto_manuale_tipo: ScontoManualeTipo | null;
  sconto_manuale_valore: number | null;
  sconto_manuale_note: string | null;
  iva_percentuale: number;
}

export type ScontoManualeTipo = 'IMPORTO' | 'PERCENTUALE';

export interface PreventivoMessageResponse {
  message: string;
  preventivo: PreventivoDTO;
}

export interface PreventiviListResponse {
  preventivi: PreventivoDTO[];
}

export interface ClienteOptionDTO {
  id: number;
  nome: string;
  cognome: string;
  codice_fiscale: string | null;
  p_iva: string | null;
}

export interface ClientiSearchResponse {
  data: ClienteOptionDTO[];
  total: number;
}

interface PreventivoCliente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  indirizzo: string;
  citta: string;
  cap: string | null;
  p_iva: string | null;
  codice_fiscale: string;
}

interface PreventivoSpazio {
  id: number;
  nome: string;
  prezzo_giorno: number;
  lunghezza: string | null;
  larghezza: string | null;
  altezza: string | null;
}
