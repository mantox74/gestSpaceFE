import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal, untracked } from '@angular/core';
import { disabled, form, FormField, required, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpazioDTO, SpazioPayload } from '@app/features/spazi/model/spazi.model';
import * as env from '@env/environment';

type SpazioFormValue = Omit<
  SpazioDTO,
  'id' | 'prezzo_giorno' | 'lunghezza' | 'larghezza' | 'altezza' | 'created_at' | 'immagine'
> & {
  prezzo_giorno: number | null;
  lunghezza: number | null;
  larghezza: number | null;
  altezza: number | null;
  rimuoviImmagine?: boolean;
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
  rimuoviImmagine: false,
};

@Component({
  selector: 'app-spazio-form',
  imports: [
    CommonModule,
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './spazio-form.html',
  styleUrls: ['./spazio-form.scss'],
})
export class SpazioForm {
  spazio = input<SpazioDTO | null>(null);
  showStato = input(false);
  isReadonly = input(false);

  formModel = signal<SpazioFormValue>({ ...initialValue });
  submitted = signal(false);
  selectedImage = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  imageRemoved = signal(false);
  imageSrc = computed(() => {
    const previewUrl = this.imagePreviewUrl();
    if (previewUrl) {
      return previewUrl;
    }

    if (this.imageRemoved()) {
      return null;
    }

    return this.resolveImageUrl(this.spazio()?.immagine ?? null);
  });
  spazioForm = form(this.formModel, (schemaPath) => {
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

    // Estraiamo dinamicamente tutte le chiavi del modello dati
    const chiaviForm = Object.keys(this.formModel()) as Array<keyof SpazioFormValue>;

    // Applichiamo la regola readonly a tappeto su tutti i campi
    chiaviForm.forEach((chiave) => {
      const targetPath = schemaPath[chiave] as any;
      disabled(targetPath, {
        when: () => this.isReadonly(),
      });
    });
  });

  constructor() {
    effect(() => {
      const spazio = this.spazio();
      untracked(() => {
        this.spazioForm().value.set(spazio ? this.toFormValue(spazio) : { ...initialValue });
        this.clearSelectedImage();
        this.imageRemoved.set(false);
      });
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
      immagine: this.selectedImage(),
      rimuoviImmagine: this.imageRemoved(),
    };
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0] ?? null;

    if (!file) {
      this.clearSelectedImage();
      return;
    }

    this.selectedImage.set(file);
    this.imagePreviewUrl.set(URL.createObjectURL(file));
    this.imageRemoved.set(false);
    inputElement.value = '';

    console.log('Selected image:', file);
    console.log('Preview URL:', this.imagePreviewUrl());
  }

  removeImage(): void {
    this.clearSelectedImage();
    this.imageRemoved.set(true);
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
      rimuoviImmagine: false,
    };
  }

  private clearSelectedImage(): void {
    const previewUrl = this.imagePreviewUrl();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    this.selectedImage.set(null);
    this.imagePreviewUrl.set(null);
  }

  private resolveImageUrl(imagePath: string | null): string | null {
    if (!imagePath) {
      return null;
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return `${env.environment.baseUrl}/${imagePath.replaceAll('\\\\', '/').replace(/^\/+/, '')}`;
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

  private toNullableString(value: string | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = value.trim();
    return normalized ? normalized : null;
  }
}
