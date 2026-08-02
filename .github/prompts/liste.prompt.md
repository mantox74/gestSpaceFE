---
description: 'Prompt per generare una tabella di lista dati Angular con template, logica e stile.'
name: 'crea-tabella-liste'
agent: agent
---

Chiedi all'utente il seguente input: nome dell'entità di cui visualizzare la lista: ${input:entity}

Cerca la rotta dell'entità `${input:entity}` nel progetto gestSpaceBE:
-  se l'entità non coincide con il nome di una rotta, fermati e fallo presente all'utente elencandogli le entità disponibili.
- se l'entità coincide con il nome di una rotta, recupera l'endpoint API di ricerca e genera un nuovo componente Angular per visualizzare la lista dei dati dell'entità.
Per la costruzione della tabella, HTML, scss e logica TypeScript, segui le istruzioni specifiche presenti in [material instructions](.github/instructions/material/material.instructions.md).