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

    if (isset($_GET['streetname']) && isset($_GET['city'])) {
		$streetname = $_GET['streetname'];
        $stmt = $conn->prepare("SELECT * FROM address_list WHERE streetname LIKE :streetname AND city=:city");
        $streetname = "%".$streetname."%";
		$stmt->bindParam(':streetname', $streetname);
        $stmt->bindParam(':city', $_GET['city']);
		$stmt->execute();
		if($stmt->rowCount() > 0)
		{
			$result = $stmt->fetch(PDO::FETCH_ASSOC);
			echo  json_encode($result);
			
		}
		else
		{
			echo "DNE";
		}
		
    }
} catch (PDOException $e) {
    echo "<br>" . $e->getMessage();
}

$conn = null;
?>