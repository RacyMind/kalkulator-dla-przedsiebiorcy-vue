# Contract: AdMobService

**Branch**: `008-admob-singleton`  
**Date**: 2026-02-06

## AdMobService (Singleton Class)

### Public API

#### `initialize(): Promise<void>`

Inicjalizuje AdMob SDK i ładuje banner. Wywołać **dokładnie raz** przy starcie aplikacji.

- **Preconditions**: Aplikacja działa na natywnej platformie (Android)
- **Postconditions**: SDK zainicjalizowany, banner załadowany i widoczny
- **Errors**: Loguje błąd, nie rzuca wyjątku — aplikacja działa dalej bez reklamy
- **Idempotent**: Tak — wielokrotne wywołanie nie tworzy duplikatów (guard `isInitialized`)

```typescript
async initialize(): Promise<void>
```

#### `showAd(): Promise<void>`

Wyświetla banner (resume). Nie tworzy nowego obiektu — używa istniejącego.

- **Preconditions**: `isBannerLoaded === true`
- **Postconditions**: `isBannerVisible === true`
- **No-op if**: Banner już widoczny lub nie załadowany

```typescript
async showAd(): Promise<void>
```

#### `hideAd(): Promise<void>`

Ukrywa banner. Obiekt pozostaje w pamięci.

- **Preconditions**: `isBannerLoaded === true`
- **Postconditions**: `isBannerVisible === false`
- **No-op if**: Banner już ukryty lub nie załadowany

```typescript
async hideAd(): Promise<void>
```

#### `getBannerHeight(): number`

Zwraca wysokość bannera w px. Używane do ustawienia margin-bottom na contencie.

- **Returns**: Wysokość bannera lub `0` jeśli nie załadowany

```typescript
getBannerHeight(): number
```

#### `isNative(): boolean`

Sprawdza czy aplikacja działa na natywnej platformie.

- **Returns**: `true` na Android/iOS, `false` na web/PWA

```typescript
isNative(): boolean
```

---

## Boot File Contract (`src/boot/admob.ts`)

### Quasar Boot File

```typescript
export default ({ router }: { router: Router }): void
```

**Behavior**:
1. Sprawdź platformę — jeśli web/PWA, zakończ (no-op)
2. Utwórz instancję `AdMobService`
3. Wywołaj `adMobService.initialize()`
4. Zarejestruj `router.afterEach()`:
   - Jeśli route.path jest na liście `noAdPages` → `adMobService.hideAd()`
   - W przeciwnym razie → `adMobService.showAd()`

---

## AdConfig Contract (`src/services/admob/adConfig.ts`)

### Exported Constants

```typescript
export const AD_CONFIG: {
  bannerAdId: string        // Ad Unit ID (test lub produkcyjny)
  position: BannerAdPosition // BOTTOM_CENTER
  adSize: BannerAdSize       // ADAPTIVE_BANNER
  isTesting: boolean         // true w dev, false w prod
  noAdPages: string[]        // ['/', '/polityka-prywatnosci', '/kontakt', '/historia-zmian']
}
```

---

## Event Listeners

### BannerAdPluginEvents.Loaded
- Ustawia `isBannerLoaded = true`
- Loguje sukces

### BannerAdPluginEvents.FailedToLoad
- Ustawia `lastError`
- Loguje błąd (console.error)
- NIE rzuca wyjątku

### BannerAdPluginEvents.SizeChanged
- Aktualizuje `bannerHeight`
- Emituje event do dostosowania margin-bottom (opcjonalnie)
