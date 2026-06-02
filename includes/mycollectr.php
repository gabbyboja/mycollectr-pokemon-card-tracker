<?php
clearstatcache();

require_once "dbconfig.php";
session_start();

$type = $_POST['type'];

if($type == 'fetch'){

    $stmt = $conn->prepare("SELECT * FROM cards");
    $stmt->execute();
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $stmt2 = $conn->prepare("
        SELECT 
            SUM(amount) AS totalSpent,
            SUM(qty) AS totalCards,
            MIN(date_added) AS firstPurchase
        FROM cards
    ");
    $stmt2->execute();
    $summary = $stmt2->fetch(PDO::FETCH_ASSOC);
    
    $data = array('status'=>'success', 'data'=>$row, 'summary'=>$summary);



    echo json_encode(utf8ize($data));
}


if ($type == 'add') {

    $cardName = $_POST['cardName'];
    $cardAmount = $_POST['cardAmount'];
    $cardQty = $_POST['cardQty'];
    $dateAdded = $_POST['dateAdded'];

    $stmt = $conn->prepare("
        INSERT INTO cards (card_name, amount, qty, date_added)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([$cardName, $cardAmount, $cardQty, $dateAdded]);

    $data = array(
        'status' => 'success',
        'message' => 'Card added successfully'
    );

    echo json_encode(utf8ize($data));
}








