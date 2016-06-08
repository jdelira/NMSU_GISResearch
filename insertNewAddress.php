<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nmsu_mapapp_data";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
// set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_GET['lowaddress']) && isset($_GET['highaddress']) && isset($_GET['streetname']) && isset($_GET['city']) && isset($_GET['state'])) {
        
			$stmt = $conn->prepare("INSERT INTO address_list (lowaddress, highaddress, streetname, city, state) VALUES (:lowaddress, :highaddress, :streetname, :city, :state)");
			$stmt->bindParam(':lowaddress', $_GET['lowaddress']);
			$stmt->bindParam(':highaddress', $_GET['highaddress']);
			$stmt->bindParam(':streetname', $_GET['streetname']);
			$stmt->bindParam(':city', $_GET['city']);
			$stmt->bindParam(':state', $_GET['state']);
			$stmt->execute();

		
    }
} catch (PDOException $e) {
    echo "<br>" . $e->getMessage();
}

$conn = null;
?>