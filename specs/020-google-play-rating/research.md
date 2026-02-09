# Research: Google Play In-App Review

## R-001: Capacitor Plugin for In-App Review

**Decision**: Use `@capacitor-community/in-app-review` plugin  
**Rationale**: Official Capacitor community plugin wrapping Google Play In-App Review API. Lightweight, well-maintained, compatible with Capacitor 5+/6+. Project already uses `@capacitor-community/admob` so the pattern is established.  
**Alternatives considered**:

- `cordova-plugin-apprate` — Cordova-based, project is migrating to Capacitor
- Custom native bridge — unnecessary complexity for a simple API
- `@nicegrar/capacitor-rate-app` — less maintained, smaller community

## R-002: State Persistence Mechanism

**Decision**: Use `useLocalStorage` from `@vueuse/core` via a Pinia store  
**Rationale**: Project already uses `useLocalStorage` extensively (settingStore.ts, all Form.vue components). Consistent with existing patterns. Data is non-critical (review prompts) so localStorage is sufficient — no need for Capacitor Preferences plugin.  
**Alternatives considered**:

- `@capacitor/preferences` — adds native dependency for simple key-value data that doesn't need native storage
- Raw `localStorage` — used in analytics.ts but `useLocalStorage` via Pinia is the modern pattern in this project

## R-003: Calculation Count Hook Point

**Decision**: Create a composable `useReviewPrompt` that exposes an `incrementCalculationCount()` function. Each module's Form.vue calls it in `handleFormSubmit`.  
**Rationale**: The submit pattern is consistent across modules: `handleFormSubmit` → `emit('submit')`. Adding a single function call is minimally invasive. A composable keeps the logic decoupled from individual modules.  
**Alternatives considered**:

- Global event bus — over-engineered for a counter increment
- Pinia store action watcher — fragile, depends on store naming conventions
- Router afterEach hook — doesn't distinguish page views from actual calculations

## R-004: App Startup Trigger

**Decision**: Create a boot file `src/boot/review-prompt.ts` that checks conditions on app startup and triggers In-App Review if eligible.  
**Rationale**: Boot files are the established pattern for app initialization (see `admob.ts`). Runs once per app launch, which aligns with the trigger requirement ("przy następnym uruchomieniu aplikacji").  
**Alternatives considered**:

- App.vue onMounted — less clean, mixes concerns
- Router beforeEach — runs on every navigation, not just app start

## R-005: Google Play In-App Review API Limitations

**Decision**: Accept API limitations and design around them  
**Rationale**: Google Play In-App Review API has built-in quotas:

- Google controls when the dialog actually appears (may silently suppress)
- No callback indicating whether user rated or dismissed
- API may not show dialog even when `requestReview()` is called (quota exceeded)
- Works only on Android 5.0+ with Google Play Store installed

**Implications for design**:

- Cannot reliably detect if user rated → track "dialog requested" not "user rated"
- Cooldown and max-attempts logic is our own safeguard on top of Google's
- Silent failure handling is natural since API itself may silently not show dialog

## R-006: Menu Item Update

**Decision**: Update existing "Oceń w Google Play" menu item to "Podoba Ci się? Oceń!" with new caption  
**Rationale**: Menu item already exists in `menuItems.ts` (lines 16-25) for `Platform.is.nativeMobile && Platform.is.android`. Just needs text update, no structural changes.  
**Alternatives considered**:

- Adding a new separate menu item — would duplicate functionality
