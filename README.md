<p align="center">
  <h1 align="center">Context Engineering<br/>+ Closed-Loop Agent Benchmarks</h1>
  <p align="center">
    <strong>Das Production-Grade Template fuer KI-gestuetzte Entwicklung mit automatischen Quality Gates.</strong>
  </p>
  <p align="center">
    <a href="#-quickstart">Quickstart</a> &nbsp;&bull;&nbsp;
    <a href="#-was-ist-context-engineering">Konzept</a> &nbsp;&bull;&nbsp;
    <a href="#-benchmark-system">Benchmarks</a> &nbsp;&bull;&nbsp;
    <a href="#-orchestrator">Orchestrator</a> &nbsp;&bull;&nbsp;
    <a href="#-repository-struktur">Struktur</a>
  </p>
</p>

---

> **Erstellt von Belkis Aslani** &mdash; MIT License

## Das Problem

KI-Coding-Agents (Claude Code, Cursor, Copilot) sind nur so gut wie der **Kontext**, den sie bekommen. Ohne strukturierte Projektregeln, klare Patterns und messbare Qualitaetsgates passiert Folgendes:

- Der Agent kennt deine Architektur-Entscheidungen nicht und bricht Konventionen
- Code-Qualitaet driftet ab, weil niemand systematisch misst
- Jede neue Session startet bei Null &mdash; kein Gedaechtnis, kein Lerneffekt
- Reviews werden zum Bottleneck, weil der Agent keine Leitplanken hatte

**Dieses Template loest genau diese Probleme.**

## Was dieses Repo liefert

| Bereich                 | Was du bekommst                                                | Wo es liegt           |
| ----------------------- | -------------------------------------------------------------- | --------------------- |
| **Context Engineering** | AGENTS.md, Docs, Patterns, Anti-Patterns                       | `AGENTS.md`, `docs/`  |
| **Prompt Templates**    | Fertige Copy-Paste-Prompts fuer Features, Bugfixes, Refactors  | `prompts/`            |
| **Benchmark System**    | Automatisches Scoring (0&ndash;100) ueber 5 Kategorien         | `benchmarks/`         |
| **Orchestrator**        | Closed-Loop Controller: Messen &rarr; Diagnose &rarr; Fix-Plan | `tools/orchestrator/` |
| **CI Pipeline**         | GitHub Actions Workflow mit Benchmark-Gating                   | `.github/workflows/`  |
| **Memory**              | Lessons Learned + Pattern-Katalog als akkumuliertes Wissen     | `memory/`             |
| **Beispielprojekt**     | Minimales Beispiel mit AGENTS.md, Source und Tests             | `examples/`           |

---

## Quickstart

```bash
# 1. Repository klonen
git clone https://github.com/BEKO2210/Context-Engineering.git
cd Context-Engineering

# 2. Dependencies installieren
npm install

# 3. Pruefen, dass alles funktioniert
npm run typecheck        # TypeScript Strict-Mode Check
npm run lint             # ESLint Code-Qualitaet
npm test                 # Vitest Unit Tests (8 Tests)
npm run build            # Kompiliert nach dist/

# 4. Benchmark ausfuehren — das Herzstueck
npm run benchmark

# 5. Orchestrator: Automatische Diagnose + Fix-Plan
npm run orchestrator:dry
```

**Erwartete Ausgabe nach `npm run benchmark`:**

```
Running: build...
  [PASS] build: 100/100 — Build succeeded. dist/ size: 77 KB
Running: typecheck...
  [PASS] typecheck: 100/100 — No TypeScript errors
Running: lint...
  [PASS] lint: 100/100 — 0 error(s), 0 warning(s)
Running: test...
  [PASS] test: 100/100 — All tests passed
Running: deps...
  [PASS] deps: 100/100 — 8 dependencies, no secrets found
Running: maintainability...
  [PASS] maintainability: 100/100 — 17 files, avg 67 lines

========================================
TOTAL SCORE: 100/100
STATUS: PASSED
========================================
```

---

## Was ist Context Engineering?

Context Engineering ist die Disziplin, KI-Agents **den richtigen Kontext zur richtigen Zeit** zu geben. Statt einem Agent einfach "mach mal" zu sagen, strukturierst du:

```
AGENTS.md            →  Projektweite Regeln (immer geladen)
docs/                →  Tiefe Referenz (bei Bedarf)
prompts/             →  Task-spezifischer Kontext (Copy-Paste pro Aufgabe)
memory/              →  Akkumuliertes Wissen (waechst ueber Zeit)
```

### AGENTS.md &mdash; Das Herzstück

Die Datei `AGENTS.md` im Root ist das Erste, was jeder KI-Agent liest. Sie enthaelt:

