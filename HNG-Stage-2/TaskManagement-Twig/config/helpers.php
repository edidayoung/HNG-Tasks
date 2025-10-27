<?php
function requireAuth() {
    if (!isset($_SESSION['user'])) {
        showToast('Your session has expired — please log in again.', 'error');
        header('Location: login.php');
        exit;
    }
}

function redirectIfAuthenticated() {
    if (isset($_SESSION['user'])) {
        header('Location: dashboard.php');
        exit;
    }
}

function getStatusColor($status) {
    switch ($status) {
        case 'open': return 'bg-green-100 text-green-800 border-green-300';
        case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
        case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

function getStatusLabel($status) {
    switch ($status) {
        case 'open': return 'Open';
        case 'in_progress': return 'In Progress';
        case 'closed': return 'Closed';
        default: return $status;
    }
}
?>