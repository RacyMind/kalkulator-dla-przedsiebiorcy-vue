# Implementation Plan: Git Hooks i CI (Milestone 7)

**Branch**: `016-git-hooks-ci` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-git-hooks-ci/spec.md`

## Summary

Automate code quality enforcement via Git Hooks (Husky + lint-staged + commitlint) and GitHub Actions CI pipeline. No UI changes, no calculator logic — purely developer tooling and CI/CD infrastructure.

**Technical approach**: Install Husky v9 for Git hook management, lint-staged for pre-commit file linting, @commitlint for commit message validation, and create a GitHub Actions workflow with three jobs (Lint ∥ Test → Build).

## Technical Context

**Language/Version**: TypeScript 5.9+ / Node.js >= 20  
**Package Manager**: npm (package-lock.json present)  
**Linting**: ESLint v9 (flat config `eslint.config.js`), Prettier v3 (`.prettierrc`)  
**Testing**: Vitest v4 (`npx vitest run` — 416+ tests, 52 files)  
**Build**: Quasar CLI v2 (`npx quasar build -m pwa`)  
**Platform**: GitHub-hosted repository  
**Lint command**: `npm run lint` → `eslint --ext .js,.ts,.vue ./`  
**Key New Dependencies**:

- `husky` v9+ — Git hook management
- `lint-staged` — Run linters on staged files only
- `@commitlint/cli` + `@commitlint/config-conventional` — Commit message validation

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution file is a blank template — no project-specific gates defined. **GATE PASSED** (no constraints to violate).

## Project Structure

### Documentation (this feature)

```text
specs/016-git-hooks-ci/
├── plan.md              # This file
├── research.md          # Research and analysis
├── data-model.md        # Data model (minimal — no persistent data)
├── quickstart.md        # Quick start guide
└── tasks.md             # Task list
```

### New Files (implementation)

```text
.husky/
├── pre-commit           # Runs lint-staged
├── commit-msg           # Runs commitlint
└── pre-push             # Runs vitest

.github/
└── workflows/
    └── ci.yml           # GitHub Actions CI pipeline

Root config files:
├── commitlint.config.js # Commitlint configuration
└── package.json         # Updated: prepare script, lint-staged config, new devDependencies
```

### Existing Files (modified)

```text
package.json             # Add devDependencies, prepare script, lint-staged config
README.md                # Add CI badge
```

## Pre-Implementation Checklist

- [ ] Husky v9 installed and `prepare` script added to `package.json`
- [ ] `.husky/pre-commit` hook runs `npx lint-staged`
- [ ] `.husky/commit-msg` hook runs `npx --no -- commitlint --edit $1`
- [ ] `.husky/pre-push` hook runs `npx vitest run`
- [ ] `lint-staged` config in `package.json` covers `.ts`, `.vue`, `.scss`, `.md`, `.json`
- [ ] `commitlint.config.js` extends `@commitlint/config-conventional`
- [ ] `.github/workflows/ci.yml` has Lint ∥ Test → Build jobs
- [ ] CI badge added to `README.md`
- [ ] All existing tests still pass after changes
