<?php
/**
 * Laravel Application Entry Point Redirect
 * 
 * This file redirects all root requests to the public folder
 * where the actual Laravel application index.php is located.
 */

// Redirect to public folder
header('Location: /public/index.php');
exit;
