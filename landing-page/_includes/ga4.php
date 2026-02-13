<?php
$gaMeasurementId = getenv('GA_MEASUREMENT_ID') ?: 'G-9P7ZTHLC47';
$escapedGaMeasurementId = htmlspecialchars($gaMeasurementId, ENT_QUOTES, 'UTF-8');
?>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=<?= $escapedGaMeasurementId ?>"></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    window.gtag = gtag
    gtag('js', new Date())

    gtag('config', '<?= $escapedGaMeasurementId ?>')
  </script>
