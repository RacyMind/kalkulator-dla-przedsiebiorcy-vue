import {MenuItem} from 'components/partials/menu/interfaces/MenuItem'
import {Platform} from 'quasar'

const appMenuItems: MenuItem[] = []

if(Platform.is.mobile && !Platform.is.nativeMobile	 && Platform.is.android) {
  appMenuItems.push(
    {
      caption: 'Pobierz natywną aplikację na swoje urządzenie',
      className: 'c-app',
      link: 'https://play.google.com/store/apps/details?id=racyMind.kalkulator',
      title: 'Pobierz w Google Play',
    },
  )
}
if(Platform.is.nativeMobile	 && Platform.is.android) {
  appMenuItems.push(
    {
      title: 'Oceń w Google Play',
      caption: 'Pomóż w rozwoju aplikacji i oceń aplikację w Google Play',
      className: 'c-app',
      link: 'https://play.google.com/store/apps/details?id=racyMind.kalkulator',
    },
  )
}

appMenuItems.push(
    {
      caption: 'Pokazuje historię zmian w aplikacji',
      className: 'c-app',
      link: '/historia-zmian',
      title: 'Historia zmian',
    },
    {
      caption: '@kalkulator.finansowy',
      className: 'c-app',
      link: 'https://www.facebook.com/kalkulator.finansowy',
      title: 'Polub na Facebooku',
    },
    {
      caption: 'Formularz do zgłaszania błędów lub pomysłów na nowe funkcje',
      className: 'c-app',
      link: '/kontakt',
      title: 'Formularz kontaktowy',
    },
    {
      caption: '',
      className: 'c-app',
      link: '/polityka-prywatnosci',
      title: 'Polityka prywatności',
    },
    {
      caption: 'Repozytorium aplikacji',
      className: 'c-app',
      link: 'https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue',
      title: 'GitHub',
    },
)
export default {


  app: appMenuItems,
  business: [
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy samozatrudnieniu',
      className: 'c-business',
      link: '/samozatrudnienie',
      title: 'Samozatrudnienie (B2B)',
    } as MenuItem,
    {
      caption: 'Moduł pokazuje różnice pomiędzy skalą podatkową, podatkiem liniowym, a podatkiem zryczałtowanym',
      className: 'c-business',
      link: '/porownywarka-b2b',
      title: 'Porównywarka B2B',
    } as MenuItem,
    {
      title: 'Rozliczenie z małżonkiem',
      caption: 'Moduł umożliwia obliczenie podatku dochodowego przy wspólnym rozliczeniu małżonków',
      className: 'c-business',
      link: '/rozliczenie-z-malzonkiem',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy działalności niezarejestrowanej',
      className: 'c-business',
      link: '/dzialalnosc-niezarejestrowana',
      title: 'Działalność niezarejestrowana',
    } as MenuItem,
    {
      caption: 'Moduł przelicza kwoty z netto na brutto i z brutto na netto',
      className: 'c-business',
      link: '/faktura-vat',
      title: 'Faktura VAT',
    } as MenuItem,
    {
      caption: 'Moduł pokazuje realne oszczędności przy zakupie produktu lub usługi na firmę',
      className: 'c-business',
      link: '/rzeczywisty-koszt-zakupu',
      title: 'Rzeczywisty koszt zakupu',
    } as MenuItem,
    {
      caption: 'Moduł oblicza kwotę obrotu, której przekroczenie powoduje utratę prawa do zwolnienia z ewidencjonowania',
      className: 'c-business',
      link: '/limit-obrotu-dla-kasy-fiskalnej',
      title: 'Limit zwolnienia z ewidencjonowania w kasie fiskalnej',
    } as MenuItem,
    {
      caption: 'Moduł oblicza kwotę przychodu, którego przekroczenie powoduje utratę prawa do zwolnienia z VAT',
      className: 'c-business',
      link: '/limit-zwolnienia-z-vat',
      title: 'Limit zwolnienia z VAT',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składki ZUS dla przedsiębiorców za część miesiąca',
      className: 'c-business',
      link: '/skladki-zus-za-czesc-miesiaca',
      title: 'Składki ZUS za część miesiąca',
    } as MenuItem,
  ],
  currencies: [
    {
      caption: 'Moduł pokazuje kursy walut',
      className: 'c-currencies',
      link: '/kursy-walut',
      title: 'Kursy walut',
    } as MenuItem,
    {
      caption: 'Moduł służy do przeliczania jednej waluty na drugą',
      className: 'c-currencies',
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
      className: 'c-percentage',
      link: '/lokata',
      title: 'Lokata',
    } as MenuItem,
    {
      caption: 'Moduł oblicza odsetki za każdy dzień',
      className: 'c-percentage',
      link: '/odsetki',
      title: 'Odsetki',
    } as MenuItem,
    {
      caption: 'Moduł oblicza zysk z obligacji skarbowych',
      className: 'c-percentage',
      link: '/obligacje-skarbowe',
      title: 'Obligacje skarbowe',
    } as MenuItem,
  ],
  work: [
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o pracę',
      className: 'c-work',
      link: '/umowa-o-prace',
      title: 'Umowa o pracę',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie zlecenie',
      className: 'c-work',
      link: '/umowa-zlecenie',
      title: 'Umowa zlecenie',
    } as MenuItem,
    {
      caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o dzieło',
      className: 'c-work',
      link: '/umowa-o-dzielo',
      title: 'Umowa o dzieło',
    } as MenuItem,
    {
      title: 'Rozliczenie z małżonkiem',
      caption: 'Moduł umożliwia obliczenie podatku dochodowego przy wspólnym rozliczeniu małżonków',
      className: 'c-work',
      link: '/rozliczenie-z-malzonkiem',
    } as MenuItem,
    {
      caption: 'Moduł oblicza wysokość zasiłku chorobowego',
      className: 'c-work',
      link: '/zasilek-chorobowy',
      title: 'Zasiłek chorobowy',
    } as MenuItem,
    {
      caption: 'Moduł oblicza ekwiwalent za niewykorzystany urlop',
      className: 'c-work',
      link: '/ekwiwalent-za-niewykorzystany-urlop',
      title: 'Ekwiwalent za niewykorzystany urlop',
    } as MenuItem,
  ],
}
