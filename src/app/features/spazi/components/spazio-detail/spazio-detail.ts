import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SpazioDTO } from '@app/features/spazi/model/spazi.model';
import * as env from '@env/environment';

type DetailItem = {
  label: string;
  value: string | number | null;
  suffix?: string;
};

const PLACEHOLDER_IMAGE = '/images/container-placeholder.jpg';

@Component({
  selector: 'app-spazio-detail',
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './spazio-detail.html',
  styleUrl: './spazio-detail.scss',
})
export class SpazioDetail {
  spazio = input.required<SpazioDTO>();
  imageLoadFailed = signal(false);

  imageSrc = computed(() => {
    if (this.imageLoadFailed()) {
      return PLACEHOLDER_IMAGE;
    }

    return this.resolveImageUrl(this.spazio().immagine) ?? PLACEHOLDER_IMAGE;
  });

  statoLabel = computed(() => (this.spazio().stato === 'ATTIVO' ? 'Attivo' : 'Non attivo'));

  dimensioni = computed<DetailItem[]>(() => [
    { label: 'Lunghezza', value: this.spazio().lunghezza, suffix: 'm' },
    { label: 'Larghezza', value: this.spazio().larghezza, suffix: 'm' },
    { label: 'Altezza', value: this.spazio().altezza, suffix: 'm' },
  ]);

  dettagli = computed<DetailItem[]>(() => [
    { label: 'Prezzo giornaliero', value: this.spazio().prezzo_giorno, suffix: '€' },
    { label: 'Creato il', value: this.spazio().created_at },
  ]);

  onImageError(): void {
    this.imageLoadFailed.set(true);
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
}
