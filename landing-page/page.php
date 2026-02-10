<?php
$slug = $_GET['slug'] ?? '';
$slug = preg_replace('/[^a-z0-9\-]/', '', $slug);

$pageFile = __DIR__ . '/_pages/' . $slug . '.php';

if (!$slug || !file_exists($pageFile)) {
    http_response_code(404);
    echo '<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>404</title></head><body><h1>Strona nie znaleziona</h1><p><a href="/">Wróć na stronę główną</a></p></body></html>';
    exit;
}

$page = require $pageFile;
$basePath = '';

require __DIR__ . '/_includes/layout.php';
