# Feature Specification: Git Hooks i CI (Milestone 7)

**Branch**: `016-git-hooks-ci`  
**Created**: 2026-02-07  
**Status**: Draft  
**Input**: Milestone 7 z ROADMAP v6.0 — zautomatyzować kontrolę jakości kodu za pomocą Git Hooks (Husky + lint-staged + commitlint) oraz GitHub Actions CI pipeline, aby zapobiegać regresji i utrzymać spójność bazy kodu.

---

## Kontekst

Projekt Kalkulator Finansowy (v6.4.0) przeszedł pełną modernizację w Milestones 1–6: aktualizacja zależności, refaktoryzacja kodu, dark mode, nowoczesny UI/UX, WCAG AA accessibility, testy regresyjne. Baza kodu jest czysta — 52 pliki testowe, 416+ testów, ESLint 0 errors, Prettier sformatowany. Brakuje automatyzacji, która zapobiegnie regresji przy przyszłych zmianach.

**Obecny stan**:

- Node.js >= 20.0.0, npm >= 6.13.4
- ESLint v9 (flat config `eslint.config.js`), Prettier v3
- Vitest v4 (`npx vitest run` — 416+ testów)
- Quasar CLI v2 (`npx quasar build -m pwa`)
- Brak Git hooks, brak CI pipeline, brak konwencji commit messages

---

## Clarifications

### Session 2026-02-07

- Q: CI job execution strategy (parallel vs sequential) → A: Option B — Lint and Test run in parallel; Build depends on both passing (balanced approach: saves CI minutes on failures, provides fast feedback)
- Q: Optional quality tools from ROADMAP 7.3 (knip, Dependabot, vue-tsc) → A: Option A — Exclude all; scope limited to ROADMAP 7.1 (Git Hooks) + 7.2 (GitHub Actions CI). Optional tools can be added incrementally later.

---

## User Scenarios _(required)_

### Scenario 1 — Lokalne Git Hooks z Husky i lint-staged (Priority: P1) 🎯 MVP

Deweloper commituje zmiany w kodzie. Przed commitem automatycznie uruchamiają się ESLint (z `--fix`) i Prettier na zmienionych plikach `.ts`, `.vue`, `.scss`. Jeśli linting lub formatowanie się nie powiedzie, commit jest blokowany.

**Priority Justification**: Lokalne hooki to pierwsza linia obrony — zapobiegają commitowaniu kodu z błędami lintingu i niespójnym formatowaniem. Działają natychmiast, bez potrzeby CI.

**Independent Test**: Zmodyfikować plik `.ts` z celowym błędem ESLint, wykonać `git commit` — commit powinien zostać zablokowany. Naprawić błąd, ponowić commit — powinien przejść.

**Acceptance Criteria**:

1. **Given** zainstalowane zależności (`npm install`), **When** deweloper klonuje repo i uruchamia `npm install`, **Then** Git hooks są automatycznie zainstalowane przez skrypt `prepare` w `package.json`
2. **Given** zmodyfikowany plik `.ts` z błędem ESLint, **When** deweloper wykonuje `git commit`, **Then** hook `pre-commit` uruchamia `lint-staged`, ESLint zgłasza błąd i commit jest zablokowany
3. **Given** zmodyfikowany plik `.vue` poprawnie sformatowany, **When** deweloper wykonuje `git commit`, **Then** `lint-staged` uruchamia ESLint i Prettier, pliki przechodzą walidację i commit się wykonuje
4. **Given** zmodyfikowany plik `.scss`, **When** deweloper wykonuje `git commit`, **Then** Prettier formatuje plik automatycznie i commit się wykonuje

---

### Scenario 2 — Walidacja commit messages z Conventional Commits (Priority: P1) 🎯 MVP

