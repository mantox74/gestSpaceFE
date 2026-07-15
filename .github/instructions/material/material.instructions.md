---
description: "Istruzioni specifiche per i componenti, la configurazione e l'implementazione di Angular Material UI"
applyTo: '**/*.{ts,html,scss}'
---

# Material Instructions

Usare queste istruzioni quando si configurano provider Angular Material, si aggiungono componenti Material o si modificano template/stili che usano controlli Material nel frontend `gestSpaceFE`.

## Configurazione globale

- Centralizza la configurazione globale di Angular Material in `src/app/app.config.ts`, non nei singoli componenti.
- Mantieni `MAT_FORM_FIELD_DEFAULT_OPTIONS` con `appearance: 'outline'`, salvo richiesta esplicita diversa.
- Mantieni la configurazione globale delle icone tramite `MatIconRegistry` e usa `mat-icon` con nomi Material Symbols.
- Per componenti Material localizzabili, configura provider globali e classi `Intl` condivise invece di testi duplicati nei componenti.
- I datepicker devono usare impostazioni globali italiane: `LOCALE_ID` e `MAT_DATE_LOCALE` a `it-IT`, `registerLocaleData(localeIt)` e un date adapter con formato visibile `dd/MM/yyyy`.
- Non configurare formati datepicker o locale direttamente dentro un componente di feature, a meno che il componente abbia un requisito locale diverso e motivato.

## Componenti standalone

- Importa esplicitamente nel decorator del componente standalone solo i moduli Material necessari al template: per esempio `MatButtonModule`, `MatIconModule`, `MatFormFieldModule`, `MatInputModule`, `MatSelectModule`, `MatDatepickerModule`, `MatPaginatorModule`, `MatTableModule`.
- Segui le regole Angular 22 del file generico per componenti standalone, change detection e signals; qui aggiungi solo i vincoli specifici dei moduli Material usati dal template.

## Form Material

- Quando un form Material usa Signal Forms, collega i controlli supportati con `[formField]`.
- Con Signal Forms, evita attributi HTML non supportati direttamente dal directive `[formField]` se il compilatore Angular li segnala; valida tramite schema o logica TypeScript quando serve.
- Ogni `mat-form-field` deve avere un `mat-label` chiaro in italiano.
- Usa controlli Material coerenti con il tipo del dato: `mat-select` per enumerazioni, `mat-datepicker` per date, input numerici per numeri, checkbox/toggle per booleani.
- Nei campi data usa `mat-datepicker-toggle` e `mat-datepicker`; converti verso il backend in un formato esplicito e stabile quando l'API non accetta direttamente `Date`.

## Template e accessibilita'

- I pulsanti solo icona devono avere, quando utile, `matTooltip`.
- Per i pulsanti che eseguono azioni, usa `matButton="filled"` per le azioni primarie e `matButton="outlined"` per le azioni secondarie. Sono primarie le azioni eseguite direttamente sull'entita' gestita dal componente; sono secondarie tutte le altre azioni.
- I pulsanti con azioni distruttive o secondarie devono usare varianti Material coerenti con il resto del progetto, evitando stili custom quando esiste una variante Material adatta.
- Per chip removibili usa `mat-chip-set`/`mat-chip-row` con `matChipRemove` e label accessibili per la rimozione.
- Per testi visibili, label, tooltip e messaggi segui la regola linguistica italiana del file generico.
- Nelle pagine di feature, mantieni la coerenza con i pattern Material esistenti per layout, spaziature, griglie, card, tabelle e paginazione. Le pagine di feature che gestiscono un'entità (spazio, cliente, preventivo, fattura, account) devono avere un layout con titolo, affiancato da una sezione per le azioni sull'entità (mat button), una `mat-table` che visualizza l'elenco delle entità, con colonne appropriate, filtri appropriati, ordinamento di colonne appropriate, ricerca e paginazione. Come ultima colonna della tabella, aggiungi una colonna di azioni con pulsanti per modificare o eliminare l'entità, coerenti con le altre pagine di feature.
  Per `appropriati` si intende coerenti con i campi dell'entità, con le funzionalità della pagina e con gli endpoint presenti nella rotta dell'entità di `gestSpaceBE`.
- I filtri devono essere coerenti con gli attributi previsti dall'endpoint API e con i campi del modello dell'entità, evitando filtri duplicati o non necessari. I filtri devono essere coerenti con i campi visibili nella tabella, evitando filtri su campi non visibili.
- Nel componente dei filtri prevedi un pulsante per applicare i filtri e un pulsante per resettare i filtri, entrambi coerenti con le altre pagine di feature. Il pulsante per resettare i filtri deve riportare la tabella allo stato iniziale, senza filtri applicati.
- Nel componente dei filtri prevedi un pulsante per mostrare/nascondere i filtri, coerente con le altre pagine di feature. Il pulsante deve essere visibile anche quando i filtri sono nascosti, e deve permettere di mostrare i filtri quando sono nascosti e di nasconderli quando sono visibili.
- Il componente dei filtri deve visualizzare con delle `mat-chip` le opzioni di filtro attive, con la possibilità di rimuovere ogni filtro attivo tramite un pulsante di rimozione sulla chip. Le chip devono essere coerenti con le altre pagine di feature.

## Styling

- Non sovrascrivere pesantemente classi interne Material. Preferisci configurazioni globali, token del tema o classi wrapper del componente.
- Rispetta gli override e il tema Material 3 definiti in `src/styles.scss`; per la scelta tra Tailwind e SCSS segui il file generico.

## Validazione

- Dopo modifiche a provider Material, datepicker, form o template Material, considera `npm run build` il controllo Material minimo quando non esiste un test piu' mirato.
- Aggiungi o aggiorna test mirati quando il componente Material contiene logica non banale, come emissione di filtri, reset form, chip removibili o conversioni di date.
