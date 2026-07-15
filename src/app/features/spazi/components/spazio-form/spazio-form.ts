import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpazioDTO, SpazioPayload, SpazioStato } from '@app/features/spazi/model/spazi.model';

type SpazioFormValue = {
  nome: string;
  descrizione: string;
  prezzo_giorno: number | null;
  stato: SpazioStato;
  note: string;
  lunghezza: number | null;
  larghezza: number | null;
  altezza: number | null;
};

const initialValue: SpazioFormValue = {
  nome: '',
  descrizione: '',
  prezzo_giorno: null,
  stato: 'ATTIVO',
  note: '',
  lunghezza: null,
  larghezza: null,
  altezza: null,
};

@Component({
  selector: 'app-spazio-form',
  imports: [CommonModule, FormField, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './spazio-form.html',
  styleUrl: './spazio-form.scss',
})
export class SpazioForm {
  spazio = input<SpazioDTO | null>(null);
  showStato = input(false);
  submitted = signal(false);
  spazioForm = form(signal<SpazioFormValue>({ ...initialValue }), (schemaPath) => {
    required(schemaPath.nome, { message: 'Il nome è obbligatorio' });
    required(schemaPath.prezzo_giorno, { message: 'Il prezzo giornaliero è obbligatorio' });
    required(schemaPath.lunghezza, { message: 'La lunghezza è obbligatoria' });
    required(schemaPath.larghezza, { message: 'La larghezza è obbligatoria' });
    required(schemaPath.altezza, { message: "L'altezza è obbligatoria" });

    validate(schemaPath.prezzo_giorno, ({ value }) => {
      const currentValue = value();

      if (currentValue === null || currentValue === undefined || Number(currentValue) > 0) {
        return null;
      }

      return { kind: 'positiveNumber', message: 'Il prezzo deve essere maggiore di zero' };
    });
    validate(schemaPath.lunghezza, ({ value }) => {
      const currentValue = value();

      if (currentValue === null || currentValue === undefined || Number(currentValue) > 0) {
        return null;
      }

      return { kind: 'positiveNumber', message: 'La lunghezza deve essere maggiore di zero' };
    });
    validate(schemaPath.larghezza, ({ value }) => {
      const currentValue = value();

      if (currentValue === null || currentValue === undefined || Number(currentValue) > 0) {
        return null;
      }

      return { kind: 'positiveNumber', message: 'La larghezza deve essere maggiore di zero' };
    });
    validate(schemaPath.altezza, ({ value }) => {
      const currentValue = value();

      if (currentValue === null || currentValue === undefined || Number(currentValue) > 0) {
        return null;
      }

      return { kind: 'positiveNumber', message: "L'altezza deve essere maggiore di zero" };
    });
  });

  constructor() {
    effect(() => {
      const spazio = this.spazio();
      this.spazioForm().value.set(spazio ? this.toFormValue(spazio) : { ...initialValue });
    });
  }

  getPayload(): SpazioPayload | null {
    this.submitted.set(true);

    if (this.spazioForm().invalid()) {
      return null;
    }

    const value = this.spazioForm().value();

    return {
      nome: value.nome.trim(),
      descrizione: this.toNullableString(value.descrizione),
      prezzo_giorno: Number(value.prezzo_giorno),
      stato: value.stato,
      note: this.toNullableString(value.note),
      lunghezza: this.toNullableNumber(value.lunghezza),
      larghezza: this.toNullableNumber(value.larghezza),
      altezza: this.toNullableNumber(value.altezza),
    };
  }

  resetSubmitted(): void {
    this.submitted.set(false);
  }

  isInvalid(): boolean {
    return this.spazioForm().invalid();
  }

  private toFormValue(spazio: SpazioDTO): SpazioFormValue {
    return {
      nome: spazio.nome ?? '',
      descrizione: spazio.descrizione ?? '',
      prezzo_giorno: this.toNumber(spazio.prezzo_giorno),
      stato: spazio.stato === 'NON_ATTIVO' ? 'NON_ATTIVO' : 'ATTIVO',
      note: spazio.note ?? '',
      lunghezza: this.toNumber(spazio.lunghezza),
      larghezza: this.toNumber(spazio.larghezza),
      altezza: this.toNumber(spazio.altezza),
    };
  }

  private toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return Number(value);
  }

  private toNullableNumber(value: number | null): number | null {
    return value === null || value === undefined || Number.isNaN(Number(value))
      ? null
      : Number(value);
  }

  private toNullableString(value: string): string | null {
    const normalized = value.trim();
    return normalized ? normalized : null;
  }
}
