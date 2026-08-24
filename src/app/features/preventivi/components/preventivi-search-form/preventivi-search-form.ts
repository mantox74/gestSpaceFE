import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ClienteOptionDTO,
  PreventiviFilterKey,
  PreventiviFilters,
  PreventivoStato,
} from '@app/features/preventivi/model/preventivi.interfaces';
import { PreventiviService } from '@app/features/preventivi/services/preventivi.service';
import { SpazioDTO } from '@app/features/spazi/model/spazi.model';
import { SpaziService } from '@app/features/spazi/service/spazi.service';
import { ChipsRicerca } from '@app/shared/components/chips-ricerca/chips-ricerca';
import { SearchChipItem } from '@app/shared/model/table.model';

type PreventiviFilterForm = {
  search: string;
  stato: PreventivoStato | '';
  cliente_id: number | null;
  spazio_id: number | null;
  data_inizio_da: Date | null;
  data_inizio_a: Date | null;
};

const initialFilterForm: PreventiviFilterForm = {
  search: '',
  stato: '',
  cliente_id: null,
  spazio_id: null,
  data_inizio_da: null,
  data_inizio_a: null,
};

const filterLabels: Record<PreventiviFilterKey, string> = {
  search: 'Ricerca',
  stato: 'Stato',
  cliente_id: 'Cliente',
  spazio_id: 'Spazio',
  data_inizio_da: 'Inizio da',
  data_inizio_a: 'Inizio a',
};

@Component({
  selector: 'app-preventivi-search-form',
  imports: [
    CommonModule,
    FormField,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ChipsRicerca,
  ],
  templateUrl: './preventivi-search-form.html',
  styleUrl: './preventivi-search-form.scss',
})
export class PreventiviSearchForm {
  private preventiviService = inject(PreventiviService);
  private spaziService = inject(SpaziService);

  filters = input<PreventiviFilters>({});
  showFilters = input(false);
  filtersChange = output<PreventiviFilters>();

  filterForm = form(signal<PreventiviFilterForm>({ ...initialFilterForm }));
  clienti = toSignal(this.preventiviService.getClientiOptions(), { initialValue: null });
  clientiOptions = computed<ClienteOptionDTO[]>(() => this.clienti()?.data ?? []);
  spazi = toSignal(
    this.spaziService.getSpazi({
      stato: 'ATTIVO',
      orderBy: 'nome',
      orderDir: 'asc',
      limit: 100,
    }),
    { initialValue: null },
  );
  spaziOptions = computed<SpazioDTO[]>(() => this.spazi()?.data ?? []);

  activeChips = computed<SearchChipItem[]>(() => {
    const filters = this.filters();
    return (Object.keys(filterLabels) as PreventiviFilterKey[])
      .filter((key) => this.hasValue(filters[key]))
      .map((key) => ({
        chiave: key,
        label: filterLabels[key],
        valore: this.formatFilterValue(key, filters[key]),
      }));
  });

  constructor() {
    effect(() => {
      this.filterForm().value.set({
        ...initialFilterForm,
        ...this.toFormValue(this.filters()),
      });
    });
  }

  applyFilters(): void {
    const value = this.filterForm().value();
    const nextFilters: PreventiviFilters = {};

    this.assignStringFilter(nextFilters, 'search', value.search);
    this.assignDateFilter(nextFilters, 'data_inizio_da', value.data_inizio_da);
    this.assignDateFilter(nextFilters, 'data_inizio_a', value.data_inizio_a);

    if (value.stato !== '') {
      nextFilters.stato = value.stato;
    }

    this.assignNumberFilter(nextFilters, 'cliente_id', value.cliente_id);
    this.assignNumberFilter(nextFilters, 'spazio_id', value.spazio_id);

    this.filtersChange.emit(nextFilters);
  }

  resetFilters(): void {
    this.filterForm().value.set({ ...initialFilterForm });
    this.filtersChange.emit({});
  }

  removeFilter(key: string): void {
    const nextFilters = { ...this.filters() };
    delete nextFilters[key as PreventiviFilterKey];
    this.filtersChange.emit(nextFilters);
  }

  private hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  private formatFilterValue(key: PreventiviFilterKey, value: unknown): string {
    if (key === 'stato') {
      return this.formatStato(String(value));
    }

    if (key === 'cliente_id' || key === 'spazio_id') {
      return key === 'cliente_id'
        ? this.clienteFilterLabel(Number(value))
        : this.spazioFilterLabel(Number(value));
    }

    return String(value);
  }

  clienteOptionLabel(cliente: ClienteOptionDTO): string {
    const identificativo = cliente.codice_fiscale || cliente.p_iva || 'nessun CF/P.IVA';
    return `${cliente.cognome} ${cliente.nome} - ${identificativo}`;
  }

  spazioOptionLabel(spazio: SpazioDTO): string {
    return spazio.nome;
  }

  private clienteFilterLabel(clienteId: number): string {
    const cliente = this.clientiOptions().find((item) => item.id === clienteId);
    return cliente ? this.clienteOptionLabel(cliente) : `Cliente #${clienteId}`;
  }

  private spazioFilterLabel(spazioId: number): string {
    const spazio = this.spaziOptions().find((item) => item.id === spazioId);
    return spazio ? this.spazioOptionLabel(spazio) : `Spazio #${spazioId}`;
  }

  private formatStato(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  private toFormValue(filters: PreventiviFilters): PreventiviFilterForm {
    return {
      ...initialFilterForm,
      ...filters,
      data_inizio_da: this.parseDateFilter(filters.data_inizio_da),
      data_inizio_a: this.parseDateFilter(filters.data_inizio_a),
    };
  }

  private assignStringFilter(filters: PreventiviFilters, key: 'search', value: string): void {
    if (this.hasValue(value)) {
      filters[key] = value;
    }
  }

  private assignDateFilter(
    filters: PreventiviFilters,
    key: 'data_inizio_da' | 'data_inizio_a',
    value: Date | null,
  ): void {
    if (value) {
      filters[key] = this.formatDateFilter(value);
    }
  }

  private assignNumberFilter(
    filters: PreventiviFilters,
    key: 'cliente_id' | 'spazio_id',
    value: number | null,
  ): void {
    if (this.hasValue(value)) {
      filters[key] = Number(value);
    }
  }

  private parseDateFilter(value: string | undefined): Date | null {
    return value ? new Date(`${value}T00:00:00`) : null;
  }

  private formatDateFilter(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
