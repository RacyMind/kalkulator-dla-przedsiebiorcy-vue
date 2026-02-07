# Research: Git Hooks i CI (Milestone 7)

**Branch**: `016-git-hooks-ci`
**Date**: 2026-02-07

## R1: Husky v9 Setup for ESM Project

**Decision**: Use Husky v9 with `npx husky init` for initialization.

**Rationale**: Husky v9 simplified the setup significantly compared to v8. The `init` command creates the `.husky/` directory and adds the `prepare` script to `package.json` automatically. v9 uses plain shell scripts in `.husky/` (no more `husky.sh` sourcing). Compatible with ESM projects (`"type": "module"` in package.json).

**Key details**:

- `npx husky init` creates `.husky/pre-commit` with `npm test` as default
- Hook files are plain shell scripts (no shebang needed in v9)
- `prepare` script: `"prepare": "husky"` (not `husky install` like v8)
- Windows: hook files MUST be UTF-8 encoded to avoid runtime errors

**Alternatives considered**:

- **simple-git-hooks**: Simpler but less ecosystem support, no `lint-staged` integration docs
- **lefthook**: Fast Go-based alternative, but adds complexity for a single-dev project
- **Manual .git/hooks**: No portability, not shareable via repo

## R2: lint-staged Configuration

**Decision**: Configure lint-staged in `package.json` under `"lint-staged"` key.

**Rationale**: Inline config in `package.json` is simplest for this project — avoids extra config files. The project already has ESLint flat config and Prettier configured.

**Configuration pattern**:

```json
{
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.scss": ["prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

**Key details**:

- lint-staged runs commands sequentially per glob pattern
- ESLint `--fix` auto-fixes what it can; if unfixable errors remain, the commit is blocked
- Prettier `--write` reformats in-place; changes are auto-staged by lint-staged
- ESLint is NOT run on `.scss`, `.md`, `.json` — only Prettier (ESLint doesn't support those)

**Alternatives considered**:

- `.lintstagedrc.js` file: Unnecessary complexity for simple config
- Running ESLint on all file types: ESLint only supports `.ts`, `.vue`, `.js`

## R3: Commitlint Configuration

**Decision**: Use `commitlint.config.js` (CJS) with `@commitlint/config-conventional`.

**Rationale**: The project uses `"type": "module"` in package.json, so `.js` files are ESM by default. However, commitlint config works best as a simple CJS export. Use `commitlint.config.cjs` or export default syntax in `.js`. Since the project is ESM, use `commitlint.config.js` with ESM export syntax.

**Configuration**:

```js
export default {
  extends: ['@commitlint/config-conventional'],
};
```

**Key details**:

- `@commitlint/config-conventional` enforces Conventional Commits format
- Default types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scope is optional by default
- Hook command: `npx --no -- commitlint --edit $1`
- Windows hook: use backtick escape for `$1`

**Alternatives considered**:

- Custom rules without `config-conventional`: More work, less standard
- `commitlint.config.cjs`: Works but `.js` with ESM export is cleaner for this project

## R4: GitHub Actions CI Workflow

**Decision**: Single workflow file `.github/workflows/ci.yml` with three jobs: `lint`, `test`, `build`.

**Rationale**: Per clarification, Lint and Test run in parallel; Build depends on both (`needs: [lint, test]`). This saves CI minutes when Lint or Test fails.

**Configuration pattern**:

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx vitest run

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx quasar build -m pwa
```

**Key details**:

- `npm ci` (not `npm install`) for deterministic installs in CI
- `actions/setup-node@v4` with `cache: 'npm'` for faster installs
- Node 20 matches project's `engines` requirement
- Husky's `prepare` script runs during `npm ci` but is harmless in CI (creates `.husky/` dir)
- Build job uses `npx quasar build` (Quasar CLI is a devDependency)

**Alternatives considered**:

- Matrix strategy for multiple Node versions: Unnecessary — project targets Node 20 only
- Separate workflow files per job: Overengineered for 3 simple jobs
- Caching `node_modules`: `actions/setup-node` cache is sufficient

## R5: CI Badge in README

**Decision**: Add GitHub Actions badge at the top of `README.md`.

**Badge format**:

```markdown
![CI](https://github.com/{owner}/{repo}/actions/workflows/ci.yml/badge.svg?branch=main)
```

**Key details**:

- Badge auto-updates based on latest workflow run on `main`
- Need to determine actual GitHub owner/repo from git remote

## R6: Husky in CI Environment

**Decision**: Husky v9 handles CI gracefully — `prepare` script runs but doesn't break CI.

**Rationale**: Husky v9's `prepare` script (`husky`) simply ensures `.husky/` directory exists. In CI, Git hooks are irrelevant (no commits happen), so even if hooks are installed, they don't interfere. No special `HUSKY=0` environment variable needed.

**Alternatives considered**:

- Setting `HUSKY=0` in CI: Unnecessary with Husky v9 — it's already lightweight
- Conditional `prepare` script: Overengineered
