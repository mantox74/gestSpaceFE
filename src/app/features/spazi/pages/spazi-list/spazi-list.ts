import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Signal, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpaziDTO, SpazioDTO } from '@app/features/spazi/model/spazi.model';
import { SpaziService } from '@app/features/spazi/service/spazi.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Component({
  selector: 'app-spazi-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
  ],
  templateUrl: './spazi-list.html',
  styleUrl: './spazi-list.scss',
})
export class SpaziList {
  private spaziService = inject(SpaziService);

  page = signal<number>(1);
  limit = signal<number>(10);
  orderBy = signal<string>('nome');
  orderDir = signal<'asc' | 'desc'>('asc');

  private queryParams = computed(() => ({
    page: this.page(),
    limit: this.limit(),
    orderBy: this.orderBy(),
    orderDir: this.orderDir(),
  }));

  // Trasformiamo i parametri in un Observable, usiamo switchMap per chiamare il servizio,
  // e infine riconvertiamo tutto in un Signal con toSignal
  spazi: Signal<SpaziDTO | null> = toSignal<SpaziDTO | null>(
    toObservable(this.queryParams).pipe(switchMap((params) => this.spaziService.getSpazi(params))),
    { initialValue: null },
  );

  spaziData = computed<SpazioDTO[]>(() => {
    const res = this.spazi();
    return res && res.data ? res.data : [];
  });

  totalElements = computed<number>(() => {
    const res = this.spazi();
    return res && res.pagination.total ? res.pagination.total : 0;
  });

  sort = viewChild(MatSort);

  displayedColumns: (keyof SpazioDTO | 'dimensione' | 'azioni')[] = [
    'stato',
    'nome',
    'descrizione',
    'note',
    'dimensione',
    'prezzo_giorno',
    'azioni',
  ];

  constructor() {
    effect(() => {
      const sortInstance = this.sort();
      if (sortInstance) {
        // Quando l'utente clicca, aggiorniamo i nostri signal
        sortInstance.sortChange.subscribe((sortState: Sort) => {
          this.orderBy.set(sortState.active);
          this.orderDir.set(sortState.direction || 'asc');
          this.page.set(1); // Buona pratica: resetta alla prima pagina quando si ordina
        });
      }
    });
  }

  /**
   * Gestisce la modifica di uno spazio.
   * @param spazio Lo spazio da modificare.
   * @param event L'evento del mouse.
   */
  modificaSpazio(spazio: SpazioDTO, event: MouseEvent): void {
    this.stopPropagation(event); // Evita che l'evento si propaghi ad altri elementi
    alert('Modifica spazio:' + JSON.stringify(spazio, null, 2));
  }

  /**
   * Gestisce l'eliminazione di uno spazio.
   * @param spazio Lo spazio da eliminare.
   * @param event L'evento del mouse.
   */
  eliminaSpazio(spazio: SpazioDTO, event: MouseEvent): void {
    this.stopPropagation(event); // Evita che l'evento si propaghi ad altri elementi
    alert('Elimina spazio:' + JSON.stringify(spazio, null, 2));
  }

  /**
   * Gestisce la visualizzazione dei dettagli di uno spazio.
   * @param spazio Lo spazio di cui visualizzare i dettagli.
   * @param event L'evento del mouse.
   */
  visualizzaDettagliSpazio(spazio: SpazioDTO, event: MouseEvent): void {
    this.stopPropagation(event); // Evita che l'evento si propaghi ad altri elementi
    alert('Visualizza dettagli spazio:' + JSON.stringify(spazio, null, 2));
  }

  /**
   * Gestisce il cambiamento di pagina del paginator.
   * @param event L'evento generato dal MatPaginator.
   */
  onPageChange(event: PageEvent) {
    // MatPaginator è basato su indice 0 (0 = prima pagina), il tuo BE si aspetta base 1
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
  }

  private stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
