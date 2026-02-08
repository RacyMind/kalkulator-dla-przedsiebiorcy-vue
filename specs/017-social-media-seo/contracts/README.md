# Contracts: Social Media & SEO

Ten feature nie wprowadza nowych API ani endpointów. Wszystkie zmiany dotyczą warstwy prezentacyjnej (HTML meta tagi, Vue komponenty, grafika statyczna).

Zewnętrzne API używane przez share buttons:

- **Facebook Sharer**: `https://www.facebook.com/sharer/sharer.php?u={url}`
- **LinkedIn Share**: `https://www.linkedin.com/shareArticle?mini=true&url={url}`
- **X Intent**: `https://x.com/intent/tweet?url={url}&text={text}&hashtags={hashtags}`

Żadne z tych API nie wymaga klucza ani autoryzacji.