| Sektion             | Zweck                                                                |
| ------------------- | -------------------------------------------------------------------- |
| **Identity**        | Was ist dieses Projekt?                                              |
| **Hard Rules**      | Nicht-verhandelbare Regeln (ESM only, strict TS, keine Secrets)      |
| **Decision Rules**  | Wie treffe ich Entscheidungen? (Runner hinzufuegen, Weights aendern) |
| **Where to Find**   | Landkarte des Repos &mdash; welche Datei wofuer                      |
| **Anti-Patterns**   | Was der Agent auf keinen Fall tun soll                               |
| **Benchmark-First** | Jede Aenderung muss den Benchmark bestehen                           |

> **Regel:** AGENTS.md bleibt unter 200 Zeilen. Alles Weitere geht in `docs/`.

### Prompt Templates &mdash; Copy-Paste fuer jeden Task

Oeffne den passenden Prompt aus `prompts/`, fuell die Platzhalter aus, und paste ihn in Claude Code / Cursor:

| Prompt                        | Wann benutzen                                                          |
| ----------------------------- | ---------------------------------------------------------------------- |
| `CLAUDE_CODE_BOOTSTRAP.md`    | **Jede neue Session** &mdash; gibt dem Agent den vollen Projektkontext |
| `FEATURE_REQUEST_TEMPLATE.md` | Neues Feature implementieren lassen                                    |
| `BUGFIX_TEMPLATE.md`          | Bug fixen lassen mit Root-Cause-Analyse                                |
| `REFACTOR_TEMPLATE.md`        | Code refactoren ohne Verhaltensaenderung                               |

**Workflow:**

```
1.  Oeffne prompts/CLAUDE_CODE_BOOTSTRAP.md
2.  Kopiere den Inhalt in deine KI-Session
3.  Der Agent liest AGENTS.md, checkt Benchmarks, versteht die Regeln
4.  Jetzt kannst du Feature/Bugfix/Refactor-Prompts hinterher schicken
```

---

## Benchmark System

Das Benchmark-System ist das **automatische Qualitaets-Radar** deines Repos. Es misst 5 Kategorien und gibt einen Score von 0 bis 100.

### Kategorien und Gewichtung

| Kategorie           | Gewicht | Was wird geprueft                       | Runner                                      |
| ------------------- | :-----: | --------------------------------------- | ------------------------------------------- |
| **Build**           |   30%   | TypeScript-Kompilierung, Bundle-Groesse | `runners/build.ts` + `runners/typecheck.ts` |
| **Quality**         |   20%   | Lint-Fehler, Test-Ergebnisse            | `runners/lint.ts` + `runners/test.ts`       |
| **Security**        |   20%   | Secret-Scanning, Dependency-Blocklist   | `runners/deps.ts`                           |
| **Performance**     |   20%   | Bundle-Size-Proxy (dist/ Groesse)       | `runners/build.ts`                          |
| **Maintainability** |   10%   | Dateigroessen, Code-Duplikation         | `runners/maintainability.ts`                |

### Hard Gates

```
Build FAILED oder Typecheck FAILED  →  Gesamtscore gedeckelt auf 40
```

Egal wie gut Lint und Tests sind &mdash; wenn der Code nicht kompiliert, kann der Score nie ueber 40 steigen. Das verhindert, dass ein Projekt "gut aussieht" aber nicht baut.

### Score-Ausgabe

Jeder Benchmark-Lauf erzeugt:

| Datei                       | Verhalten                                                              |
| --------------------------- | ---------------------------------------------------------------------- |
| `reports/latest-score.json` | Wird bei jedem Lauf **ueberschrieben** &mdash; aktueller Stand         |
| `reports/history.jsonl`     | Wird **angehaengt** &mdash; eine JSON-Zeile pro Lauf fuer Trendanalyse |

**Beispiel `latest-score.json`:**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "total": 100,
  "categories": {
    "build": { "score": 100, "weight": 30, "weighted": 30 },
    "quality": { "score": 100, "weight": 20, "weighted": 20 },
    "security": { "score": 100, "weight": 20, "weighted": 20 },
    "performance": { "score": 100, "weight": 20, "weighted": 20 },
    "maintainability": { "score": 100, "weight": 10, "weighted": 10 }
  },
  "passed": true,
  "hardGateFailed": false
}
```

### Eigenen Runner hinzufuegen

In 3 Schritten einen neuen Benchmark-Runner erstellen:

**Schritt 1** &mdash; Neue Datei `benchmarks/runners/mein-runner.ts`:

```typescript
import type { RunnerResult } from "../types.js";

export async function run(): Promise<RunnerResult> {
  // Deine Logik hier
  const score = 100;
  return {
    name: "mein-runner",
    score,
    passed: score >= 50,
    details: "Beschreibung des Ergebnisses",
    errors: [],
  };
}
```

**Schritt 2** &mdash; In `benchmarks/run.ts` registrieren:

```typescript
import { run as runMeinRunner } from "./runners/mein-runner.js";

