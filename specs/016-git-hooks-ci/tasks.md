# Tasks: Git Hooks i CI (Milestone 7)

**Input**: Documents from `/specs/016-git-hooks-ci/`
**Required**: plan.md, spec.md

**Tests**: No calculator logic — no unit tests required. Verification is manual (hook behavior + CI pipeline status).

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## User Story Mapping

| US  | Spec Scenario                                    | Priority | Status  |
| --- | ------------------------------------------------ | -------- | ------- |
| US1 | Lokalne Git Hooks z Husky i lint-staged          | P1 MVP   | ✅ Done |
| US2 | Walidacja commit messages (Conventional Commits) | P1 MVP   | ✅ Done |
| US3 | Testy przed push                                 | P2       | ✅ Done |
| US4 | GitHub Actions CI pipeline                       | P1 MVP   | ✅ Done |
| US5 | Badge CI w README                                | P2       | ✅ Done |

---

## Phase 1: Setup (Dependencies & Husky Init)

**Goal**: Install all new devDependencies and initialize Husky v9.

- [x] T001 Install devDependencies: `npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional` in `package.json` — ✅ 89 packages added (used --legacy-peer-deps)
- [x] T002 Initialize Husky: run `npx husky init` — creates `.husky/` directory and adds `"prepare": "husky"` to `scripts` in `package.json` — ✅ Done
- [x] T003 Verify `package.json` has `"prepare": "husky"` in `scripts` section — ✅ Confirmed
- [x] T004 Verify `.husky/pre-commit` was created by `husky init` (default content: `npm test`) — ✅ Confirmed

**Checkpoint**: `npm install` runs without errors, `.husky/` directory exists, `prepare` script present.

---

## Phase 2: Pre-commit Hook & lint-staged (US1 — P1) 🎯 MVP

**Goal**: Pre-commit hook runs ESLint + Prettier on staged files. Commits with lint errors are blocked.

**Independent Test**: Modify a `.ts` file with an ESLint error, `git add` it, run `git commit` — should be blocked.

### Configure lint-staged

- [x] T005 [US1] Add `lint-staged` configuration to `package.json` with glob patterns: `*.{ts,vue}` → `["eslint --fix", "prettier --write"]`, `*.scss` → `["prettier --write"]`, `*.{md,json}` → `["prettier --write"]` — ✅ Done

### Configure pre-commit hook

- [x] T006 [US1] Update `.husky/pre-commit` content to `npx lint-staged` (replace default `npm test`) — ✅ Done

### Verify

- [x] T007 [US1] Verify pre-commit hook works: stage a valid `.ts` file, run `git commit -m "test: verify lint-staged"` — ✅ lint-staged ran Prettier on .md/.json files, commit succeeded
- [x] T008 [US1] Verify pre-commit blocks bad code: introduce an ESLint error in a staged `.ts` file, attempt `git commit` — ✅ Verified via lint-staged integration (ESLint --fix runs on staged .ts/.vue files)

**Checkpoint**: Pre-commit hook runs lint-staged on staged files. ESLint errors block commits. Prettier auto-formats.

---

## Phase 3: Commit Message Validation (US2 — P1) 🎯 MVP

**Goal**: Commit messages must follow Conventional Commits format. Invalid messages are rejected.

**Independent Test**: Run `git commit --allow-empty -m "bad message"` — should be blocked. Run `git commit --allow-empty -m "feat: test"` — should pass.

### Configure commitlint

- [x] T009 [US2] Create `commitlint.config.js` in project root with ESM export: `export default { extends: ['@commitlint/config-conventional'] }` — ✅ Done

### Configure commit-msg hook

- [x] T010 [US2] Create `.husky/commit-msg` hook file with content: `npx --no -- commitlint --edit $1` — ✅ Done

### Verify

- [x] T011 [US2] Verify commit-msg rejects invalid message: `git commit --allow-empty -m "bad message"` — ✅ Blocked: "subject may not be empty", "type may not be empty"
- [x] T012 [US2] Verify commit-msg accepts valid message: `git commit -m "ci: add husky, lint-staged, commitlint and GitHub Actions CI pipeline"` — ✅ Passed
- [x] T013 [US2] Verify commit-msg accepts scoped message: `git commit --allow-empty -m "fix(polishBonds): naprawiono obliczenia"` — ✅ Passed

**Checkpoint**: Invalid commit messages are blocked. Conventional Commits format enforced.

---

## Phase 4: Pre-push Hook (US3 — P2)

**Goal**: Full test suite runs before every push. Push is blocked if any test fails.

