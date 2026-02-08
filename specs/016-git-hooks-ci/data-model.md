# Data Model: Git Hooks i CI (Milestone 7)

**Branch**: `016-git-hooks-ci`
**Date**: 2026-02-07

## Overview

This feature has **no persistent data model** — it consists entirely of configuration files and CI infrastructure. No database entities, no application state, no user-facing data.

## Configuration Entities

### 1. Husky Hook Files

| File                | Purpose                         | Content                            |
| ------------------- | ------------------------------- | ---------------------------------- |
| `.husky/pre-commit` | Run lint-staged before commit   | `npx lint-staged`                  |
| `.husky/commit-msg` | Validate commit message format  | `npx --no -- commitlint --edit $1` |
| `.husky/pre-push`   | Run full test suite before push | `npx vitest run`                   |

**Lifecycle**: Created once during setup (`npx husky init`), committed to repo, shared with all developers.

### 2. lint-staged Configuration

**Location**: `package.json` → `"lint-staged"` key

| Glob Pattern  | Commands                           | Purpose                                |
| ------------- | ---------------------------------- | -------------------------------------- |
| `*.{ts,vue}`  | `eslint --fix`, `prettier --write` | Lint + format TypeScript and Vue files |
| `*.scss`      | `prettier --write`                 | Format SCSS files                      |
| `*.{md,json}` | `prettier --write`                 | Format documentation and config files  |

### 3. Commitlint Configuration

**Location**: `commitlint.config.js`

| Property  | Value                                 | Purpose                             |
| --------- | ------------------------------------- | ----------------------------------- |
| `extends` | `['@commitlint/config-conventional']` | Enforce Conventional Commits format |

**Accepted commit types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### 4. GitHub Actions Workflow

**Location**: `.github/workflows/ci.yml`

| Job     | Depends On     | Commands                  | Purpose                       |
| ------- | -------------- | ------------------------- | ----------------------------- |
| `lint`  | —              | `npm run lint`            | ESLint validation             |
| `test`  | —              | `npx vitest run`          | Unit test execution           |
| `build` | `lint`, `test` | `npx quasar build -m pwa` | Production build verification |

**Triggers**: push to `main`/`develop`, pull requests to `main`/`develop`

### 5. Package.json Changes

| Key                                               | Value       | Purpose                             |
| ------------------------------------------------- | ----------- | ----------------------------------- |
| `scripts.prepare`                                 | `"husky"`   | Auto-install hooks on `npm install` |
| `lint-staged`                                     | (see above) | lint-staged configuration           |
| `devDependencies.husky`                           | `^9.x`      | Git hook management                 |
| `devDependencies.lint-staged`                     | `^15.x`     | Staged file linting                 |
| `devDependencies.@commitlint/cli`                 | `^19.x`     | Commit message linting CLI          |
| `devDependencies.@commitlint/config-conventional` | `^19.x`     | Conventional Commits rules          |
