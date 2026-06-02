<?php session_start(); if(!isset($_SESSION['token'])){ header('location: login.php');} require_once "includes/dbconfig.php"; ?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="icon" href="assets/images/default.ico">
    <link rel="stylesheet" href="assets/css/mycollectr.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
    <title>MyCollectr</title>
</head>
<body>
    <div>
        <div class="title header-grid">
            <img src="assets/images/newerlogo.png" alt="" width="215px" height="48px">
        </div>
    <div class="container-grid">
        
        <div class="total-value" id="breakDownbody"></div>

        <div id="tbody"class="cards-grid"></div>

        <div class="add-card add-card-grid">
            <div class="pokelogo"><img id="pokeLogo" src="assets/images/pokeball_logo.png"></div>
            <input type="text" id="cardName" placeholder="Enter card name">
            <input type="date" id="dateAdded">
            <input type="text" id="cardAmount" placeholder="Enter amount">
            <input type="number" id="cardQty" placeholder="Enter quantity">
            <select name="pokemon" onchange="cardType(this.value)">
            <option value="" disabled selected>-- Select Product Type --</option>
            <option value="card">Card</option>
            <option value="slab">Slab</option>
            <option value="sealed">Sealed Product</option>
            </select>
            <div class="selection"></div>
            <button id="addCardBtn" class="add-btn">ADD</button>

        </div>
    </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="assets/js/mycollectr.js"></script>
</body>
</html>
