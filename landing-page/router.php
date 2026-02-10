<?php
// Router for PHP built-in server (php -S localhost:8000 router.php)
// Simulates .htaccess rewrite rules for local development

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve existing files directly
$filePath = __DIR__ . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

// Homepage
if ($uri === '/' || $uri === '/index.php') {
    require __DIR__ . '/index.php';
    return;
}

// Subpage routing: /kalkulator-b2b or /kalkulator-b2b/
$slug = trim($uri, '/');
if (preg_match('/^[a-z0-9\-]+$/', $slug)) {
    $_GET['slug'] = $slug;
    require __DIR__ . '/page.php';
    return;
}

// 404
http_response_code(404);
echo '404 Not Found';
