# Data Model: Ujednolicenie UI formularzy (pola + przyciski)

## Cel

Opisać model danych na poziomie UI (pola wejściowe, akcje, stany) dla modułów objętych ujednoliceniem formularzy i przycisków.

## Encje

### 1) Pole formularza

- **Opis**: Element UI przyjmujący dane od użytkownika.
- **Atrybuty (UI)**:
  - `label` (string)
  - `required` (boolean)
  - `value` (string | number | Date | null)
  - `rules` (lista reguł walidacji)
  - `error` / `errorMessage` (stan walidacji)

### 2) Przycisk akcji

- **Opis**: Element uruchamiający obliczenie/wysłanie/akcję.
- **Atrybuty (UI)**:
  - `label` (string)
  - `disabled` (boolean)
  - `loading` (boolean)
  - `fullWidth` (boolean)

### 3) Formularz

- **Opis**: Zbiór pól + przycisk akcji + walidacja.
- **Atrybuty (UI)**:
  - `layout` (np. 1 kolumna mobile, 2 kolumny desktop)
  - `submitAction` (oblicz/wyślij)
  - `validationMode` (uruchamianie walidacji w ramach istniejących komponentów)

## Dane wejściowe (przykłady modułów)

- **Invoice** (`components/invoice/Form.vue`)
  - `amount`, `amountType`, `taxRate`

- **VatLimit** (`components/vatLimit/Form.vue`)
  - `startDate`

- **CashRegisterLimit** (`components/cashRegisterLimit/Form.vue`)
  - `startDate`

- **Contact** (`components/contact/Form.vue`)
  - `email`, `name`, `subject`, `message`
  - stan: `isSending`

## Wyniki / reakcje

- Moduły kalkulacyjne: wynik prezentowany jak dotychczas (podsumowanie/statystyki).
- Kontakt: powiadomienie o sukcesie/błędzie jak dotychczas.
- Historia zmian: rozszerzenie listy (`showAll`).
