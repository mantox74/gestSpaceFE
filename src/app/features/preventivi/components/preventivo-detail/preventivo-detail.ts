import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PreventivoDTO } from '@app/features/preventivi/model/preventivi';

type DetailItem = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-preventivo-detail',
  imports: [CommonModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './preventivo-detail.html',
  styleUrl: './preventivo-detail.scss',
})
export class PreventivoDetail {
  preventivo = input.required<PreventivoDTO>();
  invia = input<(() => void) | null>(null);
  stampa = input<(() => void) | null>(null);
  converti = input<(() => void) | null>(null);
  chiudi = input<(() => void) | null>(null);

  clienteLabel = computed(() => {
    const cliente = this.preventivo().cliente;
    const identificativo = cliente.codice_fiscale || cliente.p_iva || 'nessun CF/P.IVA';
    return `${cliente.cognome} ${cliente.nome} - ${identificativo}`;
  });

  statoLabel = computed(() => this.formatStato(this.preventivo().stato));

  periodo = computed<DetailItem[]>(() => {
    const preventivo = this.preventivo();
    const items: DetailItem[] = [
      { label: 'Data inizio', value: this.formatDate(preventivo.data_inizio) },
      { label: 'Data fine', value: this.formatDate(preventivo.data_fine) },
    ];

    if (preventivo.stato === 'INVIATO') {
      items.push({ label: 'Data invio', value: this.formatDateTime(preventivo.data_invio) });
    }

    if (preventivo.stato === 'ACCETTATO') {
      items.push({
        label: 'Data accettazione',
        value: this.formatDateTime(preventivo.data_accettazione, 'Non accettato'),
      });
    }

    return items;
  });

  importi = computed<DetailItem[]>(() => {
    const preventivo = this.preventivo();
    const items: DetailItem[] = [
      { label: 'Prezzo netto', value: this.formatCurrency(this.prezzoNetto()) },
      { label: 'Totale preventivo', value: this.formatCurrency(preventivo.importo_totale) },
      { label: 'IVA', value: `${Number(preventivo.iva_percentuale ?? 22)}%` },
    ];

    if (this.hasSconto()) {
      items.push({ label: 'Sconto', value: this.formatSconto() });
    }

    return items;
  });

  hasSconto = computed(() => !!this.preventivo().sconto_manuale_tipo);

  private prezzoNetto(): number {
    const preventivo = this.preventivo();
    const nettoDettaglio = preventivo.dettaglio_calcolo?.importo_netto;

    if (nettoDettaglio !== null && nettoDettaglio !== undefined) {
      return Number(nettoDettaglio);
    }

    const ivaPercentuale = Number(preventivo.iva_percentuale ?? 22);
    const importoTotale = Number(preventivo.importo_totale || 0);

    if (ivaPercentuale <= 0) {
      return importoTotale;
    }

    return importoTotale / (1 + ivaPercentuale / 100);
  }

  inviaPreventivo(): void {
    this.invia()?.();
  }

  stampaPreventivo(): void {
    this.stampa()?.();
  }

  convertiPreventivo(): void {
    this.converti()?.();
  }

  chiudiDialog(): void {
    this.chiudi()?.();
  }

  private formatSconto(): string {
    const preventivo = this.preventivo();

    if (preventivo.sconto_manuale_tipo === 'PERCENTUALE') {
      return `${Number(preventivo.sconto_manuale_valore ?? 0)}%`;
    }

    return this.formatCurrency(preventivo.sconto_manuale_valore ?? 0);
  }

  private formatStato(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  }

  private formatDateTime(value: string | null, emptyLabel = 'Non inviato'): string {
    if (!value) {
      return emptyLabel;
    }

    const data = new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));

    const ora = new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

    return `${data} alle ${ora}`;
  }

  private formatCurrency(value: number | string | null | undefined): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(Number(value || 0));
  }
}
