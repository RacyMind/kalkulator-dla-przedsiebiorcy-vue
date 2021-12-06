import {MenuItem} from 'components/partials/menu/interfaces/MenuItem'

export default {
  business: [
    {
      title: 'Samozatrudnienie',
      caption: 'Moduł oblicza składowe wynagrodzenia przy samozatrudnieniu',
      className: 'c-selfEmployment',
      link: '/samozatrudnienie',
    } as MenuItem,
    {
      title: 'Działalność niezarejestrowana',
      caption: 'Moduł oblicza składowe wynagrodzenia przy działalności niezarejestrowanej',
      className: 'c-unregisteredCompany',
      link: '/dzialalnosc-niezarejestrowana',
    } as MenuItem,
    {
      title: 'Faktura VAT',
      caption: 'Moduł przelicza kwoty z netto na brutto i z brutto na netto',
      className: 'c-invoice',
      link: '/faktura-vat',
    } as MenuItem,
    {
      title: 'Limit zwolnienia z ewidencjonowania w kasie fiskalnej',
      caption: 'Moduł oblicza kwotę obrotu, której przekroczenie powoduje utratę prawa do zwolnienia z ewidencjonowania',
      className: 'c-cashRegisterLimit',
      link: '/limit-obrotu-dla-kasy-fiskalnej',
    } as MenuItem,
    {
      title: 'Limit zwolnienia z VAT',
      caption: 'Moduł oblicza kwotę przychodu, którego przekroczenie powoduje utratę prawa do zwolnienia z VAT',
      className: 'c-vatLimit',
      link: '/limit-zwolnienia-z-vat',
    } as MenuItem,
    {
      title: 'Składki ZUS za część miesiąca',
      caption: 'Moduł oblicza składki ZUS dla przedsiębiorców za część miesiąca',
      className: 'c-partialZusContributions',
      link: '/skladki-zus-za-czesc-miesiaca',
    } as MenuItem,
  ],
  work: [
    {
      title: 'Umowa o pracę',
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o pracę',
      className: 'c-contractOfEmployment',
      link: '/umowa-o-prace',
    } as MenuItem,
    {
      title: 'Umowa zlecenie',
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie zlecenie',
      className: 'c-contractOfMandate',
      link: '/umowa-zlecenie',
    } as MenuItem,
    {
      title: 'Umowa o dzieło',
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o dzieło',
      className: 'c-contractWork',
      link: '/umowa-o-dzielo',
    } as MenuItem,
    {
      title: 'Rozliczenie z małżonkiem',
      caption: 'Moduł umożliwia obliczenie podatku dochodowego przy wspólnym rozliczeniu małżonków',
      className: 'c-work',
      link: '/rozliczenie-z-malzonkiem',
    } as MenuItem,
    {
      title: 'Zasiłek chorobowy',
      caption: 'Moduł oblicza wysokość zasiłku chorobowego',
      className: 'c-sickPay',
      link: '/zasilek-chorobowy',
    } as MenuItem,
  ],
  percentage: [
    {
      title: 'Lokata',
      caption: 'Moduł oblicza zysk z lokaty',
      className: 'c-investment',
      link: '/lokata',
    } as MenuItem,
    {
      title: 'Odsetki',
      caption: 'Moduł oblicza odsetki za każdy dzień',
      className: 'c-interest',
      link: '/odsetki',
    } as MenuItem,
  ],
  currencies: [
    {
      title: 'Kursy walut',
      caption: 'Moduł pokazuje kursy walut',
      className: 'c-exchangeRates',
      link: '/kursy-walut',
    } as MenuItem,
    {
      title: 'Przelicznik walut',
      caption: 'Moduł służy do przeliczania jednej waluty na drugą',
      className: 'c-currencyConverter',
      link: '/przelicznik-walut',
    } as MenuItem,
  ],
  app: [
    {
      title: 'Historia zmian',
      caption: 'Pokazuje historię zmian w aplikacji',
      className: 'c-changeLogs',
      link: '/historia-zmian',
    } as MenuItem,
    {
      title: 'Formularz kontaktowy',
      caption: 'Formularz do zgłaszania błędów lub pomysłów na nowe funkcje',
      className: 'c-contact',
      link: '/kontakt',
    } as MenuItem,
    {
      title: 'O aplikacji',
      caption: '',
      className: 'c-aboutApp',
      link: 'https://kalkulatorfinansowy.app',
    } as MenuItem,
    {
      title: 'Polub na Facebooku',
      caption: '@kalkulator.finansowy',
      className: 'c-aboutApp',
      link: 'https://www.facebook.com/kalkulator.finansowy',
    } as MenuItem,
  ],
  informator: [
    {
      title: 'Inflacja',
      caption: 'Moduł pokazuje wykres z inflacją w Polsce',
      className: 'c-informator',
      link: '/inflacja',
    } as MenuItem,
  ],
}
