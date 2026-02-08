# Research: AdMob Singleton

**Branch**: `008-admob-singleton`  
**Date**: 2026-02-06

## R1: Plugin wybór i kompatybilność z Capacitor 6

**Decision**: `@capacitor-community/admob@6`

**Rationale**:
- Oficjalny community plugin, aktywnie utrzymywany
- Wersja 6.x dedykowana dla Capacitor 6
- Obsługuje banner, interstitial, rewarded (potrzebujemy tylko banner)
- API: `showBanner()`, `hideBanner()`, `resumeBanner()`, `removeBanner()` — idealnie pasuje do wzorca singleton
- Instalacja: `npm install --save @capacitor-community/admob@6` + `npx cap update`

**Alternatives considered**:
- `@niceplugin/capacitor-admob` — mniej popularny, mniej aktywny
- Natywna implementacja (Java/Kotlin) — zbyt duży nakład pracy, brak potrzeby

## R2: Wzorzec singleton dla bannera AdMob

**Decision**: Użyć `showBanner()` raz przy starcie, `hideBanner()`/`resumeBanner()` do kontroli widoczności

**Rationale**:
- `showBanner(options)` — tworzy i wyświetla banner (1 request)
- `hideBanner()` — ukrywa banner, ale zachowuje obiekt w pamięci
- `resumeBanner()` — ponownie wyświetla ukryty banner (0 nowych requestów)
- `removeBanner()` — niszczy obiekt (NIE używamy w normalnym flow)
- AdMob SDK automatycznie odświeża kreację co ~60s
- Ten wzorzec gwarantuje dokładnie 1 request na sesję

**Alternatives considered**:
- `showBanner()`/`removeBanner()` na każdej stronie — wielokrotne requesty, psuje statystyki
- Własny cache reklam — niemożliwe z SDK, SDK zarządza cyklem życia

## R3: Konfiguracja Android

**Decision**: Dodać meta-data w AndroidManifest.xml + Ad Unit ID w strings.xml

**Rationale**:
- Wymagane przez SDK: `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id"/>`
- Ad Unit ID w `strings.xml` — bezpieczne, nie trafia do repozytorium (lub dodać do `.gitignore`)
- Alternatywnie: env variable w Capacitor config — ale strings.xml to standard Android

**Konfiguracja wymagana**:
1. `AndroidManifest.xml` — dodać meta-data z APPLICATION_ID
2. `res/values/strings.xml` — dodać `admob_app_id` i `admob_banner_id`

## R4: Detekcja platformy (natywna vs web)

**Decision**: Użyć `Capacitor.isNativePlatform()` z `@capacitor/core`

**Rationale**:
- `@capacitor/core` jest już zainstalowany (zależność Capacitor)
- `Capacitor.isNativePlatform()` zwraca `true` na Android/iOS, `false` na web
- Prosta, niezawodna metoda — nie wymaga dodatkowych zależności

**Alternatives considered**:
- `navigator.userAgent` — zawodne, łatwe do sfałszowania
- `window.Capacitor` — mniej oficjalne API

## R5: Miejsce inicjalizacji singletona

**Decision**: Quasar boot file (`src/boot/admob.ts`)

**Rationale**:
- Boot files w Quasar wykonują się raz przy starcie aplikacji — idealnie dla singletona
- Istniejący wzorzec: `src/boot/google-analytics.ts` działa analogicznie
- Boot file ma dostęp do routera — można reagować na nawigację
- Konfiguracja w `quasar.config.js` → `boot: ['google-analytics', 'admob']`

**Alternatives considered**:
- `App.vue` onMounted — działa, ale boot file jest czystszy i bardziej idiomatyczny dla Quasar
- Composable wywoływany w `App.vue` — dodatkowa warstwa abstrakcji bez korzyści

## R6: Strategia show/hide bannera przy nawigacji

**Decision**: Router guard (`afterEach`) do kontroli widoczności

**Rationale**:
- `router.afterEach()` — wywoływany po każdej nawigacji
- Sprawdza czy bieżąca strona jest na liście stron z reklamą
- Jeśli tak: `resumeBanner()`, jeśli nie: `hideBanner()`
- Wzorzec już używany w `google-analytics.ts` boot file
- Lista stron bez reklamy jest krótka (4 strony) — łatwiej wykluczać niż włączać

**Alternatives considered**:
- Komponent `Advert.vue` zarządza show/hide — problematyczne, bo banner jest natywny (overlay), nie Vue component
- Pinia store z flagą — dodatkowa złożoność bez korzyści

## R7: Pozycja bannera (natywny overlay vs inline)

**Decision**: `BannerAdPosition.BOTTOM_CENTER` z marginesem

**Rationale**:
- Banner AdMob w Capacitor to **natywny overlay** — wyświetla się NAD WebView, nie wewnątrz niego
- Nie można go umieścić "między formularzem a wynikami" jak w spec — to ograniczenie SDK
- `BOTTOM_CENTER` to najczęstsza pozycja dla bannerów mobilnych
- Wymaga dodania `margin-bottom` do contentu, aby banner nie zasłaniał treści
- `BannerAdPluginEvents.SizeChanged` — listener do dynamicznego dostosowania marginesu

**Impact on spec**: Spec mówi "między formularzem a wynikami" — to niemożliwe z natywnym overlay. Zmiana na `BOTTOM_CENTER` (dół ekranu). To standardowa pozycja w aplikacjach mobilnych.

## R8: Obsługa błędów

**Decision**: Logowanie błędów + fallback do wewnętrznych banerów

**Rationale**:
- `BannerAdPluginEvents.FailedToLoad` — listener na błędy ładowania
- Przy błędzie: logować do konsoli, nie pokazywać użytkownikowi
- Na web/PWA: zawsze wyświetlać `Advert.vue` (Donate/TaxDonation)
- Na natywnej z błędem: ukryć miejsce na reklamę (nie pokazywać pustego miejsca)

## R9: Testowanie

**Decision**: Test Ad Unit ID w development, produkcyjny w release

**Rationale**:
- Google dostarcza test Ad Unit IDs: `ca-app-pub-3940256099942544/6300978111` (banner)
- `isTesting: true` w `BannerAdOptions` — używa testowych reklam
- Produkcyjny Ad Unit ID w `strings.xml` — nie trafia do repozytorium
- Vitest: mockować `@capacitor-community/admob` — testować logikę singletona, nie SDK
