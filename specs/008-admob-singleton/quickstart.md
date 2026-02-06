# Quickstart: AdMob Singleton

**Branch**: `008-admob-singleton`  
**Date**: 2026-02-06

## Wymagania wstępne

1. Konto Google AdMob z Application ID i Banner Ad Unit ID
2. Android Studio + emulator lub fizyczne urządzenie Android
3. Node.js >= 20

## Krok 1: Instalacja pluginu

```bash
cd src-capacitor
npm install --save @capacitor-community/admob@6
npx cap update
```

## Krok 2: Konfiguracja Android

### AndroidManifest.xml

Dodaj w `<application>`:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="@string/admob_app_id"/>
```

### res/values/strings.xml

Dodaj:

```xml
<string name="admob_app_id">[YOUR_APP_ID]</string>
```

## Krok 3: Konfiguracja projektu

### quasar.config.js

Dodaj boot file:

```javascript
boot: [
  'google-analytics',
  'admob',
],
```

## Krok 4: Implementacja

Pliki do utworzenia/zmodyfikowania:

1. `src/services/admob/adConfig.ts` — konfiguracja
2. `src/services/admob/types.ts` — typy TypeScript
3. `src/services/admob/AdMobService.ts` — singleton serwis
4. `src/boot/admob.ts` — boot file (init + router guard)
5. `src/components/partials/Advert.vue` — warunkowe renderowanie

## Krok 5: Testowanie

### Development (test ads)

```bash
# Ustaw isTesting: true w adConfig.ts
quasar dev -m capacitor -T android
```

### Unit tests

```bash
npx vitest run test/vitest/__tests__/services/admob/AdMobService.test.ts
```

### Weryfikacja na emulatorze

1. Uruchom aplikację na emulatorze Android
2. Sprawdź logcat — `AdMob.initialize()` wywołane 1×
3. Nawiguj między modułami — brak nowych requestów
4. Przejdź na stronę "Polityka prywatności" — banner znika
5. Wróć na moduł — banner wraca

## Krok 6: Produkcja

1. Zamień test Ad Unit ID na produkcyjny w `strings.xml`
2. Ustaw `isTesting: false` w `adConfig.ts`
3. Build: `quasar build -m capacitor -T android`
