<?php
require_once 'config/config.php';
require_once 'config/helpers.php';

requireAuth();

$tickets = getStoredData('tickets');
$userTickets = array_filter($tickets, function($ticket) {
    return $ticket['userId'] === $_SESSION['user']['id'];
});

$openTickets = array_filter($userTickets, function($ticket) {
    return $ticket['status'] === 'open';
});

$inProgressTickets = array_filter($userTickets, function($ticket) {
    return $ticket['status'] === 'in_progress';
});

$closedTickets = array_filter($userTickets, function($ticket) {
    return $ticket['status'] === 'closed';
});

$toast = getToast();

echo $twig->render('dashboard.html.twig', [
    'session' => $_SESSION['user'],
    'openTickets' => count($openTickets),
    'inProgressTickets' => count($inProgressTickets),
    'closedTickets' => count($closedTickets),
    'toast' => $toast
]);
?>