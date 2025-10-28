<?php
// Database configuration for InfinityFree
$host = 'sql105.infinityfree.com'; 
$username = 'if0_40270752'; 
$password = '1AVGwl9b4cP';
$database = 'if0_40270752_NewDataBase'; 

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset("utf8mb4");

// Function to safely execute queries
function dbQuery($sql, $params = []) {
    global $conn;
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return false;
    }
    
    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    return $stmt;
}

// Function to fetch single row
function dbFetch($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    if (!$stmt) return false;
    
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

// Function to fetch all rows
function dbFetchAll($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    if (!$stmt) return false;
    
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    return $rows;
}

// Function to insert data and return last insert ID
function dbInsert($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    if (!$stmt) return false;
    
    return $stmt->insert_id;
}

// Function to update/delete data
function dbExecute($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    if (!$stmt) return false;
    
    return $stmt->affected_rows;
}

echo "Database connected successfully!";
?>