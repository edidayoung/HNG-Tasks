<?php
require_once 'config/config.php';
require_once 'config/helpers.php';

requireAuth();

$tickets = getStoredData('tickets');
$userTickets = array_filter($tickets, function($ticket) {
    return $ticket['userId'] === $_SESSION['user']['id'];
});

$errors = [];
$showForm = false;
$editingTicket = null;

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'create' || $action === 'update') {
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $status = $_POST['status'] ?? '';
        $priority = $_POST['priority'] ?? 'medium';
        
        // Validation
        if (empty($title)) {
            $errors['title'] = 'Title is required';
        }
        
        if (empty($status)) {
            $errors['status'] = 'Status is required';
        } elseif (!in_array($status, ['open', 'in_progress', 'closed'])) {
            $errors['status'] = 'Status must be one of: open, in_progress, closed';
        }
        
        if ($description && strlen($description) > 500) {
            $errors['description'] = 'Description must be less than 500 characters';
        }
        
        if (empty($errors)) {
            if ($action === 'create') {
                $newTicket = [
                    'id' => generateId(),
                    'userId' => $_SESSION['user']['id'],
                    'title' => $title,
                    'description' => $description,
                    'status' => $status,
                    'priority' => $priority,
                    'createdAt' => date('c')
                ];
                
                $tickets[] = $newTicket;
                setStoredData('tickets', $tickets);
                showToast('Ticket created successfully!', 'success');
            } else {
                $ticketId = $_POST['ticket_id'] ?? '';
                foreach ($tickets as &$ticket) {
                    if ($ticket['id'] === $ticketId && $ticket['userId'] === $_SESSION['user']['id']) {
                        $ticket['title'] = $title;
                        $ticket['description'] = $description;
                        $ticket['status'] = $status;
                        $ticket['priority'] = $priority;
                        $ticket['updatedAt'] = date('c');
                        break;
                    }
                }
                setStoredData('tickets', $tickets);
                showToast('Ticket updated successfully!', 'success');
            }
            
            header('Location: tickets.php');
            exit;
        } else {
            $showForm = true;
            if ($action === 'update') {
                $editingTicket = [
                    'id' => $_POST['ticket_id'] ?? '',
                    'title' => $title,
                    'description' => $description,
                    'status' => $status,
                    'priority' => $priority
                ];
            }
        }
    } elseif ($action === 'delete') {
        $ticketId = $_POST['ticket_id'] ?? '';
        $tickets = array_filter($tickets, function($ticket) use ($ticketId) {
            return !($ticket['id'] === $ticketId && $ticket['userId'] === $_SESSION['user']['id']);
        });
        setStoredData('tickets', array_values($tickets));
        showToast('Ticket deleted successfully!', 'success');
        header('Location: tickets.php');
        exit;
    }
}

// Handle show form request
if (isset($_GET['show_form'])) {
    $showForm = true;
}

// Handle edit request
if (isset($_GET['edit'])) {
    $ticketId = $_GET['edit'];
    foreach ($tickets as $ticket) {
        if ($ticket['id'] === $ticketId && $ticket['userId'] === $_SESSION['user']['id']) {
            $editingTicket = $ticket;
            $showForm = true;
            break;
        }
    }
}

$userTickets = array_filter($tickets, function($ticket) {
    return $ticket['userId'] === $_SESSION['user']['id'];
});

$toast = getToast();

echo $twig->render('tickets.html.twig', [
    'session' => $_SESSION['user'],
    'tickets' => array_values($userTickets),
    'showForm' => $showForm,
    'editingTicket' => $editingTicket,
    'errors' => $errors,
    'toast' => $toast
]);
?>