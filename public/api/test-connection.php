<?php
// 000webhost Connection Test Script
// This file helps test if your 000webhost setup is working correctly

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendTestResponse($success, $data = null, $error = null) {
    $response = [
        'success' => $success,
        'timestamp' => date('Y-m-d H:i:s'),
        'server' => '000webhost',
        'php_version' => phpversion(),
        'data' => $data,
        'error' => $error
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

try {
    // Test basic PHP functionality
    $tests = [
        'php_version' => phpversion(),
        'json_enabled' => extension_loaded('json'),
        'file_operations' => is_writable('.'),
        'current_directory' => getcwd(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'timestamp' => date('Y-m-d H:i:s'),
        'timezone' => date_default_timezone_get()
    ];
    
    // Test file operations
    $testFile = 'test_write.txt';
    $writeTest = file_put_contents($testFile, 'Test write operation');
    $tests['write_test'] = $writeTest !== false;
    
    if ($writeTest !== false) {
        $readTest = file_get_contents($testFile);
        $tests['read_test'] = $readTest === 'Test write operation';
        unlink($testFile); // Clean up
    } else {
        $tests['read_test'] = false;
    }
    
    // Test JSON operations
    $jsonTest = ['test' => 'data', 'number' => 123];
    $jsonEncoded = json_encode($jsonTest);
    $jsonDecoded = json_decode($jsonEncoded, true);
    $tests['json_test'] = $jsonDecoded['test'] === 'data';
    
    // Check if data.json exists
    $tests['data_file_exists'] = file_exists('data.json');
    $tests['data_file_readable'] = is_readable('data.json');
    $tests['data_file_writable'] = is_writable('data.json');
    
    // Check backups directory
    $tests['backup_dir_exists'] = is_dir('backups');
    $tests['backup_dir_writable'] = is_writable('backups');
    
    sendTestResponse(true, $tests);
    
} catch (Exception $e) {
    sendTestResponse(false, null, $e->getMessage());
}
?>