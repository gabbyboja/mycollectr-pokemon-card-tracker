<?php

header('Content-Type: application/json');

require_once "dbconfig.php";

$search = trim($_GET['search'] ?? '');

$terms = preg_split('/\s+/', $search);

$where = [];
$params = [];

foreach ($terms as $term) {

    $where[] = "(name LIKE ? OR card_number LIKE ?)";

    $params[] = '%' . $term . '%';
    $params[] = '%' . $term . '%';
}

$sql = "
    SELECT
        api_id,
        name,
        image_small,
        image_large,
        set_name,
        card_number
    FROM pokemon_cards
    WHERE " . implode(" AND ", $where) . "
    ORDER BY name ASC
    LIMIT 20
";

$stmt = $conn->prepare($sql);
$stmt->execute($params);

$cards = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'status' => 'success',
    'data' => $cards
]);