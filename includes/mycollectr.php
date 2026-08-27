<?php
clearstatcache();

require_once "dbconfig.php";
session_start();

$type = $_POST['type'];

if($type == 'fetch'){

    $stmt = $conn->prepare("SELECT * FROM cards where user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $stmt2 = $conn->prepare("
        SELECT 
            SUM(amount) AS totalSpent,
            SUM(qty) AS totalCards,
            MIN(date_added) AS firstPurchase
        FROM cards
        WHERE user_id = ?
    ");
    $stmt2->execute([$_SESSION['user_id']]);
    $summary = $stmt2->fetch(PDO::FETCH_ASSOC);
    
    $data = array('status'=>'success', 'data'=>$row, 'summary'=>$summary);



    echo json_encode(utf8ize($data));
}


if ($type == 'add') {

    $cardName = $_POST['cardName'];
    $cardAmount = $_POST['cardAmount'];
    $cardQty = $_POST['cardQty'];
    $dateAdded = $_POST['dateAdded'];
    $userId = $_SESSION['user_id'];
    $cardImage = $_POST['cardImage'];
    $cardId = $_POST['cardId'];

    $stmt = $conn->prepare("
        INSERT INTO cards (user_id, card_name, amount, qty, date_added, card_image, pokemon_api_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([$userId, $cardName, $cardAmount, $cardQty, $dateAdded, $cardImage, $cardId]);

    $data = array(
        'status' => 'success',
        'message' => 'Card added successfully'
    );

    echo json_encode(utf8ize($data));
}


if ($type == 'increase') {

    $cardId = $_POST['cardId'];

    $stmt = $conn->prepare("
        UPDATE cards
        SET qty = qty + 1
        WHERE user_id = ? AND id = ?
    ");

    $stmt->execute([
        $_SESSION['user_id'],
        $cardId
    ]);

    echo json_encode([
        'status' => 'success',
        'cardId' => $cardId,
        'userId' => $_SESSION['user_id'],
        'affectedRows' => $stmt->rowCount()
    ]);
}

if ($type == 'decrease') {

    $cardId = $_POST['cardId'];

    $stmt = $conn->prepare("
        UPDATE cards
        SET qty = qty - 1
        WHERE user_id = ?
        AND id = ?
        AND qty > 1
    ");

    $stmt->execute([
        $_SESSION['user_id'],
        $cardId
    ]);

    echo json_encode([
        'status' => 'success'
    ]);
}

if ($type == 'delete') {

    $cardId = $_POST['cardId'];

    $stmt = $conn->prepare("
        DELETE FROM cards
        WHERE user_id = ?
        AND id = ?
    ");

    $stmt->execute([
        $_SESSION['user_id'],
        $cardId
    ]);

    echo json_encode([
        'status' => 'success'
    ]);
}






