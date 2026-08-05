import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ClienteOptionDTO,
  PreventivoDTO,
  PreventivoPayload,
  PreventivoStato,
  ScontoManualeTipo,
} from '@app/features/preventivi/model/preventivi';
import { PreventiviService } from '@app/features/preventivi/services/preventivi.service';
import { SpazioDTO } from '@app/features/spazi/model/spazi.model';
import { SpaziService } from '@app/features/spazi/service/spazi.service';

type PreventivoFormValue = {
  cliente_id: number | null;
  spazio_id: number | null;
  data_inizio: Date | null;
  data_fine: Date | null;
  data_accettazione: Date | null;
  stato: PreventivoStato;
  iva_percentuale: number;
  sconto_manuale_tipo: ScontoManualeTipo | '';
  sconto_manuale_valore: number | null;
  sconto_manuale_note: string;
  note: string;
};

const initialValue: PreventivoFormValue = {
  cliente_id: null,
  spazio_id: null,
  data_inizio: null,
  data_fine: null,
  data_accettazione: null,
  stato: 'BOZZA',
  iva_percentuale: 22,
  sconto_manuale_tipo: '',
  sconto_manuale_valore: null,
  sconto_manuale_note: '',
  note: '',
};

@Component({
  selector: 'app-preventivo-form',
  imports: [FormField, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './preventivo-form.html',
  styleUrl: './preventivo-form.scss',
})
export class PreventivoForm {
  private preventiviService = inject(PreventiviService);
  private spaziService = inject(SpaziService);

  preventivo = input<PreventivoDTO | null>(null);

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

  clienti = toSignal(this.preventiviService.getClientiOptions(), { initialValue: null });
  clientiOptions = computed<ClienteOptionDTO[]>(() => this.clienti()?.data ?? []);
  importoNettoLabel = computed(() => this.formatCurrency(this.importiCalcolati().netto));
  importoIvaInclusaLabel = computed(() => this.formatCurrency(this.importiCalcolati().ivaInclusa));
  dataInvioLabel = computed(() => this.formatDateTime(this.preventivo()?.data_invio ?? null));

  formModel = signal<PreventivoFormValue>({ ...initialValue });
  submitted = signal(false);
  preventivoForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.cliente_id, { message: 'Il cliente è obbligatorio' });
    required(schemaPath.spazio_id, { message: 'Lo spazio è obbligatorio' });
    required(schemaPath.data_inizio, { message: 'La data di inizio è obbligatoria' });
    required(schemaPath.data_fine, { message: 'La data di fine è obbligatoria' });

    validate(schemaPath.cliente_id, ({ value }) => this.positiveNumber(value(), 'cliente'));
    validate(schemaPath.spazio_id, ({ value }) => this.positiveNumber(value(), 'spazio'));
    validate(schemaPath.sconto_manuale_valore, ({ value }) => {
      const currentValue = value();

      if (currentValue === null || currentValue === undefined || Number(currentValue) >= 0) {
        return null;
      }

      return { kind: 'positiveNumber', message: 'Lo sconto deve essere maggiore o uguale a zero' };
    });
    validate(schemaPath.iva_percentuale, ({ value }) => {
      const currentValue = Number(value());

      if (!Number.isNaN(currentValue) && currentValue >= 0 && currentValue <= 100) {
        return null;
      }

      return { kind: 'ivaPercentuale', message: "L'IVA deve essere compresa tra 0 e 100" };
    });
    validate(schemaPath.data_fine, () => {
      const value = this.formModel();
      if (!value.data_inizio || !value.data_fine || value.data_inizio < value.data_fine) {
        return null;
      }

      return {
        kind: 'dateRange',
        message: 'La data di fine deve essere successiva alla data di inizio',
      };
    });
  });
  isEditMode = computed(() => !!this.preventivo());
  showDataInvio = computed(() => this.formModel().stato === 'INVIATO');
  showDataAccettazione = computed(() => this.formModel().stato === 'ACCETTATO');
  showScontoFields = computed(() => this.formModel().sconto_manuale_tipo !== '');

  constructor() {
    effect(() => {
      const preventivo = this.preventivo();
      untracked(() => {
        this.preventivoForm().value.set(
          preventivo ? this.toFormValue(preventivo) : { ...initialValue },
        );
        this.submitted.set(false);
      });
    });
  }

  getPayload(): PreventivoPayload | null {
    this.submitted.set(true);

    if (this.preventivoForm().invalid()) {
      return null;
    }

    const value = this.preventivoForm().value();

    if (value.cliente_id === null || value.spazio_id === null) {
      return null;
    }

    const scontoTipo: ScontoManualeTipo | null = value.sconto_manuale_tipo || null;
    const hasSconto = scontoTipo !== null;

    return {
      cliente_id: Number(value.cliente_id),
      spazio_id: Number(value.spazio_id),
      data_inizio: this.toPayloadDate(value.data_inizio),
      data_fine: this.toPayloadDate(value.data_fine),
      data_accettazione:
        value.stato === 'ACCETTATO' ? this.toPayloadDateTime(value.data_accettazione) : null,
      stato: value.stato,
      iva_percentuale: Number(value.iva_percentuale),
      sconto_manuale_tipo: scontoTipo,
      sconto_manuale_valore: hasSconto ? value.sconto_manuale_valore : null,
      sconto_manuale_note: hasSconto ? this.toNullableString(value.sconto_manuale_note) : null,
      note: this.toNullableString(value.note),
    };
  }

  isInvalid(): boolean {
    return this.preventivoForm().invalid();
  }

  clienteOptionLabel(cliente: ClienteOptionDTO): string {
    const identificativo = cliente.codice_fiscale || cliente.p_iva || 'nessun CF/P.IVA';
    return `${cliente.cognome} ${cliente.nome} - ${identificativo}`;
  }

  private importiCalcolati(): { netto: number | null; ivaInclusa: number | null } {
    const value = this.formModel();
    const prezzoGiorno = Number(
      this.spaziOptions().find((spazio) => spazio.id === value.spazio_id)?.prezzo_giorno,
    );

    if (
      !value.data_inizio ||
      !value.data_fine ||
      !prezzoGiorno ||
      value.data_inizio >= value.data_fine
    ) {
      return this.importiDaPreventivo();
    }

    const giorni = Math.ceil(
      (value.data_fine.getTime() - value.data_inizio.getTime()) / (1000 * 60 * 60 * 24),
    );
    const lordo = prezzoGiorno * giorni;
    const sconto = this.calcolaSconto(
      lordo,
      value.sconto_manuale_tipo,
      value.sconto_manuale_valore,
    );
    const netto = Math.max(lordo - sconto, 0);
    const ivaPercentuale = Number(value.iva_percentuale || 0);
    const ivaInclusa = netto + (netto * ivaPercentuale) / 100;

    return { netto, ivaInclusa };
  }

  private importiDaPreventivo(): { netto: number | null; ivaInclusa: number | null } {
    const preventivo = this.preventivo();

    if (!preventivo) {
      return { netto: null, ivaInclusa: null };
    }

    const ivaInclusa = Number(preventivo.importo_totale || 0);
    const netto = Number(
      preventivo.dettaglio_calcolo?.importo_netto ?? this.scorporaIva(ivaInclusa),
    );

    return { netto, ivaInclusa };
  }

  private calcolaSconto(
    lordo: number,
    tipo: ScontoManualeTipo | '',
    valore: number | null,
  ): number {
    const valoreSconto = Number(valore || 0);

    if (!tipo || valoreSconto <= 0) {
      return 0;
    }

    return tipo === 'PERCENTUALE' ? (lordo * valoreSconto) / 100 : valoreSconto;
  }

  private scorporaIva(totale: number): number {
    const ivaPercentuale = Number(
      this.formModel().iva_percentuale || this.preventivo()?.iva_percentuale || 0,
    );
    return ivaPercentuale > 0 ? totale / (1 + ivaPercentuale / 100) : totale;
  }

  private formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'Calcolato al salvataggio';
    }

    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(Number(value));
  }

  private formatDateTime(value: string | null, emptyLabel = 'Non inviato'): string {
    if (!value) {
      return emptyLabel;
    }

    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }

  private positiveNumber(value: number | null, fieldName: string) {
    if (value !== null && Number(value) > 0) {
      return null;
    }

    return {
      kind: 'positiveNumber',
      message: `L'ID ${fieldName} deve essere maggiore di zero`,
    };
  }

  private toFormValue(preventivo: PreventivoDTO): PreventivoFormValue {
    return {
      cliente_id: preventivo.cliente_id,
      spazio_id: preventivo.spazio_id,
      data_inizio: this.toDateInputValue(preventivo.data_inizio),
      data_fine: this.toDateInputValue(preventivo.data_fine),
      data_accettazione: this.toNullableDateInputValue(preventivo.data_accettazione),
      stato: this.toPreventivoStato(preventivo.stato),
      iva_percentuale: preventivo.iva_percentuale ?? 22,
      sconto_manuale_tipo: this.toScontoManualeTipo(preventivo.sconto_manuale_tipo),
      sconto_manuale_valore: preventivo.sconto_manuale_valore,
      sconto_manuale_note: preventivo.sconto_manuale_note ?? '',
      note: preventivo.note ?? '',
    };
  }

  private toPreventivoStato(value: string): PreventivoStato {
    const stati: PreventivoStato[] = ['BOZZA', 'INVIATO', 'ACCETTATO', 'RIFIUTATO', 'ANNULLATO'];
    return stati.includes(value as PreventivoStato) ? (value as PreventivoStato) : 'BOZZA';
  }

  private toScontoManualeTipo(value: string | null): ScontoManualeTipo | '' {
    return value === 'IMPORTO' || value === 'PERCENTUALE' ? value : '';
  }

  private toDateInputValue(value: string): Date {
    return new Date(value);
  }

  private toNullableDateInputValue(value: string | null): Date | null {
    return value ? new Date(value) : null;
  }

  private toPayloadDate(value: Date | null): string {
    if (!value) {
      return '';
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private toPayloadDateTime(value: Date | null): string | null {
    return value ? value.toISOString() : null;
  }

  private toNullableString(value: string | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = value.trim();
    return normalized ? normalized : null;
  }
}
