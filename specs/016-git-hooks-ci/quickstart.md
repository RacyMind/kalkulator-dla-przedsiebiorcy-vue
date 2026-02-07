# Quickstart: Git Hooks i CI (Milestone 7)

**Branch**: `016-git-hooks-ci`

## Prerequisites

- Node.js >= 20
- npm >= 6.13.4
- Git repository with GitHub remote

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
```

### Step 2: Initialize Husky

```bash
npx husky init
```

This creates `.husky/` directory and adds `"prepare": "husky"` to `package.json`.

### Step 3: Configure Git Hooks

**`.husky/pre-commit`**:

```
npx lint-staged
```

**`.husky/commit-msg`**:

```
npx --no -- commitlint --edit $1
```

**`.husky/pre-push`**:

```
npx vitest run
```

### Step 4: Configure lint-staged

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.scss": ["prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

### Step 5: Configure Commitlint

Create `commitlint.config.js`:

```js
export default {
  extends: ['@commitlint/config-conventional'],
};
```

### Step 6: Create CI Workflow

Create `.github/workflows/ci.yml` — see `contracts/ci-workflow.yml` for full content.

### Step 7: Add CI Badge to README

Add at top of `README.md`:

```markdown
![CI](https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue/actions/workflows/ci.yml/badge.svg?branch=main)
```

## Verification

```bash
# Test pre-commit hook
echo "const x = 1" >> src/api/nbp.ts
git add src/api/nbp.ts
git commit -m "test: verify pre-commit hook"
# Should run lint-staged successfully

# Test commit-msg hook (should fail)
git commit --allow-empty -m "bad message"
# Should be blocked by commitlint

# Test commit-msg hook (should pass)
git commit --allow-empty -m "chore: test commitlint"
# Should pass

# Test pre-push hook
npx vitest run
# Should pass all 416+ tests

# Verify all tests still pass
npx vitest run
```
