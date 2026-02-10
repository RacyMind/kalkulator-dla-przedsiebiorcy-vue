# Contract: Review Prompt Service

## Pinia Store: `useReviewPromptStore`

**File**: `src/stores/reviewPromptStore.ts`

### State

```typescript
interface ReviewPromptState {
  calculationCount: Ref<number>;
  lastPromptDate: Ref<string | null>;
  promptCount: Ref<number>;
}
```

### Actions

#### `incrementCalculationCount()`

Increments the calculation counter by 1. Called from each module's Form.vue after successful form submission.

**Preconditions**: None  
**Postconditions**: `calculationCount` increased by 1, persisted to localStorage  
**Side effects**: None

#### `shouldShowPrompt(): boolean`

Evaluates all conditions to determine if In-App Review should be triggered.

**Conditions (ALL must be true)**:

1. `calculationCount >= MIN_CALCULATIONS_FOR_PROMPT` (5)
2. `promptCount < MAX_PROMPT_COUNT` (3)
3. `lastPromptDate === null` OR days since `lastPromptDate` >= `COOLDOWN_DAYS` (90)

**Returns**: `true` if all conditions met, `false` otherwise

#### `recordPromptShown()`

Records that the In-App Review dialog was requested.

**Preconditions**: `shouldShowPrompt()` returned `true`  
**Postconditions**:

- `lastPromptDate` set to current ISO date string
- `promptCount` incremented by 1
- Both persisted to localStorage

---

## Composable: `useReviewPrompt`

**File**: `src/composables/useReviewPrompt.ts`

### API

```typescript
function useReviewPrompt(): {
  incrementCalculationCount: () => void;
};
```

Thin wrapper around the store for use in Form.vue components. Handles platform check internally — on non-native platforms, `incrementCalculationCount` is a no-op.

---

## Boot File: `src/boot/review-prompt.ts`

**File**: `src/boot/review-prompt.ts`

### Behavior

1. Check `Capacitor.isNativePlatform()` — if false, return immediately
2. Load `useReviewPromptStore`
3. Call `shouldShowPrompt()`
4. If true:
   a. Call `InAppReview.requestReview()` (wrapped in try/catch)
   b. On success or failure: call `recordPromptShown()`
   c. On error: log to console, do not propagate

### Error Handling

All errors from `@capacitor-community/in-app-review` are caught silently. The app continues normal operation regardless of API result.

---

## Menu Item Update

**File**: `src/components/partials/menu/menuItems.ts`

### Change

Update existing native Android menu item (lines 16-25):

| Field     | Before                                                       | After                                      |
| --------- | ------------------------------------------------------------ | ------------------------------------------ |
| `title`   | `'Oceń w Google Play'`                                       | `'Podoba Ci się? Oceń!'`                   |
| `caption` | `'Pomóż w rozwoju aplikacji i oceń aplikację w Google Play'` | `'Twoja opinia pomaga innym użytkownikom'` |
