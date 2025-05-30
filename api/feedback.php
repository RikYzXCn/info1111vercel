<?php
// api/feedback.php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/request.php';
require_once __DIR__ . '/validation.php';
require_once __DIR__ . '/supabase.php';

// 只允许 POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method Not Allowed', 405);
}

// 1) 读取配置
$config  = getConfig();

// 2) 解析并校验请求
$data    = parseJsonRequest();
$message = validateMessage($data);

// 3) 插入 Supabase
insertFeedback($config['url'], $config['key'], $config['table'], $message);

// 4) 返回成功
successResponse();