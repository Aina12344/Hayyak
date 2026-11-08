<?php
/** Hayyak classroom demo: shared reviews using a server-side JSON document.
 * Run via `php -S 0.0.0.0:8000` at the Hayyak project root.
 * IMPORTANT: Browser-auth identities are asserted by the client in this Sprint 1
 * starter project. This is NOT secure authorization for a public deployment.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
function respond($status, $data) { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail_request($message, $status=400) { respond($status, ['ok'=>false,'error'=>$message]); }
$path = __DIR__ . '/.reviews-store.php';
$prefix = "<?php exit; ?>\n"; // Prevent direct web access to stored visitor emails.
$handle = fopen($path, 'c+');
if (!$handle) fail_request('Cannot open review storage. Check folder permissions.', 500);
if (!flock($handle, LOCK_EX)) fail_request('Storage temporarily unavailable.', 500);
$raw = stream_get_contents($handle);
if ($raw === '' || $raw === false) { $records = []; }
else {
  if (strpos($raw, $prefix) !== 0) fail_request('Invalid review storage format.', 500);
  $records = json_decode(substr($raw, strlen($prefix)), true);
  if (!is_array($records)) fail_request('Invalid stored review data.', 500);
}
$siteID = filter_var($_SERVER['REQUEST_METHOD'] === 'GET' ? ($_GET['siteID'] ?? null) : null, FILTER_VALIDATE_INT);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if ($siteID === false || $siteID === null || $siteID < 1) fail_request('Invalid site ID.');
  $siteReviews = array_values(array_filter($records, fn($r) => (int)$r['siteID'] === $siteID));
  usort($siteReviews, fn($a,$b) => strcmp($b['date'], $a['date']) ?: strcmp($b['reviewID'], $a['reviewID']));
  // Email is not needed by other tourists, but the demo currently uses it for owner recognition.
  respond(200, ['ok'=>true, 'reviews'=>$siteReviews]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail_request('Method not allowed',405);
if (strlen(file_get_contents('php://input')) > 12000) fail_request('Request too large.',413);
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) fail_request('Invalid JSON.');
$action = $data['action'] ?? '';
$siteID = filter_var($data['siteID'] ?? null, FILTER_VALIDATE_INT);
$email = trim(strtolower((string)($data['userEmail'] ?? '')));
$name = trim((string)($data['reviewer'] ?? ''));
if ($siteID === false || $siteID === null || $siteID < 1 || !filter_var($email,FILTER_VALIDATE_EMAIL)) fail_request('Invalid site or user.');
if (!in_array($action, ['add','edit','delete'], true)) fail_request('Invalid action.');
if ($action !== 'delete') {
  $rating = filter_var($data['rating'] ?? null, FILTER_VALIDATE_INT);
  $reviewText = trim((string)($data['text'] ?? ''));
  if ($rating === false || $rating === null || $rating < 1 || $rating > 5 || $reviewText === '' || strlen($reviewText) > 8000) fail_request('A 1–5 star rating and review text are required.');
}
$index = null;
foreach ($records as $i => $r) {
  if ((int)$r['siteID'] === $siteID && strtolower($r['userEmail']) === $email) { $index = $i; break; }
}
if ($action === 'add') {
  if ($index !== null) fail_request('You have already reviewed this site.',409);
  $records[] = ['reviewID'=>bin2hex(random_bytes(12)), 'siteID'=>$siteID, 'userEmail'=>$email,
    'reviewer'=>substr($name ?: $email,0,100), 'rating'=>$rating, 'text'=>$reviewText, 'date'=>gmdate('Y-m-d\TH:i:s\Z')];
} elseif ($action === 'edit') {
  if ($index === null || ($data['reviewID'] ?? '') !== $records[$index]['reviewID']) fail_request('Your review was not found.',403);
  $records[$index]['rating'] = $rating;
  $records[$index]['text'] = $reviewText;
} else {
  if ($index === null || ($data['reviewID'] ?? '') !== $records[$index]['reviewID']) fail_request('Your review was not found.',403);
  array_splice($records, $index, 1);
}
$encoded = $prefix . json_encode($records, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n";
rewind($handle);
if (fwrite($handle,$encoded) !== strlen($encoded) || !ftruncate($handle,strlen($encoded))) fail_request('Could not save review.',500);
fflush($handle);
$siteReviews = array_values(array_filter($records,fn($r)=>(int)$r['siteID'] === $siteID));
usort($siteReviews,fn($a,$b)=>strcmp($b['date'],$a['date']) ?: strcmp($b['reviewID'],$a['reviewID']));
respond(200,['ok'=>true,'reviews'=>$siteReviews]);
