---
description: 'Usare quando si lavora su gestSpaceFE, il frontend Angular di GestSpace. Descrive architettura del progetto, convenzioni Angular 22, pattern UI, integrazione API, test e validazione.'
applyTo: '**/*.{ts,html,scss,json}'
---

# Istruzioni progetto gestSpaceFE

- `gestSpaceFE` e' il frontend Angular di GestSpace, un'applicazione gestionale per spazi, clienti, preventivi, fatture, gestione account e dashboard analitiche.
- Il progetto e' un'applicazione Angular 22 chiamata `gestSpace`, con TypeScript in strict mode, SCSS, Angular Material 3, utility Tailwind CSS 4, Vitest, ECharts/ngx-echarts, autenticazione JWT e npm.
- Mantieni le modifiche circoscritte al frontend. Tocca `gestSpaceBE` solo quando e' necessario per contratti API o comportamento applicativo, e chiedi sempre il permesso esplicito dell'utente prima di modificare file backend.

## Struttura del progetto

- Inserisci l'infrastruttura singleton dell'app in `src/app/core`, inclusi auth, guard, interceptor e servizi trasversali.
- Inserisci UI riutilizzabile, utility e modelli condivisi in `src/app/shared`.
- Inserisci le funzionalita' di dominio in `src/app/features/<feature>` dove 'feature' è il nome della funzionalità che stai sviluppando, mantenendo pagine, componenti, modelli, servizi e route di feature vicini alla relativa funzionalita'.
- Usa il lazy loading per aree e pagine di feature, seguendo i pattern esistenti con `loadComponent` e `loadChildren` in `app.routes.ts`.
- Usa gli alias configurati, come `@app`, `@features` e `@env`, invece di import relativi lunghi quando importi tra boundary di feature.

## Angular e TypeScript

- Usa componenti standalone. Non aggiungere `standalone: true`: in Angular 22 e' implicito.
- Non aggiungere `ChangeDetectionStrategy.OnPush`: OnPush e' il default in Angular 22.
- Usa `inject()` per la dependency injection, in coerenza con componenti e servizi esistenti.
- Preferisci i signals per lo stato locale, `computed()` per lo stato derivato, e `set` o `update` per scrivere nei signals.
- Preferisci Signal Forms da `@angular/forms/signals` per i nuovi form; altrimenti usa reactive forms, non usare mai i template-driven forms.
- Quando usi i signal forms, usa le API native per i validatori, disabled, e altre proprietà dei campi.
- Usa il control flow nativo nei template (`@if`, `@for`, `@switch`) per la nuova logica di template.
- Evita `any`. Se una callback di terze parti e' difficile da tipizzare, cerca prima tipi esportati dalla libreria; usa `unknown` come fallback.
- Mantieni i componenti focalizzati: data fetching e coordinamento di dominio dovrebbero vivere nei servizi quando superano la responsabilita' immediata della UI della pagina.
-

## API, auth e stato

- Leggi gli URL backend da `@env/environment`; non inserire hostname hard-coded in componenti o servizi.
- Preserva il flusso di autenticazione JWT esistente tramite `AuthService`, `authGuard` e interceptor HTTP.
- Usa `httpResource` per letture semplici in stile resource quando si adatta al pattern esistente; usa servizi basati su `HttpClient` per comandi, form e workflow API piu' ricchi.
- Mostra gli errori, informazioni e warning visibili all'utente tramite `SnackBarService`, con messaggi in italiano.
- Mantieni in italiano etichette, testi visibili e messaggi di validazione, salvo che la feature circostante usi gia' un'altra lingua.

## UI e stile

- Usa componenti Angular Material per form, pulsanti, tabelle, card, paginator, icone, snackbar e altri controlli standard.
- Usa utility Tailwind per layout e spaziature dove il progetto lo fa gia', e file SCSS per lo stile specifico dei componenti.
- Rispetta gli override globali del tema Material in `src/styles.scss`, inclusi variabili Material 3, light color scheme, stile delle tabelle, varianti snackbar e configurazione delle icone Material Symbols.
- Preferisci icone Material tramite `mat-icon`; il font set predefinito e' configurato come `material-symbols-outlined`.
- Mantieni dashboard e analitiche coerenti con il setup ECharts/ngx-echarts esistente e registra solo i moduli ECharts realmente necessari al componente.
- Mantieni l'accessibilita': HTML semantico, stati focus visibili, label significative, contrasto WCAG AA e nessun controllo solo-icona senza label o tooltip.

## Test e validazione

- Il package manager e' npm. Usa `npm start` per lo sviluppo locale, `npm run build` per validare la build di produzione e `npm test` per il target Vitest/Angular.
- Aggiungi o aggiorna test mirati per guard, servizi, form e comportamenti non banali dei componenti quando il rischio della modifica lo giustifica.
- Prima di concludere modifiche al codice, esegui prima il controllo mirato piu' rilevante; per modifiche frontend ampie, esegui `npm run build` dalla cartella `gestSpaceFE`.
