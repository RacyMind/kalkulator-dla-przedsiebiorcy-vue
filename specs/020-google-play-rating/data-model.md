# Data Model: Google Play In-App Review

## Entities

### ReviewState

Persisted in localStorage via `useLocalStorage` (Pinia store).

| Field              | Type             | Default | Description                                               |
| ------------------ | ---------------- | ------- | --------------------------------------------------------- |
| `calculationCount` | `number`         | `0`     | Total number of "Oblicz" button clicks across all modules |
| `lastPromptDate`   | `string \| null` | `null`  | ISO 8601 date string of last In-App Review dialog display |
| `promptCount`      | `number`         | `0`     | Total number of times In-App Review dialog was shown      |

### Storage Keys

All keys are prefixed with `reviewPrompt/` to avoid collisions:

| Key                             | Type             | Maps to                        |
| ------------------------------- | ---------------- | ------------------------------ |
| `reviewPrompt/calculationCount` | `number`         | `ReviewState.calculationCount` |
| `reviewPrompt/lastPromptDate`   | `string \| null` | `ReviewState.lastPromptDate`   |
| `reviewPrompt/promptCount`      | `number`         | `ReviewState.promptCount`      |

## Constants

| Constant                      | Value | Description                              |
| ----------------------------- | ----- | ---------------------------------------- |
| `MIN_CALCULATIONS_FOR_PROMPT` | `5`   | Minimum calculations before first prompt |
| `COOLDOWN_DAYS`               | `90`  | Minimum days between prompts             |
| `MAX_PROMPT_COUNT`            | `3`   | Maximum lifetime prompt displays         |

## State Transitions

```
[App Start]
    │
    ▼
[Check Conditions] ──── calculationCount < 5 ──────────► [No Action]
    │                    promptCount >= 3 ──────────────►
    │                    daysSinceLastPrompt < 90 ──────►
    │                    !isNativePlatform ─────────────►
    │
    ▼ (all conditions met)
[Request In-App Review]
    │
    ▼
[Update State]
    ├── lastPromptDate = now
    └── promptCount += 1
```

## Relationships

- **ReviewState** ← read/write → **Pinia Store** (`useReviewPromptStore`)
- **ReviewState** ← persist → **localStorage** (via `useLocalStorage`)
- **Boot file** → reads **ReviewState** → calls **InAppReview API**
- **Form.vue** (each module) → calls `incrementCalculationCount()` → updates **ReviewState**
