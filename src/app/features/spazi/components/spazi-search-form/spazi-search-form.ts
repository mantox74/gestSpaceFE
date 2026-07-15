import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpaziFilterKey, SpaziFilters, SpazioStato } from '@app/features/spazi/model/spazi.model';
import { ChipsRicerca } from '@app/shared/components/chips-ricerca/chips-ricerca';
import { SearchChipItem } from '@app/shared/model/table.model';

type SpaziFilterForm = {
  search: string;
  stato: SpazioStato | '';
  prezzo_min: number | null;
  prezzo_max: number | null;
  lunghezza_min: number | null;
  larghezza_min: number | null;
  altezza_min: number | null;
};

const initialFilterForm: SpaziFilterForm = {
  search: '',
  stato: '',
  prezzo_min: null,
  prezzo_max: null,
  lunghezza_min: null,
  larghezza_min: null,
  altezza_min: null,
};

const filterLabels: Record<SpaziFilterKey, string> = {
  search: 'Ricerca',
  stato: 'Stato',
  prezzo_min: 'Prezzo min.',
  prezzo_max: 'Prezzo max.',
  lunghezza_min: 'Lunghezza min.',
  larghezza_min: 'Larghezza min.',
  altezza_min: 'Altezza min.',
};

type NumericFilterKey =
  | 'prezzo_min'
  | 'prezzo_max'
  | 'lunghezza_min'
  | 'larghezza_min'
  | 'altezza_min';

const numericFilterKeys: NumericFilterKey[] = [
  'prezzo_min',
  'prezzo_max',
  'lunghezza_min',
  'larghezza_min',
  'altezza_min',
];

@Component({
  selector: 'app-spazi-search-form',
  imports: [
    CommonModule,
    FormField,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ChipsRicerca,
  ],
  templateUrl: './spazi-search-form.html',
  styleUrl: './spazi-search-form.scss',
})
export class SpaziSearchForm {
  filters = input<SpaziFilters>({});
  showFilters = input(false);
  filtersChange = output<SpaziFilters>();

  filterForm = form(signal<SpaziFilterForm>({ ...initialFilterForm }));

  activeChips = computed<SearchChipItem[]>(() => {
    const filters = this.filters();
    return (Object.keys(filterLabels) as SpaziFilterKey[])
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
    const nextFilters: SpaziFilters = {};

    this.assignStringFilter(nextFilters, 'search', value.search);

    if (value.stato !== '') {
      nextFilters.stato = value.stato;
    }

    for (const key of numericFilterKeys) {
      this.assignNumberFilter(nextFilters, key, value[key]);
    }

    this.filtersChange.emit(nextFilters);
  }

  resetFilters(): void {
    this.filterForm().value.set({ ...initialFilterForm });
    this.filtersChange.emit({});
  }

  removeFilter(key: string): void {
    const nextFilters = { ...this.filters() };
    delete nextFilters[key as SpaziFilterKey];
    this.filtersChange.emit(nextFilters);
  }

  private hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  private formatFilterValue(key: SpaziFilterKey, value: unknown): string {
    if (key === 'stato') {
      return value === 'NON_ATTIVO' ? 'Non attivo' : 'Attivo';
    }

    if (key.startsWith('prezzo_')) {
      return `${value} euro`;
    }

    if (key.endsWith('_min')) {
      return `${value} m`;
    }

    return String(value);
  }

  private toFormValue(filters: SpaziFilters): SpaziFilterForm {
    return {
      ...initialFilterForm,
      ...filters,
    };
  }

  private assignStringFilter(filters: SpaziFilters, key: 'search', value: string): void {
    if (this.hasValue(value)) {
      filters[key] = value;
    }
  }

  private assignNumberFilter(
    filters: SpaziFilters,
    key: NumericFilterKey,
    value: number | null,
  ): void {
    if (this.hasValue(value)) {
      filters[key] = Number(value);
    }
  }
}
