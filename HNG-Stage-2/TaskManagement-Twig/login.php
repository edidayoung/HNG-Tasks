<?php
require_once 'config/config.php';
require_once 'config/helpers.php';

redirectIfAuthenticated();

$errors = [];
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validation
    if (empty($email)) {
        $errors['email'] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Email is invalid';
    }
    
    if (empty($password)) {
        $errors['password'] = 'Password is required';
    } elseif (strlen($password) < 6) {
        $errors['password'] = 'Password must be at least 6 characters';
    }
    
    if (empty($errors)) {
        $users = getStoredData('users');
        $user = null;
        
        foreach ($users as $u) {
            if ($u['email'] === $email && $u['password'] === $password) {
                $user = $u;
                break;
            }
        }
        
        if ($user) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'token' => generateId()
            ];
            showToast('Login successful! Welcome back.', 'success');
            header('Location: dashboard.php');
            exit;
        } else {
            $errors['general'] = 'Invalid email or password. Please try again.';
        }
    }
}

$toast = getToast();

echo $twig->render('login.html.twig', [
    'errors' => $errors,
    'email' => $email,
    'toast' => $toast
]);
?>