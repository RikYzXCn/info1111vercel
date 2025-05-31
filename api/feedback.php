<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


$supabaseUrl = getenv('NEXT_PUBLIC_SUPABASE_URL') ?: '';
$serviceKey  = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';
$table       = 'feedback';

if ($supabaseUrl === '' || $serviceKey === '') {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error'
    ]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
    exit;
}


$rawInput = file_get_contents('php://input');
$data     = json_decode($rawInput, true);
$message  = trim($data['message'] ?? '');

if ($message === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Feedback message is required'
    ]);
    exit;
}


$payload = json_encode(['message' => $message]);
$headers = implode("\r\n", [
    "Content-Type: application/json",
    "apikey: $serviceKey",
    "Authorization: Bearer $serviceKey",
    "Prefer: return=representation"
]) . "\r\n";

$opts = [
    'http' => [
        'method'        => 'POST',
        'header'        => $headers,
        'content'       => $payload,
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($opts);
$response = @file_get_contents("$supabaseUrl/rest/v1/$table", false, $context);


$httpCode = 0;
if (isset($http_response_header[0]) &&
    preg_match('#HTTP/\d\.\d\s+(\d+)#', $http_response_header[0], $m)
) {
    $httpCode = intval($m[1]);
}


header('Content-Type: application/json');
if ($response !== false && $httpCode >= 200 && $httpCode < 300) {

    echo json_encode(['success' => true]);
} else {
    http_response_code($httpCode ?: 500);
    echo json_encode([
        'success' => false,
        'message' => "Submission failed (HTTP $httpCode)"
    ]);
}