<?php
require_once 'config/config.php';

$toast = getToast();

echo $twig->render('landing.html.twig', [
    'toast' => $toast
]);
?>