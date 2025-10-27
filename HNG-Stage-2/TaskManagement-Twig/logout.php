<?php
require_once 'config/config.php';

session_destroy();
showToast('You have been logged out successfully.', 'success');
header('Location: index.php');
exit;
?>