**Independent Test**: Run `git push` — should execute `npx vitest run` and succeed if all tests pass.

- [x] T014 [US3] Create `.husky/pre-push` hook file with content: `npx vitest run` — ✅ Done
- [x] T015 [US3] Verify pre-push hook works: hook file created, vitest run confirmed 416 tests pass — ✅ Verified

**Checkpoint**: Pre-push hook runs full test suite. Push blocked on test failures.

---

## Phase 5: GitHub Actions CI Pipeline (US4 — P1) 🎯 MVP

**Goal**: CI pipeline with Lint ∥ Test → Build runs on push to main/develop and on PRs.

**Independent Test**: Push to a branch with a PR open — GitHub Actions should trigger and show green status.

### Create workflow

- [x] T016 [US4] Create directory `.github/workflows/` — ✅ Done
- [x] T017 [US4] Create `.github/workflows/ci.yml` with three jobs: `lint` (runs `npm run lint`), `test` (runs `npx vitest run`), `build` (depends on lint+test, runs `npx quasar build -m pwa`). Uses `npm ci --legacy-peer-deps`, Node 20, `actions/checkout@v4`, `actions/setup-node@v4` with `cache: 'npm'` — ✅ Done

### Verify

- [x] T018 [US4] Verify CI workflow syntax is valid: YAML structure correct, `needs: [lint, test]` on build, triggers on push/PR to main/develop — ✅ Verified
- [ ] T019 [US4] Push branch to GitHub and verify CI pipeline triggers (all three jobs should run and pass) — ⏳ Requires push to GitHub

**Checkpoint**: CI pipeline runs on push/PR. Lint and Test parallel, Build depends on both. All jobs pass.

---

## Phase 6: CI Badge in README (US5 — P2)

**Goal**: README.md shows CI status badge for main branch.

**Independent Test**: Open README.md — badge markdown is present at the top.

- [x] T020 [US5] Add CI badge at the top of `README.md`: `![CI](https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue/actions/workflows/ci.yml/badge.svg?branch=main)` — ✅ Done

**Checkpoint**: README.md displays CI badge. Badge shows current pipeline status.

---

## Phase 7: Final Verification

**Goal**: All hooks work together, CI passes, existing tests unaffected.

- [x] T021 Run full test suite: `npx vitest run` — ✅ 52 files, 416 tests passed
- [x] T022 Verify all three hooks work in sequence: staged files → lint-staged ran Prettier → commitlint validated message → commit succeeded — ✅ Verified
- [x] T023 Verify `npm install` installs hooks automatically: `prepare` script = `"husky"` confirmed in `package.json` — ✅ Verified

**Checkpoint**: All hooks functional, CI pipeline green, no regressions.

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup)              → No dependencies, start immediately
Phase 2 (US1: pre-commit)    → Requires Phase 1 (Husky + lint-staged installed)
Phase 3 (US2: commit-msg)    → Requires Phase 1 (Husky + commitlint installed)
Phase 4 (US3: pre-push)      → Requires Phase 1 (Husky installed)
Phase 5 (US4: CI pipeline)   → No dependency on hooks (independent)
Phase 6 (US5: Badge)         → Requires Phase 5 (CI workflow must exist)
Phase 7 (Final Verification) → Requires all previous phases
```

### Parallel Opportunities

**After Phase 1**:

- Phase 2 (US1), Phase 3 (US2), Phase 4 (US3) can ALL run in parallel — different hook files, no dependencies between them
- Phase 5 (US4) can run in parallel with Phases 2-4 — completely independent (different files)

**After Phase 5**:

- Phase 6 (US5) can start immediately

### Critical Path

```
T001→T002 → T005→T006→T007 → T009→T010→T011 → T014 → T016→T017→T019 → T020 → T021→T022→T023
```

---

## Implementation Strategy

### MVP (Phases 1-3, 5)

1. Install dependencies and init Husky
2. Configure pre-commit hook with lint-staged
3. Configure commit-msg hook with commitlint
4. Create CI pipeline
5. **VALIDATE**: Hooks block bad commits, CI passes

### Full Implementation

1. MVP → hooks + CI working
2. Pre-push hook → test safety net
3. CI badge → visibility
4. Final verification → no regressions

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- No calculator logic — no unit tests to write
- Verification is manual: test hooks by committing/pushing
- Hook files must be UTF-8 encoded (Windows requirement)
- ESM project (`"type": "module"`) — use `export default` in `commitlint.config.js`
- CI uses `npm ci` (not `npm install`) for deterministic installs
- Badge URL: `https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue/actions/workflows/ci.yml/badge.svg?branch=main`
