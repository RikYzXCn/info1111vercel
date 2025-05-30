<?php
// api/config.php

function getConfig(): array {
    $url        = getenv('NEXT_PUBLIC_SUPABASE_URL') ?: '';
    $serviceKey = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';
    if ($url === '' || $serviceKey === '') {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Server configuration error'
        ]);
        exit;
    }
    return [
        'url'   => $url,
        'key'   => $serviceKey,
        'table' => 'feedback'
    ];
}