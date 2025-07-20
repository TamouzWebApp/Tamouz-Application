<?php
// 000webhost compatibility
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$DATA_FILE = 'data.json';
$SECURITY_TOKEN = 'ScoutPlus(WebApp)'; // Must match the token in JavaScript

// 000webhost specific settings
$MAX_EXECUTION_TIME = 25; // 000webhost has 30 second limit
set_time_limit($MAX_EXECUTION_TIME);

/**
 * Send JSON response
 */
function sendResponse($success, $data = null, $error = null) {
    $response = [
        'success' => $success,
        'timestamp' => date('Y-m-d H:i:s'),
        'data' => $data,
        'error' => $error
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Validate security token
 */
function validateToken($token) {
    global $SECURITY_TOKEN;
    return $token === $SECURITY_TOKEN;
}

/**
 * Read and validate JSON file
 */
function readDataFile() {
    global $DATA_FILE;
    
    if (!file_exists($DATA_FILE)) {
        return [
            'events' => [],
            'lastUpdated' => date('Y-m-d H:i:s')
        ];
    }
    
    $content = file_get_contents($DATA_FILE);
    if ($content === false) {
        throw new Exception('Failed to read data file');
    }
    
    // Clean any BOM or extra whitespace
    $content = trim($content);
    if (substr($content, 0, 3) === "\xEF\xBB\xBF") {
        $content = substr($content, 3);
    }
    
    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON format: ' . json_last_error_msg());
    }
    
    // Ensure required structure
    if (!isset($data['events'])) {
        $data['events'] = [];
    }
    
    return $data;
}

try {
    // Only GET requests allowed for read.php
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendResponse(false, null, 'Only GET requests allowed');
    }
    
    // Optional token validation for read operations
    $token = $_GET['token'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
    if ($token && !validateToken($token)) {
        sendResponse(false, null, 'Invalid security token');
    }
    
    // Read data
    $data = readDataFile();
    
    // Add metadata
    $data['totalEvents'] = count($data['events']);
    $data['readTime'] = date('Y-m-d H:i:s');
    
    sendResponse(true, $data);
    
} catch (Exception $e) {
    error_log("Read API Error: " . $e->getMessage());
    sendResponse(false, null, $e->getMessage());
}
?>