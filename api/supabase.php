<?php
function insertFeedback(string $url, string $key, string $table, string $message): void {
    $payload = json_encode(['message' => $message]);
    $headers = implode("\r\n", [
        "Content-Type: application/json",
        "apikey: $key",
        "Authorization: Bearer $key",
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
    $response = @file_get_contents("$url/rest/v1/$table", false, $context);

    $httpCode = 0;
    if (isset($http_response_header[0]) &&
        preg_match('#HTTP/\d\.\d\s+(\d+)#', $http_response_header[0], $m)
    ) {
        $httpCode = (int)$m[1];
    }

    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        errorResponse("Submission failed (HTTP $httpCode)", $httpCode ?: 500);
    }
}