<?php

// 1. Configure paths for Vercel Serverless (read-only filesystem, writable /tmp)
$storagePath = '/tmp/storage';
putenv("LARAVEL_STORAGE_PATH={$storagePath}");
$_ENV['LARAVEL_STORAGE_PATH'] = $storagePath;

putenv("VIEW_COMPILED_PATH={$storagePath}/framework/views");
$_ENV['VIEW_COMPILED_PATH'] = "{$storagePath}/framework/views";

// 2. Ensure essential storage directories exist in /tmp
$dirs = [
    $storagePath . '/app/public',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/framework/views',
    $storagePath . '/logs',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// 3. Forward Vercel request to Laravel front controller
require __DIR__ . '/../public/index.php';