Deweloper tworzy commit z wiadomością. Hook `commit-msg` waliduje, czy wiadomość jest zgodna z konwencją Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`, `perf:`, `ci:`, `build:`). Nieprawidłowe wiadomości blokują commit.

**Priority Justification**: Spójne commit messages ułatwiają przeglądanie historii, automatyczne generowanie changelogów i współpracę w zespole.

**Independent Test**: Wykonać `git commit -m "zrobiłem coś"` — commit powinien zostać zablokowany. Wykonać `git commit -m "feat: dodano nowy moduł"` — commit powinien przejść.

**Acceptance Criteria**:

1. **Given** hook `commit-msg` zainstalowany, **When** deweloper wykonuje `git commit -m "zrobiłem coś"`, **Then** commitlint odrzuca wiadomość z komunikatem o wymaganym formacie
2. **Given** hook `commit-msg` zainstalowany, **When** deweloper wykonuje `git commit -m "feat: dodano kalkulator obligacji"`, **Then** commit przechodzi walidację
3. **Given** hook `commit-msg` zainstalowany, **When** deweloper wykonuje `git commit -m "fix(polishBonds): naprawiono obliczenia ROR"`, **Then** commit przechodzi walidację (scope jest opcjonalny)

---

### Scenario 3 — Testy przed push (Priority: P2)

Deweloper pushuje zmiany do zdalnego repozytorium. Hook `pre-push` uruchamia pełny zestaw testów (`npx vitest run`). Jeśli testy nie przechodzą, push jest blokowany.

**Priority Justification**: Ostatnia lokalna bariera przed wysłaniem kodu — zapewnia, że żaden push nie zawiera regresji. P2, ponieważ CI również uruchamia testy, więc to dodatkowa warstwa bezpieczeństwa.

**Independent Test**: Dodać celowo failujący test, wykonać `git push` — push powinien zostać zablokowany. Usunąć failujący test, ponowić push — powinien przejść.

**Acceptance Criteria**:

1. **Given** wszystkie testy przechodzą, **When** deweloper wykonuje `git push`, **Then** hook `pre-push` uruchamia `npx vitest run`, testy przechodzą i push się wykonuje
2. **Given** jeden test nie przechodzi, **When** deweloper wykonuje `git push`, **Then** hook `pre-push` uruchamia `npx vitest run`, test failuje i push jest zablokowany z komunikatem o failujących testach

---

### Scenario 4 — GitHub Actions CI pipeline (Priority: P1) 🎯 MVP

Deweloper tworzy pull request lub pushuje na branch `main` / `develop`. GitHub Actions automatycznie uruchamia pipeline z trzema jobami: Lint, Test, Build. Status pipeline jest widoczny w PR i na badge w README.

**Priority Justification**: CI pipeline to centralna weryfikacja jakości kodu — działa niezależnie od lokalnych hooków, zapewnia spójność na poziomie repozytorium.

**Independent Test**: Utworzyć PR z poprawnym kodem — wszystkie joby powinny przejść (zielony status). Utworzyć PR z błędem ESLint — job Lint powinien failować (czerwony status).

**Acceptance Criteria**:

1. **Given** push na branch `main`, **When** GitHub Actions uruchamia workflow, **Then** wykonują się trzy joby: Lint (`npm run lint`), Test (`npx vitest run`), Build (`npx quasar build -m pwa`)
2. **Given** push na branch `develop`, **When** GitHub Actions uruchamia workflow, **Then** wykonują się te same trzy joby
3. **Given** otwarty pull request, **When** GitHub Actions uruchamia workflow, **Then** status pipeline jest widoczny w PR (check required)
4. **Given** job Lint failuje, **When** deweloper sprawdza PR, **Then** widzi czerwony status z logami błędów ESLint
5. **Given** wszystkie joby przechodzą, **When** deweloper sprawdza PR, **Then** widzi zielony status i może mergować

---

### Scenario 5 — Badge CI w README (Priority: P2)

README.md zawiera badge statusu CI pipeline, który pokazuje aktualny stan buildów na branchu `main`.

**Priority Justification**: Badge to wizualna informacja o stanie projektu — przydatna dla kontrybutorów i użytkowników. P2, ponieważ nie wpływa na funkcjonalność.

**Acceptance Criteria**:

1. **Given** `README.md`, **When** deweloper otwiera plik, **Then** na górze widzi badge GitHub Actions z aktualnym statusem CI
2. **Given** CI pipeline przechodzi na `main`, **When** użytkownik odwiedza stronę repozytorium, **Then** badge pokazuje zielony status "passing"

---

### Edge Cases

- Deweloper może pominąć hooki za pomocą `--no-verify` — jest to świadoma decyzja, CI nadal weryfikuje kod
- Duże commity z wieloma plikami mogą wydłużyć czas `lint-staged` — lint-staged działa tylko na staged files, więc czas jest proporcjonalny do zmian
- CI pipeline musi działać na Node.js >= 20 — zgodnie z `engines` w `package.json`
- Jeśli `npm install` nie zainstaluje hooków (np. CI environment), hooki nie powinny blokować procesu — Husky obsługuje to gracefully
- Merge commits i revert commits powinny być akceptowane przez commitlint

---

## Requirements _(required)_

### Functional Requirements

- **FR-001**: Projekt MUSI używać Husky v9+ do zarządzania Git hooks
- **FR-002**: Hook `pre-commit` MUSI uruchamiać `lint-staged` na staged files
- **FR-003**: `lint-staged` MUSI uruchamiać ESLint (`--fix`) na plikach `.ts` i `.vue`
- **FR-004**: `lint-staged` MUSI uruchamiać Prettier (`--write`) na plikach `.ts`, `.vue`, `.scss`, `.md`, `.json`
- **FR-005**: Hook `commit-msg` MUSI walidować format commit message za pomocą commitlint z konfiguracją `@commitlint/config-conventional`
- **FR-006**: Hook `pre-push` MUSI uruchamiać pełny zestaw testów (`npx vitest run`)
- **FR-007**: Skrypt `prepare` w `package.json` MUSI automatycznie instalować Husky hooks po `npm install`
- **FR-008**: GitHub Actions workflow MUSI być zdefiniowany w `.github/workflows/ci.yml`
- **FR-009**: CI pipeline MUSI uruchamiać się na push do `main` i `develop` oraz na pull requests
- **FR-010**: CI pipeline MUSI zawierać trzy joby: Lint, Test, Build. Lint i Test uruchamiają się równolegle; Build zależy od pomyślnego zakończenia obu (job dependency: `needs: [lint, test]`)
- **FR-011**: Job Lint MUSI uruchamiać `npm run lint`
- **FR-012**: Job Test MUSI uruchamiać `npx vitest run`
- **FR-013**: Job Build MUSI uruchamiać `npx quasar build -m pwa`
- **FR-014**: `README.md` MUSI zawierać badge statusu CI pipeline
- **FR-015**: Konfiguracja commitlint MUSI akceptować typy: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `ci`, `build`

### Non-Functional Requirements

- **NFR-001**: CI pipeline MUSI działać na Node.js 20 (zgodnie z `engines` w `package.json`)
- **NFR-002**: `lint-staged` MUSI działać tylko na staged files (nie na całym projekcie)
- **NFR-003**: Hook `pre-commit` POWINIEN wykonywać się w mniej niż 30 sekund dla typowego commitu (1-10 plików)
- **NFR-004**: CI pipeline POWINIEN wykonywać się w mniej niż 5 minut
- **NFR-005**: Hooki NIE MOGĄ modyfikować plików, które nie są staged (poza auto-fix przez ESLint/Prettier na staged files)

### Key Entities

- **Git Hook**: Skrypt uruchamiany automatycznie przez Git w odpowiedzi na zdarzenie (pre-commit, commit-msg, pre-push). Zarządzany przez Husky.
- **lint-staged**: Narzędzie uruchamiające linters tylko na plikach dodanych do staging area (`git add`). Konfigurowane w `package.json` lub `.lintstagedrc`.
- **commitlint**: Narzędzie walidujące format commit messages. Konfigurowane w `commitlint.config.js` lub `package.json`.
- **CI Pipeline**: Automatyczny workflow w GitHub Actions uruchamiany na push/PR. Składa się z jobów: Lint, Test, Build.

---

## Assumptions

- Repozytorium jest hostowane na GitHub (GitHub Actions)
- Deweloperzy używają npm (nie yarn/pnpm) — zgodnie z `package-lock.json` w repo
- ESLint i Prettier są już skonfigurowane i działają poprawnie (`eslint.config.js`, `.prettierrc`)
- Wszystkie testy przechodzą przed rozpoczęciem implementacji tego milestone'u

## Out of Scope

- **knip** (wykrywanie nieużywanych plików/eksportów) — ROADMAP 7.3, opcjonalne
- **Dependabot / Renovate** (automatyczne PR-y z aktualizacjami zależności) — ROADMAP 7.3, opcjonalne
- **vue-tsc --noEmit** (pełna weryfikacja typów TypeScript w CI) — ROADMAP 7.3, opcjonalne
- Wszystkie powyższe mogą być dodane przyrostowo w przyszłości bez wpływu na obecną implementację

---

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: `npm install` automatycznie instaluje Git hooks (Husky `prepare` script)
- **SC-002**: Commit z błędem ESLint w staged file jest blokowany przez `pre-commit` hook
- **SC-003**: Commit z nieprawidłowym formatem wiadomości jest blokowany przez `commit-msg` hook
- **SC-004**: Push z failującym testem jest blokowany przez `pre-push` hook
- **SC-005**: GitHub Actions CI pipeline przechodzi pomyślnie na czystym kodzie (Lint + Test + Build)
- **SC-006**: GitHub Actions CI pipeline failuje gdy ESLint zgłasza błędy
- **SC-007**: Badge CI w README.md pokazuje aktualny status pipeline
- **SC-008**: Cały pipeline CI wykonuje się w mniej niż 5 minut
