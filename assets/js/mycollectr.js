function getCards(){

    $.ajax({
        type : 'POST',
        url  : 'includes/mycollectr.php',
        data : { type: 'fetch'},
        dataType: 'json',
        cache: false,

        success: function(response){ 

            if(response.status == 'empty'){
                $("#tbody").html('');
                $("#breakDownbody").html('');
                return;
            }

            // CARDS
       
            let data = '';

            response.data.forEach(card => {

                    data += `
                        <div class="card">
                            <img src="${card.card_image}" class="card-image">

                            <div class="card-info">
                                <div class="card-name">${card.card_name}</div>
                                <div class="card-price">₱${card.amount}</div>

                                <div class="card-added-date">
                                    Date Added: ${card.date_added}
                                </div>

                                <div class="card-qty-controls">
                                    <button onclick="decreaseQty('${card.id}', ${card.qty})">−</button>

                                    <span>${card.qty}</span>

                                    <button onclick="increaseQty('${card.id}')">+</button>
                                </div>
                            </div>
                        </div>
                    `;
                });

            $("#tbody").hide().html(data).fadeIn();

            // BREAKDOWN
  
            let summary = `
            <div class="breakDown"><p>Breakdown</p></div>
            <div class="totalSpent br-flex"><p class="dot">Total Spent  :</p><p>₱${response.summary.totalSpent}</p></div>
            <div class="cardCount br-flex"><p class="dot">Card Count  :</p><p>${response.summary.totalCards}</p></div>
            <div class="slabCount br-flex"><p class="dot">Slab Count  :</p><p>0</p></div>
            <div class="sealedProd br-flex"><p class="dot">Sealed  :</p><p>0</p></div>
            <div class="dateStarted br-flex"><p class="dot">Date Started  :</p><p>${response.summary.firstPurchase}</p></div>
            `;

            $("#breakDownbody").hide().html(summary).fadeIn();
        }
    });
}

let searchTimeout = null;
let searchRequest = null;

$("#cardName").on("input", function() {

    const search = $(this).val().trim();

    // Stop the previous timer
    clearTimeout(searchTimeout);

    // Cancel previous AJAX request
    if (searchRequest) {
        searchRequest.abort();
        searchRequest = null;
    }

    // Clear results if search is too short
    if (search.length < 3) {
        $("#cardSearchResults").html('').hide();
        return;
    }

    // Wait until the user stops typing
    searchTimeout = setTimeout(function() {

        searchRequest = $.ajax({
            type: "GET",
            url: "includes/search_pokemon_cards.php",
            data: {
                search: search
            },
            dataType: "json",

            success: function(response) {

                console.log("Search:", search);
                console.log("Response:", response);

                if (response.status !== "success") {
                    $("#cardSearchResults")
                        .html("<div class='no-results'>Unable to search cards.</div>")
                        .show();

                    return;
                }

                const cards = response.data;

                if (!cards || cards.length === 0) {

                    $("#cardSearchResults")
                        .html("<div class='no-results'>No cards found.</div>")
                        .show();

                    return;
                }

                let results = "";

                cards.forEach(card => {

                                                    results += `
                                        <div class="card-search-result"
                                            data-card-id="${card.api_id}"
                                            data-card-name="${card.name}"
                                            data-card-image="${card.image_small}">

                                            <img 
                                                src="${card.image_small}" 
                                                alt="${card.name}"
                                            >

                                            <div class="search-card-info">

                                                <div class="search-card-name">
                                                    ${card.name}
                                                </div>

                                                <div class="search-card-set">
                                                    ${card.set_name}
                                                </div>

                                                <div class="search-card-number">
                                                    ${card.card_number}
                                                </div>

                                            </div>

                                        </div>
                                    `;
                                });

                $("#cardSearchResults")
                    .html(results)
                    .show();
            },

            error: function(xhr, status) {

               
                if (status === "abort") {
                    return;
                }

                console.log("Search failed:", search);
                console.log("HTTP status:", xhr.status);
                console.log("Response:", xhr.responseText);

                $("#cardSearchResults")
                    .html("<div class='no-results'>Unable to search cards.</div>")
                    .show();
            },

            complete: function() {
                searchRequest = null;
            }

        });

    }, 700); 

});

