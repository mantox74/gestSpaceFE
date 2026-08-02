---
name: create-route
description: Crea una rotta di una nuova feature
agent: agent
---
Chiedi all'utente cosa vuole creare ${input:che rotta vuoi creare}, i valori possibili sono: `child route` o `parent route`;



Se non riesci a ottenere il nome della feature, fermati e informa l'utente che non sei riuscito a recuperare il nome della feature e quindi non riesci a creare la child route relativa.

Se riesci a recuperare il nome della feature, da ora in poi la chiameremo inputFeature.

Crea un nuovo file di child-routes con nome `inputFeature.routes.ts` nella cartella `src/app/features/inputFeature/`. Aggiungi una rotta '' che punta al componente 


Nel file di parent route 'app.routes.it' aggiungi un  