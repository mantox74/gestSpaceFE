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
import { PreventiviSearchForm } from '@app/features/preventivi/components/preventivi-search-form/preventivi-search-form';
import { PreventivoCreateForm } from '@app/features/preventivi/components/preventivo-create-form/preventivo-create-form';
import { PreventivoDetail } from '@app/features/preventivi/components/preventivo-detail/preventivo-detail';
import { PreventivoEditForm } from '@app/features/preventivi/components/preventivo-edit-form/preventivo-edit-form';
import {
  PreventiviFilters,
  PreventivoDTO,
  PreventivoSortKey,
} from '@app/features/preventivi/model/preventivi.interfaces';
import { PreventiviService } from '@app/features/preventivi/services/preventivi.service';
import { DynamicDialogConfirm } from '@app/shared/components/dynamic-dialog-confirm/dynamic-dialog-confirm';
import {
  DynamicDialog,
  DynamicDialogAction,
} from '@app/shared/components/dynamic-dialog/dynamic-dialog';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';

type PreventivoDialogForm = {
  salva: () => Observable<PreventivoDTO> | null;
  isInvalid: () => boolean;
};

type PreventivoCommand = 'invia' | 'converti' | 'rifiuta' | 'annulla';

@Component({
  selector: 'app-preventivi-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    PreventiviSearchForm,
  ],
  templateUrl: './preventivi-list.html',
  styleUrl: './preventivi-list.scss',
})
export class PreventiviList {
  private preventiviService = inject(PreventiviService);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);

  page = signal<number>(1);
  limit = signal<number>(10);
  orderBy = signal<PreventivoSortKey>('created_at');
  orderDir = signal<'asc' | 'desc'>('desc');
  filters = signal<PreventiviFilters>({});
  showApplicableFilters = signal(false);
  refresh = signal(0);

  private queryParams = computed(() => ({
    ...this.filters(),
    refresh: this.refresh(),
    ordina_per: this.orderBy(),
    direzione: this.orderDir(),
  }));

  preventivi: Signal<PreventivoDTO[]> = toSignal(
    toObservable(this.queryParams).pipe(
      switchMap((params) => this.preventiviService.getPreventivi(params)),
    ),
    { initialValue: [] as PreventivoDTO[] },
  );

  preventiviData = computed<PreventivoDTO[]>(() => {
    const start = (this.page() - 1) * this.limit();
    return this.preventivi().slice(start, start + this.limit());
  });

  totalElements = computed<number>(() => this.preventivi().length);

  sort = viewChild(MatSort);

  displayedColumns: (keyof PreventivoDTO | 'cliente_nome' | 'spazio_nome' | 'azioni')[] = [
    'stato',
    'cliente_nome',
    'spazio_nome',
    'data_inizio',
    'data_fine',
    'importo_totale',
    'azioni',
  ];

  constructor() {
    effect(() => {
      const sortInstance = this.sort();
      if (sortInstance) {
        sortInstance.sortChange.subscribe((sortState: Sort) => {
          this.orderBy.set(this.toPreventivoSortKey(sortState.active));
          this.orderDir.set(sortState.direction || 'asc');
          this.page.set(1);
        });
      }
    });
  }

  aggiungiPreventivo(): void {
    this.openPreventivoDialog({
      title: 'Aggiungi preventivo',
      description: 'Inserisci cliente, spazio e periodo del nuovo preventivo.',
      component: PreventivoCreateForm,
      successMessage: 'Preventivo creato correttamente',
    });
  }

  modificaPreventivo(preventivo: PreventivoDTO, event: MouseEvent): void {
    this.stopPropagation(event);
    this.openPreventivoDialog({
      title: 'Modifica preventivo',
      description: 'Aggiorna i dati principali del preventivo selezionato.',
      component: PreventivoEditForm,
      componentInputs: { preventivo },
      successMessage: 'Preventivo modificato correttamente',
    });
  }

  dettaglioPreventivo(preventivo: PreventivoDTO, event: MouseEvent): void {
    this.stopPropagation(event);
    const dialogRef = this.dialog.open(DynamicDialog<PreventivoDetail>, {
      width: 'min(64rem, 96vw)',
      maxWidth: '96vw',
      height: '96vh',
      maxHeight: '96vh',
      panelClass: 'preventivo-detail-dialog',
      data: {
        title: 'Dettaglio preventivo',
        description: 'Visualizza le informazioni del preventivo selezionato.',
        component: PreventivoDetail,
        componentInputs: {
          preventivo,
          invia: () => this.inviaPreventivoDaDettaglio(preventivo),
          stampa: () => this.stampaPreventivoDaDettaglio(preventivo),
          converti: () => this.confirmPreventivoCommand(preventivo, 'converti'),
          chiudi: () => dialogRef.close(),
        },
        actions: [] satisfies DynamicDialogAction<PreventivoDetail>[],
      },
    });
  }

  private inviaPreventivoDaDettaglio(preventivo: PreventivoDTO): void {
    this.preventiviService.inviaPreventivo(preventivo.id).subscribe({
      next: () => {
        this.snackBar.showSuccess('Preventivo inviato correttamente');
        this.refresh.update((value) => value + 1);
      },
      error: (error: unknown) => {
        this.snackBar.showError(this.getErrorMessage(error));
      },
    });
  }

  private stampaPreventivoDaDettaglio(preventivo: PreventivoDTO): void {
    this.preventiviService.stampaPreventivo(preventivo.id).subscribe({
      next: (pdf) => {
        this.downloadPdf(pdf, `preventivo-${preventivo.id}.pdf`);
      },
      error: (error: unknown) => {
        this.snackBar.showError(this.getErrorMessage(error));
      },
    });
  }

  annullaPreventivo(preventivo: PreventivoDTO, event: MouseEvent): void {
    this.stopPropagation(event);
    this.confirmPreventivoCommand(preventivo, 'annulla');
  }

  private confirmPreventivoCommand(preventivo: PreventivoDTO, command: PreventivoCommand): void {
    const labels = this.getCommandLabels(command);
    this.dialog
      .open(DynamicDialogConfirm, {
        width: 'min(32rem, 96vw)',
        maxWidth: '96vw',
        data: {
          title: labels.title,
          text: `Sei sicuro di voler ${labels.verb} il preventivo <strong>#${preventivo.id}</strong>?`,
          closeLabel: 'Annulla',
          okLabel: 'Conferma',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.runPreventivoCommand(preventivo.id, command).subscribe({
            next: () => {
              this.snackBar.showSuccess(labels.successMessage);
              this.refresh.update((value) => value + 1);
            },
            error: (error: unknown) => {
              this.snackBar.showError(this.getErrorMessage(error));
            },
          });
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
  }

  toggleApplicableFilters(): void {
    this.showApplicableFilters.update((value) => !value);
  }

  onFiltersChange(filters: PreventiviFilters): void {
    this.filters.set(filters);
    this.page.set(1);
  }

  private stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  private openPreventivoDialog(config: {
    title: string;
    description: string;
    component: typeof PreventivoCreateForm | typeof PreventivoEditForm;
    componentInputs?: Record<string, unknown>;
    successMessage: string;
  }): void {
    this.dialog.open(DynamicDialog<PreventivoDialogForm>, {
      width: 'min(52rem, 96vw)',
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
            disabled: (component: PreventivoDialogForm | null) => component?.isInvalid() ?? true,
            action: (
              component: PreventivoDialogForm | null,
              dialogRef: MatDialogRef<DynamicDialog>,
            ) => this.submitPreventivoDialog(component, dialogRef, config.successMessage),
          },
        ] satisfies DynamicDialogAction<PreventivoDialogForm>[],
      },
    });
  }

  private submitPreventivoDialog(
    component: PreventivoDialogForm | null,
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
        this.snackBar.showError(this.getErrorMessage(error));
      },
    });
  }

  private runPreventivoCommand(id: number, command: PreventivoCommand) {
    switch (command) {
      case 'invia':
        return this.preventiviService.inviaPreventivo(id);
      case 'converti':
        return this.preventiviService.convertiPreventivo(id);
      case 'rifiuta':
        return this.preventiviService.rifiutaPreventivo(id);
      case 'annulla':
        return this.preventiviService.annullaPreventivo(id);
    }
  }

  private getCommandLabels(command: PreventivoCommand): {
    title: string;
    verb: string;
    successMessage: string;
  } {
    const labels: Record<
      PreventivoCommand,
      { title: string; verb: string; successMessage: string }
    > = {
      invia: {
        title: 'Conferma invio',
        verb: 'inviare',
        successMessage: 'Preventivo inviato correttamente',
      },
      converti: {
        title: 'Conferma conversione',
        verb: 'convertire in prenotazione',
        successMessage: 'Preventivo convertito correttamente',
      },
      rifiuta: {
        title: 'Conferma rifiuto',
        verb: 'rifiutare',
        successMessage: 'Preventivo rifiutato correttamente',
      },
      annulla: {
        title: 'Conferma annullamento',
        verb: 'annullare',
        successMessage: 'Preventivo annullato correttamente',
      },
    };

    return labels[command];
  }

  private toPreventivoSortKey(active: string): PreventivoSortKey {
    const allowed: PreventivoSortKey[] = [
      'created_at',
      'data_inizio',
      'data_fine',
      'importo_totale',
      'stato',
    ];

    return allowed.includes(active as PreventivoSortKey)
      ? (active as PreventivoSortKey)
      : 'created_at';
  }

  private downloadPdf(pdf: Blob, filename: string): void {
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const candidate = (error as { error?: { error?: string } }).error?.error;
      if (candidate) {
        return candidate;
      }
    }

    return "Errore durante l'operazione sul preventivo";
  }
}
