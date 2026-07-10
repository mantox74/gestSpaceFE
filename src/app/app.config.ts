import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';
import { spinnerInterceptor } from '@app/core/interceptors/spinner.interceptor';
import { tokenInterceptor } from '@app/core/interceptors/token.interceptor';
import { routes } from './app.routes';
// Importa le funzioni di localizzazione di Angular
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getItalianPaginatorIntl } from '@app/shared/utils/materialItalian';

//componenti material da italianizzare

registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([tokenInterceptor, spinnerInterceptor])),
    provideRouter(routes),
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
    }),
    { provide: LOCALE_ID, useValue: 'it-IT' },
    { provide: MatPaginatorIntl, useFactory: getItalianPaginatorIntl },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: { appearance: 'filled' }, // <-- Forza l'aspetto predefinito a filled
    },
  ],
};
