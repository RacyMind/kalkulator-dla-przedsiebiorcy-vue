# Data Model: AdMob Singleton

**Branch**: `008-admob-singleton`  
**Date**: 2026-02-06

## Entities

### AdMobService (Singleton)

Stan wewnętrzny serwisu — nie jest persystowany, żyje w pamięci przez czas życia aplikacji.

| Field | Type | Description |
|-------|------|-------------|
| `isInitialized` | `boolean` | Czy SDK zostało zainicjalizowane |
| `isBannerLoaded` | `boolean` | Czy banner został załadowany (showBanner wywołane) |
| `isBannerVisible` | `boolean` | Czy banner jest aktualnie widoczny |
| `bannerHeight` | `number` | Wysokość bannera w px (z SizeChanged event) |
| `lastError` | `AdMobError \| null` | Ostatni błąd ładowania (do logowania) |

### AdConfig

Konfiguracja statyczna — definiowana w kodzie.

| Field | Type | Description |
|-------|------|-------------|
| `bannerAdId` | `string` | Ad Unit ID bannera (z env/strings.xml) |
| `position` | `BannerAdPosition` | Pozycja bannera (`BOTTOM_CENTER`) |
| `adSize` | `BannerAdSize` | Rozmiar bannera (`ADAPTIVE_BANNER`) |
| `isTesting` | `boolean` | Tryb testowy (dev: true, prod: false) |
| `noAdPages` | `string[]` | Lista ścieżek bez reklamy |

### BannerAdOptions (z @capacitor-community/admob)

Interfejs SDK — używany przy wywołaniu `showBanner()`.

| Field | Type | Default |
|-------|------|---------|
| `adId` | `string` | — |
| `adSize` | `BannerAdSize` | `ADAPTIVE_BANNER` |
| `position` | `BannerAdPosition` | `BOTTOM_CENTER` |
| `margin` | `number` | `0` |
| `isTesting` | `boolean` | `false` |
| `npa` | `boolean` | `false` |

## State Transitions

```
[App Start]
    │
    ▼
[NOT_INITIALIZED] ──AdMob.initialize()──► [INITIALIZED]
    │                                          │
    │                                   showBanner()
    │                                          │
    │                                          ▼
    │                                   [BANNER_VISIBLE]
    │                                     │         ▲
    │                              hideBanner()  resumeBanner()
    │                                     │         │
    │                                     ▼         │
    │                                   [BANNER_HIDDEN]
    │
    │ (web/PWA — skip all above)
    ▼
[WEB_MODE] ── Advert.vue shows Donate/TaxDonation
```

## Relationships

- **AdMobService** uses **AdConfig** for configuration
- **AdMobService** creates **BannerAdOptions** from **AdConfig**
- **Boot file** creates and initializes **AdMobService** singleton
- **Router guard** calls **AdMobService**.show/hide based on current route
- **Advert.vue** checks platform — renders nothing on native (banner is overlay), renders Donate/TaxDonation on web
