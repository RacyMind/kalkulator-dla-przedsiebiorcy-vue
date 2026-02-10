import { MenuItem } from 'components/partials/menu/interfaces/MenuItem'
import { Platform } from 'quasar'

const appMenuItems: MenuItem[] = []

if (Platform.is.mobile && !Platform.is.nativeMobile && Platform.is.android) {
  appMenuItems.push({
    caption: 'Pobierz natywną aplikację na swoje urządzenie',
    className: 'c-app',
    link: 'https://play.google.com/store/apps/details?id=racyMind.kalkulator',
    title: 'Pobierz w Google Play',
  })
}
if (Platform.is.nativeMobile && Platform.is.android) {
  appMenuItems.push({
    title: 'Podoba Ci się? Oceń!',
    caption: 'Twoja opinia pomaga innym użytkownikom',
    className: 'c-app',
    link: 'https://play.google.com/store/apps/details?id=racyMind.kalkulator',
  })
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
  company: [
    {
      caption:
        'Oblicz wynagrodzenie netto, podatek i składki ZUS na działalności gospodarczej',
      className: 'c-company',
      link: '/samozatrudnienie',
      title: 'Samozatrudnienie (B2B)',
    } as MenuItem,
    {
      caption:
        'Porównaj formy opodatkowania i wybierz najkorzystniejszą dla siebie',
      className: 'c-company',
      link: '/porownywarka-b2b',
      title: 'Porównywarka B2B',
    } as MenuItem,
    {
      caption: 'Sprawdź ile zarobisz prowadząc działalność bez rejestracji',
      className: 'c-company',
      link: '/dzialalnosc-niezarejestrowana',
      title: 'Działalność niezarejestrowana',
    } as MenuItem,
    {
      caption: 'Sprawdź ile naprawdę zaoszczędzisz kupując na firmę',
      className: 'c-company',
      link: '/rzeczywisty-koszt-zakupu',
      title: 'Rzeczywisty koszt zakupu',
    } as MenuItem,
    {
      caption: 'Sprawdź czy musisz już posiadać kasę fiskalną',
      className: 'c-company',
      link: '/limit-obrotu-dla-kasy-fiskalnej',
      title: 'Limit zwolnienia z ewidencjonowania w kasie fiskalnej',
    } as MenuItem,
    {
      caption: 'Sprawdź czy przekroczyłeś limit zwolnienia z VAT',
      className: 'c-company',
      link: '/limit-zwolnienia-z-vat',
      title: 'Limit zwolnienia z VAT',
    } as MenuItem,
    {
      caption:
        'Oblicz proporcjonalne składki ZUS gdy rozpoczynasz lub kończysz działalność w trakcie miesiąca',
      className: 'c-company',
      link: '/skladki-zus-za-czesc-miesiaca',
      title: 'Składki ZUS za część miesiąca',
    } as MenuItem,
  ],
  taxes: [
    {
      caption: 'Przelicz kwoty netto ↔ brutto z uwzględnieniem stawki VAT',
      className: 'c-taxes',
      link: '/faktura-vat',
      title: 'Faktura VAT',
    } as MenuItem,
    {
      title: 'Rozliczenie z małżonkiem',
      caption: 'Sprawdź czy wspólne rozliczenie PIT z małżonkiem się opłaca',
      className: 'c-taxes',
      link: '/rozliczenie-z-malzonkiem',
    } as MenuItem,
  ],
  currencies: [
    {
      caption: 'Aktualne kursy walut NBP',
      className: 'c-currencies',
      link: '/kursy-walut',
      title: 'Kursy walut',
    } as MenuItem,
    {
      caption: 'Szybko przelicz dowolną kwotę między walutami',
      className: 'c-currencies',
      link: '/przelicznik-walut',
      title: 'Przelicznik walut',
    } as MenuItem,
  ],
  info: [
    {
      caption: 'Sprawdź jak zmieniała się inflacja w Polsce na przestrzeni lat',
      className: 'c-info',
      link: '/inflacja',
      title: 'Inflacja',
    } as MenuItem,
    {
      caption: 'Zobacz ile warte są Twoje pieniądze po uwzględnieniu inflacji',
      className: 'c-info',
      link: '/sila-nabywcza-pieniadza',
      title: 'Siła nabywcza pieniądza',
    } as MenuItem,
    {
      caption: 'Minimalne wynagrodzenie i stawki godzinowe w Polsce',
      className: 'c-info',
      link: '/informacje-o-wynagrodzeniu',
      title: 'Informacje o wynagrodzeniu',
    } as MenuItem,
    {
      caption: 'Nie przegap ważnych terminów podatkowych i składkowych',
      className: 'c-info',
      link: '/terminy-w-us-zus-pfron',
      title: 'Terminy w US, ZUS i PFRON',
    } as MenuItem,
  ],
  savings: [
    {
      caption: 'Oblicz ile zaoszczędzisz na podatku dzięki wpłatom na IKZE',
      className: 'c-savings',
      link: '/ulga-podatkowa-ikze',
      title: 'Ulga podatkowa IKZE',
    } as MenuItem,
    {
      caption:
        'Symuluj długoterminowe oszczędności na IKE z korzyścią podatkową',
      className: 'c-savings',
      link: '/kalkulator-ike',
      title: 'Kalkulator IKE',
    } as MenuItem,
    {
      caption: 'Oblicz zysk z lokaty bankowej po odliczeniu podatku Belki',
      className: 'c-savings',
      link: '/lokata',
      title: 'Lokata',
    } as MenuItem,
    {
      caption: 'Oblicz odsetki ustawowe, podatkowe lub własne za dowolny okres',
      className: 'c-savings',
      link: '/odsetki',
      title: 'Odsetki',
    } as MenuItem,
    {
      caption: 'Porównaj zysk z różnych rodzajów obligacji skarbowych',
      className: 'c-savings',
      link: '/obligacje-skarbowe',
      title: 'Obligacje skarbowe',
    } as MenuItem,
    {
      caption:
        'Oblicz zysk z najmu prywatnego z uwzględnieniem ryczałtu i kosztów',
      className: 'c-savings',
      link: '/zysk-z-najmu',
      title: 'Zysk z najmu',
    } as MenuItem,
  ],
  work: [
    {
      caption: 'Oblicz wynagrodzenie netto, składki ZUS i koszty pracodawcy',
      className: 'c-work',
      link: '/umowa-o-prace',
      title: 'Umowa o pracę',
    } as MenuItem,
    {
      caption: 'Oblicz wynagrodzenie netto i składki przy umowie zlecenie',
      className: 'c-work',
      link: '/umowa-zlecenie',
      title: 'Umowa zlecenie',
    } as MenuItem,
    {
      caption:
        'Oblicz wynagrodzenie netto z uwzględnieniem kosztów uzyskania przychodu',
      className: 'c-work',
      link: '/umowa-o-dzielo',
      title: 'Umowa o dzieło',
    } as MenuItem,
    {
      caption: 'Sprawdź ile wyniesie Twój zasiłek chorobowy',
      className: 'c-work',
      link: '/zasilek-chorobowy',
      title: 'Zasiłek chorobowy',
    } as MenuItem,
    {
      caption: 'Oblicz ile dostaniesz za niewykorzystane dni urlopu',
      className: 'c-work',
      link: '/ekwiwalent-za-niewykorzystany-urlop',
      title: 'Ekwiwalent za niewykorzystany urlop',
    } as MenuItem,
  ],
}
