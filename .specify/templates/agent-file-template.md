# Financial Calculator - Development Guidelines

Auto-generated from feature plans. Last updated: [DATE]

## Technologies

- **Framework**: Vue 3.4+ with Quasar 2.18+
- **Language**: TypeScript 4.5+
- **State**: Pinia 2.x
- **Testing**: Vitest 2.x
- **Platform**: PWA + Cordova

## Project Structure

```text
src/
├── components/[moduleName]/    # Calculator modules
│   ├── components/             # Vue components
│   ├── interfaces/             # TS interfaces
│   ├── logic/                  # Logic (extends BasicCalculator)
│   ├── pages/                  # Pages
│   ├── types/                  # TS types
│   └── store.ts                # Pinia store
├── logic/                      # Shared logic
│   ├── BasicCalculator.ts      # Base class
│   ├── constants.ts            # Constants (taxes, ZUS)
│   └── validationRules.ts      # Validation rules
└── pages/                      # Main pages

test/vitest/__tests__/
├── modules/[moduleName]/       # Module tests
└── logic/                      # Shared logic tests
```

## Commands

```bash
# Run dev server
npm start

# Test specific module
npx vitest run test/vitest/__tests__/modules/[moduleName]/[testName].test.ts

# All tests
npm run test:unit:ci

# Build
npm run build
```

## Code Style

- **Logic**: Extend `BasicCalculator`
- **Validation**: Use `validationRules`
- **UI**: Quasar components
- **UI Language**: Polish
- **Rounding**: 2 decimal places (grosze)
- **Tests**: Include all output values

## Module Pattern

Reference: `src/components/contractWork/`

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
