<?php
require_once 'config/config.php';
require_once 'config/helpers.php';

redirectIfAuthenticated();

$errors = [];
$formData = [
    'name' => '',
    'email' => '',
    'password' => '',
    'confirmPassword' => ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData['name'] = $_POST['name'] ?? '';
    $formData['email'] = $_POST['email'] ?? '';
    $formData['password'] = $_POST['password'] ?? '';
    $formData['confirmPassword'] = $_POST['confirmPassword'] ?? '';
    
    // Validation
    if (empty($formData['name'])) {
        $errors['name'] = 'Name is required';
    }
    
    if (empty($formData['email'])) {
        $errors['email'] = 'Email is required';
    } elseif (!filter_var($formData['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Email is invalid';
    } else {
        $users = getStoredData('users');
        foreach ($users as $user) {
            if ($user['email'] === $formData['email']) {
                $errors['email'] = 'Email already exists. Please use a different email.';
                break;
            }
        }
    }
    
    if (empty($formData['password'])) {
        $errors['password'] = 'Password is required';
    } elseif (strlen($formData['password']) < 6) {
        $errors['password'] = 'Password must be at least 6 characters';
    }
    
    if ($formData['password'] !== $formData['confirmPassword']) {
        $errors['confirmPassword'] = 'Passwords do not match';
    }
    
    if (empty($errors)) {
        $users = getStoredData('users');
        $newUser = [
            'id' => generateId(),
            'name' => $formData['name'],
            'email' => $formData['email'],
            'password' => $formData['password']
        ];
        
        $users[] = $newUser;
        setStoredData('users', $users);
        
        $_SESSION['user'] = [
            'id' => $newUser['id'],
            'email' => $newUser['email'],
            'name' => $newUser['name'],
            'token' => generateId()
        ];
        
        showToast('Account created successfully! Welcome aboard.', 'success');
        header('Location: dashboard.php');
        exit;
    }
}

$toast = getToast();

echo $twig->render('signup.html.twig', [
    'errors' => $errors,
    'formData' => $formData,
    'toast' => $toast
]);
?>