getCards();

var selectedCardId = null;
var selectedCardImage = null;


$(document).on('click', '.card-search-result', function () {

 selectedCardId = $(this).data('card-id');
    selectedCardImage = $(this).data('card-image');

    var cardName = $(this).data('card-name');

    $('#cardName').val(cardName);

    // Hide/clear search results
    $('#cardSearchResults').empty().hide();

    console.log(selectedCardId);
    console.log(cardName);
    console.log(selectedCardImage);


});

$('#addCardBtn').click(function(){
    var cardName = $("#cardName").val();
    var cardAmount = $("#cardAmount").val();
    var cardQty = $("#cardQty").val();
    var dateAdded = $("#dateAdded").val();
    var cardImage = selectedCardImage;
    var cardId = selectedCardId;

    if(cardName == '' || cardAmount == '' || cardQty == '' || dateAdded == ''){
        alert("Please fill in all fields.");
        return;
    }

    $.ajax({
        type : 'POST',
        url  : 'includes/mycollectr.php',
        data : {
            type: 'add',
            cardName: cardName,
            cardAmount: cardAmount,
            cardQty: cardQty,
            dateAdded: dateAdded,
            cardImage: cardImage,
            cardId: cardId
        },
        dataType: 'json',
        success: function(response){
            if(response.status == 'success'){

                const pokeLogo = document.getElementById('pokeLogo');

                pokeLogo.src = 'assets/images/pokeball_loader.gif';

                setTimeout(() => {
                    pokeLogo.src = 'assets/images/pokeball_logo.png';
                    $("#cardName").val('');
                    $("#cardAmount").val('');
                    $("#cardQty").val('');
                    $("#dateAdded").val('');
                    getCards();
                }, 4300);
                
            } else {
                alert("Error adding card.");
            }
        }
    });
});

function cardType(type) {

    const selection = document.querySelector('.selection');

    if (type === 'card') {
        selection.innerHTML = `
        <div class="selection-item">Mint</div>
        <div class="selection-item">NM</div>
        <div class="selection-item">LM</div>
        <div class="selection-item">MP</div>
        <div class="selection-item">HP</div>
        <div class="selection-item">DAMAGED</div>
        `;
    }
    else if  (type === 'slab') {
            selection.innerHTML = `
        <div class="psa-comp"><img src="assets/images/psa_logo.png" alt=""></div>
        <div class="beckkett-comp"><img src="assets/images/beckett_logo.jpg" alt=""></div>
        <div class="tag-comp"><img src="assets/images/tag_logo.png" alt=""></div>
        <div class="cgc-comp"><img src="assets/images/cgc_logo.png" alt=""></div>
        `;
}
    else if (type === 'sealed') {
        selection.innerHTML = ``;
}

}

function increaseQty(cardId)
{
    $.post('includes/mycollectr.php', {
        type: 'increase',
        cardId: cardId
    }, function(response) {
        console.log(response);
        getCards();
    });
}

function decreaseQty(cardId, qty)
{
    if(qty > 1)
    {
        $.post('includes/mycollectr.php', {
            type: 'decrease',
            cardId: cardId
        }, function() {
            getCards();
        });

        return;
    }

 Swal.fire({

        title: 'Remove card?',
        text: `This will remove ${cardName} from your collection.`,

        showCancelButton: true,

        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',

        customClass: {

            popup: 'poke-popup',

            title: 'poke-title',

            htmlContainer: 'poke-text',

            confirmButton: 'poke-confirm',

            cancelButton: 'poke-cancel'
        }

    }).then((result) => {

        if(result.isConfirmed)
        {
            $.post('includes/mycollectr.php', {
                type: 'delete',
                cardId: cardId
            }, function() {
                getCards();
            });
        }
    });
}