<?php
header('Access-Control-Allow-Origin: *');

$url = 'inflation-stats.csv';
$year = 2016;
$presentationMode = 'Analogiczny miesiąc poprzedniego roku = 100';
if (!empty($_GET['year'])) {
    $year = (int)$_GET['year'];
}
if (!empty($_GET['mode']) && $_GET['mode'] == 'lastMonth') {
    $presentationMode = 'Poprzedni miesiąc = 100';
}

$csv = explode("\n", file_get_contents($url));
$csv = str_replace(',', '.', $csv);

$index = str_getcsv(array_shift($csv), ';');

$json = array_map(
    function ($line) use ($index) {
        return array_combine($index, str_getcsv($line, ';'));
    }, $csv);
$json = array_filter($json,
    function ($item) use ($presentationMode, $year) {
        if ($item['Wartość'] && $item['Rok'] >= $year && $item['Sposób prezentacji'] ===  $presentationMode) {
            return true;
        }
        return false;
    });
$json = array_map(
    function ($item) {
        $value = (double)$item['Wartość'] - 100;
        $value = ''.round($value, 1);

        $result = [
            'wartosc' => $value,
            'rok' => (int)$item['Rok'],
            'miesiac' => (int)$item['Miesiąc'],
        ];

        return $result;
    }, $json);

// Output JSON
header("Content-Type: application/json; charset=utf-8");
echo json_encode(array_values($json));