const RUNNERS = {
  // ... bestehende Runner
  "mein-runner": runMeinRunner,
};
```

**Schritt 3** &mdash; In `benchmarks/scorecard.json` einer Kategorie zuordnen:

```json
{ "name": "quality", "weight": 20, "runners": ["lint", "test", "mein-runner"] }
```

### Thresholds konfigurieren

In `benchmarks/thresholds.json` definierst du die Mindest-Scores:

```json
{
  "totalMinimum": 60,
  "categories": {
    "build": 70,
    "quality": 50,
    "security": 60,
    "performance": 50,
    "maintainability": 40
  }
}
```

> **Wichtig:** Wenn du Thresholds aenderst, dokumentiere den Grund in `docs/decisions.md`.

---

## Orchestrator

Der Orchestrator ist ein **Closed-Loop Controller** &mdash; ein automatischer Feedback-Kreislauf, der Benchmark-Ergebnisse analysiert und strukturierte Fix-Plaene generiert.

### Ablauf

```
┌───────────┐     ┌────────────┐     ┌──────────┐     ┌───────────┐
│  MESSEN   │────▸│ DIAGNOSE   │────▸│  PLANEN  │────▸│ AUSFUEHREN│
│ Benchmark │     │ Gaps finden│     │ Fix-Plan │     │ (Dry-Run) │
└───────────┘     └────────────┘     └──────────┘     └───────────┘
      ▲                                                      │
      └──────────────────────────────────────────────────────┘
                    Wiederholen bis Ziel erreicht
```

### Dry-Run Modus

Der aktuelle Modus ist **Dry-Run** &mdash; der Orchestrator aendert keine Dateien, sondern gibt einen strukturierten Fix-Plan als JSON aus:

```bash
npm run orchestrator:dry
```

**Beispielausgabe bei Score unter Threshold:**

```json
{
  "iteration": 1,
  "totalScore": 55,
  "targetScore": 60,
  "actions": [
    {
      "category": "quality",
      "priority": "high",
      "description": "Fix lint errors and failing tests (current: 30, target: 50, gap: 20)",
      "suggestedFiles": ["eslint.config.js", "src/", "tests/"]
    }
  ]
}
```

### State Machine

Der Orchestrator durchlaeuft definierte Zustaende:

```
IDLE → MEASURING → DIAGNOSING → PLANNING → EXECUTING → DONE
                                                    ↘ FAILED
```

Jeder Uebergang ist in `tools/orchestrator/state.ts` validiert &mdash; ungueltige Transitionen werfen sofort einen Fehler.

---

## Repository-Struktur

```
Context-Engineering/
│
├─ AGENTS.md                          # Projektweiter Kontext fuer KI-Agents
├─ README.md                          # Diese Datei
├─ LICENSE                            # MIT License
├─ package.json                       # Node.js Projekt-Config
├─ tsconfig.json                      # TypeScript Strict-Mode Config
├─ eslint.config.js                   # ESLint Flat Config
├─ .prettierrc                        # Prettier Formatierung
├─ .editorconfig                      # Editor-uebergreifende Config
├─ .gitignore                         # Git-Ignore Regeln
│
├─ src/                               # Source Code
│  └─ index.ts                        # Haupt-Einstiegspunkt
│
├─ docs/                              # Dokumentation
│  ├─ index.md                        # Doku-Index
│  ├─ decisions.md                    # Architecture Decision Records
│  ├─ patterns.md                     # Bewaehlte Patterns
│  ├─ anti-patterns.md                # Bekannte Fallstricke
│  ├─ benchmarks.md                   # Benchmark-System Doku
│  └─ orchestrator.md                 # Orchestrator-Design Doku
│
├─ prompts/                           # Copy-Paste Prompt Templates
│  ├─ CLAUDE_CODE_BOOTSTRAP.md        # Session-Start Prompt
│  ├─ FEATURE_REQUEST_TEMPLATE.md     # Feature-Request Prompt
│  ├─ BUGFIX_TEMPLATE.md              # Bugfix Prompt
│  └─ REFACTOR_TEMPLATE.md            # Refactoring Prompt
│
├─ benchmarks/                        # Benchmark-System
│  ├─ types.ts                        # Type-Definitionen
│  ├─ scorecard.json                  # Kategorie-Gewichtungen
│  ├─ thresholds.json                 # Mindest-Score Targets
│  ├─ score.ts                        # Score-Berechnung
│  ├─ run.ts                          # Haupt-Runner
│  └─ runners/                        # Einzelne Runner
│     ├─ build.ts                     #   Build + Bundle-Size
│     ├─ typecheck.ts                 #   TypeScript Strict Check
│     ├─ lint.ts                      #   ESLint Analyse
│     ├─ test.ts                      #   Vitest Ergebnisse
│     ├─ deps.ts                      #   Secrets + Dependency Policy
│     └─ maintainability.ts           #   Dateigroesse + Duplikation
│
├─ tools/orchestrator/                # Closed-Loop Controller
│  ├─ types.ts                        # Orchestrator-Types
│  ├─ state.ts                        # State Machine
│  ├─ controller.ts                   # Controller-Logik
│  ├─ loop.ts                         # Iterations-Loop
│  ├─ diagnose.ts                     # Gap-Analyse
│  ├─ fixplan.ts                      # Fix-Plan Generator
│  └─ run.ts                          # CLI Entry Point
│
├─ examples/context-minimal/          # Minimales Beispielprojekt
│  ├─ AGENTS.md                       # Beispiel-AGENTS.md
│  ├─ README.md                       # Beispiel-Doku
│  ├─ src/example.ts                  # Beispiel-Module
│  └─ tests/example.test.ts           # Beispiel-Tests
│
├─ memory/                            # Akkumuliertes Wissen
│  ├─ lessons.json                    # Lessons Learned
│  └─ patterns.md                     # Pattern-Katalog
│
├─ reports/                           # Generierte Reports (gitignored)
│  └─ .gitkeep
│
└─ .github/workflows/
   └─ ci.yml                          # GitHub Actions CI Pipeline
