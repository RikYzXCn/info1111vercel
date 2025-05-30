<?php
// api/response.php

function jsonResponse(array $body, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($body);
    exit;
}

function successResponse(): void {
    jsonResponse(['success' => true], 200);
}

function errorResponse(string $message, int $status = 400): void {
    jsonResponse(['success' => false, 'message' => $message], $status);
}