import { MatPaginatorIntl } from '@angular/material/paginator';

export function getItalianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elementi per pagina:';
  paginatorIntl.nextPageLabel = 'Pagina successiva';
  paginatorIntl.previousPageLabel = 'Pagina precedente';
  paginatorIntl.firstPageLabel = 'Prima pagina';
  paginatorIntl.lastPageLabel = 'Ultima pagina';

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) return `0 di ${length}`;
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} di ${length}`;
  };

  return paginatorIntl;
}
