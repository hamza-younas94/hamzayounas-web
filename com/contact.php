<?php
/**
 * contact.php — Hamza Younas portfolio contact handler
 * Validates input, blocks spam (honeypot), emails the owner, returns JSON.
 */

header('Content-Type: application/json; charset=utf-8');

// ---- config ----
$TO      = 'hamza.younas94@gmail.com';
$SUBJECT = 'New message from hamzayounas.com';

function respond($ok, $payload = []) {
    echo json_encode(array_merge(['ok' => $ok], $payload));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, ['error' => 'Method not allowed.']);
}

// ---- honeypot: bots fill hidden "website" field ----
if (!empty($_POST['website'])) {
    // pretend success so bots don't retry
    respond(true, ['message' => 'Message sent.']);
}

// ---- gather + sanitize ----
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    respond(false, ['error' => 'Please fill in every field.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    respond(false, ['error' => 'That email address looks invalid.']);
}
if (strlen($message) > 5000 || strlen($name) > 200) {
    http_response_code(422);
    respond(false, ['error' => 'That message is a little too long.']);
}

// strip header-injection attempts from name/email
$name  = preg_replace('/[\r\n]+/', ' ', $name);
$email = preg_replace('/[\r\n]+/', ' ', $email);

// ---- build email ----
$body  = "New contact form submission from hamzayounas.com\n\n";
$body .= "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= "IP:      " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
$body .= "Time:    " . date('Y-m-d H:i:s') . "\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: no-reply@hamzayounas.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

$sent = @mail($TO, $SUBJECT, $body, $headers);

if ($sent) {
    respond(true, ['message' => "Thanks $name — your message is on its way. I'll reply soon."]);
} else {
    http_response_code(500);
    respond(false, ['error' => 'Could not send right now. Please email hamza.younas94@gmail.com directly.']);
}
