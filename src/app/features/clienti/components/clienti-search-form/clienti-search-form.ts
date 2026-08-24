import { Component, computed, effect, input, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClientiFilterKey, ClientiFilters } from '@app/features/clienti/model/clienti.model';
import { ChipsRicerca } from '@app/shared/components/chips-ricerca/chips-ricerca';
import { SearchChipItem } from '@app/shared/model/table.model';

type ClientiFilterForm = {
  search: string;
};

const initialFilterForm: ClientiFilterForm = {
  search: '',
};

const filterLabels: Record<ClientiFilterKey, string> = {
  search: 'Ricerca',
};

@Component({
  selector: 'app-clienti-search-form',
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ChipsRicerca,
  ],
  templateUrl: './clienti-search-form.html',
  styleUrl: './clienti-search-form.scss',
})
export class ClientiSearchForm {
  filters = input<ClientiFilters>({});
  showFilters = input(false);
  filtersChange = output<ClientiFilters>();

  filterForm = form(signal<ClientiFilterForm>({ ...initialFilterForm }));

  activeChips = computed<SearchChipItem[]>(() => {
    const filters = this.filters();
    return (Object.keys(filterLabels) as ClientiFilterKey[])
      .filter((key) => this.hasValue(filters[key]))
      .map((key) => ({
        chiave: key,
        label: filterLabels[key],
        valore: String(filters[key]),
      }));
  });

  constructor() {
    effect(() => {
      this.filterForm().value.set({
        ...initialFilterForm,
        ...this.filters(),
      });
    });
  }

  applyFilters(): void {
    const value = this.filterForm().value();
    const nextFilters: ClientiFilters = {};

    if (this.hasValue(value.search)) {
      nextFilters.search = value.search.trim();
    }

    this.filtersChange.emit(nextFilters);
  }

  resetFilters(): void {
    this.filterForm().value.set({ ...initialFilterForm });
    this.filtersChange.emit({});
  }

  removeFilter(key: string): void {
    const nextFilters = { ...this.filters() };
    delete nextFilters[key as ClientiFilterKey];
    this.filtersChange.emit(nextFilters);
  }

  private hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}
