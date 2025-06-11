<?php
$host = "localhost";
$dbname = "licenta";
$user = "postgres";
$pass = "1234";
$port = "5432";

// PostgreSQL connection for pg_*
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

if (!$conn) {
    die("❌ Connection to database failed.");
}

// PDO connection (used only if needed elsewhere)
try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
