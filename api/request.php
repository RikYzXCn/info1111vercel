<?php
// api/request.php

function parseJsonRequest(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        errorResponse('Invalid JSON', 400);
    }
    return $data;
}