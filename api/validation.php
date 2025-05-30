<?php
// api/validation.php

function validateMessage(array $data): string {
    $msg = trim((string)($data['message'] ?? ''));
    if ($msg === '') {
        errorResponse('Feedback message is required', 400);
    }
    return $msg;
}