import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface SearchChipItem {
  chiave: string;
  label: string;
  valore: string | number;
}

@Component({
  selector: 'app-chips-ricerca',
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './chips-ricerca.html',
  styleUrl: './chips-ricerca.scss',
})
export class ChipsRicerca {
  // Riceve l'array di chip dal padre
  chips = input<SearchChipItem[]>([]);
  // Emette la chiave del filtro da rimuovere
  removed = output<string>();
}
