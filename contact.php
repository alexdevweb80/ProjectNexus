<?php
// Set response header to JSON
header('Content-Type: application/json');

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is received
if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No data received.']);
    exit;
}

// Extract and sanitize inputs
$name = filter_var(trim($data['name'] ?? ''), FILTER_SANITIZE_STRING);
$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$message = filter_var(trim($data['message'] ?? ''), FILTER_SANITIZE_STRING);

// Validate inputs
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit;
}

// Email configuration
$to = 'your-email@example.com'; // REPLACE WITH YOUR EMAIL
$subject = "New Contact from Project Nexus: $name";
$body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
$headers = "From: noreply@projectnexus.com" . "\r\n" .
           "Reply-To: $email" . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Attempt to send email
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Message transmission complete.']);
} else {
    // In a local environment without a mail server, mail() will fail. 
    // You might want to log the message instead for testing.
    // file_put_contents('contact_logs.txt', $body . "\n---\n", FILE_APPEND);
    
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Transmission failed. Server error.']);
}
?>
