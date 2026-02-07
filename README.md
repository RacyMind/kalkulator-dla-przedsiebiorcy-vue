# Kalkulator finansowy

Bezpłatny kalkulator finansowy umożliwiający obliczenie wynagrodzeń z umowy o pracę, umowy zlecenie, umowy o dzieło, samozatrudnienia (B2B) i wielu innych. Uwzględnia aktualne przepisy podatkowe i składki ZUS.

**[Otwórz aplikację →](https://kalkulatorfinansowy.app)**

## Funkcje

Aplikacja zawiera **29 modułów kalkulatorów**:

### Wynagrodzenia
- **Umowa o pracę** — brutto/netto z pełnym rozliczeniem ZUS i podatku
- **Umowa zlecenie** — kalkulator dla zleceniobiorcy i zleceniodawcy
- **Umowa o dzieło** — z uwzględnieniem kosztów uzyskania przychodu
- **Samozatrudnienie (B2B)** — porównanie form opodatkowania
- **Porównywarka B2B** — zestawienie UoP vs B2B
- **Rozliczenie z małżonkiem** — wspólne rozliczenie PIT

### Finanse i inwestycje
- **Lokata** — kalkulator oprocentowania lokat
- **Odsetki** — obliczanie odsetek ustawowych i umownych
- **Inflacja** — wpływ inflacji na siłę nabywczą
- **Siła nabywcza pieniądza** — porównanie wartości w czasie
- **Przelicznik walut** — z aktualnymi kursami NBP
- **Kursy walut** — tabela kursów NBP
- **Obligacje skarbowe** — 8 typów obligacji (ROR, DOR, TOS, COI, EDO, ROS, ROD, OTS)
- **Kalkulator IKE** — oszczędności na Indywidualnym Koncie Emerytalnym
- **Ulga podatkowa IKZE** — korzyści podatkowe z IKZE
- **Zysk z najmu** — kalkulator rentowności najmu

### Działalność gospodarcza
- **Faktura VAT** — generowanie i obliczanie faktur
- **Limit kasy fiskalnej** — sprawdzenie obowiązku ewidencji
- **Limit zwolnienia z VAT** — weryfikacja progu VAT
- **Składki ZUS za część miesiąca** — proporcjonalne składki
- **Działalność nierejestrowana** — kalkulator przychodów
- **Rzeczywisty koszt zakupu** — analiza kosztów z uwzględnieniem podatku

### Inne
- **Zasiłek chorobowy** — obliczanie wysokości zasiłku
- **Ekwiwalent za urlop** — kalkulator ekwiwalentu
- **Informacje o wynagrodzeniu** — statystyki płac
- **Terminy US/ZUS/PFRON** — kalendarz terminów

### Dodatkowe funkcje
- 🌙 **Tryb ciemny** — jasny, ciemny i automatyczny (zgodny z systemem)
- ♿ **Dostępność WCAG AA** — nawigacja klawiaturą, atrybuty ARIA, kontrast
- 📱 **Responsywność** — pełna obsługa mobile, tablet i desktop
- 📊 **Wykresy** — wizualizacja wyników z animacjami

## Technologie

- **Vue 3.5+** — framework frontendowy
- **TypeScript 5.9+** — typowanie statyczne
- **Quasar 2.18+** — komponenty UI
- **Pinia 2.3+** — zarządzanie stanem
- **Vite** — bundler i dev server
- **Vitest 4.x** — testy jednostkowe
- **Capacitor** — build natywny Android

## Dostępność

- **PWA** — [kalkulatorfinansowy.app](https://kalkulatorfinansowy.app)
- **Android** — [Google Play](https://play.google.com/store/apps/details?id=racyMind.kalkulator)

## Rozwój

### Wymagania
- Node.js 18+
- npm

### Instalacja
```bash
npm install
```

### Uruchomienie (tryb deweloperski)
```bash
npm start
```

### Testy
```bash
npm run test:unit
```

### Build produkcyjny (PWA)
```bash
npm run build
```

### Build Android
```bash
npm run build:android
```

### Linting i formatowanie
```bash
npm run lint
npm run format
```

## Licencja

Projekt open-source. Szczegóły w pliku [LICENSE.md](LICENSE.md).

## Autor

**Łukasz Socha** — [kontakt@lukasz-socha.pl](mailto:kontakt@lukasz-socha.pl)

Jeśli kalkulator jest dla Ciebie przydatny, możesz [wesprzeć projekt](https://zrzutka.pl/r4awyd) lub przekazać 1,5% podatku (KRS: 0000270809, cel szczególny: Socha, 15548).
