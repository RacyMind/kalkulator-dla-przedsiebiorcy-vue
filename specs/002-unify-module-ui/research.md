# Research: Ujednolicenie UI formularzy (pola + przyciski)

## Cel

Ustalić spójny wzorzec UI dla pól formularzy i przycisków akcji w „starych” modułach, tak aby były zgodne z najnowszym stylem aplikacji, bez zmiany logiki obliczeń.

## Obserwacje (stan obecny)

- Moduły po `001-unify-module-ui` mają wspólny wrapper strony (`ModulePageLayout`), ale formularze nadal różnią się:
  - układem (czasem `row justify-between`, czasem pojedyncza kolumna),
  - zachowaniem walidacji (`lazy-rules` vs brak, `hide-bottom-space` vs brak),
  - stylem przycisków (rozmiar, pełna szerokość, loading/disable).
- `src/components/contractWork/` jest najbardziej aktualnym wzorcem formularza i używa spójnych komponentów z `src/components/partials/form/*`.

## Decyzje

- **Decision**: Referencyjny wzorzec formularza i przycisków
  - **Rationale**: `src/components/contractWork/components/Form.vue` pokazuje najbardziej aktualną strukturę, spójne sekcje oraz walidację.
  - **Alternatives considered**: utrzymanie per-moduł (brak spójności UX).

- **Decision**: Zachowanie istniejących reguł walidacji i komunikatów
  - **Rationale**: Użytkownik oczekuje przewidywalnych komunikatów; zmiana walidacji mogłaby zostać odebrana jako regres.

- **Decision**: Brak zmian API
  - **Rationale**: Feature dotyczy UI. Moduł Kontakt korzysta z istniejącego endpointu `contact.php` i nie jest zmieniany kontrakt.

## Ryzyka

- **Ryzyko**: Zmiana struktury formularza wpłynie na testy UI (jeśli istnieją) lub zachowanie scrollowania do wyników.
  - **Mitigacja**: Zachować emitowane eventy (`save`, `scroll`, `submit`) i nie zmieniać logiki obliczeń.

- **Ryzyko**: Niespójność walidacji w starszych formularzach
  - **Mitigacja**: Ujednolicić sposób uruchamiania walidacji (np. ondemand/lazy) w ramach istniejących komponentów.

## Zakres modułów (źródła)

- `src/pages/Invoice.vue`, `src/components/invoice/Form.vue`
- `src/pages/VatLimit.vue`, `src/components/vatLimit/Form.vue`
- `src/pages/Investment.vue`, `src/components/investment/Form.vue`
- `src/pages/Interest.vue`, `src/components/interest/Form.vue`
- `src/pages/ExchangeRates.vue`
- `src/pages/Currency.vue`
- `src/pages/CurrencyConverter.vue`, `src/components/currencyConverter/Form.vue`
- `src/pages/CashRegisterLimit.vue`, `src/components/cashRegisterLimit/Form.vue`
- `src/pages/Contact.vue`, `src/components/contact/Form.vue`
- `src/pages/ChangeLogs.vue`, `src/components/changeLogs/ChangeLog.vue`
