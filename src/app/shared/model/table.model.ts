/**
 * Rappresenta i dati di paginazione per una tabella, inclusi il numero totale di elementi, la pagina corrente, il limite di elementi per pagina, il numero totale di pagine e le informazioni sulla presenza di pagine successive o precedenti.
 */
export interface PaginationTableDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Rappresenta un elemento di chip per la ricerca, contenente una chiave, un'etichetta e un valore.
 * Viene utilizzato per visualizzare i filtri attivi nella UI e per gestire la rimozione dei filtri.
 */
export interface SearchChipItem {
  chiave: string;
  label: string;
  valore: string | number;
}
