<?php

require_once "dbconfig.php";

set_time_limit(0);

$setsUrl = "https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/sets/en.json";

$totalProcessed = 0;
$totalSets = 0;

echo "<pre>";
echo "Loading Pokemon TCG set list...\n\n";

/*
|--------------------------------------------------------------------------
| GET THE SET LIST
|--------------------------------------------------------------------------
*/

$setsJson = file_get_contents($setsUrl);

if ($setsJson === false) {
    die("Unable to download the Pokemon TCG set list.");
}

$sets = json_decode($setsJson, true);

if (!is_array($sets)) {
    die("Unable to read the Pokemon TCG set list.");
}

/*
|--------------------------------------------------------------------------
| PREPARE DATABASE QUERY ONCE
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare("
    INSERT INTO pokemon_cards (
        api_id,
        name,
        image_small,
        image_large,
        set_name,
        card_number
    )
    VALUES (?, ?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        image_small = VALUES(image_small),
        image_large = VALUES(image_large),
        set_name = VALUES(set_name),
        card_number = VALUES(card_number)
");

/*
|--------------------------------------------------------------------------
| LOOP THROUGH EVERY POKEMON SET
|--------------------------------------------------------------------------
*/

foreach ($sets as $set) {

    $setId = $set['id'];
    $setName = $set['name'];

    $cardsUrl =
        "https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/cards/en/"
        . $setId
        . ".json";

    echo "Importing {$setName} ({$setId})...\n";

    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD THIS SET
    |--------------------------------------------------------------------------
    */

    $cardsJson = @file_get_contents($cardsUrl);

    if ($cardsJson === false) {

        echo "Could not download {$setId}. Skipping.\n\n";

        continue;
    }

    $cards = json_decode($cardsJson, true);

    if (!is_array($cards)) {

        echo "Invalid JSON for {$setId}. Skipping.\n\n";

        continue;
    }

    $setCardCount = 0;

    /*
    |--------------------------------------------------------------------------
    | INSERT CARDS
    |--------------------------------------------------------------------------
    */

    foreach ($cards as $card) {

        $apiId = $card['id'] ?? null;
        $name = $card['name'] ?? null;
        $cardNumber = $card['number'] ?? null;

        $imageSmall = $card['images']['small'] ?? null;
        $imageLarge = $card['images']['large'] ?? null;

        if (!$apiId || !$name) {
            continue;
        }

        $stmt->execute([
            $apiId,
            $name,
            $imageSmall,
            $imageLarge,
            $setName,
            $cardNumber
        ]);

        $setCardCount++;
        $totalProcessed++;
    }

    $totalSets++;

    echo "{$setCardCount} cards processed.\n";
    echo "Total processed so far: {$totalProcessed}\n\n";

    /*
     * Small pause between sets.
     */
    usleep(150000);
}

echo "========================================\n";
echo "IMPORT COMPLETE\n";
echo "========================================\n";

echo "Sets processed: {$totalSets}\n";
echo "Cards processed: {$totalProcessed}\n";

echo "</pre>";