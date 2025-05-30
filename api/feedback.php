<?php
// api/feedback.php
// 仅作后端：接收 JSON POST，调用 Supabase REST API 插入 feedback 表

// 1. 读取环境变量
$supabaseUrl = getenv('NEXT_PUBLIC_SUPABASE_URL') ?: '';
$serviceKey  = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';
$table       = 'feedback';

// 2. 检查配置
if (empty($supabaseUrl) || empty($serviceKey)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error'
    ]);
    exit;
}

// 3. 仅允许 POST 方法
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

// 4. 解析 JSON 请求体
$input = file_get_contents('php://input');
$data  = json_decode($input, true);
$message = trim($data['message'] ?? '');

// 5. 验证参数
if ($message === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Feedback message is required'
    ]);
    exit;
}

// 6. 构造 Supabase REST API 请求
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

// 7. 解析 HTTP 状态码
$httpCode = 0;
if (isset($http_response_header[0]) &&
    preg_match('#HTTP/\d\.\d\s+(\d+)#', $http_response_header[0], $m)
) {
    $httpCode = intval($m[1]);
}

// 8. 返回 JSON 结果
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