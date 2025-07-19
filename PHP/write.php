<?php
// 000webhost compatibility
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$DATA_FILE = 'data.json';
$BACKUP_DIR = 'backups';
$SECURITY_TOKEN = 'ScoutPlus(WebApp)'; // Must match the token in JavaScript
$MAX_BACKUPS = 10;

// 000webhost specific settings
$MAX_EXECUTION_TIME = 25; // 000webhost has 30 second limit
set_time_limit($MAX_EXECUTION_TIME);

// Check if we have write permissions
if (!is_writable('.')) {
    sendResponse(false, null, 'Directory not writable. Please check file permissions.');
}

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
 * Create backup of current data
 */
function createBackup() {
    global $DATA_FILE, $BACKUP_DIR, $MAX_BACKUPS;
    
    if (!file_exists($DATA_FILE)) {
        return true; // No file to backup
    }
    
    // Create backup directory if it doesn't exist
    if (!is_dir($BACKUP_DIR)) {
        mkdir($BACKUP_DIR, 0755, true);
    }
    
    // Create backup filename with timestamp
    $backupFile = $BACKUP_DIR . '/data_backup_' . date('Y-m-d_H-i-s') . '.json';
    
    // Copy current file to backup
    if (!copy($DATA_FILE, $backupFile)) {
        throw new Exception('Failed to create backup');
    }
    
    // Clean old backups (keep only MAX_BACKUPS)
    $backups = glob($BACKUP_DIR . '/data_backup_*.json');
    if (count($backups) > $MAX_BACKUPS) {
        // Sort by modification time (oldest first)
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        
        // Remove oldest backups
        $toRemove = array_slice($backups, 0, count($backups) - $MAX_BACKUPS);
        foreach ($toRemove as $file) {
            unlink($file);
        }
    }
    
    return true;
}

/**
 * Read current data file
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
    
    return $data;
}

/**
 * Write data to file
 */
function writeDataFile($data) {
    global $DATA_FILE;
    
    // Add metadata
    $data['lastUpdated'] = date('Y-m-d H:i:s');
    
    // Convert to JSON with proper formatting
    $jsonData = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($jsonData === false) {
        throw new Exception('Failed to encode JSON: ' . json_last_error_msg());
    }
    
    // Write to temporary file first
    $tempFile = $DATA_FILE . '.tmp';
    if (file_put_contents($tempFile, $jsonData, LOCK_EX) === false) {
        throw new Exception('Failed to write temporary file');
    }
    
    // Atomic move to final location
    if (!rename($tempFile, $DATA_FILE)) {
        unlink($tempFile);
        throw new Exception('Failed to move temporary file');
    }
    
    return true;
}

/**
 * Validate event data
 */
function validateEventData($event) {
    $required = ['title', 'description', 'date', 'time', 'location', 'category', 'maxAttendees'];
    
    foreach ($required as $field) {
        if (!isset($event[$field]) || empty(trim($event[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Validate date format
    if (!DateTime::createFromFormat('Y-m-d', $event['date'])) {
        throw new Exception('Invalid date format. Use YYYY-MM-DD');
    }
    
    // Validate time format
    if (!DateTime::createFromFormat('H:i', $event['time'])) {
        throw new Exception('Invalid time format. Use HH:MM');
    }
    
    // Validate maxAttendees
    if (!is_numeric($event['maxAttendees']) || $event['maxAttendees'] < 1) {
        throw new Exception('maxAttendees must be a positive number');
    }
    
    return true;
}

try {
    // Only POST requests allowed for write.php
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, null, 'Only POST requests allowed');
    }
    
    // Get request body
    $input = file_get_contents('php://input');
    if (empty($input)) {
        sendResponse(false, null, 'Empty request body');
    }
    
    $requestData = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendResponse(false, null, 'Invalid JSON in request: ' . json_last_error_msg());
    }
    
    // Validate security token
    if (!isset($requestData['token']) || !validateToken($requestData['token'])) {
        sendResponse(false, null, 'Invalid or missing security token');
    }
    
    // Get operation type
    $operation = $requestData['operation'] ?? 'update';
    $newData = $requestData['data'] ?? null;
    
    if (!$newData) {
        sendResponse(false, null, 'Missing data in request');
    }
    
    // Create backup before making changes
    createBackup();
    
    // Read current data
    $currentData = readDataFile();
    
    switch ($operation) {
        case 'update':
            // Full update - replace all data
            if (!isset($newData['events']) || !is_array($newData['events'])) {
                sendResponse(false, null, 'Invalid events data structure');
            }
            
            // Validate all events
            foreach ($newData['events'] as $index => $event) {
                try {
                    validateEventData($event);
                } catch (Exception $e) {
                    sendResponse(false, null, "Event $index validation failed: " . $e->getMessage());
                }
            }
            
            $currentData['events'] = $newData['events'];
            break;
            
        case 'add':
            // Add new event
            $newEvent = $newData;
            validateEventData($newEvent);
            
            // Generate ID if not provided
            if (!isset($newEvent['id'])) {
                $newEvent['id'] = time() . '_' . rand(1000, 9999);
            }
            
            // Add timestamps
            $newEvent['createdAt'] = date('Y-m-d H:i:s');
            $newEvent['updatedAt'] = date('Y-m-d H:i:s');
            
            // Initialize attendees if not set
            if (!isset($newEvent['attendees'])) {
                $newEvent['attendees'] = [];
            }
            
            $currentData['events'][] = $newEvent;
            break;
            
        case 'delete':
            // Delete event by ID
            $eventId = $newData['id'] ?? null;
            if (!$eventId) {
                sendResponse(false, null, 'Event ID required for delete operation');
            }
            
            $found = false;
            foreach ($currentData['events'] as $index => $event) {
                if ($event['id'] == $eventId) {
                    unset($currentData['events'][$index]);
                    $currentData['events'] = array_values($currentData['events']); // Re-index
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                sendResponse(false, null, 'Event not found');
            }
            break;
            
        default:
            sendResponse(false, null, 'Invalid operation. Use: update, add, or delete');
    }
    
    // Write updated data
    writeDataFile($currentData);
    
    // Return success response with updated data
    sendResponse(true, [
        'operation' => $operation,
        'totalEvents' => count($currentData['events']),
        'lastUpdated' => $currentData['lastUpdated']
    ]);
    
} catch (Exception $e) {
    error_log("Write API Error: " . $e->getMessage());
    sendResponse(false, null, $e->getMessage());
}
?>