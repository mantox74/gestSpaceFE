export interface HomeSpazio {
  totale: number;
  occupati: number;
  liberi: number;
  percentuale_occupazione: number;
}

export interface HomePreventivo {
  bozza: number;
  inviati: number;
  accettati: number;
  rifiutati: number;
  annullati: number;
  totale: number;
}

export interface HomeFattureStato {
  in_attesa: number;
  pagate: number;
  scadute: number;
  totale: number;
}

export interface HomePrenotazioniStato {
  confermate: number;
  in_corso: number;
  concluse: number;
  annullate: number;
  totale: number;
}

export interface HomePreventiviValoreStato {
  totale_preventivi: number;
  totale_valore: number;
  stati: HomePreventiviValoreStatoItem[];
}

export interface HomePreventiviValoreStatoItem {
  stato: 'BOZZA' | 'INVIATO' | 'ACCETTATO' | 'RIFIUTATO' | 'ANNULLATO';
  etichetta: string;
  totale: number;
  valore: number;
}

export interface HomeFatturato {
  anno: number;
  raggruppamento: 'mensile' | 'trimestrale';
  totale_anno: HomeFatturatoTotaleAnno;
  periodi: HomeFatturatoPeriodo[];
}

export interface HomeFatturatoPeriodo {
  periodo: number;
  etichetta: string;
  numero_fatture: number;
  totale_netto: number;
  totale_iva: number;
  totale_lordo: number;
}

export interface HomeFatturatoTotaleAnno {
  numero_fatture: number;
  totale_netto: number;
  totale_iva: number;
  totale_lordo: number;
}
