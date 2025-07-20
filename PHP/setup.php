<?php
// 000webhost Setup Script
// Run this once to initialize your ScoutPluse installation

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>
<html>
<head>
    <title>ScoutPluse Setup - 000webhost</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        .step { margin: 20px 0; padding: 15px; border-left: 4px solid #ccc; }
        .step.success { border-color: green; background: #f0fff0; }
        .step.error { border-color: red; background: #fff0f0; }
        .step.warning { border-color: orange; background: #fff8f0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>ScoutPluse Setup for 000webhost</h1>";

$steps = [];

// Step 1: Check PHP version
$phpVersion = phpversion();
if (version_compare($phpVersion, '7.4', '>=')) {
    $steps[] = ['success', 'PHP Version', "PHP $phpVersion is supported ✓"];
} else {
    $steps[] = ['error', 'PHP Version', "PHP $phpVersion is too old. Requires PHP 7.4+ ✗"];
}

// Step 2: Check required extensions
$requiredExtensions = ['json', 'fileinfo'];
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        $steps[] = ['success', "Extension: $ext", "Extension $ext is loaded ✓"];
    } else {
        $steps[] = ['error', "Extension: $ext", "Extension $ext is missing ✗"];
    }
}

// Step 3: Check directory permissions
if (is_writable('.')) {
    $steps[] = ['success', 'Directory Permissions', 'Current directory is writable ✓'];
} else {
    $steps[] = ['error', 'Directory Permissions', 'Current directory is not writable ✗'];
}

// Step 4: Create backups directory
if (!is_dir('backups')) {
    if (mkdir('backups', 0755)) {
        $steps[] = ['success', 'Backups Directory', 'Created backups directory ✓'];
    } else {
        $steps[] = ['error', 'Backups Directory', 'Failed to create backups directory ✗'];
    }
} else {
    $steps[] = ['success', 'Backups Directory', 'Backups directory already exists ✓'];
}

// Step 5: Check/Create data.json
if (!file_exists('data.json')) {
    $defaultData = [
        'events' => [],
        'lastUpdated' => date('Y-m-d H:i:s')
    ];
    
    if (file_put_contents('data.json', json_encode($defaultData, JSON_PRETTY_PRINT))) {
        $steps[] = ['success', 'Data File', 'Created data.json file ✓'];
    } else {
        $steps[] = ['error', 'Data File', 'Failed to create data.json file ✗'];
    }
} else {
    $steps[] = ['success', 'Data File', 'data.json file already exists ✓'];
}

// Step 6: Test file operations
$testFile = 'test_' . time() . '.txt';
if (file_put_contents($testFile, 'test') && file_get_contents($testFile) === 'test') {
    unlink($testFile);
    $steps[] = ['success', 'File Operations', 'Read/write operations working ✓'];
} else {
    $steps[] = ['error', 'File Operations', 'File operations not working ✗'];
}

// Step 7: Test JSON operations
$testJson = ['test' => true, 'timestamp' => time()];
$encoded = json_encode($testJson);
$decoded = json_decode($encoded, true);
if ($decoded && $decoded['test'] === true) {
    $steps[] = ['success', 'JSON Operations', 'JSON encoding/decoding working ✓'];
} else {
    $steps[] = ['error', 'JSON Operations', 'JSON operations not working ✗'];
}

// Display results
foreach ($steps as $step) {
    echo "<div class='step {$step[0]}'>
            <h3>{$step[1]}</h3>
            <p>{$step[2]}</p>
          </div>";
}

// Summary
$errors = array_filter($steps, function($step) { return $step[0] === 'error'; });
$warnings = array_filter($steps, function($step) { return $step[0] === 'warning'; });

echo "<div class='step " . (empty($errors) ? 'success' : 'error') . "'>
        <h2>Setup Summary</h2>";

if (empty($errors)) {
    echo "<p class='success'>✅ Setup completed successfully! Your ScoutPluse installation is ready.</p>
          <h3>Next Steps:</h3>
          <ol>
            <li>Update your JavaScript files with the correct 000webhost URL</li>
            <li>Test the API connection using the test script</li>
            <li>Upload your HTML/CSS/JS files to access the application</li>
          </ol>
          <h3>Your API URLs:</h3>
          <pre>Read API: https://" . $_SERVER['HTTP_HOST'] . "/PHP/read.php
Write API: https://" . $_SERVER['HTTP_HOST'] . "/PHP/write.php
Test API: https://" . $_SERVER['HTTP_HOST'] . "/PHP/test-connection.php</pre>";
} else {
    echo "<p class='error'>❌ Setup encountered " . count($errors) . " error(s). Please fix these issues before proceeding.</p>";
}

if (!empty($warnings)) {
    echo "<p class='warning'>⚠️ " . count($warnings) . " warning(s) found. These may not prevent operation but should be addressed.</p>";
}

echo "</div>
      <div class='step'>
        <h3>File Permissions Guide for 000webhost</h3>
        <p>If you encounter permission issues, set these file permissions in your 000webhost file manager:</p>
        <pre>
Files (.php, .json, .html): 644
Directories (PHP/, backups/): 755
        </pre>
      </div>
    </body>
    </html>";
?>