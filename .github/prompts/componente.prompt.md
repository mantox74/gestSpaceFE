---
description: Prompt per generare un componente Angular con template, logica e stile.
name: crea-componente-angular
agent: agent
---

Richiedi questo input all'utente:
1 - nome della feature: ${input:feature}
2 - nome del component: ${input:component}

Se l'utente non fornisce un nome di feature e di component, fermati e fallo presente all'utente specificando che il tuo lavoro finisce qui.

Se l'utente inserisce il nome della feature e del component: crea un nuovo componente Angular `${input:component}` nella feature `${input:feature}`. Il componente deve essere generato nella cartella:
`src/app/features/${input:feature}/components/${input:component}`

Il componente deve includere:
-- `src/app/features/${input:feature}/components/${input:component}/${input:feature}.component.html`
-- `src/app/features/${input:feature}/components/${input:component}/${input:feature}.component.ts`
-- `src/app/features/${input:feature}/components/${input:component}/${input:feature}.component.scss`
-- `src/app/features/${input:feature}/components/${input:component}/${input:feature}.component.spec.ts`
Crea anche uno unit test minimale che verifichi la creazione del componente.

Per la costruzione di HTML, scss e logica TypeScript, segui le istruzioni specifiche presenti in [material instructions](.github/instructions/material/material.instructions.md).
