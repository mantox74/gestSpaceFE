export interface PreventivoDTO {
  cliente: PreventivoCliente;
  cliente_id: number;
  created_at: string;
  data_fine: string;
  data_inizio: string;
  data_invio: string | null;
  dettaglio_calcolo: {
    giorni: number;
    importo: number;
  };
  id: number;
  importo_totale: number;
  note: string;
  sconto_manuale_note: string | null;
  sconto_manuale_tipo: string | null;
  sconto_manuale_valore: number | null;
  spazio: PreventivoSpazio;
  spazio_id: number;
  stato: string;
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
