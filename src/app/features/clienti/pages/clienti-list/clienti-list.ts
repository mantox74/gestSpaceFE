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
import { ClienteCreateForm } from '@app/features/clienti/components/cliente-create-form/cliente-create-form';
import { ClienteDetail } from '@app/features/clienti/components/cliente-detail/cliente-detail';
import { ClienteEditForm } from '@app/features/clienti/components/cliente-edit-form/cliente-edit-form';
import { ClientiSearchForm } from '@app/features/clienti/components/clienti-search-form/clienti-search-form';
import {
  ClienteDTO,
  ClienteSortKey,
  ClientiDTO,
  ClientiFilters,
} from '@app/features/clienti/model/clienti.model';
import { ClientiService } from '@app/features/clienti/services/clienti.service';
import { DynamicDialogConfirm } from '@app/shared/components/dynamic-dialog-confirm/dynamic-dialog-confirm';
import {
  DynamicDialog,
  DynamicDialogAction,
} from '@app/shared/components/dynamic-dialog/dynamic-dialog';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';

type ClienteDialogForm = {
  salva: () => Observable<ClienteDTO> | null;
  isInvalid: () => boolean;
};

@Component({
  selector: 'app-clienti-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    ClientiSearchForm,
  ],
  templateUrl: './clienti-list.html',
  styleUrl: './clienti-list.scss',
})
export class ClientiList {
  private clientiService = inject(ClientiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);

  page = signal<number>(1);
  limit = signal<number>(10);
  orderBy = signal<ClienteSortKey>('cognome');
  orderDir = signal<'asc' | 'desc'>('asc');
  filters = signal<ClientiFilters>({});
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

  clienti: Signal<ClientiDTO | null> = toSignal<ClientiDTO | null>(
    toObservable(this.queryParams).pipe(
      switchMap((params) => this.clientiService.getClienti(params)),
    ),
    { initialValue: null },
  );

  clientiData = computed<ClienteDTO[]>(() => this.clienti()?.data ?? []);
  totalElements = computed<number>(() => this.clienti()?.pagination.total ?? 0);

  sort = viewChild(MatSort);

  displayedColumns: (keyof ClienteDTO | 'nominativo' | 'azioni')[] = [
    'nominativo',
    'email',
    'telefono',
    'citta',
    'codice_fiscale',
    'totale_prenotazioni',
    'azioni',
  ];

  constructor() {
    effect(() => {
      const sortInstance = this.sort();
      if (sortInstance) {
        sortInstance.sortChange.subscribe((sortState: Sort) => {
          this.orderBy.set(this.toClienteSortKey(sortState.active));
          this.orderDir.set(sortState.direction || 'asc');
          this.page.set(1);
        });
      }
    });
  }

  aggiungiCliente(): void {
    this.openClienteDialog({
      title: 'Aggiungi cliente',
      description: 'Inserisci i dati anagrafici e di contatto del nuovo cliente.',
      component: ClienteCreateForm,
      successMessage: 'Cliente creato correttamente',
    });
  }

  modificaCliente(cliente: ClienteDTO, event: MouseEvent): void {
    this.stopPropagation(event);
    this.openClienteDialog({
      title: 'Modifica cliente',
      description: 'Aggiorna le informazioni del cliente selezionato.',
      component: ClienteEditForm,
      componentInputs: { cliente },
      successMessage: 'Cliente modificato correttamente',
    });
  }

  visualizzaDettagliCliente(cliente: ClienteDTO, event: MouseEvent): void {
    this.stopPropagation(event);
    this.dialog.open(DynamicDialog<ClienteDetail>, {
      width: 'min(48rem, 96vw)',
      maxWidth: '96vw',
      data: {
        title: 'Dettagli cliente',
        description: 'Visualizza le informazioni del cliente selezionato.',
        component: ClienteDetail,
        componentInputs: { cliente },
        actions: [
          {
            label: 'Chiudi',
            icon: 'close',
            appearance: 'outlined',
            closesDialog: true,
          },
        ] satisfies DynamicDialogAction<ClienteDetail>[],
      },
    });
  }

  eliminaCliente(cliente: ClienteDTO, event: MouseEvent): void {
    this.stopPropagation(event);
    this.dialog
      .open(DynamicDialogConfirm, {
        width: 'min(32rem, 96vw)',
        maxWidth: '96vw',
        data: {
          title: 'Conferma eliminazione',
          text: `Sei sicuro di voler eliminare il cliente <strong>${cliente.cognome} ${cliente.nome}</strong>?`,
          closeLabel: 'Annulla',
          okLabel: 'Elimina',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.clientiService.eliminaCliente(cliente.id).subscribe({
            next: () => {
              this.snackBar.showSuccess('Cliente eliminato correttamente');
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

  onFiltersChange(filters: ClientiFilters): void {
    this.filters.set(filters);
    this.page.set(1);
  }

  private openClienteDialog(config: {
    title: string;
    description: string;
    component: typeof ClienteCreateForm | typeof ClienteEditForm;
    componentInputs?: Record<string, unknown>;
    successMessage: string;
  }): void {
    this.dialog.open(DynamicDialog<ClienteDialogForm>, {
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
            disabled: (component: ClienteDialogForm | null) => component?.isInvalid() ?? true,
            action: (component: ClienteDialogForm | null, dialogRef: MatDialogRef<DynamicDialog>) =>
              this.submitClienteDialog(component, dialogRef, config.successMessage),
          },
        ] satisfies DynamicDialogAction<ClienteDialogForm>[],
      },
    });
  }

  private submitClienteDialog(
    component: ClienteDialogForm | null,
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

  private stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  private toClienteSortKey(active: string): ClienteSortKey {
    const allowed: ClienteSortKey[] = ['nome', 'cognome', 'email', 'created_at'];
    return allowed.includes(active as ClienteSortKey) ? (active as ClienteSortKey) : 'cognome';
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const candidate = (error as { error?: { error?: string } }).error?.error;
      if (candidate) {
        return candidate;
      }
    }

    return "Errore durante l'operazione sul cliente";
  }
}
