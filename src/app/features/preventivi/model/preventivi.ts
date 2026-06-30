export interface PreventivoDTO {
  id: number;
  cliente_id: number;
  spazio_id: number;
  data_inizio: string;
  data_fine: string;
  importo_totale: number;
  stato: string;
  note: string;
  created_at: string;
  sconto_manuale_tipo: string | null;
  sconto_manuale_valore: number | null;
  sconto_manuale_note: string | null;
  dettaglio_calcolo: {
    giorni: number;
    importo: number;
  };
  data_invio: string | null;
  cliente_nome: string | null;
  cliente_cognome: string | null;
  cliente_email: string | null;
  cliente_telefono: string | null;
  spazio_nome: string | null;
  prezzo_giorno: number | null;
}
