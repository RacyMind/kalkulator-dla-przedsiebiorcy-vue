import {MenuItem} from 'components/partials/menu/interfaces/MenuItem'

export default {
  app: [
    {
      caption: 'Pokazuje historię zmian w aplikacji',
      className: 'c-changeLogs',
      link: '/historia-zmian',
      title: 'Historia zmian',
    } as MenuItem,
    {
      caption: 'Formularz do zgłaszania błędów lub pomysłów na nowe funkcje',
      className: 'c-contact',
      link: '/kontakt',
      title: 'Formularz kontaktowy',
    } as MenuItem,
    {
      caption: '',
      className: 'c-aboutApp',
      link: 'https://kalkulatorfinansowy.app',
      title: 'O aplikacji',
    } as MenuItem,
    {
      caption: '@kalkulator.finansowy',
      className: 'c-aboutApp',
      link: 'https://www.facebook.com/kalkulator.finansowy',
      title: 'Polub na Facebooku',
    } as MenuItem,
  ],
  business: [
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy samozatrudnieniu',
      className: 'c-selfEmployment',
      link: '/samozatrudnienie',
      title: 'Samozatrudnienie',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy działalności niezarejestrowanej',
      className: 'c-unregisteredCompany',
      link: '/dzialalnosc-niezarejestrowana',
      title: 'Działalność niezarejestrowana',
    } as MenuItem,
    {
      caption: 'Moduł przelicza kwoty z netto na brutto i z brutto na netto',
      className: 'c-invoice',
      link: '/faktura-vat',
      title: 'Faktura VAT',
    } as MenuItem,
    {
      caption: 'Moduł oblicza kwotę obrotu, której przekroczenie powoduje utratę prawa do zwolnienia z ewidencjonowania',
      className: 'c-cashRegisterLimit',
      link: '/limit-obrotu-dla-kasy-fiskalnej',
      title: 'Limit zwolnienia z ewidencjonowania w kasie fiskalnej',
    } as MenuItem,
    {
      caption: 'Moduł oblicza kwotę przychodu, którego przekroczenie powoduje utratę prawa do zwolnienia z VAT',
      className: 'c-vatLimit',
      link: '/limit-zwolnienia-z-vat',
      title: 'Limit zwolnienia z VAT',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składki ZUS dla przedsiębiorców za część miesiąca',
      className: 'c-partialZusContributions',
      link: '/skladki-zus-za-czesc-miesiaca',
      title: 'Składki ZUS za część miesiąca',
    } as MenuItem,
  ],
  currencies: [
    {
      caption: 'Moduł pokazuje kursy walut',
      className: 'c-exchangeRates',
      link: '/kursy-walut',
      title: 'Kursy walut',
    } as MenuItem,
    {
      caption: 'Moduł służy do przeliczania jednej waluty na drugą',
      className: 'c-currencyConverter',
      link: '/przelicznik-walut',
      title: 'Przelicznik walut',
    } as MenuItem,
  ],
  informator: [
    {
      caption: 'Moduł pokazuje wykres z inflacją w Polsce',
      className: 'c-informator',
      link: '/inflacja',
      title: 'Inflacja',
    } as MenuItem,
    {
      caption: 'Moduł pokazuje wykres z siła nabywczą pieniądza w Polsce',
      className: 'c-informator',
      link: '/sila-nabywcza-pieniadza',
      title: 'Siła nabywcza pieniądza',
    } as MenuItem,
    {
      caption: 'Moduł pokazuje informacje o wynagrodzeniu w Polsce',
      className: 'c-informator',
      link: '/informacje-o-wynagrodzeniu',
      title: 'Informacje o wynagrodzeniu',
    } as MenuItem,
    {
      caption: 'Moduł pokazuje istotne terminy w US, ZUS i PFRON',
      className: 'c-informator',
      link: '/terminy-w-us-zus-pfron',
      title: 'Terminy w US, ZUS i PFRON',
    } as MenuItem,
  ],
  percentage: [
    {
      caption: 'Moduł oblicza zysk z lokaty',
      className: 'c-investment',
      link: '/lokata',
      title: 'Lokata',
    } as MenuItem,
    {
      caption: 'Moduł oblicza odsetki za każdy dzień',
      className: 'c-interest',
      link: '/odsetki',
      title: 'Odsetki',
    } as MenuItem,
  ],
  work: [
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o pracę',
      className: 'c-contractOfEmployment',
      link: '/umowa-o-prace',
      title: 'Umowa o pracę',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie zlecenie',
      className: 'c-contractOfMandate',
      link: '/umowa-zlecenie',
      title: 'Umowa zlecenie',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o dzieło',
      className: 'c-contractWork',
      link: '/umowa-o-dzielo',
      title: 'Umowa o dzieło',
    } as MenuItem,
/*    {
      title: 'Rozliczenie z małżonkiem',
      caption: 'Moduł umożliwia obliczenie podatku dochodowego przy wspólnym rozliczeniu małżonków',
      className: 'c-work',
      link: '/rozliczenie-z-malzonkiem',
    } as MenuItem,*/
    {
      caption: 'Moduł oblicza wysokość zasiłku chorobowego',
      className: 'c-sickPay',
      link: '/zasilek-chorobowy',
      title: 'Zasiłek chorobowy',
    } as MenuItem,
  ],
}
