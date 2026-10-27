# Das alles kann ich schon

Ein Generator für Rechenblätter, ursprünglich für meine Kinder gebaut. Er läuft unter
[heidihaas.de/rechnen](https://heidihaas.de/rechnen) und [helenehaas.de/rechnen](https://helenehaas.de/rechnen).

Man stellt ein, was geübt werden soll, und bekommt ein Blatt mit 20, 40 oder 60 Aufgaben zum Ausdrucken.
Jedes Blatt passt auf eine A4-Seite.

## Funktionen

- Plus, Minus, Mal und Geteilt, einzeln oder gemischt
- Plus/Minus: Bereich für die größte Zahl der Aufgabe und für die zweite Zahl
- Mal/Geteilt: Einmaleins-Reihen von 0 bis 25 und der größte andere Faktor
- Ergänzungsaufgaben: Die Lücke steht auch vorne oder in der Mitte (`___ + 7 = 23`).
  Mehrdeutige Lücken wie `0 · ___ = 0` werden vermieden.
- Tauschaufgaben: Die beiden Zahlen werden zufällig vertauscht.
- Geteilt-Aufgaben gehen immer glatt auf, durch 0 wird nie geteilt.
- „Lösungen zeigen“ trägt die Ergebnisse rot in die Lücken ein.
- Name auf dem Blatt und „Richtig: ___ von 40“ am Ende
- Die Einstellungen merkt sich jeder Browser selbst (`localStorage`). Es gibt keinen Server-Speicher.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/rechnen.ts` | Logik in TypeScript (strikt typisiert, ohne Bibliotheken) |
| `src/template.html` | Gestaltung und Formular |
| `build.mjs` | Fügt beides zu einer einzigen Datei zusammen |
| `dist/index.html` | Ergebnis: die fertige Seite, die auf den Server kommt |

Zur Laufzeit gibt es keine Abhängigkeiten. Nur die Schriften kommen von Google Fonts.

## Bauen

Voraussetzung ist Node.js ab Version 23.6 (für `stripTypeScriptTypes`).

```sh
npm install      # einmalig, installiert TypeScript für die Typprüfung
npm run build    # prüft die Typen und schreibt dist/index.html
```

`npm run check` führt nur die Typprüfung aus.

## Veröffentlichen

`dist/index.html` als `index.html` in den Ordner `rechnen/` der jeweiligen Domain hochladen.
Weitere Dateien werden nicht gebraucht.

## Geschichte

Der erste Commit `5c67ee8` („legacy php version“) enthält die ursprüngliche PHP-Version
(`index.php`, `jquery-1.12.3.min.js`, `data.dat`). Sie speicherte die Einstellungen serverseitig in `data.dat`,
gemeinsam für alle Besucher, und übernahm Formularwerte ungeprüft in die Seite.

Die heutige Fassung ist eine Neuentwicklung als reine HTML/JS-Seite mit gleicher Rechenlogik.
Die alte Version lässt sich so ansehen:

```sh
git show 5c67ee8:index.php
```
