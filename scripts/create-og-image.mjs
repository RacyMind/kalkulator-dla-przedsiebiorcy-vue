import sharp from 'sharp';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0D47A1"/>
      <stop offset="100%" stop-color="#1565C0"/>
    </linearGradient>
    <linearGradient id="iconbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#1565C0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- App icon (scaled from 512 to 80, positioned at 60,50) -->
  <g transform="translate(60,50) scale(0.15625)">
    <rect width="512" height="512" rx="96" ry="96" fill="url(#iconbg)"/>
    <rect x="248" y="0" width="16" height="512" fill="#0D47A1" opacity="0.3"/>
    <rect x="0" y="248" width="512" height="16" fill="#0D47A1" opacity="0.3"/>
    <rect x="96" y="121" width="64" height="14" rx="7" fill="#FFFFFF"/>
    <rect x="121" y="96" width="14" height="64" rx="7" fill="#FFFFFF"/>
    <text x="384" y="128" fill="#FFFFFF" font-family="Arial,sans-serif" font-weight="bold" font-size="64" text-anchor="middle" dominant-baseline="central">PIT</text>
    <text x="128" y="384" fill="#FFFFFF" font-family="Arial,sans-serif" font-weight="bold" font-size="64" text-anchor="middle" dominant-baseline="central">VAT</text>
    <circle cx="362" cy="362" r="16" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <circle cx="406" cy="406" r="16" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <rect x="352" y="381" width="80" height="6" rx="3" fill="#FFFFFF" transform="rotate(-45 384 384)"/>
  </g>

  <text x="60" y="200" font-family="Arial,sans-serif" font-size="56" font-weight="bold" fill="white">Kalkulator finansowy</text>
  <text x="60" y="265" font-family="Arial,sans-serif" font-size="28" fill="#90CAF9">Twój darmowy kalkulator wynagrodzeń i podatków</text>
  <text x="60" y="340" font-family="Arial,sans-serif" font-size="22" fill="#BBDEFB">Oblicz wynagrodzenie netto, składki ZUS, podatek PIT i VAT.</text>
  <text x="60" y="375" font-family="Arial,sans-serif" font-size="22" fill="#BBDEFB">Porównaj formy opodatkowania B2B. Aktualne stawki 2026.</text>
  <rect x="60" y="420" width="320" height="56" rx="12" fill="white"/>
  <text x="110" y="457" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="#1565C0">Przejdź do kalkulatora</text>
  <text x="60" y="560" font-family="Arial,sans-serif" font-size="18" fill="#64B5F6">kalkulatorfinansowy.app · 20+ kalkulatorów · Darmowa · Od 2013 roku</text>
  <text x="60" y="590" font-family="Arial,sans-serif" font-size="16" fill="#42A5F5" opacity="0.7">© 2013–2026 Łukasz Socha</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('landing-page/images/og-image.png');
console.log('OG image created (1200x630)');
