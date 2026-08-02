---
description: Prompt per generare una pagina Angular con template, logica e stile.
name: 'crea-pagina-angular'
agent: agent
---

Richiedi questo input all'utente: nome della feature: ${input:feature}

Se l'utente non fornisce un nome di feature valido, fermati e fallo presente all'utente specificando che il tuo lavoro finisce qui.


Se l'utente inserisce il nome della feature:
1 - verifica che esista una cartella `src/app/features/${input:feature}/pages/${input:feature}/` e, se non esiste, creala.
2 - crea un nuovo componente Angular per la pagina `${input:feature}` nella feature `${input:feature}`. Il componente deve essere generato nella cartella:
`src/app/features/${input:feature}/pages/${input:feature}/`

Il componente deve includere:
-- `src/app/features/${input:feature}/pages/${input:feature}/${input:feature}.component.html`
-- `src/app/features/${input:feature}/pages/${input:feature}/${input:feature}.component.ts`
-- `src/app/features/${input:feature}/pages/${input:feature}/${input:feature}.component.scss`
-- `src/app/features/${input:feature}/pages/${input:feature}/${input:feature}.component.spec.ts`
Crea anche uno unit test minimale che verifichi la creazione del componente.

Per la costruzione di HTML, scss e logica TypeScript, segui le istruzioni specifiche presenti in [material instructions](.github/instructions/material/material.instructions.md).

