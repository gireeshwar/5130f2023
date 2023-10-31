<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection details
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "user_information";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Process user information
    $firstname = $_POST["firstName"];
    $lastname = $_POST["lastName"];
    $email = $_POST["email"];
    $gender = $_POST["gender"];
    $currentlocation = $_POST["currentlocation"];
    $city = $_POST["cityOfbirth"];
    $dreamdest = $_POST["dream"];
    $interests = $_POST["hobbies"];
    $pdf = $_POST["pdf"];

    
    // Insert data into the database
    $sql = "INSERT INTO user_list (firstname,lastname , email, gender, currentlocation, cityofbirth, dream, hobbies,pdf)
            VALUES ('$firstname', '$lastname', '$email', '$gender', '$currentlocation', '$city', '$dreamdest', '$interests', '$pdf')";

    if ($conn->query($sql) === TRUE) {
        echo "Data inserted successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close the database connection
    $conn->close();
}
?>