```

---

## Alle npm Scripts

| Befehl                     | Was es tut                                     |
| -------------------------- | ---------------------------------------------- |
| `npm run typecheck`        | TypeScript Strict-Mode Pruefung ohne Build     |
| `npm run lint`             | ESLint ueber das gesamte Projekt               |
| `npm run format`           | Prettier formatiert alle Dateien               |
| `npm run format:check`     | Prueft Formatierung ohne zu aendern            |
| `npm test`                 | Vitest Unit Tests ausfuehren                   |
| `npm run build`            | TypeScript nach `dist/` kompilieren            |
| `npm run benchmark`        | Vollstaendiger Benchmark-Lauf mit Score-Report |
| `npm run orchestrator:dry` | Orchestrator im Dry-Run: Diagnose + Fix-Plan   |

---

## Fuer wen ist dieses Template?

- **Entwickler, die mit KI-Agents arbeiten** und deren Output-Qualitaet systematisch verbessern wollen
- **Teams, die Qualitaetsstandards** nicht manuell durchsetzen wollen, sondern automatisch messen
- **Projekte, die wachsen** und ein Framework brauchen, das mit skaliert
- **Jeder, der Context Engineering** lernen und direkt anwenden will

## Wie benutze ich es fuer mein eigenes Projekt?

1. **Fork/Clone** dieses Repo als Basis fuer dein Projekt
2. **Passe `AGENTS.md`** an dein Projekt an (Identity, Rules, Struktur)
3. **Passe `benchmarks/thresholds.json`** an deine Qualitaetsansprueche an
4. **Fuege deinen Code** unter `src/` hinzu
5. **Schreibe Tests** und pruefe mit `npm run benchmark`
6. **Nutze die Prompts** aus `prompts/` fuer jede KI-Session
7. **Aktualisiere `memory/`** wenn du neue Lessons lernst

---

## Tech Stack

| Technologie    | Zweck                             | Version |
| -------------- | --------------------------------- | ------- |
| **Node.js**    | Runtime                           | >= 18   |
| **TypeScript** | Sprache (Strict Mode, ESM)        | >= 5.4  |
| **Vitest**     | Unit Testing                      | >= 2.0  |
| **ESLint**     | Linting (Flat Config)             | >= 9.0  |
| **Prettier**   | Formatierung                      | >= 3.2  |
| **tsx**        | TypeScript-Ausfuehrung ohne Build | >= 4.7  |

Bewusst **keine weiteren Dependencies** &mdash; jede Abhaengigkeit ist ein Risiko. Die Dependency-Policy im Benchmark-System erzwingt das automatisch.

---

## Weiterführende Dokumentation

| Dokument                                         | Inhalt                                         |
| ------------------------------------------------ | ---------------------------------------------- |
| [`docs/decisions.md`](docs/decisions.md)         | Architecture Decision Records (ADRs)           |
| [`docs/patterns.md`](docs/patterns.md)           | Bewaehrte Context Engineering Patterns         |
| [`docs/anti-patterns.md`](docs/anti-patterns.md) | Bekannte Fallstricke und wie man sie vermeidet |
| [`docs/benchmarks.md`](docs/benchmarks.md)       | Detaillierte Benchmark-System Dokumentation    |
| [`docs/orchestrator.md`](docs/orchestrator.md)   | Orchestrator-Architektur und State Machine     |

---

## License

MIT &mdash; **Belkis Aslani**
