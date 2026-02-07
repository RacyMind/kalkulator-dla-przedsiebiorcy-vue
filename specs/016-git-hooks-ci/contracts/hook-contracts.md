# Contract: Git Hook Behaviors

## pre-commit Hook

**Trigger**: `git commit`
**Command**: `npx lint-staged`
**Behavior**:

- Runs ESLint (`--fix`) on staged `*.ts` and `*.vue` files
- Runs Prettier (`--write`) on staged `*.ts`, `*.vue`, `*.scss`, `*.md`, `*.json` files
- **Success**: All linters pass → commit proceeds
- **Failure**: ESLint reports unfixable errors → commit blocked, error output shown

## commit-msg Hook

**Trigger**: `git commit` (after pre-commit passes)
**Command**: `npx --no -- commitlint --edit $1`
**Behavior**:

- Validates commit message against Conventional Commits format
- **Valid formats**: `type: description`, `type(scope): description`
- **Accepted types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Success**: Message matches format → commit proceeds
- **Failure**: Message doesn't match → commit blocked with format hint

## pre-push Hook

**Trigger**: `git push`
**Command**: `npx vitest run`
**Behavior**:

- Runs full test suite (416+ tests across 52 files)
- **Success**: All tests pass (exit code 0) → push proceeds
- **Failure**: Any test fails → push blocked, failure output shown

## Bypass

All hooks can be bypassed with `--no-verify` flag. CI pipeline still enforces quality.
