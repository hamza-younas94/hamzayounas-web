<?php
/**
 * contact.php — Hamza Younas portfolio contact handler
 * Sends via authenticated SMTP (PHPMailer). Validates input, blocks spam
 * (honeypot), returns JSON. SMTP credentials live OUTSIDE the web root and
 * OUTSIDE the (public) git repo: ~/.hy-secrets/smtp.php
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json; charset=utf-8');

function respond($ok, $payload = []) {
    echo json_encode(array_merge(['ok' => $ok], $payload));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, ['error' => 'Method not allowed.']);
}

// ---- honeypot: bots fill the hidden "website" field ----
if (!empty($_POST['website'])) {
    respond(true, ['message' => 'Message sent.']); // silently absorb bots
}

// ---- gather + validate ----
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

// strip header-injection attempts
$name  = preg_replace('/[\r\n]+/', ' ', $name);
$email = preg_replace('/[\r\n]+/', ' ', $email);

// ---- load SMTP config (above web root; fall back gracefully) ----
$cfgPath = dirname(__DIR__) . '/.hy-secrets/smtp.php';
$cfg = is_readable($cfgPath) ? require $cfgPath : null;

$to = $cfg['to'] ?? 'hamza.younas94@gmail.com';
$subject = 'New message from hamzayounas.com';

$bodyText  = "New contact form submission from hamzayounas.com\n\n";
$bodyText .= "Name:  $name\n";
$bodyText .= "Email: $email\n";
$bodyText .= "IP:    " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
$bodyText .= "Time:  " . date('Y-m-d H:i:s') . "\n\n";
$bodyText .= "Message:\n$message\n";

// ---- try SMTP via PHPMailer ----
if ($cfg && is_dir(__DIR__ . '/lib/PHPMailer/src')) {
    require __DIR__ . '/lib/PHPMailer/src/Exception.php';
    require __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/lib/PHPMailer/src/SMTP.php';

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $cfg['host'];
        $mail->Port       = (int) $cfg['port'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $cfg['user'];
        $mail->Password   = $cfg['pass'];
        $mail->SMTPSecure = ($cfg['secure'] === 'ssl')
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->CharSet    = 'UTF-8';
        $mail->Timeout    = 15;

        $mail->setFrom($cfg['from'], $cfg['from_name'] ?? 'hamzayounas.com');
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);

        $mail->Subject = $subject;
        $mail->Body    = $bodyText;

        $mail->send();
        respond(true, ['message' => "Thanks $name — your message is on its way. I'll reply soon."]);
    } catch (Exception $e) {
        // fall through to mail() below
    }
}

// ---- fallback: PHP mail() ----
$headers  = "From: " . ($cfg['from'] ?? 'no-reply@hamzayounas.com') . "\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

if (@mail($to, $subject, $bodyText, $headers)) {
    respond(true, ['message' => "Thanks $name — your message is on its way. I'll reply soon."]);
}

http_response_code(500);
respond(false, ['error' => 'Could not send right now. Please email hamza.younas94@gmail.com directly.']);
