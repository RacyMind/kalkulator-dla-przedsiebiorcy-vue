# Quickstart: Google Play In-App Review

## Prerequisites

- Node.js >= 20.0.0
- Android Studio (for Capacitor Android builds)
- Physical Android device or emulator with Google Play Store

## Installation

```bash
npm install @capacitor-community/in-app-review
npx cap sync android
```

## New Files to Create

| File                                 | Purpose                                         |
| ------------------------------------ | ----------------------------------------------- |
| `src/stores/reviewPromptStore.ts`    | Pinia store for review state persistence        |
| `src/composables/useReviewPrompt.ts` | Composable for incrementing calculation count   |
| `src/boot/review-prompt.ts`          | Boot file triggering In-App Review on app start |

## Files to Modify

| File                                        | Change                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `src/components/partials/menu/menuItems.ts` | Update menu item title/caption                                              |
| `src/components/*/components/Form.vue`      | Add `incrementCalculationCount()` call in each module's form submit handler |
| `quasar.config.ts`                          | Register `review-prompt` boot file                                          |

## Module Form.vue Integration

Each calculator module's `Form.vue` needs one line added in `handleFormSubmit`:

```typescript
import { useReviewPrompt } from 'src/composables/useReviewPrompt';

const { incrementCalculationCount } = useReviewPrompt();

const handleFormSubmit = () => {
  // ... existing logic ...
  incrementCalculationCount();
  emit('submit');
};
```

## Testing on Device

1. Build: `npm run build:android`
2. Open in Android Studio: `npx cap open android`
3. Run on physical device (In-App Review may not show on emulator)
4. Note: Google Play In-App Review requires the app to be published on Google Play (at least internal testing track) for the dialog to appear

## Testing Locally (Unit Tests)

```bash
npx vitest run test/vitest/__tests__/modules/reviewPrompt/reviewPromptStore.test.ts
```

## Limitations

- In-App Review dialog appearance is controlled by Google — calling `requestReview()` does not guarantee the dialog will show
- No way to detect if user actually submitted a review
- For testing, use Google's internal app sharing or internal testing track
