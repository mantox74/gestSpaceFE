import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Signal, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from '@app/core/services/snack-bar-service';
import { SpazioCreateForm } from '@app/features/spazi/components/spazio-create-form/spazio-create-form';
import { SpazioEditForm } from '@app/features/spazi/components/spazio-edit-form/spazio-edit-form';
import { SpaziDTO, SpaziFilters, SpazioDTO } from '@app/features/spazi/model/spazi.model';
import { SpaziService } from '@app/features/spazi/service/spazi.service';
import {
  DynamicDialog,
  DynamicDialogAction,
} from '@app/shared/components/dynamic-dialog/dynamic-dialog';
import { SpaziSearchForm } from '@features/spazi/components/spazi-search-form/spazi-search-form';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';

type SpazioDialogForm = {
  salva: () => Observable<SpazioDTO> | null;
  isInvalid: () => boolean;
};

@Component({
  selector: 'app-spazi-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
    SpaziSearchForm,
  ],
  templateUrl: './spazi-list.html',
  styleUrl: './spazi-list.scss',
})
export class SpaziList {
  private spaziService = inject(SpaziService);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);

  page = signal<number>(1);
  limit = signal<number>(10);
  orderBy = signal<string>('nome');
  orderDir = signal<'asc' | 'desc'>('asc');
  filters = signal<SpaziFilters>({});
  showApplicableFilters = signal(false);
  refresh = signal(0);

  private queryParams = computed(() => ({
    ...this.filters(),
    refresh: this.refresh(),
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
    this.stopPropagation(event);

    this.openSpazioDialog({
      title: 'Modifica spazio',
      description: 'Aggiorna le informazioni dello spazio selezionato.',
      component: SpazioEditForm,
      componentInputs: { spazio },
      successMessage: 'Spazio modificato correttamente',
    });
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

  aggiungiSpazio(): void {
    this.openSpazioDialog({
      title: 'Aggiungi spazio',
      description: 'Inserisci i dati principali del nuovo spazio.',
      component: SpazioCreateForm,
      successMessage: 'Spazio creato correttamente',
    });
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

  toggleApplicableFilters(): void {
    this.showApplicableFilters.update((value) => !value);
  }

  onFiltersChange(filters: SpaziFilters): void {
    this.filters.set(filters);
    this.page.set(1);
  }

  private stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  private openSpazioDialog(config: {
    title: string;
    description: string;
    component: typeof SpazioCreateForm | typeof SpazioEditForm;
    componentInputs?: Record<string, unknown>;
    successMessage: string;
  }): void {
    this.dialog.open(DynamicDialog<SpazioDialogForm>, {
      width: 'min(56rem, 96vw)',
      maxWidth: '96vw',
      data: {
        title: config.title,
        description: config.description,
        component: config.component,
        componentInputs: config.componentInputs,
        actions: [
          {
            label: 'Annulla',
            icon: 'close',
            appearance: 'outlined',
            closesDialog: true,
          },
          {
            label: 'Salva',
            icon: 'save',
            appearance: 'filled',
            disabled: (component: SpazioDialogForm | null) => component?.isInvalid() ?? true,
            action: (component: SpazioDialogForm | null, dialogRef: MatDialogRef<DynamicDialog>) =>
              this.submitSpazioDialog(component, dialogRef, config.successMessage),
          },
        ] satisfies DynamicDialogAction<SpazioDialogForm>[],
      },
    });
  }

  private submitSpazioDialog(
    component: SpazioDialogForm | null,
    dialogRef: MatDialogRef<DynamicDialog>,
    successMessage: string,
  ): void {
    const request = component?.salva();

    if (!request) {
      return;
    }

    request.subscribe({
      next: () => {
        this.snackBar.showSuccess(successMessage);
        dialogRef.close(true);
        this.refresh.update((value) => value + 1);
      },
      error: (error: unknown) => {
        const message = this.getErrorMessage(error);
        this.snackBar.showError(message);
      },
    });
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const candidate = (error as { error?: { error?: string } }).error?.error;
      if (candidate) {
        return candidate;
      }
    }

    return 'Errore durante il salvataggio dello spazio';
  }
}
