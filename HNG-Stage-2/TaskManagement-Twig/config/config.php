<?php
require_once 'vendor/autoload.php';

// Session setup
session_start();

// Twig setup
$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader, [
    'debug' => true,
    'cache' => false,
]);

// Add global variables
$twig->addGlobal('current_page', basename($_SERVER['PHP_SELF']));
$twig->addGlobal('session', $_SESSION['user'] ?? null);

// Helper functions
function getStoredData($filename, $default = []) {
    $filepath = "data/{$filename}.json";
    if (!file_exists($filepath)) {
        return $default;
    }
    $data = file_get_contents($filepath);
    return json_decode($data, true) ?: $default;
}

function setStoredData($filename, $data) {
    $filepath = "data/{$filename}.json";
    file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT));
}

function generateId() {
    return '_' . uniqid();
}

function showToast($message, $type = 'info') {
    $_SESSION['toast'] = [
        'message' => $message,
        'type' => $type
    ];
}

function getToast() {
    $toast = $_SESSION['toast'] ?? null;
    unset($_SESSION['toast']);
    return $toast;
}

// Initialize data files if they don't exist
if (!file_exists('data/users.json')) {
    setStoredData('users', [
        [
            'id' => '1',
            'email' => 'demo@example.com',
            'password' => 'demo123',
            'name' => 'Demo User'
        ]
    ]);
}

if (!file_exists('data/tickets.json')) {
    setStoredData('tickets', []);
}
?>